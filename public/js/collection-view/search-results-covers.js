import SearchResultsCoverView from '../item-view/search-results-cover'

const SearchResultsCoversView = Mn.CollectionView.extend({
  className: 'search-results-covers',
  childView: SearchResultsCoverView,

  onRender() {
    const firstCoverView = this.children.first()
    if (firstCoverView) {
      firstCoverView.$el.addClass('first')
    }
  }
})

export default SearchResultsCoversView
