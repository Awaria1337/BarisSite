# 05 — Hosting research (Next.js 16 single-page salon site)

Researched 2026-10-22 from official pages (fetched today). Quotes are verbatim from the URLs given.

## TL;DR

**Recommended: Cloudflare Workers with static assets, plus a static export (`output: 'export'`). DNS moves to Cloudflare's free plan.**
- ToS: the Free plan has no non-commercial clause. Vercel Hobby has one, and it explicitly bans this use case.
- Cost: ₺0/yıl. Only the domain costs money. "Requests to static assets are free and unlimited."
- Performance in Turkey: Cloudflare lists PoPs in **Istanbul, TR** and **Izmir, TR**. Vercel's 126 PoPs include no Turkish region.
- Maintenance: `git push` triggers an auto-build. `_headers` and `_redirects` live in `public/`. There is no server runtime to patch.

Fallback: Cloudflare Pages, with the same static export and the same `_headers`. It still works, but Cloudflare's banner says "Start new projects with Workers."

---

## 1. Vercel

### Hobby: commercial use is forbidden
- https://vercel.com/docs/limits/fair-use-guidelines (last_updated 2026-09-14):
  > "**Hobby teams** are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan."
  > "Commercial usage is defined as any Deployment that is used for the purpose of financial gain of **anyone** involved in **any part of the production** of the project, including a paid employee or consultant writing the code."
  Examples it lists include: "Advertising the sale of a product or service" and "Receiving payment to create, update, or host the site".
- https://vercel.com/legal/terms, §4 Hobby Plan:
  > "You shall only use the Services under a Hobby plan for your personal or non-commercial use."

A salon marketing site advertises a service, so it is commercial use. If a developer is paid to build it, that is commercial use under a second clause too. **Hosting it on Hobby violates the ToS.**

### Pro: price and inclusions (https://vercel.com/pricing)
- "$20/mo" per Developer seat. Viewer seats are "Unlimited".
- "Pro plans have a $20 included credit to use across resources."
- Fast Data Transfer: "1TB / month included", then "starting at $0.15 per GB". CDN Requests: "10M / month included".
- At roughly $240/yr (about ₺8–10k/yr at current rates), it is far above the ₺0 target for a static one-pager.

### A cheaper Vercel option?
None. The pricing page lists only Hobby, Pro and Enterprise. There is no tier between Hobby and Pro.

### Vercel network and Turkey (https://vercel.com/docs/regions)
"126 Points of Presence in 94 cities across 51 countries". The list of compute regions has no Turkish entry. The nearest are fra1 (Frankfurt) and arn1 (Stockholm), and the page does not list individual PoP cities.

---

## 2. Cloudflare (Pages / Workers static assets)

### Commercial use on Free
https://www.cloudflare.com/terms/ (Self-Serve Subscription Agreement) has **no** personal or non-commercial restriction for Free plans. The relevant clauses are:
- §2.6: Cloudflare "may offer free or trial versions of the Services" and may end a Free Service "in our sole discretion". It also says "We will have no liability for any harm or damage arising out of or in connection with any Free Services."
- §2.2.1(h) forbids you to "process or collect personal or business credit card information on any web property that is receiving Free Services." This is not an issue for a site without payments. Online booking would go through a third-party widget or a WhatsApp link.

Verdict: a business marketing site on Free is allowed.

### Limits
- Workers static assets (https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/):
  > "Requests to static assets are free and unlimited."
- Workers Free (https://developers.cloudflare.com/workers/platform/limits/): static assets allow "20,000" files per version, each up to "25 MiB". "Accounts on the Workers Free plan have a daily request limit of 100,000 requests". That limit applies only to *Worker script* invocations. Pure asset requests do not count, per the line above.
- Pages Free (https://developers.cloudflare.com/pages/platform/limits/): 500 builds/month, "1 build at a time", "up to 20,000 files on the Free plan", 25 MiB max per file, and 100 custom domains per project.
- OpenNext Free plan size limit (https://opennext.js.org/cloudflare): "The size limit of a Cloudflare Worker is 3 MiB on the Workers Free plan". This only matters if you go SSR. It does not apply to a static export.

### Custom domain and DNS
- Pages (https://developers.cloudflare.com/pages/configuration/custom-domains/):
  > "If you are deploying to a subdomain, it is not necessary for your site to be a Cloudflare zone." In that case you use a CNAME at your registrar pointing to `<project>.pages.dev`.
  > "To deploy your Pages project to a custom apex domain, that custom domain must be a zone on the Cloudflare account you have created your Pages project on."
- Workers Custom Domains (https://developers.cloudflare.com/workers/configuration/routing/custom-domains/): the prerequisite is "An active Cloudflare zone". The page also says: "You cannot create a Custom Domain on a hostname with an existing CNAME DNS record or on a zone you do not own."
- **Practical result:** move the domain's nameservers to Cloudflare. This costs nothing on the Free DNS plan and works for `.com` and `.com.tr`, since the registrar or TRABIS panel lets you set the nameservers. It also gives you free apex→www redirects (Redirect Rules), HTTP/3, Brotli and DNSSEC. A CNAME-only setup is possible only for `www` on Pages, and only without the apex.

### Next.js support
- Workers Next.js guide (https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/):
  > "Cloudflare recommends vinext as the default way to run Next.js applications on Cloudflare Workers."
  > For static export: "Use `output: "export"` for static exports."
  - OpenNext is now positioned for "an existing OpenNext application that cannot yet migrate to vinext". vinext is at npm v1.3.0 (published 2026-10-20).
- OpenNext (https://opennext.js.org/cloudflare): "All minor and patch versions of Next.js 16 and the latest minors of Next.js 14 and 15 are supported." The exception is that "Node Middleware introduced in 15.2 are not yet supported."
- Pages Next.js guide: "To deploy a static Next.js export to Pages, refer to Static site." The Pages landing page has the banner "Start new projects with Workers."
- `_headers` and `_redirects` (https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/) "are supported natively in Workers with static assets."

**For a one-page site, static export is the right choice.** It needs no adapter, no Worker script, no 3 MiB limit and no compatibility risk. vinext and OpenNext only make sense if you later need SSR, Server Actions or ISR.

### Turkey edge
https://www.cloudflare.com/network/ lists "Istanbul, TR" and "Izmir, TR". The Istanbul data center has existed since 2018 (blog.cloudflare.com/istanbul-not-constantinople/). Caveat: on Free, ISP peering decides which PoP serves a visitor. Some Turkish ISPs may route to Sofia or Frankfurt, which typically adds about 20–40 ms. Check this with a test from Türk Telekom, Turkcell and Vodafone connections after launch.

---

## 3. Netlify Free (credit-based, since the Sept 2025 change)
- Pricing (https://www.netlify.com/pricing/): Free is a "300 credit limit". Costs are "20 credits per GB" of bandwidth, "15 credits each" per production deploy and "2 credits per 10k requests". The Free plan includes "Add Custom domains with SSL". Personal is $9/month.
- Docs (credit-based-pricing-plans): "$0/month, forever, for 300 credits/month with a hard limit and no auto recharge option."
- How credits work:
  > "Once your credit balance is completely used up, all of your web projects (sites/apps) are paused and visitors to your web projects will find a `Site not available` page"
- ToS / Self-Serve Subscription Agreement (https://www.netlify.com/legal/self-serve-subscription-agreement/): there is **no** non-commercial clause, so commercial use is allowed. §6 reads: "Netlify may shut down Free Usage Tier website projects without notice for any reason or no reason."
- Budget math: 300 credits allow about 10 prod deploys (150 credits) plus about 7 GB of transfer. One image-heavy salon page of about 1.5 MB is roughly 4–5k visits per month, which is fine for a small salon. But frequent deploys burn credits, and **when credits run out the site goes offline**. That risk is worse than on Cloudflare.

## 4. GitHub Pages
https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits:
> "GitHub Pages is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS)."

There is also a soft limit of 100 GB/month and a 1 GB site size. A brochure page for a business sits in a grey zone. "run your online business" is arguably aimed at shops and SaaS, but the wording is risky enough to rank it below Cloudflare. A public repo is also required on the free account. **Not recommended.**

## 5. Other options
- **Firebase Hosting Spark** (https://firebase.google.com/pricing): "No-cost up to 10 GB" storage and "No-cost up to 360 MB/day" transfer, with custom domains and SSL included. The pricing page has no commercial restriction. 360 MB/day is about 10.8 GB/month, which is workable but tight for an image-heavy page. Google's CDN (Fastly-backed) has no confirmed Istanbul PoP.
- **Render Static Sites** (https://render.com/docs/static-sites): "Static sites are fast and free to deploy." "Static sites count against your workspace's monthly included amounts of outbound bandwidth". Custom domains "for free", 2 on Hobby. It works but has no advantage over Cloudflare.

---

## Static export: what you lose and the standard workarounds

Per https://nextjs.org/docs/app/guides/static-exports (lastUpdated 2026-08-09), these are **not** supported with `output: 'export'`: Rewrites, Redirects, Headers (from `next.config`), Proxy (formerly middleware), ISR, "Image Optimization with the default `loader`", Server Actions, Cookies, Draft Mode, Route Handlers that rely on Request, and dynamic routes without `generateStaticParams()`.

| Lost | Workaround |
|---|---|
| `next/image` default loader | (a) **next-image-export-optimizer** v1.21.2 (2026-10-18). Its peer dependency is `next ^14.2.18 \|\| ^15.0.3 \|\| ^16.0.0`, so Next 16 is OK. It runs sharp at build time and emits WebP or AVIF srcsets. (b) Pre-generate AVIF/WebP at several widths with a small `sharp` script and use `<picture>` or `images: { unoptimized: true }` with explicit `sizes`. (c) A custom `loaderFile` pointing to an image CDN, as in the Cloudinary example in the docs. Paid Cloudflare Images is not needed. Prefer (a) or (b): they cost ₺0 and the result is cached at the edge. |
| `headers()` in next.config | `public/_headers` (Pages and Workers static assets). Example: `/_next/static/*` → `Cache-Control: public, max-age=31536000, immutable`; `/*` → `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, a CSP, and HSTS (or turn HSTS on in the dashboard). |
| `redirects()` in next.config | `public/_redirects` for path redirects. **apex→www** (or the reverse) uses a Cloudflare dashboard Redirect Rule, either from the "Redirect from root to WWW" template or as a Single Redirect, 301, preserving path and query. The apex needs a proxied DNS record (e.g. `A @ 192.0.2.1` proxied, or the Workers Custom Domain on both). |
| ISR / revalidate | Not needed for a one-pager. Changing content means a rebuild. You can schedule one with a deploy hook or a GitHub Action cron if prices or hours come from a CMS. |
| Server Actions (forms) | Use WhatsApp `wa.me` links or `tel:`, or a third-party form (Formspree, Web3Forms). You could also add one small Worker route later. |
| Proxy/middleware (i18n, geo) | Separate static paths per language (`/`, `/en/`) through `generateStaticParams`. |

Next 16 specifics: `trailingSlash: true` is optional. Leaving it off is fine on Cloudflare, which serves `/about` → `about.html` automatically through its default `html_handling: "auto-trailing-slash"` setting.

Minimal Workers config, `wrangler.jsonc`:
```jsonc
{ "name": "salon", "compatibility_date": "2026-10-01",
  "assets": { "directory": "./out", "not_found_handling": "404-page" } }
```
To deploy, connect the Git repo in Workers Builds with build `npm run build` and deploy `npx wrangler deploy`, or deploy straight from CI.

---

## Ranking

| # | Option | ToS | Cost/yr | Turkey edge | Maintenance |
|---|---|---|---|---|---|
| 1 | **Cloudflare Workers static assets + static export** | Compliant (no non-commercial clause) | ₺0 + domain | Istanbul and Izmir PoPs | Very low; Cloudflare's recommended path |
| 2 | Cloudflare Pages + static export | Compliant | ₺0 + domain | Same | Very low; product de-emphasized ("Start new projects with Workers") |
| 3 | Netlify Free | Compliant | ₺0, but hard 300-credit cap pauses the site | No confirmed Turkey PoP | Low; must watch credits and deploys |
| 4 | Firebase Spark | No restriction found on pricing page | ₺0 (360 MB/day cap) | No confirmed Turkey PoP | Low–medium |
| 5 | Render static | Compliant | ₺0 within workspace bandwidth | No confirmed Turkey PoP | Low |
| 6 | Vercel Pro | Compliant | ~$240 (~₺8–10k) | No Turkish region; fra1 nearest | Lowest (native Next) |
| ✗ | Vercel Hobby | **Violates ToS** ("restricted to non-commercial personal use only") | — | — | — |
| ✗ | GitHub Pages | Risky ("not ... allowed ... to run your online business") | — | — | — |

**Decision:** Cloudflare Workers (static assets) with `output: 'export'`. Move the domain's DNS to Cloudflare's Free plan, use a 301 Redirect Rule from apex to www, and put caching and security headers in `public/_headers`. Use next-image-export-optimizer or a sharp script for AVIF/WebP. If SSR is ever needed, add vinext, or OpenNext with Next 16 support, on the same Worker.
