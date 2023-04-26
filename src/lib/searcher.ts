import { load } from 'cheerio'
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({ max: 500 })
const baseSearchUrl = 'https://www.google.com/search'
const fakeUserAgent =
  'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Mobile Safari/537.36'
const params = {
  // this param means image search
  tbm: 'isch',
  // get rid of our request being redirected by country
  gws_rd: 'cr',
}
const headers = {
  'user-agent': fakeUserAgent,
}

function getCacheKey(site: string, query: string) {
  return JSON.stringify({ site, query })
}

async function searchRemote(site: string, query: string) {
  const q = `site:${site} ${query}`
  const searchUrl = `${baseSearchUrl}?${new URLSearchParams({ ...params, q })}`

  const response = await fetch(searchUrl, {
    headers,
  })
  const html = await response.text()

  const $ = load(html)
  const result = $('.islrtb')
    .slice(0, 9)
    .map(function () {
      const data = $(this).data() as Record<string, string>
      return {
        src: data.ou,
        refer: data.ru,
        title: data.pt,
      }
    })
    .toArray()

  const cacheKey = getCacheKey(site, query)
  cache.set(cacheKey, result)
  return result
}

export async function search(site: string, query: string) {
  type Result = Awaited<ReturnType<typeof searchRemote>>
  const cacheKey = getCacheKey(site, query)
  let result = cache.get(cacheKey) as Result
  if (!result) {
    result = await searchRemote(site, query)
  }
  return result
}
