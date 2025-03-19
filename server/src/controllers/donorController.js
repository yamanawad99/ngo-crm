const Donor = require('../models/Donor');
const { validationResult } = require('express-validator');

/**
 * @desc    Create a new donor
 * @route   POST /api/donors
 * @access  Private
 */
exports.createDonor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const donor = new Donor(req.body);
    await donor.save();

    res.status(201).json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error('Error creating donor:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Get all donors
 * @route   GET /api/donors
 * @access  Private
 */
exports.getDonors = async (req, res) => {
  try {
    // Build query based on request parameters
    let query = {};
    
    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by country if provided
    if (req.query.country) {
      query.country = req.query.country;
    }
    
    // Filter by sector if provided
    if (req.query.sector) {
      query.sector = { $in: [req.query.sector] };
    }
    
    // Text search if provided
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const donors = await Donor.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    const total = await Donor.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: donors.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: donors
    });
  } catch (error) {
    console.error('Error fetching donors:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Get single donor by ID
 * @route   GET /api/donors/:id
 * @access  Private
 */
exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error('Error fetching donor:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Update donor
 * @route   PUT /api/donors/:id
 * @access  Private
 */
exports.updateDonor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let donor = await Donor.findById(req.params.id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    // Update donor with new data
    donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error('Error updating donor:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        errors: messages
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Delete donor
 * @route   DELETE /api/donors/:id
 * @access  Private
 */
exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    await Donor.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting donor:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

