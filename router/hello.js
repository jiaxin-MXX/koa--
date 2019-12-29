const Router = require('koa-router')
const hello = require('../controller/hellp')
const crypto = require('crypto')
const router = new Router()

router.get('jiaxin', async (ctx, next) => {
    // await hello(ctx)
    let token = 'jiaxin'
    let {signature,echostr,timestamp,nonce} = ctx.query
    let str = [token,timestamp,nonce].sort().join('')
    let password = crypto.createHash('sha1').update(str).digest('hex')
    if(password===signature){
        ctx.body = echostr
    }else{
        ctx.body = '请求非法'
    }
});

module.exports=router