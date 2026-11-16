// Minimal static server for QA of the production build (clean URLs, 404 page, redirects from redirects.config.mjs).
// node scripts/serve-static.mjs [port]
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { REDIRECTS } from "../redirects.config.mjs";
const ROOT = new URL("../.vercel/output/static/", import.meta.url).pathname;
const port = Number(process.argv[2] ?? 4400);
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".json": "application/json", ".webmanifest": "application/manifest+json", ".ics": "text/calendar", ".md": "text/markdown" };
createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let p = decodeURIComponent(url.pathname);
  const r = REDIRECTS[p];
  if (r) { res.writeHead(r.status, { Location: r.destination }); return res.end(); }
  if (p.length > 1 && p.endsWith("/")) { res.writeHead(301, { Location: p.slice(0, -1) + url.search }); return res.end(); }
  const candidates = [join(ROOT, p), join(ROOT, p, "index.html"), join(ROOT, p + ".html")];
  const file = candidates.find((f) => existsSync(f) && statSync(f).isFile());
  if (!file) {
    if (p === "/thanks") { res.writeHead(200, { "Content-Type": TYPES[".html"] }); return res.end("<!doctype html><title>thanks (on-demand route)</title><h1>Thanks</h1>"); }
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    return res.end(existsSync(join(ROOT, "404.html")) ? readFileSync(join(ROOT, "404.html")) : "Not found");
  }
  const type = TYPES[extname(file)] ?? "application/octet-stream";
  const body = readFileSync(file);
  const ae = req.headers["accept-encoding"] ?? "";
  if (/text|javascript|svg|json|xml/.test(type) && /br/.test(ae)) { res.writeHead(200, { "Content-Type": type, "Content-Encoding": "br" }); return res.end(brotliCompressSync(body)); }
  if (/text|javascript|svg|json|xml/.test(type) && /gzip/.test(ae)) { res.writeHead(200, { "Content-Type": type, "Content-Encoding": "gzip" }); return res.end(gzipSync(body)); }
  res.writeHead(200, { "Content-Type": type, "Cache-Control": file.includes("/_astro/") ? "public, max-age=31536000, immutable" : "no-cache" });
  res.end(body);
}).listen(port, () => console.log(`static QA server on http://localhost:${port}`));
