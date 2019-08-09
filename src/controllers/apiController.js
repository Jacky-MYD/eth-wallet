let { success, fail } = require("../util/web3")
const web3 = require('../util/web3').getWeb3()
let menmonicModel = require("../util/mnemonic")
const path = require('path')
const fs = require('fs')

//获取以太币余额
async function getAccountBalance(address) {
    let balance = await web3.eth.getBalance(address)
    return web3.utils.fromWei(balance, "ether")
}

//配置返回给前端的数据，包含以太币的数据，还会有Token的数据
async function setResponseData(account) {
    //获取账户余额
    let balance = await getAccountBalance(account.address)
    console.log('balance-------------', balance)

    let resData = success({
        balance: balance,
        address: account.address,
        privatekey: account.privateKey
    })

    //返回相应数据给前端
    return resData
}

const api = {
     //创建账户的表单提交被触发的方法
     newAccount: async (ctx) => {
        console.log("password:", ctx.request.body.password)

        //1.创建钱包账号
        let account = web3.eth.accounts.create(ctx.request.body.password)
        console.log(account)

        //2.根据账号和密码生成keystore文件
        let keystore = account.encrypt(ctx.request.body.password)
        console.log(keystore)

        //3.将keysotr保存到文件
        let keystoreString = JSON.stringify(keystore)
        let time = new Date()
        let fileName = 'UTC--'+time.toISOString()+'--'+account.address.slice(2)
        console.log(fileName)
        let filePath = path.join(__dirname, "../../public/keystore", fileName)
        fs.writeFileSync(filePath, keystoreString)

        //4.将账号信息返回给客户端
        await ctx.render("downloadkeystore.html", {
            "downloadurl":"/keystore/"+fileName,
            "privatekey":account.privateKey
        })
    },
    // 通过私钥解锁账户
    unlockAccountWithPrivate: async (ctx) => {
        //１．获取私钥
        let privatekey = ctx.request.body.privatekey
        console.log(privatekey)
        //2.通过私钥解锁账户
        let account = web3.eth.accounts.privateKeyToAccount(privatekey)
        console.log(account)
        //３．将账户信息返回给前端
        ctx.body = await setResponseData(account)
    },

    // 通过Keystore解锁账户
    unlockAccountWithKeystore: async (ctx) => {
        //1.　获取前端传递的数据，包括keystore、密码
        let password = ctx.request.body.password
        console.log('password========', password)
        let keystore = ctx.request.files.file
        console.log(keystore)
        //2.读取缓存文件中keystore的数据
        let keystoreData = fs.readFileSync(keystore.path, "utf8")
        console.log(keystoreData)
        //3. 通过keystore和密码解锁账户
        let account = web3.eth.accounts.decrypt(JSON.parse(keystoreData), password)
        console.log(account)
        //４．将账户信息返回给前端
        ctx.body = await setResponseData(account)
    },

    // 通过助记词解锁账户
    unlockAccountWithMnemonic: async (ctx) => {
        //１．获取助记词
        let mnemonic = ctx.request.body.mnemonic
        console.log("mnemonic:", mnemonic)

        //2.通过助记词获取私钥
        /*
        注意这里为了简化前端实现过程，故只获取了助记词的第一对公私钥，即"m/44'/60'/0'/0/0"，在实际开发工作中需枚举路径"m/44'/60'/0'/0/0"的最后一位0，可继续取值为0,1,2,3,4……
        */
        let privatekey = await menmonicModel.getPrivatekeyWithMnemonic(mnemonic, "m/44'/60'/0'/0/0")
        console.log("私钥："+privatekey)

        //3.通过私钥解锁账户
        let account = web3.eth.accounts.privateKeyToAccount(privatekey)
        console.log("account:",account)

        //4．将账户信息返回给前端
        ctx.body = await setResponseData(account)
    },

    // 转账交易
    sendTransaction: async (ctx) => {
        let { fromaddress, toaddress, number, privatekey } = ctx.request.body
        console.log(JSON.stringify(ctx.request.body))

        let nonce = await web3.eth.getTransactionCount(fromaddress)
        let gasPrice = await web3.eth.getGasPrice()
        let balance = await web3.utils.toWei(number)

        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer(privatekey.slice(2), 'hex')

        var rawTx = {
            from:fromaddress,
            nonce: nonce,
            gasPrice: gasPrice,
            to: toaddress,
            value: balance,
            data: '0x00'//转Token代币会用到的一个字段
        }
        //需要将交易的数据进行预估gas计算，然后将gas值设置到数据参数中
        let gas = await web3.eth.estimateGas(rawTx)
        rawTx.gas = gas

        var tx = new Tx(rawTx);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        let responseData;
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, data) {
            console.log(err)
            console.log(data)

            if (err) {
                responseData = fail(err)
            }
        })
        .then(function(data) {
            console.log(data)
            if (data) {
                responseData = success({
                    "transactionHash":data.transactionHash
                })
            } else {
                responseData = fail("交易失败")
            }
        })

        ctx.body = responseData
    },
}

module.exports = api