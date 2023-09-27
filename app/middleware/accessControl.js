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

let checkOrgType = async (req, res, next) => {
    if(req.orgName == req.params.organizationType){
        return next();
    }else{
        res.status(constants.UNAUTHORIZED_STATUS)
        return res.send({
            success : false,
            message: constants.ORG_FETCH_UNAUTHORIZED
        })
    }
};

let checkOrgName = async (req, res, next) => {
    if(req.companyName == req.params.organizationName){
        return next();
    }else{
        res.status(constants.UNAUTHORIZED_STATUS)
        return res.send({
            success : false,
            message: constants.ORG_FETCH_UNAUTHORIZED
        })
    }
};

let checkRole = async (req, res, next) => {
    if(req.role == constants.SUPERADMIN){
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
    checkOrgId,
    checkOrgType,
    checkOrgName,
    checkRole
}

