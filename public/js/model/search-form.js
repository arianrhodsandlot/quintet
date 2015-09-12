const searchForm = Backbone.Model.extend({
  defaults: {
    // last used scope, stored in local storage
    scope: 'itunes-hk',

    // search histroy, to do maybe tomorrow
    histroy: [],

    // used for colors in logo
    characters: [{
      color: '#5F5A5C',
      name: 'homura'
    }, {
      color: '#FED4D7',
      name: 'madoka'
    }, {
      color: '#F9E797',
      name: 'mami'
    }, {
      color: '#89BBCB',
      name: 'sayaka'
    }, {
      color: '#BE6F81',
      name: 'kyoko'
    }],

    // all available scopes, grouped by sites
    availableScopesGroups: [{
      label: 'iTunes',
      scopes: [{
        value: 'itunes-hk',
        path: 'itunes.apple.com/hk'
      }, {
        value: 'itunes-jp',
        path: 'itunes.apple.com/jp'
      }, {
        value: 'itunes-kr',
        path: 'itunes.apple.com/kr'
      }, {
        value: 'itunes-tw',
        path: 'itunes.apple.com/tw'
      }, {
        value: 'itunes-us',
        path: 'itunes.apple.com/us'
      }]
    }, {
      label: 'Amazon',
      scopes: [{
        value: 'amazon-com',
        path: 'amazon.com'
      }, {
        value: 'amazon-jp',
        path: 'amazon.co.jp'
      }]
    }, {
      label: '其他',
      scopes: [{
        value: 'orpheus',
        path: 'music.163.com/album'
      }, {
        value: 'qq',
        path: 'y.qq.com/y/static'
      }]
    }]
  },

  initialize() {
    const scope = localStorage.getItem('scope')
    const scopes = _.compose(
      _.partial(_.pluck, _, 'value'),
      _.flatten,
      _.partial(_.pluck, _, 'scopes'),
      _.bind(this.get, this)
    )('availableScopesGroups')

    if (_.includes(scopes, scope)) {
      this.set({
        scope
      })
    }
  }
})

export default searchForm
