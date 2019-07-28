import test from 'ava'
import * as util from '../src/util'

test('getCoverDownloadSrc', (t) => {
  t.is(util.getCoverDownloadSrc('aaa', 'bbb'), '/file?url=aaa&filename=bbb.jpg')
  t.is(util.getCoverDownloadSrc('https://is5-ssl.mzstatic.com/image/thumb/Music128/v4/fd/2f/d0/fd2fd05b-6fa2-9b98-063f-c76709323a83/093624909347.jpg/10000x10000w.jpg', 'a'), '/file?url=https%3A%2F%2Fis5-ssl.mzstatic.com%2Fimage%2Fthumb%2FMusic128%2Fv4%2Ffd%2F2f%2Fd0%2Ffd2fd05b-6fa2-9b98-063f-c76709323a83%2F093624909347.jpg%2F10000x10000w.jpg&filename=a.jpg')

})

test('getCoverOriginSrc', (t) => {
  t.is(util.getCoverOriginSrc(''), '')
  t.is(util.getCoverOriginSrc('https://is3-ssl.mzstatic.com/image/thumb/Music/a0/65/38/mzi.xisxevid.jpg/268x0w.jpg'), 'https://is3-ssl.mzstatic.com/image/thumb/Music/a0/65/38/mzi.xisxevid.jpg/10000x10000w.jpg')
  t.is(util.getCoverOriginSrc('http://p2.music.126.net/tGcXYE4mMtx9NWQI5db6Mw==/109951163456764814.jpg?param=177y177'), 'http://p2.music.126.net/tGcXYE4mMtx9NWQI5db6Mw==/109951163456764814.jpg')
  t.is(util.getCoverOriginSrc('https://medium-media.vgm.io/albums/71/6817/6817-1200070216.jpg'), 'https://media.vgm.io/albums/71/6817/6817-1200070216.jpg')
})

test('getJsdelivrCombinedLink', (t) => {
  t.is(util.getJsdelivrCombinedLink([]), 'https://cdn.jsdelivr.net/combine/')
  t.is(util.getJsdelivrCombinedLink([{
    name: 'material-components-web',
    version: '3.1.0',
    path: 'dist/material-components-web.min.css'
  }]), 'https://cdn.jsdelivr.net/combine/npm/material-components-web@3.1.0/dist/material-components-web.min.css')
  t.is(util.getJsdelivrCombinedLink([{
    name: 'cookies-js',
    version: '1.2.3'
  }, {
    name: 'imagesloaded',
    version: '4.1.4',
    path: 'imagesloaded.pkgd.min.js'
  }, {
    name: 'jquery',
    version: '3.3.1'
  }, {
    name: 'lodash',
    version: '4.17.10'
  }]), 'https://cdn.jsdelivr.net/combine/npm/cookies-js@1.2.3,npm/imagesloaded@4.1.4/imagesloaded.pkgd.min.js,npm/jquery@3.3.1,npm/lodash@4.17.10')
})
