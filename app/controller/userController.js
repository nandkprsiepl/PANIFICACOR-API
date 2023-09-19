delete require.cache[require.resolve('../service/userService')]
let userService = require('../service/userService');

var path = require('path');

async function registerUser(req, res, next) {
	try {
		let response=await userService.registerUser(req.body);
		res.status(200);
		res.send(response);
	} catch (error) {
		next(error);
	}
}

async function queryUserByID(req, res, next) {
	try {
		let response  =  await userService.queryUserByID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function queryAllUsers(req, res, next) {
	try {
		let response  =  await userService.queryAllUsers(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function authenticateUser(req, res, next) {
	try {
		let response  =  await userService.authenticateUser(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}

async function queryUserByOrganizationID(req, res, next) {
	try {
		let response  =  await userService.queryUserByOrganizationID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}

}


async function queryUserByOrganizationName(req, res, next) {
	try {
		let response  =  await userService.queryUserByOrganizationName(req);
		res.status(200);
		res.send(response);
	} catch (error) {
		next(error);
	}
}

async function queryUserByRole(req, res, next) {
	try {
		let response  =  await userService.queryUserByRole(req);
		res.status(200);
		res.send(response);
	} catch (error) {
		next(error);
	}
}

async function changeUserPassword(req, res, next) {
	try {
		let response=await userService.changeUserPassword(req);
		res.status(200);
		res.send(response);
	} catch (error) {
		next(error);
	}
}

async function resetUserPassword(req, res, next) {
	try {
		let response=await userService.resetUserPassword(req);
		res.status(200);
		res.send(response);
	} catch (error) {
		next(error);
	}
}


module.exports = {
	registerUser,
	authenticateUser,
	queryAllUsers,
	queryUserByID,
	queryUserByOrganizationID,
	queryUserByOrganizationName,
	queryUserByRole,
	changeUserPassword,
	resetUserPassword

  };
  