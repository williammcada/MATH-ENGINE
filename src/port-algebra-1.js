/* Algebra 1 port tasks (coverage programme, parallel courses). Original Engine code informed by the source
   records; no source script is executed or reproduced. Owned by the Algebra 1 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).

   Rules for this module:
   - Every recipe name starts with 'a1-'. src/port87.js sends those recipes here, family structured-port87.
   - Helpers come from src/port-shared.js (S below). Do not edit port-shared.js; ask the owner for a shared change.
     A helper only this course needs is defined in this file.
   - build(c,h) returns the same task object as the recipes in port87.js: {prompt, answer, solution, parameters,
     math?, svg?, teacherSvg?, choices?, requireImproper?, eitherForm?}. h.int(a,b), h.pick(list), h.index and
     h.check (the full port checker, for S.wrongOnlyBy(h.check,t,list)) are provided.
   - check(q,response) and answerText(q) handle answer kinds that exist only in this course. Return undefined for
     anything else, and the shared port checker handles it. render(q) likewise, if a course ever needs it.

   Course answer kind 'a1': {kind:'a1', parts:[part,...], value}. One response part per answer part, separated by
   semicolons when there is more than one; a leading "(a)" label or "x =" is ignored. Part types:
     num    {t:'num', v:[n,d], form}  form 'int' | 'dec' (exact decimal or integer) | 'mixed' (simplified mixed number,
            proper fraction or integer) | 'frac' (lowest terms or integer) | 'any' (any exact form of the value).
            Trailing unit words and the degree sign are ignored.
     word   {t:'word', alts:[...]}    one of the accepted words or phrases (case, articles and punctuation ignored)
     kw     {t:'kw', need:[[...],...], avoid:[...]}  a written statement: one phrase from every need group, no avoid phrase
     pi     {t:'pi', a:[n,d], b:[n,d]} the exact value a + bπ, written with π (or pi) and no decimal approximation
     chain  {t:'chain', v:[n,d], start, min} a measurement times at least `min` unit multipliers, product equal to v
     roster {t:'roster', set:'natural'|'whole'|'integers'} the set in braces with an ellipsis */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const S=common?require('./port-shared'):root.MathPortShared;
const catalog=common?require('./port-algebra-1-map'):root.MathPortAlgebra1Map;
const {U,M,R,n,gcd,mfrac,mixedML,math,mo,mi,mn,minus,svg,ln,tx,dot,Fig,parseExpr,near,INK,esc}=S;

// ---------- course helpers ----------
const red=(a,b)=>{if(b<0){a=-a;b=-b;}const g=gcd(Math.abs(a),b)||1;return [a/g,b/g];};
const mixT=(a,b)=>U.mixed(R(a,b)),fracT=(a,b)=>U.f(R(a,b)),decT=(a,b)=>U.dec(R(a,b));
const fracParts=(a,b)=>{[a,b]=red(a,b);return [Math.floor(a/b),a%b,b];};
// MathML for a value a/b written as a (simplified) mixed number, proper fraction or integer.
const mixML=(a,b)=>{const [w,r,d]=fracParts(a,b);if(!r)return mn(w);return w?mixedML(w,r,d):mfrac(r,d);};
const sgn=x=>x<0?'−'+Math.abs(x):'+'+x;                       // explicit sign, as in a string of signed terms
const par=x=>x<0?'('+minus(x)+')':String(x);                   // parentheses round a negative number
const lead=s=>s.replace(/^\+\s*/,'');                          // drop a leading plus sign
const T=(prompt,parts,value,solution,p,o={})=>{const t={prompt,answer:{kind:'a1',parts,value},solution,parameters:p};if(o.svg)t.svg=o.svg;if(o.math)t.math=o.math;return t;};
const num=(a,b=1,form='any')=>({t:'num',v:red(a,b),form});
const word=(...alts)=>({t:'word',alts});
const zip=(...cols)=>cols[0].map((_,i)=>cols.map(c=>c[i]));               // rows from the source's parallel select() lists
const kw=(need,avoid=[])=>({t:'kw',need,avoid});

// Rational parser for responses: integer, decimal, fraction or mixed number, with the form recorded.
function rat(s){s=String(s).replace(/[−–]/g,'-').replace(/(\d),(?=\d{3}\b)/g,'$1').trim();let m;
 if((m=s.match(/^([+-]?)(\d+)$/)))return {v:[(m[1]==='-'?-1:1)*Number(m[2]),1],form:'int'};
 if((m=s.match(/^([+-]?)(\d*)\.(\d+)$/)))return {v:red((m[1]==='-'?-1:1)*Number((m[2]||'0')+m[3]),10**m[3].length),form:'dec'};
 if((m=s.match(/^([+-]?)(\d+)\s*\/\s*(\d+)$/))){const a=Number(m[2]),b=Number(m[3]);if(!b)return null;return {v:red((m[1]==='-'?-1:1)*a,b),form:'frac',lowest:gcd(a,b)===1,proper:a<b};}
 if((m=s.match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/))){const w=Number(m[2]),a=Number(m[3]),b=Number(m[4]);if(!b||!a)return null;return {v:red((m[1]==='-'?-1:1)*(w*b+a),b),form:'mixed',lowest:gcd(a,b)===1,proper:a<b};}
 return null;}
const sameR=(x,y)=>x[0]*y[1]===y[0]*x[1];
const stripUnit=s=>String(s).replace(/(?<=[\d)π])\s*(?:°|degrees?\b|[a-zA-Z][a-zA-Z.]*(?:\s*[²³23])?)(?:\s+[a-zA-Z][a-zA-Z.]*)*\s*$/,'').trim();
const normW=s=>String(s).toLowerCase().replace(/[−–]/g,'-').replace(/[.,!;:'’"()]/g,' ').replace(/\b(a|an|the)\b/g,' ').replace(/\s+/g,' ').trim();
function partOk(p,s){s=String(s).trim();
 if(p.t==='num'){const r=rat(stripUnit(s.replace(/^[a-z]\s*=\s*/i,'')));if(!r||!sameR(r.v,p.v))return false;
  if(p.form==='int')return r.form==='int';
  if(p.form==='dec')return r.form==='int'||r.form==='dec';
  if(p.form==='mixed')return r.form==='int'||((r.form==='mixed'||r.form==='frac')&&r.lowest&&r.proper);
  if(p.form==='frac')return r.form==='int'||(r.form==='frac'&&r.lowest);
  return true;}
 if(p.t==='word'){const w=normW(s);return p.alts.some(a=>normW(a)===w);}
 if(p.t==='kw'){const r=s.toLowerCase().replace(/[’']/g,"'").replace(/[−–]/g,'-');if(r.length<3)return false;return p.need.every(g=>g.some(w=>r.includes(w)))&&!p.avoid.some(w=>r.includes(w));}
 if(p.t==='pi'){const r=stripUnit(s.replace(/\bpi\b/gi,'π'));if(!/π/.test(r)||/\d\.\d/.test(r))return false;const f=parseExpr(r,[]);if(!f)return false;const v=f({});return isFinite(v)&&near(v,p.a[0]/p.a[1]+Math.PI*p.b[0]/p.b[1]);}
 if(p.t==='chain'){const r=stripUnit(s).replace(/[×·]/g,'*').replace(/\s+/g,'');if(!r||/[+\-]/.test(r))return false;
  const fs=[];let depth=0,cur='';for(const ch of r){if(ch==='('&&depth===0&&cur&&!cur.endsWith('*')){fs.push(cur);cur='';}if(ch==='*'&&depth===0){if(cur)fs.push(cur);cur='';continue;}if(ch==='(')depth++;if(ch===')')depth--;if(depth<0)return false;cur+=ch;}if(depth)return false;if(cur)fs.push(cur);
  if(fs.length<p.min+1||fs[0].replace(/^\((.*)\)$/,'$1')!==String(p.start))return false;let v=1;for(const x of fs){const f=parseExpr(x,[]);if(!f)return false;const y=f({});if(!isFinite(y)||near(y,1))return false;v*=y;}return near(v,p.v[0]/p.v[1]);}
 if(p.t==='roster'){const r=s.replace(/[−–]/g,'-').replace(/…/g,'...').replace(/\s+/g,'');const m=r.match(/^\{(.*)\}$/);if(!m)return false;const el=m[1].split(',');
  const lead3=el[0]==='...',tail=el[el.length-1]==='...';const nums=el.filter(x=>x!=='...');if(!tail||nums.length<3||nums.some(x=>!/^-?\d+$/.test(x)))return false;const v=nums.map(Number);if(!v.every((x,i)=>!i||x===v[i-1]+1))return false;
  if(p.set==='natural')return !lead3&&v[0]===1&&el.length===v.length+1;
  if(p.set==='whole')return !lead3&&v[0]===0&&el.length===v.length+1;
  return lead3&&el.length===v.length+2&&v[0]<0&&v[v.length-1]>0;}
 return false;}
function check(q,response){const a=q&&q.answer;if(!a||a.kind!=='a1')return undefined;const s=String(response??'');if(s.length>600)return{answerCorrect:false,fullOutcomeVerified:false};
 const ps=a.parts.length>1?s.split(';'):[s];if(ps.length!==a.parts.length)return{answerCorrect:false,fullOutcomeVerified:false};
 return{answerCorrect:a.parts.every((p,i)=>partOk(p,ps[i].replace(/^\s*\([a-e]\)\s*/i,''))),fullOutcomeVerified:false};}
function answerText(q){const a=q&&q.answer;return a&&a.kind==='a1'?a.value:undefined;}
// Distractor filter for any answer kind: drops repeats and anything the task's own checker accepts.
function opts(t,list,h){const seen=new Set();const ok=v=>t.answer.kind==='a1'?check({answer:t.answer},v).answerCorrect:h.check(t,v).answerCorrect;
 return list.filter(x=>{const v=String(x.value);if(seen.has(v)||ok(v))return false;seen.add(v);return true;}).slice(0,3);}

// ---------- course drawings (original SVG) ----------
// Points on a line in order; xs are positions, names the labels.
function pointsOnLine(names,xs,label){const W=360,x0=24,k=(W-2*x0)/(xs[xs.length-1]-xs[0]),X=v=>x0+(v-xs[0])*k,y=34;let b=ln(x0-14,y,W-x0+14,y,{w:1.4});
 names.forEach((nm,i)=>{b+=dot(X(xs[i]),y)+tx(X(xs[i]),y+22,nm,{italic:1,size:14});});return svg(b,label,W,58);}
// A rectilinear outline from vertices, with side labels [[i, text]] placed outside edge i (from vertex i to i+1).
function outline(P,labels,label,o={}){const F=Fig();F.poly(P);const cx=P.reduce((s,p)=>s+p[0],0)/P.length,cy=P.reduce((s,p)=>s+p[1],0)/P.length;
 for(const [i,s] of labels){const p=P[i],q=P[(i+1)%P.length],mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy);let nx=dy/L,ny=-dx/L;
  // outward normal: for a counter-clockwise polygon (dx,dy) rotated clockwise points out
  const area=P.reduce((s,a,j)=>{const b=P[(j+1)%P.length];return s+a[0]*b[1]-b[0]*a[1];},0);if(area<0){nx=-nx;ny=-ny;}
  const deg=Math.atan2(ny,nx)*180/Math.PI;F.dir([mx,my],deg,o.px||16,s,{size:12});}
 if(o.rights)for(const [v,d1,d2] of o.rights)F.right(v,d1,d2,7);
 return F.render(label,o.w||300,o.h||190);}

// ---------- recipes ----------
function build(c,h){const {int,pick}=h;let t;const v=c.variant;
switch(c.recipe){
// Batch A1-1: Lessons 1-6
case 'a1-mixed-add':{// a b/c + d e/f, unlike denominators 3–10, wholes 1–8
 let a,b,cc,d,e,f;do{cc=int(3,10);do{b=int(1,cc-1);}while(gcd(b,cc)!==1);do{f=int(3,10);}while(f===cc);do{e=int(1,f-1);}while(gcd(e,f)!==1);a=int(1,8);d=int(1,8);}while(b+d>=cc*f);
 const N=(a*cc+b)*f+(d*f+e)*cc,D=cc*f;
 t=T(`Add: ${a} ${b}/${cc} + ${d} ${e}/${f}. Write the answer as a mixed number.`,[num(N,D,'mixed')],mixT(N,D),`Use the common denominator ${D}: ${a} ${b*f}/${D} + ${d} ${e*cc}/${D} = ${mixT(N,D)}.`,{a,b,c:cc,d,e,f},{math:math(`<mrow>${mixedML(a,b,cc)}${mo('+')}${mixedML(d,e,f)}</mrow>`)});break;}
case 'a1-mixed-sub':{// a b/c − d e/f with a > d
 let a,b,cc,d,e,f;
 if(v==='mc'){do{a=int(2,5);d=int(1,a-1);cc=int(3,8);f=int(cc+1,10);b=int(1,cc-1);e=int(b+1,f-1);}while(f%cc===0);}
 else{do{cc=int(3,9);f=int(3,9);}while(f===cc);a=int(2,9);d=int(1,a-1);do{b=int(1,cc-1);}while(gcd(b,cc)!==1);do{e=int(1,f-1);}while(gcd(e,f)!==1);}
 const P1=a*cc+b,P2=d*f+e,N=P1*f-P2*cc,D=cc*f,[w1,r1,d1]=fracParts(P1,cc),[w2,r2,d2]=fracParts(P2,f);
 t=T(`Subtract: ${mixT(P1,cc)} − ${mixT(P2,f)}. Write the answer as a mixed number or a proper fraction.`,[num(N,D,'mixed')],mixT(N,D),`Write both with the denominator ${D}: ${mixT(P1,cc)} − ${mixT(P2,f)} = ${mixT(P1*f,D)} − ${mixT(P2*cc,D)} = ${mixT(N,D)}.`,{a,b,c:cc,d,e,f},{math:math(`<mrow>${mixML(P1,cc)}${mo('−')}${mixML(P2,f)}</mrow>`)});
 if(v==='mc'){const fx=b*f-e*cc;t.choices=opts(t,[{value:mixT((a-d)*D+Math.abs(fx),D),mistake:'Subtracted the smaller fraction part from the larger one instead of regrouping'},{value:mixT(P1*f+P2*cc,D),mistake:'Added the mixed numbers instead of subtracting'},{value:mixT(N+D,D),mistake:'Regrouped but did not take one from the whole number'},{value:mixT((w1-w2)*D,D),mistake:'Subtracted only the whole numbers'}],h);}
 break;}
case 'a1-mixed-three':{// d w/a + f y/c − e x/b from the source's denominator table
 const rows=[[2,3,6],[2,4,6],[2,5,10],[2,6,8],[3,2,6],[3,4,12],[3,5,15],[3,6,12],[4,2,8],[4,3,12],[4,5,20],[4,6,12],[5,2,10],[5,3,15],[5,4,20],[5,6,30],[6,2,8],[6,3,12],[6,4,12],[6,5,30]];const [A,B,C]=pick(rows);
 const cop=m=>{let x;do{x=int(1,m-1);}while(gcd(x,m)!==1);return x;};const w=cop(A),x=cop(B),y=cop(C);let d,e,f;do{d=int(2,5);e=int(2,5);f=int(2,5);}while((d-e+f)*A*B*C+B*C*w-A*C*x+A*B*y<=0);
 const N=(d-e+f)*A*B*C+B*C*w-A*C*x+A*B*y,D=A*B*C;
 t=T(`Simplify: ${d} ${w}/${A} + ${f} ${y}/${C} − ${e} ${x}/${B}. Write the answer as a mixed number or a proper fraction.`,[num(N,D,'mixed')],mixT(N,D),`Rename with a common denominator, add and subtract the whole numbers and the fractions: ${d} + ${f} − ${e} = ${d+f-e}, and ${w}/${A} + ${y}/${C} − ${x}/${B} = ${fracT(B*C*w+A*B*y-A*C*x,D)}; total ${mixT(N,D)}.`,{A,B,C,w,x,y,d,e,f},{math:math(`<mrow>${mixedML(d,w,A)}${mo('+')}${mixedML(f,y,C)}${mo('−')}${mixedML(e,x,B)}</mrow>`)});break;}
case 'a1-improper-add':{// b/a + d/c, each shown as a mixed number
 let a,b,cc,d;do{a=int(2,10);b=int(a+1,9*a);cc=int(2,9);d=int(cc+1,10);}while(b%a===0||d%cc===0);
 const N=cc*b+d*a,D=a*cc,[w1,r1,a1]=fracParts(b,a),[w2,r2,c1]=fracParts(d,cc);
 t=T(`Add: ${mixT(b,a)} + ${mixT(d,cc)}. Write the answer as a mixed number.`,[num(N,D,'mixed')],mixT(N,D),`${mixT(b,a)} + ${mixT(d,cc)} = ${fracT(b,a)} + ${fracT(d,cc)} = ${fracT(N,D)} = ${mixT(N,D)}.`,{a,b,c:cc,d},{math:math(`<mrow>${mixML(b,a)}${mo('+')}${mixML(d,cc)}</mrow>`)});
 t.choices=opts(t,[{value:mixT((w1+w2)*(a1+c1)+r1+r2,a1+c1),mistake:'Added the whole numbers, then added the numerators and the denominators of the fraction parts'},{value:String(w1+w2+1),mistake:'Counted the two fraction parts as one whole'},{value:mixT(b+d,a+cc),mistake:'Added the numerators and the denominators of the improper fractions'},{value:String(w1+w2),mistake:'Added only the whole numbers'}],h);break;}
case 'a1-seg-part':{// A, B, C on a line: AC and one part given, find the other part (source table of fraction pairs)
 const T44=zip([2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,8,8,8,8,8,8,8,8,8,8,8,8],[3,3,4,4,6,6,8,8,8,8,2,6,6,2,6,6,2,8,8,8,8,2,8,8,8,8,2,3,3,2,3,3,2,4,4,2,4,4,2,4,4,2,4,4],[1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,3,3,3,3,3,1,1,1,5,5,5,1,1,1,3,3,3,5,5,5,7,7,7],[1,2,1,3,1,5,1,3,5,7,1,1,5,1,1,5,1,1,3,5,7,1,1,3,5,7,1,1,2,1,1,2,1,1,3,1,1,3,1,1,3,1,1,3]);
 const [A,B,x,y]=pick(T44),cw=int(1,4),dw=int(1,4),find=pick(['BC','AB']);
 const AB=[cw*A+x,A],BC=[dw*B+y,B],AC=red(AB[0]*B+BC[0]*A,A*B),known=find==='BC'?AB:BC,ans=find==='BC'?BC:AB,kn=find==='BC'?'AB':'BC';
 t=T(`Points A, B and C lie on a line in that order. The length of AC is ${mixT(...AC)} meters. The length of ${kn} is ${mixT(...known)} meters. Find ${find} in meters.`,[num(...ans,'mixed')],mixT(...ans)+' m',`${find} = AC − ${kn} = ${mixT(...AC)} − ${mixT(...known)} = ${mixT(...ans)} m.`,{A,B,x,y,cw,dw,find},{svg:S.abcSegment(AB[0]/AB[1],BC[0]/BC[1],'Points A, B and C on a line in that order')});
 const [wa,ra,da]=fracParts(...AC),[wk,rk,dk]=fracParts(...known),fx=red(ra*dk-rk*da,da*dk);
 t.choices=opts(t,[{value:mixT(AC[0]*known[1]+known[0]*AC[1],AC[1]*known[1])+' m',mistake:'Added the two lengths instead of subtracting'},{value:mixT((wa-wk)*fx[1]+Math.abs(fx[0]),fx[1])+' m',mistake:'Subtracted the smaller fraction part from the larger one instead of regrouping'},{value:mixT(...known)+' m',mistake:'Gave the length that was already known'},{value:mixT(AC[0]*known[1]-known[0]*AC[1]+AC[1]*known[1],AC[1]*known[1])+' m',mistake:'Regrouped but did not take one from the whole number'}],h);break;}
case 'a1-seg-sum':{// AB + BC + CD = AD
 const T40=zip([1,1,1,1,1,1,1,1,1,1,2,2,1,3,1,1,1,1,3,3,3,3,1,5,1,1,5,5,1,3,5,7,1,1,3,3,5,5,7,7],[1,3,1,5,1,3,5,7,1,5,1,5,1,1,1,3,5,7,1,3,5,7,1,1,1,2,1,2,1,1,1,1,1,3,1,3,1,3,1,3],[4,4,6,6,8,8,8,8,6,6,6,6,2,2,8,8,8,8,8,8,8,8,2,2,3,3,3,3,2,2,2,2,4,4,4,4,4,4,4,4],[2,2,4,4,2,2,2,2,3,3,3,3,2,2,4,4,4,4,4,4,4,4,4,4,3,3,3,3,2,2,2,2,4,4,4,4,4,4,4,4],[2,2,2,2,2,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,8,8,8,8,8,8,8,8,8,8,8,8]);
 const [x,y,B,C0,A]=pick(T40),C=int(1,Math.floor(8/C0))*C0;let w;do{w=int(1,C-1);}while(gcd(w,C)!==1);const d=int(1,3),e=int(1,3),f=int(1,3);
 const AB=[d*A+x,A],BC=[e*B+y,B],CD=[f*C+w,C],AD=red((d+e+f)*A*B*C+B*C*x+A*C*y+A*B*w,A*B*C);
 t=T(`Points A, B, C and D lie on a line in that order. AB = ${mixT(...AB)} meters, BC = ${mixT(...BC)} meters and CD = ${mixT(...CD)} meters. Find AD in meters.`,[num(...AD,'mixed')],mixT(...AD)+' m',`AD = AB + BC + CD = ${mixT(...AB)} + ${mixT(...BC)} + ${mixT(...CD)} = ${mixT(...AD)} m.`,{A,B,C,x,y,w,d,e,f},{svg:pointsOnLine(['A','B','C','D'],[0,AB[0]/AB[1],AB[0]/AB[1]+BC[0]/BC[1],AD[0]/AD[1]],'Points A, B, C and D on a line in that order')});break;}
case 'a1-angle-defs':{// two of: define acute angle, define obtuse angle, degrees in a right angle, degrees in a straight angle
 const D={acute:['Define acute angle.',kw([['less than','smaller than','under','between 0','below'],['90','right angle','ninety']],['greater than','more than','larger than','bigger than']),'An acute angle is an angle smaller than a right angle (less than 90°).'],
  obtuse:['Define obtuse angle.',kw([['greater than','more than','larger than','bigger than','between 90'],['90','right angle','ninety'],['180','straight','one hundred eighty']]),'An obtuse angle is larger than a right angle but smaller than a straight angle (between 90° and 180°).'],
  right:['What is the degree measure of a right angle?',num(90,1,'int'),'90°'],straight:['What is the degree measure of a straight angle?',num(180,1,'int'),'180°']};
 const ks=['acute','obtuse','right','straight'],k1=pick(ks);let k2;do{k2=pick(ks);}while(k2===k1);
 t=T(`(a) ${D[k1][0]} (b) ${D[k2][0]} Answer both parts, separated by a semicolon.`,[D[k1][1],D[k2][1]],`(a) ${D[k1][2]}; (b) ${D[k2][2]}`,`(a) ${D[k1][2]} (b) ${D[k2][2]}`,{k1,k2});break;}
case 'a1-angle-formed':{const k=pick(['two right angles','perpendicular lines']);const z=k==='two right angles'?'straight angle':'right angle';
 t=T(`What angle is formed by ${k==='two right angles'?'two right angles placed side by side':'lines that are perpendicular'}?`,[word(z,z.split(' ')[0],z+'s')],`a ${z}`,k==='two right angles'?'90° + 90° = 180°, a straight angle.':'Perpendicular lines meet at 90°, a right angle.',{k});break;}
case 'a1-classify-angle':{const L=pick(['A','B','C']),kind=pick(['acute','right','obtuse','acute','obtuse']),m=kind==='acute'?int(30,89):kind==='right'?90:int(91,179);
 t=T(`The measure of angle ${L} is ${m}°. Classify angle ${L} as acute, right, obtuse or straight.`,[word(kind,kind+' angle')],kind,`${m}° is ${kind==='acute'?'less than 90°':kind==='right'?'exactly 90°':'between 90° and 180°'}, so angle ${L} is ${kind}.`,{L,m,kind});
 t.choices=opts(t,['acute','right','obtuse'].filter(x=>x!==kind).map(x=>({value:x,mistake:`Compared ${m}° with 90° incorrectly`})).concat([{value:'straight',mistake:'Confused a straight angle (180°) with this angle'}]),h);break;}
case 'a1-polygon-kind':{const k=pick(['angles','sides','both']),z={angles:'equiangular',sides:'equilateral',both:'regular'}[k];
 t=T(`What name is given to polygons whose ${k==='angles'?'angles all have the same measure':k==='sides'?'sides all have the same length':'sides all have the same length and whose angles all have the same measure'}?`,[word(z,z+' polygons',z+' polygon')],z+' polygons',`Polygons whose ${k==='both'?'sides and angles are all equal':k==='angles'?'angles are all equal':'sides are all equal'} are called ${z} polygons.`,{k});break;}
case 'a1-polygon-name':{const nm={5:'pentagon',7:'heptagon',8:'octagon',10:'decagon'},s=pick([5,7,8,10]);
 t=T(`What is the name of a polygon with ${s} sides?`,[word(nm[s])],nm[s],`A polygon with ${s} sides is a${nm[s][0]==='o'?'n':''} ${nm[s]}.`,{s});
 t.choices=opts(t,[5,7,8,10].filter(x=>x!==s).map(x=>({value:nm[x],mistake:`Gave the name for a polygon with ${x} sides`})),h);break;}
case 'a1-triangle-defs':{// (a) by sides, (b) by angles
 const SD={isosceles:[kw([['two','2','at least two','pair'],['side'],['equal','same','congruent']]),'has at least two sides of equal length'],equilateral:[kw([['three','3','all'],['side'],['equal','same','congruent']]),'has three sides of equal length'],scalene:[kw([['unequal','different','no two','not equal','no equal','none']],[]),'has three sides of unequal length']};
 const AD={right:[kw([['right angle','90']],[]),'contains a right angle'],acute:[kw([['acute','less than 90','smaller than 90','under 90'],['three','3','all','every']],['right angle','obtuse']),'contains three acute angles'],obtuse:[kw([['obtuse','greater than 90','more than 90','larger than 90']]),'contains one obtuse angle'],equiangular:[kw([['three','3','all'],['equal','same','congruent'],['angle']]),'contains three equal angles']};
 const s=pick(Object.keys(SD)),a=pick(Object.keys(AD));
 t=T(`(a) Define ${s} triangle. (b) Define ${a} triangle. Answer both parts, separated by a semicolon.`,[SD[s][0],AD[a][0]],`(a) A${s[0]==='i'||s[0]==='e'?'n':''} ${s} triangle is a triangle that ${SD[s][1]}; (b) A${a[0]==='a'||a[0]==='o'||a[0]==='e'?'n':''} ${a} triangle is a triangle that ${AD[a][1]}`,`(a) It ${SD[s][1]}. (b) It ${AD[a][1]}.`,{s,a});break;}
case 'a1-right-tri-angle':{// right angle at the top vertex; one acute angle labelled, find the other
 const a=int(25,55),b=180-2*a,R0=[-10,0],R1=[10,0],Tp=[10*Math.cos(b*Math.PI/180),10*Math.sin(b*Math.PI/180)];
 const F=Fig().poly([R0,R1,Tp]).angle(R0,R1,Tp,{arc:20,label:`${90-a}°`,px:36}).angle(R1,Tp,R0,{arc:20,label:'x°',px:34,italic:1}).angle(Tp,R0,R1,{right:9});
 t=T('Find x. The angle at the top of the triangle is a right angle.',[num(a,1,'int')],`x = ${a}`,`The angles of a triangle add to 180°: x = 180 − 90 − ${90-a} = ${a}.`,{a},{svg:F.render(`A right triangle with one acute angle of ${90-a} degrees and the other acute angle marked x degrees`,300,150)});break;}
case 'a1-tri-third':{// two base angles given, find the third
 let a,b;do{a=int(30,50);b=int(30,50);}while(a===b||10/Math.tan(a*Math.PI/180)+10/Math.tan(b*Math.PI/180)>36);
 const P0=[0,0],P1=[10/Math.tan(a*Math.PI/180)+10/Math.tan(b*Math.PI/180),0],Tp=[10/Math.tan(a*Math.PI/180),10];
 const F=Fig().poly([P0,P1,Tp]).angle(P0,P1,Tp,{arc:22,label:`${a}°`,px:40}).angle(P1,Tp,P0,{arc:22,label:`${b}°`,px:40}).angle(Tp,P0,P1,{arc:16,label:'y°',px:32,italic:1});
 t=T('Find y.',[num(180-a-b,1,'int')],`y = ${180-a-b}`,`y = 180 − ${a} − ${b} = ${180-a-b}.`,{a,b},{svg:F.render(`A triangle with angles of ${a} degrees and ${b} degrees and a third angle marked y degrees`,340,150)});break;}
case 'a1-isosceles-angles':{// two equal sides marked; one base angle given; find the other base angle x and the vertex angle y
 const a=2*int(48,56),O=[0,0],P=[-10,0],Q=[-10*Math.cos(a*Math.PI/180),10*Math.sin(a*Math.PI/180)];
 const F=Fig().poly([P,O,Q]).tick(P,O).tick(O,Q).angle(O,Q,P,{arc:16,label:'y°',px:30,italic:1}).angle(P,O,Q,{arc:20,label:`${90-a/2}°`,px:38}).angle(Q,P,O,{arc:20,label:'x°',px:34,italic:1});
 t=T('Find x and y. The marked sides have equal lengths. Answer both, separated by a semicolon (x first).',[num(90-a/2,1,'int'),num(a,1,'int')],`x = ${90-a/2}; y = ${a}`,`The angles opposite the equal sides are equal, so x = ${90-a/2}. Then y = 180 − 2(${90-a/2}) = ${a}.`,{a},{svg:F.render(`An isosceles triangle with base angles ${90-a/2} degrees and x degrees and vertex angle y degrees`,320,150)});break;}
case 'a1-iso-theorem':{const k=pick([['two','angles'],['two','sides'],['three','angles'],['three','sides']]),[nn,p1]=k,p2=p1==='angles'?'sides':'angles',m=p1==='angles'?'measures':'lengths',m2=p2==='angles'?'measures':'lengths';
 t=T(`If ${nn} ${p1} of a triangle have equal ${m}, then what is true about the ${p2} opposite those ${p1}?`,[kw([[p2.slice(0,-1)],['equal','same','congruent']])],`The ${p2} opposite those ${p1} have equal ${m2}.`,`In a triangle, equal ${p1} are opposite equal ${p2}, so the ${p2} opposite them have equal ${m2}.`,{nn,p1});break;}
case 'a1-tri-sum':{const ty=pick(['an isosceles','a right','a scalene','an obtuse','an acute','an equiangular','an equilateral']);
 t=T(`What is the sum of the measures of the angles in ${ty} triangle?`,[num(180,1,'int')],'180°','The angles of every triangle add up to 180°.',{type:ty});break;}
case 'a1-right-tri-x':{// right triangle, one acute angle given, the other marked x
 const a=int(10,44),bottom=pick([true,false]),c0=90-a,d=Math.min(10/Math.tan(a*Math.PI/180),70),P0=[0,0],P1=[d,0],P2=[0,10];
 const F=Fig().poly([P0,P1,P2]).right(P0,0,90,8).angle(P1,P2,P0,{arc:18,label:bottom?`${a}°`:'x°',px:36,italic:!bottom}).angle(P2,P0,P1,{arc:14,label:bottom?'x°':`${c0}°`,px:30,italic:bottom});
 const z=bottom?c0:a,g=bottom?a:c0;
 t=T('Find the value of x.',[num(z,1,'int')],`${z}°`,`The two acute angles of a right triangle add to 90°: x = 90 − ${g} = ${z}.`,{a,bottom},{svg:F.render(`A right triangle with one acute angle of ${g} degrees and the other marked x degrees`,320,150)});
 t.choices=opts(t,[{value:`${90+z}°`,mistake:'Added 90° instead of subtracting from 90°'},{value:`${180-z}°`,mistake:'Subtracted from 180° and forgot the right angle'},{value:`${Math.abs(180-2*g)}°`,mistake:'Treated the triangle as isosceles'},{value:`${g}°`,mistake:'Gave the angle that was already labelled'}],h);break;}
case 'a1-quad-defs':{const D={rectangle:[kw([['four right','4 right','right angles','90']],['all sides equal','four equal sides','equilateral']),'a parallelogram with four right angles'],square:[kw([['right angle','90','rectangle'],['equal side','equilateral','sides equal','sides are equal','same length','rhombus','congruent sides','equal length','sides of equal']]),'a rhombus with four right angles'],rhombus:[kw([['equal side','equilateral','sides equal','sides are equal','same length','congruent sides','equal length','sides of equal']],['right angle']),'an equilateral parallelogram'],trapezoid:[kw([['exactly two','exactly one pair','only two','one pair','only one pair'],['parallel']],['two pairs','both pairs']),'a quadrilateral with exactly two parallel sides'],parallelogram:[kw([['two pairs','both pairs','opposite sides'],['parallel']],['exactly two','one pair','only one']),'a quadrilateral with two pairs of parallel sides']};
 const ks=Object.keys(D),k1=pick(ks);let k2;do{k2=pick(ks);}while(k2===k1);
 t=T(`(a) Define ${k1}. (b) Define ${k2}. Answer both parts, separated by a semicolon.`,[D[k1][0],D[k2][0]],`(a) A ${k1} is ${D[k1][1]}; (b) A ${k2} is ${D[k2][1]}`,`(a) A ${k1} is ${D[k1][1]}. (b) A ${k2} is ${D[k2][1]}.`,{k1,k2});break;}
case 'a1-quad-name':{const D={rectangle:'four right angles',square:'four right angles and equilateral sides',rhombus:'equilateral sides and opposite sides parallel',trapezoid:'exactly two parallel sides',parallelogram:'two pairs of parallel sides'},k=pick(Object.keys(D));
 t=T(`What is the name of the quadrilateral that has ${D[k]}?`,[word(k)],k,`A quadrilateral with ${D[k]} is a ${k}.`,{k});break;}
case 'a1-quad-best':{const C={square:[[[-10,-10],[-10,10],[10,10],[10,-10]],['trapezoid','rhombus','quadrilateral','pentagon','rectangle','parallelogram']],parallelogram:[[[-10,-5],[-10,10],[10,5],[10,-10]],['quadrilateral','rhombus','polygon']],rectangle:[[[-10,-10],[-10,10],[5,10],[5,-10]],['quadrilateral','parallelogram','rhombus']],trapezoid:[[[-10,-10],[-10,10],[10,5],[10,-5]],['quadrilateral','parallelogram','polygon']],quadrilateral:[[[-10,-5],[-6,4],[9,1],[10,-4]],['parallelogram','trapezoid','polygon']],rhombus:[[[0,-10],[-7,0],[0,10],[7,0]],['quadrilateral','parallelogram','trapezoid']]};
 const k=pick(Object.keys(C)),F=Fig().poly(C[k][0]);if(k==='square'||k==='rectangle')for(const p of C[k][0])F.right(p,Math.atan2(-p[1],0)*180/Math.PI,Math.atan2(0,-p[0])*180/Math.PI,7);
 t=T('Which name BEST describes the figure?',[word(k)],k,`The most specific correct name for the figure is ${k}.`,{k},{svg:F.render(`A four-sided figure`,200,170)});
 const why={quadrilateral:'Gave a correct but less specific name',polygon:'Gave a correct but much less specific name',parallelogram:k==='trapezoid'||k==='quadrilateral'?'Assumed both pairs of sides are parallel':'Gave a correct but less specific name',rhombus:'Assumed all four sides are equal',trapezoid:k==='quadrilateral'?'Assumed one pair of sides is parallel':'Missed that both pairs of sides are parallel',rectangle:'Gave a correct but less specific name',pentagon:'Miscounted the sides'};
 t.choices=opts(t,C[k][1].filter(x=>x!==k).map(x=>({value:x,mistake:why[x]})),h);break;}
case 'a1-square-side':{const u=pick(['inches','feet','meters','centimeters']),s=int(2,12);
 t=T(`The perimeter of a square is ${4*s} ${u}. What is the length of one side of the square, in ${u}?`,[num(s,1,'int')],`${s} ${u}`,`A square has four equal sides: ${4*s} ÷ 4 = ${s}.`,{s,u});break;}
case 'a1-rect-perimeter':{const a=int(3,9),b=int(a+1,15),u=pick(['meters','inches','feet','centimeters']);
 t=T(`The width of a rectangle is ${a} ${u}. The length of the rectangle is ${b} ${u}. What is the perimeter of the rectangle, in ${u}?`,[num(2*a+2*b,1,'int')],`${2*a+2*b} ${u}`,`P = 2(${a}) + 2(${b}) = ${2*a+2*b}.`,{a,b,u});break;}
case 'a1-step-perimeter':{// an L-shaped figure with all right angles
 let L,tp,dn,t2;do{L=int(5,9);tp=int(1,5);dn=int(1,7);t2=int(2,8);}while(tp+t2>=12||dn>=L||t2===tp||tp===L-dn);const u=pick(['meters','inches','feet','centimeters']);
 const P=[[0,0],[0,L],[tp,L],[tp,L-dn],[t2,L-dn],[t2,0]],z=2*L+2*Math.max(tp,t2);
 t=T(`Find the perimeter of the figure. All angles are right angles. Dimensions are in ${u}.`,[num(z,1,'int')],`${z} ${u}`,`The horizontal sides add to twice the widest width (${Math.max(tp,t2)}) and the vertical sides add to twice the height (${L}): P = 2(${L}) + 2(${Math.max(tp,t2)}) = ${z}.`,{L,tp,dn,t2,u},{svg:outline(P,[[0,String(L)],[1,String(tp)],[3,String(L-dn)],[5,String(t2)]],`A figure with right-angle corners: left side ${L}, top ${tp}, lower right side ${L-dn}, bottom ${t2}`)});break;}
case 'a1-notch-perimeter':{const rows=[[20,4],[20,5],[20,6],[25,5],[25,6],[25,7],[25,8],[30,6],[30,7],[30,8],[30,9],[30,10],[35,7],[35,8],[35,9],[35,10],[35,11],[40,8],[40,9],[40,10],[40,11],[40,12],[40,13],[45,9],[45,10],[45,11],[45,12],[45,13],[45,14],[45,15],[50,10],[50,11],[50,12],[50,13],[50,14],[50,15],[50,16]];
 const [a,b]=pick(rows),cc=Math.floor(a/3),d=Math.round(a/2),u=pick(['inches','feet','meters','centimeters']);
 if(v==='notch'){const e=d-cc,z=4*a-2*b+2*e,P=[[0,0],[a,0],[a,a-b],[0.66*a,a-b],[0.66*a,cc],[0.33*a,cc],[0.33*a,d],[0,d]];
  t=T(`Find the perimeter of the figure. All angles are right angles. Dimensions are in ${u}.`,[num(z,1,'int')],`${z} ${u}`,`The top edges add to the bottom, ${a}. The vertical sides add to 2(${a-b}) + 2(${e}). P = 2(${a}) + 2(${a-b}) + 2(${e}) = ${z}.`,{a,b,u},{svg:outline(P,[[0,String(a)],[1,String(a-b)],[5,String(e)]],`A figure with right-angle corners: bottom ${a}, right side ${a-b}, and a step of ${e}`,{w:300,h:200})});}
 else{const z=4*a-2*b,P=[[0,0],[a,0],[a,a-b],[a-b,a-b],[a-b,d],[d,d],[d,cc],[0,cc]];
  t=T(`Find the perimeter of the figure. All angles are right angles. Dimensions are in ${u}.`,[num(z,1,'int')],`${z} ${u}`,`The top edges add to the bottom, ${a}, and the vertical sides add to the right side, ${a-b}. P = 2(${a}) + 2(${a-b}) = ${z}.`,{a,b,u},{svg:outline(P,[[0,String(a)],[1,String(a-b)]],`A stair-step figure with right-angle corners: bottom ${a}, right side ${a-b}`,{w:300,h:200})});}
 break;}
case 'a1-poly-perimeter':{const a=int(4,12),b=int(2,9),cc=int(2,5),d=int(6,9),e=int(1,7),un=pick(['ft','yd','in.','mm','cm','m']),k=int(1,3);let sides,P;
 if(k===1){sides=[a+1,a,a-2];P=[[2,0],[0,5],[5,5]];}else if(k===2){sides=[e+a,e+a-1,e+a-2,cc,d+e];P=[[0,0],[0,4],[5,4],[8,2],[8,0]];}else{sides=[cc+6,cc+b+4,cc+5+b,cc+d+b];P=[[4,0],[0,1],[2,5],[8,4]];}
 const z=sides.reduce((s,x)=>s+x,0),lab=k===1?[[0,`${a} ${un}`],[1,`${a-2} ${un}`],[2,`${a+1} ${un}`]]:k===2?[[0,`${e+a} ${un}`],[1,`${e+a-1} ${un}`],[2,`${e+a-2} ${un}`],[3,`${cc} ${un}`],[4,`${d+e} ${un}`]]:[[0,`${cc+6} ${un}`],[1,`${cc+b+4} ${un}`],[2,`${cc+5+b} ${un}`],[3,`${cc+d+b} ${un}`]];
 t=T('Find the perimeter of the figure.',[num(z,1,'int')],`${z} ${un}`,`Add the side lengths: ${sides.join(' + ')} = ${z} ${un}.`,{sides,un,k},{svg:outline(P,lab,`A ${sides.length}-sided figure with sides ${sides.join(', ')} ${un}`,{px:22})});
 const mn0=Math.min(...sides),mx0=Math.max(...sides);t.choices=opts(t,[{value:`${z-mn0} ${un}`,mistake:'Left out one side'},{value:`${z+mx0} ${un}`,mistake:'Counted one side twice'},{value:`${z+10} ${un}`,mistake:'Addition slip: carried an extra ten'},{value:`${z-10} ${un}`,mistake:'Addition slip: forgot to carry a ten'}],h);break;}
case 'a1-circumference':{const u=pick(['inches','feet','meters','centimeters']);
 if(v==='radius'||v==='mc'){const a=v==='mc'?int(3,9):int(2,15),un=v==='mc'?pick([['in.','inches'],['cm','centimeters'],['ft','feet']]):[u,u],z=R(628*a,100);
  t=T(`The radius of a circle is ${a} ${un[1]}. Find the circumference of the circle. Use 3.14 for π.`,[num(628*a,100,'dec')],`${decT(628*a,100)} ${un[0]}`,`C = 2πr ≈ 2(3.14)(${a}) = ${decT(628*a,100)}.`,{a,un:un[0]});
  if(v==='mc')t.choices=opts(t,[{value:`${decT(314*a,100)} ${un[0]}`,mistake:'Used the radius as if it were the diameter'},{value:`${(3.14/a).toFixed(3)} ${un[0]}`,mistake:'Divided π by the radius'},{value:`${decT(314*a*a,100)} ${un[0]}`,mistake:'Found the area instead of the circumference'},{value:`${(6.28/a).toFixed(3)} ${un[0]}`,mistake:'Divided 2π by the radius'}],h);}
 else if(v==='diameter'){const a=int(6,20);t=T(`The diameter of a circle is ${a} ${u}. Find the circumference of the circle. Use 3.14 for π.`,[num(314*a,100,'dec')],`${decT(314*a,100)} ${u}`,`C = πd ≈ 3.14(${a}) = ${decT(314*a,100)}.`,{a,u});}
 else{const a=2*int(3,10),k=pick(['radius','diameter']),z=k==='radius'?a/2:a;t=T(`The circumference of a circle is ${a}π ${u}. What is the ${k} of the circle, in ${u}?`,[num(z,1,'int')],`${z} ${u}`,`C = πd, so d = ${a}${k==='radius'?` and r = ${a}/2 = ${z}`:''}.`,{a,k,u});}
 break;}
case 'a1-semi-perim':{// rectangles with semicircles; exact perimeter a + bπ
 const rows=[];for(const [A,lo] of [[2,3],[3,3],[4,3],[5,3],[6,3]])for(let B=lo;B<=12;B++)if(!(A===2&&B>8))rows.push([A,B]);
 const rows47=[];for(const [A,lo] of [[2,3],[3,4],[4,5],[5,6],[6,7]])for(let B=lo;B<=12;B++)rows47.push([A,B]);
 const [a,b]=pick(v==='notch'?rows47:rows),u=pick(['inches','feet','meters','centimeters']);let shape=v==='notch'?'notch':v==='both'?pick(['both','half','one']):'one';
 const P=shape==='both'?[2*b,2*a]:shape==='notch'?[2*a+2*b,a]:[2*a+2*b,a],side=pick(['left','right']);
 // drawing: rectangle b by 2a (or b by a for the half shape) with the semicircle(s)
 const k=150/(b+2.2*a),W=Math.round((b+2.4*a)*k)+60,H=Math.round(2*a*k)+70,x0=30+1.1*a*k,y0=35,X=x=>x0+x*k,Y=y=>y0+(a-y)*k,r=a*k;let g='';
 const arcL=(cx,cy,sweep)=>`<path d="M${X(cx).toFixed(1)},${Y(cy+a).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 ${sweep} ${X(cx).toFixed(1)},${Y(cy-a).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
 if(shape==='half'){g+=arcL(0,0,0)+ln(X(0),Y(a),X(0),Y(0))+ln(X(0),Y(0),X(b),Y(0))+ln(X(b),Y(0),X(b),Y(-a))+ln(X(b),Y(-a),X(0),Y(-a))+ln(X(0),Y(0),X(0),Y(-a),{dash:'4,3',w:1})+tx(X(b/2),Y(0)-6,String(b))+tx(X(-a/2),Y(-a/2)+16,String(a))+ln(X(0),Y(0),X(-a*0.7),Y(-a*0.7),{w:1});}
 else{g+=ln(X(0),Y(a),X(b),Y(a))+ln(X(0),Y(-a),X(b),Y(-a))+tx(X(b/2),Y(a)-6,String(b));
  const left=shape==='both'||shape==='notch'?'line':side==='left'?'arc':'line',right=shape==='both'?'arc':shape==='notch'?'notch':side==='left'?'line':'arc';
  if(left==='arc')g+=arcL(0,0,0)+ln(X(0),Y(a),X(0),Y(-a),{dash:'4,3',w:1})+ln(X(0),Y(0),X(-a*0.7),Y(a*0.7),{w:1})+tx(X(-a*0.45),Y(a*0.2),String(a))+dot(X(0),Y(0));else g+=ln(X(0),Y(a),X(0),Y(-a))+tx(X(0)-8,Y(0)+4,String(2*a),{anchor:'end'});
  if(right==='arc')g+=`<path d="M${X(b).toFixed(1)},${Y(a).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${X(b).toFixed(1)},${Y(-a).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(X(b),Y(a),X(b),Y(-a),{dash:'4,3',w:1})+dot(X(b),Y(0))+ln(X(b),Y(0),X(b+a*0.7),Y(a*0.7),{w:1})+tx(X(b+a*0.45),Y(a*0.2),String(a));
  else if(right==='notch')g+=`<path d="M${X(b).toFixed(1)},${Y(a).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 0 ${X(b).toFixed(1)},${Y(-a).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(X(b),Y(a),X(b),Y(-a),{dash:'4,3',w:1})+dot(X(b),Y(0))+ln(X(b),Y(0),X(b-a*0.7),Y(a*0.7),{w:1})+tx(X(b-a*0.4),Y(-a*0.25),String(a));
  else g+=ln(X(b),Y(a),X(b),Y(-a))+tx(X(b)+8,Y(0)+4,String(2*a),{anchor:'start'});}
 const desc=shape==='both'?`A rectangle ${b} long with a semicircle of radius ${a} on each end`:shape==='half'?`A rectangle ${b} by ${a} with a semicircle of radius ${a} on one end`:shape==='notch'?`A rectangle ${b} by ${2*a} with a semicircle of radius ${a} cut out of one end`:`A rectangle ${b} by ${2*a} with a semicircle of radius ${a} on one end`;
 const val=`${P[0]} + ${P[1]===1?'':P[1]}π`;
 t=T(`Find the perimeter of the figure. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[P[0],1],b:[P[1],1]}],`(${val}) ${u}`,`The straight sides add to ${P[0]}; the curved part is ${shape==='both'?'a whole circle of radius '+a+', 2π('+a+')':'half a circle of radius '+a+', π('+a+')'} = ${P[1]}π. Perimeter = ${val}.`,{a,b,shape,side,u},{svg:svg(g,desc,W,H)});break;}
case 'a1-natural':{const k=pick(['natural','counting']),z=k==='natural'?'counting':'natural';
 t=T(`What numbers are also called ${k} numbers?`,[word(z,z+' numbers')],`${z} numbers`,`The ${k} numbers {1, 2, 3, ...} are also called the ${z} numbers.`,{k});break;}
case 'a1-frac-prod3':{let a,b,cc,a1,b1,c1;do{do{a=int(3,8);b=int(4,8);}while(a===b);cc=int(3,8);do{a1=int(1,a-1);}while(gcd(a1,a)!==1);do{b1=int(1,b-1);}while(gcd(b1,b)!==1);do{c1=int(1,cc-1);}while(gcd(c1,cc)!==1);}while(gcd(a*b*cc,a1*b1*c1)===1);
 const N=a1*b1*c1,D=a*b*cc;t=T(`Multiply: ${a1}/${a} × ${b1}/${b} × ${c1}/${cc}. Write the answer in lowest terms.`,[num(N,D,'frac')],fracT(N,D),`${a1}·${b1}·${c1} / (${a}·${b}·${cc}) = ${N}/${D} = ${fracT(N,D)}.`,{a,b,c:cc,a1,b1,c1},{math:math(`<mrow>${mfrac(a1,a)}${mo('×')}${mfrac(b1,b)}${mo('×')}${mfrac(c1,cc)}</mrow>`)});break;}
case 'a1-mixed-prod3':{let a,b,cc,d,e,f,g,hh,i,N,D;do{a=int(1,6);d=int(1,6);g=int(1,6);cc=int(2,9);do{b=int(1,cc-1);}while(gcd(b,cc)!==1);f=int(2,9);do{e=int(1,f-1);}while(gcd(e,f)!==1);hh=int(2,9);do{i=int(1,hh-1);}while(gcd(i,hh)!==1);N=(cc*a+b)*(d*f+e)*(g*hh+i);D=cc*f*hh;}while(D/gcd(N,D)>99);
 t=T(`Multiply: ${a} ${b}/${cc} × ${d} ${e}/${f} × ${g} ${i}/${hh}. Write the answer as a mixed number.`,[num(N,D,'mixed')],mixT(N,D),`Write each as an improper fraction: ${cc*a+b}/${cc} × ${d*f+e}/${f} × ${g*hh+i}/${hh} = ${fracT(N,D)} = ${mixT(N,D)}.`,{a,b,c:cc,d,e,f,g,h:hh,i},{math:math(`<mrow>${mixedML(a,b,cc)}${mo('×')}${mixedML(d,e,f)}${mo('×')}${mixedML(g,i,hh)}</mrow>`)});break;}
case 'a1-mixed-div':{// (ab/c) ÷ (a²/d), each shown as a mixed number
 let a,b,cc,d;if(v==='table'){const rows=zip([3,3,5,5,5,2,4,3,4,5,2,3,5,5,5,4,5,4,3,3,5,3,3,5,5,4,5,2,5,5,5,3,4,5,5,5,3,5,4,4,5,3,5,5,3,5],[2,2,2,2,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,6,6,6,7,7,7,7,7,7,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9],[5,7,7,9,2,5,7,7,3,3,7,7,7,9,2,3,4,7,7,8,9,5,7,7,2,3,3,5,8,9,3,5,5,7,9,9,2,4,5,5,7,7,7,8,8,8],[8,4,8,8,6,3,5,8,5,8,3,5,7,3,6,9,9,5,8,8,3,8,4,8,7,3,6,3,3,3,4,4,7,3,4,9,5,9,5,9,4,7,9,4,7,9]);[a,b,cc,d]=pick(rows);}
 else{do{b=int(2,9);do{cc=int(3,9);}while(cc===b);d=int(2,9);a=int(2,5);}while(gcd(a,d)!==1||a===cc||a===d||a*a<=d||a*a*cc===d*a*b||gcd(cc,a*b)!==1);}
 const f=a*b,N=b*d,D=cc*a;
 t=T(`Divide: ${mixT(f,cc)} ÷ ${mixT(a*a,d)}. Write the answer as a mixed number or a proper fraction.`,[num(N,D,'mixed')],mixT(N,D),`${fracT(f,cc)} × ${fracT(d,a*a)} = ${fracT(N,D)} = ${mixT(N,D)}.`,{a,b,c:cc,d},{math:math(`<mrow>${mixML(f,cc)}${mo('÷')}${mixML(a*a,d)}</mrow>`)});
 if(v==='table')t.choices=opts(t,[{value:mixT(f*a*a,cc*d),mistake:'Multiplied instead of dividing'},{value:mixT(cc*a*a,f*d),mistake:'Inverted the first fraction instead of the second'},{value:mixT(D,N),mistake:'Inverted both fractions'},{value:mixT(f+1,cc+d),mistake:'Added the numerators and the denominators'}],h);break;}
case 'a1-complex-frac':{let a,b,cc,d;do{a=int(10,30);b=int(2,9);cc=int(10,30);d=int(2,9);}while(a%b===0||cc%d===0||(a===cc&&d===b));
 const N=a*d,D=b*cc;t=T(`Simplify the complex fraction: (${mixT(a,b)}) / (${mixT(cc,d)}). Write the answer as a mixed number or a proper fraction.`,[num(N,D,'mixed')],mixT(N,D),`(${fracT(a,b)}) ÷ (${fracT(cc,d)}) = ${fracT(a,b)} × ${fracT(d,cc)} = ${mixT(N,D)}.`,{a,b,c:cc,d},{math:math(`<mfrac>${mixML(a,b)}${mixML(cc,d)}</mfrac>`)});break;}
case 'a1-frac-prod-cancel':{const rows=[[4,5,1,4],[4,5,1,5],[4,5,1,7],[4,5,3,4],[4,5,3,5],[4,5,3,7],[4,7,1,4],[4,7,1,5],[4,7,1,7],[4,7,3,4],[4,7,3,5],[4,7,3,7],[5,7,1,4],[5,7,1,5],[5,7,1,7],[5,7,3,4],[5,7,3,5],[5,7,3,7],[6,7,1,4],[6,7,1,5],[6,7,1,7],[6,7,3,4],[6,7,3,5]];
 const [a,b,cc,d]=pick(rows),x=int(1,2),e=x===1?0:1,f=x===1?1:0,g=int(5,7),hh=b**e*d**f*g,i=b*d*(g+1),N=a*cc*hh,D=b*d*i;
 t=T(`Multiply: ${a}/${b} × ${cc}/${d} × ${hh}/${i}. Write the answer in lowest terms.`,[num(N,D,'frac')],fracT(N,D),`Cancel common factors before multiplying: ${a}·${cc}·${hh} / (${b}·${d}·${i}) = ${fracT(N,D)}.`,{a,b,c:cc,d,x,g},{math:math(`<mrow>${mfrac(a,b)}${mo('×')}${mfrac(cc,d)}${mo('×')}${mfrac(hh,i)}</mrow>`)});
 t.choices=opts(t,[{value:fracT(a*cc,b*d),mistake:'Multiplied only the first two fractions'},{value:`${N}/${D}`,mistake:'Did not reduce the product to lowest terms'},{value:fracT(N*b,D),mistake:'Cancelled a factor that does not appear in a denominator'},{value:fracT(N*d,D),mistake:'Cancelled the same factor twice'}],h);break;}
case 'a1-op-names':{const ops=['addition','subtraction','multiplication','division'],res={addition:'sum',subtraction:'difference',multiplication:'product',division:'quotient'};
 const art=o=>o==='addition'?'an':'a';
 if(v==='one'){const o=pick(ops);t=T(`What is the result of ${art(o)} ${o} called?`,[word(res[o])],res[o],`The result of ${o} is the ${res[o]}.`,{o});
  const W={addition:['addend','product','factor'],subtraction:['minuend','subtrahend','quotient'],multiplication:['factor','sum','quotient'],division:['divisor','dividend','difference']};
  t.choices=opts(t,W[o].map(x=>({value:x,mistake:['addend','minuend','subtrahend','factor','divisor','dividend'].includes(x)?`Named a number used in the ${o}, not its result`:`Named the result of a different operation`})),h);}
 else{const o1=pick(ops);let o2;do{o2=pick(ops.slice(1));}while(o2===o1);
  t=T(`(a) What is the result of ${art(o1)} ${o1} called? (b) What is the result of ${art(o2)} ${o2} called? Answer both parts, separated by a semicolon.`,[word(res[o1]),word(res[o2])],`(a) ${res[o1]}; (b) ${res[o2]}`,`(a) The result of ${o1} is the ${res[o1]}. (b) The result of ${o2} is the ${res[o2]}.`,{o1,o2});}
 break;}
case 'a1-dec-div':{const a=int(11111,55555),b=int(2,9);
 t=T(`Divide: ${decT(a*b,10000)} ÷ ${decT(a,10000)}`,[num(b,1,'dec')],String(b),`Move both decimal points four places: ${a*b} ÷ ${a} = ${b}.`,{a,b});break;}
case 'a1-dec-mul':{let a,cc,b,d;do{a=int(1,3);cc=int(1,3);}while(a===cc);b=int(11,19);d=int(501,599);const P=d*b,z=[P,10**(a+cc)];
 t=T(`Multiply: ${decT(d,10**a)} × ${decT(b,10**cc)}`,[num(...z,'dec')],decT(...z),`${d} × ${b} = ${P}; the factors have ${a} and ${cc} decimal places, so the product has ${a+cc}: ${decT(...z)}.`,{a,c:cc,b,d});
 t.choices=opts(t,[{value:decT(P,10**a),mistake:'Counted only the decimal places of the first factor'},{value:decT(P,10**cc),mistake:'Counted only the decimal places of the second factor'},{value:decT(P,10**(a+cc+1)),mistake:'Placed the decimal point one place too far left'},{value:decT(P,10**(a+cc-1)),mistake:'Placed the decimal point one place too far right'}],h);break;}
case 'a1-dec-sub':{let a,b,cc,d,z;do{a=int(6,20);b=int(9,99);cc=int(0,2);d=int(99,999);z=a*1000+b*10-cc*1000-d;}while(false);
 t=T(`Subtract: ${decT(a*100+b,100)} − ${decT(cc*1000+d,1000)}`,[num(z,1000,'dec')],decT(z,1000),`Line up the decimal points: ${decT(a*100+b,100)} − ${decT(cc*1000+d,1000)} = ${decT(z,1000)}.`,{a,b,c:cc,d});
 t.choices=opts(t,[{value:decT(z+1000,1000),mistake:'Did not regroup from the ones place'},{value:decT(z-1000,1000),mistake:'Regrouped from the ones place twice'},{value:decT(a*1000+b-cc*1000-d,1000),mistake:'Lined up the last digits instead of the decimal points'}],h);break;}
case 'a1-dec-add':{const a=int(0,5),b=int(0,5),cc=int(99,999),d=int(9,99),first=pick([1,2]),n1=[a*100+d,100],n2=[b*1000+cc,1000],z=a*1000+d*10+b*1000+cc;const [p,q]=first===1?[n1,n2]:[n2,n1];
 t=T(`Add: ${decT(...p)} + ${decT(...q)}`,[num(z,1000,'dec')],decT(z,1000),`Line up the decimal points: ${decT(...p)} + ${decT(...q)} = ${decT(z,1000)}.`,{a,b,c:cc,d,first});
 t.choices=opts(t,[{value:decT(a*1000+d+b*1000+cc,1000),mistake:'Lined up the last digits instead of the decimal points'},{value:decT(a*1000+d*10+b*1000+cc*10,1000),mistake:'Shifted the thousandths number one place left'},{value:decT(a*1000+d+b*1000+cc*10,1000),mistake:'Misaligned both numbers when lining up digits'}],h);break;}
case 'a1-unit-chain':{const b=int(20,59);
 const C={'in-yd':['inches','yards',['(1/12)','(1/3)'],[1,36]],'yd-in':['yards','inches',['(3)','(12)'],[36,1]],'in-mi':['inches','miles',['(1/12)','(1/5280)'],[1,63360]],'mi-in':['miles','inches',['(5280)','(12)'],[63360,1]],'cm-km':['centimeters','kilometers',['(1/100)','(1/1000)'],[1,100000]],'km-cm':['kilometers','centimeters',['(1000)','(100)'],[100000,1]],
  'cm-ft':['centimeters','feet',['(1/2.54)','(1/12)'],[100,3048]],'ft-cm':['feet','centimeters',['(12)','(2.54)'],[3048,100]],'in-m':['inches','meters',['(2.54)','(1/100)'],[254,10000]],'m-in':['meters','inches',['(100)','(1/2.54)'],[10000,254]],
  'm-ft':['meters','feet',['(100)','(1/2.54)','(1/12)'],[10000,3048]],'ft-m':['feet','meters',['(12)','(2.54)','(1/100)'],[3048,10000]],'mi-cm':['miles','centimeters',['(5280)','(12)','(2.54)'],[1609344,10]],'cm-mi':['centimeters','miles',['(1/2.54)','(1/12)','(1/5280)'],[10,1609344]]};
 const pool=v==='two'?['in-yd','yd-in','in-mi','mi-in','cm-km','km-cm']:v==='three'?['m-ft','ft-m','mi-cm','cm-mi']:['cm-ft','ft-cm','in-m','m-in'],k=pick(pool),[u1,u2,fs,[vn,vd]]=C[k],m=fs.length;
 const val=[b*vn,vd],key=`${b}${fs.join('')} ${u2}`;
 t=T(`Use ${m===2?'two':'three'} unit multipliers to convert ${b} ${u1} to ${u2}. Write the measurement times the unit multipliers in parentheses; you do not need to multiply them out.`,[{t:'chain',v:val,start:b,min:m}],key,`${b} ${u1} × ${fs.join(' × ')} ${u2}: each multiplier equals 1 and cancels the unit before it.`,{b,k});
 if(v==='mixed'){const inv=x=>x.startsWith('(1/')?'('+x.slice(3):'(1/'+x.slice(1);t.choices=opts(t,[{value:`${b}${inv(fs[0])}${inv(fs[1])} ${u2}`,mistake:'Wrote both unit multipliers upside down'},{value:`${b}${inv(fs[0])}${fs[1]} ${u2}`,mistake:'Wrote the first unit multiplier upside down'},{value:`${b}${fs[0]}${inv(fs[1])} ${u2}`,mistake:'Wrote the second unit multiplier upside down'}],h);}
 break;}
case 'a1-sets':{t=T('(a) Use braces and digits to designate the set of natural numbers. (b) Use braces and digits to designate the set of whole numbers. (c) Use braces and digits to designate the set of integers. Answer all three parts, separated by semicolons.',[{t:'roster',set:'natural'},{t:'roster',set:'whole'},{t:'roster',set:'integers'}],'(a) {1, 2, 3, 4, 5, ...}; (b) {0, 1, 2, 3, 4, 5, ...}; (c) {..., −3, −2, −1, 0, 1, 2, 3, ...}','The natural numbers start at 1, the whole numbers add 0, and the integers also include the negatives.',{form:pick(['a','b'])});break;}
case 'a1-set-name':{const k=pick(['natural','whole','integers']),q={natural:'{1, 2, 3, 4, 5, ...}',whole:'{0, 1, 2, 3, 4, 5, ...}',integers:'{..., −3, −2, −1, 0, 1, 2, 3, ...}'}[k],z=k==='integers'?'integers':k+' numbers';
 t=T(`${q} designates the set of what numbers?`,[word(z,k==='integers'?'integer':k)],z,`${q} is the set of ${z}.`,{k});
 t.choices=opts(t,[{value:'natural numbers',mistake:'Did not notice whether 0 or the negatives are included'},{value:'whole numbers',mistake:'Did not notice whether 0 or the negatives are included'},{value:'integers',mistake:'Did not notice that there are no negative numbers'},{value:'imaginary numbers',mistake:'Named a set that is not listed with digits'}],h);break;}
case 'a1-abs':{if(v==='decimal'){const a=int(11,99);t=T(`Evaluate: |−${decT(a,10)}|`,[num(a,10,'dec')],decT(a,10),`The absolute value of a number is its distance from 0: ${decT(a,10)}.`,{a,kind:'decimal'},{math:math(`<mrow>${mo('|')}${mo('−')}<mn>${decT(a,10)}</mn>${mo('|')}</mrow>`)});}
 else if(v==='expr'){let a,b,s;do{a=int(1,19)*pick([1,-1]);b=int(1,19)*pick([1,-1]);s=pick([1,2]);}while(Math.abs(a)===Math.abs(b)||a+(s===1?-b:b)>0);const z=Math.abs(a+(s===1?-b:b)),op=s===1?'−':'+';
  t=T(`Evaluate: |${minus(a)} ${op} ${par(b)}|`,[num(z,1,'int')],String(z),`${minus(a)} ${op} ${par(b)} = ${minus(a+(s===1?-b:b))}, and its absolute value is ${z}.`,{a,b,s});}
 else{const a=int(2,25)*pick([1,-1]),z=Math.abs(a);t=T(`Simplify: |${minus(a)}|`,[num(z,1,'int')],String(z),`|${minus(a)}| = ${z}.`,{a});
  t.choices=opts(t,[{value:minus(-z),mistake:'Gave the opposite of the absolute value'},{value:`−1/${z}`,mistake:'Gave the negative reciprocal'},{value:`1/${z}`,mistake:'Gave the reciprocal'}],h);}
 break;}
case 'a1-name':{const D={commutative:['What property of addition states that the order in which two real numbers are added does not affect the sum?',kw([['commutative']],['associative','distributive']),'The commutative property of addition'],inverse:['What is another name for the opposite of a number?',kw([['additive inverse']]),'Additive inverse']}[v];
 t=T(D[0],[D[1]],D[2],D[2]+'.',{k:v,form:pick(['a','b'])});break;}
case 'a1-signed-sum':{let a,b;if(v==='pos-neg'){a=int(1,9);b=-int(10,19);}else{do{a=int(1,20)*pick([1,-1]);b=int(2,20)*pick([1,-1]);}while(Math.abs(a)===Math.abs(b)||(a>0&&b>0));}
 const z=a+b;t=T(`Add: (${sgn(a)}) + (${sgn(b)})`,[num(z,1,'int')],sgn(z).replace(/^\+/,''),`${minus(a)} + ${par(b)} = ${minus(z)}.`,{a,b});
 t.choices=opts(t,(v==='pos-neg'?[{value:sgn(b-a),mistake:'Subtracted the positive number from the negative one'},{value:sgn(-b-a),mistake:'Subtracted the absolute values and kept the wrong sign'},{value:sgn(a-b),mistake:'Added the absolute values'}]:[{value:sgn(a-b),mistake:'Subtracted the second number instead of adding it'},{value:sgn(-a+b),mistake:'Changed the sign of the first number'},{value:sgn(-a-b),mistake:'Gave the opposite of the sum'}]),h);break;}
case 'a1-three-sum':{let a,cc,b,z;do{a=int(-7,-2);cc=int(-6,-2);b=int(2,9);z=a+b+cc;}while(z===0||Math.abs(-a+b-cc)===Math.abs(z));
 t=T(`Add: (${minus(a)}) + (${sgn(b)}) + (${minus(cc)})`,[num(z,1,'int')],minus(z),`${minus(a)} + ${b} + ${par(cc)} = ${minus(z)}.`,{a,b,c:cc});
 const d1=-a+b-cc;t.choices=opts(t,[{value:sgn(d1),mistake:'Treated every number as positive'},{value:sgn(-d1),mistake:'Treated every number as negative'},{value:sgn(-z),mistake:'Gave the opposite of the sum'}],h);break;}
case 'a1-seven-sum':{const a=v==='mc'?int(-20,-2):int(-20,1),r=()=>int(1,20)*pick([1,-1]),[b,cc,d,e,f,g]=[r(),r(),r(),r(),r(),r()],z=a+b+cc+d+e+f+g;
 const str=lead([a,b,cc,d,e,f,g].map(sgn).join(' '));
 t=T(`Simplify: ${str}`,[num(z,1,'int')],minus(z),`Add the positive numbers and the negative numbers separately, then combine: ${minus(z)}.`,{terms:[a,b,cc,d,e,f,g]});
 if(v==='mc')t.choices=opts(t,[{value:minus(a+b-cc-d+e+f-g),mistake:'Read the signs of the third, fourth and seventh numbers incorrectly'},{value:minus(a-b-cc+d-e-f+g),mistake:'Read the signs of most of the numbers incorrectly'},{value:minus(-a+b-cc+d-e+f-g),mistake:'Changed the sign of every other number'},{value:minus(-z),mistake:'Gave the opposite of the sum'}],h);break;}
case 'a1-abs-ops':{// ±|a ± b| ± c ± d
 const a=pick([-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9]),b=int(2,9),cc=int(2,9),d=int(2,9),[t1,t2,t3,t4]=[pick([1,-1]),pick([1,-1]),pick([1,-1]),pick([1,-1])];
 const z=t1*Math.abs(a+t2*b)+t3*cc+t4*d,sg=x=>x<0?'−':'+',bars0=`${sg(t1)} |${minus(a)} ${sg(t2)} ${b}|`,bars=bars0,str=(v==='mc'?lead(`${sg(t3)} ${cc} ${bars} ${sg(t4)} ${d}`):lead(`${bars} ${sg(t3)} ${cc} ${sg(t4)} ${d}`)).replace(/^− /,'−');
 t=T(`Simplify: ${str}`,[num(z,1,'int')],minus(z),`First, ${minus(a)} ${sg(t2)} ${b} = ${minus(a+t2*b)} and its absolute value is ${Math.abs(a+t2*b)}. Then ${minus(t1*Math.abs(a+t2*b))} ${sg(t3)} ${cc} ${sg(t4)} ${d} = ${minus(z)}.`,{a,b,c:cc,d,signs:[t1,t2,t3,t4]});
 if(v==='mc'){const nb=t1*(a+t2*b)+t3*cc+t4*d;t.choices=opts(t,[{value:minus(nb===z?-nb:nb),mistake:'Ignored the absolute value bars'},{value:minus(z-2*t3*cc),mistake:`Used the wrong sign in front of ${cc}`},{value:minus(z-2*t4*d),mistake:`Used the wrong sign in front of ${d}`},{value:minus(-z),mistake:'Gave the opposite of the result'},{value:minus(t1*Math.abs(Math.abs(a)+t2*b)+t3*cc+t4*d),mistake:'Made the first number inside the bars positive before combining'},{value:minus(t1*(Math.abs(a)+b)+t3*cc+t4*d),mistake:'Added the absolute values of the numbers inside the bars'}],h);}
 break;}
default:throw Error('Unknown Algebra 1 port recipe '+c.recipe);}
return t;}

const api=Object.freeze({key:'algebra-1',course:'Algebra 1',prefix:'a1-',batchPrefix:'A1',catalog,build,check,answerText});
if(common)module.exports=api;root.MathPortAlgebra1=api;
})(typeof globalThis!=='undefined'?globalThis:this);
