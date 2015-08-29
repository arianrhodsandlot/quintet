let Cover = Backbone.Model.extend({
  defaults: {
    originTitle: '',
    title: '',
    refer: '',
    cover: {},
    starred: false
  },

  hasFullSize: function() {
    return this.cover.originSrc && this.cover.originSrc !== this.cover.src
  },

  star: function() {
    return this.set('starred', _.now());
  }
})

module.exports = Cover

