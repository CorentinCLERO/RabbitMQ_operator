const { Server } = require("socket.io");

const io = new Server({ cors: "*" });

function startServer(port = 3000) {
  io.listen(port);
  console.log(`Socket.IO server listening on port ${port}`);
  return io;
}

module.exports = { io, startServer };
