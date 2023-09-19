const helper = require('../utils/helper');
const logger = helper.getLogger('organizationService');
const chaincodeRepo = require('../dao/blockchainService');
const config = require('../../config.json');
const chaincodeName = require('../utils/constants').PO_CHAINCODE_NAME
const channelName =  process.env.CHANNEL_NAME || config.ORG_DETAILS.CHANNEL_NAME 
const peers =  process.env.PEERS || config.ORG_DETAILS.PEERS 
const constants = require('../utils/constants');

const { isConnected } = require('../utils/dbUtils');
const User = require('../schema/userSchema');


  const queryNotificationByOrgID = async function(req) {
    try {
      await isConnected();
      let offhainUserOb = await User.findOne({ userId: req.userId })
      let orgId = offhainUserOb.orgId
      logger.debug('queryNotificationByOrgID - ****** START ');
      let args = [orgId];
      let resp =  await chaincodeRepo.queryChaincode(peers,channelName,chaincodeName,args,constants.GET_NOTIFICATION_BY_ORG_ID,req.userId, req.orgName);
      let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);          
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };

  const queryNotificationByID = async function(req) {
    try {
      logger.debug('queryNotificationByID - ****** START ');
      let args = [req.params.ID];
      let resp =  await chaincodeRepo.queryChaincode(peers,channelName,chaincodeName,args,constants.GET_NOTIFICATION_BY_ID,req.userId, req.orgName);
      let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);          
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };

module.exports = {
    queryNotificationByOrgID,
    queryNotificationByID,
};