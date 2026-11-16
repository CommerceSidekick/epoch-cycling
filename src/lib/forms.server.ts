// Server-side validation, routing and delivery for /api/forms (6.7).
import { z } from "astro/zod";
import {
  RIDE_OPTS, INTEREST_OPTS, APPLY_AS_OPTS, DISCIPLINE_OPTS, LICENSE_OPTS, RACES_OPTS, FOLLOWER_OPTS, HOST_OPTS, JERSEY_OPTS, TOPIC_OPTS,
  CONSENT_TEXT, type FormName,
} from "./form-fields";
import { SITE } from "../config/site";
import { getSecret } from "astro:env/server";
const env = (k: string) => getSecret(k) ?? process.env[k];

const vals = (o: { value: string }[]) => o.map((x) => x.value) as [string, ...string[]];
const str = (max: number) => z.string().trim().max(max);
const opt = (max: number) => z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));
const yes = z.literal(true, { error: "Check this box to continue" });
const bool = z.boolean().default(false);
const email = z.email({ error: "Enter an email like name@example.com" }).max(254);

const waitlist = z.strictObject({
  first_name: str(60).min(1, { error: "This one's required" }),
  email,
  zip: z.string().trim().regex(/^\d{5}$/, { error: "Enter a 5-digit ZIP code" }).optional().or(z.literal("")).transform((v) => v || undefined),
  ride: z.enum(vals(RIDE_OPTS)).optional().or(z.literal("")).transform((v) => v || undefined),
  interests: z.array(z.enum(vals(INTEREST_OPTS))).max(INTEREST_OPTS.length).default([]),
  over18: yes,
  marketing: yes,
});

const application = z.strictObject({
  first_name: str(60).min(1, { error: "This one's required" }),
  last_name: str(60).min(1, { error: "This one's required" }),
  email,
  phone: opt(30),
  city_state: str(80).min(1, { error: "This one's required" }),
  apply_as: z.enum(vals(APPLY_AS_OPTS), { error: "This one's required" }),
  disciplines: z.array(z.enum(vals(DISCIPLINE_OPTS))).min(1, { error: "Pick at least one" }),
  license: z.enum(vals(LICENSE_OPTS), { error: "This one's required" }),
  races_count: z.enum(vals(RACES_OPTS)).optional().or(z.literal("")).transform((v) => v || undefined),
  races_calendar: opt(1000),
  results_url: z.url({ error: "Enter a full link, starting with https://" }).max(500).optional().or(z.literal("")).transform((v) => v || undefined),
  social: opt(80),
  followers: z.enum(vals(FOLLOWER_OPTS)).optional().or(z.literal("")).transform((v) => v || undefined),
  host_ride: z.enum(vals(HOST_OPTS)).optional().or(z.literal("")).transform((v) => v || undefined),
  jersey: z.enum(vals(JERSEY_OPTS)).optional().or(z.literal("")).transform((v) => v || undefined),
  about: str(800).min(1, { error: "This one's required" }),
  over18: yes,
  read_terms: yes,
  will_disclose: yes,
  anti_doping: yes,
  marketing: bool,
}).superRefine((d, ctx) => {
  if ((d.apply_as === "racer" || d.apply_as === "both") && !d.races_count) ctx.addIssue({ code: "custom", path: ["races_count"], message: "This one's required" });
  if ((d.apply_as === "ambassador" || d.apply_as === "both") && !d.followers) ctx.addIssue({ code: "custom", path: ["followers"], message: "This one's required" });
});

const contact = z.strictObject({
  name: str(80).min(1, { error: "This one's required" }),
  email,
  topic: z.enum(vals(TOPIC_OPTS), { error: "This one's required" }),
  event_name: opt(120),
  message: str(2000).min(1, { error: "This one's required" }),
});

const footer_signup = z.strictObject({ email, marketing: yes });

export const SCHEMAS = { waitlist, riders_club_application: application, contact, footer_signup } as const;

const ARRAY_FIELDS = new Set(["interests", "disciplines"]);
const BOOL_FIELDS = new Set(["over18", "marketing", "read_terms", "will_disclose", "anti_doping"]);
const FORM_BOOLS: Record<FormName, string[]> = {
  waitlist: ["over18", "marketing"],
  riders_club_application: ["over18", "read_terms", "will_disclose", "anti_doping", "marketing"],
  contact: [],
  footer_signup: ["marketing"],
};
const META_FIELDS = new Set(["form", "site", "company", "cf-turnstile-response", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);

/** Turns FormData into a plain object: arrays for checkbox groups, booleans for single checkboxes. */
export function normalize(fd: FormData, form: FormName) {
  const data: Record<string, unknown> = {};
  const meta: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v !== "string") continue;
    if (META_FIELDS.has(k)) { meta[k] = v; continue; }
    if (ARRAY_FIELDS.has(k)) { (data[k] ??= [] as string[]); (data[k] as string[]).push(v); continue; }
    if (BOOL_FIELDS.has(k)) { data[k] = v === "on" || v === "true" || v === "yes"; continue; }
    data[k] = v;
  }
  for (const b of FORM_BOOLS[form]) if (!(b in data)) data[b] = false;
  return { data, meta };
}

export function routeTo(form: FormName, data: Record<string, unknown>): string {
  if (form === "waitlist" || form === "footer_signup") return "marketing-list";
  if (form === "riders_club_application") return SITE.emails.club;
  const t = String(data.topic ?? "other");
  if (["club", "claim", "host", "ambassador"].includes(t)) return SITE.emails.club;
  if (["fuel", "app", "integration"].includes(t)) return SITE.emails.support;
  if (t === "privacy") return SITE.emails.privacy;
  return SITE.emails.hello;
}

export function buildEnvelope(form: FormName, data: Record<string, any>, meta: Record<string, string>) {
  const now = new Date().toISOString();
  const { over18, read_terms, will_disclose, anti_doping, marketing, ...rest } = data;
  const consentText = (CONSENT_TEXT as Record<string, string>)[form];
  return {
    site: "epochcycling",
    form,
    submittedAt: now,
    data: rest,
    consent: consentText ? { marketing: !!marketing, text: consentText, at: now } : undefined,
    attestations:
      form === "riders_club_application"
        ? { over18: !!over18, readTerms: !!read_terms, willDisclose: !!will_disclose, antiDopingResponsibility: !!anti_doping }
        : form === "waitlist" ? { over18: !!over18 } : undefined,
    utm: { source: meta.utm_source ?? "", medium: meta.utm_medium ?? "", campaign: meta.utm_campaign ?? "" },
    routeTo: routeTo(form, data),
  };
}

async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = env("TURNSTILE_SECRET");
  if (!secret) return true; // not configured yet: honeypot + rate limit only
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const j = (await r.json().catch(() => ({}))) as { success?: boolean };
  return !!j.success;
}

/** Delivers to Supabase (table form_submissions) and/or a signed webhook. Returns which sinks accepted it. */
export async function deliver(envelope: ReturnType<typeof buildEnvelope>) {
  const sinks: string[] = [];
  const errors: string[] = [];
  const sbUrl = env("SUPABASE_URL");
  const sbKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (sbUrl && sbKey) {
    const r = await fetch(`${sbUrl.replace(/\/$/, "")}/rest/v1/form_submissions`, {
      method: "POST",
      headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        site: envelope.site,
        form: envelope.form,
        submitted_at: envelope.submittedAt,
        route_to: envelope.routeTo,
        data: envelope.data,
        consent: envelope.consent ?? null,
        attestations: envelope.attestations ?? null,
        utm: envelope.utm,
      }),
    });
    if (r.ok) sinks.push("supabase"); else errors.push(`supabase ${r.status}`);
  }
  const hook = env("FORM_WEBHOOK_URL");
  if (hook) {
    const body = JSON.stringify(envelope);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (env("FORM_WEBHOOK_SECRET")) headers["X-Epoch-Signature"] = await hmac(env("FORM_WEBHOOK_SECRET"), body);
    const r = await fetch(hook, { method: "POST", headers, body });
    if (r.ok) sinks.push("webhook"); else errors.push(`webhook ${r.status}`);
  }
  return { sinks, errors, configured: !!(sbUrl && sbKey) || !!hook };
}
