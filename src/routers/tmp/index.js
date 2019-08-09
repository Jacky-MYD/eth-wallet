const router = require('koa-router')()


router.get('', async ctx => await ctx.render('newaccount.html'))

router.get('newAccount', async ctx => await ctx.render('newaccount.html'))

router.get('transaction.html', async ctx => await ctx.render('transaction.html'))


module.exports = router