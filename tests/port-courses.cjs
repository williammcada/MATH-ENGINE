// Parallel-course port tests (docs/change-specs/coverage-parallel-courses-v0.1.md). Runs every course registered in
// src/port-courses.js, or only the courses named: node tests/port-courses.cjs [course-key ...] [-- instances]
// Also checks that the course maps match their task lists and that no task is claimed twice. Shared file: only the
// integration pass changes it.
'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const COURSES=require('../src/port-courses.js'),P=require('../src/port87.js'),BASE=require('../src/port87-map.js');
const args=process.argv.slice(2),dash=args.indexOf('--'),names=dash<0?args:args.slice(0,dash),instances=dash<0?[]:args.slice(dash+1);
for(const k of names)assert(COURSES.some(m=>m.key===k),'unknown course '+k+' (known: '+COURSES.map(m=>m.key).join(', ')+')');

// One port catalog: 8/7 and Course 1 first, then each course; no source ID twice; no base recipe in a course's prefix.
const ids=P.catalog.map(c=>c.sourceId);assert.equal(new Set(ids).size,ids.length,'a source record has two port tasks');
assert.equal(P.catalog.length,BASE.length+COURSES.reduce((n,m)=>n+m.catalog.length,0));
for(const c of BASE)assert(!COURSES.some(m=>String(c.recipe).startsWith(m.prefix)),'8/7 or Course 1 recipe '+c.recipe+' uses a course prefix');

// Course maps are what the builder makes from the task lists (block hashes come from the committed mappings).
for(const m of COURSES)if(!names.length||names.includes(m.key))
 execFileSync('python3',[path.join(root,'scripts/build-port87-map.py'),'--course',m.key,'--check'],{cwd:root,stdio:'inherit'});

let failed=0;
for(const m of COURSES){if(names.length&&!names.includes(m.key))continue;
 try{execFileSync('node',[path.join(__dirname,'port-'+m.key+'.cjs'),...instances],{cwd:root,stdio:'inherit'});}
 catch(e){failed++;console.error('FAIL port-'+m.key);}}
if(failed)process.exit(1);
console.log('PASS port courses:',COURSES.filter(m=>!names.length||names.includes(m.key)).map(m=>m.key+' '+m.catalog.length).join(', '));
