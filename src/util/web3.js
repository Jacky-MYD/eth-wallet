// //overrides metamask v0.2 for our 1.0 version.  
//1.0 lets us use async and await instead of promises



module.exports = {
    getWeb3: () => {
        var Web3 = require('web3');
        //overrides metamask v0.2 for our v 1.0
        const web3 = new Web3(Web3.currentProvider || new Web3.providers.HttpProvider('http://localhost:7545'));
        return web3
    },
    success: (data) => {
        responseData = {
            code:0,
            status:"success",
            data:data
        }
        return responseData
    },

    fail: (msg) => {
        responseData = {
            code:1,
            status:"fail",
            msg:msg
        }
        return responseData
    }
};