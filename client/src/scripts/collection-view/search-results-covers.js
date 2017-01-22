import SearchResultsCoverView from '../item-view/search-results-cover'
import NoResultsCoverView from '../item-view/no-results-cover'

const SearchResultsCoversView = Mn.CollectionView.extend({
  className: 'search-results-covers',
  childView: SearchResultsCoverView,
  emptyView: NoResultsCoverView,

  onRender () {
    const firstCoverView = this.children.first()
    if (firstCoverView) {
      firstCoverView.$el.addClass('first')
    }
  }
})

export default SearchResultsCoversView
