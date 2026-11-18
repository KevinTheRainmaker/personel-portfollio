import type { Metadata } from "next";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description:
    "Full CV for Kangbeen Ko — education, skills, experience, projects, and awards.",
};

/** Parse **bold** markdown by splitting on `**` and alternating normal/bold spans. */
function ParsedText({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={{ color: "var(--dark)", fontWeight: 600 }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Render a block of text that may contain `**bold**` and newlines. */
function Description({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div
      className="prose-desc max-w-[70ch] text-base leading-relaxed break-words"
      style={{ color: "var(--mid)" }}
    >
      {lines.map((line, i) => (
        <p key={i}>
          <ParsedText text={line} />
        </p>
      ))}
    </div>
  );
}

export default function CVPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8 md:px-8 md:py-12 xl:px-12 xl:py-16 animate-fade-up">
      {/* Page Header */}
      <header className="mb-10 md:mb-12 pb-8 border-b" style={{ borderColor: "var(--border)" }}>
        <p
          className="text-base font-mono tracking-widest uppercase mb-3"
          style={{ color: "var(--warm)" }}
        >
          Full Resume
        </p>
        <h1
          className="font-sans font-bold mb-3 text-4xl md:text-[50px]"
          style={{ color: "var(--dark)" }}
        >
          Curriculum Vitae
        </h1>
        <p className="text-base" style={{ color: "var(--mid)" }}>
          Kangbeen Ko
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] items-start gap-10 md:gap-12 xl:gap-16 print:block">
        <div className="min-w-0 space-y-10 md:space-y-12">
          <section id="education" className="min-w-0 scroll-mt-28">
            <h2
              className="font-sans font-bold text-2xl mb-6"
              style={{ color: "var(--dark)" }}
            >
              Education
            </h2>
            <div className="space-y-8">
              {profile.education.map((edu, i) => (
                <div key={i} className="min-w-0 flex flex-col gap-1 break-words">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      {edu.schoolLink ? (
                        <a
                          href={edu.schoolLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-base hover:underline"
                          style={{ color: "var(--accent)" }}
                        >
                          {edu.school}
                        </a>
                      ) : (
                        <span
                          className="font-medium text-base"
                          style={{ color: "var(--dark)" }}
                        >
                          {edu.school}
                        </span>
                      )}
                      {edu.degree && (
                        <p
                          className="text-base mt-0.5"
                          style={{ color: "var(--mid)" }}
                        >
                          {edu.degree}
                        </p>
                      )}
                      {edu.location && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--muted)" }}
                        >
                          {edu.location}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-xs font-mono shrink-0"
                      style={{ color: "var(--warm)" }}
                    >
                      {edu.time}
                    </span>
                  </div>
                  {edu.description && (
                    <div className="mt-1">
                      <Description text={edu.description} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <hr className="border-0 border-t" style={{ borderColor: "var(--border)" }} />

          <section id="experience" className="min-w-0 scroll-mt-28">
            <h2
              className="font-sans font-bold text-2xl mb-6"
              style={{ color: "var(--dark)" }}
            >
              Experience
            </h2>
            <div className="space-y-10">
              {profile.experiences.map((exp, i) => (
                <div key={i} className="min-w-0 flex flex-col gap-1 break-words">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      {exp.companyLink ? (
                        <a
                          href={exp.companyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-base hover:underline"
                          style={{ color: "var(--accent)" }}
                        >
                          {exp.company}
                        </a>
                      ) : (
                        <span
                          className="font-medium text-base"
                          style={{ color: "var(--dark)" }}
                        >
                          {exp.company}
                        </span>
                      )}
                      <p
                        className="text-base mt-0.5"
                        style={{ color: "var(--mid)" }}
                      >
                        {exp.title}
                      </p>
                      {exp.location && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--muted)" }}
                        >
                          {exp.location}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-xs font-mono shrink-0"
                      style={{ color: "var(--warm)" }}
                    >
                      {exp.time}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="mt-2">
                      <Description text={exp.description} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <hr className="border-0 border-t" style={{ borderColor: "var(--border)" }} />

          <section id="projects" className="min-w-0 scroll-mt-28">
            <h2
              className="font-sans font-bold text-2xl mb-6"
              style={{ color: "var(--dark)" }}
            >
              Projects
            </h2>
            <div className="space-y-8">
              {profile.projects.map((project, i) => (
                <div
                  key={i}
                  className="min-w-0 rounded-xl p-5 md:p-6 border break-words print:break-inside-avoid"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                    <h3
                      className="font-sans font-semibold text-base leading-snug"
                      style={{ color: "var(--dark)" }}
                    >
                      {project.title}
                    </h3>
                    <span
                      className="text-xs font-mono shrink-0"
                      style={{ color: "var(--warm)" }}
                    >
                      {project.time}
                    </span>
                  </div>
                  <p
                    className="max-w-[70ch] text-base leading-relaxed mb-3"
                    style={{ color: "var(--mid)" }}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag max-w-full break-words">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-xs"
                    >
                      View Project
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div
          className="min-w-0 space-y-10 md:space-y-12 border-t pt-10 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-10 print:border-0 print:pl-0 print:pt-10"
          style={{ borderColor: "var(--border)" }}
        >
          <section id="skills" className="min-w-0 scroll-mt-28">
            <h2
              className="font-sans font-bold text-2xl mb-6"
              style={{ color: "var(--dark)" }}
            >
              Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
              {profile.skills.map((skill, i) => (
                <div key={i}>
                  <p
                    className="font-semibold text-base mb-2"
                    style={{ color: "var(--dark)" }}
                  >
                    {skill.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.description.split(", ").map((item) => (
                      <span key={item} className="tag max-w-full break-words">
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-0 border-t" style={{ borderColor: "var(--border)" }} />

          <section id="awards" className="min-w-0 scroll-mt-28">
            <h2
              className="font-sans font-bold text-2xl mb-6"
              style={{ color: "var(--dark)" }}
            >
              Awards
            </h2>
            <div className="space-y-6">
              {profile.awards.map((award, i) => (
                <div key={i} className="min-w-0 flex flex-col gap-1 break-words">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p
                        className="font-medium text-base"
                        style={{ color: "var(--dark)" }}
                      >
                        {award.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--muted)" }}
                      >
                        {award.organization}
                      </p>
                    </div>
                    <span
                      className="text-xs font-mono shrink-0"
                      style={{ color: "var(--warm)" }}
                    >
                      {award.time}
                    </span>
                  </div>
                  {award.description && (
                    <p
                      className="max-w-[70ch] text-base leading-relaxed mt-1"
                      style={{ color: "var(--mid)" }}
                    >
                      {award.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <hr className="border-0 border-t" style={{ borderColor: "var(--border)" }} />

          <section id="other" className="min-w-0 scroll-mt-28">
            <h2
              className="font-sans font-bold text-2xl mb-6"
              style={{ color: "var(--dark)" }}
            >
              Other Experiences
            </h2>
            <div className="space-y-6">
              {profile.otherExperiences.map((item, i) => (
                <div key={i} className="min-w-0 flex flex-col gap-1 break-words">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p
                        className="font-medium text-base"
                        style={{ color: "var(--dark)" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--muted)" }}
                      >
                        {item.organization}
                      </p>
                    </div>
                    <span
                      className="text-xs font-mono shrink-0"
                      style={{ color: "var(--warm)" }}
                    >
                      {item.time}
                    </span>
                  </div>
                  {item.description && (
                    <p
                      className="max-w-[70ch] text-base leading-relaxed mt-1"
                      style={{ color: "var(--mid)" }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
