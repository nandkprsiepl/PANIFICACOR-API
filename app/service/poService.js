const helper = require('../utils/helper');
const logM = require('../utils/helper');
const logger = logM.getLogger('poService');
const chaincodeRepo = require('../dao/blockchainService');
const constants = require('../utils/constants');
const config = require('../../config.json');
// const axios = require('axios');

const chaincodeName = require('../utils/constants').PO_CHAINCODE_NAME
const orgName = process.env.ORG_NAME || config.ORG_DETAILS.ORG_NAME
const channelName = process.env.CHANNEL_NAME || config.ORG_DETAILS.CHANNEL_NAME
const peers = process.env.PEERS || config.ORG_DETAILS.PEERS


const mongoose = require('mongoose');
const { isConnected } = require('../utils/dbUtils');
const User = require('../schema/userSchema');
const Org = require('../schema/orgSchema');


const createPO = async function (po,req) {
  logger.debug('createPO - ****** START %s', po.poNumber);
 
  await isConnected();
  let offhainUserOb = await User.findOne({ userId: req.userId })
  po.originationOrgId = offhainUserOb.orgId
  po.originationOrgName = offhainUserOb.orgName
  po.originationOrgType = offhainUserOb.organizationType
  
  console.log("offhainUserOb-->",offhainUserOb)
  
  let destinationUserOb = await Org.findOne({ orgId: po.destinationOrgId })
  console.log("destinationUserOb-->",destinationUserOb)

  po.destinationOrgName = destinationUserOb.orgName
  po.destinationOrgType = destinationUserOb.organizationType

  if(po.originationOrgType == constants.ORG_TYPE_OPERATOR){
    po.refPOID = "-1";
  }

  let poID = await genId();
  po.poID = "PO"+poID;

  po.status = constants.STATUS_CREATED;
  po.Status_Update = "false";

  let args = [JSON.stringify(po)]
  logger.debug('product - ****** START %s', args);
  let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.CREATE_PO, args, req.userId, req.orgName);
  logger.debug('createProduct - ****** result %s', result);
  if (result.success) {
      let message =  po.poID;
    result = await helper.parseResponse(constants.SUCCESS, message, result, 200);
  }
  else{
  // result.message =  result.message[0].message;
    result = await helper.parseResponse(constants.FAILURE, result.message, "", 200);   
  }      


  return result;
};

const genId = async function(){
  let date = new Date();
  let components = [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ];
let id = components.join("");
return id;
}


const updatePO = async function (req) {
  logger.debug('updatePO - ****** START');
 
  await isConnected();
  let offhainUserOb = await User.findOne({ userId: req.userId })
  
  let poObject = req.body;
  poObject.createdBy = offhainUserOb.orgId

  let args = [JSON.stringify(poObject)]
  logger.debug('product - ****** START %s', args);
  let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.UPDATE_PO, args, req.userId, req.orgName);
  logger.debug('updatePO - ****** result %s', result);
  // if (result.success) {
    
  // }
  // return result;

  if (result.success) {
    let message = "PO Reference successfully updated" 
  result = await helper.parseResponse(constants.SUCCESS, message, result, 200);
  }
  else{
  // result.message =  result.message[0].message;
  result = await helper.parseResponse(constants.FAILURE, result.message, "", 200);   
  }      
  return result;
  // if (result.success) {
  //   const response = {
  //     success: "Success",
  //     message: "",
  //     data : result
  //   };   
  //   return response;   
    
  // }
  // else{
  //   const response = {
  //     success: false,
  //     message: "",
  //     data : result
  //   };   
  //   return response;   

  // }
};

const acceptPO = async function (req) {
  logger.debug('acceptPO - ****** START');
 
  await isConnected();
  let offhainUserOb = await User.findOne({ userId: req.userId })

  let poObject = req.body;
  poObject.status = constants.STATUS_ACCEPTED;
  poObject.createdBy = offhainUserOb.orgId
  poObject.updatedDate = new Date();

  let args = [JSON.stringify(poObject)]
  logger.debug('product - ****** START %s', args);
  let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.UPDATE_PO_STATUS, args, req.userId, req.orgName);
  logger.debug('createProduct - ****** result %s', result);
  if (result.success) {
    // let payload = { poID: poObject.poID, status: constants.STATUS_ACCEPTED,desc: poObject.comments};

    // let res = await axios.post('http://smartbolt.eastus2.cloudapp.azure.com:5000/updatepofrommt', payload);

    // let data = res.data;
    const response = {
      success: "Success",
      message: "",
      data : result
    };   
    return response;   
    
  }
  else{
    const response = {
      success: false,
      message: "",
      data : result
    };   
    return response;   

  }
 
};

const rejectPO = async function (req) {
  logger.debug('rejectPO - ****** START');
 
  await isConnected();
  let offhainUserOb = await User.findOne({ userId: req.userId })

  let poObject = req.body;
  poObject.status = constants.STATUS_REJECTED;
  poObject.createdBy = offhainUserOb.orgId
  poObject.updatedDate = new Date();

  let args = [JSON.stringify(poObject)]
  logger.debug('rejectPO - ****** START %s', args);
  let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.UPDATE_PO_STATUS, args, req.userId, req.orgName);
  logger.debug('rejectPO - ****** result %s', result);
  if (result.success) {
    const response = {
      success: "Success",
      message: "",
      data : result 
     } 
      return response;   
  }
  else
  {
    const response = {
      success: false,
      message: "",
      data : result
    };   
    return response;   

  }
 
};

const queryPOHistory = async function (req) {
  logger.debug('queryPOHistory - ****** START');
  let args = [req.params.poNumber]
  let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PO_HISTORY, req.userId, req.orgName);
  console.log("result",result)
  if(result == undefined || result == ""){
    const response = {
      success: false,
      message: "Failed to get state"
    };
    return response;
  }else{
    const response = {
      success: "Success",
      message: "",
      data : JSON.parse(result)   
    };
    return response;    
  }
};

const queryPOByNumber = async function (req) {
  logger.debug('queryPOByNumber - ****** START');
  let args = [req.params.poNumber]
  let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PO_BY_NUMBER, req.userId, req.orgName);
  console.log("result",result)
  if(result == undefined || result == ""){
    const response = {
      success: false,
      message: "Failed to get state"
    };
    return response;
  }else{
    const response = {
      success: "Success",
      message: "",
      data : JSON.parse(result)   
    };
    return response;
  }
};

const queryPOBySTATUS = async function (req) {
  logger.debug('queryPOBySTATUS - ****** START');

  await isConnected();
  let offhainUserOb = await User.findOne({ userId: req.userId })

  let args = [req.params.status,offhainUserOb.orgId]
  let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PO_BY_STATUS, req.userId, req.orgName);
  console.log("result",result)
  if(result == undefined || result == ""){
    const response = {
      success: false,
      message: "Failed to get state"
    };
    return response;
  }else{
    const response = {
      success: "Success",
      message: "",
      data : JSON.parse(result)   
    };
    return response;
  }
};

const queryPOByProductID = async function (req) {
  logger.debug('queryPOByProductID - ****** START');
  let args = [req.params.productID]
  let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PO_BY_PRODUCT_ID, req.userId, req.orgName);
  console.log("result",result)
  if(result == undefined || result == ""){
    const response = {
      success: false,
      message: "Failed to get state"
    };
    return response;
  }else{
    const response = {
      success: "Success",
      message: "",
      data : JSON.parse(result)   
    };
    return response; 
  }
};

const queryPOByOrgID = async function (req) {
  logger.debug('queryPOByOrgID - ****** START');
  let args = [req.params.orgID]
  let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PO_BY_ORG_ID, req.userId, req.orgName);
  console.log("result",result)
  if(result == undefined || result == ""){
    const response = {
      success: false,
      message: "Failed to get state"
    };
    return response;
  }else{
    const response = {
      success: "Success",
      message: "",
      data : JSON.parse(result)   
    };
    return response;
     
  }
};


const queryPOByRefPOID = async function (req) {
  logger.debug('queryPOByRefPOID - ****** START');
  let args = [req.params.poID]
  let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PO_BY_REF_PO_ID, req.userId, req.orgName);
  console.log("result",result)
  if(result == undefined || result == ""){
    const response = {
      success: false,
      message: "Failed to get state"
    };
    return response;
  }else{
    const response = {
      success: "Success",
      message: "",
      data : JSON.parse(result)   
    };
    return response;
     
  }
};

module.exports = {
    createPO,
    updatePO,
    acceptPO,
    rejectPO,
    queryPOHistory,
    queryPOByNumber,
    queryPOBySTATUS,
    queryPOByProductID,
    queryPOByOrgID,
    queryPOByRefPOID
};