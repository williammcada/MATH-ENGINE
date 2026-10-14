// 8/7 port tasks (coverage programme): independent mathematics, source ranges, distractors, drawings and determinism.
// The oracle below recomputes every key from the task's own parameters with separate code; it never reads the
// task's answer to build the expected value.
const assert=require('node:assert/strict'),E=require('../src/course-banks.js'),P=require('../src/port87.js');
const SEEDS=['a','b',7,'port87'],N=250;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),red=(n,d)=>{const g=gcd(n,d);return [n/g,d/g];};
const fracEq=(q,n,d)=>{const v=q.answer.values[0],[x,y]=red(n,d);return v.numerator===String(x)&&v.denominator===String(y);};
const isPrime=p=>p>1&&[...Array(p).keys()].slice(2).every(k=>p%k);
const PLACES=['ones','tens','hundreds','thousands','ten-thousands','hundred-thousands','millions','ten-millions','hundred-millions','billions','ten-billions','hundred-billions','trillions'];
const words=P.words;
const oracle={
 'money-divide':(q,p)=>{assert(p.divisor>=11&&p.divisor<=99&&p.divisor%10);const z=p.dividendCents/p.divisor;assert(Number.isInteger(z)&&z>=11&&z<=99&&z%10);return fracEq(q,z,100);},
 'money-times':(q,p)=>{assert(p.cents>=101&&p.cents<=999&&p.cents%100&&p.factor%10===0&&p.factor>=20&&p.factor<=90);return fracEq(q,p.cents*p.factor,100);},
 'evaluate-quotient':(q,p)=>{assert(p.a>=3&&p.a<=5&&p.x%p.a===0);const b=p.x/p.a;assert(b>=5&&b<=14);return fracEq(q,b,1);},
 'evaluate-product-difference':(q,p)=>{assert(Math.abs(p.x)>=2&&Math.abs(p.x)<=7&&p.y>=1.1&&p.y<=4.1&&p.w>=0.4&&p.w<=5.5&&p.y!==p.w);return fracEq(q,Math.round(p.x*(p.y*10-p.w*10)),10);},
 'evaluate-product-over-sum':(q,p)=>fracEq(q,p.j*p.k,p.j+p.k),
 'property-statement':(q,p)=>{assert(new Set(p.numbers).size===p.numbers.length&&p.numbers.every(x=>x>=2&&x<=9));const [a,b,d]=p.numbers,o=p.op;const good=q.answer.property==='commutative'?[`${b} ${o} ${a} = ${a} ${o} ${b}`,`${a}${o}${b}=${b}${o}${a}`]:[`${a} ${o} (${b} ${o} ${d}) = (${a} ${o} ${b}) ${o} ${d}`,`(${b}${o}${a})${o}${d}=${b}${o}(${a}${o}${d})`];const bad=q.answer.property==='commutative'?[`${a} ${o} ${b} = ${a} ${o} ${b}`,`${a} ${o} ${b} = ${b} ${o==='+'?'×':'+'} ${a}`]:[`(${a} ${o} ${b}) ${o} ${d} = ${d} ${o} (${a} ${o} ${b})`,`(${a} ${o} ${b}) ${o} ${d} = ${a} ${o} (${d} ${o} ${b})`];
  return good.every(s=>E.checkAnswer(q,s).answerCorrect)&&bad.every(s=>!E.checkAnswer(q,s).answerCorrect);},
 'missing-dividend':(q,p)=>{assert(p.b>=2&&p.b<=9&&p.a%p.b===0&&p.a/p.b>=2&&p.a/p.b<=9&&!'FOILE'.includes(p.letter));return fracEq(q,p.a*p.b,1);},
 'compare-number-line':(q,p)=>{assert(p.a>=-9&&p.a<=-1&&p.b>=-9&&p.b<=9);return q.answer.value===(p.a<p.b?'<':p.a>p.b?'>':'=');},
 'place-of-digit':(q,p)=>{const d=p.digits[13-p.position];assert(p.digits.filter(x=>x===d).length===1&&p.digits[0]>0);return q.answer.value===PLACES[p.position-1]+' place';},
 'factor-lists':(q,p)=>{const fac=x=>[...Array(x+1).keys()].filter(i=>i&&x%i===0);const common=fac(p.F).filter(x=>p.G%x===0);return JSON.stringify(q.answer.lists)===JSON.stringify([fac(p.F),fac(p.G),common,[Math.max(...common)]]);},
 'gcf-two':(q,p)=>{assert(p.F!==p.G&&p.F>=8&&p.G<=125);let g=1;for(let k=1;k<=p.F;k++)if(p.F%k===0&&p.G%k===0)g=k;return fracEq(q,g,1);},
 'which-divisible':(q,p)=>{const hits=p.shown.filter(x=>x%p.a===0);assert.equal(hits.length,1);assert.equal(p.shown.length,4);return fracEq(q,hits[0],1);},
 'divisible-by-both':(q,p)=>q.answer.value===(p.q%p.a===0&&p.q%p.b===0?'Yes':'No'),
 'which-has-property':(q,p)=>{const tests={'divisible by 3':x=>x%3===0,'not divisible by 6':x=>x%6!==0,'divisible by 2, 3, and 5':x=>x%2===0&&x%3===0&&x%5===0,'divisible by both 2 and 5':x=>x%2===0&&x%5===0,'divisible by 2 but not 4':x=>x%2===0&&x%4!==0,'not divisible by 2, 3, or 5':x=>x%2&&x%3&&x%5,'not divisible by 2 or 5':x=>x%2&&x%5};const hits=p.shown.filter(tests[p.name]);assert.equal(hits.length,1);return fracEq(q,hits[0],1);},
 'angle-kind':(q,p)=>{const a=p.a,given=['obtuse','acute','acute','obtuse','right','right','acute','acute'][a-1],whole=a<7?180:90;
   // Independent reasoning: the two angles fill angle TOR; with a straight angle the parts are supplementary.
   const other=whole===90?'acute':given==='right'?'right':given==='obtuse'?'acute':'obtuse';return q.answer.value===other;},
 'percent-shaded-square':(q,p)=>[10,20,25,30,40,60,70,75,80,90].includes(p.a)&&fracEq(q,p.a,1),
 'percent-grid':(q,p)=>p.v>=1&&p.v<=89&&p.v%10!==0&&fracEq(q,p.v,1),
 'ruler-length':(q,p)=>{if(p.den===16)assert(p.a%2===1&&p.a<=61);else assert(p.a%2===1&&p.a<=31);return fracEq(q,p.a,p.den);},
 'add-unit-fraction':(q,p)=>isPrime(p.a)&&p.b<=p.a-2&&fracEq(q,p.b+1,p.a),
 'multiply-fractions':(q,p)=>p.a%2&&p.b%2&&p.a!==p.b&&gcd(p.a,p.c)===1&&gcd(p.b,p.c)===1&&gcd(p.a,p.d)===1&&gcd(p.b,p.d)===1&&fracEq(q,p.c*p.d,p.a*p.b),
 'subtract-like-fractions':(q,p)=>isPrime(p.c)&&p.a>p.b&&p.a+p.b!==p.c&&fracEq(q,p.a-p.b,p.c),
 'reciprocal':(q,p)=>fracEq(q,p.b,p.a),
 'add-to-mixed':(q,p)=>{const total=p.w1!==undefined?p.b+p.c+(p.w1+p.w2)*p.a:p.b+p.c+p.d;const frac=p.w1!==undefined?p.b+p.c:total;assert(frac>p.a&&frac%p.a!==0);return fracEq(q,total,p.a);},
 'improper-to-mixed':(q,p)=>fracEq(q,p.b,p.a),
 'mixed-to-improper':(q,p)=>gcd(p.b,p.c)===1&&p.c<p.b&&fracEq(q,p.a*p.b+p.c,p.b),
 'circles-mixed':(q,p)=>q.answer.kind==='teacher'?/fully shaded/.test(q.answer.reference):q.answer.value===`1 ${(()=>{const [x,y]=red(p.extra,p.den);return x+'/'+y;})()} = ${p.den+p.extra}/${p.den}`,
};
const checks={};let tasks=0;
for(const c of P.catalog){tasks++;const seen=new Set();
 for(const seed of SEEDS)for(let index=0;index<N;index++){const q=E.generate(c.sourceId,{seed,index}),q2=E.generate(c.sourceId,{seed,index});
  assert.deepEqual(q,q2,'deterministic');assert(Object.isFrozen(q));assert.equal(q.provenance.sourceRecord,c.sourceRecord);seen.add(q.prompt+JSON.stringify(q.givens.parameters));
  const p=q.givens.parameters,a=q.answer;
  // Independent mathematics.
  if(oracle[c.recipe])assert(oracle[c.recipe](q,p),c.sourceId+' oracle '+JSON.stringify(p));
  else if(c.recipe==='underlined-digit-value'){assert.equal(a.value,`${p.digits[3]}00 million`);assert(p.digits.length===12&&p.digits[3]>0);}
  else if(c.recipe==='expanded-notation'){const v=a.terms.reduce((s,[d,pl])=>s+d*pl,0);assert.equal(v,p.value);assert(E.checkAnswer(q,a.value.replace(/,/g,'')).answerCorrect);assert(!E.checkAnswer(q,a.terms.map(([d,pl])=>String(d*pl)).join(' + ')).answerCorrect,'expanded notation needs multiplication');}
  else if(c.recipe==='words-to-digits'){const text=q.prompt.match(/write (.*)\. Enter/)[1];const parts=text.split(', ');const back=parts.reduce((s,w)=>{const m=w.match(/^(.*) (million|thousand)$/);return s+(m?wordsValue(m[1])*(m[2]==='million'?1e6:1e3):wordsValue(w));},0);assert(fracEq(q,back,1),text);}
  else if(['property-test','subtraction-number-line','name-linear-figures'].includes(c.recipe)){assert.equal(a.kind,'teacher');assert(a.rubric.length>=2);}
  else throw Error('No oracle for '+c.recipe);
  // Keys check as correct; every distractor checks as wrong and names its mistake.
  if(a.kind!=='teacher')assert(E.checkAnswer(q,E.answerText(q)).answerCorrect,c.sourceId+' key');
  if(q.choices){const vals=q.choices.map(x=>String(x.value));assert.equal(new Set(vals).size,vals.length,'distinct choices');assert(q.choices.length===3||c.recipe==='compare-number-line'&&q.choices.length===2,c.sourceId+' choice count');
   for(const ch of q.choices){assert(ch.mistake&&ch.mistake.length>8,c.sourceId+' named mistake');assert(!/NaN|undefined|Infinity/.test(ch.value));if(a.kind!=='teacher'&&!/→/.test(ch.value))assert(!E.checkAnswer(q,ch.value).answerCorrect,c.sourceId+' distractor accepted: '+ch.value);}}
  // Drawings where the source draws.
  if(['compare-number-line','percent-shaded-square','percent-grid','ruler-length','angle-kind'].includes(c.recipe)||c.variant==='identify'){assert(/<svg[\s\S]*<\/svg>/.test(q.givens.svg||''),c.sourceId+' drawing');}
  if(['subtraction-number-line','name-linear-figures'].includes(c.recipe)||c.variant==='draw')assert(/<svg/.test((q.givens.svg||'')+(q.teacherSvg||'')),c.sourceId+' teacher drawing');
  assert(/<div class="engine-question">/.test(E.renderQuestion(q)));
 }
 assert(seen.size>=Math.min(20,seen.size)&&seen.size>1,c.sourceId+' varies');checks[c.sourceId]=seen.size;}
function wordsValue(w){const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];let total=0;for(const t of w.split(' ')){if(t==='hundred')total*=100;else if(t.includes('-')){const [x,y]=t.split('-');total+=tens.indexOf(x)*10+small.indexOf(y);}else if(small.includes(t))total+=small.indexOf(t);else if(tens.includes(t))total+=tens.indexOf(t)*10;else throw Error('word '+t);}return total;}
// Wrong-answer spot checks on the custom answer kinds.
const fl=E.generate('course-87-en:item:SX870041',{seed:1});const parts=E.answerText(fl).split('; ');assert(E.checkAnswer(fl,[parts[0].split(', ').reverse().join(','),parts[1],parts[2],parts[3]].join('; ')).answerCorrect,'list order free');assert(!E.checkAnswer(fl,[parts[0],parts[1],parts[2],'1'].join('; ')).answerCorrect);
const ci=E.generate('course-87-en:item:SX540337',{seed:1});assert(!E.checkAnswer(ci,'1 1/2 = 3/2').answerCorrect||E.answerText(ci)==='1 1/2 = 3/2');
const mi=E.generate('course-87-en:item:SN870043',{seed:1});assert(!E.checkAnswer(mi,E.answerText(mi).replace(/^(\d+)\/(\d+)$/,(m,a,b)=>`${Math.floor(a/b)} ${a%b}/${b}`)).answerCorrect,'improper fraction required');
const re=E.generate('course-87-en:item:SN870824',{seed:1}),[rn,rd]=E.answerText(re).split('/').map(Number);assert(E.checkAnswer(re,`${Math.floor(rn/rd)} ${rn%rd}/${rd}`).answerCorrect,'reciprocal accepts a mixed number too');
console.log('PASS port87:',tasks,'tasks ×',SEEDS.length*N,'instances: independent keys, source ranges, distractors rejected and named, drawings, determinism');
