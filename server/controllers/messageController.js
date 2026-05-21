const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId })
      .populate('senderId', 'name email')
      .sort('createdAt')
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });

    const message = await Message.create({
      projectId: req.params.projectId,
      senderId: req.user._id,
      content,
    });
    await message.populate('senderId', 'name email');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
