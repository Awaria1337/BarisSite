"use client"

// Adapted from the client-chosen 21st.dev component (original kept in
// notes/lanes/ref/); changes are listed in notes/lanes/L2-ui.md.

// Halftone Wordmark Footer — a site footer whose wordmark is set enormous and
// cropped by the bottom edge, printed as a field of halftone dots. Each dot is
// sized by how much of the letter covers its cell, so the type keeps its edges
// at any scale. Move across it and the dots part around the pointer on springs,
// warming in colour as they are pushed off their place; click and a shock ring
// runs through the word. Above it sit the studio line, tracked link columns and
// a back-to-top, separated by a hairline, all over a fine print grain.

import * as React from "react"

export interface HalftonePalette {
  background: string
  ink: string
  warm: string
  muted: string
}

export type HalftonePreset = "night" | "paper" | "ember" | "cobalt" | "kakao"

export interface FooterLink {
  label: string
  href?: string
  external?: boolean
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface HalftoneWordmarkFooterProps {
  wordmark?: string
  label?: string
  meta?: string
  columns?: FooterColumn[]
  backToTop?: boolean
  preset?: HalftonePreset
  palette?: { background?: string; ink?: string; warm?: string; muted?: string }
  dotGap?: number
  radius?: number
  crop?: number
  grain?: number
  interactive?: boolean
  fontFamily?: string
  fontWeight?: number
  monoFamily?: string
  height?: string
  className?: string
}

const PRESETS: { [K in HalftonePreset]: HalftonePalette } = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b", muted: "#bdb8ae" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c", muted: "#625d55" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f", muted: "#c5a98b" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c", muted: "#aab7dc" },
  kakao: { background: "#1b1612", ink: "#eadbcd", warm: "#c49a74", muted: "#b8a595" },
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Work", links: [{ label: "Index" }, { label: "Archive" }, { label: "Journal" }] },
  { title: "Studio", links: [{ label: "About" }, { label: "Process" }, { label: "Careers" }] },
  { title: "Contact", links: [{ label: "hello@halden.co" }, { label: "+47 22 00 41 00" }] },
]

const SANS_STACK = "var(--font-inter-tight), 'Inter Tight', Arial, sans-serif"
const MONO_STACK = "var(--font-inter-tight), 'Inter Tight', system-ui, sans-serif"

export function hwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function hwfRadius(coverage: number, gap: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage
  return Math.sqrt(c) * gap * 0.56
}

export function hwfStep(
  x: number, y: number, vx: number, vy: number,
  hx: number, hy: number, px: number, py: number, r: number,
) {
  const dx = x - px
  const dy = y - py
  const d2 = dx * dx + dy * dy
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001
    const f = (1 - d / r) * 2.6
    vx += (dx / d) * f
    vy += (dy / d) * f
  }
  vx = (vx + (hx - x) * 0.05) * 0.84
  vy = (vy + (hy - y) * 0.05) * 0.84
  return [x + vx, y + vy, vx, vy]
}

export function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number) {
  const d = Math.hypot(x - hx, y - hy)
  return span > 0 ? Math.min(1, d / span) : 0
}

export function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0
}

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
}
.hwf-root canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; }
.hwf-top {
  position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.25fr) repeat(3, minmax(0, 1fr));
  gap: 24px; padding: clamp(22px, 3.4vw, 40px) clamp(20px, 3.4vw, 44px) 0;
  font-family: var(--hwf-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; line-height: 1.75;
}
.hwf-brand strong { display: block; font-weight: 500; }
.hwf-brand span { color: var(--hwf-muted); }
.hwf-col p { margin: 0; font: inherit; color: var(--hwf-muted); font-weight: 500; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; }
/* WCAG 2.5.8: every link/button gets at least a 24px-tall hit area. */
.hwf-col a, .hwf-col li > span, .hwf-up { display: inline-flex; align-items: center; min-height: 26px; }
.hwf-col a, .hwf-up {
  color: var(--hwf-ink); text-decoration: none; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: background-size .35s cubic-bezier(.2,.7,.1,1);
}
.hwf-col a:hover, .hwf-up:hover { background-size: 100% 1px; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
.hwf-rule {
  position: relative; z-index: 1; display: flex; justify-content: flex-end; align-items: center; gap: 16px;
  margin: clamp(18px, 2.6vw, 30px) clamp(20px, 3.4vw, 44px) 0; padding-top: 12px;
  border-top: 0.5px solid color-mix(in srgb, var(--hwf-ink) 16%, transparent);
  font-family: var(--hwf-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
}
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.hwf-bottom-space { height: 160px; }
@media (max-width: 720px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 18px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`

export default function HalftoneWordmarkFooter({
  wordmark = "barış alaş",
  label = "Barış Alaş Kuaför Salonu",
  meta = "Çanakkale",
  columns = DEFAULT_COLUMNS,
  backToTop = true,
  preset = "kakao",
  palette,
  dotGap = 6,
  radius = 80,
  crop = 0.22,
  grain = 0.5,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 800,
  monoFamily = MONO_STACK,
  height = "520px",
  className = "",
}: HalftoneWordmarkFooterProps) {
  const colors = React.useMemo(() => ({ ...(PRESETS[preset] || PRESETS.night), ...(palette || {}) }), [preset, palette])
  const rootRef = React.useRef(null as HTMLElement | null)
  const canvasRef = React.useRef(null as HTMLCanvasElement | null)
  const opts = React.useRef({ colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, monoFamily, wordmark })
  React.useEffect(() => {
    opts.current = { colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, monoFamily, wordmark }
  }, [colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, monoFamily, wordmark])
  const key = [wordmark, dotGap, crop, grain, fontFamily, fontWeight, colors.background, colors.ink, colors.warm, colors.muted].join("|")

  React.useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0
    let h = 0
    let dpr = 1
    let px = -1e5
    let py = -1e5
    let raf = 0
    let visible = false
    let awake = true
    let ring = { x: 0, y: 0, t: -1 }
    let dots = new Float32Array(0)
    let count = 0
    let grainTile = null as HTMLCanvasElement | null
    let grainPattern = null as CanvasPattern | null
    const ink = hwfHex(opts.current.colors.ink) || [233, 228, 218]
    const warm = hwfHex(opts.current.colors.warm) || [233, 118, 43]
    let laidOut = false
    let resizeRaf = 0
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches

    const layout = () => {
      const o = opts.current
      const rect = root.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      const mask = document.createElement("canvas")
      mask.width = w
      mask.height = h
      const m = mask.getContext("2d", { willReadFrequently: true })
      if (!m) return
      const resolveFamily = (family: string, token: string, fallback: string) => {
        if (!family.startsWith("var(")) return family
        return getComputedStyle(document.documentElement).getPropertyValue(token).trim() || fallback
      }
      const faceFamily = resolveFamily(o.fontFamily, "--font-inter-tight", "Inter Tight, Arial, sans-serif")
      root.style.setProperty("--hwf-mono", resolveFamily(o.monoFamily, "--font-inter-tight", "Inter Tight, system-ui, sans-serif"))
      const face = o.fontWeight + " 100px " + faceFamily
      m.font = face
      const word = o.wordmark || " "
      const fit = hwfFitSize(m.measureText(word).width, w * 1.02)
      m.font = o.fontWeight + " " + fit + "px " + faceFamily
      const box = m.measureText(word)
      const cap = box.actualBoundingBoxAscent || fit * 0.72
      // Negative crop lifts the baseline so descenders (ş, ç cedillas) stay visible.
      const c = Math.max(-0.4, Math.min(0.6, o.crop))
      m.fillStyle = "#000"
      m.textBaseline = "alphabetic"
      m.fillText(word, (w - box.width) / 2, h + cap * c)
      const img = m.getImageData(0, 0, w, h).data

      let gap = Math.max(3, o.dotGap)
      while (Math.ceil(w / gap) * Math.ceil(h / gap) > 40000) gap *= 1.01
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      const tmp = []
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3))
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3))
              sum += img[(y * w + x) * 4 + 3]
            }
          }
          const cov = sum / (9 * 255)
          if (cov < 0.06) continue
          const hx = gx * gap + gap / 2
          const hy = gy * gap + gap / 2
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap))
        }
      }
      dots = new Float32Array(tmp)
      count = tmp.length / 7
      laidOut = true

      grainTile = document.createElement("canvas")
      grainPattern = null
      grainTile.width = 256
      grainTile.height = 256
      const g = grainTile.getContext("2d")
      if (g) {
        const id = g.createImageData(256, 256)
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        g.putImageData(id, 0, 0)
      }
      awake = true
    }

    const draw = (now: number) => {
      const o = opts.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = o.colors.background
      ctx.fillRect(0, 0, w, h)

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t
      const ringR = ringAge * 0.9
      let moving = false
      const pointerAway = px < -1e4
      for (let i = 0; i < count; i++) {
        const j = i * 7
        let x = dots[j]
        let y = dots[j + 1]
        let vx = dots[j + 2]
        let vy = dots[j + 3]
        const hx = dots[j + 4]
        const hy = dots[j + 5]
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x
            const dy = hy - ring.y
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26)
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900)
              vx += (dx / d) * f
              vy += (dy / d) * f
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r)
          x = s[0]
          y = s[1]
          vx = s[2]
          vy = s[3]
          const speed = Math.abs(vx) + Math.abs(vy)
          const offset = Math.abs(x - hx) + Math.abs(y - hy)
          // Keep animating while dots move, or while they spring home after the pointer left.
          // A resting pointer holds dots displaced but still, so the loop can sleep.
          if (speed > 0.02 || (offset > 0.05 && pointerAway)) moving = true
          if (speed <= 0.02 && offset <= 0.05) {
            x = hx
            y = hy
            vx = 0
            vy = 0
          }
          dots[j] = x
          dots[j + 1] = y
          dots[j + 2] = vx
          dots[j + 3] = vy
        }
        const k = hwfWarmth(x, y, hx, hy, 28)
        ctx.fillStyle =
          k > 0.02
            ? "rgb(" +
              Math.round(ink[0] + (warm[0] - ink[0]) * k) + "," +
              Math.round(ink[1] + (warm[1] - ink[1]) * k) + "," +
              Math.round(ink[2] + (warm[2] - ink[2]) * k) + ")"
            : o.colors.ink
        ctx.beginPath()
        ctx.arc(x, y, dots[j + 6], 0, 6.2832)
        ctx.fill()
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.09
        ctx.globalCompositeOperation = "overlay"
        grainPattern ??= ctx.createPattern(grainTile, "repeat")
        const pattern = grainPattern
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, w, h)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"
      }
      awake = moving || ringAge < 900
    }

    const loop = (now: number) => {
      raf = 0
      if (!visible) return
      draw(now)
      if (awake) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      awake = true
      if (!raf && visible) raf = requestAnimationFrame(loop)
    }

    const toLocal = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect()
      return [e.clientX - b.left, e.clientY - b.top]
    }
    const onMove = (e: PointerEvent) => {
      if (!opts.current.interactive || coarsePointer || reduced) return
      const p = toLocal(e)
      px = p[0]
      py = p[1]
      wake()
    }
    const onLeave = () => {
      px = -1e5
      py = -1e5
      wake()
    }
    const onDown = (e: PointerEvent) => {
      // Mouse clicks only: on touch, pointerdown starts every scroll gesture.
      if (!opts.current.interactive || reduced || e.pointerType !== "mouse") return
      if ((e.target as HTMLElement).closest("a,button")) return
      const p = toLocal(e)
      ring = { x: p[0], y: p[1], t: performance.now() }
      wake()
    }

    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerleave", onLeave)
    root.addEventListener("pointerdown", onDown)
    const ro = new ResizeObserver(() => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        if (!visible) return
        layout()
        wake()
      })
    })
    ro.observe(root)
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true
      if (visible) {
        layout()
        draw(performance.now())
        wake()
      }
    }, { rootMargin: "400px" })
    io.observe(root)
    let alive = true
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return
        if (laidOut) layout()
        wake()
      })
    }

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeRaf)
      ro.disconnect()
      io.disconnect()
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
      root.removeEventListener("pointerdown", onDown)
    }
  }, [key])

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" })
  }

  return (
    <footer
      ref={rootRef}
      className={"hwf-root " + className}
      style={
        {
          minHeight: height,
          "--hwf-bg": colors.background,
          "--hwf-ink": colors.ink,
          "--hwf-muted": colors.muted,
          "--hwf-mono": monoFamily,
        } as React.CSSProperties
      }
    >
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" role="presentation" />
      <span className="hwf-sr">{wordmark}</span>
      <div className="hwf-top">
        <div className="hwf-brand">
          <strong>{label}</strong>
          <span>{meta}</span>
        </div>
        {columns.map((col) => (
          <nav className="hwf-col" key={col.title} aria-label={col.title}>
            <p aria-hidden="false">{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined}>{l.label}</a>
                  ) : <span>{l.label}</span>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="hwf-bottom-space" aria-hidden="true" />
      <div className="hwf-rule">
        {backToTop ? (
          <button type="button" className="hwf-up" onClick={toTop}>
            Başa dön ↑
          </button>
        ) : null}
      </div>
    </footer>
  )
}
