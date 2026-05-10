const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
  body('endDate').optional().isISO8601().withMessage('Invalid date format')
], createProject);

router.get('/', getProjects);

router.get('/:id', getProjectById);

router.put('/:id', updateProject);

router.delete('/:id', deleteProject);

router.post('/:id/members', [
  body('memberId').notEmpty().withMessage('Member ID is required')
], addMemberToProject);

router.delete('/:id/members', removeMemberFromProject);

module.exports = router;
