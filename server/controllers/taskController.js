const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name email')
      .sort('order');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const task = await Task.create({
      projectId: req.params.projectId,
      title,
      description,
      status: status || 'todo',
      assignedTo: assignedTo || null,
    });
    await task.populate('assignedTo', 'name email');
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true })
      .populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
