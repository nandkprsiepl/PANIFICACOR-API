/**
 * This file helps to provide implementations to invoke chaincode transaction
 *
 * Below listed are the contributers
 * 
 */
delete require.cache[require.resolve('./../utils/fabricUtils')]

const util = require('util');
const logsM = require('../utils/helper');
const logger = logsM.getLogger('blockchainService');
const chaincodeUtil = require('./../utils/fabricUtils');
const constants = require('../utils/constants');
const config = require('../../config.json');
const asn = require('asn1.js');
const sha = require('js-sha256');


const invokeChaincode = async function(peerNames, channelName, chaincodeName, fcn, args, userId, orgName) {
  let count = 1;
  return await invokeChaincodeWithRetry(peerNames, channelName, chaincodeName, fcn, args, userId, orgName,count)
}
/**
 * Method to process the chaincode invocation request
 */
const invokeChaincodeWithRetry = async function(peerNames, channelName, chaincodeName, fcn, args, userId, orgName,count) {
  logger.debug(util.format('\n============ Invoke chaincode on channel %s ============\n', channelName));
  console.log("srgss111-->",args);

  let success = true; let message = null; let connector = null; let strTransId = null;
  try {
    // Get the network (channel) our contract is deployed to.
    connector = await chaincodeUtil.connectNetwork(userId, orgName, channelName);

    // Get the contract from the network.
    const contract = connector.network.getContract(chaincodeName);
    logger.debug('Requesting invoke chaincode transaction.');
    const trans = await contract.createTransaction(fcn);
    strTransId = trans.getTransactionId();
    logger.debug('TxId: ', strTransId);
    // Invoke ast creation transaction.
    console.log("srgss-->",args);
    await trans.submit(...args);
    logger.debug('Transaction Submitted.');
    //strTransId = trans.getTransactionID()[constants.SC_TRANS_ID_FIELD];

    success = true;
    message = util.format('Successfully invoked the chaincode %s to the channel \'%s\' for transaction ID: %s', orgName, channelName, strTransId);
    logger.debug(message);
  } catch (error) {
    success = false;

    logger.error('Invocation failed, due to following error: ' + error.stack ? error.stack : error);
    
      count = count + 1;
      logger.info("error invokeChaincode count",count)
      if(count < 5){
        logger.info("error invokeChaincode retrying ...")
        return await invokeChaincodeWithRetry(peerNames, channelName, chaincodeName, fcn, args, userId, orgName,count)
      }
      
    const errorMsg = error.toString();
    console.log("invoke chaincode*************", error, errorMsg)
    message = error.responses[0].response.message;
  } finally {
    chaincodeUtil.closeConnectors(connector);
  }

  // build a response to send back to the REST caller
  const response = {
    success: success,
    txId: strTransId,
    message: message
  };

  return response;
};

const queryChaincode = async function(peer, channelName, chaincodeName, args, fcn, userId, orgName) {
  let count = 1;
  return await queryChaincodeWithRetry(peer, channelName, chaincodeName, args, fcn, userId, orgName,count)
}

/**
 * Method to help to query a chaincode
 */
const queryChaincodeWithRetry = async function(peer, channelName, chaincodeName, args, fcn, userId, orgName,count) {
  logger.debug(util.format('\n============ Invoke chaincode on channel %s for Org %s ============\n', channelName, orgName));
  logger.debug('\n============ Params ============\n', fcn, args);
  let result = null; let connector = null;
  try {
    // Get the network (channel) our contract is deployed to.
    connector = await chaincodeUtil.connectNetwork(userId, orgName, channelName);

    // Get the contract from the network.
    const contract = connector.network.getContract(chaincodeName);

    // Evaluate the specified transaction.
    if (args && args.length > 0) {
      result = await contract.evaluateTransaction(fcn, ...args);
    } else {
      result = await contract.evaluateTransaction(fcn);
    }
    result = result.toString('utf8')
    console.log("result--->",result);
    
    logger.debug(`Query result is: ${JSON.stringify(result)}`);
      
    return result.toString('utf8');
  } catch (error) {
      logger.info("error querychaincode",error)
      //Retry in case of error
      count = count + 1;
      logger.info("error querychaincode count",count)
      if(count < 5){
        logger.info("error querychaincode retrying ...")
        return await queryChaincodeWithRetry(peer, channelName, chaincodeName, args, fcn, userId, orgName,count)
      }else{
        return error;
      }
      
      //Retry Finish
  } finally {
    //chaincodeUtil.closeConnectors(connector);
  }
};

async function queryWithPeer(peers, channelName, chaincodeName, args, fcn, userId, orgName){
    let connector = null;
    let channel = null;
    try {
            //client = await helper.getClientForOrg(org_name, username);
            connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
            channel = connector.channel;
            if(!channel) {
                    let message = util.format('Channel %s was not defined in the connection profile', channelName);
                    logger.error(message);
                    throw new Error(message);
            }

            // send query
            var request = {
                    targets : peers, //queryByChaincode allows for multiple targets
                    chaincodeId: chaincodeName,
                    fcn: fcn,
                    args: args
            };
            let response_payloads = await channel.queryByChaincode(request);
            if (response_payloads) {
              console.log("response_payloads",response_payloads)
                    for (let i = 0; i < response_payloads.length; i++) {
                            logger.info(args[0]+' now has ' + response_payloads[i].toString('utf8') +
                                    ' after the move');
                    }
                    return args[0]+' now has ' + response_payloads[0].toString('utf8') +
                            ' after the move';
            } else {
                    logger.error('response_payloads is null');
                    return 'response_payloads is null';
            }
    } catch(error) {
            logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
            return error.toString();
    } finally {
            if (channel) {
                    channel.close();
            }
    }

}

async function queryWithChannelPeers(peers, channelName, chaincodeName, args, fcn, userId, orgName){
  let connector = null;
  let channel = null;
  try {
          connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
          channel = connector.channel;
          if(!channel) {
                  let message = util.format('Channel %s was not defined in the connection profile', channelName);
                  logger.error(message);
                  throw new Error(message);
          }
          let channelPeers = channel.getChannelPeers();
          logger.info("peers-->",channelPeers);
          let peerNames = []
          channelPeers.forEach(peer => {
            peerNames.push(peer.getName())
          });

          var request = {targets:peerNames, chaincodeId:chaincodeName,fcn: fcn, args: args};
          let response_payloads = await channel.queryByChaincode(request);
          if (response_payloads) {
            let res = []
                  for (let i = 0; i < response_payloads.length; i++) {
                      res.push(response_payloads[i].toString('utf8'))
                  }
                  let {temperedObs,index} =  await compareProposalResponse(res);   
                  if(index != -1){
                    let ob ={}
                        ob.istempered =true;
                        ob.orgMSP = channelPeers[index].getMspid();
                        ob.peer =  channelPeers[index].getName();
                        ob.data = res[0]
                        return ob; 
                  }else{
                    let ob ={}
                        ob.istempered =false;
                        ob.data = res[0]
                        return ob;
                  } 
          } else {
                  logger.error('response_payloads is null');
                  return 'Internal Server Error';
          }
  } catch(error) {
          logger.error(error.stack ? error.stack : error);
          return error.toString();
  } finally {
          if (channel) {
                  channel.close();
          }
  }
}

async function compareProposalResponse(objs){
  let temperedObs = [];
  let index = -1;
  if(objs.length >= 3){
    for(let i=0;i<objs.length;i++){
      let count = 0
      let obj = objs[i];
      for(let j=0;j<objs.length;j++){
          if(j != i){
              if(obj == objs[j]){
                count++;
              }
          }
      }
      if(count == 0){
        temperedObs.push(obj)
        index = i;
        break;
      }
    }
  }
  logger.info("temperedObs",JSON.stringify(temperedObs));
  logger.info("index",index);
  return {temperedObs,index}
}

/**
 * This method helps to fetch the block by providing the transaction hash
 * @param {*} peerName
 * @param {*} channelName
 * @param {*} txHash
 * @param {*} userId
 * @param {*} orgName
 */
async function getBlockByTxHash(peerName, channelName, txHash, userId, orgName) {
  let connector = null;
  try {
    connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
    const peer = await chaincodeUtil.getPeer(connector.channel, peerName[0]);
    const blockInfo = await connector.channel.queryBlockByTxID(txHash, peer);
    logger.debug(`Block info: ${JSON.stringify(blockInfo)}`);
    return blockInfo;
  } catch (error) {
    logger.error(`Failed to get block by transaction hash: ${error}`);
    throw error;
  } finally {
    chaincodeUtil.closeConnectors(connector);
  }
}

/**
 * Method to help to fetch chain information
 * @param {*} peerName
 * @param {*} channelName
 * @param {*} userId
 * @param {*} orgName
 */
async function getChainInfo(peerName, channelName, userId, orgName) {
  let connector = null;
  try {
    connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
    const peer = await chaincodeUtil.getPeer(connector.channel, peerName);
    const chainInfo = await connector.channel.queryInfo(peer);
    logger.debug(`Chain info - Height: ${chainInfo.height}`);
    // eslint-disable-next-line no-self-assign
    chainInfo.height = chainInfo.height;
    logger.debug(`Chain info - Current Block Hash String: ${chainInfo.currentBlockHash.toString('hex')}`);
    chainInfo.currentBlockHash = chainInfo.currentBlockHash.toString('hex');
    logger.debug(`Chain info - Previous Block Hash String: ${chainInfo.previousBlockHash.toString('hex')}`);
    chainInfo.previousBlockHash = chainInfo.previousBlockHash.toString('hex');
    logger.debug(`Chain info - JSON: ${JSON.stringify(chainInfo)}`);
    return chainInfo;
  } catch (error) {
    logger.error(`Failed to get chain info: ${error}`);
    throw error;
  } finally {
    chaincodeUtil.closeConnectors(connector);
  }
};


/**
 * Method to help to fetch transaction by its Id
 * @param {*} peerName
 * @param {*} channelName
 * @param {*} trxnID
 * @param {*} userId
 * @param {*} orgName
 */
async function getTransactionByID(peerName, channelName, trxnID, userId, orgName) {
  let connector = null;
  try {
    connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
    const peer = await chaincodeUtil.getPeer(connector.channel, peerName);
    const transaction = await connector.channel.queryTransaction(trxnID, peer);
    logger.debug(`Transaction info: ${JSON.stringify(transaction)}`);

    return transaction;
  } catch (error) {
    logger.error(`Failed to get transaction by id: ${error}`);
    throw error;
  } finally {
    chaincodeUtil.closeConnectors(connector);
  }
};

/**
 * Method to help to fetch block by its hash
 * @param {*} peerName
 * @param {*} channelName
 * @param {*} blockHash
 * @param {*} userId
 * @param {*} orgName
 */
async function getBlockByHash(peerName, channelName, blockHash, userId, orgName) {
  let connector = null;
  try {
    // Get the channel from the network.
    connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
    const peer = await chaincodeUtil.getPeer(connector.channel, peerName[0]);
    const blockInfo = await connector.channel.queryBlockByHash(Buffer.from(blockHash, 'hex'), peer);
    logger.debug(`Block info: ${JSON.stringify(blockInfo)}`);
    return blockInfo;
  } catch (error) {
    logger.error(`Failed to get block by hash: ${error}`);
    throw error;
  } finally {
    chaincodeUtil.closeConnectors(connector);
  }
};

/**
 * Method to help to fetch block by its number
 * @param {*} peerName
 * @param {*} channelName
 * @param {*} blockNumber
 * @param {*} userId
 * @param {*} orgName
 */
async function getBlockByNumber(peerName, channelName, blockNumber, userId, orgName) {
  let connector = null;
  try {
    logger.info('Fetching Channel', userId, orgName, channelName);
    connector = await chaincodeUtil.getChannel(userId, orgName, channelName);
    const peer = await chaincodeUtil.getPeer(connector.channel, peerName);
    const blockInfo = await connector.channel.queryBlock(blockNumber, peer);
    logger.debug(`Block info: ${JSON.stringify(blockInfo)}`);

    return blockInfo;
  } catch (error) {
    logger.error(`Failed to get block by hash: ${error}`);
    throw error;
  } finally {
    chaincodeUtil.closeConnectors(connector);
  }
}

/**
 * Method to fetch the on-chain specific range of blocks
 * @param {*} org
 * @param {*} token
 * @param {*} startBlockNo
 * @param {*} endBlockNo
 */
async function queryBlocks(org, userId, startBlockNo, endBlockNo) {
  logger.info(`OnChain getBlocks Org : ${org}, startBlockNo: ${startBlockNo}, endBlockNo: ${endBlockNo}`);
  const orgDetails = config[org];

  const channel = config.channelName;
  const peer = orgDetails.PEER0_WITHPORT;

  const blocks = [];
  const transactions = [];

  // eslint-disable-next-line no-plusplus
  for (let i = startBlockNo; i <= endBlockNo; i++) {
    const response = await this.getBlockByNumber(peer, channel, i, userId, org);

    const transResults = response.data.data;

    const transIds = [];
    let transCount = transResults.length;
    let txtStatus = false;
    logger.debug('Trans Count: ', transCount);

    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < transResults.length; j++) {
      logger.debug('Trans data: ', transResults[j]);

      const txId = transResults[j].payload.header.channel_header.tx_id;
      logger.debug('Trans Header: ', transResults[j].payload.header.channel_header);
      const { timestamp } = transResults[j].payload.header.channel_header;

      if (txId !== '' && txId !== undefined) {
        txtStatus = true;
        const transData = await getTransactions(peer, channel, transResults[j].payload.header.channel_header.tx_id, userId, org);
        transData.mspId = transResults[j].payload.header.signature_header.creator.Mspid;
        transData.cert = transResults[j].payload.header.signature_header.creator.IdBytes;
        transData.timestamp = timestamp;
        transData.blockNumber = response.header.number;

        transactions.push(transData);
        transIds.push(transData.txId);
      }
    }

    transCount = (txtStatus === true ? transCount : 0);

    const blockData = {
      blockNumber: response.header.number,
      prevBlockHash: response.header.previous_hash,
      // eslint-disable-next-line no-use-before-define
      currentBlockHash: calculateBlockHash(response.header),
      txCount: transCount,
    };

    logger.info(`OnChain fetched block ${i} transaction count: `, transCount);

    blocks.push(blockData);
  }

  return { blocks, transactions };
}


/**
 * Method to fetch the on-chain transaction
 * @param {*} org
 * @param {*} token
 * @param {*} txId
 */
async function getTransactions(peer, channel, txId, userId, org) {
  // logger.info('OnChain getTransactions Org : '+org+', txId: '+ txId);
  const response = await getTransactionByID(peer, channel, txId, userId, org);
  // eslint-disable-next-line max-len
  const rwset = response.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset;

  const transData = {};
  transData.txId = txId;
  transData.payloads = [];
  transData.creater = response.transactionEnvelope.payload.header.signature_header.creator.Mspid;
  transData.channel = response.transactionEnvelope.payload.header.channel_header.channel_id;
  transData.timestamp = response.transactionEnvelope.payload.header.channel_header.timestamp;
  transData.type = response.transactionEnvelope.payload.header.channel_header.typeString;
  transData.proposal_hash = response.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.proposal_hash;
  transData.chaincode_id = response.transactionEnvelope.payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name;
  transData.endorsers = response.transactionEnvelope.payload.data.actions[0].payload.action.endorsements;

  // eslint-disable-next-line no-plusplus
  for (let k = 0; k < rwset.length; k++) {
    const transPayload = {};
    transPayload.smartContract = rwset[k].namespace;
    transPayload.reads = rwset[k].rwset.reads;
    transPayload.writes = rwset[k].rwset.writes;
    //if (config.ACTIVATE_STATEDB_SYNC === 1) {
      transPayload.stateData = await getStateData(org, userId, transPayload.smartContract, transPayload.writes);
    //}
    transData.payloads.push(transPayload);
  }

  return transData;
}

/**
 * Method to fetch the on-chain transaction
 * @param {*} org
 * @param {*} token
 * @param {*} txId
 */
async function getStateData(org, userId, smartContract, writes) {
  let stateData = null;

  const orgDetails = config[org];
  const channel = config.CHANNEL;

  if (writes !== undefined && writes.length > 0) {
    let writesValue = null;
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < writes.length; j++) {
      writesValue = writes[j].value;
      if (writesValue !== undefined && (writesValue.indexOf('assetType') >= 0 || writesValue.indexOf('docType') >= 0)) {
        const data = JSON.parse(writes[j].value);
        const docType = (data.assetType !== undefined ? data.assetType : data.docType);
        const idFieldName = schemaUtil.getAssetIdFieldName(docType);
        const id = data[idFieldName];

        const args = [id];
        const peer = orgDetails.PEER0_WITHPORT;
        let fcn = 'query';

        if (docType.toLowerCase() === 'car') {
          fcn = 'queryAssetById';
        }

        stateData = await transactionRepo.queryChaincode(peer, channel, smartContract, args, fcn, userId, org);

        break;
      }
    }
  }

  return stateData;
}


/**
 * Method to calculate the block hash based on header
 * @param {*} header
 */
function calculateBlockHash(header) {
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

/**
 * Method to fetch the on-chain block height
 * @param {*} org
 * @param {*} token
 */
async function getBlockHeight(org, userId,channel) {
  const orgDetails = config[org];

  logger.info('OnChain Chain Info for OrgName: ', org);

  const peer = orgDetails.PEER0_WITHPORT;

  const response = await this.getChainInfo(peer, channel, userId, org);

  logger.info('OnChain Chain Info Response: ', response);

  let blockHeight = null;
  if (response !== undefined && response.height !== undefined) {
    const height = response.height.low;
    const { currentBlockHash } = response;
    const { previousBlockHash } = response;

    blockHeight = { height, currentBlockHash, previousBlockHash };
  }

  return blockHeight;
}

module.exports = {
  invokeChaincode,
  queryChaincode,
  getBlockByTxHash,
  getBlockByNumber,
  getBlockByHash,
  getTransactionByID,
  getChainInfo,
  getBlockHeight,
  getTransactions,
  queryBlocks,
  queryWithPeer,
  queryWithChannelPeers,
  compareProposalResponse
};
