const Job = require('../models/Job');
const Worker = require('../models/Worker');
const Notification = require('../models/Notification');
// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a job post
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res, next) => {
  try {
    const { title, description, skill, location, workingHours, paymentType, phone } = req.body;

    if (!title || !description || !skill || !location || !workingHours || !paymentType || !phone) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const job = await Job.create({
      title,
      description,
      skill,
      location,
      workingHours,
      paymentType,
      phone,
      imageUrl,
      postedBy: req.user ? req.user._id : undefined,
    });

    // Notify relevant workers based on skill
    const workers = await Worker.find({ skill, createdBy: { $exists: true, $ne: null } });
    
    // Create notifications for unique employees
    const notifiedUsers = new Set();
    const notificationsToCreate = [];

    for (const worker of workers) {
      const userId = worker.createdBy.toString();
      // Ensure we don't notify the person who posted the job if they happen to be a worker
      if (req.user && userId === req.user._id.toString()) continue;
      
      if (!notifiedUsers.has(userId)) {
        notifiedUsers.add(userId);
        notificationsToCreate.push({
          message: `New job posted in your skill: ${title}`,
          type: 'job_alert',
          user: worker.createdBy,
          data: { jobId: job._id }
        });
      }
    }

    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
    }

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (req.user.role !== 'admin' && (!job.postedBy || job.postedBy.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const { title, description, location, workingHours, paymentType, phone } = req.body;

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (location !== undefined) job.location = location;
    if (workingHours !== undefined) job.workingHours = workingHours;
    if (paymentType !== undefined) job.paymentType = paymentType;
    if (phone !== undefined) job.phone = phone;
    if (req.file) job.imageUrl = `/uploads/${req.file.filename}`;

    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (req.user.role !== 'admin' && (!job.postedBy || job.postedBy.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
