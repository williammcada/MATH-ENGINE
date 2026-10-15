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
     kw     {t:'kw', need:[[...],...], avoid:[...]}  a written statement: one phrase from every need group, no avoid phrase,
            and no number that the need phrases do not use
     pi     {t:'pi', a:[n,d], b:[n,d]} the exact value a + bπ, written with π (or pi) and no decimal approximation
     chain  {t:'chain', v:[n,d], start, min} a measurement times at least `min` unit multipliers, product equal to v
     roster {t:'roster', set:'natural'|'whole'|'integers'} the set in braces with an ellipsis
     poly   {t:'poly', terms, form?, order?}  a polynomial with like terms combined; form 'pos' | 'num' | 'neg' | 'den'
            (see polyForm); order 'desc' requires the terms in descending degree
     factor {t:'factor', gcf:[key, coef], inner} the greatest common factor times the remaining polynomial in parentheses
     primes {t:'primes', n}           a product of primes (exponents allowed) equal to n
     ineq   {t:'ineq', v, mode, op, b | L,R, neg?} a linear inequality: 'set' the same solution set as v op b, 'form' the
            same two sides; neg requires a negated symbol (≯ ≮ ≰ ≱)
     solve  {t:'solve', v, vars, samples} "v = expression" in the other variables
     ratexp {t:'ratexp', num, den, vars} one fraction: numerator polynomial (like terms combined), denominator equal to den
     conj   {t:'conj', lo, hi, loIn, hiIn} a conjunction lo < x < hi (≤ where included), compound or joined by "and"
     num also takes pct:true, which allows a trailing percent sign
     pair   {t:'pair', v:[[n,d],[n,d]]}  an ordered pair (x, y)
     pm     {t:'pm', vals:[[re,im],[re,im]]} two exact values ("a ± b" or two values), i for imaginary parts
     numset {t:'numset', items}       a set of integers in braces, any order
     sets   {t:'sets', items}         names of number sets (rational, irrational, integer, whole, natural), any order
     ineq and conj take intdom:true for the integer domain, where x > 2 and x ≥ 3 are the same
     factors {t:'factors', poly, n}  a product (a front factor, then n factors in parentheses, each with no common factor)
     sci    {t:'sci', m, e}           scientific notation m × 10^e
     nums   {t:'nums', items}         several integers separated by commas, any order
     simple {t:'simple', num, den, vars} one fraction, no negative exponents, no common factor, equal to num/den
     divq   {t:'divq', q, r, div}     a quotient polynomial plus remainder over the divisor ("Q + r/(x + d)" or "Q R r")
     sci2   {t:'sci2', v}             a number, as an ordinary number or in scientific notation
     ineq takes strip:true (a domain written "D = {x ∈ ℝ | x ≥ 2}" or "{x | x ≥ 2}"); conj takes v for a variable other than x */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const S=common?require('./port-shared'):root.MathPortShared;
const catalog=common?require('./port-algebra-1-map'):root.MathPortAlgebra1Map;
const {U,M,R,n,gcd,mfrac,mixedML,math,mo,mi,mn,minus,svg,ln,tx,dot,Fig,parseExpr,near,INK,esc}=S;

// ---------- course helpers ----------
const red=(a,b)=>{if(b<0){a=-a;b=-b;}const g=gcd(Math.abs(a),b)||1;return [a/g,b/g];};
const neg=x=>String(x).replace(/^-/,'−');
const mixT=(a,b)=>neg(U.mixed(R(a,b))),fracT=(a,b)=>neg(U.f(R(a,b))),decT=(a,b)=>neg(U.dec(R(a,b)));
// An exact value a + bπ for keys: terminating decimals where possible, otherwise a fraction; a fractional coefficient of π in parentheses.
const piNum=(n,d)=>{[n,d]=red(n,d);let k=d;while(k%2===0)k/=2;while(k%5===0)k/=5;return k===1?decT(n,d):fracT(n,d);};
const piCo=(n,d)=>{[n,d]=red(Math.abs(n),d);return d===1?(n===1?'':String(n)):`(${n}/${d})`;};
const piT=(a,b,first='num')=>{const A=piNum(...a),B=piCo(...b)+'π';if(first==='pi')return `${b[0]<0?'−':''}${B} ${a[0]<0?'−':'+'} ${piNum(Math.abs(a[0]),a[1])}`;return `${A} ${b[0]<0?'−':'+'} ${B}`;};
const fracParts=(a,b)=>{[a,b]=red(a,b);return [Math.floor(a/b),a%b,b];};
// MathML for a value a/b written as a (simplified) mixed number, proper fraction or integer.
const mixML=(a,b)=>{const [w,r,d]=fracParts(a,b);if(!r)return mn(w);return w?mixedML(w,r,d):mfrac(r,d);};
const sgn=x=>x<0?'−'+Math.abs(x):'+'+x;                       // explicit sign, as in a string of signed terms
const par=x=>x<0?'('+minus(x)+')':String(x);                   // parentheses round a negative number
const lead=s=>s.replace(/^\+\s*/,'');                          // drop a leading plus sign
const T=(prompt,parts,value,solution,p,o={})=>{const t={prompt,answer:{kind:'a1',parts,value},solution,parameters:p};if(o.svg)t.svg=o.svg;if(o.math)t.math=o.math;return t;};
const num=(a,b=1,form='any')=>({t:'num',v:red(a,b),form});
const word=(...alts)=>({t:'word',alts});
// Polynomial answer from [[coef, {var: exponent}], ...]: key text and the part (zero terms dropped, like terms combined).
const polyPart=terms=>{const m={};for(const [c0,v0] of terms){const k=mkey(v0);m[k]=(m[k]||0)+c0;}for(const k of Object.keys(m))if(!m[k])delete m[k];return {t:'poly',terms:m};};
const polyStr=terms=>S.polyText(terms.filter(([c0])=>c0).map(([c0,v0])=>[c0,Object.entries(v0)]));
// Consecutive variable letters, as the source picks them, skipping the given letters.
const letters=(int,n,skip='oil')=>{const pool=[...'abcdefghijklmnopqrstuvwxyz'].filter(x=>!skip.includes(x)),k=int(0,pool.length-n);return pool.slice(k,k+n);};
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
const add2=(x,y)=>red(x[0]*y[1]+y[0]*x[1],x[1]*y[1]),sub=(x,y)=>add2(x,[-y[0],y[1]]),mul2=(x,y)=>red(x[0]*y[0],x[1]*y[1]),div=(x,y)=>red(x[0]*y[1],x[1]*y[0]);
const stripUnit=s=>String(s).replace(/(?<=[\d)π²³])\s*(?:°|degrees?\b|[a-zA-Z][a-zA-Z.]*(?:\s*[²³23])?)(?:\s+[a-zA-Z][a-zA-Z.]*)*\s*$/,'').trim();
const normW=s=>String(s).toLowerCase().replace(/[−–]/g,'-').replace(/[.,!;:'’"()]/g,' ').replace(/\b(a|an|the)\b/g,' ').replace(/\s+/g,' ').trim();
function partOk(p,s){s=String(s).trim();
 if(p.t==='num'){if(p.pct)s=s.replace(/\s*%$/,'');s=s.replace(/^\$\s*/,'');const r=rat(stripUnit(s.replace(/^\s*[a-z]+(_[a-z]+)?\s*(\([^)]*\))?\s*=\s*/i,'')));if(!r||!sameR(r.v,p.v))return false;
  if(p.form==='int')return r.form==='int';
  if(p.form==='dec')return r.form==='int'||r.form==='dec';
  if(p.form==='mixed')return r.form==='int'||((r.form==='mixed'||r.form==='frac')&&r.lowest&&r.proper);
  if(p.form==='frac')return r.form==='int'||(r.form==='frac'&&r.lowest);
  return true;}
 if(p.t==='word'){const w=normW(s);return p.alts.some(a=>normW(a)===w);}
 if(p.t==='kw'){const r=s.toLowerCase().replace(/[’']/g,"'").replace(/[−–]/g,'-');if(r.length<3)return false;
  // a written statement may contain only the numbers its key words use (90, 180, ...), so a stray number makes it wrong
  const allowed=new Set(p.need.flat().join(' ').match(/\d+/g)||[]);if((r.match(/\d+/g)||[]).some(x=>!allowed.has(x)))return false;return p.need.every(g=>g.some(w=>r.includes(w)))&&!p.avoid.some(w=>r.includes(w));}
 if(p.t==='pi'){const r=stripUnit(s.replace(/\bpi\b/gi,'π')).replace(/(\d),(?=\d{3}\b)/g,'$1');if(!/π/.test(r))return false;const f=parseExpr(r,[]);if(!f)return false;const v=f({});return isFinite(v)&&near(v,p.a[0]/p.a[1]+Math.PI*p.b[0]/p.b[1]);}
 if(p.t==='chain'){// a squared or cubed multiplier counts as two or three multipliers
  const r=S.supToCaret(stripUnit(s)).replace(/[×·]/g,'*').replace(/(\d),(?=\d{3}\b)/g,'$1').replace(/\s+/g,'');if(!r||/[+\-]/.test(r))return false;
  const fs=[];let depth=0,cur='';for(const ch of r){if(ch==='('&&depth===0&&cur&&!cur.endsWith('*')&&!cur.endsWith('^')){fs.push(cur);cur='';}if(ch==='*'&&depth===0){if(cur)fs.push(cur);cur='';continue;}if(ch==='(')depth++;if(ch===')')depth--;if(depth<0)return false;cur+=ch;}if(depth)return false;if(cur)fs.push(cur);
  if(Number(fs[0].replace(/^\((.*)\)$/,'$1'))!==Number(p.start)||!/^\(?\d+(\.\d+)?\)?$/.test(fs[0]))return false;let v=1,count=0;
  for(const [i,x] of fs.entries()){const f=parseExpr(x,[]);if(!f)return false;const y=f({});if(!isFinite(y)||(i&&near(y,1)))return false;v*=y;if(i){const e=x.match(/\^\(?(\d)\)?$/);count+=e?Number(e[1]):1;}}
  return count>=p.min&&near(v,p.v[0]/p.v[1]);}
 if(p.t==='poly'){// a polynomial with like terms combined (any order); exponents may be negative; c/monomial is allowed
  const got=polyParse(s);if(!got)return false;const k1=Object.keys(got).filter(k=>got[k]!==0),k2=Object.keys(p.terms);if(p.order==='desc'){const deg=k=>(k.match(/-?\d+/g)||[]).reduce((x,y)=>x+Number(y),0),ks=Object.keys(got);if(!ks.every((k,i)=>!i||deg(ks[i-1])>=deg(k)))return false;}
  return k1.length===k2.length&&k2.every(k=>k in got&&near(got[k],p.terms[k]))&&polyForm(p.form,s);}
 if(p.t==='factor'){// GCF(polynomial): the greatest common factor written in front, the remaining polynomial in parentheses
  const r=caret(s).replace(/[−–]/g,'-').replace(/[\s·*]/g,''),m=r.match(/^([^()]+)\((.+)\)$/);if(!m)return false;const G=polyParse(m[1]),P=polyParse(m[2]);if(!G||!P)return false;
  const gk=Object.keys(G),ik=Object.keys(P).filter(k=>P[k]!==0),want=Object.keys(p.inner);return gk.length===1&&gk[0]===p.gcf[0]&&G[gk[0]]===p.gcf[1]&&ik.length===want.length&&want.every(k=>P[k]===p.inner[k]);}
 if(p.t==='primes'){// a product of primes, with or without exponents, equal to n
  const r=S.supToCaret(s).replace(/(?<=\d)\s*x\s*(?=\d)/g,'*').replace(/[×·*]/g,'*').replace(/\s+/g,'');if(!/^\d+(\^\d+)?(\*\d+(\^\d+)?)+$/.test(r))return false;let v=1;
  for(const f of r.split('*')){const [b0,e0]=f.split('^').map(Number);if(!S.isPrime(b0)||e0===0)return false;v*=b0**(e0||1);}return v===p.n;}
 if(p.t==='ineq'){// a linear inequality in p.v: 'set' compares solution sets, 'form' compares the two sides (either way round); p.neg needs a negated symbol
  if(p.strip)s=String(s).trim().replace(/^(d|domain)\s*[:=]\s*/i,'').replace(/^\{(.*)\}$/,'$1').trim().replace(/^[a-z]\s*(∈|in)\s*(ℝ|r|reals?|real numbers)\s*[|:]\s*/i,'').replace(/^[a-z]\s*[|:]\s*/i,'');
  const r=ineqParse(s,p.v);if(!r||r.neg!==!!p.neg)return false;
  if(p.mode==='form'){const kl=parseExpr(p.L,[p.v]),kr=parseExpr(p.R,[p.v]),xs=[-2.3,0.7,3.1],same=(f,g)=>xs.every(x=>near(f({[p.v]:x}),g({[p.v]:x})));
   return (r.op===p.op&&same(r.L,kl)&&same(r.R,kr))||(r.op===FLIP[p.op]&&same(r.L,kr)&&same(r.R,kl));}
  const c0=r.f(0),m=r.f(1)-c0;if(!isFinite(c0)||!isFinite(m)||Math.abs(m)<1e-12||!near(r.f(2.5),c0+2.5*m))return false;const op=m>0?r.op:FLIP[r.op],bd=-c0/m;
  if(p.intdom){const nrm=(o,b)=>o==='gt'?['ge',Math.floor(b+1e-9)+1]:o==='ge'?['ge',Math.ceil(b-1e-9)]:o==='lt'?['le',Math.ceil(b-1e-9)-1]:['le',Math.floor(b+1e-9)],[o1,b1]=nrm(op,bd),[o2,b2]=nrm(p.op,p.b);return o1===o2&&b1===b2;}
  return near(bd,p.b)&&op===p.op;}
 if(p.t==='ratexp'){// one fraction: the numerator a polynomial with like terms combined, the denominator equal to the key's (any form)
  const r=caret(s).replace(/[−–]/g,'-').replace(/\s+/g,'');let dep=0,at=-1;for(let i=0;i<r.length;i++){const ch=r[i];if(ch==='(')dep++;else if(ch===')')dep--;else if(ch==='/'&&dep===0){if(at>=0)return false;at=i;}}if(at<0)return false;
  const unwrap=x=>{if(!/^\(.*\)$/.test(x))return x;let d=0;for(let i=0;i<x.length-1;i++){if(x[i]==='(')d++;else if(x[i]===')')d--;if(d===0)return x;}return x.slice(1,-1);};
  // a numerator or denominator with more than one term must be in parentheses
  const top=x=>{let d=0;for(let i=0;i<x.length;i++){const ch=x[i];if(ch==='(')d++;else if(ch===')')d--;else if(d===0&&i>0&&/[+-]/.test(ch)&&!/[\^(]/.test(x[i-1]))return true;}return false;};
  const nr=r.slice(0,at),dr=r.slice(at+1);if((unwrap(nr)===nr&&top(nr))||(unwrap(dr)===dr&&top(dr)))return false;
  const N=polyParse(unwrap(nr));if(!N)return false;const nk=Object.keys(N).filter(k=>N[k]!==0),want=Object.keys(p.num);if(nk.length!==want.length||!want.every(k=>k in N&&near(N[k],p.num[k])))return false;
  const fd=parseExpr(r.slice(at+1),p.vars),fk=parseExpr(p.den,p.vars);if(!fd||!fk)return false;return RAT_POOLS.every(pool=>{const env={};p.vars.forEach((x,i)=>{env[x]=pool[i%pool.length]+0.37*Math.floor(i/pool.length);});const a=fd(env),b=fk(env);return isFinite(a)&&near(a,b);});}
 if(p.t==='conj'){// a conjunction lo < x ≤ hi (either symbol at each end), written as one compound inequality or two joined by "and"
  const r=String(s).replace(/[−–]/g,'-').replace(/\s+/g,'').toLowerCase();let lo=null,hi=null;
  const one=(sym,side,val,incl)=>{if(side==='lo')lo=[val,incl];else hi=[val,incl];};
  const V=p.v||'x';let m=r.match(new RegExp('^(-?\\d+)(<=|≤|<)'+V+'(<=|≤|<)(-?\\d+)$'));
  if(m){one(0,'lo',Number(m[1]),m[2]!=='<');one(0,'hi',Number(m[4]),m[3]!=='<');}
  else{const sides=r.split(/and|&/);if(sides.length!==2)return false;for(const x of sides){const q=ineqParse(x,V);if(!q||q.neg)return false;const c0=q.f(0),k=q.f(1)-c0;if(Math.abs(k)<1e-12)return false;const b=-c0/k,op=k>0?q.op:FLIP[q.op];
    if(op==='gt'||op==='ge')one(0,'lo',b,op==='ge');else one(0,'hi',b,op==='le');}}
  if(!(lo&&hi))return false;if(p.intdom){const L=lo[1]?Math.ceil(lo[0]-1e-9):Math.floor(lo[0]+1e-9)+1,H=hi[1]?Math.floor(hi[0]+1e-9):Math.ceil(hi[0]-1e-9)-1,L0=p.loIn?p.lo:p.lo+1,H0=p.hiIn?p.hi:p.hi-1;return L===L0&&H===H0;}
  return near(lo[0],p.lo)&&near(hi[0],p.hi)&&lo[1]===p.loIn&&hi[1]===p.hiIn;}
 if(p.t==='pair'){// an ordered pair (x, y) of exact numbers
  const r=String(s).replace(/[−–]/g,'-').trim().replace(/^\((.*)\)$/,'$1'),xy=r.split(/\s*,\s*/);if(xy.length!==2)return false;const A=rat(xy[0]),B=rat(xy[1]);return !!(A&&B)&&sameR(A.v,p.v[0])&&sameR(B.v,p.v[1]);}
 if(p.t==='pm'){// two values, exact (radicals simplified, i for imaginary): "a ± b" or two values separated by a comma, "and" or "or"
  const r=String(s).replace(/[−–]/g,'-').replace(/\bpi\b/g,'π').replace(/sqrt/gi,'√').replace(/\s+/g,'');if(!r||/\d\.\d/.test(r)||!S.rootsSimplified(r))return false;
  let parts;if(r.includes('±')){if(r.split('±').length!==2)return false;parts=[r.replace('±','+'),r.replace('±','-')];}else{parts=r.split(/,|and|or/);if(parts.length!==2)return false;}
  const got=parts.map(cParse);if(got.some(x=>!x))return false;const eq=(x,y)=>near(x[0],y[0])&&near(x[1],y[1]);
  return (eq(got[0],p.vals[0])&&eq(got[1],p.vals[1]))||(eq(got[0],p.vals[1])&&eq(got[1],p.vals[0]));}
 if(p.t==='numset'){// a set of integers in braces, any order, no repeats
  const r=String(s).replace(/[−–]/g,'-').replace(/\s+/g,'').replace(/^[a-z]=/i,'');const m=r.match(/^\{(.*)\}$/);if(!m)return false;const el=m[1].split(',');if(!el.every(x=>/^-?\d+$/.test(x)))return false;
  const v=el.map(Number);return new Set(v).size===v.length&&v.length===p.items.length&&p.items.every(x=>v.includes(x));}
 if(p.t==='sets'){// names of number sets (rational, integers, ...), any order; "real" may be added
  const r=String(s).toLowerCase().replace(/numbers?/g,'').replace(/[{}]/g,' ');const names=r.split(/,|\band\b|;/).map(x=>x.trim()).filter(Boolean);const map=x=>SETNAME[x.replace(/s$/,'')]||null;
  const got=names.map(map);if(got.some(x=>!x))return false;const g2=new Set(got.filter(x=>x!=='real'));return g2.size===p.items.length&&p.items.every(x=>g2.has(x))&&got.length===new Set(got).size;}
 if(p.t==='factors'){// a product: an optional factor in front, then factors in parentheses (each may be raised to a power)
  const r=caret(s).replace(/[−–]/g,'-').replace(/[\s·*]/g,'');const m=r.match(/^([^()]*)((?:\([^()]+\)(?:\^\d+)?)+)$/);if(!m)return false;
  let front={'':1};if(m[1]==='-')front={'':-1};else if(m[1]){front=polyParse(m[1]);if(!front||Object.keys(front).length!==1)return false;}
  const facs=[];for(const f of m[2].matchAll(/\(([^()]+)\)(?:\^(\d+))?/g)){const P0=polyParse(f[1]);if(!P0||Object.keys(P0).filter(k=>P0[k]).length<2)return false;for(let k=0;k<Number(f[2]||1);k++)facs.push(P0);}
  // each factor in parentheses must have no common factor left (whole-number content 1, no common letter)
  for(const P0 of facs){const ks=Object.keys(P0).filter(k=>P0[k]);if(ks.map(k=>Math.abs(P0[k])).reduce((x,y)=>gcd(x,y))!==1)return false;const vs=ks.map(keyVars),L=[...new Set(vs.flatMap(v=>Object.keys(v)))];if(L.some(l=>vs.every(v=>(v[l]||0)>0)))return false;}
  const prod=facs.reduce(polyMul,front),ks=Object.keys(prod).filter(k=>prod[k]),want=Object.keys(p.poly);if(ks.length!==want.length||!want.every(k=>near(prod[k]||0,p.poly[k])))return false;
  return facs.length===p.n;}
 if(p.t==='sci'){// scientific notation m × 10^e with 1 ≤ |m| < 10
  const r=caret(s).replace(/[−–]/g,'-').replace(/\s+/g,'').replace(/[x×·*]10\^/,'E').replace(/[x×·*]10\^\(?(-?\d+)\)?/,'E$1');const m=r.match(/^(-?\d+(?:\.\d+)?)E\(?(-?\d+)\)?$/);if(!m)return false;
  const a=Number(m[1]);if(Math.abs(a)<1||Math.abs(a)>=10)return false;return near(a,p.m)&&Number(m[2])===p.e;}
 if(p.t==='nums'){// several integers, separated by commas, in any order
  const el=String(s).replace(/[−–]/g,'-').replace(/\band\b/g,',').split(',').map(x=>x.trim()).filter(Boolean);if(!el.every(x=>/^-?\d+$/.test(x)))return false;const v=el.map(Number).sort((a,b)=>a-b),w=[...p.items].sort((a,b)=>a-b);return v.length===w.length&&v.every((x,i)=>x===w[i]);}
 if(p.t==='simple'){// one fraction with no negative exponents, equal to the key, numerator and denominator with no common monomial or number factor
  const r=caret(s).replace(/[−–]/g,'-').replace(/\s+/g,'');let dep=0,at=-1;for(let i=0;i<r.length;i++){const ch=r[i];if(ch==='(')dep++;else if(ch===')')dep--;else if(ch==='/'&&dep===0){if(at>=0)return false;at=i;}}if(at<0)return false;
  const un=x=>/^\(.*\)$/.test(x)&&[...x.slice(1,-1)].reduce((d,ch)=>d<0?d:d+(ch==='('?1:ch===')'?-1:0),0)===0?x.slice(1,-1):x;const nr=r.slice(0,at),dr=r.slice(at+1);
  const N=polyParse(un(nr)),D=polyParse(un(dr));if(!N||!D)return false;const all=[N,D].flatMap(P0=>Object.keys(P0).filter(k=>P0[k]).map(k=>[P0[k],keyVars(k)]));
  if(all.some(([,v])=>Object.values(v).some(e=>e<0)))return false;if((un(nr)===nr&&Object.keys(N).length>1)||(un(dr)===dr&&Object.keys(D).length>1))return false;
  if(all.map(([c0])=>Math.abs(c0)).reduce((x,y)=>gcd(x,y))!==1||all.some(([c0])=>!Number.isInteger(c0)))return false;const L=[...new Set(all.flatMap(([,v])=>Object.keys(v)))];if(L.some(l=>all.every(([,v])=>(v[l]||0)>0)))return false;
  const ev=(P0,env)=>Object.entries(P0).reduce((t,[k,c0])=>t+c0*Object.entries(keyVars(k)).reduce((m0,[l,e])=>m0*env[l]**e,1),0);
  return RAT_POOLS.every(pool=>{const env={};p.vars.forEach((x,i)=>{env[x]=pool[i%pool.length];});const d0=ev(D,env);return Math.abs(d0)>1e-9&&near(ev(N,env)/d0,ev(p.num,env)/ev(p.den,env));});}
 if(p.t==='divq'){// a quotient with a remainder: "Q + r/(x + d)" (or "Q R r"); Q a polynomial, the remainder over the divisor
  const r=caret(s).replace(/[−–]/g,'-').replace(/\s+/g,'');let Q=r,rem=0;const m=r.match(/^(.*?)([+-])(\d+)\/\(([^()]+)\)$/),m2=r.match(/^(.*)R(-?\d+)$/i);
  const same=(A,B)=>{const ka=Object.keys(A).filter(k=>A[k]),kb=Object.keys(B).filter(k=>B[k]);return ka.length===kb.length&&kb.every(k=>A[k]===B[k]);};
  if(m){const dv=polyParse(m[4]);if(!dv||!same(dv,p.div))return false;Q=m[1];rem=(m[2]==='-'?-1:1)*Number(m[3]);}else if(m2){Q=m2[1];rem=Number(m2[2]);}
  const P0=polyParse(Q);return !!P0&&rem===p.r&&same(P0,p.q);}
 if(p.t==='sci2'){// a number, written as an ordinary number or in scientific notation m × 10^n (1 ≤ m < 10)
  const r=caret(s).replace(/[−–]/g,'-').replace(/\s+/g,'').replace(/(\d),(?=\d{3}(\D|$))/g,'$1');let x=null;
  const m=r.match(/^(-?\d+(?:\.\d+)?)[x×·*]10\^\(?(-?\d+)\)?$/);if(m){const a=Number(m[1]);if(Math.abs(a)<1||Math.abs(a)>=10)return false;x=Number(m[1]+'e'+m[2]);}
  else if(/^-?(\d+(\.\d*)?|\.\d+)$/.test(r))x=Number(r);
  return x!==null&&Math.abs(x-p.v)<=1e-9*Math.abs(p.v);}
 if(p.t==='solve'){// "v = expression" with the expression in the other variables only, equal to the key at sample points
  const r=s.replace(/[−–]/g,'-'),m=r.match(/^\s*([a-zA-Z])\s*=(.+)$/);if(!m||m[1]!==p.v||m[2].includes(p.v)||!p.vars.every(x=>m[2].includes(x)))return false;const f=parseExpr(m[2],p.vars);if(!f)return false;
  return p.samples.every(([env,y])=>{const g=f(env);return isFinite(g)&&near(g,y);});}
 if(p.t==='expr'){// an expression in the given variables, equal to the key at sample points; it must use the variables
  const r=s.replace(/[−–]/g,'-');if(!p.vars.every(x=>r.includes(x)))return false;const f=parseExpr(r,p.vars);if(!f)return false;return p.samples.every(([env,y])=>{const g=f(env);return isFinite(g)&&near(g,y);});}
 if(p.t==='set'){// labels such as (a), (c) and (d), in any order
  const r=s.toLowerCase().replace(/\band\b/g,',').replace(/[()\s]/g,'').replace(/,+/g,',');if(!/^[a-z](,[a-z])*$/.test(r))return false;const got=r.split(',');return new Set(got).size===got.length&&got.length===p.items.length&&p.items.every(x=>got.includes(x));}
 if(p.t==='compact'){const c=x=>String(x).toLowerCase().replace(/[−–]/g,'-').replace(/[\s*·]/g,'');return p.alts.some(a=>c(a)===c(s));}
 if(p.t==='exact'){// an exact value written with the needed symbols (π, √); radicals simplified
  const r=stripUnit(s.replace(/\bpi\b/gi,'π').replace(/sqrt/gi,'√')).replace(/(\d),(?=\d{3}\b)/g,'$1');if(!p.need.every(x=>r.includes(x))||!S.rootsSimplified(r))return false;const f=parseExpr(r,[]);if(!f)return false;const y=f({});return isFinite(y)&&near(y,p.v);}
 if(p.t==='roster'){const r=s.replace(/[−–]/g,'-').replace(/…/g,'...').replace(/\s+/g,'');const m=r.match(/^\{(.*)\}$/);if(!m)return false;const el=m[1].split(',');
  const lead3=el[0]==='...',tail=el[el.length-1]==='...';const nums=el.filter(x=>x!=='...');if(!tail||nums.length<3||nums.some(x=>!/^-?\d+$/.test(x)))return false;const v=nums.map(Number);if(!v.every((x,i)=>!i||x===v[i-1]+1))return false;
  if(p.set==='natural')return !lead3&&v[0]===1&&el.length===v.length+1;
  if(p.set==='whole')return !lead3&&v[0]===0&&el.length===v.length+1;
  return lead3&&el.length===v.length+2&&v[0]<0&&v[v.length-1]>0;}
 return false;}
function check(q,response){const a=q&&q.answer;if(!a||a.kind!=='a1')return undefined;const s=String(response??'');if(s.length>600)return{answerCorrect:false,fullOutcomeVerified:false};
 const ps=a.parts.length>1?s.split(';'):[s];if(ps.length!==a.parts.length)return{answerCorrect:false,fullOutcomeVerified:false};
 return{answerCorrect:a.parts.every((p,i)=>partOk(p,a.parts.length>1?ps[i].replace(/^\s*\([a-e]\)\s*/i,''):ps[i])),fullOutcomeVerified:false};}
function answerText(q){const a=q&&q.answer;return a&&a.kind==='a1'?a.value:undefined;}
// Distractor filter for any answer kind: drops repeats and anything the task's own checker accepts.
function opts(t,list,h){const seen=new Set();const ok=v=>t.answer.kind==='a1'?check({answer:t.answer},v).answerCorrect:h.check(t,v).answerCorrect;
 return list.filter(x=>{const v=String(x.value);if(seen.has(v)||ok(v))return false;seen.add(v);return true;}).slice(0,3);}


// ---------- course polynomial parser (negative exponents allowed) ----------
const SUPMAP={'⁻':'-','⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
const caret=x=>String(x).replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,m=>'^'+[...m].map(ch=>SUPMAP[ch]).join(''));
// Monomial key, the same form as the shared monoKey: letters in order with their exponents ("x1y2"); zero exponents dropped.
const mkey=vars=>Object.keys(vars).filter(k=>vars[k]!==0).sort().map(k=>k+vars[k]).join('');
function monoParse(t){const m=t.match(/^(\d*)((?:[a-zA-Z](?:\^\(?~?\d+\)?)?)*)$/);if(!m||(!m[1]&&!m[2]))return null;const vars={};
 for(const v of m[2].matchAll(/([a-zA-Z])(?:\^\(?(~?\d+)\)?)?/g)){if(v[1] in vars)return null;vars[v[1]]=v[2]===undefined?1:Number(v[2].replace('~','-'));}return [m[1]===''?1:Number(m[1]),vars];}
function polyParse(src){let r=caret(src).replace(/[−–]/g,'-').replace(/[\s·*]/g,'').replace(/\^\(-(\d+)\)/g,'^~$1').replace(/\^-(\d+)/g,'^~$1');if(!r||!/^[+-]?[^+-]/.test(r))return null;const got={};
 for(const tm of r.match(/[+-]?[^+-]+/g)){const sign=tm[0]==='-'?-1:1,body=tm.replace(/^[+-]/,'');let c0,vars;
  if(body.includes('/')){const [nu,de]=body.split('/');if(body.split('/').length!==2)return null;const A=monoParse(nu),B=monoParse(de.replace(/^\((.*)\)$/,'$1'));if(!A||!B||!B[0]||(A[0]%B[0]&&gcd(A[0],B[0])!==1))return null;c0=A[0]/B[0];vars={...A[1]};for(const [k,e] of Object.entries(B[1]))vars[k]=(vars[k]||0)-e;}
  else{const A=monoParse(body);if(!A||!A[0])return null;[c0,vars]=A;}
  const k=mkey(vars);if(k in got)return null;got[k]=sign*c0;}
 return got;}
// Monomial text from a coefficient and [[letter, exponent], ...] in the given order (exponent 1 not written).
const monoX=(c0,vs)=>{const v=vs.filter(([,e])=>e!==0).map(([l,e])=>l+(e===1?'':S.sup(e))).join('');if(!v)return minus(c0);return (c0===1?'':c0===-1?'−':minus(c0))+v;};
const polyX=list=>list.filter(([c0])=>c0).map(([c0,vs],i)=>{const m=monoX(Math.abs(c0),vs);return i===0?(c0<0?'−'+m:m):(c0<0?' − ':' + ')+m;}).join('')||'0';

// ---------- course drawings (original SVG) ----------
// Points on a circular arc from a0 to a1 degrees (counter-clockwise when a1 > a0), for Fig polygons.
const arcPts=(c,r,a0,a1,n=48)=>Array.from({length:n+1},(_,k)=>{const t=(a0+(a1-a0)*k/n)*Math.PI/180;return [c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];});
const pt=S.pt;
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

// A rectangle b by 2a with a semicircle of radius a: shape 'one' (on the left or right end), 'both' (on both ends),
// 'half' (a b-by-a rectangle with the semicircle on its end) or 'notch' (cut out of the right end).
function semiFig(a,b,shape,side){
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
 return svg(g,desc,W,H);}


// Largest square factor: sqrtParts(n) = [k, r] with n = k²r.
const sqrtParts=n=>{let k=1;for(let d=2;d*d<=n;d++)while(n%(d*d)===0){n/=d*d;k*=d;}return [k,n];};
// Text of terms in the given order, from [[coef, letters], ...]; a coefficient of 1 is not written before letters.
const monoTxt=(c0,s0)=>s0?(c0===1?'':c0===-1?'−':minus(c0))+s0:minus(c0);
const termsTxt=list=>list.filter(([c0])=>c0).map(([c0,s0],i)=>{const m=monoTxt(Math.abs(c0),s0)||String(Math.abs(c0));return i===0?(c0<0?'−'+m:m):(c0<0?' − ':' + ')+m;}).join('')||'0';
// A rectangular box drawn obliquely: width a (front), depth b, height c, with labels for those three edges.
function boxFig3(a,b,c,lab){const k=Math.max(a,b,c),dw=b*0.55*Math.cos(Math.PI/6),dh=b*0.55*Math.sin(Math.PI/6),o=p=>[p[0]+dw,p[1]+dh];
 const F=Fig().poly([[0,0],[a,0],[a,c],[0,c]]).seg([a,0],o([a,0])).seg(o([a,0]),o([a,c])).seg([a,c],o([a,c])).seg([0,c],o([0,c])).seg(o([0,c]),o([a,c])).seg([0,0],o([0,0]),{dash:'4,3',w:1}).seg(o([0,0]),o([a,0]),{dash:'4,3',w:1}).seg(o([0,0]),o([0,c]),{dash:'4,3',w:1})
  .txt([a/2,-0.07*k-0.3],lab[0]).txt([a+dw/2+0.04*k,dh/2-0.03*k],lab[1],{anchor:'start'}).txt([-0.04*k-0.2,c/2],lab[2],{anchor:'end'});
 return F.render(`A rectangular box ${lab[0]} wide, ${lab[1]} deep and ${lab[2]} high`,320,200);}

// ---------- Batch A1-5 helpers ----------
// Form required of a polynomial response: 'pos' no negative exponents; 'num' every letter in the numerator (no fraction bar);
// 'neg' every letter written with a negative exponent; 'den' one term, a number over the letters.
function polyForm(form,s){if(!form)return true;const r=caret(s).replace(/[−–]/g,'-').replace(/[\s·*]/g,'');
 if(form==='pos')return !/\^\(?-/.test(r);
 if(form==='num')return !r.includes('/');
 if(form==='neg')return !/[a-zA-Z](?!\^\(?-)/.test(r);
 if(form==='den')return /^-?\d+\/\(?\d*[a-zA-Z]/.test(r)&&!/[+-]/.test(r.replace(/^-/,'').replace(/\^\(?-/g,'^'));
 return true;}
const FLIP={lt:'gt',gt:'lt',le:'ge',ge:'le'};
const RAT_POOLS=[[2.7,1.9,3.4,1.3,2.2,4.6],[4.1,2.3,1.7,5.2,3.1,1.4],[1.6,3.8,2.9,2.2,4.4,2.6]];   // sample values for checking a denominator
const OPSYM={lt:'<',gt:'>',le:'≤',ge:'≥'},NEGSYM={le:'≯',ge:'≮',gt:'≰',lt:'≱'};
// Inequality reader: one relation symbol (≤ ≥ < > or a negated one: ≯ ≮ ≰ ≱, !> !< !>= !<=, "not >"), two sides in the variable v.
const INEQ_OPS=[['≯','le',1],['≮','ge',1],['≰','gt',1],['≱','lt',1],['!>=','lt',1],['!<=','gt',1],['!>','le',1],['!<','ge',1],['<=','le'],['>=','ge'],['≤','le'],['≥','ge'],['<','lt'],['>','gt']];
function ineqParse(s,v){const r=String(s).replace(/[−–]/g,'-').replace(/\bnot\s*/gi,'!').trim();
 for(const [sym,op,ng] of INEQ_OPS){const i=r.indexOf(sym);if(i<0)continue;const L=r.slice(0,i),Rt=r.slice(i+sym.length);if(/[<>≤≥≯≮≰≱!=]/.test(L+Rt))return null;
  const fl=parseExpr(L,[v]),fr=parseExpr(Rt,[v]);if(!fl||!fr)return null;return {op,neg:!!ng,L:fl,R:fr,f:x=>fl({[v]:x})-fr({[v]:x})};}
 return null;}
// MathML: a power (negative exponents kept), a monomial c·∏letter^e, a fraction of two monomials, a power of a group.
const mlE=e=>e<0?`<mrow><mo>−</mo><mn>${-e}</mn></mrow>`:`<mn>${e}</mn>`;
const mlPow=(l,e)=>e===1?`<mi>${l}</mi>`:`<msup><mi>${l}</mi>${mlE(e)}</msup>`;
const mlMono=(c0,vs)=>{const v=vs.filter(([,e])=>e!==0).map(([l,e])=>mlPow(l,e)).join('');const k=c0<0?`<mo>−</mo><mn>${-c0}</mn>`:`<mn>${c0}</mn>`;if(!v)return k;return (c0===1?'':c0===-1?'<mo>−</mo>':k)+v;};
const mlQ=(nu,de)=>mfrac(`<mrow>${nu}</mrow>`,`<mrow>${de}</mrow>`);
const mlGrp=(inner,e)=>`<msup><mrow><mo>(</mo>${inner}<mo>)</mo></mrow>${mlE(e)}</msup>`;
// A rational term {nu:[c,[[l,e],...]], de:[c,[[l,e],...]]?} as MathML, and its value as [c, {letter: exponent}].
const mlT=t=>t.de?mlQ(mlMono(...t.nu),mlMono(...t.de)):mlMono(...t.nu);
const tVal=t=>{const m={};for(const [l,e] of t.nu[1])m[l]=(m[l]||0)+e;if(t.de)for(const [l,e] of t.de[1])m[l]=(m[l]||0)-e;return [t.nu[0]/(t.de?t.de[0]:1),m];};
const tMul=(x,y)=>{const m={...x[1]};for(const [l,e] of Object.entries(y[1]))m[l]=(m[l]||0)+e;return [x[0]*y[0],m];};
// Text of terms [[c, {letter: e}], ...] (letters alphabetical, zero exponents dropped) in a required form.
const wrapD=s=>/^[a-zA-Z][⁰¹²³⁴⁵⁶⁷⁸⁹⁻]*$/.test(s)?s:`(${s})`;
const FMT={
 pos:(c0,vs)=>{const nu=vs.filter(([,e])=>e>0),de=vs.filter(([,e])=>e<0).map(([l,e])=>[l,-e]);const top=monoX(c0,nu);return de.length?`${top}/${wrapD(monoX(1,de))}`:top;},
 num:(c0,vs)=>monoX(c0,vs),
 neg:(c0,vs)=>{const nu=vs.filter(([,e])=>e<0),de=vs.filter(([,e])=>e>0).map(([l,e])=>[l,-e]);const top=monoX(c0,nu);return de.length?`${top}/${wrapD(monoX(1,de))}`:top;},
 den:(c0,vs)=>{const de=vs.filter(([,e])=>e!==0).map(([l,e])=>[l,-e]);return de.length?`${minus(c0)}/${wrapD(monoX(1,de))}`:minus(c0);}};
const sortV=m=>Object.keys(m).filter(k=>m[k]!==0).sort().map(k=>[k,m[k]]);
const sumTxt=(terms,form)=>terms.filter(([c0])=>c0).map(([c0,m],i)=>{const t=FMT[form](Math.abs(c0),sortV(m));return i===0?(c0<0?'−'+t:t):(c0<0?' − ':' + ')+t;}).join('')||'0';
// Combine like terms of [[c, {letter: e}], ...], keeping first-appearance order.
const combine=terms=>{const out=[],at={};for(const [c0,m] of terms){const k=mkey(m);if(k in at)out[at[k]][0]+=c0;else{at[k]=out.length;out.push([c0,{...m}]);}}return out.filter(([c0])=>c0);};
// Expansion task: front × (signed inner terms), or (inner) × front when after is set; key in the requested form.
function expandTask(front,inner,form,how,p,after=false){const F=tVal(front),terms=combine(inner.map(([sg,t])=>{const v=tMul(F,tVal(t));return [sg*v[0],v[1]];}));
 const inML=inner.map(([sg,t],i)=>(i===0?(sg<0?'<mo>−</mo>':''):`<mo>${sg<0?'−':'+'}</mo>`)+mlT(t)).join(''),grp=`<mo>(</mo>${inML}<mo>)</mo>`;
 const key=sumTxt(terms,form);
 return T(`Expand by using the distributive property. Write the answer ${how}.`,[{...polyPart(terms.map(([c0,m])=>[c0,m])),form}],key,`Multiply each term by ${after?'the factor after the parentheses':'the factor in front'}, adding exponents of like letters: ${key}.`,p,{math:math(`<mrow>${after?grp+mlT(front):mlT(front)+grp}</mrow>`)});}
const HOW={pos:'with all exponents positive',num:'with all variables in the numerator',neg:'with all exponents negative',den:'with all variables in the denominator'};
// "v = expression" key text: (terms)/den with a positive denominator.
function solveTxt(v,list,den){if(den<0){den=-den;list=list.map(([c0,l])=>[-c0,l]);}const nu=termsTxt(list);return `${v} = ${den===1?nu:list.filter(([c0])=>c0).length>1?`(${nu})/${den}`:`${nu}/${den}`}`;}

// ---------- Batch A1-6 helpers ----------
const lcm2=(x,y)=>x/gcd(x,y)*y;
// MathML and parser text for a polynomial [[c, [[letter, e], ...]], ...].
const mlPoly=list=>list.filter(([c0])=>c0).map(([c0,vs],i)=>(i===0?(c0<0?'<mo>−</mo>':''):`<mo>${c0<0?'−':'+'}</mo>`)+mlMono(Math.abs(c0),vs)).join('');
const asciiPoly=list=>list.filter(([c0])=>c0).map(([c0,vs])=>`(${c0})`+vs.filter(([,e])=>e).map(([l,e])=>`*${l}^(${e})`).join('')).join('+');
const objPoly=list=>list.map(([c0,vs])=>[c0,Object.fromEntries(vs.filter(([,e])=>e))]);
// A single-fraction answer (numerator over denominator, both polynomials in polyX form).
const ratPart=(num,den,vars)=>({t:'ratexp',num:polyPart(objPoly(num)).terms,den:asciiPoly(den),vars});
const ratTxt=(num,den)=>`(${polyX(num)})/(${polyX(den)})`;
// A number line from −10 to 10 with a segment from lo to hi; open ends drawn as open circles.
function conjBody(lo,hi,loOpen,hiOpen,y0){const W=440,x=v=>30+(v+10)*(W-60)/20;let b=ln(10,y0,W-10,y0,{start:1,end:1});
 for(let v=-10;v<=10;v++)b+=ln(x(v),y0-(v%2?4:7),x(v),y0+(v%2?4:7),{w:1})+(v%2===0?tx(x(v),y0+22,minus(v),{size:11}):'');
 b+=`<line x1="${x(lo).toFixed(1)}" y1="${y0}" x2="${x(hi).toFixed(1)}" y2="${y0}" stroke="${INK}" stroke-width="4"/>`;
 for(const [v,o] of [[lo,loOpen],[hi,hiOpen]])b+=`<circle cx="${x(v).toFixed(1)}" cy="${y0}" r="6" fill="${o?'#fff':INK}" stroke="${INK}" stroke-width="2"/>`;return b;}
const conjDesc=(lo,hi,loOpen,hiOpen)=>`the segment from ${minus(lo)} to ${minus(hi)} shaded, with ${loOpen?'an open':'a closed'} circle at ${minus(lo)} and ${hiOpen?'an open':'a closed'} circle at ${minus(hi)}`;
const conjLine=(lo,hi,loOpen,hiOpen)=>svg(conjBody(lo,hi,loOpen,hiOpen,24),'Number line from −10 to 10 with '+conjDesc(lo,hi,loOpen,hiOpen),440,56);
function conjLines(list){let b='';list.forEach(([lo,hi,lO,hO],i)=>{b+=`<g transform="translate(0,${i*66})">`+tx(12,16,'('+'abcd'[i]+')',{size:13,anchor:'start'})+conjBody(lo,hi,lO,hO,34)+'</g>';});return svg(b,'Four number lines (a) to (d), each with a shaded segment: '+list.map(([lo,hi,lO,hO],i)=>`(${'abcd'[i]}) ${conjDesc(lo,hi,lO,hO)}`).join('; '),440,66*list.length);}
const fmtN=x=>Number.isInteger(x)?S.comma(x):String(Number(x.toFixed(6)));
// Shuffle with the task's own integers (deterministic).
const shuffle=(int,list)=>{const k=list.map(()=>int(0,9999));return list.map((x,i)=>[k[i],x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);};

// ---------- Batch A1-7 helpers ----------
const SETNAME={real:'real',rational:'rational',irrational:'irrational',integer:'integer',whole:'whole',natural:'natural',counting:'natural','positive integer':'natural'};
// Complex-number reader for ± answers: numbers, i, √, + − × / ^ (whole exponents), parentheses, implicit products. Returns [re, im] or null.
function cParse(src){const s=String(src).replace(/[×·*]/g,'*').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,m=>'^'+[...m].map(ch=>SUPMAP[ch]).join(''));let i=0;
 const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],dv=(a,b)=>{const d=b[0]*b[0]+b[1]*b[1];return d?[(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d]:null;};
 function atom(){const ch=s[i];if(ch==='('){i++;const v=expr();if(!v||s[i]!==')')return null;i++;return v;}
  if(ch==='√'){i++;const v=atom();if(!v||Math.abs(v[1])>1e-12)return null;return v[0]>=0?[Math.sqrt(v[0]),0]:[0,Math.sqrt(-v[0])];}
  if(ch==='i'){i++;return [0,1];}const m=s.slice(i).match(/^\d+(\.\d+)?/);if(m){i+=m[0].length;return [Number(m[0]),0];}return null;}
 function power(){let v=atom();if(!v)return null;if(s[i]==='^'){i++;const m=s.slice(i).match(/^\d+/);if(!m)return null;i+=m[0].length;let r=[1,0];for(let k=0;k<Number(m[0]);k++)r=mul(r,v);v=r;}return v;}
 function unary(){if(s[i]==='-'){i++;const v=unary();return v&&[-v[0],-v[1]];}if(s[i]==='+'){i++;return unary();}return power();}
 function term(){let v=unary();while(v&&i<s.length){const ch=s[i];if(ch==='*'||ch==='/'){i++;const w=unary();if(!w)return null;v=ch==='*'?mul(v,w):dv(v,w);}else if(/[\d(√i]/.test(ch)){const w=power();if(!w)return null;v=mul(v,w);}else break;}return v;}
 function expr(){let v=term();while(v&&(s[i]==='+'||s[i]==='-')){const ch=s[i++],w=term();if(!w)return null;v=ch==='+'?add(v,w):add(v,[-w[0],-w[1]]);}return v;}
 const v=expr();return v&&i===s.length&&isFinite(v[0])&&isFinite(v[1])?v:null;}
// Exact text for (p ± q√r)/d or (p ± qi√r)/d, simplified; r = 1 gives two rational values.
function pmText(p0,q0,r0,d0,imag){[q0,r0]=[q0*sqrtParts(r0)[0],sqrtParts(r0)[1]];const g0=[p0,q0,d0].filter(x=>x).reduce((x,y)=>gcd(Math.abs(x),Math.abs(y)));let P=p0/g0,Qn=q0/g0,D=d0/g0;if(D<0){P=-P;D=-D;}
 if(r0===1&&!imag){const a=red(p0-q0,d0),b=red(p0+q0,d0);return `${fracT(...a)}, ${fracT(...b)}`;}
 const rad=`${Qn===1?'':Qn}${imag?'i':''}${r0===1?'':'√'+r0}`||'1',top=P?`${minus(P)} ± ${rad}`:`±${rad}`;return D===1?top:`(${top})/${D}`;}
const tf=b=>b?'true':'false';

// ---------- Batch A1-8 helpers ----------
const keyVars=k=>{const v={};for(const [,l,e] of String(k).matchAll(/([a-zA-Z])(-?\d+)/g))v[l]=Number(e);return v;};
// Product of two polynomials given as {key: coefficient}.
const polyMul=(A,B)=>{const out={};for(const [ka,ca] of Object.entries(A))for(const [kb,cb] of Object.entries(B)){const v=keyVars(ka);for(const [l,e] of Object.entries(keyVars(kb)))v[l]=(v[l]||0)+e;const k=mkey(v);out[k]=(out[k]||0)+ca*cb;}for(const k of Object.keys(out))if(!out[k])delete out[k];return out;};
// Clear a complex fraction: numerator and denominator are lists [[ [n,d], {letter: e} ], ...]; multiply both by the same
// monomial and number so every exponent is non-negative and every coefficient a whole number with no common factor.
function clearFraction(numT,denT){const all=[...numT,...denT],lets=[...new Set(all.flatMap(([,v])=>Object.keys(v)))].sort(),M={};for(const l of lets)M[l]=-Math.min(0,...all.map(([,v])=>v[l]||0));
 const Lc=all.reduce((x,[[,d0]])=>x/gcd(x,d0)*d0,1),scale=t=>t.map(([[n0,d0],v])=>[n0*Lc/d0,Object.fromEntries(lets.map(l=>[l,(v[l]||0)+M[l]]).filter(([,e])=>e))]);let N=scale(numT),D=scale(denT);
 // remove a common letter factor left over and the common whole-number factor
 for(const l of lets){const mn=Math.min(...[...N,...D].map(([,v])=>v[l]||0));if(mn>0){N=N.map(([c0,v])=>[c0,{...v,[l]:v[l]-mn}]);D=D.map(([c0,v])=>[c0,{...v,[l]:v[l]-mn}]);}}
 const g0=[...N,...D].map(([c0])=>Math.abs(c0)).reduce((x,y)=>gcd(x,y));N=N.map(([c0,v])=>[c0/g0,v]);D=D.map(([c0,v])=>[c0/g0,v]);if(D[0][0]<0){N=N.map(([c0,v])=>[-c0,v]);D=D.map(([c0,v])=>[-c0,v]);}
 const toX=T=>T.map(([c0,v])=>[c0,sortV(v)]);return [toX(N),toX(D)];}
const ratKey=(N,D)=>{const nt=polyX(N),dt=polyX(D);return `${N.length>1?`(${nt})`:nt}/${D.length>1||!/^(\d+|[a-zA-Z][⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/.test(dt)?`(${dt})`:dt}`;};
// MathML for a list of signed terms [[coef, [[letter, e], ...]], ...] with rational coefficients allowed as [n,d].
const mlTermsR=list=>list.map(([c0,vs],i)=>{const neg=(Array.isArray(c0)?c0[0]:c0)<0,ab=Array.isArray(c0)?[Math.abs(c0[0]),c0[1]]:[Math.abs(c0),1],body=ab[1]===1?mlMono(ab[0],vs):mlQ(mlMono(ab[0],vs.filter(([,e])=>e>0)),mlMono(ab[1],vs.filter(([,e])=>e<0).map(([l,e])=>[l,-e])));return (neg?'<mo>−</mo>':i?'<mo>+</mo>':'')+body;}).join('');
const sciText=(m,e)=>`${String(m)} × 10${S.sup(e)}`;

// ---------- Batch A1-9 helpers ----------
const sub2=(l,s0)=>`${l}_${s0}`;   // subscripted variable in prompt text (R_A); MathML uses msub
const setText=pairs=>`{${pairs.map(([x,y])=>`(${x}, ${y})`).join(', ')}}`;
const mapText=pairs=>pairs.map(([x,y])=>`${x} → ${y}`).join(', ');
const isFunc=pairs=>pairs.every(([x,y])=>pairs.every(([x2,y2])=>x!==x2||y===y2));
// Six relations built from five numbers (three of them functions), as in the source: f1-f3 are functions, nf1-nf3 are not.
const relations=(a,b,c,d,e,f,four)=>{const R=[[[a,b],[d,b],[c,e],[e,a]],[[a,b],[d,f],[c,e],[e,b]],[[a,b],[d,b],[c,b],[e,c]],[[a,b],[a,f],[c,e],[e,d]],[[a,b],[d,f],[d,e],[e,e]],[[a,d],[c,e],[c,b],[e,a]]];return four?R:R.map(x=>x.slice(0,3));};

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
 const fig=semiFig(a,b,shape,side);
 const val=`${P[0]} + ${P[1]===1?'':P[1]}π`;
 t=T(`Find the perimeter of the figure. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[P[0],1],b:[P[1],1]}],`(${val}) ${u}`,`The straight sides add to ${P[0]}; the curved part is ${shape==='both'?'a whole circle of radius '+a+', 2π('+a+')':'half a circle of radius '+a+', π('+a+')'} = ${P[1]}π. Perimeter = ${val}.`,{a,b,shape,side,u},{svg:fig});break;}
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
// Batch A1-2: Lessons 7-12
case 'a1-nested':{// signs, absolute value and grouping symbols; the source's four forms per record
 let a=int(1,15),b=int(1,14),forms,ps;
 if(v==='pair'||v==='pair-mc'){let cc;do{a=int(1,15);b=int(1,14);cc=int(1,15)*pick([1,-1]);}while(a===b||a===cc||b===cc||cc===a*b||cc===a+b);const C=par(cc);
  forms=[[`−(−${a}) − (−${b}) + ${C}`,[1,1,1]],[`−(−${a}) − |−${b}| + ${C}`,[1,-1,1]],[`−(−${a}) − (−${b}) − ${C}`,[1,1,-1]],[`−|−${a}| − |−${b}| + ${C}`,[-1,-1,1]]];ps={a,b,c:cc};}
 else if(v==='trio'){let cc,d,e,f;do{cc=int(1,15);d=int(1,15);e=int(1,15);f=int(1,15);}while(new Set([cc,d,e,f]).size<4);
  forms=[[`${a} − ${b} − (−${cc}) + |${d} − ${e} + ${f}|`,[1,-1,1,1]],[`${a} − ${b} − |−${cc}| + |${d} − ${e} + ${f}|`,[1,-1,-1,1]],[`${a} − ${b} − (−${cc}) + |${d} − ${e} − ${f}|`,[1,-1,1,2]],[`${a} − ${b} − |−${cc}| + |${d} − ${e} − ${f}|`,[1,-1,-1,2]]];ps={a,b,c:cc,d,e,f};}
 else if(v==='bracket'){let cc,d;do{cc=int(1,15);d=int(1,15);}while(cc===d);
  forms=[[`${a} − ${b} − (−${cc}) − [−(−${d})]`,[1,-1,1,-1]],[`${a} − ${b} − |−${cc}| − [−(−${d})]`,[1,-1,-1,-1]],[`${a} − ${b} − (−${cc}) − [−|−${d}|]`,[1,-1,1,1]],[`${a} − ${b} − |−${cc}| − [−|−${d}|]`,[1,-1,-1,1]]];ps={a,b,c:cc,d};}
 else{forms=[[`−|−(−${a})| − {−[−(−${b})]}`,[-1,1]],[`−[−(−${a})] − {−[−(−${b})]}`,[-1,1]],[`−|−(−${a})| − {−[−|−${b}|]}`,[-1,-1]],[`−[−(−${a})] − {−[−|−${b}|]}`,[-1,-1]]];ps={a,b};}
 const val=sg=>{const x=[ps.a,ps.b,ps.c,ps.d];let z=0;sg.forEach((k,i)=>{if(v==='trio'&&i===3)return;z+=k*x[i];});if(v==='trio')z+=Math.abs(sg[3]===1?ps.d-ps.e+ps.f:ps.d-ps.e-ps.f);return z;};
 const f=int(1,4),[str,sg]=forms[f-1],z=val(sg);ps.f0=f;
 t=T(`Simplify: ${str}`,[num(z,1,'int')],minus(z),`Work from the inside out: −(−n) = n, −|−n| = −n and |−n| = n. ${str} = ${minus(z)}.`,ps);
 if(v==='pair-mc'){const nm=['the first number','the second number','the last number'];t.choices=opts(t,forms.filter((_,i)=>i!==f-1).map(([,s2])=>({value:minus(val(s2)),mistake:'Used the wrong sign for '+s2.map((k,i)=>k!==sg[i]?nm[i]:null).filter(Boolean).join(' and ')})),h);}
 break;}
case 'a1-sq-area':{const nn=int(4,26),[u,ab]=pick([['inches','in.'],['feet','ft'],['centimeters','cm'],['meters','m']]);
 t=T(`The perimeter of a square is ${4*nn} ${u}. Find the area of the square, in square ${u}.`,[num(nn*nn,1,'int')],`${nn*nn} ${ab}²`,`Each side is ${4*nn} ÷ 4 = ${nn}, so the area is ${nn}² = ${nn*nn}.`,{n:nn,u});break;}
case 'a1-rect-length':{const a=int(8,15),b=int(9,15);
 t=T(`The area of a rectangle is ${a*b} square centimeters. If its width is ${b} centimeters, what is its length, in centimeters?`,[num(a,1,'int')],`${a} cm`,`Length = area ÷ width = ${a*b} ÷ ${b} = ${a}.`,{a,b});break;}
case 'a1-step-area':{let L,tp,dn,t2;do{L=int(5,9);tp=int(1,5);dn=int(1,7);t2=int(2,8);}while(tp+t2>=12||dn>=L||t2===tp||tp===L-dn);const [u,ab]=pick([['meters','m'],['inches','in.'],['feet','ft'],['centimeters','cm']]);
 const P=[[0,0],[0,L],[tp,L],[tp,L-dn],[t2,L-dn],[t2,0]],z=t2>tp?t2*L-(t2-tp)*dn:t2*L+(tp-t2)*dn;
 t=T(`Find the area of the figure. All angles are right angles. Dimensions are in ${u}.`,[num(z,1,'int')],`${z} ${ab}²`,`Split the figure into rectangles: ${t2>tp?`${tp} × ${L} + ${t2-tp} × ${L-dn}`:`${t2} × ${L} + ${tp-t2} × ${dn}`} = ${z}.`,{L,tp,dn,t2,u},{svg:outline(P,[[0,String(L)],[1,String(tp)],[3,String(L-dn)],[5,String(t2)]],`A figure with right-angle corners: left side ${L}, top ${tp}, lower right side ${L-dn}, bottom ${t2}`)});break;}
case 'a1-frame-area':{const R46=zip([7,8,8,8,9,9,9,9,10,11,8,8,8,8,8,9,9,9,10,10,11,11,12,9,9,9,10,10,11,11,10,10,10,11,11,11,12,12,12,11,11,11,12,12,12,12],[5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,9,9,9,9,10,10,10]);
 const [b,a]=pick(R46),d=int(Math.round(a/3),Math.round(a/2)),[u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]),z=a*b-(a-d)*(b-d);
 const F=Fig().poly([[0,0],[b,0],[b,a],[0,a]],{fill:S.SHADE}).poly([[d/2,d/2],[b-d/2,d/2],[b-d/2,a-d/2],[d/2,a-d/2]],{fill:'#fff'}).txt([b/2,-0.9],String(b)).txt([b+0.5,a/2],String(a),{anchor:'start'}).txt([b/2,d/2+0.5],String(b-d)).txt([d/2+0.4,a/2],String(a-d),{anchor:'start'});
 t=T(`Find the area of the shaded portion of the figure. All angles are right angles. Dimensions are in ${u}.`,[num(z,1,'int')],`${z} ${ab}²`,`Shaded area = outer rectangle − inner rectangle = ${b} × ${a} − ${b-d} × ${a-d} = ${a*b} − ${(a-d)*(b-d)} = ${z}.`,{a,b,d,u},{svg:F.render(`A ${b} by ${a} rectangle with a ${b-d} by ${a-d} rectangle cut out of the middle; the frame is shaded`,300,200)});break;}
case 'a1-rect-area-mc':{let a,b;do{a=int(2,9);b=int(3,16);}while(a===b||a*b===2*(a+b)+3);const u=pick(['inches','feet','meters','yards']);
 const F=Fig().poly([[0,0],[b,0],[b,a],[0,a]]).txt([b/2,-1.2],`${b} ${u}`).txt([-0.4,a/2],`${a} ${u}`,{anchor:'end'}).txt([-0.45*(a+b)/2-1,a/2],'');
 t=T('What is the area of this rectangle? Give the number of square units.',[num(a*b,1,'int')],`${a*b} square ${u}`,`A = length × width = ${b} × ${a} = ${a*b} square ${u}.`,{a,b,u},{svg:F.render(`A rectangle ${b} ${u} by ${a} ${u}`,300,160)});
 t.choices=opts(t,[{value:`${2*(a+b)} square ${u}`,mistake:'Found the perimeter instead of the area'},{value:`${a+b} square ${u}`,mistake:'Added the length and the width'},{value:`${2*a*b} square ${u}`,mistake:'Doubled the product as if finding a perimeter'}],h);break;}
case 'a1-right-tri-area':{const rows=zip([2,3,4,4,5,5,6,6,6,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,10,11,11,11,11,12,12,12,13,13,14],[3,4,5,6,6,7,7,8,9,8,9,10,9,10,11,12,10,11,12,13,11,12,13,14,15,12,13,14,15,13,14,15,14,15,15]).filter(([f,g])=>f*g%2===0);
 const [f,g]=pick(rows),[u,ab]=pick([['meters','m'],['feet','ft'],['inches','in.'],['yards','yd'],['centimeters','cm']]);
 const F=Fig().poly([[0,0],[g,0],[0,f]]).right([0,0],0,90,9).txt([-0.4,f/2],String(f),{anchor:'end'}).txt([g/2,-1],String(g));
 t=T(`Find the area of the triangle. Dimensions are in ${u}.`,[num(f*g/2,1,'int')],`${f*g/2} ${ab}²`,`A = ½ × base × height = ½ × ${g} × ${f} = ${f*g/2}.`,{f,g,u},{svg:F.render(`A right triangle with legs ${f} and ${g}`,300,160)});break;}
case 'a1-tri-area-alt':{const [cu,b0,a0]=pick(zip([1,1,1,1,1,1,1,2,2,2,2,2,2,2],[2,2,3,2,3,3,4,2,2,3,2,3,3,4],[3,4,4,5,5,6,6,3,4,4,5,5,6,6])),[u,ab]=cu===1?['feet','ft']:['yards','yd'];
 const F=Fig().poly([[0,0],[2*a0,0],[1.5*a0,b0]]).seg([1.5*a0,0],[1.5*a0,b0],{dash:'4,3',w:1}).right([1.5*a0,0],0,90,8).txt([a0,-0.45*b0/2-0.2],String(2*a0)).txt([1.5*a0-0.15,b0*0.4],String(b0),{anchor:'end'});
 t=T(`Find the area of this triangle. Dimensions are in ${u}.`,[num(a0*b0,1,'int')],`${a0*b0} ${ab}²`,`A = ½ × base × height = ½ × ${2*a0} × ${b0} = ${a0*b0}.`,{a:a0,b:b0,u},{svg:F.render(`A triangle with base ${2*a0} and height ${b0}`,300,150)});break;}
case 'a1-rect-tri-area':{const R=zip([7,8,8,8,9,9,9,9,10,11,8,8,8,8,8,9,9,9,10,10,11,11,12,9,9,9,10,10,11,11,10,10,10,11,11,11,12,12,12,11,11,11,12,12,12,12],[8,6,10,12,6,8,10,12,6,10,7,9,10,11,12,10,11,12,5,8,8,9,10,6,8,10,6,8,8,12,5,6,9,6,7,10,7,10,11,6,10,12,10,6,7,11],[5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,9,9,9,9,10,10,10]);
 const [b,cc,a]=pick(R),d=int(2,a-2),[u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]),z=[2*a*b+a*cc,2];
 const F=Fig().poly([[0,0],[b,0],[b,a],[0,a]]).poly([[b,0],[b+cc,d],[b,a]]).seg([b,d],[b+cc,d],{dash:'4,3',w:1}).right([b,d],0,90,7).txt([-0.4,a/2],String(a),{anchor:'end'}).txt([b/2,-0.9],String(b)).txt([b+cc/2,d+0.4],String(cc));
 t=T(`Find the area of the figure. Dimensions are in ${u}.`,[num(...z,'dec')],`${decT(...z)} ${ab}²`,`Rectangle ${b} × ${a} = ${a*b}, plus triangle ½ × ${a} × ${cc} = ${decT(a*cc,2)}: total ${decT(...z)}.`,{a,b,c:cc,d,u},{svg:F.render(`A ${b} by ${a} rectangle with a triangle of base ${a} and height ${cc} attached to its right side`,320,190)});break;}
case 'a1-cut-tri-area':{const [b,a]=pick(zip([7,8,8,8,9,9,9,9,10,11,8,8,8,8,8,9,9,9,10,10,11,11,12,9,9,9,10,10,11,11,10,10,10,11,11,11,12,12,12,11,11,11,12,12,12,12],[5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,9,9,9,9,10,10,10]));
 const d=int(Math.round(a/3),Math.round(a/2)),[u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]),N=2*a*b-(a-d)*(b-d);
 const F=Fig().poly([[0,0],[b,0],[b,a],[0,a]],{fill:S.SHADE}).poly([[d/2,d/2],[b-d/2,d/2],[d/2,a-d/2]],{fill:'#fff'}).right([d/2,d/2],0,90,7).txt([b/2-d/4,d/2+0.5],String(b-d)).txt([d/2+0.3,a/2],String(a-d),{anchor:'start'}).txt([b/2,-0.9],String(b)).txt([b+0.4,a/2],String(a),{anchor:'start'});
 t=T(`Find the area of the shaded portion of the figure. Dimensions are in ${u}. Write the answer as a mixed number if it is not a whole number.`,[num(N,2,'mixed')],`${mixT(N,2)} ${ab}²`,`Rectangle ${b} × ${a} = ${a*b} minus the triangle ½ × ${b-d} × ${a-d} = ${mixT((a-d)*(b-d),2)}: ${mixT(N,2)}.`,{a,b,d,u},{svg:F.render(`A ${b} by ${a} rectangle, shaded, with a right triangle with legs ${b-d} and ${a-d} cut out`,300,200)});break;}
case 'a1-tri-area-text':{const kind=pick(['right','scalene','isosceles']),b=int(5,25),cc=2*int(2,13),[u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]);
 t=T(`The length of the base of a${kind==='isosceles'?'n':''} ${kind} triangle is ${cc} ${u} and the height is ${b} ${u}. Find the area of the triangle, in square ${u}.`,[num(b*cc/2,1,'int')],`${b*cc/2} ${ab}²`,`A = ½ × ${cc} × ${b} = ${b*cc/2}.`,{b,c:cc,kind});break;}
case 'a1-triple-area':{const [f,g,e]=pick(zip([3,6,5,9,8,12,7,15,10,20,18,16,21,12,15,24,9,27],[4,8,12,12,15,16,24,20,24,21,24,30,28,35,36,32,40,36],[5,10,13,15,17,20,25,25,26,29,30,34,35,37,39,40,41,45]));
 const F=Fig().poly([[0,0],[g,0],[0,f]]).right([0,0],0,90,9).txt([-0.03*g,f/2],`${f} m`,{anchor:'end'}).txt([g/2,-0.08*g],`${g} m`).txt([g/2+0.02*g,f/2+0.03*g],`${e} m`,{anchor:'start'});
 t=T('Find the area of the triangle.',[num(f*g/2,1,'int')],`${f*g/2} m²`,`The legs are the base and the height: A = ½ × ${g} × ${f} = ${f*g/2} m².`,{f,g,e},{svg:F.render(`A right triangle with legs ${f} m and ${g} m and hypotenuse ${e} m`,320,170)});
 t.choices=opts(t,[{value:`${f*g} m²`,mistake:'Forgot to take half of base times height'},{value:`${e+f+g} m²`,mistake:'Found the perimeter instead of the area'},{value:`${Math.round(e*e/2)} m²`,mistake:'Used the hypotenuse as both base and height'},{value:`${e*g/2} m²`,mistake:'Used the hypotenuse as the height'}],h);break;}
case 'a1-circle-two':{const [u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]);
 if(v==='from-c'){const a=2*int(3,10),k=pick(['radius','diameter']),z1=k==='radius'?a/2:a;
  t=T(`The circumference of a circle is ${a}π ${u}. (a) Find the ${k} of the circle. (b) Find the area of the circle, using 3.14 for π. Answer both parts, separated by a semicolon.`,[num(z1,1,'int'),num(314*a*a,400,'dec')],`(a) ${z1} ${ab}; (b) ${decT(314*a*a,400)} ${ab}²`,`(a) C = πd, so d = ${a}${k==='radius'?` and r = ${a/2}`:''}. (b) A = πr² ≈ 3.14 × ${a/2}² = ${decT(314*a*a,400)}.`,{a,k,u});}
 else{const a=int(2,12),k=pick(['diameter','radius']),given=k==='diameter'?2*a:a;
  t=T(`The ${k} of a circle is ${given} ${u}. Use 3.14 for π. (a) What is the circumference of the circle? (b) What is the area of the circle? Answer both parts, separated by a semicolon.`,[num(628*a,100,'dec'),num(314*a*a,100,'dec')],`(a) ${decT(628*a,100)} ${ab}; (b) ${decT(314*a*a,100)} ${ab}²`,`The radius is ${a}. (a) C = 2πr ≈ 2(3.14)(${a}) = ${decT(628*a,100)}. (b) A = πr² ≈ 3.14(${a})² = ${decT(314*a*a,100)}.`,{a,k,u});}
 break;}
case 'a1-circle-area':{const a=int(2,15),k=pick(['radius','diameter']),[u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]);
 t=T(`The ${k} of a circle is ${k==='radius'?a:2*a} ${u}. Find the area of the circle. Use 3.14 for π.`,[num(314*a*a,100,'dec')],`${S.comma(decT(314*a*a,100))} ${ab}²`,`The radius is ${a}: A = πr² ≈ 3.14 × ${a}² = ${decT(314*a*a,100)}.`,{a,k,u});break;}
case 'a1-semi-area':{const rows=[];for(const [A,lo] of [[2,3],[3,3],[4,3],[5,3],[6,3]])for(let B=lo;B<=12;B++)if(!(A===2&&B>8))rows.push([A,B]);const [a,b]=pick(rows),side=pick(['left','right']),[u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]);
 const val=piT([2*a*b,1],[a*a,2]);
 t=T(`Find the area of the figure. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[2*a*b,1],b:[a*a,2]}],`(${val}) ${ab}²`,`Rectangle ${b} × ${2*a} = ${2*a*b}, plus half a circle of radius ${a}: ½π(${a})² = ${fracT(a*a,2)}π. Area = ${val}.`,{a,b,side,u},{svg:semiFig(a,b,'one',side)});break;}
case 'a1-tri-semi-area':{const rows=[];for(const [A,lo] of [[2,3],[3,3],[4,3],[5,3],[6,3]])for(let B=lo;B<=12;B++)if(!(A===2&&B>8))rows.push([A,B]);const [a,b]=pick(rows),[u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]);
 const C=[b,0],F=Fig().poly([[0,0],[b,0],[b,a]]).poly(arcPts([b,0],a,-90,90),{w:1.6,open:1}).seg([b,0],[b,-a]).seg([b,0],pt([b,0],45,a),{w:1}).dot(C).right(C,180,90,7).txt([b/2,-0.25*a],String(b)).txt(pt([b,0],45,a/2),String(a),{anchor:'end',dx:-6,dy:-2});
 const val=piT([a*b,2],[a*a,2]);
 t=T(`Find the area of the figure. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[a*b,2],b:[a*a,2]}],`(${val}) ${ab}²`,`Triangle ½ × ${b} × ${a} = ${fracT(a*b,2)}, plus half a circle of radius ${a}: ½π(${a})² = ${fracT(a*a,2)}π. Area = ${val}.`,{a,b,u},{svg:F.render(`A right triangle with base ${b} and height ${a}, with a semicircle of radius ${a} on its vertical side`,300,190)});break;}
case 'a1-incircle':{const al=int(45,70),r=int(5,10),rad=al*Math.PI/180,y=r+r*Math.sin(rad)+(r+r*Math.cos(rad))/Math.tan(rad),x=r+r*Math.cos(rad)+(r+r*Math.sin(rad))*Math.tan(rad),xs=Math.round(x),ys=Math.round(y),[u,ab]=pick([['meters','m'],['inches','in.'],['feet','ft'],['centimeters','cm']]);
 const F=Fig().poly([[0,0],[x,0],[0,y]],{fill:S.SHADE}).poly(arcPts([r,r],r,0,360),{fill:'#fff'}).dot([r,r]).seg([r,r],[2*r,r],{w:1}).txt([1.5*r,r+0.6],String(r)).right([0,0],0,90,8).txt([x/2,-0.06*y],String(xs)).txt([-0.02*x,y/2],String(ys),{anchor:'end'});
 const val=piT([xs*ys,2],[-r*r,1]);
 t=T(`Find the area of the shaded portion of the figure. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[xs*ys,2],b:[-r*r,1]}],`(${val}) ${ab}²`,`Triangle ½ × ${xs} × ${ys} = ${mixT(xs*ys,2)}, minus the circle π(${r})² = ${r*r}π. Shaded area = ${val}.`,{al,r,xs,ys,u},{svg:F.render(`A right triangle with legs ${xs} and ${ys}, shaded, with a white circle of radius ${r} inside`,300,200)});break;}
case 'a1-diamond-circle':{let a,b,z,z3;do{a=2*int(6,10);b=int(2,5);z=Math.round(100*(a*a-b*b*Math.PI));z3=Math.round(100*(a*a-2*b*Math.PI));}while(z===z3);
 const F=Fig().poly([[-10,0],[0,10],[10,0],[0,-10]],{fill:S.SHADE}).poly(arcPts([0,0],5,0,360),{fill:'#fff'}).dot([0,0]).seg([0,0],pt([0,0],12,5),{w:1}).txt([1.2,1.3],`${b} cm`,{anchor:'start'}).tick([-10,0],[0,10]).tick([0,10],[10,0]).tick([10,0],[0,-10]).tick([0,-10],[-10,0]).txt([-6.5,-6.5],`${a} cm`,{anchor:'end'}).txt([6.5,-6.5],`${a} cm`,{anchor:'start'});
 t=T('Find the area of the shaded region: a square with a circle cut out of its center. Use the π key (not 3.14) and round your answer to the nearest hundredth.',[num(z,100,'dec')],`${decT(z,100)} cm²`,`Square ${a}² = ${a*a}, minus the circle π(${b})² ≈ ${(b*b*Math.PI).toFixed(2)}: ${decT(z,100)} cm².`,{a,b},{svg:F.render(`A square with sides ${a} cm, shaded, with a white circle of radius ${b} cm at its center`,240,220)});
 t.choices=opts(t,[{value:`${decT(Math.round(100*b*b*Math.PI),100)} cm²`,mistake:'Found only the area of the circle'},{value:`${(a-b)*(a-b)} cm²`,mistake:'Subtracted the radius from the side, then squared'},{value:`${decT(z3,100)} cm²`,mistake:'Used 2πr for the area of the circle'},{value:`${decT(Math.round(100*(a*a-314*b*b/100)),100)} cm²`,mistake:'Used 3.14 for π instead of the π key'}],h);break;}
case 'a1-trap-right':{let b1,b2,b3,cc,a,b,d;do{b1=int(2,8);b2=int(1,3);b3=int(0,1);cc=int(2*b1-1,2*b1+1);a=2*b1+b3;b=2*b1+2*b2+b3;d=Math.round(Math.sqrt(cc*cc+4*b2*b2));}while(d===cc||b/cc>4);
 const F=Fig().poly([[0,0],[b,0],[a,cc],[0,cc]]).right([0,0],0,90,8).right([0,cc],270,0,8).txt([-0.04*b-0.3,cc/2],String(cc),{anchor:'end'}).txt([b/2,-0.1*cc-0.4],String(b)).txt([a/2,cc+0.3],String(a)).txt([(a+b)/2+0.3,cc/2],String(d),{anchor:'start'});
 t=T('Find the area of the trapezoid. Dimensions are in inches.',[num(cc*(a+b)/2,1,'int')],`${cc*(a+b)/2} square inches`,`A = ½ × height × (sum of the parallel sides) = ½ × ${cc} × (${a} + ${b}) = ${cc*(a+b)/2}. The slanted side, ${d}, is not used.`,{a,b,c:cc,d},{svg:F.render(`A right trapezoid with parallel sides ${a} and ${b}, height ${cc} and slanted side ${d}`,300,190)});break;}
case 'a1-trap-iso':{const [b,cc,a]=pick(zip([10,10,11,11,12,12,13,13,14,14,15,15,16,16,11,11,13,13,15,15,12,12,13,13,14,14,15,15,16,16,13,13,15,15,14,14,15,15,16,16,15,15],[9,11,10,12,11,13,12,14,13,15,14,16,15,17,10,12,12,14,14,16,11,13,12,14,13,15,14,16,15,17,12,14,14,16,13,15,14,16,15,17,14,16],[4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,7,7,7,7,8,8,8,8,8,8,9,9]));
 const [u,ab]=pick([['meters','m'],['inches','in.'],['feet','ft'],['centimeters','cm']]),z=[(a+b)*cc,2];
 const F=Fig().poly([[0,0],[b,0],[(b+a)/2,cc],[(b-a)/2,cc]]).seg([1.15*b,0],[1.15*b,cc],{w:1,start:1,end:1}).txt([b/2,-0.08*cc-0.3],String(b)).txt([b/2,cc+0.3],String(a)).txt([1.15*b+0.3,cc/2],String(cc),{anchor:'start'});
 t=T(`Find the area of the trapezoid. Dimensions are in ${u}.`,[num(...z,'dec')],`${decT(...z)} ${ab}²`,`A = ½ × ${cc} × (${a} + ${b}) = ${decT(...z)}.`,{a,b,c:cc,u},{svg:F.render(`A trapezoid with parallel sides ${a} and ${b} and height ${cc}`,320,170)});break;}
case 'a1-trap-semi':{const [b,a]=pick(zip([4,6,7,8,8,9,10,11,12,10,11,12,13,14,15,16,12,13,14,15,16,17,18,19,20],[2,4,4,4,6,6,6,6,6,8,8,8,8,8,8,8,10,10,10,10,10,10,10,10,10])),[u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]);
 const out=[[0,b],[0,0],[2*a+b,0],[2*a,b],...arcPts([a,b],a,0,-180).slice(1,-1)];
 const F=Fig().poly(out).right([0,0],0,90,8).dot([a,b]).seg([a,b],pt([a,b],-45,a),{w:1}).txt(pt([a,b],-45,a*0.55),String(a),{anchor:'start',dx:4}).txt([a+b/2,-0.08*b-0.4],String(2*a+b)).txt([-0.3,b/2],String(b),{anchor:'end'});
 const val=piT([(4*a+b)*b,2],[-a*a,2]);
 t=T(`Find the area of the figure. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[(4*a+b)*b,2],b:[-a*a,2]}],`(${val}) ${ab}²`,`Trapezoid ½ × ${b} × (${2*a} + ${2*a+b}) = ${mixT((4*a+b)*b,2)}, minus the half circle ½π(${a})² = ${fracT(a*a,2)}π. Area = ${val}.`,{a,b,u},{svg:F.render(`A trapezoid with a semicircle of radius ${a} cut out of its top side; bottom ${2*a+b}, height ${b}`,320,190)});break;}
case 'a1-trap-circle':{const [b,cc,a]=pick(zip([5,5,6,6,6,6,7,7,7,7,7,8,8,8,9,9,9,8,8,8,9,9,9,10,10,10,9,9,9,9,10,10,10,10,11,11,11,12,12,12],[2,4,2,4,2,4,2,4,2,4,6,2,4,6,2,4,6,2,4,6,2,4,6,2,4,6,2,4,6,8,2,4,6,8,4,6,8,4,6,8],[4,4,4,4,5,5,5,5,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8]));
 const [u,ab]=pick([['meters','m'],['inches','in.'],['feet','ft'],['centimeters','cm']]),r=cc/2;
 const F=Fig().poly([[-b/2,-r],[b/2,-r],[a/2,r],[-a/2,r]],{fill:S.SHADE}).poly(arcPts([0,0],r,0,360),{fill:'#fff'}).dot([0,0]).seg([0,0],pt([0,0],45,r),{w:1}).txt(pt([0,0],45,r*0.5),String(r),{anchor:'end',dx:-3}).txt([0,-r-0.12*b-0.2],String(b)).txt([0,r+0.15],String(a));
 const val=piT([(a+b)*cc,2],[-cc*cc,4]);
 t=T(`Find the area of the shaded portion of the figure. The circle touches the two parallel sides. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[(a+b)*cc,2],b:[-cc*cc,4]}],`(${val}) ${ab}²`,`The height of the trapezoid is the circle's diameter, ${cc}. Trapezoid ½ × ${cc} × (${a} + ${b}) = ${decT((a+b)*cc,2)}, minus the circle π(${r})² = ${fracT(cc*cc,4)}π.`,{a,b,c:cc,u},{svg:F.render(`A trapezoid with parallel sides ${a} and ${b}, shaded, with a white circle of radius ${r} that touches both parallel sides`,320,190)});break;}
case 'a1-circle-trap':{const [b,a]=pick(zip([7,8,7,8,9,8,9,10,9,10,11,9,10,11,12,10,11,12,13,11,12,13,14,11,12,13,14,15,12,13,14,15,16,13,14,15,16,17,14,15,16,17,18],[10,10,11,11,11,12,12,12,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,18,18,18,18,18,19,19,19,19,19,20,20,20,20,20]));
 const cc=Math.sqrt(a*a-b*b),d=Math.round(2*cc),[u,ab]=pick([['meters','m'],['inches','in.'],['feet','ft'],['centimeters','cm']]);
 const F=Fig().poly(arcPts([0,0],a,0,360),{fill:S.SHADE}).poly([[-b,-cc],[-b,cc],[0,cc],[b,-cc]],{fill:'#fff'}).right([-b,cc],270,0,8).right([-b,-cc],90,0,8).txt([-b+0.6,0],String(d),{anchor:'start'}).txt([-b/2,cc-0.12*a],String(b)).txt([0,-cc+0.1*a],String(2*b));
 const val=piT([-3*b*d,2],[a*a,1],'pi');
 t=T(`Find the area of the shaded portion of the circle. The radius of the circle is ${a} ${u}. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[-3*b*d,2],b:[a*a,1]}],`(${val}) ${ab}²`,`Circle π(${a})² = ${a*a}π, minus the trapezoid ½ × ${d} × (${b} + ${2*b}) = ${fracT(3*b*d,2)}. Shaded area = ${val}.`,{a,b,d,u},{svg:F.render(`A shaded circle of radius ${a} with a white trapezoid inside: parallel sides ${b} and ${2*b}, height ${d}`,260,240)});break;}
case 'a1-para-shaded':{const [b,a]=pick(zip([4,5,6,6,7,8,7,8,9,10,9,10,11,12,10,11,12,13,14,12,13,14,15,16,13,14,15,16,17,18,15,16,17,18,19,20],[3,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,10,10,10,10,10,10]));
 const cc=int(Math.round(a/3),Math.round(a/2)),d=int(1,Math.round(a/3)),hh=2*a+2*d,L=a+b+cc,sh=hh/Math.sqrt(3),[u,ab]=pick([['meters','m'],['inches','in.'],['feet','ft'],['centimeters','cm']]);
 const out=[[-a,-hh/2],[b+cc,-hh/2],[b+cc-sh,hh/2],[-a-sh,hh/2]],hole=[[0,-a],[b,-a],[0,a],...arcPts([0,0],a,90,270).slice(1,-1)];
 const F=Fig().poly(out,{fill:S.SHADE}).poly(hole,{fill:'#fff'}).dot([0,0]).seg([0,0],pt([0,0],225,a),{w:1}).seg([0,a],[0,-a],{dash:'4,3',w:1}).right([0,-a],0,90,7).txt(pt([0,0],225,a*0.55),String(a),{anchor:'start',dx:4}).txt([b/2,-a+0.3],String(b)).txt([(b+cc-a)/2,-hh/2-0.06*hh-0.3],String(L)).txt([(b+cc-a)/2-sh,hh/2+0.3],String(L)).seg([b+cc+0.15*hh,-hh/2],[b+cc+0.15*hh,hh/2],{w:1,start:1,end:1}).txt([b+cc+0.15*hh+0.4,0],String(hh),{anchor:'start'});
 const val=piT([L*hh-a*b,1],[-a*a,2]);
 t=T(`Find the area of the shaded portion of the figure. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[L*hh-a*b,1],b:[-a*a,2]}],`(${val}) ${ab}²`,`Parallelogram ${L} × ${hh} = ${L*hh}, minus the triangle ½ × ${b} × ${2*a} = ${a*b} and the half circle ½π(${a})² = ${fracT(a*a,2)}π. Shaded area = ${val}.`,{a,b,c:cc,d,u},{svg:F.render(`A shaded parallelogram with base ${L} and height ${hh}; a white half circle of radius ${a} and a white right triangle with legs ${2*a} and ${b} are cut out`,340,230)});break;}
case 'a1-trap-mc':{let b,a,cc,d;do{b=int(12,20);a=int(8,b-4);cc=int(8,15);d=int(6,cc-1);}while(false);const z=d*(a+b);
 const F=Fig().poly([[3,1],[19,1],[14,6],[6,6]]).seg([6,1],[6,6],{dash:'4,3',w:1}).right([6,1],0,90,7).txt([6.3,3.3],`${d} m`,{anchor:'start'}).txt([4.2,3.6],`${cc} m`,{anchor:'end'}).txt([11,-0.1],`${2*b} m`).txt([10,6.4],`${2*a} m`);
 t=T('Find the area of the trapezoid.',[num(z,1,'int')],`${z} m²`,`A = ½ × ${d} × (${2*a} + ${2*b}) = ${z} m². The slanted side, ${cc} m, is not the height.`,{a,b,c:cc,d},{svg:F.render(`A trapezoid with parallel sides ${2*a} m and ${2*b} m, height ${d} m and a slanted side of ${cc} m`,320,150)});
 t.choices=opts(t,[{value:`${2*z} m²`,mistake:'Forgot to take half'},{value:`${cc*(a+b)} m²`,mistake:'Used the slanted side as the height'},{value:`${2*cc*(a+b)} m²`,mistake:'Used the slanted side as the height and forgot to take half'}],h);break;}
case 'a1-mul-signed':{let a,b;if(v==='wide'){do{a=int(2,12)*pick([1,-1]);b=int(2,12)*pick([1,-1]);}while(a>0&&b>0);}else{do{a=int(2,9)*pick([1,-1]);b=int(3,9)*pick([1,-1]);}while(Math.abs(a)===Math.abs(b)||(a>0&&b>0));}
 const z=a*b,shw=v==='wide'?minus:sgn;
 t=T(`Multiply: (${shw(a)})(${shw(b)})`,[num(z,1,'int')],minus(z),`${a<0===b<0?'Same signs: the product is positive':'Opposite signs: the product is negative'}. ${minus(a)} × ${par(b)} = ${minus(z)}.`,{a,b});
 if(v!=='wide')t.choices=opts(t,[{value:sgn(-z),mistake:'Used the wrong sign for the product'},{value:sgn(a+b),mistake:'Added instead of multiplying'},{value:sgn(a-b),mistake:'Subtracted instead of multiplying'}],h);break;}
case 'a1-inverse-op':{const k=int(1,4),nn=int(2,16)*pick([1,-1]),op=['Add','Subtract','Multiply by','Divide by'][k-1],inv=['Subtract','Add','Divide by','Multiply by'][k-1],i1=['Divide by','Multiply by','Subtract','Add'][k-1],i2=['Multiply by','Divide by','Add','Divide by'][k-1];
 const z=`${inv} ${minus(nn)}`;
 t=T(`Name the inverse operation: ${op} ${minus(nn)}.`,[word(z,`${inv} ${nn}`,`${inv} (${minus(nn)})`,`${inv} (${nn})`)],z,`${inv} undoes ${op.toLowerCase()}, so the inverse of "${op} ${minus(nn)}" is "${z}".`,{k,n:nn});
 t.choices=opts(t,[{value:`${i1} ${minus(nn)}`,mistake:'Chose an operation that does not undo this one'},{value:`${i2} ${minus(-nn)}`,mistake:'Changed the number as well as the operation'},{value:`${inv} ${minus(-nn)}`,mistake:'Used the right operation but changed the sign of the number'}],h);break;}
case 'a1-inverse-names':{const o1=pick(['addition','subtraction']),o2=pick(['multiplication','division']),r={addition:'subtraction',subtraction:'addition',multiplication:'division',division:'multiplication'};
 t=T(`(a) What operation is the inverse operation of ${o1}? (b) What operation is the inverse operation of ${o2}? Answer both parts, separated by a semicolon.`,[word(r[o1]),word(r[o2])],`(a) ${r[o1]}; (b) ${r[o2]}`,`(a) ${r[o1]} undoes ${o1}. (b) ${r[o2]} undoes ${o2}.`,{o1,o2});break;}
case 'a1-div-signed':{let a,b;do{a=v==='neg'?-int(3,9):int(3,9);b=v==='neg'?int(4,9):int(3,9);}while(Math.abs(a)===b);const z=-b,nm=z*a;
 t=T(`Divide: (${minus(nm)}) ÷ (${minus(a)})`,[num(z,1,'int')],minus(z),`${nm<0===a<0?'Same signs: positive':'Opposite signs: negative'}. ${minus(nm)} ÷ ${par(a)} = ${minus(z)}.`,{a,b},{math:math(mfrac(nm,a))});
 if(v==='neg'){const s1=pick([1,-1]);t.choices=opts(t,[{value:minus(z+s1),mistake:'Division slip by one'},{value:minus(-z),mistake:'Used the wrong sign for the quotient'},{value:minus(-z-s1),mistake:'Division slip and the wrong sign'}],h);}
 break;}
case 'a1-sign-rules':{const s1=pick(['opposite signs','the same sign']),s2=pick(['opposite signs','the same sign']),r=x=>x==='opposite signs'?'negative':'positive';
 t=T(`(a) Is the product of two signed numbers that have ${s1} a positive number or a negative number? (b) Is the quotient of two signed numbers that have ${s2} a positive number or a negative number? Answer both parts, separated by a semicolon.`,[word(r(s1),r(s1)+' number'),word(r(s2),r(s2)+' number')],`(a) ${r(s1)}; (b) ${r(s2)}`,`Like signs give a positive result; opposite signs give a negative result, for products and quotients alike.`,{s1,s2});break;}
case 'a1-zero-div':{const k=pick([1,1,2,3,3]);let b,cc,d,e,f,g;
 const r9=()=>int(1,9);
 if(k===1){b=r9();cc=-r9();if(b+cc===0)cc-=4;d=-(b+cc);e=r9();f=-r9();if(e+f===0)e+=3;g=-(e+f);}
 else if(k===3){b=r9();cc=-r9();d=r9()*pick([1,-1]);if(b+cc+d===0)d-=2;e=r9();f=-r9();if(e+f===0)e+=3;g=-(e+f);}
 else{b=r9();cc=-r9();if(b+cc===0)b+=2;d=-(b+cc);e=r9();f=-r9();g=r9()*pick([1,-1]);if(e+f+g===0)f+=1;}
 const N=d+b+cc,D=g+f+e,ans=k===1?'Indeterminate':k===3?'Undefined':'0';
 t=T(`Simplify: (${minus(d)} + ${b} + (${minus(cc)})) / (${minus(g)} + (${minus(f)}) + ${e}). Write a number, or write Undefined or Indeterminate.`,[word(...(ans==='0'?['0','zero']:[ans]))],ans,k===1?'The numerator and the denominator are both 0; 0/0 is Indeterminate.':k===3?`The numerator is ${minus(N)} and the denominator is 0; division by zero is Undefined.`:`The numerator is 0 and the denominator is ${minus(D)}; 0 divided by a nonzero number is 0.`,{b,c:cc,d,e,f,g,k},{math:math(`<mfrac><mrow>${mn(d)}${mo('+')}${mn(b)}${mo('+')}<mrow>${mo('(')}${mn(cc)}${mo(')')}</mrow></mrow><mrow>${mn(g)}${mo('+')}<mrow>${mo('(')}${mn(f)}${mo(')')}</mrow>${mo('+')}${mn(e)}</mrow></mfrac>`)});
 t.choices=opts(t,k===1?[{value:'Undefined',mistake:'Treated 0/0 like a nonzero number divided by 0'},{value:'0',mistake:'Treated the zero numerator as making the fraction 0'},{value:'1',mistake:'Cancelled 0/0 to 1'}]:k===3?[{value:'Indeterminate',mistake:'Confused a nonzero number over 0 with 0/0'},{value:'0',mistake:'Thought dividing by zero gives zero'},{value:minus(N),mistake:'Ignored the zero denominator'}]:[{value:'Undefined',mistake:'Thought a zero numerator makes the fraction undefined'},{value:'Indeterminate',mistake:'Confused 0 over a nonzero number with 0/0'},{value:minus(D),mistake:'Gave the denominator instead of the quotient'}],h);break;}
case 'a1-mul4':{let a,b,cc,e;if(v==='mc'){a=int(-9,-1);b=int(2,7);cc=int(1,8)*pick([1,-1]);e=int(1,3)*pick([1,-1]);}else{a=int(1,9)*pick([1,-1]);b=int(1,7)*pick([1,-1]);cc=int(1,8)*(a>0?-1:1);e=int(1,3)*pick([1,-1]);}
 const z=a*b*cc*e,str=v==='mc'?`${minus(a)}(${minus(b)})(${minus(cc)})(${minus(e)})`:`(${minus(a)})(${minus(b)})(${minus(cc)})(${minus(e)})`;
 t=T(`Multiply: ${str}`,[num(z,1,'int')],minus(z),`There ${[a,b,cc,e].filter(x=>x<0).length===1?'is 1 negative factor':'are '+[a,b,cc,e].filter(x=>x<0).length+' negative factors'}, so the product is ${z<0?'negative':'positive'}: ${minus(z)}.`,{a,b,c:cc,e});
 if(v==='mc'){const sm=a+b+cc+e;t.choices=opts(t,[{value:minus(-z),mistake:'Used the wrong sign for the product'},{value:minus(sm),mistake:'Added the numbers instead of multiplying'},{value:minus(-sm),mistake:'Added the numbers and used the wrong sign'},{value:minus(a*b*cc),mistake:'Left out the last factor'},{value:minus(Math.abs(z)),mistake:'Ignored the signs of the factors'},{value:minus(a*b),mistake:'Multiplied only the first two factors'},{value:minus(Math.abs(a)+Math.abs(b)+Math.abs(cc)+Math.abs(e)),mistake:'Added the sizes of the numbers instead of multiplying'}],h);}
 break;}
case 'a1-area-chain':{const C={
  'in2-ft2':['square inches','square feet','ft²',['(1/12)²'],[1,144]],'ft2-in2':['square feet','square inches','in.²',['(12)²'],[144,1]],'cm2-m2':['square centimeters','square meters','m²',['(1/100)²'],[1,10000]],'m2-cm2':['square meters','square centimeters','cm²',['(100)²'],[10000,1]],
  'in2-cm2':['square inches','square centimeters','cm²',['(2.54)²'],[64516,10000]],'cm2-in2':['square centimeters','square inches','in.²',['(1/2.54)²'],[10000,64516]],
  'in2-yd2':['square inches','square yards','yd²',['(1/12)²','(1/3)²'],[1,1296]],'yd2-in2':['square yards','square inches','in.²',['(3)²','(12)²'],[1296,1]],'in2-m2':['square inches','square meters','m²',['(2.54)²','(1/100)²'],[64516,100000000]],'m2-in2':['square meters','square inches','in.²',['(100)²','(1/2.54)²'],[100000000,64516]],
  'm2-ft2':['square meters','square feet','ft²',['(100)²','(1/2.54)²','(1/12)²'],[100000000,9290304]],'ft2-m2':['square feet','square meters','m²',['(12)²','(2.54)²','(1/100)²'],[9290304,100000000]],'km2-in2':['square kilometers','square inches','in.²',['(1000)²','(100)²','(1/2.54)²'],[1e14,64516]],'in2-km2':['square inches','square kilometers','km²',['(2.54)²','(1/100)²','(1/1000)²'],[64516,1e14]]};
 const pool={two:['in2-ft2','ft2-in2','cm2-m2','m2-cm2'],'in-cm':['in2-cm2','cm2-in2'],four:['in2-yd2','yd2-in2','in2-m2','m2-in2'],six:['m2-ft2','ft2-m2','km2-in2','in2-km2']}[v],k=pick(pool),[u1,u2,ab,fs,[vn,vd]]=C[k];
 let b=v==='four'?int(120,259):int(20,59);if(k==='in2-km2')b*=1000;const m=2*fs.length,word2=['','','two','','four','','six'][m];
 t=T(`Use ${word2} unit multipliers to convert ${S.comma(b)} ${u1} to ${u2}. Write the measurement times the unit multipliers (a squared multiplier counts as two); you do not need to multiply them out.`,[{t:'chain',v:[b*vn,vd],start:b,min:m}],`${S.comma(b)}${fs.join('')} ${ab}`,`Each linear unit multiplier is used twice for square units: ${S.comma(b)} ${u1} × ${fs.join(' × ')} = ${S.comma(b)}${fs.join('')} ${ab}.`,{b,k});
 if(v==='two'){const alt={'in2-ft2':['(12)²','(1/100)²','(100)²'],'ft2-in2':['(1/12)²','(100)²','(1/100)²'],'cm2-m2':['(100)²','(1/12)²','(12)²'],'m2-cm2':['(1/100)²','(12)²','(1/12)²']}[k];
  t.choices=opts(t,[{value:`${b}${alt[0]} ${ab}`,mistake:'Wrote the unit multiplier upside down'},{value:`${b}${alt[1]} ${ab}`,mistake:'Used the factor for a different pair of units'},{value:`${b}${alt[2]} ${ab}`,mistake:'Used the factor for a different pair of units, upside down'}],h);}
 break;}
case 'a1-recip':{const b=int(2,10),mir=pick(['multiplicative inverse','reciprocal']),F=[[b,1],[1,b],[-b,1],[-1,b]],inv=([p,q])=>red(q,p),show=([p,q])=>q===1?minus(p):(p<0?'−':'')+`1/${q}`;
 if(v==='two'){const c1=int(0,3);let c2;do{c2=int(0,3);}while(c2===c1);
  t=T(`(a) What is the ${mir} of ${show(F[c1])}? (b) What is the ${mir} of ${show(F[c2])}? Answer both parts, separated by a semicolon.`,[num(...inv(F[c1]),'frac'),num(...inv(F[c2]),'frac')],`(a) ${show(inv(F[c1]))}; (b) ${show(inv(F[c2]))}`,`The ${mir} of a number is 1 divided by the number; it has the same sign.`,{b,c1,c2,mir});}
 else{const c1=int(0,3);t=T(`What is the ${mir} of ${show(F[c1])}?`,[num(...inv(F[c1]),'frac')],show(inv(F[c1])),`${show(F[c1])} × ${show(inv(F[c1]))} = 1, so the ${mir} is ${show(inv(F[c1]))}.`,{b,c1,mir});
  t.choices=opts(t,F.filter((_,i)=>i!==[1,0,3,2][c1]).map(x=>({value:show(x),mistake:x[0]*F[c1][0]<0?(x[1]===F[c1][1]?'Gave the opposite instead of the reciprocal':'Changed the sign as well as taking the reciprocal'):'Gave the number itself, not its reciprocal'})),h);}
 break;}
case 'a1-zero-recip':{t=T('Which real number does not have a reciprocal, and why?',[kw([['zero','0'],['undefined','divide by zero','division by zero','divided by zero','dividing by zero','1/0','divide by 0','division by 0','divided by 0','can\'t divide','cannot divide']])],'Zero does not have a reciprocal because 1/0 has no value: you cannot divide by zero.','The reciprocal of n is 1/n, and you cannot divide by zero, so 0 has no reciprocal.',{form:pick(['a','b'])});break;}
case 'a1-ops':{
 if(v==='sum'){let a,b,cc,d;do{a=int(2,5);b=int(2,5);cc=int(2,5);d=int(2,5);}while(a+b*cc-d<0);const z=a+b*cc-d;
  t=T(`Evaluate: ${a} + ${b} · ${cc} − ${d}`,[num(z,1,'int')],String(z),`Multiply first: ${b} · ${cc} = ${b*cc}; then ${a} + ${b*cc} − ${d} = ${z}.`,{a,b,c:cc,d});}
 else if(v==='mc'){let a,b,cc,d,e,z,d1,d2,d3;do{a=int(2,9);b=int(2,9);cc=int(2,9)*pick([1,-1]);d=int(2,9);e=int(2,9);z=d*e-b*cc+a;d1=d*(e-b)*cc+a;d2=d*e+b*cc+a;d3=d*(e-b)*(cc+a);}while(new Set([z,d1,d2,d3]).size<4);
  t=T(`Simplify: ${d} · ${e} − ${b}(${minus(cc)}) + ${a}`,[num(z,1,'int')],minus(z),`Multiply first: ${d*e} − (${minus(b*cc)}) + ${a} = ${minus(z)}.`,{a,b,c:cc,d,e});
  t.choices=opts(t,[{value:minus(d1),mistake:'Subtracted before multiplying'},{value:minus(d2),mistake:`Used the wrong sign for ${b}(${minus(cc)})`},{value:minus(d3),mistake:'Worked from left to right, ignoring the order of operations'}],h);}
 else if(v==='four'){const a=int(-6,-2),b=int(-5,-2),cc=int(2,9),d=int(-9,-2),e=int(2,9),f=int(2,9),z=a*b+cc*d+e-f;
  t=T(`Simplify: ${minus(a)}(${minus(b)}) + ${cc}(${minus(d)}) + ${e} − ${f}`,[num(z,1,'int')],minus(z),`Multiply first: ${a*b} + (${minus(cc*d)}) + ${e} − ${f} = ${minus(z)}.`,{a,b,c:cc,d,e,f});}
 else{let a,b,cc,d,z,d1,d2,d3;do{a=int(2,6);b=int(3,6);cc=int(a+1,9);d=int(b+1,9);z=cc*d-a*b+cc;d1=(cc*d-a)*b+cc;d2=cc*d-a*b-cc;d3=cc*d-a*(b+cc);}while(a===b||cc===d||d3<0||new Set([z,d1,d2,d3]).size<4);
  t=T(`Simplify: (${cc})(${d}) − (${a})(${b}) + ${cc}`,[num(z,1,'int')],String(z),`Multiply first: ${cc*d} − ${a*b} + ${cc} = ${z}.`,{a,b,c:cc,d});
  t.choices=opts(t,[{value:minus(d1),mistake:'Subtracted before multiplying'},{value:minus(d2),mistake:'Subtracted the last number instead of adding it'},{value:minus(d3),mistake:'Added before subtracting the product'}],h);}
 break;}
case 'a1-incl':{const sp=x=>x<0?'− '+Math.abs(x):'+ '+x;
 if(v==='paren'){const a=int(40,50),b=int(2,4),cc=int(5,7),d=int(2,4),s1=pick([1,-1]),z=a-b*(cc+s1*d);
  t=T(`Simplify: ${a} − ${b}(${cc} ${s1<0?'−':'+'} ${d})`,[num(z,1,'int')],minus(z),`Inside the parentheses first: ${cc+s1*d}; then ${a} − ${b}(${cc+s1*d}) = ${minus(z)}.`,{a,b,c:cc,d,s:s1});}
 else if(v==='dist-mc'){let a,b,cc;do{a=int(2,5)*pick([1,-1]);b=int(-5,-2);cc=int(1,6);}while(b+cc===0||new Set([a*(b+cc),-a*(b+cc),a*b+cc,-a*b+cc]).size<4);const z=a*(b+cc);
  t=T(`Simplify: ${minus(a)}(${minus(b)} + ${cc})`,[num(z,1,'int')],minus(z),`${minus(b)} + ${cc} = ${minus(b+cc)}; ${minus(a)}(${minus(b+cc)}) = ${minus(z)}.`,{a,b,c:cc});
  t.choices=opts(t,[{value:minus(-z),mistake:'Used the wrong sign for the product'},{value:minus(a*b+cc),mistake:'Multiplied only the first number in the parentheses'},{value:minus(-a*b+cc),mistake:'Multiplied only the first number and used the wrong sign'}],h);}
 else if(v==='two-groups'){let a,b,cc,d,e,f;do{b=int(1,9)*pick([1,-1]);cc=int(1,9);e=int(1,9)*pick([1,-1]);f=int(1,9);d=int(2,9);a=int(2,9)*pick([1,-1]);}while(b===cc||e===f||(a>0&&b>0&&e>0));const z=a*(b+cc)-d*(e-f);
  t=T(`Simplify: ${minus(a)}(${minus(b)} + ${cc}) − ${d}(${minus(e)} − ${f})`,[num(z,1,'int')],minus(z),`Parentheses first: ${minus(a)}(${minus(b+cc)}) − ${d}(${minus(e-f)}) = ${minus(a*(b+cc))} − (${minus(d*(e-f))}) = ${minus(z)}.`,{a,b,c:cc,d,e,f});}
 else if(v==='prod'){const a=int(1,9)*pick([1,-1]),b=int(1,9)*pick([1,-1]),cc=int(1,9),d=int(1,9)*pick([1,-1]),e=int(1,9),f=int(1,9),z=a*(b+cc)*(d+e)+f;
  t=T(`Simplify: ${minus(a)}(${minus(b)} + ${cc})(${minus(d)} + ${e}) + ${f}`,[num(z,1,'int')],minus(z),`${minus(a)}(${minus(b+cc)})(${minus(d+e)}) + ${f} = ${minus(a*(b+cc)*(d+e))} + ${f} = ${minus(z)}.`,{a,b,c:cc,d,e,f});}
 else if(v==='frac-add'){const a=int(1,9)*pick([1,-1]),g0=pick([1,-1]),ba=int(2,4),c0=int(2,9),d=int(1,9),s2=pick([1,-1]),bb=ba*c0*g0,cc=-c0*g0,z=a+bb/cc+s2*d;
  t=T(`Simplify: ${minus(a)} + (${minus(bb)})/(${minus(cc)}) ${s2<0?'−':'+'} ${d}`,[num(z,1,'int')],minus(z),`Divide first: (${minus(bb)}) ÷ (${minus(cc)}) = ${minus(bb/cc)}; then ${minus(a)} + (${minus(bb/cc)}) ${s2<0?'−':'+'} ${d} = ${minus(z)}.`,{a,b:bb,c:cc,d,s:s2},{math:math(`<mrow>${mn(a)}${mo('+')}<mfrac><mrow>${mo('(')}${mn(bb)}${mo(')')}</mrow><mrow>${mo('(')}${mn(cc)}${mo(')')}</mrow></mfrac>${mo(s2<0?'−':'+')}${mn(d)}</mrow>`)});}
 else if(v==='frac1'||v==='frac2'||v==='frac3'){const r9=()=>int(1,9)*pick([1,-1]);let a,b,cc,d,e,f,i,j,s1,D;
  do{a=r9();b=r9();cc=r9();d=r9();e=r9();f=-int(1,9);s1=pick([1,-1]);i=v==='frac3'?-int(1,9):r9();j=v==='frac3'?int(2,9)*pick([1,-1]):r9();D=v==='frac1'?e+s1*f:v==='frac2'?e+s1*j*f:e*i+s1*j*f;}while(D===0);
  const N=v==='frac1'?a+b+cc+d:v==='frac2'?i*(a+b)+cc+d:a+b+cc*d,op=s1<0?'−':'+';
  const top=v==='frac1'?`(${minus(a)} ${sp(b)}) + (${minus(cc)} ${sp(d)})`:v==='frac2'?`${minus(i)}(${minus(a)} ${sp(b)}) + (${minus(cc)} ${sp(d)})`:`${minus(a)} ${sp(b)} ${sp(cc)}(${minus(d)})`,bot=v==='frac1'?`${minus(e)} ${op} (${minus(f)})`:v==='frac2'?`${minus(e)} ${op} (${minus(j)})(${minus(f)})`:`${minus(e)}(${minus(i)}) ${op} (${minus(j)})(${minus(f)})`;
  t=T(`Simplify: [${top}] / [${bot}]. Write the answer as an integer or a fraction in lowest terms.`,[num(N,D,'frac')],fracT(N,D),`The numerator simplifies to ${minus(N)} and the denominator to ${minus(D)}, so the value is ${fracT(N,D)}.`,{a,b,c:cc,d,e,f,i,j,s:s1});}
 else if(v==='abs-mix'){const r9=()=>int(1,9)*pick([1,-1]),p0=pick([1,-1]),a=int(1,9)*p0,b=-int(1,9)*p0,cc=r9(),d=r9(),e=r9(),f=r9(),g=r9(),hh=r9(),i=r9(),s1=pick([1,-1]),z=a*b+s1*(cc+d)*(e+f)+Math.abs(g+hh+i);
  t=T(`Simplify: (${minus(a)})(${minus(b)}) ${s1<0?'−':'+'} (${minus(cc)} ${sp(d)})(${minus(e)} ${sp(f)}) + |${minus(g)} ${sp(hh)} ${sp(i)}|`,[num(z,1,'int')],minus(z),`(${minus(a)})(${minus(b)}) = ${minus(a*b)}; (${minus(cc+d)})(${minus(e+f)}) = ${minus((cc+d)*(e+f))}; |${minus(g+hh+i)}| = ${Math.abs(g+hh+i)}. Total ${minus(z)}.`,{a,b,c:cc,d,e,f,g,h:hh,i,s:s1});}
 else{const a=int(-9,-2),b=int(2,9);let cc,d;do{cc=int(3,11);d=int(2,10);}while(d>=cc);const z=-a-b*(cc-d);
  t=T(`Simplify: −(${minus(a)}) − ${b}(${cc} − ${d})`,[num(z,1,'int')],minus(z),`−(${minus(a)}) = ${-a}; ${b}(${cc} − ${d}) = ${b*(cc-d)}; ${-a} − ${b*(cc-d)} = ${minus(z)}.`,{a,b,c:cc,d});
  t.choices=opts(t,[{value:minus(-a+b*(cc-d)),mistake:`Added ${b}(${cc} − ${d}) instead of subtracting it`},{value:minus(-a-b*(cc+d)),mistake:'Added inside the parentheses'},{value:minus(-a-b*cc-d),mistake:'Multiplied only the first number in the parentheses'}],h);}
 break;}
// Batch A1-3: Lessons 13-20
case 'a1-incl2':{
 if(v==='bracket'){const a=int(2,9),b=int(2,9),cc=int(2,9),d=int(2,9),z=a*(b+cc)+d;
  t=T(`Simplify: [${a} × (${b} + ${cc})] + ${d}`,[num(z,1,'int')],String(z),`Innermost first: ${b} + ${cc} = ${b+cc}; ${a} × ${b+cc} = ${a*(b+cc)}; + ${d} = ${z}.`,{a,b,c:cc,d});}
 else{let a,b,cc,d;if(v==='brace-mc'){[a,b,cc,d]=pick(zip([2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,6,6,6,6,6,6],[3,3,3,4,4,5,5,6,2,2,2,4,4,4,5,5,5,6,6,2,2,3,3,3,5,5,6,6,2,2,3,3,3,4,4,6,2,3,3,4,4,5],[4,5,6,5,6,4,6,5,4,5,6,2,5,6,2,4,6,2,5,5,6,2,5,6,2,6,2,5,4,6,2,4,6,2,6,2,5,2,5,2,5,2],[6,7,8,7,8,6,8,7,6,7,8,9,7,8,9,6,8,9,7,7,8,9,7,8,9,8,9,7,6,8,9,6,8,9,8,9,7,9,7,9,7,9]));}
  else{do{a=int(2,5);b=int(2,5);cc=int(2,5);d=int(6,9);}while(cc*d<=a+cc+1);}
  const e=a*b,z=cc*d-cc-1,[L,Rb]=v==='brace-mc'?['{','}']:['(',')'];
  t=T(`Simplify: ${e} ÷ ${b} + ${L}${cc} · ${d} − [${a} + (${cc} + 1)]${Rb}`,[num(z,1,'int')],minus(z),`${e} ÷ ${b} = ${a}; inside: ${cc*d} − [${a} + ${cc+1}] = ${cc*d-a-cc-1}; total ${a} + ${cc*d-a-cc-1} = ${minus(z)}.`,{a,b,c:cc,d});
  if(v==='brace-mc')t.choices=opts(t,[{value:minus(cc*d+cc+1),mistake:'Subtracted only the first number inside the brackets'},{value:minus(cc*d-a-cc-1),mistake:`Left out ${e} ÷ ${b}`},{value:minus(e-b+cc*d-a-cc-1),mistake:`Subtracted ${b} instead of dividing by it`}],h);}
 break;}
case 'a1-order-big':{const a=int(11,49),b=int(11,19),cc=int(2,9),d=int(2,9),e=int(2,9),f=int(2,9),z=a*(b*d-cc)+e*f;
 t=T(`Simplify: ${a}(${b*d} − ${cc*d} ÷ ${d}) + ${e} · ${f}`,[num(z,1,'int')],S.comma(z),`Inside the parentheses, divide first: ${cc*d} ÷ ${d} = ${cc}, so ${b*d} − ${cc} = ${b*d-cc}. Then ${a}(${b*d-cc}) + ${e*f} = ${S.comma(z)}.`,{a,b,c:cc,d,e,f});
 t.choices=opts(t,[{value:S.comma(a*b*d+e*f),mistake:`Left out ${cc*d} ÷ ${d}`},{value:S.comma((a*b*d-a*cc+e)*f),mistake:`Added ${e} before multiplying by ${f}`},{value:S.comma(a*(b-cc)+e*f),mistake:`Divided ${b*d} − ${cc*d} by ${d}`}],h);break;}
case 'a1-sign-count':{const a=int(2,21),b=int(2,21),first=pick(['neg','pos']),z=a%2===0?'positive':'negative';
 t=T(`Is the product of ${first==='neg'?`${a} negative numbers and ${b} positive numbers`:`${b} positive numbers and ${a} negative numbers`} a positive number or a negative number?`,[word(z,z+' number')],z,`An ${a%2===0?'even':'odd'} number of negative factors (${a}) gives a ${z} product.`,{a,b,first});break;}
case 'a1-sign-products':{const r=()=>int(1,9)*pick([1,-1]),P1=[r(),r(),r(),r()],P2=[r(),r(),r(),r(),r(),r()],P3=[r(),r(),r()],np=pick(['positive','negative']);
 const pos=[P1,P2,P3].filter(L=>L.reduce((x,y)=>x*y,1)>0).length,z=np==='positive'?pos:3-pos,f=L=>L.map(x=>`(${sgn(x)})`).join('');
 t=T(`How many of these products are ${np}? I. ${f(P1)} II. ${f(P2)} III. ${f(P3)}`,[num(z,1,'int')],String(z),`Count the negative factors in each product: ${[P1,P2,P3].map(L=>L.filter(x=>x<0).length).join(', ')}. An even count gives a positive product. ${z} ${z===1?'is':'are'} ${np}.`,{P1,P2,P3,np});
 t.choices=opts(t,[0,1,2,3].filter(x=>x!==z).map(x=>({value:String(x),mistake:Math.abs(x-z)===1?'Misjudged the sign of one product':'Counted the products of the other sign'})),h);break;}
case 'a1-eval':{const sg=()=>pick([1,-1]);
 if(v==='xy+ax'){const [x,y]=letters(int,2),a=int(2,5),b=int(1,7)*sg(),cc=int(2,7)*sg(),s1=pick([1,2]),z=s1===1?cc*b+a*b:cc*b-a*cc,e=s1===1?`${x}${y} + ${a}${x}`:`${x}${y} − ${a}${y}`;
  t=T(`Evaluate ${e} if ${x} = ${minus(b)} and ${y} = ${minus(cc)}.`,[num(z,1,'int')],minus(z),`Substitute: ${s1===1?`(${minus(b)})(${minus(cc)}) + ${a}(${minus(b)})`:`(${minus(b)})(${minus(cc)}) − ${a}(${minus(cc)})`} = ${minus(z)}.`,{a,b,c:cc,s:s1});}
 else if(v==='w-sum'||v==='w-mix'){const [x,y,w]=letters(int,3),a=int(1,7)*sg(),b=int(1,7)*sg(),cc=int(1,7)*sg(),s1=v==='w-mix'?3:pick([1,2]);
  const z=s1===1?-a*(b+cc):s1===2?-a*(b-cc):-a*(-b+cc)-b*cc,e=s1===1?`−${w}(${x} + ${y})`:s1===2?`−${w}(${x} − ${y})`:`−${w}(−${x} + ${y}) − ${x}${y}`;
  t=T(`Evaluate ${e} if ${w} = ${minus(a)}, ${x} = ${minus(b)} and ${y} = ${minus(cc)}.`,[num(z,1,'int')],minus(z),`Substitute and simplify: ${minus(z)}.`,{a,b,c:cc,s:s1});}
 else if(v==='diff-sq'){const [x,y]=letters(int,2);let b,cc;do{b=int(1,7)*sg();cc=int(1,7)*sg();}while(b+cc===0||b-cc===0);const s1=pick([1,2]),z=s1===2?-(b-cc)*(b+cc):-(cc+b)*(cc-b),e=s1===1?`−(${y} + ${x})(${y} − ${x})`:`−(${x} − ${y})(${x} + ${y})`;
  t=T(`Evaluate ${e} if ${x} = ${minus(b)} and ${y} = ${minus(cc)}.`,[num(z,1,'int')],minus(z),`Substitute and simplify: ${minus(z)}.`,{b,c:cc,s:s1});}
 else if(v==='bracket'){const [x,y,w]=letters(int,3),a=int(1,7)*sg(),b=int(1,7)*sg(),cc=int(1,7)*sg(),s1=pick([1,2]),z=s1===1?-a*(b-a):-a*(-2*cc),e=s1===1?`−${w}[(${x} − ${y}) − (${w} − ${y})]`:`−${w}[(${x} − ${y}) − (${x} + ${y})]`;
  t=T(`Evaluate ${e} if ${w} = ${minus(a)}, ${x} = ${minus(b)} and ${y} = ${minus(cc)}.`,[num(z,1,'int')],minus(z),`Simplify inside the brackets first, then multiply by −${w}: ${minus(z)}.`,{a,b,c:cc,s:s1});}
 else if(v==='bracket-mc'){const [x,y]=letters(int,2);let b,cc,s1,z,d1,d2,d3;do{b=int(1,7)*sg();cc=int(1,7)*sg();s1=pick([1,2]);if(s1===1){z=b*b*(b+cc);d1=b*b*b+cc;d2=z!==0?-z:-b-b*cc+b;d3=-b-b*(cc+b);}else{z=cc*b*(b-cc);d1=cc*b*b-cc;d2=d1!==0?-d1:-cc-b*(b-cc);d3=-cc-b*b-cc;}}while(new Set([z,d1,d2,d3]).size<4);
  const e=s1===1?`−${x}[−${x}(${y} + ${x})]`:`−${y}[−${x}(${x} − ${y})]`;
  t=T(`Evaluate ${e} if ${x} = ${minus(b)} and ${y} = ${minus(cc)}.`,[num(z,1,'int')],minus(z),`Work from the inside out: ${minus(z)}.`,{b,c:cc,s:s1});
  t.choices=opts(t,[{value:minus(d1),mistake:'Multiplied only the first term inside the parentheses'},{value:minus(d2),mistake:'Lost a negative sign'},{value:minus(d3),mistake:'Added where the expression multiplies'}],h);}
 else{// 'mc': ax ± y
  const [x,y]=letters(int,2);let a,b,cc,s1,z,d1,d2,d3;do{a=int(2,5);b=int(1,15);cc=int(1,15);s1=pick([1,2]);if(s1===1){z=a*b+cc;d1=a*(b+cc);d2=Math.abs(a*b-cc);d3=a*cc+b;}else{z=a*b-cc;d1=Math.abs(a*(b-cc));d2=Math.abs(a*cc-b);d3=a*b+cc;}}while(z<0||new Set([z,d1,d2,d3]).size<4);
  t=T(`Evaluate ${a}${x} ${s1===1?'+':'−'} ${y} if ${x} = ${b} and ${y} = ${cc}.`,[num(z,1,'int')],String(z),`${a}(${b}) ${s1===1?'+':'−'} ${cc} = ${z}.`,{a,b,c:cc,s:s1});
  t.choices=opts(t,[{value:String(d1),mistake:s1===1?`Multiplied ${a} by the sum of ${x} and ${y}`:`Multiplied ${a} by the difference of ${x} and ${y}`},{value:String(d2),mistake:'Substituted the values for the wrong letters'},{value:String(d3),mistake:s1===1?'Substituted the values for the wrong letters':'Added instead of subtracting'}],h);}
 break;}
case 'a1-cyl':{const [u,ab]=pick([['inches','in.'],['feet','ft'],['meters','m'],['yards','yd'],['centimeters','cm']]);
 if(v==='sa'){const a=int(10,20),b=int(a+2,a+5),z=2*a*b+2*a*a;
  t=T(`Find the surface area of this right circular cylinder. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[0,1],b:[z,1]}],`${S.comma(z)}π ${ab}²`,`Two bases 2π(${a})² = ${2*a*a}π, plus the side 2π(${a})(${b}) = ${2*a*b}π: ${S.comma(z)}π.`,{a,b,u},{svg:S.cylinderFigure(a,b,u)});}
 else{const mc=v==='vol-mc',a=int(2,5),b=mc?int(7,13):int(7,12),uu=mc?['inches','in.']:[u,ab],z=a*a*b;
  t=T(`Find the volume of the right circular cylinder. Dimensions are in ${uu[0]}. Give the exact answer in terms of π.`,[{t:'pi',a:[0,1],b:[z,1]}],`${z}π ${uu[1]}³`,`V = (area of base)(height) = π(${a})²(${b}) = ${z}π.`,{a,b,u:uu[0]},{svg:S.cylinderFigure(a,b,uu[1])});
  if(mc)t.choices=opts(t,[{value:`${a*b}π ${uu[1]}³`,mistake:'Did not square the radius'},{value:`${z+12}π ${uu[1]}³`,mistake:'Arithmetic slip when multiplying'},{value:`${2*a*a*b}π ${uu[1]}³`,mistake:'Used the diameter in place of the radius once'},{value:`${2*a*b}π ${uu[1]}³`,mistake:'Found the area of the curved side instead of the volume'}],h);}
 break;}
case 'a1-box-sa':{const [u,ab]=pick([['inches','in.'],['centimeters','cm'],['millimeters','mm'],['feet','ft'],['meters','m'],['yards','yd']]);
 if(v==='mc'){const a=int(9,15),b=int(9,15),cc=int(1,4),z=2*(b*cc+b*a+cc*a);
  t=T('Find the surface area of the rectangular box. Dimensions are in centimeters.',[num(z,1,'int')],`${S.comma(z)} cm²`,`Three pairs of faces: 2(${a} × ${b}) + 2(${a} × ${cc}) + 2(${b} × ${cc}) = ${z} cm².`,{a,b,c:cc},{svg:boxFig3(a,b,cc,[`${a} cm`,`${b} cm`,`${cc} cm`])});
  t.choices=opts(t,[{value:`${a*b*cc} cm²`,mistake:'Found the volume instead of the surface area'},{value:`${4*(a+b+cc)} cm²`,mistake:'Added the lengths of all twelve edges'},{value:`${a*b+b*cc+cc*a} cm²`,mistake:'Counted only one face of each pair'}],h);}
 else{const a=int(4,20),b=int(4,20),cc=int(4,20),z=2*a*cc+2*b*cc+2*a*b;
  t=T(`Find the surface area of this right rectangular prism. Dimensions are in ${u}.`,[num(z,1,'int')],`${S.comma(z)} ${ab}²`,`2(${a} × ${cc}) + 2(${b} × ${cc}) + 2(${a} × ${b}) = ${z}.`,{a,b,c:cc,u},{svg:boxFig3(a,b,cc,[String(a),String(b),String(cc)])});}
 break;}
case 'a1-tri-prism':{const [a,cc,d]=pick(zip([6,5,9,8,12,15,8,12,12,15,16,20],[8,12,12,15,16,20,6,5,9,8,12,15],[10,13,15,17,20,25,10,13,15,17,20,25])),b=int(a,Math.min(2*a,25)),[u,ab]=pick([['inches','in.'],['centimeters','cm'],['millimeters','mm'],['feet','ft'],['meters','m'],['yards','yd']]);
 if(v==='iso'){const z=2*(a*cc+b*d+a*b),w=b*Math.cos(15*Math.PI/180)*0.8,hh=b*Math.sin(15*Math.PI/180)*0.8,o=p=>[p[0]+w,p[1]+hh];
  const F=Fig().poly([[-a,0],[a,0],[0,cc]]).seg([a,0],o([a,0])).seg(o([a,0]),o([0,cc])).seg([0,cc],o([0,cc])).seg([0,0],[0,cc],{dash:'4,3',w:1}).right([0,0],0,90,7).txt([a/2,-0.08*cc-0.5],String(a)).txt([-a/2,-0.08*cc-0.5],String(a)).txt([0.6,cc*0.4],String(cc),{anchor:'start'}).txt([a/2+0.3,cc*0.55+0.3],String(d),{anchor:'start'}).txt([-a/2-0.3,cc*0.55+0.3],String(d),{anchor:'end'}).txt([a+w/2+0.4,hh/2-0.4],String(b),{anchor:'start'});
  t=T(`Find the surface area of the triangular prism. Dimensions are in ${u}.`,[num(z,1,'int')],`${S.comma(z)} ${ab}²`,`Two triangles 2 × ½ × ${2*a} × ${cc} = ${2*a*cc}; two slanted faces 2 × ${d} × ${b} = ${2*b*d}; the bottom ${2*a} × ${b} = ${2*a*b}. Total ${z}.`,{a,b,c:cc,d,u},{svg:F.render(`A prism ${b} long whose ends are isosceles triangles with base ${2*a}, height ${cc} and equal sides ${d}`,330,200)});}
 else{const z=a*cc+b*d+a*b+cc*b;
  t=T(`Find the surface area of this right triangular prism. Dimensions are in ${u}.`,[num(z,1,'int')],`${S.comma(z)} ${ab}²`,`Two triangles 2 × ½ × ${a} × ${cc} = ${a*cc}; three rectangles ${b}(${a} + ${cc} + ${d}) = ${b*(a+cc+d)}. Total ${z}.`,{a,b,c:cc,d,u},{svg:S.rightTriPrism(a,cc,d,b)});}
 break;}
case 'a1-solid-base':{// a labelled base of a right solid; surface area or volume
 const [u,ab]=pick([['inches','in.'],['centimeters','cm'],['millimeters','mm'],['feet','ft'],['meters','m'],['yards','yd']]);
 if(v==='halfdisk-sa'){const a=int(6,20),b=int(Math.floor(a/4),Math.floor(a/2))+a,cc=int(Math.floor(0.6*b),Math.floor(1.5*b));
  const F=Fig().poly(arcPts([0,0],b,0,180),{w:1.6}).poly(arcPts([0,0],a,180,360)).seg([-b,0],[-a,0]).seg([a,0],[b,0]).seg([-a,0],[a,0],{dash:'4,3',w:1}).dot([0,0]).seg([0,0],pt([0,0],45,b),{w:1}).seg([0,0],pt([0,0],-45,a),{w:1}).txt(pt([0,0],45,b*0.5),String(b),{anchor:'end',dx:-4}).txt(pt([0,0],-45,a*0.55),String(a),{anchor:'end',dx:-4});
  const A=2*cc*(b-a),B=cc*(a+b)+a*a+b*b;
  t=T(`A base of a right solid whose height is ${cc} ${u} is shown: half of a circle of radius ${b} joined to half of a circle of radius ${a}. Find the surface area of the solid. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[A,1],b:[B,1]}],`(${piT([A,1],[B,1])}) ${ab}²`,`Two bases: 2(½π${b}² + ½π${a}²) = ${a*a+b*b}π. Lateral area = height × perimeter = ${cc}(π${b} + π${a} + 2(${b-a})) = ${cc*(a+b)}π + ${A}. Total ${piT([A,1],[B,1])}.`,{a,b,c:cc,u},{svg:F.render(`The base: a half circle of radius ${b} above a half circle of radius ${a}, sharing a center`,300,220)});}
 else if(v==='l-sa'||v==='l-vol'){const a=int(6,20),b=int(Math.floor(a/2),Math.floor(2*a/3)),cc=int(Math.floor(a/2),Math.floor(2*a/3)),d=int(Math.floor(0.6*a),Math.floor(1.5*a)),area=a*a+b*cc-a*cc;
  const F=Fig().poly([[0,0],[a,0],[a,a],[cc,a],[cc,b],[0,b]]).right([0,0],0,90,7).right([a,0],90,180,7).right([a,a],180,270,7).right([0,b],270,0,7).txt([a/2,-0.08*a-0.4],String(a)).txt([-0.4,b/2],String(b),{anchor:'end'}).txt([cc/2,b+0.4],String(cc)).txt([cc-0.4,(a+b)/2],String(a-b),{anchor:'end'});
  const sa=v==='l-sa',z=sa?2*area+4*a*d:area*d;
  t=T(`A base of a right solid whose height is ${d} ${u} is shown. Find the ${sa?'surface area':'volume'} of the solid. Dimensions are in ${u}. All angles are right angles.`,[num(z,1,'int')],`${S.comma(z)} ${ab}${sa?'²':'³'}`,sa?`Base area ${a}(${b}) + (${a-cc})(${a-b}) = ${area}; two bases ${2*area}. Perimeter ${4*a}; lateral area ${4*a} × ${d} = ${4*a*d}. Total ${S.comma(z)}.`:`V = (area of base)(height) = ${area} × ${d} = ${S.comma(z)}.`,{a,b,c:cc,d,u},{svg:F.render(`The base: a ${a} by ${a} square with a ${a-cc} by ${a-b} corner missing; sides ${a}, ${b}, ${cc}, ${a-b}`,260,220)});}
 else if(v==='semitrap-sa'){const [b,a]=pick(zip([4,5,6,6,7,8,7,8,9,10,9,10,11,12,10,11,12,13,14,12,13,14,15,16,13,14,15,16,17,18,15,16,17,18,19,20],[3,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,10,10,10,10,10,10]));
  const cc=int(a,Math.round(3*a/2)),d=int(a,Math.round(3*a/2)),[k,rr]=sqrtParts(4*a*a+b*b),[kc,rc]=sqrtParts(cc*cc*(4*a*a+b*b));
  const F=Fig().poly([[-d,a],[0,a],...arcPts([0,0],a,90,-90).slice(1,-1),[0,-a],[-d-b,-a]]).seg([0,a],[0,-a],{dash:'4,3',w:1}).dot([0,0]).seg([0,0],pt([0,0],45,a),{w:1}).txt(pt([0,0],0,a*0.5),String(a),{dy:14}).txt([(-b-d)/2,-a-0.5],String(b+d)).txt([-d/2,a+0.3],String(d)).txt([-d-b/2-0.4,0],rr===1?String(k):`${k===1?'':k}√${rr}`,{anchor:'end'});
  const A=b*cc+2*a*b+4*a*d+2*d*cc,Bp=a*cc+a*a,val=rr===1?piT([A+kc,1],[Bp,1]):`${A} + ${kc===1?'':kc}√${rc} + ${Bp}π`,vNum=A+kc*Math.sqrt(rc)+Bp*Math.PI;
  t=T(`A base of a right solid whose height is ${cc} ${u} is shown: a trapezoid joined to half of a circle of radius ${a}. Find the surface area of the solid. Dimensions are in ${u}. Give the exact answer in terms of π, with radicals simplified.`,[{t:'exact',v:vNum,need:rr===1?['π']:['π','√']}],`(${val}) ${ab}²`,`Base area: trapezoid ${a}(${b+2*d}) = ${a*(b+2*d)} plus half circle ${fracT(a*a,2)}π; two bases ${2*a*(b+2*d)} + ${a*a}π. Perimeter: ${d} + ${b+d} + ${rr===1?k:`${k===1?'':k}√${rr}`} + ${a}π; times the height ${cc}. Total ${val}.`,{a,b,c:cc,d,u},{svg:F.render(`The base: a trapezoid with parallel sides ${d} and ${b+d} joined to a half circle of radius ${a}`,320,220)});}
 else if(v==='trap-vol'){const [b,cc,a]=pick(zip([10,10,11,11,12,12,13,13,14,14,15,15,16,16,11,11,13,13,15,15,12,12,13,13,14,14,15,15,16,16,13,13,15,15,14,14,15,15,16,16,15,15],[9,11,10,12,11,13,12,14,13,15,14,16,15,17,10,12,12,14,14,16,11,13,12,14,13,15,14,16,15,17,12,14,14,16,13,15,14,16,15,17,14,16],[4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,7,7,7,7,8,8,8,8,8,8,9,9])),d=int(a,b),z=[d*(a+b)*cc,2];
  const F=Fig().poly([[0,0],[b,0],[(b+a)/2,cc],[(b-a)/2,cc]]).seg([1.15*b,0],[1.15*b,cc],{w:1,start:1,end:1}).txt([b/2,-0.08*cc-0.3],String(b)).txt([b/2,cc+0.3],String(a)).txt([1.15*b+0.3,cc/2],String(cc),{anchor:'start'});
  t=T(`A base of a right solid whose height is ${d} ${u} is shown. Find the volume of the solid. Dimensions are in ${u}.`,[num(...z,'dec')],`${S.comma(decT(...z))} ${ab}³`,`Base area ½ × ${cc} × (${a} + ${b}) = ${decT((a+b)*cc,2)}; V = ${decT((a+b)*cc,2)} × ${d} = ${decT(...z)}.`,{a,b,c:cc,d,u},{svg:F.render(`The base: a trapezoid with parallel sides ${a} and ${b} and height ${cc}`,300,170)});}
 else if(v==='semitri-vol'){const [b,a]=pick(zip([4,5,6,6,7,8,7,8,9,10,9,10,11,12,10,11,12,13,14,12,13,14,15,16,13,14,15,16,17,18,15,16,17,18,19,20],[3,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,10,10,10,10,10,10])),cc=int(a,Math.round(3*a/2));
  const F=Fig().poly([[0,a],...arcPts([0,0],a,90,-90).slice(1,-1),[0,-a],[-b,-a]]).seg([0,a],[0,-a],{dash:'4,3',w:1}).right([0,-a],180,90,7).dot([0,0]).seg([0,0],pt([0,0],45,a),{w:1}).txt(pt([0,0],0,a*0.5),String(a),{dy:14}).txt([-b/2,-a-0.5],String(b));
  t=T(`A base of a right solid whose height is ${cc} ${u} is shown: a right triangle joined to half of a circle of radius ${a}. Find the volume of the solid. Dimensions are in ${u}. Give the exact answer in terms of π.`,[{t:'pi',a:[a*b*cc,1],b:[a*a*cc,2]}],`(${piT([a*b*cc,1],[a*a*cc,2])}) ${ab}³`,`Base area: triangle ½ × ${b} × ${2*a} = ${a*b} plus half circle ${fracT(a*a,2)}π. V = ${cc}(${a*b} + ${fracT(a*a,2)}π) = ${piT([a*b*cc,1],[a*a*cc,2])}.`,{a,b,c:cc,u},{svg:F.render(`The base: a right triangle with legs ${b} and ${2*a} joined to a half circle of radius ${a}`,300,220)});}
 else if(v==='semirect-vol'){const rows=[];for(const [A0,lo] of [[2,3],[3,3],[4,3],[5,3],[6,3]])for(let B=lo;B<=12;B++)if(!(A0===2&&B>8))rows.push([A0,B]);const [a,b]=pick(rows),cc=int(3,12),[u2,ab2]=pick([['inches','in.'],['feet','ft'],['meters','m'],['centimeters','cm']]);
  t=T(`Find the volume of the figure. The base is shown; the height of the figure is ${cc} ${u2}. Dimensions are in ${u2}. Give the exact answer in terms of π.`,[{t:'pi',a:[2*a*b*cc,1],b:[a*a*cc,2]}],`(${piT([2*a*b*cc,1],[a*a*cc,2])}) ${ab2}³`,`Base area ${b} × ${2*a} + ½π(${a})² = ${2*a*b} + ${fracT(a*a,2)}π; times ${cc}: ${piT([2*a*b*cc,1],[a*a*cc,2])}.`,{a,b,c:cc,u:u2},{svg:semiFig(a,b,'one','left')});}
 else if(v==='area-vol'){const a=int(5,10),b=int(a,Math.floor(3*a/2)),[un]=pick([['in.'],['cm'],['mm'],['ft'],['m'],['yd']]);
  const F=Fig().poly([[0,0],[10,0],[10,5],[0,10],...arcPts([0,2.5],2.5,90,-90).slice(1,-1)]).txt([4.5,3.5],`${a*a} ${un}²`);
  t=T(`A base of a right solid has an area of ${a*a} ${un}². The height of the solid is ${b} ${un}. Find the volume of the solid.`,[num(a*a*b,1,'int')],`${S.comma(a*a*b)} ${un}³`,`V = (area of base)(height) = ${a*a} × ${b} = ${S.comma(a*a*b)}.`,{a,b},{svg:F.render(`The base of the solid, an irregular shape with area ${a*a} square ${un}`,220,200)});}
 else{// 'tri-vol': isosceles triangle base
  const a=int(5,14),b=int(2*a,3*a),cc=int(2*a,3*a),[un]=pick([['in.'],['cm'],['mm'],['ft'],['m'],['yd']]),z=[a*b*cc,2];
  const F=Fig().poly([[-a/2,0],[a/2,0],[0,b]]).seg([0,0],[0,b],{dash:'4,3',w:1}).right([0,0],0,90,7).txt([0,-0.06*b-0.3],`${a} ${un}`).txt([a/2+0.15*b,b/2],`${b} ${un}`,{anchor:'start'}).seg([a/2+0.1*b,0],[a/2+0.1*b,b],{w:1,start:1,end:1});
  t=T(`A base of a right prism is the isosceles triangle shown. The height of the prism is ${cc} ${un}. Find the volume of the prism.`,[num(...z,'any')],`${Number.isInteger(z[0]/2)?S.comma(z[0]/2):fracT(...z)} ${un}³`,`Base area ½ × ${a} × ${b} = ${decT(a*b,2)}; V = ${decT(a*b,2)} × ${cc} = ${decT(...z)}.`,{a,b,c:cc},{svg:F.render(`An isosceles triangle with base ${a} ${un} and height ${b} ${un}`,220,220)});}
 break;}
case 'a1-dist-law':{t=T('Use the letters x, y and z, and parentheses, to write the distributive property.',[{t:'compact',alts:['x(y+z)=xy+xz','x(y+z)=xz+xy','xy+xz=x(y+z)','xz+xy=x(y+z)','(y+z)x=yx+zx','(y+z)x=xy+xz','x(z+y)=xz+xy','x(z+y)=xy+xz']}],'x(y + z) = xy + xz','Multiplying a sum by a number gives the same result as multiplying each addend and adding: x(y + z) = xy + xz.',{form:pick(['a','b'])});break;}
case 'a1-distribute':{
 if(v==='four'){const [p,w,x,y]=letters(int,4);let a,b,cc,d;do{a=int(-5,-2);b=int(2,4);cc=int(2,5)*pick([1,-1]);d=int(2,5)*pick([1,-1]);}while(cc>0&&d>0);
  const terms=[[a*b,{[p]:1,[w]:1}],[a*cc,{[p]:1,[x]:1}],[a*d,{[p]:1,[y]:1}]];
  t=T(`Use the distributive property to expand ${minus(a)}${p}(${b}${w} ${cc<0?'−':'+'} ${Math.abs(cc)}${x} ${d<0?'−':'+'} ${Math.abs(d)}${y}).`,[polyPart(terms)],polyStr(terms),`Multiply each term by ${minus(a)}${p}: ${polyStr(terms)}.`,{a,b,c:cc,d,L:[p,w,x,y]});}
 else{const [w,x,y]=letters(int,3);let b,cc;do{b=int(3,9);cc=int(1,8)*pick([1,-1]);}while(Math.abs(cc)===b);const s1=pick([1,-1]),terms=[[s1*b,{[w]:1,[x]:1}],[s1*cc,{[w]:1,[y]:1}]];
  t=T(`Expand by using the distributive property: ${s1<0?'−':''}${w}(${b}${x} ${cc<0?'−':'+'} ${Math.abs(cc)===1?'':Math.abs(cc)}${y})`,[polyPart(terms)],polyStr(terms),`Multiply each term by ${s1<0?'−':''}${w}: ${polyStr(terms)}.`,{b,c:cc,s:s1,L:[w,x,y]});
  t.choices=opts(t,[{value:polyStr([[s1*b,{[w]:1,[x]:1}],[cc,{[y]:1}]]),mistake:'Multiplied only the first term'},{value:polyStr([[s1*b,{[w]:1,[x]:1}],[-s1*cc,{[w]:1,[y]:1}]]),mistake:'Used the wrong sign on the second term'},{value:polyStr([[b,{[x]:1}],[s1*cc,{[w]:1,[y]:1}]]),mistake:'Multiplied only the second term'}],h);}
 break;}
case 'a1-like':{const pool=[...'fghjkmnpqrstuvwxyz'],pk=()=>{const i=int(0,pool.length-1);return pool.splice(i,1)[0];},F=pk(),G=pk(),Hh=pk(),I=pk(),J=pk(),cf=()=>int(1,7)*pick([1,-1]);
 const like=[F+G+Hh,F+Hh+G,G+F+Hh,G+Hh+F,Hh+G+F,Hh+F+G],unlike=[pick([I+G+Hh,I+Hh+G]),pick([Hh+I+F,F+I+Hh]),pick([G+F+I,F+G+I]),pick([J+G+Hh,J+Hh+G]),pick([Hh+J+F,F+J+Hh]),pick([G+F+J,F+G+J])];
 const [nAll,nLike]=v==='count'?pick([[4,2],[4,3],[5,2],[5,3],[5,4],[4,0],[5,0]]):pick([[4,2],[4,3],[5,2],[5,3],[5,4]]);
 const L=[...like].sort(()=>0).slice(0,6),chosen=[];const li=[0,1,2,3,4,5].map(()=>int(0,999));const order=[0,1,2,3,4,5].sort((p,q)=>li[p]-li[q]);for(let k=0;k<nLike;k++)chosen.push({s:like[order[k]],like:true});
 const ui=[0,1,2,3,4,5].map(()=>int(0,999)),uo=[0,1,2,3,4,5].sort((p,q)=>ui[p]-ui[q]).filter(k=>v==='count'||k<3);for(let k=0;k<nAll-nLike;k++)chosen.push({s:unlike[uo[k]],like:false});
 const pos=chosen.map(()=>int(0,999)),items=chosen.map((x,i)=>({...x,k:pos[i]})).sort((p,q)=>p.k-q.k).map((x,i)=>({...x,lab:'abcde'[i],c:cf()}));
 const show=items.map(x=>`(${x.lab}) ${monoTxt(x.c,x.s)}`).join(' '),likeLabs=items.filter(x=>x.like).map(x=>x.lab);
 if(v==='count'){const z=nLike,alts=z===0?['none','0','zero','none of them']:[String(z),['','','two','three','four'][z]];
  t=T(`How many of the following terms are like terms? ${show}`,[word(...alts)],z===0?'none':String(z),z===0?'No two of the terms have the same variables.':`${z} terms have exactly the same variables (${likeLabs.map(x=>'('+x+')').join(', ')}).`,{items:items.map(x=>[x.c,x.s,x.like])});
  t.choices=opts(t,['none','2','3','4'].filter(x=>x!==(z===0?'none':String(z))).map(x=>({value:x,mistake:x==='none'?'Thought the order of the variables makes terms unlike':'Miscounted which terms have exactly the same variables'})),h);}
 else{const val=likeLabs.length===2?`(${likeLabs[0]}) and (${likeLabs[1]})`:likeLabs.slice(0,-1).map(x=>`(${x})`).join(', ')+` and (${likeLabs[likeLabs.length-1]})`;
  t=T(`Which of the following terms are like terms? Give their letters. ${show}`,[{t:'set',items:likeLabs}],val,`Like terms have exactly the same variables; the order of the factors does not matter. ${val} are like terms.`,{items:items.map(x=>[x.c,x.s,x.like])});}
 break;}
case 'a1-combine':{const r=(lo,hi)=>int(lo,hi)*pick([1,-1]);
 if(v==='xy'){const [x,y]=letters(int,2);let a,f,b,cc,d,e;do{a=r(1,8);f=r(1,9);b=r(1,8);cc=r(1,8);d=r(1,8);e=r(1,8);}while(a+f===0||b+cc+d+e===0);
  const XY={[x]:1,[y]:1},src=termsTxt([[b,y+x],[cc,x+y],[a,''],[d,y+x],[e,x+y],[f,'']]),ans=[[b+cc+d+e,XY],[a+f,{}]];
  t=T(`Simplify by adding like terms: ${src}`,[polyPart(ans)],polyStr(ans),`${x}${y} and ${y}${x} are like terms: ${b} + ${cc} + ${d} + ${e} = ${b+cc+d+e}; the numbers add to ${a+f}. Result: ${polyStr(ans)}.`,{a,b,c:cc,d,e,f});
  t.choices=opts(t,[{value:termsTxt([[e+cc,x+y],[d+b,y+x],[a+f,'']]),mistake:`Did not combine ${x}${y} with ${y}${x}`},{value:termsTxt([[b+cc+d+e,x],[b+cc+d+e,y],[a+f,'']]),mistake:`Wrote ${x}${y} as ${x} + ${y}`},{value:termsTxt([[e+cc,x],[d+b,y],[a+f,'']]),mistake:`Treated ${x}${y} and ${y}${x} as single variables`}],h);}
 else if(v==='xy3'){const [x,y]=letters(int,2);let a=int(2,9),cc=int(-9,-1),hh=pick([1,-1]),d=r(1,9),b=r(1,9),e=r(1,9),f=r(1,9);if(cc+a+hh===0)a+=2;if(b+d===0)d=-d;if(e+f===0){e+=1;f-=1;}
  const ans=[[e+f,{[x]:1,[y]:1}],[a+cc+hh,{[x]:1}],[b+d,{[y]:1}]];
  t=T(`Simplify by adding like terms: ${termsTxt([[a,x],[f,x+y],[b,y],[e,x+y],[cc,x],[d,y],[hh,x]])}`,[polyPart(ans)],polyStr(ans),`Add the ${x}${y} terms, the ${x} terms and the ${y} terms separately: ${polyStr(ans)}.`,{a,b,c:cc,d,e,f,h:hh});}
 else{const [w,x,y]=letters(int,3);let a=r(2,9),b=r(1,9),cc=int(-9,-1),d=r(1,9);if(cc+a===0)cc-=1;if(b+d===0)d+=2;
  const ans=[[a+cc,{[w]:1,[x]:1}],[b+d,{[x]:1,[y]:1}]];
  t=T(`Simplify by adding like terms: ${termsTxt([[a,x+w],[b,x+y],[cc,w+x],[d,y+x]])}`,[polyPart(ans)],polyStr(ans),`${x}${w} and ${w}${x} are like terms, and so are ${x}${y} and ${y}${x}: ${polyStr(ans)}.`,{a,b,c:cc,d});}
 break;}
case 'a1-power':{const rows=v==='mc'?[[2,3],[2,4],[3,2],[3,3],[3,4]]:[[2,2],[2,3],[2,4],[3,2],[3,3],[3,4],[5,2],[6,2]],[a,b]=pick(rows),z=a**b;
 t=T(`Evaluate: ${a}${S.sup(b)}`,[num(z,1,'int')],String(z),`${a}${S.sup(b)} = ${Array(b).fill(a).join(' · ')} = ${z}.`,{a,b},{math:math(`<msup><mn>${a}</mn><mn>${b}</mn></msup>`)});
 if(v==='mc')t.choices=opts(t,[{value:String(a*b),mistake:'Multiplied the base by the exponent'},{value:String(b**a),mistake:'Switched the base and the exponent'},{value:String(z*a),mistake:'Used the base as a factor one extra time'},{value:String(z+1),mistake:'Arithmetic slip'}],h);break;}
case 'a1-neg-power':{let a,b;do{a=int(2,4);b=int(2,4);}while(a===4&&b===4);const form=v==='mc'?pick(['paren','neg']):'paren',z=form==='paren'?(-a)**b:-(a**b),shown=form==='paren'?`(−${a})${S.sup(b)}`:`−(${a})${S.sup(b)}`;
 t=T(`Simplify: ${shown}`,[num(z,1,'int')],minus(z),form==='paren'?`The base is −${a}: ${minus(z)}.`:`The exponent applies to ${a} only, then take the opposite: −${a**b}.`,{a,b,form},{math:math(form==='paren'?`<msup><mrow>${mo('(')}${mo('−')}<mn>${a}</mn>${mo(')')}</mrow><mn>${b}</mn></msup>`:`<mrow>${mo('−')}<msup><mrow>${mo('(')}<mn>${a}</mn>${mo(')')}</mrow><mn>${b}</mn></msup></mrow>`)});
 if(v==='mc'){const d2=Math.abs(a*b)===Math.abs(z)?3*b:a*b;t.choices=opts(t,[{value:minus(-z),mistake:form==='paren'?'Treated the negative sign as outside the power':'Raised the negative number to the power'},{value:minus(d2),mistake:'Multiplied the base by the exponent'},{value:minus(-d2),mistake:'Multiplied the base by the exponent and used the wrong sign'}],h);}
 break;}
case 'a1-power-mix':{const P=[['2²',4],['2³',8],['2⁴',16],['3²',9],['3³',27]],N=[['(−2)²',4],['(−2)³',-8],['(−2)⁴',16],['(−3)²',9],['(−3)³',-27]];
 if(v==='string'){const [q1,q3,q5]=[pick(P),pick(P),pick(P)],[q2,q4]=[pick(N),pick(N)],z=-q1[1]-q2[1]-q3[1]-Math.abs(q4[1]-q5[1]);
  t=T(`Simplify: −${q1[0]} − ${q2[0]} − ${q3[0]} − |${q4[0]} − ${q5[0]}|`,[num(z,1,'int')],minus(z),`Evaluate each power: −${q1[1]} − (${minus(q2[1])}) − ${q3[1]} − |${minus(q4[1])} − ${q5[1]}| = ${minus(z)}.`,{v:[q1[1],q2[1],q3[1],q4[1],q5[1]]});}
 else if(v==='pair'){const k=int(0,9),pair=[[P[0],N[0]],[N[0],P[0]],[P[1],N[1]],[N[1],P[1]],[P[2],N[2]],[N[2],P[2]],[P[3],N[3]],[N[3],P[3]],[P[4],N[4]],[N[4],P[4]]][k],z=-pair[0][1]+pair[1][1];
  t=T(`Simplify: −${pair[0][0]} + ${pair[1][0]}`,[num(z,1,'int')],minus(z),`−(${minus(pair[0][1])}) + (${minus(pair[1][1])}) = ${minus(z)}.`,{v:[pair[0][1],pair[1][1]]});}
 else if(v==='roots'){const P6=[...P,['4²',16]],q1=pick(P6);let b1,b2;do{b1=int(0,4);b2=int(0,4);}while(b1===b2);const q4=pick([['∛8',2],['∛27',3],['∛64',4]]),q5=pick([['∜16',2],['∜81',3]]),z=-q1[1]-N[b1][1]-N[b2][1]+q4[1]-q5[1];
  t=T(`Simplify: −${q1[0]} − ${N[b1][0]} − ${N[b2][0]} + ${q4[0]} − ${q5[0]}`,[num(z,1,'int')],minus(z),`−${q1[1]} − (${minus(N[b1][1])}) − (${minus(N[b2][1])}) + ${q4[1]} − ${q5[1]} = ${minus(z)}.`,{v:[q1[1],N[b1][1],N[b2][1],q4[1],q5[1]]});}
 else{const a=int(1,4),aa=pick([1,2]),cs=int(1,5),bb=pick([1,2]);
  const two=[['2²',4],['2³',8],['(−2)²',4],['(−2)³',-8]][a-1],tre=[['3²',9],['3³',27],['(−3)²',9],['(−3)³',-27]][a-1],twr=aa===1?['∛8',2]:['∛(−8)',-2],trr=aa===1?['∛(−27)',-3]:['∛27',3],fp=bb===1?['4²',16]:['(−4)²',16],fr=bb===1?['∛64',4]:['∛(−64)',-4];
  const [q1,q2]=cs<=2?[two,twr]:cs<=4?[tre,trr]:[fp,fr],z=q1[1]+q2[1];
  t=T(`Simplify: ${q1[0]} + ${q2[0]}`,[num(z,1,'int')],minus(z),`${minus(q1[1])} + (${minus(q2[1])}) = ${minus(z)}.`,{v:[q1[1],q2[1]]});}
 break;}
case 'a1-cube-root':{const a=pick([-5,-4,-3,-2,2,3,4,5]);
 t=T(`Evaluate: ∛(${minus(a**3)})`,[num(a,1,'int')],minus(a),`${minus(a)} × ${minus(a)} × ${minus(a)} = ${minus(a**3)}, so the cube root is ${minus(a)}.`,{a},{math:math(`<mroot><mn>${minus(a**3)}</mn><mn>3</mn></mroot>`)});
 t.choices=opts(t,[{value:minus(-a),mistake:'Used the wrong sign'},{value:minus(a*a),mistake:'Squared the cube root'},{value:minus(-a*a),mistake:'Squared the cube root and used the wrong sign'}],h);break;}
case 'a1-eval-pow':{const L=letters(int,3,'foil'),[A,B,C]=L,r=(lo,hi)=>int(lo,hi)*pick([1,-1]),sp=(n,e)=>`${n}${S.sup(e)}`;let e,z,p;
 if(v==='three'){const b=int(2,4),cc=int(2,4),d=int(2,4),av=pick([-1,2,-2]);z=av**b-av**cc-av**d;e=`${sp(A,b)} − ${sp(A,cc)} − ${sp(A,d)}`;p={av,b,c:cc,d};t=T(`Evaluate ${e} if ${A} = ${minus(av)}.`,[num(z,1,'int')],minus(z),`Substitute ${minus(av)}: ${minus(av**b)} − (${minus(av**cc)}) − (${minus(av**d)}) = ${minus(z)}.`,p);}
 else if(v==='a3b'){let av=r(1,3),bv=r(1,4);if(av>0&&bv>0)av=-av;const s1=pick([1,-1]);z=(av+s1*bv)*bv*av**3;e=`${sp(A,3)}${B}(${A} ${s1<0?'−':'+'} ${B})`;p={av,bv,s:s1};t=T(`Evaluate ${e} if ${A} = ${minus(av)} and ${B} = ${minus(bv)}.`,[num(z,1,'int')],minus(z),`(${minus(av)})³(${minus(bv)})(${minus(av+s1*bv)}) = ${minus(z)}.`,p);}
 else if(v==='mix'){let av=r(1,4),bv=r(1,5),cv=r(1,4);if(av>0&&bv>0&&cv>0)cv=-cv;const s1=pick([1,-1]);z=(av+s1*bv)*bv-s1*cv*cv-av*av;e=`−${sp(A,2)} + ${B}(${A} ${s1<0?'−':'+'} ${B}) ${s1<0?'+':'−'} ${sp(C,2)}`;p={av,bv,cv,s:s1};t=T(`Evaluate ${e} if ${A} = ${minus(av)}, ${B} = ${minus(bv)} and ${C} = ${minus(cv)}.`,[num(z,1,'int')],minus(z),`Substitute and follow the order of operations: ${minus(z)}.`,p);}
 else if(v==='abs'){let av=r(1,4),bv=r(1,4);if(av>0&&bv>0)av=-av;const s1=pick([1,-1]);z=-(av**3)+s1*bv*(av-s1*bv)+Math.abs(bv-av);e=`−${sp(A,3)} ${s1<0?'−':'+'} ${B}(${A} ${s1<0?'+':'−'} ${B}) + |${B} − ${A}|`;p={av,bv,s:s1};t=T(`Evaluate ${e} if ${A} = ${minus(av)} and ${B} = ${minus(bv)}.`,[num(z,1,'int')],minus(z),`Substitute and follow the order of operations: ${minus(z)}.`,p);}
 else if(v==='prod'){let av=r(1,4),bv=r(1,4);if(av>0&&bv>0)av=-av;const ee=int(2,3),f=int(2,3);z=(-ee*av-bv*bv)*(-bv-av)*(f*av);e=`(−${ee}${A} − ${sp(B,2)})(−${B} − ${A})(${f}${A})`;p={av,bv,e:ee,f};t=T(`Evaluate ${e} if ${A} = ${minus(av)} and ${B} = ${minus(bv)}.`,[num(z,1,'int')],minus(z),`(${minus(-ee*av-bv*bv)})(${minus(-bv-av)})(${minus(f*av)}) = ${minus(z)}.`,p);}
 else if(v==='abc'){let av=r(1,4),bv=r(1,4),cv=r(1,4);if(av>0&&bv>0&&cv>0)cv=-cv;const sw=int(1,3);z=sw===1?av*bv*cv**3:sw===2?av**3*bv*cv:av*bv**3*cv;e=sw===1?`${A}${B}${sp(C,3)}`:sw===2?`${sp(A,3)}${B}${C}`:`${A}${sp(B,3)}${C}`;p={av,bv,cv,sw};t=T(`Evaluate ${e} if ${A} = ${minus(av)}, ${B} = ${minus(bv)} and ${C} = ${minus(cv)}.`,[num(z,1,'int')],minus(z),`Substitute and multiply: ${minus(z)}.`,p);}
 else if(v==='sq'){const av=r(1,4),bv=r(1,4);z=av*av-bv*bv;e=`${sp(A,2)} − ${sp(B,2)}`;p={av,bv};t=T(`Evaluate ${e} if ${A} = ${minus(av)} and ${B} = ${minus(bv)}.`,[num(z,1,'int')],minus(z),`(${minus(av)})² − (${minus(bv)})² = ${av*av} − ${bv*bv} = ${minus(z)}.`,p);}
 else{let a,b,cc,d1,d2,d3;do{a=int(3,9);b=int(1,9);cc=int(1,9);z=a*a+5*b-cc;d1=a*a+5+b-cc;d2=2*a+5*b-cc;d3=(a*a+5)*b-cc;}while(new Set([z,d1,d2,d3]).size<4);
  t=T(`Evaluate x² + 5y − z when x = ${a}, y = ${b} and z = ${cc}.`,[num(z,1,'int')],String(z),`${a}² + 5(${b}) − ${cc} = ${a*a} + ${5*b} − ${cc} = ${z}.`,{a,b,c:cc});
  t.choices=opts(t,[{value:String(d1),mistake:'Added 5 and y instead of multiplying'},{value:String(d2),mistake:'Doubled x instead of squaring it'},{value:String(d3),mistake:'Added before multiplying by y'}],h);}
 break;}
// Batch A1-4: Lessons 21-31
case 'a1-prod-rule':{const L=pick([['a','b','c'],['x','y','z']]);let n,fs,E;do{n=int(8,12);fs=[];E=[0,0,0];for(let k=0;k<n;k++){const s1=int(1,15),li=Math.floor((s1-1)/5),e=(s1-1)%5+1;fs.push([L[li],e]);E[li]+=e;}}while(v==='mc'&&E.includes(0));
 const terms=[[1,{[L[0]]:E[0],[L[1]]:E[1],[L[2]]:E[2]}]],key=monoX(1,L.map((l,i)=>[l,E[i]]));
 t=T(`Simplify: ${fs.map(([l,e])=>l+(e===1?'':S.sup(e))).join('')}`,[polyPart(terms)],key,`Add the exponents of each letter: ${L.map((l,i)=>`${l}: ${E[i]}`).join(', ')}. Result: ${key}.`,{fs,L,E});
 if(v==='mc'){const f=(d)=>monoX(1,L.map((l,i)=>[l,E[i]+d[i]]));t.choices=opts(t,[{value:f([1,1,1]),mistake:'Counted one extra factor of each letter'},{value:f([0,2,0]),mistake:`Miscounted the factors of ${L[1]}`},{value:f([2,0,2]),mistake:`Miscounted the factors of ${L[0]} and ${L[2]}`}],h);}
 break;}
case 'a1-like-exp':{const [A,B]=pick([['a','b'],['x','y']]),C=pick([...'mnpqrst']),r=(lo,hi)=>int(lo,hi)*pick([1,-1]);
 if(v==='pos'||v==='neg'){let e1,e2,c1,c2,c3,c4,c5;do{e1=v==='pos'?int(1,5):r(1,4);e2=v==='pos'?int(1,5):r(1,4);c1=r(1,9);c2=r(1,9);c3=r(1,9);c4=r(1,9);c5=v==='pos'?c1+c2+c3:c1+c2+c3+c4;}while(c5===0);
  const pp=[[c1,[[A,e1],[B,e2],[C,1]]],[c2,[[B,e2],[C,1],[A,e1]]],[c3,[[C,1],[A,e1],[B,e2]]],v==='pos'?[c4,[[C,1]]]:[c4,[[C,1],[B,e2],[A,e1]]]],mix=int(0,2),src=[0,1,2,3].map(k=>pp[(k+mix)%4]);
  const ans=v==='pos'?[[c5,{[A]:e1,[B]:e2,[C]:1}],[c4,{[C]:1}]]:[[c5,{[A]:e1,[B]:e2,[C]:1}]],key=polyX(v==='pos'?[[c5,[[A,e1],[B,e2],[C,1]]],[c4,[[C,1]]]]:[[c5,[[A,e1],[B,e2],[C,1]]]]);
  t=T(`Simplify: ${polyX(src)}`,[polyPart(ans)],key,`The order of the factors does not matter, so the terms with ${monoX(1,[[A,e1],[B,e2],[C,1]])} are like terms: ${key}.`,{e1,e2,co:[c1,c2,c3,c4],L:[A,B,C]});}
 else if(v==='split3'){// three terms, each exponent written as a sum of three
  let ex1,ex2,cs,co;do{ex1=r(1,6);ex2=r(1,6);cs=[r(1,9),r(1,9),r(1,9)];co=cs[0]+cs[1]+cs[2];}while(co===0);
  const sp3=(tot)=>{const x=r(1,Math.abs(tot)),y=r(1,Math.abs(tot));return [x,y,tot-x-y];};let e,ee,f,ff;do{e=sp3(ex1);ee=sp3(ex2);f=sp3(ex1);ff=sp3(ex2);}while(f[0]===e[0]||ff[2]===ee[2]);
  const raw=(c0,vs)=>(Math.abs(c0)===1?'':String(Math.abs(c0)))+vs.map(([l,x])=>l+(x===1?'':S.sup(x))).join('');
  const pp=[[cs[0],raw(cs[0],[[A,ex1],[B,ff[0]],[B,ff[1]],[B,ff[2]]])],[cs[1],raw(cs[1],[[B,ee[0]],[B,ee[1]],[B,ee[2]],[A,e[0]],[A,e[1]],[A,e[2]]])],[cs[2],raw(cs[2],[[A,f[1]],[A,f[0]],[A,f[2]],[B,ex2]])]];
  const mix=int(1,3),ord=mix===1?[0,1,2]:mix===2?[1,2,0]:[2,1,0],src=ord.map((k,i)=>(pp[k][0]<0?(i?' − ':'−'):(i?' + ':''))+pp[k][1]).join(''),key=polyX([[co,[[A,ex1],[B,ex2]]]]);
  t=T(`Simplify: ${src}`,[polyPart([[co,{[A]:ex1,[B]:ex2}]])],key,`Add the exponents of each letter in every term: each term is a multiple of ${monoX(1,[[A,ex1],[B,ex2]])}. Add the coefficients: ${key}.`,{ex1,ex2,cs,L:[A,B]});}
 else{// 'split': factors of the same letter written separately
  let e1,e2,ex,c,cs;const sp=(tot,lim)=>{const x=r(1,lim);return [x,tot-x];};
  do{e1=r(2,5);e2=r(2,5);cs=[r(1,9),r(1,9),r(1,9),r(1,9)];}while(cs.reduce((x,y)=>x+y,0)===0);
  const [p3,p5]=sp(e2,Math.abs(e1)-1),[p4,p6]=sp(e1,Math.abs(e2)-1),[q3,q5]=sp(e2,Math.abs(e1)-1),[q4,q6]=sp(e1,Math.abs(e2)-1),[w3,w5]=sp(e2,Math.abs(e1)-1),[w4,w6]=sp(e1,Math.abs(e2)-1);
  const raw=(c0,vs)=>(c0===1?'':c0===-1?'−':minus(c0))+vs.map(([l,e])=>l+(e===1?'':S.sup(e))).join(''),pp=[raw(cs[0],[[A,e1],[B,e2]]),raw(cs[1],[[B,p5],[B,p3],[A,p4],[A,p6]]),raw(cs[2],[[A,q6],[A,q4],[B,q3],[B,q5]]),raw(cs[3],[[B,w3],[B,w5],[A,w4],[A,w6]])];
  const mix=int(0,3),src=[0,1,2,3].map(k=>pp[(k+mix)%4]).map((x,i)=>i===0?x:(x[0]==='−'?' − '+x.slice(1):' + '+x)).join(''),co=cs.reduce((x,y)=>x+y,0),key=polyX([[co,[[A,e1],[B,e2]]]]);
  t=T(`Simplify: ${src}`,[polyPart([[co,{[A]:e1,[B]:e2}]])],key,`Add the exponents of each letter in every term: each term is a multiple of ${monoX(1,[[A,e1],[B,e2]])}. Add the coefficients: ${key}.`,{e1,e2,cs,L:[A,B]});}
 break;}
case 'a1-like-xy-mc':{const r=(lo,hi)=>int(lo,hi)*pick([1,-1]);let g,a,b,cc,d,e,f;do{g=int(2,9);a=r(1,8);b=r(1,8);cc=r(1,8);d=r(1,8);e=r(1,8);f=r(1,9);}while(Math.abs(b)===Math.abs(d)||Math.abs(b+d)<2||Math.abs(cc+e)<2||a+f===0);
 const H=b+d,I=cc+e,J=a+f,X=[['x',g],['y',1]],XY=[['x',1],['y',1]],src=polyX([[a,[]],[b,X],[cc,XY],[d,X],[e,XY],[f,[]]]),ans=[[H,X],[I,XY],[J,[]]];
 t=T(`Simplify: ${src}`,[polyPart([[H,{x:g,y:1}],[I,{x:1,y:1}],[J,{}]])],polyX(ans),`Add the coefficients of like terms: ${polyX(ans)}.`,{a,b,c:cc,d,e,f,g});
 t.choices=opts(t,[{value:polyX([[H,[['x',2*g],['y',2]]],[-I,XY],[-J,[]]]),mistake:'Added the exponents of like terms and changed signs'},{value:polyX([[b-d,X],[cc-e,XY],[J,[]]]),mistake:'Subtracted the coefficients of like terms'},{value:polyX([[b-d,X],[cc-e,[['x',2],['y',2]]],[-J,[]]]),mistake:'Subtracted coefficients and added exponents'}],h);break;}
case 'a1-cond':{const r=(lo,hi)=>int(lo,hi)*pick([1,-1]);
 if(v==='mc'){let b,cc;do{b=int(-7,9);cc=int(-7,9);}while(b===0||cc===0||cc===b);const z=cc-b,s1=pick([1,-1]);let d2=(cc+b)*s1;if(d2===0)d2=Math.abs(z+1);
  t=T(`Which number is a solution of the equation x ${b<0?'−':'+'} ${Math.abs(b)} = ${minus(cc)}?`,[num(z,1,'int')],minus(z),`x = ${minus(cc)} ${b<0?'+':'−'} ${Math.abs(b)} = ${minus(z)}.`,{b,c:cc});
  t.choices=opts(t,[{value:minus(-z),mistake:'Used the wrong sign'},{value:minus(d2),mistake:`${b<0?'Subtracted':'Added'} ${Math.abs(b)} instead of ${b<0?'adding':'subtracting'} it`},{value:minus(-d2),mistake:'Moved the number to the wrong side and used the wrong sign'}],h);}
 else{const b=r(1,9),first=pick([1,2]),pair=first===1?[-b,b]:[b,-b];
  t=T(`Which number satisfies the equation x ${b<0?'−':'+'} ${Math.abs(b)} = 0: ${minus(pair[0])} or ${minus(pair[1])}?`,[num(-b,1,'int')],`${minus(-b)} satisfies the equation`,`${minus(-b)} ${b<0?'−':'+'} ${Math.abs(b)} = 0, so ${minus(-b)} satisfies it.`,{b,first});}
 break;}
case 'a1-add-eq':{
 if(v==='frac'){const b=int(2,6),tt=int(2,5),d=b*tt,a=int(1,b-1),cc=int(1,d-1),e=int(2,6),g=int(1,e-1),f=pick([1,2]),F1=[g*b+a,b],F2=[e*d+cc,d],z=f===1?[F2[0]*b+F1[0]*d,b*d]:[F2[0]*b-F1[0]*d,b*d];
  t=T(`Solve: x ${f===1?'−':'+'} ${mixT(...F1)} = ${mixT(...F2)}. Give an exact answer as a mixed number, fraction or integer.`,[num(...z,'any')],mixT(...z),`${f===1?'Add':'Subtract'} ${mixT(...F1)} ${f===1?'to':'from'} both sides: x = ${mixT(...z)}.`,{a,b,c:cc,d,e,g,f},{math:math(`<mrow><mi>x</mi>${mo(f===1?'−':'+')}${mixML(...F1)}${mo('=')}${mixML(...F2)}</mrow>`)});}
 else{const a=int(10,30),b=int(1,7),s1=pick([1,-1]),z=s1<0?a+b:a-b;
  t=T(`Solve: ${a} = m ${s1<0?'−':'+'} ${b}`,[num(z,1,'int')],`m = ${z}`,`${s1<0?'Add':'Subtract'} ${b} ${s1<0?'to':'from'} both sides: m = ${z}.`,{a,b,s:s1});
  const rr=int(1,2)*pick([1,-1]);t.choices=opts(t,[{value:String(s1<0?a-b:a+b),mistake:`${s1<0?'Subtracted':'Added'} ${b} instead of ${s1<0?'adding':'subtracting'} it`},{value:String(a*b),mistake:'Multiplied the numbers'},{value:String(z+rr),mistake:'Arithmetic slip'}],h);}
 break;}
case 'a1-mul-eq':{
 if(v==='div'){const i=int(3,9),b=int(4,10),[r0]=letters(int,1);t=T(`Solve: ${r0}/${i} = ${b}`,[num(i*b,1,'int')],`${r0} = ${i*b}`,`Multiply both sides by ${i}: ${r0} = ${i*b}.`,{i,b},{math:math(`<mrow>${mfrac(`<mi>${r0}</mi>`,i)}${mo('=')}${mn(b)}</mrow>`)});}
 else{const b=int(3,9),cc=v==='mul-mc'?int(4,9):int(2,9),a=b*cc;t=T(`Solve: ${a} = ${b}y`,[num(cc,1,'int')],`y = ${cc}`,`Divide both sides by ${b}: y = ${cc}.`,{a,b,c:cc});
  if(v==='mul-mc'){const r0=pick([1,2]),j=pick([-1,1]),d2=r0===1?cc+j:a-b;t.choices=opts(t,[{value:String(a+b),mistake:`Added ${b} instead of dividing`},{value:String(d2),mistake:r0===1?'Division slip':`Subtracted ${b} instead of dividing`},{value:r0===1?`1/${cc}`:`1/${d2}`,mistake:'Divided the wrong way'}],h);}}
 break;}
case 'a1-two-step':{let a,b,cc;do{a=int(2,5);b=int(1,7)*pick([1,-1]);cc=int(1,7);}while(gcd(a,Math.abs(b))!==1||a*cc<b);const d=a*cc+b;
 if(v==='mc'){const a0=int(3,10),b0=2*int(1,5),c0=int(1,9),d0=a0*b0+c0,n0=pick([1,2]),rr=int(1,3)*pick([1,-1]);
  t=T(`Solve: ${b0}x + ${c0} = ${d0}`,[num(a0,1,'int')],`x = ${a0}`,`Subtract ${c0}: ${b0}x = ${d0-c0}; divide by ${b0}: x = ${a0}.`,{a:a0,b:b0,c:c0});
  t.choices=opts(t,[{value:String(a0+rr===0?a0-rr:a0+rr),mistake:'Arithmetic slip'},{value:String(Math.abs(a0*b0+2*c0)),mistake:`Added ${c0} instead of subtracting it`},{value:String(n0===1?a0*b0:a0+b0-c0),mistake:`Did not divide by ${b0}`}],h);}
 else t=T(`Solve: ${a}x ${b<0?'−':'+'} ${Math.abs(b)} = ${d}`,[num(cc,1,'int')],`x = ${cc}`,`${b<0?'Add':'Subtract'} ${Math.abs(b)}: ${a}x = ${a*cc}; divide by ${a}: x = ${cc}.`,{a,b,c:cc});
 break;}
case 'a1-frac-eq':{
 if(v==='twelfths'){const r11=()=>int(1,11)*pick([1,-1]);let a,b,cc;do{a=r11();b=r11();cc=r11();}while(b===a||cc===a||cc===b);const F=x=>fracT(x,12),z=red(cc-b,a);
  t=T(`Solve: ${F(a)}x ${b<0?'−':'+'} ${fracT(Math.abs(b),12)} = ${F(cc)}. Give an exact answer as a fraction or integer.`,[num(...z,'any')],fracT(...z),`Multiply both sides by 12: ${a}x ${b<0?'−':'+'} ${Math.abs(b)} = ${cc}, so x = ${cc-b}/${a} = ${fracT(...z)}.`,{a,b,c:cc});}
 else{const R=zip([2,3,2,4,2,5,2,2,2,3,3,3,4,4,4,6,6,6],[3,2,4,2,5,2,3,4,6,2,4,6,2,3,6,2,3,4],[6,6,8,8,10,10,12,12,12,12,12,12,12,12,12,12,12,12]),[a0,b0,f0]=pick(R),cop=m=>{let x;do{x=int(1,m-1);}while(gcd(x,m)!==1);return x;};
  const rr=cop(a0),ss=cop(b0),tt=cop(f0),sa=pick([1,-1]),sb=pick([1,-1]),sf=pick([1,-1]),cc=int(1,3),d=int(1,3),e=int(1,3),F1=[sa*(a0*cc+rr),a0],F2=[b0*d+ss,b0],F3=[sf*(f0*e+tt),f0],op=sb<0?'−':'+';
  if(v==='mixed'){const z=div(sub(F3,F1),[sb*F2[0],F2[1]]);
   t=T(`Solve: ${mixT(...F1)} ${op} ${mixT(...F2)}x = ${mixT(...F3)}. Give an exact answer as a mixed number, fraction or integer.`,[num(...z,'any')],mixT(...z),`Subtract ${mixT(...F1)} from both sides, then divide by ${sb<0?'−':''}${mixT(...F2)}: x = ${mixT(...z)}.`,{F1,F2,F3,sb});}
  else{const gg=pick([a0,b0]),z=div(sub(F3,[sb*F2[0],F2[1]]),add2(F1,[1,gg]));
   t=T(`Solve: ${mixT(...F1)}x ${op} ${mixT(...F2)} + (1/${gg})x = ${mixT(...F3)}. Give an exact answer as a mixed number, fraction or integer.`,[num(...z,'any')],mixT(...z),`Collect the x terms: (${mixT(...F1)} + 1/${gg})x = ${mixT(...F3)} ${sb<0?'+':'−'} ${mixT(...F2)}, so x = ${mixT(...z)}.`,{F1,F2,F3,sb,g:gg});}}
 break;}
case 'a1-collect':{const r=(lo,hi)=>int(lo,hi)*pick([1,-1]);let a,b,cc,d,e,f,g,hh,N,D;do{a=r(1,6);b=r(1,5);cc=r(1,6);d=r(1,5);e=r(1,5);f=r(1,4);g=r(1,4);hh=r(1,5);N=e+hh-b-d;D=a+cc-f-g;}while(D===0||(v==='mc'&&(N===0||Math.abs(N)===Math.abs(D))));
 const z=red(N,D),Lft=polyX([[a,[['x',1]]],[b,[]],[cc,[['x',1]]],[d,[]]]),Rgt=polyX([[e,[]],[f,[['x',1]]],[g,[['x',1]]],[hh,[]]]);
 t=T(`Solve: ${Lft} = ${Rgt}. Give an exact answer as a mixed number, fraction or integer.`,[num(...z,'any')],mixT(...z),`Collect like terms: ${D}x ${N>=0?'':''}= ${N}, so x = ${mixT(...z)}.`.replace(`${D}x`,`${minus(D)}x`).replace(`= ${N},`,`= ${minus(N)},`),{a,b,c:cc,d,e,f,g,h:hh});
 if(v==='mc')t.choices=opts(t,[{value:mixT(-N,D),mistake:'Used the wrong sign when moving the numbers'},{value:mixT(D,N),mistake:'Divided the wrong way'},{value:mixT(-D,N),mistake:'Divided the wrong way and used the wrong sign'}],h);break;}
case 'a1-dist-exp':{const [i0,j0]=letters(int,2);
 if(v==='mc'){const a=int(2,3),b=int(-9,-2),cc=int(2,9),hp=pick([1,2]),e=-b,g=hp===1?b:e,j=hp===1?e:b,ans=[[cc,[['x',1],['y',a+2]]],[b,[['x',1],['y',a]]]];
  t=T(`Expand by using the distributive property: ${monoX(1,[['x',1],['y',a]])}(${cc}y² ${b<0?'−':'+'} ${Math.abs(b)})`,[polyPart([[cc,{x:1,y:a+2}],[b,{x:1,y:a}]])],polyX(ans),`Multiply each term by ${monoX(1,[['x',1],['y',a]])}, adding exponents of y: ${polyX(ans)}.`,{a,b,c:cc});
  t.choices=opts(t,[{value:polyX([[cc,[['x',1],['y',a]]],[j,[['x',1],['y',a]]]]),mistake:'Did not add the exponents of y'},{value:polyX([[cc,[['x',1],['y',a+2]]],[b,[]]]),mistake:'Multiplied only the first term'},{value:polyX([[cc,[['x',1],['y',2]]],[g,[['x',1],['y',a]]]]),mistake:'Kept the exponent of y from inside the parentheses'}],h);}
 else{let a,b;do{a=int(2,5);b=int(2,5);}while(gcd(a,b)!==1);b*=pick([1,-1]);const e=int(1,3),ans=[[a,[[i0,e+1],[j0,3]]],[b,[[i0,e+2],[j0,2]]]];
  t=T(`Expand by using the distributive property: ${monoX(1,[[i0,e],[j0,1]])}(${a}${i0}${j0}² ${b<0?'−':'+'} ${Math.abs(b)}${i0}²${j0})`,[polyPart([[a,{[i0]:e+1,[j0]:3}],[b,{[i0]:e+2,[j0]:2}]])],polyX(ans),`Multiply each term, adding exponents of like letters: ${polyX(ans)}.`,{a,b,e,L:[i0,j0]});}
 break;}
case 'a1-dec-eq':{
 if(v==='one'){let b,d;do{b=int(21,59);}while(b%10===0);do{d=int(2,19)*pick([1,-1]);}while(d%10===0);const sc=pick([1,10,100]),an=int(2,9),A=[an,sc],t3=add2(mul2(A,[b,10]),[d,10]);
  t=T(`Solve: ${decT(b,10)}x ${d<0?'−':'+'} ${decT(Math.abs(d),10)} = ${decT(...t3)}`,[num(...A,'dec')],`x = ${decT(...A)}`,`${d<0?'Add':'Subtract'} ${decT(Math.abs(d),10)}: ${decT(b,10)}x = ${decT(...mul2(A,[b,10]))}; divide by ${decT(b,10)}: x = ${decT(...A)}.`,{b,d,A});}
 else{let a,cc;do{a=int(1,6);cc=int(1,6);}while(a===cc||a+cc===10);const b=int(2,7),sc=pick([1,10,100]),dn=int(2,7),D=[dn,sc],[f0]=letters(int,1),rhs=add2(mul2([a+cc,10],D),[-b,100]);
  t=T(`Solve: ${decT(a,10)}${f0} − ${decT(b,100)} + ${decT(cc,10)}${f0} = ${decT(...rhs)}`,[num(...D,'dec')],`${f0} = ${decT(...D)}`,`Collect: ${decT(a+cc,10)}${f0} − ${decT(b,100)} = ${decT(...rhs)}; add ${decT(b,100)} and divide by ${decT(a+cc,10)}: ${f0} = ${decT(...D)}.`,{a,b,c:cc,D});
  if(v==='mc'){const d2=(a*dn/sc/10+cc*dn/sc/10-2*b/100)/((a+cc)/10),g3=x=>minus(Number(x.toPrecision(3)));t.choices=opts(t,[{value:decT(-dn,sc),mistake:'Used the wrong sign'},{value:g3(d2),mistake:`Subtracted ${decT(b,100)} again instead of adding it`},{value:g3(-d2),mistake:'Subtracted again and used the wrong sign'},{value:decT(dn*10,sc),mistake:'Misplaced the decimal point'},{value:decT(dn,sc*10),mistake:'Misplaced the decimal point the other way'}],h);}}
 break;}
case 'a1-frac-of':{const R=zip([72,99,72,76,88,92,96,98,72,76,84,88,92,85,76,78,81,84,88,92,96,99,72,78,96,98,72,76,84,92,96,72,75,81,99,72,76,78,84,88,92],[27,27,28,28,28,28,28,28,32,32,32,32,32,34,36,36,36,36,36,36,36,36,42,42,42,42,44,44,44,44,44,45,45,45,45,48,48,48,48,48,48]),[b,a]=pick(R),z=red(a,b);
 t=T(`What fraction of ${b} is ${a}? Write the fraction in lowest terms.`,[num(...z,'frac')],fracT(...z),`${a}/${b} = ${fracT(...z)}.`,{a,b});break;}
case 'a1-frac-what':{const P8=[3,5,7,11,13,17,19,23],a=pick(P8),b=int(2,a-1);
 if(v==='frac'){let cc;do{cc=pick(P8);}while(cc===a);const e=int(2,cc-1),z=red(b*cc,a*e);
  t=T(`${mixT(a,b)} of what number is ${mixT(cc,e)}? Give an exact answer as a mixed number, fraction or integer.`,[num(...z,'any')],mixT(...z),`Divide: ${mixT(cc,e)} ÷ ${mixT(a,b)} = ${fracT(cc,e)} × ${fracT(b,a)} = ${mixT(...z)}.`,{a,b,c:cc,e});}
 else{const cc=int(11,19),z=red(b*cc,a);
  t=T(`${mixT(a,b)} of what number is ${cc}? Give an exact answer as a mixed number, fraction or integer.`,[num(...z,'any')],mixT(...z),`Divide: ${cc} ÷ ${mixT(a,b)} = ${cc} × ${fracT(b,a)} = ${mixT(...z)}.`,{a,b,c:cc});
  t.choices=opts(t,[{value:mixT(b*a,cc),mistake:'Divided the fraction by the number'},{value:mixT(a,b*cc),mistake:'Divided the fraction by the number the wrong way'},{value:mixT(cc,b*a),mistake:'Divided by the numerator and the denominator'},{value:mixT(a*cc,b),mistake:'Multiplied instead of dividing'}],h);}
 break;}
case 'a1-funcnot':{const r=(lo,hi)=>int(lo,hi)*pick([1,-1]),F=pick(['f','g','h']);
 if(v==='lin'||v==='lin2'){let cc,d,b;do{cc=r(1,5);d=r(1,5);}while(cc===d);b=r(1,6);if(b===1)b+=int(1,4)*pick([1,-1]);const z=b*cc+d,rule=v==='lin'?polyX([[cc,[['x',1]]],[d,[]]]):polyX([[d,[]],[cc,[['x',1]]]]);
  t=T(`If ${F}(x) = ${rule}, find ${F}(${minus(b)}).`,[num(z,1,'int')],`${F}(${minus(b)}) = ${minus(z)}`,`${F}(${minus(b)}) = ${v==='lin'?`${minus(cc)}(${minus(b)}) ${d<0?'−':'+'} ${Math.abs(d)}`:`${minus(d)} ${cc<0?'−':'+'} ${Math.abs(cc)}(${minus(b)})`} = ${minus(z)}.`,{b,c:cc,d,F});}
 else if(v==='cubic'){const a=int(-5,-1),z=a**3+a**2+a;t=T(`If f(x) = ${polyX([[a,[['x',2]]],[a,[['x',1]]],[a,[]]])}, find f(${minus(a)}).`,[num(z,1,'int')],minus(z),`f(${minus(a)}) = ${minus(a)}(${minus(a)})² + ${par(a)}(${minus(a)}) + ${par(a)} = ${minus(z)}.`,{a});}
 else if(v==='quad'){const a=r(1,4),cc=r(1,30),d=r(2,5),z=a*d*d+cc;t=T(`If f(x) = ${polyX([[a,[['x',2]]],[cc,[]]])}, find f(${minus(d)}).`,[num(z,1,'int')],minus(z),`f(${minus(d)}) = ${minus(a)}(${minus(d)})² ${cc<0?'−':'+'} ${Math.abs(cc)} = ${minus(z)}.`,{a,c:cc,d});}
 else if(v==='neg'){let a,cc;do{a=r(1,6);cc=r(1,5);if(cc===1)cc=6;}while(a+cc===0);const s1=pick([1,-1]),z=-cc*(a+s1*cc);
  t=T(`If ${F}(x) = −x(${minus(a)} ${s1<0?'−':'+'} x), find ${F}(${minus(cc)}).`,[num(z,1,'int')],minus(z),`${F}(${minus(cc)}) = −(${minus(cc)})(${minus(a)} ${s1<0?'−':'+'} (${minus(cc)})) = ${minus(z)}.`,{a,c:cc,s:s1,F});}
 else if(v==='root'){const a=int(2,12),[Y]=letters(int,1,'xoil');t=T(`If ${Y}(x) = −√x, find ${Y}(${a*a}).`,[num(-a,1,'int')],`${Y}(${a*a}) = −${a}`,`√${a*a} = ${a}, so ${Y}(${a*a}) = −${a}.`,{a});}
 else if(v==='recip'){let a,b;do{a=int(3,9);b=int(2,a-1);}while(gcd(a,b)!==1);const k=pick([1,2]),x=k===1?[-a,b]:[-b,a],z=k===1?[b,a]:[a,b];
  t=T(`If f(x) = −1/x, find f(${fracT(...x)}).`,[num(...z,'frac')],fracT(...z),`f(${fracT(...x)}) = −1 ÷ (${fracT(...x)}) = ${fracT(...z)}.`,{a,b,k},{math:math(`<mrow><mi>f</mi>${mo('(')}<mi>x</mi>${mo(')')}${mo('=')}${mo('−')}${mfrac('<mn>1</mn>','<mi>x</mi>')}</mrow>`)});}
 else{let a,cc,b,z,d1,d2,d3;do{a=r(1,6);cc=r(1,4);b=r(1,6);z=cc*cc+a*cc+b;d1=-z;d2=cc*cc-a*cc+b;d3=-cc*cc-a*cc+b;}while(a+cc===0||new Set([z,d1,d2,d3]).size<4);const P0=pick(['P','Q','R']);
  t=T(`If ${P0}(x) = ${polyX([[1,[['x',2]]],[a,[['x',1]]],[b,[]]])}, find ${P0}(${minus(cc)}).`,[num(z,1,'int')],minus(z),`${P0}(${minus(cc)}) = (${minus(cc)})² ${a<0?'−':'+'} ${Math.abs(a)}(${minus(cc)}) ${b<0?'−':'+'} ${Math.abs(b)} = ${minus(z)}.`,{a,b,c:cc});
  t.choices=opts(t,[{value:minus(d1),mistake:'Gave the opposite of the value'},{value:minus(d2),mistake:'Used the wrong sign for the middle term'},{value:minus(d3),mistake:'Squared the negative number incorrectly and used the wrong sign'}],h);}
 break;}
case 'a1-dist-negexp':{const [I,J]=letters(int,2);let a,b;do{a=int(2,5);b=int(2,5);}while(gcd(a,b)!==1);b*=pick([1,-1]);const cc=int(2,9)*pick([1,-1]);
 if(v==='zero'){const k=pick([1,2]),e=k===1?-2:0,kk=k===1?0:-2,coef=k===1?cc:1,front=k===1?`${monoX(cc,[[I,e]])}(${J})⁰`:`(${cc}${I})⁰${monoX(1,[[J,kk]])}`;
  const ans=k===1?[[a*cc,[[I,-1],[J,2]]],[b*cc,[[J,1]]]]:[[a,[[I,1]]],[b,[[I,2],[J,-1]]]],parts=k===1?[[a*cc,{[I]:-1,[J]:2}],[b*cc,{[J]:1}]]:[[a,{[I]:1}],[b,{[I]:2,[J]:-1}]];
  t=T(`Expand by using the distributive property: (${a}${I}${J}² ${b<0?'−':'+'} ${Math.abs(b)}${I}²${J})${front}`,[polyPart(parts)],polyX(ans),`A power with exponent 0 equals 1. Multiply each term and add exponents: ${polyX(ans)}.`,{a,b,c:cc,k,L:[I,J]});}
 else{const e=int(2,5),m=int(-e+1,-1),k=int(-2,-1),ans=[[a*cc,[[I,e+m],[J,5]]],[b*cc,[[I,e+2],[J,3+k]]]];
  t=T(`Expand by using the distributive property: ${monoX(cc,[[I,e],[J,3]])}(${monoX(a,[[I,m],[J,2]])} ${b<0?'−':'+'} ${monoX(Math.abs(b),[[I,2],[J,k]])})`,[polyPart([[a*cc,{[I]:e+m,[J]:5}],[b*cc,{[I]:e+2,[J]:3+k}]])],polyX(ans),`Multiply each term, adding exponents (including the negative ones): ${polyX(ans)}.`,{a,b,c:cc,e,m,k,L:[I,J]});}
 break;}
case 'a1-neg-exp-mc':{let a,b,cc,d,rr;do{a=int(-6,-1);b=int(-5,-1);cc=int(2,5);d=a+b+cc;rr=pick([-1,1]);}while(d===0||Math.abs(d)+rr===0||Math.abs(a*b*cc)===Math.abs(d));const f=Math.abs(d),sh=e=>`a${S.sup(e)}`;
 const key=d<0?`1/a${S.sup(f)}`:`a${S.sup(f)}`;
 t=T(`Multiply: ${sh(a)}(${sh(cc)})(${sh(b)})`,[polyPart([[1,{a:d}]])],key,`Add the exponents: ${a} + ${cc} + (${b}) = ${d}, so the product is ${key}.`,{a,b,c:cc});
 t.choices=opts(t,[{value:d<0?`a${S.sup(f)}`:`1/a${S.sup(f)}`,mistake:'Used the wrong sign for the exponent'},{value:`a${S.sup(Math.abs(a*b*cc))}`,mistake:'Multiplied the exponents'},{value:`1/a${S.sup(f+rr)}`,mistake:'Added the exponents incorrectly'}],h);break;}
case 'a1-zero-exp':{
 if(v==='three'){const B=pick([2,3,4,5,2])*pick([1,-1]),e=Math.abs(B)<5?2:3,bs=B<0?`(${minus(B)})`:String(B),za=B**e,zb=red(1,B**e);
  t=T(`Simplify each: (a) 1/${bs}${S.sup(-e)} (b) ${bs}${S.sup(-e)} (c) ${bs}⁰. Answer all three parts, separated by semicolons.`,[num(za,1,'int'),num(...zb,'frac'),num(1,1,'int')],`(a) ${minus(za)}; (b) ${fracT(...zb)}; (c) 1`,`A negative exponent means the reciprocal: (a) ${minus(za)}, (b) ${fracT(...zb)}; any nonzero number to the power 0 is 1.`,{B,e});}
 else if(v==='mix'){const a=int(2,5),bS=pick([1,-1]),cS=pick([1,-1]),dS=pick([1,-1]),items=[[`−${a}²`,-a*a,true],[`(−${a})²`,a*a],[`${a}⁰`,1],[`|−${a} ${dS<0?'−':'+'} ${a}|`,Math.abs(-a+dS*a)]],ord=[0,1,2,3].map(()=>int(0,999)),o=[0,1,2,3].sort((p,q)=>ord[p]-ord[q]).map(k=>items[k]);
  const show=o.map((x,i)=>x[2]&&i>0?`(${x[0]})`:x[0]),z=o[0][1]+bS*o[1][1]+cS*o[2][1]+o[3][1];
  t=T(`Simplify: ${show[0]} ${bS<0?'−':'+'} ${show[1]} ${cS<0?'−':'+'} ${show[2]} + ${show[3]}`,[num(z,1,'int')],minus(z),`−${a}² = ${-a*a}, (−${a})² = ${a*a}, ${a}⁰ = 1 and |−${a} ${dS<0?'−':'+'} ${a}| = ${Math.abs(-a+dS*a)}. Combine: ${minus(z)}.`,{a,dS,vals:o.map(x=>x[1]),signs:[bS,cS]});}
 else if(v==='eval'){const [A,B]=letters(int,2,'foil');let av=int(1,4)*pick([1,-1]),bv=int(1,4)*pick([1,-1]);if(av>0&&bv>0)av=-av;const e=int(2,3),f=int(2,3),k=pick([1,2]),z=k===1?av*(bv-1)*(-e*bv-f*av):av*(1-av)*(-e*bv-f*av);
  t=T(`Evaluate ${A}(${k===1?`${B} − ${A}⁰`:`${B}⁰ − ${A}`})(−${e}${B} − ${f}${A}) if ${A} = ${minus(av)} and ${B} = ${minus(bv)}.`,[num(z,1,'int')],minus(z),`${k===1?`${A}⁰`:`${B}⁰`} = 1. Substitute: ${minus(z)}.`,{av,bv,e,f,k});}
 else{let a,b,x,y;do{a=int(2,7);b=int(3,7);x=int(2,Math.floor(Math.log(100)/Math.log(a)));y=int(2,Math.floor(Math.log(100)/Math.log(b)));}while(a===b||a**x===b**y);const k=pick([1,2]),z=k===1?[1,b**y]:[1,a**x];
  t=T(`Evaluate when x = ${a} and y = ${b}: ${k===1?`x⁰y${S.sup(-y)}`:`x${S.sup(-x)}y⁰`}`,[num(...z,'frac')],fracT(...z),`The factor with exponent 0 is 1; ${k===1?`${b}${S.sup(-y)} = 1/${b**y}`:`${a}${S.sup(-x)} = 1/${a**x}`}.`,{a,b,x,y,k});
  t.choices=opts(t,[{value:k===1?`1/${a**x}`:`1/${b**y}`,mistake:'Evaluated the wrong factor'},{value:String(k===1?-a*x:-b*y).replace('-','−'),mistake:'Multiplied the base by the negative exponent'},{value:'0',mistake:'Thought a zero exponent gives 0'}],h);}
 break;}
case 'a1-phrases':{const N=['N'],sm=fn=>S.fsamples(N,env=>fn(env.N));
 if(v==='mc'){let a=int(1,9)*pick([1,-1]),b=int(2,9)*pick([1,-1]),e=int(2,6);if(a===e)a+=2;const k=pick([1,2]);
  if(k===1){const w=S.words(e),key=`${e}(−N) ${a<0?'−':'+'} ${Math.abs(a)}`;t=T(`Which algebraic phrase corresponds to the word phrase: the sum of ${w} times the opposite of a number and ${minus(a)}? Use N for the number.`,[{t:'expr',vars:N,samples:sm(n=>e*-n+a)}],key,`${w} times the opposite of N is ${e}(−N); add ${minus(a)}: ${key}.`,{a,e,k});
   t.choices=opts(t,[{value:`N − ${e} ${a<0?'−':'+'} ${Math.abs(a)}`,mistake:'Subtracted instead of multiplying by the opposite'},{value:`${'(−N)'.repeat(Math.min(e,4))} ${a<0?'−':'+'} ${Math.abs(a)}`,mistake:'Wrote a power instead of a product with the number'},{value:`${minus(a)}(−N) + ${e}`,mistake:'Switched the two numbers'}],h);}
  else{const key=`${minus(b)}(${e}N ${a<0?'−':'+'} ${Math.abs(a)})`;t=T(`Which algebraic phrase corresponds to the word phrase: the product of ${minus(b)} and the sum of ${e} times a number and ${minus(a)}? Use N for the number.`,[{t:'expr',vars:N,samples:sm(n=>b*(e*n+a))}],key,`The sum is ${e}N ${a<0?'−':'+'} ${Math.abs(a)}; multiply it by ${minus(b)}: ${key}.`,{a,b,e,k});
   t.choices=opts(t,[{value:`${minus(b)} + ${e}N ${a<0?'−':'+'} ${Math.abs(a)}`,mistake:'Added instead of multiplying'},{value:`${minus(b)}(${e}N) ${a<0?'−':'+'} ${Math.abs(a)}`,mistake:'Multiplied only the first part of the sum'},{value:`${'N'.repeat(Math.min(e,4))} ${a<0?'−':'+'} ${Math.abs(a)}`,mistake:'Wrote repeated factors instead of a product with the number'}],h);}}
 else{const a=int(1,9)*pick([1,-1]),b=int(2,9)*pick([1,-1]),cc=int(2,9),d=int(1,9)*pick([1,-1]),e=int(2,9),w=S.words(e),k1=`${e}(−N) ${a<0?'−':'+'} ${Math.abs(a)}`,k2=`${minus(b)}(${cc}N ${d<0?'−':'+'} ${Math.abs(d)})`;
  t=T(`Write the algebraic phrases, using N for the number. (a) The sum of ${w} times the opposite of a number and ${minus(a)}. (b) The product of ${minus(b)} and the sum of ${cc} times a number and ${minus(d)}. Answer both parts, separated by a semicolon.`,[{t:'expr',vars:N,samples:sm(n=>e*-n+a)},{t:'expr',vars:N,samples:sm(n=>b*(cc*n+d))}],`(a) ${k1}; (b) ${k2}`,`(a) ${k1} (b) ${k2}`,{a,b,c:cc,d,e});}
 break;}
case 'a1-dec-of':{
 if(v==='what'){let a,b;do{a=int(2,6);b=int(10,50);}while(6*b===10*a);const cc=6*b,z=10*cc/a;
  t=T(`${(a/10).toFixed(2)} of what number is ${cc}?`,[num(z,1,'dec')],S.comma(z),`Divide: ${cc} ÷ ${(a/10).toFixed(2)} = ${S.comma(z)}.`,{a,b});}
 else if(v==='times'){const a=int(101,199),b=int(1,999),z=[a*b,100000];t=T(`${decT(a,100)} of ${decT(b,1000)} is what number?`,[num(...z,'dec')],decT(...z),`Multiply: ${decT(a,100)} × ${decT(b,1000)} = ${decT(...z)}.`,{a,b});}
 else{const a=int(1,20),b=int(2,9),q0=b*a,z=a*10;t=T(`${decT(b,10)} of what number is ${q0}?`,[num(z,1,'dec')],String(z),`Divide: ${q0} ÷ ${decT(b,10)} = ${z}.`,{a,b});
  t.choices=opts(t,[{value:decT(q0*b,10),mistake:'Multiplied instead of dividing'},{value:S.comma(q0*b*10),mistake:'Multiplied by the whole number instead of the decimal'},{value:decT(z,100),mistake:'Placed the decimal point incorrectly'}],h);}
 break;}
case 'a1-paren-eq':{const [X]=letters(int,1),sg=x=>x<0?'−':'+';let str,z,p;
 const fin=(s0,z0,p0)=>{str=s0;z=z0;p=p0;};
 if(v==='354'){const R=zip([2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5],[2,2,2,2,3,3,3,4,4,5,2,2,2,2,2,2,2,3,3,3,4,4,4,5,5,2,2,2,2,2,2,2,2,3,3,3,3,3,4,4,4,5,5,5,2,2,2,2],[2,2,2,3,2,2,3,2,3,2,2,2,2,2,3,3,4,2,2,3,2,2,3,2,2,2,2,2,2,3,3,3,4,2,2,2,3,3,2,2,3,2,2,3,2,2,2,3],[3,4,5,5,3,5,5,4,5,4,2,3,4,5,3,5,5,3,4,5,3,4,5,4,5,2,2,3,5,3,4,5,4,2,3,4,4,5,3,4,4,3,4,5,2,3,5,2],[3,4,4,2,3,2,3,4,2,4,2,2,3,3,2,2,2,4,5,3,3,5,3,4,3,2,4,5,4,2,3,3,2,2,4,5,2,5,3,3,2,3,5,3,4,4,5,3],[4,4,2,2,5,3,5,4,4,4,2,3,4,2,4,5,4,5,4,3,4,4,4,2,5,2,4,4,2,2,2,5,4,2,3,2,2,5,2,5,4,3,2,3,2,3,2,4]),[a,b,cc,d,e,f]=pick(R);
  fin(`${a}${X} − ${b}(${cc}${X} + ${d}) = ${e}${X} + ${f}`,red(f+b*d,a-b*cc-e),{a,b,c:cc,d,e,f});}
 else if(v==='355'){const R=zip([2,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6],[2,3,4,5,6,3,4,5,6,2,4,5,6,2,3,5,6,2,3,4,6]),[a,d]=pick(R);let b,e,zz,f;do{b=int(2,6);int(2,6);e=int(2,6);zz=int(-6,6);f=(d+1-a)*zz+e+a*b;}while(Math.abs(f)>10||f===0);
  fin(`x − ${a}(x − ${b}) = ${minus(f)} − (${d}x + ${e})`,[zz,1],{a,b,d,e,f});}
 else if(v==='356'){const R=zip([2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,5,5,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5],[2,2,2,2,3,3,2,2,2,3,3,3,2,2,3,3,3,2,3,2,2,2,2,3,3,2,2,2,2,2,3,3,2,2,2,2,3,3,2,2,2,2,3,3,3],[3,3,4,5,3,4,4,4,5,3,4,5,5,5,4,4,5,5,5,2,3,3,4,2,3,2,3,4,5,5,4,5,2,3,3,5,2,5,2,3,4,5,2,2,5],[2,3,3,3,2,3,2,3,3,2,2,3,2,3,2,3,3,2,2,2,2,3,3,2,3,2,2,2,2,3,2,3,3,2,3,2,2,2,3,3,2,2,2,3,2],[2,4,2,3,4,4,2,4,2,3,3,3,2,4,2,4,5,4,4,4,2,4,4,4,3,2,5,4,2,5,3,3,2,3,2,4,2,3,5,5,5,2,3,3,4]),[a,b,cc,d,e,f]=pick(R);
  fin(`${a}(${b} − ${X}) − (−${cc})(${X} − ${d}) = −(${e}${X} − ${f})`,red(cc*d+f-a*b,cc+e-a),{a,b,c:cc,d,e,f});}
 else if(v==='357'){const R=zip([2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5],[2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,3,3,3,3,4,4,4,2,2,2,2,2,2,2,2,2,3,3,3,4,4,5,5],[2,2,2,2,4,4,4,2,2,4,4,4,5,5,5,5,2,3,3,3,5,5,5,2,2,4,4,4,5,5,5,5,5,5,5,4,4,5,5],[2,3,3,4,2,2,3,4,5,3,4,5,2,3,3,4,4,3,4,5,3,4,5,4,5,3,4,5,2,3,3,4,3,4,5,4,5,4,5],[2,2,5,4,2,4,4,2,5,4,3,5,2,2,5,4,3,3,2,4,4,3,5,2,5,4,3,5,2,2,5,4,4,3,5,4,2,2,5]),[a,b,cc,d,e]=pick(R);
  fin(`−(−${a})² − ${b}² = −${cc}(−${d}x − ${e})`,red(-cc*e-a*a-b*b,cc*d),{a,b,c:cc,d,e});}
 else if(v==='358'){const R=zip([1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5],[2,2,2,3,3,3,4,4,4,5,5,5,3,3,3,4,4,4,5,5,5,2,2,2,4,4,4,5,5,5,2,2,2,3,3,3,5,5,5,2,2,2,3,3,3,4,4,4],[3,4,5,2,4,5,2,3,5,2,3,4,1,4,5,1,3,5,1,3,4,1,4,5,1,2,5,1,2,4,1,3,5,1,2,5,1,2,3,1,3,4,1,2,4,1,2,3]),[a0,b0,c0]=pick(R),a=-a0,b=-b0,cc=-c0,zz=int(1,9)*pick([1,-1]),K=-(zz+a)+b*(zz+cc);
  fin(`−(x − ${a0}) − ${b0}(x − ${c0}) = ${minus(K)}`,[zz,1],{a,b,c:cc,K});}
 else if(v==='359'){const a=int(2,9),b=int(1,9),cc=int(2,8),d=int(2,5);let e=d*cc*10-a*(d*10+b);if(e===0){e=1;}const ee=[d*cc*10-a*(d*10+b),100];
  if(ee[0]===0)return build({...c,recipe:'a1-paren-eq'},h);
  fin(`${decT(b,10)}x ${ee[0]<0?'−':'+'} ${decT(Math.abs(ee[0]),100)} = ${d}(−x + ${decT(cc,10)})`,[a,10],{a,b,c:cc,d});}
 else if(v==='360'){const R=zip([0,0,-1,0,0,0,0,-1,-1,-1,0,-1,0,-1,-1,0,0,-1,-1,-1,0,0,-2,-1,-1,-1,-1,-2,-1,0,0,0,0,-1,-1,-1,-2,-1,-2,-1,-1,-2,-2,-2],[3,4,3,3,4,3,4,3,4,3,3,4,4,3,4,2,4,2,4,2,2,4,2,2,2,4,4,2,4,2,3,2,3,3,2,3,2,3,2,2,3,2,2,3],[3,3,2,2,2,3,3,2,2,3,3,3,3,2,3,2,2,2,2,3,3,3,2,2,3,3,2,3,3,2,2,3,3,2,3,3,2,2,3,3,3,2,3,3],[1,1,2,2,2,2,2,3,3,3,3,3,3,4,4,1,1,2,2,2,2,2,3,3,3,3,4,4,4,1,1,1,1,2,2,2,3,3,3,3,3,4,4,4],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]),[zz,d,cc,b,a]=pick(R),e=a*zz-a*b+cc-d*zz;
  fin(`−[−${a}(x − ${b}) − |−${cc}|] = ${d}x ${sg(e)} ${Math.abs(e)}`,[zz,1],{a,b,c:cc,d,e});}
 else if(v==='361'){let a,b,d,e,zz,cc;do{a=int(1,5);b=int(2,9);d=int(2,9);e=int(2,9);zz=int(1,3)*pick([1,-1]);cc=-d*(zz+1)+a**3*(-zz-b);}while(Math.abs(cc)>20||cc===0);
  fin(`(−${a})³(−x − ${b}) ${sg(cc)} |−${Math.abs(cc)}| = −${d}(x + ${e}⁰)`,[zz,1],{a,b,c:cc,d,e});}
 else if(v==='362'){let a,b,cc,d,e,f,g,zz,hh;do{a=int(2,9);b=int(2,9);cc=int(2,9);d=int(2,9);e=int(2,9);f=int(2,9);g=int(2,9);zz=int(1,3)*pick([1,-1]);hh=-a*zz+b*cc*zz+b*d-e*f*zz+e*g;}while(Math.abs(hh)>20||-a+b*cc-e*f===0);
  fin(`−[−(−${a}x)] + ${b}(${cc}x + ${d}) = ${e}(${f}x − ${g}) ${sg(hh)} ${Math.abs(hh)}`,[zz,1],{a,b,c:cc,d,e,f,g,h:hh});}
 else if(v==='363'){const a=int(2,5);let b,cc,d,f,g,zz,e;do{b=int(1,5);cc=int(2,5);d=int(1,5);f=int(2,5);g=int(2,5);zz=int(1,5)*pick([1,-1]);e=-a*((zz-b)*(-cc)-d*d)-f-g*zz;}while(e<1||e>20||a*cc===g);
  fin(`−${a}[(${X} − ${b})(−${cc}) − ${d}²] − [−(−${e})] = −(−${f} − ${g}${X})`,[zz,1],{a,b,c:cc,d,e,f,g});}
 else if(v==='364'){const a=int(2,5),b=int(1,5),cc=int(2,5),zz=int(1,5)*pick([1,-1]);let d=b*b-a*zz+zz-cc*zz,i=d;while(Math.trunc(i/a)*a!==i)i-=Math.sign(i);let e=i/a;d=d-e*a;while(d===0||e===0){e+=1;d-=a;}
  fin(`−[−|−${a}|(${minus(-e)} − x) − ${b}²] = −[(${minus(-d)} + x) − ${cc}x]`,[zz,1],{a,b,c:cc,d,e});}
 else if(v==='365'){let a,b,cc,d,e,f,g,hh,zz,i;do{a=int(2,3);b=int(2,3);cc=int(2,3);d=int(2,5);e=int(2,5);f=int(2,5);g=int(2,6);hh=int(1,3);zz=int(-5,5);i=a*b**cc*zz-a*b**cc*d-a*e*e*zz+a*e*f-g*zz-hh*zz;}while(Math.abs(i)>40||Math.abs(i)<2);
  const j=Math.trunc(i/2),i2=i-j;fin(`−${a}[−${b}${S.sup(cc)}(x − ${d}x⁰) − ${e}(−${e}x + ${f})] − (${g}x ${sg(i2)} ${Math.abs(i2)}) = ${hh}x ${sg(j)} ${Math.abs(j)}`,[zz,1],{a,b,c:cc,d,e,f,g,h:hh,i:i2,j});}
 else if(v==='366'){let a,b,cc,d,e,zz,f;do{a=int(2,5);b=int(2,5);cc=int(2,5);d=int(2,5);e=int(2,5);zz=int(-5,5);f=-a*b+a*cc*zz-d*d*zz;}while(Math.abs(f)>40||Math.abs(f)<1||a*cc-d*d===0);
  fin(`|−${a}|(−${b} + ${cc}x) − [−(−${d}²)]x = −${e}x[−2⁰ − (−1³)] ${sg(f)} |−${Math.abs(f)}|`,[zz,1],{a,b,c:cc,d,e,f});}
 else{let a,b,cc,d,e,f,g,H;do{a=int(1,8);b=int(2,20);cc=int(1,8);d=int(1,8);e=int(1,8);f=-int(1,8);g=int(1,8);H=a-b*(cc-d-e);}while(H===0||new Set([g-b*f,g+b*f,-g+b*f,-g-b*f].map(x=>x/H)).size<4);
  const zr=red(g-b*f,H);str=`${a}a = ${b}(${cc}a − [${d}a + (${e}a ${sg(f)} ${Math.abs(f)})]) + ${g}`;z=zr;p={a,b,c:cc,d,e,f,g};
  t=T(`Solve: ${str}. Give an exact answer as a mixed number, fraction or integer.`,[num(...zr,'any')],`a = ${mixT(...zr)}`,`Simplify the grouping symbols from the inside out, then collect the a terms: a = ${mixT(...zr)}.`,p);
  t.choices=opts(t,[{value:mixT(g+b*f,H),mistake:'Used the wrong sign for the number in the parentheses'},{value:mixT(-g+b*f,H),mistake:`Moved ${g} to the wrong side`},{value:mixT(-g-b*f,H),mistake:'Used the wrong signs for both numbers'}],h);break;}
 t=T(`Solve: ${str}${z[1]===1?'':'. Give an exact answer as a mixed number, fraction or integer'}`,[num(...z,'any')],`${str.includes(X+' ')||str.includes(X+')')?X:'x'} = ${mixT(...z)}`,`Simplify each side, starting with the innermost grouping symbols, then solve: ${mixT(...z)}.`,p);
 break;}
// Batch A1-5: Lessons 32-42
case 'a1-word':{const NM=[['Ana','Ben'],['Carla','Dev'],['Elena','Femi'],['Gus','Hana'],['Ivo','Jade'],['Kim','Luis']],[p1,p2]=pick(NM),sg=x=>x<0?'−':'+';
 if(v==='370'){const z=int(-20,40),nn=int(11,23),k=int(2,4),w=['','','twice','three times','four times'][k],e=pick([1,-1]),r=z*k+e*nn;
  t=T(`Find a number such that ${nn} ${e>0?'more':'less'} than ${w} the number is ${minus(r)}.`,[num(z,1,'int')],minus(z),`${k}x ${sg(e)} ${nn} = ${minus(r)}, so ${k}x = ${minus(r-e*nn)} and x = ${minus(z)}.`,{z,n:nn,k,e});}
 else if(v==='371'){const a=int(2,5);let b=int(-6,6);if(b===0)b=7*pick([1,-1]);const z=int(-40,40),r=a*(z+b);
  t=T(`${p1} and ${p2} found that ${a} times the sum of a number and ${minus(b)} equals ${minus(r)}. What is the number?`,[num(z,1,'int')],minus(z),`${a}(x ${sg(b)} ${Math.abs(b)}) = ${minus(r)}, so x ${sg(b)} ${Math.abs(b)} = ${minus(r/a)} and x = ${minus(z)}.`,{a,b,z});}
 else if(v==='372'){const a=int(2,5),b=int(5,15),z=int(-25,25),e=pick([1,-1]),r=z*a+b*e;
  t=T(`${p1} and ${p2} thought of the same number. They multiplied the number by ${a} and then ${e>0?'increased':'decreased'} the product by ${b} for a final result of ${minus(r)}. Of what number were they thinking?`,[num(z,1,'int')],minus(z),`${a}x ${sg(e)} ${b} = ${minus(r)}, so ${a}x = ${minus(a*z)} and x = ${minus(z)}.`,{a,b,z,e});}
 else{const a=int(12,25),b=int(2,5),d=pick([-1,1]),e=int(6,19)*pick([1,-1]),z=int(17,45)*pick([1,-1]),r=b*(z+e)+a*d;
  t=T(`Find a number such that ${a} ${d<0?'less':'more'} than ${b} times the sum of the number and ${minus(e)} is ${minus(r)}.`,[num(z,1,'int')],minus(z),`${b}(x ${sg(e)} ${Math.abs(e)}) ${sg(d)} ${a} = ${minus(r)}, so x ${sg(e)} ${Math.abs(e)} = ${minus((r-a*d)/b)} and x = ${minus(z)}.`,{a,b,d,e,z});
  t.choices=opts(t,[{value:mixT(r-a*d-e,b),mistake:`Subtracted ${minus(e)} before dividing by ${b}`},{value:mixT(r-a*d+e*b,b),mistake:`Added ${minus(e)} instead of subtracting it`},{value:mixT(r+a*d-e*b,b),mistake:`Used the wrong sign for ${a}`}],h);}
 break;}
case 'a1-primes':{const tm='×',fac=(a,b,c,big)=>[...Array(a).fill(2),...Array(b).fill(3),...Array(c).fill(5),big].filter(x=>x).join(` ${tm} `);
 if(v==='mc'){let a,b;do{a=int(1,3);b=int(0,2);}while(a===1&&b===0);const cc=int(1,2),big=pick([7,11]),other=big===7?11:7,g=2**a*3**b*5**cc*big,key=fac(a,b,cc,big);
  t=T(`Determine the prime factorization of ${S.comma(g)}.`,[{t:'primes',n:g}],key,`Divide by primes: ${S.comma(g)} = ${key}.`,{a,b,c:cc,big,g});
  t.choices=opts(t,[{value:fac(a+1,b,cc-1,big),mistake:'Miscounted the factors of 2 and 5'},{value:fac(a,b+1,cc,other),mistake:'Counted an extra 3 and used the wrong larger prime'},{value:[...Array(a-1).fill(2),...Array(b).fill(3),...Array(cc-1).fill(5),10,big].join(` ${tm} `),mistake:'Left 10, which is not prime, as a factor'}],h);}
 else{const [a,b]=pick([[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2]]),cc=int(1,2),big=pick([7,11]),g=2**a*3**b*5**cc*big,key=fac(a,b,cc,big);
  t=T(`Write ${S.comma(g)} as a product of prime numbers.`,[{t:'primes',n:g}],key,`Divide by primes: ${S.comma(g)} = ${key}.`,{a,b,c:cc,big,g});}
 break;}
case 'a1-unequal':{const NM=['Ana','Ben','Carla','Dev','Elena','Femi'],P0=pick(NM),sg=x=>x<0?'−':'+';
 if(v==='379'){const nn=3*int(6,27),d=pick([-1,1]),z=d*nn/3;t=T(`Find the number that is ${nn} ${d<0?'less':'greater'} than twice the opposite of itself.`,[num(z,1,'int')],minus(z),`x = 2(−x) ${sg(d)} ${nn}, so 3x = ${minus(d*nn)} and x = ${minus(z)}.`,{n:nn,d});}
 else if(v==='380'){let a,z,b;do{a=int(13,26)*pick([1,-1]);z=int(23,58)*pick([1,-1]);b=3*z+a;}while(b===0);
  t=T(`${P0} found that the sum of twice a number and ${minus(a)} is ${Math.abs(b)} ${b>0?'greater':'less'} than the opposite of the number. What is the number?`,[num(z,1,'int')],minus(z),`2x ${sg(a)} ${Math.abs(a)} = −x ${sg(b)} ${Math.abs(b)}, so 3x = ${minus(b-a)} and x = ${minus(z)}.`,{a,z,b});}
 else if(v==='382'){const z=int(7,26),a=int(-7,-3),b=int(3,13),r=-(a+2)*z+b;
  t=T(`If the product of a number and ${minus(a)} is reduced by ${b}, the result is ${r} less than twice the opposite of the number. What is the number?`,[num(z,1,'int')],String(z),`${minus(a)}x − ${b} = 2(−x) − ${r}, so ${minus(a+2)}x = ${minus(b-r)} and x = ${z}.`,{z,a,b,r});}
 else{let a,d,z,b,cc;do{a=int(3,7);d=int(2,a-1);z=int(21,44)*pick([1,-1]);b=int(25,51)*pick([1,-1]);cc=z*(a-d)+b;}while(cc===0);
  t=T(`${P0} found that if the product of ${a} and a number is ${b>0?'increased':'decreased'} by ${Math.abs(b)}, the result is ${Math.abs(cc)} ${cc>0?'more':'less'} than the product of ${d} and the number. What is the number?`,[num(z,1,'int')],minus(z),`${a}x ${sg(b)} ${Math.abs(b)} = ${d}x ${sg(cc)} ${Math.abs(cc)}, so ${a-d}x = ${minus(cc-b)} and x = ${minus(z)}.`,{a,d,z,b,c:cc});}
 break;}
case 'a1-gcf':{
 if(v==='mc'){const a=int(2,9),key=`${a}x`;t=T(`Find the greatest common factor of ${2*a}x, ${a}x², and ${3*a}x² + ${a}x.`,[polyPart([[a,{x:1}]])],key,`Every term has the factor ${a} and the factor x: the GCF is ${key}.`,{a});
  t.choices=opts(t,[{value:`${3*a}x + ${a}`,mistake:'Gave an expression instead of a common factor'},{value:String(a),mistake:'Left out the common factor x'},{value:'x',mistake:`Left out the common factor ${a}`}],h);}
 else{const g2=int(2,5),f3=int(1,3),A=2**g2*3**f3,b=int(2,5),cc=int(2,5),e=int(2,5),i2=int(3,6),D=2**i2,G=2**Math.min(g2,i2),mn0=Math.min(b,e),key=monoX(G,[['a',mn0],['b',1]]);
  t=T(`Find the greatest common factor of ${monoX(A,[['a',b],['b',cc]])} and ${monoX(-D,[['a',e],['b',1]])}.`,[polyPart([[G,{a:mn0,b:1}]])],key,`The greatest common factor of ${A} and ${D} is ${G}; the smallest powers are a${S.sup(mn0)} and b: ${key}.`,{A,b,c:cc,D,e});}
 break;}
case 'a1-factor':{const pr=(G,inner)=>{const gk=mkey(Object.fromEntries(G[1]));return {t:'factor',gcf:[gk,G[0]],inner:polyPart(inner.map(([c0,vs])=>[c0,Object.fromEntries(vs)])).terms};},show=(G,inner)=>`${monoX(G[0],G[1])}(${polyX(inner)})`;
 let G,inner,q,p,ds=null;
 if(v==='390'){const [I,J,P0]=letters(int,3);let a,b;do{a=int(2,5);b=int(2,5);}while(gcd(a,b)!==1);b*=pick([1,-1]);const cc=int(2,9)*pick([1,-1]),d=int(2,5),e=int(1,3);
  G=[d,[[I,e],[J,1],[P0,1]]];inner=[[a,[[I,1],[J,2],[P0,1]]],[b,[[I,2],[J,1]]],[cc,[[P0,2]]]];q=[[a*d,[[I,e+1],[J,3],[P0,2]]],[b*d,[[I,e+2],[J,2],[P0,1]]],[cc*d,[[I,e],[J,1],[P0,3]]]];p={a,b,c:cc,d,e,L:[I,J,P0]};}
 else if(v==='391'||v==='mc'){let a,d,e,f;const g=int(2,4),hh=int(2,4),b=int(2,4),cc=int(2,4),L3=v==='mc'?'z':'p';
  let x0=0;if(v==='mc')[a,x0]=pick([[4,2],[6,3],[8,2],[9,3],[6,2],[8,4]]);else a=int(2,9);
  do{d=int(2,9);e=int(2,8)*pick([1,-1]);f=int(2,8)*pick([1,-1]);}while(gcd(d,Math.abs(e))!==1||gcd(d,Math.abs(f))!==1);
  if(v==='mc'){G=[a,[['x',b],['y',cc],['z',1]]];inner=[[d,[['x',1],['y',1],['z',1]]],[e,[['z',2]]],[f,[['x',g],['y',hh]]]];q=[[a*d,[['x',b+1],['y',cc+1],['z',2]]],[a*e,[['x',b],['y',cc],['z',3]]],[a*f,[['x',b+g],['y',cc+hh],['z',1]]]];
   const sub0=a/x0;ds=[{value:show([x0,G[1]],inner.map(([c0,vs])=>[c0*sub0,vs])),mistake:'Factored out only part of the common number'},{value:show([a,[['x',b+1],['y',cc+1],['z',1]]],[[d,[['x',1],['y',1],['z',1]]],[e,[['z',2]]],[f,[['x',g-1],['y',hh-1]]]]),mistake:'Used exponents larger than the smallest ones'},{value:show([1,[['x',b+1],['y',cc+1],['z',1]]],[[a*d,[['x',1],['y',1],['z',1]]],[a*e,[['z',2]]],[a*f,[['x',g-1],['y',hh-1]]]]),mistake:'Did not factor out the common number and used exponents that are too large'}];}
  else{G=[a,[['x',b],['y',cc],[L3,1]]];inner=[[d,[['x',1],['y',1]]],[e,[[L3,1]]],[f,[['x',g],['y',hh]]],[cc,[]]];q=[[a*d,[['x',b+1],['y',cc+1],[L3,1]]],[a*e,[['x',b],['y',cc],[L3,2]]],[a*f,[['x',b+g],['y',cc+hh],[L3,1]]],[a*cc,[['x',b],['y',cc],[L3,1]]]];}
  p={a,b,c:cc,d,e,f,g,h:hh};}
 else{const a=int(2,8),b=int(2,6);let cc;do{cc=int(-7,-2);}while(gcd(b,-cc)!==1);const b1=int(2,3),b2=int(2,6),b3=int(2,6),b4=int(2,6);
  G=[a,[['x',b2],['y',2],['z',2]]];inner=[[b,[['y',b3-2]]],[cc,[['x',b1],['z',b4-2]]]];q=[[a*b,[['x',b2],['y',b3],['z',2]]],[a*cc,[['x',b1+b2],['y',2],['z',b4]]]];p={a,b,c:cc,b1,b2,b3,b4};}
 const key=show(G,inner);t=T(`Factor the greatest common factor of ${polyX(q)}.`,[pr(G,inner)],key,`The greatest common factor is ${monoX(G[0],G[1])}; divide each term by it: ${key}.`,p);
 if(ds)t.choices=opts(t,ds,h);break;}
case 'a1-cancel':{let nu,de,ans,p;
 if(v==='395'){const a=int(2,8),b=int(2,8),[j]=pick([['a'],['b'],['c'],['x'],['y'],['z']]);nu=[[a,[[j,1]]],[-a*b,[[j,2]]]];de=[a,[[j,1]]];ans=[[1,[]],[-b,[[j,1]]]];p={a,b,j};}
 else if(v==='397'){const a=int(2,8)*pick([1,-1]),b=int(3,9),cc=int(3,9),d=int(2,9),e=int(1,cc-2);nu=[[a*b,[['x',cc],['y',d]]],[b*cc,[['x',e+1],['y',2]]]];de=[b,[['x',e],['y',1]]];ans=[[a,[['x',cc-e],['y',d-1]]],[cc,[['x',1],['y',1]]]];p={a,b,c:cc,d,e};}
 else{const a=int(2,6),b=int(2,4),cc=int(3,5),b1=int(1,3),b2=int(3,4),b3=int(1,2),b4=3-b3;
  if(v==='398'){const b5=int(1,3),b6=int(3,4);nu=[[a*b,[['x',b1+b5-1],['y',b2+b6-1],['z',2]]],[a*cc,[['x',b3+b5-1],['y',b4+b6-1],['z',1]]]];de=[a,[['x',b5],['y',b6],['z',1]]];ans=[[b,[['x',b1-1],['y',b2-1],['z',1]]],[cc,[['x',b3-1],['y',b4-1]]]];p={a,b,c:cc,b1,b2,b3,b4,b5,b6};}
  else{nu=[[a*b,[['x',b1],['y',b2]]],[a*cc,[['x',b3],['y',b4]]]];de=[a,[['x',1],['y',1]]];ans=[[b,[['x',b1-1],['y',b2-1]]],[cc,[['x',b3-1],['y',b4-1]]]];p={a,b,c:cc,b1,b2,b3,b4};}}
 const key=polyX(ans),nuML=nu.map(([c0,vs],i)=>(i&&c0>0?'<mo>+</mo>':'')+mlMono(c0,vs)).join('');
 t=T(v==='395'?'Divide:':'Simplify (factor if necessary):',[polyPart(ans.map(([c0,vs])=>[c0,Object.fromEntries(vs)]))],key,`Divide each term of the numerator by ${monoX(de[0],de[1])}: ${key}.`,p,{math:math(mlQ(nuML,mlMono(...de)))});break;}
case 'a1-dist-rat':{// x^a/z^b (c y^d/x^e − f x^g/y^h), all exponents positive
 const a=int(1,3),b=int(1,3),cc=int(1,9),d=int(1,3);let e=int(1,3);if(v==='mc')while(e===a)e=int(1,3);const f=int(1,9),g=int(1,3),hh=int(1,3);
 const front={nu:[1,[['x',a]]],de:[1,[['z',b]]]},inner=[[1,{nu:[cc,[['y',d]]],de:[1,[['x',e]]]}],[-1,{nu:[f,[['x',g]]],de:[1,[['y',hh]]]}]];
 t=expandTask(front,inner,'pos',HOW.pos,{a,b,c:cc,d,e,f,g,h:hh});
 if(v==='mc'){const T1=(xe,ze)=>[cc,{x:xe,y:d,z:ze}],T2=[-f,{x:a+g,y:-hh,z:-b}];
  t.choices=opts(t,[{value:sumTxt([T1(a-e,b),T2],'pos'),mistake:'Wrote z in the numerator of the first term'},{value:sumTxt([T1(e-a,-b),T2],'pos'),mistake:'Subtracted the exponents of x the wrong way'},{value:sumTxt([T1(a-e,-b),[-f,{x:g,y:-hh}]],'pos'),mistake:'Multiplied only the first term'}],h);}
 break;}
case 'a1-negbase':{
 if(v==='405'){const a=int(2,6),b=pick([-2,-3]),k1=int(1,2),k2=int(1,2),pw=(-a)**(-b),pa=a**(-b);
  const z1=k1===1?red(1,pw):red(-1,pa),z2=k2===1?[pw,1]:[-pa,1],s1=k1===1?`(−${a})${S.sup(b)}`:`−${a}${S.sup(b)}`,s2=k2===1?`1/(−${a})${S.sup(b)}`:`1/(−${a}${S.sup(b)})`;
  t=T(`Simplify: (a) ${s1} (b) ${s2}. Answer both parts, separated by a semicolon.`,[num(...z1,'frac'),num(...z2,'int')],`(a) ${fracT(...z1)}; (b) ${minus(z2[0])}`,`A negative exponent means the reciprocal; the minus sign is inside the power only when it is in parentheses: (a) ${fracT(...z1)}, (b) ${minus(z2[0])}.`,{a,b,k1,k2},{math:math(`<mrow><mtext>(a) </mtext>${k1===1?mlGrp(`<mo>−</mo><mn>${a}</mn>`,b):`<mo>−</mo><msup><mn>${a}</mn>${mlE(b)}</msup>`}<mtext>      </mtext><mtext>(b) </mtext>${mlQ('<mn>1</mn>',k2===1?mlGrp(`<mo>−</mo><mn>${a}</mn>`,b):`<mo>−</mo><msup><mn>${a}</mn>${mlE(b)}</msup>`)}</mrow>`)});}
 else if(v==='406'){const [a,b,cc,d,e,f]=pick(zip([2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4],[2,2,2,2,2,2,2,2,3,3,3,3,2,2,2,2,2,2,2,2,3,3,3,3,2,2,2,2,2,2],[3,3,3,3,4,4,4,4,4,4,4,4,3,3,3,3,4,4,4,4,4,4,4,4,3,3,3,3,3,3],[3,3,3,4,3,3,3,4,3,3,3,4,2,2,2,4,2,2,2,4,2,2,2,4,2,2,2,3,3,3],[2,2,3,2,2,2,3,2,2,2,3,2,2,2,3,2,2,2,3,2,2,2,3,2,2,2,3,2,2,3],[3,4,4,3,3,4,4,3,3,4,4,3,3,4,4,3,3,4,4,3,3,4,4,3,3,4,4,3,4,4]));
  let g;do{g=int(2,8);}while(a**b-d*g===0);const N=-(a**cc)/((-a)**b)+d**f/((-d)**e),D=a**b-d*g,z=red(N,D);
  t=T('Simplify. Give an exact answer as a fraction in lowest terms or an integer.',[num(...z,'frac')],fracT(...z),`Numerator: −${a}${S.sup(cc)}(−${a})${S.sup(-b)} + ${d}${S.sup(f)}(−${d})${S.sup(-e)} = ${minus(N)}. Denominator: ${a}${S.sup(b)} − ${d}·${g} = ${minus(D)}. Quotient: ${fracT(...z)}.`,{a,b,c:cc,d,e,f,g},
   {math:math(mlQ(`<mo>−</mo><msup><mn>${a}</mn><mn>${cc}</mn></msup>${mlGrp(`<mo>−</mo><mn>${a}</mn>`,-b)}<mo>+</mo><msup><mn>${d}</mn><mn>${f}</mn></msup>${mlGrp(`<mo>−</mo><mn>${d}</mn>`,-e)}`,`<msup><mn>${a}</mn><mn>${b}</mn></msup><mo>−</mo><mo>[</mo><mo>−</mo><mo>(</mo><mo>−</mo><mn>${d}</mn><mo>)</mo><mo>|</mo><mo>−</mo><mn>${g}</mn><mo>|</mo><mo>]</mo>`))});}
 else if(v==='407'){const a=int(2,7),b=int(2,7),cc=int(2,7),d=int(2,7),e=int(2,7),f=int(2,7);let g;do{g=int(2,5);}while(g*g===f);const hh=int(2,5),i=int(2,5),z1=red(-b-1+d-e*e,f-g*g),z2=hh*hh+i;
  t=T('Simplify (a) and (b). Answer both parts, separated by a semicolon; give (a) as a fraction in lowest terms or an integer.',[num(...z1,'frac'),num(z2,1,'int')],`(a) ${fracT(...z1)}; (b) ${z2}`,`(a) Zero powers are 1: (−${b} − 1 + ${d} − ${e*e}) ÷ (${f} − ${g*g}) = ${fracT(...z1)}. (b) −1 ÷ (−1/${hh*hh}) = ${hh*hh} and −∛(−${i**3}) = ${i}: ${z2}.`,{a,b,c:cc,d,e,f,g,h:hh,i},
   {math:math(`<mrow><mtext>(a) </mtext>${mlQ(`${mlGrp(`<mo>−</mo><mn>${a}</mn>`,0)}<mo>[</mo><mo>(</mo><mo>−</mo><mn>${b}</mn><mo>−</mo><msup><mn>${cc}</mn><mn>0</mn></msup><mo>)</mo><mo>+</mo><mo>(</mo><mn>${d}</mn><mo>−</mo><msup><mn>${e}</mn><mn>2</mn></msup><mo>)</mo><mo>]</mo>`,`<mo>|</mo><mo>−</mo><mn>${f}</mn><mo>|</mo><mo>−</mo><msup><mn>${g}</mn><mn>2</mn></msup>`)}<mtext>      </mtext><mtext>(b) </mtext>${mlQ('<mo>−</mo><mn>1</mn>',`<mo>−</mo>${mlGrp(`<mo>−</mo><mn>${hh}</mn>`,-2)}`)}<mo>−</mo><mroot><mrow><mo>−</mo><mn>${i**3}</mn></mrow><mn>3</mn></mroot></mrow>`)});}
 else{const a=int(2,6),b=pick([-2,-3]),k=int(1,4),pw=(-a)**(-b),pa=a**(-b),forms=[`(−${a})${S.sup(b)}`,`−${a}${S.sup(b)}`,`1/(−${a})${S.sup(b)}`,`1/(−${a}${S.sup(b)})`],z=[red(1,pw),red(-1,pa),[pw,1],[-pa,1]][k-1];
  t=T(`Simplify: ${forms[k-1]}`,[num(...z,'frac')],fracT(...z),`A negative exponent means the reciprocal; the minus sign is inside the power only in parentheses: ${fracT(...z)}.`,{a,b,k});
  const ab=a*b;t.choices=opts(t,[{value:fracT(-z[0],z[1]),mistake:'Used the wrong sign'},{value:k<=2?minus(ab):fracT(1,ab),mistake:'Multiplied the base by the exponent'},{value:k<=2?minus(-ab):fracT(-1,ab),mistake:'Multiplied the base by the exponent and used the wrong sign'}],h);}
 break;}
case 'a1-ineq-words':{const d=int(1,5)*pick([1,-1]),b=int(3,8),inc=pick([1,-1]),more=pick([1,-1]),Lk=`x ${inc>0?'+':'−'} ${b}`,op=more>0?'gt':'lt',key=`${Lk} ${OPSYM[op]} ${minus(d)}`;
 t=T(`Write an inequality that matches the sentence, using x for the number: When a number is ${inc>0?'increased':'decreased'} by ${b}, the result is ${more>0?'more':'less'} than ${minus(d)}.`,[{t:'ineq',v:'x',mode:'form',op,L:Lk.replace('−','-'),R:String(d)}],key,`"${inc>0?'Increased':'Decreased'} by ${b}" gives ${Lk}; "${more>0?'more':'less'} than" gives ${OPSYM[op]}: ${key}.`,{b,d,inc,more});
 if(v==='mc'){const oL=`x ${inc>0?'−':'+'} ${b}`;t.choices=opts(t,[{value:`${Lk} ${OPSYM[FLIP[op]]} ${minus(d)}`,mistake:'Reversed the inequality symbol'},{value:`${oL} ${OPSYM[op]} ${minus(d)}`,mistake:`Used the wrong operation for "${inc>0?'increased':'decreased'}"`},{value:`${oL} ${OPSYM[FLIP[op]]} ${minus(d)}`,mistake:'Used the wrong operation and reversed the symbol'}],h);}
 break;}
case 'a1-ineq-tf':{const a=int(1,4),b=int(-9,9),cc=int(-9,8),op=['lt','le','gt','ge'][a-1],tr=op==='lt'?b<cc:op==='le'?b<=cc:op==='gt'?b>cc:b>=cc;
 t=T(`True or false: ${minus(b)} ${OPSYM[op]} ${minus(cc)}`,[word(tr?'true':'false')],tr?'true':'false',`${minus(b)} is ${b<cc?'less than':b>cc?'greater than':'equal to'} ${minus(cc)}, so the statement is ${tr?'true':'false'}.`,{b,c:cc,op});break;}
case 'a1-compare':{const b=int(-9,9),a=int(-9,-1),z=a<b?'<':a>b?'>':'=',W={'<':['<','less than','is less than'],'>':['>','greater than','is greater than'],'=':['=','equal','equal to','is equal to']};
 t=T(`Compare: ${minus(a)} ☐ ${minus(b)}. Write <, > or = in the box.`,[word(...W[z])],z,`${minus(a)} is ${a<b?'to the left of':a>b?'to the right of':'the same point as'} ${minus(b)} on the number line, so ${minus(a)} ${z} ${minus(b)}.`,{a,b});break;}
case 'a1-ineq-graph':{const a=int(1,6)*pick([1,-1]),k=int(1,4),op=['le','lt','ge','gt'][k-1],dir=k<=2?'left':'right',closed=k===1||k===3;
 t=S.U.teacher(`Draw a number line and graph the solution to x ${OPSYM[op]} ${minus(a)}.`,`${closed?'A closed (filled) circle':'An open circle'} at ${minus(a)}, with the ray shaded to the ${dir} and an arrow.`,[`The circle is at ${minus(a)}.`,`The circle is ${closed?'closed, because the number itself is included':'open, because the number itself is not included'}.`,`The ray is shaded to the ${dir} and ends in an arrow.`],{a,op},S.inequalityLine(),S.inequalityLine(a,dir,closed));break;}
case 'a1-ineq-pick':{const a=int(1,8)*pick([1,-1]),lt=pick([true,false]),opts4=[[a,lt?'left':'right',false],[-a,'left',false],[a,'left',true],[-a,'right',true]],ord=[0,1,2,3].map(()=>int(0,999)),order=[0,1,2,3].sort((p,q)=>ord[p]-ord[q]),key='abcd'[order.indexOf(0)];
 t=T(`Which number line shows the graph of x ${lt?'<':'>'} ${minus(a)}? Answer with the letter.`,[word(key)],`(${key})`,`An open circle at ${minus(a)} with the ray shaded to the ${lt?'left':'right'}: (${key}).`,{a,lt,order},{svg:S.inequalityLines(order.map(i=>opts4[i]))});break;}
case 'a1-ratio':{const PAIRS=[['good guys','bad guys'],['rascals','good guys'],['fairies','dwarfs'],['sailors','pirates'],['serpents','doves'],['frogs','toads'],['bipeds','quadrupeds'],['pens','pencils'],['rats','mice'],['spiders','flies'],['freshmen','sophomores']];
 let a=int(2,19),b=int(2,19);const g0=gcd(a,b);a/=g0;b/=g0;const [t1,t2]=pick(PAIRS),first=pick([1,2]);
 if(v==='total'){const e=int(110,260),q0=e*(a+b),ask=first===1?t1:t2,z=first===1?e*a:e*b;
  t=T(`The ratio of ${t1} to ${t2} was ${a} to ${b}. If there were ${S.comma(q0)} in all, how many were ${ask}?`,[num(z,1,'int')],S.comma(z),`There were ${a} + ${b} = ${a+b} parts, each ${S.comma(q0)} ÷ ${a+b} = ${e}; ${ask}: ${first===1?a:b} × ${e} = ${S.comma(z)}.`,{a,b,e,first});}
 else{const e=int(11,26),f=first===1?e*a:e*b,z=first===1?e*b:e*a,[have,ask]=first===1?[t1,t2]:[t2,t1];
  t=T(`The ratio of ${t1} to ${t2} was ${a} to ${b}. If there were ${f} ${have}, how many ${ask} were there?`,[num(z,1,'int')],String(z),`${t1[0].toUpperCase()+t1.slice(1)}/${t2} = ${a}/${b}; each part is ${e}, so there were ${z} ${ask}.`,{a,b,e,first});}
 break;}
case 'a1-ineq-read':{const a=int(1,v==='mc'?7:6)*pick([1,-1]),k=int(1,4),op=['le','lt','ge','gt'][k-1],dir=k<=2?'left':'right',closed=k===1||k===3,fig=S.inequalityLine(a,dir,closed),key=`x ${OPSYM[op]} ${minus(a)}`;
 if(v==='mc'){t=T('Which inequality describes the graph?',[{t:'ineq',v:'x',mode:'set',op,b:a}],key,`${closed?'A closed':'An open'} circle at ${minus(a)}, shaded to the ${dir}: ${key}.`,{a,op},{svg:fig});
  const wr=[['ge','gt','le','lt'],['ne','eq','ne','eq'],['gt','le','lt','le']].map(r=>r[k-1]),sy=o=>o==='ne'?'≠':o==='eq'?'=':OPSYM[o];
  t.choices=opts(t,[{value:`x ${sy(wr[0])} ${minus(a)}`,mistake:'Read the direction of the ray the wrong way'},{value:`x ${sy(wr[1])} ${minus(a)}`,mistake:'Used an equation sign instead of an inequality'},{value:`x ${sy(wr[2])} ${minus(a)}`,mistake:'Mixed up the open and closed circle or the direction'}],h);}
 else{const nk=`x ${NEGSYM[op]} ${minus(a)}`;t=T('Write both an inequality and a negated inequality that describe this graph. Answer both, separated by a semicolon. In the negated inequality use ≯ (not greater than), ≮ (not less than), ≰ or ≱; "not >" or !> may be typed instead.',[{t:'ineq',v:'x',mode:'set',op,b:a},{t:'ineq',v:'x',mode:'set',op,b:a,neg:true}],`${key}; ${nk}`,`${closed?'A closed':'An open'} circle at ${minus(a)}, shaded to the ${dir}: ${key}, which says the same as ${nk}.`,{a,op},{svg:fig});}
 break;}
case 'a1-quot':{
 if(v==='433'||v==='434'){const a=int(1,5),b=int(1,5),cc=int(1,5),e=int(1,2),f=int(1,2),g=int(1,5),d=v==='433'?int(e+f-1,e+f+1):int(e+f-2,e+f+2),sa=v==='433'?a:-a,form=v==='433'?'pos':'num';
  const terms=[[1,{x:sa+b,y:cc+g,z:e+f-d}]],key=sumTxt(terms,form);
  t=T(`Simplify. Write the answer ${HOW[form]}.`,[{...polyPart(terms),form}],key,`Add the exponents of each letter in the numerator and subtract those in the denominator: ${key}.`,{a:sa,b,c:cc,d,e,f,g},{math:math(mlQ(mlMono(1,[['x',sa],['x',b],['y',cc],['z',-d]]),mlMono(1,[['z',-e],['z',-f],['y',-g]])))});}
 else{const B=pick([3,5,7,11]),cc=int(2,9),A=cc*B,d=int(2,5),f=int(2,4)*d,g=int(2,5),i=int(2,4)*g,b1=int(2,5),b3=int(2,4)*b1;
  const terms=[[cc,{x:d-f,y:g-i,z:b1+b3}]],key=sumTxt(terms,'pos'),t1=b1+b3,t2=f-d,t3=i-g;
  t=T('Simplify. Write the answer with all exponents positive.',[{...polyPart(terms),form:'pos'}],key,`Divide the coefficients and subtract exponents: ${key}.`,{A,B,c:cc,d,f,g,i,b1,b3},{math:math(mlQ(mlMono(A,[['x',-f],['y',g],['z',b3]]),mlMono(B,[['x',-d],['y',i],['z',-b1]])))});
  t.choices=opts(t,[{value:`${cc}${monoX(1,[['x',t2],['y',t3]])}/z${S.sup(t1)}`,mistake:'Wrote each power on the wrong side of the fraction bar'},{value:`${cc}${monoX(1,[['y',t3],['z',t1]])}/(${B}x${S.sup(t2)})`,mistake:"Wrote y on the wrong side and kept the denominator's coefficient"},{value:`${cc}x${S.sup(t2)}/(${B}${monoX(1,[['y',t3],['z',t1]])})`,mistake:"Wrote x and z on the wrong side and kept the denominator's coefficient"}],h);}
 break;}
case 'a1-dist-neg':{const r4=()=>int(1,4)*pick([1,-1]);let t0;
 if(v==='437'){let a,b,cc,d,e,f;do{a=r4();b=r4();cc=r4();d=r4();e=int(2,6);f=r4();}while(a+cc-1===a-2&&b+d===b+f);
  t0=expandTask({nu:[1,[['x',a],['y',b]]]},[[1,{nu:[1,[['x',cc],['y',d]]],de:[1,[['x',1]]]}],[-1,{nu:[e,[['y',f]]],de:[1,[['x',2]]]}]],'pos',HOW.pos,{a,b,c:cc,d,e,f});}
 else if(v==='438'||v==='442'){let a,b,cc,d,e,f;do{a=r4();b=-int(1,4);cc=r4();d=r4();e=v==='438'?int(2,6):int(1,6);f=r4();}while((a+cc-1===a+2&&b+d===b-f)||(v==='442'&&a+cc-1===0&&b+d===0));
  t0=expandTask({nu:[1,[['a',a]]],de:[1,[['b',-b]]]},[[1,{nu:[1,[['a',cc],['b',d]]],de:[1,[['a',1]]]}],[-1,{nu:[e,[['a',2],['c',1]]],de:[1,[['b',f]]]}]],v==='442'?'neg':'pos',v==='442'?HOW.neg:HOW.pos,{a,b,c:cc,d,e,f},v==='442');}
 else if(v==='439'||v==='mc'){let a,b,cc,d,e,f,m,n0,g,hh,i,j,k,l;do{a=r4();b=-int(1,4);cc=r4();d=r4();e=int(2,6);f=r4();m=int(1,4);n0=int(1,4);g=a+cc-1;hh=b+d;i=a+2;j=b-f;k=a+m;l=n0+b;}while((g===i&&hh===j)||(g===k&&hh===l)||(k===i&&l===j));
  t0=expandTask({nu:[1,[['a',a]]],de:[1,[['b',-b]]]},[[1,{nu:[1,[['a',m],['b',n0]]]}],[-1,{nu:[1,[['a',cc],['b',d]]],de:[1,[['a',1]]]}],[-1,{nu:[e,[['a',2],['c',1]]],de:[1,[['b',f]]]}]],'pos',HOW.pos,{a,b,c:cc,d,e,f,m,n:n0});
  if(v==='mc'){const s1=pick([1,-1]),s2=pick([1,-1]),s3=pick([1,-1]),T1=kk=>[1,{a:kk,b:l}],T2=hh1=>[-1,{a:g,b:hh1}],T3=ii=>[-e,{a:ii,b:j,c:1}];
   t0.choices=opts(t0,[{value:sumTxt([T1(k+s1),T2(hh),T3(i)],'pos'),mistake:'Added the exponents of a incorrectly in the first term'},{value:sumTxt([T1(k+s1),T2(hh+s2),T3(i)],'pos'),mistake:'Added exponents incorrectly in the first two terms'},{value:sumTxt([T1(k+s1),T2(hh+s2),T3(i+s3)],'pos'),mistake:'Added exponents incorrectly in every term'}],h);}}
 else if(v==='440'){const r2=()=>int(1,2)*pick([1,-1]),r25=()=>int(2,5)*pick([1,-1]);let e=r2(),f=r2(),g=r2();const cc=r25(),d=r25(),a=int(1,5),hh=r25(),i=r25(),cs=int(1,3);if(cs===1)e=0;if(cs===2)f=0;if(cs===3)g=0;
  const front={nu:[1,[['x',a],['y',0],['z',1]]],de:[1,[['w',cc]]]},in1={nu:[1,[['w',d],['z',e]]],de:[1,[['z',1]]]},in2={nu:[1,[['w',f],['x',g],['z',hh]]],de:[1,[['z',i]]]};
  t0=expandTask(front,[[1,in1],[1,in2]],'pos',HOW.pos,{a,c:cc,d,e,f,g,h:hh,i,cs});
  // show the zero powers the way the source does (y⁰ in front, and the zero power inside)
  t0.math=math(`<mrow>${mlQ(`<msup><mi>x</mi><mn>${a}</mn></msup><msup><mi>y</mi><mn>0</mn></msup><mi>z</mi>`,mlPow('w',cc))}<mo>(</mo>${mlQ(`${mlPow('w',d)}<msup><mi>z</mi>${mlE(e)}</msup>`,'<mi>z</mi>')}<mo>+</mo>${mlQ(`<msup><mi>w</mi>${mlE(f)}</msup><msup><mi>x</mi>${mlE(g)}</msup>${mlPow('z',hh)}`,mlPow('z',i))}<mo>)</mo></mrow>`);}
 else if(v==='441'){let a,b,cc,d,e,f,m,n0,e1,e2,e3;do{a=r4();b=-int(1,4);cc=r4();d=r4();e=int(2,6);f=r4();m=int(1,4);n0=int(1,4);}while(a+m===a+cc-1&&b+1-n0===b+d+1);e1=int(1,6);e2=int(1,6);e3=int(1,6);
  t0=expandTask({nu:[e,[['x',a],['y',1]]],de:[1,[['z',1],['y',-b]]]},[[1,{nu:[e1,[['x',m]]],de:[1,[['y',n0]]]}],[1,{nu:[e2,[['x',cc],['y',d]]],de:[1,[['x',1]]]}],[-1,{nu:[e3,[['x',2],['z',1]]],de:[1,[['y',f]]]}]],'pos',HOW.pos,{a,b,c:cc,d,e,f,m,n:n0,e1,e2,e3});}
 else{let a,b,cc,d,e,f,r;do{a=r4();b=r4();cc=r4();d=r4();e=int(1,6);f=r4();r=int(2,4);}while((a+cc-1===a-2&&b+d===b+f)||b+d===0);
  t0=expandTask({nu:[r,[['a',a],['b',b]]]},[[1,{nu:[1,[['a',cc],['b',d]]],de:[1,[['a',1]]]}],[1,{nu:[3,[['a',2],['b',1]]],de:[1,[['c',-2]]]}],[-1,{nu:[e,[['b',f]]],de:[1,[['a',2]]]}]],'num',HOW.num,{a,b,c:cc,d,e,f,r});}
 t=t0;break;}
case 'a1-like-rat':{const r6=()=>int(1,6)*pick([1,-1]),sgML=(c0,i)=>(c0<0?'<mo>−</mo>':i?'<mo>+</mo>':'');
 if(v==='447'||v==='449'){const L3=v==='447'?'z':'n';let a,b,cc,d;do{a=r6();b=r6();cc=r6();d=r6();}while(a+cc===0||b+d===0||a+b+cc+d===0);const e=int(2,5),f=int(2,5),g=int(2,5);let hh=int(v==='447'?2:3,6),i=int(2,6),j=int(2,6);
  while(e===hh&&f===i&&g===j){i=int(2,6);j=int(2,6);}const k=int(1,2);if(k===2){hh=e;i=f;j=g;}
  const P=[{nu:[Math.abs(a),[['x',e],['y',f],[L3,g-2]]],de:[1,[[L3,-2]]]},v==='447'?{nu:[Math.abs(b),[['x',hh+1],['y',i-2],[L3,j]]],de:[1,[['x',1],['y',-2]]]}:{nu:[Math.abs(b),[['x',hh+1],['y',i-2],[L3,j-1]]],de:[1,[[L3,-1],['x',1],['y',-2]]]},{nu:[Math.abs(cc),[['x',e],['y',f-1],[L3,g-1]]],de:[1,[['y',-1],[L3,-1]]]},{nu:[Math.abs(d),[['x',hh],['y',i],[L3,j-2]]],de:[1,[[L3,-2]]]}],cs=[a,b,cc,d];
  const terms=combine(P.map((pp,i0)=>{const vv=tVal(pp);return [cs[i0]/Math.abs(cs[i0])*vv[0],vv[1]];})),form=v==='447'?'pos':'num',key=sumTxt(terms,form);
  t=T(`Simplify by adding like terms. Write the answer ${HOW[form]}.`,[{...polyPart(terms),form}],key,`Write each term without its denominator (subtract exponents), then add the like terms: ${key}.`,{a,b,c:cc,d,e,f,g,h:hh,i,j,k},{math:math(`<mrow>${P.map((pp,i0)=>sgML(cs[i0],i0)+mlT(pp)).join('')}</mrow>`)});}
 else if(v==='448'){let a,b;do{a=int(2,9)*pick([1,-1]);b=int(2,8)*pick([1,-1]);}while(a+b+8===0);const cc=int(1,4),d=int(1,4),e=int(1,Math.floor(9/(cc+d)));let f,g;do{f=int(2,9);g=int(2,9);}while(f===cc*e&&g===d*e);
  const k=int(1,2);if(k===2){f=cc*e;g=d*e;}const j=int(1,3),ord=int(1,3);
  const terms=combine([[a,{a:-cc*e,b:-d*e}],[b,{a:-f,b:-g}],[9,{a:-cc*e,b:-d*e}],[-1,{a:-f,b:-g}]]),key=sumTxt(terms,'neg');
  const M1=`<mn>${Math.abs(a)}</mn>${mlGrp(`${mlPow('a',cc)}${mlPow('b',d)}`,-e)}`,M2=mlQ(mlMono(Math.abs(b),[['a',-f],['b',-g-j]]),mlGrp('<msup><mi>a</mi><mn>0</mn></msup><mi>b</mi>',-j)),M3=mlQ(`${mlGrp('<mn>3</mn><mi>b</mi>',2)}${mlPow('a',-cc*e-2)}`,mlMono(1,[['a',-2],['b',d*e+2]])),M4=mlQ(mlGrp(`${mlPow('a',-1)}<mi>b</mi>`,f),mlPow('b',f+g));
  const seq=ord===1?[[a,M1],[b,M2],[1,M3],[-1,M4]]:ord===2?[[b,M2],[a,M1],[1,M3],[-1,M4]]:[[a,M1],[b,M2],[-1,M4],[1,M3]];
  t=T('Simplify by adding like terms. Write the answer with all exponents negative.',[{...polyPart(terms),form:'neg'}],key,`Write each term as a number times powers of a and b (multiply exponents for a power of a power, subtract for a quotient), then add like terms: ${key}.`,{a,b,c:cc,d,e,f,g,j,k,ord},{math:math(`<mrow>${seq.map(([c0,ml],i0)=>sgML(c0,i0)+ml).join('')}</mrow>`)});}
 else{let a,b,cc;do{a=int(2,9)*pick([1,-1]);b=int(2,8)*pick([1,-1]);cc=int(1,9)*pick([1,-1]);}while(a+b+cc===0);const d=int(1,6),e=int(1,6),f=int(1,6),g=int(1,3),hh=int(1,3),i=int(1,3),ord=int(1,3);
  const P1={nu:[Math.abs(a),[['x',d+g],['x',-g],['y',e+hh],['y',-hh],['z',-f]]]},P2={nu:[Math.abs(b),[['x',d],['y',e]]],de:[1,[['z',f]]]},P3={nu:[Math.abs(cc),[['x',d+i],['y',e]]],de:[1,[['x',i],['z',f]]]};
  const seq=ord===1?[[a,P1],[b,P2],[cc,P3]]:ord===2?[[b,P2],[a,P1],[cc,P3]]:[[a,P1],[cc,P3],[b,P2]],terms=[[a+b+cc,{x:d,y:e,z:-f}]],key=sumTxt(terms,'den');
  t=T('Simplify by adding like terms. Write the answer with all variables in the denominator.',[{...polyPart(terms),form:'den'}],key,`Each term is a number times x${S.sup(d)}y${S.sup(e)}z${S.sup(-f)}; add the numbers and move every letter to the denominator: ${key}.`,{a,b,c:cc,d,e,f,g,h:hh,i,ord},{math:math(`<mrow>${seq.map(([c0,pp],i0)=>sgML(c0,i0)+mlT(pp)).join('')}</mrow>`)});}
 break;}
case 'a1-two-eval':{const cr=n0=>`∛(${minus(n0**3)})`,sg=x=>x<0?'−':'+';
 if(v==='453'){const a=int(-5,5),b=int(1,9),cc=int(1,9)*pick([1,-1]);let d;do{d=int(2,8)*pick([1,-1]);}while(b+d===0);const e=pick([int(2,5)*pick([1,-1]),0]),g=int(1,9),hh=int(1,9)*pick([1,-1]),R=b*a+cc+d*a+e,z=g*a+hh;
  t=T(`If ${polyX([[b,[['x',1]]],[cc,[]],[d,[['x',1]]],[e,[]]])} = ${minus(R)}, what is the value of ${polyX([[g,[['x',1]]],[hh,[]]])}?`,[num(z,1,'int')],minus(z),`Collect like terms: ${minus(b+d)}x ${sg(cc+e)} ${Math.abs(cc+e)} = ${minus(R)}, so x = ${minus(a)}. Then ${g}(${minus(a)}) ${sg(hh)} ${Math.abs(hh)} = ${minus(z)}.`,{a,b,c:cc,d,e,g,h:hh});}
 else if(v==='454'){const a=pick([-2,2,-3,3,-4,4]);let b,cc,d,e,N;do{b=int(2,8)*pick([1,-1]);cc=int(1,9)*pick([1,-1]);d=int(2,3);e=int(2,3);N=1-a**d*b**e*(1-b)-a**d*Math.abs(a);}while(Math.abs(N/gcd(Math.abs(N),Math.abs(a**d)))>200);const z=red(N,a**d);
  t=T(`Evaluate a${S.sup(-d)} − b${S.sup(e)}(a⁰ − b) − |a| if a = ${cr(a)} and ${polyX([[1,[['b',1]]],[cc,[]]])} = ${minus(b+cc)}. Give an exact answer as a mixed number, fraction or integer.`,[num(...z,'any')],mixT(...z),`a = ${minus(a)} and b = ${minus(b)}; a⁰ = 1. Substitute: ${mixT(...z)}.`,{a,b,c:cc,d,e});}
 else if(v==='455'){const a=int(-9,9),b=int(1,9)*pick([1,-1]),cc=int(1,9)*pick([1,-1]),z=a**3+cc;
  t=T(`If ${polyX([[1,[['x',1]]],[b,[]]])} = ${minus(a+b)}, what is the value of ${polyX([[1,[['x',3]]],[cc,[]]])}?`,[num(z,1,'int')],minus(z),`x = ${minus(a)}, so x³ ${sg(cc)} ${Math.abs(cc)} = ${minus(a**3)} ${sg(cc)} ${Math.abs(cc)} = ${minus(z)}.`,{a,b,c:cc});}
 else if(v==='458'){const a=pick([-2,2,-3,3,-4,4]),b=pick([-2,2,-3,3,-4,4]),cc=int(1,9)*pick([1,-1]);let d,e,f,z;do{d=int(2,4);e=int(2,3);f=int(2,3);z=a**d-Math.abs(a**e)*a**f-b;}while(Math.abs(z)>300);
  t=T(`Evaluate 1/x${S.sup(-d)} + |−x${S.sup(e)}|(−x${S.sup(f)}) − ∛y if x = ${cr(a)} and ${polyX([[1,[['y',1]]],[cc,[]]])} = ${minus(b**3+cc)}.`,[num(z,1,'int')],minus(z),`x = ${minus(a)} and y = ${minus(b**3)}, so ∛y = ${minus(b)}. Substitute: ${minus(z)}.`,{a,b,c:cc,d,e,f});}
 else if(v==='459'){const P=[-2,2,-3,3,-4,4,-5,5],a=pick(P);let b,z;do{b=pick(P);z=(Math.abs(a)+Math.abs(b))*(Math.abs(a)-Math.abs(b));}while(z===0);
  t=T(`Evaluate (|a| + |b|)(|a| − |b|) if a = ${cr(a)} and b = ${cr(b)}.`,[num(z,1,'int')],minus(z),`a = ${minus(a)} and b = ${minus(b)}: (${Math.abs(a)} + ${Math.abs(b)})(${Math.abs(a)} − ${Math.abs(b)}) = ${minus(z)}.`,{a,b});}
 else{const cs=v==='mc'?int(1,2):2;
  if(cs===1){const a=-int(2,11);let b,d,e,g,z;do{b=int(2,8)*pick([1,-1]);d=int(2,3);e=int(2,3);g=int(1,3)*pick([1,-1]);z=b**d-a*b-Math.abs(b+g*a)+a**e;}while(Math.abs(z)>300);const f=int(2,5);
   t=T(`Evaluate x${S.sup(d)} − xy − |x ${sg(g)} ${Math.abs(g)===1?'':Math.abs(g)}y| − (−y${S.sup(e)}) if ${f+2}x ${sg(-f*b)} ${Math.abs(f*b)} = 2x and y = −√${a*a}.`,[num(z,1,'int')],minus(z),`${f}x = ${minus(f*b)}, so x = ${minus(b)}; y = ${minus(a)}. Substitute: ${minus(z)}.`,{cs,a,b,d,e,g,f});}
  else{const a=pick([-2,2,-3,3,-4,4]);let b,cc,d,e,z;do{b=int(2,8)*pick([1,-1]);cc=int(1,9)*pick([1,-1]);d=int(2,3);e=int(2,3);z=Math.abs(b**d)*(b-a)+b**e+a;}while(Math.abs(z)>300);
   t=T(`Evaluate |−x${S.sup(d)}|(x − y) + (x${S.sup(e)} + y) if ${polyX([[1,[['x',1]]],[cc,[]]])} = ${minus(b+cc)} and y = ${cr(a)}.`,[num(z,1,'int')],minus(z),`x = ${minus(b)} and y = ${minus(a)}. Substitute: ${minus(z)}.`,{cs,a,b,c:cc,d,e});}
  if(v==='mc'){const z=t.answer.parts[0].v[0],s1=pick([1,-1]);t.choices=opts(t,[{value:minus(z+s1),mistake:'Arithmetic slip of 1'},{value:minus(z-2*s1),mistake:'Arithmetic slip of 2'},{value:minus(z+10*pick([1,-1])),mistake:'Arithmetic slip of 10'}],h);}}
 break;}
case 'a1-multivar':{const smp=(vars,fn)=>S.fsamples(vars,fn);
 if(v==='464'){const a=int(1,5),aa=int(1,3),b=int(1,9),bb=int(1,3);let cc;do{cc=int(2,9);}while(cc===b);const d=a*bb,e=aa*a,z=(cc*e-b*e+d)/a,co=x=>x===1?'':x;
  t=T(`If ${co(a)}x + ${co(b)}y = ${cc}y + ${d} and y = ${e}, find x.`,[num(z,1,'int')],`x = ${z}`,`Substitute y = ${e}: ${a}x = ${cc*e} + ${d} − ${b*e}, so x = ${z}.`,{a,b,c:cc,d,e});}
 else if(v==='466'){let a,b;do{a=int(2,9);b=int(2,9);}while(gcd(a,b)!==1);const cc=int(2,9),key=solveTxt('y',[[a,'x'],[-cc,'']],b);
  t=T(`Solve ${a}x − ${b}y = ${cc} for y.`,[{t:'solve',v:'y',vars:['x'],samples:smp(['x'],en=>(a*en.x-cc)/b)}],key,`Subtract ${a}x and divide by −${b}: ${key}.`,{a,b,c:cc});}
 else if(v==='470'){const a=int(3,7)*pick([1,-1]),b=int(4,7)*pick([1,-1]),cs=int(1,2),d=int(2,7)*pick([1,-1]);let e;do{e=int(1,7)*pick([1,-1]);}while(b+e===0);const v1=Math.trunc(a*b/2),v2=a*b-v1,v3=-b-e,v4=b*d;
  const [X,Y]=cs===1?['x','y']:['y','x'],eq=polyX([[v1,[[X,1]]],[v3,[[Y,1]]],[v2,[[X,1]]],[e,[[Y,1]]],[v4,[]]]),key=solveTxt(Y,[[a,X],[d,'']],1);
  t=T(`Solve for ${Y}: ${eq} = 0`,[{t:'solve',v:Y,vars:[X],samples:smp([X],en=>a*en[X]+d)}],key,`Collect like terms: ${minus(a*b)}${X} ${b<0?'+':'−'} ${Math.abs(b)}${Y} ${v4<0?'−':'+'} ${Math.abs(v4)} = 0; solve for ${Y}: ${key}.`,{a,b,d,e,cs});}
 else if(v==='468'||v==='469'){let a,b,cc,d,f1,f2,f3;
  for(;;){a=int(3,7)*pick([1,-1]);b=int(4,7)*pick([1,-1]);cc=int(1,2);d=int(2,7)*pick([1,-1]);if(v==='468'&&(a===b+2||(b+1<0&&a-1<0)))continue;if(v==='469'&&(a===b+2||(b+1<0&&a<0)))continue;
   if(v==='468'){// (a−1)x − (b+1)y + d = 0
    const g=gcd(gcd(Math.abs(b+1),Math.abs(a-1)),Math.abs(d));f1=(b+1)/g;f2=(a-1)/g;f3=d/g;if((Math.abs(f1)===1&&cc===2)||(Math.abs(f2)===1&&cc===1))continue;}
   else{const g=gcd(gcd(Math.abs(b+1),Math.abs(a)),Math.abs(d));f1=(b+1)/g;f2=a/g;f3=d/g;if((Math.abs(f1)===1&&cc===2)||(Math.abs(f2)===1&&cc===1))continue;}break;}
  const S1=cc===1?'x':'y',O=cc===1?'y':'x';let key,fn;
  if(v==='468'){if(cc===1){key=solveTxt('x',[[f1,'y'],[-f3,'']],f2);fn=en=>((b+1)*en.y-d)/(a-1);}else{key=solveTxt('y',[[f2,'x'],[f3,'']],f1);fn=en=>((a-1)*en.x+d)/(b+1);}
   t=T(`Solve for ${S1}: ${polyX([[a,[['x',1]]],[-1,[['y',1]]],[d,[]]])} = ${polyX([[1,[['x',1]]],[b,[['y',1]]]])}`,[{t:'solve',v:S1,vars:[O],samples:smp([O],fn)}],key,`Collect: ${minus(a-1)}x ${b+1<0?'+':'−'} ${Math.abs(b+1)}y ${d<0?'−':'+'} ${Math.abs(d)} = 0; solve for ${S1}: ${key}.`,{a,b,c:cc,d});}
  else{if(cc===1){key=solveTxt('x',[[f1,'y'],[f3,'']],f2);fn=en=>((b+1)*en.y+d)/a;}else{key=solveTxt('y',[[f2,'x'],[-f3,'']],f1);fn=en=>(a*en.x-d)/(b+1);}
   t=T(`Solve for ${S1}: ${polyX([[a,[['x',1]]],[-1,[['y',1]]]])} = ${polyX([[d,[]],[b,[['y',1]]]])}`,[{t:'solve',v:S1,vars:[O],samples:smp([O],fn)}],key,`Collect: ${a}x = ${minus(b+1)}y ${d<0?'−':'+'} ${Math.abs(d)}; solve for ${S1}: ${key}.`,{a,b,c:cc,d});}}
 else{// a·u − w = u + b·w: u = (b+1)w/(a−1), w = (a−1)u/(b+1)
  let a,b,cc;
  if(v==='mc'){const R=zip([-7,-7,-6,-6,-6,-5,-5,-5,-4,-4,-3,-3,-3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6,7,7,7,7],[5,6,4,5,7,4,6,7,5,6,4,5,7,-7,-5,-4,5,6,-7,-6,-4,4,6,7,-6,-5,4,5,7,-7,-5,-4,6,7,-6,-5,4,6],[1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2]);[a,b,cc]=pick(R);}
  else for(;;){a=int(3,7)*pick([1,-1]);b=int(4,7)*pick([1,-1]);cc=int(1,2);if(a===b+2||(b+1<0&&a-1<0))continue;const g=gcd(Math.abs(b+1),Math.abs(a-1));if(v==='465'&&((a-1)/g===1||(b+1)/g===1))continue;break;}
  const S1=cc===1?'u':'w',O=cc===1?'w':'u',[nu,de]=cc===1?[b+1,a-1]:[a-1,b+1],[rn,rd]=red(nu,de),key=solveTxt(S1,[[rn,O]],rd),eqL=polyX([[a,[['u',1]]],[-1,[['w',1]]]]),eqR=polyX([[1,[['u',1]]],[b,[['w',1]]]]);
  t=T(`Solve for ${S1}: ${eqL} = ${eqR}`,[{t:'solve',v:S1,vars:[O],samples:smp([O],en=>nu*en[O]/de)}],key,`Collect: ${minus(a-1)}u = ${minus(b+1)}w; divide: ${key}.`,{a,b,c:cc});
  if(v==='mc'){const [qn,qd]=red(de,nu),dn=x=>x<0?`(${minus(x)})`:String(x);t.choices=opts(t,[{value:solveTxt(S1,[[qn,O]],qd),mistake:'Divided the wrong way'},{value:`${S1} = (${termsTxt([[1,S1],[rn,O]])})/${dn(a)}`,mistake:`Left ${S1} on both sides of the equation`},{value:`${S1} = (${termsTxt([[1-a,O],[1,S1]])})/${dn(b)}`,mistake:`Moved only some terms and left ${S1} on both sides`}],h);}}
 break;}
default:throw Error('Unknown Algebra 1 port recipe '+c.recipe);}
if(v&&t.parameters&&t.parameters.form===undefined)t.parameters.form=v;   // the record's variant, for the oracles
return t;}

const api=Object.freeze({key:'algebra-1',course:'Algebra 1',prefix:'a1-',batchPrefix:'A1',catalog,build,check,answerText});
if(common)module.exports=api;root.MathPortAlgebra1=api;
})(typeof globalThis!=='undefined'?globalThis:this);
