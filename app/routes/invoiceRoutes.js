const checkAuth =  require('../middleware/check-auth');
const express = require('express');
const router = express.Router();
const invoiceController = require('../controller/invoiceController');


router.post('/api/dispatchNote', checkAuth, invoiceController.createInvoice);
router.put('/api/dispatchNote', checkAuth, invoiceController.updateInvoiceComments);
router.get('/api/dispatchNote/:Id', checkAuth, invoiceController.queryInvoiceByID);
router.post('/api/acceptDispatchNote', checkAuth, invoiceController.acceptInvoice);
router.post('/api/rejectDispatchNote', checkAuth, invoiceController.rejectInvoice);
router.get('/api/getDispatchNoteHistory/:invoiceID', checkAuth, invoiceController.queryInvoiceHistory);
router.get('/api/getDispatchNotebyNumber/:invoiceNumber', checkAuth, invoiceController.queryInvoiceByNumber);
router.get('/api/getDispatchNoteByStatus/:status', checkAuth, invoiceController.queryInvoiceBySTATUS);
router.get('/api/getDispatchNoteByOrgID/:orgID', checkAuth, invoiceController.queryInvoiceByOrgID);
router.post('/api/shipDispatchNote', checkAuth, invoiceController.shipInvoice);

router.get('/api/getInvoiceByPONumber/:poNumber', checkAuth, invoiceController.queryInvoiceByPONumber);
router.get('/api/getInvoiceByPOID/:poID', checkAuth, invoiceController.queryInvoiceByPOID);
router.post('/api/recallDispatchNote', checkAuth, invoiceController.recallInvoice);

module.exports = router;
