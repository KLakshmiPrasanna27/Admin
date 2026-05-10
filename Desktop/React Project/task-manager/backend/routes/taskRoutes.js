const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
  addComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', [
  body('title').notEmpty().withMessage('Task title is required'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('assignedTo').notEmpty().withMessage('Assigned to user ID is required'),
  body('dueDate').isISO8601().withMessage('Invalid date format'),
  body('priority').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority')
], createTask);

router.get('/', getTasks);

router.get('/stats/dashboard', getDashboardStats);

router.get('/:id', getTaskById);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);

router.post('/:id/comments', [
  body('text').notEmpty().withMessage('Comment text is required')
], addComment);

module.exports = router;
