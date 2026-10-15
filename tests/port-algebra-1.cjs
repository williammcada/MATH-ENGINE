// Algebra 1 port tasks (coverage programme, parallel courses): independent mathematics, source ranges,
// distractors, drawings and determinism. Owned by the Algebra 1 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).
// The oracle for each recipe recomputes the key from the task's own parameters with separate code; it never reads the
// task's answer to build the expected value. Run: node tests/port-algebra-1.cjs [instances per task, default 250]
'use strict';
const assert=require('node:assert/strict');
const H=require('./port-course-harness.cjs');

// ---- independent arithmetic (exact rationals as [numerator, denominator]) ----
const g=(a,b)=>b?g(b,a%b):Math.abs(a);
const Q=(n,d=1)=>{if(d<0){n=-n;d=-d;}const k=g(n,d)||1;return [n/k,d/k];};
const add=(x,y)=>Q(x[0]*y[1]+y[0]*x[1],x[1]*y[1]),sub=(x,y)=>add(x,[-y[0],y[1]]),mul=(x,y)=>Q(x[0]*y[0],x[1]*y[1]),div=(x,y)=>Q(x[0]*y[1],x[1]*y[0]);
const mixed=(w,a,b)=>Q(w*b+a,b);
const is=(part,x)=>part&&part.t==='num'&&part.v[0]*x[1]===x[0]*part.v[1];          // a numeric answer part equals x
const P=(q,i=0)=>q.answer.parts[i];
const between=(x,lo,hi)=>x>=lo&&x<=hi;

// recipe -> (q, parameters) => true when the key is right. Every recipe in the catalog needs one.
const oracle={
 // Batch A1-1
 'a1-mixed-sub':(q,p)=>p.d<p.a&&is(P(q),sub(mixed(p.a,p.b,p.c),mixed(p.d,p.e,p.f)))&&P(q).v[0]>0,
 'a1-mixed-three':(q,p)=>between(p.d,2,5)&&between(p.e,2,5)&&between(p.f,2,5)&&is(P(q),sub(add(mixed(p.d,p.w,p.A),mixed(p.f,p.y,p.C)),mixed(p.e,p.x,p.B)))&&P(q).v[0]>0,
 'a1-improper-add':(q,p)=>p.b%p.a!==0&&p.d%p.c!==0&&p.b>p.a&&p.d>p.c&&is(P(q),add(Q(p.b,p.a),Q(p.d,p.c))),
 'a1-seg-part':(q,p)=>{const AB=mixed(p.cw,p.x,p.A),BC=mixed(p.dw,p.y,p.B);return is(P(q),p.find==='BC'?BC:AB)&&q.prompt.includes('AC is ');},
 'a1-seg-sum':(q,p)=>p.C<=8&&g(p.w,p.C)===1&&is(P(q),add(add(mixed(p.d,p.x,p.A),mixed(p.e,p.y,p.B)),mixed(p.f,p.w,p.C))),
 'a1-angle-defs':(q,p)=>p.k1!==p.k2&&[p.k1,p.k2].every((k,i)=>k==='right'?is(P(q,i),[90,1]):k==='straight'?is(P(q,i),[180,1]):P(q,i).t==='kw'),
 'a1-angle-formed':(q,p)=>P(q).alts.includes(p.k==='two right angles'?'straight angle':'right angle'),
 'a1-classify-angle':(q,p)=>P(q).alts[0]===(p.m<90?'acute':p.m===90?'right':'obtuse')&&between(p.m,30,179),
 'a1-polygon-kind':(q,p)=>P(q).alts[0]===({angles:'equiangular',sides:'equilateral',both:'regular'})[p.k],
 'a1-polygon-name':(q,p)=>P(q).alts[0]===['','','','','','pentagon','hexagon','heptagon','octagon','nonagon','decagon'][p.s],
 'a1-triangle-defs':(q,p)=>P(q,0).t==='kw'&&P(q,1).t==='kw'&&q.prompt.includes(p.s)&&q.prompt.includes(p.a),
 'a1-right-tri-angle':(q,p)=>is(P(q),[180-90-(90-p.a),1])&&between(p.a,25,55),
 'a1-tri-third':(q,p)=>is(P(q),[180-p.a-p.b,1])&&between(p.a,30,50)&&between(p.b,30,50),
 'a1-isosceles-angles':(q,p)=>{const base=(180-p.a)/2;return is(P(q,0),[base,1])&&is(P(q,1),[180-2*base,1])&&between(p.a,96,112);},
 'a1-iso-theorem':(q,p)=>P(q).need[0][0]===(p.p1==='angles'?'side':'angle'),
 'a1-tri-sum':(q)=>is(P(q),[180,1]),
 'a1-right-tri-x':(q,p)=>{const given=p.bottom?p.a:90-p.a;return is(P(q),[90-given,1])&&between(p.a,10,44);},
 'a1-quad-defs':(q,p)=>p.k1!==p.k2&&P(q,0).t==='kw'&&P(q,1).t==='kw',
 'a1-quad-name':(q,p)=>P(q).alts[0]===p.k,
 'a1-quad-best':(q,p)=>P(q).alts[0]===p.k,
 'a1-square-side':(q,p)=>is(P(q),[p.s,1])&&q.prompt.includes(String(4*p.s)),
 'a1-rect-perimeter':(q,p)=>is(P(q),[p.a+p.a+p.b+p.b,1]),
 'a1-step-perimeter':(q,p)=>{// walk the outline and add the side lengths
  const pts=[[0,0],[0,p.L],[p.tp,p.L],[p.tp,p.L-p.dn],[p.t2,p.L-p.dn],[p.t2,0]];let s=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];s+=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);}return is(P(q),[s,1]);},
 'a1-notch-perimeter':(q,p)=>{const a=p.a,b=p.b,c=Math.floor(a/3),d=Math.round(a/2),notch=q.givens.parameters&&/step of/.test(q.givens.svg);
  // the vertical sides and horizontal sides of a rectilinear outline
  const pts=notch?[[0,0],[a,0],[a,a-b],[a-1,a-b],[a-1,c],[1,c],[1,d],[0,d]]:[[0,0],[a,0],[a,a-b],[a-b,a-b],[a-b,d],[d,d],[d,c],[0,c]];let s=0;for(let i=0;i<pts.length;i++){const u=pts[i],w=pts[(i+1)%pts.length];s+=Math.abs(u[0]-w[0])+Math.abs(u[1]-w[1]);}return is(P(q),[s,1]);},
 'a1-poly-perimeter':(q,p)=>is(P(q),[p.sides.reduce((s,x)=>s+x,0),1])&&p.sides.every(x=>x>0),
 'a1-circumference':(q,p)=>{const v=q.givens.recipe&&q.prompt;if(/radius of a circle is/.test(v))return is(P(q),Q(2*314*p.a,100));if(/diameter of a circle is/.test(v))return is(P(q),Q(314*p.a,100));return is(P(q),[p.k==='radius'?p.a/2:p.a,1]);},
 'a1-semi-perim':(q,p)=>{const part=P(q);const straight=p.shape==='both'?2*p.b:2*p.b+2*p.a,curve=p.shape==='both'?2*p.a:p.a;return part.t==='pi'&&part.a[0]===straight&&part.b[0]===curve;},
 'a1-natural':(q,p)=>P(q).alts[0]===(p.k==='natural'?'counting':'natural'),
 'a1-frac-prod3':(q,p)=>is(P(q),mul(mul(Q(p.a1,p.a),Q(p.b1,p.b)),Q(p.c1,p.c)))&&g(p.a*p.b*p.c,p.a1*p.b1*p.c1)>1,
 'a1-mixed-prod3':(q,p)=>{const x=mul(mul(mixed(p.a,p.b,p.c),mixed(p.d,p.e,p.f)),mixed(p.g,p.i,p.h));return is(P(q),x)&&x[1]<=99;},
 'a1-mixed-div':(q,p)=>is(P(q),div(Q(p.a*p.b,p.c),Q(p.a*p.a,p.d))),
 'a1-complex-frac':(q,p)=>is(P(q),div(Q(p.a,p.b),Q(p.c,p.d))),
 'a1-frac-prod-cancel':(q,p)=>{const e=p.x===1?0:1,f=1-e,h=p.b**e*p.d**f*p.g,i=p.b*p.d*(p.g+1);return is(P(q),mul(mul(Q(p.a,p.b),Q(p.c,p.d)),Q(h,i)));},
 'a1-op-names':(q,p)=>{const r={addition:'sum',subtraction:'difference',multiplication:'product',division:'quotient'};return p.o?P(q).alts[0]===r[p.o]:P(q,0).alts[0]===r[p.o1]&&P(q,1).alts[0]===r[p.o2];},
 'a1-dec-div':(q,p)=>is(P(q),div(Q(p.a*p.b,10000),Q(p.a,10000))),
 'a1-dec-mul':(q,p)=>is(P(q),mul(Q(p.d,10**p.a),Q(p.b,10**p.c)))&&p.a!==p.c,
 'a1-dec-sub':(q,p)=>is(P(q),sub(add([p.a,1],Q(p.b,100)),add([p.c,1],Q(p.d,1000)))),
 'a1-dec-add':(q,p)=>is(P(q),add(add([p.a,1],Q(p.d,100)),add([p.b,1],Q(p.c,1000)))),
 'a1-unit-chain':(q,p)=>{// inches per unit, from 1 in. = 2.54 cm exactly
  const IN={inches:[1,1],feet:[12,1],yards:[36,1],miles:[63360,1],centimeters:[100,254],meters:[10000,254],kilometers:[10000000,254]};const [u1,u2]=q.prompt.match(/convert \d+ (\w+) to (\w+)/).slice(1);
  return P(q).t==='chain'&&P(q).start===p.b&&near(P(q).v[0]/P(q).v[1],p.b*(IN[u1][0]/IN[u1][1])/(IN[u2][0]/IN[u2][1]));},
 'a1-sets':(q)=>['natural','whole','integers'].every((s,i)=>P(q,i).set===s),
 'a1-set-name':(q,p)=>P(q).alts[0]===(p.k==='integers'?'integers':p.k+' numbers'),
 'a1-abs':(q,p)=>{if(p.s!==undefined){const inner=p.s===1?p.a-p.b:p.a+p.b;return inner<=0&&is(P(q),[-inner,1]);}if(p.kind==='decimal')return is(P(q),Q(p.a,10));return is(P(q),[p.a<0?-p.a:p.a,1]);},
 'a1-name':(q)=>P(q).t==='kw'&&P(q).need[0].length>=1,
 'a1-signed-sum':(q,p)=>is(P(q),[p.a+p.b,1]),
 'a1-three-sum':(q,p)=>is(P(q),[p.a+p.b+p.c,1])&&p.a+p.b+p.c!==0,
 'a1-seven-sum':(q,p)=>is(P(q),[p.terms.reduce((s,x)=>s+x,0),1])&&p.terms.length===7,
 'a1-abs-ops':(q,p)=>{const [t1,t2,t3,t4]=p.signs,inner=p.a+t2*p.b;return is(P(q),[t1*(inner<0?-inner:inner)+t3*p.c+t4*p.d,1]);},
 // Batch A1-2
 'a1-nested':(q,p)=>{const f=p.f0,a=p.a,b=p.b;let z;
  if(p.e!==undefined){const ab=[(p.d-p.e+p.f),(p.d-p.e-p.f)];z=[a-b+p.c+Math.abs(ab[0]),a-b-p.c+Math.abs(ab[0]),a-b+p.c+Math.abs(ab[1]),a-b-p.c+Math.abs(ab[1])][f-1];}
  else if(p.d!==undefined)z=[a-b+p.c-p.d,a-b-p.c-p.d,a-b+p.c+p.d,a-b-p.c+p.d][f-1];
  else if(p.c!==undefined)z=[a+b+p.c,a-b+p.c,a+b-p.c,-a-b+p.c][f-1];
  else z=[b-a,b-a,-a-b,-a-b][f-1];return is(P(q),[z,1]);},
 'a1-sq-area':(q,p)=>is(P(q),[p.n**2,1]),
 'a1-rect-length':(q,p)=>is(P(q),[p.a,1])&&q.prompt.includes(String(p.a*p.b)),
 'a1-step-area':(q,p)=>{// shoelace area of the outline
  const pts=[[0,0],[0,p.L],[p.tp,p.L],[p.tp,p.L-p.dn],[p.t2,p.L-p.dn],[p.t2,0]];let A=0;for(let i=0;i<pts.length;i++){const u=pts[i],w=pts[(i+1)%pts.length];A+=u[0]*w[1]-w[0]*u[1];}return is(P(q),[Math.abs(A)/2,1]);},
 'a1-frame-area':(q,p)=>is(P(q),[p.a*p.b-(p.a-p.d)*(p.b-p.d),1])&&p.d>=Math.round(p.a/3)&&p.d<=Math.round(p.a/2),
 'a1-rect-area-mc':(q,p)=>is(P(q),[p.a*p.b,1]),
 'a1-right-tri-area':(q,p)=>is(P(q),Q(p.f*p.g,2)),
 'a1-tri-area-alt':(q,p)=>is(P(q),Q(2*p.a*p.b,2)),
 'a1-rect-tri-area':(q,p)=>is(P(q),add([p.a*p.b,1],Q(p.a*p.c,2))),
 'a1-cut-tri-area':(q,p)=>is(P(q),sub([p.a*p.b,1],Q((p.a-p.d)*(p.b-p.d),2))),
 'a1-tri-area-text':(q,p)=>is(P(q),Q(p.b*p.c,2))&&p.c%2===0,
 'a1-triple-area':(q,p)=>p.f**2+p.g**2===p.e**2&&is(P(q),Q(p.f*p.g,2)),
 'a1-circle-two':(q,p)=>p.form==='from-c'?is(P(q,0),[p.k==='radius'?p.a/2:p.a,1])&&is(P(q,1),Q(314*(p.a/2)**2,100)):is(P(q,0),Q(2*314*p.a,100))&&is(P(q,1),Q(314*p.a*p.a,100)),
 'a1-circle-area':(q,p)=>is(P(q),Q(314*p.a*p.a,100)),
 'a1-semi-area':(q,p)=>{const x=P(q);return x.t==='pi'&&x.a[0]*x.a[1]**0===2*p.a*p.b&&near(x.b[0]/x.b[1],p.a*p.a/2);},
 'a1-tri-semi-area':(q,p)=>{const x=P(q);return near(x.a[0]/x.a[1],p.a*p.b/2)&&near(x.b[0]/x.b[1],p.a*p.a/2);},
 'a1-incircle':(q,p)=>{const x=P(q);return near(x.a[0]/x.a[1],p.xs*p.ys/2)&&near(x.b[0]/x.b[1],-p.r*p.r);},
 'a1-diamond-circle':(q,p)=>is(P(q),[Math.round(100*(p.a*p.a-Math.PI*p.b*p.b)),100]),
 'a1-trap-right':(q,p)=>is(P(q),Q(p.c*(p.a+p.b),2))&&p.d===Math.round(Math.hypot(p.c,p.b-p.a)),
 'a1-trap-iso':(q,p)=>is(P(q),Q(p.c*(p.a+p.b),2)),
 'a1-trap-semi':(q,p)=>{const x=P(q);return near(x.a[0]/x.a[1],p.b*(2*p.a+2*p.a+p.b)/2)&&near(x.b[0]/x.b[1],-p.a*p.a/2);},
 'a1-trap-circle':(q,p)=>{const x=P(q);return near(x.a[0]/x.a[1],p.c*(p.a+p.b)/2)&&near(x.b[0]/x.b[1],-((p.c/2)**2));},
 'a1-circle-trap':(q,p)=>{const x=P(q);return p.d===Math.round(2*Math.sqrt(p.a**2-p.b**2))&&near(x.a[0]/x.a[1],-p.d*(p.b+2*p.b)/2)&&near(x.b[0]/x.b[1],p.a*p.a);},
 'a1-para-shaded':(q,p)=>{const x=P(q),L=p.a+p.b+p.c,hh=2*p.a+2*p.d;return near(x.a[0]/x.a[1],L*hh-p.b*2*p.a/2)&&near(x.b[0]/x.b[1],-p.a*p.a/2);},
 'a1-trap-mc':(q,p)=>is(P(q),Q(p.d*(2*p.a+2*p.b),2))&&p.d<p.c,
 'a1-mul-signed':(q,p)=>is(P(q),[p.a*p.b,1])&&!(p.a>0&&p.b>0),
 'a1-inverse-op':(q,p)=>P(q).alts[0].startsWith(['Subtract','Add','Divide by','Multiply by'][p.k-1]+' ')&&P(q).alts[1].endsWith(' '+Math.abs(p.n))||P(q).alts[1].endsWith(' '+p.n),
 'a1-inverse-names':(q,p)=>P(q,0).alts[0]===(p.o1==='addition'?'subtraction':'addition')&&P(q,1).alts[0]===(p.o2==='division'?'multiplication':'division'),
 'a1-div-signed':(q,p)=>is(P(q),Q(-p.b*p.a,p.a)),
 'a1-sign-rules':(q,p)=>P(q,0).alts[0]===(p.s1==='the same sign'?'positive':'negative')&&P(q,1).alts[0]===(p.s2==='the same sign'?'positive':'negative'),
 'a1-zero-div':(q,p)=>{const N=p.d+p.b+p.c,D=p.g+p.f+p.e,w=N===0&&D===0?'Indeterminate':D===0?'Undefined':N===0?'0':null;return w!==null&&P(q).alts[0]===w;},
 'a1-mul4':(q,p)=>is(P(q),[p.a*p.b*p.c*p.e,1]),
 'a1-area-chain':(q,p)=>{const IN={inches:1,feet:12,yards:36,meters:100/2.54,centimeters:1/2.54,kilometers:100000/2.54};const [u1,u2]=q.prompt.match(/square (\w+) to square (\w+)/).slice(1);
  return P(q).t==='chain'&&P(q).start===p.b&&near(P(q).v[0]/P(q).v[1],p.b*(IN[u1]/IN[u2])**2)&&P(q).min===({two:2,four:4,six:6})[q.prompt.match(/Use (\w+) unit/)[1]];},
 'a1-recip':(q,p)=>{const F=[[p.b,1],[1,p.b],[-p.b,1],[-1,p.b]],r=([x,y])=>Q(y,x);return p.c2===undefined?is(P(q),r(F[p.c1])):p.c1!==p.c2&&is(P(q,0),r(F[p.c1]))&&is(P(q,1),r(F[p.c2]));},
 'a1-zero-recip':(q)=>P(q).t==='kw'&&P(q).need[0].includes('zero'),
 'a1-ops':(q,p)=>is(P(q),[{sum:p.a+p.b*p.c-p.d,mc:p.d*p.e-p.b*p.c+p.a,four:p.a*p.b+p.c*p.d+p.e-p.f,mc2:p.c*p.d-p.a*p.b+p.c}[p.form],1]),
 'a1-incl':(q,p)=>{const F={paren:()=>p.a-p.b*(p.c+p.s*p.d),'dist-mc':()=>p.a*(p.b+p.c),'two-groups':()=>p.a*(p.b+p.c)-p.d*(p.e-p.f),prod:()=>p.a*(p.b+p.c)*(p.d+p.e)+p.f,'frac-add':()=>p.a+p.b/p.c+p.s*p.d,
   frac1:()=>Q(p.a+p.b+p.c+p.d,p.e+p.s*p.f),frac2:()=>Q(p.i*(p.a+p.b)+p.c+p.d,p.e+p.s*p.j*p.f),frac3:()=>Q(p.a+p.b+p.c*p.d,p.e*p.i+p.s*p.j*p.f),'abs-mix':()=>p.a*p.b+p.s*(p.c+p.d)*(p.e+p.f)+Math.abs(p.g+p.h+p.i),'neg-paren':()=>-p.a-p.b*(p.c-p.d)}[p.form]();
  return is(P(q),Array.isArray(F)?F:[F,1]);},
};
const near=(x,y)=>Math.abs(x-y)<=1e-9*Math.max(1,Math.abs(y));

// Responses that must be marked wrong for a recipe, beyond the distractors (optional): recipe -> q => [strings].
const wrong={
 'a1-semi-perim':q=>{const p=P(q);return [String((p.a[0]+Math.PI*p.b[0]).toFixed(2)),`${p.a[0]+p.b[0]}π`];},
 'a1-unit-chain':q=>[String(P(q).v[0]/P(q).v[1])],                                       // the bare converted number
 'a1-sets':()=>['{1, 2, 3}; {0, 1, 2}; {-1, 0, 1}'],
 'a1-zero-div':q=>P(q).alts[0]==='0'?['Undefined','1']:['0','1'],
 'a1-area-chain':q=>[String(P(q).v[0]/P(q).v[1])],
};

H.run({key:'algebra-1',oracle,wrong,instances:Number(process.argv[2]||250)});
