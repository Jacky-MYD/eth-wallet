const router = require('koa-router')()
const api = require('../../controllers/apiController')

module.exports = router.post('newAccount', api.newAccount)
                       .post('unlock/private', api.unlockAccountWithPrivate)
                       .post('unlock/keystore', api.unlockAccountWithKeystore)
                       .post('unlock/mnemonic', api.unlockAccountWithMnemonic)
                       .post('transaction/send', api.sendTransaction)
                       .post('token/send', api.sendTransaction)
