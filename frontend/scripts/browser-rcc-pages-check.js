/* Direct-document and unchanged portfolio checks; no Google account or model calls. */
async function verifyRccPages(page, baseUrl = "http://127.0.0.1:3105") {
  const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
  const errors = [], results = [];
  const onError = error => errors.push(error.message);
  const onConsole = msg => { if(msg.type()==="error")errors.push(msg.text()); };
  page.on("pageerror",onError); page.on("console",onConsole);
  try {
    await page.goto(baseUrl+"/rcc"); await page.waitForLoadState("networkidle");
    await page.evaluate(() => sessionStorage.clear());
    for (const width of [1440,390]) {
      await page.setViewportSize({width,height:width===390?844:1000});
      for (const path of ["/rcc","/rcc/privacy"]) {
        const response=await page.goto(baseUrl+path); await page.waitForLoadState("networkidle");
        assert(response.status()===200, "Document unavailable: "+path);
        assert(await page.locator("main h1").count()===1,"Missing document heading");
        assert(await page.locator("aside,nav,form").count()===0,"Portfolio chrome on document");
        assert(await page.getByRole("textbox").count()===0,"Chat/input on document");
        assert(await page.locator('meta[name="robots"]').getAttribute("content")==="noindex, nofollow","Missing search exclusion");
        assert(await page.locator('link[rel="canonical"]').getAttribute("href")==="https://portfolio.kangbeen.my"+path,"Canonical mismatch");
        assert(await page.locator("article").getAttribute("lang")==="ko","Document language missing");
        const shape=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1||document.querySelector('main').scrollWidth>innerWidth+1,chatKeys:Object.keys(sessionStorage).filter(k=>k.startsWith('chat-messages'))}));
        assert(!shape.overflow,"Horizontal overflow"); assert(!shape.chatKeys.length,"Chat mounted on document");
        const lastLink=page.locator('main a').last(); await lastLink.focus();
        assert(await lastLink.evaluate(e=>e===document.activeElement),"Link not keyboard focusable");
        await page.locator('main').evaluate(e=>e.scrollTo(0,e.scrollHeight));
        assert(await page.locator('footer').isVisible(),"Footer missing");
        const text=await page.locator('main').innerText();
        assert(text.includes('Research Command Center'),"App identity missing");
        assert(text.includes('kangbeen.ko@gm.gist.ac.kr'),"Contact missing");
        if(path.endsWith('privacy'))for(const term of ['Keychain','Google Sheets','Revi','GitHub','삭제','Limited Use'])assert(text.includes(term),"Policy missing "+term);
        results.push({width,path,status:response.status(),pass:true});
      }
    }
    for(const path of ['/','/research','/papers','/cv']) {
      await page.goto(baseUrl+path); await page.waitForLoadState('networkidle');
      assert(await page.locator('a[href="/rcc"],a[href^="/rcc/"],a[href^="https://portfolio.kangbeen.my/rcc"]').count()===0,'RCC entry link added to portfolio '+path);
      assert(await page.locator('aside').count()===1,'Portfolio navigation lost');
      results.push({path,noRccLinks:true,pass:true});
    }
    assert(errors.length===0,errors.join(';'));
    return {results,errors};
  } finally {page.off('pageerror',onError);page.off('console',onConsole);}
};
