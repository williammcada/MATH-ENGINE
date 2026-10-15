// Algebra 1/2 port tasks (coverage programme, parallel courses): independent mathematics, source ranges,
// distractors, drawings and determinism. Owned by the Algebra 1/2 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).
// The oracle for each recipe recomputes the key from the task's own parameters with separate code; it never reads the
// task's answer to build the expected value. Run: node tests/port-algebra-half.cjs [instances per task, default 250]
'use strict';
const assert=require('node:assert/strict');
const H=require('./port-course-harness.cjs');

// ---------- independent helpers (no Engine code) ----------
// The i-th key value equals num/den exactly.
const eq=(q,i,num,den=1)=>{const v=q.answer.values[i];return BigInt(v.numerator)*BigInt(den)===BigInt(Math.round(num))*BigInt(v.denominator);};
const eqs=(q,list)=>q.answer.values.length===list.length&&list.every(([nm,dn],i)=>eq(q,i,nm,dn));
const roundHalfUp=(x,unit)=>Math.floor(x/unit+0.5)*unit;
const ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function say3(x){const h=Math.floor(x/100),r=x%100,out=[];if(h)out.push(ONES[h]+' hundred');if(r)out.push(r<20?ONES[r]:TENS[Math.floor(r/10)]+(r%10?'-'+ONES[r%10]:''));return out.join(' ');}
function say(x){if(x===0)return 'zero';const groups=[[1e9,'billion'],[1e6,'million'],[1e3,'thousand'],[1,'']];const out=[];for(const [v,nm] of groups){const g=Math.floor(x/v)%1000;if(g)out.push(say3(g)+(nm?' '+nm:''));}return out.join(' ');}
const norm=s=>String(s).toLowerCase().replace(/-/g,' ').replace(/[,.;]/g,' ').replace(/\s+/g,' ').trim();
const placeName=['','tenths','hundredths','thousandths','ten thousandths','hundred thousandths'];
const sayDec=(w,f,k)=>(w?say(w)+' and ':'')+say(f)+' '+(f===1?placeName[k].replace(/s$/,''):placeName[k]);
// Rounds a positive number to one nonzero digit.
const lead=x=>{const p=10**Math.floor(Math.log10(x)+1e-12);return Math.round(x/p)*p;};
const near=(a,b)=>Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b));
const num=(q,i)=>Number(q.answer.values[i].numerator)/Number(q.answer.values[i].denominator);
// Perimeter of a polygon from its vertices.
const perim=pts=>pts.reduce((s,p,i)=>{const r=pts[(i+1)%pts.length];return s+Math.hypot(r[0]-p[0],r[1]-p[1]);},0);

// recipe -> (q, parameters) => true when the key is right. Every recipe in the catalog needs one.
const oracle={
 // Batch AH-1
 'ah-place-values3':(q,p)=>p.asked.every(i=>p.digits.filter(x=>x===p.digits[i]).length===1)&&p.asked.every((i,k)=>eq(q,k,p.digits[i]*10**(5-i))),
 'ah-digits-from-places':(q,p)=>{let v=0;for(let pl=1;pl<=p.e;pl++)v+=(pl===p.f?p.b:pl===p.g?p.c:pl===p.h?p.d:p.a)*10**(pl-1);return eq(q,0,v)&&new Set([p.a,p.b,p.c,p.d]).size===4;},
 'ah-place-value-one':(q,p)=>p.digits.filter(x=>x===p.digits[p.o]).length===1&&eq(q,0,p.digits[p.o]*10**(4-p.o)),
 'ah-standard-from-expanded':(q,p)=>eq(q,0,10000*p.d+1000*p.e+100*p.c+10*p.j+p.k),
 'ah-expanded7':(q,p)=>{const terms=q.answer.terms;const sum=terms.reduce((s,[d,pl])=>s+d*Number(pl),0);return sum===Number(p.digits.join(''))&&terms.length===p.digits.filter(Boolean).length&&p.digits.filter(x=>x===0).length===1;},
 'ah-expanded7-choice':(q,p)=>oracle['ah-expanded7'](q,p),
 'ah-number-words':(q,p)=>norm(q.answer.value)===norm(say(p.v)),
 'ah-words-to-digits':(q,p)=>eq(q,0,p.B+p.a+p.b)&&q.prompt.includes(say(p.B)),
 'ah-add3':(q,p)=>eq(q,0,p.a+p.b+p.c),
 'ah-money-add':(q,p)=>eq(q,0,p.A+p.B+p.C,100),
 'ah-column-add4':(q,p)=>eq(q,0,p.b+p.c+p.d+p.e),
 'ah-column-add5d':(q,p)=>eq(q,0,p.a+p.b+p.c),
 'ah-order-line':(q,p)=>JSON.stringify(q.answer.values)===JSON.stringify([...p.a].sort((x,y)=>x-y)),
 'ah-order-six':(q,p)=>p.given.length===6&&JSON.stringify(q.answer.values)===JSON.stringify([...p.given].sort((x,y)=>x-y)),
 'ah-order-five':(q,p)=>p.given.length===5&&JSON.stringify(q.answer.values)===JSON.stringify([...p.given].sort((x,y)=>x-y)),
 'ah-round-big':(q,p)=>eq(q,0,roundHalfUp(p.v,10**(p.j+4))),
 'ah-round-5digit':(q,p)=>eq(q,0,roundHalfUp(p.e,p.f===1?10000:1000)),
 'ah-subtract3':(q,p)=>eq(q,0,p.x-p.y),
 'ah-subtract-column':(q,p)=>eq(q,0,p.x-p.y)&&p.x>p.y,
 'ah-money-subtract-cents':(q,p)=>eq(q,0,p.A-p.B,100),
 'ah-missing-addend':(q,p)=>num(q,0)+p.b===p.a,
 'ah-missing-subtrahend':(q,p)=>p.a-num(q,0)===p.d,
 'ah-missing-minuend':(q,p)=>num(q,0)-p.b===p.d,
 'ah-missing-addend-column':(q,p)=>p.a+num(q,0)===p.c&&p.c%10===0,
 'ah-missing-column-mixed':(q,p)=>p.sub?p.top-num(q,0)===p.bottom:p.top+num(q,0)===p.bottom,
 'ah-multiply-3x2':(q,p)=>eq(q,0,p.a*p.b),
 'ah-multiply-three':(q,p)=>eq(q,0,p.f[0]*p.f[1]*p.f[2]),
 'ah-money-times-tens':(q,p)=>eq(q,0,p.A*p.f,100),
 'ah-money-divide':(q,p)=>near(num(q,0)*p.a,p.B/100),
 'ah-divide-remainder':(q,p)=>q.answer.kind==='quot-rem'?q.answer.q*p.b+q.answer.r===p.c&&q.answer.r>0&&q.answer.r<p.b:eq(q,0,p.c/p.b)&&p.c%p.b===0,
 'ah-missing-factor':(q,p)=>num(q,0)*p.b===p.e,
 'ah-missing-divisor':(q,p)=>p.a/num(q,0)===p.b,
 'ah-missing-dividend':(q,p)=>num(q,0)/p.b===p.a,
 'ah-word-pages':(q,p)=>eq(q,0,p.c-p.b),
 'ah-word-runners':(q,p)=>eq(q,0,p.z-p.x),
 'ah-word-price':(q,p)=>eq(q,0,p.a*1000+p.c+p.b+p.d),
 'ah-word-lengthen':(q,p)=>eq(q,0,p.h-p.a),
 'ah-decimal-words':(q,p)=>norm(q.answer.value)===norm(p.big?sayDec(p.B,p.C,5):sayDec(Math.floor(p.A/1000),p.A%1000,3)),
 'ah-words-to-decimals':(q,p)=>eqs(q,[[p.z1,100],[p.z2,1000]])&&q.prompt.includes(say(Math.floor(p.z1/100))),
 'ah-ten-thousandths':(q,p)=>eq(q,0,p.B*10000+p.c,10000),
 'ah-decimal-add2':(q,p)=>eq(q,0,p.A+p.D,1000),
 'ah-decimal-subtract':(q,p)=>eq(q,0,p.A-p.C,100),
 'ah-decimal-missing-subtrahend':(q,p)=>eq(q,0,p.N1-p.N2,100),
 'ah-decimal-add4':(q,p)=>eq(q,0,p.A+p.B+p.C+p.D,1000),
 'ah-decimal-subtract-choice':(q,p)=>eq(q,0,p.AP-p.CP,1000),
 'ah-round-decimal-place':(q,p)=>eq(q,0,Math.floor(p.N/10**(6-p.k)+0.5),10**p.k),
 'ah-round-two-places':(q,p)=>eq(q,0,Math.floor(p.N/10+0.5),100),
 'ah-decimal-multiply':(q,p)=>eq(q,0,p.AW*p.G,1000),
 'ah-decimal-missing-dividend':(q,p)=>near(num(q,0)/(p.Dt/10),p.e),
 'ah-decimal-multiply-small':(q,p)=>eq(q,0,p.AP*p.BP,1e6),
 'ah-divide-by-hundredths':(q,p)=>near((p.a*p.b/1000)/(p.a/100),num(q,0))&&eq(q,0,p.b,10),
 'ah-divide-by-4-8':(q,p)=>near(num(q,0)*p.a,p.b)&&(10*p.b)%p.a!==0,
 'ah-decimal-missing-factor':(q,p)=>near(p.e*num(q,0),p.Dt*p.e/10),
 'ah-divide-round':(q,p)=>eq(q,0,Math.floor((p.A*p.B*100)/(p.A*1000)+0.5),100),
 'ah-divide-by-tenths':(q,p)=>near((p.A*p.Z/100)/(p.A/10),num(q,0)),
 'ah-estimate-product':(q,p)=>{const x=p.B1/10**p.k1,y=p.B2/10**p.k2;return near(num(q,0),lead(x)*lead(y))&&eq(q,1,p.B1*p.B2,10**(p.k1+p.k2));},
 'ah-estimate-product2':(q,p)=>{const x=p.N1/100,y=p.c/1000;return near(num(q,0),lead(x)*lead(y))&&eq(q,1,p.N1*p.c,1e5);},
 'ah-times-power10':(q,p)=>near(num(q,0),p.a/10**p.b*10**p.c),
 'ah-divide-power10':(q,p)=>near(num(q,0),p.A/100/10**p.c),
 'ah-times-power10-small':(q,p)=>near(num(q,0),p.A/1e6*10**p.c),
 'ah-divide-power10-large':(q,p)=>near(num(q,0),p.A/1000/10**p.b),
 'ah-order-decimals':(q,p)=>{const s=p.v.map(([N,k])=>N/10**k).sort((x,y)=>x-y);return q.answer.values.every(([N,d],i)=>near(N/d,s[i]))&&q.answer.values.length===4;},
 'ah-graph-decimals':(q,p)=>p.pts.length===4&&new Set(p.pts).size===4&&p.pts.every(v=>v>=p.L&&v<=p.L+50)&&q.answer.reference.includes([...p.pts].sort((x,y)=>x-y).map(v=>(v/1000).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')).join(', ')),
 'ah-segment-difference':(q,p)=>eq(q,0,p.ac-p.ab,100),
 'ah-segment-difference-whole':(q,p)=>eq(q,0,p.ac-p.ab),
 'ah-angle-definition':(q,p)=>q.answer.reference.toLowerCase().startsWith(['an acute','an obtuse','a right','a straight'][p.k]),
 'ah-angle-degrees':(q,p)=>p.first?eqs(q,[[180,1],[90,1]]):eqs(q,[[90,1],[180,1]]),
 'ah-classify-angle':(q,p)=>q.answer.value===(p.z<90?'acute':p.z===90?'right':p.z<180?'obtuse':'straight')&&!(p.z>=80&&p.z<=100&&p.z!==90),
 'ah-perimeter-notch':(q,p)=>eq(q,0,perim([[0,0],[p.a,0],[p.a,p.f],[p.a-p.c,p.f],[p.a-p.c,p.f-p.p],[p.c,p.f-p.p],[p.c,p.f],[0,p.f]]))&&p.c*3===p.a,
 'ah-divisibility-lists':(q,p)=>p.ord.every((k,i)=>JSON.stringify([...q.answer.lists[i]].sort((x,y)=>x-y))===JSON.stringify(p.T.filter(x=>x%k===0).sort((x,y)=>x-y))),
 'ah-not-divisible':(q,p)=>{const not=p.shown.filter(x=>x%p.k!==0);return not.length===1&&eq(q,0,not[0]);},
 'ah-divisible-both':(q,p)=>{const both=p.shown.filter(x=>x%p.a===0&&x%p.b===0);return both.length===1&&eq(q,0,both[0]);},
};

// Responses that must be marked wrong for a recipe, beyond the distractors (optional): recipe -> q => [strings].
const wrong={
 'ah-order-line':q=>[q.answer.values.slice().reverse().join(', ')],
 'ah-divisibility-lists':q=>[q.answer.lists.map(l=>l.slice(1).join(', ')).join('; ')],
};

H.run({key:'algebra-half',oracle,wrong,instances:Number(process.argv[2]||250)});
