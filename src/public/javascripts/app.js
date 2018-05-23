import '@babel/polyfill'
import $ from 'jquery'
window.$ = $
$(function () {
  mdc.autoInit(document.body)

  const $form = $('form')
  $form.submit(async function (e) {
    e.preventDefault()

    const res = await $.get(`${$form.attr('action')}?${$form.serialize()}`)
    const $res = $.parseHTML(res)

    console.log(res, $res)
    window.res = res
    window.$res = $res

    $('body').removeClass('page-index').addClass('page-search')
  })
})

