#!/usr/bin/env node
// Post-build for Vercel (Build Output API v3):
//  1. Domain-level redirects (spec 4.2 / 6.14): www.epochcycling.com -> apex, epochmtb.com -> /mtb.
//  2. Security headers (6.12) on every response, with a CSP that hashes each inline script in the build.
// Query strings are carried over explicitly so UTM links in old QR codes still attribute.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const ROOT = new URL("..", import.meta.url).pathname;
const CONFIG = join(ROOT, ".vercel/output/config.json");
const STATIC = join(ROOT, ".vercel/output/static");
if (!existsSync(CONFIG)) {
  console.log("vercel-postbuild: no .vercel/output/config.json, skipping");
  process.exit(0);
}

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

// Hash every inline executable <script> so CSP can stay strict without 'unsafe-inline'.
const hashes = new Set();
for (const f of walk(STATIC).filter((x) => x.endsWith(".html"))) {
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    if (/type=["']?application\/(ld\+)?json/i.test(attrs)) continue;
    if (!m[2].trim()) continue;
    hashes.add(`'sha256-${createHash("sha256").update(m[2], "utf8").digest("base64")}'`);
  }
}

const analytics = process.env.PUBLIC_ANALYTICS_DOMAIN ? " https://plausible.io" : "";
const csp = [
  "default-src 'self'",
  "img-src 'self' data:",
  "media-src 'self'",
  `script-src 'self' https://challenges.cloudflare.com${analytics} ${[...hashes].join(" ")}`.trim(),
  "frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com",
  `connect-src 'self'${analytics}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": csp,
};

const isPreview = process.env.VERCEL_ENV === "preview";
const cfg = JSON.parse(readFileSync(CONFIG, "utf8"));
const pre = [
  { src: "^/(.*)$", has: [{ type: "host", value: "www.epochcycling.com" }], status: 301, headers: { Location: "https://epochcycling.com/$1" } },
  { src: "^/(.*)$", has: [{ type: "host", value: "epochmtb.com" }], status: 301, headers: { Location: "https://epochcycling.com/mtb" } },
  { src: "^/(.*)$", has: [{ type: "host", value: "www.epochmtb.com" }], status: 301, headers: { Location: "https://epochcycling.com/mtb" } },
  { src: "^/(.*)$", headers: { ...securityHeaders, ...(isPreview ? { "X-Robots-Tag": "noindex" } : {}) }, continue: true },
];
cfg.routes = [...pre, ...(cfg.routes ?? []).filter((r) => !(r.headers && r.headers["Content-Security-Policy"]) && !(r.has && r.has[0]?.type === "host"))];
writeFileSync(CONFIG, JSON.stringify(cfg, null, 2));

// Preview deploys: block all crawlers.
if (isPreview) writeFileSync(join(STATIC, "robots.txt"), "User-agent: *\nDisallow: /\n");
console.log(`vercel-postbuild: ${pre.length} routes added, ${hashes.size} inline script hash(es) in CSP${isPreview ? ", preview robots" : ""}`);
