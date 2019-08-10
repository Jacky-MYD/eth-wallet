var bip39 = require('bip39')
var hdkey = require('ethereumjs-wallet/hdkey')
var util = require('ethereumjs-util')


const myWallet = {
    /**
     * 生成钱包
     */
    createWallet: async () => {
        // 生成助记词
        var mnemonic = bip39.generateMnemonic() 
        console.log('mnemonic------', mnemonic) // hundred shrimp bacon poem enable trim yard slight smile suffer normal cinnamon
        
        // 随机数种子（生成 HD Wallet 首先将 mnemonic code 转成 binary二进制的 seed）
        var seed = await bip39.mnemonicToSeed(mnemonic) 
        console.log('seed------', seed)
        
        // 生成 Master Key 地址 "m/44'/60'/0'/0/0" 使用 seed 生成 HD Wallet。
        var hdwallet = hdkey.fromMasterSeed(seed) 
        console.log('hdwallet------', hdwallet)

        // 从路径 m/44'/60'/0'/0/0 导入 Master Key 并生成 Wallet 中第一个帐户的第一组 keypair。
        var key = hdwallet.derivePath("m/44'/60'/0'/0/0") 
        console.log('key------', key)

        // 使用 keypair 中的私钥产生 address。
        var privateAddress = util.bufferToHex(key._hdkey._privateKey)
        console.log('私钥address------', privateAddress) // 0x724aecb752fbd954d68c8fe172b0f5d312f12fcd0c3f82bf9c9a76e0df55eaa7

        // // 使用 keypair 中的公钥产生 address。
        var address = util.pubToAddress(key._hdkey._publicKey, true) 
        console.log('公钥addressBuffer------', address)

        // // 获得以太坊钱包地址
        // address = util.toChecksumAddress(address.toString('hex'))
        // console.log('十六进制的以太坊钱包address------', address)

        // 获得以太坊钱包地址。
        var address = util.bufferToHex(key._hdkey._publicKey)
        console.log('十六进制的以太坊钱包address------', address) // 0x036994d6dda1902c1612154c092828dc326591b22d867f20f69c8a2f43f08ed52d
        return address
    },
    /**
     * 通过助记词恢复钱包
     */
    getWalletByMnemonic: async (mnemonic, pwd) => {
        // 通过助记词和设定密码获取随机数种子
        var seed = await bip39.mnemonicToSeed(mnemonic)

        // 生成 Master Key 地址 "m/44'/60'/0'/0/0" 使用 seed 生成 HD Wallet。
        var hdWallet = hdkey.fromMasterSeed(seed)

        // 从路径 m/44'/60'/0'/0/0 导入 Master Key 并生成 Wallet 中第一个帐户的第一组 keypair。
        var key = hdWallet.derivePath("m/44'/60'/0'/0/0") 

        // 导出私钥 address。
        var privateAddress = util.bufferToHex(key._hdkey._privateKey)
        console.log('私钥address------', privateAddress) 

        // 获得以太坊钱包地址。
        var address = util.bufferToHex(key._hdkey._publicKey)
        console.log('十六进制的以太坊钱包address------', address)
    }
}
myWallet.createWallet()
myWallet.getWalletByMnemonic('hundred shrimp bacon poem enable trim yard slight smile suffer normal cinnamon')