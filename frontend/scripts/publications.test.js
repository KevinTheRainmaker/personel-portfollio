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

const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
function loadTs(file, imports) {
  const source = fs.readFileSync(path.join(root, "frontend", file), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ES2020,
  } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, React, require: (name) => {
    assert.ok(Object.hasOwn(imports, name), `Unexpected import: ${name}`);
    return imports[name];
  } });
  return exports;
}
const rawProfile = JSON.parse(fs.readFileSync(path.join(root, "data/profile-data.json"), "utf8"));
const rawBefore = JSON.stringify(rawProfile);
const profileModule = loadTs("src/lib/profile.ts", { "../data/profile-data.json": rawProfile });

test("date ordering supports year, month, ISO date, ranges, present, and unknown dates", () => {
  const { latestDateKey: key, newestFirst } = profileModule;
  assert.ok(key("April 2026") > key("2026"));
  assert.ok(key("2026-05-01") > key("April 2026"));
  assert.equal(key("Jun. 2023 – July. 2024"), key("July 2024"));
  assert.equal(key("2024-2025"), key("2025"));
  assert.equal(key("Latest: 2023"), key("2023"));
  assert.ok(key("Mar. 2025 – Present") > key("2026"));
  const items = [
    { time: "2026", highlight: false, id: "regular-new" },
    { time: "2025", highlight: true, id: "featured-old" },
    { time: "", highlight: true, id: "undated" },
    { time: "April 2026", highlight: true, id: "featured-new" },
    { time: "April 2026", highlight: true, id: "tie" },
  ];
  assert.equal(newestFirst(items, true).map(p => p.id).join(","),
    "featured-new,tie,featured-old,undated,regular-new");
  assert.equal(items[0].id, "regular-new");
});

test("all dated display lists are newest first while source and skills are unchanged", () => {
  const { profile, latestDateKey: key } = profileModule;
  for (const name of ["education", "experiences", "projects", "awards", "otherExperiences"]) {
    for (let i = 1; i < profile[name].length; i++) {
      assert.ok(key(profile[name][i - 1].time) >= key(profile[name][i].time), name);
    }
  }
  assert.equal(profile.skills, rawProfile.skills);
  assert.equal(JSON.stringify(rawProfile), rawBefore);
});

test("rendered publications keep featured above regular and mount media only for featured", () => {
  const mediaTitles = [];
  const { default: Page } = loadTs("src/app/papers/page.tsx", {
    "@/lib/profile": profileModule,
    "@/components/PublicationMedia": { __esModule: true, default: (props) => {
      mediaTitles.push(props.title);
      return React.createElement("img", { src: props.src, alt: props.alt });
    } },
  });
  const html = renderToStaticMarkup(React.createElement(Page));
  const articles = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(m => m[0]);
  const shown = profileModule.profile.publications;
  assert.equal(articles.length, publications.length);
  let regularSeen = false;
  shown.forEach((pub, i) => {
    if (pub.highlight !== true) regularSeen = true;
    else assert.equal(regularSeen, false, "featured appears after regular");
    if (i && shown[i - 1].highlight === pub.highlight) {
      assert.ok(profileModule.latestDateKey(shown[i - 1].time) >= profileModule.latestDateKey(pub.time));
    }
    assert.equal(/<img\b/.test(articles[i]), pub.highlight === true && Boolean(pub.thumbnail));
    if (pub.highlight !== true) assert.ok(!articles[i].includes("xl:grid-cols-"));
  });
  assert.ok(mediaTitles.length > 0);
  assert.ok(mediaTitles.every(title => publications.find(p => p.title === title).highlight === true));
});
