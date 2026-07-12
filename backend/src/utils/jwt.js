// backend/src/utils/jwt.js
//
// Issues and verifies JWTs. The token payload only ever carries
// { id, role } — never the password hash or other sensitive fields —
// since the payload is base64-decodable by anyone holding the token.

const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
