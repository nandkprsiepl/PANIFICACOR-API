const poService = require('../service/poService');

async function createPO(req, res, next) {
	try {
		let response  =  await poService.createPO(req.body,req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function updatePO(req, res, next) {
	try {
		let response  =  await poService.updatePO(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function acceptPO(req, res, next) {
	try {
		let response  =  await poService.acceptPO(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function rejectPO(req, res, next) {
	try {
		let response  =  await poService.rejectPO(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryPOHistory(req, res, next) {
	try {
		let response  =  await poService.queryPOHistory(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryPOByNumber(req, res, next) {
	try {
		let response  =  await poService.queryPOByNumber(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryPOBySTATUS(req, res, next) {
	try {
		let response  =  await poService.queryPOBySTATUS(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryPOByProductID(req, res, next) {
	try {
		let response  =  await poService.queryPOByProductID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryPOByOrgID(req, res, next) {
	try {
		let response  =  await poService.queryPOByOrgID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryPOByRefPOID(req, res, next) {
	try {
		let response  =  await poService.queryPOByRefPOID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}


module.exports = {
	createPO,
	updatePO,
    acceptPO,
    rejectPO,
    queryPOHistory,
    queryPOByNumber,
    queryPOBySTATUS,
    queryPOByProductID,
	queryPOByOrgID,
	queryPOByRefPOID
};