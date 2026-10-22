import { preload } from "react-dom";
import { images, type ImageId } from "@/content/images.generated";
import { cn } from "@/lib/utils";

type PictureProps = {
  id: ImageId;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  fill?: boolean;
};

function closestWidth(id: ImageId, target: number) {
  return [...images[id].widths].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
}

export function imageSrc(id: ImageId, width = 1080): string {
  return `/img/${images[id].file}-${closestWidth(id, width)}.webp`;
}

export function imageSrcSet(id: ImageId, format: "avif" | "webp"): string {
  return images[id].widths.map((width) => `/img/${images[id].file}-${width}.${format} ${width}w`).join(", ");
}

export default function Picture({
  id,
  alt,
  sizes,
  priority = false,
  className,
  imgClassName,
  fill = false,
}: PictureProps) {
  const image = images[id];
  const avifSet = imageSrcSet(id, "avif");
  const webpSet = imageSrcSet(id, "webp");
  const src = imageSrc(id);

  if (priority) {
    preload(`/img/${image.file}-${closestWidth(id, 1080)}.avif`, {
      as: "image",
      imageSrcSet: avifSet,
      imageSizes: sizes,
      fetchPriority: "high",
      type: "image/avif",
    });
  }

  return (
    <picture
      className={cn(fill && "absolute inset-0", className)}
      style={{
        backgroundImage: `url("${image.blur}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <source type="image/avif" srcSet={avifSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSet} sizes={sizes} />
      <img
        src={src}
        alt={alt ?? image.alt}
        width={image.width}
        height={image.height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={cn(fill && "h-full w-full object-cover", imgClassName)}
      />
    </picture>
  );
}
