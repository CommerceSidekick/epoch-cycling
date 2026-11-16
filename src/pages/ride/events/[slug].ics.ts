import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { buildIcs } from "../../../lib/ics";
import { SITE } from "../../../config/site";

export const getStaticPaths = (async () => {
  const events = await getCollection("events");
  return events.map((event) => ({ params: { slug: event.id }, props: { event } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { event } = props as { event: CollectionEntry<"events"> };
  const e = event.data;
  const body = buildIcs({
    uid: event.id,
    title: e.title,
    start: e.start,
    end: e.end,
    location: `${e.location.name}, ${e.location.city}, ${e.location.state}`,
    description: (event.body ?? "").replace(/[#*_>`]/g, "").trim().slice(0, 500),
    url: `${SITE.url}/ride/events/${event.id}`,
  });
  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${event.id}.ics"` } });
};
