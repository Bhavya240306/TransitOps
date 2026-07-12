// backend/src/middleware/role.middleware.js
//
// Restricts a route to specific roles. Must run AFTER auth.middleware,
// since it reads req.user.role that auth.middleware sets.
//
// Usage in a route file (e.g. vehicle.routes.js, owned by Member B):
//   router.post('/', authMiddleware, requireRole('FLEET_MANAGER'), vehicleController.create);

const { error } = require('../utils/apiResponse');

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Not authenticated', 401, 'NOT_AUTHENTICATED');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'You do not have permission to perform this action', 403, 'FORBIDDEN');
    }
    next();
  };
}

module.exports = requireRole;
