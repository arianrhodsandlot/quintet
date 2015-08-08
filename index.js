var koa = require('koa')
var views =  require('koa-render')
var logger = require('koa-logger')
var favicon = require('koa-favicon')
var c2k = require('koa-connect')
var serve = require('koa-static')
var json = require('koa-json')
var harp = require('harp')

var app = koa()
var router = require('./app/router')

var port = process.env.PORT || 5000

app
  .use(favicon('./public/favicon.ico'))
  .use(views('./public', 'jade'))
  .use(serve('./public'))
  .use(c2k(harp.mount('./public')))
  .use(logger())
  .use(json())
  .use(router.routes())
  .listen(port, function () {
  	console.log('Koa is listening to port ' + port + '...')
  })
