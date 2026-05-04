import { siteConfig } from "@/lib/profile";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t mt-16" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          © {year} {siteConfig.name}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors hover:underline"
            style={{ color: "var(--muted)" }}
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors hover:underline"
            style={{ color: "var(--muted)" }}
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-sm transition-colors hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
