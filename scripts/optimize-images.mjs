/* Re-encodes everything in public/ down to web-sized WebP.
 *
 * The thumbnails were the whole problem: 1920x1080 PNGs, ~6 MB each, 19 of
 * them. PNG is lossless — fine for logos, ruinous for video frames. They render
 * in a 2-up grid at roughly 450 CSS px, so 1280 wide still leaves headroom for
 * retina and lands around 60 KB apiece.
 *
 * Originals are copied to assets-original/ (gitignored) before anything is
 * written, so re-running with different settings always starts from the
 * untouched file rather than re-compressing an already-lossy one.
 *
 *   node scripts/optimize-images.mjs
 */
import { mkdir, copyFile, readdir, stat, access } from 'node:fs/promises'
import { dirname, join, basename, extname } from 'node:path'
import sharp from 'sharp'

const BACKUP = 'assets-original'

/* `width` is a ceiling — sharp's withoutEnlargement leaves smaller files be. */
const JOBS = [
  { dir: 'public/images/thumbs', width: 1280, quality: 78 },
  { dir: 'public/images', width: 1920, quality: 82, recursive: false },
  { dir: 'public/tools', width: 256, quality: 88 },
]

const exists = (p) => access(p).then(() => true, () => false)

/* Keep the pristine copy the first time we see a file and never overwrite it —
   a second run must not back up the output of the first. */
async function backup(file) {
  const dest = join(BACKUP, file.replace(/^public[\\/]/, ''))
  if (await exists(dest)) return
  await mkdir(dirname(dest), { recursive: true })
  await copyFile(file, dest)
}

/* Prefer the archived original as the encode source: re-running from an
   already-compressed WebP would stack generation loss. */
async function sourceFor(file) {
  const orig = join(BACKUP, file.replace(/^public[\\/]/, ''))
  return (await exists(orig)) ? orig : file
}

async function convert(file, { width, quality }) {
  await backup(file)
  const src = await sourceFor(file)
  const out = join(dirname(file), basename(file, extname(file)) + '.webp')

  const before = (await stat(file)).size
  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(out)
  const after = (await stat(out)).size

  const kb = (n) => (n / 1024).toFixed(0).padStart(6) + ' KB'
  console.log(`${kb(before)} -> ${kb(after)}  (${(100 - (after / before) * 100).toFixed(0)}% smaller)  ${out}`)
  return [before, after]
}

let totalBefore = 0
let totalAfter = 0

for (const { dir, width, quality, recursive = true } of JOBS) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    // Nested dirs get their own JOBS entry so each can set its own width.
    if (entry.isDirectory()) continue
    if (!/\.(png|jpe?g)$/i.test(entry.name)) continue
    const [before, after] = await convert(join(dir, entry.name), { width, quality })
    totalBefore += before
    totalAfter += after
  }
  void recursive
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB'
console.log(`\nTotal: ${mb(totalBefore)} -> ${mb(totalAfter)}`)
