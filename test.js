const { io: socketIOClient } = require("socket.io-client");

// Connexion au serveur websocket
const socket = socketIOClient("http://localhost:3000");

// Événement de connexion
socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

setInterval(() => {
  socket.emit("rabbitMQ", { data: "Test message from RabbitMQ" });
}, 5000);
