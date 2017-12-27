export default function scope2site (scope) {
  let site = ''
  switch (scope) {
    case 'itunes-hk':
    case 'itunes-jp':
    case 'itunes-tw':
    case 'itunes-us':
      site = `itunes.apple.com/${scope.slice('itunes-'.length)}/album`
      break
    case 'amazon-com':
      site = 'amazon.com'
      break
    case 'amazon-jp':
      site = 'amazon.co.jp'
      break
    case 'vgmdb':
      site = 'vgmdb.net/album'
      break
    case 'orpheus':
      site = 'music.163.com/album'
      break
    case 'qq':
      site = 'y.qq.com/n/yqq/album'
      break
    case 'musicbrainz':
      site = 'musicbrainz.org'
      break
  }
  return site
}
