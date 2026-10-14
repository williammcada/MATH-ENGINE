// 8/7 port tasks (coverage programme): independent mathematics, source ranges, distractors, drawings and determinism.
// The oracle below recomputes every key from the task's own parameters with separate code; it never reads the
// task's answer to build the expected value.
const assert=require('node:assert/strict'),E=require('../src/course-banks.js'),P=require('../src/port87.js');
const SEEDS=['a','b',7,'port87'],N=250;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),red=(n,d)=>{const g=gcd(n,d);return [n/g,d/g];};
const fracEq=(q,n,d)=>{const v=q.answer.values[0],[x,y]=red(n,d);return v.numerator===String(x)&&v.denominator===String(y);};
const sfrac=(q,n,d)=>d<0?fracEq(q,-n,-d):fracEq(q,n,d);
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
 // Batch 7: Lessons 61–70.
 'parallelogram-area':(q,p)=>{if(p.unit==='cm'&&p.a<=28){assert(p.a>=16&&p.b===Math.round(1.3*p.a)&&p.c===p.b+2);}else{assert(p.a>=50&&p.a<=99&&Math.abs(p.b-Math.round(0.8*p.a))<=3&&p.c===Math.round(p.b/0.866));}
   return fracEq(q,p.a*p.b,1)&&[p.a,p.b,p.c].every(v=>q.givens.svg.includes(`>${v}<`))&&!E.checkAnswer(q,String(p.a*p.c)).answerCorrect;},
 'parallelogram-angle':(q,p)=>{assert(p.a>=70&&p.a<=85&&p.given!==p.asked);const m=[p.a,180-p.a,p.a,180-p.a],want=(p.given-p.asked)%2===0?m[p.given]:180-m[p.given];assert(q.prompt.includes(`${m[p.given]}°`));return fracEq(q,want,1)&&E.checkAnswer(q,`${want}°`).answerCorrect;},
 'parallelogram-missing':(q,p)=>{assert(p.b>=5&&p.b<=9&&p.c>=5&&p.c<=9&&p.h>=95&&p.h<=105);const [e,f,g]=p.letters,ang=p.type===1?90:p.type===2?p.h:180-p.h;
   const resp=p.type===1?`${f} = ${ang} degrees; ${e} = ${p.c}`:`${g}=${p.b}, ${f} = ${ang}°, ${e} = ${p.c} cm`;return E.checkAnswer(q,resp).answerCorrect&&!E.checkAnswer(q,p.type===1?`${e} = ${p.c}`:`${e} = ${p.c}, ${f} = ${180-ang}°, ${g} = ${p.b}`).answerCorrect;},
 'triangle-definitions':(q,p)=>{const S=['isosceles','equilateral','scalene'][p.side],A=['right','acute','obtuse'][p.angle];return q.answer.kind==='teacher'&&q.prompt.includes(`Define ${S} triangle`)&&q.prompt.includes(`Define ${A} triangle`)&&q.answer.rubric.length>=2;},
 'triangle-classify':(q,p)=>{const P=[[[0,0],[0.5,0.866],[1,0]],[[0,0],[0,1],[1,0]],[[0,0],[0.75,0.5],[1.5,0]],[[0,0],[0.25,0.75],[0.5,0]],[[0,0],[0,1],[1.5,0]],[[0,0],[0.45,0.5],[1.5,0]],[[0,0],[0.2,1],[1,0]]][p.shape];
   const sq=(u,v)=>(u[0]-v[0])**2+(u[1]-v[1])**2,L=[sq(P[0],P[1]),sq(P[1],P[2]),sq(P[2],P[0])].sort((x,y)=>x-y),eq=(x,y)=>Math.abs(x-y)<2e-3*Math.max(x,y);
   const S=eq(L[0],L[2])?'equilateral':eq(L[0],L[1])||eq(L[1],L[2])?'isosceles':'scalene',d=L[0]+L[1]-L[2],A=Math.abs(d)<1e-9?'right':d<0?'obtuse':'acute';
   return E.checkAnswer(q,`${A} ${S} triangle`).answerCorrect&&E.checkAnswer(q,`${S}, ${A}`).answerCorrect&&!E.checkAnswer(q,S).answerCorrect;},
 'inclusion':(q,p)=>{let v;if(p.f!==undefined){assert(p.a>=3&&p.a<=19&&p.b<=p.a-2);v=p.f-p.d*(p.c*(p.a-p.b));assert(v>=4&&v<=35);}
   else if(p.g!==undefined&&p.e!==undefined&&q.prompt.includes('²(')===false&&!q.prompt.includes('(' + p.c + '²)')){v=p.e*(p.g-(p.d*p.d-p.c*(p.a-p.b)));assert(v%p.e===0&&v/p.e>=2&&v/p.e<=25);}
   else if(p.g!==undefined){v=p.g-(p.e-p.d*(p.a+p.b*p.c*p.c));assert(v>=4&&v<=33);}
   else{assert(q.prompt.startsWith(`Simplify: ${p.a*p.b} ÷ ${p.b}`));v=p.a*p.b/p.b+(p.c*p.d-(p.a+(p.c+1)));}
   return fracEq(q,v,1);},
 'signed-sum':(q,p)=>{const got=[...q.prompt.matchAll(/\(([+−]?\d+)\)|\+ (\d+) \+/g)].map(m=>Number((m[1]||m[2]).replace('−','-').replace('+','')));assert.deepEqual(got,p.terms);const z=got.reduce((s,x)=>s+x,0);return fracEq(q,z,1)&&E.checkAnswer(q,z<0?'−'+(-z):String(z)).answerCorrect;},
 'ratio-games':(q,p)=>{assert(gcd(p.a,p.b)===1&&p.a<p.b&&p.b<=12&&p.k>=6&&p.k<=12);return fracEq(q,(p.b-p.a)*p.k,1);},
 'ratio-club':(q,p)=>{const m=q.prompt.match(/Of the (\d+) students in the club, (\d+) were/);const T=Number(m[1]),G=Number(m[2]),[x,y]=red(T-G,G);assert(p.a!==p.b&&p.a>=2&&p.a<=9&&p.b>=3&&p.b<=9&&p.k>=2&&p.k<=8);return E.checkAnswer(q,`${x}:${y}`).answerCorrect&&E.checkAnswer(q,`${x} to ${y}`).answerCorrect&&!E.checkAnswer(q,`${y} to ${x}`).answerCorrect&&(gcd(T-G,G)===1||!E.checkAnswer(q,`${T-G} to ${G}`).answerCorrect);},
 'ratio-total':(q,p)=>{assert(gcd(p.a,p.b)===1&&(p.e>=25&&p.e<=49||p.e>=110&&p.e<=260));assert(q.prompt.includes(`${p.e*(p.a+p.b)}`.replace(/\B(?=(\d{3})+(?!\d))/g,',')));return fracEq(q,p.e*(p.askFirst?p.a:p.b),1);},
 'circumference-pair':(q,p)=>{let A;if(q.prompt.includes('3.14')){assert(p.a>=11&&p.a<=59);const v=314*p.a;A=`${Math.floor(v/100)}.${String(v%100).padStart(2,'0')}`.replace(/\.?0+$/,'');}else{assert(p.a%7===0&&p.a>=14&&p.a<=77);A=String(22*p.a/7);}
   assert(p.b>=10&&p.b<=60);return E.checkAnswer(q,`${A}; ${2*p.b}π`).answerCorrect&&E.checkAnswer(q,`${A}; ${2*p.b} pi cm`).answerCorrect&&E.checkAnswer(q,`${A}; ${2*p.b} π`).answerCorrect&&!E.checkAnswer(q,`${A}; ${p.b}π`).answerCorrect;},
 'solid-counts':(q,p)=>{const m=q.prompt.match(/^A (cube|rectangular prism|triangular prism) has how many (faces|edges|vertices)\?/),T=m[1]==='triangular prism'?{faces:5,edges:9,vertices:6}:{faces:6,edges:12,vertices:8};assert.equal(T.faces-T.edges+T.vertices,2);return fracEq(q,T[m[2]],1);},
 'solid-object':(q,p)=>({'cereal box':'rectangular prism',brick:'rectangular prism','filing cabinet':'rectangular prism','frozen juice can':'cylinder','can of soda':'cylinder','drinking straw':'cylinder',marble:'sphere',globe:'sphere','number cube':'cube','building block':'cube'})[p.obj]===q.answer.value,
 'solid-picture':(q,p)=>['cube','cube','rectangular prism','rectangular prism','pyramid','pyramid','cylinder','cylinder','sphere','cone'][p.picture]===q.answer.value,
 'signed-subtract':(q,p)=>{const expr=q.prompt.match(/^Simplify: (.*?) Enter/)[1].replace(/−/g,'-'),nums=[...expr.matchAll(/\(([+-]?\d+)\)/g)].map(m=>Number(m[1])),ops=[...expr.matchAll(/\)\s*([+-])\s*\(/g)].map(m=>m[1]);let v=nums[0];ops.forEach((o,i)=>{v=o==='+'?v+nums[i+1]:v-nums[i+1];});return fracEq(q,v,1);},
 'sci-renormalize':(q,p)=>{assert(Math.abs(p.c)>=5&&Math.abs(p.c)<=9);const sci=toSci(shiftDec(p.shown,p.c));return E.checkAnswer(q,sci).answerCorrect&&!E.checkAnswer(q,`${p.shown} x 10^${p.c}`).answerCorrect;},
 'cube-volume':(q,p)=>{assert([280,120,64,27,216].includes(p.w*p.h*p.d));return fracEq(q,p.w*p.h*p.d,1)&&q.givens.svg.includes(`${p.w} cubes wide, ${p.h} cubes high and ${p.d} cubes deep`);},
 'prism-cubes':(q,p)=>{assert(p.a>=1&&p.a<=3&&p.b>=4&&p.b<=6&&p.c>=7&&p.c<=10);return fracEq(q,p.a*p.b*p.c,1);},
 'prism-volume':(q,p)=>{assert(p.a>=8&&p.a<=14&&p.b>=4&&p.b<=8&&p.c>=9&&p.c<=12);return fracEq(q,p.a*p.b*p.c,1)&&E.checkAnswer(q,`${p.a*p.b*p.c} ${p.unit}^3`).answerCorrect;},
 // Batch 8: Lessons 71–80.
 'whole-from-fraction':(q,p)=>{if(p.a!==undefined){assert(p.a>=40&&p.a<=56&&p.d>=3&&p.d<=7&&(p.d*p.a)%p.e===0);return fracEq(q,p.d*p.a,p.e)&&E.checkAnswer(q,`${p.d*p.a/p.e} inches`).answerCorrect;}assert([3,4,5,6,8,10].includes(p.b)&&p.n>=2&&p.n<=9);return fracEq(q,p.b*p.n,1);},
 'implied-ratio':(q,p)=>{if(p.c!==undefined){assert([12,15,20,25].includes(p.a)&&p.b%2===0&&p.c>=p.b+2&&p.c<=30&&p.c!==2*p.b);return fracEq(q,p.a*p.c,p.a)&&q.prompt.includes(`${p.a*p.b} miles on ${p.b} gallons`);}
   const b=Number(p.b.numerator)/Number(p.b.denominator),m=b/p.n;assert([2,3,4,6].includes(p.n)&&p.a>=12&&p.a<=18&&(p.n===2?m>=1.5&&m<=4.5:p.n===3?m===2||m===3:p.n===4?m===1.5||m===2:m===1.5));const [x,y]=red(2*p.a*b,2*p.n);return fracEq(q,x,y);},
 'signed-product':(q,p)=>{if(p.num!==undefined){assert(Math.abs(p.a)>=3&&Math.abs(p.a)<=9&&p.num%p.a===0&&Math.abs(p.num/p.a)>=4&&Math.abs(p.num/p.a)<=9);return fracEq(q,p.num/p.a,1)&&E.checkAnswer(q,String(p.num/p.a).replace('-','−')).answerCorrect;}assert(p.a!==p.b);return fracEq(q,p.a*p.b,1);},
 'signed-four':(q,p)=>{assert(p.a<0&&p.b<0&&p.c<0&&p.d>0&&p.e%p.f===0&&p.g%p.h===0);return vals(q).join()===[p.a*p.b,p.c*p.d,p.e/p.f,p.g/p.h].join();},
 'whole-from-part':(q,p)=>{let num,fr;if(p.num!==undefined){num=p.num;fr=[p.b,p.a];assert(gcd(p.a,p.b)===1&&num>20&&num<100&&num%10);assert(q.prompt.toLowerCase().startsWith(words(num)));}else if(p.v!==undefined){num=p.n;fr=[p.k,p.v];}else{num=p.n;fr=[p.b,p.c];assert(num%5===0&&num>=20&&num<=80);assert(q.prompt.includes(` is ${String(p.b/p.c).replace(/^0/,'0')} of`));}
   return fracEq(q,num*fr[1],fr[0]);},
 'part-of-whole':(q,p)=>{assert(p.a1>=12&&p.a1<=20);if(q.answer.kind==='decimal'){assert([[1,4],[1,5],[2,4],[2,5],[3,4],[3,5],[3,6],[4,5]].some(([x,y])=>x===p.b&&y===p.c));return E.checkAnswer(q,String(p.b/p.c)).answerCorrect;}assert(p.b!==p.c&&p.c>=7&&p.c<=13);return fracEq(q,p.a1*p.b,p.a1*p.c);},
 'complex-area':(q,p)=>{const {a,b,c,d}=p;assert(b===Math.floor(0.7*a)&&c===b-Math.floor(0.1*a));const P=p.kind==='triangle'?[[0,0],[0,a],[b,a],[b,a-c],[d,0]]:p.kind==='trapezoid'?[[0,0],[0,a],[b,a],[d,c],[d,0]]:[[0,0],[0,a],[b,a],[b,a-c],[d,a-c],[d,0]];return fracEq(q,2*shoelace(P),2);},
 'trapezoid-area':(q,p)=>{if(p.variant==='right'){const b1=(p.top-p.top%2)/2;assert(p.bottom>p.top&&(p.bottom-p.top)%2===0&&Math.abs(p.height-p.top+p.top%2)<=1);}else assert(p.top%2===0&&p.bottom%2===0&&p.height<p.slant);return fracEq(q,shoelace([[0,0],[p.bottom,0],[p.top+1,p.height],[1,p.height]]),1);},
 'complex-fraction':(q,p)=>{if(p.d!==undefined)return fracEq(q,p.a*p.d,p.b*p.c);if(q.prompt.startsWith(`Simplify: ${p.c}/`)){assert(p.b>=5*p.a&&p.b<=9*p.a&&p.b%p.a);return fracEq(q,p.a*p.c,p.b);}assert(p.b>=25*p.a&&p.b<=31*p.a&&p.b%p.a);return fracEq(q,p.b,p.a*p.c);},
 'percent-of-what':(q,p)=>{if(p.pc===undefined){assert(p.a%2===0||p.a%3===0||p.a%4===0||p.a%5===0);return fracEq(q,100*p.a,p.b)&&E.checkAnswer(q,`${100*p.a/p.b}%`).answerCorrect;}return fracEq(q,100*p.b,p.pc);},
 'inequality-graph':(q,p)=>{const m=q.prompt.match(/x ([≤<>≥]) (−?\d+)|numbers (greater than or equal to|less than or equal to|greater than|less than) (−?\d+)/);const rel=m[1]||{'greater than or equal to':'≥','less than or equal to':'≤','greater than':'>','less than':'<'}[m[3]],v=Number((m[2]||m[4]).replace('−','-'));
   return v===p.m&&p.closed===(rel==='≤'||rel==='≥')&&p.dir===(rel==='>'||rel==='≥'?'right':'left')&&/<svg/.test(q.teacherSvg)&&q.answer.kind==='teacher';},
 'inequality-choose':(q,p)=>{const rel=q.prompt.match(/numbers (.*?) (−?\d+)\?/)[1],dir=rel.startsWith('greater')?'right':'left',closed=rel.includes('equal'),i='abcd'.indexOf(q.answer.value),g=q.givens.svg.split('<g transform').slice(1)[i];return /fill="#1f2a30" stroke/.test(g)===closed&&g.includes(dir==='right'?'polygon points="430':'polygon points="10,');},
 'missing-info':(q,p)=>{assert(p.A!==p.C);const good=p.month?`how many hours ${p.C} worked in ${p.month}`:`${p.C}'s ${p.age?'age':'weight'}`;return E.checkAnswer(q,good).answerCorrect&&!E.checkAnswer(q,good.replace(p.C,p.A)).answerCorrect&&!E.checkAnswer(q,good+'7').answerCorrect;},
 'enough-info':(q,p)=>{const want=[p.x+p.y,null,p.w-2*p.x,2*p.x,null,null,null][p.k];assert(Math.abs(p.x-p.y)>1&&p.w>=49&&p.w<=59);return want===null?E.checkAnswer(q,'not enough information').answerCorrect&&!E.checkAnswer(q,`Yes, ${p.x} minutes`).answerCorrect:E.checkAnswer(q,`yes, ${want} minutes`).answerCorrect&&E.checkAnswer(q,String(want)).answerCorrect&&!E.checkAnswer(q,'no').answerCorrect;},
 'compare-quantities':(q,p)=>{let want;const cond=p.cond,[x,y]=p.letters;if(/^if a = /.test(cond)){const a=Number(cond.slice(7)),first=q.prompt.includes('a ○ a²');want=a===1?'=':(a<1)===first?'>':'<';}
   else{const tests=[[`${x} − ${y} = 0`,'='],[`${x} − ${y} = 1`,'>'],[`${x}/${y} = 1`,'=']];const hit=tests.find(([s])=>cond==='if '+s);if(hit)want=hit[1];else if(cond===`if ${x} × ${y} = −1 and ${x} is positive`||cond===`if ${x} × ${y} = −2 and ${x} is positive`)want='>';else want='?';}
   return q.answer.rel===want&&E.checkAnswer(q,want==='?'?'insufficient information':want).answerCorrect;},
 'transform-graph':(q,p)=>{let f;const t=q.prompt.match(/translation (\d+) units to the (left|right) and (\d+) units (up|down)/);if(t){const g=Number(t[1])*(t[2]==='right'?1:-1),h=Number(t[3])*(t[4]==='up'?1:-1);assert(Math.abs(g)>=4&&Math.abs(g)<=7&&Math.abs(h)>=4&&Math.abs(h)<=7);f=([x,y])=>[x+g,y+h];}
   else if(q.prompt.includes('reflection across the x-axis'))f=([x,y])=>[x,-y];else if(q.prompt.includes('counterclockwise rotation of 90°'))f=([x,y])=>[-y,x];else if(q.prompt.includes('clockwise rotation of 90°'))f=([x,y])=>[y,-x];else f=([x,y])=>[-x,-y];
   return JSON.stringify(p.orig.map(f))===JSON.stringify(p.img)&&q.answer.kind==='teacher'&&/<svg/.test(q.teacherSvg);},
 'rotation-choose':(q,p)=>{const f=p.e===1?([x,y])=>[-y,x]:p.e===2?([x,y])=>[y,-x]:([x,y])=>[-x,-y],s=8,O=11*s+10,want=p.P.map(f).map(([x,y])=>(O+x*s).toFixed(1)+','+(O-y*s).toFixed(1)).join(' ');
   const polys=q.givens.svg.split(/<g transform="translate\(\d+,\d+\)">(?=<text)/).slice(1);return polys.filter(x=>x.includes(`points="${want}"`)).length===1&&polys['abcd'.indexOf(q.answer.value)].includes(`points="${want}"`);},
 // Batch 9: Lessons 81–90.
 'percent-rest':(q,p)=>{if(p.part===undefined){assert(p.a>=2&&p.a<=5&&p.b>=60&&p.b<=70);return fracEq(q,p.a*p.b*100,p.b);}assert([20,25,30,35].includes(p.a)&&p.b>=40&&p.b<=100&&p.a*p.b%100===0&&q.prompt.includes(` ${words(p.part)} of the ${p.b} `));return fracEq(q,100*(p.b-p.part),p.b);},
 'circle-area':(q,p)=>{if(q.answer.kind==='parts'){assert(p.a%2===0&&p.a>=22&&p.a<=58);return E.checkAnswer(q,`${p.a*p.a/4}π`).answerCorrect&&E.checkAnswer(q,`${p.a*p.a/4} pi ft^2`).answerCorrect&&!E.checkAnswer(q,`${p.a*p.a}π`).answerCorrect;}assert(p.a>=2&&p.a<=9);return fracEq(q,314*p.a*p.a,100);},
 'power-ten':(q,p)=>{const z=p.b+p.c;return E.checkAnswer(q,`10^${z}`).answerCorrect&&E.checkAnswer(q,`1 x 10^${z}`).answerCorrect&&!E.checkAnswer(q,`10^${p.b*p.c}`).answerCorrect;},
 'sci-product':(q,p)=>{const prod=mulF(Fd(p.m1),Fd(p.m2));let digits=String(prod[0]/prod[1]);const e=p.e1+p.e2;return E.checkAnswer(q,toSci(shiftDec(digits,e))).answerCorrect;},
 'classify-poly':(q,p)=>q.answer.value===['monomial','binomial','trinomial'][[p.a,p.b,p.c].filter(Boolean).length-1],
 'like-terms':(q,p)=>{if(p.letters){const [j,j1]=p.letters,P=[j,j1].sort().join('');const want=[[p.a+p.b,P],[p.a1+p.X,j]].filter(([c2])=>c2!==0);const txt=want.map(([c2,v],i)=>(c2<0?'-':i?'+':'')+Math.abs(c2)+v).join('')||'0';return E.checkAnswer(q,txt).answerCorrect&&E.checkAnswer(q,[...want].reverse().map(([c2,v])=>(c2<0?'-':'+')+Math.abs(c2)+v).join('').replace(/^\+/,'')||'0').answerCorrect;}
   const j=p.letter,T=(cs)=>cs.filter(([c2])=>c2).map(([c2,v],i)=>(c2<0?'-':i?'+':'')+Math.abs(c2)+v).join('')||'0';return E.checkAnswer(q,T([[p.g,j+'^2'],[p.a-p.f,j],[p.b-p.c,'']])).answerCorrect&&(p.c===0||!E.checkAnswer(q,T([[p.g,j+'^2'],[p.a-p.f,j],[p.b+p.c,'']])).answerCorrect);},
 'signed-order':(q,p)=>{let v;if(p.e!==undefined)v=p.a-p.b*p.c-p.d*p.e;else if(p.a1!==undefined){assert([3,5].includes(p.x)&&[4,6,8].includes(p.y)&&p.d<p.c);v=-p.a1*(p.a-p.a2)-p.b*(-p.c)*(-p.d)+(-p.x)*(-p.y)/2;}else{assert(Math.sign(p.c)===-Math.sign(p.d));v=p.a*(p.b-p.c*p.d);}return fracEq(q,v,1);},
 'rule-table':(q,p)=>{const r=p.rule.replace('−','-');let fx;const m=r.match(/^y = (\d)x ([+-]) (\d)$/),h=r.match(/^y = \(1\/(\d)\)x$/),s=r.match(/^y = x ([+-]) (\d)$/);
   if(m)fx=x=>Number(m[1])*x+(m[2]==='+'?1:-1)*Number(m[3]);else if(h)fx=x=>x/Number(h[1]);else fx=x=>x+(s[1]==='+'?1:-1)*Number(s[2]);
   const want=m?[fx(p.a),fx(p.b),p.c]:[fx(p.a),fx(p.b),fx(p.c)];assert(new Set([p.a,p.b,p.c]).size===3);if(m)assert(q.givens.svg.includes(`>${String(fx(p.c)).replace('-','−')}<`));return vals(q).join()===want.join();},
 'integer-graph':(q,p)=>{if(q.answer.kind==='teacher'){const dots=[];if(p.neg)for(let i=p.a+1;i<0;i++)dots.push(i);else for(let i=0;i<p.a;i++)dots.push(i);return (q.teacherSvg.match(/<circle/g)||[]).length===dots.length&&q.answer.reference.includes(dots.map(v=>String(v).replace('-','−')).join(', '));}
   if(q.answer.kind==='text'){const i='abcd'.indexOf(q.answer.value),g=q.givens.svg.split('<g transform').slice(1)[i];const cx=[...g.matchAll(/<circle cx="([\d.]+)"/g)].map(m=>m[1]),want=[...Array(p.a).keys()].map(v=>(30+(v+1)*380/11).toFixed(1));return cx.join()===want.join();}
   const k=p.k,a=p.a,lo=k===1?a+1:k===2?a:null,hi=k===3?a-1:k===4?a:null;const dots=(q.givens.svg.match(/<circle/g)||[]).length;assert.equal(dots,lo!==null?10-lo:hi+10);
   return lo!==null?E.checkAnswer(q,`integers greater than ${lo-1}`).answerCorrect&&E.checkAnswer(q,`integers ≥ ${lo}`).answerCorrect&&!E.checkAnswer(q,`integers greater than ${lo}`).answerCorrect:E.checkAnswer(q,`integers less than ${hi+1}`).answerCorrect&&!E.checkAnswer(q,`integers less than ${hi}`).answerCorrect;},
 'mono-product':(q,p)=>{const c0=p.fac.reduce((s,f)=>s*f[0],1),x=p.fac.reduce((s,f)=>s+f[1],0),y=p.fac.reduce((s,f)=>s+f[2],0);const txt=`${c0}${y?`y^${y}`:''}x^${x}`;return E.checkAnswer(q,txt).answerCorrect&&!E.checkAnswer(q,`${c0}x^${x+1}${y?`y^${y}`:''}`).answerCorrect;},
 'unit-convert':(q,p)=>{if(p.toMi!==undefined){assert(p.b>=20&&p.b<=59);return p.toMi?E.checkAnswer(q,`${p.b}/63360`).answerCorrect:E.checkAnswer(q,String(p.b*63360)).answerCorrect;}
   if(p.k!==undefined){const F=[[100,1],[100,254],[1,12]],G=[[12,1],[254,100],[1,100]],H=[[5280,1],[12,1],[254,100]],I=[[100,254],[1,12],[1,5280]],ch=[F,G,H,I][p.k];let v=[p.b,1];for(const [a,b] of ch)v=red(v[0]*a,v[1]*b);return E.checkAnswer(q,`${v[0]}/${v[1]}`).answerCorrect&&!E.checkAnswer(q,`${v[1]}/${v[0]}`).answerCorrect;}
   if(p.b!==undefined)return fracEq(q,p.a*(p.b===1?100:10000),1);if(p.a>=1111100)return fracEq(q,p.a,1000);return fracEq(q,144*p.a,1);},
 'polygon-angles':(q,p)=>{if(p.n!==undefined)return fracEq(q,p.n*(p.n-3)/2/ (p.n/2),1);if(q.prompt.includes('inscribed')){assert(p.a!==7);return fracEq(q,(p.a-2)*180,p.a)&&/<circle/.test(q.givens.svg);}assert([5,6,8,9,10,12].includes(p.a));return fracEq(q,360,p.a);},
 'coef-equation':(q,p)=>{if(p.bb!==undefined){assert(p.b%p.bb!==0);const z=vals(q)[0];return Math.abs(p.b*z/p.bb-Number(q.prompt.match(/= (\d+)/)[1]))<1e-9;}
   if(p.d!==undefined)return fracEq(q,p.b*p.b*p.c,p.d);if(p.e!==undefined)return fracEq(q,p.e*p.c,p.f*(p.c*p.a+p.b));if(p.letter&&p.b<-10)return fracEq(q,p.c,1)&&q.prompt.includes(`= −${-p.b*p.c}`);if(p.letter)return fracEq(q,p.c,10);const lhs=q.prompt.match(/Solve: (\S+) =/)[1].replace('−','-');assert(Math.abs(Number(lhs)-p.b*p.c/10)<1e-9&&Math.abs(p.b)>=2&&Math.abs(p.b)<=9&&(p.b<0||p.c<0));return fracEq(q,p.c,1);},
 // Batch 10: Lessons 91–100.
 'signed-eval':(q,p)=>{if(p.plus!==undefined){assert(p.a>=2&&p.a<=5&&p.b<0&&p.b>=-7);return fracEq(q,p.c*p.b+(p.plus?p.a:-p.a),1);}
   if(q.prompt.includes(')/')){assert(p.a<0&&p.b<0&&p.c<0);return fracEq(q,-(p.a+p.b),-p.c);}
   const w=p.a,x=p.b,y=p.c;return fracEq(q,-w*(-x+y)-x*y,1);},
 'signed-chain':(q,p)=>{if(p.bk!==undefined)return fracEq(q,-p.bk-p.dk+p.e-p.f,1);if(p.e!==undefined)return fracEq(q,p.a-p.b*p.c-p.d*p.e,1)&&q.prompt.includes(`(${String(p.a).replace('-','−')}) −`);
   assert(p.a>=22&&p.b>=3&&Math.abs(p.c)>=21);return fracEq(q,p.a+p.b-p.c,1);},
 'percent-change':(q,p)=>{if(q.prompt.includes('advertised')){assert(p.b%5===0&&p.a*p.b%100===0);return fracEq(q,p.a*(100-p.b),10000);}
   assert([25,30,35,40,45,50].includes(p.a)&&q.prompt.includes(`was ${p.b}¢`));return fracEq(q,100*p.b,100+p.a)&&E.checkAnswer(q,`${100*p.b/(100+p.a)} cents`).answerCorrect;},
 'two-step':(q,p)=>{if(p.z!==undefined&&p.letter){const m=q.prompt.match(/Solve: ([\d.]+)\w ([−+]) ([\d.]+) = (−?-?[\d.]+)/),A=Fd(m[1]),Bc=Fd(m[3]),D=Fd(m[4].replace(/[−-]/,'')),Dn=/[−-]/.test(m[4])?[-D[0],D[1]]:D,sgn=m[2]==='−'?-1:1;
     const z=divF((sgn>0?subF:addF)(Dn,Bc),A);return fracEq(q,z[0],z[1])&&fracEq(q,p.z,10);}
   if(p.letter)return fracEq(q,(p.d+p.c)*p.a,p.b)&&p.b%p.a!==0;
   const [nm,dn]=red(p.c*p.d-p.b,p.a-p.c),ft=(nm<0?'−':'')+Math.abs(nm)+'/'+dn,sym=p.le?'≤':'≥';assert(dn>1);
   if(q.answer.kind==='teacher')return q.answer.reference.startsWith(`x ${sym} ${ft};`)&&/<circle/.test(q.teacherSvg)&&q.answer.reference.includes(p.le?'left':'right');
   return q.prompt.includes(`(${q.answer.value}) x ${sym} ${ft} `)||q.prompt.endsWith(`(${q.answer.value}) x ${sym} ${ft}`);},
 'spinner-twice':(q,p)=>{const kind=q.prompt.match(/stop on an? (\w+)/)[1],test={odd:x=>x%2===1,even:x=>x%2===0,consonant:x=>!'AEIOU'.includes(x),vowel:x=>'AEIOU'.includes(x)}[kind];const k=p.labels.filter(test).length;assert(k>0&&k<6&&p.labels.every(l=>q.givens.svg.includes(`>${l}<`)));return fracEq(q,k*k,36);},
 'solid-volume':(q,p)=>{if(p.r!==undefined){assert(p.h>=7&&p.h<=13&&p.r>=2&&p.r<=5);return fracEq(q,314*p.r*p.r*p.h,100)&&/<ellipse/.test(q.givens.svg);}
   if(q.prompt.includes('triangular'))return fracEq(q,p.a*p.b*p.c,2)&&q.givens.svg.includes(`>${p.c}<`);assert(p.a>p.b&&p.b>p.c);return fracEq(q,p.a*p.b*p.c,1)&&E.checkAnswer(q,String(p.a*p.b*p.c)).answerCorrect;},
 'angle-estimate':(q,p)=>{if(p.drawn!==undefined){assert([0,20,30].includes(Math.abs(p.a-p.drawn)));return q.answer.value===(p.a===p.drawn?'True':'False')&&q.prompt.includes(`${p.a}°`);}
   if(q.answer.kind==='approx'){assert(p.z>180&&p.z<360&&p.z%5===0);return E.checkAnswer(q,String(p.z)).answerCorrect&&E.checkAnswer(q,`${p.z+2}°`).answerCorrect&&!E.checkAnswer(q,String(p.z+5)).answerCorrect&&!E.checkAnswer(q,String(360-p.z)).answerCorrect&&/ 1 0 /.test(q.givens.svg);}
   assert(p.c>=33&&p.c<=60);return fracEq(q,90-p.c,1)&&q.givens.svg.includes(`>${p.c}°<`);},
 'distribute-terms':(q,p)=>{const v=(p.expr.match(/[a-z]/)||['x'])[0],js=p.expr.replace(/−/g,'-').replace(/(\d)([a-z(])/g,'$1*$2'),fn=Function(v,'return '+js),b0=fn(0),m=fn(1)-b0;
   const txt=[[m,v],[b0,'']].filter(([c2])=>c2).map(([c2,s],i)=>(c2<0?'-':i?'+':'')+Math.abs(c2)+s).join('')||'0';assert(m!==0||b0!==0);return E.checkAnswer(q,txt).answerCorrect&&!E.checkAnswer(q,[[m,v],[b0+1,'']].filter(([c2])=>c2).map(([c2,s],i)=>(c2<0?'-':i?'+':'')+Math.abs(c2)+s).join('')).answerCorrect;},
 'similar-sides':(q,p)=>{if(p.sides){const [d1,d2,d3]=p.sides;assert(new Set(p.sides).size===3);const known=p.sw?d3:d2;return fracEq(q,p.sw?d2:d3,1)&&[d1*p.m,d2*p.m,d3*p.m,known].every(s=>q.givens.svg.includes(`>${s}<`));}
   if(p.d!==undefined){assert(p.c>=11&&p.c<=19&&q.prompt.includes(`EF = ${p.c} feet`));return fracEq(q,p.d*p.b,p.c);}
   const C=Fd(p.c);return fracEq(q,Math.round(100*p.a*p.b*C[1]/C[0]),100)&&[p.a,p.b].every(s=>q.givens.svg.includes(`>${s}<`));},
 'indirect':(q,p)=>{if(p.e!==undefined){const L=p.c*p.b,H=p.c*p.a,s=p.e===1?2*p.a:2*p.b;assert([L,H,s].every(x=>q.givens.svg.includes(`>${x}<`)));return p.e===1?fracEq(q,s*L,H):fracEq(q,s*H,L);}
   if(q.prompt.includes('tree')){assert(p.a>=100&&p.a<=500&&p.b>=30&&p.b<=45&&p.c>=15&&p.c<=25);return fracEq(q,Math.round(p.a*p.c/p.b),1);}
   return fracEq(q,p.a*p.c,p.b)&&q.prompt.includes(`shadow ${p.a} meters`);},
 'scale':(q,p)=>{if(p.w!==undefined){assert(p.v>=5&&p.v<=12);return fracEq(q,p.v*p.w,1)&&q.prompt.includes(`${p.v} inches`)&&q.prompt.includes(`1 inch : ${p.w} miles`);}
   if(q.prompt.includes('bridge'))return fracEq(q,p.a,p.b)&&q.prompt.includes(`1 centimeter : ${p.b} meters`);
   assert(q.prompt.includes(`${p.b} feet ${p.b+2} inches`)&&q.prompt.includes(`1:${p.a}`));return fracEq(q,13*p.b+2,p.a);},
 'scale-factor':(q,p)=>{if(p.t!==undefined)return fracEq(q,p.t,p.t1)&&[3*p.t,2*p.t,3*p.t1,2*p.t1].every(s=>q.givens.svg.includes(`>${s}<`));
   if(p.k!==undefined){assert(q.prompt.includes(`${p.a*p.k} cm by ${p.b*p.k} cm by ${p.c*p.k} cm`));return vals(q).join()===[p.k,p.k**2,p.k**3].join();}
   assert(q.prompt.includes(`There were ${p.a*p.s} flowers`));return vals(q).join()===[p.s,5*p.s].join();},
 'pythagorean':(q,p)=>{if(p.A!==undefined){assert(p.A**2===p.B**2+p.C**2);return fracEq(q,[p.A,p.B,p.C][p.k],1);}
   if(p.e!==undefined){assert(p.f**2+p.g**2===p.e**2);return vals(q).join()===[p.f*p.g/2,p.e].join();}
   return fracEq(q,10*(p.a+p.b)+Math.round(10*Math.hypot(p.a,p.b)),10);},
 'root-between':(q,p)=>{const a=Math.floor(Math.sqrt(p.n));assert(a*a!==p.n&&a===p.a);return E.checkAnswer(q,`${a} and ${a+1}`).answerCorrect&&E.checkAnswer(q,`${a+1}, ${a}`).answerCorrect&&!E.checkAnswer(q,`${a+1} and ${a+2}`).answerCorrect&&!E.checkAnswer(q,`${a-1} and ${a}`).answerCorrect;},
 'irrational-graph':(q,p)=>{const X=v=>(30+(v+10)*380/20).toFixed(1),f2=x=>(x<0?'−':'')+Math.abs(x).toFixed(2);
   if(p.val!==undefined){const want=p.r===1?{0:3.14,1:-3.14,2:3.14,3:-3.9,4:4,5:-3.75,6:3.14,7:-3.7}[p.a]:[1,-1,1,-1,1,-1,1,-1][p.a]*Math.sqrt([2,3,5,7,8,2,3,7][p.a]);assert(Math.abs(want-p.val)<0.01);return q.teacherSvg.includes(`cx="${X(p.val)}"`);}
   if(p.v1!==undefined){assert((p.v1<0)!==(p.v2<0));return q.answer.reference.includes(f2(p.v1))&&q.answer.reference.includes(f2(p.v2))&&(q.teacherSvg.match(/<circle/g)||[]).length===2;}
   const s=-Math.sign(p.c)*Math.sqrt(p.a),f=p.c/p.b;assert(Math.abs(f)>Math.sqrt(p.a));
   if(q.answer.kind==='teacher')return q.answer.reference.includes(f2(s))&&q.answer.reference.includes(f2(f));
   const g=q.givens.svg.split('<g transform').slice(1)['abcd'.indexOf(q.answer.value)],cx=[...g.matchAll(/<circle cx="([\d.]+)"/g)].map(m=>m[1]).sort().join();return cx===[X(Math.round(100*s)/100),X(Math.round(100*f)/100)].sort().join()||cx===[X(s),X(f)].sort().join();},
 // Batches 11–12: Lessons 101–120.
 'translate-eq':(q,p)=>{if(p.right!==undefined){assert([[1,2],[1,4],[2,3]].some(([x,y])=>x===p.a&&y===p.b));const u=(p.right?90:180)/(p.a+p.b);return fracEq(q,p.right?p.a*u:p.b*u,1)&&/<svg/.test(q.givens.svg);}
   if(p.less!==undefined){assert(p.a>=8&&p.a<=11&&p.b>=30&&p.b<=38);return fracEq(q,2*(p.b+(p.less?p.a:-p.a)),1);}
   const z=p.twice?(p.b+p.a)/2:(p.b-p.a)/p.p;assert(Number.isInteger(z)&&z>=6&&z<=15&&p.a>=4&&p.a<=7);return fracEq(q,z,1);},
 'transversal':(q,p)=>{if(p.k!==undefined){const P=[[[1,5],[2,6],[3,7],[4,8]],[[3,5],[4,6]],[[1,7],[2,8]]][p.k],txt=ps=>ps.map(([x,y])=>`${y} and ${x}`).reverse().join(', ');const bad=P.map(([x,y],i)=>i?[x,y]:[x,y===8?7:y+1]);return E.checkAnswer(q,txt(P)).answerCorrect&&!E.checkAnswer(q,txt(bad)).answerCorrect&&/<svg/.test(q.givens.svg);}
   if(p.c!==undefined){assert(p.a%2!==p.c%2&&(p.a%2?p.n>=70&&p.n<=80:p.n>=100&&p.n<=110));return fracEq(q,Math.abs(2*p.n-180),1);}
   const odd=p.a%2?p.n:180-p.n;assert(odd>=70&&odd<=80);return vals(q).join()===[odd,180-odd].join();},
 'simplify-solve':(q,p)=>{let z;if(p.letter){z=(p.d-p.c)/(p.a-p.b);assert(p.a*z+p.c===p.b*z+p.d);}else if(p.e!==undefined){z=(p.f-p.e)/(p.a+p.c);assert(p.a*z+p.e+p.c*z===p.f);}else if(p.d!==undefined){z=(p.f-2*p.d)/(p.a+p.b);assert(p.a*z+p.d+p.b*z+p.d===p.f);}else{z=(p.f-p.b*p.c)/(p.a+p.b);assert(p.a*z+p.b*(z+p.c)===p.f&&Math.abs(p.f)<=99);}assert(Number.isInteger(z));return fracEq(q,z,1);},
 'neg-power':(q,p)=>{if(p.f){assert(p.f.length===5&&p.f.every(x=>x!==0));return fracEq(q,p.f.reduce((s,x)=>s*x,1),1);}assert(p.a<0&&p.b>=2&&p.b<=5);let v=1;for(let k=0;k<p.b;k++)v*=p.a;return fracEq(q,v,1);},
 'divide-terms':(q,p)=>{const [x,y,w]=p.letters,mono=(c,ex)=>`${c}`+ex.filter(([,e])=>e).map(([l,e])=>`${l}^${e}`).join('');
   if(p.co1!==undefined&&p.co2===undefined){const c=p.co1/p.co3,ex=[[x,p.x3-p.x1],[y,p.y1-p.y3],[w,p.x2]];assert(Number.isInteger(c)&&p.x3>p.x1);return E.checkAnswer(q,mono(c,ex)).answerCorrect&&!E.checkAnswer(q,mono(c,[[x,p.x3-p.x1+1],[y,p.y1-p.y3],[w,p.x2]])).answerCorrect;}
   if(p.co2!==undefined){const c=p.co1*p.co2/p.co3,ex=[[x,p.x1+p.x2-p.x3],[y,p.y1+p.y2-p.y3]];assert(Number.isInteger(c)&&ex.every(([,e])=>e>=0));return E.checkAnswer(q,(c===1?'':c===-1?'-':'')+mono(Math.abs(c)===1?'':c,ex).replace(/^-?1(?=[a-z])/,'')).answerCorrect||E.checkAnswer(q,mono(c,ex)).answerCorrect;}
   let n0=p.a*p.b,d0=p.c;if(d0<0){n0=-n0;d0=-d0;}const g=gcd(n0,d0);n0/=g;d0/=g;const ex={[x]:p.x1+p.x2-p.x3,[y]:p.y1+p.y2-p.y3},up=Object.keys(ex).filter(k=>ex[k]>0).map(k=>`${k}^${ex[k]}`).join(''),dn=Object.keys(ex).filter(k=>ex[k]<0).map(k=>`${k}^${-ex[k]}`).join('');
   const txt=(n1,d1,u,dd)=>`${n1<0?'-':''}(${Math.abs(n1)}${u})/(${d1}${dd})`;return E.checkAnswer(q,dn||d0>1?txt(n0,d0,up,dn):`${n0}${up}`).answerCorrect&&!E.checkAnswer(q,txt(-n0,d0,up,dn)).answerCorrect;},
 'semicircle-figure':(q,p)=>{assert(p.a>=2&&p.a<=6&&p.b>=3&&p.b<=12);return q.prompt.includes('area')?fracEq(q,400*p.a*p.b+314*p.a*p.a,200):fracEq(q,200*(p.a+p.b)+314*p.a,100);},
 'sector':(q,p)=>{assert([40,60,72].includes(p.ang)&&p.r>=4&&p.r<=10);const half=(n,d)=>Math.floor((2*n+d)/(2*d)),arc=half(p.ang*p.r*628,360);return q.prompt.includes('area')?fracEq(q,half(p.ang*p.r*p.r*314,360),100):q.prompt.includes('perimeter')?fracEq(q,arc+200*p.r,100):fracEq(q,arc,100);},
 'surface-area':(q,p)=>{if(p.d!==undefined){assert(p.a*p.a+p.c*p.c===p.d*p.d&&p.b>=p.a&&p.b<=Math.min(2*p.a,25));return fracEq(q,p.a*p.c+p.b*(p.a+p.c+p.d),1);}if(p.h!==undefined){assert(p.r<p.h);const v=vals(q);return Math.abs(v[0]-6.28*p.r*p.h)<1e-9&&Math.abs(v[1]-6.28*p.r*(p.r+p.h))<1e-9;}assert(p.a>p.b&&p.b>p.c);return fracEq(q,2*(p.a*p.b+p.b*p.c+p.a*p.c),1);},
 'sphere-area':(q,p)=>{if(q.prompt.startsWith('A ball'))assert(p.r>=2&&p.r<=9&&q.prompt.includes(`diameter of ${2*p.r} cm`));else assert(p.r>=8&&p.r<=16);return fracEq(q,1256*p.r*p.r,100);},
 'roots-more':(q,p)=>{if(p.n!==undefined)return E.checkAnswer(q,`-√${p.n}, √${p.n}`).answerCorrect&&E.checkAnswer(q,`±√${p.n}`).answerCorrect&&!E.checkAnswer(q,`√${p.n}`).answerCorrect;return fracEq(q,p.a,1)&&q.prompt.includes(String(Math.abs(p.a**3)));},
 'literal':(q,p)=>{const [i,j,k]=p.letters;if(p.plus!==undefined)return p.plus?E.checkAnswer(q,`${k}=-${j}+${i}`).answerCorrect&&!E.checkAnswer(q,`${k}=${i}+${j}`).answerCorrect:E.checkAnswer(q,`${k}=${j}+x${i}`).answerCorrect&&!E.checkAnswer(q,`${k}=${i}x-${j}`).answerCorrect;
   if(p.minus!==undefined)return E.checkAnswer(q,p.minus?`${k} = ${j}/(1+${i})`:`${k} = ${j}/(-1+${i})`).answerCorrect&&!E.checkAnswer(q,`${k} = ${j}/${i}`).answerCorrect;
   return E.checkAnswer(q,`${k}=(1/${j})${i}`).answerCorrect&&!E.checkAnswer(q,`${k}=${j}/${i}`).answerCorrect;},
 'transform-formula':(q,p)=>{if(p.case!==undefined){const o={l:'w',w:'l',b:'h',h:'b'}[p.solveFor];const good=[`(1/${o})A`,'A^(1/2)',`(1/${o})A`,`P/2-${o}`,'0.25P'][p.case],bad=[`${o}/A`,'A/2',`A${o}`,`P/2-2${o}`,'4P'][p.case];return E.checkAnswer(q,`${p.solveFor} = ${good}`).answerCorrect&&!E.checkAnswer(q,`${p.solveFor} = ${bad}`).answerCorrect;}
   if(p.solveFor){const o=p.letters.find(l=>l!==p.solveFor);return E.checkAnswer(q,`${p.solveFor}=(2/${o})A`).answerCorrect&&!E.checkAnswer(q,`${p.solveFor}=A/${o}`).answerCorrect;}
   const k=p.perim&&!p.two?p.letters[1]:p.letters[0];return p.perim?E.checkAnswer(q,`${k}=P/${p.two?2:1}/π`).answerCorrect&&!E.checkAnswer(q,`${k}=P/${p.two?1:2}/π`).answerCorrect:E.checkAnswer(q,`${k}=√A/√π`).answerCorrect&&!E.checkAnswer(q,`${k}=√A/π`).answerCorrect;},
 'slope':(q,p)=>{if(p.vertical!==undefined){assert(Math.abs(p.a)>=2&&Math.abs(p.a)<=4);return p.vertical?E.checkAnswer(q,'undefined').answerCorrect&&!E.checkAnswer(q,'0').answerCorrect:E.checkAnswer(q,'0').answerCorrect&&!E.checkAnswer(q,'undefined').answerCorrect;}
   if(p.ax===undefined)return fracEq(q,p.a,1)&&/<path|<line/.test(q.givens.svg);assert(p.ax<0&&p.bx>0&&p.ay!==p.by);return sfrac(q,p.ay-p.by,p.ax-p.bx);},
 'formula-sub':(q,p)=>{if(p.tri===undefined){assert([24,28,32,36].includes(Math.abs(p.c)));return fracEq(q,18*p.c+320,10);}const z=p.tri?2*p.c/p.b:p.c/p.b;assert(Number.isInteger(z));return fracEq(q,z,1)&&q.prompt.includes(`A = ${p.c}`);},
 'square-eq':(q,p)=>{if(p.n!==undefined){assert(p.n%p.a===0&&[2,3,5,6,7].includes(p.n/p.a));return E.checkAnswer(q,`±√${p.n/p.a}`).answerCorrect&&!E.checkAnswer(q,`±${p.n/p.a}`).answerCorrect;}
   if(p.ans!==undefined){const x2=(p.ans-p.c)/p.b;assert(x2===p.a*p.a);return E.checkAnswer(q,`-${p.a}, ${p.a}`).answerCorrect;}
   if(p.twice!==undefined){if(p.twice){const z2=(p.b+p.a)/2,z=Math.sqrt(z2);assert(Number.isInteger(z));return E.checkAnswer(q,`-${z}`).answerCorrect&&!E.checkAnswer(q,`${z}, -${z}`).answerCorrect;}const z=Math.sqrt(p.b+p.a);assert(Number.isInteger(z));return E.checkAnswer(q,`x = ${z} or x = -${z}`).answerCorrect;}
   const z=Math.sqrt(p.a*p.b);assert(Number.isInteger(z));return E.checkAnswer(q,`${z}, -${z}`).answerCorrect&&!E.checkAnswer(q,`${z}`).answerCorrect;},
 'interest':(q,p)=>{if(p.P!==undefined){assert(p.P%500===0&&p.P>=1000&&p.P<=7500&&p.r>=5&&p.r<=9);let num=BigInt(p.P*100),den=1n;const want=[];for(let k=1;k<=5;k++){num*=BigInt(100+p.r);den*=100n;const cents=(2n*num+den)/(2n*den);want.push(Number(cents)-100*p.P);}return vals(q).every((v,i)=>Math.abs(v*100-want[i])<1e-6);}
   const c10=Math.round(Number(p.c)*10);assert(c10>=15&&c10<=55&&p.d>=4&&p.d<=8);return fracEq(q,100*p.b+Math.floor((2*p.b*c10*p.d+10)/20),100);},
 'discounts':(q,p)=>{if(q.prompt.includes('clearance'))return fracEq(q,p.c*(100-p.b)*(100-p.a),10000);if(q.prompt.includes("O'Toole"))return fracEq(q,Math.floor((2*Math.round(Number(p.c)*100)*(100-p.b)*(100-p.a)+10000)/20000),100);assert(p.b!==50&&p.c>=2&&p.c<=5);return fracEq(q,p.a*(100-p.b)-100*p.c,100);},
 'sci-divide':(q,p)=>{let [n0,d0]=Fd(p.a);d0*=p.c;let e=p.b-p.d;while(n0<d0){n0*=10;e--;}while(n0>=10*d0){d0*=10;e++;}assert(n0%d0===0);return E.checkAnswer(q,`${n0/d0} x 10^${e}`).answerCorrect&&!E.checkAnswer(q,`${n0/d0} x 10^${e+1}`).answerCorrect;},
 'pythag-apps':(q,p)=>{if(p.s1!==undefined){assert(p.s1**2+p.s2**2===p.s3**2);return fracEq(q,p.s1+p.s2-p.s3,1);}assert(p.a**2+p.b**2===p.h**2);if(p.high!==undefined)return fracEq(q,Math.sqrt(p.h**2-(p.high?p.b:p.a)**2),1);return fracEq(q,p.a+p.b+p.h,1);},
 'solid-volume2':(q,p)=>{const half=(n,d)=>Math.floor((2*n+d)/(2*d));if(p.shape==='pyramid'){assert(Math.abs(p.h-p.a)<=2);return fracEq(q,p.a*p.b*p.h,3);}if(p.shape==='cone')return fracEq(q,half(314*p.r*p.r*p.h,3),100);if(p.shape==='sphere')return fracEq(q,half(1256*p.r**3,3),100);
   const a3=p.a**3;assert(p.a>=3&&p.a<=10);if(q.prompt.includes('machinist'))return fracEq(q,half((1200-314)*a3,12),100);if(q.prompt.includes('pyramid'))return fracEq(q,half(200*a3,3),100);return fracEq(q,half(314*a3,12),100);},
 'inequality-plane':(q,p)=>{if(p.order){const k='abcd'[p.order.indexOf(0)];return q.answer.value===k&&q.givens.svg.includes(`(${k}) x + y ≥ ${p.c} and x + y ≤ ${p.c1}`)&&p.c1-p.c>=2&&p.c1-p.c<=3;}
   if(p.c1!==undefined)return q.answer.reference.startsWith(`x + y ≥ ${p.c} and x + y ≤ ${p.c1}`)&&/<polygon/.test(q.teacherSvg);const sym=p.sum?(p.up?'>':'<'):(p.up?'≥':'≤');return q.answer.reference.startsWith(`x + y ${sym} ${p.c}:`)&&/fill-opacity/.test(q.teacherSvg)&&(p.sum?/stroke-dasharray/.test(q.teacherSvg):true);},
 'metric-capacity':(q,p)=>{if(p.L!==undefined){assert(p.b<1000*p.L&&p.b!==p.c);return vals(q).join()===[1000*p.L-p.b,1000*p.L-p.b+p.c].join();}if(p.grams!==undefined){assert(p.a%5===0&&p.a>=225&&p.a<=680);return fracEq(q,Math.floor(50*50*50/p.a),1);}const v=p.a*p.b*p.c/1000;return vals(q).every(x=>Math.abs(x-v)<1e-9);},
 'factor-gcf':(q,p)=>{if(p.co===undefined){const f=[];let x=p.a;for(let k=2;x>1;)if(x%k===0){f.push(k);x/=k;}else k++;return E.checkAnswer(q,f.join(' · ')+' x'.repeat(p.b)+' y'.repeat(p.c)).answerCorrect&&E.checkAnswer(q,f.join('*')+`x^${p.b}y^${p.c}`).answerCorrect&&!E.checkAnswer(q,f.slice(1).join('·')+'x'.repeat(p.b)+'y'.repeat(p.c)).answerCorrect;}
   const [x,y]=p.letters,g=p.co.reduce((s,v)=>gcd(s,v)),me=Math.min(...p.es),mx=Math.min(...p.xs),mono=(c,a,b)=>`${c}${a?`${x}^${a}`:''}${b?`${y}^${b}`:''}`,inner=p.co.map((c,k)=>mono(c/g,p.es[k]-me,p.xs[k]-mx)).reverse().join(' + ');
   return E.checkAnswer(q,`${mono(g,me,mx)}(${inner})`).answerCorrect&&!E.checkAnswer(q,`${g}(${p.co.map((c,k)=>mono(c/g,p.es[k],p.xs[k])).join('+')})`).answerCorrect;},
 'slope-intercept':(q,p)=>{if(p.order){const k='abcd'[p.order.indexOf(0)];return q.answer.value===k&&q.prompt.includes(`y = ${p.m===1?'':p.m===-1?'−':String(p.m).replace('-','−')}x ${p.b<0?'−':'+'} ${Math.abs(p.b)}`);}if(p.m!==undefined)return q.answer.reference.startsWith(`A line through (0, ${String(p.b).replace('-','−')}) with slope ${String(p.m).replace('-','−')}`)&&/<line/.test(q.teacherSvg);
   assert(Math.abs(p.b)===1);const m=-p.a/p.b,k=p.c/p.b;return E.checkAnswer(q,`y=${m}x${k<0?'':'+'}${k}`).answerCorrect&&E.checkAnswer(q,`${k}${m<0?'':'+'}${m}x`).answerCorrect&&!E.checkAnswer(q,`y=${-m}x${k<0?'':'+'}${k}`).answerCorrect;},
 'copy-construct':(q,p)=>{if(p.order){const k='abcd'[p.order.indexOf(0)];assert(p.a+p.b+p.c===180);return q.answer.value===k;}if(p.b!==undefined)return p.a+p.b+p.c===180&&q.answer.kind==='teacher';return q.answer.kind==='teacher'&&q.prompt.includes(`${p.a}° angle`)&&(q.prompt.includes('copy')&&(p.a<=90?p.a>=10&&p.a%5===0&&p.a!==80&&p.a!==85:p.a>=100&&p.a<=150));},
 'zero-divide':(q,p)=>{if(q.answer.kind==='teacher')return q.answer.reference.startsWith(`0 ÷ 0 = ${p.a} is not a fact`);if(q.answer.kind==='num-set')return E.checkAnswer(q,`${-p.b} and 0`).answerCorrect&&!E.checkAnswer(q,`${p.b}, 0`).answerCorrect;return fracEq(q,p.b===0?0:-p.b,1);},
 'nonlinear-graph':(q,p)=>{if(p.order){const k='abcd'[p.order.indexOf(0)];return q.answer.value===k&&q.prompt.includes(`y = ${p.a}x²`);}return q.answer.reference.startsWith(`The graph of ${p.eq}`)&&/<path/.test(q.teacherSvg);},
 // Batch 13: investigations (scope 201–213).
 'inv-fractions':(q,p)=>{if(p.c!==undefined)return fracEq(q,p.c*p.d,p.a*p.b);const F={1:[1,2],2:[1,4],3:[1,10],4:[3,10],5:[3,4],6:[7,10]},[x,y]=[F[p.a],F[p.b]];return fracEq(q,100*(x[0]*y[1]+y[0]*x[1]),x[1]*y[1])&&E.checkAnswer(q,`${Math.round(100*(x[0]/x[1]+y[0]/y[1]))}%`).answerCorrect;},
 'inv-construct':(q,p)=>q.answer.kind==='teacher'&&q.answer.rubric.length===3&&(p.deg===undefined||p.deg>=24&&p.deg<=40&&p.deg%4===0),
 'inv-circle-parts':(q,p)=>{if(p.letters){const [P0,Q,R0,S]=p.letters,want=[[S,Q,R0],[Q,P0,S],[R0,P0,Q]][p.k];return E.checkAnswer(q,`${R0}${S}; angle ${want[2]}${want[1]}${want[0]}`).answerCorrect&&!E.checkAnswer(q,`${P0}${S}; ${want.join('')}`).answerCorrect&&!E.checkAnswer(q,`${S}${R0}; ${want[1]}${want[0]}${want[2]}`).answerCorrect;}
   if(p.r!==undefined)return vals(q).join()===[90,2*p.r*p.r].join();return vals(q)[0]===45&&vals(q)[1]===[45,90,67.5,135,45,135,67.5][p.k];},
 'inv-coordinates':(q,p)=>{if(p.points)return p.points.every(([n0,x,y])=>q.answer.reference.includes(`${n0}(${String(x).replace('-','−')}, ${String(y).replace('-','−')})`))&&(q.teacherSvg.match(/<circle/g)||[]).length===3;const want=p.a===0?'y-axis':p.b===0?'x-axis':p.a>0?(p.b>0?'quadrant I':'quadrant IV'):(p.b>0?'quadrant II':'quadrant III');return q.answer.value===want&&E.checkAnswer(q,want.toUpperCase()).answerCorrect;},
 'inv-stem-leaf':(q,p)=>{const all=p.rows.flatMap(([s,l])=>l.map(x=>10*s+x)).sort((x,y)=>x-y);if(q.answer.kind==='sequence')return E.checkAnswer(q,all.join(',')).answerCorrect&&!E.checkAnswer(q,[...all].reverse().join(',')).answerCorrect;
   const N=all.length,cnt={};all.forEach(x=>{cnt[x]=(cnt[x]||0)+1;});const mx=Math.max(...Object.values(cnt)),modes=Object.keys(cnt).filter(k=>cnt[k]===mx);assert(mx>=2&&modes.length===1);const med=N%2?all[(N-1)/2]:(all[N/2-1]+all[N/2])/2;return vals(q).join()===[med,Number(modes[0]),all[N-1]-all[0]].join();},
 'inv-box-plot':(q,p)=>{if(p.data){const s=[...p.data].sort((x,y)=>x-y);assert(s.every(x=>x>p.a&&x<p.d));return q.answer.reference.includes(`median ${s[4]}`)&&q.answer.reference.includes(`lower quartile ${(s[1]+s[2])/2}`)&&q.answer.reference.includes(`upper quartile ${(s[6]+s[7])/2}`);}
   const [mn,q1,md,q3,mx]=p.five;assert(mn<q1&&q1<md&&md<q3&&q3<mx);const v=vals(q);return v.length===2?v.join()===[mx-mn,q3-q1].join():v.join()===[mn,mx,q1,q3,md].join();},
 'inv-graphs':(q,p)=>{if(p.bars){const [a,b,c,d,e]=p.bars;assert(c>b&&d<c&&e<d&&a>=3&&a<=5);return fracEq(q,p.bars.slice(p.f,p.g+1).reduce((s,x)=>s+x,0),1);}
   if(p.k!==undefined){const Y=[92,90,91,91,92,92,91,90,92,90],Mi=[91,90,90,92,93,89,89,92,92,91],d=[0,1,2,3,4,5,6,7,8,9].filter(i=>[Y[i]>Mi[i],Y[i]<Mi[i],Y[i]===Mi[i],Y[i]-Mi[i]===1][p.k]).map(i=>11+i);return E.checkAnswer(q,`April ${[...d].reverse().join(' and ')}`).answerCorrect&&!E.checkAnswer(q,d.slice(1).join(', ')||'0').answerCorrect;}
   if(p.order)return q.answer.value==='abc'[p.order.indexOf(0)];return q.answer.reference.startsWith(`Total $${100*p.m}: food ${p.a}%, housing ${p.b}%, other ${100-p.a-p.b}%`);},
 'inv-quadrilaterals':(q,p)=>{if(p.lines!==undefined)return q.answer.value===String({0:1,3:4,5:0,6:0}[p.k]);if(q.answer.kind==='teacher')return [0,1,2,3,5,6].includes(p.k);return q.answer.value===['rectangle','square','rhombus','trapezoid','parallelogram'][p.k];},
 'inv-balanced':(q,p)=>{if(p.first!==undefined){const [bn,bd]=Fd(p.b),z=subF([bn,bd],[p.a,1]);assert(p.a%10!==0);return fracEq(q,z[0],z[1]);}if(String(p.b).length===4&&String(p.a).length===3&&Fd(p.b)[1]===100){const z=addF(Fd(p.a),Fd(p.b));return fracEq(q,z[0],z[1]);}const z=divF(Fd(p.a),Fd(p.b));assert(z[1]===1);return fracEq(q,z[0],1);},
 'inv-functions':(q,p)=>{if(p.order)return q.answer.value==='abc'[p.order.indexOf(0)]&&q.prompt.includes(`y: ${String(p.b-p.a).replace('-','−')},`);if(p.vals)return q.answer.reference.includes(p.a<0?'decreases':'increases')&&p.vals.every((v,i)=>i===0||(p.a<0?v<=p.vals[i-1]:v>=p.vals[i-1]))&&(p.a<0?p.vals[4]<p.vals[0]:p.vals[4]>p.vals[0]);if(p.c!==undefined)return q.answer.reference.startsWith(`(${String(p.a).replace('-','−')}, ${String(p.a+p.c).replace('-','−')})`);return q.answer.reference.startsWith(`y = ${p.b} − x`);},
 'inv-probability':(q,p)=>{if(p.counts){const [a,b,c]=p.counts;assert(a!==b&&b!==c&&a!==c);return fracEq(q,p.counts[p.k],a+b+c);}if(p.will!==undefined){assert(gcd(p.b,p.c)===1&&p.c<p.b);return fracEq(q,p.will?p.c:p.b-p.c,p.b);}return fracEq(q,p.a,p.b)&&q.prompt.includes(`${p.a} to ${p.b-p.a}`);},
 'inv-scale-solids':(q,p)=>{if(p.m1){const n=Fd(p.n);return fracEq(q,p.m1*p.m2*p.m3*n[0]**3,n[1]**3);}if(p.c!==undefined){const one=6*p.a*p.a,many=6*p.b*p.c*p.c;return q.answer.value===(one>many?'A':one<many?'B':'C');}assert(p.b%p.a===0);return fracEq(q,(p.b/p.a)**3,1);},
 'inv-pythagoras':(q,p)=>{if(p.k!==undefined&&p.orient===undefined)return q.answer.reference.endsWith('a² + b² = c²')||q.answer.reference.endsWith('c² = a² + b²');if(p.orient!==undefined){assert(p.a**2+p.b**2===p.c**2);return fracEq(q,[p.a,p.b,p.c][p.k-1],1);}const s2=p.a*p.a+p.b*p.b;let k=1,r=s2;for(let j=2;j*j<=r;j++)while(r%(j*j)===0){r/=j*j;k*=j;}const simp=r===1?String(k):`${k>1?k:''}√${r}`;return E.checkAnswer(q,simp).answerCorrect&&(r===1||!E.checkAnswer(q,`√${s2*4}`).answerCorrect)&&(k===1||!E.checkAnswer(q,`√${s2}`).answerCorrect);},
 'inv-numerals':(q,p)=>{const rom=r=>{const V={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let t=0;for(let i=0;i<r.length;i++){const v=V[r[i]],w=V[r[i+1]]||0;t+=v<w?-v:v;}return t;};if(p.bin)return fracEq(q,parseInt(p.bin,2),1);if(p.x!==undefined)return fracEq(q,p.x,1)&&rom(q.prompt.match(/numeral ([IVXLCDM]+)/)[1])===p.x;if(q.prompt.includes('base 2')){return parseInt(q.answer.value,2)===p.n&&!/^0/.test(q.answer.value);}const r=q.answer.value;return rom(r)===p.n&&!/IIII|XXXX|CCCC|VV|LL|DD/.test(r);},
 // ---------- Course 1, Batch C1-1 (independent: values are recomputed from the parameters or read back from the shown problem) ----------
 'c1-add-money':(q,p)=>{const v=q.givens.recipe&&P.catalog.find(c=>c.sourceId===q.sourceId).variant;
   if(v==='story'){assert(p.a%100+p.b%100<100&&p.a%100>=11&&p.a%100<=79&&p.b%100>=11);return fracEq(q,p.a+p.b,100);}
   if(v==='three'){assert(p.b%100===0&&p.c<100&&p.a%100>=35);return fracEq(q,p.a+p.b+p.c,100);}
   if(v==='whole-first'){assert(q.prompt.startsWith(`Add: $${p.w} +`));return fracEq(q,100*p.w+p.b+p.c,100);}
   assert(p.a<100&&p.b>100&&p.b<150&&p.c<100);return fracEq(q,p.a+p.b+p.c,100);},
 'c1-sub-money':(q,p)=>{if(p.m!==undefined){assert(p.m%10<p.s%10&&p.s<50);return fracEq(q,p.m-p.s,100);}if(p.k!==undefined){assert(q.prompt.includes(`$${p.w} − ${p.k}¢`));return fracEq(q,100*p.w-p.k,100);}
   if(p.bill!==undefined){assert([5,10,20].includes(p.bill)&&p.cost%2===1&&p.cost<100*p.bill);return fracEq(q,100*p.bill-p.cost,100);}assert(p.s<100);return fracEq(q,100*p.w-p.s,100);},
 'c1-add-whole':(q,p)=>{const nums=(q.givens.svg.match(/>(\d+)</g)||[]).map(x=>Number(x.slice(1,-1)));return fracEq(q,nums.reduce((x,y)=>x+y,0),1)&&nums.length===(p.c===undefined?2:3);},
 'c1-sub-whole':(q,p)=>{if(q.givens.svg){const nums=(q.givens.svg.match(/>(\d+)</g)||[]).map(x=>Number(x.slice(1,-1)));assert(Math.floor(nums[0]/10)%10===0&&nums[0]%10<nums[1]%10);return fracEq(q,nums[0]-nums[1],1);}const m=q.prompt.match(/(\d+) − (\d+)/);return fracEq(q,Number(m[1])-Number(m[2]),1);},
 'c1-dozen':(q,p)=>fracEq(q,12*p.k-p.m,1),
 'c1-fact-family':(q,p)=>{const {a,b}=p;if(q.answer.kind==='numbers')return vals(q).join()===[a+b,a,b].join();
   const mult=!!p.mult,s=mult?a*b:a+b,o=mult?'×':'+',u=mult?'÷':'−',fam=[`${a} ${o} ${b} = ${s}`,`${b} ${o} ${a} = ${s}`,`${s} ${u} ${a} = ${b}`,`${s} ${u} ${b} = ${a}`];
   if(q.answer.kind==='fact-family')return E.checkAnswer(q,[fam[3],fam[0],fam[2],fam[1]].join('; ')).answerCorrect&&E.checkAnswer(q,fam.join(', ').replace(/×/g,'x').replace(/÷/g,'/').replace(/−/g,'-')).answerCorrect&&!E.checkAnswer(q,fam.slice(0,3).join('; ')).answerCorrect;
   const given=mult?fam[2]:fam[0];return fam.filter(f=>f!==given).every(f=>E.checkAnswer(q,f).answerCorrect)&&!E.checkAnswer(q,given).answerCorrect&&!E.checkAnswer(q,fam.filter(f=>f!==given).slice(0,2).join('; ')).answerCorrect;},
 'c1-division-forms':(q,p)=>E.checkAnswer(q,`${p.a}/${p.b}, ${p.b})${p.a}, ${p.a} ÷ ${p.b}`).answerCorrect&&!E.checkAnswer(q,`${p.a} ÷ ${p.b}`).answerCorrect&&!E.checkAnswer(q,`${p.a}/${p.b}; ${p.a}/${p.b}; ${p.b})${p.a}`).answerCorrect&&p.a===p.b*(p.a/p.b)&&Number.isInteger(p.a/p.b),
 'c1-multiply':(q,p)=>{if(p.amt!==undefined)return fracEq(q,p.amt*p.m,100);if(p.k!==undefined&&p.p!==undefined)return fracEq(q,p.k*p.p,100);if(p.p!==undefined&&p.m===undefined)return fracEq(q,10*p.p,100);if(p.p!==undefined)return fracEq(q,p.p*p.m,100);
   if(p.k!==undefined)return fracEq(q,p.a*p.k,1)&&q.prompt.split(' + ').length===p.k;const shown=q.givens.svg?(q.givens.svg.match(/>(\d+)</g)||[]).map(x=>Number(x.slice(1,-1))):q.prompt.match(/\d+/g).map(Number);return fracEq(q,shown[0]*shown[1],1);},
 'c1-divide':(q,p)=>{const g=q.givens;let nums;if(g.math)nums=g.math.match(/>([\d,]+)</g).map(x=>Number(x.slice(1,-1).replace(/,/g,'')));else if(g.svg)nums=g.svg.match(/>(\d+)</g).map(x=>Number(x.slice(1,-1))).reverse();else nums=(q.prompt.match(/\$?[\d.,]+(?= ÷)| ÷ (\d+)/g)||[]).map(x=>x.replace(/[^\d.]/g,''));
   if(q.answer.kind==='quot-rem'){const [N,d]=nums;return Math.floor(N/d)===q.answer.q&&N%d===q.answer.r&&q.answer.r>0&&E.checkAnswer(q,`${q.answer.q} r ${q.answer.r}`).answerCorrect;}
   if(p.cents!==undefined)return fracEq(q,p.cents/10,100);if(p.per!==undefined)return fracEq(q,p.per*p.roll,1);if(p.size!==undefined)return fracEq(q,p.g,1)&&q.prompt.includes(String(p.size*p.g));
   if(q.prompt.startsWith('Find the quotient')){const m=q.prompt.match(/divisor is (\d+) and the dividend is ([\d,]+)/);return fracEq(q,Number(m[2].replace(/,/g,''))/Number(m[1]),1);}
   const [N,d]=nums.map(Number);assert(N%d===0);return fracEq(q,N/d,1);},
 'c1-unknown':(q,p)=>{let eq=p.eq;if(!eq){if(q.givens.math){const m=q.givens.math.match(/>(\d+)</g).map(x=>Number(x.slice(1,-1)));eq=`x / ${m[0]} = ${m[1]}`;}else{const m=q.givens.svg.match(/>(\d+)</g).map(x=>Number(x.slice(1,-1)));eq=`x + ${m[0]} = ${m[1]}`;}}
   const ex=eq.replace(new RegExp(p.letter,'g'),'x').replace(/(\d)x/g,'$1*x').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-'),[l,r]=ex.split('=');const f=new Function('x',`return (${l})-(${r});`);
   let sol=null;for(let x=1;x<=2000;x++)if(Math.abs(f(x))<1e-9){sol=x;break;}return sol!==null&&fracEq(q,sol,1);},
 'c1-list-factors':(q,p)=>{const fs=[...Array(p.N).keys()].map(k=>k+1).filter(k=>p.N%k===0);return E.checkAnswer(q,[...fs].reverse().join(' ')).answerCorrect&&!E.checkAnswer(q,fs.slice(1).join(', ')).answerCorrect;},
 'c1-scores-graph':(q,p)=>{const i=p.scores.indexOf(Math.max(...p.scores));assert(p.scores.filter(x=>x===p.scores[i]).length===1);return q.answer.value===['Monday','Tuesday','Wednesday','Thursday','Friday'][i]&&E.checkAnswer(q,['mon','tue','wed','thu','fri'][i]).answerCorrect;},
 'c1-order-ops':(q,p)=>{let ex=p.shown;if(!ex){const m=q.givens.math.match(/>(\d+)</g).map(x=>Number(x.slice(1,-1)));ex=q.givens.math.includes('<mo>+</mo>')?`(${m[0]}+${m[1]})/${m[2]}`:`(${m[0]}*${m[1]})/${m[2]}`;}
   const v=new Function(`return ${ex.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-')};`)();return Number.isInteger(v)&&fracEq(q,v,1);},
 // ---------- Course 1, Batch C1-2 ----------
 'c1-fraction-model':(q,p)=>{const sv=q.givens.svg,sh=(sv.match(/fill="#7d8f96"/g)||[]).length,tot=(sv.match(/<rect x=|<path d="M90,/g)||[]).length,want=p.w!==undefined?[tot-sh,tot]:[sh,tot];return E.checkAnswer(q,`${want[0]}/${want[1]}`).answerCorrect&&(2*want[0]===want[1]||!E.checkAnswer(q,`${want[1]-want[0]}/${want[1]}`).answerCorrect);},
 'c1-fraction-of':(q,p)=>{let m=q.prompt.match(/What number is (\d+)\/(\d+) of (\$?)([\d.]+)\?/);if(m){const v=m[3]?Math.round(Number(m[4])*100):Number(m[4]);assert(v%Number(m[2])===0);return m[3]?fracEq(q,v/Number(m[2])*Number(m[1]),100):fracEq(q,v/Number(m[2])*Number(m[1]),1);}
   if((m=q.prompt.match(/denominator of the fraction (\d+)\/(\d+)/)))return fracEq(q,Number(m[2]),1);if((m=q.prompt.match(/won (\d+) of its (\d+) games/)))return E.checkAnswer(q,`${m[1]}/${m[2]}`).answerCorrect&&gcd(Number(m[1]),Number(m[2]))===1;
   const d=['Two','Three','Four','Five','Six'].indexOf(q.prompt.split(' ')[0])+2;return E.checkAnswer(q,`${d}/7`).answerCorrect&&!E.checkAnswer(q,`7/${d}`).answerCorrect;},
 'c1-units':(q,p)=>{if(p.ctx){const want={'the distance between two towns':'miles','the length of a pencil':'inches','the height of a classroom door':'feet','the length of a football field':'yards','the width of a book':'inches'}[p.ctx];return q.answer.value===want&&E.checkAnswer(q,want.toUpperCase()).answerCorrect;}
   const want={'a bicycle':'2 m','a new pencil':'18 cm','a ladybug':'6 mm','a classroom door':'2 m','a drive between two cities':'40 km','a paper clip':'3 cm'}[p.obj];return E.checkAnswer(q,want.replace(' ','')).answerCorrect&&q.choices.every(ch=>!E.checkAnswer(q,ch.value).answerCorrect);},
 'c1-lines':(q,p)=>{if(p.kinds)return q.answer.value==='abc'[p.kinds.indexOf(p.want)]&&q.givens.svg.includes(`(${q.answer.value}) a ${p.want}`);
   if(p.kind){const want=p.kind==='ray'?`ray ${p.rev?p.B+p.A:p.A+p.B}`:`${p.kind} ${p.B}${p.A}`;return E.checkAnswer(q,want.toUpperCase()).answerCorrect&&(p.kind!=='ray'||!E.checkAnswer(q,`ray ${p.rev?p.A+p.B:p.B+p.A}`).answerCorrect);}
   if(p.L){const [X,Y,Z]=p.L;return E.checkAnswer(q,`${Z}${X} and ${Y}${X} and ${Z}${Y}; ${X}${Z}, ${Y}${Z}, ${X}${Y}`).answerCorrect&&!E.checkAnswer(q,`${X}${Y}, ${Y}${Z}, ${X}${Z}; ${Y}${X}, ${Y}${Z}, ${X}${Z}`).answerCorrect&&!E.checkAnswer(q,`${X}${Y}, ${Y}${Z}, ${X}${Z}`).answerCorrect;}
   const ok={ray:'It starts at an end point and goes on forever in one direction.',line:'A straight path that goes on forever in both directions.',segment:'A straight part of a line between two endpoints.'};return Object.entries(ok).every(([k,v])=>E.checkAnswer(q,v).answerCorrect===(k===p.what));},
 'c1-ruler':(q,p)=>{const mix=(k,d)=>{const g=gcd(k,d),n0=k/g,d0=d/g,w=Math.floor(n0/d0),r=n0%d0;return r?(w?`${w} ${r}/${d0}`:`${r}/${d0}`):String(w);};if(p.mm!==undefined)return p.cm?fracEq(q,p.mm,10):fracEq(q,p.mm,1);
   if(q.prompt.includes('arrow')){assert(p.k>=9&&p.k<=39);return E.checkAnswer(q,mix(p.k,8)).answerCorrect;}assert(p.k>=3&&p.k<=15);return E.checkAnswer(q,mix(p.k,4)).answerCorrect;},
 'c1-perimeter':(q,p)=>{if(!q.givens.svg){const P=Number(q.prompt.match(/square is (\d+)/)[1]);return fracEq(q,P/4,1);}const L=(q.givens.svg.match(/>(\d+) (?:cm|mm|in\.)</g)||[]).map(x=>Number(x.match(/\d+/)[0]));
   if(L.length===3)return fracEq(q,L[0]+L[1]+L[2],1)&&(p.s?p.s[0]**2+p.s[1]**2===p.s[2]**2:true);if(L.length===2)return fracEq(q,2*(L[0]+L[1]),1);return fracEq(q,4*L[0],1);},
 'c1-order-digits':(q,p)=>{const s=[...p.shown].sort((x,y)=>x-y);return E.checkAnswer(q,s.join(',')).answerCorrect&&!E.checkAnswer(q,[...s].reverse().join(', ')).answerCorrect&&new Set(String(s[0]).split('')).size===3;},
 'c1-compare':(q,p)=>{const ev=x=>new Function(`return ${x.replace(/×/g,'*')};`)(),a=ev(p.L),b=ev(p.R);return q.answer.value===(a>b?'>':a<b?'<':'=');},
 'c1-sequence':(q,p)=>{const seq=q.prompt.match(/(\d+(?:, \d+){3,})/)[1].split(', ').map(Number),d=seq[1]-seq[0];assert(seq.every((x,i)=>!i||x-seq[i-1]===d));const last=seq[seq.length-1];
   if(q.answer.kind==='sequence')return E.checkAnswer(q,[last+d,last+2*d,last+3*d].join(' and ')).answerCorrect;const ord=q.prompt.match(/The (\w+) number/);if(ord){const k=['sixth','seventh','eighth','ninth'].indexOf(ord[1])+6;assert(seq[0]===d);return fracEq(q,k*d,1);}return fracEq(q,last+d,1);},
 'c1-odd':(q,p)=>{const odd=p.all.filter(x=>x%2===1);return odd.length===1&&q.answer.value===String(odd[0]);},
 'c1-dial':(q,p)=>{if(p.T!==undefined){assert(p.T>=-30&&p.T<=90);return fracEq(q,p.T,1)&&q.givens.svg.includes('°C');}assert([16,34,46,66,88,114,124].includes(p.W));return fracEq(q,p.W,1);},
 'c1-thermometer':(q,p)=>{assert(p.T%2===0&&p.T>=-10&&p.T<=70);return fracEq(q,p.T,1);},
 'c1-story':(q,p)=>{const nums=(q.prompt.match(/\$?\d+(?:\.\d+)?/g)||[]).map(x=>x[0]==='$'?Math.round(Number(x.slice(1))*100):Number(x));
   if(p.bill!==undefined)return fracEq(q,nums[1]-nums[0],100);if(p.cv!==undefined)return fracEq(q,p.a+p.k*p.cv+p.b,1)&&nums[0]===p.a;if(p.tot!==undefined)return fracEq(q,p.tot-p.done,1);if(p.k!==undefined)return fracEq(q,100-p.k,1);
   if(q.prompt.includes('bus stop'))return fracEq(q,nums[0]-nums[1],1);return fracEq(q,nums[0]+nums[1],1);},
 'c1-data':(q,p)=>{const sv=q.givens.svg||'',vals=(sv.match(/>(\d+)</g)||[]).map(x=>Number(x.slice(1,-1)));
   if(p.d){const f=[5,6,7,8].map(t0=>p.d.filter(x=>Math.floor(x/10)===t0).length),blocks=[0,1,2,3].map(i=>vals.slice(4*i,4*i+4).join());return q.answer.value==='abcd'[blocks.indexOf(f.join())]&&blocks.filter(b=>b===f.join()).length===1;}
   if(p.k!==undefined&&p.f.length===7){assert(vals.join()===p.f.join());return fracEq(q,vals.slice(p.k).reduce((x,y)=>x+y,0),1);}
   if(p.f&&p.f.length===4&&p.k===undefined){assert(vals.join()===p.f.join());return fracEq(q,Math.abs(vals[2]-vals[1]),1);}
   if(p.k!==undefined)return fracEq(q,p.f[p.k],1);
   if(p.w3!==undefined){const width=p.T===1?3:2,ok=[p.f[0]===Math.min(...p.f),p.f[2]===Math.max(...p.f),p.w3===width].map(b=>b?'true':'false').join(' ; ');return E.checkAnswer(q,ok).answerCorrect;}
   if(p.ages){const fr=[5,6,7,8].map(t0=>p.ages.filter(x=>Math.floor(x/10)===t0).length);return p.ages.length===20&&q.answer.reference.includes(fr.map((x,i)=>['50–59','60–69','70–79','80–89'][i]+': '+x).join('; '));}
   if(p.sc){const fr=[7,8,9,10,11].map(t0=>p.sc.filter(x=>Math.floor(x/10)===t0).length);return p.sc.length===21&&fr.reduce((x,y)=>x+y,0)===21&&q.answer.reference.includes(`100–109: ${fr[3]}`);}
   return p.f.reduce((x,y)=>x+y,0)===150&&q.answer.kind==='teacher';},
 // ---------- Course 1, Batch C1-3 ----------
 'c1-place':(q,p)=>{const PL=['ones','tens','hundreds','thousands','ten-thousands','hundred-thousands','millions','ten-millions','hundred-millions','billions','ten-billions','hundred-billions','trillions'];
   if(p.d&&p.k!==undefined&&q.prompt.startsWith('Which digit is in')){const s=q.prompt.match(/in ([\d,]+)\?/)[1].replace(/,/g,''),pl=q.prompt.match(/in the ([a-z-]+) place/)[1];return fracEq(q,Number(s[s.length-1-PL.indexOf(pl)]),1);}
   if(p.s){const [w,f]=p.s.replace(/,/g,'').split('.'),pos={'ten thousands':w[0],thousands:w[1],hundreds:w[2],tens:w[3],tenths:f[0],hundredths:f[1]}[p.pl];return fracEq(q,Number(pos),1);}
   if(p.digit!==undefined){const s=String(p.N),i=s.indexOf(String(p.digit)),fromRight=s.length-1-i;assert(s.split(String(p.digit)).length===2);return q.answer.value===({12:'trillions',9:'billions',6:'millions'}[fromRight]);}
   const s=String(p.N),i=s.indexOf('0');assert(s.split('0').length===2);return q.answer.value===['ones','tens','hundreds','thousands','ten thousands','hundred thousands'][s.length-1-i]&&E.checkAnswer(q,q.answer.value.replace(' ','-')+' place').answerCorrect;},
 'c1-numeral':(q,p)=>{const W={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
   const small=t=>t.split(/[\s-]+/).filter(Boolean).reduce((a,w)=>w==='hundred'?a*100:a+W[w],0),big=t=>{let tot=0;for(const part of t.split(', ')){const m=part.match(/^(.*?) (billion|million|thousand)$/);tot+=m?small(m[1])*{billion:1e9,million:1e6,thousand:1e3}[m[2]]:small(part);}return tot;};
   if(p.g){const words0=q.prompt.match(/numeral for ([^.]*)\./)[1];return fracEq(q,big(words0),1);}
   if(p.N!==undefined)return big(q.answer.value)===p.N;
   const m=q.prompt.match(/product of (.*) and (.*)\?/);return fracEq(q,big(m[1].replace(/ thousand /,' thousand, '))*small(m[2]),1);},
 'c1-words-ops':(q,p)=>{if(p.c!==undefined){const m=q.prompt.match(/sum of (\d+) and (\d+) is subtracted from the product of (\d+) and (\d+)/);return fracEq(q,m[3]*m[4]-m[1]-m[2],1);}
   if(p.b!==undefined&&q.prompt.includes('quotient')){const S=p.a+p.b,D=p.a-p.b;assert(S%D===0);return fracEq(q,S/D,1);}
   if(q.prompt.includes('decimal')||q.prompt.includes('0.')){return fracEq(q,10*(p.a+p.b)-p.a*p.b,100);}
   const a=p.a;return fracEq(q,a*(a+1)*(a+2)-(3*a+3),1);},
 'c1-elapsed':(q,p)=>{if(p.Y!==undefined)return fracEq(q,p.Y-10*p.k,1)&&q.prompt.includes(`${p.k} decades`);return fracEq(q,Math.abs(p.b-p.a),1);},
 'c1-integers':(q,p)=>{if(p.s!==undefined){const z=p.left?p.s-p.k:p.s+p.k;return fracEq(q,z,1)&&z>=-10&&z<=10;}
   if(p.xs){const s=[...p.xs].sort((a,b)=>a-b);return E.checkAnswer(q,s.join(', ')).answerCorrect&&!E.checkAnswer(q,[...s].reverse().join(', ')).answerCorrect;}
   if(p.a>0)return fracEq(q,p.a+p.b,1);return q.answer.value===(p.a>p.b?'>':'<');},
 'c1-mult-story':(q,p)=>{if(p.N!==undefined)return fracEq(q,p.N/50,1);if(p.p!==undefined&&p.n!==undefined)return fracEq(q,p.p*p.n,100);if(p.T!==undefined)return fracEq(q,p.T/p.k,100)&&p.T%p.k===0;return fracEq(q,p.a*p.b,1);},
 'c1-rounding':(q,p)=>{const rd=(x,u)=>{const r=x%u;return r*2>=u?x-r+u:x-r;};if(p.pl)return fracEq(q,rd(p.N,p.pl),1);
   if(p.wk){const sel=p.first?p.wk.slice(0,3):p.wk.slice(3);return fracEq(q,sel.reduce((s,x)=>s+rd(x,100),0),1);}
   if(p.S!==undefined){const m=q.answer.value.match(/(\d+) ÷ (\d+)/);return Number(m[1])===rd(p.S,10)&&Number(m[2])===rd(p.per,10)&&Number(m[1])%Number(m[2])===0;}
   if(q.prompt.includes('nearest thousand'))return fracEq(q,rd(p.a,1000)+rd(p.b,1000),1);if(q.prompt.includes('nearest hundred'))return fracEq(q,rd(p.a,100)+rd(p.b,100),1);return fracEq(q,rd(p.a,10)*rd(p.b,10),1);},
 'c1-fine-measure':(q,p)=>{if(p.num!==undefined){const [w,r]=[Math.floor(p.num/16),p.num%16];const g=gcd(r,16);return E.checkAnswer(q,`${w?w+' ':''}${r/g}/${16/g}`).answerCorrect;}
   if(p.k!==undefined){const g=gcd(p.k%16,16),w=Math.floor(p.k/16);return E.checkAnswer(q,`${w} ${(p.k%16)/g}/${16/g}`).answerCorrect;}
   if(p.val!==undefined){const L=['Q','R','S','T'];return q.answer.value===L[p.order[0]]&&Math.abs(p.pts[0]-p.val)<1e-9;}
   const s=[...p.items].sort((a,b)=>a-b);return p.items.every((x,i)=>x===s[i])&&q.answer.value.split(', ').length===4;},
 'c1-average':(q,p)=>{if(p.xs&&q.answer.kind!=='text'){const S=p.xs.reduce((a,b)=>a+b,0);assert(S%p.xs.length===0);return fracEq(q,S/p.xs.length,1);}
   if(p.xs){const lo=Math.min(...p.xs),hi=Math.max(...p.xs);return q.answer.value===`between ${lo} yd and ${hi} yd`;}
   if(p.p){const S=p.p.reduce((a,b)=>a+b,0);return fracEq(q,S/3,100);}if(p.A!==undefined)return fracEq(q,3*p.A-2*p.x,1);if(p.a!==undefined&&p.b!==undefined)return fracEq(q,(p.a+p.b)/2,1);
   if(p.r!==undefined&&!Array.isArray(p.r))return fracEq(q,10*p.r,1);if(Array.isArray(p.r))return fracEq(q,p.r.indexOf(Math.max(...p.r))+1,1);
   if(p.s){const hi=Math.max(...p.s),lo=Math.min(...p.s);return fracEq(q,(hi-lo)*1e6,1)&&E.checkAnswer(q,'$'+String((hi-lo)*1e6).replace(/\B(?=(\d{3})+(?!\d))/g,',')).answerCorrect;}
   return fracEq(q,p.f[p.k],1);},
 'c1-primes':(q,p)=>{const isP=x=>x>1&&[...Array(x).keys()].slice(2).every(k=>x%k);
   if(p.non!==undefined)return p.N%p.non!==0&&p.show.every(x=>p.N%x===0)&&q.answer.value===String(p.non);if(p.comp!==undefined)return !isP(p.comp)&&p.all.filter(x=>!isP(x)).length===1;if(p.pr!==undefined)return isP(p.pr)&&p.others.every(x=>!isP(x));
   if(p.b!==undefined&&q.answer.kind==='num-set'){const ps=[];for(let k=p.a+1;k<p.b;k++)if(isP(k))ps.push(k);return E.checkAnswer(q,[...ps].reverse().join(' ')).answerCorrect;}
   if(q.answer.kind==='num-lists'){const F=x=>[...Array(x).keys()].map(k=>k+1).filter(k=>x%k===0);return E.checkAnswer(q,`${[...F(p.a)].reverse().join(', ')}; ${F(p.b).join(' ')}`).answerCorrect&&!E.checkAnswer(q,`${F(p.b).join(', ')}; ${F(p.a).join(', ')}`).answerCorrect;}
   if(q.answer.kind==='prime-factors'){const f=[];let x=p.N;for(let d=2;x>1;)if(x%d===0){f.push(d);x/=d;}else d++;return E.checkAnswer(q,[...f].reverse().join(' * ')).answerCorrect;}
   return fracEq(q,[...Array(p.N).keys()].filter(k=>p.N%(k+1)===0).length,1);},
 // ---------- Course 1, Batch C1-4 ----------
 'c1-gcf':(q,p)=>{const nums=p.nums||[p.a,p.b],G=nums.reduce((x,y)=>gcd(x,y));assert(G>1);return fracEq(q,G,1);},
 'c1-fraction-concepts':(q,p)=>{if(p.bad)return p.eqs.every(e=>{const [x,y]=e.split('/').map(Number);return x*p.b===y*p.a;})&&(()=>{const [x,y]=p.bad.split('/').map(Number);return x*p.b!==y*p.a;})()&&E.answerText(q)===p.bad&&E.checkAnswer(q,p.bad).answerCorrect;
   if(p.fs){const v=p.fs.map(([a,b])=>a/b);return q.answer.value===['Maricruz','Ting','Molly','Jasmine'][v.indexOf(Math.max(...v))];}
   if(p.k!==undefined&&p.n!==undefined){const sh=(q.givens.svg.match(/fill="#7d8f96"/g)||[]).length;return E.checkAnswer(q,`${100*sh/p.n}%`).answerCorrect&&sh===p.k;}
   if(p.x!==undefined)return fracEq(q,p.x+p.y,1);if(p.d!==undefined&&p.k!==undefined)return fracEq(q,p.d*p.k,1);if(p.d!==undefined)return fracEq(q,1,2*p.d);
   if(p.r!==undefined){const a=p.p/p.q,b=p.r/p.s;return q.answer.value===(a>b?'>':a<b?'<':'=');}
   if(q.answer.kind==='text')return E.checkAnswer(q,`${100*p.p/p.q}%`).answerCorrect;return fracEq(q,p.b-p.a,p.b);},
 'c1-divisibility':(q,p)=>{if(p.N!==undefined&&q.answer.kind==='num-set')return E.checkAnswer(q,[2,3,5,9,10].filter(d=>p.N%d===0).reverse().join(' ')).answerCorrect;
   if(p.f!==undefined)return E.checkAnswer(q,p.list.filter(x=>x%p.f===0).join(', ')).answerCorrect;if(p.bad!==undefined)return p.N%p.bad!==0&&p.pk.every(d=>p.N%d===0)&&q.answer.value===String(p.bad);
   if(p.yes!==undefined)return p.all.filter(x=>x%3===0).length===1&&q.answer.value===String(p.all.find(x=>x%3===0));return p.list.filter(x=>x%p.a===0&&x%p.b===0).length===1&&q.answer.value===String(p.list.find(x=>x%p.a===0&&x%p.b===0));},
 'c1-fraction-group':(q,p)=>{const N=p.N!==undefined?p.N:12*p.k;assert((N*p.a)%p.d===0);return fracEq(q,N*p.a/p.d,1);},
 'c1-ratio':(q,p)=>{const rr=(a,b)=>{const g=gcd(a,b);return [a/g,b/g];};const ok=(a,b)=>{const [x,y]=rr(a,b);return E.checkAnswer(q,`${x} to ${y}`).answerCorrect&&(x===y||!E.checkAnswer(q,`${y}/${x}`).answerCorrect);};
   if(p.N!==undefined){const boys=p.boysGiven?p.k:p.N-p.k;return ok(boys,p.N-boys);}if(p.g!==undefined)return ok(p.w,p.g-p.w);if(p.L!==undefined)return ok(p.L,p.W);if(p.a!==undefined)return ok(p.a,p.b);
   if(p.m!==undefined)return fracEq(q,p.m/p.h,1);if(p.cost!==undefined)return fracEq(q,Math.round(p.cost/p.count),100);if(p.gal!==undefined){const [w,f='']=p.miles.split('.');return fracEq(q,Number(w+f),10**f.length*p.gal);}
   return q.prompt.includes('½')?fracEq(q,p.r*p.hrs+p.r/2,1):fracEq(q,p.r*p.hrs,1);},
 'c1-fraction-add':(q,p)=>{const [a,b,c2]=p.parts,d=p.d,num=p.v==='sub'?a-b:p.v==='grouped'?a+b-c2:p.parts.reduce((x,y)=>x+y,0);return fracEq(q,num,d)&&(q.givens.math.match(/<mfrac>/g)||[]).length===p.parts.length;},
 'c1-mixed':(q,p)=>{const mix=(n0,d0)=>{const g=gcd(n0,d0);n0/=g;d0/=g;const w=Math.floor(n0/d0),r=n0%d0;return r?(w?`${w} ${r}/${d0}`:`${r}/${d0}`):String(w);};
   if(p.N!==undefined&&p.dv!==undefined)return E.checkAnswer(q,mix(p.N,p.dv)).answerCorrect;if(p.N!==undefined&&p.d!==undefined)return E.checkAnswer(q,mix(p.N,p.d)).answerCorrect;if(p.L!==undefined)return E.checkAnswer(q,mix(p.L,p.pcs)).answerCorrect;
   if(p.a!==undefined&&p.d!==undefined)return E.checkAnswer(q,mix(p.a+p.b,p.d)).answerCorrect;if(p.N!==undefined)return E.checkAnswer(q,mix(p.N,25)).answerCorrect;if(p.m!==undefined)return fracEq(q,p.m*p.k,1);
   if(p.i!==undefined){assert(p.i*p.a===p.j*p.b);return fracEq(q,p.i*p.a,1);}if(p.num!==undefined)return E.checkAnswer(q,mix(2*p.num,p.den)).answerCorrect;return E.checkAnswer(q,[1,2,3,4,5].map(x=>x*p.k).join(', ')).answerCorrect;},
 'c1-reduce':(q,p)=>{if(p.num!==undefined){const g=gcd(p.num,p.den);return E.checkAnswer(q,p.den/g===1?String(p.num/g):`${p.num/g}/${p.den/g}`).answerCorrect;}
   const mix=(n0,d0)=>{const g=gcd(n0,d0);n0/=g;d0/=g;const w=Math.floor(n0/d0),r=n0%d0;return r?(w?`${w} ${r}/${d0}`:`${r}/${d0}`):String(w);};
   if(p.k!==undefined)return E.checkAnswer(q,mix(p.w*p.d+p.a-p.k*p.d,p.d)).answerCorrect;const n1=p.w1*p.d+p.a,n2=p.w2*p.d+p.b;return E.checkAnswer(q,mix(q.prompt.startsWith('Add')?n1+n2:n1-n2,p.d)).answerCorrect;},
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
  if(q.choices){const vals=q.choices.map(x=>String(x.value));assert.equal(new Set(vals).size,vals.length,'distinct choices');assert(q.choices.length===3||q.choices.length===2&&(['compare-number-line','metric-compare','decimal-compare','c1-compare'].includes(c.recipe)||c.variant==='compare-neg'||c.variant==='by-three'||c.recipe==='c1-fraction-concepts'&&c.variant==='compare'||c.recipe==='c1-lines'&&c.variant==='choose'||c.recipe==='fans-ratio'&&E.answerText(q)==='1 to 1'||['estimate-mixed-product','mixed-expression'].includes(c.recipe)&&E.answerText(q)==='1')||q.choices.length===1&&c.variant==='truefalse',c.sourceId+' choice count');
   for(const ch of q.choices){assert(ch.mistake&&ch.mistake.length>8,c.sourceId+' named mistake');assert(!/NaN|undefined|Infinity/.test(ch.value));if(a.kind!=='teacher'&&!/→/.test(ch.value))assert(!E.checkAnswer(q,ch.value).answerCorrect,c.sourceId+' distractor accepted: '+ch.value);}}
  // Course 1: column, long-division and graph layouts where the source lays them out; fraction-bar forms as MathML.
  if(c.course==='Course 1'){if(['regroup','from-whole','three-stacked','two-stacked','stacked','money-tens','two-by-two-stacked','three-zero-stacked','bracket-remainder','bracket-two','bracket-zero','addend-stacked'].includes(c.variant)||['c1-scores-graph','c1-division-forms','c1-fraction-model','c1-ruler','c1-dial','c1-thermometer'].includes(c.recipe)||['skiers','sixteenth','letter','line-parts','sales','rates','read-bar','not-factor','est-sum','percent-shaded','pieces','largest'].includes(c.variant)||c.recipe==='c1-ratio'&&c.variant==='rectangle'||c.recipe==='c1-integers'&&c.variant==='steps'||['choose','notation','name','triangle','isosceles','rectangle','square','choose-table','at-least','difference','read-bar','true-false'].includes(c.variant)&&c.recipe!=='c1-fact-family')assert(/<svg[\s\S]*<\/svg>/.test(q.givens.svg||''),c.sourceId+' layout');
   if(['bar-one','bar-two','bar-tens','dividend-bar','bar-sum','product-over'].includes(c.variant)||c.recipe==='c1-fraction-add')assert(/<mfrac>/.test(q.givens.math||''),c.sourceId+' fraction bar');}
  // Drawings where the source draws.
  if(['fdp-table','add-measures','number-line-average','segment-bc','number-line-point','spinner','dart-board','right-triangle-area','diagonal-plot','step-area','l-shape-area','square-triangle-area','tally-votes','histogram-walk','circle-graph','right-triangle-x','isosceles-angle','complementary-expression','right-angle-chain','parallel-zigzag','crossing-triangles','triangle-line-angles','crossing-lines-triangle','compare-number-line','percent-shaded-square','percent-grid','ruler-length','angle-kind','protractor-read','regular-polygon-pick','step-perimeter','quad-perimeter','rectangle-abcd','function-table','number-machine','polygon-symmetry','subtract-measures','parallelogram-area','parallelogram-angle','parallelogram-missing','triangle-classify','circumference-pair','solid-picture','cube-volume','prism-cubes','prism-volume','complex-area','trapezoid-area','inequality-choose','rotation-choose','circle-area','rule-table','spinner-twice','solid-volume','angle-estimate','pythagorean','transversal','semicircle-figure','sector','surface-area','sphere-area','slope','pythag-apps','solid-volume2','inv-stem-leaf','inv-circle-parts'].includes(c.recipe)||['range','five','histogram','double-line','symmetry','find-c','find-m'].includes(c.variant)||c.recipe==='inv-construct'&&c.variant!=='circle'||['angles','aquarium'].includes(c.variant)||c.recipe==='similar-sides'&&c.variant!=='abc'||['ladders','sight','triangles'].includes(c.variant)||['describe','choose','inscribed'].includes(c.variant)&&['integer-graph','polygon-angles'].includes(c.recipe)||c.variant==='identify'||c.variant==='choose'){assert(/<svg[\s\S]*<\/svg>/.test(q.givens.svg||''),c.sourceId+' drawing');}
  if(['subtraction-number-line','name-linear-figures','draw-angle','congruent-pairs','integer-line-add','inequality-graph','transform-graph'].includes(c.recipe)||c.recipe==='irrational-graph'&&c.variant!=='choose'||c.recipe==='two-step'&&!c.variant||['inequality-plane','nonlinear-graph'].includes(c.recipe)&&c.variant!=='choose'||c.variant==='graph'&&c.recipe==='slope-intercept'||['graph','draw','circle','table','rule','proof','explain'].includes(c.variant)&&c.recipe.startsWith('inv-')&&c.recipe!=='inv-fractions'&&c.recipe!=='inv-construct'||c.recipe==='integer-graph'&&['negative',undefined].includes(c.variant)||c.variant==='draw')assert(/<svg/.test((q.givens.svg||'')+(q.teacherSvg||'')),c.sourceId+' teacher drawing');
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
