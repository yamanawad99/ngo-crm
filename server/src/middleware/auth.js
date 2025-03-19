const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens
 * Verifies the token from the request header and attaches the user data to the request
 */
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

/**
 * Middleware to check if user has admin role
 * Must be used after the auth middleware
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Admin privileges required' });
  }
};

/**
 * Middleware to check if user has PR Officer role
 * Must be used after the auth middleware
 */
const isPROfficer = (req, res, next) => {
  if (req.user && (req.user.role === 'PR Officer' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. PR Officer privileges required' });
  }
};

/**
 * Middleware to check if user has Project Manager role
 * Must be used after the auth middleware
 */
const isProjectManager = (req, res, next) => {
  if (req.user && (req.user.role === 'Project Manager' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Project Manager privileges required' });
  }
};

/**
 * Generic authorization middleware
 * Checks if the user has any of the specified roles
 * @param {Array} roles - Array of roles allowed to access the route
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'No user found, authorization denied' });
    }

    const userRole = req.user.role.toLowerCase();
    if (roles.length && !roles.includes(userRole)) {
      return res.status(403).json({ 
        msg: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

module.exports = { auth, isAdmin, isPROfficer, isProjectManager, authorize };


