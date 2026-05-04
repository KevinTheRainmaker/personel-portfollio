import type { Metadata } from "next";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Publications",
  description: "Academic publications and research papers by Kangbeen Ko.",
};

export default function PapersPage() {
  const total = profile.publications.length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-up">
      {/* Page Header */}
      <header className="mb-12">
        <p
          className="text-sm font-mono tracking-widest uppercase mb-3"
          style={{ color: "var(--warm)" }}
        >
          Research
        </p>
        <div className="flex items-baseline gap-3 mb-3">
          <h1 className="font-serif text-4xl" style={{ color: "var(--dark)" }}>
            Publications
          </h1>
          <span className="tag-accent text-xs font-mono">{total}</span>
        </div>
        <p className="text-base" style={{ color: "var(--mid)" }}>
          Peer-reviewed papers and conference proceedings. Sorted newest first.
        </p>
      </header>

      {/* Publication List */}
      <div className="space-y-6">
        {profile.publications.map((pub, i) => {
          const isHighlight = pub.highlight === true;

          return (
            <article
              key={i}
              className={[
                "rounded-xl p-6 border transition-shadow hover:shadow-md",
                isHighlight ? "border-l-4" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                background: isHighlight ? "var(--surface)" : "transparent",
                borderColor: isHighlight ? "var(--border)" : "var(--border)",
                borderLeftColor: isHighlight ? "var(--accent)" : undefined,
              }}
            >
              {/* Top row: year + featured badge */}
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--warm)" }}
                >
                  {pub.time}
                </span>
                {isHighlight && <span className="tag-accent">Featured</span>}
              </div>

              {/* Title */}
              <h2
                className="font-serif text-xl leading-snug mb-2"
                style={{ color: "var(--dark)" }}
              >
                {pub.title}
              </h2>

              {/* Authors */}
              <p className="text-sm mb-1" style={{ color: "var(--mid)" }}>
                {pub.authors}
              </p>

              {/* Journal */}
              <p
                className="text-sm italic mb-4"
                style={{ color: "var(--mid)" }}
              >
                {pub.journal}
              </p>

              {/* Abstract (collapsible) */}
              {pub.abstract && (
                <details className="mb-4 group">
                  <summary
                    className="text-sm font-medium cursor-pointer select-none list-none flex items-center gap-1.5 w-fit"
                    style={{ color: "var(--accent)" }}
                  >
                    <svg
                      className="transition-transform group-open:rotate-90"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                    Abstract
                  </summary>
                  <p
                    className="mt-3 text-sm leading-relaxed pl-5 border-l-2"
                    style={{
                      color: "var(--mid)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {pub.abstract}
                  </p>
                </details>
              )}

              {/* Read Paper button */}
              {pub.link && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs"
                >
                  Read Paper
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
            </article>
          );
        })}
      </div>
    </div>
  );
}
