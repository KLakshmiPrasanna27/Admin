const express = require('express');
const { body } = require('express-validator');
const { signup, login, getMe, updateProfile, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').isInt({ min: 18, max: 120 }).withMessage('Age must be between 18 and 120')
], signup);

router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.get('/all-users', getAllUsers);

module.exports = router;
