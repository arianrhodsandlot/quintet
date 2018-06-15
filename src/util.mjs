import url from 'url'
import path from 'path'

function getCertainSizeSrcFromItunes (src, width = 10000, height = width) {
  let parsed = url.parse(src, false)
  let parsedPath = path.parse(parsed.pathname)
  parsedPath.name = parsedPath.name.replace(/\d+x\d+/, `${width}x${height}`)
  parsedPath.base = `${parsedPath.name}${parsedPath.ext}`
  parsed.pathname = path.format(parsedPath)
  return url.format(parsed)
}

function getCoverOriginSrcFrom163 (src) {
  let parsed = url.parse(src, false)
  parsed.search = null
  return url.format(parsed)
}

function getCoverOriginSrcFromVgm (src) {
  let parsed = url.parse(src, false)
  parsed.host = 'media.vgm.io'
  return url.format(parsed)
}

export function getCoverOriginSrc (src) {
  const coverHost = url.parse(src, true).hostname

  if (coverHost.endsWith('.mzstatic.com')) {
    return getCertainSizeSrcFromItunes(src)
  }

  if (coverHost.endsWith('.music.126.net')) {
    return getCoverOriginSrcFrom163(src)
  }

  if (coverHost.endsWith('-media.vgm.io')) {
    return getCoverOriginSrcFromVgm(src)
  }

  return src
}

export function getCoverDownloadSrc (src, filename) {
  const originSrc = getCoverOriginSrc(src)
  return url.format({
    pathname: '/file',
    query: {
      url: originSrc,
      filename: `${filename}.jpg`
    }
  })
}
