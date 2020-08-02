import { Context, Next } from 'koa'
import fs from 'fs'
import path from 'path'

const uploadFile = () => {
    return async function (ctx: Context, next: Next): Promise<void> {
        ctx.uploadFile = (function (ctx: Context) {
            return async function () {
                console.log('jjj')
                const file = ctx.request.files.image
                const reader = fs.createReadStream(file.path)
                const filePath =
                    path.join(__dirname, '../public/upload') + `/${file.name}`
                const upStream = fs.createWriteStream(filePath)
                reader.pipe(upStream)
                ctx.send(
                    `http://localhost:5442/upload/${file.name}`,
                    '上传成功'
                )
            }
        })(ctx)
        await next()
    }
}

export default uploadFile
