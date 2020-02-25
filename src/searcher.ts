import LRU from 'lru-cache'
import request from 'request'
import chowdown from 'chowdown'
// eslint-disable-next-line node/no-unpublished-import
import Agent from 'socks5-https-client/lib/Agent'

const cache = new LRU({ max: 500 })
const baseRequestOptions: request.Options = {
  baseUrl: 'https://www.google.com',
  uri: '/search',
  qs: {
    hl: 'zh-CN',
    tbm: 'isch',
    // get rid of our request being redirected by country
    gws_rd: 'cr'
  },
  timeout: 3000,
  headers: {
    'user-agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Mobile Safari/537.36'
  }
}
if (process.env.NODE_ENV !== 'production') {
  baseRequestOptions.agentClass = Agent
}

export default class Searcher {
  static getCacheKey (site: string, query: string) {
    return JSON.stringify({ site, query })
  }

  static async searchRemote (site: string, query: string) {
    const requestOptions: request.Options = {
      ...baseRequestOptions,
      qs: {
        ...baseRequestOptions.qs,
        q: `site:${site} ${query}`
      }
    }

    const albums = await chowdown(requestOptions)
      .collection('.islrtb', {
        ou: '/data-ou',
        pt: '/data-pt',
        ru: '/data-ru',
      })

    const cacheKey = Searcher.getCacheKey(site, query)
    cache.set(cacheKey, albums)
    return albums
  }

  static async search (site: string, query: string) {
    const cacheKey = Searcher.getCacheKey(site, query)
    let albums = cache.get(cacheKey) as {ou: string; pt: string; ru: string}[]
    if (!albums) {
      albums = await Searcher.searchRemote(site, query)
    }
    return albums
  }
}
