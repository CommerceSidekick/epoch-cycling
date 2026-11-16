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
  // Same supplement line as Epoch Health System (owner 2026-11-16). None are on sale yet.
  products: { endurance: "Epoch Endurance", fuel: "Epoch Fuel", edge: "Epoch Edge" },
  // Optimize is the Epoch Health System program (owner 2026-11-16). Physician-led care lives on
  // the Epoch Health System site under Personalized Health. Rendered ONLY by the handoff block,
  // /optimize/medical, FAQ, the Optimize nav item and the footer Optimize column.
  program: "Personalized Health",
  // The three parts of the program, named as on Epoch Health System.
  services: {
    app: "The Health System",
    coaching: "Fitness and lifestyle coaching",
    health: "Personalized Health",
  },
  disciplines: [
    { key: "mtb", name: "Epoch MTB", tag: "MTB", path: "/mtb", live: true, accent: "dawn" },
    { key: "gravel", name: "Epoch Gravel", tag: "GRAVEL", path: "/gravel", live: false, accent: "grit" },
    { key: "road", name: "Epoch Road", tag: "ROAD", path: "/road", live: false, accent: "velo" },
  ],
  // Shown as on Epoch Health System: title and credential line, name hidden until he signs off (L7).
  cmo: { first: "Jason", surname: "", title: "Chief Medical Officer", credentials: "Former Navy SEAL performance doctor" },
} as const;

export type DisciplineKey = (typeof BRAND.disciplines)[number]["key"];
