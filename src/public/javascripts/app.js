import '@babel/polyfill'
import _ from 'lodash'
import querystring from 'querystring'
import $ from 'jquery'
import Cookies from 'cookies-js'

window.$ = $

function init () {
  mdc.autoInit(document.body)
}

$(() => {
  const $body = $('body')
  const $form = $('form')
  const $query = $form.find('.query')
  const $chips = $('.chips')
  const $albums = $('.albums-result')
  const $loader = $('.album-placeholder')

  $form.submit(async function (e) {
    e.preventDefault()

    const parsed = querystring.parse($form.serialize())
    parsed.site = Cookies('site')
    const url = `${$form.attr('action')}?${$form.serialize()}`
    page(url)
  })

  $chips.on('click', '.mdc-chip', function () {
    const index = $(this).index()
    const {chips} = this.parentElement.MDCChipSet
    const targetChip = chips[index]

    chips.forEach((chip) => {
      chip.foundation.setSelected(chip === targetChip)
    })

    const site = targetChip.root_.dataset.site
    Cookies('site', site)
    const parsed = querystring.parse(location.search.slice(1))
    parsed.site = site
    page.replace('/search?' + querystring.stringify(parsed))
  })

  page('/', function (ctx) {
    $body.attr('class', 'page-index')
    $albums.empty()
    $query.focus().val('')

    init()
  })

  page('/search', async function (ctx) {
    $body.attr('class', 'page-search')
    $albums.empty()

    $query.focus()

    const {query} = querystring.parse(ctx.querystring)
    $loader.show()
    const res = await $.get(ctx.path)
    $loader.hide()
    $albums.html($(res).html())

    init()
  })

  page()
})

