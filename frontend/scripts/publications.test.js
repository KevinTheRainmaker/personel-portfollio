const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..", "..");
const { publications } = JSON.parse(
  fs.readFileSync(path.join(root, "data", "profile-data.json"), "utf8")
);

function readImage(mediaPath) {
  assert.match(mediaPath, /^\/images\/publications\/[^/\\]+\.(png|gif)$/);
  const content = fs.readFileSync(path.join(root, "assets", mediaPath));
  if (content.subarray(0, 3).toString() === "GIF") {
    return { width: content.readUInt16LE(6), height: content.readUInt16LE(8) };
  }
  assert.equal(content.subarray(1, 4).toString(), "PNG");
  return { width: content.readUInt32BE(16), height: content.readUInt32BE(20) };
}

test("publication titles are unique and required metadata is present", () => {
  assert.equal(new Set(publications.map((p) => p.title)).size, publications.length);
  for (const publication of publications) {
    for (const field of ["title", "authors", "journal"]) {
      assert.ok(publication[field]?.trim(), `${publication.title}: missing ${field}`);
    }
    // Manuscripts under review may not have an assigned publication date.
    assert.equal(typeof publication.time, "string");
    if (publication.link) assert.match(publication.link, /^https?:\/\//);
  }
});

test("publication media exists with accurate dimensions and alternative text", () => {
  for (const publication of publications) {
    if (!publication.thumbnail) continue;
    assert.ok(publication.thumbnailAlt?.trim(), `${publication.title}: missing alt text`);
    const dimensions = readImage(publication.thumbnail);
    assert.deepEqual(dimensions, {
      width: publication.thumbnailWidth,
      height: publication.thumbnailHeight,
    });
    assert.ok(dimensions.width > 0 && dimensions.height > 0);
    if (publication.thumbnail.endsWith(".gif")) {
      assert.ok(publication.thumbnailPoster, `${publication.title}: missing still preview`);
      assert.deepEqual(readImage(publication.thumbnailPoster), dimensions);
    }
  }
});
