const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io, socket) => {
  socket.on('chat:send', async ({ projectId, content, userId }) => {
    try {
      const message = await Message.create({ projectId, senderId: userId, content });
      await message.populate('senderId', 'name email');
      io.to(projectId).emit('chat:message', message);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });
};
