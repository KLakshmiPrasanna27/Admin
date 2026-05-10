const Project = require('../models/Project');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, endDate } = req.body;

    const project = new Project({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id],
      endDate
    });

    await project.save();
    await project.populate(['admin', 'members']);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { admin: req.user.id },
        { members: req.user.id }
      ]
    }).populate(['admin', 'members']);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate(['admin', 'members']);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is admin or member
    if (project.admin._id.toString() !== req.user.id && !project.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only admin can update project
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate(['admin', 'members']);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only admin can delete project
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMemberToProject = async (req, res) => {
  try {
    const { memberId } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only admin can add members
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to add members' });
    }

    // Check if member already exists
    if (project.members.some((member) => member.toString() === memberId)) {
      return res.status(400).json({ success: false, message: 'Member already added to project' });
    }

    project.members.push(memberId);
    await project.save();
    await project.populate(['admin', 'members']);

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeMemberFromProject = async (req, res) => {
  try {
    const { memberId } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only admin can remove members
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove members' });
    }

    project.members = project.members.filter(m => m.toString() !== memberId);
    await project.save();
    await project.populate(['admin', 'members']);

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
