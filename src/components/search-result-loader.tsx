import { Grid, GridCell, GridRow } from 'rmwc'
import { SearchResultLoaderItem } from './search-result-loader-item'

const searchResultLoaderItem = <SearchResultLoaderItem />
const tailItems = Array.from({ length: 8 }).map((_, index) => (
  <GridCell span={3} key={index}>
    {searchResultLoaderItem}
  </GridCell>
))
const searchResultLoader = (
  <Grid>
    <GridCell span={4}>{searchResultLoaderItem}</GridCell>
    <GridCell span={8}>
      <GridRow>{tailItems}</GridRow>
    </GridCell>
  </Grid>
)
export function SearchResultLoader() {
  return searchResultLoader
}
