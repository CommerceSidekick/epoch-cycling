// Fueling guide data (spec 5.12.D). Single source for the guide table and the product-page summary.
// Numbers must match the spec exactly. A registered sports dietitian reviews them before launch (L6).

export type GuideRow = { id?: string; length: string; before: string; during: string; after: string };

export const GUIDE_ROWS: GuideRow[] = [
  {
    id: "short",
    length: "Under 60 minutes",
    before: "A normal meal a few hours before, or a small snack.",
    during: "Water is usually enough. On hard efforts or races, a few sips of a carb drink can help.",
    after: "Your next normal meal.",
  },
  {
    id: "medium",
    length: "1 to 2.5 hours",
    before: "A carb-forward meal 1 to 4 hours before. Start hydrated.",
    during: "Aim for 30 to 60 g of carbs per hour. Start in the first 30 minutes. Drink to thirst, often around 400 to 800 ml an hour.",
    after: "Carbs, protein and fluids within a couple of hours.",
  },
  {
    id: "long",
    length: "Over 2.5 hours and race day",
    before: "A bigger carb-forward meal 2 to 4 hours before. Top up with a small snack 30 to 60 minutes out.",
    during: "Up to 90 g of carbs per hour if your gut is trained for it, using a mix of carb types. Add electrolytes. Keep sipping.",
    after: "A real meal with carbs and protein. Keep drinking for the next few hours.",
  },
  {
    length: "Hot days, any length",
    before: "Start well hydrated. Consider salt before you roll.",
    during: "More fluid and more sodium than usual. Drink on a schedule, not just when you're parched.",
    after: "Weigh yourself before and after. Drink back what you lost over the next few hours.",
  },
];

export const SHORT_VERSION = [
  "Under an hour: water, and a snack if you're hungry.",
  "Over an hour: start fueling in the first 30 minutes and keep going.",
  "Over two and a half hours: fuel more, and practice it before race day.",
  "Hot out: more fluid, more salt, and don't overdo the water.",
];

export const SOURCES = [
  {
    cite: "Burke LM, Hawley JA, Wong SHS, Jeukendrup AE. Carbohydrates for training and competition. Journal of Sports Sciences. 2011.",
    link: { label: "PubMed 21660838", href: "https://pubmed.ncbi.nlm.nih.gov/21660838/" },
    note: "Source of the 30 to 60 g per hour and up to 90 g per hour for events over 2.5 hours ranges.",
  },
  {
    cite: "Thomas DT, Erdman KA, Burke LM. Nutrition and Athletic Performance. Joint position statement of the American College of Sports Medicine, Academy of Nutrition and Dietetics and Dietitians of Canada. 2016.",
    note: "Source of the fluid range and pre-exercise meal timing.",
  },
  {
    cite: "American College of Sports Medicine. Exercise and Fluid Replacement position stand. 2007.",
    note: "Source of the post-exercise fluid replacement guidance and the overdrinking caution.",
  },
];
