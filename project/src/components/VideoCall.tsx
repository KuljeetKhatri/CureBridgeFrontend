// import React, { useState, useRef, useEffect } from "react";
// import io, { Socket } from "socket.io-client";
// import Peer from "simple-peer";

// // Define props for VideoCall component
// interface VideoCallProps {
//   userType: "doctor" | "patient";
// }

// // Initialize WebSocket connection to the backend
// const socket: Socket = io("ws://localhost:8089");

// const VideoCall: React.FC<VideoCallProps> = ({ userType }) => {
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [receivingCall, setReceivingCall] = useState<boolean>(false);
//   const [caller, setCaller] = useState<string>("");
//   const [callAccepted, setCallAccepted] = useState<boolean>(false);
//   const [peer, setPeer] = useState<Peer.Instance | null>(null);

//   const userVideo = useRef<HTMLVideoElement | null>(null);
//   const partnerVideo = useRef<HTMLVideoElement | null>(null);

//   useEffect(() => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((mediaStream) => {
//         setStream(mediaStream);
//         if (userVideo.current) {
//           userVideo.current.srcObject = mediaStream;
//         }
//       })
//       .catch((error) => console.error("Error accessing media devices:", error));

//     socket.on("callUser", (data: { from: string }) => {
//       setReceivingCall(true);
//       setCaller(data.from);
//     });

//     return () => {
//       socket.off("callUser");
//     };
//   }, []);

//   const callUser = (id: string) => {
//     const newPeer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: stream!,
//     });

//     newPeer.on("signal", (data) => {
//       socket.emit("callUser", { userToCall: id, signalData: data, from: socket.id });
//     });

//     newPeer.on("stream", (userStream) => {
//       if (partnerVideo.current) {
//         partnerVideo.current.srcObject = userStream;
//       }
//     });

//     socket.on("callAccepted", (signal) => {
//       newPeer.signal(signal);
//       setCallAccepted(true);
//     });

//     setPeer(newPeer);
//   };

//   const acceptCall = () => {
//     setCallAccepted(true);
//     const newPeer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: stream!,
//     });

//     newPeer.on("signal", (data) => {
//       socket.emit("acceptCall", { signal: data, to: caller });
//     });

//     newPeer.on("stream", (userStream) => {
//       if (partnerVideo.current) {
//         partnerVideo.current.srcObject = userStream;
//       }
//     });

//     socket.on("callAccepted", (signal) => {
//       newPeer.signal(signal);
//     });

//     setPeer(newPeer);
//   };

//   return (
//     <div>
//       <h2>Video Call</h2>
//       <div>
//         <video ref={userVideo} autoPlay playsInline muted style={{ width: "300px" }} />
//         {callAccepted && <video ref={partnerVideo} autoPlay playsInline style={{ width: "300px" }} />}
//       </div>
//       {userType === "doctor" && <button onClick={() => callUser("patient-id")}>Call Patient</button>}
//       {receivingCall && <button onClick={acceptCall}>Accept Call</button>}
//     </div>
//   );
// };

// export default VideoCall;
