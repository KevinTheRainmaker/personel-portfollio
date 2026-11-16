import type { ProfileData } from "./types";
import rawData from "../data/profile-data.json";

export const profile = rawData as ProfileData;

export const siteConfig = {
  name: "Kangbeen Ko",
  title:
    "M.S. Student at HCIS Lab, at Gwangju Institute of Science and Technology",
  bio: "I build AI and HCI tools that help people understand unfamiliar information, express what they want, and put that understanding into action.",
  bio2: "My work spans accessible information, learning and reflection, and human–AI collaboration. I study how AI can reduce effort while keeping people involved in the judgments that matter.",
  researchAreas: [
    {
      title: "Accessible Information & Expertise",
      description:
        "How can people use information that is difficult to read, interpret, or access? My work includes easy-to-read drafting with Peach Seoga, conversational access to medical records in SickGPT, and voice-based access to shopping information. I build interfaces that connect specialized information with the questions and needs of the person using it.",
      keywords: ["Accessibility", "Information Access", "Conversational Interfaces", "Expert Knowledge"],
    },
    {
      title: "Learning Through Explanation & Reflection",
      description:
        "A result or error display can leave people unsure what to do next. In LEGOLAS, verbal explanations complement visual golf feedback to help learners understand corrections. Projects such as Be With You explore how conversation can help people articulate and reflect on their experience. I am interested in assistance that builds understanding as well as supporting the immediate task.",
      keywords: ["Self-Directed Learning", "Explanatory Feedback", "Reflection", "LLM Applications"],
    },
    {
      title: "Expressing Intent & Shaping AI Assistance",
      description:
        "People may know what they want without knowing how to express it in a system's technical terms. I explore how interaction can help them clarify intentions, examine alternatives, and guide what AI does. This connects my interest in intent-sensitive interfaces with questions about delegation and control in AI-assisted programming.",
      keywords: ["Intent Expression", "Human–AI Interaction", "Delegation", "User Control"],
    },
    {
      title: "Professional Judgment & Human–AI Collaboration",
      description:
        "Reducing effort is only part of helping a professional. Who Holds the Pen? examines how different AI collaboration modes affect clinicians' participation in interpretation, perceived control, and professional identity. I study interaction structures that let people contribute their expertise, question suggestions, and retain authorship over consequential judgments.",
      keywords: ["Professional Workflows", "Agency", "Authorship", "Collaborative AI"],
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
