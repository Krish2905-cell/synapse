const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
