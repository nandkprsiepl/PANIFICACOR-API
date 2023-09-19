const invoiceService = require('../service/invoiceService');


async function createInvoice(req, res, next) {
	try {
		if(req.body && req.body.destinationOrgId){
			let response  =  await invoiceService.createInvoice(req.body,req);
			res.status(200);
			res.send(response);
		}
		else{
			res.status(400);
			res.send(response);
		}
		

	} catch (error) {
		next(error);
	}
}

async function updateInvoiceComments(req, res, next) {
	try {
		let response  =  await invoiceService.updateInvoiceComments(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}


async function queryInvoiceByID(req, res, next) {
	try {
		let response  =  await invoiceService.queryInvoiceByID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function acceptInvoice(req, res, next) {
	try {
		let response  =  await invoiceService.acceptInvoice(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function rejectInvoice(req, res, next) {
	try {
		let response  =  await invoiceService.rejectInvoice(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryInvoiceHistory(req, res, next) {
	try {
		let response  =  await invoiceService.queryInvoiceHistory(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryInvoiceByNumber(req, res, next) {
	try {
		let response  =  await invoiceService.queryInvoiceByNumber(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}
async function queryInvoiceBySTATUS(req, res, next) {
	try {
		let response  =  await invoiceService.queryInvoiceBySTATUS(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}
async function queryInvoiceByNumber(req, res, next) {
	try {
		let response  =  await invoiceService.queryInvoiceByNumber(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryInvoiceByOrgID(req, res, next) {
	try {
		let response  =  await invoiceService.queryInvoiceByOrgID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function shipInvoice(req, res, next) {
	try {
		let response  =  await invoiceService.shipInvoice(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryInvoiceByPONumber(req, res, next) {
	try {
		let response  =  await invoiceService.queryInvoiceByPONumber(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function queryInvoiceByPOID(req, res, next) {
	try {
		let response  =  await invoiceService.queryInvoiceByPOID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

async function recallInvoice(req, res, next) {
	try {
		let response  =  await invoiceService.recallInvoice(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

module.exports = {
    createInvoice,
    updateInvoiceComments,
    queryInvoiceByID,
    acceptInvoice,
    rejectInvoice,
    queryInvoiceHistory,
    queryInvoiceByNumber,
    queryInvoiceBySTATUS,
    queryInvoiceByOrgID,
	shipInvoice,
	queryInvoiceByPONumber,
	queryInvoiceByPOID,
	recallInvoice
};