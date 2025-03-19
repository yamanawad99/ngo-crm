const Project = require('../models/Project');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Private
 */
exports.getProjects = async (req, res) => {
  try {
    const query = {};
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by budget range if provided
    if (req.query.minBudget || req.query.maxBudget) {
      query.budget = {};
      if (req.query.minBudget) query.budget.$gte = Number(req.query.minBudget);
      if (req.query.maxBudget) query.budget.$lte = Number(req.query.maxBudget);
    }
    
    // Filter by date range if provided
    if (req.query.startDate || req.query.endDate) {
      if (req.query.startDate) {
        query.startDate = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query.endDate = { $lte: new Date(req.query.endDate) };
      }
    }
    
    // Text search if provided
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by manager if provided
    if (req.query.manager) {
      query.manager = req.query.manager;
    }

    // Filter by donor if provided
    if (req.query.donor) {
      query.donors = req.query.donor;
    }
    
    // Setup pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Setup sorting
    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy.split(':')[0];
      const sortOrder = req.query.sortBy.split(':')[1] === 'desc' ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort = { createdAt: -1 }; // Default sort by created date descending
    }
    
    const projects = await Project.find(query)
      .populate('manager', 'name email')
      .populate('donors', 'name type contactPerson')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Project.countDocuments(query);
    
    res.json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: projects
    });
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', 'name email')
      .populate('donors', 'name type contactPerson');
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, data: project });
  } catch (err) {
    console.error('Error fetching project:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin/Project Manager)
 */
exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      name,
      status,
      budget,
      startDate,
      endDate,
      description,
      manager,
      donors
    } = req.body;

    // Create new project
    const project = new Project({
      name,
      status,
      budget,
      startDate,
      endDate,
      description,
      manager,
      donors
    });

    await project.save();
    
    // Populate the saved project with related data
    const populatedProject = await Project.findById(project._id)
      .populate('manager', 'name email')
      .populate('donors', 'name type contactPerson');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populatedProject
    });
  } catch (err) {
    console.error('Error creating project:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin/Project Manager)
 */
exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      name,
      status,
      budget,
      startDate,
      endDate,
      description,
      manager,
      donors
    } = req.body;

    // Build project update object
    const projectFields = {};
    if (name) projectFields.name = name;
    if (status) projectFields.status = status;
    if (budget) projectFields.budget = budget;
    if (startDate) projectFields.startDate = startDate;
    if (endDate) projectFields.endDate = endDate;
    if (description) projectFields.description = description;
    if (manager) projectFields.manager = manager;
    if (donors) projectFields.donors = donors;

    // Check if project exists
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Update project and return the updated document
    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true }
    )
      .populate('manager', 'name email')
      .populate('donors', 'name type contactPerson');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (err) {
    console.error('Error updating project:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin only)
 */
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({
      success: true,
      message: 'Project removed successfully',
      data: {}
    });
  } catch (err) {
    console.error('Error deleting project:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

