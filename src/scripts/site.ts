import { track } from "../lib/analytics";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Header: scrolled state + sticky on scroll-up only ----------
const top = document.getElementById("site-top");
const sheet = document.getElementById("mobile-menu");
let lastY = window.scrollY;
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  if (top) {
    top.dataset.scrolled = y > 12 ? "true" : "false";
    const menuOpen = sheet && !sheet.hidden;
    const ddOpen = !!document.querySelector(".nav-item[data-open]");
    if (y > 160 && y > lastY + 4 && !menuOpen && !ddOpen && !top.contains(document.activeElement)) top.dataset.hidden = "true";
    else if (y < lastY - 4 || y <= 160) top.dataset.hidden = "false";
  }
  lastY = y;
  ticking = false;
}
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
top?.addEventListener("focusin", () => { top.dataset.hidden = "false"; });

// ---------- Dropdowns (split buttons) ----------
const items = Array.from(document.querySelectorAll<HTMLElement>(".nav-item[data-dropdown]"));
function setOpen(item: HTMLElement, open: boolean) {
  const btn = item.querySelector<HTMLButtonElement>(".nav-chev");
  if (open) item.setAttribute("data-open", ""); else item.removeAttribute("data-open");
  btn?.setAttribute("aria-expanded", open ? "true" : "false");
  const sr = btn?.querySelector("[data-sr]");
  if (sr && btn?.dataset.label) sr.textContent = `${open ? "Hide" : "Show"} ${btn.dataset.label} menu`;
}
function closeAll(except?: HTMLElement) { items.forEach((i) => i !== except && setOpen(i, false)); }
items.forEach((item) => {
  const btn = item.querySelector<HTMLButtonElement>(".nav-chev");
  btn?.addEventListener("click", (e) => { e.stopPropagation(); const open = !item.hasAttribute("data-open"); closeAll(item); setOpen(item, open); });
  if (window.matchMedia("(hover: hover)").matches) {
    item.addEventListener("mouseenter", () => { closeAll(item); setOpen(item, true); });
    item.addEventListener("mouseleave", () => setOpen(item, false));
  }
  item.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && item.hasAttribute("data-open")) { setOpen(item, false); btn?.focus(); }
  });
  item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget as Node)) setOpen(item, false); });
});
document.addEventListener("click", (e) => { if (!(e.target as HTMLElement).closest(".nav-item")) closeAll(); });

// ---------- Mobile sheet with focus trap ----------
const openBtn = document.querySelector<HTMLButtonElement>("[data-menu-open]");
const closeBtn = document.querySelector<HTMLButtonElement>("[data-menu-close]");
function focusables(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);
}
function openMenu() {
  if (!sheet) return;
  sheet.hidden = false;
  openBtn?.setAttribute("aria-expanded", "true");
  document.documentElement.style.overflow = "hidden";
  (closeBtn ?? focusables(sheet)[0])?.focus();
}
function closeMenu() {
  if (!sheet || sheet.hidden) return;
  sheet.hidden = true;
  openBtn?.setAttribute("aria-expanded", "false");
  document.documentElement.style.overflow = "";
  openBtn?.focus();
}
openBtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
sheet?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeMenu(); return; }
  if (e.key !== "Tab") return;
  const f = focusables(sheet);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
sheet?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { sheet.hidden = true; document.documentElement.style.overflow = ""; }));
window.addEventListener("resize", () => { if (window.innerWidth >= 1024) closeMenu(); });

// ---------- Announcement ----------
document.querySelector("[data-announcement-close]")?.addEventListener("click", () => {
  try { localStorage.setItem("epoch-ann-dismissed", "1"); } catch { /* ignore */ }
  document.querySelector<HTMLElement>("[data-announcement]")?.setAttribute("hidden", "");
});

// ---------- Reveal + draw ----------
const revealEls = document.querySelectorAll<HTMLElement>(".reveal, .draw");
if ("IntersectionObserver" in window && !reduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}
document.querySelectorAll<SVGPathElement>(".draw path.profile").forEach((p) => {
  try { (p.parentElement?.closest(".draw") as HTMLElement | null)?.style.setProperty("--len", String(Math.ceil(p.getTotalLength()))); } catch { /* ignore */ }
});

// ---------- Count-up (once) ----------
document.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
  const target = Number(el.dataset.countup);
  if (!Number.isFinite(target) || reduced) return;
  const io = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    io.disconnect();
    const start = performance.now();
    const dur = 900;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = "0";
    requestAnimationFrame(step);
  });
  io.observe(el);
});

// ---------- Hero video: pause control, never under reduced motion or Save-Data ----------
document.querySelectorAll<HTMLElement>("[data-hero-video]").forEach((wrap) => {
  const v = wrap.querySelector("video");
  const btn = wrap.querySelector<HTMLButtonElement>("[data-video-toggle]");
  const saveData = (navigator as any).connection?.saveData;
  if (!v) return;
  if (reduced || saveData || window.innerWidth < 768) { v.remove(); btn?.remove(); return; }
  v.querySelectorAll("source[data-src]").forEach((s) => s.setAttribute("src", (s as HTMLElement).dataset.src!));
  v.load();
  v.play().catch(() => {});
  btn?.addEventListener("click", () => {
    if (v.paused) { v.play(); btn.setAttribute("aria-pressed", "false"); btn.querySelector("span")!.textContent = "Pause video"; }
    else { v.pause(); btn.setAttribute("aria-pressed", "true"); btn.querySelector("span")!.textContent = "Play video"; }
  });
});

// ---------- Analytics hooks (no-op until configured) ----------
document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest<HTMLElement>("[data-cta], [data-outbound]");
  if (!a) return;
  if (a.dataset.cta) track("cta_click", { label: a.dataset.cta, location: a.dataset.ctaLocation ?? location.pathname });
  if (a.hasAttribute("data-outbound")) { try { track("outbound_click", { domain: new URL((a as HTMLAnchorElement).href).hostname }); } catch { /* ignore */ } }
});
document.querySelectorAll<HTMLDetailsElement>("details[data-faq-id]").forEach((d) => d.addEventListener("toggle", () => { if (d.open) track("faq_open", { id: d.dataset.faqId! }); }));
