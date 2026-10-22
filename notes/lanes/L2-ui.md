# Lane L2 — UI components: halftone footer, infinite slider, testimonials columns

You are a delegate working in a shared Next.js 16.4 repo at /Users/mert/Desktop/BarisAlas
(App Router, `output: 'export'` static site, Tailwind v4 CSS-first, TypeScript 5, React 19.3).
Other lanes edit other files concurrently. Follow this brief exactly.

## Context
- Turkish women's hair salon site. All UI text Turkish.
- Design tokens (Tailwind v4 `@theme`, src/app/globals.css — read it, don't edit it):
  colors `krem #f7f0e8` (page bg), `fildisi #fffdf9` (cards), `nude #eadbcd`, `cizgi #e0cfbf`
  (hairlines), `murekkep #1b1612` (text/dark bg), `gri #6b5f57` (muted text), `kakao #7b5238`
  (accent), `kakao-koyu #5e3e2a`, `karamel #c49a74` (accent on dark).
  Fonts: `font-display` (Inter Tight, CSS var `--font-inter-tight`), `font-sans` (Inter, `--font-inter`).
  Animation utilities already defined: `animate-marquee-x`, `animate-marquee-y` driven by CSS vars
  `--marquee-duration` (e.g. "30s") and `--marquee-gap` (e.g. "24px"); they translate by
  -50% minus half the gap, so content must be rendered TWICE in a flex track with that gap.
  They are disabled under `prefers-reduced-motion: reduce` by globals.css.
- `cn()` helper: `import { cn } from "@/lib/utils"`. `lucide-react` is installed.
- Hard requirements for every component: Lighthouse accessibility 100 (WCAG AA contrast ≥ 4.5:1
  for text — do NOT fake muted text with low opacity on dark backgrounds; use explicit colors that
  pass), no layout shift, no main-thread jank, respects reduced motion, works without JS for content
  (links/text present in server HTML).
- NO new npm dependencies (do not install framer-motion / react-use-measure). CSS-only animation.

## You OWN (create only these)
- `src/components/ui/halftone-wordmark-footer.tsx`
- `src/components/ui/infinite-slider.tsx`
- `src/components/ui/testimonials-columns.tsx`

## DO NOT TOUCH
Everything else (`package.json`, `src/app/**`, `src/content/**`, `globals.css`, other components,
scripts, public). No `npm install`, no git, no `next build`. Verify with
`npx tsc --noEmit -p .` and `npx eslint <your files>`.

## 1. halftone-wordmark-footer.tsx
Port `notes/lanes/ref/halftone-wordmark-footer.tsx` (the client's chosen component) faithfully —
same visual idea and same physics/helpers — with these changes:
- Keep the exported helpers and props interface. Defaults become Turkish & on-brand:
  `wordmark="barış alaş"`, `label="Barış Alaş Kuaför Salonu"`, `meta="Çanakkale"`,
  `preset` adds a new preset `"kakao"`: `{ background: "#1b1612", ink: "#eadbcd", warm: "#c49a74" }`
  and make `"kakao"` the default. Default `fontFamily` = `"var(--font-inter-tight), 'Inter Tight', Arial, sans-serif"`
  — NOTE: canvas `ctx.font` cannot resolve CSS variables, so resolve the actual family at runtime
  via `getComputedStyle(document.documentElement).getPropertyValue("--font-inter-tight")` when the
  fontFamily string starts with `var(`; fall back to "Inter Tight, Arial, sans-serif".
  Default `monoFamily` → use the site sans: resolve `--font-inter` the same way (rename prop
  semantics stay; it's just the small-type face). Default `fontWeight` 800, `height` "520px",
  `dotGap` 6, `crop` 0.22.
- Back-to-top button text: "Başa dön ↑", `aria-label="Sayfanın başına dön"`; scroll smooth unless
  reduced motion (then instant).
- Small type: keep the tracked uppercase style but readable: font-size 11px, letter-spacing .14em.
  CONTRAST: replace every `opacity: .4/.45/.78` on text with explicit colors computed for AA on the
  background: titles/meta → `color-mix(in srgb, var(--hwf-ink) 72%, var(--hwf-bg))` is NOT
  guaranteed — instead pass explicit `muted` color: add palette key `muted` (kakao preset:
  `#b8a595` — verify ≥ 4.5:1 on #1b1612 and adjust if not) used for column titles and meta; links
  use full `ink` color. Hover: underline grow (keep).
- Column headings: use `<p>` (not `<h3>`) with `aria-hidden="false"`, and give each `<nav>` an
  `aria-label` = title — avoids heading-order audit failures inside the footer.
- Links: support `external?: boolean` on FooterLink → `target="_blank" rel="noopener noreferrer"`.
  Links with no href render as plain text `<span>` (not `href="#"`).
- Mobile: `.hwf-top` 2 columns under 720px (as original); on very small screens the wordmark band
  must still show — set root `min-height` so dots area is ≥ 160px below the link area. Consider
  height prop as minimum: use `min-height: height` and let content grow if links wrap.
- Performance: do NOT build the dot field on mount if the footer is far from the viewport. Use an
  IntersectionObserver with `rootMargin: "400px"` to run the first `layout()` lazily, then keep the
  original visible/awake sleeping logic. Debounce ResizeObserver relayout with rAF. Cap dots: if
  `count > 40000`, increase gap automatically. Coarse pointers (touch): no pointermove repulsion
  loop running continuously — tap ring only.
- Canvas `aria-hidden`, `role="presentation"`. Keep the `.hwf-sr` wordmark text.
- The `<style>` tag with scoped `.hwf-` CSS is fine (static string).

## 2. infinite-slider.tsx ("use client" NOT needed — pure CSS; make it a server-compatible component)
Same public API as the client's reference (motion-primitives InfiniteSlider) minus the JS:
```ts
type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;            // px, default 16
  duration?: number;       // seconds per loop, default 25
  durationOnHover?: number;// if set: pause on hover instead (CSS can't retime smoothly) — document this
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  fade?: boolean;          // edge fade mask, default true
  className?: string;
  ariaLabel?: string;      // region label
};
```
- Implementation: outer `div` overflow-hidden (+ mask-image linear-gradient edges when `fade`),
  inner track `flex w-max` with `gap`, `animate-marquee-x` (or `-y`, `flex-col h-max`), style vars
  `--marquee-duration`, `--marquee-gap`, `animation-direction: reverse` when `reverse`.
  Render children twice: second copy wrapped in a `<div aria-hidden="true" className="contents">`
  — careful: `display: contents` with aria-hidden is fine for a11y here; alternatively render two
  sibling groups each `flex shrink-0 gap-[…]` and make the track contain both groups.
  Choose the approach whose translate math (-50% - gap/2) loops seamlessly; verify by reasoning.
- Pause on hover/focus-within when `durationOnHover` is set: `hover:[animation-play-state:paused]`.

## 3. testimonials-columns.tsx
Reference look: client screenshot — 3 columns of white rounded cards that scroll vertically at
different speeds, fading out at top and bottom; quote text, a hairline, then avatar + name + service.
```ts
export type Testimonial = { quote: string; name: string; service: string; initials?: string };
type Props = { items: Testimonial[]; className?: string };
```
- Split items round-robin into 3 columns (1 column < 768px showing first column only…
  better: <md 1 column with all items, md 2 columns, lg 3 columns). Each column is an
  InfiniteSlider-like vertical marquee (reuse your `InfiniteSlider` with `direction="vertical"`),
  durations 38s / 46s / 42s, middle column `reverse`. Container height `h-[640px]` (md) /
  `h-[560px]` mobile, `overflow-hidden`, top/bottom mask fade.
- Card: `bg-fildisi border border-cizgi rounded-2xl p-7 shadow-[0_1px_0_rgba(27,22,18,0.04),0_12px_32px_-18px_rgba(27,22,18,0.25)]`,
  quote in `text-[1.05rem] leading-relaxed text-murekkep` wrapped in `<blockquote>` with curly quotes,
  `<hr className="my-6 border-cizgi">`, footer row: avatar circle 44px `bg-nude text-kakao font-display
  font-semibold` with initials (derive from name if not given; Turkish-aware uppercase via
  `toLocaleUpperCase("tr-TR")`), name `font-medium`, service `text-xs uppercase tracking-[0.14em] text-kakao`.
- Pause the column on hover. Under reduced motion: no animation, columns become normal stacked lists
  with max-height + `overflow-y-auto` (keyboard scrollable, `tabIndex={0}`, `role="region"`,
  `aria-label="Müşteri yorumları"`).
- Duplicated (aria-hidden) copies must not be focusable and must not duplicate text for screen readers.

## Acceptance
1. `npx tsc --noEmit -p .` — no errors in your files (list unrelated errors from other lanes, don't fix).
2. `npx eslint src/components/ui/halftone-wordmark-footer.tsx src/components/ui/infinite-slider.tsx src/components/ui/testimonials-columns.tsx` clean.
3. Compute and state the contrast ratios you chose for footer muted text on its background.

## Report
Short report: files, final exported APIs (exact), contrast numbers, decisions/trade-offs, what you
could not verify. Don't claim checks you didn't run.
