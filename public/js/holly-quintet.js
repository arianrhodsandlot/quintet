/* global _, Backbone*/
$(function() {
  var hollyquintet = {} //Backbone objects container

  var SearchFormModel = Backbone.Model.extend({
    defaults: {
      query: null,
      scope: null
    }
  })
  var SearchResultsModel = Backbone.Model.extend({
    defaults: {
      loaded: false,
      results: null
    },
    url: function() {
      var url = '/api/search/<%= query %><%= scope ? "?scope=" + scope : "" %>'
      var query = _.trim(hollyquintet.searchFormModel.get('query'))
      var scope = hollyquintet.searchFormModel.get('scope')
      return _.template(url)({
        query: query,
        scope: scope
      })
    }
  })

  _.extend(hollyquintet, {
    searchFormModel: new SearchFormModel(),
    searchResultsModel: new SearchResultsModel()
  })

  var SearchFormView = Backbone.View.extend({
    el: '.search-form',
    model: hollyquintet.searchFormModel,
    events: {
      'click .logo': 'home',
      submit: 'search',
      'change .scope': 'saveScope'
    },
    initialize: function() {
      this.listenTo(this.model, 'change:query change:scope', this.render)
      this.listenTo(hollyquintet.searchResultsModel, 'loading loaded', this.render)
    },
    render: function() {
      var query = _.trim(this.model.get('query'))
      var scope = this.model.get('scope')

      this.$el
        .find('.query')
        .val(query)

      this.$el
        .find('.scope')
        .val(scope)

      if (query === '') {
        this.$el.addClass('empty')
      } else {
        this.$el.removeClass('empty')
      }

      if (hollyquintet.searchResultsModel.get('loaded')) {
        this.$el
          .find('.submit')
          .val('搜索封面')
      } else {
        this.$el
          .find('.submit')
          .val('请稍候……')
      }
    },
    home: function(e){
      e.preventDefault()
      hollyquintet.router.navigate('', {
        trigger: true
      })
      this.$el.find('.query').focus()
    },
    search: function(e) {
      var query = _.trim(this.$el.find('.query').val())
      var scope = this.$el.find('.scope').val()
      var target = query === '' ?
        '' :
        'search/' + query

      if (query && scope) {
        target += '?scope=' + scope
      }

      hollyquintet.router.navigate(target, {
        trigger: true
      })

      e.preventDefault()
    },
    saveScope: function() {
      this.$el.find('.query').focus()
      localStorage.scope = this.$el
        .find('.scope')
        .val()
    }
  })
  var SearchResultsView = Backbone.View.extend({
    el: '.search-results',
    model: hollyquintet.searchResultsModel,
    template: _.template($('#result-template').html()),
    initialize: function() {
      this.listenTo(this.model, 'loading loaded', this.render)
    },
    render: function() {
      var data = _.extend(hollyquintet.searchResultsModel.attributes, hollyquintet.searchFormModel.attributes)
      var html = this.template(data)
      this.$el.html(html)
      return this
    }
  })

  var Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'search/:query(?scope=:scope)': 'search'
    },
    home: function() {
      hollyquintet.searchFormModel.set({
        'query': '',
        'scope': localStorage.scope ?
          localStorage.scope : hollyquintet.searchFormView.$el.find('option').val()
      })

      hollyquintet.searchResultsModel
        .set({
          'results': [],
          'loaded': true
        })

      hollyquintet.searchResultsModel
        .trigger('loaded')

      _.defer(function() {
        $(document.body).removeClass('notinited')
      })
    },
    search: function(query, scope) {
      var formAnimateTransition = 400

      scope = scope ?
        scope :
        localStorage.scope ?
        localStorage.scope :
        hollyquintet.searchFormView.$el.find('option').val()


      hollyquintet.searchFormModel
        .set({
          'query': _.trim(query),
          'scope': scope
        })

      hollyquintet.searchResultsModel
        .set({
          loaded: false
        })
        .trigger('loading')

      _.delay(function() {
        $(document.body).removeClass('notinited')
      }, formAnimateTransition)
    }
  })

  _.extend(hollyquintet, {

    searchFormView: new SearchFormView(),
    searchResultsView: new SearchResultsView(),

    router: new Router()
  })

  hollyquintet.searchResultsModel
    .on('loading loaded', function() {
      var query = hollyquintet.searchFormModel.get('query')
      var loaded = this.get('loaded')

      query = _.trim(query)

      hollyquintet.searchFormModel
        .trigger('loaded')

      if (loaded) {
        return false
      }

      this.set({
        'loaded': false,
        'results': []
      })

      if (query) {
        hollyquintet.searchResultsModel.fetch({
          success: function() {
            hollyquintet.searchResultsModel.set({
              loaded: true
            }).trigger('loaded')
          },
          error: function() {
            hollyquintet.searchResultsModel.set({
              loaded: true,
              results: []
            }).trigger('loaded')
          }
        })
      }
    })

  Backbone.history.start({
    pushState: true
  })

  //exports hollyquintet to global for debug use
  window.hollyquintet = hollyquintet
})
