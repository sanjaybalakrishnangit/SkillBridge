const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Multer config for job image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `job-${Date.now()}${ext}`);
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

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, upload.single('image'), createJob);
router.put('/:id', protect, upload.single('image'), updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
