# 06 — Next.js 16.4.2 docs research (static export, Cloudflare static assets)

Source of truth: `node_modules/next/dist/docs/` (paths below are relative to it). Several claims were **verified empirically** by building a cloned copy of this project in a scratch dir with `next build` (Turbopack, 16.4.2) — marked **[verified]**.

---

## TL;DR — config to use

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,          // /hakkimizda -> out/hakkimizda/index.html (static hosts friendly)
  images: {
    unoptimized: true,          // OR loader:'custom' + loaderFile (see §2) — pick one
    qualities: [75],            // only matters with a custom loader; listed for clarity
  },
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' },
    },
  },
  // REMOVED: cacheComponents: true, partialPrefetching: true  (fatal with output:'export')
}
export default nextConfig
```

Plus: every **code-based** metadata route (`robots.ts`, `sitemap.ts`, `manifest.ts`, `opengraph-image.tsx`, `icon.tsx`, `apple-icon.tsx`) must `export const dynamic = 'force-static'` **[verified]**. Prefer static files (`opengraph-image.jpg`, `icon.png`, `apple-icon.png`, `favicon.ico`) — they need nothing and emit with proper extensions.

Replace `priority` on `<Image>` with `preload` (or `loading="eager"` / `fetchPriority="high"`).

---

## 1. Static export

**Config** — `01-app/02-guides/static-exports.md`:
> "To enable a static export, change the output mode inside `next.config.js`: … `output: 'export'`, // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html` // trailingSlash: true"

Output goes to `out/`.

**Unsupported in App Router** (same file): Dynamic Routes with `dynamicParams: true` or without `generateStaticParams()`, Route Handlers that rely on Request, Cookies, Rewrites, Redirects, Headers, **Proxy**, ISR, **Image Optimization with the default `loader`**, Draft Mode, **Server Actions**, Intercepting Routes. In dev these error "similar to setting `dynamic = 'error'`". Client components are prerendered: guard `window`/`localStorage` in `useEffect`.

Route Handlers: "you must explicitly mark the handler as static by adding `export const dynamic = 'force-static'` when a static export is enabled." Only `GET`.

### cacheComponents / partialPrefetching — NOT compatible
Docs don't say it explicitly, but the source does and the build fails **[verified]**:

```
> Build error occurred
Error: Invariant: PPR cannot be enabled in export mode
```
Source: `next/dist/export/index.js:657-660` — `// Export mode provide static outputs that are not compatible with PPR mode. if (!options.buildExport && nextConfig.cacheComponents) throw …` (the `output:'export'` path calls `exportApp` with `buildExport: false`, `build/index.js:426-437`).

`01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`: "`cacheComponents` implements **Partial Prerendering (PPR)** as the default behavior". `partialPrefetching.md`: "`partialPrefetching` requires `cacheComponents`. Without it, `next dev` and `next build` throw at config validation." → **remove both lines.** (Side effect: no `'use cache'`, `cacheLife`, `cacheTag`; not needed for a static site. Route segment config like `dynamic = 'force-static'` is the non-cacheComponents model.)

### trailingSlash
`…/next-config-js/trailingSlash.md`: "When used with `output: "export"` configuration, the `/about` page will output `/about/index.html` (instead of the default `/about.html`)." Static files/`.well-known/` are exempt.
Recommendation: `trailingSlash: true` for Cloudflare static assets — directory-style `index.html` resolves without any rewrite rules (the nginx example in static-exports.md notes the extra rewrite is "necessary when `trailingSlash: false`. You can omit this when `trailingSlash: true`"). For a true single-page site it matters little (only `/` + `404.html`), but it's harmless and future-proof. With `trailingSlash: true` the build also emits `out/404/index.html` and `out/404.html` **[verified]**.

### images.unoptimized vs custom loader
- `unoptimized: true` (`02-components/image.md` → `unoptimized`): "The source image will be served as-is from the `src` instead of changing quality, size, or format." No `srcset` is generated — one file per `<Image>`. Simplest.
- Custom loader (static-exports.md §Image Optimization): "can be used with a static export by defining a custom image loader" via `images: { loader: 'custom', loaderFile: './my-loader.ts' }`. Generates `srcset` across `deviceSizes`+`imageSizes`; you must have a file per width (see §2).

---

## 2. next/image in 16.x

Source: `01-app/03-api-reference/02-components/image.md`.

- **`priority` deprecated**: "Starting with Next.js 16, the `priority` property has been deprecated in favor of the `preload` property". Version history v16.0.0: "`preload` prop added, `priority` prop deprecated".
- **`preload`**: "`true`: Preloads the image by inserting a `<link>` in the `<head>`." Use for the single LCP hero. Don't use "When the `loading` property is used / When the `fetchPriority` property is used" and "In most cases, you should use `loading="eager"` or `fetchPriority="high"` instead of `preload`."
  Recommendation for hero: `preload` (one image), or `loading="eager" fetchPriority="high"` (if multiple candidate LCP images, e.g. responsive art direction). **[verified]**: `preload` + static import emits `<link rel="preload" as="image" href="/_next/static/media/hero.<hash>.png"/>`. Scaffold `page.tsx` still uses `priority` — replace it.
- **`loading`**: default `lazy`; `eager` loads immediately.
- **`qualities`**: "This field is required starting with Next.js 16"; default `[75]`; `quality` prop not in list is "coerced to the closest allowed entry". Only meaningful when a loader uses `quality` (ignored with `unoptimized`).
- **`imageSizes`** default dropped `16` (`02-guides/upgrading/version-16.md` §imageSizes Default).
- **`placeholder="blur"` + static import**: "If `src` is a static import of a `jpg`, `png`, `webp`, or `avif` file, `blurDataURL` is added automatically—unless the image is animated." Works in export mode with `unoptimized: true` **[verified]** — the blur is inlined as a data-URI SVG/base64 background in the HTML (production; dev uses `/_next/image`). Remote/`/public` string srcs need a manual `blurDataURL`.
- Static imports are emitted to `/_next/static/media/<name>.<hash>.<ext>` (immutable-cacheable).
- **Local images with query strings** now need `images.localPatterns.search` (version-16.md) — avoid `?v=` on local srcs.

### Custom loader for pre-generated AVIF/WebP
`loaderFile` (image.md §loaderFile): "The path must be relative to the project root. The file must export a default function that returns a URL string" — App Router example starts with `'use client'`:
```ts
// image-loader.ts
'use client'
export default function loader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // e.g. src="/img/salon-01" -> /img/salon-01-<w>.avif ; pre-generate every width you allow
  return `${src}-${width}.avif`
}
```
```ts
images: { loader: 'custom', loaderFile: './image-loader.ts', deviceSizes: [640, 828, 1200, 1920], imageSizes: [256, 384], qualities: [75] }
```
Caveat: a loader returns **one URL per width** — no format negotiation (`formats` / Accept-header logic is server-only). For AVIF with WebP/JPEG fallback use `<picture>` with `getImageProps()` (image.md §getImageProps / §Art direction): call `getImageProps` once per format and put `srcSet`s into `<source type="image/avif">` / `<source type="image/webp">`, `<img {...rest}>`. Note "it cannot be used with the `placeholder` prop". Keep the width lists small so the pre-generation step matches `deviceSizes ∪ imageSizes` exactly (or pass `sizes`/limit widths).

Pragmatic pick for this site: `unoptimized: true` + pre-optimized static imports (WebP/AVIF files imported directly, `sizes` set) unless we need multi-width srcsets, in which case custom loader + build-time script.

---

## 3. Metadata

- `metadata` / `viewport` exports from `layout.tsx`/`page.tsx` — static objects are fine in export. `viewport` is separate: `03-api-reference/04-functions/generate-viewport.md`: "export a `viewport` object from a `layout.jsx` or `page.jsx` file" (`themeColor`, `colorScheme` live here; in `metadata` they're deprecated since v14).
- **`metadataBase`** (`04-functions/generate-metadata.md`): "typically set in root `app/layout.js`"; "Using a relative path in a URL-based `metadata` field without configuring a `metadataBase` will cause a build error." **[verified]** without it the build warns and OG URLs become `http://localhost:3000/...`. Set `metadataBase: new URL('https://<domain>')`.
- File conventions are "special Route Handlers … cached by default" (`03-file-conventions/01-metadata/robots.md`, `sitemap.md`, `manifest.md`, `opengraph-image.md`, `app-icons.md`). **But with `output:'export'` code-based ones must declare `export const dynamic = 'force-static'`** — otherwise **[verified]**:
  ```
  Error: export const dynamic = "force-static"/export const revalidate not configured on route "/sitemap.xml" with "output: export".
  ```
  (same error for `/opengraph-image`). Cause: `server/route-modules/app-route/module.js:172-179` + the metadata loader only re-exports user configs. Static image files (`opengraph-image.jpg`, `icon.png`, `apple-icon.png`, `favicon.ico`) get `force-static` automatically.
- After adding `force-static`, output **[verified]**: `out/robots.txt`, `out/sitemap.xml`, `out/manifest.webmanifest` (+ `<link rel="manifest" href="/manifest.webmanifest"/>`), `out/opengraph-image`.
- ⚠ Generated `opengraph-image.tsx` is written as an **extensionless** file `out/opengraph-image` (PNG bytes). Cloudflare static assets infer Content-Type from extension → likely `application/octet-stream`. Prefer a static `app/opengraph-image.jpg|png` → emitted as `out/opengraph-image.png`, meta `og:image` = `…/opengraph-image.png?<hash>.png` **[verified]**. Same applies to `icon.tsx`/`apple-icon.tsx` → use image files.
- **Sitemap images** (`sitemap.md` §Image Sitemaps): `images: ['https://example.com/image.jpg']` per entry → `<image:image><image:loc>` with the `xmlns:image` namespace **[verified]**. v16: `generateSitemaps` `id` is a Promise (not needed for one sitemap).
- `opengraph-image`/`icon` image functions receive `params`/`id` as Promises in v16 (version-16.md §Async parameters for icon, and open-graph Image).
- `favicon.ico` only in root `app/`; `apple-icon` accepts `.jpg/.jpeg/.png` (`app-icons.md`).

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
export const dynamic = 'force-static'
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://example.com/', lastModified: new Date(), changeFrequency: 'monthly', priority: 1,
            images: ['https://example.com/og/salon.jpg'] }]
}
```

---

## 4. JSON-LD (`01-app/02-guides/json-ld.md`)

> "Our current recommendation for JSON-LD is to render structured data as a `<script>` tag in your `layout.js` or `page.js` components."
> "…scrub `HTML` tags from the `JSON-LD` payload, for example, by replacing the character, `<`, with its unicode equivalent, `<`."
> "The `next/script` component is optimized for loading and executing JavaScript. Since JSON-LD is structured data, not executable code, a native `<script>` tag is the right choice here."

```tsx
const jsonLd = { '@context': 'https://schema.org', '@type': 'HairSalon', name: '…', /* … */ }
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
/>
```
Types: `schema-dts` (`WithContext<HairSalon>`). Validate with Rich Results Test.

---

## 5. Fonts (`03-api-reference/02-components/font.md`, `01-getting-started/13-fonts.md`)

- No API change in 16.x (font.md Version Changes stops at v13.2.0). `next/font/google` self-hosts at build — works in export (**[verified]**: build fetched Geist fine; needs network at build time).
- `subsets`: "names of each subset you would like to be preloaded … link preload tag injected … when `preload` is true, which is the default." **For Turkish use `subsets: ['latin', 'latin-ext']`** (ğ, ş, ı, İ, ç are in latin-ext) — check the chosen family offers `latin-ext` on Google Fonts.
- Variable fonts: no `weight` needed; non-variable: `weight` required. `display` default `'swap'`.
- Tailwind v4 integration (font.md §With Tailwind CSS): `variable: '--font-inter'` on `<html>` + `@theme inline { --font-sans: var(--font-inter); }`.
- Local: `import localFont from 'next/font/local'`, `src` string or `[{ path, weight, style }]`, `adjustFontFallback` default `'Arial'`; `declarations` option to set `font-family` etc.

---

## 6. `<ViewTransition>` (`01-app/02-guides/view-transitions.md`)

> "View transitions work in the App Router with no configuration. React 19.3 includes the `<ViewTransition>` component and `addTransitionType` API used in this guide."
> "Import the `ViewTransition` component from React: `import { ViewTransition } from 'react'`"

- **Stable import** `import { ViewTransition, addTransitionType } from 'react'`. Checked runtime: React 19.3.0 → `typeof ViewTransition === 'symbol'`, `unstable_ViewTransition === undefined`. `@types/react` exports `ViewTransition`.
- **No `experimental.viewTransition` flag** — no such key in `next/dist/server/config-shared.js`/`config-schema.js` in 16.4.2; docs mention none.
- Triggers: "activated by Transitions, `<Suspense>`, and `useDeferredValue`. Regular `setState` calls do not trigger them." Route navigations are transitions. For a single-page site, wrap state changes in `startTransition` (e.g. tab/gallery switching) or use Suspense reveals.
- Patterns: shared element `name` + `share="morph" default="none"`; Suspense `enter`/`exit` classes; `<Link transitionTypes={['nav-forward']}>` (also `router.push(..., { transitionTypes })`); `key`-based crossfade. CSS via `::view-transition-old(.class)` / `::view-transition-new(.class)`.
- Browser note: needs Chromium 125+ / recent Safari/Firefox for types + `view-transition-class`; otherwise no animation, app still works. Add `prefers-reduced-motion` handling yourself.

---

## 7. Other 16.x breaking changes / deprecations (`01-app/02-guides/upgrading/version-16.md`)

- **Requirements**: Node 20.9+, TS 5.1+, browsers Chrome/Edge/Firefox 111+, Safari 16.4+.
- **Turbopack default** for `next dev` and `next build`; a custom `webpack` config makes `next build` fail; opt out with `--webpack`. `experimental.turbopack` → top-level `turbopack`.
- **`next lint` removed**: "Use Biome or ESLint directly. `next build` no longer runs linting." and "The `eslint` option in the Next.js config file is also removed." Our `package.json` already has `"lint": "eslint"`.
- **ESLint flat config** default; our `eslint.config.mjs` matches `03-api-reference/05-config/03-eslint.md` (`eslint-config-next/core-web-vitals` + `/typescript`, `globalIgnores` incl. `out/**`). ✓
- **`middleware` → `proxy`**: file and export renamed; Node runtime only. Irrelevant — Proxy is unsupported with static export anyway.
- **Async Request APIs** (`params`, `searchParams`, `cookies()`…) are Promises only. `LayoutProps<'/'>` / `PageProps<'/'>` global helpers are used by the scaffold.
- **React Compiler** stable: top-level `reactCompiler: true` (not experimental), off by default, needs `babel-plugin-react-compiler`; "Expect compile times … to be higher". Optional for us (`03-api-reference/05-config/01-next-config-js/reactCompiler.md`).
- **Scroll behavior**: Next no longer overrides `scroll-behavior: smooth` on navigation; add `data-scroll-behavior="smooth"` on `<html>` only if you want the old override. Relevant if we use CSS smooth scrolling for in-page anchors (good for a single-page site — no attribute needed).
- **Parallel routes** need `default.js`; **AMP**, `serverRuntimeConfig/publicRuntimeConfig`, `experimental.dynamicIO/useCache`, `experimental.ppr`, `unstable_rootParams` removed.
- `next/image`: `minimumCacheTTL`, `imageSizes`, `qualities`, local IP, max redirects defaults changed; `next/legacy/image` and `images.domains` deprecated.

---

## 8. Tailwind v4

- **Documented approach is PostCSS, not `@tailwindcss/turbopack`.** `01-app/01-getting-started/11-css.md`: `npm install -D tailwindcss @tailwindcss/postcss` + `postcss.config.mjs` `{ plugins: { '@tailwindcss/postcss': {} } }` + `@import 'tailwindcss';`. `@tailwindcss/turbopack` is not mentioned anywhere in the Next docs.
- `turbopack.md` even says: "Only loaders that return JavaScript code are supported. Loaders that transform files like stylesheets or images are not currently supported." (docs may lag; module `type`/`as` rules were added in 16.2).
- **However it works in practice [verified]**: `next build` (Turbopack, 16.4.2) with the scaffold's `'*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' }` produced a 14.5 KB CSS chunk containing generated utilities (e.g. `.bg-zinc-50{background-color:var(--color-zinc-50)}`). `@tailwindcss/turbopack@4.3.3` is installed ("A Turbopack loader for Tailwind CSS v4"). No `postcss.config.*` exists in the project.
- Recommendation: keep the scaffold's loader (it works and create-next-app 16.4 generated it). Fallback if anything breaks (or if building with `--webpack`, which ignores `turbopack.rules`): `npm i -D @tailwindcss/postcss`, add `postcss.config.mjs` as above, delete the `turbopack.rules['*.css']` entry. Don't run both at once (double processing).

---

## Deployment notes (Cloudflare Workers static assets)
- Deploy `out/`. Use `not_found_handling = "404-page"` (serves `404.html`) and `html_handling` default/`auto-trailing-slash` with `trailingSlash: true`.
- `next start` is not for export; preview with `npx wrangler dev` or any static server.
- `_next/static/**` is content-hashed → cache immutable; HTML short TTL. Headers config in `next.config` doesn't apply to export — use Cloudflare `_headers`.
