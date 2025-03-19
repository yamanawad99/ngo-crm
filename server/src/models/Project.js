const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: ['قيد التنفيذ', 'مكتمل', 'معلق', 'ملغي'],
    default: 'قيد التنفيذ'
  },
  budget: {
    type: Number,
    required: [true, 'Project budget is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Project start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'Project end date is required']
  },
  description: {
    type: String,
    trim: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  donors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor'
  }]
}, {
  timestamps: true
});

// Add text index for name and description for search functionality
ProjectSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);

