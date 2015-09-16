const QueryCache = Backbone.Model.extend({
  defaults: {
    query: '',
    scope: '',
    covers: [],
    add: null,
    used: 0
  },

  initialize() {
    this.set('add', _.now())
  }
})

export default QueryCache
