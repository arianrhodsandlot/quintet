var url = require('url')
var querystring = require('querystring')
var _ = require('lodash')
var Q = require('q')
var cheerio = require('cheerio')

var request = function(options) {
  var request = require('request');
  request.debug = true;
  return Q.denodeify(request)(options)
    .then(function(results) {
      return results[0]
    })
}

var searchResults2json = function(html) {
  var $html = cheerio(html)
  var $results = $html.find('.rg_di.rg_el')
  console.log($results.length)
  return _.map($results, function(result) {
    var $result = cheerio(result)
    var $link = $result.children('.rg_l')
    var $meta = $result.children('.rg_meta')

    var href = $link.attr('href')
    var query = url.parse(href).query
    var resultData = querystring.parse(query)

    var meta = JSON.parse(_.unescape($meta.html()))

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
  }).slice(0, 12)
}

var controller = {
  home: function*() {
    var body
    this.state.characters = [{
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

    this.body = yield this.render('home', this.state)
  },
  search: function*() {
    var scope = this.query.scope
    var query = this.params.query

    var searchResults

    switch (scope) {
      case 'itunes-hk':
      case 'itunes-jp':
      case 'itunes-tw':
      case 'itunes-us':
      case 'itunes-uk':
        scope = _.template('itunes.apple.com/<%= region %>/album')({
          region: _.trimLeft(scope, 'itunes-')
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

    try {
      searchResults = yield request({
        baseUrl: 'https://www.google.com',
        url: '/search',
        qs: {
          tbm: 'isch',
          gws_rd: 'cr', //get rid of our request being redirected by country
          q: query + ' site ' + scope
        },
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0'
        }
      })
      this.body = searchResults2json(searchResults)
    } catch (err) {
      console.error(err)
      this.status = 500
      this.body = {
        err: err
      }
    }
  }
}

module.exports = controller
