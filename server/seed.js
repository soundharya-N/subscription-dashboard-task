const mongoose = require('mongoose');
const Plan = require('./models/Plan');
require('dotenv').config();

const connectDB = require('./config/db');

const samplePlans = [
  {
    name: 'Basic Plan',
    price: 9.99,
    features: ['Access to basic features', 'Email support', '5GB storage'],
    duration: 30, // 30 days
  },
  {
    name: 'Pro Plan',
    price: 19.99,
    features: ['All Basic features', 'Priority support', '50GB storage', 'Advanced analytics'],
    duration: 30, // 30 days
  },
  {
    name: 'Enterprise Plan',
    price: 49.99,
    features: ['All Pro features', 'Dedicated support', 'Unlimited storage', 'Custom integrations', 'White-label options'],
    duration: 30, // 30 days
  },
];

const seedPlans = async () => {
  try {
    await connectDB("mongodb://localhost:27017/subscription_dashboard");

    // Clear existing plans
    await Plan.deleteMany({});

    // Insert sample plans
    await Plan.insertMany(samplePlans);

    console.log('Sample plans seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
};

seedPlans();