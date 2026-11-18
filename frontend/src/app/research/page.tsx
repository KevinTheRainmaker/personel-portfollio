import type { Metadata } from "next";
import { siteConfig } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Research",
  description: `Research interests and focus areas of ${siteConfig.name}`,
};

const researchPhilosophy = `${siteConfig.bio} ${siteConfig.bio2}`;

export default function ResearchPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8 md:px-8 md:py-12 xl:px-12 xl:py-16 animate-fade-up">
      <header className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] xl:gap-12 xl:items-center mb-10 xl:mb-12">
        <div className="min-w-0">
          <p className="text-base font-mono tracking-widest uppercase mb-3" style={{ color: "var(--warm)" }}>Research</p>
          <h1 className="font-sans font-bold text-4xl md:text-[50px] leading-tight" style={{ color: "var(--dark)" }}>Research Interests</h1>
        </div>
        <blockquote className="min-w-0 max-w-[70ch] border-l-4 pl-5 text-base leading-relaxed" style={{ borderColor: "var(--accent)", color: "var(--mid)" }}>
          {researchPhilosophy}
        </blockquote>
      </header>

      <section aria-labelledby="focus-heading" className="mb-10 xl:mb-12">
        <h2 id="focus-heading" className="font-sans font-bold text-2xl mb-5" style={{ color: "var(--dark)" }}>Focus Areas</h2>
        <div className="grid gap-5 xl:grid-cols-2 xl:gap-6" data-research-areas>
          {siteConfig.researchAreas.map((area, i) => (
            <article key={area.title}
              className={`min-w-0 rounded-xl p-5 md:p-6 border ${i === 0 ? "xl:col-span-2 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:gap-8" : "flex flex-col"}`}
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="font-sans font-semibold text-xl leading-snug mb-4 min-w-0" style={{ color: "var(--dark)" }}>{area.title}</h3>
              <p className={`text-base leading-relaxed max-w-[75ch] min-w-0 ${i === 0 ? "xl:col-start-2 xl:row-start-1 xl:row-span-2" : "mb-5"}`} style={{ color: "var(--mid)" }}>{area.description}</p>
              <div className={`flex flex-wrap gap-1.5 ${i === 0 ? "mt-5 xl:mt-0 xl:col-start-1 xl:row-start-2 xl:self-end" : "mt-auto pt-1"}`}>
                {area.keywords.map(kw => <span key={kw} className="tag">{kw}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)] xl:gap-12 border-t pt-8 xl:pt-10" style={{ borderColor: "var(--border)" }}>
        <section className="min-w-0" aria-labelledby="position-heading">
          <h2 id="position-heading" className="font-sans font-bold text-2xl mb-5" style={{ color: "var(--dark)" }}>Current Position</h2>
          <div className="border-l-2 pl-5 space-y-3" style={{ borderColor: "var(--accent)" }}>
            <p className="font-medium text-base leading-relaxed" style={{ color: "var(--dark)" }}>{siteConfig.currentPosition.role}</p>
            <p className="text-base leading-relaxed" style={{ color: "var(--mid)" }}>{siteConfig.currentPosition.lab}</p>
            <p className="text-base leading-relaxed" style={{ color: "var(--mid)" }}>{siteConfig.currentPosition.institution}</p>
            <p className="text-sm font-mono leading-relaxed" style={{ color: "var(--mid)" }}>{siteConfig.currentPosition.period}</p>
            <p className="text-base leading-relaxed" style={{ color: "var(--mid)" }}>Advisor: {siteConfig.currentPosition.advisor}</p>
            <a href={siteConfig.links.lab} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">Visit Lab →</a>
          </div>
        </section>
        <section className="min-w-0" aria-labelledby="background-heading">
          <h2 id="background-heading" className="font-sans font-bold text-2xl mb-5" style={{ color: "var(--dark)" }}>Background &amp; Motivation</h2>
          <div className="space-y-4 text-base leading-relaxed max-w-[75ch]" style={{ color: "var(--mid)" }}>
            {siteConfig.background.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>
      </div>
    </div>
  );
}
