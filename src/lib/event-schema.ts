// SportsEvent JSON-LD (6.9). Only for events hosted by Epoch that aren't cancelled.
import type { CollectionEntry } from "astro:content";
import { SITE } from "../config/site";
import { ORG_ID } from "./schema";

const SPORT = { mtb: "Mountain biking", gravel: "Gravel cycling", road: "Road cycling" } as const;

/** ISO 8601 with the event's own UTC offset, e.g. 2027-03-07T07:00:00-08:00 */
export function isoWithOffset(d: Date, tz: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZoneName: "longOffset" })
      .formatToParts(d).map((p) => [p.type, p.value]),
  );
  const off = (parts.timeZoneName ?? "GMT").replace("GMT", "") || "+00:00";
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${off}`;
}

export function eventSchema(ev: CollectionEntry<"events">, pageUrl: string, imageUrl: string, description: string) {
  const e = ev.data;
  if (!e.hostedByEpoch || e.status === "cancelled") return null;
  const end = e.end ?? new Date(e.start.getTime() + 2 * 60 * 60 * 1000);
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: e.title,
    startDate: isoWithOffset(e.start, e.timezone),
    endDate: isoWithOffset(end, e.timezone),
    eventStatus: e.status === "postponed" ? "https://schema.org/EventPostponed" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    sport: SPORT[e.disciplines[0]],
    location: {
      "@type": "Place",
      name: e.location.name,
      address: { "@type": "PostalAddress", addressLocality: e.location.city, addressRegion: e.location.state, addressCountry: "US" },
    },
    organizer: { "@id": ORG_ID },
    isAccessibleForFree: e.isFree,
    ...(e.isFree ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", url: pageUrl } } : {}),
    description: description.slice(0, 160),
    image: [imageUrl.startsWith("http") ? imageUrl : `${SITE.url}${imageUrl}`],
  };
}
