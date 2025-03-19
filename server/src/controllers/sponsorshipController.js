const Sponsorship = require('../models/Sponsorship');
const { validationResult } = require('express-validator');

// @desc    Get all sponsorships
// @route   GET /api/sponsorships
// @access  Private
exports.getSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find()
      .populate('donor', 'name type')
      .populate('project', 'name status');
    
    res.json(sponsorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get sponsorship by ID
// @route   GET /api/sponsorships/:id
// @access  Private
exports.getSponsorshipById = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id)
      .populate('donor', 'name type contactPerson')
      .populate('project', 'name status description');
    
    if (!sponsorship) {
      return res.status(404).json({ msg: 'Sponsorship not found' });
    }
    
    res.json(sponsorship);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sponsorship not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a sponsorship
// @route   POST /api/sponsorships
// @access  Private
exports.createSponsorship = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { donor, project, amount, startDate, endDate, status } = req.body;

  try {
    const newSponsorship = new Sponsorship({
      donor,
      project,
      amount,
      startDate,
      endDate,
      status
    });

    const sponsorship = await newSponsorship.save();
    res.json(sponsorship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a sponsorship
// @route   PUT /api/sponsorships/:id
// @access  Private
exports.updateSponsorship = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { donor, project, amount, startDate, endDate, status } = req.body;

  // Build sponsorship object
  const sponsorshipFields = {};
  if (donor) sponsorshipFields.donor = donor;
  if (project) sponsorshipFields.project = project;
  if (amount) sponsorshipFields.amount = amount;
  if (startDate) sponsorshipFields.startDate = startDate;
  if (endDate) sponsorshipFields.endDate = endDate;
  if (status) sponsorshipFields.status = status;

  try {
    let sponsorship = await Sponsorship.findById(req.params.id);

    if (!sponsorship) {
      return res.status(404).json({ msg: 'Sponsorship not found' });
    }

    // Update
    sponsorship = await Sponsorship.findByIdAndUpdate(
      req.params.id,
      { $set: sponsorshipFields },
      { new: true }
    ).populate('donor', 'name').populate('project', 'name');

    res.json(sponsorship);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sponsorship not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a sponsorship
// @route   DELETE /api/sponsorships/:id
// @access  Private
exports.deleteSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);

    if (!sponsorship) {
      return res.status(404).json({ msg: 'Sponsorship not found' });
    }

    await Sponsorship.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Sponsorship removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sponsorship not found' });
    }
    res.status(500).send('Server Error');
  }
};

