// Renders 1200x630 Open Graph images with the real site fonts and photos into public/og/.
// Run locally (needs Playwright + Chromium): npm run og. Output is committed; Vercel builds don't need Playwright.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const root = path.resolve(__dirname, "..");
const { MARK_PATHS, WORDMARK_STROKES } = { MARK_PATHS: ["M205 300 L440 82 L611 300 L427 143 Z", "M261 286 C 300 248 362 205 426 176 C 384 212 324 258 261 286 Z"], WORDMARK_STROKES: ["M151 344.75 H82 V405.25 H151 M82 375 H146", "M219 412 V344.75 H252 a19 19 0 0 1 0 38 H219", "M443 375 a51 30.25 0 1 0 -102 0 a51 30.25 0 1 0 102 0", "M590 357 A 50 30.25 0 1 0 590 393", "M655.75 338 V412 M729.25 338 V412 M655.75 375 H729.25"] };
const V = [
  { id: "default", img: "mtb-blur.jpg", kicker: "EPOCH CYCLING · MTB / GRAVEL / ROAD", title: "Now is your time.", sub: "Ride. Fuel. Optimize.", accent: "#2D8CFF", lock: "CYCLING" },
  { id: "ride", img: "crew-singletrack.jpg", kicker: "THE EPOCH RIDERS CLUB", title: "Nobody gets fast alone.", sub: "Group rides. Team kits. The race deal.", accent: "#2D8CFF", lock: "RIDERS CLUB" },
  { id: "fuel", img: "fuel-bottle-trail.jpg", kicker: "FUEL", title: "Fuel the ride.", sub: "Epoch Fuel and Epoch Salt.", accent: "#D4FF3A", lock: "CYCLING" },
  { id: "optimize", img: "mtb-ridge-silhouette.jpg", kicker: "OPTIMIZE", title: "Know when to send it.", sub: "The free Epoch app and coaching for riders.", accent: "#8FB8C9", lock: "CYCLING" },
  { id: "mtb", img: "mtb-charge.jpg", kicker: "EPOCH MTB · LIVE", title: "Nobody gets fast alone.", sub: "Built in the dirt.", accent: "#2D8CFF", lock: "MTB" },
  { id: "gravel", img: "gravel-descent.jpg", kicker: "EPOCH GRAVEL · COMING SOON", title: "Long roads. Loose dirt.", sub: "Get on the list.", accent: "#D9A441", lock: "GRAVEL" },
  { id: "road", img: "road-peloton.jpg", kicker: "EPOCH ROAD · COMING SOON", title: "Fast mornings.", sub: "Tight pacelines. Soon.", accent: "#A592FF", lock: "ROAD" },
];
const font = (f) => "file://" + path.join(root, "public/fonts", f);
(async () => {
  fs.mkdirSync(path.join(root, "public/og"), { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const v of V) {
    const html = `<!doctype html><html><head><style>
      @font-face{font-family:A;src:url(${font("archivo-wdth.woff2")});font-weight:100 900;font-stretch:62% 125%}
      @font-face{font-family:M;src:url(${font("jetbrains-mono-500.woff2")})}
      @font-face{font-family:B;src:url(${font("barlow-500.woff2")})}
      *{margin:0;box-sizing:border-box} body{width:1200px;height:630px;background:#0E0F0C;color:#F2EEE6;position:relative;overflow:hidden;font-family:B}
      .bg{position:absolute;inset:0;background:url(file://${path.join(root, "src/assets/img", v.img)}) center/cover;filter:grayscale(.2) contrast(1.1)}
      .sh{position:absolute;inset:0;background:linear-gradient(90deg,rgba(14,15,12,.96) 0%,rgba(14,15,12,.8) 45%,rgba(14,15,12,.25) 100%)}
      .c{position:absolute;left:70px;right:70px;top:64px;bottom:60px;display:flex;flex-direction:column}
      .k{font-family:M;font-size:20px;letter-spacing:.14em;color:#A8A291;display:flex;align-items:center;gap:14px}
      .k:before{content:"";width:32px;height:3px;background:${v.accent}}
      h1{font-family:A;font-weight:900;font-stretch:125%;text-transform:uppercase;font-size:96px;line-height:.9;margin-top:28px;max-width:900px}
      p{font-size:30px;margin-top:22px;color:#e9e4d8}
      .lock{margin-top:auto;display:flex;align-items:center;gap:18px}
      .lock svg.m{width:86px} .lock .w{display:flex;flex-direction:column;gap:8px;width:190px}
      .sub{font-family:${v.lock === "CYCLING" || v.lock === "RIDERS CLUB" ? "M" : "A"};font-weight:900;font-stretch:125%;letter-spacing:.28em;font-size:${v.lock === "CYCLING" || v.lock === "RIDERS CLUB" ? 16 : 26}px;color:${v.lock === "CYCLING" || v.lock === "RIDERS CLUB" ? "#F2EEE6" : v.accent}}
      .bar{position:absolute;left:0;right:0;bottom:0;height:10px;background:${v.accent}}
    </style></head><body><div class="bg"></div><div class="sh"></div>
    <div class="c"><div class="k">${v.kicker}</div><h1>${v.title}</h1><p>${v.sub}</p>
    <div class="lock"><svg class="m" viewBox="205 82 406 218" fill="${v.accent}">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")}</svg>
    <div class="w"><svg viewBox="75 331 661 88" fill="none" stroke="#F2EEE6" stroke-width="13.5">${WORDMARK_STROKES.map((d) => `<path d="${d}"/>`).join("")}</svg><span class="sub">${v.lock}</span></div></div></div>
    <div class="bar"></div></body></html>`;
    const tmp = path.join(require("os").tmpdir(), `epoch-og-${v.id}.html`);
    fs.writeFileSync(tmp, html);
    await p.goto("file://" + tmp, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(root, "public/og", `${v.id}.jpg`), type: "jpeg", quality: 84 });
    console.log("og", v.id);
  }
  await b.close();
})();
