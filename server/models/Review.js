const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only review a worker once
reviewSchema.index({ workerId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
