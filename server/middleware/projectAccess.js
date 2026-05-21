const Project = require('../models/Project');

const requireMember = async (req, res, next) => {
  const project = await Project.findById(req.params.projectId || req.body.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const isMember =
    project.owner.equals(req.user._id) ||
    project.members.some((m) => m.equals(req.user._id));

  if (!isMember) return res.status(403).json({ message: 'Access denied' });
  req.project = project;
  next();
};

const requireOwner = async (req, res, next) => {
  const project = await Project.findById(req.params.projectId || req.body.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (!project.owner.equals(req.user._id))
    return res.status(403).json({ message: 'Owner only' });
  req.project = project;
  next();
};

module.exports = { requireMember, requireOwner };
