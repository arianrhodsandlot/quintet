import express from 'express'
import url from 'url'
import path from 'path'
import logger from 'morgan'
import sassMiddleware from 'node-sass-middleware'
import browserify from 'browserify-middleware'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import router from './router'

const filePath = url.parse(import.meta.url).pathname // eslint-disable-line
const workingDir = path.parse(filePath).dir
const publicDir = path.join(workingDir, 'public')
const viewsDir = path.join(workingDir, 'views')

export default express()
  .set('trust proxy', 'loopback')
  .set('view engine', 'pug')
  .set('views', viewsDir)
  .use(helmet())
  .use(compression())
  .use(cookieParser())
  .use(sassMiddleware({
    src: publicDir,
    dest: publicDir,
    indentedSyntax: true,
    includePaths: [path.join(workingDir), 'node_modules']
  }))
  .use(browserify(publicDir))
  .use(express.static(publicDir))
  .use(logger('combined'))
  .use('/', router)
