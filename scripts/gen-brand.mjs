// Generates static brand assets into public/:
//  - brand/topo.svg            topo-line contour texture (decorative)
//  - favicon.svg               peak mark on Carbon with a thin Dawn underline (3.5 delta)
//  - brand/mark.svg, brand/logo-*.svg   logo exports
//  - brand/icon-{ride,fuel,optimize}-{outline,solid,knockout}.svg   kit marks (3.6)
//  - apple-touch-icon.png, icon-192.png, icon-512.png, logo-512.png
// Run: node scripts/gen-brand.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { MARK_PATHS, WORDMARK_STROKES, ICONS } from "../src/lib/brand-geometry.mjs";

const out = (p, s) => { writeFileSync(new URL(`../public/${p}`, import.meta.url), s); };
mkdirSync(new URL("../public/brand", import.meta.url), { recursive: true });

// ---------- Topo texture ----------
function rand(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const r = rand(42);
const peaks = [
  { x: 320, y: 300, rings: 8, base: 26, step: 30 },
  { x: 1080, y: 560, rings: 9, base: 20, step: 28 },
  { x: 760, y: 120, rings: 5, base: 30, step: 34 },
  { x: 120, y: 820, rings: 5, base: 40, step: 32 },
  { x: 1300, y: 80, rings: 4, base: 30, step: 36 },
];
let paths = "";
for (const p of peaks) {
  const ph = [r() * 6.28, r() * 6.28, r() * 6.28];
  for (let i = 0; i < p.rings; i++) {
    const rad = p.base + i * p.step;
    const pts = [];
    const n = 16;
    for (let k = 0; k < n; k++) {
      const t = (k / n) * Math.PI * 2;
      const wob = 1 + 0.12 * Math.sin(3 * t + ph[0] + i * 0.15) + 0.07 * Math.sin(5 * t + ph[1]) + 0.05 * Math.sin(2 * t + ph[2] + i * 0.3);
      pts.push([p.x + Math.cos(t) * rad * wob * 1.35, p.y + Math.sin(t) * rad * wob]);
    }
    // Catmull-Rom to cubic Bezier, closed
    let d = `M${pts[0][0].toFixed(0)} ${pts[0][1].toFixed(0)}`;
    for (let k = 0; k < n; k++) {
      const p0 = pts[(k - 1 + n) % n], p1 = pts[k], p2 = pts[(k + 1) % n], p3 = pts[(k + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(0)} ${c1[1].toFixed(0)} ${c2[0].toFixed(0)} ${c2[1].toFixed(0)} ${p2[0].toFixed(0)} ${p2[1].toFixed(0)}`;
    }
    paths += `<path d="${d}Z"/>`;
  }
}
out("brand/topo.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" fill="none" stroke="#F2EEE6" stroke-width="1.2">${paths}</svg>`);

// ---------- Mark + logos ----------
const markSvg = (fill = "#F2EEE6") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="200 76 416 230"><g fill="${fill}">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g></svg>`;
out("brand/mark.svg", markSvg());
out("brand/mark-carbon.svg", markSvg("#0E0F0C"));
const logoStacked = (fg, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 50 730 400">${bg ? `<rect x="40" y="50" width="730" height="400" fill="${bg}"/>` : ""}<g fill="${fg}">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g><g fill="none" stroke="${fg}" stroke-width="13.5">${WORDMARK_STROKES.map((d) => `<path d="${d}"/>`).join("")}</g></svg>`;
out("brand/logo-stacked-bone.svg", logoStacked("#F2EEE6"));
out("brand/logo-stacked-carbon.svg", logoStacked("#0E0F0C"));

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0E0F0C"/><g transform="translate(7.5 13) scale(0.118)"><g fill="#FF5A1F" transform="translate(-205 -82)">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g></g><rect x="14" y="48" width="36" height="3" rx="1.5" fill="#FF5A1F"/></svg>`;
out("favicon.svg", favicon);

// ---------- Pillar icons (kit marks) ----------
for (const [name, variants] of Object.entries(ICONS)) {
  for (const v of ["outline", "solid", "knockout"]) {
    const color = v === "knockout" ? "#F2EEE6" : "#0E0F0C";
    out(`brand/icon-${name}-${v}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">${variants(v === "solid" ? "solid" : "outline", color)}</svg>`);
  }
}

// ---------- PNG icons ----------
const fav = Buffer.from(favicon);
await sharp(fav, { density: 600 }).resize(180, 180).png().toFile(new URL("../public/apple-touch-icon.png", import.meta.url).pathname);
await sharp(fav, { density: 600 }).resize(192, 192).png().toFile(new URL("../public/icon-192.png", import.meta.url).pathname);
await sharp(fav, { density: 600 }).resize(512, 512).png().toFile(new URL("../public/icon-512.png", import.meta.url).pathname);
await sharp(Buffer.from(logoStacked("#F2EEE6", "#0E0F0C")), { density: 300 }).resize(512, 512, { fit: "contain", background: "#0E0F0C" }).png().toFile(new URL("../public/logo-512.png", import.meta.url).pathname);

out("site.webmanifest", JSON.stringify({
  name: "Epoch Cycling",
  short_name: "Epoch",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  theme_color: "#0E0F0C",
  background_color: "#0E0F0C",
  display: "browser",
}, null, 2));
console.log("brand assets generated");
