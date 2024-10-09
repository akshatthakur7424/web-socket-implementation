// modules imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import WebSocket, { WebSocketServer } from 'ws';

// Libraries Initialization
const app = express();
dotenv.config()

// Environment Variables 
var httpServerPort = process.env.HTTP_SERVER_PORT || 7000;
const frontendDomain = process.env.FRONTEND_DOMAIN;

//                              Handling cross origin resource sharing
app.use(express.json());

let corsData = {
    origin: frontendDomain,
    credentials: true
}
app.use(cors(corsData));

// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', frontendDomain);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});



//                               Assigning server a port and starting it
const httpServer = app.listen(httpServerPort, () => {
    console.log("Server started successfully on port: ", httpServerPort);
});

//                              Web Socket Server

const wss = new WebSocketServer({ server: httpServer }); // upgrading http server to web socker server

// handling web socket server events

wss.on("connection", function connection(ws) {
    // error handling 
    ws.on("error", () => {
        console.log("Error connecting Socket. Error: ", error);
    })

    // handling message coming from frontend socket     
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });

    // message to connected socket
    ws.send("Hello! from web socket server.")
})

