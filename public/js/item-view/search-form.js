let SearchFormItem = Mn.ItemView.extend({
  template: '#search-form-template',
  ui: {
    logo: '.logo',
    form: 'form',
    query: '.query'
  },
  events: {
    'click @ui.logo': 'home',
    'submit @ui.form': 'search'
  },

  home (e) {
    e.preventDefault()
    app.trigger('navigate', this.ui.logo.attr('href'))
  },

  search (e) {
    this.ui.query.val(_.trim(this.ui.query.val().replace(/\s+/g, ' ')))

    if (this.ui.query.val()) {
      e.preventDefault();

      var fragment = this.ui.form.attr('action') +
        '?' +
        this.ui.form.serialize()

      app.trigger('navigate', fragment)
    } else {
      this.home(e)
    }
  }
})

module.exports = SearchFormItem
