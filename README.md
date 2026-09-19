# Palace Liquor website

The website for **Palace Liquor & Deli Shop**, 650 W 14 Mile Rd, Clawson, MI.
Live at **https://www.palaceliquorclawson.com**

Built with [Astro](https://astro.build), Tailwind CSS and TypeScript. It builds to plain, fast HTML
with no server or database, so it can be hosted for free on GitHub Pages (current setup), Netlify or Vercel.

---

## Quick start: editing the site on GitHub (no software needed)

Most updates only need a text edit in your browser:

1. Go to **https://github.com/palaceliquorclawson-afk/palace-liquor-site**
2. Open the file you want to change (see the table below) and click the ✏️ pencil icon.
3. Make your change, then click **Commit changes**.
4. The site rebuilds and goes live automatically in about 1–2 minutes. You can watch progress on the **Actions** tab.

| What you want to change | File |
| --- | --- |
| Phone, address, **hours**, email, DoorDash link, Instagram/Facebook, Google review link, form addresses, free-ice offer | `src/site.config.ts` |
| Home page **"Now on the Shelf"** (currently hidden; set `showNowOnTheShelf: true` in `src/site.config.ts` to show it) | `src/data/now-on-the-shelf.json` |
| Allocated bourbon **"On the shelf right now"** | `src/data/bourbon-shelf.json` |
| Craft beer **"What's new"** | `src/data/beer.json` |
| Wine styles, regions & staff picks | `src/data/wine.json` |
| Cigar brands | `src/data/cigar-brands.json` |
| Keg sizes, tapper & table info, **deposits & policies** | `src/data/rentals.json` |
| In-store events (tastings, etc.) | `src/data/events.json` |
| Customer quotes ("What customers say") | `src/data/testimonials.json` |
| Store story (About page) | `src/pages/about-contact.astro` (the `story` list at the top) |

> **JSON tips:** keep the quotes `" "` and commas exactly as they are. Every item except the last in a list
> ends with a comma. If the site doesn't update after a change, check the **Actions** tab: a red ✗ usually
> means a missing comma or quote. Fix it and commit again.

### Hours

In `src/site.config.ts`, hours use 24-hour time in Michigan time (`"21:00"` = 9 PM):

```ts
{ day: 'Sunday', open: '11:00', close: '21:00' },
```

To mark a day closed: `{ day: 'Sunday', open: '00:00', close: '00:00', closed: true }`.
The "Open until…" bar at the top of every page, the hours tables and Google's business data all update from this one list.

### Now on the Shelf / Bourbon shelf / What's new

Each item is one `{ ... }` block. To add a bottle to the bourbon shelf:

```json
{ "name": "Blanton's Single Barrel", "size": "750ml", "justArrived": true },
```

Set `"justArrived": false` to remove the tag. Update `"lastUpdated"` (format `YYYY-MM-DD`) whenever you change the list.
Never list prices. Stock changes daily, and the page already tells people to call.

### Customer quotes

Only paste **real** quotes from your Google reviews, with the reviewer's first name:

```json
"quotes": [
  { "quote": "Best bourbon selection around and super friendly staff.", "name": "Mike" },
  { "quote": "They planned all the drinks for our wedding. Easy!", "name": "Jenna" }
]
```

The section stays hidden while the list is empty.

---

## Photos

Every photo spot on the site shows a **"Photo slot: file-name.jpg"** label until you add that photo.

1. Name your photo exactly as the label says (e.g. `storefront.jpg`).
2. On GitHub, open the folder `src/assets/photos/`, click **Add file → Upload files**, and drop it in.
3. Commit. The site automatically resizes it and converts it to fast AVIF/WebP formats.

The full list of photo names is in `src/assets/photos/README.txt`. Wide photos at least 1600px across look best.
JPG, PNG and WebP all work. To use a photo on a "Now on the Shelf" item, upload it and put its file name in that
item's `"photo"` field.

---

## Google review link

The **Leave Us a Google Review** button (home page) and the **Review us on Google** links (footer, About & Contact)
all use one setting in `src/site.config.ts`:

```ts
googleReviewUrl: 'https://g.page/r/CRHmJOZOCFw3EBM/review',
```

Change it there and every link updates.

---

## Connecting the forms (Formspree)

The **event inquiry** form and the **keg & table rental** form send to your email through
[Formspree](https://formspree.io). No server is needed, and it works on any host.
Until they're connected, the forms politely tell visitors to call instead.

1. Create a free account at **https://formspree.io** using the email where you want inquiries to arrive.
   (The free plan allows 50 submissions a month. Upgrade later if you need more.)
2. Click **+ New Form**, name it `Event inquiries`, and copy its endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
3. Make a second form named `Rental requests` and copy that endpoint too.
4. In `src/site.config.ts`, paste them in:
   ```ts
   forms: {
     eventInquiry: 'https://formspree.io/f/abcdwxyz',
     rentalRequest: 'https://formspree.io/f/efghijkl',
   },
   ```
5. Commit, wait for the site to rebuild, and send yourself a test from each form. Formspree asks you to confirm
   the first submission by email.

**Spam protection:** each form has a hidden "honeypot" field (`_gotcha`) that people can't see but bots fill in.
Formspree silently drops those. You can also turn on Formspree's reCAPTCHA or spam filtering in its dashboard.

---

## Running it on your computer (optional, for developers)

Requires Node.js 22.12 or newer.

```bash
npm install        # first time only
npm run dev        # preview at http://localhost:4321 with live reload
npm run build      # build the final site into dist/
npm run preview    # preview the built site
npm run check      # type-check
node scripts/make-og-image.mjs   # regenerate the link-preview image (public/og-image.jpg)
```

---

## Deploying

**GitHub Pages (current):** every commit to the `main` branch builds and publishes automatically via
`.github/workflows/deploy.yml`. The custom domain comes from `public/CNAME`. DNS is at GoDaddy:
four `A` records for `@` pointing to GitHub's addresses (185.199.108–111.153) and a `CNAME` for `www` pointing to
`palaceliquorclawson-afk.github.io`.

**Netlify (alternative):** "Add new site → Import from GitHub", pick this repo. Build settings are read from
`netlify.toml` (`npm run build`, publish `dist`). Then add the custom domain in Netlify and update DNS as Netlify instructs.

**Vercel (alternative):** "Add New → Project", import this repo. Vercel detects Astro automatically. Add the domain and update DNS as instructed.

---

## How it's built

```
src/
  site.config.ts        ← all business info in one place
  data/*.json           ← editable lists (shelf, bourbon, beer, wine, cigars, rentals, events, quotes)
  assets/photos/        ← drop photos here
  components/           ← Header, Footer, Hero, CategoryTile, CtaBanner, EventForm, RentalForm,
                          Map, AgeGate, GoogleReviewButton, ShelfList, ImageSlot, HoursTable …
  layouts/BaseLayout    ← page shell: SEO tags, LiquorStore schema, age gate, header/footer
  pages/                ← one file per page
  scripts/              ← open/closed status and form handling
  styles/global.css     ← colors, fonts, buttons (design tokens)
public/                 ← CNAME, robots.txt, favicon, og-image
```

- **Age gate:** content stays hidden until a visitor confirms they're 21+. The answer is remembered for 30 days
  (localStorage, falling back to a cookie, then to the current page only if both are blocked).
- **SEO:** each page has its own title and description, plus a `LiquorStore` JSON-LD schema built from
  `site.config.ts`, Open Graph/Twitter tags, `sitemap-index.xml` and `robots.txt`.
- **Accessibility:** keyboard-navigable, skip link, visible focus rings, labeled forms with inline errors,
  WCAG AA color contrast, reduced-motion support.
- **Compliance:** "Must be 21+" and responsible-drinking notice in every footer. No invented prices, inventory,
  ratings or reviews.
