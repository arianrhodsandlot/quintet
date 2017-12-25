import app from './app'
import SearchResultsCovers from './collection/search-results-covers'
import QueryCache from './model/query-cache'
import QueryCaches from './collection/query-caches'
import SearchFormView from './item-view/search-form'
import SearchResultsCoversView from './collection-view/search-results-covers'
import LoadingView from './item-view/loading'
import MessageView from './item-view/message'

const showSearchForm = () => {
  const searchFormView = app.layout
    .getRegion('searchForm')
    .currentView

  if (_.isUndefined(searchFormView)) {
    app.layout.showChildView('searchForm', new SearchFormView())
  }
}

const controller = {}

controller.home = () => {
  showSearchForm()

  app.layout
    .getRegion('searchForm')
    .currentView
    .sleep()
    .reset()
    .focus()

  app.layout
    .getRegion('searchResultsCovers')
    .empty()

  app.layout
    .getRegion('message')
    .empty()
}

const showCovers2Region = (collection, region) => {
  const searchFormRegion = app.layout.getRegion('searchForm')
  const searchResultsCoversView = new SearchResultsCoversView({collection})
  const isSleeping = searchFormRegion.currentView.isSleeping()

  const show = _.bind(
    region.show,
    region,
    searchResultsCoversView
  )

  _.identity(isSleeping ? _.defer : _.attempt)(show)
}

controller.search = (query, scope) => {
  const searchFormRegion = app.layout.getRegion('searchForm')
  const messageRegion = app.layout.getRegion('message')
  const searchResultsCovers = new SearchResultsCovers()
  const searchResultsCoversRegion = app.layout.getRegion('searchResultsCovers')
  const data = {
    query, scope
  }
  const queryCaches = new QueryCaches()
  const queryCache = queryCaches.findWhere(data)
  const loadingView = new LoadingView()

  showSearchForm()

  searchFormRegion
    .currentView
    .set(data)
    .wake()
    .blur()

  // bind sync callbacks to our covers collection
  searchResultsCovers
    .on('request', () => searchResultsCoversRegion.show(loadingView))
    .on('sync', _.partial(
      showCovers2Region,
      searchResultsCovers,
      searchResultsCoversRegion
    ))

  // detect if search result can be found in our cache
  if (queryCache) {
    const messageView = new MessageView({
      model: queryCache,
      collection: queryCaches
    })

    // if user click 'clear cache', do search once more.
    queryCaches.once('sync', _.partial(controller.search, query, scope))

    searchResultsCovers.add(queryCache.get('covers'))
    searchResultsCovers.trigger('sync')

    _.delay(_.bind(messageRegion.show, messageRegion, messageView), 500)
  } else {
    const normalTime = 4000
    const warnTime = 8000
    const timeout = 12000

    const normalTimer = _.delay(() => loadingView.warn('仍在搜索……'), normalTime)
    const warnTimer = _.delay(() => loadingView.warn('载入时间比平时要长……'), warnTime)

    searchResultsCovers
      .fetch({data, timeout})
      .done(function (covers) {
        if (_.isEmpty(covers)) return

        queryCaches.add(new QueryCache(_.assign(data, {covers})))
        queryCaches.save()
      })
      .fail(function () {
        loadingView.error()
      })
      .always(function () {
        _.forEach([normalTimer, warnTimer], clearTimeout)
      })

    messageRegion.empty()
  }
}

export default controller
