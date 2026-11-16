// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { REDIRECTS } from "./redirects.config.mjs";

const LEGAL_APPROVED = false; // mirrors SITE.flags.legalApproved; legal pages stay out of the sitemap until true
const LEGAL = ["/privacy", "/terms", "/disclaimers", "/riders-club-terms", "/group-ride-waiver", "/accessibility"];
const EXCLUDE = ["/thanks", "/404", "/optimize/medical", "/_styleguide"];

export default defineConfig({
  site: "https://epochcycling.com",
  trailingSlash: "never",
  compressHTML: true,
  output: "static",
  adapter: vercel({ webAnalytics: { enabled: false } }),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const p = new URL(page).pathname.replace(/\/$/, "") || "/";
        if (EXCLUDE.includes(p)) return false;
        if (!LEGAL_APPROVED && LEGAL.includes(p)) return false;
        return true;
      },
    }),
  ],
  redirects: REDIRECTS,
  image: { responsiveStyles: false },
  devToolbar: { enabled: false },
  build: { inlineStylesheets: "always" },
  vite: { plugins: [tailwindcss()] },
});
