const jwt = require("jsonwebtoken");

const config = require('./../../config.json');

const constants = require('../utils/constants');
const util = require('util');
const helper = require('../utils/helper');
const logger = helper.getLogger('checkAuth');

module.exports = (req, res, next) => {
  logger.debug(' ------ Verification request for %s', req.originalUrl);

  let token = req.headers.authorization;
  logger.debug(' ------ Token is %s', token);
  if(token == undefined){
    let response = {};
    response.success = false;
    response.message = "Unauthorized Access. Please pass token"
    res.status(401);
    res.send(response);
  }  
  if (token.indexOf(config[constants.TOKEN_BEARER]) === 0) {
    logger.info('Removing Bearer');
    token = token.split(' ')[1];
  }
  logger.debug(' ------ Token is %s', token);

  jwt.verify(token, config[constants.APP_SECRET], function(err, decoded) {
    if (err) {
      return res.send({
        success: false,
        message: err
      });
    } else {
      req.userId = decoded.userId;
      req.orgName = decoded.orgName;
      req.companyName = decoded.companyName;
      req.role = decoded.role;
      req.orgId = decoded.orgId;
      logger.debug(util.format('Decoded from JWT token: userId - %s, orgname - %s , companyName %s , orgId %s', decoded.userId, decoded.orgName,decoded.companyName,decoded.orgId));
      return next();
    }
  });
};
