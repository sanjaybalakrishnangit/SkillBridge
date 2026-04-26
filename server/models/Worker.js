const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    skill: { type: String, required: [true, 'Skill is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    photo: { type: String, default: '' },
    experience: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Worker', workerSchema);
