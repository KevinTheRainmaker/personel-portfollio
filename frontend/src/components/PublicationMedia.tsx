"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface PublicationMediaProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  poster?: string;
}

export default function PublicationMedia({
  src,
  width,
  height,
  alt,
  title,
  poster,
}: PublicationMediaProps) {
  // Start with a still frame until the visitor's motion preference is known.
  const [reducedMotion, setReducedMotion] = useState(true);
  const [paused, setPaused] = useState<boolean | null>(null);

  useEffect(() => {
    if (!poster) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      setPaused(null);
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, [poster]);

  const playing = Boolean(poster) && !(paused ?? reducedMotion);
  const action = playing ? "Pause animation" : "Play animation";

  return (
    <div className="mb-4">
      <div
        className="overflow-hidden rounded-lg border"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
          aspectRatio: `${width} / ${height}`,
        }}
      >
        <Image
          src={poster && !playing ? poster : src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1820px) 590px, (min-width: 1280px) calc(46vw - 258px), (min-width: 768px) calc(100vw - 494px), calc(100vw - 66px)"
          className="block h-full w-full object-contain"
          loading="lazy"
          unoptimized={playing}
        />
      </div>
      {poster && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2"
          aria-label={`${action}: ${title}`}
          onClick={() => setPaused(playing)}
        >
          {action}
        </Button>
      )}
    </div>
  );
}
