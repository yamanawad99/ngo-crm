const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const donorController = require('../controllers/donorController');

// @route   GET api/donors
// @desc    Get all donors
// @access  Private
router.get('/', auth, donorController.getDonors);

// @route   GET api/donors/:id
// @desc    Get donor by ID
// @access  Private
router.get('/:id', auth, donorController.getDonorById);

// @route   POST api/donors
// @desc    Create a donor
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('type', 'Donor type is required').not().isEmpty(),
      check('sector', 'At least one sector is required').isArray({ min: 1 }),
      check('country', 'Country is required').not().isEmpty(),
      check('budget', 'Budget amount is required').isNumeric(),
      check('contactPerson', 'Contact person information is required').optional(),
      check('notes', 'Notes must be a string').optional().isString(),
    ],
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  donorController.createDonor
);

// @route   PUT api/donors/:id
// @desc    Update a donor
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Name is required').optional().not().isEmpty(),
      check('type', 'Donor type is required').optional().not().isEmpty(),
      check('sector', 'At least one sector is required').optional().isArray({ min: 1 }),
      check('country', 'Country is required').optional().not().isEmpty(),
      check('budget', 'Budget amount is required').optional().isNumeric(),
      check('contactPerson', 'Contact person information is required').optional(),
      check('notes', 'Notes must be a string').optional().isString(),
    ],
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  donorController.updateDonor
);

// @route   DELETE api/donors/:id
// @desc    Delete a donor
// @access  Private
router.delete('/:id', auth, donorController.deleteDonor);

module.exports = router;

