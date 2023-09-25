delete require.cache[require.resolve('../utils/helper')]
delete require.cache[require.resolve('../dao/userRepo')]

const helper = require('../utils/helper');
const logger = helper.getLogger('userService');
const chaincodeRepo = require('../dao/blockchainService');
const userRepo = require('../dao/userRepo')
const constants = require('../utils/constants');
const dbUtils = require('../utils/dbUtils');
const emailUtils = require('../utils/emailUtils');
const jwt = require("jsonwebtoken");
const config = require('./../../config.json');
const bcrypt = require('bcrypt');
const schema = require('./../schema/schema');
const { param } = require('../routes/userRoutes');
const { query } = require('express');
const connectionUtil = require('../utils/connectionUtils')
const chaincodeName = require('../utils/constants').USER_CHAINCODE_NAME
const orgNameBlockchain = process.env.ORG_NAME || config.ORG_DETAILS.ORG_NAME
const channelName = process.env.CHANNEL_NAME || config.ORG_DETAILS.CHANNEL_NAME
const peers = process.env.PEERS || config.ORG_DETAILS.PEERS
const fs = require('fs');
var multer = require('multer');
const util = require("util");

const mongoose = require('mongoose');
const { isConnected } = require('../utils/dbUtils');
const User = require('../schema/userSchema');

var path = require('path');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);


const registerUser = async function (user) {
  try {
    var { orgId, orgName, email, phone, status, userId, userName, password, role, orgType } = user
    logger.debug('registerUser - ****** START %s', user.userName);
    var result = {}
    let adminDetails = connectionUtil.getAdminDetailsForOrg(user.orgType);

    logger.debug('queryUser - ****** START ');
    user.password = await helper.hashPassword(user)
    password = user.password;

    var registerUserResult = {};
    //Offchain Registration
    try {
      var enrollResult = {};
      //Enroll User In Blockchain
      let org = user.orgName
      let roleactual = user.role
      user.role = 'admin'
      //user.orgName = orgNameBlockchain;
      enrollResult = await userRepo.registerUser(user);
      registerUserResult.enrollUserResult = enrollResult;
      logger.debug('registerUser - ****** enrollResult %s', enrollResult);

      if (enrollResult.success) {
        user.orgName = org;
        user.role = roleactual;

        //Mongo Registration Organization
        await isConnected();
        const userOb = new User({ _id: mongoose.Types.ObjectId(), userId, userName, orgId, orgName, role, password, email, phone, status, orgType });
        let saveUser = await userOb.save();
        console.log("saveuser", saveUser);


        //Onchain Registration Blockchain
        let args = [JSON.stringify(user)]
        logger.debug('user - ****** START %s', args);
        let resultOnChain = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, constants.CREATE_USER, args, userId, orgType);
        logger.debug('registerUser - ****** result %s', resultOnChain);
        registerUserResult.onChainReg = resultOnChain;
      }

    } catch (err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(false, constants.USER_EXISTS_DB, "", 409);
      return error;
    }
    return registerUserResult;
  }
  catch (err) {
    logger.log('info', 'Error --> %s ', err.toString());
    let error = await helper.parseResponse(constants.FAILURE, constants.SERVER_ERROR, "", 500);
    return error;
  }
};


const authenticateUser = async function (req) {
  try {
    let user = req.body;
    let param = { "key": "userId", value: user.userId }

    await isConnected();
    let offhainUserOb = await User.findOne({ userId: req.body.userId })
    console.log("offhainUserOb-->", offhainUserOb)

    if (offhainUserOb != null) {
      let offchainres = await bcrypt.compare(user.password, offhainUserOb.password)
      logger.debug('offchainres auth - ****** result %s', offchainres.toString());

      if (offchainres) {
        const token = jwt.sign({
          userId: req.body.userId,
          orgName: orgNameBlockchain,
        }, config[constants.APP_SECRET])
        let result = {}
        result = await helper.parseResponse(constants.SUCCESS, constants.LOGIN_SUCCESS, offhainUserOb, 200);
        result.token = token;
        
        return result;
      } else {
        let error = await helper.parseResponse(constants.FAILURE, constants.PASSWORD_MISMATCH, "", 401);       
        error.message = "Check your User Name  and Password";
        return error;
      }
    } else {
      let error = await helper.parseResponse(constants.FAILURE, constants.LOGIN_FAILED, "", 404);
      error.message = "Check your User Name  and Password";
      return error;
    }
  } catch (err) {
    logger.log('info', 'Error --> %s ', err.toString());
   
    let error = await helper.parseResponse(constants.FAILURE, constants.SERVER_ERROR, "", 500);
    error.message =" Check your User Name  and Password";
    return error;
  }
};


const queryUserByOrganizationName = async function (req) {
  try {
    logger.debug('queryOrgByOrganizationType - ****** START ');
    let args = [req.params.orgName];
    let resp = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, "queryUserByOrganizationName", req.userId, req.orgName);
    let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);
    return result;
  } catch (err) {
    logger.log('info', 'Error --> %s ', err.toString());
    let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);
    return error;
  }
};

const queryUserByOrganizationID = async function (req) {
  try {
    logger.debug('queryUserByOrganizationID - ****** START ');
    let args = [req.params.orgId];
    let resp = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, "queryUserByOrganizationID", req.userId, req.orgName);
    let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);
    return result;
  } catch (err) {
    logger.log('info', 'Error --> %s ', err.toString());
    let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);
    return error;
  }
};

const queryUserByRole = async function (req) {
  try {
    logger.debug('queryUserByOrganizationID - ****** START ');
    let args = [req.params.role];
    let resp = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, "queryUserByRole", req.userId, req.orgName);
    let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);
    return result;
  } catch (err) {
    logger.log('info', 'Error --> %s ', err.toString());
    let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);
    return error;
  }
};

const queryUserByID = async function (req) {
  try {
    logger.debug('queryUserByID - ****** START ');
    let args = [req.params.userId];
    let result = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, "queryUserByID", req.userId, req.orgName);
    if (result == undefined || result == "") {
      const response = {
        success: false,
        message: "Failed to get User details, please check Id"
      };
      return response;
    } else {
      let resp = JSON.stringify(JSON.parse(result), null, 2);
      let resultAns = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);
      return resultAns;
    }
  } catch (err) {
    logger.log('info', 'Error --> %s ', err.toString());
    let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);
    return error;
  }
};

const queryAllUsers = async function (req) {
  try {
    logger.debug('queryAllUsers - ****** START ',);
    console.log("req.orgname", req.orgName)
    let args = [""];
    let resp = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, "queryAllUsers", req.userId, req.orgName);
    let result = await helper.parseResponse(constants.SUCCESS, constants.ORGANIZATION_DATA, JSON.parse(resp), 200);
    return result;
  } catch (err) {
    logger.log('info', 'Error --> %s ', err.toString());
    let error = await helper.parseResponse(constants.FAILURE, constants.USER_UPDATE_FAILED, "", 409);
    return error;
  }
};


const checkUserExists = async function (orgType, orgName, userId) {
  let result = {}
  let wallet = await connectionUtil.getWallet(orgType);
  const userExists = await wallet.get(userId);
  if (userExists) {
    result.success = false
    result.message = constants.ALREADY_EXISTS + userId;
  } else {
    result.success = true;
  }
  return result;
}


const resetUserPassword = async function (req) {
  logger.debug('resetUserPassword - ****** START ');

  let checkUserExistsRes = await checkUserExists(orgNameBlockchain, req.body.userId);
  if (checkUserExistsRes.success) {
    var result = {};
    result.success = false
    result.message = "User not exist with these details.";
    return result;
  }

  let user = req.body;
  let args = [req.body.userId];
  let userObj = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, "queryUserByID", user.userId, orgNameBlockchain);
  userObj = JSON.parse(userObj);

  if (userObj.email != req.body.emailId) {
    var result = {};
    result.success = false
    result.message = "User not exist with these details.";
    return result;
  }

  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var password = "";
  for (var i = 0, n = charset.length; i < 8; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  console.log("password", password);
  userObj["password"] = password;

  let resp = await this.updateUser(userObj, userObj.userId, orgNameBlockchain);
  logger.debug('resetUserPassword - ****** After Update User', resp);

  if (resp.success) {
    let subject = constants.PASSWORD_RESET_SUBJECT;
    let text = constants.PASSWORD_RESET_TEXT + password;
    let respSendEmail = await emailUtils.sendEmail(userObj.email, subject, text);
    var emailSendResult = {};
    if (respSendEmail) {
      emailSendResult.success = true
      emailSendResult.message = "Email sent successfully.";
    } else {
      emailSendResult.success = false
      emailSendResult.message = "Failed to send email.";
    }
    return emailSendResult;
  }
  return resp;
};

const changeUserPassword = async function (req) {
  logger.debug('changeUserPassword - ****** START ');
  let resp = {}
  let user = req.body;
  let args = [req.body.userId];
  let userObj = await chaincodeRepo.queryChaincode(peers, channelName, chaincodeName, args, "queryUserByID", user.userId, orgNameBlockchain);
  console.log("userObj", userObj);
  if (userObj == undefined) {
    resp.success = false;
    resp.message = "User not exist"
    return resp;
  }
  userObj = JSON.parse(userObj);

  let res = await bcrypt.compare(req.body.oldPassword, userObj.password);
  console.log(res);
  if (res) {
    userObj["password"] = req.body.password;
    console.log("pass", req.body.password)
    resp = await this.updateUser(userObj, userObj.userId, orgNameBlockchain);
    logger.debug('changeUserPassword - ****** After Update User', resp);
    if (resp.status == constants.SUCCESS) {
      let subject = constants.PASSWORD_CHANGE_SUBJECT;
      let text = constants.PASSWORD_CHANGE_TEXT;
      let respSendEmail = await emailUtils.sendEmail(userObj.email, subject, text);
      console.log("respSendEmail", respSendEmail);
      var emailSendResult = {};
      if (respSendEmail) {
        emailSendResult.success = true
        emailSendResult.message = "Email sent successfully.";
      } else {
        emailSendResult.success = false
        emailSendResult.message = "Failed to send email.";
      }
      return emailSendResult;
    }
  } else {
    var changePassResult = {};
    changePassResult.success = false
    changePassResult.message = "Please enter correct old password.";
    return changePassResult;
  }
  resp.message = "Password changed successfully"
  return resp;
};



const updateUser = async function (user, loggedInUser, orgName) {
  try {
    logger.debug('updateUser - ****** START %s', loggedInUser);
    var result = {};
    user.password = await helper.hashPassword(user)
    console.log("user.password", user.password)

    //Offchain Updation
    try {
      //Mongo Registration Organization
      await isConnected();

      var userUpdateOffchain = await User.findOneAndUpdate(
        { "userId": user.userId },
        { $set: { "password": user.password } },
        { new: true }
      );

      console.log("userUpdateOffchain", userUpdateOffchain)
      logger.debug('updateUser - ****** offchainUpdationResult %s', userUpdateOffchain);
      var updatedUserResult = {};

      //Onchain Updation Blockchain 
      let args = [JSON.stringify(user)]
      logger.debug('user - ****** START %s', args);
      let resultOnChain = await chaincodeRepo.invokeChaincode(peers, channelName, chaincodeName, "updateUser", args, loggedInUser, orgName);
      logger.debug('updateUser - ****** result %s', resultOnChain);
      updatedUserResult.onChainUpdate = resultOnChain;

      if (updatedUserResult.onChainUpdate.success) {
        result = await helper.parseResponse(constants.SUCCESS, constants.UPDATE_SUCCESS, "", 200);
      } else {
        result = await helper.parseResponse(false, constants.UPDATE_FAILED, "", 500);
        return result;
      }

    } catch (err) {
      logger.log('info', 'Error --> %s ', err.toString());
      let error = await helper.parseResponse(false, constants.USER_UPDATE_FAILED, "", 409);
      return error;
    }
    return result;
  }
  catch (err) {
    logger.log('info', 'Error --> %s ', err.toString());
    let error = await helper.parseResponse(false, constants.SERVER_ERROR, "", 500);
    return error;
  }
};

module.exports = {
  registerUser,
  authenticateUser,
  queryAllUsers,
  queryUserByID,
  queryUserByOrganizationID,
  queryUserByOrganizationName,
  queryUserByRole,
  checkUserExists,
  changeUserPassword,
  resetUserPassword,
  updateUser  
};
