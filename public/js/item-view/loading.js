const LoadingView = Mn.ItemView.extend({
  className: 'loading',
  template: '#loading-template',
  ui: {
    spinner: '.spinner',
    warn: '.warn',
    error: '.error'
  },

  warn(msg) {
    this.ui.spinner.removeClass('hidden')
    this.ui.error.addClass('hidden').empty()
  	this.ui.warn.removeClass('hidden').html(msg)
  },

  error(msg) {
    this.ui.spinner.addClass('hidden')
  	this.ui.warn.addClass('hidden').empty()
  	this.ui.error.removeClass('hidden').html(msg)
  }
})

export default LoadingView
