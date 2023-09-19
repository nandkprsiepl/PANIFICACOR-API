const organizationService = require('../service/organizationService');
const fs = require('fs');
let path = require('path');

async function onboardOrganization(req, res, next) {
	try {
		let response  =  await organizationService.onboardOrganization(req.body);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function queryAllOrganizations(req, res, next) {
	try {
		let response  =  await organizationService.queryAllOrganizations(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function getOrganizationById(req, res, next) {
	try {
		let response  =  await organizationService.getOrganizationById(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function queryOrgByOrganizationType(req, res, next) {
	try {
		let response  =  await organizationService.queryOrgByOrganizationType(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function queryOrgByOrganizationName(req, res, next) {
	try {
		let response  =  await organizationService.queryOrgByOrganizationName(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function uploadFile(req, res, next) {
	try {
		let response  =  await organizationService.uploadFile(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function downloadFile(req, res, next) {
	try {
		let response  =  await organizationService.downloadFile(req);
		// //if(response.success){
		// 	let filename = req.query.fileName
		// 	let absPath = path.join(__dirname, '/files/', filename);

		// 	fs.writeFile(absPath, response[0].content.toString(), (err) => {
		// 		if (err) {
		// 		console.log("err1",err);
		// 		}
		// 		res.download(absPath, (err) => {
		// 		if (err) {
		// 			console.log("err2",err);
		// 		}
		// 		fs.unlink(absPath, (err) => {
		// 			if (err) {
		// 				console.log("err3",err);
		// 			}
		// 			console.log('FILE [' + filename + '] REMOVED!');
		// 		});
		// 		});
		// 	});
		// }else{
		// 	console.log("res false");
		// }

		

		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function approve(req, res, next) {
	try {
		let response  =  await organizationService.approve(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function queryApprovedOrgs(req, res, next) {
	try {
		let response  =  await organizationService.queryApprovedOrgs(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}
async function queryApprovedOrgsByType(req, res, next) {
	try {
		let response  =  await organizationService.queryApprovedOrgsByType(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}
async function sendEmailFromUI(req, res, next) {
	try {
		let response=await organizationService.sendEmailFromUI(req);
		res.status(200);
		res.send(response);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	onboardOrganization,
	queryAllOrganizations,
	queryOrgByOrganizationType,
	getOrganizationById,
	queryOrgByOrganizationName,
	uploadFile,
	downloadFile,
	approve,
  	queryApprovedOrgs,
  	queryApprovedOrgsByType,
	sendEmailFromUI

  }