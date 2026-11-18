import type { ProfileData } from "./types";
import rawData from "../data/profile-data.json";

// Sort display copies only; preserve source evidence and undated entries.
export function latestDateKey(time: string = ""): number {
  if (/\b(present|current|ongoing)\b/i.test(time)) return 99999999;
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const dates = [...time.matchAll(/\b(?:([A-Za-z]+)\.?\s+)?((?:19|20)\d{2})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?)?\b/g)];
  return dates.reduce((latest, match) => {
    const month = match[3] ? Number(match[3]) : Math.max(0, months.indexOf((match[1] || "").slice(0, 3).toLowerCase()) + 1);
    return Math.max(latest, Number(match[2]) * 10000 + month * 100 + Number(match[4] || 0));
  }, -1);
}

export function newestFirst<T extends { time: string; highlight?: boolean }>(items: T[], featuredFirst = false): T[] {
  return [...items].sort((a, b) =>
    (featuredFirst ? Number(b.highlight === true) - Number(a.highlight === true) : 0) ||
    latestDateKey(b.time) - latestDateKey(a.time)
  );
}

const source = rawData as ProfileData;
export const profile: ProfileData = {
  ...source,
  education: newestFirst(source.education),
  publications: newestFirst(source.publications, true),
  experiences: newestFirst(source.experiences),
  projects: newestFirst(source.projects),
  awards: newestFirst(source.awards),
  otherExperiences: newestFirst(source.otherExperiences),
};

// CV records are explicit published works, independent of portfolio featuring.
export const publishedPublications = newestFirst(
  profile.publications.filter(publication => publication.status === "published"),
);

// Portfolio cards retain featured-first ordering within published works.
export const portfolioPublications = newestFirst(publishedPublications, true);

export const siteConfig = {
  name: "Kangbeen Ko",
  title:
    "Ph.D. Student at HCIS Lab, Gwangju Institute of Science and Technology",
  identity: { research: "AI × HCI researcher", practice: "product-minded builder" },
  currentPosition: {
    role: "Ph.D. Student (M.S./Ph.D. Integrated Course)",
    lab: "Human-Centered Intelligent System Lab",
    institution: "GIST (Gwangju Institute of Science and Technology)",
    period: "Mar. 2025 – Present",
    advisor: "Prof. SeungJun Kim",
  },
  background: [
    "I have been interested in using AI to support people in their work and everyday lives. At GroupByHR, I worked on AI-based recruitment recommendations to help early-stage startups find suitable talent. With Peach Seoga, I explored AI-assisted easy-to-read drafting to make information easier to understand and use.",
    "Through this work, I began to ask what role people should play as AI becomes more capable. What should people continue to judge, contribute, and shape when working with AI? This question led me to study Human–Computer Interaction.",
    "I now study how people can work with AI in ways that extend their capabilities without replacing them or overwhelming them with the effort of managing it. I am especially interested in how people can delegate work while still bringing their own expertise, understanding the process, and shaping the outcome.",
  ],
  bio: "I study interactions that help people understand, create, and act with AI while retaining their judgment and agency.",
  bio2: "My work explores how AI and interactive systems can extend human capabilities while preserving people’s agency, so that support empowers rather than replaces or overwhelms them.",
  researchAreas: [
    {
      title: "Human–AI Interaction",
      description:
        "How can people communicate their intentions, understand AI assistance, and guide what happens next? I explore interactions that make AI useful in people's own contexts, from conversational access to medical information in SickGPT to AI-assisted learning and professional work.",
      keywords: ["Interaction", "Collaboration", "Intent"],
    },
    {
      title: "Human Augmentation",
      description:
        "I build tools that extend what people can understand, express, and do. My projects span easy-to-read drafting with Peach Seoga, verbal and visual golf feedback in LEGOLAS, and voice-based communication in Soridam. Across these settings, I am interested in support that expands people's capabilities rather than simply doing the task for them.",
      keywords: ["Augmentation", "Learning", "Feedback"],
    },
    {
      title: "Human Agency",
      description:
        "As AI takes on more work, how can people retain judgment, authorship, and control without being overwhelmed by supervision? Who Holds the Pen? examines clinicians' participation and perceived control across AI collaboration modes. My developing work on AI-assisted programming asks how people can delegate execution while continuing to shape and understand the outcome.",
      keywords: ["Agency", "Delegation", "Authorship"],
    },
  ],
  email: "kangbeen.ko@gm.gist.ac.kr",
  links: {
    github: "https://github.com/KevinTheRainmaker",
    linkedin: "https://www.linkedin.com/in/kevin-the-rainmaker",
    scholar: "https://scholar.google.com/citations?user=0wA0FGgAAAAJ",
    lab: "https://sites.google.com/view/gist-hcis-lab/home",
    instagram: "https://www.instagram.com/lucete_lactea/",
  },
  baseUrl: "https://portfolio.kangbeen.my",
};
