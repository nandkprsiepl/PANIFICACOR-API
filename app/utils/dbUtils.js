/**
 * 
 * Below listed are the contributers
 * ====================================================================
 * Tarun kumar
 * 
 */

const helper = require('./helper');
const logger = helper.getLogger('dbUtils');
const mongoose = require('mongoose');
const constants = require('./constants');
const config = require('../../config.json');

/**
 * Method to verify that the initialized db connected
 */
async function initMongo() {
  if (!(mongoose.connection.readyState === 1)) {
    logger.info('Connecting service db connection');
    console.log("config.MONGO_URL_SERVICE",config.MONGO_URL_SERVICE)
    console.log("config.OPTS",config.OPTS)

    try {
        await mongoose.connect(config.MONGO_URL_SERVICE, config.OPTS);
        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }

  }
}

function getConnection() {
   return mongoose.connect(config.MONGO_URL_SERVICE, config.OPTS);
}

/**
 * Method to verify db connection
 */
async function isConnected() {
  await initMongo();
  console.log("mongoose.connection.readyState",mongoose.connection.readyState)
  if (mongoose.connection.readyState !== 1) {
    logger.info(constants.SERVICE_DB_CONN_ERROR_MESSAGE);
    throw Error(constants.SERVICE_DB_CONN_ERROR_MESSAGE);
  }
}

async function closeConnection() {
  mongoose.connection.close();
}

module.exports = {
  isConnected,
  closeConnection,
  getConnection
};
