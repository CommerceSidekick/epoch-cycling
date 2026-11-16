// JSON-LD builders (6.9). Never MedicalOrganization, Physician, MedicalWebPage or Drug on this domain.
import { SITE } from "../config/site";
import { BRAND } from "../config/brand";

export const ORG_ID = `${SITE.url}/#org`;

export function orgSchema() {
  const sameAs = Object.values(SITE.social).filter(Boolean);
  const sport = ["Cycling", "Mountain biking"];
  if (BRAND.disciplines.find((d) => d.key === "gravel")?.live) sport.push("Gravel cycling");
  if (BRAND.disciplines.find((d) => d.key === "road")?.live) sport.push("Road cycling");
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": ORG_ID,
    name: BRAND.name,
    url: SITE.url,
    logo: `${SITE.url}/logo-512.png`,
    sport,
    email: SITE.emails.hello,
    parentOrganization: { "@type": "Organization", name: BRAND.family, url: SITE.masterUrl },
    sameAs,
  };
}

export function websiteSchema() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE.url}/#website`, name: BRAND.name, url: SITE.url, publisher: { "@id": ORG_ID } };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.path === "/" ? "" : it.path}` })),
  };
}

export function faqSchema(entries: { q: string; a: string }[]) {
  const strip = (s: string) => s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1").replace(/[*_`]/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({ "@type": "Question", name: e.q, acceptedAnswer: { "@type": "Answer", text: strip(e.a) } })),
  };
}

export function articleSchema(a: { title: string; author: string; date: Date; image: string; url: string; dek: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    author: a.author === BRAND.name ? { "@type": "Organization", name: BRAND.name } : { "@type": "Person", name: a.author },
    datePublished: a.date.toISOString(),
    image: [a.image],
    mainEntityOfPage: a.url,
    publisher: { "@id": ORG_ID },
  };
}
