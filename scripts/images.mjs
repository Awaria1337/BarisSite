import { readdir, readFile, mkdir, stat, unlink, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const stockDir = path.join(root, "assets/stock");
const photosDir = path.join(root, "assets/photos");
const outputDir = path.join(root, "public/img");
const manifestPath = path.join(root, "src/content/images.generated.ts");
const widths = [480, 768, 1080, 1440, 1920];
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function slugify(value) {
  return value
    .toLowerCase()
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function filesIn(directory) {
  try {
    return (await readdir(directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => path.join(directory, entry.name));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function sourceMap() {
  const sources = new Map();
  for (const [directory, source] of [[stockDir, "stock"], [photosDir, "photo"]]) {
    for (const file of await filesIn(directory)) {
      const basename = path.basename(file, path.extname(file));
      const id = slugify(basename);
      if (!id) throw new Error(`Could not derive an image id from ${file}`);
      sources.set(id, { file, basename, source });
    }
  }
  return sources;
}

async function orientedDimensions(file) {
  const metadata = await sharp(file).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Missing dimensions for ${file}`);
  const swapsAxes = [5, 6, 7, 8].includes(metadata.orientation ?? 0);
  return {
    width: swapsAxes ? metadata.height : metadata.width,
    height: swapsAxes ? metadata.width : metadata.height,
  };
}

async function fileExists(file) {
  try {
    await stat(file);
    return true;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return false;
    throw error;
  }
}

async function writeVariant(file, output, width, format) {
  let pipeline = sharp(file).rotate().resize({ width, withoutEnlargement: true });
  pipeline = format === "avif"
    ? pipeline.avif({ quality: 52, effort: 4 })
    : pipeline.webp({ quality: 74 });
  await pipeline.toFile(output);
  return true;
}

async function buildImage(id, item, credits, photoAlts) {
  const hash = createHash("sha256").update(await readFile(item.file)).digest("hex").slice(0, 10);
  const file = `${id}.${hash}`;
  const dimensions = await orientedDimensions(item.file);
  const variantWidths = widths.filter((width) => width <= dimensions.width);
  if (dimensions.width < 480) variantWidths.push(dimensions.width);
  const uniqueWidths = [...new Set(variantWidths)].sort((a, b) => a - b);

  const outputs = uniqueWidths.flatMap((width) => ["avif", "webp"].map((format) =>
    path.join(outputDir, `${file}-${width}.${format}`),
  ));
  if (!(await Promise.all(outputs.map(fileExists))).every(Boolean)) {
    for (const width of uniqueWidths) {
      for (const format of ["avif", "webp"]) {
        const output = path.join(outputDir, `${file}-${width}.${format}`);
        if (!(await fileExists(output))) await writeVariant(item.file, output, width, format);
      }
    }
  }

  const blur = await sharp(item.file)
    .rotate()
    .resize({ width: 16, withoutEnlargement: true })
    .webp({ quality: 40 })
    .toBuffer();
  const alt = item.source === "photo"
    ? (photoAlts[item.basename] ?? photoAlts[`${item.basename}${path.extname(item.file)}`] ?? "")
    : (credits.find((entry) => entry.file === path.basename(item.file))?.alt_tr ?? "");
  const credit = item.source === "stock"
    ? credits.find((entry) => entry.file === path.basename(item.file))
    : undefined;

  return {
    file,
    width: dimensions.width,
    height: dimensions.height,
    widths: uniqueWidths,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
    alt,
    source: item.source,
    ...(item.source === "stock" && credit
      ? { credit: { photographer: credit.photographer ?? "", url: credit.photographerUrl ?? credit.pageUrl ?? "" } }
      : {}),
  };
}

async function runPool(entries, concurrency, worker) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, async () => {
    while (next < entries.length) {
      const index = next++;
      await worker(...entries[index]);
    }
  }));
}

async function main() {
  const [sources, credits, photoAlts] = await Promise.all([
    sourceMap(),
    readJson(path.join(stockDir, "credits.json"), []),
    readJson(path.join(photosDir, "alt.json"), {}),
  ]);
  await mkdir(outputDir, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });

  const entries = [...sources.entries()].sort(([left], [right]) => left.localeCompare(right));
  const result = {};
  let failed = 0;
  await runPool(entries, 4, async (id, item) => {
    try {
      result[id] = await buildImage(id, item, credits, photoAlts);
      console.log(`${id}: processed (${item.source})`);
    } catch (error) {
      failed++;
      console.error(`${id}: failed`, error);
      throw error;
    }
  });

  const expectedOutputs = new Set(Object.values(result).flatMap((image) =>
    image.widths.flatMap((width) => ["avif", "webp"].map((format) => `${image.file}-${width}.${format}`)),
  ));
  const oldOutputs = await readdir(outputDir, { withFileTypes: true });
  let removed = 0;
  for (const entry of oldOutputs) {
    if (!entry.isFile() || expectedOutputs.has(entry.name)) continue;
    await unlink(path.join(outputDir, entry.name));
    removed++;
  }

  const lines = [
    "// GENERATED by scripts/images.mjs — do not edit by hand.",
    "export const images = {",
    ...Object.keys(result).sort().map((id) => `  ${JSON.stringify(id)}: ${JSON.stringify(result[id])},`),
    "} as const;",
    "export type ImageId = keyof typeof images;",
    "",
  ];
  await writeFile(manifestPath, lines.join("\n"));
  console.log(`Images: ${entries.length} processed, ${removed} stale files removed, ${failed} failed.`);
}

main().catch((error) => {
  console.error("Image generation failed:", error);
  process.exitCode = 1;
});
