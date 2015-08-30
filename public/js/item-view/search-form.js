let SearchFormItem = Mn.ItemView.extend({
  tagName: 'form',
  className: 'search-form',
  attributes: {
    action: '/covers',
    autocomplete: 'off'
  },
  template: '#search-form-template',
  ui: {
    logo: '.logo',
    query: '.query'
  },
  events: {
    'submit': 'search',
    'click @ui.logo': 'home'
  },

  home(e) {
    e.preventDefault()
    app.trigger('navigate', this.ui.logo.attr('href'))
  },

  search(e) {
    this.ui.query.val(_.trim(this.ui.query.val().replace(/\s+/g, ' ')))

    if (this.ui.query.val()) {
      e.preventDefault();

      var fragment = this.$el.attr('action') +
        '?' +
        this.$el.serialize()

      app.trigger('navigate', fragment)
    } else {
      this.home(e)
    }
  }
})

module.exports = SearchFormItem
