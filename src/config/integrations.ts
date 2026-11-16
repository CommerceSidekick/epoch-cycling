// App data sources. Owner confirms every status (O5). Text only, no partner logos.
export type Integration = {
  name: string;
  brings: string;
  status: "live" | "planned";
  flag?: "showTempoAI";
};

export const INTEGRATIONS: Integration[] = [
  { name: "Apple Health", brings: "activity, heart, sleep", status: "live" },
  { name: "Google Health Connect", brings: "steps, heart rate", status: "live" },
  { name: "Oura", brings: "sleep, temperature, HRV", status: "live" },
  { name: "WHOOP", brings: "strain, recovery", status: "live" },
  { name: "Hume", brings: "body composition", status: "live" },
  { name: "Cronometer", brings: "nutrition", status: "live" },
  { name: "Lab results", brings: "markers you upload", status: "live" },
  { name: "Strava", brings: "rides, training load", status: "planned" },
  { name: "Garmin", brings: "rides, heart rate, power", status: "planned" },
  { name: "Tempo.AI", brings: "training plans", status: "planned", flag: "showTempoAI" },
];
