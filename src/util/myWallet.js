var bitcoin = require('bitcoinjs-lib');
var bip39 = require("bip39")
var bip32 = require("bip32")

async function myWallet(mnemonic, pwd) {
    const myNetwork = bitcoin.networks.bitcoin
    // const mnemonic = bip39.generateMnemonic()
    const seed = await bip39.mnemonicToSeed(mnemonic, pwd)
    const root = bip32.fromSeed(seed, myNetwork)

    for(var i = 0; i < 3; i++) {
        const path = "m/44'/0'/0'/0/"+i
        console.log("路径：", path)
        const keyPair = root.derivePath(path)
        // console.log('keyPair:', keyPair)

        const privateKey = keyPair.toWIF()
        console.log("私钥：", privateKey)

        const publicKey = keyPair.publicKey.toString("hex")
        console.log("公钥：", publicKey)

        let address = getAddress(keyPair, myNetwork)
        console.log("普通地址：", address)
        let segWitAddress = getSegWitAddress(keyPair, myNetwork)
        console.log("隔离见证：", segWitAddress, "\n")
    }
}


function getAddress(keyPair, network) {
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey , network:network})
    return address
}

function getSegWitAddress(keyPair,myNetwork) {
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: myNetwork}),
        network: myNetwork
    })
    return address
}

// myWallet('eternal list thank chaos trick paper sniff ridge make govern invest abandon', 'Jacky520')
