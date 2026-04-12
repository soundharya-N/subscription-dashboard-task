const express = require('express');
const { subscribeToPlan, getMySubscription, getAllSubscriptions } = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/subscribe/:planId
// @desc    Subscribe to a plan
// @access  Private
router.post('/subscribe/:planId', subscribeToPlan);

// @route   GET /api/my-subscription
// @desc    Get user's active subscription
// @access  Private
router.get('/my-subscription', getMySubscription);

// @route   GET /api/admin/subscriptions
// @desc    Get all subscriptions (admin only)
// @access  Private/Admin
router.get('/admin/subscriptions', authorize('admin'), getAllSubscriptions);

module.exports = router;