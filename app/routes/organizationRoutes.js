const checkAuth =  require('../middleware/check-auth');
const express = require('express');
const router = express.Router();
const organizationController = require('../controller/organizationController');
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

router.post('/api/organization',  organizationController.onboardOrganization);
router.get('/api/organizations', checkAuth, organizationController.queryAllOrganizations);
router.get('/api/organizationById/:organizationId', checkAuth, organizationController.getOrganizationById);
router.get('/api/organizationByType/:organizationType', checkAuth, organizationController.queryOrgByOrganizationType);
router.get('/api/organizationByName/:organizationName', checkAuth, organizationController.queryOrgByOrganizationName);
router.post('/api/approve', checkAuth,   organizationController.approve);
router.get('/api/getApprovedOrgs', checkAuth, organizationController.queryApprovedOrgs);
router.get('/api/getApprovedOrgsByType/:type', checkAuth, organizationController.queryApprovedOrgsByType);


router.post('/upload', uploadmulter, organizationController.uploadFile);
router.get('/api/download', organizationController.downloadFile);

router.post('/api/sendEmailFromUI',organizationController.sendEmailFromUI);

module.exports = router;


