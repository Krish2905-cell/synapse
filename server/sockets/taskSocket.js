const Task = require('../models/Task');

module.exports = (io, socket) => {
  socket.on('task:update', async ({ projectId, taskId, updates }) => {
    try {
      const task = await Task.findByIdAndUpdate(taskId, updates, { new: true })
        .populate('assignedTo', 'name email');
      io.to(projectId).emit('task:updated', task);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('task:create', async ({ projectId, taskData }) => {
    try {
      const task = await Task.create({ ...taskData, projectId });
      await task.populate('assignedTo', 'name email');
      io.to(projectId).emit('task:created', task);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('task:delete', async ({ projectId, taskId }) => {
    try {
      await Task.findByIdAndDelete(taskId);
      io.to(projectId).emit('task:deleted', { taskId });
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });
};
