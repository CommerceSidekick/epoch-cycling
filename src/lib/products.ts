// Product helpers: render only what the product data supports. Never show a blank or a fake 0.
import type { CollectionEntry } from "astro:content";

type P = CollectionEntry<"products">;
type FactKey = keyof P["data"]["facts"];

export const STATUS_TAG: Record<P["data"]["status"], string> = { waitlist: "DROPPING SOON", live: "IN STOCK", "sold-out": "SOLD OUT" };

export function bullets(p: P): string[] {
  const f = p.data.facts as Record<string, number | string | undefined>;
  return p.data.bullets
    .filter((b) => !b.needs || (f[b.needs] !== undefined && f[b.needs] !== null))
    .map((b) => b.text.replace(/\{(\w+)\}/g, (_m, k) => String(f[k] ?? "")));
}

/** Claims render only with real substantiation. PENDING shows in dev (marked) and never in production. */
export function visibleClaims(p: P) {
  return p.data.claims
    .filter((c) => c.substantiationRef && (c.substantiationRef !== "PENDING" || !import.meta.env.PROD))
    .map((c) => ({ ...c, pending: c.substantiationRef === "PENDING" }));
}

export function price(p: P): number | undefined {
  if (p.data.status !== "live") return undefined;
  return p.data.variants.find((v) => typeof v.price === "number")?.price;
}

export type Fact = { k: string; v: string };
export function keyFacts(p: P): Fact[] {
  const f = p.data.facts;
  const has = (k: FactKey) => f[k] !== undefined && f[k] !== null;
  const out: Fact[] = [];
  const add = (k: FactKey, label: string, fmt: (n: number) => string) => { if (has(k)) out.push({ k: label, v: fmt(f[k] as number) }); };
  if (p.data.line === "fuel") {
    add("carbsPerServing", "Carbs", (n) => `${n} g`);
    add("sodiumPerServing", "Sodium", (n) => `${n} mg`);
    add("servingsPerPack", "Servings", (n) => `${n}`);
    if (has("caffeineMg")) out.push({ k: "Caffeine", v: f.caffeineMg === 0 ? "Caffeine-free" : `${f.caffeineMg} mg` });
  } else {
    add("sodiumPerServing", "Sodium", (n) => `${n} mg`);
    add("potassiumPerServing", "Potassium", (n) => `${n} mg`);
    add("magnesiumPerServing", "Magnesium", (n) => `${n} mg`);
    add("servingsPerPack", "Servings", (n) => `${n}`);
    add("sugarPerServing", "Sugar", (n) => (n === 0 ? "Sugar-free" : `${n} g`));
  }
  if (p.data.flavors.length) out.push({ k: p.data.flavors.length > 1 ? "Flavors" : "Flavor", v: p.data.flavors.join(", ") });
  return out;
}

export function caffeineAnswer(p: P) {
  const c = p.data.facts.caffeineMg;
  if (c === undefined || c === null) return "Caffeine details go up with the full label at launch.";
  if (c === 0) return "No. Epoch Fuel is caffeine-free.";
  return `Yes, ${c} mg per serving.`;
}
