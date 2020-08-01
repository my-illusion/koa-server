import { Controller, Post } from '../router'
import { Context } from 'koa'

@Controller('/api')
export default class MarkDown {
    @Post()
    async uploadImage(ctx: Context): Promise<void> {
        ctx.send(null, '上传成功')
    }
}
