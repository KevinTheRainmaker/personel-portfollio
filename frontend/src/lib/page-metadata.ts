import type { Metadata } from "next";
import { siteConfig } from "@/lib/profile";

type PortfolioPath = "/" | "/research" | "/papers" | "/cv";

export function portfolioPageMetadata(
  path: PortfolioPath,
  title: string,
  description: string,
): Metadata {
  const url = new URL(path, siteConfig.baseUrl).href;

  return {
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: `${siteConfig.name} Portfolio`,
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}
