// eslint-disable @typescript-eslint/no-explicit-any
import KoaRouter from 'koa-router'
import fs from 'fs'
import path from 'path'

export const secret_key = 'my_token'

interface Constructor {
    new (...args: unknown[]): unknown
    prefix: string
}

interface CollectionsItem {
    url: string
    method: 'get' | 'post'
    handler: (...args: unknown[]) => unknown
    constructor: Constructor
}

const router = new KoaRouter()
const api = new KoaRouter()

const collections: Array<CollectionsItem> = []
const prefixCollections: Array<string> = []

export function Controller(path = '') {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return function (target): void {
        target.prefix = path
        if (path !== '') {
            prefixCollections.push(path)
        }
    }
}

export function Get(pathname?: string) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return function (target, key: string): void {
        let path = ''
        if (!pathname) {
            path = `/${key}`
        } else {
            path = pathname
        }
        collections.push({
            url: path,
            method: 'get',
            handler: target[key],
            constructor: target,
        })
    }
}

export function Post(pathname?: string) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return function (target, key: string): void {
        let path = ''
        if (!pathname) {
            path = `/${key}`
        } else {
            path = pathname
        }
        collections.push({
            url: path,
            method: 'post',
            handler: target[key],
            constructor: target,
        })
    }
}

export async function autoLoadRouter(): Promise<void> {
    const dirPath = path.resolve(__dirname, '../controllers')

    const files = fs.readdirSync(dirPath)
    for (const file of files) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (import(`${dirPath}/${file}`) as any).default
    }

    collections.forEach((item) => {
        const prefix = item.constructor.prefix
        let url = item.url
        if (prefix) url = `${prefix}${url}`
        api[item.method](url, item.handler)
        console.log(`${url}\n`)
    })

    prefixCollections.forEach((prefix: string) => {
        router.use(prefix, api.routes(), api.allowedMethods())
    })
}

autoLoadRouter()

export default router
