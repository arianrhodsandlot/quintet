import test from 'ava'
import searcher from '../../src/searcher'

test('getCacheKey', (t) => {
  t.is(searcher.getCacheKey('aaa', 'bbb'), '{"site":"aaa","query":"bbb"}')
})

test('searchRemote', async (t) => {
  t.deepEqual(await searcher.searchRemote('xxx', 'ddd'), [])
  for (const a of await searcher.search('itunes.apple.com/jp/album', 'a')) {
    t.truthy(a.ou)
    t.truthy(a.pt)
    t.truthy(a.ru)
  }
})

test('search', async (t) => {
  t.deepEqual(await searcher.search('xxx', 'ddd'), [])

  const albums = await searcher.search('amazon.com', 'b')

  const start = Date.now()
  t.deepEqual(albums, await searcher.search('amazon.com', 'b'))
  const end = Date.now()
  const time = end - start
  t.assert(time < 10)
})
