const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['worker_request', 'job_alert'], 
      required: true 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isRead: { type: Boolean, default: false },
    data: { type: mongoose.Schema.Types.Mixed }, // to store optional metadata like jobId or workerId
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
