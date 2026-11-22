/* Synthetic browser checks. No real model calls. */
async function verifyChatContext(page, baseUrl = "http://127.0.0.1:3105") {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const errors = [], payloads = [];
  const onError = error => errors.push(error.message);
  page.on("pageerror", onError);
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(baseUrl); await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    sessionStorage.clear();
    sessionStorage.setItem("chat-messages", JSON.stringify([{role:"assistant",content:"LEGACY_HIDDEN_SENTINEL"}]));
    sessionStorage.setItem("chat-messages:old", JSON.stringify([{role:"assistant",content:"STALE_HIDDEN_SENTINEL"}]));
  });
  await page.reload(); await page.waitForLoadState("networkidle");
  const desktop = page.locator("aside");
  const input = desktop.getByRole("textbox", {name:"Message to digital twin"});
  assert(!(await desktop.textContent()).includes("HIDDEN_SENTINEL"), "Old conversation remains visible");
  const keys = await page.evaluate(() => Object.keys(sessionStorage));
  assert(!keys.includes("chat-messages") && !keys.includes("chat-messages:old"), "Old storage not cleared");
  assert(keys.some(key => /^chat-messages:[a-f0-9]{64}$/.test(key)), "Versioned storage absent");
  let nextRevision = null;
  await page.route("**/api/chat", async route => {
    const payload = route.request().postDataJSON(); payloads.push(payload);
    await route.fulfill({json:{response:"Current public evidence reply",context_revision:nextRevision || payload.contextRevision}});
  });
  try {
    await input.fill("Current public website question"); await input.press("Enter");
    await desktop.getByText("Current public evidence reply",{exact:true}).waitFor();
    assert(/^[a-f0-9]{64}$/.test(payloads[0].contextRevision), "Revision not sent");
    assert(!JSON.stringify(payloads[0]).includes("HIDDEN_SENTINEL"), "Old evidence sent");
    await page.reload(); await page.waitForLoadState("networkidle");
    await desktop.getByText("Current public evidence reply",{exact:true}).waitFor();
    nextRevision = "b".repeat(64);
    await input.fill("Question after deployment"); await input.press("Enter");
    await page.waitForFunction(revision => !!sessionStorage.getItem("chat-messages:" + revision), nextRevision);
    assert(!(await desktop.textContent()).includes("Current public website question"), "Previous-version exchange remains after response");
    await input.fill("Follow up after deployment"); await input.press("Enter");
    await page.waitForTimeout(100);
    assert(payloads[2].contextRevision === nextRevision, "Next request still sends old revision");
    assert(!JSON.stringify(payloads[2]).includes("Current public website question"), "Old exchange reintroduced");
    assert(errors.length===0, errors.join(";"));
    return {legacy_storage_cleared:true,stale_storage_cleared:true,current_revision_sent:true,current_conversation_survives_reload:true,open_tab_adopts_new_revision:true,errors};
  } finally { await page.unroute("**/api/chat"); page.off("pageerror", onError); }
};
