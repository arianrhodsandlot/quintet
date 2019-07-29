import path from 'path'
import url from 'url'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import favicon from 'serve-favicon'
import router from './router'
import bundler from './bundler'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

const viewsDir = path.join(dirname, 'views')

export default express()
  .enable('trust proxy')
  .set('view engine', 'pug')
  .set('views', viewsDir)
  .use(helmet())
  .use(compression())
  .use(cookieParser())
  .use(favicon(path.join(dirname, 'assets/images/favicon.ico')))
  .use(bundler.middleware())
  .use('/', router)
