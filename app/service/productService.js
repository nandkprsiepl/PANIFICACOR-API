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

const createProduct = async function (product,req) {
    logger.debug('createProduct - ****** START %s', product.productID);
    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
    product.orgId = offhainUserOb.orgId
    product.orgName = offhainUserOb.orgName
    product.orgType = offhainUserOb.organizationType
  
    console.log("offhainUserOb-->",offhainUserOb)
   
    let args = [JSON.stringify(product)]
    logger.debug('product - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.CREATE_PRODUCT, args, req.userId, req.orgName);
    logger.debug('createProduct - ****** result %s', result);
    if (result.success) {
        let message = "Sucessfully created Product" 
      result = await helper.parseResponse(constants.SUCCESS, message, result, 200);
    }
    else{
    // result.message =  result.message[0].message;
      result = await helper.parseResponse(constants.FAILURE, result.message, "", 200);   
    }      
    return result;
  };


  const addProductStock = async function (req) {
    logger.debug('addProductStock - ****** START');
    let product = req.body;

    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
    product.orgId = offhainUserOb.orgId
    product.orgType = offhainUserOb.organizationType

    let args = [JSON.stringify(product)]
    logger.debug('addProductStock - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.ADD_PRODUCT_STOCK, args, req.userId, req.orgName);
    logger.debug('addProductStock - ****** result %s', result);
    if (result.success) {
      
    }
    return result;
  };


const queryProductByID = async function (req) {
    logger.debug('queryInvoiceByID - ****** START');
    let args = [req.params.Id]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PRODUCT_BY_ID, req.userId, req.orgName);
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

const queryAllProducts = async function (req) {
    logger.debug('queryAllProducts - ****** START');
    let args = []
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_ALL_PRODUCTS, req.userId, req.orgName);
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


  const queryProductByOrgID = async function (req) {
    logger.debug('queryProductByOrgID - ****** START');
    let args = [req.params.orgID]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PRODUCT_BY_ORGID, req.userId, req.orgName);
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

  const queryPOQuantityDetails = async function (req) {
    logger.debug('queryProductQuantityDetails - ****** START');
    let args = [req.params.poID]
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, constants.GET_PO_QUANTITY_DETAILS, req.userId, req.orgName);
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
    createProduct,
    addProductStock,
    queryProductByID,
    queryAllProducts,
    queryProductByOrgID,
    queryPOQuantityDetails
};