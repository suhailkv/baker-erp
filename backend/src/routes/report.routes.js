const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/report.controller');

// All reports require authentication
router.get('/kpis', requireAuth, requireRole(['ADMIN', 'MANAGER']), ctrl.kpis);
router.get('/sales-trend', requireAuth, requireRole(['ADMIN', 'MANAGER']), ctrl.salesTrend);

module.exports = router;
