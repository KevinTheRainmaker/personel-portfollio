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
