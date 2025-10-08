const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketmap = [];

io.on("connection", (socket) => {
  console.log("A User connected ", socket.id);
  const userId = socket.handshake.query.userId;
  userSocketmap[userId] = socket.id;
  io.emit("onlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    console.log("A User disconnected ", socket.id);
    delete userSocketmap[userId];
    io.emit("onlineUsers", Object.keys(userSocketmap));
  });
});

function getSocketOfReceiver(receiverId) {
  return userSocketmap[receiverId];
}

module.exports = { app, io, server, getSocketOfReceiver };
