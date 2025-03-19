const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

// @route   GET api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, projectController.getProjects);

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, projectController.getProjectById);

// @route   POST api/projects
// @desc    Create a new project
// @access  Private (Admin, Project Manager)
router.post(
  '/',
  [
    auth,
    authorize(['admin', 'project_manager']),
    [
      check('name', 'Project name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('status', 'Status is required').not().isEmpty(),
      check('budget', 'Budget must be a number').isNumeric(),
      check('startDate', 'Start date is required').not().isEmpty(),
      check('endDate', 'End date is required').not().isEmpty(),
      check('manager', 'Project manager is required').optional().isMongoId(),
      check('donors', 'Donors must be an array of IDs').optional().isArray()
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  projectController.createProject
);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private (Admin, Project Manager)
router.put(
  '/:id',
  [
    auth,
    authorize(['admin', 'project_manager']),
    [
      check('name', 'Project name is required').optional().not().isEmpty(),
      check('budget', 'Budget must be a number').optional().isNumeric(),
      check('status', 'Status is required').optional().not().isEmpty(),
      check('description', 'Description must be a string').optional(),
      check('startDate', 'Start date must be a valid date').optional().isISO8601(),
      check('endDate', 'End date must be a valid date').optional().isISO8601(),
      check('manager', 'Project manager must be a valid ID').optional().isMongoId(),
      check('donors', 'Donors must be an array of IDs').optional().isArray()
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  projectController.updateProject
);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private (Admin only)
router.delete(
  '/:id',
  [auth, authorize(['admin'])],
  projectController.deleteProject
);

module.exports = router;

