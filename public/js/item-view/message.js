const MessageView = Mn.ItemView.extend({
  className: 'message animated fadeIn',
  template: '#message-template',
  ui: {
    clearCache: '.clear-cache'
  },
  events: {
    'click @ui.clearCache': 'clearCache'
  },

  clearCache(e) {
    e.preventDefault()
    this.collection.remove(this.model)
    this.collection.save()
  },

  fade() {
    this.$el.removeClass('fadeIn').addClass('fadeOut')

    return {
      then: _.partial(_.delay, _, 1000)
    }
  }
})

export default MessageView
