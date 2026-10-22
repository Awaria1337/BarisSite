"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// WCAG 2.2.2: anything that moves for more than 5 s needs a pause control.
// Toggles `data-paused` on the nearest [data-marquee] ancestor; globals.css
// pauses the marquee animations inside it.
export function MotionPause({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const [paused, setPaused] = useState(false);
  const Icon = paused ? Play : Pause;
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={(e) => {
        const next = !paused;
        e.currentTarget.closest("[data-marquee]")?.toggleAttribute("data-paused", next);
        setPaused(next);
      }}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
        tone === "light" ? "border-cizgi text-gri hover:text-murekkep" : "border-krem/20 text-krem/80 hover:text-krem",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {paused ? "Kaydırmayı başlat" : "Kaydırmayı durdur"}
    </button>
  );
}
