const koa = require('koa')
const views = require('koa-render')
const logger = require('koa-logger')
const favicon = require('koa-favicon')
const serve = require('koa-static')
const json = require('koa-json')
const fresh = require('koa-fresh')
const compress = require('koa-compress')

const router = require('./app/router')

const port = process.env.PORT || 5000

const app = koa()
app
  .use(compress())
  .use(fresh())
  .use(favicon('./public/favicon.ico'))
  .use(views('./view', 'jade'))
  .use(serve('./public'))
  .use(logger())
  .use(json())
  .use(router.routes())
  .listen(port, function () {
    console.log(`Holly Quintet has been started on port ${port} ...`)
  })
