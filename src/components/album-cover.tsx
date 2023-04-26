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
        z={3}
        className='group relative transform-gpu overflow-hidden rounded-lg text-white transition-transform duration-500 hover:scale-[1.01]'
      >
        <ImageListImageAspectContainer>
          <div
            className='absolute left-0 top-0 h-full w-full transform-gpu bg-[#5050504d] bg-cover transition-transform will-change-transform group-hover:scale-[1.02]'
            style={{ backgroundImage: `url(${originalSrc})` }}
          />
          <a href={originalSrc} target='_blank' className='group' title='Download this image' rel='noreferrer'>
            <ImageListImage src={originalSrc} className='object-cover opacity-0' />
            <div className='pointer-events-none absolute flex h-full w-full items-center justify-center'>
              <Icon
                icon='download'
                className='scale-150 transform-gpu !text-8xl opacity-0 transition-[transform,opacity] duration-500 group-hover:scale-100 group-hover:opacity-100'
                style={{ textShadow: '0 0 10px #888' }}
              />
            </div>
          </a>
        </ImageListImageAspectContainer>
        <div className='absolute bottom-0 left-0 right-0 flex bg-[#00000099] text-xs'>
          <a
            className='flex min-w-0 flex-1 items-center p-2 transition-[background-color] hover:bg-[#00000080]'
            href={album.refer}
            target='_blank'
            title={album.title}
            rel='noreferrer'
          >
            <Icon icon='link' className='align-middle' />
            <div className='ml-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap'>
              {album.title} {album.title} {album.title}
            </div>
          </a>
          <a
            className='p-2 hover:bg-[#00000080]'
            href={originalSrc}
            target='_blank'
            title='View the original image'
            rel='noreferrer'
          >
            <Icon icon='zoom_in' className='align-middle' />
          </a>
        </div>
      </Elevation>
    )
  }
  return (
    <SearchResultLoaderItem>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='absolute h-1 w-1 scale-0 opacity-0' alt={album.title} src={originalSrc} onLoad={onLoad} />
    </SearchResultLoaderItem>
  )
}
