import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
const htmlPath = path.join(publicDir, 'og-image-source.html')
const out = path.join(publicDir, 'og-image.png')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({
  path: out,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
  type: 'png',
})
await browser.close()

const meta = await sharp(out).metadata()
console.log('Rendered og-image.png', `${meta.width}x${meta.height}`)