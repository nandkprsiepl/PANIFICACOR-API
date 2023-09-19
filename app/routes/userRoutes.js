const checkAuth =  require('../middleware/check-auth');
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const multer = require('multer'); 


var storage = multer.diskStorage({
    destination: function (req, File, cb) {
        cb(null,  "./uploads")
    },
    filename: function (req, File, cb) {    
        cb(null, Date.now() + '-' + (File.originalname).replace(/ /g,''));
    }
});
var upload = multer({
    storage: storage
});
var uploadmulter = upload.single('File');

router.post('/api/registerUser', userController.registerUser);
router.post('/login', userController.authenticateUser);
router.get('/user/:userId', checkAuth,  userController.queryUserByID);
router.get('/users', checkAuth, userController.queryAllUsers);
router.get('/queryUserByOrganizationID/:orgId', checkAuth, userController.queryUserByOrganizationID);
router.get('/queryUserByOrganizationName/:orgName', checkAuth, userController.queryUserByOrganizationName);
router.get('/queryUserByRole/:role', checkAuth, userController.queryUserByRole);
router.put('/api/changeUserPassword', userController.changeUserPassword);
router.put('/api/resetUserPassword', userController.resetUserPassword);


module.exports = router;


  