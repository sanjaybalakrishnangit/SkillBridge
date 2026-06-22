const express = require('express');
const router = express.Router();
const {
  addReview,
  getWorkerReviews,
  getAllReviews,
  deleteReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, addReview);
router.get('/worker/:workerId', getWorkerReviews);
router.get('/', protect, adminOnly, getAllReviews);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
