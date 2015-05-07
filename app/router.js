var router = require('express').Router()
var controller = require('./controller')

router
  .use(function(req, res, next) {
    if (req.hostname === 'hollyquintet.herokuapp.com') {
      res.redirect(301, 'http://hollyquintet.tomaketheendofbattle.com')
    } else {
      next()
    }
  })
  .get('/', controller.home)
  .get('/search/:query', controller.home)
  .get('/result/:query/:item', controller.home)
  .get('/api/search/:query', controller.search)

module.exports = router
