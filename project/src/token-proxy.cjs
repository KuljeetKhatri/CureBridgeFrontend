
// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const cors = require("cors");
// require("dotenv").config({ path: "../.env" });
// const app = express();
// const PORT = 5001;

// app.use(cors());

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// wss.on("connection", (clientSocket) => {
//   console.log("🔌 Client WebSocket connected");

//   let deepgramSocket = null;
//   let retryCount = 0;
//   const maxRetries = 3;
//   const retryDelay = 1000;

//   const connectToDeepgram = () => {
//     if (retryCount >= maxRetries) {
//       console.error(`Max retries (${maxRetries}) reached for Deepgram connection.`);
//       if (clientSocket.readyState === WebSocket.OPEN) {
//         clientSocket.send(JSON.stringify({ error: "Max retries reached for Deepgram connection." }));
//       }
//       return;
//     }

//     deepgramSocket = new WebSocket(
//       "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&punctuate=true",
//       {
//         headers: {
//           Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
//         },
//       }
//     );

//     deepgramSocket.on("open", () => {
//       console.log("🎧 Connected to Deepgram API");
//       retryCount = 0; // Reset retry count on success
//     });

//     deepgramSocket.on("message", (message) => {
//       if (clientSocket.readyState === WebSocket.OPEN) {
//         clientSocket.send(message);
//       }
//     });

//     deepgramSocket.on("error", (err) => {
//       console.error("Deepgram error:", err.message);
//       if (deepgramSocket) {
//         deepgramSocket.close();
//       }
//       retryCount++;
//       setTimeout(connectToDeepgram, retryDelay);
//     });

//     deepgramSocket.on("close", (code, reason) => {
//       console.log(`Deepgram connection closed: ${code} - ${reason}`);
//       if (clientSocket.readyState === WebSocket.OPEN) {
//         clientSocket.send(JSON.stringify({ error: "Deepgram connection lost, retrying..." }));
//       }
//       if (deepgramSocket) {
//         deepgramSocket = null;
//       }
//       retryCount++;
//       setTimeout(connectToDeepgram, retryDelay);
//     });
//   };

//   connectToDeepgram();

//   clientSocket.on("message", (audioChunk) => {
//     if (deepgramSocket && deepgramSocket.readyState === WebSocket.OPEN) {
//       deepgramSocket.send(audioChunk);
//     } else {
//       console.warn("Deepgram socket not open, dropping audio chunk");
//     }
//   });

//   clientSocket.on("close", () => {
//     if (deepgramSocket) {
//       deepgramSocket.close();
//       deepgramSocket = null;
//     }
//     console.log("Client WebSocket closed");
//   });

//   clientSocket.on("error", (err) => {
//     console.error("Client error:", err);
//   });
// });

// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`Proxy WebSocket server running at ws://0.0.0.0:${PORT}`);
// });



// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const cors = require("cors");
// require("dotenv").config({ path: "../.env" });

// const app = express();
// const PORT = 5001;

// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server, clientTracking: true });

// // Connection status tracking
// const connectionStatus = {
//   totalConnections: 0,
//   activeConnections: 0,
//   failedConnections: 0
// };

// // Deepgram connection manager
// const createDeepgramConnection = (clientSocket) => {
//   let deepgramSocket = null;
//   let retryCount = 0;
//   const maxRetries = 5;
//   let retryDelay = 1000;
//   let keepAliveInterval;
//   let lastAudioTime = Date.now();

//   const connect = () => {
//     if (retryCount >= maxRetries) {
//       console.error(`[${clientSocket.id}] Max Deepgram retries reached`);
//       clientSocket.send(JSON.stringify({ 
//         error: "Failed to connect to transcription service" 
//       }));
//       return;
//     }

//     console.log(`[${clientSocket.id}] Connecting to Deepgram (attempt ${retryCount + 1})`);
    
//     deepgramSocket = new WebSocket(
//       "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&punctuate=true",
//       {
//         headers: { 
//           Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
//           "Content-Type": "audio/x-raw",
//           "Accept": "application/json"
//         },
//       }
//     );

//     // Keep-alive mechanism
//     keepAliveInterval = setInterval(() => {
//       if (deepgramSocket?.readyState === WebSocket.OPEN) {
//         // Send empty message if no audio for 3 seconds
//         if (Date.now() - lastAudioTime > 3000) {
//           deepgramSocket.send(new Uint8Array(0));
//         }
//       }
//     }, 2000);

//     deepgramSocket.on("open", () => {
//       console.log(`[${clientSocket.id}] Connected to Deepgram`);
//       retryCount = 0;
//       retryDelay = 1000;
//       lastAudioTime = Date.now();
      
//       // Send initial configuration
//       const initConfig = {
//         type: "Settings",
//         transcription: {
//           punctuate: true,
//           interim_results: false,
//           endpointing: 300,
//           utterance_end_ms: 1000
//         }
//       };
//       deepgramSocket.send(JSON.stringify(initConfig));
      
//       // Notify client
//       clientSocket.send(JSON.stringify({ status: "deepgram_connected" }));
//     });

//     deepgramSocket.on("message", (message) => {
//       if (clientSocket?.readyState === WebSocket.OPEN) {
//         try {
//           clientSocket.send(message.toString());
//         } catch (err) {
//           console.error(`[${clientSocket.id}] Error forwarding message:`, err);
//         }
//       }
//     });

//     deepgramSocket.on("error", (err) => {
//       console.error(`[${clientSocket.id}] Deepgram error:`, err.message);
//       cleanup();
//       scheduleRetry();
//     });

//     deepgramSocket.on("close", (code, reason) => {
//       console.log(`[${clientSocket.id}] Deepgram closed: ${code} - ${reason}`);
//       cleanup();
//       if (code !== 1000) { // Don't retry on normal closure
//         scheduleRetry();
//       }
//     });
//   };

//   const cleanup = () => {
//     if (keepAliveInterval) clearInterval(keepAliveInterval);
//     if (deepgramSocket) {
//       deepgramSocket.removeAllListeners();
//       if (deepgramSocket.readyState === WebSocket.OPEN) {
//         deepgramSocket.close();
//       }
//       deepgramSocket = null;
//     }
//   };

//   const scheduleRetry = () => {
//     retryCount++;
//     retryDelay = Math.min(5000, retryDelay * 2);
//     console.log(`[${clientSocket.id}] Retrying in ${retryDelay}ms (attempt ${retryCount})`);
//     setTimeout(connect, retryDelay);
//   };

//   // Initial connection
//   connect();

//   return {
//     sendAudio: (audioChunk) => {
//       lastAudioTime = Date.now();
//       if (deepgramSocket?.readyState === WebSocket.OPEN) {
//         deepgramSocket.send(audioChunk);
//       } else {
//         console.warn(`[${clientSocket.id}] Deepgram not ready, dropping audio`);
//       }
//     },
//     close: () => {
//       cleanup();
//     }
//   };
// };

// // WebSocket server setup
// wss.on("connection", (clientSocket) => {
//   // Assign unique ID to connection
//   clientSocket.id = `client_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
//   connectionStatus.totalConnections++;
//   connectionStatus.activeConnections++;
  
//   console.log(`[${clientSocket.id}] Client connected`);
//   clientSocket.send(JSON.stringify({ status: "connected" }));

//   // Create Deepgram connection for this client
//   const deepgramManager = createDeepgramConnection(clientSocket);

//   clientSocket.on("message", (message) => {
//     if (message instanceof Buffer) {
//       deepgramManager.sendAudio(message);
//     } else {
//       console.log(`[${clientSocket.id}] Received text message:`, message.toString());
//     }
//   });

//   clientSocket.on("close", () => {
//     console.log(`[${clientSocket.id}] Client disconnected`);
//     connectionStatus.activeConnections--;
//     deepgramManager.close();
//   });

//   clientSocket.on("error", (err) => {
//     console.error(`[${clientSocket.id}] Client error:`, err);
//     connectionStatus.failedConnections++;
//   });
// });

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "healthy",
//     connections: connectionStatus,
//     uptime: process.uptime(),
//     memoryUsage: process.memoryUsage(),
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Server error:", err);
//   res.status(500).json({ error: "Internal server error" });
// });

// // Start server
// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`Proxy WebSocket server running at ws://0.0.0.0:${PORT}`);
// });

// // Graceful shutdown
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received. Closing server...");
  
//   // Close all client connections
//   wss.clients.forEach(client => {
//     client.close(1001, "Server shutting down");
//   });
  
//   server.close(() => {
//     console.log("Server closed");
//     process.exit(0);
//   });
// });

// process.on("SIGINT", () => {
//   console.log("SIGINT received. Closing server...");
//   server.close(() => {
//     process.exit(0);
//   });
// });


const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = 5001;

app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (clientSocket) => {
  console.log('🔌 Client WebSocket connected');

  const deepgramSocket = new WebSocket(
    'wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&punctuate=true',
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    }
  );

  deepgramSocket.on('open', () => {
    console.log('🎧 Connected to Deepgram API');
  });

  deepgramSocket.on('message', (message) => {
    clientSocket.send(message);
  });

  clientSocket.on('message', (audioChunk) => {
    if (deepgramSocket.readyState === WebSocket.OPEN) {
      deepgramSocket.send(audioChunk);
    }
  });

  deepgramSocket.on('close', () => clientSocket.close());
  clientSocket.on('close', () => deepgramSocket.close());

  deepgramSocket.on('error', (err) => console.error('Deepgram error:', err));
  clientSocket.on('error', (err) => console.error('Client error:', err));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy WebSocket server running at ws://0.0.0.0:${PORT}`);
});