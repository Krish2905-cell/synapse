const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
  elements: { type: Array, default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Whiteboard', whiteboardSchema);
