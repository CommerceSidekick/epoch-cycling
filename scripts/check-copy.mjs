#!/usr/bin/env node
// Copy and content checks C1 to C13 (spec 6.13).
//   node scripts/check-copy.mjs            preview mode: launch-only checks (C5, C8, C13) warn
//   node scripts/check-copy.mjs --strict   launch mode: every check that the spec calls a failure fails
// "src" = src/ and public/ text files. "dist" = built HTML in dist/client (visible text only).
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const STRICT = process.argv.includes("--strict");
const DIST = join(ROOT, "dist", "client");
const TEXT_EXT = new Set([".astro", ".ts", ".mjs", ".js", ".md", ".mdx", ".json", ".css", ".html", ".txt", ".svg", ".webmanifest"]);

const errors = [];
const warnings = [];
const fail = (id, msg) => errors.push(`${id} ${msg}`);
const warn = (id, msg) => warnings.push(`${id} ${msg}`);
const launchOnly = (id, msg) => (STRICT ? fail(id, msg) : warn(id, `${msg} (fails in --strict)`));

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const srcFiles = [...walk(join(ROOT, "src")), ...walk(join(ROOT, "public"))].filter((f) => TEXT_EXT.has(extname(f)) && !f.includes("/public/fonts/"));
const rel = (f) => relative(ROOT, f);

// ---------- dist text extraction ----------
const htmlFiles = walk(DIST).filter((f) => f.endsWith(".html"));
const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&rsquo;/g, "'").replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(+n));
function visibleText(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ");
}
const pageOf = (f) => "/" + relative(DIST, f).replace(/index\.html$/, "").replace(/\.html$/, "").replace(/\/$/, "");
const pages = htmlFiles.map((f) => {
  const html = readFileSync(f, "utf8");
  return { file: f, path: pageOf(f) || "/", html, text: visibleText(html) };
});
if (!pages.length) warn("--", "no built HTML found in dist/client; dist checks skipped (run astro build first)");

// ---------- C1: em / en dashes ----------
const DASH = /[–—]/;
for (const f of srcFiles) {
  const s = readFileSync(f, "utf8");
  s.split("\n").forEach((line, i) => { if (DASH.test(line)) fail("C1", `dash in ${rel(f)}:${i + 1}: ${line.trim().slice(0, 100)}`); });
}
for (const p of pages) if (DASH.test(p.text)) fail("C1", `dash in built page ${p.path}: ...${p.text.slice(Math.max(0, p.text.search(DASH) - 40), p.text.search(DASH) + 40)}...`);

// ---------- C2: banned voice words (dist text) ----------
const BANNED = [
  "unlock", "elevate", "empower", "seamless", "journey", "holistic", "revolutionize", "revolutionise", "game-changer", "game changer",
  "cutting-edge", "cutting edge", "in today's fast-paced world", "whether you're", "it's not just", "shred the gnar", "gnarly",
  "beast mode", "crush it", "bro", "brah", "fam", "no cap", "slay", "let's go+", "epic", "elite athletes only", "built different",
  "epoch-ic", "epochal", "no pain no gain", "suffer in silence", "real riders",
];
const bannedRe = new RegExp(`(?<![\\w-])(${BANNED.map((w) => w.replace(/[.*?^${}()|[\]\\]/g, (m) => (m === "+" ? m : `\\${m}`)).replace(/'/g, "['’]")).join("|")})(?![\\w-])`, "gi");
for (const p of pages) {
  const m = p.text.match(bannedRe);
  if (m) fail("C2", `banned word(s) on ${p.path}: ${[...new Set(m.map((x) => x.toLowerCase()))].join(", ")}`);
}

// ---------- C3 / C12: forbidden clinical terms, clinical domain ----------
const C3 = [/\bMD\b/, /Epoch MD/i, /epochmd/i, /\bDr\./, /\bTRT\b/, /testosterone/i, /hormone therapy/i, /hormone replacement/i, /\blow T\b/, /BPC/i, /\bTB-?500\b/i, /GLP-1/i, /semaglutide/i, /tirzepatide/i, /ipamorelin/i, /\bCJC\b/i, /sermorelin/i, /peptide protocol/i];
const SKIP_C3 = new Set(["scripts/check-copy.mjs"]);
for (const f of srcFiles) {
  if (SKIP_C3.has(rel(f))) continue;
  const s = readFileSync(f, "utf8");
  s.split("\n").forEach((line, i) => {
    for (const re of C3) if (re.test(line)) fail(re.source.includes("epochmd") ? "C12" : "C3", `${re} in ${rel(f)}:${i + 1}`);
  });
}
for (const p of pages) {
  const raw = p.html.replace(/https:\/\/www\.(wada-ama\.org|usada\.org|globaldro\.com)[^"' ]*/g, "");
  for (const re of C3) if (re.test(visibleText(raw)) || (re.source.includes("epochmd") && re.test(raw))) fail(re.source.includes("epochmd") ? "C12" : "C3", `${re} on ${p.path}`);
}

// ---------- C4: restricted terms outside the allowlist (src) ----------
const RESTRICTED = /\b(peptides?|hormones?|prescriptions?|clinicians?|total health|medically guided|evaluations?)\b/i;
const ALLOW = [
  /^src\/content\/snippets\//, /^src\/content\/faq\.ts$/, /^src\/content\/legal\//, /^src\/content\/products\//,
  /^src\/pages\/fuel\/guide\.astro$/, /^src\/components\/layout\/Footer\.astro$/, /^src\/components\/ui\/Disclaimer\.astro$/,
  /^src\/components\/layout\/(Header|MobileMenu)\.astro$/, /^src\/components\/sections\/SectionNav\.astro$/, /^src\/config\/brand\.ts$/,
  // Owner-approved extension (2026-11-16): the handoff block and handoff page render the spec's own handoff copy.
  /^src\/components\/sections\/HandoffBlock\.astro$/, /^src\/pages\/optimize\/medical\.astro$/,
];
for (const f of srcFiles) {
  const r = rel(f);
  if (!r.startsWith("src/") || ALLOW.some((a) => a.test(r))) continue;
  if (r.startsWith("src/content/products/")) continue;
  const s = readFileSync(f, "utf8");
  s.split("\n").forEach((line, i) => { const m = line.match(RESTRICTED); if (m) fail("C4", `"${m[0]}" outside allowlist in ${r}:${i + 1}`); });
}
// products: restricted words only inside `warnings`
for (const f of srcFiles.filter((x) => rel(x).startsWith("src/content/products/"))) {
  const s = readFileSync(f, "utf8");
  const withoutWarnings = s.replace(/^warnings:\n(?:\s+-.*\n)+/m, "");
  if (RESTRICTED.test(withoutWarnings)) fail("C4", `restricted term outside warnings in ${rel(f)}`);
}

// ---------- C5: unresolved {{tokens}} ----------
for (const p of pages) if (/\{\{[A-Z0-9_]+\}\}/.test(p.text) || /\{\{[A-Z0-9_]+\}\}/.test(p.html)) launchOnly("C5", `unresolved {{token}} on ${p.path}`);

// ---------- C6: legacy brand names ----------
for (const f of srcFiles) {
  if (rel(f) === "scripts/check-copy.mjs") continue;
  const s = readFileSync(f, "utf8");
  if (/\bomni\b|remarkablerx/i.test(s)) fail("C6", `"omni" or "remarkablerx" in ${rel(f)}`);
}
for (const p of pages) if (/\bomni\b|remarkablerx/i.test(p.text)) fail("C6", `"omni" or "remarkablerx" on ${p.path}`);

// ---------- C7: prices near medical words ----------
for (const p of pages) {
  const re = /\$\s?\d[\d,.]*/g;
  let m;
  while ((m = re.exec(p.text))) {
    const win = p.text.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80).toLowerCase();
    if (/consult|clinician|medical|lab panel|prescription/.test(win)) fail("C7", `price "${m[0]}" within 80 chars of a medical word on ${p.path}`);
  }
}

// ---------- C8: placeholders in production ----------
let phTotal = 0;
const phPages = [];
for (const p of pages) {
  const n = (p.html.match(/data-placeholder/g) || []).length;
  if (n) { phTotal += n; phPages.push(`${p.path} (${n})`); }
}
if (phTotal) launchOnly("C8", `${phTotal} placeholder(s) rendered: ${phPages.join(", ")}`);
for (const f of srcFiles.filter((x) => rel(x).startsWith("src/content/products/"))) {
  if (/substantiationRef:\s*PENDING/.test(readFileSync(f, "utf8"))) launchOnly("C8", `claims with substantiationRef PENDING in ${rel(f)} (hidden in production builds)`);
}

// ---------- C9: event safety ----------
const siteTs = readFileSync(join(ROOT, "src/config/site.ts"), "utf8");
const waiverSet = /waiverUrl:\s*"https?:\/\/[^"]+"/.test(siteTs);
for (const f of walk(join(ROOT, "src/content/events")).filter((x) => x.endsWith(".md"))) {
  const s = readFileSync(f, "utf8");
  const type = (s.match(/^type:\s*["']?([\w-]+)/m) || [])[1];
  const status = (s.match(/^status:\s*["']?(\w+)/m) || [, "scheduled"])[1];
  if ((type === "group-ride" || type === "clinic") && status === "scheduled" && !waiverSet) fail("C9", `${rel(f)} is a scheduled ${type} but SITE.waiverUrl is not set`);
}

// ---------- C10: exclamation points ----------
for (const p of pages) {
  const n = (p.text.match(/!/g) || []).length;
  if (n > 1) warn("C10", `${n} exclamation points on ${p.path}`);
}

// ---------- C11: signature line ----------
const SIG_OK = ["/", "/about", "/thanks", "/stories/whats-on-the-kit"];
for (const p of pages) {
  if (SIG_OK.includes(p.path)) continue;
  if (/now is your time/i.test(p.text)) warn("C11", `"Now is your time" appears on ${p.path}`);
}

// ---------- C13: snippet approval ----------
for (const f of walk(join(ROOT, "src/content/snippets")).filter((x) => x.endsWith(".md"))) {
  if (!/counselApproved:\s*true/.test(readFileSync(f, "utf8"))) launchOnly("C13", `snippet not counsel-approved: ${rel(f)}`);
}

// ---------- report ----------
const uniq = (a) => [...new Set(a)];
console.log(`\ncheck-copy (${STRICT ? "strict / launch" : "preview"} mode): ${pages.length} pages, ${srcFiles.length} source files`);
for (const w of uniq(warnings)) console.log(`  warn  ${w}`);
for (const e of uniq(errors)) console.log(`  FAIL  ${e}`);
console.log(errors.length ? `\n${uniq(errors).length} failure(s).` : "\nAll blocking checks passed.");
process.exit(errors.length ? 1 : 0);
