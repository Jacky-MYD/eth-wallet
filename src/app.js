const path = require('path')
const Koa = require('koa2')
const bodyparser = require('koa-bodyparser')
var cors = require('koa2-cors');
const static = require('koa-static')
const views = require('koa-views')
const { port } = require('../config')
const router = require('./routers/index')
const koaBody = require("koa-body")

// 创建koa实例
const app = new Koa()

//针对于文件上传的时候，可以解析多个字段
app.use(koaBody({multipart:true}))

// 配置跨域
app.use(cors())

// 配置数据解析中间件
app.use(bodyparser())

// 配置静态资源加载中间件
app.use(static(path.join(__dirname, '../public')))

// 配置模板引擎中间件
app.use(views(path.join(__dirname, './views'), {extension:'ejs', map:{html:"ejs"}}))

// 配置路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen(port, () => {
    console.log("\033[32m Listening at http://localhost:8085 \033[0m")
})

