// //overrides metamask v0.2 for our 1.0 version.  
//1.0 lets us use async and await instead of promises

var Web3 = require('web3');
//overrides metamask v0.2 for our v 1.0
const web3 = new Web3(Web3.currentProvider || new Web3.providers.HttpProvider('http://localhost:7545'));

module.exports = web3;