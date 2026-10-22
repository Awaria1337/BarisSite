import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { readFileSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { startServer } from "./serve-out.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
const REPORTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.qa/lighthouse");
const THRESHOLDS = {
  performance: Number(process.env.LH_MIN_PERF ?? 95),
  accessibility: Number(process.env.LH_MIN_A11Y ?? 100),
  "best-practices": Number(process.env.LH_MIN_BP ?? 100),
  seo: Number(process.env.LH_MIN_SEO ?? 100),
};
const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});

const routes = walk(ROOT).filter((file) => file.endsWith(`${path.sep}index.html`) || file === path.join(ROOT, "index.html"))
  .map((file) => `/${path.relative(ROOT, path.dirname(file)).split(path.sep).filter(Boolean).join("/")}${path.dirname(file) === ROOT ? "" : "/"}`)
  .filter((route) => !args.length || args.includes(route))
  // noindex pages (404 / _not-found) are intentionally excluded from search; the SEO gate doesn't apply.
  .filter((route) => !/<meta\b[^>]*name="robots"[^>]*noindex/i.test(readFileSync(path.join(ROOT, route, "index.html"), "utf8")));
if (!routes.length) { console.error("No exported routes matched."); process.exit(1); }
mkdirSync(REPORTS, { recursive: true });
let server;
let chrome;
let failed = false;
try {
  server = await startServer({ port: 0, root: ROOT });
  chrome = await chromeLauncher.launch({ chromePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"], logLevel: "error" });
  const desktopConfigModule = await import(pathToFileURL(path.resolve(path.dirname(fileURLToPath(import.meta.resolve("lighthouse"))), "config/desktop-config.js")));
  const desktopConfig = desktopConfigModule.default;
  const columns = ["ROUTE", "FORM", "PERF", "A11Y", "BP", "SEO", "LCP", "CLS", "TBT", "FCP"];
  console.log(columns.join("\t"));
  for (const route of routes) for (const formFactor of ["mobile", "desktop"]) {
    const config = formFactor === "desktop" ? desktopConfig : undefined;
    const result = await lighthouse(`${server.url}${route}`, {
      port: chrome.port,
      output: ["json", "html"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor,
    }, config);
    const report = result?.lhr;
    if (!report) throw new Error(`Lighthouse returned no report for ${route} (${formFactor})`);
    const slug = route === "/" ? "root" : route.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
    for (let i = 0; i < result.report.length; i++) writeFileSync(path.join(REPORTS, `${slug}-${formFactor}.${i === 0 ? "json" : "html"}`), result.report[i]);
    const scores = Object.fromEntries(Object.entries(THRESHOLDS).map(([key]) => [key, Math.round((report.categories[key]?.score ?? 0) * 100)]));
    const audits = report.audits;
    const metric = (id, scale = 1) => audits[id]?.numericValue == null ? "—" : String(Math.round(audits[id].numericValue * scale));
    console.log([route, formFactor, scores.performance, scores.accessibility, scores["best-practices"], scores.seo,
      metric("largest-contentful-paint"), audits["cumulative-layout-shift"]?.numericValue?.toFixed(3) ?? "—",
      metric("total-blocking-time"), metric("first-contentful-paint")].join("\t"));
    for (const [category, threshold] of Object.entries(THRESHOLDS)) if (scores[category] < threshold) {
      failed = true;
      console.error(`Below ${category} threshold for ${route} (${formFactor}): ${scores[category]} < ${threshold}`);
      const categoryRef = report.categories[category];
      for (const auditRef of categoryRef?.auditRefs || []) {
        const audit = audits[auditRef.id];
        if (audit && audit.score !== 1 && auditRef.weight > 0) console.error(`  - ${audit.title} (score ${audit.score ?? "n/a"}, weight ${auditRef.weight})`);
      }
    }
  }
} catch (error) {
  console.error(`Lighthouse QA could not run: ${error.message}`);
  if (/listen|EACCES|EPERM|bind/i.test(error.message)) console.error("Localhost binding was blocked; no alternate port or host was attempted.");
  if (/chrome|spawn|ENOENT|EACCES/i.test(error.message)) console.error("Chrome launch failed; no alternate browser or launch method was attempted.");
  failed = true;
} finally {
  if (chrome) { try { await chrome.kill(); } catch (error) { console.error(`Chrome shutdown failed: ${error.message}`); } }
  if (server) await server.close().catch((error) => console.error(`Server shutdown failed: ${error.message}`));
}
if (failed) process.exitCode = 1;
