import React, { useEffect, useRef, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";

const VideoCallPage: React.FC = () => {
  const callFrameRef = useRef<DailyCall | null>(null);
  const callContainerRef = useRef<HTMLDivElement | null>(null);

  const [myTranscript, setMyTranscript] = useState("");
  const [mergedTranscript, setMergedTranscript] = useState("");
  const [userType, setUserType] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const [extractedSymptoms, setExtractedSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSymptoms, setSessionSymptoms] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [predictedDisease, setPredictedDisease] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const fullTranscript = `${myTranscript} ${mergedTranscript}`.replace(/\s+/g, " ").trim();

  const saveTranscriptToBackend = async () => {
    if (!appointmentId || !userType || !fullTranscript) return;
    try {
      const response = await fetch("http://localhost:8089/api/save-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          userType,
          transcript: fullTranscript,
        }),
      });
      const result = await response.text();
      console.log("Transcript saved:", result);
    } catch (err) {
      console.error("Failed to save transcript:", err);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setAppointmentId(queryParams.get("appointmentId"));
    setUserType(queryParams.get("userType"));
  }, []);

  useEffect(() => {
    if (!callContainerRef.current || callFrameRef.current) return;

    const frame = DailyIframe.createFrame(callContainerRef.current, {
      iframeStyle: {
        position: "relative",
        width: "100%",
        height: "100%",
        border: "0",
        borderRadius: "8px",
      },
      showLeaveButton: true,
    });

    callFrameRef.current = frame;

    frame.join({ url: "https://curebridge.daily.co/consultation123" });

    frame.on("left-meeting", () => {
      saveTranscriptToBackend(); // ✅ Save on leave
      window.location.href = "/";
    });

    if (userType === "doctor") {
      frame.on("app-message", (event) => {
        if (event?.data?.transcript) {
          setMergedTranscript((prev) => `${prev} ${event.data.transcript}`.trim());
        }
      });
    }

    return () => {
      frame.leave().catch(console.error);
      frame.destroy();
      saveTranscriptToBackend(); // ✅ Also save on unmount
    };
  }, [userType]);

  useEffect(() => {
    const startTranscription = async () => {
      try {
        // const socket = new WebSocket("ws://192.168.100.8:5001");
        const socket = new WebSocket("ws://172.20.10.2:5001");
        wsRef.current = socket;

        socket.onopen = async () => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioContext;

          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);
            const downsampled = downsampleBuffer(input, audioContext.sampleRate, 16000);
            if (socket.readyState === WebSocket.OPEN && downsampled) {
              socket.send(downsampled);
            }
          };

          source.connect(processor);
          processor.connect(audioContext.destination);
        };

        socket.onmessage = async (event) => {
          const rawText = await event.data.text();
          const data = JSON.parse(rawText);
          const transcriptText = data?.channel?.alternatives?.[0]?.transcript;
          const isFinal = data?.is_final;

          if (transcriptText && isFinal && transcriptText.trim() !== "") {
            setMyTranscript((prev) => `${prev} ${transcriptText}`.trim());

            if (userType === "patient" && callFrameRef.current) {
              callFrameRef.current.sendAppMessage({ transcript: transcriptText }, "*");
            }
          }
        };

        socket.onerror = (err) => console.error("WebSocket error:", err);
        socket.onclose = () => console.log("WebSocket closed");
      } catch (err) {
        console.error("Transcription setup failed:", err);
      }
    };

    startTranscription();

    return () => {
      wsRef.current?.close();
      processorRef.current?.disconnect();
      audioContextRef.current?.close();
    };
  }, [userType]);

  useEffect(() => {
    if (!fullTranscript || userType !== "doctor") return;
    const timeout = setTimeout(() => {
      extractSymptoms(fullTranscript);
    }, 30000);
    return () => clearTimeout(timeout);
  }, [fullTranscript]);

  const extractSymptoms = async (text: string) => {
    try {
      const response = await fetch("http://localhost:8089/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flag: "EX", text }),
      });
      const result = await response.json();
      setExtractedSymptoms(result.symptoms || []);
    } catch (err) {
      console.error("EX error", err);
    }
  };

  const startSession = async () => {
    try {
      const response = await fetch("http://localhost:8089/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flag: "SP", symptoms: selectedSymptoms }),
      });
      const result = await response.json();
      setSessionId(result.session_id);
      setSessionSymptoms(result.matching_symptoms || []);
    } catch (err) {
      console.error("SP error", err);
    }
  };

  const sendDPAction = async (action: string) => {
    if (!sessionId) return;
    try {
      const payload: any = { flag: "DP", action };
      if (["no", "-1", "add"].includes(action)) {
        payload.symptoms = sessionSymptoms;
        payload.selected_indices = selectedIndices;
      }
      const response = await fetch("http://localhost:8089/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        
      });
      const result = await response.json();
      if (result?.disease) setPredictedDisease(result.disease);
      else if (result?.common_symptoms || result?.new_symptoms) {
        setSessionSymptoms(result.common_symptoms || result.new_symptoms);
        setSelectedIndices([]);
      }
      if(action === 'no'){
        saveTranscriptToBackend(); 
      }
    } catch (err) {
      console.error("DP error", err);
    }
  };

  const toggleSymptom = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const downsampleBuffer = (buffer: Float32Array, inputRate: number, outputRate: number): ArrayBuffer | undefined => {
    if (inputRate === outputRate) return convertFloat32ToInt16(buffer);
    const ratio = inputRate / outputRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Int16Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const sample = buffer[Math.floor(i * ratio)];
      result[i] = Math.max(-32768, Math.min(32767, sample * 32767));
    }
    return result.buffer;
  };

  const convertFloat32ToInt16 = (buffer: Float32Array): ArrayBuffer => {
    const result = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      result[i] = Math.max(-32768, Math.min(32767, buffer[i] * 32767));
    }
    return result.buffer;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-6">
        <div className="w-2/3 max-w-2xl h-[400px] border rounded overflow-hidden relative">
          <div ref={callContainerRef} className="w-full h-full relative z-0" />
        </div>

        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-semibold">Session Symptoms</h3>

          {userType === "doctor" && (
            <>
              {!sessionId && extractedSymptoms.length === 0 && (
                <p className="text-sm text-gray-500">No symptoms extracted from transcript yet.</p>
              )}

              {extractedSymptoms.length > 0 && !sessionId && (
                <div className="space-y-1">
                  {extractedSymptoms.map((sym, idx) => (
                    <label key={idx} className="block text-sm">
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSymptoms((prev) => [...prev, sym]);
                          else setSelectedSymptoms((prev) => prev.filter((s) => s !== sym));
                        }}
                      />
                      {sym}
                    </label>
                  ))}
                  <button
                    onClick={startSession}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Start Session (SP)
                  </button>
                </div>
              )}

              {sessionId && (
                <>
                  <div className="space-y-1">
                    {sessionSymptoms.map((sym, idx) => (
                      <label key={idx} className="block text-sm">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedIndices.includes(idx)}
                          onChange={() => toggleSymptom(idx)}
                        />
                        {sym}
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 space-x-2">
                    <button
                      onClick={() => sendDPAction("-1")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => sendDPAction("add")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => sendDPAction("no")}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                    >
                      Predict Disease
                    </button>
                  </div>
                </>
              )}

              {predictedDisease && (
                <div className="bg-green-100 text-green-800 p-4 mt-4 rounded shadow">
                  <h4 className="font-bold mb-2">Predicted Disease</h4>
                  <p>{predictedDisease}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-white shadow rounded border">
        <h3 className="text-lg font-semibold mb-1">Live Transcript</h3>
        <p className="whitespace-pre-wrap text-sm text-gray-700">{fullTranscript}</p>
      </div>
    </div>
  );
};

export default VideoCallPage;
