import http from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";

// Cloudflare compresses text responses; do the same so Lighthouse measures
// realistic transfer sizes.
const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml|manifest\+json)|image\/svg\+xml)/;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(HERE, "../out");
const TYPES = new Map([
  [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"], [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"], [".svg", "image/svg+xml"],
  [".png", "image/png"], [".jpg", "image/jpeg"], [".webp", "image/webp"],
  [".avif", "image/avif"], [".ico", "image/x-icon"], [".woff2", "font/woff2"],
  [".webmanifest", "application/manifest+json"],
]);

function readHeaders(root) {
  const file = path.join(root, "_headers");
  if (!existsSync(file)) return [];
  const rules = [];
  let current;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^\s/.test(line)) {
      const match = line.trim().match(/^([^:]+):\s*(.*)$/);
      if (match && current) current.headers.push([match[1], match[2]]);
    } else {
      current = { pattern: line.trim(), headers: [] };
      rules.push(current);
    }
  }
  return rules;
}

function patternMatches(pattern, pathname) {
  const escaped = pattern.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${escaped}$`).test(pathname);
}

export function startServer({ port = Number(process.env.PORT || 4321), root = DEFAULT_ROOT } = {}) {
  const siteRoot = path.resolve(root);
  const rules = readHeaders(siteRoot);
  const server = http.createServer((req, res) => {
    let rawPath = (req.url || "/").split(/[?#]/, 1)[0];
    let decoded;
    try { decoded = decodeURIComponent(rawPath); } catch { res.writeHead(400).end("Bad request"); return; }
    const segments = decoded.split(/[\\/]+/);
    if (segments.includes("..") || decoded.includes("\\")) { res.writeHead(400).end("Bad request"); return; }
    const pathname = decoded.startsWith("/") ? decoded : `/${decoded}`;
    let relative = pathname.replace(/^\/+/, "");
    if (!relative) relative = "index.html";
    let target = path.resolve(siteRoot, relative);
    if (target !== siteRoot && !target.startsWith(`${siteRoot}${path.sep}`)) { res.writeHead(400).end("Bad request"); return; }

    if (existsSync(target) && statSync(target).isDirectory()) {
      if (!pathname.endsWith("/")) { res.writeHead(308, { Location: `${pathname}/${req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}` }).end(); return; }
      target = path.join(target, "index.html");
    } else if (!pathname.endsWith("/") && existsSync(path.join(target, "index.html"))) {
      const queryIndex = (req.url || "").indexOf("?");
      res.writeHead(308, { Location: `${pathname}/${queryIndex >= 0 ? req.url.slice(queryIndex) : ""}` }).end(); return;
    }
    let status = 200;
    if (!existsSync(target) || !statSync(target).isFile()) {
      target = path.join(siteRoot, "404.html");
      status = 404;
      if (!existsSync(target)) { res.writeHead(404).end("Not found"); return; }
    }
    const headers = { "Content-Type": TYPES.get(path.extname(target).toLowerCase()) || "application/octet-stream" };
    for (const rule of rules) if (patternMatches(rule.pattern, pathname)) for (const [name, value] of rule.headers) headers[name] = value;
    let body = req.method === "HEAD" ? null : readFileSync(target);
    const accept = String(req.headers["accept-encoding"] || "");
    if (body && COMPRESSIBLE.test(headers["Content-Type"])) {
      if (/\bbr\b/.test(accept)) { body = brotliCompressSync(body); headers["Content-Encoding"] = "br"; }
      else if (/\bgzip\b/.test(accept)) { body = gzipSync(body); headers["Content-Encoding"] = "gzip"; }
      headers["Vary"] = "Accept-Encoding";
    }
    res.writeHead(status, headers);
    if (req.method === "HEAD") res.end();
    else res.end(body);
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.removeListener("error", reject);
      const address = server.address();
      resolve({ url: `http://127.0.0.1:${address.port}`, close: () => new Promise((done, fail) => server.close((err) => err ? fail(err) : done())) });
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4321);
  startServer({ port }).then(({ url }) => console.log(`Serving ${DEFAULT_ROOT} at ${url}`)).catch((error) => {
    console.error(`Could not bind static server to 127.0.0.1:${port}: ${error.message}`);
    process.exitCode = 1;
  });
}
