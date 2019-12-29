const Router = require('koa-router')
const conf = require('../conf/jiaxin')
const { get } = require('../utils/http')
const querystring = require('querystring')
const crypto = require('crypto')
const { genTimestamp, genNonceStr, genTimestampSecond } = require('../utils/tool')
const db = require('../model/db')
const router = new Router()

router.get('sign', async (ctx, next) => {
    let selectReslt = await db('select * from mytable',[])
    let ticket
    // if(selectReslt.length === 0){
        let {access_token} = await get({
            url:`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${conf.appid}&secret=${conf.secret}`
        })
        let  result = await get({
            url:`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
        })
        ticket=result.ticket
        console.log(result)
    //     await db('insert into mytable(ticket,time) values(?, ?)', [ticket,new Date().getTime()])
    // }else{

    // }
    
    // 3. 定义(获取) 参与签名的字段
    let noncestr = genNonceStr()
    let timestamp = genTimestampSecond()
    let fieldObj = {
        noncestr,
        timestamp,
        url: conf.url,
        jsapi_ticket: ticket
    }
    // 4. 按照字段名排序
    console.log(fieldObj)
    let orderedFieldObj = Object.keys(fieldObj).sort().reduce((obj, key) => {
        obj[key] = fieldObj[key]
        return obj
    }, {})

     // 5. 生成query
    let query = querystring.stringify(orderedFieldObj, null, null, {
        encodeURIComponent: (str) => {
        return querystring.unescape(str)
        }
    })
    // 6. sha1 加密
    let signature = crypto.createHash('sha1').update(query).digest('hex')
    // 7. 返回接口
    ctx.body = {
        appId: conf.appid,
        timestamp,
        nonceStr: noncestr,
        signature
    }

    
});

module.exports=router