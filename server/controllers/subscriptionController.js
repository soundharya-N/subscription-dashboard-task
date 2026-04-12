const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

// @desc    Subscribe to a plan
// @route   POST /api/subscribe/:planId
// @access  Private (authenticated users only)
const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user._id;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      user: userId,
      status: 'active',
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription. Please cancel it first.',
      });
    }

    // Calculate end date based on plan duration
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create new subscription
    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      startDate,
      endDate,
    });

    // Populate plan details
    await subscription.populate('plan');

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to plan',
      data: subscription,
    });
  } catch (error) {
    console.error('Error subscribing to plan:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while subscribing to plan',
    });
  }
};

// @desc    Get user's active subscription
// @route   GET /api/my-subscription
// @access  Private (authenticated users only)
const getMySubscription = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscription = await Subscription.findOne({
      user: userId,
      status: 'active',
    }).populate('plan');

    if (!subscription) {
      return res.status(200).json({
        success: true,
        message: 'No active subscription found',
        data: null,
      });
    }

    // Check if subscription has expired
    const now = new Date();
    if (subscription.endDate < now) {
      // Mark as expired if expired
      subscription.status = 'expired';
      await subscription.save();

      return res.status(200).json({
        success: true,
        message: 'Your subscription has expired',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subscription',
    });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('plan')
      .populate('user', 'name email role');

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subscriptions',
    });
  }
};

module.exports = {
  subscribeToPlan,
  getMySubscription,
  getAllSubscriptions,
};