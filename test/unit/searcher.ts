import test from 'ava'
import searcher from '../../src/searcher'

test('getCacheKey', (t) => {
  t.is(searcher.getCacheKey('aaa', 'bbb'), '{"site":"aaa","query":"bbb"}')
})

test('searchRemote', async (t) => {
  const albums = await searcher.search('itunes.apple.com/jp/album', 'a')
  for (const a of albums) {
    t.truthy(a.ou)
    t.truthy(a.pt)
    t.truthy(a.ru)
  }
})

test('search', async (t) => {
  const albums = await searcher.search('amazon.com', 'b')

  const start = Date.now()
  t.deepEqual(albums, await searcher.search('amazon.com', 'b'))
  const end = Date.now()
  const time = end - start
  t.assert(time < 10)
})
