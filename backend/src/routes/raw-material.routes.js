const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/raw-material.controller');

router.get('/', requireAuth, requireRole(['INVENTORY', 'ADMIN']), ctrl.list);
router.post('/', requireAuth, requireRole(['INVENTORY', 'ADMIN']), ctrl.add);
router.put('/:id', requireAuth, requireRole(['ADMIN', 'MANAGER']), ctrl.update);
router.delete('/:id', requireAuth, requireRole(['ADMIN', 'MANAGER']), ctrl.remove);

const { upload } = require('../utils/fileHandler');

// Bulk import
router.post('/bulk-import', requireAuth, requireRole(['ADMIN', 'MANAGER']), upload.single('file'), ctrl.bulkImport);

// Bulk export
router.get('/bulk-export', requireAuth, requireRole(['ADMIN', 'MANAGER']), ctrl.bulkExport);

module.exports = router;
