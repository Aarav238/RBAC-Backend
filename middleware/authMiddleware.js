const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Role = require('../Models/Role');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Attach user role
    const user = await User.findById(req.user.id).populate('role');
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    req.user.role = user.role.name;

    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
