// Sets up Socket.io namespaces/rooms. Captains join the 'captains' room so SOS
// alerts and strike updates broadcast to them in real time.
function initSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join-captains', () => {
      socket.join('captains');
    });

    socket.on('disconnect', () => {
      // no-op, room membership cleans up automatically
    });
  });
}

module.exports = initSocket;
