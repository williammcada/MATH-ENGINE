// Algebra 1 port tasks (coverage programme, parallel courses): independent mathematics, source ranges,
// distractors, drawings and determinism. Owned by the Algebra 1 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).
// The oracle for each recipe recomputes the key from the task's own parameters with separate code; it never reads the
// task's answer to build the expected value. Run: node tests/port-algebra-1.cjs [instances per task, default 250]
'use strict';
const assert=require('node:assert/strict');
const H=require('./port-course-harness.cjs');
const S=require('../src/port-shared.js');

// ---- independent arithmetic (exact rationals as [numerator, denominator]) ----
const g=(a,b)=>b?g(b,a%b):Math.abs(a);
const Q=(n,d=1)=>{if(d<0){n=-n;d=-d;}const k=g(n,d)||1;return [n/k,d/k];};
const add=(x,y)=>Q(x[0]*y[1]+y[0]*x[1],x[1]*y[1]),sub=(x,y)=>add(x,[-y[0],y[1]]),mul=(x,y)=>Q(x[0]*y[0],x[1]*y[1]),div=(x,y)=>Q(x[0]*y[1],x[1]*y[0]);
const mixed=(w,a,b)=>Q(w*b+a,b);
const is=(part,x)=>part&&part.t==='num'&&part.v[0]*x[1]===x[0]*part.v[1];          // a numeric answer part equals x
const P=(q,i=0)=>q.answer.parts[i];
const between=(x,lo,hi)=>x>=lo&&x<=hi;
// a polynomial part equals the given terms [[coef, {letter: exponent}], ...] after combining like terms
const polyIs=(part,list)=>{if(!part||part.t!=='poly')return false;const w={};for(const [c,m] of list){const k=Object.keys(m).filter(l=>m[l]).sort().map(l=>l+m[l]).join('');w[k]=(w[k]||0)+c;}for(const k of Object.keys(w))if(!w[k])delete w[k];
 return Object.keys(w).length===Object.keys(part.terms).length&&Object.entries(w).every(([k,c])=>part.terms[k]===c);};

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
 // Batch A1-3
 'a1-incl2':(q,p)=>is(P(q),[p.form==='bracket'?p.a*(p.b+p.c)+p.d:(p.a*p.b)/p.b+(p.c*p.d-(p.a+(p.c+1))),1]),
 'a1-order-big':(q,p)=>is(P(q),[p.a*(p.b*p.d-(p.c*p.d)/p.d)+p.e*p.f,1]),
 'a1-sign-count':(q,p)=>P(q).alts[0]===((-1)**p.a>0?'positive':'negative'),
 'a1-sign-products':(q,p)=>{const sgnOf=L=>L.reduce((x,y)=>x*Math.sign(y),1);const pos=[p.P1,p.P2,p.P3].filter(L=>sgnOf(L)>0).length;return is(P(q),[p.np==='positive'?pos:3-pos,1]);},
 'a1-eval':(q,p)=>{const a=p.a,b=p.b,c=p.c,s=p.s;const z={'xy+ax':()=>s===1?b*c+a*b:b*c-a*c,'w-sum':()=>s===1?-a*(b+c):-a*(b-c),'w-mix':()=>-a*(-b+c)-b*c,'diff-sq':()=>s===1?-(c+b)*(c-b):-(b-c)*(b+c),bracket:()=>s===1?-a*((b-c)-(a-c)):-a*((b-c)-(b+c)),'bracket-mc':()=>s===1?-b*(-b*(c+b)):-c*(-b*(b-c)),mc:()=>s===1?a*b+c:a*b-c}[p.form]();return is(P(q),[z,1]);},
 'a1-cyl':(q,p)=>{const x=P(q);return x.a[0]===0&&near(x.b[0]/x.b[1],p.form==='sa'?2*p.a*p.a+2*p.a*p.b:p.a*p.a*p.b);},
 'a1-box-sa':(q,p)=>is(P(q),[2*(p.a*p.b+p.b*p.c+p.a*p.c),1]),
 'a1-tri-prism':(q,p)=>{const tri=p.form==='iso'?[2*p.a,p.c,p.d,p.d]:[p.a,p.c,p.a,p.c,p.d];// iso: base 2a, height c, sides d,d; right: legs a,c, hypotenuse d
  const area=p.form==='iso'?2*p.a*p.c/2:p.a*p.c/2,perim=p.form==='iso'?2*p.a+2*p.d:p.a+p.c+p.d;return p.a**2+p.c**2===p.d**2&&is(P(q),[2*area+perim*p.b,1]);},
 'a1-solid-base':(q,p)=>{const x=P(q),f=p.form;
  if(f==='halfdisk-sa'){const base=Math.PI*(p.a**2+p.b**2)/2,per=Math.PI*(p.a+p.b)+2*(p.b-p.a);return near(x.a[0]/x.a[1]+Math.PI*x.b[0]/x.b[1],2*base+per*p.c);}
  if(f==='l-sa'||f==='l-vol'){const area=p.a*p.b+(p.a-p.c)*(p.a-p.b);return is(x,[f==='l-sa'?2*area+4*p.a*p.d:area*p.d,1]);}
  if(f==='semitrap-sa'){const base=p.a*(p.d+p.b+p.d)+Math.PI*p.a*p.a/2,per=p.d+(p.b+p.d)+Math.hypot(2*p.a,p.b)+Math.PI*p.a;return x.t==='exact'&&near(x.v,2*base+per*p.c);}
  if(f==='trap-vol')return is(x,Q(p.c*(p.a+p.b)*p.d,2));
  if(f==='semitri-vol')return near(x.a[0]/x.a[1]+Math.PI*x.b[0]/x.b[1],(p.a*p.b+Math.PI*p.a*p.a/2)*p.c);
  if(f==='semirect-vol')return near(x.a[0]/x.a[1]+Math.PI*x.b[0]/x.b[1],(2*p.a*p.b+Math.PI*p.a*p.a/2)*p.c);
  if(f==='area-vol')return is(x,[p.a*p.a*p.b,1]);
  return is(x,Q(p.a*p.b*p.c,2));},
 'a1-dist-law':(q)=>P(q).alts.includes('x(y+z)=xy+xz'),
 'a1-distribute':(q,p)=>{const k=v=>[...v].sort().join('1')+'1';const t=P(q).terms;if(p.form==='four'){const [pp,w,x,y]=p.L;return t[k(pp+w)]===p.a*p.b&&t[k(pp+x)]===p.a*p.c&&t[k(pp+y)]===p.a*p.d;}const [w,x,y]=p.L;return t[k(w+x)]===p.s*p.b&&t[k(w+y)]===p.s*p.c;},
 'a1-like':(q,p)=>{const key=s=>[...s].sort().join(''),like=p.items.filter(([,s])=>p.items.filter(([,s2])=>key(s2)===key(s)).length>1),labs=like.map(x=>'abcde'[p.items.indexOf(x)]);
  if(p.form==='count')return P(q).alts[0]===(labs.length?String(labs.length):'none');return labs.length===P(q).items.length&&labs.every(x=>P(q).items.includes(x));},
 'a1-combine':(q,p)=>{const t=P(q).terms,v=Object.values(t).sort((x,y)=>x-y);const want=p.form==='xy'?[p.b+p.c+p.d+p.e,p.a+p.f]:p.form==='xy3'?[p.e+p.f,p.a+p.c+p.h,p.b+p.d]:[p.a+p.c,p.b+p.d];return JSON.stringify(v)===JSON.stringify(want.filter(x=>x).sort((x,y)=>x-y));},
 'a1-power':(q,p)=>is(P(q),[Math.pow(p.a,p.b),1]),
 'a1-neg-power':(q,p)=>is(P(q),[p.form==='neg'?-Math.pow(p.a,p.b):Math.pow(-p.a,p.b),1]),
 'a1-power-mix':(q,p)=>{const v=p.v;const z={string:()=>-v[0]-v[1]-v[2]-Math.abs(v[3]-v[4]),pair:()=>-v[0]+v[1],roots:()=>-v[0]-v[1]-v[2]+v[3]-v[4],rootpair:()=>v[0]+v[1]}[p.form]();return is(P(q),[z,1]);},
 'a1-cube-root':(q,p)=>is(P(q),[Math.round(Math.cbrt(p.a**3)),1])&&Math.abs(p.a)>=2&&Math.abs(p.a)<=5,
 'a1-eval-pow':(q,p)=>{const f=p.form;let z;if(f==='three')z=p.av**p.b-p.av**p.c-p.av**p.d;else if(f==='a3b')z=p.av**3*p.bv*(p.av+p.s*p.bv);else if(f==='mix')z=-(p.av**2)+p.bv*(p.av+p.s*p.bv)-p.s*p.cv**2;else if(f==='abs')z=-(p.av**3)+p.s*p.bv*(p.av-p.s*p.bv)+Math.abs(p.bv-p.av);
  else if(f==='prod')z=(-p.e*p.av-p.bv**2)*(-p.bv-p.av)*(p.f*p.av);else if(f==='abc')z=[p.av*p.bv*p.cv**3,p.av**3*p.bv*p.cv,p.av*p.bv**3*p.cv][p.sw-1];else if(f==='sq')z=p.av**2-p.bv**2;else z=p.a**2+5*p.b-p.c;return is(P(q),[z,1]);},
 // Batch A1-4
 'a1-prod-rule':(q,p)=>{const E=[0,0,0];for(const [l,e] of p.fs)E[p.L.indexOf(l)]+=e;const t=P(q).terms,k=p.L.filter((l,i)=>E[i]).map(l=>l+E[p.L.indexOf(l)]).join('');return Object.keys(t).length===1&&t[k]===1;},
 'a1-like-exp':(q,p)=>{const t=P(q).terms,[A,B,C]=p.L;
  if(p.form==='split'){const k=[[A,p.e1],[B,p.e2]].filter(([,e])=>e).sort().map(([l,e])=>l+e).join('');return t[k]===p.cs.reduce((x,y)=>x+y,0)&&Object.keys(t).length===1;}
  if(p.form==='split3'){const k=[[A,p.ex1],[B,p.ex2]].filter(([,e])=>e).sort().map(([l,e])=>l+e).join('');return t[k]===p.cs.reduce((x,y)=>x+y,0)&&Object.keys(t).length===1;}
  const k=[[A,p.e1],[B,p.e2],[C,1]].filter(([,e])=>e).sort().map(([l,e])=>l+e).join(''),[c1,c2,c3,c4]=p.co;
  return p.form==='pos'?t[k]===c1+c2+c3&&t[C+'1']===c4:t[k]===c1+c2+c3+c4;},
 'a1-like-xy-mc':(q,p)=>{const t=P(q).terms;return t['x'+p.g+'y1']===p.b+p.d&&t['x1y1']===p.c+p.e&&t['']===p.a+p.f;},
 'a1-cond':(q,p)=>is(P(q),[p.form==='mc'?p.c-p.b:-p.b,1]),
 'a1-add-eq':(q,p)=>{if(p.form==='frac'){const F1=Q(p.g*p.b+p.a,p.b),F2=Q(p.e*p.d+p.c,p.d);return is(P(q),p.f===1?add(F2,F1):sub(F2,F1));}return is(P(q),[p.s<0?p.a+p.b:p.a-p.b,1]);},
 'a1-mul-eq':(q,p)=>p.form==='div'?is(P(q),[p.i*p.b,1]):is(P(q),Q(p.a,p.b)),
 'a1-two-step':(q,p)=>p.form==='mc'?is(P(q),Q(p.a*p.b+p.c-p.c,p.b)):is(P(q),Q(p.a*p.c+p.b-p.b,p.a)),
 'a1-collect':(q,p)=>is(P(q),Q(p.e+p.h-p.b-p.d,p.a+p.c-p.f-p.g)),
 'a1-dist-exp':(q,p)=>{const t=P(q).terms;if(p.form==='mc')return t['x1y'+(p.a+2)]===p.c&&t['x1y'+p.a]===p.b;const [i,j]=p.L;return t[i+(p.e+1)+j+'3']===p.a&&t[i+(p.e+2)+j+'2']===p.b;},
 'a1-dec-eq':(q,p)=>{if(p.form==='one')return is(P(q),Q(p.A[0],p.A[1]));const lhs=x=>add(sub(mul(Q(p.a,10),x),Q(p.b,100)),mul(Q(p.c,10),x));const D=Q(p.D[0],p.D[1]),rhs=lhs(D);return is(P(q),D)&&lhs(Q(P(q).v[0],P(q).v[1]))[0]*rhs[1]===rhs[0]*lhs(Q(P(q).v[0],P(q).v[1]))[1];},
 'a1-frac-of':(q,p)=>is(P(q),Q(p.a,p.b)),
 'a1-frac-what':(q,p)=>is(P(q),p.form==='frac'?div(Q(p.c,p.e),Q(p.a,p.b)):div([p.c,1],Q(p.a,p.b))),
 'a1-funcnot':(q,p)=>{const f={lin:()=>p.c*p.b+p.d,lin2:()=>p.d+p.c*p.b,cubic:()=>p.a*p.a*p.a+p.a*p.a+p.a,quad:()=>p.a*p.d*p.d+p.c,neg:()=>-p.c*(p.a+p.s*p.c),root:()=>-p.a,mc:()=>p.c*p.c+p.a*p.c+p.b}[p.form];
  if(p.form==='recip'){const x=p.k===1?Q(-p.a,p.b):Q(-p.b,p.a);return is(P(q),div([-1,1],x));}return is(P(q),[f(),1]);},
 'a1-dist-negexp':(q,p)=>{const t=P(q).terms,[I,J]=p.L,k=(o)=>Object.entries(o).filter(([,e])=>e).sort().map(([l,e])=>l+e).join('');
  if(p.form==='zero'){const cf=p.k===1?p.c:1,ei=p.k===1?-2:0,ej=p.k===1?0:-2;return t[k({[I]:1+ei,[J]:2+ej})]===p.a*cf&&t[k({[I]:2+ei,[J]:1+ej})]===p.b*cf;}
  return t[k({[I]:p.e+p.m,[J]:5})]===p.a*p.c&&t[k({[I]:p.e+2,[J]:3+p.k})]===p.b*p.c;},
 'a1-neg-exp-mc':(q,p)=>{const t=P(q).terms,d=p.a+p.b+p.c;return Object.keys(t).length===1&&t['a'+d]===1;},
 'a1-zero-exp':(q,p)=>{const f=p.form;if(f==='three'){const v=p.B**p.e;return is(P(q,0),[v,1])&&is(P(q,1),Q(1,v))&&is(P(q,2),[1,1]);}
  if(f==='mix'){const want=[-(p.a**2),p.a**2,1,Math.abs(-p.a+p.dS*p.a)].sort((x,y)=>x-y).join();return p.vals.slice().sort((x,y)=>x-y).join()===want&&is(P(q),[p.vals[0]+p.signs[0]*p.vals[1]+p.signs[1]*p.vals[2]+p.vals[3],1]);}
  if(f==='eval')return is(P(q),[p.k===1?p.av*(p.bv-1)*(-p.e*p.bv-p.f*p.av):p.av*(1-p.av)*(-p.e*p.bv-p.f*p.av),1]);
  return is(P(q),p.k===1?Q(1,p.b**p.y):Q(1,p.a**p.x));},
 'a1-phrases':(q,p)=>{const x=1.7;const ok=(i,y)=>near(P(q,i).samples.find(([e])=>Math.abs(e.N-2.7)<1e-9)[1],y(2.7));
  if(p.form==='mc')return p.k===1?ok(0,n=>-p.e*n+p.a):ok(0,n=>p.b*(p.e*n+p.a));return ok(0,n=>-p.e*n+p.a)&&ok(1,n=>p.b*(p.c*n+p.d));},
 'a1-dec-of':(q,p)=>is(P(q),p.form==='what'?Q(60*p.b,p.a):p.form==='times'?Q(p.a*p.b,100000):[10*p.a,1]),
 'a1-paren-eq':(q,p)=>{// substitute the key back into the equation (both sides as exact rationals)
  const z=Q(...P(q).v),Z=x=>mul(z,[x,1]),k=x=>[x,1],f=p.form;let L,R;
  if(f==='354'){L=sub(Z(p.a),mul(k(p.b),add(Z(p.c),k(p.d))));R=add(Z(p.e),k(p.f));}
  else if(f==='355'){L=sub(z,mul(k(p.a),sub(z,k(p.b))));R=sub(k(p.f),add(Z(p.d),k(p.e)));}
  else if(f==='356'){L=add(mul(k(p.a),sub(k(p.b),z)),mul(k(p.c),sub(z,k(p.d))));R=mul(k(-1),sub(Z(p.e),k(p.f)));}
  else if(f==='357'){L=k(-(p.a**2)-p.b**2);R=mul(k(-p.c),sub(Z(-p.d),k(p.e)));}
  else if(f==='358'){L=add(mul(k(-1),add(z,k(p.a))),mul(k(p.b),add(z,k(p.c))));R=k(p.K);}
  else if(f==='359'){L=add(mul(Q(p.b,10),z),Q(10*p.d*p.c-p.a*(10*p.d+p.b),100));R=mul(k(p.d),add(mul(k(-1),z),Q(p.c,10)));}
  else if(f==='360'){L=mul(k(-1),sub(mul(k(-p.a),sub(z,k(p.b))),k(p.c)));R=add(Z(p.d),k(p.e));}
  else if(f==='361'){L=add(mul(k(-(p.a**3)),sub(mul(k(-1),z),k(p.b))),k(p.c));R=mul(k(-p.d),add(z,k(1)));}
  else if(f==='362'){L=add(Z(-p.a),mul(k(p.b),add(Z(p.c),k(p.d))));R=add(mul(k(p.e),sub(Z(p.f),k(p.g))),k(p.h));}
  else if(f==='363'){L=sub(mul(k(-p.a),sub(mul(sub(z,k(p.b)),k(-p.c)),k(p.d**2))),k(p.e));R=mul(k(-1),sub(k(-p.f),Z(p.g)));}
  else if(f==='364'){L=mul(k(-1),sub(mul(k(-p.a),sub(k(-p.e),z)),k(p.b**2)));R=mul(k(-1),sub(add(k(-p.d),z),Z(p.c)));}
  else if(f==='365'){L=sub(mul(k(-p.a),sub(mul(k(-(p.b**p.c)),sub(z,k(p.d))),mul(k(p.e),add(Z(-p.e),k(p.f))))),add(Z(p.g),k(p.i)));R=add(Z(p.h),k(p.j));}
  else if(f==='366'){L=sub(mul(k(p.a),add(k(-p.b),Z(p.c))),mul(k(p.d**2),z));R=add(mul(Z(-p.e),k(-1-(-1))),k(p.f));}
  else{L=Z(p.a);R=add(mul(k(p.b),sub(Z(p.c),add(Z(p.d),add(Z(p.e),k(p.f))))),k(p.g));}
  return L[0]*R[1]===R[0]*L[1];},
 // Batch A1-5
 'a1-word':(q,p)=>{const M=x=>String(x).replace('-','−');
  if(p.form==='370'){const r=p.z*p.k+p.e*p.n;return is(P(q),Q(r-p.e*p.n,p.k))&&q.prompt.includes(`is ${M(r)}.`)&&between(p.z,-20,40);}
  if(p.form==='371'){const r=p.a*(p.z+p.b);return is(P(q),Q(r-p.a*p.b,p.a))&&q.prompt.includes(`equals ${M(r)}.`)&&p.b!==0;}
  if(p.form==='372'){const r=p.z*p.a+p.b*p.e;return is(P(q),Q(r-p.b*p.e,p.a))&&q.prompt.includes(`result of ${M(r)}.`);}
  const r=p.b*(p.z+p.e)+p.a*p.d;return is(P(q),Q(r-p.a*p.d-p.b*p.e,p.b))&&q.prompt.includes(`is ${M(r)}.`);},
 'a1-primes':(q,p)=>{const n=2**p.a*3**p.b*5**p.c*p.big;return P(q).n===n&&n===p.g&&[7,11].includes(p.big)&&between(p.a,1,3)&&between(p.b,0,2)&&between(p.c,1,2);},
 'a1-unequal':(q,p)=>{if(p.form==='379')return is(P(q),Q(p.d*p.n,3))&&p.n%3===0;
  if(p.form==='380')return is(P(q),Q(p.b-p.a,3))&&q.prompt.includes(String(Math.abs(p.b)));
  if(p.form==='382')return is(P(q),Q(p.b-p.r,p.a+2))&&p.r===-(p.a+2)*p.z+p.b;
  return is(P(q),Q(p.c-p.b,p.a-p.d))&&p.d<p.a;},
 'a1-gcf':(q,p)=>{const t=P(q).terms;if(p.form==='mc')return Object.keys(t).length===1&&t.x1===p.a;return Object.keys(t).length===1&&t[`a${Math.min(p.b,p.e)}b1`]===g(p.A,p.D);},
 'a1-factor':(q,p)=>{// rebuild the polynomial from the parameters, find its GCF independently, and divide
  let poly;const [I,J,K]=p.L||['x','y',p.form==='mc'?'z':'p'];
  if(p.form==='390')poly=[[p.a*p.d,{[I]:p.e+1,[J]:3,[K]:2}],[p.b*p.d,{[I]:p.e+2,[J]:2,[K]:1}],[p.c*p.d,{[I]:p.e,[J]:1,[K]:3}]];
  else if(p.form==='391')poly=[[p.a*p.d,{x:p.b+1,y:p.c+1,p:1}],[p.a*p.e,{x:p.b,y:p.c,p:2}],[p.a*p.f,{x:p.b+p.g,y:p.c+p.h,p:1}],[p.a*p.c,{x:p.b,y:p.c,p:1}]];
  else if(p.form==='mc')poly=[[p.a*p.d,{x:p.b+1,y:p.c+1,z:2}],[p.a*p.e,{x:p.b,y:p.c,z:3}],[p.a*p.f,{x:p.b+p.g,y:p.c+p.h,z:1}]];
  else poly=[[p.a*p.b,{x:p.b2,y:p.b3,z:2}],[p.a*p.c,{x:p.b1+p.b2,y:2,z:p.b4}]];
  const G=poly.map(t=>t[0]).reduce((x,y)=>g(x,y)),lets=[...new Set(poly.flatMap(t=>Object.keys(t[1])))].sort(),mins={};for(const l of lets)mins[l]=Math.min(...poly.map(t=>t[1][l]||0));
  const key=m=>Object.keys(m).filter(l=>m[l]).sort().map(l=>l+m[l]).join(''),inner={};for(const [c,m] of poly){const d={};for(const l of lets)d[l]=(m[l]||0)-mins[l];inner[key(d)]=c/G;}
  const pt=P(q);return pt.t==='factor'&&pt.gcf[0]===key(mins)&&pt.gcf[1]===G&&Object.keys(inner).length===Object.keys(pt.inner).length&&Object.entries(inner).every(([k,c])=>pt.inner[k]===c);},
 'a1-cancel':(q,p)=>{let nu,de;
  if(p.form==='395'){nu=[[p.a,{[p.j]:1}],[-p.a*p.b,{[p.j]:2}]];de=[p.a,{[p.j]:1}];}
  else if(p.form==='397'){nu=[[p.a*p.b,{x:p.c,y:p.d}],[p.b*p.c,{x:p.e+1,y:2}]];de=[p.b,{x:p.e,y:1}];}
  else if(p.form==='398'){nu=[[p.a*p.b,{x:p.b1+p.b5-1,y:p.b2+p.b6-1,z:2}],[p.a*p.c,{x:p.b3+p.b5-1,y:p.b4+p.b6-1,z:1}]];de=[p.a,{x:p.b5,y:p.b6,z:1}];}
  else{nu=[[p.a*p.b,{x:p.b1,y:p.b2}],[p.a*p.c,{x:p.b3,y:p.b4}]];de=[p.a,{x:1,y:1}];}
  const t=P(q).terms,want={};for(const [c,m] of nu){const d={};for(const l of new Set([...Object.keys(m),...Object.keys(de[1])]))d[l]=(m[l]||0)-(de[1][l]||0);want[Object.keys(d).filter(l=>d[l]).sort().map(l=>l+d[l]).join('')]=c/de[0];}
  return Object.keys(t).length===Object.keys(want).length&&Object.entries(want).every(([k,c])=>t[k]===c);},
 'a1-dist-rat':(q,p)=>polyIs(P(q),[[p.c,{x:p.a-p.e,y:p.d,z:-p.b}],[-p.f,{x:p.a+p.g,y:-p.h,z:-p.b}]])&&P(q).form==='pos'&&(p.form!=='mc'||p.a!==p.e),
 'a1-negbase':(q,p)=>{const A=(-p.a)**(-p.b),B=p.a**(-p.b);
  if(p.form==='405')return is(P(q,0),p.k1===1?Q(1,A):Q(-1,B))&&is(P(q,1),p.k2===1?[A,1]:[-B,1]);
  if(p.form==='406'){const N=add(Q(-(p.a**p.c),(-p.a)**p.b),Q(p.d**p.f,(-p.d)**p.e));return is(P(q),div(N,[p.a**p.b-p.d*p.g,1]));}
  if(p.form==='407')return is(P(q,0),Q(-p.b-1+p.d-p.e*p.e,p.f-p.g*p.g))&&is(P(q,1),[p.h*p.h+p.i,1]);
  return is(P(q),[Q(1,A),Q(-1,B),[A,1],[-B,1]][p.k-1]);},
 'a1-ineq-words':(q,p)=>{const pt=P(q);return pt.mode==='form'&&pt.op===(p.more>0?'gt':'lt')&&pt.L===`x ${p.inc>0?'+':'-'} ${p.b}`&&Number(pt.R)===p.d;},
 'a1-ineq-tf':(q,p)=>P(q).alts[0]===String(p.op==='lt'?p.b<p.c:p.op==='le'?p.b<=p.c:p.op==='gt'?p.b>p.c:p.b>=p.c),
 'a1-compare':(q,p)=>P(q).alts[0]===(p.a<p.b?'<':p.a>p.b?'>':'='),
 'a1-ineq-graph':(q,p)=>q.answer.kind==='teacher'&&q.answer.reference.includes(['le','ge'].includes(p.op)?'closed':'open circle')&&q.answer.reference.includes(['le','lt'].includes(p.op)?'left':'right'),
 'a1-ineq-pick':(q,p)=>P(q).alts[0]==='abcd'[p.order.indexOf(0)]&&q.givens.svg.includes('(d)'),
 'a1-ratio':(q,p)=>p.form==='total'?is(P(q),[p.e*(p.first===1?p.a:p.b),1])&&between(p.e,110,260):is(P(q),[p.e*(p.first===1?p.b:p.a),1])&&g(p.a,p.b)===1,
 'a1-ineq-read':(q,p)=>{const closed=/closed circle/.test(q.givens.svg),left=/to the left/.test(q.givens.svg),op=left?(closed?'le':'lt'):(closed?'ge':'gt');return q.answer.parts.every(x=>x.mode==='set'&&x.op===op&&x.b===p.a)&&(p.form==='mc'||P(q,1).neg===true);},
 'a1-quot':(q,p)=>p.form==='mc'?polyIs(P(q),[[p.c,{x:p.d-p.f,y:p.g-p.i,z:p.b1+p.b3}]])&&p.A===p.c*p.B:polyIs(P(q),[[1,{x:p.a+p.b,y:p.c+p.g,z:p.e+p.f-p.d}]])&&P(q).form===(p.form==='433'?'pos':'num'),
 'a1-dist-neg':(q,p)=>{const f=p.form;let w;
  if(f==='437')w=[[1,{x:p.a+p.c-1,y:p.b+p.d}],[-p.e,{x:p.a-2,y:p.b+p.f}]];
  else if(f==='438'||f==='442')w=[[1,{a:p.a+p.c-1,b:p.b+p.d}],[-p.e,{a:p.a+2,b:p.b-p.f,c:1}]];
  else if(f==='439'||f==='mc')w=[[1,{a:p.a+p.m,b:p.b+p.n}],[-1,{a:p.a+p.c-1,b:p.b+p.d}],[-p.e,{a:p.a+2,b:p.b-p.f,c:1}]];
  else if(f==='440')w=[[1,{w:p.d-p.c,x:p.a,z:p.e}],[1,{w:p.f-p.c,x:p.a+p.g,z:p.h+1-p.i}]];
  else if(f==='441')w=[[p.e*p.e1,{x:p.a+p.m,y:p.b+1-p.n,z:-1}],[p.e*p.e2,{x:p.a+p.c-1,y:p.b+p.d+1,z:-1}],[-p.e*p.e3,{x:p.a+2,y:p.b+1-p.f}]];
  else w=[[p.r,{a:p.a+p.c-1,b:p.b+p.d}],[3*p.r,{a:p.a+2,b:p.b+1,c:2}],[-p.e*p.r,{a:p.a-2,b:p.b+p.f}]];
  return polyIs(P(q),w)&&P(q).form===(f==='442'?'neg':f==='443'?'num':'pos');},
 'a1-like-rat':(q,p)=>{const f=p.form,L=f==='449'?'n':'z';
  if(f==='447'||f==='449')return polyIs(P(q),[[p.a+p.c,{x:p.e,y:p.f,[L]:p.g}],[p.b+p.d,{x:p.h,y:p.i,[L]:p.j}]]);
  if(f==='448')return polyIs(P(q),[[p.a+9,{a:-p.c*p.e,b:-p.d*p.e}],[p.b-1,{a:-p.f,b:-p.g}]])&&P(q).form==='neg';
  return polyIs(P(q),[[p.a+p.b+p.c,{x:p.d,y:p.e,z:-p.f}]])&&P(q).form==='den';},
 'a1-two-eval':(q,p)=>{const f=p.form;
  if(f==='453')return is(P(q),[p.g*p.a+p.h,1])&&between(p.a,-5,5);
  if(f==='454')return is(P(q),sub(sub(Q(1,p.a**p.d),[p.b**p.e*(1-p.b),1]),[Math.abs(p.a),1]));
  if(f==='455')return is(P(q),[p.a**3+p.c,1]);
  if(f==='458')return is(P(q),[p.a**p.d-Math.abs(p.a**p.e)*p.a**p.f-p.b,1]);
  if(f==='459')return is(P(q),[(Math.abs(p.a)+Math.abs(p.b))*(Math.abs(p.a)-Math.abs(p.b)),1]);
  if(p.cs===1)return is(P(q),[p.b**p.d-p.a*p.b-Math.abs(p.b+p.g*p.a)+p.a**p.e,1]);
  return is(P(q),[Math.abs(p.b**p.d)*(p.b-p.a)+p.b**p.e+p.a,1]);},
 'a1-multivar':(q,p)=>{const f=p.form,pt=P(q);if(f==='464')return is(pt,Q((p.c-p.b)*p.e+p.d,p.a));
  const s=pt.samples.find(([e])=>Object.values(e).includes(2.7)),X=2.7;if(!s)return false;let v0,y;
  if(f==='466'){v0='y';y=(p.a*X-p.c)/p.b;}
  else if(f==='470'){v0=p.cs===1?'y':'x';y=p.a*X+p.d;}
  else if(f==='468'){v0=p.c===1?'x':'y';y=p.c===1?((p.b+1)*X-p.d)/(p.a-1):((p.a-1)*X+p.d)/(p.b+1);}
  else if(f==='469'){v0=p.c===1?'x':'y';y=p.c===1?((p.b+1)*X+p.d)/p.a:(p.a*X-p.d)/(p.b+1);}
  else{v0=p.c===1?'u':'w';y=p.c===1?(p.b+1)*X/(p.a-1):(p.a-1)*X/(p.b+1);}
  return pt.v===v0&&near(s[1],y);},

 // Batch A1-6
 'a1-lcm':(q,p)=>{const l=(x,y)=>x/g(x,y)*y;return is(P(q),[l(l(p.a,p.b),p.c),1])&&g(p.a,p.b)>1&&between(p.a,p.form==='mc'?21:11,p.form==='mc'?30:20);},
 'a1-lcm-mono':(q,p)=>{const [J,K,L]=p.L,r=p.a*p.b*p.c;const w=p.form==='479'?{[J]:p.d,[K]:p.e,[L]:p.f}:p.form==='mc'?{[J]:p.d,[K]:1}:{[J]:p.d,[K]:p.e};return polyIs(P(q),[[r,w]])&&g(p.a,p.c)===1;},
 'a1-rat-add':(q,p)=>{// numerator rebuilt independently; the denominator checked as the product it should equal
  const f=p.form,pt=P(q);if(!pt||pt.t!=='ratexp')return false;const [X,Y,Z,U,V]=p.L||['x','y','z'];let N,D;
  if(f==='483'||f==='mc'){N=[[p.b+p.add*p.d,{x:1}],[p.a+p.add*p.c,{y:1}]];D=e=>p.e*e.x**p.f*e.y**p.g;}
  else if(f==='486'){N=[[p.b*p.d,{[X]:1}],[p.a*p.d,{[Y]:1}],[p.c,{[X]:1,[Y]:1}]];D=e=>p.d*e[X]*e[Y];}
  else if(f==='487'){const [R0,S0,T0,U0,V0]=p.L;N=[[1,{[R0]:1,[U0]:p.a-1,[V0]:p.b}],[1,{[S0]:1}],[p.sg,{[T0]:1,[U0]:p.a,[V0]:p.b}]];D=e=>e[U0]**p.a*e[V0]**p.b;}
  else if(f==='488'||f==='489'){const [R0,S0,T0,U0]=p.L,c=p.c,d=p.d;N=f==='488'?[[p.a,{[R0]:1,[T0]:2-c,[U0]:2-d}],[-p.b,{[T0]:c-1,[U0]:d-1}],[1,{[S0]:1,[T0]:c-1,[U0]:2-d}]]:[[p.a,{[T0]:2-c,[U0]:2-d}],[1,{[R0]:1,[T0]:c-1,[U0]:d-1}],[1,{[S0]:1,[T0]:c-1,[U0]:2-d}],[-p.b,{[T0]:2-c,[U0]:d-1}]];D=e=>e[T0]**2*e[U0]**2;}
  else if(f==='490'){const G=Math.max(p.c,p.e),H=Math.max(p.d,p.f);N=[[p.a,{x:1,y:G-p.c,z:H-p.d}],[p.b,{y:G-p.e,z:H-p.f}]];D=e=>e.y**G*e.z**H;}
  else if(f==='549'){N=[[p.a+p.b,{x:1}],[p.c*(p.b-p.a),{}]];D=e=>(e.x+p.c)*(e.x-p.c);}
  else if(f==='544'){N=[[p.a,{[Y]:1}],[p.a*p.d,{[X]:1}],[p.b,{[X]:1,[Y]:2}],[p.c,{[Y]:2}],[p.c*p.d,{[X]:1,[Y]:1}]];D=e=>e[Y]**2*(e[Y]+p.d*e[X]);}
  else if(f==='545'){N=p.c===1?[[p.a+p.b,{[X]:1}],[p.b*p.d,{[Y]:1}]]:[[p.b,{[X]:1}],[p.a+p.b*p.d,{[Y]:1}]];D=e=>(p.c===1?e[X]:e[Y])*(e[X]+p.d*e[Y]);}
  else if(f==='546'){N=[[p.a,{[X]:2}],[p.a*p.d+p.b,{[X]:1,[Y]:1}],[p.b*p.d,{[Y]:2}],[p.c,{[X]:2,[Y]:1}]];D=e=>e[X]**2*e[Y]*(e[X]+p.d*e[Y]);}
  else if(f==='547'){const W=p.L[2];N=[[p.a,{[X]:1,[Y]:1}],[p.a*p.d,{[X]:1,[W]:1}],[p.b,{[Y]:2}],[p.c,{[Y]:3}],[p.c*p.d,{[Y]:2,[W]:1}]];D=e=>e[Y]**2*(e[Y]+p.d*e[W]);}
  else{N=[[p.a+p.b,{[X]:1}],[p.a*p.d,{[Y]:1}],[p.c,{[X]:2}],[p.c*p.d,{[X]:1,[Y]:1}]];D=e=>e[X]*(e[X]+p.d*e[Y]);}
  if(!polyIs({t:'poly',terms:pt.num},N))return false;const fk=S.parseExpr(pt.den,pt.vars),env={};pt.vars.forEach((v,i)=>{env[v]=1.3+0.71*i;});return near(fk(env),D(env));},
 'a1-stat-mc':(q,p)=>{const L=[p.a,p.b,p.c,p.d,p.a],s=[...L].sort((x,y)=>x-y);return is(P(q),[[L.reduce((x,y)=>x+y,0)/5,s[2],p.a][p.g-1],1])&&new Set([p.a,p.b,p.c,p.d]).size===4;},
 'a1-conj':(q,p)=>{if(p.form==='500')return q.answer.kind==='teacher'&&q.answer.reference.includes(`${p.a===1?'an open':'a closed'} circle at ${String(p.c).replace('-','−')}`);
  if(p.form==='501'){const pt=P(q),open=/an open circle at (\S+) and/.exec(q.givens.svg);return pt.lo===p.c&&pt.hi===p.d&&pt.loIn===!open&&pt.hiIn===(p.a!==2);}
  return P(q).alts[0]==='abcd'[p.order.indexOf(0)]&&p.b>=p.a+3;},
 'a1-pct':(q,p)=>{const f=p.form;if(f==='505')return is(P(q),[p.z,1])&&P(q).pct&&[2,5].includes(p.z);if(f==='506'||f==='mc')return is(P(q),Q(60*p.b,p.a));return is(P(q),Q(p.a*p.b,100))&&(f==='509'||p.b%100!==0);},
 'a1-degree':(q,p)=>p.form==='mc'?is(P(q),[p.e,1]):is(P(q),[p.b1+p.b2-2,1])&&p.b1!==p.b2,
 'a1-poly-add':(q,p)=>{const f=p.form;let w;
  if(f==='mc')w=[[p.a+p.d,{x:2}],[p.b+p.e,{x:1}],[p.c+p.f,{}]];
  else if(f==='520')w=[...p.c1.map((c,i)=>[p.l*c,{x:5-i}]),...p.c2.map((c,i)=>[p.sym*p.m*c,{x:4-i}])];
  else if(f==='517')w=[[p.a,{x:p.g}],[p.b,{x:p.h}],[p.c,{}],[p.sym*p.d,{x:p.h}],[p.sym*p.e,{}],[p.sym*p.f,{x:p.g}]];
  else if(f==='518')w=[[p.b,{x:p.h}],[p.a,{x:p.g}],[p.i,{x:1}],[p.c,{}],[p.sym*p.d,{x:p.h}],[p.sym*p.f,{x:p.g}],[p.sym*p.e,{}]];
  else w=[[p.b,{x:p.h}],[p.a,{x:p.g}],[p.c,{}],[p.sym*p.m*p.d,{x:p.h}],[p.sym*p.m*p.f,{x:p.g}],[p.sym*p.m,{x:1}],[p.sym*p.m*p.e,{}]];
  return polyIs(P(q),w)&&(f!=='517'||P(q).order==='desc');},
 'a1-poly-mul':(q,p)=>{const mul=(A,B)=>A.flatMap(([c1,e1])=>B.map(([c2,e2])=>[c1*c2,{x:e1+e2}]));let A,B;
  if(p.form==='524'){A=[[p.a,2],[-p.b,0]];B=A;}else if(p.form==='525'){A=[[p.a,1],[p.b,0]];B=[[p.c,1],[p.d,0]];}else{A=[[1,1],[p.a,0]];B=[[p.i,2],[p.b,1],[p.c,0]];}
  return polyIs(P(q),mul(A,B));},
 'a1-graph-pt':(q,p)=>p.form==='mc'?P(q).alts[0]==='abcd'[p.order.indexOf(0)]&&q.givens.svg.includes(`(${String(p.a).replace('-','−')}, ${String(p.b).replace('-','−')})`):q.answer.kind==='teacher'&&q.answer.reference.includes(`(${String(p.a).replace('-','−')}, ${String(p.b).replace('-','−')})`),
 'a1-graph-line':(q,p)=>{const f=p.form;if(f==='536'||f==='537')return q.answer.kind==='teacher'&&q.answer.reference.includes(`(1, ${String(p.a+p.b).replace('-','−')})`)&&(f==='537'?p.b%p.a===0&&p.b/p.a>0:Math.abs(p.a)===1);
  if(f==='540')return q.answer.kind==='teacher'&&q.answer.reference.includes(p.vert?'vertical':'horizontal');
  if(f==='mc')return P(q).alts[0]==='abcd'[p.order.indexOf(0)];return P(q).alts[0]==='abc'[p.order.indexOf(0)];},
 'a1-avg-target':(q,p)=>is(P(q),Q(p.new*(p.a+5)-p.a*p.b,5))&&P(q).v[1]===1,
 'a1-power-rule':(q,p)=>{const f=p.form;
  if(f==='556')return polyIs(P(q),[[p.a,{x:-p.b,y:p.c}]]);
  if(f==='557')return polyIs(P(q),[[1,{x:p.a-p.c*p.d+p.e-p.i-p.j+p.l,y:p.b-p.f-p.k,z:-p.g*p.h-p.m*p.n}]]);
  if(f==='558'){const t=P(q).terms,k=Object.keys(t);return k.length===1&&near(t[k[0]],p.d**p.f*p.g/p.j)&&k[0]===['x'+(p.h-p.b*p.f),'y'+(p.c*p.f+p.k),'z'+(-p.e*p.f-p.i)].filter(x=>!/^\D0$/.test(x)).join('');}
  if(f==='559'){const t=P(q).terms;return near(t[`p${-(p.c*p.e+p.g*p.i)}x${p.b*p.e+p.h*p.i}y${-(p.d*p.e+p.f*p.i)}`],1/p.a**p.e);}
  if(f==='560')return polyIs(P(q,0),[[1,{x:-p.b*p.e,y:-p.c*p.e,z:-p.d*p.e}]])&&polyIs(P(q,1),[[1,{x:-p.g*p.j,y:p.i*p.j,z:-p.h*p.j}]]);
  const t=P(q).terms,k=Object.keys(t);return k.length===1&&near(t[k[0]],(-1)**p.h*p.B**p.h/p.A**p.h)&&k[0]===['a'+p.h*(p.d-p.c),'b'+p.h*(p.f-p.e),'c'+p.h*p.g].filter(x=>!/^\D0$/.test(x)).join('');},
 'a1-vol-chain':(q,p)=>{const M={'(1/2.54)':1/2.54,'(12)':12,'(100)':100,'(2.54)':2.54,'(3)':3,'(1/12)':1/12,'(1/100)':1/100,'(1/3)':1/3,'(1000)':1000,'(1/1000)':1/1000},pt=P(q);
  const to={centimeters:0.01,feet:0.3048,meters:1,inches:0.0254,yards:0.9144,kilometers:1000},m=/convert [\d,]+ cubic (\w+) to cubic (\w+)/.exec(q.prompt);
  return near(pt.v[0]/pt.v[1],p.b*(to[m[1]]/to[m[2]])**3)&&pt.min===3*p.fs.length&&pt.start===p.b;},

};
const near=(x,y)=>Math.abs(x-y)<=1e-9*Math.max(1,Math.abs(y));

// Responses that must be marked wrong for a recipe, beyond the distractors (optional): recipe -> q => [strings].
const wrong={
 'a1-semi-perim':q=>{const p=P(q);return [String((p.a[0]+Math.PI*p.b[0]).toFixed(2)),`${p.a[0]+p.b[0]}π`];},
 'a1-unit-chain':q=>[String(P(q).v[0]/P(q).v[1])],                                       // the bare converted number
 'a1-sets':()=>['{1, 2, 3}; {0, 1, 2}; {-1, 0, 1}'],
 'a1-zero-div':q=>P(q).alts[0]==='0'?['Undefined','1']:['0','1'],
 'a1-area-chain':q=>[String(P(q).v[0]/P(q).v[1])],
 'a1-combine':q=>[P(q).terms&&Object.entries(P(q).terms).map(([k,c])=>c+k.replace(/1/g,'')).join('+')+'+0x'],
 'a1-like':q=>q.answer.parts[0].t==='set'?['(a)']:['5'],
 'a1-primes':q=>[String(P(q).n),'1 × '+q.answer.value],
 'a1-factor':q=>[q.answer.value.replace(/\(.*\)/,'')],
 'a1-ineq-read':q=>q.answer.parts.length>1?[q.answer.value.split(';')[0]+';'+q.answer.value.split(';')[0]]:[],
 'a1-multivar':q=>P(q).t==='solve'?[q.answer.value.replace(/^\s*\w\s*=\s*/,'')]:[],
 'a1-rat-add':q=>[q.answer.value.replace(/\)\/\(.*$/,')')],
 'a1-conj':q=>q.answer.parts&&P(q).t==='conj'?[`${P(q).lo} < x`]:[],
};

H.run({key:'algebra-1',oracle,wrong,instances:Number(process.argv[2]||250)});
