import type { ProfileData } from "./types";
import rawData from "../data/profile-data.json";

export const profile = rawData as ProfileData;

export const siteConfig = {
  name: "Kangbeen Ko",
  title: "M.S. Candidate · HCIS Lab, GIST",
  bio: "Researcher at the intersection of Human-Computer Interaction and AI. Building intelligent systems that understand and augment human experience.",
  researchAreas: [
    "Human-Agent Interaction",
    "Context-aware AI",
    "LLM-integrated Systems",
  ],
  email: "sweetrainforyou@gmail.com",
  links: {
    github: "https://github.com/KevinTheRainmaker",
    linkedin: "https://www.linkedin.com/in/kangbeen-ko/",
    scholar: "https://scholar.google.com/citations?user=PLACEHOLDER",
    lab: "https://sites.google.com/view/gist-hcis-lab",
  },
  baseUrl: "https://portfolio.kangbeen.my",
};
