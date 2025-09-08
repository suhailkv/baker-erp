const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/import.controller');

// Create import
router.post('/', requireAuth, requireRole(['ADMIN', 'MANAGER']), ctrl.create);

// List imports
router.get('/', requireAuth, requireRole(['ADMIN', 'MANAGER']), ctrl.list);

// Update status
router.patch('/:id/status', requireAuth, requireRole(['ADMIN', 'MANAGER']), ctrl.updateStatus);

module.exports = router;
