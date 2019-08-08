const router = require('koa-router')()
const web3 = require('../../util/web3')
const contract = require('../../util/contract')


router.get('', async ctx => await ctx.render('home', {
    title: 'Hello Jacky!'
}))

router.get('account.html', async ctx => {
    var accounts;
    await web3.eth.getAccounts((err, acc) => {
        accounts = acc
    });
    await ctx.render('account',{title: 'Account', accounts: accounts})
})

router.get('new', async ctx => {
    
    var password = ctx.request.url.split('?')[1].split('=')[1]
    console.log(password)
    await web3.eth.personal.newAccount(password).then(function(res){
        console.log(444, res);
    });
    await ctx.redirect('/account.html');
})

router.get('balance.html', async ctx => {
    
    var accounts = await web3.eth.getAccounts();
    // var coinbase = await web3.eth.getCoinbase().then(res => {
    //     console.log(222, res)
    // })
    await ctx.render("balance", {title: 'Balance', accounts: accounts}); 
})

router.get('getbalance.html', async ctx => {
    var account = ctx.request.url.split('?')[1].split('=')[1]
    var balance = await web3.eth.getBalance(account);
    await ctx.render("showbalance",{title: 'showBalance', "account": account, "balance": web3.utils.fromWei(balance, 'ether')}); 
})
  

router.get('transfer.html', async ctx => {
    // var account = ctx.request.url.split('?')[1].split('=')[1]
    var accounts = await web3.eth.getAccounts();
    await ctx.render("transfer",{title: 'transfer',"accounts":accounts}); 
})
  
router.get('send', async ctx => {
    var paramlist = ctx.request.url.split('?')[1].split('&')
    var paramObj = new Object
    paramlist.forEach(item => {
        var param = item.split('=')
        paramObj[param[0]] = param[1]
    })
    var unlock = await web3.eth.personal.unlockAccount(paramObj.from, paramObj.password);
    if (unlock) {
        if(paramObj.token == "ETH"){  
            var err, results
            await web3.eth.sendTransaction({
                from: paramObj.from,
                to: paramObj.to,
                value: web3.utils.toWei(paramObj.amount ,'ether')
            },
            function(error, result){
                if(!err) {
                    results = result
                } else {
                    console.error(error);
                }
            });
            if(results) {
                console.log("#" + results + "#")
                await ctx.render("done",{title: 'done',"hash":results}); 
            }
        }else{
            var hash = await contract.methods.transfer(paramObj.to, paramObj.amount).send();
            await ctx.render("done",{title: 'done',"hash":hash.transactionHash}); 
        }
    }
})
  
  
  

module.exports = router