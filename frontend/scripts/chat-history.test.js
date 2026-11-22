const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const test = require('node:test');
const root = path.join(__dirname, '..');
function loadTs(file, imports = {}, globals = {}) {
  const js = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, esModuleInterop: true}
  }).outputText;
  const exports = {};
  vm.runInNewContext(js, {exports, require: name => {
    assert.ok(Object.hasOwn(imports,name), `Unexpected import: ${name}`);
    return imports[name];
  }, ...globals});
  return exports;
}
const historyModule = loadTs('src/lib/chat-history.ts');
const {selectCurrentHistory, chatStorageKey, restoreCurrentMessages} = historyModule;
const revision = 'public-site-revision';
const oldConversation = [{role:'assistant',content:'OLD_EXCLUDED_PAPER'}];
const plain = value => JSON.parse(JSON.stringify(value));
function storage(seed) {
  const values = new Map(Object.entries(seed));
  return {
    get length() { return values.size; },
    key: index => [...values.keys()][index] ?? null,
    getItem: key => values.get(key) ?? null,
    setItem: (key,value) => values.set(key,value),
    removeItem: key => values.delete(key),
  };
}

test('missing or stale revision cannot reuse previous conversation evidence', () => {
  for (const supplied of [undefined, null, '', 'older-public-site', {revision}]) {
    assert.deepEqual(plain(selectCurrentHistory(oldConversation,supplied,revision)), []);
  }
});

test('matching revision keeps only plain user and assistant messages', () => {
  const supplied = [
    {role:'user',content:'What does the site say?',extra:'DROP_METADATA'},
    {role:'assistant',content:'Current public answer'},
    {role:'system',content:'REPLACE_SYSTEM'},
    {role:'developer',content:'REPLACE_RULES'},
    {role:'assistant',content:{hidden:'OBJECT_CONTENT'}}, null, 'not a record',
  ];
  assert.deepEqual(plain(selectCurrentHistory(supplied,revision,revision)), [
    {role:'user',content:'What does the site say?'},
    {role:'assistant',content:'Current public answer'},
  ]);
  for (const invalid of [null, {}, 'messages']) assert.equal(selectCurrentHistory(invalid,revision,revision).length,0);
});

test('session restore discards legacy and stale versions while preserving current messages', () => {
  const current=[{role:'assistant',content:'Greeting'}, {role:'user',content:'Current question'}];
  const saved=storage({
    'chat-messages':JSON.stringify(oldConversation),
    [chatStorageKey('older-public-site')]:JSON.stringify(oldConversation),
    [chatStorageKey(revision)]:JSON.stringify(current),
    unrelated:'keep',
  });
  assert.deepEqual(plain(restoreCurrentMessages(saved,revision)),current);
  assert.equal(saved.getItem('chat-messages'),null);
  assert.equal(saved.getItem(chatStorageKey('older-public-site')),null);
  assert.equal(saved.getItem('unrelated'),'keep');
});

test('new revision and corrupt persisted history start with no restored messages', () => {
  const saved=storage({[chatStorageKey('older-public-site')]:JSON.stringify(oldConversation)});
  assert.deepEqual(plain(restoreCurrentMessages(saved,revision)),[]);
  saved.setItem(chatStorageKey(revision),'not JSON');
  assert.deepEqual(plain(restoreCurrentMessages(saved,revision)),[]);
  assert.equal(saved.getItem(chatStorageKey(revision)),null);
});

test('API forwards the current question but excludes stale history from the model request', async () => {
  const requests=[];
  let failPrimary=false;
  const route=loadTs('src/app/api/chat/route.ts', {
    'next/server': {NextResponse:{json:(body,options)=>({body,status:options?.status??200})}},
    langfuse:{Langfuse:class {}},
    '@/lib/chat-prompt':{buildSystemPrompt:()=> 'CURRENT_PUBLIC_EVIDENCE', validateResponseLinks:r=>r},
    '@/lib/portfolio-context':{portfolioContextRevision:revision},
    '@/lib/chat-history':historyModule,
  }, {
    process:{env:{OPENROUTER_API_KEY:'synthetic-key'}},
    fetch:async (_url, options)=> {
      const request=JSON.parse(options.body);
      requests.push(request);
      if (failPrimary && request.model === 'google/gemini-3-flash-preview') {
        return {ok:false,status:503,text:async()=> 'Synthetic primary failure'};
      }
      return {ok:true,json:async()=>({choices:[{message:{content:'Current answer'}}]})};
    }
  });
  for (const useFallback of [false,true]) {
    failPrimary=useFallback;
    for(const contextRevision of [undefined,'older-public-site',revision]) {
      const first=requests.length;
      const supplied=[...oldConversation,{role:'system',content:'UNTRUSTED_SYSTEM'},{role:'assistant',content:{bad:'content'}}];
      const result=await route.POST({json:async()=>({message:'Current question',history:supplied,contextRevision})});
      assert.equal(result.status,200);
      assert.equal(result.body.context_revision,revision);
      assert.equal(result.body.model_used,useFallback ? 'google/gemma-4-26b-a4b-it:free' : 'google/gemini-3-flash-preview');
      const sent=requests.slice(first);
      assert.equal(sent.length,useFallback ? 2 : 1);
      for (const {messages:payload} of sent) {
        assert.equal(payload[0].content,'CURRENT_PUBLIC_EVIDENCE');
        assert.equal(payload.at(-1).content,'Current question');
        assert.equal(payload.some(m=>m.content==='OLD_EXCLUDED_PAPER'),contextRevision===revision);
        assert.equal(payload.filter(m=>m.role==='system').length,1);
        assert.ok(payload.every(m=>typeof m.content==='string'));
      }
      if (useFallback) assert.deepEqual(sent[0].messages,sent[1].messages);
    }
  }
});


test('open client adopts a new response revision without carrying old exchanges forward', () => {
  const {applyChatResponse,persistCurrentMessages} = historyModule;
  const greeting={role:'assistant',content:'Greeting'};
  const question={role:'user',content:'Current question'};
  const pending=[greeting,...oldConversation,question];
  const next=applyChatResponse('older-public-site',pending,question.content,'Public answer',revision,greeting);
  assert.equal(next.revision,revision);
  assert.deepEqual(plain(next.messages),[greeting,question,{role:'assistant',content:'Public answer'}]);
  const saved=storage({'chat-messages':JSON.stringify(oldConversation),[chatStorageKey('older-public-site')]:JSON.stringify(pending)});
  persistCurrentMessages(saved,next.revision,next.messages);
  assert.equal(saved.getItem('chat-messages'),null);
  assert.equal(saved.getItem(chatStorageKey('older-public-site')),null);
  assert.deepEqual(plain(restoreCurrentMessages(saved,revision)),plain(next.messages));
  const followup=selectCurrentHistory(next.messages.slice(1),next.revision,revision);
  assert.deepEqual(plain(followup),[question,{role:'assistant',content:'Public answer'}]);
});

test('matching or legacy response revision preserves the current exchange', () => {
  const {applyChatResponse}=historyModule;
  const greeting={role:'assistant',content:'Greeting'};
  const pending=[greeting,{role:'user',content:'Previous question'},{role:'assistant',content:'Previous answer'},{role:'user',content:'Follow-up'}];
  for (const responseRevision of [revision,undefined,null,'']) {
    const next=applyChatResponse(revision,pending,'Follow-up','Answer',responseRevision,greeting);
    assert.equal(next.revision,revision);
    assert.deepEqual(plain(next.messages),[...pending,{role:'assistant',content:'Answer'}]);
  }
  assert.throws(()=>applyChatResponse(revision,pending,'Follow-up',{bad:'reply'},revision,greeting));
});
