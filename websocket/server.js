const http = require("http");
const { Server } = require("socket.io");

let io;

function startServer(port = 3000) {
  const httpServer = http.createServer();
  io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  httpServer.listen(port, () => {
    console.log(`Socket.IO server listening on port ${port}`);
  });
}

function getIO() {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
}

module.exports = { startServer, getIO };
