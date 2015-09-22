'use strict'

const router = require('koa-router')()
const controller = require('./controller')

router
  .get('/', controller.home)
  .get('/covers', controller.home)
  .get('/api/covers', controller.search)

module.exports = router
