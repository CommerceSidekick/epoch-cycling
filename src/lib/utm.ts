const MASTER_HOSTS = ["epochhealthsystem.com", "www.epochhealthsystem.com", "app.epochhealthsystem.com", "epoch-health-system.vercel.app"];

export function isMasterDomain(href: string): boolean {
  try {
    const u = new URL(href);
    return MASTER_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

/** Adds utm_source=epochcycling&utm_medium=referral&utm_campaign=<location> to master-domain links (4.5). */
export function withUtm(href: string, campaign: string): string {
  if (!isMasterDomain(href)) return href;
  const u = new URL(href);
  u.searchParams.set("utm_source", "epochcycling");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}
