const SearchFormItem = Mn.ItemView.extend({
  tagName: 'form',
  className: 'search-form',
  attributes: {
    action: '/covers',
    autocomplete: 'off'
  },
  template: '#search-form-template',
  ui: {
    logo: '.logo',
    query: '.query',
    scope: '.scope'
  },
  events: {
    'submit': 'search',
    'click @ui.logo': 'home'
  },

  home(e) {
    e.preventDefault()
    app.trigger('navigate', this.ui.logo.attr('href'))

    return this
  },

  search(e) {
    this.ui.query.val(
      _.trim(
        this.ui.query
        .val()
        .replace(/\s+/g, ' ')
      )
    )

    e.preventDefault();

    if (this.ui.query.val() === '') {
      return this.home(e)
    }

    const fragment = this.$el.attr('action') +
      '?' +
      this.$el.serialize()

    app.trigger('navigate', fragment)

    return this
  },

  reset() {
    this.ui.query.val('')

    return this
  },

  focus() {
    this.ui.query.focus()

    return this
  },

  set(data) {
    this.ui.query.val(data.query)
    this.ui.scope.val(data.scope)

    return this
  },

  wake() {
    this.$el.removeClass('sleeping')

    return this
  },

  sleep() {
    this.$el.addClass('sleeping')

    return this
  },

  isSleeping() {
    return this.$el.hasClass('sleeping')
  }
})

export default SearchFormItem
