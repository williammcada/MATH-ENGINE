'use strict';
// Optional browser check. Supply PLAYWRIGHT_MODULE if Playwright is outside node_modules.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined}),page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  const artifacts=process.env.REVIEW_ARTIFACTS||path.resolve('artifacts/review');fs.mkdirSync(artifacts,{recursive:true});
  page.on('pageerror',e=>errors.push(String(e)));
  try{
    await page.goto(pathToFileURL(path.resolve('review/grade5.html')).href);
    assert.equal(await page.locator('#version').textContent(),'0.2.0-rc.1');
    const ids=await page.evaluate(()=>MathEngineG5.catalog.map(f=>f.id));
    for(const id of ids){
      await page.selectOption('#family',id);await page.locator('#seed').fill('browser-check');await page.locator('#index').fill('0');await page.locator('#settings button[type=submit]').click();
      assert.equal(await page.locator('#error').textContent(),'');assert.equal(await page.locator('#teacher').evaluate(e=>e.open),false);
      const before=await page.locator('#question').innerHTML();
      const answer=await page.evaluate(id=>MathEngineG5.answerText(MathEngineG5.generate(id,{seed:'browser-check',index:0})),id);
      await page.locator('#answer').fill(answer);await page.locator('#answerForm button').click();
      assert.match(await page.locator('#feedback').textContent(),/Correct answer|final answer is correct/);
      await page.locator('#teacher summary').click();assert.ok(await page.locator('.worked-solution').isVisible());
      await page.locator('#settings button[type=submit]').click();assert.equal(await page.locator('#question').innerHTML(),before);assert.equal(await page.locator('#teacher').evaluate(e=>e.open),false);
      await page.locator('#next').click();assert.equal(await page.locator('#index').inputValue(),'1');
    }
    await page.selectOption('#family','g5.rectangular-prism-net-area');await page.locator('#settings button[type=submit]').click();
    assert.equal(await page.locator('#question svg rect').count(),6);
    await page.screenshot({path:path.join(artifacts,'net-desktop.png'),fullPage:true});
    await page.emulateMedia({media:'print'});assert.equal(await page.locator('#teacher').isVisible(),false);assert.equal(await page.locator('#answerForm').isVisible(),false);await page.emulateMedia({media:'screen'});
    await page.locator('#teacher summary').click();await page.screenshot({path:path.join(artifacts,'net-teacher.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844});await page.selectOption('#family','g5.fraction-expression-precedence');await page.locator('#settings button[type=submit]').click();
    assert.ok(await page.locator('#question math').isVisible());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
    await page.screenshot({path:path.join(artifacts,'fractions-narrow.png'),fullPage:true});
    const preserved=await page.locator('#question').innerHTML();await page.locator('#index').fill('-1');await page.locator('#next').click();assert.match(await page.locator('#error').textContent(),/nonnegative/);assert.equal(await page.locator('#question').innerHTML(),preserved);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({browser:await browser.version(),families:ids.length,checks:'generation, correct-answer entry, solution toggle/reset, seed replay, next item, invalid-index preservation, six SVG faces, MathML, print isolation, narrow overflow',pageErrors:errors,physicalDevices:'not tested'}));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
