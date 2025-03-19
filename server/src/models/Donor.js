const mongoose = require('mongoose');

// Define the Donor schema
const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please add a donor type'],
    enum: ['جمعية دولية', 'شركة خاصة', 'مؤسسة حكومية', 'فرد', 'أخرى'],
    trim: true
  },
  sector: {
    type: [String],
    required: [true, 'Please add at least one sector'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one sector must be specified'
    }
  },
  country: {
    type: String,
    required: [true, 'Please add a country'],
    trim: true
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget amount']
  },
  contactPerson: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create index for common search fields
donorSchema.index({ name: 'text', type: 1, country: 1 });

module.exports = mongoose.model('Donor', donorSchema);

