import { useState } from 'react'
import { Elevation, Icon, ImageListImage, ImageListImageAspectContainer } from 'rmwc'
import { getCoverOriginSrc } from '../lib/utils'
import { SearchResultLoaderItem } from './search-result-loader-item'

export function AlbumCover({ album }: { album: { src: string; title: string; refer: string } }) {
  const [loaded, setLoaded] = useState(false)

  const originalSrc = getCoverOriginSrc(album.src)

  function onLoad() {
    setLoaded(true)
  }

  if (loaded) {
    return (
      <Elevation
        className='group relative transform-gpu overflow-hidden rounded-lg text-white transition-transform duration-500 hover:scale-[1.01]'
        z={3}
      >
        <ImageListImageAspectContainer>
          <div
            className='absolute left-0 top-0 h-full w-full transform-gpu bg-[#5050504d] bg-cover transition-transform will-change-transform group-hover:scale-[1.02]'
            style={{ backgroundImage: `url(${originalSrc})` }}
          />
          <a className='group' href={originalSrc} rel='noreferrer' target='_blank' title='Download this image'>
            <ImageListImage className='object-cover opacity-0' src={originalSrc} />
            <div className='pointer-events-none absolute flex h-full w-full items-center justify-center'>
              <Icon
                className='scale-150 transform-gpu !text-8xl opacity-0 transition-[transform,opacity] duration-500 group-hover:scale-100 group-hover:opacity-100'
                icon='download'
                style={{ textShadow: '0 0 10px #888' }}
              />
            </div>
          </a>
        </ImageListImageAspectContainer>
        <div className='absolute bottom-0 left-0 right-0 flex bg-[#00000099] text-xs'>
          <a
            className='flex min-w-0 flex-1 items-center p-2 transition-[background-color] hover:bg-[#00000080]'
            href={album.refer}
            rel='noreferrer'
            target='_blank'
            title={album.title}
          >
            <Icon className='align-middle' icon='link' />
            <div className='ml-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap'>
              {album.title} {album.title} {album.title}
            </div>
          </a>
          <a
            className='p-2 hover:bg-[#00000080]'
            href={originalSrc}
            rel='noreferrer'
            target='_blank'
            title='View the original image'
          >
            <Icon className='align-middle' icon='zoom_in' />
          </a>
        </div>
      </Elevation>
    )
  }
  return (
    <SearchResultLoaderItem>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={album.title} className='absolute h-1 w-1 scale-0 opacity-0' onLoad={onLoad} src={originalSrc} />
    </SearchResultLoaderItem>
  )
}
