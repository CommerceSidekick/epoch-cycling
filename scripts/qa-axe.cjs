// Accessibility QA: runs axe-core (WCAG 2.1 A/AA) in Chromium against each URL. Fails on serious/critical.
// node scripts/qa-axe.cjs http://localhost:4400 /path1 /path2 ...
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const axeSrc = fs.readFileSync(path.join(__dirname, "../node_modules/axe-core/axe.min.js"), "utf8");
(async () => {
  const [base, ...paths] = process.argv.slice(2);
  const b = await chromium.launch();
  let bad = 0;
  for (const w of [1440, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    for (const p of paths) {
      const page = await ctx.newPage();
      await page.goto(base + p, { waitUntil: "domcontentloaded", timeout: 90000 }); await page.waitForTimeout(1500);
      await page.evaluate(() => document.querySelectorAll(".reveal,.draw").forEach((e) => e.classList.add("is-in")));
      await page.waitForTimeout(700);
      await page.addScriptTag({ content: axeSrc });
      const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }));
      const serious = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      const minor = res.violations.filter((v) => !(v.impact === "serious" || v.impact === "critical"));
      if (serious.length) bad += serious.length;
      console.log(`${w}px ${p}: ${serious.length} serious/critical, ${minor.length} moderate/minor`);
      for (const v of [...serious, ...minor]) console.log(`   [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.target?.join(" ")}`);
      await page.close();
    }
    await ctx.close();
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
