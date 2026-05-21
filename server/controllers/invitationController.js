const Invitation = require('../models/Invitation');
const Project = require('../models/Project');
const User = require('../models/User');

exports.sendInvitation = async (req, res) => {
  try {
    const { projectId, receiverEmail } = req.body;
    if (!projectId || !receiverEmail)
      return res.status(400).json({ message: 'projectId and receiverEmail required' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id))
      return res.status(403).json({ message: 'Only owner can invite' });

    if (receiverEmail === req.user.email)
      return res.status(400).json({ message: 'Cannot invite yourself' });

    const existing = await Invitation.findOne({ projectId, receiverEmail, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Invitation already sent' });

    // Check if user is already a member
    const receiver = await User.findOne({ email: receiverEmail });
    if (receiver && project.members.some((m) => m.equals(receiver._id)))
      return res.status(400).json({ message: 'User is already a member' });

    const invitation = await Invitation.create({
      projectId,
      senderId: req.user._id,
      receiverEmail,
    });

    // TODO: Send email notification here
    await invitation.populate('projectId', 'name');
    await invitation.populate('senderId', 'name email');

    res.status(201).json(invitation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      receiverEmail: req.user.email,
      status: 'pending',
    })
      .populate('projectId', 'name color')
      .populate('senderId', 'name email');
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
    if (invitation.receiverEmail !== req.user.email)
      return res.status(403).json({ message: 'Not your invitation' });

    invitation.status = status;
    await invitation.save();

    if (status === 'accepted') {
      await Project.findByIdAndUpdate(invitation.projectId, {
        $addToSet: { members: req.user._id },
      });
    }

    res.json(invitation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
