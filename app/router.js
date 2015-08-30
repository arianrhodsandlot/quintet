var router = require('koa-router')()
var controller = require('./controller')

router
  .get('/', controller.home)
  .get('/covers', controller.home)
  .get('/api/covers', controller.search)

module.exports = router
