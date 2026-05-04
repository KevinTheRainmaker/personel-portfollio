export interface Education {
  school: string;
  schoolLink?: string;
  time: string;
  degree?: string;
  location?: string;
  description?: string;
}

export interface Skill {
  title: string;
  description: string;
}

export interface Publication {
  title: string;
  authors: string;
  journal: string;
  time: string;
  link?: string;
  thumbnail?: string;
  highlight?: boolean;
  abstract?: string;
  summary?: string;
}

export interface Experience {
  company: string;
  companyLink?: string;
  time: string;
  title: string;
  location?: string;
  description?: string;
}

export interface Project {
  title: string;
  description: string;
  thumbnail?: string;
  link?: string;
  time: string;
  tags: string[];
}

export interface Award {
  title: string;
  organization: string;
  time: string;
  description?: string;
}

export interface OtherExperience {
  title: string;
  organization: string;
  time: string;
  description?: string;
}

export interface ProfileData {
  education: Education[];
  skills: Skill[];
  publications: Publication[];
  experiences: Experience[];
  projects: Project[];
  awards: Award[];
  otherExperiences: OtherExperience[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
