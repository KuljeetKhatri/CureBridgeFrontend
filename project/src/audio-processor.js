// Audio processing worklet
class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs) {
      const input = inputs[0];
      if (input && input[0]) {
        // Convert to 16-bit PCM and send to main thread
        const pcmData = this.floatTo16BitPCM(input[0]);
        this.port.postMessage({ audioData: pcmData });
      }
      return true;
    }
  
    floatTo16BitPCM(input) {
      const output = new Int16Array(input.length);
      for (let i = 0; i < input.length; i++) {
        output[i] = Math.max(-32768, Math.min(32767, input[i] * 32767));
      }
      return output.buffer;
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);