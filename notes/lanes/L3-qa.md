# Lane L3 — QA tooling: static server, Lighthouse gate, site checks, security headers

You are a delegate in a shared Next.js 16.4 repo at /Users/mert/Desktop/BarisAlas. The site is a
fully static export (`next build` → `out/`, `trailingSlash: true`, so routes are `out/<route>/index.html`)
deployed to Cloudflare Workers static assets, which honours `public/_headers` (copied to `out/_headers`).
Other lanes edit other files concurrently. Follow this brief exactly.

Installed dev deps you may use: `lighthouse@13.5`, `chrome-launcher@1.2`, `sharp`. Google Chrome is
at `/Applications/Google Chrome.app`. Node 24, ESM scripts (`.mjs`). No new dependencies.

## You OWN
- `scripts/serve-out.mjs`
- `scripts/qa-check.mjs`
- `scripts/qa-lighthouse.mjs`
- `public/_headers`
- `.gitignore` — you may APPEND the line `.qa/` only.

## DO NOT TOUCH
`package.json` (scripts already exist: `qa:check` → `node scripts/qa-check.mjs`,
`qa:lh` → `node scripts/qa-lighthouse.mjs`, `qa` → `npm run build && npm run qa:check && npm run qa:lh`,
`qa:launch` → `npm run build && node scripts/qa-check.mjs --launch && npm run qa:lh`,
`serve` → `node scripts/serve-out.mjs`), `src/**`, other scripts, `next.config.ts`.
No npm install, no git. You MAY run `npm run build` ONLY at the very end for your acceptance run, and
if it fails because of other lanes' in-progress files, report that rather than editing their files.

## 1. scripts/serve-out.mjs
Zero-dependency `node:http` static server for `out/` that mimics Cloudflare static assets:
- `PORT` env (default 4321), binds 127.0.0.1. Export `startServer({ port, root }) → Promise<{url, close}>`
  so qa-lighthouse can import it; run as CLI when executed directly.
- Path resolution: decode URI, reject `..` traversal (resolve and check prefix), `/foo/` → `foo/index.html`,
  `/foo` → 308 redirect to `/foo/` if `foo/index.html` exists, exact files served as-is. Unknown → `404.html`
  with status 404.
- Content-Type map: html, css, js, mjs, json, txt, xml, svg, png, jpg, webp, avif, ico, woff2, webmanifest.
- Parse `out/_headers` (Cloudflare format: a path pattern line, then indented `Header: value` lines;
  `*` wildcard; `/*` matches all) and apply matching headers. gzip/br not required.

## 2. public/_headers (rewrite; keep the existing intent)
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://wa.me; frame-ancestors 'none'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=31536000, immutable
```
(`'unsafe-inline'` for scripts is required: Next static export inlines RSC payload scripts and we
cannot use nonces on a static host. Note this in a comment line starting with `#` at the top — check
Cloudflare `_headers` supports `#` comments; if unsure, don't add comments.)
HTML pages: add `/*.html` or rely on default revalidation — do NOT set long cache on HTML.

## 3. scripts/qa-check.mjs — static site checks over `out/` (fail = exit 1, print a clear table)
For every `out/**/index.html` and `out/404.html` (use a light regex/HTML-tokenizer approach; no deps):
- `<html lang="tr">`; exactly one `<h1>`; non-empty `<title>` (≤ 65 chars warn, > 70 fail);
  `<meta name="description">` 70–170 chars (warn outside 110–160); `<link rel="canonical">` absolute
  https URL ending with `/` matching the page route (404 excluded); `og:title`, `og:description`,
  `og:url`, `og:image` present; `<meta name="viewport">` present without `maximum-scale`/`user-scalable=no`.
- Duplicate titles / descriptions across pages → fail.
- Every `<img>` has an `alt` attribute (empty allowed only with `aria-hidden` parent or role=presentation);
  every `<img>` has width+height OR is inside an element with explicit aspect/fill (just check width&height
  attributes; warn otherwise).
- Every internal `href`/`src` (starting with `/` or relative) resolves to a file in `out/` (strip
  query/hash; directory → index.html). External links with `target="_blank"` must have `rel` containing
  `noopener`.
- Every `<script type="application/ld+json">` parses as JSON and has `@context` + `@type`.
- No `<script src>` pointing off-site; no `http://` URLs anywhere in HTML (except xmlns).
- `out/robots.txt` exists, references the sitemap; `out/sitemap.xml` parses and contains every
  page route (all index.html routes except 404) and nothing that 404s.
- Heading order: no level skips within `<main>` (h2→h4 = fail).
- `--launch` flag (pre-launch gate) additionally FAILS if: `src/content/**` contains the string
  `confirm` in a `// TODO(confirm` comment or `sample: true`, or `src/content/images.generated.ts`
  contains `source: "stock"`; or `site.url` still contains `barisalas.com.tr` is NOT a failure
  (the domain may be correct) — just print it for review.
Print a summary: pages checked, failures, warnings.

## 4. scripts/qa-lighthouse.mjs
- Import `startServer` from `./serve-out.mjs`, start on a free port.
- Discover routes from `out/**/index.html` (+ optional CLI filter args).
- Launch Chrome once via chrome-launcher (`--headless=new`), run Lighthouse programmatically per
  route, for BOTH mobile (default config) and desktop (`lighthouse/core/config/desktop-config.js`).
- Thresholds (scores ×100): performance ≥ 95, accessibility = 100, best-practices = 100, seo = 100.
  Env overrides `LH_MIN_PERF` etc.
- Save JSON + HTML reports to `.qa/lighthouse/<route-slug>-<mobile|desktop>.(json|html)`.
- Print a table: route, form factor, 4 scores, LCP, CLS, TBT, FCP. For any category below threshold,
  list the failing audits (score < 1, weight > 0) with titles.
- Exit 1 if any threshold fails. Always close Chrome and the server (try/finally).

## Acceptance
1. `node scripts/serve-out.mjs` serves the current `out/` (if out/ exists; else build it once at the
   end). `curl -sI http://127.0.0.1:4321/` shows the CSP header; `curl -sI .../does-not-exist` → 404;
   path traversal `curl --path-as-is .../../package.json` → 404/400.
2. `node scripts/qa-check.mjs` runs and prints a summary (failures from incomplete pages are expected
   right now — that's fine; the script itself must not crash).
3. `node scripts/qa-lighthouse.mjs /` runs end-to-end and writes reports.
4. `npx eslint scripts/serve-out.mjs scripts/qa-check.mjs scripts/qa-lighthouse.mjs` clean.

## Report
Short report: files, how to run, the actual numbers from your test run, known limitations.
