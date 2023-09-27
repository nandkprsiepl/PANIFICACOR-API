const jwt = require("jsonwebtoken");

const config = require('./../../config.json');

const constants = require('../utils/constants');
const util = require('util');
const helper = require('../utils/helper');
const logger = helper.getLogger('checkAuth');


let checkOrgId = async (req, res, next) => {
    if(req.orgId == req.params.organizationId){
        return next();
    }else{
        res.status(constants.UNAUTHORIZED_STATUS)
        return res.send({
            success : false,
            message: constants.ORG_FETCH_UNAUTHORIZED
        })
    }
};

module.exports = {
    checkOrgId
}

