const Note = require('../models/Note');

module.exports = (io, socket) => {
  // Relay a newly created note to all other room members
  socket.on('note:create', async ({ projectId, note }) => {
    try {
      console.log('[noteSocket] note:create in project', projectId);
      // Broadcast to everyone else in the room (sender already updated their own state)
      socket.to(projectId).emit('note:created', note);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  // Relay a note update to all other room members
  socket.on('note:update', async ({ projectId, note }) => {
    try {
      console.log('[noteSocket] note:update in project', projectId, 'note', note._id);
      socket.to(projectId).emit('note:updated', note);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  // Relay a note deletion to all other room members
  socket.on('note:delete', async ({ projectId, noteId }) => {
    try {
      console.log('[noteSocket] note:delete in project', projectId, 'note', noteId);
      socket.to(projectId).emit('note:deleted', { noteId });
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });
};
