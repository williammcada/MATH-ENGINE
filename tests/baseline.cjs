const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const base='baselines/megaman-v0.7/', source=fs.readFileSync(base+'shared-math.js','utf8'),meta=JSON.parse(fs.readFileSync(base+'provenance.json'));
assert.equal(crypto.createHash('sha256').update(source).digest('hex'),meta.bundle_sha256);
const ctx={structuredClone,console,Date,Math};vm.createContext(ctx);vm.runInContext(source,ctx);const m=ctx.SharedMath;
assert.equal(m.catalog.length,312);assert.equal(new Set(m.catalog.map(s=>s.id)).size,312);
let generated=0;
for(const skill of m.catalog){
 for(let i=0;i<20;i++){const item=skill.make();assert.ok(item.prompt,skill.id);assert.ok(m.checkAnswer(item,String(item.answer)),skill.id);generated++;}
 const state=m.freshMath(skill.id);state.config={mode:'targeted',lo:skill.grade,hi:skill.grade,count:1,selected:[skill.id],include24:true};
 const p=new m.Practice(state);p.open('baseline-test','run');assert.equal(state.gate.item.skillId,skill.id);assert.ok(p.submit(String(state.gate.item.answer)).complete,skill.id);
}
console.log(JSON.stringify({bundleHash:'passed',uniqueSkills:312,generatedOwnAnswerChecks:generated,targetedSingleSkillChecks:312,limitations:'Self-consistency smoke checks, not independent mathematical validation or browser/device verification.'}));
