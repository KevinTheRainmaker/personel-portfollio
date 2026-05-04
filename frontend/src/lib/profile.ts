import type { ProfileData } from "./types";
import rawData from "../data/profile-data.json";

export const profile = rawData as ProfileData;

export const siteConfig = {
  name: "Kangbeen Ko",
  title:
    "M.S. Student at HCIS Lab, at Gwangju Institute of Science and Technology",
  bio: "I'm an AI × HCI researcher and product-minded builder, passionate about creating technologies that meaningfully improve human life.",
  bio2: "I value responsibility, embrace challenges, and strive to move humanity forward through thoughtful innovation.",
  researchAreas: [
    {
      title: "Human-Agent Interaction",
      description:
        "Developing intelligent agents that adapt to user context and provide personalized assistance",
    },
    {
      title: "Context-aware AI",
      description:
        "Creating AI systems that understand and respond to environmental and user contexts",
    },
    {
      title: "LLM-integrated Systems",
      description:
        "Integrating large language models into everyday applications for enhanced human capabilities",
    },
  ],
  email: "sweetrainforyou@gmail.com",
  links: {
    github: "https://github.com/KevinTheRainmaker",
    linkedin: "https://www.linkedin.com/in/kangbeen-ko/",
    scholar: "https://scholar.google.com/citations?user=PLACEHOLDER",
    lab: "https://sites.google.com/view/gist-hcis-lab",
    instagram: "",
  },
  baseUrl: "https://portfolio.kangbeen.my",
};
