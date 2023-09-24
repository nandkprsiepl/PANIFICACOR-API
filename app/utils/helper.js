const log4js = require('log4js');
const config = require('../../config.json');
var dateFormat = require("dateformat");
var moment = require('moment');
const emailUtils = require('./emailUtils');
const constants = require('./constants');
const bcrypt = require('bcrypt');
const asn = require('asn1.js');
const sha = require('js-sha256');
const userService = require('../service/userService')

const getLogger = function(moduleName) {
  const logger = log4js.getLogger(moduleName);
  logger.setLevel(config.LOG_LEVEL);
  return logger;
};

const convertTimestamptoMS = async function(timestamp){
  return new Date(timestamp).getTime();
}

const convertMStoTimestamp = async function(ms){
  const DATE_FORMAT = "dd/mmm/yyyy hh:mm:ss"
  return dateFormat(ms, DATE_FORMAT, true)
}

const isvalidDateFormat = async function(date){
  const DATE_FORMAT = ["DD-MMM-YYYY","DD-MMM-YYYY HH:mm:ss"]
  return moment(date,DATE_FORMAT,true).isValid()
}

const validateEmail =  async function(email){
  let result = {}
  var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(emailRegex)){
      result.success = false
      result.message = "Please enter a valid Email ID : " +email;
    }else{
      result.success = true;
    }
    return result;
}

const validatePhone =  async function(phone){
  let result = {}
  var phoneRegex = /^\d{10,20}$/;
  if(!(phone.toString()).match(phoneRegex)){
    result.success = false
    result.message = "Please enter a valid Phone Number : " +phone;
  }else{
    result.success = true;
  }
  return result;
}

const validateIdWhiteSpace =  async function(id){
  let result = {}
    if(id.indexOf(' ') >= 0){
      result.success = false
      result.message = "User id should not contain whitespace characters : " + id;
    }else{
      result.success = true;
    }
    return result;
}

const validateOrgIdWhiteSpace =  async function(id){
  let result = {}
    if(id.indexOf(' ') >= 0){
      result.success = false
      result.message = "Organization id should not contain whitespace characters : " + id;
    }else{
      result.success = true;
    }
    return result;
}

const sendOnboardingMail = async function(user,password){
  let subject = constants.USER_ONBOARD_SUBJECT;
  let loginUrl =  config.LOGIN_URL
  let text =  "Dear "+ user.userName +", \n You have joined the Smartbolt as "
  +user.role+". \n Your User Id is: "+user.email
  +" and password is : "+password
  +"\n Regards, \n "
  +"  firstgen.io  \n This is system generated email. Please do not reply.";
  
  console.log('Calling sendOnboardingMail %s',user);
      //let text = constants.USER_ONBOARD_TEXT;
      let result = {}
      let respSendEmail = await emailUtils.sendEmail(user.email, subject, text);
      if (respSendEmail) {
        result.success = true;
        result.message = result.message+" and email sent successfully.";
      }
}

const sendOnboardingMails = async function(users,loggedInUser){
  let result = []
  for (i = 0; i < users.length; i++) {  
    let sendMailResult = await sendOnboardingMail(users[i],loggedInUser)
    result.push(sendMailResult);
  }
  return result;
}

const hashPassword = async function (user) {
  const password = user.password
  const saltRounds = 10;
  //console.log(password);
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })
  return hashedPassword;
}

const parseBlockData = async function(block){
  let blockDetails = {}
  blockDetails.blockNumber = block.header.number;
  blockDetails.previous_hash = block.header.previous_hash;
  blockDetails.data_hash = block.header.data_hash;

  let channelHeader = block.data.data[0].payload.header.channel_header;
  blockDetails.timestamp = channelHeader.timestamp;
  blockDetails.channel_id = channelHeader.channel_id;
  blockDetails.type = channelHeader.typeString;
  blockDetails.txCount = block.data.data.length;
  blockDetails.blockHash = await calculateBlockHash(block.header);
  blockDetails.txIds = [];
  const transResults = block.data.data;
  for (let j = 0; j < transResults.length; j++) {
    let txId = transResults[j].payload.header.channel_header.tx_id;
    blockDetails.txIds.push(txId)
  }

  return blockDetails;
}

const parseResponse = async function (successResp, msg, respObj, statusCode ) {
  let result = {};
  result.success = successResp;
  result.message = msg;
  // result.status = statusCode;
  // result.response = respObj;

  if(respObj != "") {
    result.data = respObj;
  }
  return result;
}

/**
 * Method to calculate the block hash based on header
 * @param {*} header
 */
let calculateBlockHash = async function(header) {
  // eslint-disable-next-line func-names
  const headerAsn = asn.define('headerAsn', function () {
    this.seq().obj(
      this.key('Number').int(),
      this.key('PreviousHash').octstr(),
      this.key('DataHash').octstr(),
    );
  });

  const output = headerAsn.encode({
    // eslint-disable-next-line radix
    Number: parseInt(header.number),
    PreviousHash: Buffer.from(header.previous_hash, 'hex'),
    DataHash: Buffer.from(header.data_hash, 'hex'),
  }, 'der');
  const hash = sha.sha256(output);

  return hash;
}



module.exports = {
  getLogger,
  convertTimestamptoMS,
  convertMStoTimestamp,
  isvalidDateFormat,
  validateEmail,
  validatePhone,
  sendOnboardingMails,
  hashPassword,
  validateIdWhiteSpace,
  sendOnboardingMail,
  validateOrgIdWhiteSpace,
  parseBlockData,
  parseResponse
};
