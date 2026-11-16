import type { ProfileData } from "./types";
import rawData from "../data/profile-data.json";

export const profile = rawData as ProfileData;

export const siteConfig = {
  name: "Kangbeen Ko",
  title:
    "Ph.D. Student at HCIS Lab, Gwangju Institute of Science and Technology",
  bio: "I study interactions that help people understand, create, and act with AI while retaining their judgment and agency.",
  bio2: "My work explores how AI and interactive systems can extend human capabilities without replacing or overwhelming the people they support.",
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
    linkedin: "www.linkedin.com/in/kevin-the-rainmaker",
    scholar: "https://scholar.google.com/citations?user=0wA0FGgAAAAJ",
    lab: "https://sites.google.com/view/gist-hcis-lab/home",
    instagram: "https://www.instagram.com/lucete_lactea/",
  },
  baseUrl: "https://portfolio.kangbeen.my",
};
