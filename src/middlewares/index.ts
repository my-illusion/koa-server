import koaCompose from 'koa-compose'

import jwtErrorHandler from './jwtErrorHandler'
import sendHandler from './sendHandler'
import uploadFile from './uploadFile'

export default koaCompose([sendHandler, uploadFile, jwtErrorHandler])
