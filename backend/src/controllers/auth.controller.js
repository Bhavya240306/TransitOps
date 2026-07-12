// backend/src/controllers/auth.controller.js
//
// Thin layer: parses the request, calls auth.service, shapes the
// response. No business logic here — that all lives in the service.

const authService = require('../services/auth.service');
const { success, error } = require('../utils/apiResponse');

async function signup(req, res, next) {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return error(res, 'email, password, fullName, and role are required', 400, 'MISSING_FIELDS');
    }

    const result = await authService.signup({ email, password, fullName, role });
    return success(res, result, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'email and password are required', 400, 'MISSING_FIELDS');
    }

    const result = await authService.login({ email, password });
    return success(res, result, 200);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return success(res, { user }, 200);
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, me };
