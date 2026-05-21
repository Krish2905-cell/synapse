const Whiteboard = require('../models/Whiteboard');

module.exports = (io, socket) => {
  socket.on('whiteboard:draw', ({ projectId, elements }) => {
    // Broadcast to others in the room (not sender)
    socket.to(projectId).emit('whiteboard:update', { elements });
  });

  socket.on('whiteboard:save', async ({ projectId, elements }) => {
    try {
      await Whiteboard.findOneAndUpdate(
        { projectId },
        { elements },
        { upsert: true, new: true }
      );
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });
};
