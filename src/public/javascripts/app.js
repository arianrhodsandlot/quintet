import '@babel/polyfill'
import _ from 'lodash'
import querystring from 'querystring'
import $ from 'jquery'
import Cookies from 'cookies-js'
import imagesLoaded from 'imagesloaded'
import util from 'util'

$(() => {
  let request
  const $body = $('body')
  const $form = $('form')
  const $query = $form.find('.query')
  const $chips = $('.chips')
  const $albums = $('.albums-result')
  const $loader = $('.album-placeholder')

  $query.on('input', _.debounce(function () {
    $form.submit()
  }, 500))

  $form.submit(async function (e) {
    e.preventDefault()

    const query = $query.val().trim()

    if (!query) {
      page.replace('/')
      return
    }

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

  page(function (ctx, next) {
    if (ctx.init) {
      mdc.autoInit(document.body)
      $query.select()
    } else {
      next()
    }
  })

  page('/', function (ctx) {
    $body.attr('class', 'page-index')
    $query.focus().val('')

    $albums.empty()
  })

  page('/search', async function (ctx) {
    $body.attr('class', 'page-search')
    const {query} = querystring.parse(ctx.querystring)
    $query.focus().val(query)

    if ($albums.find('.album-container').length) {
      $albums.addClass('loading')
    } else {
      $albums.empty()
      $loader.show()
    }

    if (request) request.abort()
    request = $.get(ctx.path)

    const res = await request
    const $res = $(res)
    imagesLoaded($res.get(0), () => {
      $loader.hide()
      $albums.html($res.html()).removeClass('loading')
    })
  })

  page()
})

