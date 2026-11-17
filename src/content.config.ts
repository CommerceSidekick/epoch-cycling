import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const discipline = z.enum(["mtb", "gravel", "road"]);

const riders = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/riders" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.enum(["racer", "ambassador", "host", "staff"]),
      disciplines: z.array(discipline).min(1),
      city: z.string(),
      state: z.string().length(2),
      photo: image(),
      photoAlt: z.string().min(10),
      bio: z.string().max(240),
      title: z.string().optional(), // staff role line, e.g. "Founder"
      number: z.string().regex(/^\d{3}$/).optional(),
      instagram: z.string().optional(),
      strava: z.url().optional(),
      sponsored: z.boolean(),
      featured: z.boolean().default(false),
      consentOnFile: z.boolean(),
      consentDate: z.coerce.date().optional(),
      placeholder: z.boolean().default(false),
    }).refine((r) => !r.consentOnFile || !!r.consentDate, { message: "consentDate required when consentOnFile" }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.enum(["group-ride", "race", "clinic", "meetup"]),
      disciplines: z.array(discipline).min(1),
      hostedByEpoch: z.boolean(),
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
      timezone: z.string(),
      location: z.object({ name: z.string(), city: z.string(), state: z.string().length(2), mapsUrl: z.url().optional() }),
      level: z.enum(["All levels", "Beginner friendly", "Intermediate", "Fast"]),
      distanceMi: z.number().optional(),
      climbingFt: z.number().optional(),
      host: z.string(),
      rsvpUrl: z.url().optional(),
      registrationUrl: z.url().optional(),
      waiverRequired: z.boolean(),
      capacity: z.number().int().optional(),
      isFree: z.boolean().default(true),
      entryEligible: z.boolean().default(false),
      status: z.enum(["scheduled", "cancelled", "postponed"]).default("scheduled"),
      statusNote: z.string().optional(),
      whatToBring: z.array(z.string()).optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
    }).superRefine((e, ctx) => {
      if ((e.type === "group-ride" || e.type === "clinic") && !e.waiverRequired)
        ctx.addIssue({ code: "custom", message: "Group rides and clinics must require the waiver" });
    }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      // The line matches Epoch Health System (owner 2026-11-16): Endurance, Fuel, Edge. There is no Salt.
      line: z.enum(["endurance", "fuel", "edge"]),
      order: z.number().default(0),
      status: z.enum(["waitlist", "live", "sold-out"]),
      eyebrow: z.string(),
      oneLiner: z.string(),
      sub: z.string(),
      claims: z.array(z.object({ text: z.string(), substantiationRef: z.string().min(1) })).default([]),
      factsPanel: z.enum(["supplement", "nutrition"]).optional(),
      facts: z.object({
        servingSize: z.string(), servingsPerPack: z.number(), carbsPerServing: z.number(), sugarPerServing: z.number(),
        sodiumPerServing: z.number(), potassiumPerServing: z.number(), magnesiumPerServing: z.number(), caffeineMg: z.number(),
      }).partial().default({}),
      factsImage: image().optional(),
      factsHtml: z.string().optional(),
      ingredients: z.string().optional(),
      allergens: z.string().optional(),
      madeIn: z.string().optional(),
      directions: z.string().optional(),
      warnings: z.array(z.string()).default([]),
      flavors: z.array(z.string()).default([]),
      variants: z.array(z.object({ label: z.string(), sku: z.string(), gtin: z.string().optional(), price: z.number().optional() })).default([]),
      currency: z.literal("USD").default("USD"),
      bullets: z.array(z.object({ text: z.string(), needs: z.string().optional() })).default([]),
      images: z.array(z.object({ src: image(), alt: z.string().min(10) })).min(1),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      shopify: z.object({ productId: z.string(), variantIds: z.array(z.string()) }).optional(),
    }).superRefine((p, ctx) => {
      p.claims.forEach((c) => {
        if (!c.text.trim().endsWith("*")) ctx.addIssue({ code: "custom", message: `Claim missing asterisk: ${c.text}` });
      });
    }),
});

const stories = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/stories" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      eyebrow: z.string().optional(),
      dek: z.string().max(160),
      author: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.enum(["ride", "fuel", "optimize", "club"]),
      disciplines: z.array(discipline).default([]),
      hero: image(),
      heroAlt: z.string().min(10),
      riders: z.array(reference("riders")).default([]),
      sponsoredDisclosure: z.boolean().default(false),
      reviewedBy: z.string().optional(),
      sources: z.boolean().default(false),
      cta: z.object({ label: z.string(), href: z.string() }).optional(),
      draft: z.boolean().default(true),
    }).superRefine((s, ctx) => {
      if (s.category === "optimize" && !s.reviewedBy) ctx.addIssue({ code: "custom", message: "Optimize stories need reviewedBy" });
    }),
});

const kit = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/kit" }),
  schema: z.object({
    name: z.string(),
    discipline,
    order: z.number().default(0),
    status: z.enum(["coming-soon", "live", "sold-out"]),
    art: z.enum(["trail-jersey", "race-jersey", "baggies", "trucker"]), // illustrated mockup until trademark clearance
    imageAlt: z.string(),
    mockup: z.boolean(),
    price: z.number().optional(),
  }),
});

const snippets = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/snippets" }),
  schema: z.object({
    id: z.string(),
    counselApproved: z.boolean().default(false),
    blocks: z.array(z.object({ title: z.string(), label: z.string().optional(), body: z.string() })).optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z.object({ title: z.string(), metaTitle: z.string(), description: z.string(), effectiveDate: z.string().optional() }),
});

export const collections = { riders, events, products, stories, kit, snippets, legal };
