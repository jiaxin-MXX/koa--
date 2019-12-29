const Router = require('koa-router')
const getRawBody = require('raw-body')
const contentType = require('content-type')
const { xml2js } = require('../utils/tool')
var router = new Router()
router.post('jiaxin',async (ctx,next)=>{
    ctx.type = 'text/plain; charset=utf-8'
    
    let result = await getRawBody(ctx.req, {
        length: ctx.req.headers['content-length'],
        limit: '1mb',
        encoding: contentType.parse(ctx.req).parameters.charset
    })
    result = result.toString()

    let { ToUserName, FromUserName }=xml2js(result)
    
    let reply = {
      ToUserName: FromUserName,
      FromUserName: ToUserName,
      CreateTime: '123456789',
      MsgType: 'text',
      Content: '<a href="http://jiaxinmxx.top">罗技</a>'
    }
    await ctx.render('reply', reply)
})

module.exports = router