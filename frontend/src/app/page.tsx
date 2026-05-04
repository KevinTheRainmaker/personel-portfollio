import Link from "next/link";
import { profile, siteConfig } from "@/lib/profile";

const IconGitHub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconScholar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);

const IconArrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

export default function HomePage() {
  const featuredPaper = profile.publications.find((p) => p.highlight);
  const featuredProjects = profile.projects.slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      {/* Hero */}
      <section className="mb-20 animate-fade-up">
        <p
          className="text-sm font-mono tracking-widest uppercase mb-4"
          style={{ color: "var(--warm)" }}
        >
          Portfolio
        </p>
        <h1
          className="font-serif text-5xl md:text-6xl mb-5"
          style={{ color: "var(--dark)" }}
        >
          Kangbeen Ko
        </h1>
        <p className="text-lg mb-3" style={{ color: "var(--mid)" }}>
          {siteConfig.title}
        </p>
        <p
          className="text-base leading-relaxed max-w-xl mb-8"
          style={{ color: "var(--mid)" }}
        >
          {siteConfig.bio}
        </p>

        {/* Research Areas */}
        <div className="flex flex-wrap gap-2 mb-8">
          {siteConfig.researchAreas.map((area) => (
            <span key={area} className="tag-accent">
              {area}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-3">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <IconGitHub />
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <IconLinkedIn />
            LinkedIn
          </a>
          <a
            href={siteConfig.links.scholar}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <IconScholar />
            Scholar
          </a>
          <Link href="/cv" className="btn-accent">
            View Full CV
            <IconArrow />
          </Link>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Featured Publication */}
      {featuredPaper && (
        <section className="mb-16">
          <h2
            className="font-serif text-2xl mb-6"
            style={{ color: "var(--dark)" }}
          >
            Featured Publication
          </h2>
          <div
            className="rounded-xl p-6 border transition-shadow hover:shadow-md"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-wider mb-1"
                  style={{ color: "var(--warm)" }}
                >
                  {featuredPaper.journal}
                </p>
                <h3
                  className="font-serif text-xl leading-snug"
                  style={{ color: "var(--dark)" }}
                >
                  {featuredPaper.title}
                </h3>
              </div>
              <span
                className="shrink-0 text-xs px-2 py-0.5 rounded font-mono"
                style={{
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                }}
              >
                {featuredPaper.time}
              </span>
            </div>
            <p className="text-sm mb-1" style={{ color: "var(--mid)" }}>
              {featuredPaper.authors}
            </p>
            {featuredPaper.abstract && (
              <p
                className="text-sm leading-relaxed mt-3 line-clamp-3"
                style={{ color: "var(--mid)" }}
              >
                {featuredPaper.abstract}
              </p>
            )}
            <div className="flex gap-3 mt-4">
              {featuredPaper.link && (
                <a
                  href={featuredPaper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs"
                >
                  Read Paper <IconArrow />
                </a>
              )}
              <Link href="/papers" className="btn-ghost text-xs">
                All Publications
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Projects */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl" style={{ color: "var(--dark)" }}>
            Selected Projects
          </h2>
          <Link
            href="/cv#projects"
            className="text-sm flex items-center gap-1"
            style={{ color: "var(--accent)" }}
          >
            View all <IconArrow />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <div
              key={project.title}
              className="rounded-xl p-5 border transition-shadow hover:shadow-md flex flex-col"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3
                  className="font-serif text-lg leading-snug"
                  style={{ color: "var(--dark)" }}
                >
                  {project.title.split(":")[0]}
                </h3>
                <span
                  className="shrink-0 text-xs font-mono"
                  style={{ color: "var(--warm)" }}
                >
                  {project.time}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed flex-1 mb-3"
                style={{ color: "var(--mid)" }}
              >
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs self-start"
                >
                  View Project <IconArrow />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* Experience Snapshot */}
      <section className="mb-16">
        <h2
          className="font-serif text-2xl mb-6"
          style={{ color: "var(--dark)" }}
        >
          Experience
        </h2>
        <div className="space-y-4">
          {profile.experiences.map((exp) => (
            <div key={exp.company} className="flex items-start gap-4">
              <div
                className="w-2 h-2 rounded-full mt-2 shrink-0"
                style={{ background: "var(--accent)" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <div>
                    <span
                      className="font-medium text-sm"
                      style={{ color: "var(--dark)" }}
                    >
                      {exp.title}
                    </span>
                    <span className="text-sm" style={{ color: "var(--mid)" }}>
                      {" "}
                      ·{" "}
                    </span>
                    {exp.companyLink ? (
                      <a
                        href={exp.companyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <span className="text-sm" style={{ color: "var(--mid)" }}>
                        {exp.company}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-xs font-mono shrink-0"
                    style={{ color: "var(--muted)" }}
                  >
                    {exp.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/cv" className="btn-ghost text-sm">
            Full CV <IconArrow />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section
        className="rounded-2xl p-8 text-center border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p
          className="font-serif text-2xl mb-2"
          style={{ color: "var(--dark)" }}
        >
          Want to know more?
        </p>
        <p className="text-sm mb-6" style={{ color: "var(--mid)" }}>
          Ask the AI assistant in the bottom-right corner — it knows everything
          about my work.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/research" className="btn-accent">
            Research Interests
          </Link>
          <Link href="/papers" className="btn-ghost">
            Publications
          </Link>
        </div>
      </section>
    </div>
  );
}
