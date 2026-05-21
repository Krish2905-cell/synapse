const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverEmail: { type: String, required: true, lowercase: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Invitation', invitationSchema);
