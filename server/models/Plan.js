const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required'],
      min: [0, 'Price cannot be negative'],
    },
    features: [{
      type: String,
      required: true,
      trim: true,
    }],
    duration: {
      type: Number,
      required: [true, 'Plan duration is required'],
      min: [1, 'Duration must be at least 1 day'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Plan', planSchema);