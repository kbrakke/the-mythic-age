// Slice the full-resolution world map into a tile pyramid for the interactive map.
//
//   npm run map:tiles            # always rebuild
//   npm run map:tiles -- --if-missing   # skip when tiles already exist (used by `npm run dev`)
//
// Output goes to public/map-tiles/{z}/{y}/{x}.webp (git-ignored; regenerated on every
// Netlify build by the `prebuild` script). Zoom 0 is the whole map in one 256px tile,
// the deepest zoom is the source image at 1:1. Takes ~15s and ~9MB.
import sharp from 'sharp';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE = resolve('src/assets/WorldMap-01.png');
const OUT = resolve('public/map-tiles');
const TILE = 256;

if (process.argv.includes('--if-missing') && existsSync(resolve(OUT, 'meta.json'))) {
  console.log('map tiles: already built, skipping (run `npm run map:tiles` to rebuild)');
  process.exit(0);
}
if (existsSync(OUT)) rmSync(OUT, { recursive: true });

const meta = await sharp(SOURCE, { limitInputPixels: false }).metadata();
const maxZoom = Math.ceil(Math.log2(Math.max(meta.width, meta.height) / TILE));

await sharp(SOURCE, { limitInputPixels: false })
  .webp({ quality: 82 })
  .tile({ size: TILE, layout: 'google', overlap: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile(OUT);

// libvips drops a properties file next to the output folder; it is not needed.
rmSync(resolve(OUT, '..', 'vips-properties.xml'), { force: true });

// Written alongside the tiles so the map component never has to guess the geometry.
writeFileSync(
  resolve(OUT, 'meta.json'),
  JSON.stringify({ width: meta.width, height: meta.height, tileSize: TILE, maxZoom }, null, 2),
);
console.log(`map tiles: ${meta.width}x${meta.height}, zoom 0..${maxZoom} -> ${OUT}`);
