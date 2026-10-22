import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
const REPO = path.resolve(ROOT, "..");
const launch = process.argv.includes("--launch");
const failures = [];
const warnings = [];
const pages = [];
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(1).find((v) => v !== undefined) ?? null;
const textContent = (s) => s.replace(/<[^>]*>/g, " ").replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, " ").replace(/\s+/g, " ").trim();
const fail = (page, msg) => failures.push({ page, message: msg });
const warn = (page, msg) => warnings.push({ page, message: msg });
const cleanUrl = (s) => s.split(/[?#]/, 1)[0];
function validXml(xml) {
  const source = xml.replace(/<!--[\s\S]*?-->|<\?[\s\S]*?\?>/g, "");
  const tagPattern = /<\/?[A-Za-z_][\w:.-]*(?:\s+[^<>]*?)?\s*\/?>/g;
  const stack = [];
  let cursor = 0;
  let roots = 0;
  for (const match of source.matchAll(tagPattern)) {
    const text = source.slice(cursor, match.index);
    if ((text.includes("<") || text.includes(">") || /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);)/i.test(text)) || (!stack.length && text.trim())) return false;
    const token = match[0];
    const name = token.match(/^<\/?([\w:.-]+)/)?.[1];
    if (token.startsWith("</")) {
      if (stack.pop() !== name) return false;
    } else {
      if (!stack.length) roots++;
      if (!/\/\s*>$/.test(token)) stack.push(name);
    }
    cursor = match.index + token.length;
  }
  const tail = source.slice(cursor);
  return !tail.includes("<") && !tail.includes(">") && !stack.length && roots === 1 && !tail.trim();
}

if (!statSync(ROOT, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`Missing static export directory: ${ROOT}`);
  process.exit(1);
}
const htmlFiles = walk(ROOT).filter((f) => /(?:^|[/\\])index\.html$/.test(f) || f === path.join(ROOT, "404.html"));
const pageRoutes = new Set();
for (const file of htmlFiles) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const route = rel === "404.html" ? "/404.html" : `/${rel === "index.html" ? "" : rel.replace(/index\.html$/, "")}`;
  const html = readFileSync(file, "utf8");
  // noindex pages (404, _not-found) are not search-facing: skip SEO meta checks and sitemap membership.
  const noindex = /<meta\b[^>]*name\s*=\s*["']robots["'][^>]*content\s*=\s*["'][^"']*noindex/i.test(html);
  if (!noindex) pageRoutes.add(route);
  pages.push({ file, rel, route, html, noindex });
}
const seenTitles = new Map();
const seenDescriptions = new Map();
const diskPath = (urlPath, base) => {
  let pathname;
  try { pathname = decodeURIComponent(urlPath); } catch { return null; }
  if (pathname.includes("\\") || pathname.split("/").includes("..")) return null;
  const target = path.resolve(pathname.startsWith("/") ? ROOT : base, pathname.replace(/^\/+/, ""));
  if (target !== ROOT && !target.startsWith(`${ROOT}${path.sep}`)) return null;
  const options = [target, path.join(target, "index.html")];
  if (path.extname(target)) return options[0];
  return options.find((p) => statSync(p, { throwIfNoEntry: false })?.isFile()) || options[1];
};

for (const page of pages) {
  const { html, route } = page;
  const label = route;
  if (!/<html\b[^>]*\blang\s*=\s*(?:"tr"|'tr'|tr(?:\s|>))/i.test(html)) fail(label, 'html lang must be "tr"');
  const headings = [...html.matchAll(/<h1\b/gi)];
  if (headings.length !== 1) fail(label, `expected exactly one h1, found ${headings.length}`);
  if (page.noindex) continue;
  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1];
  const title = titleTag ? textContent(titleTag) : "";
  if (!title) fail(label, "non-empty title is required");
  else {
    if (title.length > 70) fail(label, `title is ${title.length} chars (maximum 70)`);
    else if (title.length > 65) warn(label, `title is ${title.length} chars (recommended maximum 65)`);
    if (seenTitles.has(title)) fail(label, `duplicate title also used by ${seenTitles.get(title)}`); else seenTitles.set(title, label);
  }
  const description = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]).find((tag) => attr(tag, "name")?.toLowerCase() === "description");
  const desc = description ? attr(description, "content")?.trim() || "" : "";
  if (!desc || desc.length < 70 || desc.length > 170) fail(label, `description length must be 70–170 chars (found ${desc.length})`);
  else if (desc.length < 110 || desc.length > 160) warn(label, `description is ${desc.length} chars (recommended 110–160)`);
  if (desc) { if (seenDescriptions.has(desc)) fail(label, `duplicate description also used by ${seenDescriptions.get(desc)}`); else seenDescriptions.set(desc, label); }
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const og = (key) => metaTags.some((tag) => attr(tag, "property")?.toLowerCase() === `og:${key}` && attr(tag, "content")?.trim());
  for (const key of ["title", "description", "url", "image"]) if (!og(key)) fail(label, `missing og:${key}`);
  const viewport = metaTags.find((tag) => attr(tag, "name")?.toLowerCase() === "viewport");
  if (!viewport) fail(label, "missing viewport meta");
  else if (/maximum-scale|user-scalable\s*=\s*no/i.test(attr(viewport, "content") || "")) fail(label, "viewport must not disable zoom");
  const is404 = page.rel === "404.html" || route === "/404/";
  if (!is404) {
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).find((tag) => (attr(tag, "rel") || "").toLowerCase().split(/\s+/).includes("canonical"));
    const canonicalUrl = canonical ? attr(canonical, "href") : null;
    let canonicalParsed;
    try { canonicalParsed = canonicalUrl ? new URL(canonicalUrl) : null; } catch { canonicalParsed = null; }
    if (!canonicalParsed || canonicalParsed.protocol !== "https:" || !canonicalParsed.pathname.endsWith("/") || canonicalParsed.pathname !== route) fail(label, `canonical must be an absolute HTTPS URL ending in / for route ${route}`);
  }

  const tokens = [...html.matchAll(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>/gi)].map((m) => m[0]);
  const stack = [];
  const voids = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  const mainHeadings = [];
  for (const tag of tokens) {
    if (tag.startsWith("<!--")) continue;
    const closing = /^<\//.test(tag);
    const name = tag.match(/^<\/?([\w-]+)/)?.[1]?.toLowerCase();
    if (!name) continue;
    if (closing) {
      const index = stack.map((x) => x.name).lastIndexOf(name);
      if (index >= 0) stack.splice(index);
      continue;
    }
    if (name === "img") {
      if (attr(tag, "alt") === null) fail(label, "img is missing alt attribute");
      // alt="" is the standard way to mark a decorative image (WCAG H67), so it is allowed.
      if (attr(tag, "width") === null || attr(tag, "height") === null) warn(label, "img lacks width and height attributes");
    }
    if (name === "script" && (attr(tag, "type") || "").toLowerCase() === "application/ld+json") {
      const start = html.indexOf(tag);
      const bodyStart = start + tag.length;
      const end = html.indexOf("</script", bodyStart);
      try {
        const json = JSON.parse(html.slice(bodyStart, end));
        if (!json?.["@context"] || !json?.["@type"]) fail(label, "JSON-LD must contain @context and @type");
      } catch (error) { fail(label, `invalid JSON-LD: ${error.message}`); }
    }
    if (name === "script" && attr(tag, "src") && /^https?:\/\//i.test(attr(tag, "src"))) fail(label, "off-site script src is forbidden");
    for (const field of ["href", "src"]) {
      const value = attr(tag, field);
      if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(value)) continue;
      const target = diskPath(cleanUrl(value), path.dirname(page.file));
      if (!target || !statSync(target, { throwIfNoEntry: false })?.isFile()) fail(label, `unresolved internal ${field}: ${value}`);
    }
    if (name === "a" && attr(tag, "target")?.toLowerCase() === "_blank" && !(attr(tag, "rel") || "").toLowerCase().split(/\s+/).includes("noopener")) fail(label, 'target="_blank" link missing rel="noopener"');
    if (name === "main") stack.push({ name, tag });
    else if (name === "h2" || name === "h3" || name === "h4" || name === "h5" || name === "h6") {
      if (stack.some((x) => x.name === "main")) mainHeadings.push(Number(name[1]));
      stack.push({ name, tag });
    } else if (!voids.has(name) && !/\/>$/.test(tag)) stack.push({ name, tag });
  }
  for (const match of html.matchAll(/http:\/\/(?!www\.w3\.org\/2000\/svg)[^\s"'<>]+/gi)) fail(label, `insecure http URL: ${match[0]}`);
  let previous = 1;
  for (const level of mainHeadings) { if (level > previous + 1) fail(label, `heading order skips h${previous} to h${level} inside main`); previous = level; }
}

if (existsSync(path.join(ROOT, "robots.txt"))) {
  const robots = readFileSync(path.join(ROOT, "robots.txt"), "utf8");
  if (!/sitemap\s*:\s*https?:\/\/\S+/i.test(robots)) fail("robots.txt", "must reference an absolute sitemap URL");
} else fail("robots.txt", "missing file");
const sitemapFile = path.join(ROOT, "sitemap.xml");
if (!existsSync(sitemapFile)) fail("sitemap.xml", "missing file");
else {
  const sitemap = readFileSync(sitemapFile, "utf8");
  const rootTag = sitemap.replace(/<!--[\s\S]*?-->|<\?[\s\S]*?\?>/g, "").match(/<([A-Za-z_][\w:.-]*)\b/)?.[1];
  if (!validXml(sitemap) || rootTag?.toLowerCase() !== "urlset") fail("sitemap.xml", "sitemap is not well-formed XML with a urlset root");
  const locs = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1]);
  const routeForLoc = (loc) => { try { const u = new URL(loc); return `${u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`}`; } catch { return null; } };
  const sitemapRoutes = new Set(locs.map(routeForLoc));
  for (const route of pageRoutes) if (!sitemapRoutes.has(route)) fail("sitemap.xml", `missing page route ${route}`);
  for (const route of sitemapRoutes) if (!route || !pageRoutes.has(route)) fail("sitemap.xml", `route does not resolve to a page: ${route}`);
  if (sitemapRoutes.size !== locs.length) fail("sitemap.xml", "duplicate sitemap locations");
}

if (launch) {
  const contentRoot = path.join(REPO, "src");
  if (existsSync(contentRoot)) for (const file of walk(contentRoot)) if (statSync(file).isFile()) {
    const text = readFileSync(file, "utf8");
    const rel = path.relative(REPO, file).split(path.sep).join("/");
    if (/(?:\/\/|\{\/\*)\s*TODO\(confirm\b/i.test(text)) fail(rel, "launch gate: TODO(confirm found");
    if (/\bsample\s*:\s*true\b/.test(text)) fail(rel, "launch gate: sample: true found");
    if (rel === "src/content/images.generated.ts" && /["']?source["']?\s*:\s*["']stock["']/.test(text)) fail(rel, 'launch gate: source: "stock" found');
    if (rel === "src/content/site.ts" && /url\s*:\s*["'][^"']*barisalas\.com\.tr/i.test(text)) console.log(`REVIEW: ${rel} still contains barisalas.com.tr`);
  }
}

console.log("QA static site checks");
console.log("TYPE      PAGE           RESULT");
for (const issue of failures) console.log(`FAIL      ${issue.page.padEnd(14)} ${issue.message}`);
for (const issue of warnings) console.log(`WARN      ${issue.page.padEnd(14)} ${issue.message}`);
console.log(`Summary: ${pages.length} pages checked, ${failures.length} failures, ${warnings.length} warnings.`);
if (failures.length) process.exitCode = 1;
