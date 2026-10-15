// Shared harness for the parallel-course port tests (docs/change-specs/coverage-parallel-courses-v0.1.md).
// Each tests/port-<course>.cjs supplies only its oracles; the checks below are the same for every course and match
// the generic checks of tests/port87.cjs. This file is shared: only the integration pass changes it.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const E=require('../src/course-banks.js'),COURSES=require('../src/port-courses.js');
const SEEDS=['a','b',7,'port'];
const TOPICS=new Set(E.connections.topics.map(t=>t.id));
const BAD=/NaN|undefined|Infinity|\[object Object\]/;

// Decision files for this course: batch named <PREFIX>-<n>, file named YYYY-MM-DD-<prefix>-batch<n>-*.json.
function courseDecisions(m,bank,working){
 const dir=path.join(root,'curriculum/coverage-ledger/v0.1/decisions'),lower=m.batchPrefix.toLowerCase(),files=[],decided=new Map();
 const inventory=new Set(JSON.parse(fs.readFileSync(path.join(root,'curriculum/course-inventory/v0.1',bank+'.json'),'utf8')).map(r=>r.id));
 for(const f of fs.readdirSync(dir).sort()){
  const d=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')),byName=new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${lower}-batch(\\d+)-`).exec(f),byBatch=new RegExp(`^${m.batchPrefix}-(\\d+)\\b`).exec(String(d.batch));
  if(!byName&&!byBatch)continue;
  assert(byName&&byBatch&&byName[1]===byBatch[1],`${f}: file name and batch field must both name batch ${m.batchPrefix}-n`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&d.reviewer,f+': date and reviewer');
  for(const x of d.decisions){
   assert(inventory.has(x.id),`${f}: ${x.id} is not a ${m.course} record`);
   assert(!decided.has(x.id),`${f}: ${x.id} already decided in ${decided.get(x.id)}`);decided.set(x.id,f);
   assert(['covered','consolidated','retired'].includes(x.state),f+': '+x.id+' bad state');
   if(x.state==='covered'){assert(x.by&&x.by.length,x.id+': covered needs "by"');for(const w of x.by)assert(working.has(w),`${x.id} is covered by ${w}, which is not a working entry`);}
   if(x.state==='consolidated')assert(x.into,x.id+': consolidated needs "into"');
   if(x.state==='retired')assert(x.ownerApproval&&x.reason,x.id+': retirement needs ownerApproval and a reason');
  }
  files.push(f);
 }
 return{files,decided:decided.size};
}

function run({key,oracle,wrong={},instances=250}){
 const m=COURSES.find(x=>x.key===key);assert(m,'unknown course '+key);
 const bank={'intermediate-4':'intermediate-4-en','algebra-half':'algebra-half-en','algebra-1':'algebra-1-en','algebra-2':'algebra-2-en'}[key];
 const N=Math.max(1,Math.ceil(instances/SEEDS.length)),working=new Set(E.catalog.map(c=>c.sourceId));
 // Registration: every task is served by course-banks, belongs to this course and has an oracle.
 const ids=new Set();
 for(const c of m.catalog){
  assert(!ids.has(c.sourceId),'duplicate task '+c.sourceId);ids.add(c.sourceId);
  assert(c.sourceId.startsWith(bank+':')&&c.sourceRecord===c.sourceId,c.sourceId+' is not a '+m.course+' record ID');
  assert(working.has(c.sourceId),c.sourceId+' is not a working course-banks entry');
  assert(typeof oracle[c.recipe]==='function','No oracle for '+c.recipe);
  assert(TOPICS.has(c.topic),`${c.sourceId}: topic "${c.topic}" is not an existing cross-course topic. Use one of the existing topics; a new topic is a shared change, so ask the owner.`);
 }
 for(const r of Object.keys(oracle))assert(m.catalog.some(c=>c.recipe===r),'oracle for a recipe with no task: '+r);
 for(const r of Object.keys(wrong))assert(m.catalog.some(c=>c.recipe===r),'wrong-answer list for a recipe with no task: '+r);
 let n=0;
 for(const c of m.catalog){const seen=new Set();
  for(const seed of SEEDS)for(let index=0;index<N;index++){
   const q=E.generate(c.sourceId,{seed,index}),q2=E.generate(c.sourceId,{seed,index});n++;
   assert.deepEqual(q,q2,c.sourceId+' deterministic');assert(Object.isFrozen(q));
   assert.equal(q.family,'structured-port87');assert.equal(q.provenance.sourceRecord,c.sourceRecord);assert.equal(q.givens.recipe,c.recipe);
   seen.add(q.prompt+JSON.stringify(q.givens.parameters));
   const p=q.givens.parameters,a=q.answer,key=E.answerText(q);
   assert(q.prompt&&!BAD.test(q.prompt)&&!BAD.test(q.solution)&&!BAD.test(String(key)),c.sourceId+' text: '+q.prompt);
   // Independent mathematics.
   assert(oracle[c.recipe](q,p),c.sourceId+' oracle '+JSON.stringify(p));
   // Keys check as correct; every distractor checks as wrong and names its mistake.
   if(a.kind!=='teacher')assert(E.checkAnswer(q,key).answerCorrect,c.sourceId+' key '+key);
   else assert(a.rubric&&a.rubric.length>=2,c.sourceId+' teacher-scored tasks need a rubric');
   if(q.choices){const vals=q.choices.map(x=>String(x.value));
    assert.equal(new Set(vals).size,vals.length,c.sourceId+' distinct choices');assert(vals.length>=2&&vals.length<=4,c.sourceId+' 2–4 distractors');
    for(const ch of q.choices){assert(ch.mistake&&ch.mistake.length>8,c.sourceId+' named mistake');assert(!BAD.test(ch.value));
     if(a.kind!=='teacher')assert(!E.checkAnswer(q,ch.value).answerCorrect,c.sourceId+' distractor accepted: '+ch.value);}}
   if(wrong[c.recipe])for(const s of wrong[c.recipe](q))assert(!E.checkAnswer(q,s).answerCorrect,c.sourceId+' accepted wrong answer: '+s);
   // Drawings are original SVG with a title for screen readers.
   for(const s of [q.givens.svg,q.teacherSvg].filter(Boolean))assert(/<svg[\s>]/.test(s)&&/<title>[^<]+<\/title>/.test(s)&&!BAD.test(s),c.sourceId+' drawing');
   assert(/<div class="engine-question">/.test(E.renderQuestion(q)));
  }
  assert(seen.size>1,c.sourceId+' varies');
 }
 const dec=courseDecisions(m,bank,working);
 console.log(`PASS port-${key}: ${m.catalog.length} tasks, ${n} instances (${SEEDS.length*N} each): independent keys, distractors rejected and named, drawings, determinism; ${dec.files.length} decision files, ${dec.decided} records decided`);
}
module.exports={run};
