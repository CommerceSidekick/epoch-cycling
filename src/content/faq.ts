// FAQ (spec 5.17): 21 entries in 7 groups, stable ids for deep links. Answers are markdown.
// Owner and counsel confirm answers 6, 11, 16 and 20 before launch.
import { SITE } from "../config/site";

export type FaqGroup = "club" | "race-deal" | "anti-doping" | "fuel" | "app" | "medical" | "general";
export type FaqEntry = { id: string; group: FaqGroup; q: string; a: string };

export const FAQ_GROUPS: { id: FaqGroup; label: string }[] = [
  { id: "club", label: "The club" },
  { id: "race-deal", label: "The race deal" },
  { id: "anti-doping", label: "Racing clean" },
  { id: "fuel", label: "Fuel" },
  { id: "app", label: "The app and coaching" },
  { id: "medical", label: "Medical guidance" },
  { id: "general", label: "Everything else" },
];

const rc = SITE.ridersClub;
const ph = (v: string, label: string) => (v ? v : `[${label}]`);
const cert = SITE.certification;

export const FAQ: FaqEntry[] = [
  { id: "what-is-epoch-cycling", group: "club", q: "What is Epoch Cycling?", a: "The riding tribe of Epoch Health System. A riders club with group rides, events and team kits, our own ride fuel, and a free app for training smarter. Mountain bike first, then gravel and road." },
  { id: "cost-to-join", group: "club", q: "Does it cost anything to join the Riders Club?", a: "No. Membership is free. Club racer and ambassador spots are by application." },
  { id: "do-i-have-to-be-fast", group: "club", q: "Do I have to be fast?", a: "No. Group rides are open to every level, and every ride has a regroup plan and a sweep. Club racers aren't picked on speed alone. We back riders who show up and bring people with them." },
  { id: "no-rides-near-me", group: "club", q: "I'm not near any group rides. Can I still join?", a: "Yes. Join with your ZIP code and we'll tell you when a ride pops up near you. Or host one. [Tell us](/contact?topic=host)." },

  { id: "how-race-deal-works", group: "race-deal", q: "How does the race deal work?", a: "Apply and get accepted as a Club racer. Wear the Epoch kit and fuel with Epoch Fuel or Salt on race day. Send your result, a photo in the kit, your entry receipt and a disclosed post, and we help cover your entry under the [Riders Club terms](/riders-club-terms)." },
  { id: "which-races-count", group: "race-deal", q: "Which races count, and how much is covered?", a: `Up to ${ph(rc.entryCap, "entry cap")} per race and ${ph(rc.racesPerSeason, "races per season")} races per season, for ${ph(rc.eligibleRaces, "eligible races")}. Full details in the terms.` },
  { id: "disclose-sponsorship", group: "race-deal", q: "Do I have to say I'm sponsored?", a: "Yes. Every post about Epoch needs a clear disclosure, like #ad plus #EpochAthlete at the start of the caption, or the platform's paid-partnership label. It's the law, and it's the honest thing to do." },
  { id: "race-deal-medical", group: "race-deal", q: "Does the race deal have anything to do with the app, coaching or medical programs?", a: "No. The deal is fuel and kit. You never need a paid app plan, coaching or any medical program to join, stay in, or get help with an entry. We'll never ask you to." },

  { id: "anti-doping", group: "anti-doping", q: "Do I need peptides to get faster?", a: "No. For almost every rider, the big wins are boring and free: ride consistently, sleep, fuel your rides, recover, and race a lot. Peptides are prescription territory, the human evidence for many of them is thin, some aren't approved for human use at all, and many are banned in sport. If you race with a license, assume a peptide is prohibited until you've checked it on the WADA Prohibited List or Global DRO. The Riders Club never requires or rewards anything beyond fuel and kit." },
  { id: "licensed-racer", group: "anti-doping", q: "I race with a USA Cycling or UCI license. What do I need to know?", a: "Anti-doping rules apply to you, and you're responsible for everything in your body. Many prescription medications, including some hormones and peptides, are prohibited, some at all times. Before you take any medication or supplement, check it on the [WADA Prohibited List](https://www.wada-ama.org/en/prohibited-list) and [USADA's Global DRO](https://www.globaldro.com). If you need a prohibited medication for a medical reason, ask about a Therapeutic Use Exemption before you use it. This is general information, not legal or medical advice." },
  {
    id: "fuel-tested-racers", group: "anti-doping", q: "Are Epoch Fuel and Salt safe for tested racers?",
    a: SITE.flags.certifiedForSport
      ? `Epoch Fuel and Salt are certified by ${ph(cert.program, "certification program")}. Look up your batch at ${ph(cert.lookupUrl, "batch lookup URL")}. Certification lowers the risk. It doesn't remove your responsibility.`
      : "They aren't third-party certified for sport yet. We're working on it. Until then, check the label on Global DRO and against your federation's rules yourself. No supplement is risk-free.",
  },

  { id: "whats-in-it", group: "fuel", q: "What's in Epoch Fuel and Epoch Salt?", a: "Every ingredient and amount is on the label and on each product page. Full facts panels go up at launch." },
  { id: "how-much-to-eat", group: "fuel", q: "How much should I eat and drink on a ride?", a: "Depends on how long and how hot. Rough version: over an hour, 30 to 60 g of carbs per hour. Over two and a half hours, up to 90 g if your gut is trained. Drink to thirst, more in the heat, and don't overdrink. The [full guide](/fuel/guide) has the rest." },
  { id: "medical-condition", group: "fuel", q: "Can I take Epoch Fuel or Salt with a medical condition or medication?", a: "Talk to your clinician first. That goes for any supplement, and for salt products especially if you have high blood pressure, heart or kidney conditions." },

  { id: "is-the-app-free", group: "app", q: "Is the Epoch app free? Does it work with Strava or Garmin?", a: "Yes, the app is free, with training load, recovery and trends included. Strava and Garmin connections are planned, not live yet. We'll say when they are. Today it works with the sources listed on the [app page](/optimize#app)." },

  { id: "medically-guided-plan", group: "medical", q: "I want a medically guided plan. How does that work?", a: "That's Epoch Total Health, on the Epoch Health System site. It adds lab work and a licensed clinician to your training data. Its medically guided track is called EpochEdge. Any medical service is offered only by licensed clinicians, only after an evaluation, and only where permitted. Nothing is guaranteed. It's for adults 18 and over, and it's completely separate from the Riders Club. [Learn more](/optimize/medical)." },

  { id: "who-owns-my-data", group: "general", q: "Who owns my data?", a: "You do. Connect or disconnect sources, export your data, or delete your account any time. Details in our [privacy policy](/privacy)." },
  { id: "what-to-bring", group: "general", q: "What do I need for a group ride?", a: "A helmet, a bike in working order, water, a snack, a spare tube, and a signed waiver. You must be 18 or older at launch." },
  { id: "gravel-road-launch", group: "general", q: "When do Gravel and Road launch?", a: "Gravel is next, Road after that. [Get on the list](/join?interest=gravel,road) and you'll hear first." },
  { id: "shipping", group: "general", q: "Where do you ship? Where are you?", a: "We're starting in the U.S. Shipping details go up when Fuel and Salt launch." },
  { id: "medical-advice", group: "general", q: "Is any of this medical advice?", a: "No. This site, the app and the coaching give general information and training guidance. They aren't medical care. If something feels wrong, see a clinician. In an emergency, call 911." },
];

export const faqById = (id: string) => FAQ.find((f) => f.id === id)!;
