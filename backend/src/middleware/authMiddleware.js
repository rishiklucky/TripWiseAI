const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.jwtSecret);

      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        req.user = { _id: decoded.id };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};

// Optional auth: attaches user if token exists, but doesn't block unauthenticated guests
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.jwtSecret);
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        req.user = { _id: decoded.id };
      }
    } catch (error) {
      req.user = null;
    }
  }
  next();
};

module.exports = { protect, optionalProtect };
