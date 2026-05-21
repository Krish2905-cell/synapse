const Whiteboard = require('../models/Whiteboard');

exports.getWhiteboard = async (req, res) => {
  try {
    let board = await Whiteboard.findOne({ projectId: req.params.projectId });
    if (!board) {
      board = await Whiteboard.create({ projectId: req.params.projectId, elements: [] });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveWhiteboard = async (req, res) => {
  try {
    const board = await Whiteboard.findOneAndUpdate(
      { projectId: req.params.projectId },
      { elements: req.body.elements },
      { new: true, upsert: true }
    );
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
