// Importer le module websocket
const { send } = require("../producer/producer");
const { startServer, io } = require("./server");

// Démarrer le serveur sur le port 3000
startServer(3000);

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.emit("hello", "world");

  // Écouter l'événement rabbitMQ sur l'objet socket
  socket.on("rabbitMQ", (data) => {
    console.log("RabbitMQ event received : ", data);

    socket.emit("comeback");
  });

  socket.on("calculateResults", (data) => {
    send(data.data);
  });

  socket.on("resultValue", (data) => {
    console.log("Calculation result received:", data);
    // Forward the result to all connected clients
    io.emit("resultValue", data);
  });

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});
