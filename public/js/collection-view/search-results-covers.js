import SearchResultsCoverView from '../item-view/search-results-cover'

let SearchResultsCoversView = Mn.CollectionView.extend({
  className: 'search-results-covers',
  childView: SearchResultsCoverView
})

export default SearchResultsCoversView
