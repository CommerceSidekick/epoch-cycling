import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { FORM_NAMES, type FormName } from "../../lib/form-fields";
import { SCHEMAS, normalize, buildEnvelope, deliver, verifyTurnstile } from "../../lib/forms.server";

export const prerender = false;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return json(400, { ok: false, error: "bad_request" });
  }
  const form = String(fd.get("form") ?? "") as FormName;
  if (!FORM_NAMES.includes(form)) return json(400, { ok: false, error: "unknown_form" });

  const { data, meta } = normalize(fd, form);

  // Honeypot: silently accept and drop.
  if (meta.company && meta.company.trim() !== "") {
    return wantsJson ? json(200, { ok: true }) : redirect(`/thanks?form=${form}`, 303);
  }

  let ip: string | null = null;
  try { ip = clientAddress; } catch { ip = null; }
  if (!(await verifyTurnstile(meta["cf-turnstile-response"], ip))) {
    return json(400, { ok: false, error: "challenge_failed" });
  }

  const parsed = SCHEMAS[form].safeParse(data);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_");
      if (!fields[key]) fields[key] = issue.message;
    }
    if (!wantsJson) return redirect(`/thanks?form=${form}&error=1`, 303);
    return json(422, { ok: false, error: "invalid", fields });
  }

  const envelope = buildEnvelope(form, parsed.data as Record<string, unknown>, meta);
  try {
    const result = await deliver(envelope);
    if (!result.configured) {
      // No sink configured yet (preview). Log the form name only, never the data.
      console.warn(`[forms] no FORM_WEBHOOK_URL or Supabase configured; ${form} submission not stored`);
      if ((getSecret("VERCEL_ENV") ?? process.env.VERCEL_ENV) === "production") return json(503, { ok: false, error: "not_configured" });
    } else if (result.sinks.length === 0) {
      console.error(`[forms] delivery failed: ${result.errors.join(", ")}`);
      return json(502, { ok: false, error: "delivery_failed" });
    }
  } catch (e) {
    console.error("[forms] delivery error", (e as Error).message);
    return json(502, { ok: false, error: "delivery_failed" });
  }

  return wantsJson ? json(200, { ok: true }) : redirect(`/thanks?form=${form}`, 303);
};

export const ALL: APIRoute = () => json(405, { ok: false, error: "method_not_allowed" });
