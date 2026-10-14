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
const Fd=x=>{const t=String(x);if(!t.includes('.'))return [Number(t),1];const [w,f]=t.split('.');return [Number(w+f),10**f.length];},mulF=(a,b)=>red(a[0]*b[0],a[1]*b[1]),divF=(a,b)=>red(a[0]*b[1],a[1]*b[0]),addF=(a,b)=>red(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),subF=(a,b)=>red(a[0]*b[1]-b[0]*a[1],a[1]*b[1]);
// Repeating decimal in parentheses notation by tracking remainders (independent of the task code).
const parenRep=(n,d)=>{const w=Math.floor(n/d);let r=n%d;const pos={},ds=[];while(r&&pos[r]===undefined){pos[r]=ds.length;ds.push(Math.floor(10*r/d));r=10*r%d;}return r?`${w}.${ds.slice(0,pos[r]).join('')}(${ds.slice(pos[r]).join('')})`:`${w}.${ds.join('')}`;};
const shoelace=P=>Math.abs(P.reduce((s,[x,y],i)=>{const [u,v]=P[(i+1)%P.length];return s+x*v-u*y;},0))/2,lcm=(a,b)=>a*b/gcd(a,b),vals=q=>q.answer.values.map(v=>Number(v.numerator)/Number(v.denominator));
const factorize=x=>{const f=[];for(let p=2;x>1;)if(x%p===0){f.push(p);x/=p;}else p++;return f;};
const powerForm=f=>[...new Set(f)].map(p=>{const k=f.filter(x=>x===p).length;return k>1?`${p}^${k}`:String(p);}).join(' · ');
// Independent scientific-notation helpers for Batch 6: digit-string shifting, no floating point.
const SUPN={'⁻':'-','⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'},supNum=s=>Number([...s].map(c=>SUPN[c]).join(''));
const shiftDec=(d,e)=>{let [w,f='']=d.split('.');let digits=w+f,pt=w.length+e;while(pt<=0){digits='0'+digits;pt++;}while(pt>digits.length)digits+='0';let W=digits.slice(0,pt).replace(/^0+(?=\d)/,''),F=digits.slice(pt).replace(/0+$/,'');return W+(F?'.'+F:'');};
const toSci=d=>{let [w,f='']=d.split('.');const digits=(w+f).replace(/^0+/,''),lead=(w+f).length-digits.length,e=w.length-lead-1,m=digits.replace(/0+$/,'');return `${m[0]}${m.length>1?'.'+m.slice(1):''} x 10^${e}`;};
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
 // Batch 2
 'word-add-length':(q,p)=>p.a>=210&&p.a<=590&&p.b>=41&&p.b<=95&&p.a%5&&p.b%5&&fracEq(q,p.a+p.b,1),
 'word-add-money-two':(q,p)=>(p.c%100)+(p.e%100)<100&&(p.c%10)+(p.e%10)<10&&fracEq(q,p.c+p.e,100),
 'word-add-money-three':(q,p)=>p.b>=498&&p.b<=999&&p.e>=198&&p.e<=399&&p.c>=75&&p.c<=99&&fracEq(q,p.b+p.e+p.c,100),
 'word-subtract-count':(q,p)=>p.a%1000&&p.b%1000&&p.a>p.b+111&&fracEq(q,p.a-p.b,1),
 'change-due':(q,p)=>p.a%5===0&&p.b<100*p.a&&fracEq(q,100*p.a-p.b,100),
 'word-subtract-small':(q,p)=>p.a%5&&p.b%5&&p.b>=31&&p.b<=99&&fracEq(q,p.a-p.b,1),
 'product-minus-sum':(q,p)=>fracEq(q,p.a*p.b-p.a-p.b,1),
 'pages-left':(q,p)=>p.total-p.b>=90&&p.total-p.b<=150&&fracEq(q,p.total-p.b,1),
 'population-increase':(q,p)=>(p.p2-p.p1)%(p.y2-p.y1)===0&&fracEq(q,p.p2-p.p1,1),
 'birth-year':(q,p)=>p.age>=62&&p.age<=99&&fracEq(q,p.year-p.age,1),
 'years-between':(q,p)=>fracEq(q,p.b-p.a,1),
 'elapsed-time':(q,p)=>p.h1>=8&&p.h1<=10&&[11,12].includes(p.h2)&&p.m2>p.m1&&q.answer.minutes===(p.h2*60+p.m2)-(p.h1*60+p.m1)&&E.checkAnswer(q,`${Math.floor(q.answer.minutes/60)} hours ${q.answer.minutes%60} minutes`).answerCorrect&&!E.checkAnswer(q,`${Math.floor(q.answer.minutes/60)+1} hr ${q.answer.minutes%60} min`).answerCorrect,
 'equal-groups-product':(q,p)=>fracEq(q,p.a*p.b,1),
 'equal-groups-quotient':(q,p)=>{const d=p.b||p.n1;assert(p.total%d===0);return fracEq(q,p.total/d,1);},
 'stickers':(q,p)=>p.c>=10&&p.c<=41&&fracEq(q,100*p.a+10*p.b+p.c,1),
 'complete-equivalent':(q,p)=>{const [x,y]=p.a,[x2,y2]=p.b;assert(p.d%y===0&&p.d%y2===0);const v=q.answer.values;return v[0].numerator===String(x*p.d/y)&&v[1].numerator===String(x2*p.d/y2);},
 'which-not-equal-mixed':(q,p)=>{const val=s=>{const m=s.match(/^(\d+) (\d+)\/(\d+)$/);if(m)return [Number(m[1])*Number(m[3])+Number(m[2]),Number(m[3])];const [a,b]=s.split('/').map(Number);return [a,b];};const target=[p.w*p.b+p.c,p.b];const odd=p.options.filter(o=>{const [a,b]=val(o);return a*target[1]!==target[0]*b;});assert.equal(odd.length,1);return q.answer.value==='abcd'[p.options.indexOf(odd[0])]&&E.checkAnswer(q,odd[0]).answerCorrect;},
 'odd-fraction-out':(q,p)=>{const [b,c]=p.base;const odd=p.list.filter(o=>{const [x,y]=o.split('/').map(Number);return x*c!==y*b;});assert.equal(odd.length,1);return q.answer.value==='abcdef'[p.list.indexOf(odd[0])]&&E.checkAnswer(q,odd[0]).answerCorrect;},
 'multiply-cancel':(q,p)=>fracEq(q,p.a*p.b*p.d,p.c*p.a*p.e),
 'simplify-improper-mixed':(q,p)=>fracEq(q,p.a*p.c+p.b,p.c),
 'equivalent-then-subtract':(q,p)=>{const [a,b]=p.f1.split('/').map(Number);assert(p.den%b===0&&a*p.den/b>p.k);return fracEq(q,a*p.den-p.k*b,b*p.den);},
 'unit-percent':(q,p)=>q.answer.value.numerator===String(red(100*p.p,p.q)[0])&&q.answer.value.denominator===String(red(100*p.p,p.q)[1])&&(Number.isInteger(100*p.p/p.q)||E.checkAnswer(q,(100*p.p/p.q).toFixed(2)+'%').answerCorrect),
 'unit-price':(q,p)=>p.p%p.k===0&&fracEq(q,p.p/p.k,100),
 'closest-weight':(q,p)=>q.answer.value===`${Math.round(p.a+p.b/16)} lb`&&p.b!==8,
 'protractor-read':(q,p)=>{const m=p.ang.match(/^(A|I)O([A-I])$/),ray=p.rays.find(r=>r[0]===m[2])[1];return fracEq(q,m[1]==='A'?ray:180-ray,1);},
 'polygon-name':(q,p)=>q.answer.value==={3:'triangle',4:'quadrilateral',5:'pentagon',6:'hexagon',7:'heptagon',8:'octagon',9:'nonagon',10:'decagon'}[p.k],
 'regular-polygon-pick':(q,p)=>{const i=p.figs.findIndex(([n,reg])=>n===p.k&&reg);assert.equal(p.figs.filter(([n,reg])=>n===p.k&&reg).length,1);return q.answer.value==='abcd'[i];},
 'false-statement':(q,p)=>{const count={triangle:3,quadrilateral:4,pentagon:5,hexagon:6,octagon:8,decagon:10};const isTrue=st=>{if(/circle/.test(st))return false;const m=st.match(/An? (\w+) has (\d+) (sides|angles)\./);return count[m[1]]===Number(m[2]);};const f=p.options.map((o,i)=>isTrue(o)?null:'abcd'[i]).filter(Boolean);assert.equal(f.length,1);return q.answer.value===f[0];},
 'congruent-part':(q,p)=>{const k=p.k;const want=p.angle?p.T1[k]:p.T1[k]+p.T1[(k+1)%3];return q.answer.letters===want&&E.checkAnswer(q,p.angle?'angle '+want:want.split('').reverse().join('')).answerCorrect;},
 'square-side-inches':(q,p)=>p.p!==4&&fracEq(q,12*p.p/4,1),
 'step-perimeter':(q,p)=>{const pts=[[0,0],[0,p.L],[p.T,p.L],[p.T,p.L-p.D],[p.W,p.L-p.D],[p.W,0]];let per=0;for(let i=0;i<pts.length;i++){const [a,b]=pts[i],[c,d]=pts[(i+1)%pts.length];per+=Math.abs(a-c)+Math.abs(b-d);}return fracEq(q,per,1);},
 'square-polygon-sides':(q,p)=>{const per=p.k*p.s;return fracEq(q,p.toSquare?per/4:p.s,1)&&(per%4===0);},
 'quad-perimeter':(q,p)=>p.sides.length===4&&fracEq(q,p.sides.reduce((x,y)=>x+y),1),
 'power-sum':(q,p)=>p.a!==p.b&&fracEq(q,p.a**p.ea+p.b**p.eb,1),
 'power-difference':(q,p)=>p.a**p.b>p.c**p.d&&fracEq(q,p.a**p.b-p.c**p.d,1),
 'fraction-power':(q,p)=>fracEq(q,p.a**p.e,p.b**p.e),
 'square-area-from-perimeter':(q,p)=>p.s>=4&&p.s<=26&&fracEq(q,p.s*p.s,1),
 'rectangle-abcd':(q,p)=>{const opp={AB:'CD',CD:'AB',AD:'BC',BC:'AD'};return q.answer.side===opp[p.s]&&q.answer.number===p.b*p.w&&p.w%2===0&&E.checkAnswer(q,`side ${opp[p.s]}; ${p.b*p.w} mm²`).answerCorrect;},
 'square-root':(q,p)=>p.a>=11&&p.a<=25&&fracEq(q,p.a,1),
 'power-root-mix':(q,p)=>fracEq(q,p.e===undefined?p.a**p.b-p.c:p.a**p.b-p.c+p.e**p.f,1),
 'square-minus-powers':(q,p)=>fracEq(q,p.e**2-p.a**p.b-p.c**p.d-p.g,1),
 'circles-mixed':(q,p)=>q.answer.kind==='teacher'?/fully shaded/.test(q.answer.reference):q.answer.value===`1 ${(()=>{const [x,y]=red(p.extra,p.den);return x+'/'+y;})()} = ${p.den+p.extra}/${p.den}`,
 // Batch 3: Lessons 21–30.
 'prime-yes-no':(q,p)=>{assert(p.a>=2&&p.a<=31);return q.answer.value===(isPrime(p.a)?'Yes':'No');},
 'composite-list':(q,p)=>{assert.equal(new Set(p.list).size,9);const comp=p.list.filter(x=>x>1&&!isPrime(x));assert(comp.length>=4&&comp.length<=5&&p.list.every(x=>x>=1));
   const prime=p.list.find(isPrime);return E.checkAnswer(q,[...comp].reverse().join(', ')).answerCorrect&&!E.checkAnswer(q,[...comp,prime].join(', ')).answerCorrect&&!E.checkAnswer(q,comp.slice(1).join(', ')).answerCorrect;},
 'not-composite':(q,p)=>{const pr=p.shown.filter(isPrime);assert.equal(pr.length,1);assert.equal(p.shown.length,4);return fracEq(q,pr[0],1);},
 'prime-factorization':(q,p)=>{const f=factorize(p.v);assert(p.factors.every(isPrime));return q.answer.number===p.v&&E.checkAnswer(q,powerForm(f)).answerCorrect&&E.checkAnswer(q,[...f].reverse().join(' x ')).answerCorrect&&!E.checkAnswer(q,[f[0]*f[1],...f.slice(2)].join(' × ')).answerCorrect;},
 'factor-and-root':(q,p)=>{const r=Math.round(Math.sqrt(p.n));assert.equal(r*r,p.n);return q.answer.root===r&&E.checkAnswer(q,`${powerForm(factorize(p.n))}; ${r}`).answerCorrect&&!E.checkAnswer(q,`${powerForm(factorize(p.n))}; ${r+1}`).answerCorrect&&!E.checkAnswer(q,`${p.n}; ${r}`).answerCorrect;},
 'fraction-of-price':(q,p)=>{assert(p.paid%p.num===0);return vals(q).join()===[p.paid*p.den/p.num,100*p.num/p.den].join();},
 'goal-shortfall':(q,p)=>{assert(p.raised>=31000&&p.raised<=99000);const goal=p.raised*p.den/p.num;assert(Number.isInteger(goal)&&/<svg/.test(q.teacherSvg||''));return vals(q).join()===[goal,100*(p.den-p.num)/p.den].join();},
 'fraction-not':(q,p)=>{assert(p.tot%p.den===0&&p.num<p.den);return fracEq(q,p.tot-p.tot*p.num/p.den,1);},
 'subtract-mixed-regroup':(q,p)=>{assert(p.b<p.e&&p.e<p.c&&p.a>p.d);return fracEq(q,(p.a*p.c+p.b)-(p.d*p.c+p.e),p.c);},
 'whole-minus-mixed':(q,p)=>{assert(p.a>p.b&&p.c<p.d&&gcd(p.c,p.d)===1);return fracEq(q,p.a*p.d-(p.b*p.d+p.c),p.d);},
 'cancel-chain':(q,p)=>fracEq(q,p.a*p.d*p.c,p.d*p.c*p.e),
 'reduce-product-form':(q,p)=>{assert(gcd(p.N,p.D)>1);return fracEq(q,p.N,p.D);},
 'divide-fractions':(q,p)=>fracEq(q,p.f1[0]*p.f2[1],p.f1[1]*p.f2[0]),
 'mixed-div-product':(q,p)=>fracEq(q,p.d*p.a,p.b*p.b*p.c),
 'mixed-times-quotient':(q,p)=>{assert(p.d>p.b&&p.e>p.a&&p.c%p.e===0);return fracEq(q,p.d*p.c*p.a,p.b*p.e);},
 'mixed-times-mixed':(q,p)=>{assert(p.m>p.c&&p.n>p.f);return fracEq(q,p.m*p.n,p.c*p.f);},
 'half-mixed-div':(q,p)=>fracEq(q,(2*p.a+1)*p.b,2*4),
 'multiples-sum':(q,p)=>{assert(p.nums.includes(10)&&p.nums.includes(100));return fracEq(q,p.k*p.nums[0]+p.o2*p.nums[1]+p.o3*p.nums[2],1);},
 'first-multiples':(q,p)=>{const m=[1,2,3,4,5].map(k=>k*p.a);return E.checkAnswer(q,m.join(',')).answerCorrect&&!E.checkAnswer(q,[...m].reverse().join(', ')).answerCorrect&&!E.checkAnswer(q,[0,...m.slice(0,4)].join(', ')).answerCorrect;},
 'is-multiple':(q,p)=>q.answer.value===(p.d%p.a===0?'Yes':'No'),
 'lcm-two':(q,p)=>{assert(gcd(p.a,p.b)>1&&p.a!==p.b);return fracEq(q,lcm(p.a,p.b),1);},
 'lcm-three':(q,p)=>fracEq(q,lcm(lcm(p.nums[0],p.nums[1]),p.nums[2]),1),
 'unit-cost-equivalent':(q,p)=>{assert((p.a/10)%p.b===0&&p.a>=120&&p.a<=300);return fracEq(q,p.a/p.b,100);},
 'double-both':(q,p)=>{assert(p.a>=100&&p.a<=980&&(p.a-100)%40===0&&p.b===5);return fracEq(q,2*p.a/(2*p.b),1);},
 'divide-by-hundred':(q,p)=>{assert(p.a%200===0&&p.b%100===0&&p.a%p.b===0);return fracEq(q,p.a/p.b,1);},
 'subscription-savings':(q,p)=>{assert(p.a%5===0&&p.a%10);return fracEq(q,12*p.a-p.sub,100);},
 'average-five':(q,p)=>{assert.equal(p.v.length,5);return fracEq(q,p.v.reduce((x,y)=>x+y),5);},
 'laps-average':(q,p)=>{assert(p.s1%60&&p.s1%p.x===0);return vals(q).join()===[p.s1,p.s1/p.x].join()&&q.prompt.includes(`${Math.floor(p.s1/60)} minutes ${p.s1%60} seconds`);},
 'round-two-places':(q,p)=>vals(q).join()===[Math.floor(p.num/1000+.5)*1000,Math.floor(p.num/100+.5)*100].join(),
 'round-place':(q,p)=>fracEq(q,Math.floor(p.num/p.pl+.5)*p.pl,1),
 'round-mixed-whole':(q,p)=>{assert(p.b>=2&&p.b<p.c&&p.c<=10);return fracEq(q,p.a+(2*p.b>=p.c?1:0),1);},
 'round-mixed-half':(q,p)=>{const h=Math.round(2*(p.a+p.b/p.c))/2;assert(2*p.b!==p.c);const txt=Number.isInteger(h)?String(h):`${Math.floor(h)} 1/2`;return q.answer.value===txt&&E.checkAnswer(q,String(h)).answerCorrect;},
 'true-rounding':(q,p)=>{const ok=p.statements.filter(st=>{const m=st.match(/^(\d+) (\d+)\/(\d+) rounds to (\d+)$/);const x=Number(m[1])+Number(m[2])/Number(m[3]);return Math.round(x)===Number(m[4]);});assert.equal(ok.length,1);return q.answer.value==='abcd'[p.statements.indexOf(ok[0])];},
 'estimate-quotient':(q,p)=>{const r=Math.round(p.a/10)*10;assert(p.a%5&&Math.floor(p.c/100)!==p.a);return fracEq(q,Math.round(p.c/r/10)*10,1);},
 'estimate-product':(q,p)=>fracEq(q,Math.round(p.a/10)*10*Math.round(p.b/10)*10,1),
 'estimate-mixed-product':(q,p)=>fracEq(q,Math.round(p.x.w+p.x.b/p.x.c)*Math.round(p.y.w+p.y.b/p.y.c),1),
 'compare-common':(q,p)=>{const [n1,d1]=p.a,[n2,d2]=p.b,sym=n1*d2<n2*d1?'<':n1*d2>n2*d1?'>':'=',K=2*d1*d2,flip={'<':'>','>':'<','=':'<'}[sym];
   return q.answer.symbol===sym&&E.checkAnswer(q,`${n1*K/d1}/${K} ${sym} ${n2*K/d2}/${K}`).answerCorrect&&!E.checkAnswer(q,`${n1*K/d1}/${K} ${flip} ${n2*K/d2}/${K}`).answerCorrect&&!E.checkAnswer(q,`${n1}/${d1} ${sym} ${n2}/${d2}`).answerCorrect===(d1!==d2);},
 'add-reciprocal-pair':(q,p)=>fracEq(q,p.a*p.a+p.b*p.b,p.a*p.b),
 'mixed-expression':(q,p)=>{const F=x=>x[0]/x[1],[a,b,c]=[p.f1,p.f2,p.f3];let v,nn,dd;
   if(p.form==='div-sum'){nn=a[0]*b[1]*c[1];dd=a[1]*(b[0]*c[1]+c[0]*b[1]);}else if(p.form==='minus'){nn=a[0]*b[1]-b[0]*a[1];dd=a[1]*b[1];}else{nn=(a[0]*b[1]+b[0]*a[1])*c[1];dd=a[1]*b[1]*(p.wh*c[1]-c[0]);}
   v=p.form==='div-sum'?F(a)/(F(b)+F(c)):p.form==='minus'?F(a)-F(b):(F(a)+F(b))/(p.wh-F(c));assert(Math.abs(nn/dd-v)<1e-9&&v>0);return fracEq(q,nn,dd);},
 // Batch 4: Lessons 31–40.
 'decimal-words':(q,p)=>{const m=q.answer.value.match(/^(.+) and (.+) (tenth|hundredth|thousandth)s?$/);const place={tenth:10,hundredth:100,thousandth:1000}[m[3]];const v=p.v??(10*p.a1+p.a2)*100,whole=wordsValue(m[1]),fr=wordsValue(m[2]);
   if(p.v!==undefined)assert(p.v>=100112&&p.v<=333999&&p.v%10);return (whole*place+fr)*1000/place===v&&E.checkAnswer(q,q.answer.value.replace(/-/g,' ').toUpperCase()).answerCorrect&&!E.checkAnswer(q,q.answer.value.replace(' and ',' ')).answerCorrect;},
 'decimal-and-mixed':(q,p)=>{assert(p.a%10&&gcd(p.b,100)===1);const v=(100*p.a+p.b)/100;return vals(q).every(x=>Math.abs(x-v)<1e-9)&&E.checkAnswer(q,`${p.a}.${String(p.b).padStart(2,'0')}; ${p.a} ${p.b}/100`).answerCorrect&&!E.checkAnswer(q,`${p.a}.${p.b}; ${p.a} ${p.b}/100`).answerCorrect===(p.b>=10?false:true);},
 'mm-to-cm':(q,p)=>{assert(p.a%10&&p.a>=11&&p.a<=99);return fracEq(q,p.a,10);},
 'metric-compare':(q,p)=>{const k={L:1000,kg:1000,g:1000,cm:10,m:100,km:1000}[p.big],bigQ=Math.round(p.a*10)*k,smallQ=Math.round(p.a*10)*10**p.c;const first=bigQ>smallQ?'>':bigQ<smallQ?'<':'=';const sym=p.first?first:{'>':'<','<':'>','=':'='}[first];return q.answer.value===sym;},
 'metric-how-many':(q,p)=>{const mm={millimeters:1,centimeters:10,meters:1000};return fracEq(q,p.qty*mm[p.have]*10/mm[p.want],10);},
 'decimal-compare':(q,p)=>{const x=100*p.a+10*p.b,y=100*p.a+p.b+2;return q.answer.value===(p.bigFirst?(x>y?'>':'<'):(y>x?'>':'<'));},
 'false-decimal-statement':(q,p)=>{const truth=st=>{const [l,op,r]=st.split(' ');const L=Number(l),Rr=Number(r);return op==='<'?L<Rr:op==='>'?L>Rr:L===Rr;};const bad=p.statements.filter(st=>!truth(st));assert.equal(bad.length,1);return q.answer.value==='abcd'[p.statements.indexOf(bad[0])];},
 'order-decimals':(q,p)=>{const ok=p.options.filter(o=>{const v=o.split(/\s+/).map(Number);return v.every((x,i)=>!i||x>v[i-1]);});assert.equal(ok.length,1);return q.answer.value==='abcd'[p.options.indexOf(ok[0])];},
 'round-thousandth':(q,p)=>fracEq(q,Math.floor((p.a+500)/1000),1000),
 'round-decimal-two':(q,p)=>{const c=p.c,a=Math.floor((p.N+5*10**(3-c))/10**(4-c))/10**c,b=Math.floor((p.N+5*10**(3+c))/10**(4+c))*10**c;return Math.abs(vals(q)[0]-a)<1e-9&&vals(q)[1]===b;},
 'round-decimal-place':(q,p)=>{assert(p.N%10&&p.N>=20001&&p.N<=99999);return fracEq(q,Math.floor((p.N+5*10**(2-p.b))/10**(3-p.b)),10**p.b);},
 'number-line-average':(q,p)=>{assert(p.a%10&&p.a-p.a2>=8&&p.a2>=2);return fracEq(q,20*p.c+p.a+p.a2,20);},
 'segment-bc':(q,p)=>{assert(p.k%100===1);return fracEq(q,7*p.k-4*p.k-p.k,100);},
 'number-line-point':(q,p)=>fracEq(q,10*p.c+p.a,10),
 'decimal-sum':(q,p)=>fracEq(q,100*p.a+10*p.b+p.c+100*p.d+100*p.g+10*p.h,100),
 'decimal-difference':(q,p)=>fracEq(q,p.A-p.C,1000),
 'decimal-square':(q,p)=>{assert(p.a%10);return fracEq(q,p.a*p.a,100);},
 'decimal-divide-whole':(q,p)=>fracEq(q,10*p.a*p.b+p.c*p.a,100*p.a),
 'decimal-divide-decimal':(q,p)=>{const d=10*p.at*p.b+p.c*p.at;assert(d%100);return fracEq(q,d,10*p.at);},
 'ratio-reverse':(q,p)=>{assert(gcd(p.a1,p.a2)===1);return E.checkAnswer(q,`${p.a2}:${p.a1}`).answerCorrect&&E.checkAnswer(q,`${p.a2}/${p.a1}`).answerCorrect&&!E.checkAnswer(q,`${p.a1} to ${p.a2}`).answerCorrect;},
 'ratio-part-fraction':(q,p)=>{const firstDark=p.k===2||p.k===4,askDark=p.k>=3,askedIsFirst=firstDark===askDark;return fracEq(q,askedIsFirst?p.d:p.b,p.b+p.d);},
 'fraction-rest-ratio':(q,p)=>{assert(gcd(p.den,p.num)===1);const r=p.den-p.num;return E.checkAnswer(q,`${r}/${p.den}; ${p.num} to ${r}`).answerCorrect&&E.checkAnswer(q,`${r}/${p.den}; ${p.num}:${r}`).answerCorrect&&!E.checkAnswer(q,`${r}/${p.den}; ${r} to ${p.num}`).answerCorrect;},
 'fans-ratio':(q,p)=>{const e=p.b+p.d,g1=p.flip?p.b:p.d,g2=e-g1,want=p.flip?[g2,g1]:[g1,g2];return E.checkAnswer(q,want.join(' to ')).answerCorrect;},
 'spinner':(q,p)=>{const L=p.layout===1?'BBRRRRYG':'GBRRRRYG';return fracEq(q,[...L].filter(x=>x===p.colour).length,8);},
 'dart-board':(q,p)=>{assert(2*p.shaded!==p.parts&&p.shaded<p.parts);return fracEq(q,p.shaded,p.parts);},
 'right-triangle-area':(q,p)=>{assert(p.h*p.h+p.g*p.g===p.e*p.e);return fracEq(q,p.h*p.g,2);},
 'coordinate-triangle-area':(q,p)=>{assert.equal(new Set(p.t).size,4);return fracEq(q,Math.abs(p.t[0]-p.t[2])*Math.abs(p.t[1]-p.t[3]),2);},
 'diagonal-plot':(q,p)=>{assert(p.c>=p.a-4&&p.c<=p.a-2&&p.a>=20&&p.a<=55);return fracEq(q,p.a*p.c,2);},
 'step-area':(q,p)=>{const {L,T,D,W}=p;assert(T+W<12&&D<L&&W!==T&&T!==L-D);return fracEq(q,shoelace([[0,0],[0,L],[T,L],[T,L-D],[W,L-D],[W,0]]),1);},
 'l-shape-area':(q,p)=>fracEq(q,shoelace([[0,p.c],[p.a+p.b,p.c],[p.a+p.b,0],[p.a,0],[p.a,p.c-p.a],[0,p.c-p.a]]),1),
 'square-triangle-area':(q,p)=>{assert(p.a*p.a+p.b*p.b===p.h*p.h);return fracEq(q,2*shoelace([[0,0],[0,p.a],[p.a,p.a],[p.a+p.b,0]]),2);},
 'tally-votes':(q,p)=>{const s=[...p.counts].sort((x,y)=>y-x),tot=p.counts.reduce((x,y)=>x+y);assert.equal(new Set(p.counts).size,5);const v=vals(q);return v[0]===s[p.i]-s[p.j]&&Math.abs(v[1]-p.counts[p.who]/tot)<1e-12;},
 'histogram-walk':(q,p)=>{const [a,b,c,d,e]=p.vals;assert(c>b&&c<=10&&d>=3&&d<c&&e>=2&&e<d);return fracEq(q,p.vals[p.s],1);},
 'circle-graph':(q,p)=>{assert.equal(p.pcts.reduce((x,y)=>x+y),100);assert(p.vv%10===0&&p.vv>=10000&&p.vv<=50000);return fracEq(q,p.vv*p.pcts[p.k],100);},
 'proportion-solve':(q,p)=>{const F=x=>{if(typeof x==='number')return [x,1];const m=String(x).split('.');return m.length>1?[Number(m.join('')),10**m[1].length]:[Number(x),1];};const v=p.variable,[a,b,c,d]=[p.lhs[0],p.lhs[1],p.rhs[0],p.rhs[1]];let n,dd;const mul=(x,y)=>[x[0]*y[0],x[1]*y[1]],div=(x,y)=>[x[0]*y[1],x[1]*y[0]];
   // a/b = c/d with exactly one letter.
   if(a===v)[n,dd]=div(mul(F(c),F(b)),F(d));else if(b===v)[n,dd]=div(mul(F(a),F(d)),F(c));else if(c===v)[n,dd]=div(mul(F(a),F(d)),F(b));else[n,dd]=div(mul(F(b),F(c)),F(a));return fracEq(q,n,dd);},
 'right-triangle-x':(q,p)=>{assert(p.a>=10&&p.a<=30);return fracEq(q,90-(p.giveBottom?p.a:90-p.a),1);},
 'isosceles-angle':(q,p)=>{assert(p.a%2===0&&p.a>=94&&p.a<=114);const base=(180-p.a)/2;return fracEq(q,p.pos===2?p.a:base,1);},
 'complementary-expression':(q,p)=>{const x=90/(p.k1+p.k2);assert(Number.isInteger(x)&&p.k1*x===p.a1);return fracEq(q,p.k1*x,1);},
 'right-angle-chain':(q,p)=>{const rightInside=180-p.e,mR=180-p.c-rightInside,mL=180-90-mR;assert(mR>0&&rightInside>0);return fracEq(q,180-mL-p.d,1);},
 'parallel-zigzag':(q,p)=>fracEq(q,180-p.b,1),
 'crossing-triangles':(q,p)=>{const w=180-90-p.an2;return vals(q).join()===[w,180-p.an1-w].join();},
 'triangle-line-angles':(q,p)=>{const a=180-90-p.a;return vals(q).join()===[a,180-a,a].join();},
 'crossing-lines-triangle':(q,p)=>{assert(p.a1>=95&&p.a1<=115&&p.a2>=45&&p.a2<=60);return fracEq(q,180-p.a1-p.a2,1);},
 // Batch 5: Lessons 41–50.
 'evaluate-xy':(q,p)=>{const [x,y,w]=[p.x,p.y,p.w].map(Fd);const r=p.form==='decimal-sum'?addF(mulF(x,y),mulF(y,w)):subF(mulF(x,y),mulF(y,w));return fracEq(q,...r);},
 'evaluate-paren':(q,p)=>{const [a,b,c]=[p.a,p.b,p.c].map(Fd);return fracEq(q,...mulF(a,p.form==='minus'?subF(b,c):addF(b,c)));},
 'distribute':(q,p)=>{const d=p.a*p.b,e=p.a*p.c;assert(p.a!==p.b&&p.c!==p.a&&p.c!==p.b);return q.answer.coef===d&&q.answer.constant===e&&E.checkAnswer(q,`${d}x${e<0?'-':'+'}${Math.abs(e)}`).answerCorrect&&E.checkAnswer(q,`${e} + ${d}x`).answerCorrect&&!E.checkAnswer(q,`${d}x${e<0?'+':'-'}${Math.abs(e)}`).answerCorrect;},
 'round-repeating':(q,p)=>{assert([9,11,33,27].includes(p.den)&&(p.den!==27||p.N%3));return fracEq(q,Math.round(p.N*10**p.p/p.den),10**p.p);},
 'divide-repeating':(q,p)=>E.checkAnswer(q,parenRep(p.a,10*p.b)).answerCorrect&&!E.checkAnswer(q,(p.a/(10*p.b)).toFixed(6)).answerCorrect&&!E.checkAnswer(q,parenRep(p.a+1,10*p.b)).answerCorrect,
 'fraction-repeating':(q,p)=>E.checkAnswer(q,parenRep(p.q,p.p)).answerCorrect&&E.checkAnswer(q,parenRep(p.q,p.p).replace(/\((\d+)\)$/,'[$1]')).answerCorrect&&!E.checkAnswer(q,(p.q/p.p).toFixed(3)).answerCorrect,
 'decimal-to-fraction':(q,p)=>fracEq(q,p.num,p.den),
 'decimal-to-mixed-thousandths':(q,p)=>{assert(p.N%10&&p.N%2===0);return fracEq(q,p.N,1000)&&!E.checkAnswer(q,`${p.N/red(p.N,1000)[1]>0?red(p.N,1000)[0]:0}/${red(p.N,1000)[1]}`).answerCorrect;},
 'fraction-to-decimal':(q,p)=>{let d=red(p.a,p.b)[1];while(d%2===0)d/=2;while(d%5===0)d/=5;assert.equal(d,1);return fracEq(q,p.a,p.b);},
 'chairs-rows':(q,p)=>{assert(p.b===p.a*p.bb+p.aa&&p.b<=99&&p.aa>=2&&p.aa<=p.a-2);return vals(q).join()===[p.a-p.aa,p.aa].join();},
 'capsules':(q,p)=>{assert(p.a%100&&p.b>=20&&p.b<=50);return fracEq(q,Math.round(p.a/p.b),100);},
 'divide-by-decimal':(q,p)=>{if(p.num===undefined){assert(p.b%10);return fracEq(q,Math.round(100*p.a/p.b),1);}return fracEq(q,...divF(Fd(p.num),Fd(p.divisor)));},
 'solve-decimal-coefficient':(q,p)=>{assert(p.a*p.c<1000&&(p.a*p.c)%10);return fracEq(q,p.c,100);},
 'yogurt-saving':(q,p)=>fracEq(q,p.a*p.b-(p.a-p.d)*p.b,100*p.b),
 'cost-each':(q,p)=>{assert(p.b!==20);return fracEq(q,p.k*p.b,100*p.b);},
 'stationery-each':(q,p)=>fracEq(q,p.a*(10*p.b+p.c),100*p.a),
 'round-trip-speed':(q,p)=>fracEq(q,2*p.a*p.b,p.a),
 'trail-speed':(q,p)=>fracEq(q,2*(p.b*p.wh+p.a),p.b),
 'tip':(q,p)=>{assert(p.a%10);return fracEq(q,15*p.a,100);},
 'tax-total':(q,p)=>{const v=vals(q);return Math.abs(v[0]-p.a*p.b/100)<1e-9&&Math.abs(v[1]-p.a*(100+p.b)/100)<1e-9;},
 'powers-of-ten-quotient':(q,p)=>fracEq(q,10**(p.a-p.b),1),
 'missing-exponent':(q,p)=>fracEq(q,p.a+p.b,1),
 'number-names-standard':(q,p)=>fracEq(q,p.a*10**[4,7,10][p.k-1],1),
 'fdp-table':(q,p)=>{const P=x=>Fd(x.replace('%','')),Q=x=>x.includes('/')?x.split('/').map(Number):Fd(x);let want;
   if(p.rows.length===1){const d=Fd(p.rows[0][1]);want=[d,mulF(d,[100,1])];}
   else if(p.rows[0][2]){const r1=divF(P(p.rows[0][2]),[100,1]),f2=Q(p.rows[1][0]);want=[r1,r1,f2,mulF(f2,[100,1])];}
   else{const f1=Q(p.rows[0][0]),d2=Fd(p.rows[1][1]);want=[f1,mulF(f1,[100,1]),d2,mulF(d2,[100,1])];}
   return vals(q).every((v,i)=>Math.abs(v-want[i][0]/want[i][1])<1e-12);},
 'add-measures':(q,p)=>{let base,units;if(q.answer.parts[0][0]==='hr'){base=(p.a+p.d)*3600+(p.b+p.e)*60+p.c+p.f;units=[['hr',3600],['min',60],['sec',1]];}else{base=p.b!==undefined&&p.a===undefined?p.b+p.c*36+p.d*12+p.e:(p.a+p.c)*36+(p.b+p.d)*12+p.e;units=[['yd',36],['ft',12],['in.',1]];}
   let r=base;const want=units.map(([u,k])=>{const v=Math.floor(r/k);r-=v*k;return v;});return q.answer.parts.every(([u,v],i)=>v===want[i]&&u===units[i][0]);},
 'yards-to-feet':(q,p)=>{assert(p.yd%30===0&&p.yd%100&&p.yd>=1020&&p.yd<=2970);return fracEq(q,3*p.yd,1);},
 'wage-per-hour':(q,p)=>{assert.equal(p.d*p.h,40);return fracEq(q,p.p,p.d*p.h);},
 'tons-pounds':(q,p)=>typeof p.q==='string'?fracEq(q,...mulF(Fd(p.q),[2000,1])):fracEq(q,p.q,2000),
 // Batch 6: Lessons 51–60.
 'sci-two-way':(q,p)=>{const [pa,pb]=q.prompt.match(/\(a\) Write (.*?) in scientific notation\. \(b\) Write (.*?) in standard form\./).slice(1);let A;
   const m=pa.match(/^([a-z-]+(?: [a-z-]+)*?) (million|billion|trillion)$/);if(m){const n1=wordsValue(m[1]);assert(n1>=14&&n1<=44&&n1%10);A=String(n1)+'0'.repeat({million:6,billion:9,trillion:12}[m[2]]);}
   else{const s=pa.match(/^([a-z]+) (ten-thousandths?|hundred-thousandths?)$/);if(s){const n1=wordsValue(s[1]);const k=/^ten/.test(s[2])?4:5;A='0.'+'0'.repeat(k-1)+n1;}else A=pa;}
   const b=pb.match(/^(\d)\.(\d+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/);const e=supNum(b[3]);return E.checkAnswer(q,`${toSci(A)}; ${shiftDec(b[1]+'.'+b[2],e)}`).answerCorrect&&!E.checkAnswer(q,`${toSci(A)}; ${shiftDec(b[1]+'.'+b[2],e+1)}`).answerCorrect;},
 'to-sci':(q,p)=>{const num=q.prompt.match(/(\d[\d,]*(?:\.\d+)?)/)[1].replace(/,/g,'');return E.checkAnswer(q,toSci(num)).answerCorrect&&!E.checkAnswer(q,toSci(num).replace(/\^(-?\d+)$/,(m,e)=>'^'+(Number(e)+1))).answerCorrect;},
 'order-ops':(q,p)=>{const v={plain:()=>p.a+p.a*p.a-p.a/p.a,square:()=>(p.a*p.b)**2-p.a*p.b**2,variables:()=>p.b+(p.b**2-p.b*p.c)-p.c,'divide-multiply':()=>p.a*p.a/p.a*p.a+p.b-p.c}[p.form]();if(p.form==='variables')assert(p.b>=10&&p.b<=12&&p.c>=2&&p.c<=9);return fracEq(q,v,1);},
 'seed-cost':(q,p)=>{assert(p.a>=15&&p.a<=30&&p.b>p.a);return fracEq(q,p.c*p.b,p.a)&&Number.isInteger(p.c*p.b*100/p.a);},
 'taffy':(q,p)=>{assert([10,20,30].includes(p.a)&&p.b2>=4&&p.b2<=9);return fracEq(q,p.b2*60*p.c,2*p.a);},
 'nut-price':(q,p)=>{assert(p.z>=199&&p.z<=299&&p.c>2*p.a&&p.c<=15);const [x,y]=vals(q);return Math.abs(x-p.z/100)<1e-12&&Math.abs(y-p.z*p.c/100)<1e-9;},
 'beanstalk':(q,p)=>{assert(p.b%p.a===0);const inches=p.b/p.a*7*p.c;return q.answer.parts[0][1]*12+q.answer.parts[1][1]===inches&&q.answer.parts[1][1]<12;},
 'ratio-find':(q,p)=>{const m=q.prompt.match(/ratio of (.+?) to (.+?) (?:was|in a certain company is) (\d+) to (\d+)\. If there (?:were|are) (\d+) (.+?)(?: in the company)?, how many/);const [,x,y,ra,rb,f,z]=m;if(p.variant==='people')assert(gcd(Number(ra),Number(rb))===1&&ra!==rb);const want=z===x?Number(f)/Number(ra)*Number(rb):Number(f)/Number(rb)*Number(ra);assert(Number.isInteger(want));return fracEq(q,want,1);},
 'recipe-ratio':(q,p)=>fracEq(q,p.b*p.a2,p.a),
 'ratio-chain':(q,p)=>{assert(q.prompt.includes(`there were ${p.a*p.m} lions`));const tigers=p.a*p.m/p.a*p.b,bears=tigers/p.m*p.c;return fracEq(q,bears,1);},
 'combined-average':(q,p)=>{assert(p.n1!==p.n2&&p.a!==p.b);return fracEq(q,Math.round(100*(p.a*p.n1+p.b*p.n2)/(p.n1+p.n2)),100);},
 'race-time':(q,p)=>{const Z=3*p.av-p.A-p.A2;assert(p.A<Z&&Z<p.A2);return fracEq(q,Z,10);},
 'wage-average':(q,p)=>fracEq(q,10*(p.a*p.b+p.a2*p.c),100*(p.b+p.c))&&Number.isInteger(10*(p.a*p.b+p.a2*p.c)/(p.b+p.c)),
 'subtract-measures':(q,p)=>{const P=q.answer.parts;let tot,u;if(P[0][0]==='hr'){tot=p.a*3600+p.b*60-(p.d*3600+p.e*60+p.f);u=[3600,60,1];}else if(p.a===undefined){tot=p.c*36+p.d*12+p.e-p.b;u=[36,12,1];}else{tot=p.a*36+p.b*12-(p.c*36+p.d*12+p.e);u=[36,12,1];}
   assert(tot>0);return P.reduce((s,[,v],i)=>s+v*u[i],0)===tot&&P[1][1]*u[1]<u[0]&&P[2][1]<u[1];},
 'negative-exponent':(q,p)=>fracEq(q,1,p.a**p.p),
 'ten-negative-power':(q,p)=>{assert(p.k>=2&&p.k<=8);return E.checkAnswer(q,`1/${10**p.k}; 0.${'0'.repeat(p.k-1)}1`).answerCorrect&&!E.checkAnswer(q,`1/${10**p.k}; 0.${'0'.repeat(p.k)}1`).answerCorrect;},
 'symmetric-vertex':(q,p)=>q.answer.x===-p.a&&q.answer.y===p.b&&E.checkAnswer(q,`(${-p.a},${p.b})`).answerCorrect&&!E.checkAnswer(q,`(${p.a},${-p.b})`).answerCorrect,
 'polygon-symmetry':(q,p)=>(q.givens.svg.match(/points="([^"]*)"/)[1].trim().split(/\s+/).length===p.k)&&fracEq(q,p.k,1),
 'function-table':(q,p)=>{const miss=p.mult?2:1,rule=x=>p.mult?x*p.e:x+p.e;assert(p.ins.slice(1).every((x,i)=>x>p.ins[i]));return fracEq(q,rule(p.ins[miss]),1)&&p.ins.every((x,i)=>i===miss||q.givens.svg.includes(`>${rule(x)}<`));},
 'number-machine':(q,p)=>{assert(p.a%p.e&&p.b%p.e===0);return fracEq(q,p.a,p.e)&&q.givens.svg.includes(`${p.b} in, ${p.b/p.e} out`);},
 'integer-line-add':(q,p)=>{const z=p.a+p.b;assert(Math.sign(p.a)===-Math.sign(p.b));
   if(q.answer.kind==='teacher'){assert(q.answer.reference.endsWith(`= ${String(z).replace('-','−')}.`));return /<svg/.test(q.teacherSvg||'');}
   assert(Math.abs(z)<7&&z!==0);const X=v=>(30+(v+6)*380/12).toFixed(1),groups=q.givens.svg.split('<g transform').slice(1),ok=g=>{const ar=[...g.matchAll(/<line x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)" y2="[\d.]+" stroke="[^"]*" stroke-width="2" marker-end/g)].map(m=>[m[1],m[2]]),dot=(g.match(/<circle cx="([\d.]+)"/)||[])[1];return ar.length===2&&ar[0][0]===X(0)&&ar[0][1]===X(p.a)&&ar[1][0]===X(p.a)&&ar[1][1]===X(z)&&dot===X(z);};
   assert.equal(groups.length,4);return groups.filter(ok).length===1&&ok(groups['abcd'.indexOf(q.answer.value)]);},
 'fraction-of-group':(q,p)=>p.den?(assert(p.e%p.den===0),fracEq(q,p.e,p.den)):fracEq(q,p.a*p.c,p.b*p.d),
 'percent-of':(q,p)=>{assert(Number.isInteger(p.a*p.b/100));return fracEq(q,p.a*p.b,100);},
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
  else if(['property-test','subtraction-number-line','name-linear-figures','draw-angle','congruent-pairs'].includes(c.recipe)){assert.equal(a.kind,'teacher');assert(a.rubric.length>=2);}
  else throw Error('No oracle for '+c.recipe);
  // Keys check as correct; every distractor checks as wrong and names its mistake.
  if(a.kind!=='teacher')assert(E.checkAnswer(q,E.answerText(q)).answerCorrect,c.sourceId+' key');
  if(q.choices){const vals=q.choices.map(x=>String(x.value));assert.equal(new Set(vals).size,vals.length,'distinct choices');assert(q.choices.length===3||q.choices.length===2&&(['compare-number-line','metric-compare','decimal-compare'].includes(c.recipe)||c.recipe==='fans-ratio'&&E.answerText(q)==='1 to 1'||['estimate-mixed-product','mixed-expression'].includes(c.recipe)&&E.answerText(q)==='1'),c.sourceId+' choice count');
   for(const ch of q.choices){assert(ch.mistake&&ch.mistake.length>8,c.sourceId+' named mistake');assert(!/NaN|undefined|Infinity/.test(ch.value));if(a.kind!=='teacher'&&!/→/.test(ch.value))assert(!E.checkAnswer(q,ch.value).answerCorrect,c.sourceId+' distractor accepted: '+ch.value);}}
  // Drawings where the source draws.
  if(['fdp-table','add-measures','number-line-average','segment-bc','number-line-point','spinner','dart-board','right-triangle-area','diagonal-plot','step-area','l-shape-area','square-triangle-area','tally-votes','histogram-walk','circle-graph','right-triangle-x','isosceles-angle','complementary-expression','right-angle-chain','parallel-zigzag','crossing-triangles','triangle-line-angles','crossing-lines-triangle','compare-number-line','percent-shaded-square','percent-grid','ruler-length','angle-kind','protractor-read','regular-polygon-pick','step-perimeter','quad-perimeter','rectangle-abcd','function-table','number-machine','polygon-symmetry','subtract-measures'].includes(c.recipe)||c.variant==='identify'||c.variant==='choose'){assert(/<svg[\s\S]*<\/svg>/.test(q.givens.svg||''),c.sourceId+' drawing');}
  if(['subtraction-number-line','name-linear-figures','draw-angle','congruent-pairs','integer-line-add'].includes(c.recipe)||c.variant==='draw')assert(/<svg/.test((q.givens.svg||'')+(q.teacherSvg||'')),c.sourceId+' teacher drawing');
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
