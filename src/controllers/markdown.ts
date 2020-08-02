import { Controller, Post } from '../router'
import { Context } from 'koa'
import fs from 'fs'
import path from 'path'

@Controller('/api')
export default class MarkDown {
    @Post()
    async uploadImage(ctx: Context): Promise<void> {
        const file = ctx.request.files.image
        const reader = fs.createReadStream(file.path)
        const filePath =
            path.join(__dirname, '../public/upload') + `/${file.name}`
        const upStream = fs.createWriteStream(filePath)
        reader.pipe(upStream)
        ctx.send(`http://localhost:5442/upload/${file.name}`, '上传成功')
    }
}
