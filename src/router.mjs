import express from 'express'
import chowdown from 'chowdown'

const router = express.Router()

let albums
router
  .get('/', function (req, res) {
    res.locals.pageName = 'index'
    res.locals.query = ''
    res.render('index')
  })
  .get('/search', async function(req, res) {
    const {query, site} = req.query
    const requestOptions = {
      baseUrl: 'https://www.google.com',
      url: '/search',
      qs: {
        tbm: 'isch',
        gws_rd: 'cr', // get rid of our request being redirected by country
        q: `${query} site:${site || 'itunes.apple.com/jp/album'}`
      },
      timeout: 3000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36'
      }
    }
    try {
      if (albums) throw 0
      albums = await chowdown(requestOptions).collection('.rg_el .rg_meta', chowdown.query.string())
      albums = albums.map(JSON.parse)
    } catch (e) {
      console.error(e)
    }
    res.locals.pageName = 'search'
    res.locals.query = query
    res.locals.site = site
    res.locals.albums = albums || []
    res.render('search')
  })

export default router
