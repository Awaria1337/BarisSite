import { Clock, MapPin } from "lucide-react";
import { address, directionsLink, hoursSummary } from "@/content/site";

/** Slim address + hours strip above the header (tablet and up). */
export function TopBar() {
  return (
    <div className="hidden bg-murekkep text-sm text-krem/80 md:block">
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href={directionsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-krem">
          <MapPin aria-hidden="true" className="size-4 text-karamel" />
          {address.street}, {address.landmark}, {address.city}
        </a>
        <p className="flex items-center gap-2">
          <Clock aria-hidden="true" className="size-4 text-karamel" />
          {hoursSummary}
        </p>
      </div>
    </div>
  );
}
