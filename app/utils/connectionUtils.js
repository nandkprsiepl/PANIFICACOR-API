delete require.cache[require.resolve('./connectionUtils')]

const FabricCAServices = require('fabric-ca-client');
const {  CouchDBWallet } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const logsM = require('../utils/helper');
const logger = logsM.getLogger('connectionUtils');
const config = require('../../config.json');
const { Wallets } = require('fabric-network');


/**
 * Method to fetch the admin user details
 */
function getAdminDetails() {
    return config.admins[0];
}

function getAdminDetailsForOrg(orgName) {
    return config[orgName].admins[0];
}

function getConnectionPath(orgName){
  let conPath = null;
  try{
    const orgDetails = config[orgName];
    conPath = path.resolve(__dirname, '../'+orgDetails.ORG_CONN);
    logger.info('Connection Path: ' + conPath);
  } catch (error) {
    logger.error(`Failed to get connection details. Error:  ${error}`);
  }

  return conPath;
}

/**
 * Method to fetch the organization specific connection details
 * @param {*} orgName 
 */
function getConnectionDetails(orgName){
  let connDetails = null;
  try{
    const orgDetails = config[orgName];
    const conPath = getConnectionPath(orgName);
    logger.info('Connection Path: ' + conPath);
    const conJSON = fs.readFileSync(conPath, config.TYPE_UTF);
    connDetails = JSON.parse(conJSON);
  } catch (error) {
    logger.error(`Failed to get connection details. Error:  ${error}`);
  }

  return connDetails;
}

/**
 * Method to initialize and fetch teh CA service
 * @param {*} orgName 
 */
function getCAService(orgName){
  let ca = null;
  try{
    const orgDetails = config[orgName];

    const ccp = getConnectionDetails(orgName);
    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities[orgDetails.ORG_CA];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
  } catch (error) {
    logger.error(`Failed to get connection details. Error:  ${error}`);
  }
  return ca;
}

/**
 * Method to load the organization specific wallet
 * @param {*} orgName 
 */
async function getWallet(orgName,orgId){
  let wallet=null;
  try{
    //logger.info('Org name:', orgName);
    let orgDetails = config[orgName];
    if(orgDetails.WALLET_TYPE === "CouchDb"){
      wallet = new CouchDBWallet({url:orgDetails.APP_WALLETDB_URL});
      //logger.info('Wallet DB URL', orgDetails.APP_WALLETDB_URL);     
    }else{
      let walletPath = path.join(process.cwd()  , 'wallet' , orgName);
      if(orgId){
        walletPath = path.join(walletPath  ,  orgId);
      }
      logger.info('walletPath:', walletPath);
       wallet = await Wallets.newFileSystemWallet(walletPath);
    }
    // Connecting to DB Wallet store
  } catch (error) {
    logger.error(`Failed to get connection details. Error:  ${error}`);
  }
  return wallet;
}

module.exports = {
    getAdminDetailsForOrg,
    getAdminDetails,
    getConnectionDetails,
    getConnectionPath,
    getCAService,
    getWallet,
};