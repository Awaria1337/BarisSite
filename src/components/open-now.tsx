"use client";

import { useSyncExternalStore } from "react";
import { hours } from "@/content/site";

// Static HTML renders the weekly hours; after hydration the same single line is
// swapped for a live "open now" status in Istanbul time. One line either way,
// so there is no layout shift.

const fallback =
  hours.length === 7 && hours.every((h) => h.open === hours[0].open && h.close === hours[0].close)
    ? `Her gün ${hours[0].open}–${hours[0].close}`
    : "Çalışma saatlerimiz için İletişim sayfasına bakın";

function istanbulNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, time: `${get("hour")}:${get("minute")}` };
}

function status() {
  const { day, time } = istanbulNow();
  const today = hours.find((h) => h.day === day);
  if (today && time >= today.open && time < today.close) {
    return `Şu an açık · ${today.close}'a kadar`;
  }
  if (today && time < today.open) return `Bugün ${today.open}'da açılıyor`;
  const next = hours.find((h) => h.day === (day + 1) % 7);
  return next ? `Şu an kapalı · Yarın ${next.open}'da açılıyor` : "Şu an kapalı";
}

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};

export function OpenNow({ className, as: Tag = "p" }: { className?: string; as?: "p" | "span" }) {
  const text = useSyncExternalStore(subscribe, status, () => fallback);
  return <Tag className={className}>{text}</Tag>;
}
