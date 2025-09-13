const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' from the start
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Add user to request object - handle different possible token structures
    if (decoded.user) {
      req.user = decoded.user;
    } else if (decoded.userId) {
      req.user = { id: decoded.userId };
    } else if (decoded.id) {
      req.user = { id: decoded.id };
    } else {
      // If we can't find user info, use the whole decoded object
      req.user = decoded;
    }
    
    // Debug log
    console.log('Authenticated user:', req.user);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
