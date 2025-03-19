const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { auth, authorize } = require('../middleware/auth');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @route   GET /api/volunteers
 * @desc    Get all volunteers
 * @access  Private (Admin, PR Officer)
 */
router.get(
  '/',
  auth,
  authorize(['admin', 'pr_officer']),
  volunteerController.getVolunteers
);

/**
 * @route   GET /api/volunteers/:id
 * @desc    Get volunteer by ID
 * @access  Private (Admin, PR Officer)
 */
router.get(
  '/:id',
  auth,
  authorize(['admin', 'pr_officer']),
  param('id').isMongoId().withMessage('Invalid volunteer ID'),
  validateRequest,
  volunteerController.getVolunteerById
);

/**
 * @route   POST /api/volunteers
 * @desc    Create a new volunteer
 * @access  Private (Admin, PR Officer)
 */
router.post(
  '/',
  auth,
  authorize(['admin', 'pr_officer']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please include a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('skills').notEmpty().withMessage('Skills are required').isArray().withMessage('Skills must be an array'),
    body('availability').notEmpty().withMessage('Availability is required')
      .isIn(['weekdays', 'weekends', 'evenings', 'flexible']).withMessage('Invalid availability option'),
    body('status').optional().isIn(['active', 'inactive', 'pending'])
      .withMessage('Status must be active, inactive, or pending')
  ],
  validateRequest,
  volunteerController.createVolunteer
);

/**
 * @route   PUT /api/volunteers/:id
 * @desc    Update a volunteer
 * @access  Private (Admin, PR Officer)
 */
router.put(
  '/:id',
  auth,
  authorize(['admin', 'pr_officer']),
  [
    param('id').isMongoId().withMessage('Invalid volunteer ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('availability').optional()
      .isIn(['weekdays', 'weekends', 'evenings', 'flexible']).withMessage('Invalid availability option'),
    body('status').optional().isIn(['active', 'inactive', 'pending'])
      .withMessage('Status must be active, inactive, or pending')
  ],
  validateRequest,
  volunteerController.updateVolunteer
);

/**
 * @route   DELETE /api/volunteers/:id
 * @desc    Delete a volunteer
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  param('id').isMongoId().withMessage('Invalid volunteer ID'),
  validateRequest,
  volunteerController.deleteVolunteer
);

module.exports = router;

