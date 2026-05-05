import type { Metadata } from "next";
import { siteConfig } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Research",
  description: `Research interests and focus areas of ${siteConfig.name}`,
};

const researchPhilosophy = `I believe the most impactful AI research happens at the boundary between technology and human experience.
My work is driven by a simple question: how do we build intelligent systems that genuinely help people -
not just in controlled lab settings, but in the messy, unpredictable flow of everyday life?`;

export default function ResearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-16 animate-fade-up">
      {/* Header */}
      <div className="mb-14">
        <p
          className="text-base font-mono tracking-widest uppercase mb-4"
          style={{ color: "var(--warm)" }}
        >
          Research
        </p>
        <h1
          className="font-sans font-bold mb-5 text-4xl md:text-[50px]"
          style={{ color: "var(--dark)" }}
        >
          Research Interests
        </h1>
        <blockquote
          className="border-l-4 pl-5 italic text-base leading-relaxed"
          style={{ borderColor: "var(--accent)", color: "var(--mid)" }}
        >
          {researchPhilosophy}
        </blockquote>
      </div>

      {/* Research Areas */}
      <section className="mb-14">
        <h2
          className="font-sans font-bold text-2xl mb-8"
          style={{ color: "var(--dark)" }}
        >
          Focus Areas
        </h2>
        <div className="space-y-6">
          {siteConfig.researchAreas.map((area, i) => (
            <div
              key={area.title}
              className="rounded-xl p-6 border"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-start gap-4 mb-3">
                <span
                  className="font-mono text-2xl font-bold leading-none mt-0.5 shrink-0"
                  style={{
                    color: "var(--accent-light)",
                    WebkitTextStroke: "1px var(--accent)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-sans font-semibold text-xl leading-snug"
                  style={{ color: "var(--dark)" }}
                >
                  {area.title}
                </h3>
              </div>
              <p
                className="text-base leading-relaxed mb-4 ml-10"
                style={{ color: "var(--mid)" }}
              >
                {area.description}
              </p>
              <div className="flex flex-wrap gap-1.5 ml-10">
                {area.keywords.map((kw) => (
                  <span key={kw} className="tag">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* Current Position */}
      <section className="mb-14">
        <h2
          className="font-sans font-bold text-2xl mb-6"
          style={{ color: "var(--dark)" }}
        >
          Current Position
        </h2>
        <div
          className="rounded-xl p-6 border flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-sans font-bold text-xl"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent)",
            }}
          >
            M
          </div>
          <div>
            <p
              className="font-medium text-base"
              style={{ color: "var(--dark)" }}
            >
              M.S. Candidate - Human-Centered Intelligent System Lab
            </p>
            <p className="text-base" style={{ color: "var(--mid)" }}>
              GIST (Gwangju Institute of Science and Technology) · Mar. 2025 –
              Present
            </p>
            <p className="text-base mt-1" style={{ color: "var(--muted)" }}>
              Advisor: Prof. SeungJun Kim
            </p>
          </div>
          <a
            href={siteConfig.links.lab}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs sm:ml-auto shrink-0"
          >
            Visit Lab →
          </a>
        </div>
      </section>

      {/* Broader Context */}
      <section>
        <h2
          className="font-sans font-bold text-2xl mb-6"
          style={{ color: "var(--dark)" }}
        >
          Background &amp; Motivation
        </h2>
        <div
          className="space-y-4 text-base leading-relaxed"
          style={{ color: "var(--mid)" }}
        >
          <p>
            My journey started in software engineering - building products at a
            startup, competing in hackathons, and learning what it means to ship
            real software to real users. That grounding keeps me focused on
            practicality: research should ultimately be deployable.
          </p>
          <p>
            Through internships at SNUBH Medical AI Center and GroupByHR, I saw
            firsthand how AI could either empower or frustrate people depending
            on how thoughtfully it was designed. Those experiences shaped my
            conviction that HCI and AI belong together.
          </p>
          <p>
            Today, I design and study AI systems through the lens of the people
            who use them - asking not just &ldquo;does this work?&rdquo; but
            &ldquo;does this help, and why?&rdquo;
          </p>
        </div>
      </section>
    </div>
  );
}
