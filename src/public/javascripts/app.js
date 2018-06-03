let request
const $body = $('body')
const $form = $('form')
const $query = $form.find('.query')
const $chips = $('.chips')
const $albums = $('.albums-result')
const $loader = $('.album-placeholder')

function updateBg (src) {
  if (!src) return

  $('.bg:not(:last)').remove()

  const $bg = $('.bg')
  if ($bg.css('background-image').indexOf(src) > -1) return

  const $newBg = $('.bg').clone()
  Cookies('bg', src)
  $newBg.css({
    'background-image': `url(${src})`,
    opacity: 0
  })
  $bg.before($newBg)

  setTimeout(() => {
    $bg.css('opacity', 0)
    $newBg.css('opacity', '')
    setTimeout(() => {
      $bg.remove()
    }, 3000)
  }, 50)
}

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

  const parsed = Qs.parse($form.serialize())
  parsed.site = Cookies('site')
  const url = `${$form.attr('action')}?${Qs.stringify(parsed)}`
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
  const parsed = Qs.parse(location.search.slice(1))
  parsed.site = site
  page.replace('/search?' + Qs.stringify(parsed))
})

$albums.on('click', '.download-mask', function () {
  const $container = $(this).closest('.album-container')
  const src = $container.find('img.album-img').attr('src')
  updateBg(src)
})

let infoDialog
$('.info').click(function () {
  if (!infoDialog) {
    infoDialog = $('.info-dialog').get(0).MDCDialog
  }

  infoDialog.show()
})

page(function (ctx, next) {
  if (request) request.abort()

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
  document.title = 'Holly Quintet'
  $albums.empty()
})

page('/search', async function (ctx) {
  $body.attr('class', 'page-search')
  const {query} = Qs.parse(ctx.querystring)
  $query.focus().val(query)

  document.title = `${query} - Holly Quintet`

  if ($albums.find('.album-container').length) {
    $albums.addClass('loading')
  } else {
    $albums.empty()
    $loader.show()
  }

  request = $.get(ctx.path)
  const res = await request

  const $res = $(res)
  const $newAlbums = $res.filter('.albums')
  const $title = $res.filter('title')

  document.title = $title.text()

  imagesLoaded($newAlbums.get(0), () => {
    if ($newAlbums.data('query') !== query) return

    $loader.hide()
    $albums.html($newAlbums.html()).removeClass('loading')
    updateBg($res.find('.album-img').attr('src'))
  })
})

page()
