var router = require('express').Router();
var controller = require('./controller');

router
	.get('/', controller.home)
	.get('/search/:query', controller.home)
	.get('/result/:query/:item', controller.home)
	.get('/api/search/:query', controller.search);

module.exports = router;
