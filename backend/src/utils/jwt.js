// src/utils/jwt.js
const jwt = require('jsonwebtoken');

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

function signAccess(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email, roles: (user.Roles || []).map(r => r.name) },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: ACCESS_TTL }
  );
}

function signRefresh(user) {
  return jwt.sign(
    { sub: String(user.id) },
    process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    { expiresIn: REFRESH_TTL }
  );
}

function verifyAccess(token) {
  return jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
}
function verifyRefresh(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret');
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
