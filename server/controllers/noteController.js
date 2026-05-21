const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ projectId: req.params.projectId })
      .populate('authorId', 'name email')
      .sort('-updatedAt');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      projectId: req.params.projectId,
      authorId: req.user._id,
      title: req.body.title || 'Untitled Note',
      content: req.body.content || '',
    });
    await note.populate('authorId', 'name email');
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.noteId, req.body, { new: true })
      .populate('authorId', 'name email');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
