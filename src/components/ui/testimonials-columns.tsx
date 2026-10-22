import * as React from "react"
import { cn } from "@/lib/utils"
import { InfiniteSlider } from "@/components/ui/infinite-slider"

export type Testimonial = { quote: string; name: string; service: string; initials?: string }
type Props = { items: Testimonial[]; className?: string }

const DURATIONS = [38, 46, 42]

function getInitials(item: Testimonial) {
  if (item.initials) return item.initials.toLocaleUpperCase("tr-TR")
  return item.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? "")
    .join("")
    .toLocaleUpperCase("tr-TR")
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="w-full rounded-2xl border border-cizgi bg-fildisi p-7 shadow-[0_1px_0_rgba(27,22,18,0.04),0_12px_32px_-18px_rgba(27,22,18,0.25)]">
      <blockquote className="text-[1.05rem] leading-relaxed text-murekkep">“{item.quote}”</blockquote>
      <hr className="my-6 border-cizgi" />
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-nude font-display font-semibold text-kakao">
          {getInitials(item)}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-murekkep">{item.name}</p>
          <p className="text-xs uppercase tracking-[0.14em] text-kakao">{item.service}</p>
        </div>
      </div>
    </article>
  )
}

function splitRoundRobin(items: Testimonial[], count = 3) {
  return items.reduce<Testimonial[][]>((columns, item, index) => {
    columns[index % count].push(item)
    return columns
  }, Array.from({ length: count }, () => []))
}

function TestimonialColumn({ items, index }: { items: Testimonial[]; index: number }) {
  return (
    <div className="min-h-0 overflow-hidden">
      <InfiniteSlider
        direction="vertical"
        duration={DURATIONS[index]}
        reverse={index === 1}
        gap={20}
        durationOnHover={DURATIONS[index]}
        fade={false}
        className="h-full"
      >
        <div className="flex w-full flex-col gap-5 px-1 py-2">
          {items.map((item, itemIndex) => <TestimonialCard key={`${item.name}-${itemIndex}`} item={item} />)}
        </div>
      </InfiniteSlider>
    </div>
  )
}

export function TestimonialsColumns({ items, className }: Props) {
  const tabletColumns = splitRoundRobin(items, 2)
  const wideColumns = splitRoundRobin(items, 3)
  return (
    <div
      className={cn(
        "testimonials-columns relative h-[560px] overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)] md:h-[640px] md:overflow-hidden",
        className,
      )}
      role="region"
      aria-label="Müşteri yorumları"
      tabIndex={0}
    >
      <div className="flex flex-col gap-5 px-1 py-2 md:hidden">
        {items.map((item, itemIndex) => <TestimonialCard key={`mobile-${item.name}-${itemIndex}`} item={item} />)}
      </div>
      <div className="desktop-columns hidden h-full grid-cols-2 gap-5 md:grid lg:hidden">
        {tabletColumns.map((column, index) => <TestimonialColumn key={`md-${index}`} items={column} index={index} />)}
      </div>
      <div className="desktop-columns hidden h-full grid-cols-3 gap-5 lg:grid">
        {wideColumns.map((column, index) => <TestimonialColumn key={`lg-${index}`} items={column} index={index} />)}
      </div>
    </div>
  )
}
