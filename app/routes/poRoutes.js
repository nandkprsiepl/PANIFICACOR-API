const checkAuth =  require('../middleware/check-auth');
const express = require('express');
const router = express.Router();
const poController = require('../controller/poController');


router.post('/api/purchaseOrder', checkAuth, poController.createPO);
router.put('/api/purchaseOrder', checkAuth, poController.updatePO);
router.post('/api/acceptPO', checkAuth, poController.acceptPO);
router.post('/api/rejectPO', checkAuth, poController.rejectPO);
router.get('/api/getPOHistory/:poNumber', checkAuth, poController.queryPOHistory);
router.get('/api/getPOByNumber/:poNumber', checkAuth, poController.queryPOByNumber);
router.get('/api/getPOByStatus/:status', checkAuth, poController.queryPOBySTATUS);
router.get('/api/getPOByProductID/:productID', checkAuth, poController.queryPOByProductID);
router.get('/api/getPOByOrgID/:orgID', checkAuth, poController.queryPOByOrgID);
router.get('/api/getPOByRefPOID/:poID', checkAuth, poController.queryPOByRefPOID);

module.exports = router;

