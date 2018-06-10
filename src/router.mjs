import _ from 'lodash'
import express from 'express'
import chowdown from 'chowdown'
import Agent from 'socks5-https-client/lib/Agent'
import url from 'url'
import request from 'request'
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

    const requestOptions = {
      baseUrl: 'https://www.google.com',
      url: '/search',
      qs: {
        hl: 'zh-CN',
        tbm: 'isch',
        gws_rd: 'cr', // get rid of our request being redirected by country
        q: `site:${site} ${trimmedQuery}`
      },
      timeout: 3000,
      headers: {
        'user-agent': req.get('user-agent')
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      requestOptions.agentClass = Agent
    }

    let albums
    try {
      albums = await chowdown(requestOptions).collection('.rg_el .rg_meta', chowdown.query.string())
      albums = albums.map(JSON.parse)
    } catch (e) {
      console.error(e) // eslint-disable-line
    }

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
