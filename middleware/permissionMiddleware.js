const User = require('../Models/User');
const Role = require('../Models/Role');

const permissionMiddleware = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate('role');
      if (!user || !user.role) {
        return res.status(403).json({ msg: 'Access denied: role not found' });
      }

      const userPermissions = user.role.permissions;

      const hasPermission = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = permissionMiddleware;
