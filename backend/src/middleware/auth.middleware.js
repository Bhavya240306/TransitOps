// backend/src/middleware/auth.middleware.js
//
// Protects any route it's attached to. Verifies the Bearer token, then
// attaches the decoded { id, role } to req.user for downstream
// controllers/middleware (like role.middleware.js) to use.
//
// Usage in a route file:
//   router.get('/me', authMiddleware, authController.me);

const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/apiResponse');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'No token provided', 401, 'NO_TOKEN');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
  }
}

module.exports = authMiddleware;
