# 07 — Code review (read-only), 2026-10-22

Scope: `src/**`, `next.config.ts`, `public/_headers`, `scripts/images.mjs`, `scripts/serve-out.mjs`, built `out/`.
Only real defects listed, ranked by severity. Line numbers refer to the files as they were on 2026-10-22.

## Verified OK (no action)

- **JSON-LD escaping** (`src/lib/seo.ts:51`): `<` → `<` prevents `</script>` breakout; all data is static. No XSS vectors; `whatsappLink`/`mapsLink` use `encodeURIComponent`.
- **CSP vs built HTML**: `out/index.html` loads no external origins (only links to wa.me / google.com / facebook.com, no subresources). Inline Next bootstrap scripts → covered by `script-src 'unsafe-inline'`; footer `<style>` + `style=` attrs → `style-src 'unsafe-inline'`; blur placeholders are `data:` in `background-image` → `img-src data:`; fonts are self-hosted `next/font` woff2 → `font-src 'self'`; RSC `.txt` prefetches → `connect-src 'self'`. CSP will not break the site.
- **External links**: every `target="_blank"` in `out/**/*.html` has `rel="noopener noreferrer"`.
- **Path traversal** in `scripts/serve-out.mjs:47-54`: `..` segments, backslashes and resolve-escape are all rejected. Safe.
- **Duplicate IDs**: none in any `out/**/*.html`.
- **Heading order**: every page has exactly one h1 and no skipped levels (home h1→h2→h3; services h1→h2; about h1→h2→h3).
- **Contrast** (WCAG relative luminance): gri/krem 5.47, gri/fildisi 6.08, gri/nude 4.56, kakao/krem 5.98, kakao/fildisi 6.65, fildisi-on-kakao button 6.65, karamel/murekkep 7.03, murekkep-on-karamel button 7.03, krem/80 on murekkep 10.40, murekkep/70 brands on fildisi 6.62, footer muted #b8a595 on #1b1612 7.57. White on #1f8f4e is 4.12, but that's an icon-only FAB (non-text needs 3:1), so it passes. All text passes AA.
- **Hydration**: `OpenNow` uses `useSyncExternalStore` with a server snapshot, so there's no mismatch. `aria-current` in the prerendered HTML matches the client (`usePathname` returns the trailing-slash path). `toLocaleString("tr-TR")` runs only in server components.
- **Images**: `ImageId` is type-checked. All 26 ids have their files in `public/img` (258 files = 25×10 + extension-01×8). Non-fill images carry `width`/`height`, and fill images sit in aspect-ratio boxes, so there's no CLS.
- **Mobile menu**: SSR emits `hidden`, and Tailwind v4 preflight forces `[hidden]{display:none!important}`, so there's no flash. `<details name="sss">` renders correctly (Chrome 120+, Safari 17.2+, Firefox 130+; older browsers degrade to non-exclusive).
- **SEO**: titles and descriptions are unique per page. Canonicals are absolute with a trailing slash and match `trailingSlash: true`. BreadcrumbList / Service / HairSalon are valid. Service `provider` → `@id` resolves to the layout's HairSalon on the same page.

---

## Findings (ranked)

### 1. [HIGH] Real photos replacing stock will be served stale for a year, and may not even be regenerated
`scripts/images.mjs:51-56, 72-77, 96` + `public/_headers:15-16`
- What's wrong: output names are `${id}-${width}.{avif,webp}` with no content hash. `assets/photos/<id>.jpg` overrides `assets/stock/<id>.jpg` under the same id (the `qa:launch` gate at `qa-check.mjs:178` forces exactly that swap). `/img/*` is `max-age=31536000, immutable`.
- How it fails:
  - (a) Every visitor and Cloudflare edge that already cached `/img/salon-01-1080.avif` keeps showing the stock photo for up to a year after launch.
  - (b) `writeVariant` skips a file when `output.mtime >= source.mtime`. A photo copied in Finder or AirDropped keeps its original (older) mtime, so the variants are never rebuilt. Meanwhile the manifest (`width`/`height`/`blur`/`alt`) is regenerated from the new photo, so the page shows the old stock image with the new photo's alt text and aspect ratio (distortion / wrong crop).
- Fix: put a short content hash in the filename (`${id}-${sha1(file).slice(0,8)}-${w}`) and key the manifest by it. Decide whether to skip work by hash or size+mtime equality, not by `>=`.

### 2. [MEDIUM] Halftone footer animates on every touch scroll over it (mobile perf)
`src/components/ui/halftone-wordmark-footer.tsx:386-392` (`onDown`)
- What's wrong: `pointerdown` fires at the start of every touch scroll. `coarsePointer` only gates `onMove`, not `onDown`.
- How it fails: every swipe that starts on the footer (the bottom ~680px of every page) launches a 900 ms shock ring that redraws every dot at 60 fps while the page is scrolling. That causes jank on low-end Android and adds INP/TBT noise.
- Fix: `if (e.pointerType !== "mouse") return;` in `onDown`, or trigger the ring on `click` instead.

### 3. [MEDIUM] Halftone footer's rAF loop never idles while the mouse rests on it (desktop perf)
`halftone-wordmark-footer.tsx:356` (`awake = moving || ringAge < 900 || px > -1e4`), `:333-349`
- What's wrong: once the pointer is inside the footer, `px > -1e4` keeps the loop running even when nothing moves. At 1920×680 with `dotGap 6` that's about 36k cells, and the wordmark covers several thousand dots. Each frame does a per-dot `fillStyle` string build, `beginPath`/`arc`/`fill`, plus a new `createPattern` every frame.
- How it fails: a user who stops with the mouse over the footer burns a full CPU core and drains laptop battery.
- Fix: `awake = moving || ringAge < 900` (`onMove` already calls `wake()`). Cache the grain pattern in `layout()`. Batch all settled dots into one `Path2D` fill with `o.colors.ink`.

### 4. [MEDIUM] `interest-cohort` in Permissions-Policy logs a console error
`public/_headers:6`
- What's wrong: FLoC is gone, and Chrome logs "Error with Permissions-Policy header: Unrecognized feature: 'interest-cohort'".
- How it fails: Lighthouse Best Practices "Browser errors were logged to the console" can fail, which blocks a 100 score.
- Fix: delete `, interest-cohort=()`.

### 5. [MEDIUM] Accessible name doesn't contain the visible label (WCAG 2.5.3, axe `label-content-name-mismatch`)
- `halftone-wordmark-footer.tsx:482`: visible text "Başa dön ↑", but `aria-label="Sayfanın başına dön"`. A voice-control user who says "click Başa dön" gets no match.
- `src/app/iletisim/page.tsx:119`: visible text "Akol Otel / Çanakkale Merkez", but `aria-label="Yol tarifi: Cevat Paşa Mah. …"`.
- Fix: drop the button's `aria-label` (mark the arrow `aria-hidden`). For the link, use `aria-label={\`Akol Otel, ${address.city} ${address.district}: yol tarifi\`}` so it starts with the visible text.

### 6. [MEDIUM] No `wrangler.jsonc` in the repo, so 404 handling is undefined on Cloudflare
- What's wrong: notes/research/05-hosting.md:117-120 plans `"not_found_handling": "404-page"`, but no config file exists. Workers static assets default to `none`, which returns a bare empty 404. `out/404/index.html` and `out/_not-found/index.html` are also served with **200** at `/404/` and `/_not-found/` (they're noindex, so this is harmless for SEO).
- How it fails: any mistyped or old URL shows a blank page instead of the branded 404.
- Fix: commit `wrangler.jsonc` with `assets: { directory: "./out", not_found_handling: "404-page", html_handling: "auto-trailing-slash" }`.

### 7. [MEDIUM] HSTS `includeSubDomains; preload` on an unconfirmed domain
`public/_headers:5`, `src/content/site.ts:10-11` (`TODO(confirm): final domain`)
- What's wrong: if the apex `barisalas.com.tr` (or any sibling subdomain, such as webmail or a registrar parking page) is not HTTPS, the header still locks it to HTTPS for a year. A later hstspreload.org submission makes that very hard to undo.
- Fix: ship `max-age=31536000` alone. Add `includeSubDomains; preload` only after the owner confirms every subdomain is HTTPS.

### 8. [MEDIUM a11y] Auto-moving marquees have no pause control on touch (WCAG 2.2.2)
`src/components/blocks.tsx:214-231` (brands), `src/components/ui/testimonials-columns.tsx:46-63` (md+ columns), `infinite-slider.tsx:37`
- What's wrong: the loops run forever. Pausing happens only on `hover` and `focus-within`. The brands marquee has no focusable child, so keyboard users can't pause it, and touch users can't pause either marquee. `prefers-reduced-motion` is handled, but 2.2.2 still requires a pause mechanism. Lighthouse doesn't test this; a manual audit will flag it.
- Fix: add a small pause/play toggle per marquee (or one for the page), or stop the brands loop after a few cycles.

### 9. [LOW-MED a11y] Focus ring fails 3:1 on dark sections
`src/app/globals.css:63-66`
- What's wrong: the global `outline: 2px solid kakao` (#7b5238) on murekkep (#1b1612) is **2.65:1**, below the 3:1 non-text minimum (WCAG 1.4.11 / 2.4.13).
- Where it shows: specialty links (`page.tsx:134`), CTA-banner WhatsApp buttons (every page), the "Bize sorun" tile, and the lightbox controls.
- Fix: `.bg-murekkep :focus-visible, dialog :focus-visible { outline-color: var(--color-karamel); }` (7.03:1).

### 10. [LOW] Lightbox UX/a11y gaps
`src/components/ui/lightbox-gallery.tsx`
- `:158` `touchAction: "pan-y"` disables pinch-zoom on the photo. That's the one place a mobile user most wants to zoom. Fix: `"pan-y pinch-zoom"`.
- `:137-139` Backdrop click-to-close never fires: the inner wrapper (`:143`, `h-full w-full`) covers the whole dialog, so `event.target` is never the `<dialog>`. Fix: also close when the target is the wrapper or the image row (`event.target === event.currentTarget.firstChild`).
- `:34-37` There's no scroll lock, so on iOS the page scrolls behind the modal. Fix: also set `documentElement.style.overflow = "hidden"` while open.
- `:86` `aria-label` on a role-less `<div>` is ignored by assistive tech (axe `aria-prohibited-attr`, "needs review"). Fix: `role="group"`.
- `:120` `sizes="(min-width: 1024px) 33vw, 50vw"`, but `/galeri/` uses `columns="2-4"` (25vw), so desktop over-fetches about 1.8× the bytes. Fix: derive `sizes` from `columns`.
- Keyboard handling is otherwise correct: native modal focus trap, Escape via `onCancel`, arrow keys, focus returned to the opener, live counter.

### 11. [LOW] Mobile menu stays open after back/forward navigation
`src/components/site-header.tsx:13, 39, 108`
- What's wrong: `open` is reset only by link `onClick`/Escape. A browser back gesture (client-side nav) with the menu open lands on the new page with the menu still expanded. Focus also isn't moved into the menu when it opens.
- Fix: `useEffect(() => setOpen(false), [pathname])` (or key the nav on `pathname`).

### 12. [LOW SEO] FAQPage markup duplicated across pages
`src/app/sss/page.tsx:13,30` + `src/app/hizmetler/[slug]/page.tsx:109` + `src/content/site.ts` (`faq` includes `services.flatMap(s => s.faq.slice(0,1))`)
- What's wrong: the first Q&A of each service is marked up on both `/sss/` and its service page. Google's guideline is to mark up only one instance of repeated FAQ content. FAQ rich results have also been limited to authoritative government and health sites since 2023, so the markup gives little benefit.
- Fix: keep FAQPage JSON-LD on `/sss/` only, or drop the service-page questions from the `/sss/` markup.

### 13. [LOW SEO] `addressLocality: "Merkez"` doesn't match the city NAP
`src/components/json-ld.tsx:27`
- What's wrong: locality "Merkez" is the district name, used in hundreds of Turkish provinces. The Google Business listing uses "Merkez/Çanakkale".
- Fix: `addressLocality: "Çanakkale"`, with "Merkez" moved into `streetAddress` (or `"Merkez, Çanakkale"`), consistent with the visible address.

### 14. [LOW SEO] Sitemap `lastModified` is the build time for every URL
`src/app/sitemap.ts:9`
- What's wrong: every deploy marks all 14 URLs as modified. Google learns the value is unreliable and ignores it.
- Fix: omit `lastModified`, or set per-route dates from content.

### 15. [LOW] `serve-out.mjs` protocol-relative redirect
`scripts/serve-out.mjs:57, 61`
- What's wrong: `GET //galeri` resolves to the `galeri` directory and returns `308 Location: //galeri/`, which a browser treats as `http://galeri/`. This only affects the localhost QA server, and only for names of existing directories.
- Fix: normalise `pathname = "/" + relative` before building `Location`.

### 16. [LOW] Build-time values frozen into HTML
- `src/components/site-footer.tsx:31`: `new Date().getFullYear()` renders on the server (no hydration mismatch, since it's passed as a prop), but the © year stays wrong after New Year until the next build.
- `src/components/open-now.tsx:10`: the fallback "Her gün 09:00–19:00" is hard-coded and will drift from `hours` when the hours are confirmed. Fix: derive it from `hours`.

### 17. [INFO / launch gates already tracked]
- `site.url` is a TODO (`site.ts:10`). Canonical, OG, sitemap, robots and JSON-LD all point to `www.barisalas.com.tr`. Deploying under another host before it's confirmed sends canonicals to a dead domain.
- Sample testimonials (`site.ts`, `sample: true`) and stock photos with captions like "Salonumuzun içi" / "Salondan kareler" would be misleading in production. `qa:launch` already blocks both (`qa-check.mjs:176-178`).
- `halftone-wordmark-footer.tsx:3-5`: the header comment still says "REFERENCE ONLY — original component", but this is the live component. It's a stale comment that will confuse future edits.
