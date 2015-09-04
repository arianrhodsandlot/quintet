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
  }
})

export default MessageView
