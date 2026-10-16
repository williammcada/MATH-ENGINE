// Intermediate 4 port tasks (coverage programme, parallel courses): independent mathematics, source ranges,
// distractors, drawings and determinism. Owned by the Intermediate 4 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).
// The oracle for each recipe recomputes the key from the task's own parameters with separate code; it never reads the
// task's answer to build the expected value. Run: node tests/port-intermediate-4.cjs [instances per task, default 250]
'use strict';
const assert=require('node:assert/strict');
const H=require('./port-course-harness.cjs');
const E=require('../src/course-banks.js');
const WORDS=require('../src/port-shared.js').words;

// The key as typed, normalised: numbers lose commas, "$" and units; words are lower case.
const key=q=>String(E.answerText(q)).trim();
// The leading number of the key (after a dollar sign and thousands commas); units after it are ignored.
const numKey=q=>{const m=key(q).replace(/[$,]/g,'').replace(/^−/,'-').match(/^-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN;};
const is=(q,v)=>numKey(q)===v;
const total=a=>a.reduce((x,y)=>x+y,0);
const inRange=(x,lo,hi)=>Number.isInteger(x)&&x>=lo&&x<=hi;
const PLACES=['ones','tens','hundreds','thousands'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
// Digits of n from the left.
const digits=n=>String(n).split('').map(Number);
// Every number written out in the prompt, in order.
const variantOf=q=>E.catalog.find(c=>c.sourceId===q.sourceId).variant;
const promptNums=q=>(q.prompt.replace(/(\d),(?=\d{3})/g,'$1').match(/\d+/g)||[]).map(Number);

// recipe -> (q, parameters) => true when the key is right. Every recipe in the catalog needs one.
const oracle={
 // Batch I4-1
 'i4-add-story':(q,p)=>{const v=q.givens.recipe&&E.catalog.find(c=>c.sourceId===q.sourceId).variant,s=total([p.a,p.b,p.c||0]);
  if(v==='two-small')return inRange(p.a,2,8)&&inRange(p.b,2,8)&&is(q,s);
  if(v==='two-2digit')return inRange(p.a,21,79)&&inRange(p.b,11,29)&&p.a%10+p.b%10<10&&is(q,s);
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
 // Batch I4-2
 'i4-fact-family':(q,p)=>{const c=p.a+p.b,v=variantOf(q);
  if(v==='write')return E.checkAnswer(q,`${c} − ${p.b} = ${p.a}; ${p.b} + ${p.a} = ${c}; ${c} − ${p.a} = ${p.b}; ${p.a} + ${p.b} = ${c}`).answerCorrect&&!E.checkAnswer(q,`${p.a} + ${p.b} = ${c}; ${p.b} + ${p.a} = ${c}; ${c} − ${p.a} = ${p.b}; ${c} − ${p.a} = ${p.b}`).answerCorrect;
  if(v==='finish')return E.checkAnswer(q,`${c} - ${p.b} = ${p.a}`).answerCorrect&&!E.checkAnswer(q,`${c} - ${p.a} = ${p.b}`).answerCorrect;
  const nums=promptNums(q),f2=nums.slice(3);return key(q)===(f2.every(x=>[p.a,p.b,c].includes(x))?'yes':'no');},
 'i4-subtract':(q,p)=>p.a-p.b>0&&is(q,p.a-p.b)&&(variantOf(q)!=='facts'||p.a-p.b<=9),
 'i4-order':(q,p)=>is(q,[...p.nums].sort((x,y)=>x-y)[2])&&promptNums(q).slice(0,4).join()===p.nums.join(),
 'i4-blocks':(q,p)=>is(q,100*p.hundreds+p.ones)&&(q.givens.svg.match(/<rect/g)||[]).length===p.ones,
 'i4-words-number':(q,p)=>{if(variantOf(q)==='to-digits'){const w=q.prompt.match(/number (.+)\. Enter/)[1];return is(q,parseWords(w))&&parseWords(w)===p.n;}return parseWords(key(q))===p.n&&q.prompt.includes(String(p.n));},
 'i4-money-add':(q,p)=>is(q,p.a+p.b)&&key(q).startsWith('$'),
 'i4-add-2digit':(q,p)=>is(q,p.a+p.b),
 'i4-even-odd':(q,p)=>{const v=variantOf(q);
  if(v==='which-even')return is(q,p.even)&&p.even%2===0&&p.odds.every(x=>x%2===1);
  if(v==='digits')return numKey(q)%2===0&&String(numKey(q)).split('').map(Number).sort().join()===[...p.digits].sort().join();
  if(v==='two-rows')return is(q,p.total)&&p.total%2===0&&p.others.every(x=>x%2===1);
  if(v==='two-rows-not')return is(q,p.total)&&p.total%2===1&&p.others.every(x=>x%2===0);
  if(v==='set-odd'||v==='set-even')return p.set.every(x=>x%2===(p.odd?1:0))&&E.checkAnswer(q,'{'+[...p.set].reverse().join(', ')+'}').answerCorrect;
  if(v==='make-even-3'||v==='make-even-4'){const perms=a=>a.length<=1?[a]:a.flatMap((x,i)=>perms([...a.slice(0,i),...a.slice(i+1)]).map(r=>[x,...r]));
   const ok=perms(p.digits).map(d=>Number(d.join(''))).filter(n=>n%2===0&&n>p.lo&&(p.hi===undefined||n<p.hi));return ok.length>0&&ok.every(n=>E.checkAnswer(q,String(n)).answerCorrect)&&perms(p.digits).map(d=>Number(d.join(''))).filter(n=>!ok.includes(n)).every(n=>!E.checkAnswer(q,String(n)).answerCorrect);}
  if(v==='odd-or-even')return key(q)===(p.n%2?'odd':'even');
  if(v==='yes-no')return key(q)===((p.n%2===0)===(p.asked==='even')?'yes':'no');
  if(v==='between'){const want=p.odd?1:0;return E.checkAnswer(q,String(p.lo+2+want)).answerCorrect&&E.checkAnswer(q,String(p.hi-2+want)).answerCorrect&&!E.checkAnswer(q,String(p.lo+1-want)).answerCorrect&&!E.checkAnswer(q,String(p.hi+want)).answerCorrect;}
  return E.checkAnswer(q,'less than '+p.d).answerCorrect&&!E.checkAnswer(q,'greater than '+p.d).answerCorrect;},
 'i4-numline':(q,p)=>{if(p.arrows){const near=p.arrows.map(x=>Math.abs(x-p.target)),i=near.indexOf(Math.min(...near));return key(q)==='arrow '+'ABCD'[i];}return is(q,p.lo+p.k*p.step);},
 'i4-write-compare':(q,p)=>{const r=p.a>p.b?'>':'<';return E.checkAnswer(q,`${p.a}${r}${p.b}`).answerCorrect&&!E.checkAnswer(q,`${p.a}${r==='>'?'<':'>'}${p.b}`).answerCorrect;},
 'i4-compare':(q,p)=>key(q)===(p.a>p.b?'>':p.a<p.b?'<':'=')&&(variantOf(q).startsWith('expr')?evalSides(q,p):true),
 'i4-compare-words':(q,p)=>{const nm=x=>x<0?'negative '+WORDS(-x):WORDS(x);return key(q)===`${nm(p.a)} is ${p.a>p.b?'greater':'less'} than ${nm(p.b)}`;},
 'i4-graphed-set':(q,p)=>E.checkAnswer(q,'{'+[...p.set].reverse().join(', ')+'}').answerCorrect&&p.set.every(x=>q.givens.svg.includes(String(x).replace('-','−'))),
 'i4-seq-tenth':(q,p)=>{const t=i=>p.start+(i-1)*p.step;return E.checkAnswer(q,`${t(5)}, ${t(6)}, ${t(7)}; ${t(10)}`).answerCorrect;},
 // Batch I4-3
 'i4-missing-story':(q,p)=>{const v=variantOf(q);if(v==='map')return is(q,p.far-p.near);if(v==='two-takeaways')return is(q,p.total-p.a-p.b);return p.total-p.a>0&&is(q,p.total-p.a);},
 'i4-missing-sub':(q,p)=>p.a-p.b===p.r&&is(q,p.unknown==='sub'?p.a-p.r:p.r+p.b),
 'i4-add-3digit':(q,p)=>is(q,total(p.terms))&&p.terms.every(x=>x>0),
 'i4-sub':(q,p)=>p.a>p.b&&is(q,p.a-p.b),
 'i4-missing-2digit':(q,p)=>is(q,p.s-p.a)&&p.s-p.a>9,
 'i4-expanded-form':(q,p)=>{const v=variantOf(q);if(v==='standard')return is(q,total(p.parts));const d=String(p.n).split('').map(Number),k=d.length;
  if(v==='products'){const terms=d.map((x,i)=>[x,10**(k-1-i)]).filter(t=>t[0]);return E.checkAnswer(q,terms.slice().reverse().map(([x,pl])=>`(${x} x ${pl})`).join('+')).answerCorrect&&!E.checkAnswer(q,String(p.n)).answerCorrect;}
  const parts=d.map((x,i)=>x*10**(k-1-i));return E.checkAnswer(q,parts.slice().reverse().join(' + ')).answerCorrect&&!E.checkAnswer(q,parts.slice(1).join(' + ')).answerCorrect;},
 'i4-missing-3digit':(q,p)=>is(q,p.kind==='addend'?p.total-p.a:p.kind==='subtrahend'?p.a-p.total:p.a+p.total),
 // Batch I4-4
 'i4-add-column':(q,p)=>is(q,total(p.terms)),
 'i4-thermo':(q,p)=>E.checkAnswer(q,String(p.value)).answerCorrect&&E.checkAnswer(q,p.value+' degrees').answerCorrect&&!E.checkAnswer(q,String(p.value+p.step)).answerCorrect&&p.value>=p.lo&&p.value<=p.hi&&(p.value-p.lo)%p.step===0&&key(q).endsWith('°'+p.unit),
 'i4-speed':(q,p)=>is(q,p.value)&&p.value%5===0&&p.value<=70,
 'i4-temp-change':(q,p)=>is(q,p.b-p.a),
 'i4-clock':(q,p)=>{const v=variantOf(q);
  if(v==='later'){const t=p.h*60+p.m+p.add,hh=Math.floor(t/60)%12||12,mm=t%60;return E.checkAnswer(q,`${hh}:${String(mm).padStart(2,'0')} pm`).answerCorrect&&!E.checkAnswer(q,`${hh}:${String(mm).padStart(2,'0')} am`).answerCorrect;}
  if(v==='elapsed')return E.checkAnswer(q,`${Math.floor(p.dur/60)} hours ${p.dur%60} minutes`).answerCorrect;
  const s=`${p.h}:${String(p.m).padStart(2,'0')}`;return v==='read'?E.checkAnswer(q,s).answerCorrect:E.checkAnswer(q,s+(p.pm?' p.m.':' a.m.')).answerCorrect&&!E.checkAnswer(q,s+(p.pm?' a.m.':' p.m.')).answerCorrect&&!E.checkAnswer(q,s).answerCorrect;},
 'i4-round':(q,p)=>{const v=variantOf(q);if(v.startsWith('dollar'))return is(q,Math.floor((p.cents+50)/100));if(v==='round-add'){const r=x=>Math.floor((x+5)/10)*10;return E.checkAnswer(q,`${r(p.a)}+${r(p.b)}=${r(p.a)+r(p.b)}`).answerCorrect;}return is(q,Math.floor((p.n+5)/10)*10);},
 'i4-measure':(q,p)=>variantOf(q)==='cm'?is(q,p.cm):E.checkAnswer(q,`${Math.round(p.cm/2.54)}; ${p.cm}; ${10*p.cm}`).answerCorrect,
 'i4-perimeter':(q,p)=>{const v=variantOf(q);if(v==='triangle')return is(q,p.a+p.b+p.c);if(v==='rectangle')return is(q,2*p.l+2*p.w);if(v==='polygon')return is(q,2*(p.w1+p.h1+p.h2));if(v==='regular')return is(q,p.k*p.s);return is(q,p.p/4);},
 'i4-units':(q,p)=>{const v=variantOf(q);if(v==='facts')return is(q,p.answer);if(v==='m-to-cm')return is(q,100*p.m);if(v==='yd-to-ft')return is(q,3*p.k);return ({'the width of a book':'inch','the length of a classroom':'foot','the length of a football field':'yard','the length of a pencil':'inch','the height of a door':'foot'})[p.item]===key(q);},
 'i4-perimeter-meaning':(q,p)=>key(q)===p.ctx&&['wooden frame','fence','metal border','sidewalk'].includes(p.ctx),
 'i4-circle':(q,p)=>{const v=variantOf(q);return is(q,v==='diameter'?2*p.r:v==='diameter-yards'?2*p.r/3:6*p.r);},
 'i4-draw-triangle':(q,p)=>q.answer.kind==='teacher'&&q.prompt.includes(p.s+' centimeters'),
 'i4-add-cents':(q,p)=>Math.round(numKey(q)*100)===p.a+p.b,
 'i4-estimate-money':(q,p)=>is(q,Math.floor((p.a+50)/100)+Math.floor((p.b+50)/100)),
 'i4-coin-fraction':(q,p)=>{const d=variantOf(q)==='dimes'?10:100;return E.checkAnswer(q,`${p.k}/${d}`).answerCorrect&&E.checkAnswer(q,`${2*p.k}/${2*d}`).answerCorrect&&!E.checkAnswer(q,`${p.k}/${d+1}`).answerCorrect;},
 'i4-shaded':(q,p)=>E.checkAnswer(q,`${p.k}/${p.n}`).answerCorrect&&(p.n===2*p.k||!E.checkAnswer(q,`${p.n-p.k}/${p.n}`).answerCorrect),
 'i4-sign':(q,p)=>q.answer.kind==='teacher'&&q.answer.reference.includes(p.c+'¢'),
 // Batch I4-5
 'i4-angle-types':(q,p)=>{const n=p.poly.length;let c={right:0,acute:0,obtuse:0};let area=0;for(let i=0;i<n;i++){const [x1,y1]=p.poly[i],[x2,y2]=p.poly[(i+1)%n];area+=x1*y2-x2*y1;}
  for(let i=0;i<n;i++){const P=p.poly[i],A=p.poly[(i+n-1)%n],C=p.poly[(i+1)%n],ang=Math.abs(Math.atan2(A[1]-P[1],A[0]-P[0])-Math.atan2(C[1]-P[1],C[0]-P[0]))*180/Math.PI,a=ang>180?360-ang:ang;
   if(Math.abs(a-90)<1e-9)c.right++;else if(a<90)c.acute++;else c.obtuse++;}
  return key(q).split(';').map(Number).join()===[c.right,c.acute,c.obtuse].join();},
 'i4-shape-pick':(q,p)=>{const ok={perpendicular:['rectangle','square','right trapezoid'],parallel:['rectangle','parallelogram','isosceles trapezoid','right trapezoid']}[p.kind];return p.names.filter(nm=>ok.includes(nm)).length===1&&key(q)==='ABCD'[p.names.findIndex(nm=>ok.includes(nm))];},
 'i4-quad-name':(q,p)=>key(q)===p.desc&&['trapezoid','square','rectangle','rhombus','parallelogram'].includes(p.desc),
 'i4-angle-name':(q,p)=>p.degs?key(q)==='ABCD'[p.degs.indexOf(90)]&&p.degs.filter(d=>d===90).length===1:key(q)===(p.deg<90?'acute':p.deg===90?'right':p.deg<180?'obtuse':'straight'),
 'i4-letters':(q,p)=>{const par=new Set(['E','F','H','M','N','Z']),rt=new Set(['E','F','H','L','T']),ok=p.kind==='no-parallel'?p.letters.filter(l=>!par.has(l)):p.letters.filter(l=>rt.has(l));return ok.length===1&&key(q)===ok[0];},
 'i4-line-ray-seg':(q,p)=>E.checkAnswer(q,p.order.map(w=>w==='segment'?'line segment':w).join(', ')).answerCorrect,
 'i4-draw-geo':(q,p)=>q.answer.kind==='teacher'&&q.prompt.includes(' '+p.label),
 'i4-claim':(q,p)=>q.answer.kind==='teacher'&&q.answer.reference.startsWith('(a) '+p.claim),
 'i4-skew':(q,p)=>q.answer.kind==='teacher'&&q.prompt.includes(`edges ${p.edges[0]} and ${p.edges[1]}`),
 'i4-streets':(q,p)=>key(q)===(p.perp?p.ew:(p.ask===p.a?p.b:p.a)),
 'i4-parallel-sides':(q,p)=>E.checkAnswer(q,`${p.labels[2]}${p.labels[1]} and ${p.labels[0]}${p.labels[3]}`).answerCorrect&&!E.checkAnswer(q,`${p.labels[0]}${p.labels[1]} and ${p.labels[2]}${p.labels[3]}`).answerCorrect,
 'i4-fact-letter':(q,p)=>{const L=p.letter,fam=[`${L}+${p.a}=${p.c}`,`${p.a}+${L}=${p.c}`,`${p.c}-${L}=${p.a}`,`${p.c}-${p.a}=${L}`],given=p.given==='add-given'?fam[1]:fam[2];return E.checkAnswer(q,fam.filter(f=>f!==given).reverse().join('; ')).answerCorrect;},
 'i4-inverse':(q,p)=>{const v=variantOf(q);if(v==='teen')return is(q,p.s-p.a);if(v==='circle')return is(q,p.r+p.b);if(p.minuend)return is(q,p.total+total(p.parts));return is(q,p.total-total(p.parts));},
 'i4-sub-story':(q,p)=>is(q,p.kind==='start'?p.a+p.b:p.a-p.b),
 'i4-fraction-pick':(q,p)=>{const want=p.allBut?p.n-(p.n-p.k):p.k;return p.shaded.filter(x=>x===want).length===1&&key(q)==='ABCD'[p.shaded.indexOf(want)];},
 'i4-unshaded':(q,p)=>E.checkAnswer(q,`${p.n-p.k}/${p.n}`).answerCorrect&&(2*p.k===p.n||!E.checkAnswer(q,`${p.k}/${p.n}`).answerCorrect),
 'i4-draw-fraction':(q,p)=>q.answer.kind==='teacher'&&q.answer.reference.includes(`${p.d} equal parts`),
 'i4-clock2':(q,p)=>{const v=variantOf(q),fmt=t=>{t=((t%1440)+1440)%1440;return `${Math.floor(t/60)%12||12}:${String(t%60).padStart(2,'0')} ${t<720?'am':'pm'}`;};
  if(v==='ago'||v==='ahead')return E.checkAnswer(q,fmt(p.ago?p.start-p.d:p.start+p.d)).answerCorrect;if(v==='words-later')return E.checkAnswer(q,fmt(p.start+p.d)).answerCorrect;
  if(v==='start-before-noon')return E.checkAnswer(q,fmt(p.arrive-p.ride)).answerCorrect;if(v==='start-from-end')return E.checkAnswer(q,fmt(p.end-p.d)).answerCorrect;
  const d=(12*60-(p.sh*60+p.sm))+(p.eh*60+p.em);return E.checkAnswer(q,`${Math.floor(d/60)} hours ${d%60} minutes`).answerCorrect;},
 'i4-repeated-add':(q,p)=>{const n=(q.prompt.match(new RegExp('\\b'+p.n+'\\b','g'))||[]).length;return n>=p.k&&(variantOf(q)==='rewrite'?E.checkAnswer(q,`${p.n} x ${p.k}`).answerCorrect:E.checkAnswer(q,`${p.n} x ${p.k} = ${p.n*p.k}`).answerCorrect);},
 'i4-mult-fact':(q,p)=>is(q,p.a*p.b),
 'i4-mult-table':(q,p)=>is(q,p.r*p.c),
 'i4-property':(q,p)=>key(q)===p.expr,
 'i4-words-sentence':(q,p)=>{const k=key(q).replace(/\s+/g,'').split('=');const ev=x=>x.split('+').map(t=>t.split('×').reduce((u,w)=>u*Number(w),1)).reduce((u,w)=>u+w,0);return k.length===2&&ev(k[0])===ev(k[1]);},
 'i4-not-equal':(q,p)=>{const v=key(q).split('×').map(Number);return v[0]*v[1]!==p.T&&p.opts.filter(o=>o[0]*o[1]!==p.T).length===1;},
 'i4-estimate-thousands':(q,p)=>key(q)===`${Math.floor((p.a+500)/1000)*1000} and ${Math.floor((p.b+500)/1000)*1000}`,
 'i4-greatest-product':(q,p)=>{const v=key(q).split('×').map(Number);return v[0]*v[1]===p.f*Math.max(...p.ms);},
 'i4-claim-even':(q,p)=>q.answer.kind==='teacher'&&q.prompt.includes(p.claim),
 'i4-sub-3digit':(q,p)=>is(q,p.a-p.b)&&p.a-p.b>99,
 'i4-sub-cents':(q,p)=>Math.round(numKey(q)*100)===p.a-p.b,
 'i4-change':(q,p)=>Math.round(Number(key(q).replace(/[$¢]/g,''))*(key(q).includes('¢')?1:100))===1000-(p.price-p.off),
 'i4-square':(q,p)=>{const v=variantOf(q);if(v==='side')return is(q,p.s);if(v==='root')return is(q,p.r);if(v==='root-sum')return is(q,p.a+p.b);if(v==='squares')return E.checkAnswer(q,p.xs.map(x=>x*x).join('; ')).answerCorrect;return key(q)===[4,5,6,7].map(i=>(p.s+i)**2).join(', ');},
 'i4-area':(q,p)=>{const v=variantOf(q);if(v==='square')return is(q,p.s*p.s);if(v==='perim-area')return E.checkAnswer(q,`${2*p.l+2*p.w}; ${p.l*p.w}`).answerCorrect;return is(q,p.l*p.w);},
 'i4-array':(q,p)=>{const v=variantOf(q);if(v==='rows-cols-fact')return E.checkAnswer(q,`${p.r}; ${p.c}; ${p.c} x ${p.r} = ${p.r*p.c}`).answerCorrect;if(v==='fact')return E.checkAnswer(q,`${p.c}×${p.r}=${p.r*p.c}`).answerCorrect;if(v==='can-draw')return key(q)===(p.n%p.rows===0?'yes':'no');return q.answer.kind==='teacher'&&q.answer.reference.includes(String(p.a*p.b));},
 // Batch I4-6
 'i4-compare-story':(q,p)=>p.b>p.a&&is(q,p.b-p.a),
 'i4-compare-table':(q,p)=>p.i!==p.j&&is(q,Math.abs(p.vals[p.i]-p.vals[p.j]))&&(p.vals[p.i]>p.vals[p.j])===q.prompt.includes(' more ')&&q.givens.svg.includes('>'+p.vals[p.i]+'<'),
 'i4-mult2':(q,p)=>{const v=variantOf(q);if(v==='first-digit')return is(q,Number(String(p.a*p.b)[0]));if(v==='digit-sum')return is(q,p.s-p.a)&&p.s-p.a<10;
  if(v==='times-four')return E.checkAnswer(q,p.xs.map(x=>4*x).join('; ')).answerCorrect;if(v==='square')return p.a===p.b&&is(q,p.a*p.a);
  return (v==='fact'?inRange(p.a,5,6):inRange(p.a,7,9))&&p.a!==p.b&&is(q,p.a*p.b);},
 'i4-big-words':(q,p)=>E.checkAnswer(q,WORDS(p.n)).answerCorrect&&!E.checkAnswer(q,WORDS(p.n+1)).answerCorrect&&(variantOf(q)==='six'?inRange(p.n,100000,999999):inRange(p.n,100000000,999999999)),
 'i4-digit-place':(q,p)=>is(q,Math.floor(p.n/10**p.place)%10),
 'i4-compare-big':(q,p)=>{const v=variantOf(q);if(v==='greatest')return key(q)===`${Math.max(...p.ms)} million`;
  if(v==='reason'){const tt=x=>Math.floor(x/10000)%10;return E.checkAnswer(q,`${tt(p.a)} > ${tt(p.b)}`).answerCorrect&&p.a>p.b;}return key(q)===(p.a>p.b?'>':'<');},
 'i4-expanded6':(q,p)=>E.checkAnswer(q,digits(p.n).map((d,i)=>d*10**(5-i)).join(' + ')).answerCorrect,
 'i4-big-digits':(q,p)=>is(q,p.n),
 'i4-money-words':(q,p)=>{const v=variantOf(q);if(v==='dollars-sign')return is(q,p.val/100);if(v==='cents-sign')return is(q,100*p.d+p.c);if(v==='cents-to-dollars')return is(q,p.c/100);
  return E.checkAnswer(q,`${WORDS(p.d)} dollars and ${WORDS(p.c)} cents`).answerCorrect;},
 'i4-coins':(q,p)=>{const v=variantOf(q);if(v==='odd-even')return key(q)===((5*p.n+10*p.d)%2?'odd':'even');if(v==='dollars-dimes-pennies')return is(q,(100*p.D+10*p.di+p.p)/100);return is(q,(25*p.q+10*p.di+5*p.n+p.p)/100);},
 'i4-cents-sub':(q,p)=>p.a>p.c&&is(q,(p.a-p.c)/100),
 'i4-mixed-pic':(q,p)=>E.checkAnswer(q,`${p.w} ${p.k}/${p.d}`).answerCorrect&&(2*p.k===p.d||!E.checkAnswer(q,`${p.w} ${p.d-p.k}/${p.d}`).answerCorrect),
 'i4-mixed-words':(q,p)=>{const dn={2:['half','halves'],3:['third','thirds'],4:['fourth','fourths'],10:['tenth','tenths']}[p.d];return E.checkAnswer(q,`${WORDS(p.w)} and ${WORDS(p.k)} ${dn[p.k===1?0:1]}`).answerCorrect;},
 'i4-draw-mixed':(q,p)=>q.answer.kind==='teacher'&&q.prompt.includes(`${p.w} ${p.k}/${p.d}`),
 'i4-sign-pick':(q,p)=>key(q)==='ABC'[p.pos]&&q.givens.svg.includes(`0.${String(p.c).padStart(2,'0')}¢`),
 'i4-coin-fraction2':(q,p)=>{const v=variantOf(q);if(v==='dimes-dollar'){const g=p.k%2?1:2;return E.checkAnswer(q,`${p.k/g}/${10/g}; $0.${p.k}0`).answerCorrect&&E.checkAnswer(q,`${p.k/g}/${10/g}; ${10*p.k}¢`).answerCorrect;}
  if(v==='coin-for'){const F={penny:'hundredth',nickel:'twentieth',dime:'tenth',quarter:'fourth','half-dollar':'half'};return q.prompt.includes('one '+F[p.frac]+' ')&&E.checkAnswer(q,p.frac).answerCorrect;}
  if(v==='quarters-value')return is(q,25*p.k/100);return key(q)===(p.a<p.b?'>':'<');},
 'i4-frac-line':(q,p)=>{const v=variantOf(q);if(v==='letter'){const x=p.vals[p.k];return key(q)===p.labels[p.k]&&q.prompt.includes(`${Math.floor(x/5)} ${x%5}/5 `);}
  if(v==='arrow')return E.checkAnswer(q,`${p.a} ${p.k}/${p.d}`).answerCorrect;return E.checkAnswer(q,`${p.k}/${p.d}`).answerCorrect;},
 'i4-ruler-quarter':(Q,p)=>E.checkAnswer(Q,`${p.w} ${p.q}/4 in.`).answerCorrect&&E.checkAnswer(Q,`${p.w} ${p.q}/4`).answerCorrect,
 'i4-draw-two':(q,p)=>q.answer.kind==='teacher'&&q.prompt.includes(`${p.k1}/${p.d} and ${p.k1+1}/${p.d}`),
 'i4-capacity':(q,p)=>{const v=variantOf(q),CUPS={cup:1,pint:2,quart:4,gallon:16},OZ={cup:8,pint:16,quart:32};
  if(v==='compare')return key(q)===(p.f*p.n>p.m?'>':p.f*p.n<p.m?'<':'=');if(v==='liters')return is(q,1000*p.n);if(v==='gallons')return is(q,p.qt/4);
  if(v==='facts')return is(q,CUPS[p.to]/CUPS[p.from.replace(/s$/,'')]);if(v==='true-false')return key(q)===(p.n*CUPS[p.u1]===CUPS[p.u2]?'true':'false');
  const r=OZ[p.u1]>OZ[p.u2]?'>':'<';return E.checkAnswer(q,`${OZ[p.u1]} ounces in 1 ${p.u1} ${r} ${OZ[p.u2]} ounces in 1 ${p.u2}`).answerCorrect&&E.checkAnswer(q,`${OZ[p.u1]} ${r} ${OZ[p.u2]}`).answerCorrect;},
 'i4-money-pic':(q,p)=>is(q,(p.bills.reduce((s,[v,k])=>s+100*v*k,0)+p.coins.reduce((s,[v,k])=>s+v*k,0))/100),
 'i4-decimal-words':(q,p)=>{const T=['','one','two','three','four','five','six','seven','eight','nine'],part=p.places===1?`${T[p.f]} tenth${p.f===1?'':'s'}`:`${WORDS(p.f)} hundredth${p.f===1?'':'s'}`;return E.checkAnswer(q,`${WORDS(p.w)} and ${part}`).answerCorrect;},
 'i4-unit-cost':(q,p)=>p.tot%p.k===0&&is(q,p.tot/p.k/100),
 'i4-frac-decimal':(q,p)=>variantOf(q)==='hundredths'?is(q,p.n/100)&&q.prompt.includes(p.n+'/100'):is(q,(10*p.w+p.k)/10)&&q.prompt.includes(`${p.w} ${p.k}/10`),
 'i4-grid100':(q,p)=>variantOf(q)==='frac-dec'?E.checkAnswer(q,`${p.k}/100; ${p.k/100}`).answerCorrect:E.checkAnswer(q,`${p.k/100}; ${(100-p.k)/100}`).answerCorrect,
 'i4-decimal-order':(q,p)=>E.checkAnswer(q,[p.a/100,p.b/10,p.c/100].sort((x,y)=>y-x).join(', ')).answerCorrect,
 // Batch I4-7
 'i4-missing-factor':(q,p)=>p.p%p.a===0&&is(q,p.p/p.a)&&q.prompt.includes(String(p.p))+(q.givens.svg||'').includes('>'+p.p+'<')>0,
 'i4-sub-zero':(q,p)=>{const v=variantOf(q);if(v==='whole')return is(q,p.a-p.b)&&String(p.a).includes('0');return Math.round(numKey(q)*100)===p.a-p.b&&p.a%100<p.b%100;},
 'i4-round100':(q,p)=>{const r=x=>100*Math.floor((x+50)/100);return variantOf(q)==='add'?is(q,r(p.a)+r(p.b)):is(q,r(p.n))&&p.n%100!==50;},
 'i4-mult-tens':(q,p)=>variantOf(q)==='three'?E.checkAnswer(q,`${p.a*p.b}; ${p.a*p.b}0; ${p.a*p.b}00`).answerCorrect:is(q,p.a*p.b)&&(p.a%10===0||p.b%100===0),
 'i4-add-money':(q,p)=>Math.round(numKey(q)*100)===(variantOf(q)==='three'?p.a+p.b+p.c:p.a+100*p.d+p.c),
 'i4-decimal-col':(q,p)=>variantOf(q)==='sub'?Math.round(Number(key(q))*100)===p.a-p.b:Math.round(Number(key(q))*1000)===p.a+p.b,
 'i4-mult21':(q,p)=>is(q,p.a*p.b)&&inRange(p.a,10,99)&&inRange(p.b,2,9),
 'i4-paren':(q,p)=>{const ex=p.expr.replace(/√(\d+)/g,(m,n)=>`Math.sqrt(${n})`).replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/');return is(q,Function('return '+ex)());},
 'i4-paren-compare':(q,p)=>{const ev=x=>Function('return '+x.replace(/(\d+)²/g,'($1*$1)').replace(/√(\d+)/g,'Math.sqrt($1)').replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/'))(),l=ev(p.left),r=ev(p.right);return key(q)===(l>r?'>':l<r?'<':'=');},
 'i4-assoc':(q,p)=>{const v=variantOf(q);if(v==='missing')return is(q,p.b);if(v==='property')return E.checkAnswer(q,`${p.k<2?'associative':'commutative'} property of ${p.k%2?'multiplication':'addition'}`).answerCorrect;
  return E.checkAnswer(q,`(${p.a}+${p.b})+${p.c}`).answerCorrect&&!E.checkAnswer(q,`${p.a}+(${p.b}+${p.c})`).answerCorrect;},
 'i4-name-figure':(q,p)=>E.checkAnswer(q,`${p.type} ${p.A}${p.B}`).answerCorrect&&E.checkAnswer(q,`${p.type} ${p.B}${p.A}`).answerCorrect===(p.type!=='ray')&&q.givens.svg.includes(`A ${p.type} through`),
 'i4-draw-lines':(q,p)=>q.answer.kind==='teacher'&&(p.two?/line \w\w and line \w\w/.test(q.prompt):/^Draw line \w\w\./.test(q.prompt)),
 'i4-diameter':(q,p)=>E.checkAnswer(q,p.D1+p.D2).answerCorrect&&E.checkAnswer(q,p.D2+p.D1).answerCorrect&&!E.checkAnswer(q,p.M+p.Q).answerCorrect,
 'i4-seg-length':(q,p)=>variantOf(q)==='four'?is(q,p.T-p.a-p.b):is(q,p.T-p.a),
};

// The two sides of a comparison prompt ("a − b ☐ c − d"), evaluated separately.
function evalSides(q,p){const m=q.prompt.split(': ')[1].split('☐').map(x=>x.trim().replace(/−/g,'-').replace(/×/g,'*'));const ev=x=>x.split('+').map(t=>t.includes('*')?t.split('*').reduce((u,w)=>u*Number(w),1):t.split('-').map(Number).reduce((u,w)=>u-w)).reduce((u,w)=>u+w,0);return ev(m[0])===p.a&&ev(m[1])===p.b;}
// Number words back to a number (through 999).
function parseWords(w){const S1={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};let n=0,cur=0;
 for(const t of String(w).toLowerCase().replace(/-/g,' ').split(/\s+/).filter(Boolean)){if(t==='hundred')cur*=100;else if(t==='thousand'){n+=cur*1000;cur=0;}else if(t in S1)cur+=S1[t];else return NaN;}return n+cur;}

// Responses that must be marked wrong for a recipe, beyond the distractors (optional): recipe -> q => [strings].
const wrong={
 'i4-pic-sentence':q=>q.answer.kind==='i4-sentence'?[String(q.answer.total),q.answer.addends.join(' + ')]:[],
 'i4-place':q=>q.answer.kind==='i4-places'?[q.answer.places.slice().reverse().join('; ')]:[],
};

H.run({key:'intermediate-4',oracle,wrong,instances:Number(process.argv[2]||250)});
