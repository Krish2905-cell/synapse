const chatSocket = require('./chatSocket');
const taskSocket = require('./taskSocket');
const whiteboardSocket = require('./whiteboardSocket');

const initSockets = (io) => {
  io.on('connection', (socket) => {
    // Join a project room
    socket.on('join:project', (projectId) => {
      socket.join(projectId);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(projectId);
    });

    chatSocket(io, socket);
    taskSocket(io, socket);
    whiteboardSocket(io, socket);
  });
};

module.exports = initSockets;
