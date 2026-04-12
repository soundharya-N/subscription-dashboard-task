const Plan = require('../models/Plan');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({}).sort({ price: 1 });
    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching plans',
    });
  }
};

// @desc    Create a new plan
// @route   POST /api/plans
// @access  Private/Admin
const createPlan = async (req, res) => {
  try {
    const { name, description, price, features } = req.body;

    // Validate required fields
    if (!name || !description || !price || !features) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and features',
      });
    }

    // Check if plan with same name already exists
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(409).json({
        success: false,
        message: 'Plan with this name already exists',
      });
    }

    const plan = await Plan.create({ name, description, price, features });

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan,
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating plan',
    });
  }
};

// @desc    Update a plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
const updatePlan = async (req, res) => {
  try {
    const { name, description, price, features } = req.body;

    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { name, description, price, features },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating plan',
    });
  }
};

// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting plan',
    });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};