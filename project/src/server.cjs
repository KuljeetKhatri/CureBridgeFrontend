const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 5001 });

server.on('connection', (socket) => {
  console.log('✅ Client connected');

  socket.on('message', (message) => {
    console.log('🎧 Received audio data:', message.length);

    // TODO: Send this to your Python transcription model via HTTP or another WebSocket
    // For now, simulate a response
    const fakeTranscript = {
      channel: {
        alternatives: [{ transcript: "Simulated transcription" }]
      },
      is_final: true
    };

    socket.send(JSON.stringify(fakeTranscript));
  });

  socket.on('close', () => {
    console.log('🔌 Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

console.log('🟢 WebSocket server listening on ws://localhost:5001');
