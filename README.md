# MT — Md Moniruzzaman Tonoy (v2)

Animated 3D portfolio built with **Next.js 15 (static export), React 19, Three.js, Framer Motion, Tailwind CSS**,
with full **SEO** and **Firebase Hosting**. All content from the previous Vite/React portfolio has been migrated.

## 🌗 Light & Dark theme
- Sun/Moon button in the navbar. First visit follows the system setting, then your choice is remembered (`localStorage`).
- No flash on load (theme is applied before first paint). The 3D globe, aurora, cards and the live color palettes all adapt.
- Colors are CSS variables (`--bg`, `--fg` in `app/globals.css`) — tweak the light theme in `:root[data-theme="light"]`.

## 🚀 Run locally
```bash
npm install
npm run dev          # http://localhost:3000
```

## 🔥 Deploy to Firebase Hosting
Project ID is already set in `.firebaserc` (`md-moniruzzaman-tonoy`).
```bash
npm install -g firebase-tools   # once
firebase login                  # once
npm run deploy                  # builds to ./out and deploys
```
Live URL: https://md-moniruzzaman-tonoy.web.app

Optional auto-deploy from GitHub: `.github/workflows/firebase-hosting.yml` (run `firebase init hosting:github` once to create the secret).

## 🔎 SEO included
- Title template, description, keywords, canonical URL, robots (`index, follow`)
- Open Graph + Twitter cards with a generated `og-image.jpg`
- JSON-LD structured data: **Person**, **WebSite**, **Blog**, **BlogPosting**
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon set
- Google Search Console verification (meta tags + `google38c18d861af04faf.html`)
- Google Analytics (`G-LNGB733JTD`)
- Separate crawlable pages for each blog article (`/blog/<slug>/`), custom 404 page
- Security + cache headers in `firebase.json`

After the first deploy, submit `https://md-moniruzzaman-tonoy.web.app/sitemap.xml` in Google Search Console.
If you connect a custom domain, set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) before building.

## ✏️ Edit content
| What | File |
| --- | --- |
| Name, bio, skills, experience, education, projects, social links, contact info | `lib/content.ts` |
| Blog posts | `lib/blog-data.ts` |
| Color palettes / speed | `lib/palette.ts`, `components/PaletteEngine.tsx` |
| 3D globe | `components/Globe.tsx` |

## Notes
- Contact form uses **Web3Forms** (same key as before). Restrict it to your domain in the Web3Forms dashboard.
- Project screenshots load from the original ibb.co links; the Lifelink project uses an animated gradient cover.
