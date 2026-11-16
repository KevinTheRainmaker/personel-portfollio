import { profile, siteConfig } from "./profile";

const sectionPages: Record<string, string> = {
  education: "/cv#education",
  skills: "/cv#skills",
  publications: "/papers",
  experiences: "/cv#experience",
  projects: "/cv#projects",
  awards: "/cv#awards",
  otherExperiences: "/cv#other",
};

export const portfolioPageLinks = ["/", "/research", "/papers", "/cv", ...Object.values(sectionPages)];

/** Deterministic full context, not retrieval or an independently maintained biography.
 * New fields/records in either shared source are included without a second copy.
 * Sources are bundled by Next.js: no crawling, embedding or extra model call.
 */
export function buildPortfolioContext(
  data: unknown = profile,
  config: unknown = siteConfig,
): string {
  const sections = Object.entries(data as Record<string, unknown>).map(([key, value]) => {
    const page = sectionPages[key] ?? "/cv";
    const records = Array.isArray(value)
      ? value.map((record, index) => `Record ${index + 1}: ${JSON.stringify(record)}`).join("\n\n")
      : JSON.stringify(value);
    return `## ${key} | Site page: ${page}\n${records}`;
  });
  return [
    "# Public portfolio evidence",
    "Source: shared site content. First-person descriptions refer to Kangbeen, not the assistant. Record boundaries identify which role, dates and results belong together. Page locations are navigation aids, not additional evidence.",
    `## Site introduction, research background, position and contact links | Pages: / and /research\n${JSON.stringify(config)}`,
    ...sections,
    "Scope: public text/data used by the site. Linked PDFs, external websites, images and videos are not read; a link does not supply its contents. Missing roles or results must not be inferred.",
  ].join("\n\n");
}

// Assembled once per server module instance; all evidence goes to each model call.
export const portfolioContext = buildPortfolioContext();
