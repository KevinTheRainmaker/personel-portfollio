/* Run through Playwright browser_run_code_unsafe(filename), or evaluate this function with a Playwright Page.
   Chat requests are intercepted; no real LLM request is sent. */
async function verifyAffectUI(page, baseUrl = 'http://127.0.0.1:3105') {
  const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
  const results = [], errors = [];
  const onError = error => errors.push(error.message);
  const onConsole = msg => { if (msg.type() === 'error') errors.push(msg.text()); };
  page.on('pageerror', onError);
  page.on('console', onConsole);
  let requests = 0;
  await page.route('**/api/chat', async route => {
    requests++;
    await new Promise(resolve => setTimeout(resolve, 250));
    await route.fulfill({json: {response: 'Verified sample reply. [View publications](/papers)'}});
  });
  try {
    for (const width of [1920, 1440, 768, 390]) {
      await page.setViewportSize({width, height: width < 768 ? 844 : 1000});
      for (const path of ['/', '/research', '/papers', '/cv']) {
        await page.goto(baseUrl + path); await page.waitForLoadState('networkidle');
        const geometry = await page.evaluate(() => {
          const main = document.querySelector('main');
          return {overflow:main.scrollWidth > main.clientWidth+1 || document.documentElement.scrollWidth > innerWidth+1,
            cards:main.querySelectorAll('.ui-crd').length,
            invalidNesting:document.querySelectorAll('button button, a button, button a').length,
            cardTitleSizes:[...main.querySelectorAll('.ui-crd__title')].map(e=>parseFloat(getComputedStyle(e).fontSize))};
        });
        assert(!geometry.overflow, `Horizontal overflow ${width} ${path}`);
        assert(!geometry.invalidNesting, `Nested interactive control ${path}`);
        if (path === '/research') assert(geometry.cards===3 && geometry.cardTitleSizes.every(n=>n>=20), 'Research cards/heading hierarchy');
        if (path === '/papers') {
          const papers=await page.locator('main article').evaluateAll(es=>es.map(e=>({title:e.querySelector('h2')?.textContent||'',featured:e.classList.contains('ui-crd'),images:e.querySelectorAll('img').length})));
          assert(papers.length===6, 'Published papers changed');
          assert(await page.locator('main .portfolio-publication-card > .ui-crd__card').evaluateAll(es=>es.every(e=>parseFloat(getComputedStyle(e).borderLeftWidth)===0)), 'Removed left accent returned');
          let regular=false;
          for(const paper of papers) { if(!paper.featured)regular=true; else assert(!regular,'Featured ordering changed'); if(!paper.featured)assert(paper.images===0,'Nonfeatured media'); }
          assert(papers[0].title.includes('MagToTheFuture'),'Latest featured paper changed');
          const summary=page.locator('main summary').first();
          if(await summary.count()) { await summary.focus(); await page.keyboard.press('Enter'); assert(await summary.evaluate(e=>e.parentElement.open), 'Summary keyboard interaction'); }
        }
        if(path==='/cv') assert(geometry.cards===0,'CV must remain a document');
        results.push({width,path,...geometry,pass:true});
      }
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(baseUrl); await page.waitForLoadState('networkidle');
    const desktop=page.locator('aside');
    const input=desktop.getByRole('textbox',{name:'Message to digital twin'});
    await desktop.getByRole('button',{name:'Reset chat'}).click();
    await input.fill('Synthetic UI test');
    await input.dispatchEvent('keydown',{key:'Enter',code:'Enter',isComposing:true,bubbles:true});
    assert(requests===0,'IME composition sent a request');
    await input.press('Enter');
    await desktop.getByText('Verified sample reply.',{exact:false}).waitFor();
    assert(requests===1,'Chat send duplicate or missing');
    await desktop.getByRole('link',{name:'Research',exact:true}).click();
    await desktop.getByText('Verified sample reply.',{exact:false}).waitFor();
    assert(await desktop.locator('.ui-tf').count()===1,'Desktop official TextField missing');
    await desktop.getByRole('button',{name:'Reset chat'}).click();
    assert(await desktop.getByText('Verified sample reply.',{exact:false}).count()===0,'Reset failed');
    const toggle=desktop.getByRole('button',{name:'Discover with My Digital Twin'});
    await toggle.click(); assert(await toggle.getAttribute('aria-expanded')==='false','Collapse state');
    await toggle.click(); assert(await input.isVisible(),'Expand failed');
    results.push({test:'desktop_chat_ime_send_navigation_reset_collapse',pass:true});
    await page.setViewportSize({width:390,height:844});
    await page.getByRole('button',{name:'Open chat',exact:true}).click();
    const mobileInput=page.getByRole('textbox',{name:'Message to digital twin'}).filter({visible:true});
    assert(await mobileInput.evaluate(e=>parseFloat(getComputedStyle(e).fontSize))>=16,'Mobile input zoom risk');
    await mobileInput.fill('Mobile synthetic UI test');
    const send=page.getByRole('button',{name:'Send',exact:true}).filter({visible:true});
    await send.click();
    assert(await send.isDisabled(),'Loading send not disabled');
    await mobileInput.press('Enter');
    await page.getByText('Verified sample reply.',{exact:false}).filter({visible:true}).waitFor();
    assert(requests===2,'Mobile duplicate request');
    await page.getByRole('link',{name:'View publications',exact:true}).filter({visible:true}).click();
    await page.waitForURL('**/papers');
    assert(!await page.getByRole('button',{name:'Close chat'}).isVisible(),'Internal link did not close sheet');
    await page.getByRole('button',{name:'Open chat',exact:true}).click();
    await page.getByRole('button',{name:'Reset chat'}).filter({visible:true}).click();
    await page.getByRole('button',{name:'Close chat'}).click();
    results.push({test:'mobile_chat_send_duplicate_guard_internal_link_reset_close',pass:true});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(baseUrl+'/papers'); await page.waitForLoadState('networkidle');
    const play=page.getByRole('button',{name:/Play animation:/}).first();
    assert(await play.count()===1,'Reduced motion must start paused');
    await play.click();
    const pause=page.getByRole('button',{name:/Pause animation:/}).first();
    await pause.waitFor(); await pause.click();
    results.push({test:'reduced_motion_play_pause',pass:true});
    assert(errors.length===0,'Browser page errors: '+errors.join(';'));
    return results;
  } finally { page.off('pageerror',onError); page.off('console',onConsole); await page.unroute('**/api/chat'); await page.emulateMedia({reducedMotion:'no-preference'}); }
};
