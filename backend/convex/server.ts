// import { SerializedTextInput, TextInput } from './textInput';
// import { WebSocket } from 'ws';
// const wss = new WebSocket('ws://localhost:8080');

// wss.addEventListener('open', async () => {
//     console.log('WebSocket connection established');

//     try {
//         // Send the textInput to Convex
//         const result = await convex.mutation("saveTextInput", textInput.serialize());
//         console.log('TextInput saved to Convex with ID:', result);

//         // Send a success response back to the client
//         wss.send(JSON.stringify({ success: true, id: result }));
//     } catch (error) {
//         console.error('Error saving to Convex:', error);

//         // Send an error response back to the client
//         wss.send(JSON.stringify({ success: false, error: 'Failed to save to Convex' }));
//     }
// });

// wss.addEventListener('message', (event) => {
//     const data = JSON.parse(event.data);
//     console.log('Data received \n %o', JSON.stringify(data));

//     // Convert the data into an instance of the TextInput class
//     const textInput = new TextInput(data as SerializedTextInput);

// });

// wss.addEventListener('close', () => {
//     console.log('WebSocket connection closed');
// });

// console.log('Listening on ws://localhost:8080');
// import { WebSocketServer } from "ws";
// import { SerializedTextInput, TextInput } from './textInput';

// const wss = new WebSocketServer({ port: 8080 });

// wss.on('listening', () => {
//     console.log('WebSocket server listening on port 8080');
// });

// wss.on('connection', function connection(ws) {
//     console.log('New client connected');
//     ws.on('message', (data) => {
//         try {
//             const deserializedData = JSON.parse(data.toString());
//             console.log('Data received:', JSON.stringify(deserializedData));
//             const textInput = new TextInput(deserializedData as SerializedTextInput);
//         } catch (error) {
//             console.error('Error processing message:', error);
//         }
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// wss.on('error', (error) => {
//     console.error('WebSocket server error:', error);
// });


// import express from "express";
// import socket from "socket.io";

// import { SerializedTextInput, TextInput } from './textInput';
// const TextInput = require("./textInput");

// import { createRequire } from 'module';
const express = require("express");
const socket = require("socket.io");
import { TextInput, createTextInput } from './textInput';
const { SerializedTextInput } = require("./textInput");

const PORT = 8080;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

app.use(express.static("public"));

const io = socket(server);

io.on("connection", function (socket) {
  console.log("Made socket connection");
  
  socket.on("message", function (data) {
      try {
        // check if data is of json format 
        if (typeof data == 'object') {
          console.log("Data received:", JSON.stringify(data["Json"]));  
          const deserializedData: SerializedTextInput[] = JSON.parse(data["Json"]);
          deserializedData.forEach(item => {
            // const serializedTextInput : SerializedTextInput = new TextInput(item as SerializedTextInput);
            createTextInput(item);
            console.log("Text input data received:", JSON.stringify(serializedTextInput));
          });
        }
        else if (typeof data == 'string') {
            console.log("Data received:", data);
        }

      } catch (error) {
          console.error("Error processing message:", error);
      }
  });
});
