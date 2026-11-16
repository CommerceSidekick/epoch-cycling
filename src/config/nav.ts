import { BRAND } from "./brand";

export type NavLink = { label: string; href: string; soon?: boolean; external?: boolean; sub?: string };
export type NavGroup = { label: string; href?: string; id: string; items: NavLink[]; dividerBeforeLast?: boolean };

export const NAV: NavGroup[] = [
  {
    label: BRAND.PILLAR_1_WORD, href: "/ride", id: "ride",
    items: [
      { label: "Riders Club", href: "/ride" },
      { label: "Events and group rides", href: "/ride/events" },
      { label: "The team", href: "/ride/team" },
      { label: "The race deal", href: "/ride/sponsorship" },
      { label: "Apply", href: "/ride/apply" },
    ],
  },
  {
    label: "Disciplines", id: "disciplines",
    items: [
      { label: "MTB", href: "/mtb" },
      { label: "Gravel", href: "/gravel", soon: true },
      { label: "Road", href: "/road", soon: true },
    ],
  },
  {
    label: BRAND.PILLAR_2_WORD, href: "/fuel", id: "fuel",
    items: [
      { label: "Epoch Fuel", href: "/fuel/epoch-fuel" },
      { label: "Epoch Salt", href: "/fuel/epoch-salt" },
      { label: "How to fuel a ride", href: "/fuel/guide" },
    ],
  },
  {
    label: BRAND.PILLAR_3_WORD, href: "/optimize", id: "optimize", dividerBeforeLast: true,
    items: [
      { label: "The app", href: "/optimize#app", sub: BRAND.services.app },
      { label: "Coaching", href: "/optimize#coaching", sub: BRAND.services.coaching },
      { label: "Labs", href: "/optimize#labs" },
      { label: BRAND.program, href: "/optimize/medical", external: true, sub: `Incl. ${BRAND.services.edge}, at Epoch Health System` },
    ],
  },
];

export const FOOTER_COLS: { title: string; links: NavLink[] }[] = [
  { title: "Ride", links: NAV[0].items },
  { title: "Disciplines", links: NAV[1].items },
  { title: "Fuel", links: NAV[2].items },
  {
    title: "Optimize",
    links: [
      { label: "The app", href: "/optimize#app" },
      { label: "Coaching", href: "/optimize#coaching" },
      { label: "Labs", href: "/optimize#labs" },
      { label: BRAND.program, href: "/optimize/medical", external: true },
    ],
  },
  {
    title: "Club",
    links: [
      { label: "Stories", href: "/stories" },
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
