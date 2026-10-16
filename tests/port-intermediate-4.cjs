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
 // Batch I4-8
 'i4-divide':(q,p)=>variantOf(q)==='three-forms'?E.checkAnswer(q,p.d.map((d,i)=>(d*p.q[i])/d).join('; ')).answerCorrect:p.n%p.d===0&&is(q,p.n/p.d)&&(q.prompt.includes(`${p.n} ÷ ${p.d}`)||(q.givens.svg||'').includes('>'+p.n+'<')),
 'i4-div-forms':(q,p)=>key(q)==='ABCD'[p.order.indexOf(1)],
 'i4-share-story':(q,p)=>p.n%p.d===0&&is(q,p.n/p.d)&&q.prompt.includes(String(p.n)),
 'i4-fact-family-x':(q,p)=>{const c=p.a*p.b;return E.checkAnswer(q,`${c}/${p.b}=${p.a}; ${p.b}x${p.a}=${c}; ${c}÷${p.a}=${p.b}; ${p.a}*${p.b}=${c}`).answerCorrect&&!E.checkAnswer(q,`${p.a}x${p.b}=${c}; ${p.b}x${p.a}=${c}; ${c}÷${p.a}=${p.b}`).answerCorrect;},
 'i4-mult-story':(q,p)=>is(q,p.a*p.b),
 'i4-dec-add':(q,p)=>{const v=variantOf(q);if(v==='times')return Math.round(numKey(q)*10)===p.w*p.n;if(v==='sub')return Math.round(Number(key(q))*100)===p.a-p.b;return Math.round(Number(key(q))*100)===p.a+p.b+p.c;},
 'i4-dec-place':(q,p)=>{const i=['hundreds','tens','ones','tenths','hundredths'].indexOf(p.place);return is(q,p.d[i])&&q.prompt.includes(`${p.d[0]}${p.d[1]}${p.d[2]}.${p.d[3]}${p.d[4]}`);},
 'i4-percent':(q,p)=>{const v=variantOf(q);
  if(v==='figure'){const out=2*p.c*p.c;return E.checkAnswer(q,String(p.not?out:100-out)).answerCorrect&&!E.checkAnswer(q,String(p.not?100-out:out)).answerCorrect;}
  if(v==='compare-frac'){const fp=100*p.fn/p.fd,l=p.first?p.P:fp,r=p.first?fp:p.P;return key(q)===(l>r?'>':l<r?'<':'=');}
  if(v==='of-compare'){const l=p.P*p.N/100,r=p.a*p.b;return key(q)===(l>r?'>':l<r?'<':'=');}
  if(v==='hour')return is(q,60*p.P/100);if(v==='pennies')return is(q,p.k);if(v==='coin')return is(q,{nickel:5,dime:10,quarter:25,'half-dollar':50}[p.coin]);
  if(v==='rest')return is(q,100-p.P);if(v==='more')return key(q)===(p.P<50?'girls':'boys');return q.answer.kind==='teacher'&&q.prompt.includes(p.P+'%');},
 'i4-add-big':(q,p)=>is(q,total(p.nums)),
 'i4-sub-big':(q,p)=>p.a>p.b&&is(q,p.a-p.b),
 'i4-sub-money':(q,p)=>Math.round(numKey(q)*100)===p.a-p.b,
 // Batch I4-9
 'i4-div-rem':(q,p)=>variantOf(q)==='remainder'?is(q,p.n%p.d):E.checkAnswer(q,`${Math.floor(p.n/p.d)} R ${p.n%p.d}`).answerCorrect&&p.n%p.d>0,
 'i4-round1000':(q,p)=>{const r=(x,u)=>u*Math.floor((x+u/2)/u);return variantOf(q)==='three-ways'?E.checkAnswer(q,`${r(p.n,1000)}; ${r(p.n,100)}; ${r(p.n,10)}`).answerCorrect:is(q,r(p.n,1000));},
 'i4-years-between':(q,p)=>is(q,p.b-p.a),
 'i4-time-units':(q,p)=>{const Y={centuries:100,decades:10,years:1},D={weeks:7,days:1};const f=p.from in Y?Y[p.from]/Y[p.to]:D[p.from]/D[p.to];return is(q,Math.round(p.k*f));},
 'i4-calendar':(q,p)=>{const WD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];if(variantOf(q)==='weekday')return key(q)===WD[(p.start+p.d-1)%7];
  let c=0,d=0;for(let x=1;x<=31;x++)if((p.start+x-1)%7===p.wd&&++c===p.k){d=x;break;}return E.checkAnswer(q,String(d)).answerCorrect;},
 'i4-factors':(q,p)=>{const f=[];for(let k=1;k<=p.n;k++)if(p.n%k===0)f.push(k);if(variantOf(q)==='not-factor')return p.n%numKey(q)!==0&&p.opts.filter(x=>p.n%x!==0).length===1;return E.checkAnswer(q,[...f].reverse().join(', ')).answerCorrect;},
 'i4-multiples':(q,p)=>{const v=variantOf(q);if(v==='first-five')return E.checkAnswer(q,[5,4,3,2,1].map(k=>k*p.n).join(' ')).answerCorrect;if(v==='example')return E.checkAnswer(q,String(p.n*7)).answerCorrect&&!E.checkAnswer(q,String(p.n*7+1)).answerCorrect;
  if(v==='nth-less')return is(q,p.k*p.n-p.s);return is(q,p.k*p.n);},
 'i4-frac-compare':(q,p)=>{const v=variantOf(q),rel=(a,b,c,d)=>a*d>c*b?'>':a*d<c*b?'<':'=';
  if(v==='draw')return q.answer.kind==='teacher'&&q.prompt.includes(`${p.a}/${p.b} and ${p.c}/${p.d}`);if(v==='fourths')return key(q)===rel(p.a,p.b,p.c,p.d);
  if(v==='pictures')return E.checkAnswer(q,`${p.n1}/${p.d1} ${rel(p.n1,p.d1,p.n2,p.d2)} ${p.n2}/${p.d2}`).answerCorrect;
  if(v==='greatest'){const best=p.fr.reduce((m,f)=>f[0]/f[1]>m[0]/m[1]?f:m);return E.checkAnswer(q,`${best[0]}/${best[1]}`).answerCorrect;}
  const items=[...q.prompt.matchAll(/([ABCD])\. (\d+)\/(\d+) ([<>=]) (\d+)\/(\d+)/g)].map(m=>({L:m[1],ok:rel(+m[2],+m[3],+m[5],+m[6])===m[4]})),hits=items.filter(x=>p.wrongOne?!x.ok:x.ok);return items.length===4&&hits.length===1&&key(q)===hits[0].L;},
 'i4-rate':(q,p)=>{const v=variantOf(q),cents=()=>Math.round(numKey(q)*100);if(v==='price')return cents()===p.pr*p.lb;if(v==='cost-day')return cents()===p.c*p.pr;
  if(v==='per-hour')return is(q,60/p.m);if(v==='scale')return is(q,p.r*p.k);if(v==='cans-day')return is(q,p.wk/7);return is(q,p.r*p.t);},
 'i4-mult3':(q,p)=>{const v=variantOf(q);if(v==='whole')return is(q,p.a*p.b);return Math.round(numKey(q)*100)===p.a*p.b;},
 'i4-estimate':(q,p)=>{const v=variantOf(q),r=(x,u)=>u*Math.floor((x+u/2)/u);if(v==='div')return is(q,Math.round(p.n/p.d));if(v==='sum100'||v==='sum1000')return is(q,r(p.a,p.p)+r(p.b,p.p));
  if(v==='product10')return is(q,p.m*r(p.b,10));return is(q,r(p.a,10)*r(p.b,10));},
 // Batch I4-10
 'i4-rate-total':(q,p)=>{const v=variantOf(q);if(v==='scale')return is(q,p.n*60*p.mins/p.s);if(v==='two-part')return E.checkAnswer(q,`${p.m/p.t}; ${p.m/p.t*p.k}`).answerCorrect;return p.m%p.t===0&&is(q,p.m/p.t);},
 'i4-graph':(q,p)=>{const v=variantOf(q);
  if(v==='pict-total')return is(q,total(p.vals));if(v==='pict-most'){const k=p.vals.indexOf(Math.max(...p.vals));return E.checkAnswer(q,`${['maple','fir','oak'][k]}; ${p.vals[k]}`).answerCorrect;}
  if(v==='bar-read')return is(q,p.vals[p.k])&&q.givens.svg.includes(['Soccer','Baseball','Volleyball','Football'][p.k]);if(v==='bar-sum')return is(q,p.vals[p.i]+p.vals[p.j]);
  if(v==='circle-pick'||v==='temps')return key(q)==='ABCD'[p.k];if(v==='line-pick')return key(q)==='ABCD'[p.order.indexOf(p.ask==='stop'?0:1)];
  if(v==='circle-not')return is(q,100-p.p[2])&&total(p.p)===100;
  if(v==='tide'){const d=p.lv.slice(1).map((x,i)=>x-p.lv[i]),k=d.indexOf(Math.max(...d)),f=x=>x===12?'12 noon':`${x%12||12} ${x<12?'am':'pm'}`;return E.checkAnswer(q,`from ${f(9+k)} to ${f(10+k)}`).answerCorrect;}
  if(v==='holly-fraction')return E.checkAnswer(q,`${p.hrs[0]}/24`).answerCorrect&&total(p.hrs)===24;if(v==='holly-sum')return is(q,p.hrs[1]+p.hrs[2]);
  const en=p.st+p.hrs[1];return E.checkAnswer(q,`${en-12}:00 pm`).answerCorrect;},
 'i4-two-step':(q,p)=>{const v=variantOf(q);if(v==='times')return is(q,p.b*p.c/p.k);if(v==='sum')return is(q,(p.b+p.c)/p.k);return is(q,p.a*p.b-p.n);},
 'i4-rem-frac':(q,p)=>E.checkAnswer(q,`${p.n}/${p.d}`).answerCorrect&&(2*p.n===p.d||!E.checkAnswer(q,`${p.d-p.n}/${p.d}`).answerCorrect),
 'i4-exponent':(q,p)=>{const v=variantOf(q);if(v==='write')return E.checkAnswer(q,`${p.a}^${p.k}`).answerCorrect&&!E.checkAnswer(q,String(p.a**p.k)).answerCorrect;
  if(v==='compare'){const l=p.a*p.b*p.b,r=p.c*p.d;return key(q)===(l>r?'>':l<r?'<':'=');}
  const ex=p.expr.replace(/(\d+)²/g,'($1**2)').replace(/(\d+)³/g,'($1**3)').replace(/√(\d+)/g,'Math.sqrt($1)').replace(/−/g,'-');return is(q,Function('return '+ex)());},
 'i4-three-factors':(q,p)=>variantOf(q)==='tens'?is(q,p.a*p.b*10**p.tens):is(q,p.a*p.b*p.c),
 'i4-polygon':(q,p)=>{const v=variantOf(q),S={triangle:3,quadrilateral:4,pentagon:5,hexagon:6,octagon:8,decagon:10};
  if(v==='not'||v==='is'){const isPoly=x=>x in S;const hits=p.shapes.map((x,i)=>p.want?!isPoly(x):isPoly(x));return hits.filter(Boolean).length===1&&key(q)==='ABCD'[hits.indexOf(true)];}
  if(v==='name-sides'){const n=Number(q.prompt.match(/(\d+) sides/)[1]);return S[key(q)]===n;}if(v==='name-pic')return key(q)===p.nm&&q.givens.svg.includes(`${S[p.nm]} sides`);
  if(v==='more-vertices')return is(q,S[p.a]-S[p.b]);if(v==='total-sides')return is(q,S[p.a]+S[p.b]);if(v==='parallel')return is(q,p.n%2?0:p.n/2);return q.answer.kind==='teacher'&&q.prompt.includes(p.nm);},
 'i4-div2':(q,p)=>{const v=variantOf(q);if(v==='divisible-pick')return p.opts.filter(x=>x%p.d===0).length===1&&is(q,p.opts.find(x=>x%p.d===0));if(v==='divisible-tf')return key(q)===(p.n%p.d===0?'true':'false');
  if(v==='mental')return key(q)==='ABCD'[p.pos]&&p.n/p.d===Number(String(p.n/p.d)[0].repeat(4));return p.n%p.d===0&&is(q,p.n/p.d);},
 'i4-div-terms':(q,p)=>is(q,{divisor:p.d,dividend:p.d*p.q,quotient:p.q}[p.ask]),
 // Batch I4-11
 'i4-congruent':(q,p)=>variantOf(q)==='tf'?key(q)===(p.same?'true':'false'):E.checkAnswer(q,`${p.j0} and ${p.i0}`).answerCorrect&&p.i0!==p.j0&&p.j0<=p.n,
 'i4-mult-ten2':(q,p)=>{const v=variantOf(q);if(v==='factor-10')return E.checkAnswer(q,`10 x ${p.t/10} x ${p.a}; ${p.a*p.t}`).answerCorrect;if(v==='tenths')return Number(key(q))===p.n/10;if(v==='money')return Math.round(numKey(q)*100)===p.c*p.q;return is(q,p.a*p.t);},
 'i4-div-rem2':(q,p)=>{const qq=Math.floor(p.n/p.d),r=p.n%p.d,v=variantOf(q);if(v==='zero-rem'||v==='zero-even')if(qq%10!==0)return false;return r?E.checkAnswer(q,`${qq} R ${r}`).answerCorrect:is(q,qq);},
 'i4-div-money':(q,p)=>variantOf(q)==='feet'?Math.round(numKey(q)*10)*p.d===p.n:Math.round(numKey(q)*100)*p.d===p.n,
 'i4-div-grid':(q,p)=>key(q)==='ABCD'[p.vals.indexOf(5*p.a)]&&p.vals.filter(x=>x===5*p.a).length===1,
 'i4-mm':(q,p)=>{const v=variantOf(q);if(v==='cm-mm')return is(q,Math.round(p.c*10));if(v==='measure')return is(q,p.L)&&E.checkAnswer(q,`${p.L} mm`).answerCorrect&&!E.checkAnswer(q,`${p.L} cm`).answerCorrect;
  if(v==='cm-and-mm')return E.checkAnswer(q,`${p.L/10}; ${p.L}`).answerCorrect;if(v==='perimeter')return is(q,total(p.s));if(v==='circle')return E.checkAnswer(q,`${p.rr}; ${2*p.rr/10}`).answerCorrect;
  return key(q)===(/eyelash|coin|rice/.test(p.thing)?'millimeters':'centimeters');},
 'i4-frac-group':(q,p)=>{const v=variantOf(q);if(v==='twelfths')return is(q,p.k*p.n/12);if(v==='of')return is(q,p.k*p.n/p.d);if(v==='unit-of-time')return is(q,p.tot/p.d);if(v==='area-half')return is(q,p.l*p.w/p.p);return is(q,p.n/p.d);},
 'i4-survey':(q,p)=>{const v=variantOf(q);if(v==='biased')return key(q)==='ABCD'[p.k]&&/tear down|wonderful|improve our|greasy/.test(q.prompt.split(`${'ABCD'[p.k]}. `)[1].split('"')[1]);if(v==='solvable')return key(q)===(p.ok?'yes':'no');
  if(v==='sample')return q.answer.kind==='teacher';if(v==='dup-names')return E.checkAnswer(q,`${p.dups[1]}, ${p.dups[0]}`).answerCorrect;const seen=new Set();let d;for(const x of p.all){if(seen.has(x))d=x;seen.add(x);}return E.checkAnswer(q,String(d)).answerCorrect;},
 'i4-info':(q,p)=>{const v=variantOf(q);if(v==='trip')return E.checkAnswer(q,`${p.st/p.car}; ${p.st*p.cost}; ${(100*p.cost-p.saved)/100}`).answerCorrect;if(v==='yard')return E.checkAnswer(q,`${p.m+p.a}; ${p.a*p.p}; ${(p.m+p.a)*p.p}`).answerCorrect;
  if(v==='election'){const don=p.mig+p.dif;return E.checkAnswer(q,`${don}; ${p.lucy>don?'Lucy':'Don'}; March ${p.date-p.days}`).answerCorrect;}if(v==='colors')return is(q,p.vals[p.k]);if(v==='fewest')return key(q)===['red','blue','green','yellow'][p.vals.indexOf(Math.min(...p.vals))];
  if(v==='darts')return is(q,p.tot-p.j);if(v==='unit-price')return Math.round(numKey(q)*100)===p.tot/p.k*p.m;return q.answer.kind==='teacher';},
 'i4-transform':(q,p)=>{const v=variantOf(q);if(v==='common')return E.checkAnswer(q,p.ord.map(x=>({reflection:'flip',rotation:'turn',translation:'slide'})[x]).join(', ')).answerCorrect;if(v==='name')return key(q)===p.kind;return E.checkAnswer(q,p.kind.split(' and ').reverse().join(' and ')).answerCorrect;},
 'i4-frac-set':(q,p)=>{const v=variantOf(q);if(v==='class')return E.checkAnswer(q,`${p.tot-p.g}/${p.tot}`).answerCorrect;if(v==='shaded')return E.checkAnswer(q,`${p.k}/${p.d}`).answerCorrect;
  const k=[...p.W].filter(c=>c===p.L).length;return E.checkAnswer(q,`${p.not?p.W.length-k:k}/${p.W.length}`).answerCorrect;},
 'i4-turns':(q,p)=>{const v=variantOf(q),D=['north','east','south','west'];if(v==='direction')return key(q)===D[((p.s+(p.cw?1:-1)*p.deg/90)%4+4)%4];
  if(v==='clock'){const t=((p.hh*60+p.m+p.delta)%720+720)%720;return E.checkAnswer(q,`${Math.floor(t/60)||12}:${String(t%60).padStart(2,'0')}`).answerCorrect;}if(v==='quarter'||v==='segment')return is(q,p.deg);return q.answer.kind==='teacher';},
 'i4-weight':(q,p)=>{const v=variantOf(q);if(v==='tons')return is(q,2000*p.t0);if(v==='ton-frac'){const [a,b]=p.f.split('/').map(Number);return is(q,2000*a/b);}if(v==='oz')return is(q,16*p.p);if(v==='nearest-lb')return is(q,Math.round((16*p.p+p.o)/16));
  if(v==='kg-g')return is(q,1000*p.k);if(v==='scale')return is(q,p.g);if(v==='heaviest')return key(q)===['ton','kilogram','pound','ounce'][p.k];return key(q)===['5 pounds','1 kilogram','4 tons','1 gram','2 ounces','70 kilograms','1500 kilograms','1 gram','25 pounds'][p.k];},
 // Batch I4-12
 'i4-tri-class':(q,p)=>{const v=variantOf(q),K={equilateral:['equilateral','acute'],isosceles:['isosceles','acute'],scalene:['scalene','acute'],right:['scalene','right'],obtuse:['scalene','obtuse'],'right-iso':['isosceles','right'],'obtuse-iso':['isosceles','obtuse']};
  if(v==='blank')return q.prompt.includes(key(q)==='equilateral'?'Three sides':key(q)==='isosceles'?'two sides':key(q)==='scalene'?'No two':key(q)==='right'?'90°':'greater than 90');
  if(v==='pick'){const hits=p.shapes.map(x=>p.want==='isosceles'?['isosceles','equilateral'].includes(K[x][0]):K[x][0]===p.want);return hits.filter(Boolean).length===1&&key(q)==='ABCD'[hits.indexOf(true)];}
  if(v==='angles')return key(q)===K[p.kk][1];return E.checkAnswer(q,`${K[p.kk][0]}; ${K[p.kk][1]}`).answerCorrect;},
 'i4-symmetry':(q,p)=>{const v=variantOf(q),Y='ADHWYMTUVXBCEO';if(v==='letter-pick')return p.opts.filter(x=>!Y.includes(x)).length===1&&!Y.includes(key(q));if(v==='letter-yn')return key(q)===(Y.includes(p.Lt)?'yes':'no');
  if(v==='draw')return q.answer.kind==='teacher';const bad=['flag','bolt','blob','stair'];return p.shapes.filter(x=>bad.includes(x)).length===1&&key(q)==='ABCD'[p.shapes.findIndex(x=>bad.includes(x))];},
 'i4-div-zero':(q,p)=>{const v=variantOf(q);if(v==='money')return Math.round(numKey(q)*100)*p.d===p.n&&String(Math.round(numKey(q)*100)).includes('0');if(v==='power')return is(q,p.n/(p.a*p.a));
  const qq=Math.floor(p.n/p.d),r=p.n%p.d;return String(qq).includes('0')&&(r?E.checkAnswer(q,`${qq} R ${r}`).answerCorrect:is(q,qq));},
 'i4-graph2':(q,p)=>{const v=variantOf(q);if(v==='point'){const pt=p.pts[p.k];return key(q)===pt[0]&&q.prompt.includes(`(${pt[1]}, ${pt[2]})`);}if(v==='extend')return is(q,p.d1+(p.ask-1)*p.inc);
  if(v==='graph-pick')return key(q)==='ABCD'[p.k];if(v==='missing')return is(q,p.miss)&&!q.givens.svg.includes('#'+p.miss+' ')&&!new RegExp('#'+p.miss+'<').test(q.givens.svg);return q.answer.kind==='teacher';},
 'i4-angle-est':(q,p)=>{const v=variantOf(q);if(v==='right-pick')return key(q)==='ABCD'[p.degs.indexOf(90)];if(v==='clock-hand')return is(q,((p.st%12)+p.deg/30)%12||12);if(v==='estimate')return E.checkAnswer(q,String(p.d+10)).answerCorrect&&!E.checkAnswer(q,String(p.d+20)).answerCorrect;
  const deg=30*Math.min(p.hh%12,12-p.hh%12),t=((p.hh*60-p.mv/6)%720+720)%720;return E.checkAnswer(q,`${deg}; ${Math.floor(t/60)||12}:${String(t%60).padStart(2,'0')}`).answerCorrect;},
 'i4-tessellate':(q,p)=>{const yes=['square','equilateral triangle','regular hexagon','rectangle'];if(variantOf(q)==='pick')return key(q)==='ABCD'[p.opts.findIndex(o=>yes.includes(o))];return key(q)===(yes.includes(p.nm)?'yes':'no');},
 'i4-tax':(q,p)=>{const v=variantOf(q),c=Math.round(numKey(q)*100);if(v==='tax')return c===p.p*p.r;if(v==='cost')return c===100-p.c;if(v==='total')return c===p.k*p.u+p.tax;if(v==='multi-change')return c===p.pay-p.k*p.u-p.tax;
  if(v==='two-part'){const tot=p.k*p.u+p.tax;return E.checkAnswer(q,`${tot/100}; ${(2000-tot)/100}`).answerCorrect;}return c===p.pay-p.c-p.tax;},
 'i4-thousandths':(q,p)=>{const v=variantOf(q);if(v==='to-dec')return Math.round(Number(key(q))*1000)===p.n;if(v==='to-frac')return E.checkAnswer(q,`${2*p.n}/2000`).answerCorrect;
  const words=(p.w?`${WORDS(p.w)} and `:'')+WORDS(p.n)+(p.n===1?' thousandth':' thousandths');return E.checkAnswer(q,`${v==='frac-words'?(p.w?p.w+' ':'')+p.n+'/1000':(p.w+p.n/1000).toFixed(3)}; ${words}`).answerCorrect;},
 'i4-times10':(q,p)=>{const v=variantOf(q);if(v==='equiv')return key(q)==='ABCD'[p.ord.indexOf(0)];if(v==='cents100')return is(q,p.c);if(v==='whole10')return is(q,10*p.n);return Math.round(numKey(q)*100)===p.c*p.k;},
 'i4-mult-tens3':(q,p)=>variantOf(q)==='money'?Math.round(numKey(q))===p.a*p.b:is(q,p.a*p.b),
 'i4-mult22':(q,p)=>is(q,p.a*p.b),
 'i4-rem-story':(q,p)=>{const v=variantOf(q);if(v==='stacks'){const g=Math.floor(p.n/p.s0);return E.checkAnswer(q,`${g}; ${p.n%p.s0}; ${g+1}`).answerCorrect;}if(v==='cars'){const g=Math.floor(p.n/p.s0);return E.checkAnswer(q,`${g}; ${g+1}`).answerCorrect;}
  if(v==='packages')return E.checkAnswer(q,`${Math.floor(p.n/p.s0)}; ${p.n%p.s0}`).answerCorrect;if(v==='no-ride')return is(q,p.n-p.per*p.vans);const r=p.n%p.groups;return E.checkAnswer(q,`${p.groups-r}; ${r}`).answerCorrect;},
 'i4-improper':(q,p)=>{const v=variantOf(q);if(v==='draw')return q.answer.kind==='teacher'&&q.prompt.includes(`${p.n}/${p.d}`);if(v==='statement')return key(q)==='ABCD'[p.ord.indexOf(0)];
  return E.checkAnswer(q,`${2*p.n}/${2*p.d}; ${Math.floor(p.n/p.d)} ${p.n%p.d}/${p.d}`).answerCorrect;},
 // Batch I4-13
 'i4-mult22b':(q,p)=>is(q,p.a*p.b)&&p.b%10>=3,
 'i4-manip':(q,p)=>{const v=variantOf(q);if(v==='all-but')return is(q,100-100*p.k/p.d);if(v==='add-same')return E.checkAnswer(q,`${p.a+p.b}/${p.d}`).answerCorrect;
  if(v==='add-halves'){const n=p.half?2*p.a+p.b:p.a+2*p.b;return E.checkAnswer(q,`${n}/4`).answerCorrect;}return key(q)===(p.a>p.b?'>':'<');},
 'i4-dec-place2':(q,p)=>{const v=variantOf(q);if(v==='compare'){const a=Number(p.s1),b=Number(p.s2);return key(q)===(a>b?'>':a<b?'<':'=');}if(v==='digit')return is(q,p.d[p.k]);if(v==='same-place')return is(q,p.d[p.k]);return Math.round(Number(key(q))*100)===9*p.a;},
 'i4-quads':(q,p)=>{const v=variantOf(q),N={square:['quadrilateral','parallelogram','rectangle','rhombus','square'],rectangle:['quadrilateral','parallelogram','rectangle'],rhombus:['quadrilateral','parallelogram','rhombus'],parallelogram:['quadrilateral','parallelogram'],trapezoid:['quadrilateral','trapezoid'],quadrilateral:['quadrilateral']};
  if(v==='name')return key(q)===p.kind;if(v==='not-describe')return key(q)===p.bad&&!N[p.kind].includes(p.bad);if(v==='is-para')return key(q)===(N[p.kind].includes('parallelogram')?'yes':'no');if(v==='all-names')return E.checkAnswer(q,[...N[p.kind]].reverse().join(', ')).answerCorrect;return q.answer.kind==='teacher';},
 'i4-estimate2':(q,p)=>{const v=variantOf(q);if(v==='div-hundred')return is(q,Math.round(p.n/100)*100/p.d);if(v==='div-ten')return is(q,Math.round(p.n/10)*10/p.d);return E.checkAnswer(q,`${Math.round(p.a/10)*Math.round(p.b/10)*100}; ${p.a*p.b}`).answerCorrect;},
 'i4-two-step2':(q,p)=>{const v=variantOf(q),c=Math.round(numKey(q)*100);if(v==='per-pound')return c*p.k===2000-p.ch;if(v==='square-area')return is(q,(p.P/4)**2);if(v==='ages')return is(q,p.j-p.n1+p.n2);
  if(v==='times-plus')return is(q,(p.half?p.t0/2:p.t0*p.k)+p.plus);if(v==='toll')return c===p.toll-10*p.di-5*p.ni;return c===p.na*p.ad+p.ns*p.st;},
 'i4-frac-group2':(q,p)=>variantOf(q)==='pieces'?is(q,p.L0*3/p.k):is(q,p.k*p.n/p.d),
 'i4-average':(q,p)=>is(q,total(p.xs)/p.xs.length)&&total(p.xs)%p.xs.length===0,
 'i4-stats':(q,p)=>{const s=[...p.xs].sort((a,b)=>a-b),n=s.length;if(p.name==='range')return is(q,s[n-1]-s[0]);if(p.name==='mean')return is(q,Math.round(total(s)/n));if(p.name==='median')return is(q,n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2);
  const c={};s.forEach(x=>c[x]=(c[x]||0)+1);const top=Math.max(...Object.values(c));return Object.values(c).filter(x=>x===top).length===1&&is(q,Number(Object.keys(c).find(k=>c[k]===top)));},
 'i4-solids':(q,p)=>{const v=variantOf(q),NM=['cube','cube','rectangular prism','rectangular prism','pyramid','pyramid','cylinder','cylinder','sphere','cone'],VFE={cube:[8,6,12],'rectangular prism':[8,6,12],'square pyramid':[5,5,8],'triangular pyramid':[4,4,6],'triangular prism':[6,5,9],'pentagonal prism':[10,7,15],'hexagonal prism':[12,8,18]};
  if(v==='name')return key(q)===NM[p.k];if(v==='name-two')return E.checkAnswer(q,p.ks.map(k=>NM[k]).join(', ')).answerCorrect;if(v==='pick')return key(q)==='ABCD'[p.k];if(v==='cubes')return is(q,p.w*p.hh*p.d);
  if(v==='vfe')return E.checkAnswer(q,VFE[p.nm].join('; ')).answerCorrect;if(v==='count')return is(q,VFE[p.nm][{vertices:0,faces:1,edges:2}[p.what]]);if(v==='faces-compare'){const F=VFE[p.nm][1];return E.checkAnswer(q,`${F}; ${F>6?'more':F===6?'the same':'fewer'}`).answerCorrect;}
  if(v==='cube-qs')return is(q,/corners/.test(p.q0)?8:/edges/.test(p.q0)?12:6);return q.answer.kind==='teacher';},
 'i4-prisms':(q,p)=>{const v=variantOf(q);if(v==='edges')return E.checkAnswer(q,p.par?'C and A':'B and A').answerCorrect;if(v==='planes')return /^(Top|Front|Bottom) and (Side|Front)$/.test(p.opts[p.k])&&key(q)==='ABCD'[p.k];
  if(v==='parallel-count')return is(q,3);if(v==='perp-faces')return is(q,4);if(v==='net')return key(q)===p.nm;return q.answer.kind==='teacher';},
 'i4-probability':(q,p)=>{const v=variantOf(q);if(v==='cans')return E.checkAnswer(q,`${p.cnt[p.k]}/${total(p.cnt)}`).answerCorrect;if(v==='spinner'){const V='AEIOUaeiou',f={'a lowercase letter or a vowel':x=>x===x.toLowerCase()||V.includes(x),'a consonant or a lowercase letter':x=>!V.includes(x)||x===x.toLowerCase(),'an uppercase letter':x=>x===x.toUpperCase(),'a vowel':x=>V.includes(x)}[p.c];return E.checkAnswer(q,`${p.letters.filter(f).length}/5`).answerCorrect;}
  return E.checkAnswer(q,`${p.n}/${p.d}`).answerCorrect;},
 // Batch I4-14
 'i4-tables':(q,p)=>{const v=variantOf(q),dur=(pl,day)=>{const t=!pl.split||day<pl.split[0]?pl.times[0]:pl.times[1];return t[1]-t[0];},find=n=>p.sch.find(x=>x.name===n),hm=t=>E.checkAnswer(q,`${Math.floor(t/60)} hours ${t%60} minutes`).answerCorrect;
  if(v==='hours-open')return hm(dur(find(p.p),p.day));if(v==='minutes-more')return is(q,dur(find(p.a),p.day)-dur(find(p.b),p.day));
  if(v==='day-diff'){const pl=find(p.p);return hm(Math.abs((pl.times[0][1]-pl.times[0][0])-(pl.times[1][1]-pl.times[1][0])));}
  if(v==='weights')return is(q,p.w[p.i]-p.w[p.j])&&p.w[p.i]>p.w[p.j];if(v==='calories')return is(q,p.c[p.i][p.a]-p.c[p.j][p.b]);
  if(v==='waterfall'){const ft=[3212,3110,2425,1904,354,188],m=[979,948,739,580,108,57];return is(q,(p.m?m:ft)[p.i]-(p.m?m:ft)[p.j]);}
  if(v==='ship-cost')return Math.round(numKey(q)*100)===p.base[p.zz]+p.inc[p.zz]*(p.w-1);
  if(v==='ship-diff')return Math.round(numKey(q)*100)===(p.base[p.z2]-p.base[p.z1])+(p.inc[p.z2]-p.inc[p.z1])*(p.w-1);
  return key(q).toLowerCase()===(p.food?p.fd:p.lv)[p.k];},
 'i4-tenths':(q,p)=>{const v=variantOf(q);if(v==='arrow')return Math.round(Number(key(q))*10)===p.c*10+p.k;if(v==='cm-m')return Math.round(Number(key(q))*100)===p.n;
  if(v==='mm-cm')return E.checkAnswer(q,`${p.L}; ${p.L/10}`).answerCorrect;return E.checkAnswer(q,`${Math.floor(p.a/10)+(p.a%10>=5?1:0)}; ${(Math.floor(p.b/10)+(p.b%10>=5?1:0))/10}`).answerCorrect;},
 'i4-frac1':(q,p)=>{const v=variantOf(q),k=key(q),chosen=()=>p.opts[p.ord['ABCD'.indexOf(k)]],val=x=>{const m=x.split('/').map(Number);return m.length===1?m[0]:m[0]/m[1];};
  if(v==='not-half'||v==='not-one'){const t=p.half?0.5:1;return p.opts.filter(x=>val(x)!==t).length===1&&val(chosen())!==t;}
  if(v==='shown-one')return chosen()===`${p.n}/${p.n}`;if(v==='which-one')return val(chosen())===1&&p.opts.filter(x=>val(x)===1).length===1;
  if(v==='equiv-den')return numKey(q)*p.a===p.a*p.b&&q.prompt.includes(`☐/${p.a*p.b}`);if(v==='one-den')return is(q,p.n);
  if(v==='half-den')return numKey(q)*2===p.d;if(v==='round-mixed')return is(q,p.w+(p.k/p.d>0.5?1:0));
  if(v==='write-half')return E.checkAnswer(q,p.one?'7/7':'7/14').answerCorrect&&!E.checkAnswer(q,p.one?'1/1':'1/2').answerCorrect;
  return k===(p.a*2>p.d?'>':p.a*2<p.d?'<':'=');},
 'i4-to-mixed':(q,p)=>E.checkAnswer(q,`${Math.floor(p.n/p.d)} ${p.n%p.d}/${p.d}`).answerCorrect,
 'i4-div10':(q,p)=>{const v=variantOf(q);if(v==='whole')return is(q,p.n/10);if(v==='dec')return Math.round(Number(key(q))*10)===p.n;
  if(v==='tens-rem')return E.checkAnswer(q,`${Math.floor(p.n/p.d)} R ${p.n%p.d}`).answerCorrect&&p.n%p.d>0;if(v==='rem10')return E.checkAnswer(q,`${Math.floor(p.n/10)} R ${p.n%10}`).answerCorrect;
  return E.checkAnswer(q,String(p.lo+10)).answerCorrect&&!E.checkAnswer(q,String(p.lo+5)).answerCorrect&&!E.checkAnswer(q,String(p.hi+10)).answerCorrect;},
 'i4-evaluate':(q,p)=>{const v=variantOf(q);if(v==='sqrt')return numKey(q)**2===p.x;if(v==='minus')return is(q,p.b-p.c);if(v==='product')return is(q,p.p*p.q);return is(q,p.x/p.y);},
 'i4-frac-as':(q,p)=>{const v=variantOf(q);if(v==='add')return E.checkAnswer(q,`${2*(p.a+p.b)}/${2*p.d}`).answerCorrect;if(v==='sub')return E.checkAnswer(q,`${2*(p.a-p.b)}/${2*p.d}`).answerCorrect;
  if(v==='sub-mixed'){const n=(p.w1*p.d+p.a)-(p.w2*p.d+p.b);return E.checkAnswer(q,`${Math.floor(n/p.d)} ${n%p.d}/${p.d}`).answerCorrect||n%p.d===0&&is(q,n/p.d);}
  if(v==='add-mixed'){const n=(p.w1*p.d+p.a)+(p.w2*p.d+p.b);return E.checkAnswer(q,`${Math.floor(n/p.d)} ${n%p.d}/${p.d}`).answerCorrect||n%p.d===0&&is(q,n/p.d);}
  return E.checkAnswer(q,`${p.a+p.b}/${p.d}`).answerCorrect;},
 'i4-formulas':(q,p)=>{const v=variantOf(q);if(v==='missing')return is(q,[p.c,p.c,p.a][p.pos]);
  const F=['the area of a square','the area of a rectangle','the perimeter of a square','the perimeter of a rectangle','the area of a triangle','the perimeter of an equilateral triangle'],G=['A=s^2','A=l*w','P=4*s','P=2*l+2*w','A=1/2*b*h','P=3*s'];
  if(v==='formula-what')return key(q).toLowerCase()===F[p.i];if(v==='formula-for')return E.checkAnswer(q,G[p.i]).answerCorrect;
  if(v==='distribute')return is(q,p.a*p.b+p.a*p.c);if(v==='rewrite')return E.checkAnswer(q,`${p.a} × ${p.c}; ${p.a} × ${p.b}; ${p.a*p.b+p.a*p.c}`).answerCorrect;
  if(v==='square')return E.checkAnswer(q,p.area?`A = s^2; ${p.s*p.s}`:`P = 4 * s; ${4*p.s}`).answerCorrect;return E.checkAnswer(q,`A = 1/2 b h; ${p.b*p.ht/2}`).answerCorrect;},
 'i4-equiv':(q,p)=>{const v=variantOf(q);if(v==='four')return E.checkAnswer(q,[0,1,2,3].map(i=>`${p.a*(p.f+i)}/${p.b*(p.f+i)}`).join('; ')).answerCorrect;
  if(v==='complete')return is(q,p.top?p.a*p.k:p.b*p.k);if(v==='name-pair')return E.checkAnswer(q,`${p.a*p.m}/${p.b*p.m}=${p.a}/${p.b}`).answerCorrect;if(v==='draw')return q.answer.kind==='teacher'&&q.prompt.includes(`${p.a*p.m}/${p.b*p.m}`);
  return E.checkAnswer(q,[5,6,7].map(m=>`${p.a*m}/${p.b*m}`).join(' and ')).answerCorrect&&!E.checkAnswer(q,[1,2,3].map(m=>`${p.a*m}/${p.b*m}`).join(', ')).answerCorrect;},
 'i4-div-tens':(q,p)=>{const v=variantOf(q);if(v==='rem')return E.checkAnswer(q,`${Math.floor(p.n/p.d)} R ${p.n%p.d}`).answerCorrect&&p.n%p.d>0;if(v==='by10')return is(q,p.n/10);return is(q,p.n/p.d)&&p.n%p.d===0;},
 'i4-volume':(q,p)=>{const v=variantOf(q);if(v==='cube-units')return is(q,p.w*p.ht*p.d*p.k);if(v==='cube')return is(q,p.s*p.s*p.s);if(v==='count')return is(q,p.w*p.ht*p.d);return is(q,p.l*p.w*p.ht);},
 // Batch I4-15
 'i4-area-est':(q,p)=>{const v=variantOf(q);if(v==='grid')return is(q,total(p.hs));if(v==='triangle'){const z=p.a*p.b/2;return E.checkAnswer(q,String(z)).answerCorrect&&!E.checkAnswer(q,String(p.a*p.b)).answerCorrect;}
  const z=Math.PI*p.r*p.r;return E.checkAnswer(q,String(Math.round(z))).answerCorrect&&!E.checkAnswer(q,String(4*p.r*p.r)).answerCorrect;},
 'i4-reduce':(q,p)=>{const v=variantOf(q),g=(x,y)=>y?g(y,x%y):x;if(v==='reduce'){const k=g(p.a*p.k,p.b*p.k);return key(q)===`${p.a*p.k/k}/${p.b*p.k/k}`;}
  if(v==='which'){const [m,n]=p.opts[p.ord['ABCD'.indexOf(key(q))]].split('/').map(Number);return n===m*p.d&&p.opts.filter(x=>{const [c,e]=x.split('/').map(Number);return e===c*p.d;}).length===1;}
  if(v==='find')return E.checkAnswer(q,`${3*p.a}/${3*p.b}`).answerCorrect&&!E.checkAnswer(q,`${p.a}/${p.b}`).answerCorrect;
  return E.checkAnswer(q,p.fs.map(([a,b,k])=>{const x=g(a*k,b*k);return `${a*k/x}/${b*k/x}`;}).join('; ')).answerCorrect;},
 'i4-method':(q,p)=>{const v=variantOf(q);if(v==='frac')return E.checkAnswer(q,'mentally').answerCorrect;return E.checkAnswer(q,p.easy?'mentally':'calculator').answerCorrect&&(p.easy===(p.b===10||p.b===100));},
 'i4-mult32':(q,p)=>{const v=variantOf(q);if(v==='money')return Math.round(numKey(q)*100)===p.c*p.n;return is(q,p.a*p.b);},
 'i4-simplify':(q,p)=>{const v=variantOf(q),g=(x,y)=>y?g(y,x%y):x,mixed=(n,d)=>{const w=Math.floor(n/d),r=n%d,k=g(r,d);return r?(w?`${w} ${r/k}/${d/k}`:`${r/k}/${d/k}`):String(w);};
  if(v==='sub'||v==='sub-mixed')return E.checkAnswer(q,mixed((p.w1*p.d+p.a)-(p.w2*p.d+p.b),p.d)).answerCorrect;if(v==='add')return E.checkAnswer(q,mixed(p.a+p.b,p.d)).answerCorrect;
  if(v==='halves')return is(q,p.a+p.b+1);return is(q,p.a+p.b+1)&&p.k<p.d;},
 'i4-rename':(q,p)=>{const v=variantOf(q);if(v==='two-equiv')return E.checkAnswer(q,`${3}/${3*p.d}, ${2}/${2*p.d}`).answerCorrect;if(v==='div-equiv'){const [x,y]=key(q).split('÷').map(Number);return x*p.b===p.a*y&&x===p.a/10;}
  return key(q).toLowerCase()===(p.c*p.b===p.a*p.d?'yes':'no');},
 'i4-common':(q,p)=>{const v=variantOf(q);if(v==='rename'){const l=p.d1*p.d2/((x,y)=>{while(y)[x,y]=[y,x%y];return x;})(p.d1,p.d2);return E.checkAnswer(q,`${p.a*l/p.d1}/${l}, ${p.b*l/p.d2}/${l}`).answerCorrect;}
  if(v==='same')return key(q).toLowerCase()===((p.a/p.p)/(p.c/p.e2)===p.a/p.c?'yes':'no');let k=2;while(p.a%k||p.b%k)k++;return E.checkAnswer(q,`${k}; ${p.a/p.b}`).answerCorrect;},
 'i4-round-big':(q,p)=>{const u=10**p.e,r=p.n%u;return is(q,p.n-r+(2*r>=u?u:0));},
 'i4-div2d':(q,p)=>{const v=variantOf(q);if(v==='exact')return is(q,p.n/p.d)&&p.n%p.d===0;return E.checkAnswer(q,`${Math.floor(p.n/p.d)} R ${p.n%p.d}`).answerCorrect&&(v==='rem1'?p.n<10*p.d:p.n>=10*p.d);},
 'i4-unlike':(q,p)=>{const v=variantOf(q);if(v==='add')return E.checkAnswer(q,`${6}/${4*p.d}`).answerCorrect;
  const g=(x,y)=>y?g(y,x%y):x,low=(n,d)=>{const k=g(n,d);return `${n/k}/${d/k}`;};if(v==='sub-improper')return E.checkAnswer(q,low(2*p.a-1,2*p.d)).answerCorrect;return E.checkAnswer(q,low(p.a-p.b*p.k,p.d2*p.k)).answerCorrect;},
 'i4-unlike-mixed':(q,p)=>{const v=variantOf(q),g=(x,y)=>y?g(y,x%y):x,D=p.d1*p.d2,x=(p.w1*p.d1+p.a)*p.d2,y=(p.w2*p.d2+p.b)*p.d1,n=v==='add'?x+y:x-y,w=Math.floor(n/D),r=n%D,k=g(r,D);return E.checkAnswer(q,`${w} ${r/k}/${D/k}`).answerCorrect;},
 'i4-balance':(q,p)=>{const v=variantOf(q);if(v==='frac')return numKey(q)*p.n===p.c*p.d;return numKey(q)*p.a===p.a*p.x&&promptNums(q).includes(p.a*p.x);},
 'i4-roman':(q,p)=>{const v=variantOf(q),V={I:1,V:5,X:10,L:50,C:100,D:500,M:1000},val=r=>[...r].reduce((s,c,i)=>s+(V[r[i+1]]>V[c]?-V[c]:V[c]),0);
  if(v==='to39')return val(key(q))===p.n&&/^X{0,3}(IX|IV|V?I{0,3})$/.test(key(q));if(v==='letter')return is(q,V[p.L]);if(v==='from')return is(q,val(p.r));if(v==='to')return val(key(q))===p.n&&/^M?(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(key(q));
  const [a,b]=key(q).split(';').map(x=>x.trim());return Number(a)===p.m&&val(b)===p.n;},
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
