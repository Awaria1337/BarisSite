# Vibe Check: Barış Alaş Kuaför Salonu (barisalas)

**Date:** 2026-10-22 · **Commit:** none (repo has no commits yet; 33 files staged, many untracked) · **Scope:** all 84 items
**Stack:** Next.js 16.4.2 App Router static export (`output: "export"` → `out/`), React 19.3.0, Tailwind v4, TypeScript 5.9, Cloudflare Workers static assets (planned)
**Live checks:** none on a public URL (not deployed). Passive GETs against the local production-like server `http://127.0.0.1:4321` serving `out/` with `_headers` (note: that server process is stale, see G7)
**Tally:** 84 items · 14 OK · 14 gaps (3 high, 3 medium, 8 low) · 7 owner checks · 46 N/A · 3 skip

## Stack profile
- **Frontend:** Next.js 16.4.2 App Router, every route prerendered to HTML (`next.config.ts:7` `output: "export"`, `trailingSlash: true`, `images.unoptimized`). 15 routes: `/`, `/hizmetler/`, 7 × `/hizmetler/[slug]/`, `/galeri/`, `/hakkimizda/`, `/iletisim/`, `/sss/`, `/kvkk/`, 404. Five small client components (`site-header`, `open-now`, `motion-pause`, `lightbox-gallery`, `halftone-wordmark-footer`). All content comes from one static file, `src/content/site.ts`.
- **Backend:** none. No route handlers, server actions, middleware/proxy or Worker script (`wrangler.jsonc` has only an `assets` block and no `main`).
- **Data:** none. No database, no storage, no env vars (`grep process.env|NEXT_PUBLIC src` → nothing). Business data (NAP, hours, services, FAQ) is hard-coded in `src/content/site.ts`.
- **Auth:** none. No accounts, sessions, cookies, or browser storage (src and built `out/_next/static/chunks/*.js` grepped for `document.cookie`, `localStorage`, `sessionStorage` → nothing).
- **Payments / AI / Uploads & user content:** none / none / none. Contact goes out via `wa.me` and `tel:` links (`site.ts` `whatsappLink`). Testimonials are curated by the owner (currently samples), not UGC.
- **Hosting & deploys / Mobile / CI:** Cloudflare Workers static assets on the free plan (`wrangler.jsonc`: `directory ./out`, `not_found_handling: 404-page`, `html_handling: force-trailing-slash`); headers in `public/_headers`. Not deployed; domain not chosen. No mobile app. No CI, no git remote, no commits.

## 1. Gaps, most severe first

### G1. Placeholder content would ship as if it were real: HIGH (item #62)
**What:** The site presents third-party material as the salon's own. `src/content/images.generated.ts` still has 21 images with `"source":"stock"` (Unsplash, credited in `assets/stock/credits.json`), shown with captions such as "Salonumuzun içi" and as "our work" in the gallery and service pages. `src/content/site.ts:287-295` holds nine testimonials marked `sample: true` with invented names ("Ayşe K.", "Elif D." …) rendered as customer quotes by `src/components/ui/testimonials-columns.tsx`. Business facts are still unconfirmed: domain (`site.ts:10`), WhatsApp number (`site.ts:21`), address being current (`site.ts:26`), Instagram handle (`site.ts:41`), opening hours (`site.ts:45`), and the about story (`src/app/hakkimizda/page.tsx:50`). The Unsplash license itself allows commercial use, so this is not copyright infringement. The problem is presenting stock models and made-up reviews as the salon's real work and customers.
**Why it matters:** Invented customer reviews and stock "our salon" photos are misleading advertising. In Turkey that falls under Law 6502 on consumer protection and the Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği. The Unsplash license also gives no model release, so using a stock model's face to imply she is a customer is risky. Wrong hours or a WhatsApp number that isn't on WhatsApp lose real bookings. Not legal advice.
**Fix:** This is already tracked: `npm run qa:launch` fails on `sample: true`, `source: "stock"` and `// TODO(confirm` in `src/content/` (`scripts/qa-check.mjs:176-183`). Finish the photo swap that's in progress into `assets/photos/`, using only photos with written consent from anyone whose face shows (notes/research/04-design-ux.md §6). Replace the samples with real reviews used with permission (first name plus initial), or remove the testimonials section. Get Mert to confirm every `TODO(confirm`. Also see G6: the gate misses two TODOs outside `src/content/`. Effort: hours of code once the owner supplies the facts and photos.

### G2. Domain not chosen, but every absolute URL is hard-coded to it: HIGH (item #81)
**What:** `src/content/site.ts:11` sets `url: "https://www.barisalas.com.tr"` (marked `TODO(confirm)`). notes/PROJECT.md records that `barisalas.com.tr` was NXDOMAIN on 2026-10-22. That one value feeds `metadataBase` (`src/app/layout.tsx:28`), every canonical and `og:url` (`src/lib/seo.ts:22-25`), `robots.txt` `Host`/`Sitemap` (`src/app/robots.ts:9-10`), all 14 sitemap URLs (`src/app/sitemap.ts`), and the JSON-LD `@id`/`url`/`image` (`src/components/json-ld.tsx`). The built `out/` holds 280 references to that host.
**Why it matters:** If the site is deployed under any other host (a workers.dev URL, a different domain, or the apex without www), Google is told the real pages live on a dead domain. Then nothing gets indexed, link previews show no image, and the SEO goal of the project fails silently.
**Fix:** The owner picks and registers the domain, moves its nameservers to Cloudflare, and attaches it as a Workers Custom Domain, plus a 301 Redirect Rule from apex to www (notes/research/05-hosting.md). Then update `site.url`, rebuild, run `npm run qa:launch`, and check `curl -s https://<domain>/robots.txt` and one canonical. Only after that, submit the sitemap (#80). Effort: minutes of code, plus DNS propagation.

### G3. The whole project exists on one disk: no commits, no remote, no backup: HIGH (item #44)
**What:** `git log` is empty ("no commits" on `main`) and `git remote -v` prints nothing. 33 files are staged, and `scripts/`, `public/img/`, `assets/` and most pages are untracked. The original stock and old-site photos (`assets/`), the research notes, and soon the real customer photos all live only in `/Users/mert/Desktop/BarisAlas`. No data store is involved: the source tree *is* the data.
**Why it matters:** One disk failure, theft or bad `rm`, or an agent overwriting files (several are editing `src/` right now), and there is nothing to roll back to. A Cloudflare deploy only keeps the built `out/`, not the source or the original photos.
**Fix:** Make a first commit now, then push to a **private** remote (GitHub/GitLab private repo). Keep the private remote because real customer photos and consent screenshots will end up in `assets/photos/` (#13). Keep the original full-resolution photos and the signed consent forms in a second place too, such as a shared Drive folder. Restore test: `git clone` into a temp folder, `npm ci && npm run build`, and confirm `out/` matches. Effort: 15 minutes.

### G4. KVKK aydınlatma metni is missing required parts: MEDIUM (items #61, #63)
**What:** Data inventory from the code: the site sets no cookies and no storage, loads no third-party subresources (built HTML references only `wa.me`, `google.com/maps` and `facebook.com` as outbound links; there are no scripts, iframes or fonts from other hosts), and has no forms or analytics. Personal data is processed in three places: (1) the hosting provider's request logs (Cloudflare: IP, user agent), (2) WhatsApp and phone conversations (name, number, messages, hair photos), and (3) photos of customers published on the site. `src/app/kvkk/page.tsx` covers the controller identity, purposes, legal bases (m.5/2-c, m.5/2-f), photo consent and m.11 rights. It is missing:
- **Retention periods:** none stated for messages, photos or logs.
- **Transfers abroad (KVKK m.9, amended 2024):** Cloudflare (US-based, global edge) and WhatsApp/Meta both process data outside Turkey. The text says data "üçüncü kişilerle paylaşılmaz", which contradicts the following sentence that names Meta, and it doesn't name Cloudflare at all.
- **How to apply:** only "yazılı olarak" or a phone number. The Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ expects written, KEP, registered e-mail or a registered system channel, and a 30-day response. There's no e-mail address.
- **Owner review:** `kvkk/page.tsx:13` still says `TODO(confirm): have the owner (veri sorumlusu) review this text`, and the launch gate doesn't catch it (G6).
VERBİS: per notes/research/04-design-ux.md §5, the salon is very likely exempt under Kurul decision 2025/1572 (<50 employees, <100M TL balance sheet, main activity not special-category data). Hair-loss and wig consultations can touch health-adjacent information, so the accountant should confirm the exemption with that in mind. No cookie banner is needed with the current setup (no cookies or trackers).
**Why it matters:** The aydınlatma obligation (m.10) applies even with zero cookies, and incomplete notices are a common basis for KVKK fines (m.18). Not legal advice.
**Fix:** Add a retention line for each category (for example, messages kept until the appointment plus a set period; logs per Cloudflare's retention), a transfer-abroad paragraph naming Cloudflare and Meta/WhatsApp, an e-mail or KEP address for applications with the 30-day response, and fix the "not shared" sentence. Have the owner, ideally with the accountant or a lawyer, approve it, then remove the TODO. If analytics are added later (Cloudflare Web Analytics, cookieless), disclose that too. Effort: 1–2 hours plus the owner's review.

### G5. Nobody will notice if the site goes down: MEDIUM (item #43)
**What:** No uptime check, error tracking or alert channel exists in code or notes (recon: "Monitoring / analytics: none detected"; `grep -ri 'uptime\|sentry\|alert' notes src` → nothing beyond planning text). Not much can break on a static site on Cloudflare, but the failures that remain are silent: DNS or domain expiry (a `.com.tr` renewal lapse), a bad deploy, a nameserver change at the registrar.
**Why it matters:** The site's whole job is to turn searches into WhatsApp messages. If it's down for a week, the salon finds out from a customer, if at all.
**Fix:** Free UptimeRobot or Better Stack HTTP check on `https://<domain>/` every 5 minutes, alerting Mert by e-mail or Telegram. Cloudflare Notifications for the zone. A calendar reminder 60 days before the domain expires, with auto-renew on at the registrar. Effort: 15 minutes.

### G6. Launch gate has blind spots, and the README describes another project: LOW (item #50)
**What:** `scripts/qa-check.mjs:176-180` scans only `src/content/` and only `//`-style comments. It misses `src/app/kvkk/page.tsx:13` (`// TODO(confirm)` outside `src/content`), `src/app/hakkimizda/page.tsx:50` (`{/* TODO(confirm) */}`, a JSX comment) and `src/components/site-header.tsx:47` (`TODO: logo from Mert`). `README.md` is still the create-next-app boilerplate ("Deploy on Vercel", "edit app/page.tsx"), which contradicts the Cloudflare decision. Good process signs: an independent code review (notes/research/07-code-review.md), and ESLint is clean (`npx eslint .` → no output).
**Fix:** Widen the gate to `src/**` and to `TODO\(confirm` without the `//` anchor. Replace the README with 10 lines: build, `qa:launch`, deploy (`npx wrangler deploy`), where content lives. Effort: 20 minutes.

### G7. CSP allows inline scripts, and the local QA server serves stale headers: LOW (item #46)
**What:** `public/_headers:2` sets a full set of headers: CSP with `frame-ancestors 'none'`, `object-src 'none'` and `base-uri 'self'`, plus nosniff, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, HSTS `max-age=31536000`, COOP and CORP. But `script-src 'self' 'unsafe-inline'` is needed for Next's inline bootstrap scripts in a static export. That makes the CSP a weak XSS backstop. The risk is low because there are no user-controlled sinks (#19). Separately, the server at 127.0.0.1:4321 returned `interest-cohort=()` and `includeSubDomains; preload` on 2026-10-22 14:56, while `public/_headers` and `out/_headers` no longer contain them. The process reads `_headers` once at startup (`scripts/serve-out.mjs:24`) and was started before the fix, and it also didn't compress JS or HTML despite `serve-out.mjs:78-81`. QA numbers taken from that process reflect old config.
**Fix:** Restart `npm run serve` before the next Lighthouse run. Optional: a post-build step that hashes the inline scripts in each HTML file into a per-page CSP (sha256) and drops `'unsafe-inline'`. That's worth it only if user content is ever rendered. After the domain is confirmed and every subdomain is HTTPS, consider `includeSubDomains`. Effort: minutes (restart); a few hours for hash-based CSP.

### G8. No CI, no automated audit, no update routine, no automated tests: LOW (items #79, #72, #38)
**What:** No `.github/` or other CI and no Dependabot or Renovate config. Checks exist but are manual: `npm run qa` (build, static HTML checks in `scripts/qa-check.mjs`, Lighthouse in `scripts/qa-lighthouse.mjs`). There are no unit or E2E tests (recon: "Testing: none detected"), which fits a content site with no auth or payments. `npm outdated`: `react`/`react-dom` 19.3.0 → 19.3.1 (patch), `eslint` 9 → 10, `typescript` 5.9 → 7 (deliberately pinned per notes/PLAN.md). The lockfile is present (`package-lock.json`) and Node 24 LTS is supported.
**Why it matters:** Low for a static site with no secrets, but nobody will hear about a Next.js or React advisory after launch, and a broken build or a canonical regression would only be caught if someone remembers to run `qa`.
**Fix:** After G3, add one GitHub Actions workflow on push: `npm ci && npm run lint && npm run qa:check` (after `npm run build`) and `npm audit --omit=dev --audit-level=high`, plus GitHub's free secret scanning and Dependabot (weekly, grouped). Bump React to 19.3.1. Effort: 1 hour.

### G9. workers.dev / preview URLs will be public copies of the site: LOW (item #29)
**What:** `wrangler.jsonc` doesn't set `workers_dev` or `preview_urls`, so by default the Worker is also served at `barisalas.<account>.workers.dev`, and preview versions get public URLs. Canonicals point to the production domain (G2), so the SEO harm is limited, but it's a second public copy with the same headers and no auth.
**Fix:** Once the custom domain is live, set `"workers_dev": false` (and `"preview_urls": false` if previews aren't used) in `wrangler.jsonc`, or turn them off in the dashboard under Worker → Settings → Domains & Routes. Effort: minutes.

### G10. No dynamic scan has ever been run: LOW (item #57)
**What:** No ZAP or other DAST report or CI step. With no inputs or API, the scan would mostly confirm headers and the absence of exposed files, which is cheap to do once.
**Fix:** Run a passive baseline against the local server (passive only): `docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:4321/`. After launch, run the same baseline against the production URL. No active scan is needed for a static site. Effort: 15 minutes.

### G11. No apple-touch-icon, web manifest or real logo yet: LOW (item #56)
**What:** Titles and descriptions are unique and keyword-led per page ("Barış Alaş Kuaför Salonu | Çanakkale Kadın Kuaförü", "Çanakkale Kaynak Saç …"), and `qa-check.mjs` enforces their lengths and uniqueness. OG and Twitter tags have a 1200×630 image (`src/lib/seo.ts:4`) and every page has a canonical. Missing: `apple-touch-icon` and a manifest. `out/index.html` has only `<link rel="icon" href="/icon.svg…">`, so iOS home-screen bookmarks get a screenshot. The logo is still pending (`site-header.tsx:47`), and `public/og.jpg` will need regenerating from real photos.
**Fix:** When the logo arrives, add `src/app/apple-icon.png` (180×180, a static file per notes/PROJECT.md [next16]) and a static `manifest.webmanifest`, and regenerate `og.jpg` from a real salon photo. Effort: 30 minutes.

## 2. Owner checks: things the code can't show
- [ ] **#11 Build logs:** none exist yet. After the first Cloudflare deploy, open Workers & Pages → barisalas → Deployments → the latest build log. There should be no tokens in it. The project has no secrets, so this is a formality. Don't put a Cloudflare API token in a public CI log.
- [ ] **#55 Support channel works:** from a phone that isn't Mert's, call 0535 462 09 90 and send the prefilled WhatsApp message from the site's green button. Both should reach Barış Bey. Then delete `TODO(confirm): is this number on WhatsApp?` (`site.ts:21`).
- [ ] **#58 Compression on production:** after deploy, `curl -sI -H 'Accept-Encoding: br, gzip' https://<domain>/` and the same for one `/_next/static/chunks/*.js` file. Expect `content-encoding: br` (Cloudflare default). The local server didn't compress because its process is stale (G7).
- [ ] **#66 Rollback:** after the second deploy, practise once: dashboard → Worker → Deployments → "Rollback" to the previous version (or `npx wrangler rollback`), confirm the old version is served, then roll forward. Write down where the button is.
- [ ] **#80 Bing / Yandex Webmaster:** after G2, verify the domain in Bing Webmaster Tools (import from Google Search Console is fastest), submit `https://<domain>/sitemap.xml`, and turn on IndexNow (Cloudflare Crawler Hints does this in one toggle). Do the same in Yandex Webmaster (about 11% TR share, notes/PROJECT.md).
- [ ] **#82 Blocking abusive IPs:** once the zone is on Cloudflare, know the path: Security → WAF → Tools → IP Access Rules (block an IP, range, ASN or country within seconds, no redeploy). Turn on Bot Fight Mode. Static-asset requests are free and unlimited, so abuse costs nothing but this is the off switch.
- [ ] **#83 Trademark:** search TÜRKPATENT (online trademark search) for "Barış Alaş" in Nice class 44 (hairdressing and beauty) and class 3 (cosmetics). Decide whether to file. A personal-name salon mark in one city is low risk, but filing in class 44 is cheap (a few thousand TL) and protects the name if the business grows. Also secure the domain (G2) and the Instagram handle. Not legal advice.
- [ ] **#13 Repo visibility (once G3 creates the remote):** open `https://github.com/<owner>/<repo>` in a private window and expect a 404. Keep it private because customer photos and consent records will be in `assets/photos/`.

(#13 is marked OK in the table because no remote exists today; this line is for after G3.)

## 3. Recommended skips
- **#51 Load tests:** the site is static files on Cloudflare's edge ("Requests to static assets are free and unlimited", notes/research/05-hosting.md). A load test would only measure Cloudflare, and load-testing their edge without permission can break their terms. Skip it.
- **#74 Terms of use:** there are no accounts, purchases, user content or downloadable software, so no terms are needed to govern use. Two related points instead. (1) Keep the aydınlatma metni accurate (G4). (2) Law 5651 m.3 expects content providers to show identifying information. The site already shows the business name, address and phone; adding an e-mail address in the footer covers the usual expectation. Have the accountant confirm whether MERSİS or tax details are needed. Not legal advice.
- **#84 Provisional patent:** there is no new technical method in a brochure site, and Turkish and EPO practice doesn't patent business methods or presentation of information. Money is better spent on the domain and, if wanted, a class-44 trademark (#83). Not legal advice.

## 4. All 84 items

| # | Item | Status | Evidence / note |
|---|---|---|---|
| 1 | Exposed database credentials | N/A | No database: recon "Database / data: none detected"; no connection strings in tree (recon secret scan: none found); history empty (no commits) |
| 2 | Public .env files | OK | No `.env*` on disk or ever committed (recon); `.gitignore` has `.env*`; local probe `GET /.env` → 404; only `out/` is served (`wrangler.jsonc` `directory ./out`) |
| 3 | Hardcoded API keys | OK | recon secret scan: none found; `grep -rE 'sk_live|AKIA|ghp_|AIza|service_role|PRIVATE KEY' out` → nothing. Only public identifiers in code: phone, Google place ID (`site.ts:36`) |
| 4 | Weak or missing authentication | N/A | No accounts or protected data: no auth deps (recon), no route handlers/middleware (`find src/app -name 'route.*' -o -name 'proxy*'` → none); every page is public brochure content |
| 5 | No authorization checks | N/A | No server-side actions or API at all; static export (`next.config.ts:7`); grep `use server` in src → none |
| 6 | Users accessing others' data | N/A | No user data stored anywhere; no DB, no storage, no forms (`grep '<form\|<input\|FormData' src` → none) |
| 7 | Open database permissions | N/A | No database, Firebase or Supabase (recon dependency signals: none); `package.json` deps are next/react/clsx/lucide/tailwind-merge only |
| 8 | Misconfigured buckets | N/A | No object storage; images are build-time files in `public/img/` generated by `scripts/images.mjs` from `assets/` |
| 9 | Admin routes unprotected | N/A | Route list `src/app/{page,hizmetler,galeri,hakkimizda,iletisim,sss,kvkk}` only; no `/admin`, `/api`, `/debug`; no CMS or panel deps |
| 10 | Debug pages in production | OK | Prebuilt production HTML only (`next build` with `output: export`); no server, no dev build deployed; no debug endpoints exist in `out/` (file listing: html/js/css/img/txt/xml only) |
| 11 | Build logs leaking secrets | OWNER | No secrets exist (no `process.env` use in src) and no CI yet; skim the first Cloudflare build log after deploy (Owner checks) |
| 12 | Verbose errors / stack traces | OK | No server code to throw; unknown paths get the branded 404 with status 404 (`wrangler.jsonc` `not_found_handling: 404-page`; local probe `/nonexistent-xyz/` → 404) |
| 13 | Leaked repos / commit history | OK | `git remote -v` empty, 0 commits, so nothing published; recon history scan: none found; `GET /.git/config` → 404. Keep the future remote private (G3, Owner checks) |
| 14 | Secrets in frontend JS | OK | No `NEXT_PUBLIC_`/`process.env` in src; built chunks grepped for key patterns → nothing; client components contain UI code only |
| 15 | Client-side-only security checks | N/A | No server to bypass and no limits or roles to enforce; all logic is presentation (OpenNow clock, lightbox, menu) |
| 16 | Missing input validation | N/A | No inputs reach any server; no forms, params or API (`grep '<form\|<input\|searchParams' src` → none) |
| 17 | SQL injection | N/A | No SQL database or driver in deps |
| 18 | NoSQL injection | N/A | No NoSQL or Redis store in deps (recon: none) |
| 19 | Cross-site scripting (XSS) | OK | Only raw-HTML sink is JSON-LD (`src/components/json-ld.tsx:7`) with `<` escaped (`src/lib/seo.ts:51-52`) over static data; no `innerHTML`/`eval` in src; outbound URLs built with `encodeURIComponent` (`site.ts` whatsappLink/mapsLink) |
| 20 | CSRF | N/A | No cookies, no sessions, no state-changing requests (no server); `form-action 'self' https://wa.me` in CSP |
| 21 | Insecure file uploads | N/A | No upload handlers: grepped `FormData`, `<input`, `multipart`, `presigned` in src → none; recon uploads: none |
| 22 | Path traversal | N/A | Shipped site has no file-serving code (Cloudflare serves `out/`); local `scripts/serve-out.mjs:47-54` rejects `..`/backslash/escape (dev tool only, per research/07) |
| 23 | SSRF | N/A | No server-side fetches at all; `grep 'fetch(' src` → none |
| 24 | Broken password reset | N/A | No passwords or accounts |
| 25 | Weak session management | N/A | No sessions or tokens; built JS has no cookie/localStorage/sessionStorage use (grep of `out/_next/static/chunks`) |
| 26 | Weak/leaked JWT secrets | N/A | No JWTs issued or verified; no auth of any kind |
| 27 | Overly permissive CORS | N/A | No API; static responses carry no `Access-Control-Allow-Origin` (local `curl -sI /`), and `Cross-Origin-Resource-Policy: same-origin` is set |
| 28 | Rate limits missing | N/A | No endpoints that cost anything per call; static assets are free and unlimited on Workers (notes/research/05-hosting.md); no login/signup/forms |
| 29 | Public test/staging envs | GAP (LOW) | G9: `wrangler.jsonc` leaves `workers_dev`/`preview_urls` at defaults, so public copies at `*.workers.dev` |
| 30 | Default credentials | N/A | No credentials, seeds or config fallbacks anywhere (`grep process.env src` → none) |
| 31 | Webhooks without signature checks | N/A | No inbound webhooks; no server |
| 32 | Payment checks only on frontend | N/A | Nothing is sold online; no payment deps (recon) |
| 33 | IDOR | N/A | No object lookups by ID on a server; gallery IDs are static build-time ImageIds |
| 34 | Trusting client-supplied IDs/roles | N/A | No API and no identity concept |
| 35 | Logs with tokens/PII | N/A | No application logs: no server code and no `console.*` in src (grep); hosting request logs covered by the privacy notice (G4) |
| 36 | Source maps exposed | OK | No `.map` in `out/` (`find out -name '*.map'` → none); chunks have no `sourceMappingURL`; probe of `<chunk>.js.map` → 404; no `productionBrowserSourceMaps` in `next.config.ts` |
| 37 | Dependency vulnerabilities | OK | `npm audit --omit=dev` → 0 vulnerabilities. Full audit: 5 high, all `braces` via `eslint-config-next` (dev-only lint toolchain, not shipped) |
| 38 | Outdated packages | GAP (LOW) | G8: react/react-dom 19.3.0 → 19.3.1 patch pending, no Dependabot; lockfile committed-ready, Node 24 LTS (`.node-version`, `engines`) |
| 39 | Prompt injection | N/A | No LLM calls or AI SDKs (recon AI/LLM: none; package.json deps) |
| 40 | AI tools without permission checks | N/A | No AI features, tools or retrieval |
| 41 | Excessive DB permissions | N/A | No database or DB driver in `package.json`; recon "Database / data: none detected" |
| 42 | No audit logs | N/A | No accounts, admin actions, payments or data changes to audit; deploy history lives in the Cloudflare account |
| 43 | No monitoring/alerting | GAP (MEDIUM) | G5: no uptime check or alert channel; domain-expiry and bad-deploy outages would go unnoticed |
| 44 | No backup/restore plan | GAP (HIGH) | G3: 0 commits, no remote; whole project and original photos exist on one laptop |
| 45 | Exposed internal dashboards | N/A | No dashboards or compose files; only `wrangler.jsonc` infra (recon) |
| 46 | Missing security headers | GAP (LOW) | G7: full set in `public/_headers:1-9`, but CSP needs `script-src 'unsafe-inline'`; local server serves stale headers |
| 47 | Cookie flags | N/A | App sets no cookies: no `document.cookie`/`Set-Cookie` in src or built JS; no server to set them |
| 48 | Unencrypted sensitive data | OK | No sensitive data stored; HSTS `max-age=31536000` + `upgrade-insecure-requests` (`public/_headers:2,7`); `qa-check.mjs` fails on any `http://` URL in HTML |
| 49 | Poor tenant isolation | N/A | Single-tenant static site, no shared user data |
| 50 | Over-trusting generated code | GAP (LOW) | G6: launch gate misses TODOs outside `src/content`; README is boilerplate. Positives: research/07 review pass, ESLint clean |
| 51 | Load tests | SKIP | Static edge-served files; testing would measure Cloudflare, not the app (see Recommended skips) |
| 52 | Session data on server | N/A | No sessions or server state; the only client state is UI (`open-now.tsx` uses `useSyncExternalStore` over the clock) |
| 53 | Uploads needing object storage | N/A | No user uploads; photos are owner-curated build assets in `assets/` → `public/img/` |
| 54 | Queue for background tasks | N/A | No background work: no server, email, LLM or webhook processing |
| 55 | Support URL | OWNER | Phone (`tel:`), WhatsApp button (`layout.tsx:52-65`), address and contact page `/iletisim/` exist; WhatsApp number unconfirmed (`site.ts:21`), so test both channels (Owner checks) |
| 56 | Title, subtitle, description | GAP (LOW) | G11: unique titles/descriptions/OG/canonical on every page; missing apple-touch-icon and manifest; logo pending |
| 57 | OWASP ZAP / Shannon | GAP (LOW) | G10: no dynamic scan ever run; passive baseline command ready |
| 58 | JSON compression | OWNER | No JSON API; Cloudflare compresses text by default, but the local stale server returned no `Content-Encoding`. Verify on production (Owner checks) |
| 59 | Single dependency bottleneck | OK | Static export is host-portable; fallback hosts ranked in notes/research/05-hosting.md (CF Pages, Netlify); bookings have two channels (WhatsApp `wa.me` + `tel:`); biggest real dependency is Google Business Profile (PLAN.md pre-mortem C) |
| 60 | Non-statically hosted site | OK | Fully static (`next.config.ts:7`); `Cache-Control: public, max-age=31536000, immutable` on `/_next/static/*` and `/img/*` (`public/_headers:11-15`) with content-hashed image names (`images.generated.ts` e.g. `about-01.698e450cde`) |
| 61 | Privacy policy coverage | GAP (MEDIUM) | G4: `/kvkk/` lacks retention, transfer-abroad (Cloudflare, Meta), application channel; owner review TODO at `kvkk/page.tsx:13` |
| 62 | IP infringement | GAP (HIGH) | G1: 21 stock (Unsplash) images presented as the salon's work; 9 invented testimonials (`site.ts:287-295`); fonts (Inter Tight, OFL), lucide (ISC) fine |
| 63 | Data compliance | GAP (MEDIUM) | G4: KVKK applies; no cookies so no banner needed; VERBİS likely exempt (2025/1572); m.9 transfer disclosure and retention missing; photo consent process documented in research/04 |
| 64 | Sanitizing every field | N/A | No user-supplied fields anywhere; the only query-string value (WhatsApp prefill) is a constant passed through `encodeURIComponent` |
| 65 | Requests from own domain only | N/A | No API to protect; site makes no `fetch` calls beyond Next's own same-origin RSC `.txt` prefetches (`connect-src 'self'`) |
| 66 | Blue-green / instant recovery | OWNER | Workers deploys are atomic and versioned, so `wrangler rollback` exists; not deployed yet, so practise one rollback (Owner checks) |
| 67 | Sensitive data in env files | N/A | Project has no secrets or environment-specific config; all config in `site.ts` is public business data |
| 68 | Optimistic loading UI | N/A | No mutations or async actions; every action is a navigation or an outbound `wa.me`/`tel:` link |
| 69 | DMCA / UGC liability | N/A | No user-generated content: testimonials and photos are chosen by the owner; no comments, uploads or embeds (no iframes, `frame-src 'none'`) |
| 70 | Subscription compliance | N/A | No subscriptions or online sales |
| 71 | Connection pooling | N/A | No database connections |
| 72 | Tests (unit/E2E/load) | GAP (LOW) | G8: no unit/E2E tests (recon: none); manual `npm run qa` (static HTML checks + Lighthouse) covers SEO/a11y regressions |
| 73 | Row-level security | N/A | No database or client-side DB access (no Supabase/Hasura/Firebase) |
| 74 | Terms of use | SKIP | No accounts, purchases or UGC to govern; 5651 m.3 identity info mostly present (see Recommended skips) |
| 75 | Valuable error messages | OK | Turkish 404 with a clear next step (`src/app/not-found.tsx:9-16` "Sayfa bulunamadı … Ana sayfaya dön"); no forms or async errors exist |
| 76 | Observability/logging | N/A | No server code to log or trace; Workers static asset requests don't run a script (`wrangler.jsonc` has no `main`); uptime covered under #43 |
| 77 | Allowlist for files served | OK | Only `out/` is served (`wrangler.jsonc` `directory ./out`); probes `/.env`, `/.git/config`, `/.DS_Store`, `/backup.sql`, `/package.json`, `/next.config.ts` → 404; no dotfiles in `out/` |
| 78 | API test in Burp | N/A | No API endpoints, no auth and no IDs to tamper with; dynamic check covered by #57 |
| 79 | Automated security scanning in CI | GAP (LOW) | G8: no CI at all (`.github/` absent), no secret scan or Dependabot |
| 80 | Bing Webmasters | OWNER | No `msvalidate.01` or `BingSiteAuth.xml` (none in `out/`); verify after the domain is live (Owner checks) |
| 81 | Google SEO and GEO | GAP (HIGH) | G2: every canonical/sitemap/robots/JSON-LD URL hard-coded to unregistered `www.barisalas.com.tr` (`site.ts:11`). Otherwise strong: robots allows all, 14-URL sitemap, HairSalon/Service/Breadcrumb/FAQPage JSON-LD, prerendered Turkish copy, no noindex on content pages |
| 82 | IP ban feature | OWNER | Cloudflare WAF IP Access Rules available once the zone is on Cloudflare; nothing in-app needed (Owner checks) |
| 83 | Trademarking the brand | OWNER | TÜRKPATENT search for "Barış Alaş" in classes 44 and 3, then decide (Owner checks) |
| 84 | Provisional patent | SKIP | No new technical method; brochure site (see Recommended skips) |
