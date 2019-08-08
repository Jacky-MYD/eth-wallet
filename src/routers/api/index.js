const router = require('koa-router')()
const store = require('../../controllers/store')

module.exports = router.post('/insertProduct', store.insertProduct)