// URLs, emails, prices, Riders Club numbers and feature flags (spec 6.4).
// Empty string = "not decided yet". The site renders a visible, bracketed placeholder
// (data-placeholder) and `npm run build:strict` fails until every one is set.

export const SITE = {
  url: "https://epochcycling.com",
  masterUrl: "https://epochhealthsystem.com",
  // {{HANDOFF_URL}} default per spec token table. Switch to /total-health once the master adds it (A4).
  handoffUrl: "https://epochhealthsystem.com/system#medical",
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
  prices: { coach: "$75/year" }, // {{PRICE_COACH}} carried from master, owner to confirm
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
    showAnnouncement: true,
    showRiders: false,
    showJason: false,
    showTempoAI: false,
    certifiedForSport: false,
    legalApproved: false,
    claimsOpen: false,
    // Epoch Coach is an AI coach? (open decision D7). When true the required line renders.
    coachIsAI: true,
  },
  analyticsDomain: (import.meta.env.PUBLIC_ANALYTICS_DOMAIN as string | undefined) ?? "",
  turnstileSiteKey: (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ?? "",
};

export const isSet = (v: string | undefined | null) => typeof v === "string" && v.trim().length > 0;
