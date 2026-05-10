const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only project admin can create tasks
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to create tasks in this project' });
    }

    // Check if assignedTo user is a member of the project
    if (!project.members.some((memberId) => memberId.toString() === assignedTo)) {
      return res.status(400).json({ success: false, message: 'Assigned user is not a member of this project' });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: req.user.id,
      priority,
      dueDate
    });

    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy']);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;

    let query = {};

    // Get projects where user is admin or member
    const projects = await Project.find({
      $or: [
        { admin: req.user.id },
        { members: req.user.id }
      ]
    });

    const projectIds = projects.map(p => p._id);
    query.project = { $in: projectIds };

    if (projectId) {
      query.project = projectId;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const tasks = await Task.find(query)
      .populate(['project', 'assignedTo', 'createdBy'])
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate(['project', 'assignedTo', 'createdBy', 'comments.user']);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user has access
    const projectId = typeof task.project === 'object' ? task.project._id : task.project;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id && !project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this task' });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const projectId = typeof task.project === 'object' ? task.project._id : task.project;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is authorized (admin or assigned member)
    const assignedToId = typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo;
    if (project.admin.toString() !== req.user.id && assignedToId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    // If task is being completed, set completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = Date.now();
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate(['project', 'assignedTo', 'createdBy']);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    // Only project admin can delete tasks
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Get all projects where user is admin or member
    const projects = await Project.find({
      $or: [
        { admin: req.user.id },
        { members: req.user.id }
      ]
    });

    const projectIds = projects.map(p => p._id);

    // Get all tasks in those projects
    const tasks = await Task.find({ project: { $in: projectIds } });

    const now = new Date();

    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      overdueTasks: tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < now).length,
      highPriorityTasks: tasks.filter(t => t.priority === 'high' || t.priority === 'critical').length,
      completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.comments.push({
      user: req.user.id,
      text
    });

    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy', 'comments.user']);

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
