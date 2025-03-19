const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const sponsorshipController = require('../controllers/sponsorshipController');

// @route   GET api/sponsorships
// @desc    Get all sponsorships
// @access  Private
router.get('/', auth, sponsorshipController.getSponsorships);

// @route   GET api/sponsorships/:id
// @desc    Get sponsorship by ID
// @access  Private
router.get('/:id', auth, sponsorshipController.getSponsorshipById);

// @route   POST api/sponsorships
// @desc    Create a new sponsorship
// @access  Private (Admin and PR Officer only)
router.post(
  '/',
  [
    auth,
    authorize(['admin', 'pr_officer']),
    [
      check('donor', 'Donor is required').not().isEmpty(),
      check('project', 'Project is required').not().isEmpty(),
      check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0 }),
      check('startDate', 'Start date is required and must be a valid date').isDate(),
      check('endDate', 'End date must be a valid date if provided').optional().isDate(),
      check('status', 'Status is required').isIn(['active', 'pending', 'completed', 'cancelled']),
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  sponsorshipController.createSponsorship
);

// @route   PUT api/sponsorships/:id
// @desc    Update a sponsorship
// @access  Private (Admin and PR Officer only)
router.put(
  '/:id',
  [
    auth,
    authorize(['admin', 'pr_officer']),
    [
      check('donor', 'Donor must be a valid ID if provided').optional(),
      check('project', 'Project must be a valid ID if provided').optional(),
      check('amount', 'Amount must be a positive number if provided').optional().isFloat({ min: 0 }),
      check('startDate', 'Start date must be a valid date if provided').optional().isDate(),
      check('endDate', 'End date must be a valid date if provided').optional().isDate(),
      check('status', 'Status must be valid if provided').optional().isIn(['active', 'pending', 'completed', 'cancelled']),
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  sponsorshipController.updateSponsorship
);

// @route   DELETE api/sponsorships/:id
// @desc    Delete a sponsorship
// @access  Private (Admin only)
router.delete(
  '/:id',
  [auth, authorize(['admin'])],
  sponsorshipController.deleteSponsorship
);


module.exports = router;

