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
const contextModule = loadTs('src/lib/portfolio-context.ts', { './profile': profileModule, 'node:crypto': require('node:crypto') });
const { buildSystemPrompt, validateResponseLinks } = loadTs('src/lib/chat-prompt.ts', { './profile': profileModule, './portfolio-context': contextModule });
const prompt = buildSystemPrompt(new Date('2026-11-16T16:00:00Z'));
test('chat receives the same current research narrative and position as the site', () => {
  for (const text of [profileModule.siteConfig.bio2, profileModule.siteConfig.title, ...profileModule.siteConfig.researchAreas.map(a => a.title)]) assert.ok(prompt.includes(text));
  assert.ok(prompt.includes('2026-11-17'));
});
test('chat includes only the publications displayed by Papers and CV', () => {
  const visible = profileModule.publishedPublications;
  assert.deepEqual(Array.from(contextModule.publicSiteContent.sections.publications, p=>p.title), Array.from(visible,p=>p.title));
  for (const paper of visible) {
    assert.ok(prompt.includes(JSON.stringify(paper.title)));
    assert.ok(prompt.includes(JSON.stringify(paper.summary)));
  }
  for (const paper of profileData.publications.filter(p=>p.status !== 'published')) {
    for (const value of [paper.title, paper.summary, paper.abstract].filter(Boolean)) assert.ok(!prompt.includes(value), 'Hidden paper evidence entered prompt');
  }
  assert.ok(!prompt.includes('Under Review'));
  assert.ok(prompt.includes('Do not recover excluded manuscripts'));
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

test('response links retain verified paper and page URLs but remove invented destinations', () => {
  const paper = profileData.publications.find(p => p.link);
  assert.equal(validateResponseLinks(`[Paper](${paper.link})`), `[Paper](${paper.link})`);
  assert.equal(validateResponseLinks('[Research](/research)'), '[Research](/research)');
  assert.equal(validateResponseLinks('[Peach Seoga](/projects)'), 'Peach Seoga');
  assert.equal(validateResponseLinks('[Paper](https://example.com/invented)'), 'Paper');
});


test('public context contains displayed record fields but no abstracts or media metadata', () => {
  const content = contextModule.publicSiteContent;
  assert.ok(prompt.includes(JSON.stringify(content.site)));
  for (const [key, records] of Object.entries(content.sections)) {
    assert.equal(records.length, key === 'publications' ? profileModule.publishedPublications.length : profileData[key].length);
    for (const record of records) assert.ok(prompt.includes(JSON.stringify(record)));
  }
  for(const key of ['abstract', 'thumbnail', 'thumbnailWidth', 'thumbnailPoster', 'thumbnailAlt']) assert.ok(!Object.values(content.sections).flat().some(record=>key in record));
});

test('background and position are rendered from the same source used by chat', () => {
  const researchPage = fs.readFileSync(path.join(root, 'src/app/research/page.tsx'), 'utf8');
  assert.ok(researchPage.includes('siteConfig.background.map'));
  for (const field of ['role', 'lab', 'institution', 'period', 'advisor']) {
    assert.ok(researchPage.includes(`siteConfig.currentPosition.${field}`));
    assert.ok(prompt.includes(profileModule.siteConfig.currentPosition[field]));
  }
  for (const paragraph of profileModule.siteConfig.background) assert.ok(prompt.includes(paragraph));
});

test('future unrendered fields and sections remain excluded by default', () => {
  const output = contextModule.buildPortfolioContext({ projects: [{title: 'Visible project', description:'Visible description', newContextField:'HIDDEN_FIELD'}], futureSection: [{detail:'HIDDEN_SECTION'}] }, {bio:'Visible biography', futureConfig:'HIDDEN_CONFIG', links:{github:'https://github.com/example', privateLink:'https://hidden.invalid'}});
  for(const value of ['Visible project','Visible description','Visible biography','https://github.com/example'])assert.ok(output.includes(value));
  for(const value of ['HIDDEN_FIELD','HIDDEN_SECTION','HIDDEN_CONFIG','hidden.invalid'])assert.ok(!output.includes(value));
});

test('accepted, preprint, under-review and unspecified publications stay out of evidence and allowed links', () => {
  const altered = JSON.parse(JSON.stringify(profileData));
  const template = altered.publications.find(p=>p.status==='published');
  for(const status of ['under_review','accepted','preprint',undefined]) altered.publications.push({...template,status,title:'HIDDEN_MANUSCRIPT_'+status,summary:'HIDDEN_SUMMARY_'+status,link:'https://hidden.invalid/'+status});
  altered.publications.find(p=>p.status==='published').abstract='HIDDEN_ABSTRACT';
  const pm=loadTs('src/lib/profile.ts',{'../data/profile-data.json':altered});
  const cm=loadTs('src/lib/portfolio-context.ts',{'./profile':pm,'node:crypto':require('node:crypto')});
  const promptModule=loadTs('src/lib/chat-prompt.ts',{'./portfolio-context':cm});
  assert.ok(!cm.portfolioContext.includes('HIDDEN_'));
  assert.ok(!cm.portfolioContext.includes('hidden.invalid'));
  assert.equal(promptModule.validateResponseLinks('[Hidden](https://hidden.invalid/accepted)'), 'Hidden');
  assert.ok(cm.portfolioContext.includes(template.title));
});

test('context revision follows visible content, not unpublished source changes', () => {
  const changed = JSON.parse(JSON.stringify(profileData));
  changed.publications.find(p=>p.status!=='published').summary='NEW_PRIVATE_SUMMARY';
  const revision = data => {
    const pm=loadTs('src/lib/profile.ts',{'../data/profile-data.json':data});
    return loadTs('src/lib/portfolio-context.ts',{'./profile':pm,'node:crypto':require('node:crypto')}).portfolioContextRevision;
  };
  assert.equal(revision(changed),contextModule.portfolioContextRevision);
  changed.projects[0].description+=' Public update.';
  assert.notEqual(revision(changed),contextModule.portfolioContextRevision);
});

test('site social links and verified CV anchors survive link validation', () => {
  for (const url of [...Object.values(profileModule.siteConfig.links), '/cv#projects']) {
    assert.equal(validateResponseLinks(`[Source](${url})`), `[Source](${url})`);
  }
  assert.equal(validateResponseLinks('[Unknown](/cv#invented)'), 'Unknown');
});

test('linked resources are not misrepresented as ingested content', () => {
  assert.ok(prompt.includes('Linked PDFs, external websites, images and videos are not read'));
  assert.ok(prompt.includes('do not imply that you have opened'));
});

if (process.env.CHAT_CONTEXT_REPORT === '1') {
  console.log(JSON.stringify({ contextCharacters: contextModule.portfolioContext.length, systemPromptCharacters: prompt.length, approximateTokensCharsDiv4: Math.ceil(prompt.length / 4), recordCounts: Object.fromEntries(Object.entries(contextModule.publicSiteContent.sections).map(([key, records]) => [key, records.length])) }, null, 2));
}


test('prompt forbids carrying undergraduate affiliation into graduate facts or inferring duties from authorship', () => {
  assert.ok(prompt.includes('A bachelor’s major does not identify the current graduate department'));
  assert.ok(prompt.includes('Author order establishes author order only'));
});
