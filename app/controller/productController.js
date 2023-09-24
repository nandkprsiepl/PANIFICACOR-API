const productService = require('../service/productService');

async function createProduct(req, res, next) {
	try {
		let response  =  await productService.createProduct(req.body,req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function addProductStock(req, res, next) {
	try {
		let response  =  await productService.addProductStock(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}


async function queryProductByID(req, res, next) {
	try {
		let response  =  await productService.queryProductByID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryAllProducts(req, res, next) {
	try {
		let response  =  await productService.queryAllProducts(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryProductByOrgID(req, res, next) {
	try {
		let response  =  await productService.queryProductByOrgID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryPOQuantityDetails(req, res, next) {
	try {
		let response  =  await productService.queryPOQuantityDetails(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

module.exports = {
    createProduct,
    addProductStock,
    queryProductByID,
    queryAllProducts,
    queryProductByOrgID,
    queryPOQuantityDetails
};