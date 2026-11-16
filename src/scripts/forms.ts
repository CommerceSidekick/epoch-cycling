import { track } from "../lib/analytics";

const MSG = {
  required: "This one's required",
  check: "Check this box to continue",
  email: "Enter an email like name@example.com",
  url: "Enter a full link, starting with https://",
  zip: "Enter a 5-digit ZIP code",
  group: "Pick at least one",
  tooLong: (n: number) => `Keep it under ${n} characters`,
};

const params = new URLSearchParams(location.search);

function matches(form: HTMLFormElement, rule: string) {
  // "field=a|b"
  const [name, vals] = rule.split("=");
  const allowed = vals.split("|");
  const els = Array.from(form.elements).filter((el) => (el as HTMLInputElement).name === name) as HTMLInputElement[];
  return els.some((el) => {
    if (el.type === "radio" || el.type === "checkbox") return el.checked && allowed.includes(el.value);
    return allowed.includes(el.value);
  });
}

function applyConditions(form: HTMLFormElement) {
  form.querySelectorAll<HTMLElement>("[data-show-when]").forEach((el) => {
    const show = matches(form, el.dataset.showWhen!);
    el.hidden = !show;
  });
  form.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-required-when]").forEach((el) => {
    const req = matches(form, el.dataset.requiredWhen!);
    el.required = req;
    el.setAttribute("aria-required", req ? "true" : "false");
    el.closest(".field")?.querySelector<HTMLElement>("[data-req-mark]")?.toggleAttribute("hidden", !req);
  });
}

function setError(form: HTMLFormElement, name: string, msg: string) {
  const err = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
  if (err) err.textContent = msg;
  form.querySelectorAll<HTMLElement>(`[name="${name}"]`).forEach((el) => {
    if ((el as HTMLInputElement).type === "checkbox" && el.closest("fieldset")) return;
    if ((el as HTMLInputElement).type === "radio") return;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
  });
  const group = form.querySelector<HTMLElement>(`[data-group="${name}"]`);
  if (group) group.setAttribute("aria-invalid", msg ? "true" : "false");
}

function validate(form: HTMLFormElement) {
  let firstBad: HTMLElement | null = null;
  const seen = new Set<string>();
  // groups
  form.querySelectorAll<HTMLElement>("[data-group]").forEach((g) => {
    if (g.hidden) return;
    const name = g.dataset.group!;
    seen.add(name);
    const inputs = Array.from(g.querySelectorAll<HTMLInputElement>("input"));
    const checked = inputs.filter((i) => i.checked).length;
    const min = Number(g.dataset.min ?? (g.dataset.required ? 1 : 0));
    const bad = checked < min;
    setError(form, name, bad ? (inputs[0]?.type === "radio" ? MSG.required : MSG.group) : "");
    if (bad && !firstBad) firstBad = inputs[0];
  });
  Array.from(form.elements).forEach((el) => {
    const i = el as HTMLInputElement;
    if (!i.name || seen.has(i.name) || i.type === "hidden" || i.closest(".hp") || i.closest("[hidden]")) return;
    let msg = "";
    const v = i.validity;
    if (v && !v.valid) {
      if (v.valueMissing) msg = i.type === "checkbox" ? MSG.check : MSG.required;
      else if (v.typeMismatch) msg = i.type === "email" ? MSG.email : i.type === "url" ? MSG.url : MSG.required;
      else if (v.patternMismatch) msg = i.name === "zip" ? MSG.zip : MSG.required;
      else if (v.tooLong) msg = MSG.tooLong(i.maxLength);
    }
    if (!msg && i.type === "url" && i.value && !/^https?:\/\//i.test(i.value)) msg = MSG.url;
    setError(form, i.name, msg);
    if (msg && !firstBad) firstBad = i;
  });
  return firstBad as HTMLElement | null;
}

document.querySelectorAll<HTMLFormElement>("form[data-epoch-form]").forEach((form) => {
  const name = form.dataset.epochForm!;
  form.noValidate = true;
  const status = form.querySelector<HTMLElement>("[data-status]");
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  const label = submit?.querySelector<HTMLElement>("[data-submit-label]");
  const original = label?.textContent ?? "";

  // UTM capture (never emails in URLs)
  form.querySelectorAll<HTMLInputElement>("[data-utm]").forEach((i) => { i.value = params.get(i.dataset.utm!) ?? ""; });

  // Preselects: ?interest=a,b  ?type=racer  ?topic=host
  form.querySelectorAll<HTMLElement>("[data-preselect]").forEach((g) => {
    const raw = params.get(g.dataset.preselect!) ?? g.closest<HTMLElement>("[data-preset-interest]")?.dataset.presetInterest ?? "";
    const wanted = raw.split(",").map((s) => s.trim()).filter(Boolean);
    g.querySelectorAll<HTMLInputElement>("input").forEach((i) => { if (wanted.includes(i.value)) i.checked = true; });
  });
  form.querySelectorAll<HTMLElement>("[data-preselect-select]").forEach((w) => {
    const p = params.get(w.dataset.preselectSelect!);
    const sel = w.querySelector("select");
    if (p && sel && Array.from(sel.options).some((o) => o.value === p)) sel.value = p;
  });

  // Counters
  form.querySelectorAll<HTMLTextAreaElement>("textarea[data-counter]").forEach((t) => {
    const out = form.querySelector<HTMLElement>(`[data-count-for="${t.id}"]`);
    const upd = () => { if (out) out.textContent = `${t.value.length} of ${t.maxLength}`; };
    t.addEventListener("input", upd);
    upd();
  });

  applyConditions(form);
  form.addEventListener("change", () => applyConditions(form));
  form.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.getAttribute("aria-invalid") === "true" && t.validity?.valid) setError(form, t.name, "");
  });

  let busy = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (busy) return;
    if (status) { status.textContent = ""; status.removeAttribute("data-state"); }
    const bad = validate(form);
    if (bad) {
      bad.focus();
      if (status) { status.dataset.state = "error"; status.textContent = form.dataset.error ?? "Check the highlighted fields and try again."; }
      return;
    }
    busy = true;
    submit?.setAttribute("aria-busy", "true");
    if (label) label.textContent = "Sending...";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        track("form_submit", { form: name });
        Array.from(form.children).forEach((c) => { if (!(c as HTMLElement).matches("[data-status]")) (c as HTMLElement).hidden = true; });
        if (status) { status.dataset.state = "success"; status.textContent = form.dataset.success ?? "Done."; status.setAttribute("tabindex", "-1"); status.focus(); }
      } else {
        if (body.fields) {
          let first: HTMLElement | null = null;
          for (const [k, m] of Object.entries(body.fields as Record<string, string>)) { setError(form, k, m); first ??= form.querySelector<HTMLElement>(`[name="${k}"]`); }
          first?.focus();
        }
        if (status) { status.dataset.state = "error"; status.textContent = form.dataset.error ?? "That didn't go through."; }
      }
    } catch {
      if (status) { status.dataset.state = "error"; status.textContent = form.dataset.error ?? "That didn't go through."; }
    } finally {
      busy = false;
      submit?.removeAttribute("aria-busy");
      if (label) label.textContent = original;
    }
  });
});
