const notificationService = require('../service/notificationService');

async function queryNotificationByOrgID(req, res, next) {
	try {
		let response  =  await notificationService.queryNotificationByOrgID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}
async function queryNotificationByID(req, res, next) {
	try {
		let response  =  await notificationService.queryNotificationByID(req);
		res.status(200);
		res.send(response);

	} catch (error) {
		next(error);
	}
}

module.exports = {
    queryNotificationByOrgID,
    queryNotificationByID,
};