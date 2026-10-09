const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),E=require('../src/course-banks'),C=E.connections,D=require('../src/cross-course-map');
assert.equal(E.catalog.length,2184);assert.equal(C.profiles.length,2184);assert.equal(C.tracks.length,245);assert.equal(C.topics.length,66);
const placements=require('../curriculum/course-placement.json').courses;
assert.deepEqual(C.coursePlacement,placements);
const grades={'intermediate-4-en':3,'course-1-en':4,'course-87-en':5,'algebra-half-en':null,'algebra-1-en':null,'algebra-2-en':null};
for(const p of C.profiles){assert.equal(p.localGrade,grades[p.bankId]);assert.equal(p.placement,p.localGrade?'grade-assigned':'tracked-not-grade-locked');assert(p.lessonId);assert(Object.isFrozen(p));assert(C.lookup(p.providerSourceId));assert.equal(C.compare(p.sourceId,p.sourceId).type,'same-source');}
const inverse={harder:'easier',easier:'harder',extension:'prerequisite',prerequisite:'extension','same-scope':'same-scope',related:'related','shared-provider':'shared-provider',distinct:'distinct'},pairs=new Set();
for(const t of C.tracks){const seen=new Set();for(const s of t.stages)for(const id of s.sourceIds){assert(!seen.has(id),t.id+' repeats '+id);seen.add(id);}const ids=[...seen];for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)pairs.add([ids[i],ids[j]].sort().join('|'));}
for(const edge of D.bridges){const ids=(t,l)=>C.tracks.find(x=>x.id===t).stages.find(s=>s.level===l).sourceIds;for(const a of ids(edge.fromTrack,edge.fromLevel))for(const b of ids(edge.toTrack,edge.toLevel))if(a!==b)pairs.add([a,b].sort().join('|'));}
// Alter grades and reverse track order in an isolated module. Neither may decide a relationship.
const isolated=JSON.parse(JSON.stringify(D));isolated.tracks.reverse();isolated.profiles.forEach((p,i)=>{p.localGrade=100-i;p.memberships.reverse();});const context={module:{exports:{}},require:()=>isolated};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/cross-course.js'),'utf8'),context);const alternate=context.module.exports;
let conflicts=0;for(const pair of pairs){const [a,b]=pair.split('|'),r=C.compare(a,b);assert.equal(C.compare(b,a).type,inverse[r.type],pair);assert.equal(alternate.compare(a,b).type,r.type,'metadata/order '+pair);assert.equal(r.automaticRemovalAllowed,false);if(C.lookup(a).providerSourceId===C.lookup(b).providerSourceId)assert.equal(r.type,'shared-provider');if(r.conflictingEvidence){assert.equal(r.type,'related');conflicts++;}}
assert(conflicts>0);
// A synthetic opposite-direction case exercises the guard independent of the current curriculum.
const fixture=JSON.parse(JSON.stringify(D)),a=fixture.profiles[0],b=fixture.profiles.find(p=>p.providerSourceId!==a.providerSourceId);a.memberships=[{trackId:'one',level:1},{trackId:'two',level:2}];b.memberships=[{trackId:'one',level:2},{trackId:'two',level:1}];fixture.bridges=[];fixture.tracks=['one','two'].map(id=>({id,relationMode:'difficulty',stages:[1,2].map(level=>({level,demand:'test '+level,prerequisites:'test',sourceIds:[]}))}));const sandbox={module:{exports:{}},require:()=>fixture};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/cross-course.js'),'utf8'),sandbox);assert.equal(sandbox.module.exports.compare(a.sourceId,b.sourceId).type,'related');assert(sandbox.module.exports.compare(b.sourceId,a.sourceId).conflictingEvidence);
const rect='course-1-en:authored:M7-perimeter-rectangle',quad='course-87-en:authored:M7-perimeter-irregular';assert.equal(C.compare(rect,quad).type,'harder');assert.equal(C.compare(quad,rect).type,'easier');
const find=(family,recipe)=>E.catalog.find(c=>c.family===family&&c.recipe===recipe&&!c.reuseSourceId).sourceId;
assert.equal(C.compare(find('structured-foundational-courses','div:2:exact'),find('structured-foundational-courses','div-two')).type,'harder');
assert.equal(C.compare(find('structured-algebra-one','line:slope'),find('structured-algebra-one','line:two-points')).type,'harder');
assert.equal(C.compare(find('structured-algebra-half','root-approx:2:2'),find('structured-algebra-half','root-approx:2:4')).type,'harder');
const scope=require('../curriculum/cross-course/v0.3/chunk1-scope.json'),review=require('../curriculum/cross-course/v0.3/chunk1-review.json'),crypto=require('node:crypto');
assert.equal(scope.length,303);assert.equal(review.length,303);assert.deepEqual(review.map(r=>r.sourceId).sort(),scope.map(r=>r.sourceId).sort());
for(const r of review){const p=C.lookup(r.sourceId);assert(r.reviewed);assert.equal(p.review.chunk,1);assert.equal(p.review.status,'reviewed');assert.equal(p.review.reason,r.reason);assert(r.reason.length>50);assert.deepEqual(r.trackIds,p.memberships.map(m=>m.trackId));assert.equal(r.providerContract.sourceId,p.providerSourceId);for(const [file,hash]of Object.entries(r.evidenceSha256))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',file))).digest('hex'),hash,file);}
assert.equal(review.filter(r=>!r.trackIds.length).length,7);assert.equal(C.profiles.filter(p=>!p.memberships.length&&!p.review).length,584);
const id=(f,r)=>find('structured-'+f,r),type=(f,r,g,s)=>C.compare(id(f,r),id(g,s)).type;
assert.equal(type('proportion','percent-complement','proportion','percent-count-complement'),'extension');
assert.equal(type('proportion','fraction-complement','measurement','whole-from-left'),'extension');
assert.equal(type('breadth','fraction-between','algebra-two-completion','number:fraction-between'),'harder');
assert.equal(type('foundational-courses','fraction-same','foundational-courses','fraction-simplify'),'same-scope');
assert.equal(type('foundational-courses','facts:easy','foundational-courses','facts:hard'),'related');
assert.equal(type('algebra-half','mixed-part','curriculum87','14.1'),'related');
assert.equal(type('algebra-half','mixed-part','curriculum87','71.1'),'related');
assert.equal(type('algebra-half','opposites','algebra-half','negation'),'related');
assert.equal(type('proportion','bill-percent','proportion','percent-increase'),'related');
assert.equal(type('algebra-two-completion','chemical:percent','proportion','recipe-proportion'),'related');
assert.equal(type('curriculum87','COURSE110.1','measurement','simple-interest'),'extension');
const baseMap=require(path.resolve(process.env.CONNECTIONS_BASELINE,'cross-course-map'));const oldScope=new Set(scope.map(r=>r.sourceId));for(const p of baseMap.profiles){const q=C.lookup(p.sourceId);assert.equal(p.topic,q.topic);for(const m of p.memberships)assert(q.memberships.some(n=>n.trackId===m.trackId&&n.level===m.level));if(!p.memberships.length&&!oldScope.has(p.sourceId))assert.equal(q.memberships.length,0,'out-of-chunk entry');}
for(const p of C.profiles.filter((p,i)=>i%17===0)){const s=C.suggestions(p.sourceId,{limit:100});assert.deepEqual(s,C.suggestions(p.sourceId,{limit:100}));assert.equal(new Set(s.map(x=>x.profile.providerSourceId)).size,s.length);assert(s.every(r=>r.sourceId!==p.sourceId&&r.profile.bankId!==p.bankId&&r.type!=='shared-provider'));}
const baseline=process.env.CONNECTIONS_BASELINE;assert(baseline,'Set CONNECTIONS_BASELINE to retained src directory');const B=require(path.resolve(baseline,'course-banks'));assert.deepEqual(E.catalog,B.catalog);const normal=q=>{const x=JSON.parse(JSON.stringify(q));delete x.version;return x;};let retained=0;for(const c of E.catalog)for(let index=0;index<12;index++){const opts={seed:'comparison-chunk1-retained',index};assert.deepEqual(normal(E.generate(c.sourceId,opts)),normal(B.generate(c.sourceId,opts)),c.sourceId);retained++;}
const changed=[];for(const name of fs.readdirSync(baseline)){if(!name.endsWith('.js'))continue;const current=fs.readFileSync(path.join(__dirname,'../src',name)),old=fs.readFileSync(path.join(baseline,name));if(!current.equals(old))changed.push(name);}assert.deepEqual(changed.sort(),['course-banks.js','cross-course-map.js']);
assert.equal(E.assessment.outcomes.filter(o=>o.standard).length,331);
const result={result:'passed',chunk1Reviewed:303,newPathEntries:296,reviewedRelatedOnly:7,entries:E.catalog.length,tracks:C.tracks.length,pairs:pairs.size,conservativeConflicts:conflicts,generationParityCases:retained,changedModules:changed,gradeCamOutcomes:331};fs.writeFileSync('/tmp/comparison-chunk1-engine-results.json',JSON.stringify(result,null,2));console.log(result);
