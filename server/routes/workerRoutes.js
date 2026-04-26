const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getWorkers,
  getMyProfile,
  getWorkerById,
  createWorker,
  updateWorker,
  toggleVerification,
  deleteWorker,
} = require('../controllers/workerController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Multer config for worker photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `worker-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.get('/', getWorkers);
router.get('/me', protect, getMyProfile);
router.get('/:id', getWorkerById);
router.post('/', protect, upload.single('photo'), createWorker);
router.put('/:id', protect, upload.single('photo'), updateWorker);
router.patch('/:id/verify', protect, adminOnly, toggleVerification);
router.delete('/:id', protect, adminOnly, deleteWorker);

module.exports = router;
