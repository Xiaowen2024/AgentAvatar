// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import { SerializedTextInput, TextInput } from './textInput';
// import { testVision } from './tests/testVision'; // Adjusted import

// const PORT = 8080;
// const app = express();
// const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "*", // Be more specific in production
//     methods: ["GET", "POST"]
//   }
// });

// httpServer.listen(PORT, function () {
//   console.log(`Listening on port ${PORT}`);
//   console.log(`http://localhost:${PORT}`);
// });

// app.use(express.static("public"));

// // Socket.IO logic goes here
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Attach the 'image_url' event listener to the socket
//   socket.on('image_url', async (data) => {
//     console.log('Received image_url:', data);
//     try {
//       const result = await testVision(data);
//       socket.emit('vision_result', result);
//     } catch (error) {
//       console.error('Error processing image:', error);
//       socket.emit('vision_error', { message: 'Error processing image' });
//     }
//   });

//   // Disconnect event
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });