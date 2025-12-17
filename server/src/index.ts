import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import serverConfig from "./config/serverConfig";
import roomHandler from "./handlers/roomHandler";

// Install peer server using "npm install peer -g"
// and run it using "peerjs --port 9000 --key peerjs --path /myapp"

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    roomHandler(socket); // pass the socket conn to create room and join room

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(serverConfig.PORT, () => {
  console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
});
