const checkAuth =  require('../middleware/check-auth');
const express = require('express');
const router = express.Router();
const txInfoController = require('../controller/txInfoController');

router.get('/api/getTransactionByID/:txId', checkAuth, txInfoController.getTransactionByID);

module.exports = router;
