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

test("every publication has a concise, display-ready summary", () => {
  for (const publication of publications) {
    assert.equal(typeof publication.summary, "string", `${publication.title}: missing summary`);
    const summary = publication.summary.trim();
    assert.ok(summary.length > 0, `${publication.title}: empty summary`);
    assert.ok(summary.split(/\s+/).length <= 100, `${publication.title}: summary exceeds 100 words`);
    assert.doesNotMatch(summary, /^(abstract|summary)\s*:/i);
    assert.doesNotMatch(summary, /\*\*|\n|<[^>]+>/, `${publication.title}: summary must be plain text`);
  }
});

test("featured selection includes MagToTheFuture and excludes InteractiSense and CKD", () => {
  const findPublication = (titlePart) => {
    const publication = publications.find((p) => p.title.includes(titlePart));
    assert.ok(publication, `Missing publication: ${titlePart}`);
    return publication;
  };

  assert.equal(findPublication("MagToTheFuture:").highlight, true);
  assert.equal(findPublication("Demonstrating InteractiSense:").highlight, false);
  assert.equal(findPublication("chronic kidney disease").highlight, false);
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
