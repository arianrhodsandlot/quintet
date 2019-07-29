import { AddressInfo } from 'net'
import test, { ExecutionContext } from 'ava'
import puppeteer from 'puppeteer'
import server from '../../src/server'

test.serial.before(async (t) => {
  await new Promise((resolve) => {
    server.on('listening', () => {
      resolve()
    })
  })

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  (t as ExecutionContext<{browser: puppeteer.Browser}>).context.browser = browser
})

test.serial('search', async (t) => {
  const { browser } = (t as ExecutionContext<{browser: puppeteer.Browser}>).context

  const page = await browser.newPage()
  const { port } = server.address() as AddressInfo
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle2' })
  await page.type('input', 'a')
  await page.waitForSelector('.album-placeholder')
  t.is(await page.evaluate('$(".mdc-chip--selected").index()'), 0)

  await page.waitForSelector('.albums-result .album-img')
  const img1: string = await page.evaluate('$(".albums-result .album-img").attr("src")')
  t.assert(img1.includes('.mzstatic.com/image'))

  await page.click('#mdc-chip-8')
  await page.waitForSelector('.loading')
  t.is(await page.evaluate('$(".mdc-chip--selected").index()'), 7)

  await page.waitForSelector('.albums-result:not(.loading)')
  const img2: string = await page.evaluate('$(".albums-result .album-img").attr("src")')
  t.assert(img2.includes('media.vgm.io/'))

  await page.close()
})

test.serial('memorize last selected site', async (t) => {
  const { browser } = (t as ExecutionContext<{browser: puppeteer.Browser}>).context

  const page = await browser.newPage()
  const { port } = server.address() as AddressInfo
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle2' })
  await page.type('input', 'a')
  await page.waitForSelector('.album-placeholder')
  t.is(await page.evaluate('$(".mdc-chip--selected").index()'), 7)

  await page.close()
})

test.serial.after(async (t) => {
  const { browser } = (t as ExecutionContext<{browser: puppeteer.Browser}>).context
  await browser.close()
})
