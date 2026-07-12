// backend/src/utils/hash.js
//
// Thin wrapper around bcrypt so the rest of the app never imports bcrypt
// directly — if the hashing strategy ever changes, this is the only file
// that needs to change.

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

module.exports = { hashPassword, comparePassword };
