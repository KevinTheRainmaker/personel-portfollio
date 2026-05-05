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
      title: "Human-Centered AI",
      description:
        "Designing AI systems that prioritize human values, capabilities, and experiences. My work focuses on how AI can augment human intelligence while preserving agency, interpretability, and meaningful control - especially in complex domains like healthcare, learning, and decision-making.",
      keywords: [
        "Human-AI Interaction",
        "Agency",
        "Interpretability",
        "User-Centered Design",
        "Augmented Intelligence",
      ],
    },
    {
      title: "LLM Applications",
      description:
        "Building practical applications powered by large language models that seamlessly integrate into real-world workflows. This includes conversational agents, RAG-based systems, and multi-agent pipelines that enhance productivity, reasoning, and information access.",
      keywords: [
        "LLM Apps",
        "RAG",
        "Multi-Agent Systems",
        "Conversational AI",
        "Workflow Integration",
      ],
    },
    {
      title: "AI-Assisted Learning",
      description:
        "Exploring how AI can support self-directed learning through adaptive feedback, explanation, and reflection. My work investigates how LLM-based systems can provide principle-based guidance, improve skill acquisition, and reduce dependency on external instruction.",
      keywords: [
        "Personalized Learning",
        "Feedback Systems",
        "Self-Directed Learning",
        "Skill Acquisition",
        "Educational AI",
      ],
    },
    {
      title: "Reliable AI",
      description:
        "Developing methods to ensure AI systems are trustworthy, robust, and aligned with user expectations. This includes evaluation frameworks, uncertainty handling, and design strategies that promote transparency, controllability, and safe deployment of AI in high-stakes settings.",
      keywords: [
        "Trustworthy AI",
        "Robustness",
        "Evaluation",
        "Uncertainty",
        "AI Safety",
      ],
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
