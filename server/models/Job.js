const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    skill: { type: String, required: [true, 'Skill category is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    workingHours: { type: String, required: [true, 'Working hours are required'] },
    paymentType: {
      type: String,
      enum: { values: ['money', 'food', 'both'], message: 'PaymentType must be money, food, or both' },
      required: [true, 'Payment type is required'],
    },
    imageUrl: { type: String, default: '' },
    phone: { type: String, required: [true, 'Phone is required'] },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
