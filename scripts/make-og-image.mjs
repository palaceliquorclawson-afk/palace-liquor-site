// Generates public/og-image.jpg (the preview image shown when the site is shared).
// Run: node scripts/make-og-image.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="80%" cy="10%" r="80%">
      <stop offset="0" stop-color="#7a1f2b" stop-opacity=".75"/>
      <stop offset="1" stop-color="#141110" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#141110"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#c9a45c" stroke-opacity=".45" stroke-width="2"/>
  <g transform="translate(96 120) scale(4)" fill="none" stroke="#c9a45c" stroke-width="1.5" stroke-linejoin="round">
    <path d="M3 18V8l5 4 4-7 4 7 5-4v10z"/><path d="M3 21h18"/>
  </g>
  <text x="96" y="310" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="104" fill="#f6efe3">Palace Liquor</text>
  <text x="100" y="380" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#e2c992" letter-spacing="6">CLAWSON, MICHIGAN</text>
  <text x="100" y="470" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#f6efe3" fill-opacity=".85">Fine Wine · Craft Beer · Allocated Bourbon · Cigars</text>
  <text x="100" y="530" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#c9a45c">(248) 435-4888 · palaceliquorclawson.com</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(fileURLToPath(new URL('../public/og-image.jpg', import.meta.url)));
console.log('Wrote public/og-image.jpg');
