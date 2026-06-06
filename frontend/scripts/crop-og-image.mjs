import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
const src = path.join(publicDir, 'hero.png')
const out = path.join(publicDir, 'og-image.png')

const TARGET_W = 1200
const TARGET_H = 630
const ASPECT = TARGET_W / TARGET_H

// Pixel-measured bounds from hero.png (2940×1616):
// - Navbar + hero + feature row: y=0 → ~1200
// - Scroll dot / dead space begins after y≈1240
const CROP_TOP = 0
const CROP_BOTTOM = 1210
const CROP_HEIGHT = CROP_BOTTOM - CROP_TOP
const CROP_WIDTH = Math.round(CROP_HEIGHT * ASPECT)

const { width: srcW } = await sharp(src).metadata()
const cropLeft = Math.round((srcW - CROP_WIDTH) / 2)

await sharp(src)
  .extract({
    left: cropLeft,
    top: CROP_TOP,
    width: CROP_WIDTH,
    height: CROP_HEIGHT,
  })
  .resize(TARGET_W, TARGET_H, { fit: 'fill' })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(out)

console.log('Cropped og-image.png', {
  left: cropLeft,
  top: CROP_TOP,
  width: CROP_WIDTH,
  height: CROP_HEIGHT,
  output: `${TARGET_W}x${TARGET_H}`,
})