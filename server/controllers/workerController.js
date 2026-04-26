const Worker = require('../models/Worker');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all workers (with optional skill/location filter)
// @route   GET /api/workers
// @access  Public
const getWorkers = async (req, res, next) => {
  try {
    const { skill, location } = req.query;
    const filter = {};

    if (skill) filter.skill = { $regex: skill, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };

    if (req.query.isVerified !== undefined) {
      filter.isVerified = req.query.isVerified === 'true';
    } else if (req.query.all !== 'true') {
      filter.isVerified = true; // default public behavior
    }

    const workers = await Worker.find(filter).sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's worker profile
// @route   GET /api/workers/me
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ createdBy: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Profile not found' });
    res.json(worker);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Public
const getWorkerById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a worker
// @route   POST /api/workers
// @access  Private/Admin
const createWorker = async (req, res, next) => {
  try {
    // Only admins or employees can create worker profiles
    if (req.user.role !== 'admin' && req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Only admins or employees can create a worker profile' });
    }

    const { name, skill, location, phone, isAvailable, rating, experience } = req.body;

    if (!name || !skill || !location || !phone) {
      return res.status(400).json({ message: 'Name, skill, location, and phone are required' });
    }

    const photo = req.file ? `/uploads/${req.file.filename}` : '';

    const isVerifiedStatus = req.user.role === 'admin' ? true : false;

    const worker = await Worker.create({
      name,
      skill,
      location,
      phone,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      rating: rating || 0,
      experience: experience || '',
      photo,
      isVerified: isVerifiedStatus,
      createdBy: req.user._id,
    });

    // If employee created it, notify all admins
    if (req.user.role === 'employee') {
      const admins = await User.find({ role: 'admin' });
      const notificationsToCreate = admins.map((admin) => ({
        message: `New worker registration pending approval: ${name}`,
        type: 'worker_request',
        user: admin._id,
        data: { workerId: worker._id }
      }));

      if (notificationsToCreate.length > 0) {
        await Notification.insertMany(notificationsToCreate);
      }
    }

    res.status(201).json(worker);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a worker
// @route   PUT /api/workers/:id
// @access  Private
const updateWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    if (req.user.role !== 'admin' && worker.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { name, skill, location, phone, isAvailable, rating, experience } = req.body;

    if (name !== undefined) worker.name = name;
    if (skill !== undefined) worker.skill = skill;
    if (location !== undefined) worker.location = location;
    if (phone !== undefined) worker.phone = phone;
    if (isAvailable !== undefined) worker.isAvailable = isAvailable === 'true' || isAvailable === true;
    if (rating !== undefined) worker.rating = Number(rating);
    if (experience !== undefined) worker.experience = experience;
    if (req.file) worker.photo = `/uploads/${req.file.filename}`;

    const updated = await worker.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle worker verification
// @route   PATCH /api/workers/:id/verify
// @access  Private/Admin
const toggleVerification = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    worker.isVerified = !worker.isVerified;
    await worker.save();

    res.json({
      message: `Worker ${worker.isVerified ? 'verified' : 'unverified'} successfully`,
      isVerified: worker.isVerified,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a worker
// @route   DELETE /api/workers/:id
// @access  Private/Admin
const deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: 'Worker deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWorkers, getMyProfile, getWorkerById, createWorker, updateWorker, toggleVerification, deleteWorker };
