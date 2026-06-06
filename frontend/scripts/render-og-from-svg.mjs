import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
const svgPath = path.join(publicDir, 'og-image.svg')
const out = path.join(publicDir, 'og-image.png')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto(`file://${svgPath}`, { waitUntil: 'load' })
await page.waitForTimeout(500)
await page.screenshot({
  path: out,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
  type: 'png',
})
await browser.close()

console.log('Rendered og-image.png from og-image.svg')