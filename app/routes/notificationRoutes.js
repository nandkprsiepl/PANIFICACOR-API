const checkAuth =  require('../middleware/check-auth');
const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');

router.get('/api/getNotification', checkAuth, notificationController.queryNotificationByOrgID);
router.get('/api/getNotificationByID/:ID', checkAuth, notificationController.queryNotificationByID);

module.exports = router;
