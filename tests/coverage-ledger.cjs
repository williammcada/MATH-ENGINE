// Coverage ledger (Phase 0.1): rebuilds byte-identically, holds every legacy record once, and every state is backed.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),file=root+'/curriculum/coverage-ledger/v0.1/ledger.json',before=fs.readFileSync(file);
execFileSync('python3',[root+'/scripts/build-coverage-ledger.py'],{cwd:root});assert(fs.readFileSync(file).equals(before),'the committed ledger is what the builder produces');
const L=JSON.parse(before),E=require(root+'/src/course-banks.js'),working=new Set(E.catalog.map(c=>c.sourceId));
assert.equal(L.records.length,5425);assert.equal(new Set(L.records.map(r=>r.id)).size,5425);
const by=Object.fromEntries(L.records.map(r=>[r.id,r]));
for(const r of L.records){assert(['open','covered-provisional','covered','consolidated','retired'].includes(r.state),r.id);
 if(r.state==='covered'||r.state==='covered-provisional'){assert(r.by&&r.by.length,r.id);for(const w of r.by)assert(working.has(w),r.id+' is covered by '+w+', which is not a working entry');}
 if(r.state==='consolidated')assert(['covered','covered-provisional'].includes(by[r.into]?.state),r.id+' consolidates into an uncovered record');
 if(r.state==='retired')assert(r.ownerApproval&&r.reason,r.id+' retirement needs owner approval and a reason');}
const sum=Object.values(L.banks).reduce((n,b)=>n+b.records,0);assert.equal(sum,5425);
const lessonSum=L.lessons.reduce((n,l)=>n+l.records,0);assert.equal(lessonSum,5425);
console.log('PASS coverage ledger:',JSON.stringify(L.totals));
