const Web3 = require('web3');

const ethConfig = require('./ethConfig.js');

let web3 = null;

function getRPCProvider() {
  web3 = new Web3(new Web3.providers.HttpProvider(ethConfig.INFURA_ENDPOINT));
}

function getConnection() {
  if (web3 == null) {
    getRPCProvider();
  }
  return web3;
}

module.exports = {
  getConnection,
};
