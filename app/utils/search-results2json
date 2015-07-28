var url = require('url')
var querystring = require('querystring')
var _ = require('lodash')

var getOriginSrcFromItunes = function() {
  var falseReg = /\d{3}x\d{3}/
  var trueReg = /1200x1200/
  if (falseReg.test(src) && !trueReg.test(src)) {
    src = src.replace(falseReg, '1200x1200')
    return src
  }
}

var getOriginSrcFrom163 = function() {
  src = url.parse(src)
  src.search = ''
  src = url.format(src)
  return src
}

var getOriginSrc = function(src) {
  var getOriginSrc;

  if (_.contains(scope, 'itunes')) {
    getOriginSrc = getOriginSrcFromItunes;
  } else if (_.contains(scope, 'music.163.com')) {
    getOriginSrc = getOriginSrcFrom163;
  } else {
    getOriginSrc = _.constant;
  }

  return getOriginSrc(src);
}

var convertResultHtml2Json = function(resultHtml) {
  var $result = cheerio(resultHtml)
  var $link = $result.children('.rg_l')
  var $meta = $result.children('.rg_meta')

  var href = $link.attr('href')
  var query = url.parse(href).query
  var resultData = querystring.parse(query)

  var meta = JSON.parse(_.unescape($meta.html()))

  return {
    originTitle: meta.s,
    title: _.first(meta.s.split(',')),
    refer: decodeURIComponent(resultData.imgrefurl),
    cover: {
      src: decodeURIComponent(resultData.imgurl),
      originSrc: getOriginSrc(this.src)
    }
  }
}

var searchResults2json = function(html, scope) {
  var $html = cheerio(html)
  var $results = $html.find('.rg_di.rg_el')

  var results = _($results)
    .map(convertResultHtml2Json)
    .initial(12)

  return {
    results: results
  }
}

module.exports = searchResults2json
