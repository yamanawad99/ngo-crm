const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SponsorshipSchema = new Schema({
  donor: {
    type: Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'cancelled'],
    default: 'pending',
    required: true
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
SponsorshipSchema.index({ donor: 1, project: 1 });
SponsorshipSchema.index({ status: 1 });

module.exports = mongoose.model('Sponsorship', SponsorshipSchema);

