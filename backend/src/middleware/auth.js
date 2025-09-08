const { verifyAccess } = require('../utils/jwt');
const { User, Role } = require('../models');

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = verifyAccess(token);
    const user = await User.findByPk(payload.sub, { include: Role });
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

function requireRole(roles = []) {
  return (req, res, next) => {
    if (!roles.length) return next();
    const userRoles = (req.user?.Roles || []).map(r => r.name);
    const ok = roles.some(r => userRoles.includes(r));
    if (!ok) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { requireAuth, requireRole };
