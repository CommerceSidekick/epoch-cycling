// Cookieless, Plausible-compatible. track() is a no-op until PUBLIC_ANALYTICS_DOMAIN is set.
// Never send form data, emails or anything health-related. Events: cta_click, form_submit,
// outbound_click (domain only), filter_change, faq_open, section_view.
declare global { interface Window { plausible?: (e: string, o?: { props?: Record<string, string> }) => void } }
export function track(event: string, props: Record<string, string> = {}) {
  try { window.plausible?.(event, { props }); } catch { /* no-op */ }
}
