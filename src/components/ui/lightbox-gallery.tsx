"use client";

import { startTransition, useEffect, useMemo, useRef, useState, ViewTransition } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Picture from "@/components/picture";
import { images, type ImageId } from "@/content/images.generated";
import { cn } from "@/lib/utils";

type GalleryItem = { id: ImageId; alt?: string; category: string };
type Props = { items: GalleryItem[]; categories?: string[]; className?: string; columns?: "2-3" | "2-4" };

export default function LightboxGallery({
  items,
  categories,
  className,
  columns = "2-3",
}: Props) {
  const [category, setCategory] = useState("Tümü");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const activePointers = useRef(new Set<number>());
  const visibleItems = useMemo(
    () => category === "Tümü" ? items : items.filter((item) => item.category === category),
    [category, items],
  );
  const selected = selectedIndex === null ? null : visibleItems[selectedIndex] ?? null;
  const isOpen = selected !== null;
  const categoryOptions = categories ? ["Tümü", ...categories.filter((name) => name !== "Tümü")] : [];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousScrollbarGutter = root.style.scrollbarGutter;
    if (isOpen && !dialog.open) {
      root.style.overflow = "hidden";
      root.style.scrollbarGutter = "stable";
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
    return () => {
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousScrollbarGutter;
    };
  }, [isOpen]);

  function openAt(index: number, button: HTMLButtonElement) {
    openerRef.current = button;
    startTransition(() => setSelectedIndex(index));
  }

  function close() {
    if (dialogRef.current?.open) dialogRef.current.close();
    startTransition(() => setSelectedIndex(null));
    requestAnimationFrame(() => openerRef.current?.focus());
  }

  function navigate(direction: -1 | 1) {
    if (!visibleItems.length) return;
    startTransition(() => {
      setSelectedIndex((current) => current === null
        ? null
        : (current + direction + visibleItems.length) % visibleItems.length);
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    activePointers.current.delete(event.pointerId);
    touchStartX.current = null;
    if (startX === null || activePointers.current.size > 0) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) >= 50) navigate(distance > 0 ? -1 : 1);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    activePointers.current.add(event.pointerId);
    touchStartX.current = activePointers.current.size === 1 && event.pointerType === "touch"
      ? event.clientX
      : null;
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    activePointers.current.delete(event.pointerId);
    touchStartX.current = null;
  }

  return (
    <div className={className}>
      {categories && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categoryOptions.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                category === name
                  ? "border-murekkep bg-murekkep text-krem"
                  : "border-cizgi bg-fildisi text-murekkep hover:bg-nude",
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className={cn("columns-2 gap-3 md:gap-4", columns === "2-4" ? "lg:columns-4" : "md:columns-3")}>
        {visibleItems.map((item, index) => {
          const alt = item.alt ?? images[item.id].alt;
          return (
            <button
              key={`${item.id}-${index}`}
              type="button"
              aria-label={`${alt || "Görsel"} — büyüt`}
              onClick={(event) => openAt(index, event.currentTarget)}
              className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl text-left md:mb-4"
            >
              <Picture
                id={item.id}
                alt={alt}
                priority={index < 2}
                sizes={columns === "2-4" ? "(min-width: 1024px) 25vw, 50vw" : "(min-width: 768px) 33vw, 50vw"}
                className="block w-full overflow-hidden rounded-xl"
                imgClassName="block h-auto w-full transition-transform duration-500 ease-out motion-reduce:transition-none hover:scale-[1.03]"
              />
            </button>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Fotoğraf görüntüleyici"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="fixed inset-0 m-0 h-dvh w-screen max-w-none border-0 bg-transparent p-0 text-krem backdrop:bg-murekkep/95 [&:not([open])]:hidden"
      >
        {selected && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-murekkep/95 p-4 md:p-8">
            <div className="mb-4 flex w-full max-w-6xl items-center justify-between">
              <p className="text-sm tabular-nums text-krem/80" aria-live="polite">
                {selectedIndex! + 1} / {visibleItems.length}
              </p>
              <button type="button" onClick={close} aria-label="Kapat" className="rounded-full p-3 hover:bg-krem/10">
                <X aria-hidden="true" />
              </button>
            </div>

            <div
              className="flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center gap-2"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              style={{ touchAction: "pan-y pinch-zoom" }}
            >
              <button type="button" onClick={() => navigate(-1)} aria-label="Önceki" className="shrink-0 rounded-full p-3 hover:bg-krem/10">
                <ChevronLeft aria-hidden="true" />
              </button>
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <ViewTransition>
                  <Picture
                    key={selected.id}
                    id={selected.id}
                    alt={selected.alt ?? images[selected.id].alt}
                    sizes="100vw"
                    className="flex max-h-[85vh] max-w-full items-center justify-center [&_img]:max-h-[85vh] [&_img]:max-w-full [&_img]:object-contain"
                    imgClassName="h-auto w-auto object-contain"
                  />
                </ViewTransition>
              </div>
              <button type="button" onClick={() => navigate(1)} aria-label="Sonraki" className="shrink-0 rounded-full p-3 hover:bg-krem/10">
                <ChevronRight aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 max-w-4xl text-center text-sm text-krem/90">
              {selected.alt ?? images[selected.id].alt}
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}
