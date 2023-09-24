const chaincodeRepo = require('../dao/blockchainService');
const config = require('../../config.json');

const orgName = process.env.ORG_NAME || config.ORG_DETAILS.ORG_NAME
const channelName = process.env.CHANNEL_NAME || config.ORG_DETAILS.CHANNEL_NAME
const peers = process.env.PEERS || config.ORG_DETAILS.PEERS


const getTransactionByID = async function(req) {
    let result = await chaincodeRepo.getTransactions(peers[0], channelName, req.params.txId,req.userId,orgName);
    return result;
};


  module.exports = {
    getTransactionByID,
   };
  