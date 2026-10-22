"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// Scroll-snap slider: native swipe on touch, buttons + dots, gentle autoplay.
// Slides are server-rendered children (pictures), so the first one can be the
// LCP image and nothing shifts when JS arrives. Autoplay stops on hover/focus,
// under reduced motion, and via an explicit pause control (WCAG 2.2.2).
export function ImageSlider({
  children,
  label,
  interval = 5000,
  className,
}: {
  children: ReactNode;
  label: string;
  interval?: number;
  className?: string;
}) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = (i + slides.length) % slides.length;
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    },
    [slides.length],
  );

  // Track the visible slide from scroll position (works for swipe too).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || hovering || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => goTo(index + 1), interval);
    return () => window.clearInterval(id);
  }, [paused, hovering, index, interval, goTo, slides.length]);

  return (
    <div
      role="region"
      aria-roledescription="slayt gösterisi"
      aria-label={label}
      className={cn("group relative overflow-hidden", className)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div
        ref={trackRef}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slayt"
            aria-label={`${i + 1} / ${slides.length}`}
            className="relative h-full w-full shrink-0 snap-start"
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-murekkep/55 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 sm:inset-x-6 sm:bottom-6">
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${i + 1}. fotoğrafa git`}
                  aria-current={i === index ? "true" : undefined}
                  className="grid size-6 place-items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full bg-krem transition-[width,opacity] duration-300",
                      i === index ? "w-6 opacity-100" : "w-1.5 opacity-60",
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Slaytları başlat" : "Slaytları durdur"}
                className="grid size-10 place-items-center rounded-full bg-krem/90 text-murekkep backdrop-blur transition-colors hover:bg-krem"
              >
                {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Önceki fotoğraf"
                className="grid size-10 place-items-center rounded-full bg-krem/90 text-murekkep backdrop-blur transition-colors hover:bg-krem"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Sonraki fotoğraf"
                className="grid size-10 place-items-center rounded-full bg-krem/90 text-murekkep backdrop-blur transition-colors hover:bg-krem"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
