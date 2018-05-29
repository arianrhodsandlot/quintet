import '@babel/polyfill'
import _ from 'lodash'
import querystring from 'querystring'
import $ from 'jquery'
window.$ = $
function init () {
  mdc.autoInit(document.body)
}

$(() => {
  const $body = $('body')
  const $form = $('form')
  const $query = $form.find('.query')
  const $content = $('.content')

  $form.submit(async function (e) {
    e.preventDefault()

    const url = `${$form.attr('action')}?${$form.serialize()}`
    page(url)
  })

  $content.on('click', '.mdc-chip', function (e) {
    const index = $(this).index()
    const {chips} = this.parentElement.MDCChipSet
    const targetChip = chips[index]
    const firstChip = chips[0]
    const tailChips = _.tail(chips)

    const allSelected = _.every(tailChips, (chip) => chip.isSelected())

    if (firstChip === targetChip) {
      tailChips.forEach((chip) => {
        chip.foundation.setSelected(firstChip.isSelected())
      })
    } else {
      firstChip.foundation.setSelected(allSelected)
    }

    const allUnselected = _.every(tailChips, (chip) => !chip.isSelected())
    const $firstChipIcon = $(firstChip.root_).find('.material-icons')
    const icon = allSelected || allUnselected ? 'check_box_outline_blank' : 'indeterminate_check_box'
    $firstChipIcon.text(icon)
  })

  page('/', function (ctx) {
    $body.attr('class', 'page-index')
    $content.empty()
    $query.focus().val('')

    init()
  })

  page('/search', async function (ctx) {
    $body.attr('class', 'page-search')
    $query.focus()

    const {query} = querystring.parse(ctx.querystring)
    const res = await $.get(ctx.path)
    $content.html(res)

    init()
  })

  page()
})

