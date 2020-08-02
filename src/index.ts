import Koa from 'koa'
import KoaBody from 'koa-body'
import koaJwt from 'koa-jwt'
import koaCompress from 'koa-compress'
import koaStatic from 'koa-static'
import path from 'path'
import cors from 'koa2-cors'

import koaMiddlewares from './middlewares'
import { secret_key } from './router'

// import mysql from './models/mysql'
import router from './router'

const app = new Koa()

// app.use(async (ctx, next) => {
//     const result = await mysql.query()
//     console.log(result)
//     ctx.response.type = 'json'
//     ctx.response.body = result
//     next()
// })
// app.use(
//     cors({
//         origin: function (ctx) {
//             //设置允许来自指定域名请求
//             if (ctx.url === '/test') {
//                 return '*' // 允许来自所有域名请求
//             }
//             return 'http://localhost:8000' //只允许http://localhost:8080这个域名的请求
//         },
//         maxAge: 5, //指定本次预检请求的有效期，单位为秒。
//         credentials: true, //是否允许发送Cookie
//         allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
//         allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
//         exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], //设置获取其他自定义字段)
//     })
// )

app.use(koaStatic(path.resolve(__dirname, './public/')))

app.use(koaCompress())

app.use(
    KoaBody({
        multipart: true,
        formidable: {
            maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
        },
    })
)

app.use(koaMiddlewares)

app.use(
    koaJwt({
        secret: secret_key,
    }).unless({
        path: [/^\/api\/login$/],
    })
)

app.use(router.routes())

app.use(router.allowedMethods())

app.listen(5442, () => {
    console.log('server is running at http://localhost:5442')
})
