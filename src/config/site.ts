// URLs, emails, prices, Riders Club numbers and feature flags (spec 6.4).
// Empty string = "not decided yet". The site renders a visible, bracketed placeholder
// (data-placeholder) and `npm run build:strict` fails until every one is set.

export const SITE = {
  url: "https://epochcycling.com",
  // Concept phase: the owned domains are parked, so links go to the live Epoch Health System
  // concept site. Switch to https://epochhealthsystem.com when that domain moves to Vercel.
  masterUrl: "https://epoch-health-system.vercel.app",
  // Personalized Health starts riders at the Performance program ("Find your edge.").
  handoffUrl: "https://epoch-health-system.vercel.app/personalized-health/performance",
  // Dedicated Epoch MTB site (owner 2026-11-16). Concept preview on the Epoch Health System
  // project (branch epoch-mtb); switch to https://epochmtb.com when it has its own project.
  mtbSiteUrl: "https://epoch-health-system-git-epoch-mtb-commercesidekicks-projects.vercel.app",
  // {{APP_URL}} shared with master.
  appUrl: "https://app.epochhealthsystem.com",
  appStoreUrl: "",
  playStoreUrl: "",
  waiverUrl: "", // {{WAIVER_URL}}: rides without a waiver URL cannot publish
  legalEntity: "", // {{LEGAL_ENTITY_NAME}}
  address: "", // {{REGISTERED_ADDRESS}}
  emails: {
    club: "club@epochcycling.com",
    hello: "hello@epochcycling.com",
    support: "support@epochhealthsystem.com",
    privacy: "privacy@epochhealthsystem.com",
  },
  // App plan prices mirror epochhealthsystem.com/pricing (2026-11-16). Owner confirms. Never list medical prices here.
  prices: { free: "$0", plus: "$36", coach: "$75", period: "/year" },
  ridersClub: {
    eligibleRaces: "", // {{RC_ELIGIBLE_RACES}}
    entryCap: "", // {{RC_ENTRY_CAP}}
    racesPerSeason: "", // {{RC_RACES_PER_SEASON}}
    spots: "", // {{RC_SPOTS}}
    claimWindowDays: "", // {{RC_CLAIM_WINDOW_DAYS}}
    seasonDates: "", // {{RC_SEASON_DATES}}
    reviewCadence: "every two weeks",
    states: "the U.S.",
  },
  certification: { program: "", lookupUrl: "" },
  dietitian: { name: "", credential: "" },
  social: { instagram: "", tiktok: "", youtube: "", strava: "" },
  appFeatures: {
    // Owner confirms each against the live app before launch (L12).
    trainingLoad: { live: true },
    recovery: { live: true },
    readiness: { live: false },
    rideData: { live: true },
    trends: { live: true },
    fuelLog: { live: false },
    labUpload: { live: false },
  },
  fuelClaims: { gmpConfirmed: false, testingConfirmed: false },
  flags: {
    appStatus: "waitlist" as "waitlist" | "live",
    // Owner removed scrolling banners and the announcement strip on Epoch Health System (2026-11-16). Same here.
    showAnnouncement: false,
    showRiders: false,
    showJason: false,
    showTempoAI: false,
    certifiedForSport: false,
    legalApproved: false,
    claimsOpen: false,
    // Coaching is fitness and lifestyle coaching (owner 2026-11-16). No AI line.
    coachIsAI: false,
  },
  analyticsDomain: (import.meta.env.PUBLIC_ANALYTICS_DOMAIN as string | undefined) ?? "",
  turnstileSiteKey: (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ?? "",
};

export const isSet = (v: string | undefined | null) => typeof v === "string" && v.trim().length > 0;
