
const { Gateway } = require('fabric-network');
const path = require('path');
const constants = require('./constants');
const logsM = require('../utils/helper');
const connectionUtil = require('./connectionUtils');
const logger = logsM.getLogger('fabricUtils');
const config = require('../../config.json');

/**
 * Method to connect gateway
 * @param {*} userId 
 * @param {*} orgName 
 */
async function connectGateway(userId, orgName) {
  try {
    const wallet = await connectionUtil.getWallet(orgName);
    logger.info('wallet:', wallet);
    logger.info('userId:', userId);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.get(userId);
    if (!userExists) {
      logger.info('An identity for the user "' + userId + '" does not exist in the wallet');
      logger.info('Run the registerUser.js application before retrying');
      return;
    }

    const connDetails = connectionUtil.getConnectionDetails(orgName);
    console.log("connDetails-->>",connDetails)
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(connDetails, { wallet, identity: userId, discovery: { enabled: true, asLocalhost: true } });

    logger.info('Gateway Connected');

    return gateway;
  } catch (error) {
    logger.error(`Failed to connect gateway: ${error}`);
    throw error;
  }
}

/**
 * Method to connect network
 * @param {*} userId 
 * @param {*} orgName 
 * @param {*} strChannelName 
 */
async function connectNetwork(userId, orgName, strChannelName) {
  try {
    const gateway = await connectGateway(userId, orgName);
    
    logger.info('Network connection request for channel: %s', strChannelName)

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(strChannelName);

    logger.info('Network Connected for channel: %s', strChannelName);

    return { gateway, network };
  } catch (error) {
    logger.error(`Failed to connect network: ${error}`);
    throw error;
  }
}

/**
 * Method to connect peer
 * @param {*} channel 
 * @param {*} peerName 
 */
async function getPeer(channel, peerName) {
  try {
    const channelPeer = channel.getPeer(peerName);
    const peer = await channelPeer.getPeer();
    logger.info('Fetched Peer : ' + peer.getName());

    return peer;
  } catch (error) {
    logger.error(`Failed to get peer: ${error}`);
    throw error;
  }
}

/**
 * Method to get peers
 * @param {*} channel 
 * @param {*} peerNames 
 */
async function getPeers(channel, peerNames) {
  try {
    const peers = [];
    for (let i = 0; i < peerNames.length; i++) {
      const channelPeer = channel.getPeer(peerNames[i]);
      const peer = await channelPeer.getPeer();
      peers.push(peer);
      logger.info('Fetched Peer : ' + peer.getName());
    }

    return peers;
  } catch (error) {
    logger.error(`Failed to get peer: ${error}`);
    throw error;
  }
}

/**
 * Method to connect channel
 * @param {*} userId 
 * @param {*} orgName 
 * @param {*} channelName 
 */
async function getChannel(userId, orgName, channelName) {
  try {
    // Get the network (channel) our contract is deployed to.
    const { gateway, network } = await connectNetwork(userId, orgName, channelName);
    logger.info('Network Initialized');
    // Get the contract from the network.
    const channel = await network.getChannel();
    logger.info('Channel %s initialized', channelName);

    return { gateway, network, channel };
  } catch (error) {
    logger.error(`Failed to initialize channel: ${error}`);
    throw error;
  }
}

/**
 * Method to connect client
 * @param {*} userId 
 * @param {*} orgName 
 */
async function connectClient(userId, orgName) {
  try {
    const gateway = await connectGateway(userId, orgName);
    logger.info('Gateway received: ' + gateway.toString());

    // Get the network (channel) our contract is deployed to.
    const client = await gateway.getClient();
    // logger.info('Client fetched from gateway: ', client);

    return { gateway, client };
  } catch (error) {
    logger.error(`Failed to connect client: ${error}`);
    throw error;
  }
}

/**
 * Method to close gateway
 * @param {*} gateway 
 */
function closeGateway(gateway) {
  if (gateway) {
    gateway.disconnect();
    logger.info('Closing Gateway!');
  }
}

/**
 * Method to close channel
 * @param {*} channel 
 */
function closeChannel(channel) {
  if (channel) {
    channel.close();
    logger.info('Closing Channel!');
  }
}

/**
 * Method to close multiple connectors
 * @param  {...any} connectors 
 */
function closeConnectors(...connectors) {
  if (connectors && connectors.length > 0) {
    for (let i = 0; i < connectors.length; i++) {
      const connector = connectors[i];
      if (connector && connector.channel) {
        closeChannel(connector.channel);
      }
      if (connector && connector.gateway) {
        closeGateway(connector.gateway);
      }
    }
  }
}

/**
 * Method to get chaincode path
 * @param {*} ccName 
 * @param {*} ccType 
 */
function getChainCodePath(ccName, ccType) {
  return constants.APP_SC_PATH + ccName + '/' + ccType;
}

module.exports = {
  connectGateway,
  connectNetwork,
  connectClient,
  getPeer,
  getChannel,
  closeConnectors,
  closeGateway,
  getPeers,
  getChainCodePath
};
