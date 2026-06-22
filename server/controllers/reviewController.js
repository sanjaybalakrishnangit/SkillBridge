const Review = require('../models/Review');
const Worker = require('../models/Worker');

// @desc    Add review for worker
// @route   POST /api/reviews
// @access  Private (User only)
const addReview = async (req, res, next) => {
  try {
    const { workerId, rating, comment } = req.body;

    // Check user role: only standard users can leave reviews
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only standard users can leave reviews' });
    }

    if (!workerId || !rating || !comment) {
      return res.status(400).json({ message: 'workerId, rating, and comment are required' });
    }

    // Verify worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    // Check if user has already reviewed this worker
    const existingReview = await Review.findOne({ workerId, userId: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this worker' });
    }

    // Create review
    const review = await Review.create({
      workerId,
      userId: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Recalculate average rating
    const reviews = await Review.find({ workerId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    worker.rating = Number(avgRating.toFixed(1));
    await worker.save();

    // Populate user info and return
    const populatedReview = await review.populate('userId', 'name');

    res.status(201).json(populatedReview);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews for a worker
// @route   GET /api/reviews/worker/:workerId
// @access  Public
const getWorkerReviews = async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const reviews = await Review.find({ workerId }).populate('userId', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('workerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const workerId = review.workerId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average rating
    const worker = await Worker.findById(workerId);
    if (worker) {
      const reviews = await Review.find({ workerId });
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      worker.rating = Number(avgRating.toFixed(1));
      await worker.save();
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addReview, getWorkerReviews, getAllReviews, deleteReview };
