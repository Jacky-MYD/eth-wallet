let bip39 = require('bip39')
let hdkey = require('ethereumjs-wallet/hdkey')
let util = require('ethereumjs-util')

module.exports = {
    getPrivatekeyWithMnemonic: async (mnemonic, derivePath) => {
        //将助记词转成seed
        let seed = await bip39.mnemonicToSeed(mnemonic)
        //通过hdkey将seed生成HDWallet
        let hdWallet = hdkey.fromMasterSeed(seed)
        //生成钱包中在m/44'/60'/0'/0/0路径的第一个帐户的keypair。
        let key = hdWallet.derivePath(derivePath)
        //获取私钥
        return util.bufferToHex(key._hdkey._privateKey)
    }
}