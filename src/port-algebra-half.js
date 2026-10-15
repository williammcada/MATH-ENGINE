/* Algebra 1/2 port tasks (coverage programme, parallel courses). Original Engine code informed by the source
   records; no source script is executed or reproduced. Owned by the Algebra 1/2 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).

   Rules for this module:
   - Every recipe name starts with 'ah-'. src/port87.js sends those recipes here, family structured-port87.
   - Helpers come from src/port-shared.js (S below). Do not edit port-shared.js; ask the owner for a shared change.
     A helper only this course needs is defined in this file.
   - build(c,h) returns the same task object as the recipes in port87.js: {prompt, answer, solution, parameters,
     math?, svg?, teacherSvg?, choices?, requireImproper?, eitherForm?}. h.int(a,b), h.pick(list), h.index and
     h.check (the full port checker, for S.wrongOnlyBy(h.check,t,list)) are provided.
   - check(q,response) and answerText(q) handle answer kinds that exist only in this course. Return undefined for
     anything else, and the shared port checker handles it. render(q) likewise, if a course ever needs it. */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const U=common?require('./curriculum87-common'):root.MathCurriculum87Common;
const S=common?require('./port-shared'):root.MathPortShared;
const catalog=common?require('./port-algebra-half-map'):root.MathPortAlgebraHalfMap;
const {R,n,text,teacher}=U;
const {gcd,comma,minus,svg,ln,tx,dot,Fig,stackFigure,words,dotLine,letter,distinct,INK,esc}=S;
// The full port checker, looked up when a check runs (port87.js loads after this module).
const P=()=>common?require('./port87'):root.MathPort87;

// ---------- local helpers ----------
// N/10^k as text: thousands commas in the whole part, trailing zeros dropped beyond `keep` places, true minus sign.
function ds(N,k=0,o={}){const neg=N<0;let s=String(Math.abs(N)).padStart(k+1,'0'),w=s.slice(0,s.length-k),fr=k?s.slice(-k):'';const keep=o.keep||0;while(fr.length>keep&&fr.endsWith('0'))fr=fr.slice(0,-1);return(neg?'−':'')+(o.plain?w:comma(w))+(fr?'.'+fr:'');}
const cash=N=>'$'+ds(N,2,{keep:2});
// A decimal task: the key is N/10^k exactly, shown with commas.
function dec(prompt,N,k,sol,p,svg=''){const t=n(prompt,R(N,10**k),sol,p,'decimal',svg);t.answer.display=ds(N,k);return t;}
function whole(prompt,v,sol,p,svg=''){const t=n(prompt,v,sol,p,'numbers',svg);t.answer.display=ds(v);return t;}
const shuffle=(int,list)=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=int(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const upper=(int,ban)=>letter(int,ban).toUpperCase();
// Parses a signed decimal or integer (true minus or hyphen) to [numerator, 10^places]; null if it is not one.
function parseNum(t){const m=String(t).trim().replace(/[−–]/g,'-').match(/^([+-]?)(\d+)(?:\.(\d+))?$/);if(!m)return null;const f=m[3]||'';return[(m[1]==='-'?-1:1)*Number(m[2]+f),10**f.length];}
const sameNum=(a,[p,q])=>!!a&&a[0]*q===p*a[1];
const PLN=['','tenths','hundredths','thousandths','ten-thousandths','hundred-thousandths','millionths'];
// w and f/10^k in words: "forty-five and seven hundredths".
function decWords(w,f,k){return(w?words(w)+' and ':'')+words(f)+' '+(f===1?PLN[k].replace(/s$/,''):PLN[k]);}
const isPrime=x=>{if(x<2)return false;for(let d=2;d*d<=x;d++)if(x%d===0)return false;return true;};
const smallFactor=x=>{for(let d=2;d*d<=x;d++)if(x%d===0)return d;return x;};
const letterRun2=(int,k,ban)=>{const L=[...'abcdefghijklmnopqrstuvwxyz'].filter(ch=>!ban.includes(ch)),st=int(0,L.length-k);return L.slice(st,st+k);};
const numWordCap=x=>{const w=words(x);return w[0].toUpperCase()+w.slice(1);};
// n() with an exact-number answer list whose parts may be decimals.
const n2=(prompt,vals,sol,p)=>{const t=n(prompt,vals,sol,p,'decimal');t.answer.display=vals.map(v=>U.dec(v)).join('; ');return t;};
const wnorm=x=>String(x).toLowerCase().replace(/[‐-―-]/g,' ').replace(/[.,;:]/g,' ').replace(/\s+/g,' ').trim();

// A coordinate grid from −R to R with labelled points: pts = [[x, y, label]]. extra(X,Y) adds more drawing.
function grid(pts,R=10,label='Coordinate plane',extra=null,sc=13){const O=(R+1)*sc+8,X=v=>O+v*sc,Y=v=>O-v*sc,W=2*O;let b='';
 for(let v=-R;v<=R;v++)b+=ln(X(v),Y(-R),X(v),Y(R),{w:0.4,color:'#c3cacf'})+ln(X(-R),Y(v),X(R),Y(v),{w:0.4,color:'#c3cacf'});
 b+=ln(X(-R-0.8),O,X(R+0.8),O,{w:1.2,start:1,end:1})+ln(O,Y(-R-0.8),O,Y(R+0.8),{w:1.2,start:1,end:1})+tx(X(R+0.7),O+15,'x',{italic:1,size:12})+tx(O-11,Y(R+0.5),'y',{italic:1,size:12});
 for(let v=-R;v<=R;v++)if(v&&(R<=6||v%2===0))b+=tx(X(v),O+13,minus(v),{size:9})+tx(O-5,Y(v)+3,minus(v),{size:9,anchor:'end'});
 if(extra)b+=extra(X,Y);for(const [x,y,l] of pts){b+=dot(X(x),Y(y));if(l)b+=tx(X(x)+(x<0?-6:6),Y(y)-6,l,{size:11,anchor:x<0?'end':'start'});}
 return svg(b,label,W,W);}

// The apex of a triangle with base B on the x-axis, left side L and right side Rr.
const apex=(L,B,Rr)=>{const x=(L*L-Rr*Rr+B*B)/(2*B);return[x,Math.sqrt(Math.max(L*L-x*x,0.01))];};
// Strips an svg's outer element so several drawings can share one picture.
const inner=sv=>sv.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'').replace(/<title>.*?<\/title>/,'').replace(/<defs>.*?<\/defs>/,'');
// Stacks drawings vertically with captions A–D (or given captions).
function stack(svgs,label,W=440,H=80,caps=['A','B','C','D']){let b='';svgs.forEach((sv,i)=>{b+=`<g transform="translate(0,${i*(H+18)})">`+tx(6,14,caps[i],{size:13,anchor:'start'})+`<g transform="translate(18,16)">${inner(sv)}</g></g>`;});return svg(b,label,W+18,svgs.length*(H+18));}
// A rectangle (or trapezoid) with a semicircle on its left or right end, in data units.
function semiFig(a,b,d,left,labels,label){const k=Math.min(26,300/(b+2*a)),O=a*k+30,Y=v=>20+(a-v)*k,X=v=>O+v*k;let path,b2='';
 if(left){path=`M${X(0)},${Y(-a)} L${X(b)},${Y(-a)} L${X(b-d)},${Y(a)} L${X(0)},${Y(a)} A${a*k},${a*k} 0 0 0 ${X(0)},${Y(-a)}`;b2+=ln(X(0),Y(-a),X(0),Y(a),{dash:'5,4',w:1})+dot(X(0),Y(0))+ln(X(0),Y(0),X(-a*Math.SQRT1_2),Y(a*Math.SQRT1_2),{w:1});}
 else{path=`M${X(d)},${Y(a)} L${X(b)},${Y(a)} A${a*k},${a*k} 0 0 1 ${X(b)},${Y(-a)} L${X(0)},${Y(-a)} Z`;b2+=ln(X(b),Y(-a),X(b),Y(a),{dash:'5,4',w:1})+dot(X(b),Y(0))+ln(X(b),Y(0),X(b+a*Math.SQRT1_2),Y(a*Math.SQRT1_2),{w:1});}
 b2=`<path d="${path}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+b2;
 for(const [x,y,t,anc] of labels)b2+=tx(X(x),Y(y),t,{size:12,anchor:anc||'middle'});return svg(b2,label,X(b+a)+30,2*a*k+50);}

// A triangle with base B, left side L and right side Rr, each side labelled just outside its midpoint.
function triFig(L,B,Rr,lab,label,maxW=200,maxH=150){const [x,y]=apex(L,B,Rr),P=[[0,0],[B,0],[x,y]],cx=(B+x)/3,cy=y/3,off=0.09*Math.max(B,L,Rr),F=Fig();F.poly(P);
 [[P[2],P[0],lab[0]],[P[0],P[1],lab[1]],[P[1],P[2],lab[2]]].forEach(([p1,p2,t])=>{const mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2,dx=mx-cx,dy=my-cy,d=Math.hypot(dx,dy)||1;F.txt([mx+off*dx/d,my+off*dy/d-off*0.3],t);});return F.render(label,maxW,maxH);}
// Two drawings side by side.
function pair(a,b,label){const w=s=>Number((s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)||[])[1]),h=s=>Number((s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)||[])[2]);return svg(`<g>${inner(a)}</g><g transform="translate(${w(a)+20},${(h(a)-h(b))/2})">${inner(b)}</g>`,label,w(a)+w(b)+20,Math.max(h(a),h(b)));}

// ---------- recipes ----------
function build(c,h){const {int,pick}=h;let t;
const wrongOnly=(t,list)=>{const seen=new Set();return list.filter(x=>{const v=String(x.value);if(seen.has(v))return false;const r=check(t,v)||h.check(t,v);if(r.answerCorrect)return false;seen.add(v);return true;}).slice(0,3);};
switch(c.recipe){
// Batch AH-1
// Lesson 1
case 'ah-place-values3':{// a six-digit number; the values of three of its digits (each asked digit appears once)
 let d,o,u,v,w;do{d=[int(1,9),int(0,9),int(0,9),int(0,9),int(0,9),int(0,9)];o=int(0,5);[u,v,w]=[o,(o+2)%6,(o+4)%6];}while(!d[u]||!d[v]||!d[w]||[u,v,w].some(i=>d.filter(x=>x===d[i]).length>1));
 const val=i=>d[i]*10**(5-i),num=d.join('');
 t=n(`In the number ${num}: (a) What is the value of the digit ${d[u]}? (b) What is the value of the digit ${d[v]}? (c) What is the value of the digit ${d[w]}?`,[val(u),val(v),val(w)],`Each digit's value is the digit times its place: ${[u,v,w].map(i=>`${d[i]} is worth ${comma(val(i))}`).join('; ')}.`,{digits:d,asked:[u,v,w]});
 t.answer.display=[u,v,w].map(i=>comma(val(i))).join('; ');
 t.choices=wrongOnly(t,[{value:[u,v,w].map(i=>d[i]).join('; '),mistake:'Gave the digits themselves instead of their values'},{value:[u,v,w].map(i=>comma(val(i)*10)).join('; '),mistake:'Counted the places one too far to the left'},{value:[u,v,w].map(i=>comma(d[i]*10**i)).join('; '),mistake:'Counted the places from the left instead of from the ones place'}]);break;}
case 'ah-digits-from-places':{// eight or nine digits, all one digit except three named places
 const a=int(1,9),others=shuffle(int,[0,1,2,3,4,5,6,7,8,9].filter(x=>x!==a)),[b,cc,dd]=others,e=int(8,9),f=int(1,3),g=int(4,6),hh=int(7,e-1);
 const NM={8:'ten-millions',7:'millions',6:'hundred-thousands',5:'ten-thousands',4:'thousands',3:'hundreds',2:'tens',1:'ones'},digs=[];for(let p=e;p>=1;p--)digs.push(p===f?b:p===g?cc:p===hh?dd:a);
 const v=Number(digs.join(''));
 t=whole(`A number has ${words(e)} digits. All the digits are ${a} except the ${NM[hh]} digit, which is ${dd}, the ${NM[g]} digit, which is ${cc}, and the ${NM[f]} digit, which is ${b}. Use digits to write the number.`,v,`Write ${a} in every place, then put ${dd} in the ${NM[hh]} place, ${cc} in the ${NM[g]} place and ${b} in the ${NM[f]} place: ${comma(v)}.`,{a,b,c:cc,d:dd,e,f,g,h:hh});
 const sw=Number([...digs].reverse().join(''));t.choices=wrongOnly(t,[{value:comma(sw),mistake:'Counted the places from the left instead of from the ones place'},{value:comma(Number(digs.slice(1).join(''))),mistake:'Wrote one digit too few'},{value:comma(Number(digs.map(x=>x===dd?cc:x===cc?dd:x).join(''))),mistake:'Swapped two of the named digits'}]);break;}
case 'ah-place-value-one':{// a five-digit number; the value of one digit (asked digit appears once)
 let d,o;do{d=[int(1,9),int(0,9),int(0,9),int(0,9),int(0,9)];o=int(0,4);}while(!d[o]||d.filter(x=>x===d[o]).length>1);
 const p=4-o,v=d[o]*10**p;
 t=whole(`In the number ${d.join('')}, what is the value of the digit ${d[o]}?`,v,`${d[o]} is in the ${['ones','tens','hundreds','thousands','ten-thousands'][p]} place, so its value is ${comma(v)}.`,{digits:d,o});
 t.choices=wrongOnly(t,[{value:comma(d[o]*10**(p+1)),mistake:'Counted one place too many'},{value:comma(d[o]*10**Math.max(p-1,0)),mistake:'Counted one place too few'},{value:comma(d[o]*10**(p>=2?p-2:p+2)),mistake:'Counted the place from the wrong end'}]);break;}
case 'ah-standard-from-expanded':{// (d×10,000)+(e×1000)+(c×100)+(j×10)+(k×1), digits 2–9, d, e, c distinct
 let cc,d,e;do{cc=int(2,9);d=int(2,9);e=int(2,9);}while(cc===d||cc===e||d===e);const j=int(2,9),k=int(2,9),v=10000*d+1000*e+100*cc+10*j+k;
 t=whole(`Write the following number in standard notation: (${d} × 10,000) + (${e} × 1000) + (${cc} × 100) + (${j} × 10) + (${k} × 1)`,v,`Put each digit in its place: ${comma(v)}.`,{d,e,c:cc,j,k});
 t.choices=wrongOnly(t,[{value:String(d+e+cc+j+k),mistake:'Added the digits instead of their values'},{value:comma(100000*d+10000*e+1000*cc+100*j+k),mistake:'Shifted the first four digits one place to the left'},{value:comma(Number(`${k}${j}${cc}${e}${d}`)),mistake:'Wrote the digits in reverse order'}]);break;}
case 'ah-expanded7':case 'ah-expanded7-choice':{// a seven-digit number with one zero, in expanded notation
 const ch=c.recipe==='ah-expanded7-choice',PL=['1,000,000','100,000','10,000','1000','100','10','1'];let dg;
 if(!ch){let cc,d,e,g;do{cc=int(1,9);d=int(1,9);e=int(1,9);g=int(1,9);}while(cc===d||g===e);const o=int(1,3);dg=[int(1,9),o===3?0:int(1,9),o===2?0:cc,o===1?0:d,e,int(1,9),g];}
 else{const o=int(1,2);dg=[int(1,9),o===1?0:int(1,9),o===2?0:int(1,9),int(1,8),int(1,8),int(1,8),int(1,8)];}
 const terms=dg.map((x,i)=>[x,PL[i]]).filter(([x])=>x),show=list=>list.map(([x,p])=>`(${x} × ${p})`).join(' + '),key=show(terms);
 t={prompt:`${ch?'What is':'Write'} the number ${comma(Number(dg.join('')))} ${ch?'in expanded notation?':'in expanded notation.'} Write it as a sum of digit × place value, such as (3 × 100) + (4 × 10) + (5 × 1), leaving out any zero digit.`,answer:{kind:'expanded',terms:terms.map(([x,p])=>[x,p.replace(/,/g,'')]),value:key},solution:`Each nonzero digit times its place value: ${key}.`,parameters:{digits:dg}};
 const shift=terms.map(([x,p],i)=>[x,PL[PL.indexOf(p)+(i===terms.length-1?0:1)]||p]),miss=terms.slice(1);
 t.choices=wrongOnly(t,[{value:show(dg.map((x,i)=>[x,PL[i]])),mistake:'Included the zero digit as a term'},{value:show(miss),mistake:'Left out the millions digit'},{value:show(shift),mistake:'Gave some digits the place value of the next place to the right'}]);break;}
case 'ah-number-words':{// m million (1–20), then six more digits, in words
 const m=int(1,20),rest=int(1,9)*100000+int(1,9)*10000+int(0,9)*1000+int(0,9)*100+int(0,9)*10+int(0,9),v=m*1e6+rest,ref=words(v);
 t={prompt:`Use words to write the number ${comma(v)}.`,answer:{kind:'words',value:ref},solution:`Read each period, millions then thousands then ones: ${ref}.`,parameters:{v}};
 t.choices=wrongOnly(t,[{value:words(Math.floor(v/1000))+' thousand '+words(v%1000),mistake:'Read the millions and thousands periods as one number of thousands'},{value:ref.replace(' million',' billion'),mistake:'Named the first period billions'},{value:words(m)+' million '+words(Math.floor(rest/1000)),mistake:'Left out the last period'}]);break;}
case 'ah-words-to-digits':{// tens of millions, hundreds of thousands, ones, written in words
 const B=int(1,9)*1e7,a=int(200,900)*1000,b=int(2,999),v=B+a+b,nex=B/10+a+b,w=int(1,9)*10000*pick([-1,1]);
 const say=`${words(B)}, ${words(a)}, ${words(b)}`;
 t=whole(`What is ${say} in digits?`,v,`${words(B)} is ${comma(B)}; add ${comma(a)} and ${b}: ${comma(v)}.`,{B,a,b});
 t.choices=wrongOnly(t,[{value:comma(nex),mistake:`Wrote ${words(B)} as ${comma(B/10)}`},{value:comma(v+w),mistake:'Wrote the wrong ten-thousands digit'},{value:comma(nex+w),mistake:'Misread both the millions and the thousands'}]);break;}
case 'ah-add3':{const a=int(5,20),b=int(101,300),d=int(2501,5399),z=a+b+d;
 t=whole(`Add: ${a} + ${b} + ${comma(d)}`,z,`${a} + ${b} + ${comma(d)} = ${comma(z)}.`,{a,b,c:d});
 t.choices=wrongOnly(t,[{value:comma(z+100),mistake:'Carried one too many into the hundreds'},{value:comma(z-10),mistake:'Forgot to carry into the tens'},{value:comma(b+d),mistake:'Left out one of the addends'}]);break;}
case 'ah-money-add':{// $a + c¢ + $b, both dollar amounts with cents, the sum in dollars
 const v=c.variant==='b';let a1,b1,a2,b2,a3,b3;do{a2=int(1,8);b2=int(1,8);a3=int(1,9);b3=int(1,9);}while(a2+b2>=10||a3+b3>=10);
 a1=v?int(1,5):int(6,9);b1=v?int(5,9):int(1,4);const A=100*a1+10*a2+a3,B=100*b1+10*b2+b3,C=v?10*int(1,4)+int(1,9):10*int(5,9)+int(1,9),z=A+B+C;
 const order=v?`${cash(A)} + ${cash(B)} + ${C}¢`:`${cash(A)} + ${C}¢ + ${cash(B)}`;
 t=dec(`Add: ${order}. Give the answer in dollars.`,z,2,`Write ${C}¢ as ${cash(C)}, line up the decimal points and add: ${cash(z)}.`,{A,B,C});t.answer.display=cash(z);
 t.choices=wrongOnly(t,[{value:cash(z+10*pick([-1,1])),mistake:'Carried incorrectly into the dimes place'},{value:cash(z+100*pick([-1,1])),mistake:'Carried incorrectly into the dollars'},{value:cash(A+B+100*C),mistake:`Wrote ${C}¢ as $${C}.00`}]);break;}
case 'ah-column-add4':{const b=int(11,79),cc=int(2,99),d=int(11,89),e=int(2,99),z=b+cc+d+e;
 t=whole('Add.',z,`${b} + ${cc} + ${d} + ${e} = ${z}.`,{b,c:cc,d,e},stackFigure([String(b),String(cc),String(d),String(e)],'+',undefined,`${b} plus ${cc} plus ${d} plus ${e}, written in columns`));
 t.choices=wrongOnly(t,[{value:String(z-10),mistake:'Forgot to carry into the tens'},{value:String(z+10),mistake:'Carried one too many into the tens'},{value:String(z-e),mistake:'Left out the last addend'}]);break;}
case 'ah-column-add5d':{const a=int(10001,99999),b=int(10001,99999),cc=int(10001,99999),z=a+b+cc;
 t=whole('Add.',z,`${comma(cc)} + ${comma(b)} + ${comma(a)} = ${comma(z)}.`,{a,b,c:cc},stackFigure([comma(cc),comma(b),comma(a)],'+',undefined,`${comma(cc)} plus ${comma(b)} plus ${comma(a)}, written in columns`));
 t.choices=wrongOnly(t,[{value:comma(z-1000),mistake:'Forgot to carry into the thousands'},{value:comma(z+100),mistake:'Carried one too many into the hundreds'},{value:comma(z-10000),mistake:'Forgot to carry into the ten-thousands'}]);break;}
// Lesson 2
case 'ah-order-line':{// five distinct nonzero integers from −10 to 10, shown on a number line, not already in order
 let a;do{a=[];while(a.length<5){const x=int(-10,10);if(x&&!a.includes(x))a.push(x);}}while(a.every((x,i)=>!i||a[i-1]<x)||(a.includes(-10)&&a.includes(-9)));
 const s=[...a].sort((x,y)=>x-y),key=s.map(minus).join(', ');
 t={prompt:`Use the number line to arrange these integers in order from least to greatest: ${a.map(minus).join(', ')}. Separate the numbers with commas.`,answer:{kind:'int-sequence',values:s,value:key},solution:`Numbers increase from left to right on the number line: ${s.map(minus).join(' < ')}.`,parameters:{a},svg:dotLine(-10,10,a)};
 t.choices=wrongOnly(t,[{value:[...s].reverse().map(minus).join(', '),mistake:'Ordered from greatest to least'},{value:[...a].sort((x,y)=>Math.abs(x)-Math.abs(y)||x-y).map(minus).join(', '),mistake:'Ordered by distance from zero, ignoring the signs'},{value:a.map(minus).join(', '),mistake:'Copied the numbers in the order given'}]);break;}
case 'ah-order-six':case 'ah-order-five':{// signed numbers spread across bands, listed in one of ten orders
 const six=c.recipe==='ah-order-six',a=six?int(-400,-300):int(-500,-200),b=int(-199,-99),cc=six?int(-98,-1):int(-98,98),g=int(21,98),d=int(99,199),e=int(200,500);
 const vals=six?[a,b,cc,g,d,e]:[a,b,cc,d,e],given=shuffle(int,vals);if(given.every((x,i)=>!i||given[i-1]<x))given.reverse();
 const key=vals.map(minus).join(', ');
 t={prompt:`Arrange the following numbers in order from least to greatest: ${given.map(minus).join(', ')}. Separate the numbers with commas.`,answer:{kind:'int-sequence',values:vals,value:key},solution:`Negative numbers come first, the one farthest from zero least: ${vals.map(minus).join(' < ')}.`,parameters:{given}};
 t.choices=wrongOnly(t,[{value:[...vals].reverse().map(minus).join(', '),mistake:'Ordered from greatest to least'},{value:[...vals].sort((x,y)=>Math.abs(x)-Math.abs(y)).map(minus).join(', '),mistake:'Ordered by distance from zero, ignoring the signs'},{value:[...vals.filter(x=>x<0).sort((x,y)=>y-x),...vals.filter(x=>x>=0)].map(minus).join(', '),mistake:'Put the negative numbers in order of their digits, so −100 came before −300'}]);break;}
case 'ah-round-big':{// an eight-digit number rounded to the nearest hundred thousand or million
 const dg=[int(1,9),int(2,9),int(1,9),int(1,9),int(1,9),int(1,9),int(1,9),int(1,4)],v=Number(dg.join('')),j=int(1,2),P=10**(j+4),z=Math.round(v/P)*P,nm=j===1?'hundred thousand':'million';
 t=whole(`Round ${comma(v)} to the nearest ${nm}.`,z,`Look at the digit to the right of the ${nm}s place: ${comma(v)} rounds to ${comma(z)}.`,{v,j});
 t.choices=wrongOnly(t,[{value:comma(Math.floor(v/P)*P),mistake:'Cut off the digits instead of rounding'},{value:comma(Math.round(v/(P/10))*P/10),mistake:'Rounded to the place one to the right'},{value:comma(Math.round(v/(P*10))*P*10),mistake:'Rounded to the place one to the left'},{value:comma(z+P),mistake:'Rounded up one too many'},{value:comma(Math.round(v/(P/100))*P/100),mistake:'Rounded to the place two to the right'}]);break;}
case 'ah-round-5digit':{// a five-digit number to the nearest ten thousand or thousand
 const e=10000*int(1,9)+1000*int(1,9)+100*int(1,8)+10*int(1,8)+int(1,9),f=int(1,2),pl=f===1?10000:1000,pl2=f===1?1000:10000,z=Math.round(e/pl)*pl;
 t=whole(`Round ${comma(e)} to the nearest ${f===1?'ten thousand':'thousand'}.`,z,`Look at the digit to the right of the ${f===1?'ten-thousands':'thousands'} place: ${comma(e)} rounds to ${comma(z)}.`,{e,f});
 t.choices=wrongOnly(t,[{value:comma(Math.round(e/100)*100),mistake:'Rounded to the nearest hundred'},{value:comma(Math.round(e/10)*10),mistake:'Rounded to the nearest ten'},{value:comma(Math.round(e/pl2)*pl2),mistake:`Rounded to the nearest ${f===1?'thousand':'ten thousand'}`}]);break;}
// Lesson 3
case 'ah-subtract3':{const a=int(6,9),b=int(1,4),cc=int(1,9),d=int(1,3),e=int(5,9),f=int(1,9),x=100*a+10*b+cc,y=100*d+10*e+f,z=x-y;
 t=whole(`Subtract: ${x} − ${y}`,z,`Regroup a hundred as ten tens: ${x} − ${y} = ${z}.`,{x,y});
 t.choices=wrongOnly(t,[{value:String(z+100),mistake:'Regrouped but did not reduce the hundreds digit'},{value:String(100*(a-d)+10*Math.abs(b-e)+Math.abs(cc-f)),mistake:'Subtracted the smaller digit from the larger in each column'},{value:String(x+y),mistake:'Added instead of subtracting'}]);break;}
case 'ah-subtract-column':{let a,b,cc,d,e,f;do{a=int(2,9);b=int(1,a-1);cc=int(2,9);d=int(0,cc-1);e=int(1,9);f=int(0,e-1);}while(d===f);
 const x=100*a+10*d+f,y=100*b+10*cc+e,z=x-y;
 t=whole('Subtract.',z,`Regroup across the columns: ${x} − ${y} = ${z}.`,{x,y},stackFigure([String(x),String(y)],'−',undefined,`${x} minus ${y}, written in columns`));
 t.choices=wrongOnly(t,[{value:String(100*(a-b)+10*Math.abs(d-cc)+Math.abs(f-e)),mistake:'Subtracted the smaller digit from the larger in each column'},{value:String(z+100),mistake:'Regrouped but did not reduce the hundreds digit'},{value:String(z+10),mistake:'Regrouped but did not reduce the tens digit'}]);break;}
case 'ah-money-subtract-cents':{// $a − b¢ with a from $5.00 to $7.00 in nickels
 const A=500+5*int(0,40),B=int(11,99),z=A-B;
 t=dec(`Subtract: ${cash(A)} − ${B}¢. Give the answer in dollars.`,z,2,`Write ${B}¢ as ${cash(B)}: ${cash(A)} − ${cash(B)} = ${cash(z)}.`,{A,B});t.answer.display=cash(z);
 t.choices=wrongOnly(t,[{value:cash(A+B),mistake:'Added instead of subtracting'},{value:cash(z-15),mistake:'Regrouping slip in the dimes and pennies'},{value:cash(z+100*pick([-1,1])),mistake:'Regrouping slip in the dollars'}]);break;}
case 'ah-missing-addend':{const a=int(201,989),b=int(101,a-100),m=upper(int,'foil');
 t=whole(`Find the missing number: ${m} + ${b} = ${a}`,a-b,`${m} = ${a} − ${b} = ${a-b}.`,{a,b,letter:m});
 t.choices=wrongOnly(t,[{value:String(a+b),mistake:'Added instead of subtracting'},{value:String(a-b+10),mistake:'Regrouping slip in the tens'},{value:String(a-b-100),mistake:'Regrouping slip in the hundreds'}]);break;}
case 'ah-missing-subtrahend':{// a − M = d, M from 301 to 499
 const a=int(555,999),M=int(301,499),d=a-M,m=upper(int,'oil');
 t=whole(`Find the missing number: ${a} − ${m} = ${d}`,M,`${m} = ${a} − ${d} = ${M}.`,{a,d,letter:m});
 t.choices=wrongOnly(t,[{value:String(a+d),mistake:'Added the two numbers'},{value:String(M+10),mistake:'Regrouping slip in the tens'},{value:String(d),mistake:'Gave the difference instead of the missing number'}]);break;}
case 'ah-missing-minuend':{// M − b = d
 const A=int(333,999),b=int(111,299),d=A-b,m=upper(int,'oil');
 t=whole(`Find the missing number: ${m} − ${b} = ${d}`,A,`${m} = ${d} + ${b} = ${A}.`,{b,d,letter:m});
 t.choices=wrongOnly(t,[{value:String(d-b),mistake:'Subtracted instead of adding'},{value:String(A+10),mistake:'Carried one too many into the tens'},{value:String(A-100),mistake:'Forgot to carry into the hundreds'}]);break;}
case 'ah-missing-addend-column':{// a + M = c written in columns; c a multiple of 10
 const a=int(110,860),lo=Math.floor(a/10)*10+100,cc=lo+10*int(0,(990-lo)/10),m=upper(int,'oil'),z=cc-a;
 t=whole(`Find the missing number ${m}.`,z,`${m} = ${cc} − ${a} = ${z}.`,{a,c:cc,letter:m},stackFigure([String(a),m],'+',cc,`${a} plus ${m} equals ${cc}, written in columns`));
 t.choices=wrongOnly(t,[{value:String(cc+a),mistake:'Added instead of subtracting'},{value:String(z+10),mistake:'Regrouping slip in the tens'},{value:String(z-100),mistake:'Regrouping slip in the hundreds'}]);break;}
case 'ah-missing-column-mixed':{// a − M = c or a + M = c, written in columns
 const C=int(111,299),A=int(333,999),m=upper(int,'oil'),sub=int(1,2)===1;let top,bottom,z;if(sub){top=A;bottom=A-C;z=C;}else{top=A-C;bottom=A;z=C;}
 const op=sub?'−':'+',fig=stackFigure([String(top),m],op,bottom,`${top} ${sub?'minus':'plus'} ${m} equals ${bottom}, written in columns`);
 t=whole(`Find the missing number ${m}.`,z,sub?`${m} = ${top} − ${bottom} = ${z}.`:`${m} = ${bottom} − ${top} = ${z}.`,{top,bottom,sub},fig);
 t.choices=wrongOnly(t,[{value:String(top+bottom),mistake:'Added the two numbers shown'},{value:String(z+100),mistake:'Regrouping slip in the hundreds'},{value:String(top+bottom-100),mistake:'Added the numbers shown and slipped in the hundreds'}]);break;}
// Lesson 4
case 'ah-multiply-3x2':{let a,b;do{a=int(117,754);b=int(21,87);}while(a%10===0||b%10===0);const z=a*b;
 t=whole(`Multiply: ${a} × ${b}`,z,`${a} × ${b} = ${comma(z)}.`,{a,b});
 t.choices=wrongOnly(t,[{value:comma(a*(b%10)+a*Math.floor(b/10)),mistake:'Did not shift the second partial product one place left'},{value:comma(z+100),mistake:'Carrying slip in the hundreds'},{value:comma(z-a),mistake:'Multiplied by one less than the second factor'}]);break;}
case 'ah-multiply-three':{const cc=int(1,9)+10*int(1,3),d=int(2,9),g=int(1,9)+10*int(6,9),z=cc*d*g,ord=int(1,2)===1?[g,d,cc]:[cc,d,g];
 t=whole(`Multiply: ${ord.join(' × ')}`,z,`${ord[0]} × ${ord[1]} = ${ord[0]*ord[1]}; ${ord[0]*ord[1]} × ${ord[2]} = ${comma(z)}.`,{f:ord});
 t.choices=wrongOnly(t,[{value:comma(cc*g),mistake:`Left out the factor ${d}`},{value:comma(cc*d+g),mistake:'Added the last factor instead of multiplying'},{value:comma(z+1000),mistake:'Carrying slip in the thousands'}]);break;}
case 'ah-money-times-tens':{let A;do{A=int(101,999);}while(A%100===0);const f=10*int(2,9),z=A*f;
 t=dec(`Multiply: ${f} × ${cash(A)}. Give the answer in dollars.`,z,2,`${f} × ${cash(A)} = ${cash(z)}.`,{A,f});t.answer.display=cash(z);
 t.choices=wrongOnly(t,[{value:cash(A+100*f),mistake:'Added instead of multiplying'},{value:cash(A*(f+1)),mistake:'Multiplied by one more than the factor'},{value:cash(A*(10*f-1)),mistake:'Misplaced the zero of the factor'}]);break;}
case 'ah-money-divide':{let z,a,B;do{z=int(200,500);a=int(5,10);B=a*z;}while(B%100===0);
 t=dec(`Divide: ${cash(B)} ÷ ${a}. Give the answer in dollars.`,z,2,`${cash(B)} ÷ ${a} = ${cash(z)} because ${a} × ${cash(z)} = ${cash(B)}.`,{B,a});t.answer.display=cash(z);
 t.choices=wrongOnly(t,[{value:cash(z*10),mistake:'Placed the decimal point one place too far right'},{value:cash(Math.round(z/10)),mistake:'Placed the decimal point one place too far left'},{value:cash(z+a),mistake:'Added the divisor to the quotient'}]);break;}
case 'ah-divide-remainder':{// c ÷ b, quotient 26–65, divisor 38–75, with or without a remainder
 const rem=int(1,2)===2?int(1,35):0,a=int(26,65),b=int(38,75),cc=a*b+rem,key=rem?`${a} R ${rem}`:String(a);
 t=rem?{prompt:`Divide: ${comma(cc)} ÷ ${b}. Write a remainder with R, for example 12 R 5.`,answer:{kind:'quot-rem',q:a,r:rem,value:key},solution:`${b} × ${a} = ${comma(a*b)} and ${comma(cc)} − ${comma(a*b)} = ${rem}, so the answer is ${key}.`,parameters:{c:cc,b}}:whole(`Divide: ${comma(cc)} ÷ ${b}`,a,`${b} × ${a} = ${comma(cc)}.`,{c:cc,b});
 t.choices=wrongOnly(t,rem?[{value:`${a+1} R ${rem}`,mistake:'Estimated one too many in the quotient'},{value:`${a-10} R ${rem}`,mistake:'Wrote the wrong tens digit in the quotient'},{value:String(a),mistake:'Left off the remainder'}]:[{value:String(a+1),mistake:'Estimated one too many in the quotient'},{value:String(a-10),mistake:'Wrote the wrong tens digit in the quotient'},{value:`${a-15} R ${b}`,mistake:'Left a remainder as large as the divisor'}]);break;}
case 'ah-missing-factor':{// b × N = e (or N · b = e)
 const dotf=c.variant==='dot',b=dotf?int(12,20):int(11,19),z=dotf?int(9,18):int(11,21),e=b*z,m=upper(int,'oil');
 t=whole(`Find the missing number: ${dotf?`${m} · ${b}`:`${b} × ${m}`} = ${e}`,z,`${m} = ${e} ÷ ${b} = ${z}.`,{b,e,letter:m});
 t.choices=wrongOnly(t,[{value:String(e-b),mistake:'Subtracted instead of dividing'},{value:String(z+1),mistake:'Division slip by one'},{value:comma(e*b),mistake:'Multiplied instead of dividing'}]);break;}
case 'ah-missing-divisor':{// a / M = b
 let b=int(4,16);if(b===5)b=3;if(b===10)b=7;const z=int(8,16),a=b*z,m=upper(int,'foile');
 t=whole(`Find the missing number: ${a}/${m} = ${b}`,z,`${m} = ${a} ÷ ${b} = ${z}.`,{a,b,letter:m});
 t.math=S.math(`<mfrac><mn>${a}</mn><mi>${m}</mi></mfrac><mo>=</mo><mn>${b}</mn>`);
 t.choices=wrongOnly(t,[{value:String(a*b),mistake:'Multiplied instead of dividing'},{value:String(a-b),mistake:'Subtracted instead of dividing'},{value:String(z+1),mistake:'Division slip by one'}]);break;}
case 'ah-missing-dividend':{// M ÷ b = a
 const b=int(3,9),a=int(3,18),m=upper(int,'foile');
 t=whole(`Find the missing number: ${m} ÷ ${b} = ${a}`,a*b,`${m} = ${a} × ${b} = ${a*b}.`,{a,b,letter:m});
 t.choices=wrongOnly(t,[{value:String(a+b),mistake:'Added instead of multiplying'},{value:String(a),mistake:'Gave the quotient instead of the missing dividend'},{value:String(a*b-b),mistake:'Multiplied by one less than the divisor'}]);break;}
// Lesson 5
case 'ah-word-pages':{const k=int(0,5),nm=['Hewitt','Hettie','Hilton','Honor','Howell','Hailey'][k],pn=k%2?'she':'he',b=int(101,215),z=int(90,150),cc=b+z;
 t=whole(`When ${nm} finished reading ${b} pages of a ${cc}-page book, ${pn} still had how many pages to read?`,z,`Pages left = ${cc} − ${b} = ${z}.`,{b,c:cc});
 t.choices=wrongOnly(t,[{value:String(cc+b),mistake:'Added instead of subtracting'},{value:String(z+10),mistake:'Regrouping slip in the tens'},{value:String(b),mistake:'Gave the pages already read'}]);break;}
case 'ah-word-runners':{let x,y;do{x=100*int(6,8)+10*int(2,9)+int(1,9);y=10*int(12,45)+int(1,9);}while(x%10+y%10<=10||Math.floor(x%100/10)*10+Math.floor(y/10)*10<=100);const z=x+y;
 t=whole(`There were ${x} runners preregistered for a race. More runners signed up the day of the race. There were ${comma(z)} runners in the race. How many runners signed up the day of the race?`,y,`Day-of runners = ${comma(z)} − ${x} = ${y}.`,{x,z});
 t.choices=wrongOnly(t,[{value:comma(z+x),mistake:'Added instead of subtracting'},{value:String(y+10),mistake:'Regrouping slip in the tens'},{value:String(y+100),mistake:'Regrouping slip in the hundreds'}]);break;}
case 'ah-word-price':{// price reduced by b thousand + d dollars; final a thousand + c dollars
 const a=int(4,9),b=int(1,a-2)*1000,fix=x=>x%10===0?x+11:x,cc=fix(int(101,999)),d=fix(int(101,999)),z=a*1000+b+cc+d;
 t=whole(`A price was reduced ${words(b)}, ${words(d)} dollars. The final price was ${words(a*1000)}, ${words(cc)} dollars. What was the original price in dollars?`,z,`Original = final + reduction = ${comma(a*1000+cc)} + ${comma(b+d)} = $${comma(z)}.`,{a,b,c:cc,d});t.answer.display='$'+comma(z);
 t.choices=wrongOnly(t,[{value:'$'+comma(a*1000+cc-b-d),mistake:'Subtracted the reduction instead of adding it back'},{value:'$'+comma(z+1000),mistake:'Carrying slip in the thousands'},{value:'$'+comma(a*1000+cc),mistake:'Gave the final price'}]);break;}
case 'ah-word-lengthen':{let a,b;do{a=int(210,590);b=int(41,95);}while(a%5===0||b%5===0);const g=int(0,3),hh=a+b;
 const ctx=[['Pier 14','the pier','port authorities want','feet','ft'],['Interstate 30','Interstate 30','highway commission wants','miles','mi'],['An airport runway','the airport runway','airport commission wants','yards','yd'],['A parking strip','the parking strip','school board wants','feet','ft']][g];
 t=whole(`${ctx[0]} is ${a} ${ctx[3]} long. By how many ${ctx[3]} must ${ctx[1]} be lengthened if the ${ctx[2]} to make it ${hh} ${ctx[3]} long?`,b,`${hh} − ${a} = ${b} ${ctx[4]}.`,{a,h:hh,g});
 t.choices=wrongOnly(t,[{value:String(b+10*int(2,5)),mistake:'Regrouping slip in the tens'},{value:String(b-10),mistake:'Regrouping slip in the tens'},{value:String(b+100),mistake:'Regrouping slip in the hundreds'}]);break;}
// Lesson 6
case 'ah-decimal-words':{// either a number with three decimal places or a seven-digit whole number with hundred-thousandths
 const big=int(0,1)===1;let A,B,C,shown,ref;if(!big){do{A=int(100112,333999);}while(A%10===0);shown=ds(A,3);ref=decWords(Math.floor(A/1000),A%1000,3);}else{B=int(1111111,9999999);do{C=int(11111,99999);}while(C%10===0);shown=ds(B*100000+C,5);ref=decWords(B,C,5);}
 const whole=big?B:Math.floor(A/1000),frac=big?C:A%1000,k=big?5:3;
 t={prompt:`Use words to write this number: ${shown}`,answer:{kind:'words',value:ref},solution:`Read the whole number, say "and" for the decimal point, then read the decimal digits and name the last place: ${ref}.`,parameters:{big,A,B,C}};
 t.choices=wrongOnly(t,[{value:ref.replace(' and ',' '),mistake:'Left out "and" for the decimal point'},{value:decWords(whole,frac,k-1),mistake:'Named the wrong last place'},{value:`${words(whole)} point ${words(frac)}`,mistake:'Read the decimal part as a whole number after "point"'}]);break;}
case 'ah-words-to-decimals':{// (a) whole and hundredths; (b) about 100–200 and thousandths
 let a,b;do{a=int(21,99);b=int(1,99);}while(a%10===0||b%10===0);const z1=100*a+b,cc=int(1,9),d=int(1,9),e=int(1,9),z2=1000*(100+cc+10*d+e)+100*int(1,9)+10*int(1,9)+int(1,9);
 t=n(`Use digits and a decimal point to write these numbers: (a) ${decWords(a,b,2)} (b) ${decWords(Math.floor(z2/1000),z2%1000,3)}`,[R(z1,100),R(z2,1000)],`"and" marks the decimal point; the last place named tells how many decimal places: (a) ${ds(z1,2)}; (b) ${ds(z2,3)}.`,{z1,z2},'decimal');
 t.answer.display=`${ds(z1,2)}; ${ds(z2,3)}`;
 t.choices=wrongOnly(t,[{value:`${ds(z1,3)}; ${ds(z2,4)}`,mistake:'Wrote one decimal place too many'},{value:`${a}.${String(b).padStart(3,'0')}; ${ds(z2,3)}`,mistake:'Used thousandths instead of hundredths in (a)'},{value:`${ds(z1,2)}; ${Math.floor(z2/1000)}${z2%1000}`,mistake:'Left out the decimal point in (b)'}]);break;}
case 'ah-ten-thousandths':{let b,cc;do{b=int(11,99);}while(b%10===0);do{cc=int(111,999);}while(cc%10===0);const B=b*1000,N=B*10000+cc;
 t=dec(`What is the numeric form of ${words(B)} and ${words(cc)} ten-thousandths?`,N,4,`"and" marks the decimal point and ten-thousandths need four decimal places: ${ds(N,4)}.`,{B,c:cc});
 t.choices=wrongOnly(t,[{value:ds(B+cc,4),mistake:'Treated both parts as ten-thousandths'},{value:ds(B*1000+cc,3),mistake:'Used thousandths instead of ten-thousandths'},{value:ds((B+cc)*1000+1,3),mistake:'Added the two parts as whole numbers'}]);break;}
case 'ah-decimal-add2':{const A=int(6,20)*1000+int(49,999),D=int(49,999),z=A+D;
 t=dec(`Add: ${ds(A,3)} + ${ds(D,3)}`,z,3,`Line up the decimal points: ${ds(A,3)} + ${ds(D,3)} = ${ds(z,3)}.`,{A,D});
 t.choices=wrongOnly(t,[{value:ds(z+1000,3),mistake:'Carried one too many into the ones'},{value:ds(z-100,3),mistake:'Forgot to carry into the tenths'},{value:ds(A+D*10,3),mistake:'Did not line up the decimal points'}]);break;}
case 'ah-decimal-subtract':{const b=10*int(1,9),a=int(555,997),cc=int(11,99);let d=int(b+1,99);if(d%10===0)d+=int(1,9);const A=100*a+b,C=100*cc+d,z=A-C;
 t=dec(`Subtract: ${ds(A,2)} − ${ds(C,2)}`,z,2,`Write ${ds(A,2)} as ${ds(A,2,{keep:2})} and subtract: ${ds(z,2)}.`,{A,C});
 t.choices=wrongOnly(t,[{value:ds(z+100,2),mistake:'Regrouping slip in the ones'},{value:ds(z+20,2),mistake:'Regrouping slip in the tenths'},{value:ds(A+C,2),mistake:'Added instead of subtracting'}]);break;}
case 'ah-decimal-missing-subtrahend':{const a=int(111,999),cc=int(a-30,a-5),N1=100*a+int(11,55),N2=100*cc+int(56,99),z=N1-N2,m=upper(int,'oil');
 t=dec(`Find the missing number: ${ds(N1,2)} − ${m} = ${ds(N2,2)}`,z,2,`${m} = ${ds(N1,2)} − ${ds(N2,2)} = ${ds(z,2)}.`,{N1,N2,letter:m});
 t.choices=wrongOnly(t,[{value:ds(N1+N2,2),mistake:'Added instead of subtracting'},{value:ds(z+100,2),mistake:'Regrouping slip in the ones'},{value:ds(N2-N1+200,2),mistake:'Subtracted the smaller digit from the larger in the decimal places'}]);break;}
case 'ah-decimal-add4':{const A=10*int(111,999)+int(1,9),B=10*(11+2*int(0,44)),C=10*int(11111,55555)+int(1,5),D=10*int(111,777)+int(1,7),z=A+B+C+D;
 t=dec(`Add: ${ds(A,3)} + ${ds(B,3)} + ${ds(C,3)} + ${ds(D,3)}`,z,3,`Line up the decimal points and add: ${ds(z,3)}.`,{A,B,C,D});
 t.choices=wrongOnly(t,[{value:ds(z+1000*pick([-1,1]),3),mistake:'Carrying slip in the ones'},{value:ds(z+100*pick([-1,1]),3),mistake:'Carrying slip in the tenths'},{value:ds(A+B/10+C+D,3),mistake:'Lined up the last digits instead of the decimal points'}]);break;}
case 'ah-decimal-subtract-choice':{const AP=1000*int(6,10)+10*int(9,55),CP=1000*int(0,2)+int(99,999),z=AP-CP;
 t=dec(`Subtract: ${ds(AP,3)} − ${ds(CP,3)}`,z,3,`Write ${ds(AP,3)} as ${ds(AP,3,{keep:3})} and subtract: ${ds(z,3)}.`,{AP,CP});
 t.choices=wrongOnly(t,[{value:ds(z+1000*((AP%1000)>CP?1:-1),3),mistake:'Regrouping slip in the ones'},{value:ds(z+100*pick([-1,1]),3),mistake:'Regrouping slip in the tenths'},{value:ds(z+10*pick([-1,1]),3),mistake:'Regrouping slip in the hundredths'}]);break;}
case 'ah-round-decimal-place':{// a number with six decimal places, rounded to the hundredth, thousandth, ten-thousandth or hundred-thousandth
 let N;do{N=int(111,9999)*1e6+int(1,999999);}while(N%10===0);const k=int(2,5),nm=['','','hundredth','thousandth','ten-thousandth','hundred-thousandth'][k],z=Math.round(N/10**(6-k));
 t=dec(`Round ${ds(N,6)} to the nearest ${nm}.`,z,k,`Look at the digit after the ${nm}s place: ${ds(N,6)} rounds to ${ds(z,k,{keep:k})}.`,{N,k});t.answer.display=ds(z,k,{keep:k});
 t.choices=wrongOnly(t,[{value:ds(Math.floor(N/10**(6-k)),k,{keep:k}),mistake:'Cut off the digits instead of rounding'},{value:ds(Math.round(N/10**(5-k)),k+1,{keep:k+1}),mistake:'Rounded to the next place to the right'},{value:ds(Math.round(N/10**(7-k)),k-1,{keep:k-1}),mistake:'Rounded to the next place to the left'},{value:ds(z+1,k,{keep:k}),mistake:'Increased the last kept digit although the next digit is less than 5'},{value:ds(z-1,k,{keep:k}),mistake:'Decreased the last kept digit when rounding'}]);break;}
case 'ah-round-two-places':{let N;do{N=int(1111,9999)*1000+int(1,999);}while(N%10===0);const z=Math.round(N/10);
 t=dec(`Round ${ds(N,3)} to two decimal places.`,z,2,`Look at the thousandths digit: ${ds(N,3)} rounds to ${ds(z,2,{keep:2})}.`,{N});t.answer.display=ds(z,2,{keep:2});
 t.choices=wrongOnly(t,[{value:ds(z+1,2,{keep:2}),mistake:'Rounded the hundredths digit the wrong way'},{value:ds(Math.round(N/10000)*1000,2,{keep:2}),mistake:'Rounded to the nearest ten'},{value:ds(Math.round(N/100),1,{keep:1}),mistake:'Rounded to one decimal place'},{value:ds(z-1,2,{keep:2}),mistake:'Rounded the hundredths digit the wrong way'},{value:ds(N,3,{keep:3}),mistake:'Did not round'}]);break;}
// Lesson 7
case 'ah-decimal-multiply':{const AW=10*int(11,99)+int(1,9),G=10*int(22,89)+int(2,8),z=AW*G;
 t=dec(`Multiply: ${ds(AW,2)} × ${ds(G,1)}`,z,3,`Multiply ${AW} × ${G} = ${comma(AW*G)}, then place the decimal point three places from the right: ${ds(z,3)}.`,{AW,G});
 t.choices=wrongOnly(t,[{value:ds(z,2),mistake:'Counted two decimal places instead of three'},{value:ds(z,4),mistake:'Counted four decimal places instead of three'},{value:ds(AW*10+G*10,3),mistake:'Added instead of multiplying'}]);break;}
case 'ah-decimal-missing-dividend':{const Dt=10*int(5,16)+int(1,9),e=int(4,15),m=upper(int,'foileh');
 t=dec(`Find the missing number: ${m}/${ds(Dt,1)} = ${e}`,Dt*e,1,`${m} = ${ds(Dt,1)} × ${e} = ${ds(Dt*e,1)}.`,{Dt,e,letter:m});t.math=S.math(`<mfrac><mi>${m}</mi><mn>${ds(Dt,1)}</mn></mfrac><mo>=</mo><mn>${e}</mn>`);
 t.choices=wrongOnly(t,[{value:ds(Dt*e,2),mistake:'Placed the decimal point one place too far left'},{value:ds(Dt+10*e,1),mistake:'Added instead of multiplying'},{value:ds(Dt*e*10,1),mistake:'Placed the decimal point one place too far right'}]);break;}
case 'ah-decimal-multiply-small':{const AP=10*int(11,99)+int(1,9),BP=10*int(51,499)+int(1,9),z=AP*BP;
 t=dec(`Multiply: ${ds(AP,2)} × ${ds(BP,4)}`,z,6,`Multiply ${AP} × ${BP} = ${comma(z)}, then place the decimal point six places from the right: ${ds(z,6)}.`,{AP,BP});
 t.choices=wrongOnly(t,[{value:ds(z,7),mistake:'Counted one decimal place too many'},{value:ds(z,8),mistake:'Counted two decimal places too many'},{value:ds(z,4),mistake:'Counted two decimal places too few'}]);break;}
// Lesson 7: division
case 'ah-divide-by-hundredths':{let a,b;do{a=int(2,9);b=int(121,199);}while(b%a===0||b%10===0);
 t=dec(`Divide: ${ds(a*b,3)} ÷ ${ds(a,2)}`,b,1,`Multiply both by 100: ${ds(a*b,1)} ÷ ${a} = ${ds(b,1)}.`,{a,b});
 t.choices=wrongOnly(t,[{value:ds(b,2),mistake:'Did not move the decimal point in the dividend'},{value:ds(b,0),mistake:'Moved the decimal point in the dividend one place too many'},{value:ds(b,3),mistake:'Divided without moving either decimal point, then misplaced it'}]);break;}
case 'ah-divide-by-4-8':{const a=pick([4,8]);let b;do{b=int(11,99);}while((10*b)%a===0);
 t=n(`Divide: ${b} ÷ ${a}. Write the answer as a decimal.`,R(b,a),`Write ${b} as ${b}.000 and divide: ${b} ÷ ${a} = ${U.dec(R(b,a))}.`,{a,b},'decimal');
 const q=Math.floor(b/a),r=b%a;t.choices=wrongOnly(t,[{value:`${q}.${r}`,mistake:'Wrote the remainder as the decimal part'},{value:U.dec(R(a,b)).slice(0,6),mistake:'Divided the divisor by the dividend'},{value:U.dec(R(b,a*10)),mistake:'Placed the decimal point one place too far left'}]);break;}
case 'ah-decimal-missing-factor':{let Dt,e;do{Dt=10*int(30,70)+int(1,9);e=int(4,15);}while((Dt*e)%10===0);const m=upper(int,'foileh');
 t=dec(`Find the missing number: ${e} × ${m} = ${ds(Dt*e,1)}`,Dt,1,`${m} = ${ds(Dt*e,1)} ÷ ${e} = ${ds(Dt,1)}.`,{Dt,e,letter:m});
 t.choices=wrongOnly(t,[{value:ds(Dt,2),mistake:'Placed the decimal point one place too far left'},{value:ds(Dt*e-10*e,1),mistake:'Subtracted instead of dividing'},{value:ds(Dt+10,1),mistake:'Division slip in the ones'}]);break;}
case 'ah-divide-round':{let A,B;do{A=int(21,999);B=int(49,999);}while(A===B);const z=Math.round(B/10);
 t=dec(`Divide, and then round the answer to two decimal places: ${ds(A*B,6)} ÷ ${ds(A,3)}`,z,2,`${ds(A*B,6)} ÷ ${ds(A,3)} = ${ds(B,3)}, which rounds to ${ds(z,2,{keep:2})}.`,{A,B});t.answer.display=ds(z,2,{keep:2});
 t.choices=wrongOnly(t,[{value:ds(B,3),mistake:'Did not round'},{value:ds(Math.floor(B/10),2,{keep:2}),mistake:'Cut off the digits instead of rounding'},{value:ds(Math.round(B),2,{keep:2}),mistake:'Placed the decimal point two places too far right'},{value:ds(z+1,2,{keep:2}),mistake:'Rounded up although the thousandths digit is less than 5'},{value:ds(z*10,2,{keep:2}),mistake:'Placed the decimal point one place too far right'}]);break;}
case 'ah-divide-by-tenths':{let A,b,cc,Z;do{A=int(3,7);b=int(2,9);cc=int(1,Math.floor(90/A));Z=10*b+cc;}while((A===7&&b===2&&cc===1)||(A*Z)%100===0);
 t=dec(`Divide: ${ds(A*Z,2)} ÷ ${ds(A,1)}`,Z,1,`Multiply both by 10: ${ds(A*Z,1)} ÷ ${A} = ${ds(Z,1)}.`,{A,Z});
 t.choices=wrongOnly(t,[{value:ds(Z,0),mistake:'Moved the decimal point one place too far right'},{value:ds(Z,2),mistake:'Moved the decimal point one place too far left'},{value:ds(Z,3),mistake:'Did not move the decimal points and misplaced the point in the quotient'}]);break;}
case 'ah-estimate-product':{// (c ± f)/10^d × (a ± e)/10^b: round each to one nonzero digit, then multiply exactly
 let F,E;do{F=int(-29,29);}while(!F);do{E=int(-3,3);}while(!E);const cc=10*int(2,9),d=int(0,1),a=int(3,9),b=int(0,2),B1=10*cc+F,B2=10*a+E,k1=1+d,k2=1+b;
 const est=[a*cc,b+d],ex=[B1*B2,k1+k2];
 t=n(`Estimate by rounding each number to one nonzero digit, then multiply exactly: ${ds(B1,k1)} × ${ds(B2,k2)}. Give the estimate and the exact product, separated by a semicolon.`,[R(est[0],10**est[1]),R(ex[0],10**ex[1])],`Estimate: ${ds(cc,d)} × ${ds(a,b)} = ${ds(est[0],est[1])}. Exact: ${ds(B1,k1)} × ${ds(B2,k2)} = ${ds(ex[0],ex[1])}.`,{B1,B2,k1,k2},'decimal');
 t.answer.display=`≈${ds(est[0],est[1])}; ${ds(ex[0],ex[1])}`;
 t.choices=wrongOnly(t,[{value:`≈${ds(est[0],est[1]-1)}; ${ds(ex[0],ex[1]-1)}`,mistake:'Placed the decimal point one place too far right in both'},{value:`≈${ds(est[0],est[1])}; ${ds(ex[0],ex[1]-1)}`,mistake:'Placed the decimal point one place too far right in the exact product'},{value:`≈${ds(est[0]+cc,est[1])}; ${ds(ex[0],ex[1])}`,mistake:'Rounded one factor up instead of to the nearest digit'}]);break;}
case 'ah-estimate-product2':{// a.bb × a small decimal: round each to one nonzero digit, then multiply exactly
 let a,b,d,cc,len,lead,next;do{a=int(11,99);b=int(11,99);d=int(0,2);len=4-d;cc=int(10**(len-1),len===4?9499:10**len-1);lead=Math.floor(cc/10**(len-1));next=Math.floor(cc/10**(len-2))%10;}while(a%10===5||b%10===0||cc%10===0||next===5||(lead===9&&next>5)||(100*a+b)*cc>9999999);
 const e1=Math.round(a/10),e2=Math.round(cc/10**(len-1)),N1=100*a+b,estN=10*e1*e2,estK=4-len,exN=N1*cc,exK=5;
 t=n(`Estimate by rounding each number to one nonzero digit, then multiply exactly: ${ds(N1,2)} × ${ds(cc,3)}. Give the estimate and the exact product, separated by a semicolon.`,[R(estN,10**estK),R(exN,10**exK)],`Estimate: ${10*e1} × ${ds(e2*10**(len-1),3)} = ${ds(estN,estK)}. Exact: ${ds(N1,2)} × ${ds(cc,3)} = ${ds(exN,exK)}.`,{N1,c:cc},'decimal');
 t.answer.display=`≈${ds(estN,estK)}; ${ds(exN,exK)}`;
 t.choices=wrongOnly(t,[{value:`≈${ds(estN*10,estK)}; ${ds(exN*10,exK)}`,mistake:'Placed the decimal point one place too far right in both'},{value:`≈${ds(10*(e1+1)*e2,estK)}; ${ds(exN,exK)}`,mistake:'Rounded the first factor up instead of to the nearest ten'},{value:`≈${ds(10*e1*(e2+1),estK)}; ${ds(exN,exK)}`,mistake:'Rounded the second factor up instead of to the nearest digit'}]);break;}
// Lesson 8
case 'ah-times-power10':{let b,cc;do{b=int(3,4);cc=int(2,3);}while(b===cc);const a=int(23222222,49999999);
 t=dec(`Multiply: ${ds(a,b)} × ${comma(10**cc)}`,a,b-cc,`Multiplying by ${comma(10**cc)} moves the decimal point ${cc} places to the right: ${ds(a,b-cc)}.`,{a,b,c:cc});
 t.choices=wrongOnly(t,[{value:ds(a,b-cc+1),mistake:'Moved the decimal point one place too few'},{value:ds(a,b-cc-1),mistake:'Moved the decimal point one place too many'},{value:ds(a,b+cc),mistake:'Moved the decimal point to the left'}]);break;}
case 'ah-divide-power10':{const A=int(3550,9950),b=int(1,2),cc=b===1?2:3;
 t=dec(`Divide: ${ds(A,2)} ÷ ${comma(10**cc)}`,A,2+cc,`Dividing by ${comma(10**cc)} moves the decimal point ${cc} places to the left: ${ds(A,2+cc)}.`,{A,c:cc});
 t.choices=wrongOnly(t,[{value:ds(A,6),mistake:'Divided by 10,000 instead'},{value:ds(A,2+(5-cc)),mistake:'Moved the decimal point the wrong number of places'},{value:ds(A*10,2),mistake:'Moved the decimal point to the right'}]);break;}
case 'ah-times-power10-small':{const A=int(3500,95000),cc=pick([5,4]);
 t=dec(`Multiply: ${ds(A,6)} × ${comma(10**cc)}`,A,6-cc,`Moving the decimal point ${cc} places to the right: ${ds(A,6-cc)}.`,{A,c:cc});
 t.choices=wrongOnly(t,[{value:ds(A,7-cc),mistake:'Moved the decimal point one place too few'},{value:ds(A,5-cc),mistake:'Moved the decimal point one place too many'},{value:ds(A,8-cc),mistake:'Moved the decimal point two places too few'}]);break;}
case 'ah-divide-power10-large':{const A=int(11000,49000),b=int(4,5);
 t=dec(`Divide: ${ds(A,3)} ÷ ${comma(10**b)}`,A,3+b,`Moving the decimal point ${b} places to the left: ${ds(A,3+b)}.`,{A,b});
 t.choices=wrongOnly(t,[{value:ds(A,2+b),mistake:'Moved the decimal point one place too few'},{value:ds(A,5),mistake:'Moved the decimal point two places too few'},{value:ds(A*10**b,3),mistake:'Multiplied instead of dividing'}]);break;}
case 'ah-order-decimals':{// tenths/hundredths, thousandths and ten-thousandths that look alike
 const nz=(lo,hi)=>{let x;do{x=int(lo,hi);}while(x%10===0);return x;},b1=nz(11,99),b2=nz(b1*10-9,b1*10+9),b3=nz(11,99),b4=nz(b3*10-19,b3*10+19);
 const v=[[b1,2],[b2,3],[b3,3],[b4,4]],shown=[v[0],v[2],v[1],v[3]],key=(x)=>x[0]/10**x[1],s=[...v].sort((x,y)=>key(x)-key(y)),show=l=>l.map(([N,k])=>ds(N,k)).join(', ');
 t={prompt:`Arrange these decimal numbers in order from least to greatest: ${show(shown)}. Separate the numbers with commas.`,answer:{kind:'ah-seq',values:s.map(([N,k])=>[N,10**k]),value:show(s)},solution:`Compare place by place, starting with tenths: ${s.map(([N,k])=>ds(N,k)).join(' < ')}.`,parameters:{v}};
 const sw=(l,i,j)=>{const c2=[...l];[c2[i],c2[j]]=[c2[j],c2[i]];return c2;};
 t.choices=wrongOnly(t,[{value:show(sw(s,0,1)),mistake:'Compared the numbers of digits instead of the place values'},{value:show(sw(s,2,3)),mistake:'Thought a number with more decimal digits is greater'},{value:show(sw(sw(s,0,1),2,3)),mistake:'Ordered by the digits as if they were whole numbers'}]);break;}
case 'ah-graph-decimals':{// four thousandths between two hundredths marks, graphed on a number line
 const L=10*int(10,90),jj=int(6,8),pool=[];for(let x=L;x<=L+40;x+=jj)pool.push(x);const pts=shuffle(int,pool).slice(0,4);
 const body=withDots=>{const W=460,X=v=>30+(v-L)/10*80;let b=ln(10,40,W-10,40,{start:1,end:1});for(let i=0;i<=5;i++){const v=L+10*i;b+=ln(X(v),33,X(v),47)+tx(X(v),66,ds(v,3),{size:12});}
  if(withDots)[...pts].sort((x,y)=>x-y).forEach((v,i)=>{b+=dot(X(v),40)+tx(X(v),i%2?16:26,ds(v,3),{size:10});});return b;};
 t=teacher(`Graph these decimal numbers on the number line: ${pts.map(v=>ds(v,3)).join(', ')}.`,`Dots at ${[...pts].sort((x,y)=>x-y).map(v=>ds(v,3)).join(', ')}.`,['Each dot is placed between the correct hundredths marks.','Each dot is at the correct thousandths position (one tenth of the way per thousandth).','All four numbers are graphed and labelled.'],{L,pts},svg(body(false),`Number line from ${ds(L,3)} to ${ds(L+50,3)} marked in hundredths`,460,80),svg(body(true),`Number line with dots at ${pts.map(v=>ds(v,3)).join(', ')}`,460,80));break;}
// Lesson 9
case 'ah-segment-difference':{let ac,ab;do{ac=int(201,997);ab=int(101,Math.max(101,ac-70));}while(ac%100===0||ab%100===0||ac-ab<70||(ac-ab)%100===0);
 const m=int(0,5),unit=['units','centimeters','meters','inches','feet','yards'][m],u2=['units','cm','m','in.','ft','yd'][m],bc=ac-ab;
 t=dec(`In this figure, AB = ${ds(ab,2)} ${unit} and AC = ${ds(ac,2)} ${unit}. Find BC.`,bc,2,`BC = AC − AB = ${ds(ac,2)} − ${ds(ab,2)} = ${ds(bc,2)} ${u2}.`,{ab,ac,unit},S.abcSegment(ab,bc,`Points A, B and C on a line segment`));
 t.choices=wrongOnly(t,[{value:ds(ac+ab,2),mistake:'Added the lengths instead of subtracting'},{value:ds(bc+100,2),mistake:'Regrouping slip in the ones'},{value:ds(ab,2),mistake:'Gave the length of AB'}]);break;}
case 'ah-segment-difference-whole':{let ab,ac;do{ab=int(15,30);ac=int(32,62);}while(ac-ab===ab);const a=int(0,5),unit=['units','inches','feet','yards','centimeters','meters'][a],bc=ac-ab;
 const fig=svg(ln(8,40,382,40)+dot(20,40)+dot(20+bc*5,40)+dot(20+ac*5,40)+tx(20,64,'Q',{italic:1,size:14})+tx(20+bc*5,64,'R',{italic:1,size:14})+tx(20+ac*5,64,'S',{italic:1,size:14}),'Points Q, R and S on a line segment',400,74);
 t=whole(`In this figure, RS = ${ab} ${unit} and QS = ${ac} ${unit}. Find QR.`,bc,`QR = QS − RS = ${ac} − ${ab} = ${bc}.`,{ab,ac,unit},fig);
 t.choices=wrongOnly(t,[{value:String(ab),mistake:'Gave the length of RS'},{value:String(ac+ab),mistake:'Added the lengths instead of subtracting'},{value:String(Math.max(1,bc-10)),mistake:'Regrouping slip in the tens'}]);break;}
case 'ah-angle-definition':{const k=int(0,3),nm=['an acute angle','an obtuse angle','a right angle','a straight angle'][k];
 const ref=['An acute angle is an angle less than a right angle (90° angle).','An obtuse angle is an angle greater than a right angle (90° angle) and less than a straight angle.','A right angle is an angle formed by two perpendicular rays (a 90° angle).','A straight angle is an angle formed by two rays pointing in opposite directions (a 180° angle).'][k];
 t=teacher(`What is ${nm}?`,ref,[['Says the angle is smaller than a right angle, or less than 90°.','Says the angle is larger than a right angle, or more than 90°.','Says the rays are perpendicular, or the angle is 90°.','Says the rays point in opposite directions, or the angle is 180°.'][k],'Describes the angle itself, not an example only.'],{k});break;}
case 'ah-angle-degrees':{const first=int(0,1),asks=[['a right angle',90],['a straight angle',180]],o=first?[asks[1],asks[0]]:asks;
 t=n(`(a) How many degrees are in ${o[0][0]}? (b) How many degrees are in ${o[1][0]}?`,[o[0][1],o[1][1]],`A right angle measures 90°; a straight angle measures 180°.`,{first});
 t.choices=wrongOnly(t,[{value:`${o[1][1]}; ${o[0][1]}`,mistake:'Swapped the right angle and the straight angle'},{value:o.map(x=>x[1]===90?'90':'360').join('; '),mistake:'Gave a full turn (360°) for a straight angle'},{value:o.map(x=>x[1]===90?'45':'90').join('; '),mistake:'Halved both measures'}]);break;}
case 'ah-classify-angle':{// an angle drawn with its two rays; right angles carry a square mark
 const o=int(1,4);let z;if(o===3)z=90;else if(o===4)z=180;else do{z=int(40,130);}while(z>=80&&z<=100);
 const type=z<90?'acute':z===90?'right':z<180?'obtuse':'straight',rad=z*Math.PI/180,F=Fig();F.seg([0,0],[9,0],{end:1}).seg([0,0],[9*Math.cos(rad),9*Math.sin(rad)],{end:1}).dot([0,0]);if(z===90)F.right([0,0],0,90);
 t=text(`Classify this angle as acute, right, obtuse, or straight.`,type,`The angle measures ${z===90?'exactly 90°':z===180?'180°':z<90?'less than 90°':'more than 90° and less than 180°'}, so it is ${type}.`,{z},F.render(`An angle of ${z} degrees`,240,140),[type+' angle','an '+type+' angle','a '+type+' angle']);
 t.choices=['acute','right','obtuse','straight'].filter(x=>x!==type).map(x=>({value:x,mistake:{acute:'Called an angle acute without checking it is less than a right angle',right:'Called the angle right without a right-angle mark',obtuse:'Called an angle obtuse without checking it is greater than a right angle',straight:'Called the angle straight although its rays are not opposite'}[x]}));break;}
case 'ah-perimeter-notch':{// a rectangle with a notch cut from the top; every side labelled with its true length
 const rows=[[21,[4,5,6]],[27,[5,6,7,8]],[30,[6,7,8,9,10]],[36,[7,8,9,10,11]],[39,[8,9,10,11,12,13]],[45,[9,10,11,12,13,14,15]],[51,[10,11,12,13,14,15,16]]],[a,bs]=pick(rows),b=pick(bs),f=a-b,cc=a/3,p=Math.round(f/2);
 const k=int(0,3),unit=['inches','feet','meters','centimeters'][k],u2=['in.','ft','m','cm'][k],z=2*a+2*f+2*p;
 const F=Fig();F.poly([[0,0],[a,0],[a,f],[a-cc,f],[a-cc,f-p],[cc,f-p],[cc,f],[0,f]]);
 F.txt([-0.8,f/2],String(f),{anchor:'end'}).txt([a+0.8,f/2],String(f),{anchor:'start'}).txt([a/2,-2],String(a)).txt([a/2,f-p-1.6],String(cc)).txt([cc+0.8,f-p/2],String(p),{anchor:'start'}).txt([a-cc/2,f+1.2],String(cc));
 t=whole(`Find the perimeter of this figure. Dimensions are in ${unit}. All angles are right angles.`,z,`The three top pieces are each ${cc} and the two inside edges are each ${p}: ${f} + ${a} + ${f} + ${cc} + ${p} + ${cc} + ${p} + ${cc} = ${z} ${u2}.`,{a,f,p,c:cc},F.render('A rectangle with a rectangular notch cut from the top, every side labelled',300,200));
 t.choices=wrongOnly(t,[{value:String(a+f+p),mistake:'Added only the labelled numbers once each'},{value:String(2*a+2*f),mistake:'Found the perimeter of the rectangle without the notch'},{value:String(2*a+2*f+3*p),mistake:'Counted an inside edge one time too many'}]);break;}
// Lesson 10
case 'ah-divisibility-lists':{const orders=[[5,2,10,3],[10,5,2,3],[3,5,10,2],[2,5,3,10]],ord=pick(orders);let T;
 do{const t1=2*int(1,4);let t2;do{t2=int(10,99);}while(t2%3);let t3,t4;do{t3=int(10,99);t4=int(10,99);}while(t3%5&&t4%5);let t5,t6;do{t5=int(1,2)===1?int(100,999):int(1000,9999);t6=int(1,2)===1?int(1000,9999):int(10000,99999);}while(t5%10&&t6%10);T=[t1,t2,t3,t4,t5,t6];}while(new Set(T).size<6);
 const lists=ord.map(k=>T.filter(x=>x%k===0)),key=lists.map((l,i)=>`(${'abcd'[i]}) ${l.map(comma).join(', ')}`).join('; ');
 t={prompt:`Which of the following numbers are divisible by: (a) ${ord[0]}? (b) ${ord[1]}? (c) ${ord[2]}? (d) ${ord[3]}? Numbers: ${T.map(comma).join('    ')}. List the numbers for each part, with the parts separated by semicolons.`,answer:{kind:'ah-lists',lists,value:key},solution:`Use the divisibility rules (2: even last digit; 3: digit sum divisible by 3; 5: last digit 0 or 5; 10: last digit 0): ${key}.`,parameters:{T,ord}};
 t.choices=wrongOnly(t,[{value:ord.map(k=>T.filter(x=>x%10%k===0||x%k===0&&k!==3).map(comma).join(', ')).join('; '),mistake:'Tested divisibility by 3 using only the last digit'},{value:ord.map(k=>T.filter(x=>x%k===0&&x%10!==0||k===10&&x%10===0).map(comma).join(', ')).join('; '),mistake:'Thought numbers ending in 0 are divisible only by 10'},{value:[...lists].reverse().map(l=>l.map(comma).join(', ')).join('; '),mistake:'Matched the lists to the wrong divisors'}]);break;}
case 'ah-not-divisible':{const k=pick([2,3,5,10]),lo=Math.floor(99/k),hi=Math.floor(9999/k);let m;do{m=[int(lo,hi)*k,int(lo,hi)*k,int(lo,hi)*k];}while(new Set(m).size<3||m.some(x=>x<100));let d;do{d=int(100,9999);}while(d%k===0);
 const shown=shuffle(int,[d,...m]);
 t=whole(`Which of the following numbers is not divisible by ${k}? ${shown.map(comma).join(', ')}`,d,`${comma(d)} ${k===2?'is odd':k===3?`has digit sum ${String(d).split('').reduce((s,x)=>s+Number(x),0)}, which is not divisible by 3`:k===5?'does not end in 0 or 5':'does not end in 0'}; the others are divisible by ${k}.`,{k,shown});
 t.choices=wrongOnly(t,m.map(x=>({value:comma(x),mistake:`Chose a number that is divisible by ${k} (${comma(x)} ÷ ${k} = ${comma(x/k)})`})));break;}
case 'ah-divisible-both':{const a=pick([3,5]),b=a===3?2:pick([2,3]),cc=pick([11,13,17,19,23]),z=a*b*cc,ds2=[z+pick([-1,1]),z+2*pick([-1,1]),z+3*pick([-1,1])],shown=shuffle(int,[z,...ds2]);
 t=whole(`Which of the following numbers is divisible by ${b} and by ${a}? ${shown.join(', ')}`,z,`${z} = ${a} × ${b} × ${cc}, so it is divisible by both; the others are not.`,{a,b,c:cc,shown});
 t.choices=wrongOnly(t,ds2.map(x=>({value:String(x),mistake:x%a===0?`Divisible by ${a} but not by ${b}`:x%b===0?`Divisible by ${b} but not by ${a}`:`Divisible by neither ${a} nor ${b}`})));break;}
// Batch AH-2
// Lesson 11
case 'ah-word-boxes':{const a=int(10,31),b=int(10,31),nm=['Layton','Leona','Linden','Amanda','Levi','Leroy','Lupe'][int(0,6)],pr=['T-shirts','wind chimes','sun catchers'][int(0,2)];
 t=whole(`${nm} received a shipment of ${a} boxes of ${pr}. Each box contained ${b} ${pr}. How many ${pr} were in the shipment?`,a*b,`${a} × ${b} = ${comma(a*b)}.`,{a,b});
 t.choices=wrongOnly(t,[{value:String(a+b),mistake:'Added instead of multiplying'},{value:comma(a*b-a),mistake:'Multiplied by one less than the number in each box'},{value:comma(a*(b%10)+a*Math.floor(b/10)),mistake:'Did not shift the second partial product'}]);break;}
case 'ah-word-buses':{let a,b;do{a=int(1001,4999);b=int(21,99);}while(a%10===0||b%10===0||a%b===0);const z=Math.ceil(a/b);
 t=whole(`On the day of the big game, ${comma(a)} fans waited for buses to the stadium. If each bus could hold ${b} fans, how many buses were needed to take all the fans to the stadium?`,z,`${comma(a)} ÷ ${b} = ${Math.floor(a/b)} R ${a%b}; the remaining ${a%b} fans need one more bus, so ${z} buses.`,{a,b});
 t.choices=wrongOnly(t,[{value:String(z-1),mistake:'Ignored the remainder, leaving some fans without a bus'},{value:String(z+1),mistake:'Added an extra bus'},{value:`${z-1} R ${a%b}`,mistake:'Gave the quotient with its remainder instead of a number of buses'}]);break;}
case 'ah-word-classes':{let a,b;do{a=int(15,50);b=int(15,40);}while((a*b)%100===0);const s=a*b;
 t=whole(`If ${words(s)} students will be evenly distributed between ${b} classes, how many students will be in each class?`,a,`${comma(s)} ÷ ${b} = ${a}.`,{s,b});
 t.choices=wrongOnly(t,[{value:String(a+pick([-2,-1,1,2])),mistake:'Division slip by one or two'},{value:String(a+pick([-4,-3,3,4])),mistake:'Wrong digit in the quotient'},{value:String(s-b),mistake:'Subtracted instead of dividing'}]);break;}
// Lesson 12
case 'ah-select-primes':{// a list of primes and composites from one of the source's ten rows; select the primes
 const P=[[1,2,3,5,13],[2,3,5,13,19],[3,5,13,19,29],[5,13,19,29,37],[13,19,29,37,43],[19,29,37,43,47],[29,37,43,47,2],[37,43,47,2,17],[43,47,2,17,3],[47,23,17,3,5]],Cm=[[6,8,10,45,36],[8,10,12,26,35],[10,12,16,9,28],[12,16,18,6,26],[15,18,22,8,24],[18,21,26,10,18],[22,26,32,12,16],[26,32,40,16,14],[32,40,25,18,10],[40,42,18,27,9]],r=int(0,9),[a,b,cc,d,e]=P[r],[C1,C2,C3,C4,C5]=Cm[r],o=int(1,4);
 const list=[[C1,C2,a,b,C3,cc,d,C4,C5],[a,b,cc,C1,C2,d,e,C3,C4],[a,b,C1,cc,C2,C3,d,e,C4],[a,C1,b,C2,cc,C3,d,C4,e]][o-1],pr=list.filter(isPrime),key=pr.join(', ');
 t={prompt:`Select all the prime numbers from this list: ${list.join(', ')}. Separate the numbers with commas.`,answer:{kind:'num-set',set:pr,value:key},solution:`A prime number has exactly two factors, 1 and itself. The primes are ${key}.${list.includes(1)?' 1 is not prime: it has only one factor.':''}`,parameters:{list}};
 t.choices=wrongOnly(t,[{value:list.filter(x=>x%2===1).join(', '),mistake:'Chose the odd numbers'},{value:[...pr,...list.filter(x=>x===1||x===9||x===25||x===15||x===21||x===27||x===35||x===45)].join(', '),mistake:'Included odd composite numbers or 1'},{value:pr.filter(x=>x!==2).join(', '),mistake:'Left out 2, the only even prime'},{value:[...pr,list.find(x=>!isPrime(x))].join(', '),mistake:'Included a composite number'},{value:pr.slice(0,-1).join(', '),mistake:'Missed one of the primes'}]);break;}
case 'ah-which-prime':{const PR=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83],CO=[9,15,21,25,27,33,39,45,49,51,55,57,63,65,69,75,77,81,85,87,91,93,95],is=int(1,2)===1;
 const [z,...others]=is?[pick(PR),...shuffle(int,CO).slice(0,3)]:[pick(CO),...shuffle(int,PR).slice(0,3)],shown=shuffle(int,[z,...others]);
 t=whole(`Which of these numbers is ${is?'':'not '}prime? ${shown.join(', ')}`,z,is?`${z} has no factors other than 1 and itself; ${others.map(x=>`${x} = ${smallFactor(x)} × ${x/smallFactor(x)}`).join(', ')}.`:`${z} = ${smallFactor(z)} × ${z/smallFactor(z)}, so it is composite; the others are prime.`,{shown,is});
 t.choices=wrongOnly(t,others.map(x=>({value:String(x),mistake:is?`Chose an odd composite number (${x} = ${smallFactor(x)} × ${x/smallFactor(x)})`:`Chose a prime number (${x} has only the factors 1 and ${x})`})));break;}
case 'ah-prime-product':{const b=int(2,4),cs=int(1,4),cc=[1,1,2,2][cs-1],d=[1,2,1,2][cs-1],T=2**b*3**cc*5**d,fac=[...Array(b).fill(2),...Array(cc).fill(3),...Array(d).fill(5)];
 t={prompt:`What is ${comma(T)} expressed as a product of prime numbers? Use × between the factors.`,answer:{kind:'factorization',number:T,value:fac.join(' × ')},solution:`Divide by primes in turn: ${comma(T)} = ${fac.join(' × ')}.`,parameters:{b,c:cc,d}};
 t.choices=wrongOnly(t,[{value:'2 × 3 × 5',mistake:'Listed each prime factor only once'},{value:[...fac.slice(0,-1)].join(' × '),mistake:'Left out one factor'},{value:['2','3','3',...Array(d).fill('5')].join(' × '),mistake:'Used the wrong number of 2s and 3s'}]);break;}
// Lesson 13
case 'ah-common-factors-gcf':{const R2=[[2,5,3,4,1],[2,3,5,3,1],[2,3,7,3,1],[2,5,11,3,1],[3,2,7,1,2],[3,2,11,1,2],[5,3,2,7,3],[5,7,3,1,2],[5,3,7,3,2],[5,7,1,2,3],[7,5,2,1,3],[7,11,3,1,2],[7,3,5,3,2],[11,3,2,1,3],[11,5,2,3,1]];
 let row;do{row=pick(R2);}while(new Set([row[2],row[0],row[3],row[4]]).size<4);const [b,bb,a,cc,d]=row,f=a*b*cc,g=a*bb*d,G=gcd(f,g),com=[];for(let x=1;x<=G;x++)if(G%x===0)com.push(x);
 t={prompt:`Find all the common factors of ${f} and ${g}, and identify the greatest common factor. Write the common factors, a semicolon, then the greatest common factor.`,answer:{kind:'ah-lists',lists:[com,[G]],value:`${com.join(', ')}; ${G}`},solution:`Factors that divide both ${f} and ${g}: ${com.join(', ')}. The greatest is ${G}.`,parameters:{f,g}};
 t.choices=wrongOnly(t,[{value:`${com.filter(x=>x!==1).join(', ')}; ${G}`,mistake:'Left out 1, which is a factor of every number'},{value:`${com.join(', ')}; ${f*g/G}`,mistake:'Gave the least common multiple as the GCF'},{value:`${com.slice(0,-1).join(', ')||'1'}; ${com.length>1?com[com.length-2]:1}`,mistake:'Missed the greatest common factor itself'}]);break;}
case 'ah-gcf-choice':{const SRC=[[2,2,3,4],[2,3,4,5],[2,4,5,2],[2,5,2,3],[3,2,3,4],[3,3,4,5],[3,4,5,2],[3,5,2,3],[4,2,3,4],[4,3,4,5],[4,4,5,2],[4,5,2,3],[5,2,3,4],[5,3,4,5],[5,4,5,2],[5,5,2,3]].filter(([a,b,cc,d])=>cc!==d&&(a*b*cc)%10!==0);
 const [a,b,cc,d]=pick(SRC),f=a*b*Math.min(cc,d),g=a*b*Math.max(cc,d),G=gcd(f,g);
 t=whole(`Find the GCF of ${f} and ${g}.`,G,`The common factors of ${f} and ${g} include ${G}, and no larger number divides both: GCF = ${G}.`,{f,g});
 t.choices=wrongOnly(t,[{value:String(a),mistake:'Used only one shared factor'},{value:String(f*g/G),mistake:'Found the least common multiple instead'},{value:String(a*cc*d),mistake:'Multiplied the factors that are not shared'},{value:String(Math.floor((G+a)/2)),mistake:'Stopped at a common factor smaller than the greatest'}]);break;}
case 'ah-word-nails':{const n1=1000*int(4,9)+100*int(1,9)+10*int(0,9)+int(1,9),f=int(3,9),k=int(0,7),nm=['Michael','Raquel','Andy','Julie','Jesse','Renée','Mindy','Christy'][k],pn=['He','She','He','She','He','She','She','She'][k],z=n1+n1*f;
 t=whole(`${nm} used ${comma(n1)} nails to do the first roof. ${pn} used ${f} times as many nails to do the second roof. How many nails did ${nm} use to do both roofs?`,z,`Second roof: ${f} × ${comma(n1)} = ${comma(n1*f)}; both: ${comma(n1)} + ${comma(n1*f)} = ${comma(z)}.`,{n1,f});
 t.choices=wrongOnly(t,[{value:comma(n1*f),mistake:'Found only the second roof'},{value:comma(n1+f),mistake:'Added the multiplier instead of multiplying'},{value:comma(n1*(f-1)),mistake:'Multiplied by one less than the multiplier'}]);break;}
case 'ah-word-votes':{const nv=int(5001,9999),t1=int(4,9),t2=int(4,9),w=shuffle(int,[1,2,3,4,5,6,7,8,9,10]).slice(0,3),z=(t1+t2+1)*nv;
 t=whole(`Ward ${w[0]} reported ${t1} times as many votes as Ward ${w[1]} reported. Ward ${w[2]} reported ${t2} times as many votes as Ward ${w[1]} reported. If Ward ${w[1]} reported ${comma(nv)} votes, how many votes did the three wards report in all?`,z,`${comma(nv)} + ${t1} × ${comma(nv)} + ${t2} × ${comma(nv)} = ${t1+t2+1} × ${comma(nv)} = ${comma(z)}.`,{nv,t1,t2});
 t.choices=wrongOnly(t,[{value:comma((t1+t2)*nv),mistake:`Left out Ward ${w[1]}'s own votes`},{value:comma(nv+t1+t2),mistake:'Added the multipliers instead of multiplying'},{value:comma(t1*t2*nv),mistake:'Multiplied the two multipliers'}]);break;}
case 'ah-word-beads':{let b;do{b=int(5,19);}while(b===10);const p=int(10001,19000),k=int(0,7),nm=['Adaline','Jamison','Warren','Carmen','Pierce','Laura','Julio','Leticia'][k],pn=['she','he','he','she','he','she','he','she'][k],it=pick(['bead','button']),z=p*b;
 t=whole(`${nm} ordered ${comma(p)} ${it}s last year. This year ${pn} ordered ${b} times as many ${it}s. How many ${it}s did ${nm} order this year?`,z,`${b} × ${comma(p)} = ${comma(z)}.`,{p,b});
 t.choices=wrongOnly(t,[{value:comma(z+pick([-10,-1020,20])),mistake:'Carrying slip in the partial products'},{value:comma(z+pick([1100,110,-110,-1100])),mistake:'Misaligned a partial product'},{value:comma(z+pick([1050,-1060])),mistake:'Carrying slip in the thousands'}]);break;}
// Lesson 14
case 'ah-expand-two':{// two fractions written over a common denominator d
 let a,aa,b,bb,d;do{a=int(1,5);aa=int(2,5);b=int(a+1,9);bb=int(aa+1,9);const g=gcd(b,bb),cs=int(1,4);d=[b*bb,b/g*bb,b*(bb/g),b*bb/g][cs-1];}while(a===aa||d===b||d===bb||a*bb===aa*b);
 const g1=gcd(a,b),g2=gcd(aa,bb),[x1,y1,x2,y2]=[a/g1,b/g1,aa/g2,bb/g2],n1=x1*d/y1,n2=x2*d/y2;
 t={prompt:`Write each number as a fraction with a denominator of ${d}: (a) ${x1}/${y1} (b) ${x2}/${y2}. Separate the two answers with a semicolon.`,answer:{kind:'ah-den',parts:[[n1,d],[n2,d]],value:`${n1}/${d}; ${n2}/${d}`},solution:`Multiply numerator and denominator by the same number: ${x1}/${y1} = ${n1}/${d} and ${x2}/${y2} = ${n2}/${d}.`,parameters:{x1,y1,x2,y2,d}};
 t.choices=wrongOnly(t,[{value:`${x1}/${d}; ${x2}/${d}`,mistake:'Changed the denominator but not the numerator'},{value:`${x1+d-y1}/${d}; ${x2+d-y2}/${d}`,mistake:'Added the same number to the top and bottom'},{value:`${n2}/${d}; ${n1}/${d}`,mistake:'Matched the answers to the wrong fractions'}]);break;}
case 'ah-reduce':{let a,cc,d;do{a=int(21,45);cc=int(1,5);d=int(cc+1,cc+4);}while(a%10===0||((a*cc)%10===0&&(a*d)%10===0));const N=a*cc,D=a*d,g=gcd(N,D);
 t=n(`Reduce ${N}/${D} to lowest terms.`,R(N,D),`Divide the numerator and denominator by their greatest common factor, ${g}: ${N/g}/${D/g}.`,{N,D},'fraction');t.math=S.math(S.mfrac(N,D));
 t.choices=wrongOnly(t,[{value:`${N/gcd(N,D)*2}/${D/gcd(N,D)*2}`,mistake:'Did not divide by the greatest common factor'},{value:`${N-a}/${D-a}`,mistake:'Subtracted from the top and bottom instead of dividing'},{value:`${D/g}/${N/g}`,mistake:'Inverted the fraction'}]);break;}
case 'ah-equivalent-choice':{let a,aa,b,bb,d;do{a=int(4,8);aa=int(3,8);b=int(a+1,9);bb=int(aa+1,9);const g=gcd(b,bb);d=[b*bb,b/g*bb,b*(bb/g),b*bb/g][int(0,3)];}while(a===aa||d===b||d===bb);
 const g1=gcd(a,b),x=a/g1,y=b/g1,z=x*d/y;
 t=whole(`The fraction equivalent to ${x}/${y} has a denominator of ${d}: ${x}/${y} = ?/${d}. What is its numerator?`,z,`${d} ÷ ${y} = ${d/y}, so multiply the numerator by ${d/y}: ${x}/${y} = ${z}/${d}.`,{x,y,d});
 t.choices=wrongOnly(t,[{value:String(z+pick([-1,1])*x),mistake:'Multiplied the numerator by the wrong number'},{value:String(x),mistake:'Changed the denominator but not the numerator'},{value:String(d-1),mistake:'Wrote one less than the denominator'}]);break;}
case 'ah-reduce-choice':{const ROWS=[[2,2,2,3],[2,2,2,5],[2,2,3,4],[2,2,3,6],[2,2,4,6],[2,3,2,3],[2,3,2,5],[2,3,3,4],[2,3,3,6],[2,3,4,6],[2,4,2,5],[2,4,3,4],[2,4,3,6],[2,4,4,6],[3,3,2,5],[3,3,3,4],[3,3,3,6],[3,3,4,6],[3,4,3,4],[3,4,3,6],[3,4,4,6],[4,4,2,5],[4,4,3,4],[4,4,3,6],[4,4,4,6]],[a,b,cc,d]=pick(ROWS),N=a*b*cc,D=a*b*d,g=gcd(cc,d);
 t=n(`Reduce ${N}/${D} to lowest terms.`,R(N,D),`${N}/${D} = ${cc/g}/${d/g} after dividing the numerator and denominator by ${gcd(N,D)}.`,{a,b,c:cc,d},'fraction');t.math=S.math(S.mfrac(N,D));
 t.choices=wrongOnly(t,[{value:`${cc*a}/${d*a}`,mistake:'Divided by a common factor but not the greatest one'},{value:`${(a+cc)/gcd(a+cc,a+d)}/${(a+d)/gcd(a+cc,a+d)}`,mistake:'Added instead of multiplying the factors'},{value:`${(d+1)/gcd(d+1,a*b*cc)}/${a*b*cc/gcd(d+1,a*b*cc)}`,mistake:'Mixed up the numerator and denominator factors'},{value:`${d/g}/${cc/g}`,mistake:'Inverted the fraction'}]);break;}
// Lesson 15
case 'ah-fractions-to-decimals':{const cs=int(1,3),b=[8,25,20][cs-1],a=cs===1?pick([1,3,5,7]):pick([3,5,7,9,11,13,15,17,19]);let f2;if(cs===1)f2=[2*int(1,9),25];else{let cc;do{cc=int(1,9);}while(cc===5);f2=[cc,10];}
 t=n(`Write each fraction as a decimal number: (a) ${a}/${b} (b) ${f2[0]/gcd(...f2)}/${f2[1]/gcd(...f2)}`,[R(a,b),R(...f2)],`Divide the numerator by the denominator: (a) ${U.dec(R(a,b))}; (b) ${U.dec(R(...f2))}.`,{a,b,f2},'decimal');
 t.choices=wrongOnly(t,[{value:`${U.dec(R(b,a)).slice(0,6)}; ${U.dec(R(f2[1],f2[0])).slice(0,6)}`,mistake:'Divided the denominator by the numerator'},{value:`${a}.${b}; ${f2[0]}.${f2[1]}`,mistake:'Wrote the numerator and denominator around a decimal point'},{value:`${U.dec(R(a,b*10))}; ${U.dec(R(f2[0],f2[1]*10))}`,mistake:'Placed the decimal point one place too far left'}]);break;}
case 'ah-repeating-choice':{// the source's ten fractions, each a decimal with one repeating digit
 const T=[[5,6,'.8','3','.08','.008','8'],[5,12,'.41','6','.4','.041','41'],[7,12,'.58','3','.058','.85','.088'],[11,12,'.91','6','.9','.091','91'],[7,15,'.4','6','.44','.46','.046'],[11,15,'.7','3','.77','.07','.707'],[13,15,'.8','6','.08','.88','.68'],[23,45,'.5','1','.55','.05','.15'],[32,45,'.7','1','.1','.17','.71'],[1,24,'.041','6','.014','.4','.1']],[nn,dd,z,cs,...ds3]=pick(T),OV='̅';
 const show=x=>(x.startsWith('.')?'0'+x:x+'.')+cs+OV,key=show(z);
 t={prompt:`What is ${nn}/${dd} as a decimal number? Put a bar over the repeating digit, or write it in parentheses, as in 0.1(6) for 0.1666….`,answer:{kind:'repeating',n:nn,d:dd,value:key},solution:`${nn} ÷ ${dd} = ${(nn/dd).toFixed(6)}…, so ${nn}/${dd} = ${key}.`,parameters:{nn,dd}};t.math=S.math(S.mfrac(nn,dd));
 t.choices=wrongOnly(t,ds3.map((x,i)=>({value:show(x),mistake:['Placed the decimal point in the wrong position','Misplaced a digit or a zero in the quotient','Mixed up the digits of the quotient'][i]})));break;}
case 'ah-round-repeater':{const cs=int(1,4),den=[9,11,33,27][cs-1];let a;do{a=int(1,den-1);}while(cs===4&&a%3===0);const p=pick([4,5]),d=int(11,99),rd=S.repDec(a,den),N=d*den+a;
 const z=Math.floor(N*10**p/den+0.5),shown=`${d}.${rd.nonrep}${[...rd.rep].map(ch=>ch+'̅').join('')}`;
 t=dec(`Round ${shown} to the nearest ${p===4?'ten-thousandth':'hundred-thousandth'}.`,z,p,`${shown} = ${(N/den).toFixed(p+3)}…; the next digit decides the rounding: ${ds(z,p,{keep:p})}.`,{d,a,den,p});t.answer.display=ds(z,p,{keep:p});
 t.choices=wrongOnly(t,[{value:ds(Math.floor(N*10**p/den),p,{keep:p}),mistake:'Cut off the digits instead of rounding'},{value:ds(Math.floor(N*10**(p-1)/den+0.5),p-1,{keep:p-1}),mistake:'Rounded to the place one to the left'},{value:ds(Math.floor(N*10**(p+1)/den+0.5),p+1,{keep:p+1}),mistake:'Rounded to the place one to the right'},{value:ds(z+1,p,{keep:p}),mistake:'Rounded the last kept digit up by mistake'},{value:ds(z-1,p,{keep:p}),mistake:'Rounded the last kept digit down by mistake'}]);break;}
case 'ah-round-repeater-millionth':{const a=int(11,99),cs=int(1,3);let bb;if(cs===1)bb=String(int(2,8));else if(cs===2){let x;do{x=int(11,98);}while(x%10===0);bb=String(x);}else{let x;do{x=int(111,999);}while(x%10===0);bb=String(x);}
 const L=bb.length,den=10**L-1,N=a*den+Number(bb),z=Math.floor(N*1e6/den+0.5);
 t=dec(`Round ${a}.${[...bb].map(ch=>ch+'̅').join('')} to the nearest millionth.`,z,6,`${a}.${bb.repeat(Math.ceil(8/L)).slice(0,8)}… rounds to ${ds(z,6,{keep:6})}.`,{a,bb,L});t.answer.display=ds(z,6,{keep:6});
 t.choices=wrongOnly(t,[{value:ds(Math.floor(N*1e6/den),6,{keep:6}),mistake:'Cut off the digits instead of rounding'},{value:ds(Math.floor(N*1e6/den)+(z===Math.floor(N*1e6/den)?1:0),6,{keep:6}),mistake:'Rounded the last digit the wrong way'},{value:ds(Math.floor(N*1e5/den+0.5),5,{keep:5}),mistake:'Rounded to the nearest hundred-thousandth'},{value:ds(Math.floor(N*1e7/den+0.5),7,{keep:7}),mistake:'Rounded to the nearest ten-millionth'},{value:ds(z+1,6,{keep:6}),mistake:'Increased the millionths digit by one too many'},{value:ds(z*10,6,{keep:6}),mistake:'Shifted the repeating block by one place'}]);break;}
case 'ah-decimal-to-fraction-choice':{const cs=int(0,17),a=[0,1,3,4,5,6,8,9,0,1,2,3,4,5,6,7,8,9][cs]*10+5,b=cs<8?2:3,v=ds(a,b),o=pick([-1,1]);
 const red=(x,y)=>`${x/gcd(x,y)}/${y/gcd(x,y)}`;
 t=n(`What is ${v} as a fraction? Write it in lowest terms.`,R(a,10**b),`${v} = ${a}/${10**b} = ${red(a,10**b)}.`,{a,b},'fraction');
 t.choices=wrongOnly(t,[{value:red(a,10**(b+o)),mistake:'Used the wrong power of ten as the denominator'},{value:red(a,10),mistake:'Wrote the digits over 10'},{value:red(a+b,10),mistake:'Counted the decimal places into the numerator'},{value:red(a,1000*(b===2?1:10)),mistake:'Used one place value too many'}]);break;}
// Lesson 16
case 'ah-evaluate-powers':{const T=[[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[2,4],[3,4],[4,4],[5,4],[6,4]],[a,b]=pick(T),cc=int(1,9),d=int(11,35),o=int(0,1);
 t=n(`Evaluate the following exponential expressions: (a) (${ds(cc,1)})² (b) ${a}${S.sup(b)} (c) 1${S.sup(d)}`,[R(cc*cc,100),R(a**b,1),R(1,1)],`(a) ${ds(cc,1)} × ${ds(cc,1)} = ${ds(cc*cc,2)}; (b) ${a}${S.sup(b)} = ${comma(a**b)}; (c) 1 to any power is 1.`,{a,b,c:cc,d,o},'decimal');
 t.choices=wrongOnly(t,[{value:`${ds(2*cc,1)}; ${a*b}; ${d}`,mistake:'Multiplied the base by the exponent'},{value:`${ds(cc*cc,1)}; ${comma(a**b)}; 1`,mistake:'Placed the decimal point in (a) one place too far right'},{value:`${ds(cc*cc,2)}; ${comma(a**(b-1))}; 1`,mistake:'Multiplied the base one time too few in (b)'}]);break;}
case 'ah-prime-exponents':case 'ah-prime-exponents-choice':{const ch=c.recipe==='ah-prime-exponents-choice';let a,b,cc;
 if(!ch){const T=[[1,5,11],[2,4,7],[2,4,11],[2,5,5],[2,5,7],[2,5,11],[3,2,11],[3,3,5],[3,3,7],[3,3,11],[3,4,5],[3,4,7],[3,4,11],[3,5,5],[3,5,7],[3,5,11],[4,1,7],[4,1,11],[4,2,5],[4,2,7],[4,2,11],[4,3,5],[4,3,7],[4,3,11],[4,4,5],[4,4,7]];[a,b,cc]=pick(T);}
 else{const T=[[1,2],[1,3],[1,4],[2,1],[2,3],[2,4],[2,5],[3,1],[3,2],[3,4],[3,5]];[a,b]=pick(T);cc=pick([5,7,11]);}
 const e=2**b*3**a*cc,pw=(p,k)=>k===1?String(p):p+S.sup(k),key=`${pw(2,b)} × ${pw(3,a)} × ${cc}`;
 t={prompt:`Write ${comma(e)} as a product of prime numbers using exponents.`,answer:{kind:'factorization',number:e,value:key},solution:`${comma(e)} = ${[...Array(b).fill(2),...Array(a).fill(3),cc].join(' × ')} = ${key}.`,parameters:{a,b,c:cc}};
 const dd=cc===7?5:cc+2;t.choices=wrongOnly(t,[{value:`${pw(2,a)} × ${pw(3,b)} × ${dd}`,mistake:'Swapped the exponents and used the wrong last prime'},{value:`${pw(2,a)} × ${pw(3,b)} × ${cc}`,mistake:'Swapped the exponents of 2 and 3'},{value:`${pw(2,b)} × ${pw(3,a)} × ${dd}`,mistake:'Used the wrong last prime factor'},{value:`2 × 3 × ${cc}`,mistake:'Left out the exponents'}]);break;}
case 'ah-power-choice':{const T=[[3,2],[4,2],[5,2],[3,3],[4,3],[5,3],[3,4],[4,4],[5,4],[6,2],[6,3]],[a,b]=pick(T);
 t=whole(`What is ${a}${S.sup(b)}?`,a**b,`${a}${S.sup(b)} = ${Array(b).fill(a).join(' × ')} = ${comma(a**b)}.`,{a,b});
 t.choices=wrongOnly(t,[{value:comma(a**(b-1)),mistake:'Multiplied the base one time too few'},{value:String(a*11),mistake:'Wrote the base and exponent side by side as digits'},{value:comma(a**(b+1)),mistake:'Multiplied the base one time too many'},{value:String(a*b),mistake:'Multiplied the base by the exponent'}]);break;}
// Lesson 17
case 'ah-tiles':{let A,B;do{A=int(11,27);B=int(10,21);}while(A*B===2*(A+B)+3);const a=A-2,b=B-2,k=int(0,5),tile=['1-inch-square','1-centimeter-square','1-millimeter-square','1-foot-square','1-meter-square','1-yard-square'][k],u=['inches','centimeters','millimeters','feet','meters','yards'][k],shape=a===b?'square':'rectangle';
 const F=Fig();F.poly([[0,0],[b,0],[b,a],[0,a]]).txt([b/2,-1.6],String(b)).txt([-0.8,a/2],String(a),{anchor:'end'});
 t=whole(`How many ${tile} tiles would it take to cover this ${shape}? Dimensions are in ${u}.`,a*b,`${a} rows of ${b} tiles: ${a} × ${b} = ${a*b} tiles.`,{a,b},F.render(`A ${shape} ${b} by ${a}`,240,200));
 t.choices=wrongOnly(t,[{value:String(2*(a+b)),mistake:'Found the perimeter instead of the area'},{value:String(a+b),mistake:'Added the length and width'},{value:String(2*(a+b)+4),mistake:'Counted the tiles around the edge, including the corners'}]);break;}
case 'ah-area-l':{const a=int(2,3),b=int(4,6),cc=int(7,11),k=int(0,3),un=['meters','yards','inches','centimeters'][k],u2=['m','yd','in.','cm'][k];
 const F=Fig();F.poly([[0,0],[b,0],[b,cc],[-a,cc],[-a,cc-a],[0,cc-a]]).txt([-a-0.6,cc-a/2],String(a),{anchor:'end'}).txt([-a/2,cc-a-1],String(a)).txt([b/2,-1],String(b)).txt([b+0.6,cc/2],String(cc),{anchor:'start'});
 t=whole(`Find the area of this figure in square ${un}. Dimensions are in ${un}. All angles are right angles.`,a*a+b*cc,`Split it into a ${b} by ${cc} rectangle and an ${a} by ${a} square: ${b*cc} + ${a*a} = ${a*a+b*cc} ${u2}².`,{a,b,c:cc},F.render('A rectangle with a small square attached at its upper left',220,220));
 t.choices=wrongOnly(t,[{value:String(a*b*cc),mistake:'Multiplied all the labelled lengths'},{value:String(pick([cc*(b+a),a*(b+cc)])),mistake:'Multiplied one side by the sum of two others'},{value:String(2*(a+b+cc)),mistake:'Added the side lengths instead of finding area'}]);break;}
// Lesson 18
case 'ah-fraction-of':{const T=[[2,5],[3,5],[4,5],[2,7],[3,7],[4,7],[5,7],[6,7],[3,8],[5,8],[7,8],[2,9],[4,9],[5,9],[7,9],[8,9],[3,10],[7,10],[9,10],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[5,12],[7,12],[11,12]],[cc,b]=pick(T);let k;do{k=int(Math.round(50/b),Math.round(120/b));}while(gcd(k,b)!==1);const a=k*b;
 t=whole(`Find ${cc}/${b} of ${a}.`,cc*k,`${a} ÷ ${b} = ${k}, and ${cc} × ${k} = ${cc*k}.`,{c:cc,b,a});
 t.choices=wrongOnly(t,[{value:String(k),mistake:'Divided by the denominator but did not multiply by the numerator'},{value:String(a*cc),mistake:'Multiplied by the numerator but did not divide'},{value:String(a-cc*k),mistake:'Found the remaining part instead'}]);break;}
case 'ah-fraction-of-mixed':{const T=[[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],[5,5],[5,6],[5,7],[5,8],[5,9],[6,6],[6,7],[6,8],[6,9],[7,7],[7,8],[7,9],[8,8],[8,9],[9,9]],[a,b]=pick(T),cc=a*b;let f,g;do{f=int(2,5)*int(2,5);g=int(1,f-1);}while((g*cc)%f===0);const gg=gcd(g,f);
 t=n(`What number is ${g/gg}/${f/gg} of ${cc}?`,R(g*cc,f),`${g/gg}/${f/gg} × ${cc} = ${U.mixed(R(g*cc,f))}.`,{g,f,c:cc},'mixed');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(cc,f/gg)),mistake:'Divided by the denominator but did not multiply by the numerator'},{value:U.mixed(R(cc*f,g)),mistake:'Multiplied by the reciprocal of the fraction'},{value:U.mixed(R(g+cc,f)),mistake:'Added the whole number to the numerator'}]);break;}
case 'ah-fraction-of-choice':{const a=int(11,50),b=int(3,12);let cc;do{cc=int(2,b);}while(gcd(b,cc)!==1);
 t=n(`What number is ${cc}/${b} of ${a}?`,R(cc*a,b),`${cc}/${b} × ${a} = ${cc*a}/${b}${(cc*a)%b===0?'':' = '+U.mixed(R(cc*a,b))}.`,{c:cc,b,a},'mixed');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(cc+a,b)),mistake:'Added the whole number to the numerator'},{value:U.mixed(R(cc*a-2,b)),mistake:'Multiplication slip in the numerator'},{value:U.mixed(R(cc*a,2*b)),mistake:'Halved the product by mistake'}]);break;}
// Lesson 19
case 'ah-multiply-fractions':{let a,b,cc,d;do{a=pick([3,5,7,9]);b=pick([3,5,7,9,11]);}while(a===b);do{cc=int(2,a-1);}while(gcd(a,cc)!==1||gcd(b,cc)!==1);do{d=int(2,b-1);}while(gcd(a,d)!==1||gcd(b,d)!==1);
 t=n(`Simplify: ${cc}/${a} × ${d}/${b}`,R(cc*d,a*b),`Multiply the numerators and the denominators: ${cc*d}/${a*b}.`,{a,b,c:cc,d},'fraction');t.math=S.math(S.mfrac(cc,a)+S.mo('×')+S.mfrac(d,b));
 t.choices=wrongOnly(t,[{value:`${cc+d}/${a+b}`,mistake:'Added the numerators and the denominators'},{value:`${cc*b}/${a*d}`,mistake:'Divided instead of multiplying'},{value:`${cc*d}/${a+b}`,mistake:'Added the denominators'}]);break;}
case 'ah-fraction-power':{const T=[[2,1],[3,1],[3,2],[4,1],[4,3],[5,1],[5,2],[5,3],[5,4]],[b,a]=pick(T),cc=int(2,Math.round(Math.log(100)/Math.log(b)));
 t=n(`Simplify: (${a}/${b})${S.sup(cc)}`,R(a**cc,b**cc),`Raise the numerator and the denominator to the power ${cc}: ${a**cc}/${b**cc}.`,{a,b,c:cc},'fraction');t.math=S.math(`<msup><mrow><mo>(</mo>${S.mfrac(a,b)}<mo>)</mo></mrow><mn>${cc}</mn></msup>`);
 t.choices=wrongOnly(t,[{value:`${a*cc}/${b*cc}`,mistake:'Multiplied the numerator and denominator by the exponent'},{value:`${a**cc}/${b}`,mistake:'Raised only the numerator to the power'},{value:`${a}/${b**cc}`,mistake:'Raised only the denominator to the power'}]);break;}
case 'ah-multiply-cancel':{let a,b,cc;do{a=int(2,6);b=int(2,9);cc=int(2,12);}while(gcd(a,b)!==1||a===cc);const d=a*cc,f=int(1,cc-1),e=d-a*f;
 t=n(`Simplify: ${a}/${b} · ${e}/${d}`,R(e,b*cc),`Cancel ${a}: ${a}/${b} · ${e}/${d} = ${e}/${b*cc}${gcd(e,b*cc)>1?' = '+U.f(R(e,b*cc)):''}.`,{a,b,e,d},'fraction');t.math=S.math(S.mfrac(a,b)+S.mo('·')+S.mfrac(e,d));
 t.choices=wrongOnly(t,[{value:`${a*e}/${b*d}`,mistake:'Did not reduce the product'},{value:U.f(R(a*d,b*e)),mistake:'Divided instead of multiplying'},{value:U.f(R(a+e,b+d)),mistake:'Added the numerators and the denominators'}]);break;}
case 'ah-multiply-cancel-choice':{let a,b,cc,d;do{a=int(2,9);b=int(5,16);cc=int(2,12);d=int(2,6);}while(gcd(a,b)!==1||gcd(b,cc)!==1||d===b||d===a||gcd(cc,d)!==1||!(b<a*cc)||!(b<cc*d));const e=a*d;
 t=n(`Simplify: ${b}/${e} · ${d}/${cc}`,R(b,a*cc),`Cancel ${d}: ${b}/${e} · ${d}/${cc} = ${b}/${a*cc}.`,{a,b,c:cc,d},'fraction');t.math=S.math(S.mfrac(b,e)+S.mo('·')+S.mfrac(d,cc));
 t.choices=wrongOnly(t,[{value:U.f(R(b,d*cc)),mistake:'Cancelled the wrong factor'},{value:U.f(a*d<b*cc?R(a*d,b*cc):R(b*cc,a*d)),mistake:'Divided instead of multiplying'},{value:U.f(b*d<a*d+cc?R(b*d,a*d+cc):R(a*d+cc,b*d)),mistake:'Added the denominators'}]);break;}
case 'ah-divide-fractions':case 'ah-divide-fractions-choice':{let a,b,cc,d,e;do{d=int(3,9);cc=int(3,9);a=int(2,11);b=int(8,19);e=int(2,3);}while(gcd(d,cc)!==1||gcd(b,a*cc)!==1||gcd(b,a*d)!==1||!(cc<d*e)||(c.recipe==='ah-divide-fractions-choice'&&a===cc));
 const N1=a*cc,D1=b*e,N2=a*d,D2=b;
 t=n(`Simplify: ${N1}/${D1} ÷ ${N2}/${D2}`,R(cc,d*e),`Multiply by the reciprocal: ${N1}/${D1} × ${D2}/${N2} = ${U.f(R(cc,d*e))}.`,{a,b,c:cc,d,e},'fraction');t.math=S.math(S.mfrac(N1,D1)+S.mo('÷')+S.mfrac(N2,D2));
 t.choices=wrongOnly(t,[{value:U.f(R(a,d*e)),mistake:'Cancelled incorrectly'},{value:U.f(R(N1*N2,D1*D2)),mistake:'Multiplied instead of dividing'},{value:U.f(R(d*e,cc)),mistake:'Inverted the answer'}]);break;}
// Lesson 20
case 'ah-factors-of':{const a=int(4,40),fs=[];for(let x=1;x<=a;x++)if(a%x===0)fs.push(x);
 t={prompt:`The number ${a} is a multiple of which numbers? List all of them, separated by commas.`,answer:{kind:'num-set',set:fs,value:fs.join(', ')},solution:`${a} is a multiple of each of its factors: ${fs.join(', ')}.`,parameters:{a}};
 t.choices=wrongOnly(t,[{value:fs.filter(x=>x!==1&&x!==a).join(', ')||'none',mistake:'Left out 1 and the number itself'},{value:[a,2*a,3*a].join(', '),mistake:'Listed multiples of the number instead of its factors'},{value:fs.slice(0,-1).join(', '),mistake:'Left out the number itself'}]);break;}
case 'ah-multiples-between':{const a=int(3,15),small=10*int(2,5),big=small+10*int(3,4),ms=[];for(let x=a;x<big;x+=a)if(x>small)ms.push(x);
 t={prompt:`Find all the multiples of ${a} that are greater than ${small} and less than ${big}. Separate them with commas.`,answer:{kind:'num-set',set:ms,value:ms.join(', ')},solution:`Count by ${a}s: ${ms.join(', ')}.`,parameters:{a,small,big}};
 t.choices=wrongOnly(t,[{value:[...ms,ms[ms.length-1]+a].join(', '),mistake:'Included a multiple that is not less than the upper limit'},{value:ms.slice(1).join(', ')||String(ms[0]+a),mistake:'Left out the first multiple'},{value:ms.map(x=>x+1).join(', '),mistake:'Counted from the wrong starting number'}]);break;}
case 'ah-not-multiple':{let a,b,cc,d,e,A;do{a=int(6,16);b=int(4,61);cc=int(4,11);d=int(9,16);e=int(41,61);A=[b*a+2,cc*a,d*a,e*a];}while(new Set([b,cc,d,e]).size<4||new Set(A).size<4);const shown=shuffle(int,A);
 t=whole(`Which of the following is not a multiple of ${a}? ${shown.join(', ')}`,A[0],`${A[0]} ÷ ${a} = ${b} R 2, so it is not a multiple of ${a}; the others divide evenly.`,{a,shown});
 t.choices=wrongOnly(t,A.slice(1).map(x=>({value:String(x),mistake:`Chose a multiple of ${a} (${x} = ${a} × ${x/a})`})));break;}
case 'ah-lcm-factored':{const gen=()=>{let n;do{n=2**int(1,5)*3**int(0,3)*5**int(0,2)*7**int(0,2);}while(n>1500||n<20);return n;};let ns;do{ns=[gen(),gen(),gen()];}while(new Set(ns).size<3);
 const fac=x=>{const f=[];for(const p of [2,3,5,7])while(x%p===0){f.push(p);x/=p;}return f.join(' × ');},L=ns.reduce((x,y)=>x*y/gcd(x,y));
 t=whole(`The following three numbers are written as products of prime factors: ${ns.map(x=>`${comma(x)} = ${fac(x)}`).join('; ')}. What is the LCM of the numbers?`,L,`Use each prime the greatest number of times it appears in any one number: ${fac(L)} = ${comma(L)}.`,{ns});
 t.choices=wrongOnly(t,[{value:comma(L*2),mistake:'Used one factor of 2 too many'},{value:comma(L*3),mistake:'Used one factor of 3 too many'},...(L%2===0?[{value:comma(L/2),mistake:'Used one factor of 2 too few'}]:[]),...(L%3===0?[{value:comma(L/3),mistake:'Used one factor of 3 too few'}]:[])]);break;}
case 'ah-lcm-choice':{let A,B,e,h;do{const cc=int(1,3),d=int(1,2),f=int(1,3),g=int(1,2);e=cc<3&&d<2?1:0;h=f<3&&g<2?1:0;A=2**cc*3**d*7**e;B=2**f*3**g*7**h;}while(A===B);const a=Math.min(A,B),b=Math.max(A,B),L=a*b/gcd(a,b);
 t=whole(`Find the LCM of ${a} and ${b}.`,L,`The LCM uses each prime factor the greatest number of times it appears: LCM = ${comma(L)}.`,{a,b});
 t.choices=wrongOnly(t,[{value:comma(L*2/7**Math.max(e,h)),mistake:'Used the wrong prime factors'},{value:comma(L*3),mistake:'Used one factor of 3 too many'},{value:comma(L/2),mistake:'Used one factor of 2 too few'},{value:comma(a*b),mistake:'Multiplied the numbers without removing common factors'}]);break;}
// Lesson 21
case 'ah-average-eight':{const st=(lo,hi)=>lo+4*int(0,Math.floor((hi-lo)/4)),v=[st(5,39),st(6,40),st(6,40),st(6,40),st(5,39),st(6,40),st(6,40),st(6,40)],S0=v.reduce((x,y)=>x+y);
 t=n(`Find the average of ${v.slice(0,7).join(', ')}, and ${v[7]}.`,R(S0,8),`Sum ${S0} ÷ 8 = ${U.dec(R(S0,8))}.`,{v},'decimal');
 t.choices=wrongOnly(t,[{value:U.dec(R(S0+4,8)),mistake:'Addition slip in the sum'},{value:U.dec(R(S0-4,8)),mistake:'Addition slip in the sum'},{value:U.dec(R(S0+10,8)),mistake:'Carrying slip in the sum'},{value:U.dec(R(S0,7)).slice(0,7),mistake:'Divided by 7 instead of 8'}]);break;}
case 'ah-average-missing-cost':{const g=int(5,7),A=Array.from({length:g-1},()=>5*int(801,1399)),sum=A.reduce((x,y)=>x+y),v=Math.round(sum/5/(g-1)),H=v*5+int(-4,4)+100*100*int(2,5),z=g*H-sum;
 t=dec(`The average cost of ${words(g)} items is ${cash(H)}. ${['Four','Five','Six'][g-5]} of the items cost ${A.map(cash).join(', ').replace(/, ([^,]*)$/,', and $1')}. Find the cost of the other item.`,z,2,`Total = ${g} × ${cash(H)} = ${cash(g*H)}; subtract the ${g-1} known costs (${cash(sum)}): ${cash(z)}.`,{g,A,H});t.answer.display=cash(z);
 t.choices=wrongOnly(t,[{value:cash(Math.round(sum/(g-1))),mistake:'Found the average of the known costs'},{value:cash(H),mistake:'Gave the average as the missing cost'},{value:cash(Math.round((H+sum)/g)),mistake:'Added the average to the known costs and divided'}]);break;}
// Lesson 22
case 'ah-three-fractions':case 'ah-three-fractions-choice':{const ch=c.recipe==='ah-three-fractions-choice';let cc,d;cc=int(2,9);do{d=int(2,9);}while(gcd(cc,d)!==1);let a,b,e,f;const g=1;
 do{a=int(2,9);b=int(2,9);e=int(2,9);f=int(2,9);}while(new Set([a*cc,b*f,e*b,a*g,f*g,d*e]).size<6||(a*cc)%(b*f)===0||(e*b)%(a*g)===0||(f*g)%(d*e)===0);
 const F1=[a*cc,b*f],F2=[e*b,a*g],F3=ch?[d*e,f*g]:[f*g,d*e];
 t=n(`Simplify: ${F1.join('/')} × ${F2.join('/')} ${ch?'÷':'×'} ${F3.join('/')}`,R(cc,d),`${ch?'Invert the divisor, then cancel':'Cancel'} common factors across the numerators and denominators: ${cc}/${d}.`,{F1,F2,F3,div:ch},'fraction');
 t.math=S.math(S.mfrac(...F1)+S.mo('×')+S.mfrac(...F2)+S.mo(ch?'÷':'×')+S.mfrac(...F3));
 const P=F1[0]*F2[0]*(ch?F3[1]:F3[0]),Q=F1[1]*F2[1]*(ch?F3[0]:F3[1]);
 t.choices=wrongOnly(t,[{value:`${d}/${cc}`,mistake:'Inverted the answer'},{value:U.f(R(F1[0]*F2[0]*F3[0],F1[1]*F2[1]*F3[1])),mistake:ch?'Did not invert the divisor':'Multiplied without simplifying correctly'},{value:`${P}/${Q}`,mistake:'Did not reduce the product'}]);break;}
case 'ah-fractions-times-divide':{const v=shuffle(int,[2,3,4,5,6,7]).slice(0,4),[a,b,cc,d]=v;
 t=n(`Simplify: ${a*b}/${a*cc} × ${a}/${b} ÷ ${d}/${cc}`,R(a,d),`Multiply by the reciprocal of ${d}/${cc} and cancel: ${a*b}/${a*cc} × ${a}/${b} × ${cc}/${d} = ${U.f(R(a,d))}.`,{a,b,c:cc,d},'fraction');
 t.math=S.math(S.mfrac(a*b,a*cc)+S.mo('×')+S.mfrac(a,b)+S.mo('÷')+S.mfrac(d,cc));
 t.choices=wrongOnly(t,[{value:U.f(R(d,a)),mistake:'Inverted the answer'},{value:U.f(R(a*d,cc*cc)),mistake:'Multiplied by the divisor instead of its reciprocal'},{value:U.f(R(a*a*b*cc,a*cc*b*d+1)),mistake:'Cancelled incorrectly'}]);break;}
// Lesson 23
case 'ah-pounds-to-tons':{const q=2000*int(2,30);
 t=whole(`How many tons are in ${comma(q)} pounds?`,q/2000,`${comma(q)} lb × (1 ton / 2000 lb) = ${q/2000} tons.`,{q});
 t.choices=wrongOnly(t,[{value:String(q/1000),mistake:'Used 1000 pounds in a ton'},{value:String(q/200),mistake:'Used 200 pounds in a ton'},{value:String(q/500),mistake:'Used 500 pounds in a ton'}]);break;}
case 'ah-miles-to-feet':{const a=int(20,100),num=a*528;
 t=whole(`Use a unit multiplier to convert ${ds(a,1)} miles to feet.`,num,`${ds(a,1)} mi × (5280 ft / 1 mi) = ${comma(num)} ft.`,{a});
 t.choices=wrongOnly(t,[{value:comma(num+pick([-1,1])*int(1000,2000)),mistake:'Arithmetic slip in the product'},{value:comma(a*582),mistake:'Used 5820 feet in a mile'},{value:comma(num+pick([-1,1])*int(10,40)),mistake:'Arithmetic slip in the last digits'}]);break;}
case 'ah-tons-to-pounds':{let a;do{a=2*int(1,6);}while(a===10);const q=16*a;
 t=whole(`How many pounds are in ${q} tons?`,q*2000,`${q} tons × (2000 lb / 1 ton) = ${comma(q*2000)} lb.`,{q});
 t.choices=wrongOnly(t,[{value:comma(q*16),mistake:'Used 16 pounds in a ton'},{value:comma(q*20000),mistake:'Used 20,000 pounds in a ton'},{value:comma(a*2000),mistake:'Converted the wrong number of tons'}]);break;}
// Lesson 24
case 'ah-metric-choice':{const k=int(0,5),d=int(2,8),[b,cc,e]=[['centimeters','millimeters','cm'],['millimeters','centimeters','mm'],['meters','centimeters','m'],['centimeters','meters','cm'],['millimeters','meters','mm'],['meters','millimeters','m']][k],give=[10*d,100*d,100*d,10*d,d,100*d][k],zz=[[d,1],[1000*d,1],[d,1],[1000*d,1],[1000*d,1],[d,10]][k];
 t=n(`How many ${b} are in ${give} ${cc}?`,R(...zz),`Use the metric relationship between ${cc} and ${b}: ${give} ${cc} = ${U.dec(R(...zz))} ${e}.`,{k,d},'decimal');
 t.choices=wrongOnly(t,[{value:U.dec(R(zz[0],zz[1]*10)),mistake:'Moved the decimal point one place too far left'},{value:comma(U.dec(R(zz[0]*10,zz[1]))),mistake:'Moved the decimal point one place too far right'},{value:comma(U.dec(R(zz[0]*100,zz[1]))),mistake:'Used 100 where 10 was needed'}]);break;}
// AH-2 end
default:throw Error('Unknown Algebra 1/2 port recipe '+c.recipe);}
return t;}

// ---------- answer kinds that exist only in this course ----------
// ah-seq: an ordered list of signed decimals or integers. ah-lists: whole-number sets, one per part, separated by
// semicolons. ah-words: word answers, one per part, separated by semicolons.
// ah-power: powers of whole numbers, as base^exponent factors. ah-mono: one product of variable powers (negative
// exponents allowed; a single fraction bar allowed). ah-names: names of one angle. ah-wordset: words in any order.
const caretS=s=>String(s).replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,m=>'^'+[...m].map(ch=>ch==='⁻'?'-':S.UNSUP[ch]).join(''));
function ownCheck(q,s){const a=q.answer,okv=v=>({answerCorrect:!!v,fullOutcomeVerified:false});
 if(a.kind==='ah-seq'){const toks=s.replace(/<|;/g,',').split(',').map(x=>x.trim()).filter(Boolean);if(toks.length!==a.values.length)return okv(false);return okv(toks.every((x,i)=>sameNum(parseNum(x),a.values[i])));}
 if(a.kind==='ah-lists'){const ps=s.split(';');if(ps.length!==a.lists.length)return okv(false);return okv(ps.every((p,i)=>{const r=p.replace(/^\s*\([a-z]\)\s*/i,'').replace(/(\d),(?=\d{3}(?!\d))/g,'$1').replace(/\band\b/gi,',');if(/[^\d,\s]/.test(r))return false;const g=(r.match(/\d+/g)||[]).map(Number),w=a.lists[i];return g.length===w.length&&new Set(g).size===g.length&&w.every(x=>g.includes(x));}));}
 if(a.kind==='ah-den'){const ps=s.split(';');if(ps.length!==a.parts.length)return okv(false);return okv(ps.every((p,i)=>{const m=p.replace(/^\s*\([a-z]\)\s*/i,'').trim().match(/^(\d+)\s*\/\s*(\d+)$/);return !!m&&Number(m[1])===a.parts[i][0]&&Number(m[2])===a.parts[i][1];}));}
 if(a.kind==='ah-points'){const ps=s.split(';');if(ps.length!==a.points.length)return okv(false);return okv(ps.every((p,i)=>{const m=p.replace(/^\s*\([a-d]\)\s*(?=\()/i,'').match(/^\s*\(?\s*(-?\d+)\s*,\s*(-?\d+)\s*\)?\s*$/);return !!m&&Number(m[1])===a.points[i][0]&&Number(m[2])===a.points[i][1];}));}
 if(a.kind==='ah-exprs'){const ps=s.split(';');if(ps.length!==a.parts.length)return okv(false);return okv(ps.every((p,i)=>{const r=p.replace(/^\s*\([a-d]\)\s*/i,'').trim();if(!r||/=/.test(r))return false;const fn=S.parseExpr(r,a.parts[i].vars);if(!fn)return false;return a.parts[i].samples.every(([env,v])=>{const g=fn(env);return Number.isFinite(g)&&Math.abs(g-v)<1e-9*Math.max(1,Math.abs(v));});}));}
 if(a.kind==='ah-power'){const r=caretS(s).replace(/\s+/g,''),toks=r.match(/\(?\d+\)?\^\(?-?\d+\)?/g)||[];if(r.replace(/\(?\d+\)?\^\(?-?\d+\)?/g,'').replace(/[×x·*()]/g,'')!=='')return okv(false);const got=toks.map(x=>x.replace(/[()]/g,'').split('^').map(Number)).map(([b,e])=>b+'^'+e).sort(),want=a.factors.map(([b,e])=>b+'^'+e).sort();return okv(got.join()===want.join());}
 if(a.kind==='ah-mono'){const r=caretS(s).replace(/\s+/g,'').replace(/[×·*]/g,''),sides=r.split('/');if(sides.length>2)return okv(false);const net={},seen=[{},{}];for(let k=0;k<sides.length;k++){const sd=sides[k].replace(/^\((.*)\)$/,'$1');if(sd==='1'&&(k===1||sides.length===2))continue;if(!/^(?:\(?[a-z](?:\^\(?-?\d+\)?)?\)?)+$/.test(sd))return okv(false);for(const m of sd.matchAll(/\(?([a-z])(?:\^\(?(-?\d+)\)?)?\)?/g)){const l=m[1],e=m[2]===undefined?1:Number(m[2]);if(!e||seen[k][l])return okv(false);seen[k][l]=1;net[l]=(net[l]||0)+(k?-e:e);}}
  if(Object.keys(seen[0]).some(l=>seen[1][l]))return okv(false);const want=a.exps,keys=new Set([...Object.keys(net),...Object.keys(want)]);return okv([...keys].every(l=>(net[l]||0)===(want[l]||0)));}
 if(a.kind==='ah-names'){const toks=s.split(/,|;|\bor\b|\band\b/i).map(x=>x.replace(/∠|angle|m(?=\s*∠)/gi,'').replace(/\s+/g,'').toUpperCase()).filter(Boolean);const valid=a.valid.map(x=>x.toUpperCase());return okv(toks.length===a.need&&new Set(toks).size===toks.length&&toks.every(x=>valid.includes(x)));}
 if(a.kind==='ah-wordset'){const w=wnorm(s).split(' ').filter(x=>x&&!['and','a','an','triangle','it','is'].includes(x));return okv(w.length===a.words.length&&a.words.every(x=>w.includes(x)));}
 if(a.kind==='ah-words'){const ps=s.split(';');if(ps.length!==a.parts.length)return okv(false);return okv(ps.every((p,i)=>wnorm(p.replace(/^\s*\([a-z]\)\s*/i,''))===wnorm(a.parts[i])));}
 return undefined;}
function check(q,response){let s=String(response??'');if(s.length>600)return{answerCorrect:false,fullOutcomeVerified:false};
 const a=q&&q.answer;if(!a)return undefined;
 // True minus signs, approximation marks and thousands commas in decimal answers are accepted as written.
 let s2=s.replace(/[−–]/g,'-').replace(/[≈∼~]/g,'');if(['decimal','numbers','ah-seq'].includes(a.kind))s2=s2.replace(/(\d),(?=\d{3}(?!\d))/g,'$1');
 const own=ownCheck(q,s2);if(own!==undefined)return own;
 if(s2!==s)return P().check({...q,givens:{...(q.givens||{}),recipe:'ah-'}},s2);
 return undefined;}
function answerText(q){const a=q.answer;if(a&&['ah-seq','ah-lists','ah-words','ah-den','ah-points','ah-exprs','ah-power','ah-mono','ah-names','ah-wordset'].includes(a.kind))return a.value;return undefined;}

const api=Object.freeze({key:'algebra-half',course:'Algebra 1/2',prefix:'ah-',batchPrefix:'AH',catalog,build,check,answerText});
if(common)module.exports=api;root.MathPortAlgebraHalf=api;
})(typeof globalThis!=='undefined'?globalThis:this);
