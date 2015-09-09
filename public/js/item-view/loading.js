const LoadingView = Mn.ItemView.extend({
  className: 'loading',
  template: '#loading-template',
  ui: {
    warn: '.warn',
    error: '.error'
  },

  warn() {
  	this.ui.warn.removeClass('hidden')
  },

  error() {
  	this.ui.warn.addClass('hidden')
  	this.ui.error.removeClass('hidden')
  }
})

export default LoadingView
