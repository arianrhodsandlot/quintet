var _ = require('lodash')
var koa = require('koa')
var views =  require('koa-render')
var logger = require('koa-logger')
var favicon = require('koa-favicon')
var serve = require('koa-static')
var json = require('koa-json')
var fresh = require('koa-fresh')
var gzip = require('koa-gzip')

var app = koa()
var router = require('./app/router')

var port = process.env.PORT || 5000

app
  .use(gzip())
  .use(fresh())
  .use(favicon('./public/favicon.ico'))
  .use(views('./view', 'jade'))
  .use(serve('./public'))
  .use(logger())
  .use(json())
  .use(router.routes())
  .listen(port, _.partial(console.log, `Koa is listening to port ${port} ...`))
