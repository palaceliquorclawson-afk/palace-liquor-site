// Generates the site icons (browser tab, bookmarks, phone home screen) from the crown logo.
// Run: node scripts/make-icons.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = (f) => fileURLToPath(new URL(`../public/${f}`, import.meta.url));

// Gold crown on near-black. `pad` shrinks the crown for icons that get masked/rounded by phones.
const svg = (size, { rounded = false, pad = 0.2 } = {}) => {
  const inner = size * (1 - pad * 2);
  const scale = inner / 24;
  const offset = size * pad;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rounded ? size * 0.2 : 0}" fill="#141110"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="#C9A45C" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round">
    <path d="M3 17V7.5l5 4 4-7 4 7 5-4V17z" fill="#C9A45C" fill-opacity="0.18"/>
    <path d="M3 20.5h18"/>
  </g>
</svg>`);
};

const png = (size, opts) => sharp(svg(size, opts)).png().toBuffer();

writeFileSync(out('apple-touch-icon.png'), await png(180, { pad: 0.2 }));
writeFileSync(out('icon-192.png'), await png(192, { pad: 0.2 }));
writeFileSync(out('icon-512.png'), await png(512, { pad: 0.2 }));
writeFileSync(out('favicon-32.png'), await png(32, { rounded: true, pad: 0.1 }));

// favicon.ico with 16, 32 and 48 px PNGs inside
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(s, { rounded: true, pad: 0.08 })));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e); header.writeUInt8(s, e + 1); header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync(out('favicon.ico'), Buffer.concat([header, ...images]));
console.log('Icons written to public/');
