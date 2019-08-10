const router = require('koa-router')()


router.get('', async ctx => await ctx.render('newaccount.html'))

router.get('newAccount', async ctx => await ctx.render('newaccount.html'))

router.get('transaction.html', async ctx => await ctx.render('transaction.html'))

router.get('block.html', async ctx => await ctx.render('block.html'))


module.exports = router