const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, updateTheme, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.put('/theme', protect, updateTheme);
router.get('/users', protect, authorize('admin'), getAllUsers);

// Get current logged-in user (protected)
router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

module.exports = router;
