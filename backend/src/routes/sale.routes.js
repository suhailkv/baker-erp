const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const invoiceController = require('../controllers/invoice.controller');
// CRUD
router.post('/', saleController.create);
router.get('/', saleController.getAll);
router.get('/:id', saleController.getById);
router.put('/:id', saleController.update);
router.delete('/:id', saleController.remove);
router.put('/:id/status', saleController.updateStatus);   // update status
router.get('/:id/invoice', invoiceController.getInvoice); // invoice
// Import/Export
router.post('/bulk-import', saleController.uploadMiddleware, saleController.bulkImport);
router.get('/bulk-export', saleController.bulkExport);

module.exports = router;
