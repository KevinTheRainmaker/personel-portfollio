import type { Metadata } from "next";
import { portfolioPageMetadata } from "@/lib/page-metadata";
import type { ReactNode } from "react";
import { profile, publishedPublications, siteConfig } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  ...portfolioPageMetadata(
    "/cv",
    `Curriculum Vitae · ${siteConfig.name}`,
    `Academic CV for ${siteConfig.name} — education, publications, experience, projects, and awards.`,
  ),
};

function ParsedText({ text }: { text: string }) {
  return <>{text.split("**").map((part, i) => i % 2 === 1
    ? <strong key={i} style={{ color: "var(--dark)", fontWeight: 600 }}>{part}</strong>
    : <span key={i}>{part}</span>)}</>;
}

function Description({ text }: { text: string }) {
  return (
    <div className="prose-desc max-w-[80ch] text-base leading-relaxed break-words" style={{ color: "var(--mid)" }}>
      {text.split("\n").map((line, i) => <p key={i}><ParsedText text={line} /></p>)}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="cv-section min-w-0 scroll-mt-28">
      <h2 className="font-sans font-semibold text-xl md:text-2xl pb-2 mb-5 border-b" style={{ color: "var(--dark)", borderColor: "var(--border)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function EntryHeading({ children, time }: { children: ReactNode; time: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6">
      <div className="min-w-0 font-semibold text-base break-words" style={{ color: "var(--dark)" }}>{children}</div>
      <span className="text-sm shrink-0" style={{ color: "var(--warm)" }}>{time}</span>
    </div>
  );
}

const linkClass = "underline decoration-current/30 underline-offset-4 hover:decoration-current";

export default function CVPage() {
  return (
    <article className="cv-document w-full max-w-[1120px] mx-auto px-4 py-8 md:px-8 md:py-12 xl:px-12 xl:py-16">
      <header className="mb-10 md:mb-12">
        <p className="text-base mb-2" style={{ color: "var(--warm)" }}>Curriculum Vitae</p>
        <h1 className="font-sans font-bold text-4xl md:text-[46px] leading-tight mb-4" style={{ color: "var(--dark)" }}>
          {siteConfig.name}
        </h1>
        <div className="max-w-[80ch] text-base leading-relaxed" style={{ color: "var(--mid)" }}>
          <p>{siteConfig.currentPosition.role}</p>
          <p>{siteConfig.currentPosition.lab}</p>
          <p>{siteConfig.currentPosition.institution}</p>
          <p>Advisor: {siteConfig.currentPosition.advisor}</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm break-words" style={{ color: "var(--accent)" }}>
          <a href={`mailto:${siteConfig.email}`} className={`${linkClass} max-w-full break-all`}>{siteConfig.email}</a>
          <a href={siteConfig.baseUrl} className={linkClass}>Website</a>
          <a href={siteConfig.links.scholar} target="_blank" rel="noopener noreferrer" className={linkClass}>Google Scholar</a>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>GitHub</a>
        </div>
      </header>

      <div className="space-y-9 md:space-y-10">
        <Section id="education" title="Education">
          <div className="space-y-5">
            {profile.education.map((edu, i) => (
              <div key={i} className="cv-entry min-w-0 space-y-1 break-words">
                <EntryHeading time={edu.time}>
                  {edu.schoolLink ? <a href={edu.schoolLink} target="_blank" rel="noopener noreferrer" className={linkClass}>{edu.school}</a> : edu.school}
                </EntryHeading>
                {edu.degree && <p className="text-base" style={{ color: "var(--mid)" }}>{edu.degree}</p>}
                {edu.location && <p className="text-sm" style={{ color: "var(--muted)" }}>{edu.location}</p>}
                {edu.description && <Description text={edu.description} />}
              </div>
            ))}
          </div>
        </Section>

        <Section id="publications" title="Publications">
          <ol className="list-decimal pl-5 space-y-4">
            {publishedPublications.map((publication) => (
              <li key={publication.title} className="cv-entry pl-1 text-base leading-relaxed break-words" style={{ color: "var(--mid)" }}>
                <p className="max-w-[80ch]">
                  {publication.authors}{" "}
                  <span>({publication.time}).</span>{" "}
                  {publication.link ? (
                    <a href={publication.link} target="_blank" rel="noopener noreferrer" className={linkClass} style={{ color: "var(--dark)" }}>{publication.title}</a>
                  ) : <span style={{ color: "var(--dark)" }}>{publication.title}</span>}
                  {". "}<em>{publication.journal}</em>.
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="experience" title="Experience">
          <div className="space-y-6">
            {profile.experiences.map((exp, i) => (
              <div key={i} className="cv-entry min-w-0 space-y-1 break-words">
                <EntryHeading time={exp.time}>
                  {exp.companyLink ? <a href={exp.companyLink} target="_blank" rel="noopener noreferrer" className={linkClass}>{exp.company}</a> : exp.company}
                </EntryHeading>
                <p className="text-base" style={{ color: "var(--mid)" }}>{exp.title}</p>
                {exp.location && <p className="text-sm" style={{ color: "var(--muted)" }}>{exp.location}</p>}
                {exp.description && <Description text={exp.description} />}
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="space-y-6">
            {profile.projects.map((project, i) => (
              <div key={i} className="cv-entry min-w-0 space-y-2 break-words">
                <EntryHeading time={project.time}>
                  {project.link ? <a href={project.link} target="_blank" rel="noopener noreferrer" className={linkClass}>{project.title}</a> : project.title}
                </EntryHeading>
                <p className="max-w-[80ch] text-base leading-relaxed" style={{ color: "var(--mid)" }}>{project.description}</p>
                {project.tags.length > 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>{project.tags.join(", ")}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section id="awards" title="Awards">
          <div className="space-y-5">
            {profile.awards.map((award, i) => (
              <div key={i} className="cv-entry min-w-0 space-y-1 break-words">
                <EntryHeading time={award.time}>{award.title}</EntryHeading>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{award.organization}</p>
                {award.description && <p className="max-w-[80ch] text-base leading-relaxed" style={{ color: "var(--mid)" }}>{award.description}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <dl className="space-y-3">
            {profile.skills.map((skill, i) => (
              <div key={i} className="cv-entry max-w-[80ch] text-base leading-relaxed break-words">
                <dt className="font-semibold inline" style={{ color: "var(--dark)" }}>{skill.title}: </dt>
                <dd className="inline" style={{ color: "var(--mid)" }}>{skill.description}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="other" title="Other Experiences">
          <div className="space-y-5">
            {profile.otherExperiences.map((item, i) => (
              <div key={i} className="cv-entry min-w-0 space-y-1 break-words">
                <EntryHeading time={item.time}>{item.title}</EntryHeading>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{item.organization}</p>
                {item.description && <p className="max-w-[80ch] text-base leading-relaxed" style={{ color: "var(--mid)" }}>{item.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </article>
  );
}
