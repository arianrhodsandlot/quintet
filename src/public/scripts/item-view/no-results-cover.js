import noResultsCoverTemplate from '../template/no-results-cover.html'

const NoResultsCoverView = Mn.ItemView.extend({
  className: 'no-results-cover',
  template: _.template(noResultsCoverTemplate)
})

export default NoResultsCoverView
