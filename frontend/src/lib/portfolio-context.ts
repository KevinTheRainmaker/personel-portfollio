import { createHash } from "node:crypto";
import { profile, siteConfig, selectPublishedPublications } from "./profile";
import type { ProfileData } from "./types";

const sectionPages: Record<string, string> = {
  education: "/cv#education", skills: "/cv#skills", publications: "/papers",
  experiences: "/cv#experience", projects: "/cv#projects",
  awards: "/cv#awards", otherExperiences: "/cv#other",
};
export const portfolioPageLinks = ["/", "/research", "/papers", "/cv", ...Object.values(sectionPages)];

const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const records = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
/** Only fields actually rendered by Home/Research/Papers/CV may enter model evidence.
 * New source fields are private to the source until deliberately added here. */
function pick(value: unknown, fields: string[]) {
  const source = object(value);
  const selected: Record<string, string | number | boolean | string[]> = {};
  for (const key of fields) {
    const field = source[key];
    if (typeof field === "string" || typeof field === "boolean" || typeof field === "number") {
      selected[key] = field;
    } else if (Array.isArray(field) && field.every(item => typeof item === "string")) {
      selected[key] = field;
    }
  }
  return selected;
}

export function buildPublicSiteContent(data: unknown = profile, config: unknown = siteConfig) {
  const source = object(data), settings = object(config);
  const map = (section: string, fields: string[]) => records(source[section]).map(item => pick(item, fields));
  const publicPapers = selectPublishedPublications(records(source.publications)
    .filter(item => item !== null && typeof item === "object") as ProfileData["publications"]);
  return {
    site: {
      ...pick(settings, ["name", "title", "bio", "bio2", "email", "baseUrl", "background"]),
      identity: pick(settings.identity, ["research", "practice"]),
      currentPosition: pick(settings.currentPosition, ["role", "lab", "institution", "period", "advisor"]),
      researchAreas: records(settings.researchAreas).map(area => pick(area, ["title", "description", "keywords"])),
      links: pick(settings.links, ["github", "linkedin", "scholar", "lab", "instagram"]),
    },
    sections: {
      education: map("education", ["school", "schoolLink", "time", "degree", "location", "description"]),
      skills: map("skills", ["title", "description"]),
      publications: publicPapers.map(paper => pick(paper, ["title", "authors", "journal", "time", "link", "summary", "highlight"])),
      experiences: map("experiences", ["company", "companyLink", "time", "title", "location", "description"]),
      projects: map("projects", ["title", "description", "link", "time", "tags"]),
      awards: map("awards", ["title", "organization", "time", "description"]),
      otherExperiences: map("otherExperiences", ["title", "organization", "time", "description"]),
    },
  };
}
export const publicSiteContent = buildPublicSiteContent();

/** Full public-page context, not a dump of the authoring source or a second biography. */
export function buildPortfolioContext(data: unknown = profile, config: unknown = siteConfig): string {
  const content = buildPublicSiteContent(data, config);
  const sections = Object.entries(content.sections).map(([key, value]) =>
    `## ${key} | Site page: ${sectionPages[key]}\n${value.map((record, index) => `Record ${index + 1}: ${JSON.stringify(record)}`).join("\n\n")}`);
  return [
    "# Public portfolio evidence",
    "Source: text currently displayed by the public site. First-person descriptions refer to Kangbeen, not the assistant. Record boundaries identify which role, dates and results belong together.",
    `## Site introduction, research background, position and contact links | Pages: / and /research\n${JSON.stringify(content.site)}`,
    ...sections,
    "Scope: only displayed public text and references. The publications section contains only the works displayed in Papers/CV. A research description mentioning a study does not make it a listed publication or establish authors, venue, submission status, or findings beyond that description. Linked PDFs, external websites, images and videos are not read; a link does not supply its contents. Missing roles or results must not be inferred.",
  ].join("\n\n");
}
export const portfolioContext = buildPortfolioContext();
// Bump this policy version when grounding rules change to invalidate earlier answers.
// Public content changes also invalidate prior conversation evidence.
export const portfolioContextRevision = createHash("sha256").update("public-site-v2\n" + portfolioContext).digest("hex");
