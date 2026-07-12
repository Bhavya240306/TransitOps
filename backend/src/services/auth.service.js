// backend/src/services/auth.service.js
//
// Holds the actual signup/login logic, kept separate from the controller
// so it stays testable and reusable (e.g. the seeder also creates users,
// but goes straight to the model since it needs to bypass the "no
// Fleet Manager signup" rule below).

const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

const SIGNUP_ALLOWED_ROLES = ['DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

async function signup({ email, password, fullName, role }) {
  if (!SIGNUP_ALLOWED_ROLES.includes(role)) {
    const err = new Error('Fleet Manager accounts cannot be self-registered');
    err.statusCode = 403;
    err.code = 'ROLE_NOT_ALLOWED';
    throw err;
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({ email, passwordHash, fullName, role });

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });

  if (!user || !user.isActive) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}

async function getCurrentUser(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }
  return sanitizeUser(user);
}

// Never send passwordHash back to the client, even accidentally.
function sanitizeUser(user) {
  const { id, email, fullName, role, isActive, createdAt } = user;
  return { id, email, fullName, role, isActive, createdAt };
}

module.exports = { signup, login, getCurrentUser };
