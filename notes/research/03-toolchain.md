# 03 — Toolchain research (as of 2026-10-22)

Scope: Node/npm, Next.js stack versions, animation stack, agent skills, and a lightbox approach for the BarisAlas salon site (Next.js on Vercel). Version numbers come from `registry.npmjs.org/<pkg>/latest` and `nodejs.org/dist/index.json`, fetched 2026-10-22.

---

## 1. Node.js and npm

### Release lines (nodejs.org/dist/index.json + nodejs/Release schedule.json)

| Line | Latest | Released | Status today | npm bundled | EOL |
|---|---|---|---|---|---|
| **v26** | **26.12.1** | 2026-10-21 | Current. **Becomes Active LTS on 2026-10-28** | 11.20.0 | 2029-04-30 |
| **v24 "Krypton"** | **24.22.1** | 2026-10-20 | LTS. Moved from Active to **Maintenance LTS on 2026-10-20** | 11.19.1 | 2028-04-30 |
| v22 "Jod" | 22.23.4 | 2026-10-20 | Maintenance LTS | 10.9.9 | 2027-04-30 |
| v25 | 25.9.0 | 2026-03-31 | EOL (odd line) | — | — |

Today is an in-between week: v24 has just entered maintenance and v26 gets LTS status on Oct 28.

### Vercel (docs: Supported Node.js versions, updated 2026-02-27)
- Available: **24.x (default)** and **22.x**. Node 20 was deprecated on 2026-10-01. **Vercel does not offer 26.x yet.**
- Pin the version with `"engines": { "node": "24.x" }` in package.json. This overrides the dashboard setting.
- `next@16.4.2` requires `node >=20.9.0`.

**Recommendation:** develop and deploy on **Node 24.x** (24.22.1) so local and Vercel match. Move to 26 once Vercel lists 26.x.

### npm
- Latest: **npm 12.2.1**. Its engines field is `^22.22.2 || ^24.15.0 || >=26.0.0`. Node 24.22.1 ships npm 11.19.1, which is fine. npm 12 is optional; no part of this stack needs it.
- bun 1.3.14 is also installed. Use npm for this project, matching Vercel's default and `--use-npm`.

---

## 2. This machine: how Node is installed (read-only findings)

```
$ which -a node
/Users/mert/.local/bin/node            <- first on PATH (active)
/Users/mert/.local/bin/node            (PATH lists ~/.local/bin twice)
/usr/local/bin/node
$ ls -la ~/.local/bin/node
~/.local/bin/node -> /Users/mert/.hermes/node/bin/node   (v22.22.3)
$ /usr/local/bin/node -v
v24.16.0      (owned by root:wheel; pkgutil shows org.nodejs.node.pkg = official nodejs.org .pkg installer)
$ brew list --versions node node@22 node@24   -> nothing (no Homebrew node)
~/.nvm, ~/.fnm, ~/.volta                       -> none
~/.zprofile line 3: "# Hermes Agent — ensure ~/.local/bin is on PATH"
```

So:
- The **active `node` (v22.22.3) is the private Node runtime bundled with Hermes Agent** (`~/.hermes/node`). The Hermes installer symlinked it into `~/.local/bin`, which comes before `/usr/local/bin` in PATH.
- An **official .pkg Node v24.16.0** is already installed at `/usr/local/bin/node`, but the Hermes symlink hides it.
- There is no Homebrew Node and no version manager.

### Recommended safe upgrade (not executed)

**Do not** replace or `brew upgrade` the Hermes runtime. Hermes Agent may depend on that exact Node, and its updater may rewrite the symlink. Install a version manager that applies per shell or per project instead:

```bash
brew install fnm
# add to the END of ~/.zshrc (it runs after .zprofile, so fnm's path is prepended ahead of ~/.local/bin):
eval "$(fnm env --use-on-cd --version-file-strategy=recursive)"
fnm install 24          # -> 24.22.1
fnm default 24
# in the project:
echo "24" > /Users/mert/Desktop/BarisAlas/.node-version
```

- Check afterwards with `which node` (should be under `~/.local/state/fnm_multishells/...`) and `node -v` (should be v24.22.1).
- Hermes Agent keeps working because it calls its own `~/.hermes/node/bin/node`. Confirm that once by running Hermes after the switch.
- Alternatives:
  - (a) Run the official 24.22.1 .pkg from nodejs.org. It updates `/usr/local/bin/node`, but `~/.local/bin` still shadows it, so you would also have to reorder PATH.
  - (b) `brew install node@24`. It is keg-only and also needs PATH changes.
  - fnm is the cleanest of the three.
- Risks:
  - Other projects that expect Node 22 now get 24 by default. Put `.node-version` / `.nvmrc` files with `22` in those projects, or run `fnm use 22`.
  - Native modules (e.g. `better-sqlite3`, `sharp` prebuilt binaries) need `npm rebuild` / reinstall under the new ABI.
  - Global npm packages installed under the Hermes Node (`npm ls -g`) will not be visible under fnm's Node.
- Minimal option with zero changes: keep Node 22.22.3. Next 16.4 supports it and Vercel still offers 22.x, but 22 is in maintenance and ends 2027-04-30.

---

## 3. Latest stable package versions (registry.npmjs.org/*/latest, 2026-10-22)

| Package | Version | Notes |
|---|---|---|
| next / create-next-app / eslint-config-next | **16.4.2** | engines node >=20.9.0 |
| react / react-dom | **19.3.1** | 19.3 (2026-09-09) made `<ViewTransition>` and Fragment refs stable |
| @types/react | 19.3.0 | |
| tailwindcss / @tailwindcss/postcss | **4.3.3** | v4: CSS-first config |
| typescript | **7.0.2** | Native Go compiler (Project Corsa). No stable programmatic API until 7.1; strict + esnext are the defaults |
| eslint | **10.13.0** | eslint-config-next peer: eslint >=9 |
| motion | 14.6.0 | |
| gsap | 3.15.0 | |
| lenis | 1.3.27 | |
| tw-animate-css | 1.4.0 | |
| yet-another-react-lightbox | 3.32.2 | |
| photoswipe | 5.4.4 | |
| npm | 12.2.1 | |

**TypeScript 7 caveat:** third-party sources (InfoQ, achromatic.dev) report that Next.js has supported TS 7 since 16.3, and a vercel/turbo commit moved to 7.0.2 stable. The same commit notes that Next's type generation rejects the `@typescript/typescript6` shim, so use the real `typescript` package. If an editor plugin or tool breaks for lack of the JS API, pin `typescript@~6` for that tool. App type-checking works on 7.

### Tailwind v4 setup (tailwindcss.com Next.js guide)
- Packages: `tailwindcss @tailwindcss/postcss postcss`. create-next-app `--tailwind` sets this up.
- `postcss.config.mjs`: `export default { plugins: { "@tailwindcss/postcss": {} } }`
- `app/globals.css`: `@import "tailwindcss";` then design tokens in `@theme { --color-brand: …; --font-display: …; }`. There is no `tailwind.config.js`.

### create-next-app 16.4.2 flags (from `--help`)
`--ts --tailwind --eslint|--biome --app --src-dir --import-alias "@/*" --use-npm --yes --react-compiler --cache-components --rspack --empty --api --skip-install --disable-git --agents-md (default) --no-agent-feedback`

- **There is no `--turbopack` flag.** Turbopack is the default bundler in Next 16; `--rspack` is the opt-out.
- Suggested non-interactive command (runs in an empty or new dir):

```bash
npx create-next-app@16.4.2 barisalas --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --react-compiler --no-agent-feedback --yes
```

Then add `"engines": { "node": "24.x" }` to package.json.

---

## 4. Animation stack for a tasteful, performant salon site

### Options

| Tool | Size (min+gz) | Strengths | Concerns |
|---|---|---|---|
| **CSS transitions/keyframes + `@starting-style`** | 0 KB | Runs on the compositor; no hydration cost | Less choreography |
| **CSS scroll-driven animations** (`animation-timeline: view()`) | 0 KB | Off-main-thread scroll reveals and parallax, no JS | **Baseline "limited"**: Chrome/Edge 115+ (2023), **Safari 26+ (2025-09-15)**, **Firefox not on by default** (behind a pref; on the Interop 2026 list; Firefox's stable WPT score is 0.10). Wrap in `@supports (animation-timeline: view())` so Firefox shows static content |
| **React `<ViewTransition>`** (React 19.3, built into Next App Router) | 0 KB extra (React built-in) | Route morphs (thumbnail to hero), Suspense reveals, directional nav. **Next 16.4 docs: works with no config** (the experimental flag is no longer needed) | Same-document View Transitions are Baseline "newly" (Chrome 111, Safari 18, **Firefox 144**, 2025-10-14). Without support, navigation still works but nothing animates |
| **tw-animate-css** 1.4.0 | ~1.8 KB CSS | Tailwind v4 replacement for tailwindcss-animate (`animate-in fade-in slide-in-from-bottom-4`). The shadcn default | CSS only, utility enter/exit |
| **motion** 14.6 (`import { motion } from "motion/react"`) | `motion` component ~43 KB in full (bundlephobia: 57 KB gz for the whole package). **`m` + `LazyMotion` ~5 KB initial, +24 KB `domAnimation` loaded lazily**; `useAnimate` mini 3.3 KB | Springs, gestures, layout animations, `AnimatePresence`, `whileInView` | Client components only. Full `motion` on many components hurts JS/INP |
| **GSAP** 3.15 (+ScrollTrigger, SplitText) | core ~27 KB gz; ScrollTrigger ~+12 KB; SplitText ~+6 KB | Timelines, SplitText headline reveals, pinning | Imperative; needs `useGSAP` from `@gsap/react` and cleanup. Larger than CSS. **Fully free, including all bonus plugins**, since the Webflow acquisition (gsap.com banner: "GSAP is now free for everyone"; npm license "Standard 'no charge' license"; plugins ship in the public `gsap` package as `gsap/SplitText` etc.). From memory, the Standard License bars use in a product that competes with Webflow (a visual no-code builder); I have not confirmed this against the license text. It does not affect a salon site |
| **Lenis** 1.3.27 | ~8 KB gz | Smooth wheel scrolling | Overrides native scroll feel. Smooth scroll gets in the way of trackpad and accessibility users and adds main-thread rAF work on every frame. **Not recommended** for a salon site |

### Performance (LCP / INP / CLS)
- **LCP:** never animate the hero image or the H1 in from `opacity: 0`. The LCP element would not paint until the animation and JS run. Keep the hero static, or animate only `transform` / `clip-path` from a visible state. Use `next/image` with `priority`/`preload` on the hero.
- **INP:** a JS animation library adds hydration and main-thread work. CSS and the View Transitions API run on the compositor. Keep animated components few, and use `LazyMotion` + `m` if you adopt motion.
- **CLS:** animate only `transform` and `opacity` (plus `clip-path` and `filter` sparingly). Reserve space for text reveals.
- Always honor `prefers-reduced-motion`, both in CSS `@media` and in motion's `useReducedMotion` / `MotionConfig reducedMotion="user"`.

### Recommended minimal stack
1. **CSS-first:** Tailwind v4 transitions + `tw-animate-css` for enter states. Scroll reveals use `animation-timeline: view()` inside `@supports`, with no animation as the fallback. Optionally add a ~1 KB IntersectionObserver fallback that adds a class, if Firefox reveals matter.
2. **React `<ViewTransition>`** (free, built in) for gallery thumbnail to detail morphs and page crossfades.
3. **At most one JS library, added only if needed:** **`motion`** via `LazyMotion` + `m` (~5 KB initial). It fits React and handles springs, hover/press feedback, and `AnimatePresence` for the booking drawer or menu. Pick GSAP instead only if the design calls for SplitText-style headline choreography or pinned scroll storytelling. **Skip Lenis.**

---

## 5. Claude Code / agent skills for web design and animation

Already installed (`~/.claude/skills`): `frontend-design` (Anthropic), the vercel-labs/agent-skills set (`react-best-practices`, `composition-patterns`, `react-view-transitions`, `web-design-guidelines`, `writing-guidelines`, `deploy-to-vercel`, `vercel-cli-with-tokens`, `vercel-optimize`), and `security-review`. The Next.js docs recommend `react-view-transitions` for exactly this work, and it is already installed.

Install CLI: `npx skills add <owner/repo> [--skill <name>] [--agent claude-code]` (skills.sh, open source at vercel-labs/skills). Many repos also offer `/plugin marketplace add <owner/repo>`.

| Candidate | Repo | Contents | Verdict |
|---|---|---|---|
| **emilkowalski/skills** | https://github.com/emilkowalski/skills (48.6k stars, pushed 2026-10-11) | `emil-design-eng`, `animate`, `animation-performance`, `animation-vocabulary`, `improve-animations`, `review-animations`, `find-animation-opportunities`, `apple-design`, `pick-ui-library`, `prototype`, `break-ui`, plus a performance-cheatsheet.md. By the author of Sonner/Vaul, focused on tasteful UI motion | **Worth installing.** The best fit for "tasteful animation." Install `emil-design-eng`, `animate`, `animation-performance`, `review-animations` |
| **greensock/gsap-skills** (official) | https://github.com/greensock/gsap-skills (16.9k stars) | `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-react`, `gsap-performance`, `gsap-utils`, `gsap-frameworks`, llms.txt | **Install only if GSAP is chosen** (`gsap-react`, `gsap-scrolltrigger`, `gsap-performance`) |
| **leonxlnx/taste-skill** | https://github.com/leonxlnx/taste-skill (100.9k stars) | `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`: art direction, reference images, browser check against generic AI-looking pages | Worth considering for a premium salon look. It overlaps with `frontend-design`, so pick one as primary |
| **pbakaus/impeccable** | https://github.com/pbakaus/impeccable (84.7k stars, very active) | "Design language" skill/plugin with a CLI and multi-agent harness configs | Heavy, a whole framework. Optional; skip unless you want its opinionated system |
| anthropics/skills | https://github.com/anthropics/skills | `frontend-design` (installed), `theme-factory`, `canvas-design`, `brand-guidelines`, `web-artifacts-builder`, `webapp-testing` | `webapp-testing` (Playwright checks) is mildly useful; the rest are not needed |
| Motion AI Kit (official) | https://motion.dev/docs/ai-kit | Best-practices, performance audit, CSS spring generator, and docs-search skills, plus a Motion MCP | **Paid** (Motion+ membership or standalone purchase). Skip unless you already have Motion+ |
| Community motion/GSAP skills (e.g. 199-biotechnologies motion-dev-animations, martinholovsky gsap, owl-listener/designer-skills motion-system) | via claudskills.com / claudemarketplaces.com | Generic SKILL.md files | Unverified quality. Skip |
| heygen-com/hyperframes, remotion-dev/skills | skills.sh | Video and motion-graphics generation | Not relevant for a website |

---

## 6. Gallery and lightbox with zero CLS

The lightbox itself is a fixed or top-layer overlay, so it never causes CLS. CLS comes from the **grid**:
- Use `next/image` with explicit `width`/`height`, or a fixed `aspect-ratio` box with `fill`, plus `sizes="(min-width:1024px) 33vw, 50vw"` and `placeholder="blur"` (static imports give `blurDataURL` for free).
- Store each photo's intrinsic dimensions in the data file. A masonry layout must know aspect ratios before render; use CSS columns or a precomputed layout, not JS that measures after load.
- Use `loading="lazy"` (the default) for everything below the fold.

| Option | Size (min+gz, measured from unpkg) | Notes |
|---|---|---|
| **Native `<dialog>`** + `next/image` | **0 KB** library | Baseline "widely available". Gives top layer, focus trap, Esc to close, `::backdrop`, inert background. You write arrow-key and swipe navigation (~1–2 KB) yourself. Pairs naturally with React `<ViewTransition>` / `document.startViewTransition` for a thumbnail to fullscreen morph |
| **yet-another-react-lightbox** 3.32.2 | ~16.7 KB JS + 1.5 KB CSS (bundlephobia 11.9 KB gz) + plugins (Zoom, Thumbnails, Captions) | React-native API, swipe and pinch, `render.slide` hook to use `next/image`, a11y handled. Load it with `next/dynamic` on first click so it costs nothing at load time |
| **PhotoSwipe** 5.4.4 | `photoswipe-lightbox` 4.5 KB up front; the core 16.4 KB + 2.4 KB CSS load dynamically on open | Best mobile gestures (pinch, pan, drag to close) and an opening zoom from the thumbnail. Needs each image's `data-pswp-width`/`height`. Vanilla JS, so wrap it in a `useEffect` client component |

**Recommendation:** for a salon portfolio of many photos, use a server-rendered `next/image` grid with known dimensions, plus **yet-another-react-lightbox loaded via `next/dynamic` on first interaction**. It needs the least custom code in React and has good mobile gestures, with 0 KB at load time. Choose **native `<dialog>`** if the gallery is simple (no zoom) and you want zero dependencies with the React ViewTransition morph. Choose PhotoSwipe if pinch-zoom quality on phones is the top priority.

---

## Sources
- Node release index: https://nodejs.org/dist/index.json
- Node release schedule: https://raw.githubusercontent.com/nodejs/Release/main/schedule.json
- Vercel Node versions: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- Vercel Node 20 deprecation: https://vercel.com/changelog/node-js-20-is-being-deprecated
- npm registry: https://registry.npmjs.org/{next,react,react-dom,tailwindcss,@tailwindcss/postcss,typescript,eslint,eslint-config-next,create-next-app,motion,gsap,lenis,tw-animate-css,yet-another-react-lightbox,photoswipe,npm}/latest
- create-next-app 16.4.2 `--help` output (run locally via npx, read-only)
- React 19.3 blog: https://react.dev/blog/2026/09/09/react-19-3
- Next.js view transitions guide (updated 2026-10-15): https://nextjs.org/docs/app/guides/view-transitions
- Tailwind v4 + Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- TypeScript 7: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/ , https://infoq.com/news/2026/08/typescript-7-released/ , https://www.achromatic.dev/blog/nextjs-16-3-typescript-7-upgrade , https://app.semanticdiff.com/gh/vercel/turbo/commit/2afa75d26a611c7cd460d41f2baec4dea60fb55f
- Scroll-driven animations support: https://api.webstatus.dev/v1/features/scroll-driven-animations , https://github.com/web-platform-dx/web-features/blob/main/features/scroll-driven-animations.yml , https://www.drweb.de/css-scroll-animationen-ohne-javascript/ , https://connect.mozilla.org/t5/ideas/implement-css-scroll-driven-animations-animation-timeline/idc-p/116613
- View transitions support: https://api.webstatus.dev/v1/features/view-transitions , https://api.webstatus.dev/v1/features/cross-document-view-transitions
- Motion bundle size: https://motion.dev/docs/react-reduce-bundle-size ; install: https://motion.dev/docs/react-installation ; AI Kit: https://motion.dev/docs/ai-kit
- GSAP free: https://gsap.com/standard-license , https://github.com/greensock/gsap-skills
- Bundle sizes: https://bundlephobia.com/api/size?package=… ; gzip of unpkg dist files (measured locally)
- Skills: https://skills.sh , https://github.com/emilkowalski/skills , https://github.com/greensock/gsap-skills , https://github.com/leonxlnx/taste-skill , https://github.com/pbakaus/impeccable , https://github.com/anthropics/skills , https://github.com/vercel-labs/agent-skills
