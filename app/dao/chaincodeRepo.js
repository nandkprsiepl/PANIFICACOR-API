/**
 * This file helps to provide implementations to invoke chaincode transaction
 *
 * Below listed are the contributers
 */

const util = require('util');
const logsM = require('../utils/logsM');
const logger = logsM.getLogger('ChaincodeRepo');
const chaincodeUtil = require('../utils/fabricUtils');
const constants = require('../utils/constants');
const config = require('../config.json');


/**
 * Method to help to fetch instantiated chaincodes
 */
const getInstantiatedChaincodes = async function(peerName, channelName, userId, orgName) {
  let connector = null;
  try {
    // Get the network (channel) our contract is deployed to.
    connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
    const peer = await chaincodeUtil.getPeer(connector.channel, peerName);
    const instChaincodes = await connector.channel.queryInstantiatedChaincodes(peer);
    const chaincodes = instChaincodes.chaincodes;   
    for (let i = 0; i < chaincodes.length; i++) {
      logger.info('======================== Start Instantiated Chaincode ' + i + ' ========================');
      logger.info(`Chaincode Name: ${chaincodes[i].name}`);
      logger.info(`Chaincode Version: ${chaincodes[i].version}`);
      logger.info('======================== End Instantiated Chaincode ' + i + ' ========================');
    }
    return chaincodes;
  } catch (error) {
    logger.error(`Failed to get instantiated chaincodes: ${error}`);
    throw error;
  } finally {
    chaincodeUtil.closeConnectors(connector);
  }
};

/**
 * Method to help to fetch installed chaincodes
 */
const getInstalledChaincodes = async function(peerName, channelName, type, userId, orgName) {
  try {
    return getInstantiatedChaincodes(peerName, channelName, type, userId, orgName);
  } catch (error) {
    logger.error(`Failed to get installed chaincodes: ${error}`);
    throw error;
  }
};

/**
 * Install chaincode on Peer
 */
const installChaincode = async function(peers, chaincodeName, chaincodePath,chaincodeVersion, chaincodeType, userId, orgName) {
  logger.debug('\n\n============ Install chaincode on organizations ============\n');

  let errorMsg = null;
  let gateway = null;
  try {
    logger.info('Calling peers in organization "%s" to join the channel', orgName);

    // Connecting to the gateway.
    gateway = await chaincodeUtil.connectGateway(userId, orgName);
    const client = gateway.getClient();
    logger.debug('Successfully got the fabric client for the organization "%s"', orgName);
    
    let chaincodes = await getInstantiatedChaincodes(peers[0], config.channelName, userId, orgName)
    let version = await getVersion(chaincodes,chaincodeName);
    chaincodeVersion = version != null  ? version.toString() : chaincodeVersion

    const request = {
      targets: peers,
      chaincodePath: chaincodePath,
      chaincodeId: chaincodeName,
      chaincodeVersion: chaincodeVersion,
      chaincodeType: chaincodeType
    };
    logger.debug('Request Params:', request);

    const results = await client.installChaincode(request);

    logger.debug('Installed');

    const responseState = await isResponseValid(results[0], constants.CC_INSTALL);

    logger.debug('Response: ', responseState);

    if (!responseState.success) { errorMsg = responseState.errorMsg; }
  } catch (error) {
    logger.error('Failed to install due to error: ' + error.stack ? error.stack : error);
    errorMsg = error.toString();
  } finally {
    chaincodeUtil.closeGateway(gateway);
  }

  return processResponse(errorMsg, constants.CC_INSTALL);
};

const getVersion = async function(chaincodes,chaincodename){
  let version = null;
  for(i=0;i<chaincodes.length;i++){
    if(chaincodes[i].name  == chaincodename){
      version = chaincodes[i].version;
      version = parseInt(version)+1;
    }
  }
  return version;
}

/**
 * Method to perform instantiation the requested chaincode
 */
const instantiateChaincode = async function(peers, channelName, chaincodeName, chaincodeVersion,
  functionName, chaincodeType, args, userId, orgName, policy) {
  return deployChaincode(constants.CC_INSTANTIATE, peers, channelName, chaincodeName, chaincodeVersion,
    functionName, chaincodeType, args, userId, orgName, policy);
};

/**
 * Method to perform upgrade the requested chaincode
 */
const upgradeChaincode = async function(peers, channelName, chaincodeName, chaincodeVersion,
  functionName, chaincodeType, args, userId, orgName, policy) {
  return deployChaincode(constants.CC_UPGRADE, peers, channelName, chaincodeName, chaincodeVersion,
    functionName, chaincodeType, args, userId, orgName, policy);
};

/**
 * Method to perform instantiation or upgrade of the requested chaincode
 */
const deployChaincode = async function(deployType, peers, channelName, chaincodeName, chaincodeVersion, functionName, chaincodeType, args, userId, orgName, policy) {
  logger.debug('\n\n============ ' + deployType + ' chaincode on channel ' + channelName + ' ============\n');
  let errorMsg = null;
  let client = null;
  let channel = null;
  let connector = null;
  try {
    // first setup the client for this org

    connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
    client = connector.gateway.getClient();
    logger.debug('Successfully got the fabric client for the organization "%s"', orgName);

    channel = connector.channel;
    if (!channel) {
      const message = util.format('Provided channel name %s was not defined in the connection profile', channelName);
      logger.error(message);
      throw new Error(message);
    }
    const transId = client.newTransactionID(true);
    const deployId = transId.getTransactionID();

    let chaincodes = await getInstantiatedChaincodes(peers[0], channelName, userId, orgName)
    let version = await getVersion(chaincodes,chaincodeName);
      chaincodeVersion = version != null  ? version.toString() : chaincodeVersion
      //For scripts
      if(version != null){
        deployType = constants.CC_UPGRADE;
      }

    // Preparing request for endorsement
    const request = {
      targets: peers,
      chaincodeId: chaincodeName,
      chaincodeType: chaincodeType,
      chaincodeVersion: chaincodeVersion,
      args: args,
      txId: transId,
      'endorsement-policy': policy
    };

    if (functionName) { request.fcn = functionName; }

    let results = [];

    console.log('Look at this request:', request);

    if (deployType === constants.CC_INSTANTIATE) {
      results = await connector.channel.sendInstantiateProposal(request, config.CC_TIMEOUT); // instantiate takes much longer
    } else {
      results = await connector.channel.sendUpgradeProposal(request, config.CC_TIMEOUT); // upgrade takes much longer
    }

    // Validating the responses
    const responseState = await isResponseValid(results[0], deployType);

    if (!responseState.success) {
      errorMsg = responseState.errorMsg;
    } else {
      errorMsg = await processEventResults(channel, deployId, responseState.success, results, orgName, deployType, transId);
    }
  } catch (error) {
    logger.error('Failed to send ' + deployType + ' due to error: ' + error.stack ? error.stack : error);
    errorMsg = error.toString();
  } finally {
    chaincodeUtil.closeConnectors(connector);
  }

  return processResponse(errorMsg, deployType);
};

/**
 * Method to check whether the proposal responses are valid
 */
const isResponseValid = async function(proposalResponses, proposalType) {
  let success = false;
  let errorMsg = null;
  for (const i in proposalResponses) {
    if (proposalResponses[i] instanceof Error) {
      errorMsg = util.format('%s proposal resulted in an error :: %s', proposalType, proposalResponses[i].toString());
      logger.error(errorMsg);
      break;
    } else if (proposalResponses[i].response && proposalResponses[i].response.status === 200) {
      logger.info('%s proposal was good', proposalType);
      success = true;
    } else {
      errorMsg = util.format('%s proposal was bad for an unknown reason %j', proposalType, proposalResponses[i]);
      logger.error(errorMsg);
      break;
    }
  }

  return { success, errorMsg };
};

/**
 * Method to process the response
 */
const processResponse = function(errorMsg, processType) {
  let message = util.format('Chaincode %s Successfull', processType);
  let success = true;
  if (!errorMsg) {
    logger.info(message);
  } else {
    success = false;
    message = util.format('Chaincode %s failed. Reason: %s', processType, errorMsg);
    logger.error(message);
  }

  const response = {
    success: success,
    message: message
  };

  return response;
};

/*
* Method to create timeout
*/
const createTimeout = async function(eh) {
  return setTimeout(() => {
    const message = 'Faced Request Timeout:' + eh.getPeerAddr();
    logger.error(message);
    eh.disconnect();
  }, config.CC_EVENT_TIMEOUT);
};

/**
 * Method to process the results of the events
 */
const processEventResults = async function(channel, deployId, validResponse, responses, orgName, deployType, transId) {
  let errorMsg = null;

  const proposalResponses = responses[0];
  const proposal = responses[1];
  if (validResponse) {
    logger.info(util.format(
      'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
      proposalResponses[0].response.status, proposalResponses[0].response.message,
      proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));

    //Validating using event hub to check whether transaction was committed to peers
    const promises = [];
    const eventHubs = channel.getChannelEventHubsForOrg();
    logger.debug('Event hub count is %s for organization %s', eventHubs.length, orgName);
    eventHubs.forEach((eh) => {
      const deploymentEventPromise = new Promise((resolve, reject) => {
        logger.debug(deployType + ' event');
        const eventTimeout = createTimeout(eh);
        eh.registerTxEvent(deployId, (tx, code, blockNumber) => {
          logger.info(deployType + ' chaincode transaction is now committed on peer %s', eh.getPeerAddr());
          logger.info('Transaction %s has status of %s in blocl %s', tx, code, blockNumber);
          clearTimeout(eventTimeout);

          if (code !== 'VALID') {
            const message = util.format(deployType + ' chaincode transaction is invalid, code:%s', code);
            logger.error(message);
            reject(new Error(message));
          } else {
            const message = deployType + ' chaincode transaction was valid.';
            logger.info(message);
            resolve(message);
          }
        }, (err) => {
          clearTimeout(eventTimeout);
          logger.error(err);
          reject(err);
        },
        { unregister: true, disconnect: true }
        );
        eh.connect();
      });
      promises.push(deploymentEventPromise);
    });

    const sendPromise = await sendRequestToOrderer(channel, transId, proposalResponses, proposal);
console.log("sendPromise--->",sendPromise);
    promises.push(sendPromise);

    // Resolving all the promises
    const results = await Promise.all(promises);

    logger.debug(util.format('========== ORDERER REQUEST RESULTS : %j', results));
    //  orderer results are last in the results
    const response = results.pop();
    if (response.status === 'SUCCESS') {
      logger.info('Transaction Sent to Orderer Successfully');
    } else {
      errorMsg = util.format('Ordering of transaction failed. Error code: %s', response.status);
      logger.debug(errorMsg);
    }

    // Validating all event hub responses
    errorMsg = await processEventResponse(results, eventHubs, errorMsg);
  }

  return errorMsg;
};

/*
* Method to process the event response
*/
const processEventResponse = async function (results, eventHubs, errorMsg) {
  for (const i in results) {
    const eventHubResponse = results[i];
    const eventHub = eventHubs[i];
    logger.debug('Response for event hub :%s', eventHub.getPeerAddr());
    if (typeof eventHubResponse === 'string') {
      logger.debug(eventHubResponse);
    } else {
      if (!errorMsg) {
        errorMsg = eventHubResponse.toString();
      }
      logger.debug(eventHubResponse.toString());
    }
  }
  return errorMsg;
};

/*
* Method to send the request to orderer
*/
const sendRequestToOrderer = async function(channel, transId, proposalResponses, proposal) {
  const ordererRequest = {
    txId: transId,
    proposalResponses: proposalResponses,
    proposal: proposal
  };

  return channel.sendTransaction(ordererRequest);
};

exports.instantiateChaincode = instantiateChaincode;
exports.installChaincode = installChaincode;
exports.upgradeChaincode = upgradeChaincode;
