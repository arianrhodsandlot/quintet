import express from 'express'
import url from 'url'
import path from 'path'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import favicon from 'serve-favicon'
import router from './router'
import bundler from './bundler'

const filePath = url.parse(import.meta.url).pathname // eslint-disable-line
const workingDir = path.parse(filePath).dir
const viewsDir = path.join(workingDir, 'views')

export default express()
  .enable('trust proxy')
  .set('view engine', 'pug')
  .set('views', viewsDir)
  .use(helmet())
  .use(compression())
  .use(cookieParser())
  .use(favicon(path.join(workingDir, 'assets/images/favicon.ico')))
  .use(bundler.middleware())
  .use('/', router)
