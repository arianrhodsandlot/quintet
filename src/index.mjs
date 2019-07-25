import express from 'express'
import url from 'url'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import Bundler from 'parcel-bundler'
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
  .use((new Bundler([
    'src/public/javascripts/app.js',
    'src/public/stylesheets/app.sass'
  ])).middleware())
  .use(logger('combined'))
  .use('/', router)
