/**
 * This file helps to provide implementations to invoke chaincode transaction
 *
 * Below listed are the contributers
 * 
 */

const { X509WalletMixin } = require('fabric-network');
const chaincodeUtil = require('./../utils/fabricUtils');
const connectionUtil = require('./../utils/connectionUtils');
const logsM = require('../utils/helper');
const logger = logsM.getLogger('userRepo');
const config = require('../../config.json');

/**
 * Method to enroll organiztion specific admin identity
 * @param {*} orgName
 */
async function enrollAdminIdentity(orgName) {
  const response = null;
  let adminUser = null;
  let status = false;
  try {
    const orgDetails = config[orgName];
    if(config.env != "Azure"){
      adminUser = connectionUtil.getAdminDetailsForOrg(orgName);
    }else{
      adminUser = connectionUtil.getAdminDetails();
    }    

   // Check If Admin User Exist return else create Admin User
      const wallet = await connectionUtil.getWallet(orgName);
      const adminExists = await wallet.get(adminUser.username);
      if (adminExists) {
        logger.info('An identity for the admin user ' + adminUser.username + ' exists in the wallet');
        status = true;
        return status;
      } 
  
    const ca = connectionUtil.getCAService(orgName);

    if(config.env == "Azure"){   
      const certBase64 = new Buffer(adminUser.cert, 'base64');
      const keyBase64 = new Buffer(adminUser.private_key, 'base64');
      const adminUserIdentity = X509WalletMixin.createIdentity(adminUser.msp_id, certBase64.toString('ascii'), keyBase64.toString('ascii'));
      await wallet.import(adminUser.username, adminUserIdentity);
    }else{
      const enrollment = await ca.enroll({ enrollmentID: adminUser.username, enrollmentSecret: adminUser.secret });
      console.log("enrollment",enrollment);
      // const identity = X509WalletMixin.createIdentity(orgDetails.ORG_MSP, enrollment.certificate, enrollment.key.toBytes());
      // await wallet.import(adminUser.username, identity);

        const x509Identity = {
          credentials: {
              certificate: enrollment.certificate,
              privateKey: enrollment.key.toBytes(),
          },
          mspId: orgDetails.ORG_MSP,
          type: 'X.509',
        };
       await wallet.put(adminUser.username, x509Identity);
    }

    status = true;
    logger.info('Successfully enrolled admin user "' + adminUser.username + '" and imported it into the wallet');
  } catch (error) {
    logger.error(response.message);
  } 
  return status;
}

/**
 * Method to create user details
 */
function createUserDetails(user) {
  const attributes = [{ name: 'hf.Registrar.Roles', value: user.role },
  { name: 'username', value: user.username },
  { name: 'role', value: user.role },
  { name: 'firstName', value: user.firstName },
  { name: 'lastName', value: user.lastName },
  { name: 'orgName', value: user.orgName }];

  return {
    affiliation: user.orgName.toLowerCase() + config.AFFILIATION_DEPT,
    enrollmentID: user.username,
    role: user.role,
    attrs: attributes
  }
}

/**
 * Method to register organization specific user 
 * @param {*} user 
 */
async function registerUser(user) {
  let gateway = null;
  let response = null;
  try {
      user.username = user.userId;
      user.role = user.role;
    const orgDetails = config[user.orgType];
    const ca = connectionUtil.getCAService(user.orgType);
    let adminUser = connectionUtil.getAdminDetailsForOrg(user.orgType);

    // Check to see if we've already enrolled the user.
    const wallet = await connectionUtil.getWallet(user.orgType);
    const userExists = await wallet.get(user.username);
    if (userExists) {
      logger.info('An identity for the user ' + user.username + ' already exists in the wallet');
      throw new Error('An identity for the user ' + user.username + ' already exists in the wallet');
    }
    //Enrolling Admin Identity if not exist    
    await enrollAdminIdentity(user.orgType);
 
    // Fetch Admin identity from wallet
    const adminIdentity = await wallet.get(adminUser.username);
    if (!adminIdentity) {
      logger.info('An identity for the admin user "admin" does not exist in the wallet');
      throw new Error('An identity for the user ' + adminUser.username + ' not exists in the wallet');
    }
    // Create the user details
    const userDetails = createUserDetails(user);
    logger.info('Init user details for identity:', userDetails);

    // Fetching the admin user context
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUserObj = await provider.getUserContext(adminIdentity, adminUser.username);
    logger.info('Admin user context ', adminUserObj);

    // Register the user, enroll the user, and import the new identity into the wallet.
    let secret = null;
    try{
      secret = await ca.register(userDetails, adminUserObj);
    }
    catch(regError){
        console.log("regError",regError)
      let errorMessage = JSON.stringify(regError);
      console.log("errorMessage",errorMessage)

      if(errorMessage.indexOf('is already registered')<0){
        logger.error("Error Faced: ", regError);
        logger.info("Adding new affiliation");
        const affService = await ca.newAffiliationService()
        await affService.create({ "name": user.orgName.toLowerCase() }, adminUserObj);
        await affService.create({ "name": user.orgName.toLowerCase()+config.AFFILIATION_DEPT }, adminUserObj);
        secret = await ca.register(userDetails, adminUserObj);
      }
    }
    
    const enrollment = await ca.enroll({ enrollmentID: user.username, enrollmentSecret: secret });
    logger.info("Enrollment complete");

    const x509Identity = {
      credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
      },
      mspId: orgDetails.ORG_MSP,
      type: 'X.509',
  };
  await wallet.put(user.username, x509Identity);

    response = {
      success: true,
//      secret: secret,
//    user: user,
      message: user.username + ' enrolled Successfully'
    };
  } catch (error) {
    console.log("error",error);
    response = {
      message: `Failed to register user "${user.username}": ${error}`,
      success: false
    };

    logger.error(response.message);
    throw new Error(response.message);
  } finally {
    if (gateway) {
      gateway.disconnect();
    }
  }

  return response;
}

module.exports = {
  registerUser,
  enrollAdminIdentity
};
