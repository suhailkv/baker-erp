// src/routes/production.routes.js
const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/production.controller');

router.post('/', requireAuth, requireRole(['ADMIN', 'MANAGER', 'PRODUCTION']), ctrl.create);
router.get('/', requireAuth, requireRole(['ADMIN', 'MANAGER', 'PRODUCTION']), ctrl.list);
router.get('/:id', requireAuth, requireRole(['ADMIN', 'MANAGER', 'PRODUCTION']), ctrl.getById);
router.patch('/:id/status', requireAuth, requireRole(['ADMIN', 'MANAGER', 'PRODUCTION']), ctrl.updateStatus);

module.exports = router;
