const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { auth, authorize } = require('../middleware/auth');
  [
    auth,
    authorize(['admin', 'pr_officer']),
    check('name', 'Name is required').not().isEmpty(),
router.put(
  '/:id',
  [
    auth,
    authorize(['admin', 'pr_officer']),
    check('name', 'Name is required').optional().not().isEmpty(),
router.delete('/:id', [auth, authorize(['admin'])], volunteerController.deleteVolunteer);
