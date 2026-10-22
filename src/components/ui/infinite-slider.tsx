import * as React from "react"
import { cn } from "@/lib/utils"

export type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  duration?: number
  /** When set, pauses on hover/focus; CSS cannot smoothly retime an active loop. */
  durationOnHover?: number
  direction?: "horizontal" | "vertical"
  reverse?: boolean
  fade?: boolean
  className?: string
  ariaLabel?: string
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  fade = true,
  className,
  ariaLabel,
}: InfiniteSliderProps) {
  const vertical = direction === "vertical"
  const mask = fade
    ? vertical
      ? "[mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
      : "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    : ""

  return (
    <div
      className={cn("overflow-hidden", mask, durationOnHover != null && "hover:[&_.infinite-slider-track]:[animation-play-state:paused] focus-within:[&_.infinite-slider-track]:[animation-play-state:paused]", className)}
      aria-label={ariaLabel}
      role={ariaLabel ? "region" : undefined}
    >
      <div
        className={cn(
          "infinite-slider-track flex w-max animate-marquee-x",
          vertical && "h-max w-full flex-col animate-marquee-y",
        )}
        style={{
          gap,
          "--marquee-gap": `${gap}px`,
          "--marquee-duration": `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        } as React.CSSProperties}
      >
        <div className={cn("flex shrink-0", vertical && "h-max w-full flex-col")} style={{ gap }}>
          {children}
        </div>
        <div aria-hidden="true" className={cn("flex shrink-0", vertical && "h-max w-full flex-col")} style={{ gap }}>
          {children}
        </div>
      </div>
    </div>
  )
}
