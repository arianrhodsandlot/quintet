var url = require('url')
var querystring = require('querystring')
var _ = require('lodash')
var rp = require('request-promise')
var cheerio = require('cheerio')

var controller = {
	home: function(req, res) {
		res.locals.characters = [{
			color: '#5F5A5C',
			name: 'homura'
		}, {
			color: '#FED4D7',
			name: 'madoka'
		}, {
			color: '#F9E797',
			name: 'mami'
		}, {
			color: '#89BBCB',
			name: 'sayaka'
		}, {
			color: '#BE6F81',
			name: 'kyoko'
		}]
		res.render('home')
	},
	search: function(req, res) {
		var scope = req.query.scope
		var query = req.params.query

		var requestOptions = {
			headers: {
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:35.0) Gecko/20100101 Firefox/35.0'
			}
		}
		var target

		switch (scope) {
			case 'itunes-hk':
			case 'itunes-jp':
			case 'itunes-tw':
			case 'itunes-us':
			case 'itunes-uk':
				scope = _.template('itunes.apple.com/<%= region %>/album')({
					region: scope.replace('itunes-', '')
				})
				break
			case 'amazon-com':
				scope = 'amazon.com'
				break
			case 'amazon-jp':
				scope = 'amazon.co.jp'
				break
			case 'orpheus':
				scope = 'music.163.com/album'
				break
			case 'qq':
				scope = 'y.qq.com/y/static'
				break
			default:
				scope = ''
				break
		}

		target = _.template('http://www.google.com/search?tbm=isch&q=<%= encodeURIComponent(query) %>+site%3A<%= scope %>')({
			query: query,
			scope: scope
		})

		rp(_.extend(requestOptions, {
				url: target
			}))
			.then(function(html) {
				var $html = cheerio(html)
				var $results = $html.find('.rg_di.rg_el')
				var results = _.map($results, function(result) {
					var $result = cheerio(result)
					var $link = $result.children('.rg_l')
					var $meta = $result.children('.rg_meta')

					var href = $link.attr('href')
					var query = url.parse(href).query
					var resultData = querystring.parse(query)

					var meta = window.JSON.parse(_.unescape($meta.html()))

					return {
						title: _.first(meta.s.split(',')),
						refer: decodeURIComponent(resultData.imgrefurl),
						cover: {
							src: decodeURIComponent(resultData.imgurl),
							originSrc: (function(src) {
								var getOriginSrc

								src = decodeURIComponent(src)

								if (_.contains(scope, 'itunes')) {
									getOriginSrc = function(src) {
										var falseReg = /\d{3}x\d{3}/
										var trueReg = /1200x1200/
										if (falseReg.test(src) && !trueReg.test(src)) {
											src = src.replace(falseReg, '1200x1200')
											return src
										}
									}
								} else if (_.contains(scope, 'music.163.com')) {
									getOriginSrc = function(src) {
										src = url.parse(src)
										src.search = ''
										src = url.format(src)
										return src
									}
								} else {
									getOriginSrc = function(src) {
										return src
									}
								}

								src = getOriginSrc(src)

								return src
							})(resultData.imgurl)
						}
					}
				})

				res.json({
					results: results.slice(0, 12)
				})
			}, function(error) {
				console.error(error)
				console.error('load ' + target + ' failed')
				res
					.status(500)
					.json({})
			})
	}
}

module.exports = controller
