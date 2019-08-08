const router = require('koa-router')()

const api = require('./api/index')
const index = require('./tmp')


router.use('/api', api.routes(), api.allowedMethods())

router.use('/', index.routes(), index.allowedMethods())


module.exports = router