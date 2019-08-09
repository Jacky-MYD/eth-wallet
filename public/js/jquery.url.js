module.exports = {
    getweb3: () => {
        let Web3 = require("web3")
        var web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

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
}