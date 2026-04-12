const express = require('express');
const { getPlans, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/plans
// @desc    Get all plans
// @access  Public
router.get('/', getPlans);

// @route   POST /api/plans
// @desc    Create a new plan
// @access  Private/Admin
router.post('/', protect, authorize('admin'), createPlan);

// @route   PUT /api/plans/:id
// @desc    Update a plan
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updatePlan);

// @route   DELETE /api/plans/:id
// @desc    Delete a plan
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deletePlan);

module.exports = router;