delete require.cache[require.resolve('./userService')]

const helper = require('../utils/helper');
const logger = helper.getLogger('organizationService');
const chaincodeRepo = require('../dao/blockchainService');
var userService = require('./userService');
const config = require('../../config.json');
const emailUtils = require('../utils/emailUtils');
const chaincodeName = require('../utils/constants').ORGANIZATION_CHAINCODE_NAME
const orgNameBlockhain =  process.env.ORG_NAME || config.ORG_DETAILS.ORG_NAME 
const channelName =  process.env.CHANNEL_NAME || config.ORG_DETAILS.CHANNEL_NAME 
const peers =  process.env.PEERS || config.ORG_DETAILS.PEERS 
const constants = require('../utils/constants');
const connectionUtil = require('../utils/connectionUtils');
const userRepo = require('../dao/userRepo')

const mongoose = require('mongoose');
const { isConnected } = require('../utils/dbUtils');
const Org = require('../schema/orgSchema');
const docService = require('./docService')
const User = require('../schema/userSchema');


  const onboardOrganization = async function(org) {
    try {
      logger.debug('onboardOrganization - ****** START ');

      let userExist = await userService.checkUserExists(org.orgType,org.orgName,org.emailId)
      if(!userExist.success){
        return userExist;
      }

      org.password = Math.random().toString(36).slice(-8);

     //Generate OrgID 
      let id = await genId()
      org.orgId = "ORG" + id;
      org.userId = org.emailId 
      org.userName = org.orgAdminFirstName + " " + org.orgAdminLastName;
      org.email= org.emailId;  
      org.status = constants.STATUS_ACTIVE

      //Mongo Registration Organization
      let organization = await decorateOrg(org);  
      let offchainRes = await onboardOrganizationOffchain(organization);
      console.log("offchainRes",offchainRes);

      // await isConnected();
      // let organization = await decorateOrg(org);  
      // const organization = new Org({_id: mongoose.Types.ObjectId(),orgId, orgName, orgAdminFirstName, orgAdminLastName, orgAdminEmailId, phone, address, countryOfInc, stateOfInc, zipCode, buisnessType, status, role, organizationType});
      // let saveOrg = await organization.save();
      // console.log("saveuser",saveOrg);

      let result = await onboardOrganizationOnchain(organization);
      logger.debug('registerOrg - ****** result %s', JSON.stringify(result));

      // var orgOb = {orgId, orgName, orgAdminFirstName, orgAdminLastName, orgAdminEmailId, phone,address, countryOfInc, stateOfInc, zipCode, buisnessType, organizationType, status ,role }
      // let args = [JSON.stringify(orgOb)]
      // logger.debug('org - ****** START %s', args);
      //  result =await chaincodeRepo.invokeChaincode(peers,channelName,chaincodeName,constants.CREATE_ORG,args,adminDetails.username,org.orgName);
      // logger.debug('registerOrg - ****** result %s', JSON.stringify(result));
  // if(result.success){ 
  //   const userOb = {orgId, orgName, email, phone, status ,userId, userName, password, role, organizationType }

  //   logger.debug('user - ****** START %s', JSON.stringify(userOb));
  //   console.log("userOb-->",userOb)
  //   let onboardUserResult = await userService.registerUser(userOb);
  //   logger.debug('registeruser - ****** result %s', onboardUserResult.onChainReg);
  //   let message = "Organization with name "+ org.orgName+"  onboarded successfully having admin Id "+ orgAdminEmailId +" & password "+pass;
  //   result = await helper.parseResponse(constants.SUCCESS, message, "", 200);
    
  //   //Send Mail
  //   if(onboardUserResult.onChainReg.success){
  //     logger.debug('Calling Sending Email service');
  //     logger.debug('Calling Sending Email service');
  //       await helper.sendOnboardingMail(userOb,org.userName)
  //   }

  // }else{
  //   // result.message =  result.message[0].message;
  //   result = await helper.parseResponse(constants.FAILURE, result.message, "", 200);         

  // }   
      return result;
    } catch(err) {
      console.log("err",err)
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    } 
   };
  
   const onboardOrganizationOnchain = async function(org){
    let adminDetails = connectionUtil.getAdminDetailsForOrg(org.organizationType);
    await userRepo.enrollAdminIdentity(org.organizationType);
    let args = [JSON.stringify(org)]
    logger.debug('org - ****** START %s', args);
    return chaincodeRepo.invokeChaincode(peers,channelName,chaincodeName,constants.CREATE_ORG,args,adminDetails.username,org.orgName);
   }

   const onboardOrganizationOffchain = async function(org){
    //Mongo Registration Organization
    await isConnected();
    const organization = new Org(org);
    return  organization.save();
   }

   const decorateOrg = async function(org){
     let orgOnchain = {}
        orgOnchain.orgId = org.orgId;
        orgOnchain.orgName = org.orgName;
        orgOnchain.orgType = org.orgType;
        orgOnchain.companyName = org.companyName;
        orgOnchain.companyBranch = org.companyBranch;
        orgOnchain.phone = org.phone;
        orgOnchain.fax = org.fax;
        orgOnchain.firstName = org.firstName;
        orgOnchain.lastName = org.lastName;
        orgOnchain.emailId = org.emailId;
        orgOnchain.cpfNumber = org.cpfNumber;
        orgOnchain.district = org.district;
        orgOnchain.county = org.county;
        orgOnchain.address = org.address;
        orgOnchain.countryOfInc = org.countryOfInc;
        orgOnchain.stateOfInc = org.stateOfInc;
        orgOnchain.postalCode = org.postalCode;
        orgOnchain.role = org.role;
        orgOnchain.dateOfInc = org.dateOfInc;
        orgOnchain.notes = org.notes;
        orgOnchain.status = org.status;
     return orgOnchain
   }

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
  
  const queryAllOrganizations = async function(req) {
    try {
      logger.debug('queryAllOrganizations - ****** START ');
      let args = [""];
      let resp =  await chaincodeRepo.queryChaincode(peers,channelName,chaincodeName,args,"queryAllOrganisations",req.userId, req.orgName);
      let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);          
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };
  
  const getOrganizationById = async function(req) {
    try {
      logger.debug('getOrganizationById - ****** START ');
      let args = [req.params.organizationId];
      let result = await chaincodeRepo.queryChaincode(peers,channelName,chaincodeName,args,"queryOrgByID",req.userId, req.orgName);
      if(result == undefined || result == ""){
        const response = {
          success: false,
          message: "Failed to get Organization details, please check organization name or id."
        };
        return response;
      }else{
        let resp =  JSON.stringify(JSON.parse(result), null, 2);  
        let resultAns = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);          
        return resultAns;  
      }
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };


  const queryOrgByOrganizationType = async function(req) {
    try {
      logger.debug('queryOrgByOrganizationType - ****** START ');
      let args = [req.params.organizationType];
      let resp =  await chaincodeRepo.queryChaincode(peers,channelName,chaincodeName,args,"queryOrgByOrganizationType",req.userId, req.orgName);
      let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);          
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };

  const queryOrgByOrganizationName = async function(req) {
    try {
      logger.debug('queryOrgByOrganizationType - ****** START ');
      let args = [req.params.orgName];
      let resp =  await chaincodeRepo.queryChaincode(peers,channelName,chaincodeName,args,"queryOrgByOrganizationName",req.userId, req.orgName);
      let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);          
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };


  const uploadFile = async function(req) {
    try {
        let result = await docService.uploadFile(req);
        console.log("result",result);
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };

  const downloadFile = async function(req) {
    try {
        let result = await docService.downloadFile(req);
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };


  const approve = async function (req) {
    logger.debug('approve - ****** START');
    let org = {};
    org.orgId = req.body.orgId;

    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.userId })
    org.approvedBy = offhainUserOb.orgId
    
    let args = [JSON.stringify(org)]
    logger.debug('approve - ****** START %s', args);
    let result = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.APPROVE, args, req.userId, req.orgName);
    if (result.success) {
      
    }
    return result;
  };

  const queryApprovedOrgs = async function(req) {
    try {
      await isConnected();
      let offhainUserOb = await User.findOne({ userId: req.userId })
      let orgId = offhainUserOb.orgId
      logger.debug('queryApprovedOrgs - ****** START ');
      let args = [orgId];
      let resp =  await chaincodeRepo.queryChaincode(peers,channelName,chaincodeName,args,constants.GET_APPROVED_ORGS,req.userId, req.orgName);
      let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);          
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };
  
  const queryApprovedOrgsByType = async function(req) {
    try {
      await isConnected();
      let org = {};
      let offhainUserOb = await User.findOne({ userId: req.userId })
      org.orgId = offhainUserOb.orgId
      org.organizationType = req.params.type
      logger.debug('queryApprovedOrgsByRole - ****** START ');
      let args = [JSON.stringify(org)]
      let resp =  await chaincodeRepo.queryChaincode(peers,channelName,chaincodeName,args,constants.GET_APPROVED_ORGS_BY_ROLE,req.userId, req.orgName);
      let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);          
      return result;
    } catch(err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);       
      return error;
    }  
  };


  const sendEmailFromUI = async function (req) {
    let respSendEmail = await emailUtils.sendEmail(req.body.to, req.body.subject, req.body.body);
    logger.log('sendEmailFromUI', 'data --> %s ', req.body);
    var result = {};
        if (respSendEmail) {
              result = await helper.parseResponse(constants.SUCCESS, constants.UPDATE_SUCCESS,"Email sent successfully.", 200);
        } else {
          result = await helper.parseResponse(false, constants.UPDATE_FAILED, "Send email Returned Error, see the logs", 200);
        }
        return result;
      };


  module.exports = {
  onboardOrganization,
  queryAllOrganizations,
  queryOrgByOrganizationType,
  getOrganizationById,
  queryOrgByOrganizationName,
  uploadFile,
  downloadFile,
  approve,
  queryApprovedOrgs,
  queryApprovedOrgsByType,
  sendEmailFromUI
}

//createBulkOrgJson();