const Cover = Backbone.Model.extend({
  defaults: {
    originTitle: '',
    title: '',
    refer: '',
    cover: {},
    starred: false
  },

  star () {
    return this.set('starred', _.now())
  }
})

export default Cover
