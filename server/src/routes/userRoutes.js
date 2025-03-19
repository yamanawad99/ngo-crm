const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');

/**
 * @route    GET /api/users
 * @desc     Get all users
 * @access   Private (Admin only)
 */
router.get('/', auth, authorize(['Admin']), userController.getAllUsers);

/**
 * @route    GET /api/users/:id
 * @desc     Get user by ID
 * @access   Private (Admin or account owner)
 */
router.get(
  '/:id',
  auth,
  check('id', 'Valid user ID is required').isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Allow admins to access any user, but regular users can only access their own data
    if (req.user.role !== 'Admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized to access this user data' });
    }
    
    next();
  },
  userController.getUserById
);

/**
 * @route    PUT /api/users/:id
 * @desc     Update user
 * @access   Private (Admin or account owner)
 */
router.put(
  '/:id',
  auth,
  [
    check('id', 'Valid user ID is required').isMongoId(),
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('role', 'Invalid role').optional().isIn(['Admin', 'PR Officer', 'Project Manager']),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Allow admins to update any user, but regular users can only update their own data
    // Also, only admins can change roles
    if (req.user.role !== 'Admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized to update this user' });
    }
    
    if (req.user.role !== 'Admin' && req.body.role) {
      return res.status(403).json({ msg: 'Not authorized to change role' });
    }
    
    next();
  },
  userController.updateUser
);

/**
 * @route    DELETE /api/users/:id
 * @desc     Delete user
 * @access   Private (Admin only)
 */
router.delete(
  '/:id',
  auth,
  authorize(['Admin']),
  check('id', 'Valid user ID is required').isMongoId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.deleteUser
);

module.exports = router;

