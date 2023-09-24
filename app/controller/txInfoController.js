const txInfoService = require('../service/txInfoService');

async function getTransactionByID(req, res, next) {
	try {
		let response  =  await txInfoService.getTransactionByID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}


module.exports = {
    getTransactionByID
};