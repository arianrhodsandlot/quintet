'use strict'

const url = require('url')
const querystring = require('querystring')
const _ = require('lodash')
const cheerio = require('cheerio')

const getOriginSrcFromItunes = function(src) {
  const falseReg = /\d{3}x\d{3}/
  const trueReg = /1200x1200/

  if (falseReg.test(src) && !trueReg.test(src)) {
    src = src.replace(falseReg, '1200x1200')
  }
  return src
}

const getOriginSrcFrom163 = function(src) {
  return _.assign(
    url.parse(src), {
      search: ''
    }).format(src)
}

const getOriginSrc = function(src, scope) {
  let getOriginSrc

  if (_.contains(scope, 'itunes')) {
    getOriginSrc = getOriginSrcFromItunes
  } else if (_.contains(scope, 'music.163.com')) {
    getOriginSrc = getOriginSrcFrom163
  } else {
    getOriginSrc = _.identity
  }

  return getOriginSrc(src)
}

const convertResultHtml2Json = function(resultHtml, scope) {
  const $result = cheerio(resultHtml)
  const $link = $result.children('.rg_l')
  const $meta = $result.children('.rg_meta')

  const href = $link.attr('href')
  const query = url.parse(href).query
  const resultData = querystring.parse(query)

  const meta = JSON.parse(_.unescape($meta.html()))

  const src = decodeURIComponent(resultData.imgurl)

  const cover = {
    originTitle: meta.s,
    title: _.first(meta.s.split(',')),
    refer: decodeURIComponent(resultData.imgrefurl),
    src,
    originSrc: getOriginSrc(src, scope)
  }

  return cover
}

const searchResults2json = function(html, scope) {
  const $html = cheerio(html)
  const $results = $html.find('.rg_di.rg_el')

  return _($results)
    .map(_.partial(convertResultHtml2Json, _, scope))
    .take(12)
    .value()
}

module.exports = searchResults2json
