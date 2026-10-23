"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Renders children except on the given routes (trailing slash ignored). */
export function HideOn({ paths, children }: { paths: string[]; children: ReactNode }) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  return paths.some((p) => (p.replace(/\/$/, "") || "/") === pathname) ? null : children;
}
