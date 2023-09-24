const helper = require('../utils/helper');
const logM = require('../utils/helper');
const logger = logM.getLogger('poService');
const chaincodeRepo = require('../dao/blockchainService');
const constants = require('../utils/constants');
const config = require('../../config.json');

const chaincodeName = require('../utils/constants').PO_CHAINCODE_NAME
const orgName = process.env.ORG_NAME || config.ORG_DETAILS.ORG_NAME
const channelName = process.env.CHANNEL_NAME || config.ORG_DETAILS.CHANNEL_NAME
const peers = process.env.PEERS || config.ORG_DETAILS.PEERS


const mongoose = require('mongoose');
const { isConnected } = require('../utils/dbUtils');
const User = require('../schema/userSchema');
const Org = require('../schema/orgSchema');
const docService = require('./docService')



const createInvoice = async function (invoice,req) {
    logger.debug('createInvoice - ****** START %s', invoice);
    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
    invoice.originationOrgId = offhainUserOb.orgId
    invoice.originationOrgName = offhainUserOb.orgName
    invoice.originationOrgType = offhainUserOb.organizationType
  
    console.log("offhainUserOb-->",offhainUserOb)
    
    let destinationUserOb = await Org.findOne({ orgId: invoice.destinationOrgId })
    invoice.destinationOrgName = destinationUserOb.orgName
    invoice.destinationOrgType = destinationUserOb.organizationType
  
    let uploadResult = await docService.uploadFile(req);
    console.log("uploadResult",uploadResult);

    invoice.labCertHash = uploadResult.hash;
    invoice.labCertMime = uploadResult.mime;
    invoice.labCertName = uploadResult.name;
    invoice.quantity = Number(invoice.quantity);

    let invoiceID = await genId();
    invoice.invoiceID = "IN"+invoiceID;
    invoice.status = constants.STATUS_CREATED;
  
    let args = [JSON.stringify(invoice)]
    logger.debug('createInvoice - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.CREATE_INVOICE, args, req.userId, req.orgName);
    logger.debug('createInvoice - ****** result %s', result);
    if (result.success) {
        let message = "Sucessfully created Dispatch Note" 
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
  

  const acceptInvoice = async function (req) {
    logger.debug('acceptInvoice - ****** START');
   
    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
  
    let invoiceObject = req.body;
    invoiceObject.status = constants.STATUS_ACCEPTED;
    invoiceObject.UpdatedBy = offhainUserOb.orgId
    invoiceObject.updatedDate = new Date();

    let args = [JSON.stringify(invoiceObject)]
    logger.debug('acceptInvoice - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.ACCEPT_INVOICE, args, req.userId, req.orgName);
    logger.debug('acceptInvoice - ****** result %s', result);
    if (result.success) {
      let message = "Material Dispatch Reference successfully updated " 
    result = await helper.parseResponse(constants.SUCCESS, message, result, 200);
  }
  else{
  // result.message =  result.message[0].message;
    result = await helper.parseResponse(constants.FAILURE, result.message, "", 200);   
  }      
  return result;
  };


  const rejectInvoice = async function (req) {
    logger.debug('rejectInvoice - ****** START');
   
    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
  
    let invoiceObject = req.body;
    invoiceObject.status = constants.STATUS_REJECTED;
    invoiceObject.UpdatedBy = offhainUserOb.orgId
    invoiceObject.updatedDate = new Date();

    let args = [JSON.stringify(invoiceObject)]
    logger.debug('rejectInvoice - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.REJECT_INVOICE, args, req.userId, req.orgName);
    logger.debug('rejectInvoice - ****** result %s', result);
    if (result.success) {
      
    }
    return result;
  };


  const updateInvoiceComments = async function (req) {
    logger.debug('updateInvoiceComments - ****** START');
   
    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
  
    let invoiceObject = req.body;
    invoiceObject.UpdatedBy = offhainUserOb.orgId
  
    let args = [JSON.stringify(invoiceObject)]
    logger.debug('updateInvoiceComments - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.UPDATE_INVOICE_COMMENTS, args, req.userId, req.orgName);
    logger.debug('updateInvoiceComments - ****** result %s', result);
    if (result.success) {
      
    }
    return result;
  };


const queryInvoiceHistory = async function (req) {
    logger.debug('queryInvoiceHistory - ****** START');
    let args = [req.params.invoiceID]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_INVOICE_HISTORY, req.userId, req.orgName);
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


const queryInvoiceByNumber = async function (req) {
    logger.debug('queryInvoiceByNumber - ****** START');
    let args = [req.params.invoiceNumber]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_INVOICE_BY_NUMBER, req.userId, req.orgName);
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


const queryInvoiceBySTATUS = async function (req) {
    logger.debug('queryInvoiceBySTATUS - ****** START');

    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
  
    let args = [req.params.status,offhainUserOb.orgId]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_INVOICE_BY_STATUS, req.userId, req.orgName);
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


const queryInvoiceByOrgID = async function (req) {
    logger.debug('queryInvoiceByOrgID - ****** START');
    let args = [req.params.orgID]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_INVOICE_BY_ORG_ID, req.userId, req.orgName);
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
  

const queryInvoiceByID = async function (req) {
    logger.debug('queryInvoiceByID - ****** START');
    let args = [req.params.Id]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_INVOICE_BY_ID, req.userId, req.orgName);
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

  const shipInvoice = async function (req) {
    logger.debug('shipInvoice - ****** START');
   
    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
  
    let invoiceObject = req.body;
    invoiceObject.status = constants.STATUS_SHIPPED;
    invoiceObject.UpdatedBy = offhainUserOb.orgId
  
    let args = [JSON.stringify(invoiceObject)]
    logger.debug('shipInvoice - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.SHIP_INVOICE, args, req.userId, req.orgName);
    logger.debug('shipInvoice - ****** result %s', result);
    if (result.success) {
      
    }
    return result;
  };



const queryInvoiceByPONumber = async function (req) {
  logger.debug('queryInvoiceByPONumber - ****** START');
  let args = [req.params.poNumber]
  let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_INVOICE_BY_PO_NUMBER, req.userId, req.orgName);
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



const queryInvoiceByPOID = async function (req) {
    logger.debug('queryInvoiceByPOID - ****** START');
    let args = [req.params.poID]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_INVOICE_BY_PO_ID, req.userId, req.orgName);
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



  const recallInvoice = async function (req) {
    logger.debug('recallInvoice - ****** START');
   
    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
  
    let invoiceObject = req.body;
    invoiceObject.status = constants.STATUS_RECALLED;
    invoiceObject.UpdatedBy = offhainUserOb.orgId
    invoiceObject.updatedDate = new Date();

    let args = [JSON.stringify(invoiceObject)]
    logger.debug('acceptInvoice - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.RECALL_INVOICE, args, req.userId, req.orgName);
    logger.debug('acceptInvoice - ****** result %s', result);
    if (result.success) {
      
    }
    return result;
  };


module.exports = {
    createInvoice,
    updateInvoiceComments,
    queryInvoiceByID,
    acceptInvoice,
    rejectInvoice,
    queryInvoiceHistory,
    queryInvoiceByNumber,
    queryInvoiceBySTATUS,
    queryInvoiceByOrgID,
    shipInvoice,
    queryInvoiceByPONumber,
    queryInvoiceByPOID,
    recallInvoice
};