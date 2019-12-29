const Koa = require('koa');
const static = require('koa-static')
const Router = require('koa-router')
const helloRouter = require('./router/hello')
const jiaxinRouter = require('./router/jiaxin')
const signRouter = require('./router/sign')
let bodyparser = require('koa-bodyparser')
let views = require('koa-views')
const path = require('path')
const app = new Koa();
var router = Router()
var router2 = Router()
var router3 = Router()

app.use(bodyparser())
app.use(views(path.join(__dirname, './view'), {
    extension: 'ejs'
}))
router.use('/jiaxin/',helloRouter.routes())
router2.use('/jiaxin/',jiaxinRouter.routes())
router3.use('/jiaxin/',signRouter.routes())
app.use(router.routes())
//定义静态目录
app.use(
    static(path.join(__dirname , './public'))
)
app.use(router.routes())
app.use(router2.routes())
app.use(router3.routes())
app.listen(3333);