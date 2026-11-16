const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const test = require('node:test');
const root = path.join(__dirname, '..');
function loadTs(file, imports) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: (name) => {
    assert.ok(Object.hasOwn(imports, name), `Unexpected import: ${name}`);
    return imports[name];
  }, Date });
  return exports;
}
const profileData = JSON.parse(fs.readFileSync(path.join(root, '..', 'data/profile-data.json'), 'utf8'));
const profileModule = loadTs('src/lib/profile.ts', { '../data/profile-data.json': profileData });
const { buildSystemPrompt } = loadTs('src/lib/chat-prompt.ts', { './profile': profileModule });
const prompt = buildSystemPrompt(new Date('2026-11-16T16:00:00Z'));
test('chat receives the same current research narrative and position as the site', () => {
  for (const text of [profileModule.siteConfig.bio2, profileModule.siteConfig.title, ...profileModule.siteConfig.researchAreas.map(a => a.title)]) assert.ok(prompt.includes(text));
  assert.ok(prompt.includes('2026-11-17'));
});
test('chat preserves full publication evidence and review status', () => {
  for (const paper of profileData.publications) assert.ok(prompt.includes(JSON.stringify(paper.title)));
  assert.ok(prompt.includes('Under Review'));
  assert.ok(prompt.includes('not accepted or published'));
});
test('prompt answers broad questions concretely and separates facts from interpretation', () => {
  for (const rule of ['Start with a direct', 'documented role', 'Do not invent', 'label your interpretation', 'exact supplied URL']) assert.ok(prompt.includes(rule));
});
test('home emphasizes connected capabilities and agency without the pink accent', () => {
  const page = fs.readFileSync(path.join(root, 'src/app/page.tsx'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
  assert.match(profileModule.siteConfig.bio2, /extend human capabilities while preserving people’s agency/);
  assert.ok(page.includes('<strong key={index}>'));
  assert.ok(!page.includes('--rq-accent'));
  assert.ok(!css.includes('--rq-accent'));
});
