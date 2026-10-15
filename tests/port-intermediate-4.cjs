// Intermediate 4 port tasks (coverage programme, parallel courses): independent mathematics, source ranges,
// distractors, drawings and determinism. Owned by the Intermediate 4 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).
// The oracle for each recipe recomputes the key from the task's own parameters with separate code; it never reads the
// task's answer to build the expected value. Run: node tests/port-intermediate-4.cjs [instances per task, default 250]
'use strict';
const assert=require('node:assert/strict');
const H=require('./port-course-harness.cjs');
const E=require('../src/course-banks.js');

// The key as typed, normalised: numbers lose commas, "$" and units; words are lower case.
const key=q=>String(E.answerText(q)).trim();
const numKey=q=>Number(key(q).replace(/[$,]/g,'').replace(/\s*(cents?)$/,''));
const is=(q,v)=>numKey(q)===v;
const total=a=>a.reduce((x,y)=>x+y,0);
const inRange=(x,lo,hi)=>Number.isInteger(x)&&x>=lo&&x<=hi;
const PLACES=['ones','tens','hundreds','thousands'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
// Digits of n from the left.
const digits=n=>String(n).split('').map(Number);
// Every number written out in the prompt, in order.
const promptNums=q=>(q.prompt.replace(/(\d),(?=\d{3})/g,'$1').match(/\d+/g)||[]).map(Number);

// recipe -> (q, parameters) => true when the key is right. Every recipe in the catalog needs one.
const oracle={
 // Batch I4-1
 'i4-add-story':(q,p)=>{const v=q.givens.recipe&&E.catalog.find(c=>c.sourceId===q.sourceId).variant,s=total([p.a,p.b,p.c||0]);
  if(v==='two-small')return inRange(p.a,2,8)&&inRange(p.b,2,8)&&is(q,s);
  if(v==='three-2digit')return [p.a,p.b,p.c].every(x=>inRange(x,11,49))&&s<100&&is(q,s);
  if(v==='three-2digit-over')return s>100&&s<200&&is(q,s);
  if(v==='three-hundreds')return [p.a,p.b,p.c].every(x=>x%100===0)&&s<=900&&is(q,s);
  return inRange(p.a,501,899)&&inRange(p.b,501,899)&&s>1000&&is(q,s);},
 'i4-missing-addend':(q,p)=>is(q,p.s-p.a)&&p.s-p.a>0&&(q.prompt.includes(p.letter)||/missing addend/.test(q.prompt)),
 'i4-missing-row':(q,p)=>{const x=p.total-total(p.known);return x>0&&is(q,x)&&q.prompt.includes(p.letter);},
 'i4-column-missing':(q,p)=>{const x=p.total-total(p.known);return x>0&&is(q,x)&&q.givens.svg.includes('>'+p.total+'<');},
 'i4-column-add':(q,p)=>p.addends.length===4&&is(q,total(p.addends)),
 'i4-pic-sentence':(q,p)=>{if(q.answer.kind!=='i4-sentence')return is(q,total(p.groups));const z=total(p.groups);
  return E.checkAnswer(q,`${[...p.groups].reverse().join(' + ')} = ${z}`).answerCorrect&&!E.checkAnswer(q,`${p.groups.join(' + ')} = ${z+1}`).answerCorrect;},
 'i4-six-ways':(q,p)=>{const z=p.a+p.b+p.c,perm=[[p.a,p.b,p.c],[p.c,p.b,p.a],[p.b,p.c,p.a],[p.b,p.a,p.c],[p.a,p.c,p.b],[p.c,p.a,p.b]];
  return z<20&&E.checkAnswer(q,perm.map(o=>o.join('+')+'='+z).join('; ')).answerCorrect&&!E.checkAnswer(q,perm.slice(0,5).concat([perm[0]]).map(o=>o.join('+')+'='+z).join('; ')).answerCorrect;},
 'i4-expanded':(q,p)=>is(q,p.a*100+p.b*10),
 'i4-sequence':(q,p)=>{const term=i=>p.start+i*p.step,k=key(q).split(',').map(Number);
  if(q.answer.kind==='sequence'&&p.blanks)return k.join()===p.blanks.map(term).join();
  if(q.answer.kind==='sequence')return k.join()===[p.shown,p.shown+1,p.shown+2].map(term).join()&&term(p.shown+2)>0;
  return is(q,term(p.blank));},
 'i4-circled':(q,p)=>{let z=p.shown+1;while(z%p.every)z++;return is(q,z);},
 'i4-count-by':(q,p)=>{const v=E.catalog.find(c=>c.sourceId===q.sourceId).variant;return is(q,v==='nickels'?5*p.k:v==='dimes'?10*p.k:v==='wheels'?2*p.k:p.rows*p.cols);},
 'i4-digits':(q,p)=>{const d=digits(p.n),v=E.catalog.find(c=>c.sourceId===q.sourceId).variant;return is(q,v==='count'?d.length:v==='last'?d[d.length-1]:d[0]);},
 'i4-place':(q,p)=>{const v=E.catalog.find(c=>c.sourceId===q.sourceId).variant;
  if(v==='which-4'||v==='which-3'){const d=digits(p.n),i=d.indexOf(p.digit);return d.filter(x=>x===p.digit).length===1&&key(q)===PLACES[d.length-1-i];}
  if(v==='place-of')return key(q)===p.nums.map(n=>{const d=digits(n);return PLACES[d.length-1-d.indexOf(p.digit)];}).join('; ');
  if(v==='digit-in')return is(q,digits(p.n)[2-p.place]);
  return is(q,Number(`${p.a}${p.b}${p.c}`));},
 'i4-bills':(q,p)=>{if(q.answer.kind==='teacher')return q.answer.reference.startsWith(`${p.hundreds} $100 bills, ${p.tens} $10 bills and ${p.ones} $1 bills`)&&q.prompt.includes('$'+(100*p.hundreds+10*p.tens+p.ones));
  if(p.I){const a=10*p.I[0]+p.I[1],b=10*p.II[0]+p.II[1];return a!==b&&key(q).startsWith(a>b?'I shows a greater':'II shows a greater');}
  return is(q,100*p.hundreds+10*p.tens+p.ones);},
 'i4-line':(q,p)=>{const v=E.catalog.find(c=>c.sourceId===q.sourceId).variant;return is(q,v==='between'?p.q-p.p-1:v==='front'?p.k-1:10-p.k);},
 'i4-order-least':(q,p)=>is(q,Math.min(...p.nums)),
 'i4-dates':(q,p)=>{const v=E.catalog.find(c=>c.sourceId===q.sourceId).variant;
  if(v==='month')return key(q)===MONTHS[p.m-1];
  if(v==='month-year')return E.checkAnswer(q,`(a) ${MONTHS[p.m-1]} (b) ${1900+p.y}`).answerCorrect&&!E.checkAnswer(q,`${MONTHS[p.m%12]}; ${1900+p.y}`).answerCorrect;
  if(v==='days')return is(q,new Date(2001,p.m,0).getDate());
  let n=0;for(let m=1;m<=12;m++)if(new Date(2001,m,0).getDate()===p.days)n++;return is(q,n);},
};

// Responses that must be marked wrong for a recipe, beyond the distractors (optional): recipe -> q => [strings].
const wrong={
 'i4-pic-sentence':q=>q.answer.kind==='i4-sentence'?[String(q.answer.total),q.answer.addends.join(' + ')]:[],
 'i4-place':q=>q.answer.kind==='i4-places'?[q.answer.places.slice().reverse().join('; ')]:[],
};

H.run({key:'intermediate-4',oracle,wrong,instances:Number(process.argv[2]||250)});
