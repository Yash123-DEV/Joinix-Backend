import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import roomRoutes from "./routes/room.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "https://joinix-vecg.onrender.com", credentials: true }));
app.use(cookieParser());

const server = http.createServer(app);

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);


app.get("/", (req : Request, res : Response) => {
  res.send("Hello, World!");
});


const io = new Server(server, {
  cors: {
    origin: "https://joinix-vecg.onrender.com",
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on("connection", (socket) => {
  console.log("New User connected", socket.id);;

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("joinRoom", (roomId) => {
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId);

    // Inform other users joining the room
    socket.to(roomId).emit("user-joined", socket.id);
    
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  socket.on("message", (data) => {
    const { roomId, message } = data;
    io.to(roomId).emit("message", message);
    console.log(`Message sent to room ${roomId}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });

  socket.on("checkPeers", (roomId) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  const numClients = room ? room.size : 0;

  if (numClients > 1) {
    socket.emit("user-joined"); // force trigger for second user
  }
});
})


export default app;