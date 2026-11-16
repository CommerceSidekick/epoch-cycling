// Single source of truth for names, pillars, disciplines and taglines (spec 6.4).
// Changing a value here changes every instance on the site.

export const BRAND = {
  family: "Epoch Health System",
  name: "Epoch Cycling",
  short: "Epoch",
  wordmark: "EPOCH",
  lockupSub: "CYCLING",
  club: "Epoch Riders Club",
  PILLAR_1_WORD: "Ride",
  PILLAR_2_WORD: "Fuel",
  PILLAR_3_WORD: "Optimize",
  get tagline() {
    return `${this.PILLAR_1_WORD}. ${this.PILLAR_2_WORD}. ${this.PILLAR_3_WORD}.`;
  },
  signature: "Now is your time.",
  promise: "Better every season.",
  products: { fuel: "Epoch Fuel", salt: "Epoch Salt" },
  // Consumer program on epochhealthsystem.com. Rendered ONLY by the handoff block,
  // /optimize/medical, FAQ 16, the Optimize nav item and the footer Optimize column.
  program: "Epoch Total Health",
  // The three services inside Epoch Total Health (owner brief, 2026-11-16).
  services: {
    app: "AI Health System",
    coaching: "Personal Coaching",
    edge: "EpochEdge",
  },
  disciplines: [
    { key: "mtb", name: "Epoch MTB", tag: "MTB", path: "/mtb", live: true, accent: "dawn" },
    { key: "gravel", name: "Epoch Gravel", tag: "GRAVEL", path: "/gravel", live: false, accent: "grit" },
    { key: "road", name: "Epoch Road", tag: "ROAD", path: "/road", live: false, accent: "velo" },
  ],
  // Jason's name and credential line need his sign-off (L7). Empty = placeholder.
  cmo: { first: "Jason", surname: "", credentials: "" },
} as const;

export type DisciplineKey = (typeof BRAND.disciplines)[number]["key"];
