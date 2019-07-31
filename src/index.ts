import path from 'path'
import url from 'url'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import favicon from 'serve-favicon'
import Bundler from 'parcel-bundler'
import router from './router'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

const viewsDir = path.join(dirname, 'views')

const staticMiddleware = process.env.NODE_ENV === 'production'
  ? express.static('dist')
  : (new Bundler('src/assets/entries/*')).middleware()

export default express()
  .enable('trust proxy')
  .set('view engine', 'pug')
  .set('views', viewsDir)
  .use(helmet())
  .use(compression())
  .use(cookieParser())
  .use(favicon(path.join(dirname, 'assets/images/favicon.ico')))
  .use(staticMiddleware)
  .use('/', router)
