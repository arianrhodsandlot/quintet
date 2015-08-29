import app from './app'
import SearchResultsCovers from './collection/search-results-covers'
import SearchFormItem from './item-view/search-form'
import SearchResultsCoversItem from './item-view/search-results-covers'

let controller = {
  _showSearchForm: function() {
    var searchFormItem = app.layout
      .getRegion('searchForm')
      .currentView

    if (_.isUndefined(searchFormItem)) {
      app.layout.getRegion('searchForm')
        .show(new SearchFormItem())
    }

    return this;
  },

  home: function() {
    this._showSearchForm()

    app.layout
      .getRegion('searchResultsCovers')
      .empty()
  },

  search: function(query, scope) {
    this._showSearchForm()

    app.layout
      .getRegion('searchResultsCovers')
      .show(new SearchResultsCoversItem({
        collection: new SearchResultsCovers([], {
          data: {
            query: query,
            scope: scope
          }
        })
      }));
  }
}

let appRoutes = {
  '': 'home',
  'covers(?query=:query&scope=:scope)': 'search'
}

let Router = Mn.AppRouter.extend({
  controller, appRoutes
})

module.exports = Router
