import SearchForm from '../model/search-form'
import app from '../app'
import searchFormTemplate from '../template/search-form.html'

const SearchFormItem = Mn.ItemView.extend({
  tagName: 'form',
  className: 'search-form',
  attributes: {
    action: '/covers',
    autocomplete: 'off'
  },
  model: new SearchForm(),
  template: _.template(searchFormTemplate),
  ui: {
    logo: '.logo',
    query: '.query',
    scope: '.scope'
  },
  events: {
    'submit': 'search',
    'click @ui.logo': 'home',
    'change @ui.scope': 'saveScope'
  },

  search (e) {
    this.ui.query.val(
      _.trim(
        this.ui.query
        .val()
        .replace(/\s+/g, ' ')
      )
    )

    e.preventDefault()

    if (this.ui.query.val() === '') {
      return this.home(e)
    }

    // we didn't use $.fn.serialize because it will convert our spaces to "+"
    const action = this.$el.attr('action')
    const query = this.ui.query.val()
    const scope = this.ui.scope.val()

    const fragment = `${action}?query=${encodeURIComponent(query)}&scope=${scope}`

    app.trigger('navigate', fragment)

    return this
  },

  home (e) {
    e.preventDefault()
    app.trigger('navigate', this.ui.logo.attr('href'))

    return this
  },

  saveScope () {
    localStorage.setItem('scope', this.ui.scope.val())
  },

  reset () {
    this.ui.query.val('')

    return this
  },

  focus () {
    this.ui.query.focus()

    return this
  },

  blur () {
    this.ui.query.blur()

    return this
  },

  set (data) {
    this.ui.query.val(data.query)
    this.ui.scope.val(data.scope)

    return this
  },

  wake () {
    this.$el.removeClass('sleeping')

    return this
  },

  sleep () {
    this.$el.addClass('sleeping')

    return this
  },

  isSleeping () {
    return this.$el.hasClass('sleeping')
  }
})

export default SearchFormItem
