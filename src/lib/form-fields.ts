// Field definitions shared by the form components (HTML constraints) and the server (zod).
// Exact labels and options from spec 5.3.2, 5.4.2 and 5.19.2. No form collects health data.

export type Opt = { value: string; label: string };

export const RIDE_OPTS: Opt[] = [
  { value: "mtb", label: "Mountain bike" },
  { value: "gravel", label: "Gravel" },
  { value: "road", label: "Road" },
  { value: "mix", label: "A bit of everything" },
  { value: "new", label: "Just getting started" },
];

export const INTEREST_OPTS: Opt[] = [
  { value: "rides", label: "Group rides near me" },
  { value: "kits", label: "Kit drops" },
  { value: "fuel", label: "Epoch supplements (Endurance, Fuel, Edge)" },
  { value: "app", label: "The Epoch app" },
  { value: "coaching", label: "Coaching" },
  { value: "mtb", label: "The Epoch MTB site" },
  { value: "gravel", label: "Gravel launch" },
  { value: "road", label: "Road launch" },
  { value: "race", label: "Racing with the club" },
  { value: "ambassador", label: "Being an ambassador" },
];

export const APPLY_AS_OPTS: Opt[] = [
  { value: "racer", label: "Club racer" },
  { value: "ambassador", label: "Ambassador" },
  { value: "both", label: "Both" },
];

export const DISCIPLINE_OPTS: Opt[] = [
  { value: "mtb-xc", label: "MTB: XC" },
  { value: "mtb-enduro", label: "MTB: enduro" },
  { value: "mtb-downhill", label: "MTB: downhill" },
  { value: "mtb-marathon", label: "MTB: marathon or endurance" },
  { value: "gravel", label: "Gravel" },
  { value: "road", label: "Road" },
  { value: "cyclocross", label: "Cyclocross" },
  { value: "not-racing", label: "Not racing yet" },
];

export const LICENSE_OPTS: Opt[] = [
  { value: "usac", label: "USA Cycling" },
  { value: "uci", label: "UCI" },
  { value: "other", label: "Another federation" },
  { value: "none", label: "No license" },
  { value: "unsure", label: "Not sure" },
];

export const RACES_OPTS: Opt[] = [
  { value: "0", label: "0" },
  { value: "1-3", label: "1 to 3" },
  { value: "4-6", label: "4 to 6" },
  { value: "7-10", label: "7 to 10" },
  { value: "10+", label: "More than 10" },
];

export const FOLLOWER_OPTS: Opt[] = [
  { value: "lt1k", label: "Under 1,000" },
  { value: "1k-5k", label: "1,000 to 5,000" },
  { value: "5k-25k", label: "5,000 to 25,000" },
  { value: "gt25k", label: "Over 25,000" },
  { value: "in-person", label: "I'd rather build the crew in person" },
];

export const HOST_OPTS: Opt[] = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "Not right now" },
];

export const JERSEY_OPTS: Opt[] = ["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({ value: s, label: s })).concat([{ value: "unsure", label: "Not sure" }]);

export const TOPIC_OPTS: Opt[] = [
  { value: "club", label: "The Riders Club" },
  { value: "claim", label: "Race deal claim or question" },
  { value: "host", label: "Events or hosting a ride" },
  { value: "ambassador", label: "Ambassadors" },
  { value: "fuel", label: "Epoch supplements" },
  { value: "app", label: "App and account help" },
  { value: "integration", label: "Request an integration" },
  { value: "partners", label: "Race organizers and partnerships" },
  { value: "press", label: "Press" },
  { value: "privacy", label: "Privacy and your data" },
  { value: "other", label: "Something else" },
];

export const CONSENT_TEXT = {
  waitlist: "Yes, email me about Epoch Cycling. Unsubscribe any time.",
  footer_signup: "Email me about Epoch Cycling.",
  riders_club_application: "Email me Epoch news and drops.",
};

export const FORM_NAMES = ["waitlist", "riders_club_application", "contact", "footer_signup"] as const;
export type FormName = (typeof FORM_NAMES)[number];

export const MESSAGES = {
  waitlist: { success: "You're in. Watch your inbox. Now is your time.", error: "That didn't go through. Check your email and try again." },
  footer_signup: { success: "You're in. Watch your inbox. Now is your time.", error: "That didn't go through. Check your email and try again." },
  riders_club_application: {
    success: "Application in. We review every two weeks. Keep riding.",
    error: "That didn't go through. Check the highlighted fields and try again. Still stuck? Email club@epochcycling.com.",
  },
  contact: { success: "Message sent. We'll get back to you within two business days.", error: "That didn't go through. Try again, or email us directly below." },
};
