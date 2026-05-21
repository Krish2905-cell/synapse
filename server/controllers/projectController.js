const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate('owner', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });

    const project = await Project.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [],
    });
    await project.populate('owner', 'name email');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { name, description, color },
      { new: true }
    ).populate('owner', 'name email').populate('members', 'name email');
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
