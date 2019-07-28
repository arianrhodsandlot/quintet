import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import favicon from 'serve-favicon'
import router from './router'
import bundler from './bundler'

const viewsDir = path.join(__dirname, 'views')

export default express()
  .enable('trust proxy')
  .set('view engine', 'pug')
  .set('views', viewsDir)
  .use(helmet())
  .use(compression())
  .use(cookieParser())
  .use(favicon(path.join(__dirname, 'assets/images/favicon.ico')))
  .use(bundler.middleware())
  .use('/', router)
