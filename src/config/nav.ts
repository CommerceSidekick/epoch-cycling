import { BRAND } from "./brand";

// Main menu (owner decision 2026-11-16): Ride / Fuel / Optimize / Disciplines / Pricing / About.
// Dropdown items carry a one-line description, like the Epoch Health System menu.
export type NavLink = { label: string; href: string; soon?: boolean; external?: boolean; sub?: string; icon?: "ride" | "fuel" | "optimize" | "calendar" | "check" | "mountain" | "shield" };
export type NavGroup = { label: string; href?: string; id: string; items?: NavLink[]; dividerBeforeLast?: boolean };

export const NAV: NavGroup[] = [
  {
    label: BRAND.PILLAR_1_WORD, href: "/ride", id: "ride",
    items: [
      { label: "Riders Club", href: "/ride", sub: "Group rides, jerseys and the crew. Free.", icon: "ride" },
      { label: "Events and group rides", href: "/ride/events", sub: "Find a ride near you.", icon: "calendar" },
      { label: "The race deal", href: "/ride/sponsorship", sub: "Race in the kit. We'll help cover your entry.", icon: "check" },
      { label: "Apply", href: "/ride/apply", sub: "Club racer or ambassador.", icon: "mountain" },
    ],
  },
  {
    label: BRAND.PILLAR_2_WORD, href: "/fuel", id: "fuel",
    items: [
      { label: "Epoch Endurance", href: "/fuel/epoch-endurance", sub: "Custom endurance mix. Coming soon.", icon: "fuel" },
      { label: "Epoch Fuel", href: "/fuel/epoch-fuel", sub: "Performance and recovery support. Coming soon.", icon: "fuel" },
      { label: "Epoch Edge", href: "/fuel/epoch-edge", sub: "Focus and mental performance. Coming soon.", icon: "fuel" },
      { label: "How to fuel a ride", href: "/fuel/guide", sub: "Before, during and after, by ride length.", icon: "calendar" },
    ],
  },
  {
    label: BRAND.PILLAR_3_WORD, href: "/optimize", id: "optimize", dividerBeforeLast: true,
    items: [
      { label: "The app", href: "/optimize#app", sub: `${BRAND.services.app}. Free.`, icon: "optimize" },
      { label: "Coaching", href: "/optimize#coaching", sub: `${BRAND.services.coaching}.`, icon: "check" },
      { label: BRAND.program, href: "/optimize/medical", external: true, sub: "Physician-led programs, at Epoch Health System.", icon: "shield" },
    ],
  },
  {
    label: "Disciplines", id: "disciplines",
    items: [
      { label: "MTB", href: "/mtb", sub: "Enduro, XC, downhill, trail. Live now.", icon: "mountain" },
      { label: "Gravel", href: "/gravel", soon: true, sub: "Long dirt roads. Coming next." },
      { label: "Road", href: "/road", soon: true, sub: "Pacelines and crits. After that." },
    ],
  },
  { label: "Pricing", href: "/pricing", id: "pricing" },
  { label: "About", href: "/about", id: "about" },
];

const group = (id: string) => NAV.find((g) => g.id === id)!.items!;

export const FOOTER_COLS: { title: string; links: NavLink[] }[] = [
  { title: "Ride", links: [...group("ride"), { label: "The team", href: "/ride/team" }] },
  { title: "Disciplines", links: group("disciplines") },
  { title: "Fuel", links: group("fuel") },
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
      { label: "Pricing", href: "/pricing" },
      { label: "Stories", href: "/stories" },
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
