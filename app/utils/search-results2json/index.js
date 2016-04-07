const url = require('url')
const querystring = require('querystring')
const _ = require('lodash')
const cheerio = require('cheerio')

const getOriginSrcFromItunes = function (src) {
  const falseReg = /cover\d{3}x\d{3}/
  const trueReg = /1200x1200/

  if (falseReg.test(src) && !trueReg.test(src)) {
    src = src.replace(falseReg, 'cover1200x1200')
  }
  return src
}

const getOriginSrcFrom163 = function (src) {
  return _.assign(
    url.parse(src), {
      search: ''
    }).format(src)
}

const getOriginSrc = function (src, scope) {
  var getOriginSrc

  if (_.contains(scope, 'itunes')) {
    getOriginSrc = getOriginSrcFromItunes
  } else if (_.contains(scope, 'music.163.com')) {
    getOriginSrc = getOriginSrcFrom163
  } else {
    getOriginSrc = _.identity
  }

  return getOriginSrc(src)
}

const convertResultHtml2Json = function (resultHtml, scope) {
  const $result = cheerio(resultHtml)
  const $meta = $result.children('.rg_meta')

  const meta = JSON.parse(_.unescape($meta.html()))

  const cover = {
    originTitle: meta.pt,
    title: meta.pt,
    refer: meta.ru,
    src: meta.ou,
    originSrc: getOriginSrc(meta.ou, scope)
  }

  return cover
}

const searchResults2json = function (html, scope) {
  const $html = cheerio(html)
  const $results = $html.find('.rg_di.rg_el')

  return _($results)
    .map(_.partial(convertResultHtml2Json, _, scope))
    .take(12)
    .value()
}

module.exports = searchResults2json
