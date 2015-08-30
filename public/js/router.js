import app from './app'
import SearchResultsCovers from './collection/search-results-covers'
import SearchFormView from './item-view/search-form'
import SearchResultsCoversView from './collection-view/search-results-covers'
import LoadingView from './item-view/loading'

let controller = {
  _showSearchForm: function() {
    var searchFormView = app.layout
      .getRegion('searchForm')
      .currentView

    if (_.isUndefined(searchFormView)) {
      app.layout.getRegion('searchForm')
        .show(new SearchFormView())
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

    let searchResultsCoversRegion = app.layout.getRegion('searchResultsCovers')
    let searchResultsCovers = new SearchResultsCovers()

    searchResultsCovers
      .on('request', function() {
        searchResultsCoversRegion.show(new LoadingView());
      })
      .on('sync', function() {
        searchResultsCoversRegion.show(new SearchResultsCoversView({
          collection: searchResultsCovers
        }));
      })
      .fetch({
        data: {
          query, scope
        }
      })

  }
}

let appRoutes = {
  '': 'home',
  'covers(?query=:query&scope=:scope)': 'search'
}

let Router = Mn.AppRouter.extend({
  controller, appRoutes
})

export default Router
