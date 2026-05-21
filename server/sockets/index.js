const chatSocket = require('./chatSocket');
const taskSocket = require('./taskSocket');
const whiteboardSocket = require('./whiteboardSocket');
const noteSocket = require('./noteSocket');

const initSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('[Socket] Connected:', socket.id);

    // ── Room management ──────────────────────────────────────────────────
    socket.on('join:project', (projectId) => {
      socket.join(projectId);
      console.log('[Socket]', socket.id, 'joined project room:', projectId);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(projectId);
      console.log('[Socket]', socket.id, 'left project room:', projectId);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', socket.id, '| reason:', reason);
    });

    // ── Feature handlers ─────────────────────────────────────────────────
    chatSocket(io, socket);
    taskSocket(io, socket);
    whiteboardSocket(io, socket);
    noteSocket(io, socket);
  });
};

module.exports = initSockets;
