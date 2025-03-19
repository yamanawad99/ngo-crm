const Volunteer = require('../models/Volunteer');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all volunteers
 * @route   GET /api/volunteers
 * @access  Private
 */
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate('projects', 'name');
    res.json(volunteers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get volunteer by ID
 * @route   GET /api/volunteers/:id
 * @access  Private
 */
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('projects', 'name');

    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Create a new volunteer
 * @route   POST /api/volunteers
 * @access  Private
 */
exports.createVolunteer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, skills, availability, projects, status } = req.body;

  try {
    const newVolunteer = new Volunteer({
      name,
      email,
      phone,
      skills,
      availability,
      projects,
      status
    });

    const volunteer = await newVolunteer.save();
    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Update a volunteer
 * @route   PUT /api/volunteers/:id
 * @access  Private
 */
exports.updateVolunteer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, skills, availability, projects, status } = req.body;

  // Build volunteer object
  const volunteerFields = {};
  if (name) volunteerFields.name = name;
  if (email) volunteerFields.email = email;
  if (phone) volunteerFields.phone = phone;
  if (skills) volunteerFields.skills = skills;
  if (availability) volunteerFields.availability = availability;
  if (projects) volunteerFields.projects = projects;
  if (status) volunteerFields.status = status;

  try {
    let volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }

    // Update
    volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { $set: volunteerFields },
      { new: true }
    );

    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Delete a volunteer
 * @route   DELETE /api/volunteers/:id
 * @access  Private
 */
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }

    await Volunteer.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Volunteer removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.status(500).send('Server Error');
  }
};

