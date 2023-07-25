import { useRouter } from 'next/router'
import { Grid, GridCell, GridRow, Icon, classNames } from 'rmwc'
import { useSearch } from '../lib/request'
import { AlbumCover } from './album-cover'
import { SearchResultLoader } from './search-result-loader'

const ErrorMessage = (
  <div className='pt-20 text-center'>
    <Icon className='select-none text-8xl text-[#cfcfcf]' icon='disc_full' />
  </div>
)

export function SearchResult() {
  const router = useRouter()

  const { query, site } = router.query
  const { isLoading, data, error } = useSearch({
    site: site ? `${site}` : '',
    query: query ? `${query}` : '',
  })

  if (!query || !site) {
    return ErrorMessage
  }

  if (isLoading && !data) {
    return <SearchResultLoader />
  }

  if (!data?.length || error) {
    return ErrorMessage
  }

  const [first, ...rest] = data
  return (
    <Grid className={classNames(['transition-[filter]', { 'pointer-events-none opacity-40 blur-sm': isLoading }])}>
      <GridCell span={4}>
        <AlbumCover album={first} />
      </GridCell>
      <GridCell span={8}>
        <GridRow>
          {rest.map((album) => (
            <GridCell key={album.src} span={3}>
              <AlbumCover album={album} />
            </GridCell>
          ))}
        </GridRow>
      </GridCell>
    </Grid>
  )
}
