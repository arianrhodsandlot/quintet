import express from 'express'
import url from 'url'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import Bundler from 'parcel-bundler'
import favicon from 'serve-favicon'
import router from './router'

const filePath = url.parse(import.meta.url).pathname // eslint-disable-line
const workingDir = path.parse(filePath).dir
const viewsDir = path.join(workingDir, 'views')

export default express()
  .set('trust proxy', 'loopback')
  .set('view engine', 'pug')
  .set('views', viewsDir)
  .use(helmet())
  .use(compression())
  .use(cookieParser())
  .use(favicon(path.join(workingDir, 'assets/images/favicon.ico')))
  .use('/images/default.jpg', express.static(path.join(workingDir, 'assets/images/default.jpg')))
  .use((new Bundler([
    'src/assets/javascripts/app.js',
    'src/assets/stylesheets/app.sass'
  ])).middleware())
  .use(logger('combined'))
  .use('/', router)
