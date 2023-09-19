const checkAuth =  require('../middleware/check-auth');
const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.post('/api/product', checkAuth, productController.createProduct);
router.put('/api/productStock', checkAuth, productController.addProductStock);
router.get('/api/product/:Id', checkAuth, productController.queryProductByID);
router.get('/api/products', checkAuth, productController.queryAllProducts);
router.get('/api/getProductByOrgID/:orgID', checkAuth, productController.queryProductByOrgID);
router.get('/api/poQuantityDetails/:Id', checkAuth, productController.queryPOQuantityDetails);

module.exports = router;


