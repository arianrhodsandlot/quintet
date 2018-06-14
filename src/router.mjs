import _ from 'lodash'
import express from 'express'
import url from 'url'
import request from 'request'
import Searcher from './searcher'
import sites from './consts/sites'
import {getCoverDownloadSrc} from './util'

const router = express.Router()
const defaultBg = '/images/default.jpg'

const veryLateDate = new Date(253402300000000)

router
  .use(function (req, res, next) {
    let site = req.cookies.site || sites[0].site
    res.cookie('site', site, {expires: veryLateDate})
    res.locals.site = site
    res.locals.sites = sites
    res.locals.req = req
    res.locals.bg = req.cookies.bg || defaultBg
    res.locals.getCoverDownloadSrc = getCoverDownloadSrc
    next()
  })
  .get('/', function (req, res) {
    res.locals.pageName = 'index'
    res.locals.query = ''
    res.locals.title = 'Holly Quintet'

    res.render('index')
  })
  .get('/search', async function (req, res, next) {
    let {query = '', site = ''} = req.query

    if (!query) {
      next()
      return
    }

    const parsed = url.parse(req.path, true)
    const trimmedQuery = query.trim()

    if (query !== trimmedQuery) {
      parsed.search = null
      parsed.query.query = trimmedQuery
      const redirectUrl = url.format(parsed)
      res.redirect(redirectUrl)
      return
    }

    const isValidSite = _(sites).map('site').includes(site)
    if (!isValidSite) {
      parsed.search = null
      parsed.query.query = trimmedQuery
      parsed.query.site = sites[0].site
      const redirectUrl = url.format(parsed)
      res.redirect(redirectUrl)
      return
    }

    const albums = await Searcher.search(site, trimmedQuery)

    const bg = _.get(albums, '0.ou')
    if (bg) {
      res.cookie('bg', bg, {expires: veryLateDate})
      res.locals.bg = bg
    }

    res.cookie('site', site, {expires: veryLateDate})
    res.locals.site = site
    res.locals.pageName = 'search'
    res.locals.query = trimmedQuery
    res.locals.albums = albums
    res.locals.title = `${trimmedQuery} - Holly Quintet`

    res.render(req.xhr ? 'albums' : 'index')
  })
  .get('/file', async function (req, res, next) {
    if (!req.query.url) {
      next()
      return
    }

    request(req.query.url)
      .on('response', function (remoteRes) {
        delete remoteRes.headers['content-disposition']
        res.attachment(req.query.filename)
      })
      .pipe(res)
  })
  .get('*', function (req, res) {
    res.redirect('/')
  })

export default router
