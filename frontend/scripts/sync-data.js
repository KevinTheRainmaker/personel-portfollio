const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "..", "data", "profile-data.json");
const destDir = path.join(__dirname, "..", "src", "data");
const dest = path.join(destDir, "profile-data.json");

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log("[sync-data] Copied profile-data.json from root/data/");
} else {
  console.log("[sync-data] Root data not found — using bundled copy");
}

// Keep source media in root/assets, and ship only the publication files in use.
const mediaPrefix = "/images/publications/";
const profile = JSON.parse(fs.readFileSync(dest, "utf8"));
const mediaPaths = new Set(
  profile.publications.flatMap((publication) =>
    [publication.thumbnail, publication.thumbnailPoster].filter(Boolean)
  )
);

for (const mediaPath of mediaPaths) {
  const filename = path.posix.basename(mediaPath);
  if (mediaPath !== `${mediaPrefix}${filename}`) {
    throw new Error(`[sync-data] Invalid publication media path: ${mediaPath}`);
  }
  const source = path.join(__dirname, "..", "..", "assets", mediaPath);
  const target = path.join(__dirname, "..", "public", mediaPath);
  if (fs.existsSync(source)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  } else if (!fs.existsSync(target)) {
    throw new Error(`[sync-data] Missing publication media: ${mediaPath}`);
  }
}
console.log(`[sync-data] Synced ${mediaPaths.size} publication media files`);
