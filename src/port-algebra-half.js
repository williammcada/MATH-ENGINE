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
// Batch AH-3
// Lesson 25
case 'ah-area-difference-h':{let a,b,cc,d;do{a=int(10,20);b=int(Math.floor(a/4),Math.floor(a/2));cc=int(Math.floor(a/4),Math.floor(a/3));d=int(10,19);}while(cc<1||b<1);
 const k=int(0,5),u2=['cm','m','units','in.','ft','yd'][k],unit=['centimeters','meters','units','inches','feet','yards'][k],z=2*a*b+a*d-2*cc*d;
 const F=Fig();F.poly([[0,0],[0,a],[b,a],[b,a-cc],[b+d,a-cc],[b+d,a],[2*b+d,a],[2*b+d,0],[b+d,0],[b+d,cc],[b,cc],[b,0]]);
 F.txt([b/2,a+0.8],String(b)).txt([b/2,-1.6],String(b)).txt([b+d+b/2,a+0.8],String(b)).txt([b+d+b/2,-1.6],String(b)).txt([b+d/2,a-cc+0.8],String(d)).txt([b+d/2,cc-1.6],String(d));
 F.txt([b+0.4,a-cc/2],String(cc),{anchor:'start'}).txt([b+0.4,cc/2],String(cc),{anchor:'start'}).txt([-0.5,a/2],String(a),{anchor:'end'}).txt([2*b+d+0.5,a/2],String(a),{anchor:'start'});
 t=whole(`Use the difference of areas to find the area of this figure. Dimensions are in ${unit}. All angles are right angles.`,z,`Enclosing rectangle ${2*b+d} × ${a} = ${(2*b+d)*a}; subtract the two notches, each ${d} × ${cc}: ${(2*b+d)*a} − ${2*cc*d} = ${z} ${u2}².`,{a,b,c:cc,d},F.render('A rectangle with a rectangular notch cut from the middle of the top and of the bottom, every side labelled',320,220));
 t.choices=wrongOnly(t,[{value:String(2*a+4*b+2*d+4*cc),mistake:'Found the perimeter instead of the area'},{value:String(2*a*b+a*d+cc*d),mistake:'Added a notch instead of subtracting both'},{value:String(2*a*b+a*d-cc*d),mistake:'Subtracted only one notch'}]);break;}
// Lesson 26
case 'ah-mode-median-mean-range':{let v,m;do{const n=int(8,11);v=[];const base=shuffle(int,Array.from({length:36},(_,i)=>40+i)).slice(0,n);const rep=pick(base),times=int(2,3);v=base.slice();for(let i=0;i<times-1;i++)v[int(0,n-1)]=rep;
  const cnt={};v.forEach(x=>cnt[x]=(cnt[x]||0)+1);const mx=Math.max(...Object.values(cnt)),modes=Object.keys(cnt).filter(k=>cnt[k]===mx);m=modes.length===1&&mx>1?Number(modes[0]):null;}while(m===null);
 const n=v.length,s0=[...v].sort((x,y)=>x-y),med=n%2?R(s0[(n-1)/2],1):R(s0[n/2-1]+s0[n/2],2),sum=v.reduce((x,y)=>x+y),mean100=Math.round(100*sum/n);
 t=n2(`A high school English instructor returned graded essays to ${n} students in a sophomore English class. The students had the following scores: ${v.join(', ')}. Find the (a) range, (b) mode, (c) median, and (d) mean of this set of scores. Round any decimal results to two decimal places.`,[R(s0[n-1]-s0[0],1),R(m,1),med,R(mean100,100)],`Range ${s0[n-1]} − ${s0[0]} = ${s0[n-1]-s0[0]}; mode ${m}; median ${U.dec(med)}; mean ${sum} ÷ ${n} ≈ ${ds(mean100,2)}.`,{v});
 t.choices=wrongOnly(t,[{value:`${s0[n-1]}; ${m}; ${U.dec(med)}; ${ds(mean100,2)}`,mistake:'Gave the greatest score as the range'},{value:`${s0[n-1]-s0[0]}; ${m}; ${n%2?v[(n-1)/2]:v[n/2]}; ${ds(mean100,2)}`,mistake:'Took the middle score without ordering the scores first'},{value:`${s0[n-1]-s0[0]}; ${m}; ${U.dec(med)}; ${ds(Math.round(100*sum/(n-1)),2)}`,mistake:'Divided by one less than the number of scores'}]);break;}
case 'ah-contribution-stat':{let a,b,cc,d;do{a=10*int(1,10);b=10*int(1,10);cc=10*int(1,10);d=10*int(1,10);}while(new Set([a,b,cc,d]).size<4||(()=>{const v=[a,b,cc,d,a].sort((x,y)=>x-y);return new Set([(2*a+b+cc+d)/5,v[2],a,v[4]-v[0]]).size<4;})());const f=int(0,3),g=int(0,2),e=a;
 const ord=[[a,b,cc,d,e],[a,e,cc,d,b],[a,b,e,d,cc],[a,b,cc,e,d]][f],nm=['Vincent','Sandra','Denise','Paul'][f],pn=['he','she','she','he'][f],P1=['He','She','She','He'][f],p2=['she','he','he','she'][f],st=['mean','median','mode'][g];
 const vals=[a,b,cc,d,e],srt=[...vals].sort((x,y)=>x-y),mean=vals.reduce((x,y)=>x+y)/5,med=srt[2],rng=srt[4]-srt[0],z=[mean,med,a][g];
 t=whole(`${nm} was in charge of collecting contributions for the food bank. ${P1} received contributions of ${ord.map(x=>'$'+x).join(', ').replace(/, ([^,]*)$/,', and $1')}. The next potential contributor wanted to give an amount in line with the other contributions, so ${p2} asked, "What is an acceptable amount to give?" If ${nm} uses the ${st} of the previous contributions as the answer, what amount in dollars will ${pn} tell the potential contributor?`,z,`The ${st} of the five contributions is $${z}.`,{vals,g});t.answer.display='$'+z;
 t.choices=wrongOnly(t,[{value:'$'+[med,a,mean][g],mistake:`Gave the ${['median','mode','mean'][g]} instead of the ${st}`},{value:'$'+[a,mean,rng][g],mistake:`Gave the ${['mode','mean','range'][g]} instead of the ${st}`},{value:'$'+[rng,rng,med][g],mistake:`Gave the ${['range','range','median'][g]} instead of the ${st}`}]);break;}
case 'ah-bowling-average':{let a,b,cc,z;do{a=200+int(1,15)*pick([-1,1]);b=int(170,230);cc=int(170,230);z=3*cc-a-b;}while(a===b||a===cc||z>300||z<0);const k=int(0,5),nm=['Catherine','Ingrid','Claudette','Everett','Jimmy','George'][k],pn=k<3?'she':'he';
 t=whole(`${nm} bowled 2 games, scoring ${a} and ${b}. What must ${pn} bowl in the third game in order to have a ${cc} average for the 3 games?`,z,`Three games averaging ${cc} total ${3*cc}; ${3*cc} − ${a} − ${b} = ${z}.`,{a,b,c:cc});
 t.choices=wrongOnly(t,[{value:String(Math.floor((a+b+cc)/3)),mistake:'Averaged the two scores and the target'},{value:String(z+pick([-1,1])),mistake:'Arithmetic slip by one'},{value:String(3*a-b-cc),mistake:'Mixed up the target average and a game score'},{value:String(2*cc-a),mistake:'Used two games instead of three'}]);break;}
// Lesson 27
case 'ah-isosceles-area':{let a,b;do{a=int(3,19);b=int(3,9);}while(2*a>=6*b||a<=1.3*b);const k=int(0,5),u=['feet','yards','inches','meters','centimeters','units'][k];
 const F=Fig();F.poly([[0,0],[2*a,0],[a,b]]).seg([a,0],[a,b],{dash:'4,3'}).right([a,0],0,90).txt([a,-1.2],String(2*a)).txt([a+0.4,b/2],String(b),{anchor:'start'});
 t=whole(`Find the area of this triangle. Dimensions are in ${u}.`,a*b,`Area = ½ × base × height = ½ × ${2*a} × ${b} = ${a*b}.`,{a,b},F.render('A triangle with its base and dashed height labelled',300,160));
 t.choices=wrongOnly(t,[{value:String(2*a*b),mistake:'Forgot to take half of base × height'},{value:String(2*a+b),mistake:'Added the base and height'},{value:String(2*a+2*b),mistake:'Added the base and height twice'}]);break;}
case 'ah-right-triangle-area':{const T=[[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20],[7,24,25],[15,20,25],[10,24,26],[20,21,29],[18,24,30],[16,30,34],[21,28,35],[12,35,37],[15,36,39],[24,32,40],[9,40,41],[27,36,45],[14,48,50],[30,40,50],[24,45,51],[20,48,52],[28,45,53],[33,44,55],[40,42,58],[36,48,60],[11,60,61],[16,63,65],[25,60,65],[33,56,65],[39,52,65],[32,60,68],[42,56,70],[48,55,73],[24,70,74],[21,72,75],[45,60,75],[30,72,78],[48,64,80],[18,80,82],[13,84,85],[36,77,85],[40,75,85],[51,68,85],[60,63,87],[39,80,89],[54,72,90],[35,84,91]],[s1,s2,s3]=pick(T),k=int(0,5),u=['centimeters','meters','units','inches','feet','yards'][k];
 const h=s1*s2/s3,x0=s1*s1/s3,F=Fig();F.poly([[0,0],[s3,0],[x0,h]]).right([x0,h],Math.atan2(-h,-x0)*180/Math.PI,Math.atan2(-h,s3-x0)*180/Math.PI).txt([x0/2-s3*0.03,h/2+s3*0.03],String(s1),{anchor:'end'}).txt([(x0+s3)/2+s3*0.03,h/2+s3*0.03],String(s2),{anchor:'start'}).txt([s3/2,-s3*0.07],String(s3));
 t=dec(`Find the area of this triangle. Dimensions are in ${u}.`,s1*s2*5,1,`The two legs meet at a right angle, so they are a base and height: ½ × ${s1} × ${s2} = ${ds(s1*s2*5,1)}.`,{s1,s2,s3},F.render('A right triangle drawn on its longest side, with all three sides labelled and the right angle marked',300,170));
 t.choices=wrongOnly(t,[{value:String(s1*s2),mistake:'Forgot to take half'},{value:ds(s1*s3*5,1),mistake:'Used the longest side as the height'},{value:ds(s2*s3*5,1),mistake:'Used the longest side and the wrong leg'}]);break;}
// Lesson 28
case 'ah-improper-to-mixed':{let a,b;do{a=pick([3,5,7,9,11]);b=pick(Array.from({length:16},(_,i)=>2*i+1));}while(gcd(a,a+b)!==1);const d=pick([2,4,6,8,10,12]),e=pick(Array.from({length:16},(_,i)=>2*i+1));
 const G=[[4,6],[4,10],[4,14],[4,18],[4,22],[6,8],[6,10],[6,14],[6,16],[6,20],[6,22],[6,26],[6,28],[8,10],[8,12],[8,14],[8,18],[8,20],[8,22],[8,26],[8,28],[8,30],[10,12],[10,14],[10,16],[10,18],[10,22],[10,24],[10,26],[10,28],[10,32],[12,14],[12,16],[12,18],[12,20],[12,22],[12,26],[12,28],[12,30],[12,32]];let gh;do{gh=pick(G);}while(gh[0]===e);
 const F=[[a+b,a],[d+e,d],[gh[1],gh[0]]];
 t=n(`Convert the following improper fractions to mixed numbers: (a) ${F[0].join('/')} (b) ${F[1].join('/')} (c) ${F[2].join('/')}. Write each in simplest form.`,F.map(([x,y])=>R(x,y)),`Divide the numerator by the denominator and write the remainder over the denominator, then reduce: ${F.map(([x,y])=>U.mixed(R(x,y))).join('; ')}.`,{F},'mixed');
 t.choices=wrongOnly(t,[{value:F.map(([x,y])=>`${Math.floor(x/y)} ${x%y}/${y}`).join('; '),mistake:'Did not reduce the fraction part'},{value:F.map(([x,y])=>`${Math.floor(x/y)+1} ${x%y}/${y}`).join('; '),mistake:'Wrote one too many wholes'},{value:F.map(([x,y])=>`${x%y} ${Math.floor(x/y)}/${y}`).join('; '),mistake:'Swapped the quotient and the remainder'}]);break;}
case 'ah-mixed-to-improper':{const nums=shuffle(int,Array.from({length:91},(_,i)=>i+9)).slice(0,3),F=nums.map(nn=>{let d;do{d=int(2,nn-1);}while(gcd(nn,d)!==1);return[nn,d];});
 t=n(`Convert the following mixed numbers to improper fractions: (a) ${U.mixed(R(...F[0]))} (b) ${U.mixed(R(...F[1]))} (c) ${U.mixed(R(...F[2]))}`,F.map(([x,y])=>R(x,y)),`Multiply the whole number by the denominator and add the numerator: ${F.map(([x,y])=>`${x}/${y}`).join('; ')}.`,{F},'fraction');
 t.choices=wrongOnly(t,[{value:F.map(([x,y])=>`${Math.floor(x/y)*y}/${y}`).join('; '),mistake:'Forgot to add the numerator'},{value:F.map(([x,y])=>`${Math.floor(x/y)+x%y}/${y}`).join('; '),mistake:'Added the whole number to the numerator without multiplying'},{value:F.map(([x,y])=>`${x}/${y+1}`).join('; '),mistake:'Changed the denominator'}]);break;}
case 'ah-mixed-to-decimals':{const cs=int(1,3),b=[8,20,20][cs-1],a=cs===1?pick([1,3,5,7]):pick([3,5,7,9,11,13,15,17,19]),cc=int(2,5),cs2=int(1,3),e=[5,25,25][cs2-1];let d;if(cs2===1)d=int(1,4);else do{d=pick([3,5,7,9,11,13,15,17,19,21,23]);}while(d===15);const f=int(6,20);
 t=n(`Convert the following mixed numbers to decimal numbers: (a) ${cc} ${a}/${b} (b) ${f} ${d}/${e}`,[R(cc*b+a,b),R(f*e+d,e)],`Write each fraction part as a decimal: (a) ${U.dec(R(cc*b+a,b))}; (b) ${U.dec(R(f*e+d,e))}.`,{a,b,c:cc,d,e,f},'decimal');
 t.choices=wrongOnly(t,[{value:`${cc}.${a}; ${f}.${d}`,mistake:'Wrote the numerator as the decimal part'},{value:`${U.dec(R(cc*b+a,b*10))}; ${U.dec(R(f*e+d,e*10))}`,mistake:'Placed the decimal point one place too far left'},{value:`${cc+a/b}; ${f}.${e}`.replace(/(\d+\.\d{4})\d+/,'$1'),mistake:'Wrote the denominator as the decimal part in (b)'}]);break;}
case 'ah-decimal-to-mixed':{const a=int(1,5),b=int(1,9),cc=int(0,6),N=100*a+10*cc+b;
 t=n(`Write ${ds(N,2)} as a mixed number in simplest form.`,R(N,100),`${ds(N,2)} = ${a} ${10*cc+b}/100 = ${U.mixed(R(N,100))}.`,{N},'mixed');
 t.choices=wrongOnly(t,[{value:`${a} ${10*cc+b}/10`,mistake:'Used tenths instead of hundredths'},{value:`${a} ${10*cc+b}/100`,mistake:'Did not reduce the fraction part'},{value:`${a} ${10*cc+b}/1000`,mistake:'Used thousandths instead of hundredths'}]);break;}
case 'ah-mixed-to-improper-choice':{let a,b,cc;do{a=int(2,9);b=int(2,10);}while(a===b);do{cc=int(1,b-1);}while(gcd(b,cc)!==1);
 t=n(`What is ${a} ${cc}/${b} expressed as an improper fraction?`,R(a*b+cc,b),`${a} × ${b} + ${cc} = ${a*b+cc}, so ${a} ${cc}/${b} = ${a*b+cc}/${b}.`,{a,b,c:cc},'fraction');
 t.choices=wrongOnly(t,[{value:`${a*b}/${b}`,mistake:'Forgot to add the numerator'},{value:`${a*b-cc}/${b}`,mistake:'Subtracted the numerator'},{value:`${b!==10?10*a+cc:11*a+cc}/${b}`,mistake:'Wrote the whole number and numerator side by side'}]);break;}
case 'ah-mixed-to-decimal-choice':{let d,nn;do{d=int(2,99);nn=int(1,d-1);}while((nn*10)%d!==0);const w=int(1,30),N=w*10+nn*10/d;
 t=dec(`What is ${w} ${nn}/${d} expressed as a decimal number?`,N,1,`${nn}/${d} = ${ds(nn*10/d,1)}, so ${w} ${nn}/${d} = ${ds(N,1)}.`,{w,nn,d});
 t.choices=wrongOnly(t,[{value:ds(N+pick([-1,1]),1),mistake:'Wrote the wrong tenths digit'},{value:ds(N+2*pick([-1,1]),1),mistake:'Divided the fraction incorrectly'},{value:ds(N+3*pick([-1,1]),1),mistake:'Divided the fraction incorrectly'}]);break;}
// Lesson 29
case 'ah-bar-graph-read':{const MO=['Sept.','Oct.','Nov.','Dec.','Jan.','Feb.','Mar.','Apr.','May'],FULL=['September','October','November','December','January','February','March','April','May'],v=[int(19,21),int(14,18),int(14,18),int(12,13),int(14,18),int(14,18),int(14,18),int(14,18),int(14,18)];
 let m1,m2;do{m2=int(3,9);m1=int(1,m2-2);}while([3,6,7,9].includes(m2-m1+1));const k=m2-m1+1,ss=v.slice(m1-1,m2).reduce((x,y)=>x+y);
 const W=420,x0=46,y0=220,Y=y=>y0-(y-10)*14,bw=(W-x0-14)/9;let b=tx(W/2,18,'SWEATSHIRT SALES',{size:13});
 for(let y=11;y<=22;y++)b+=ln(x0,Y(y),W-10,Y(y),{color:'#c9d3d6',w:1})+(y%2===0?tx(x0-8,Y(y)+4,String(y),{size:11,anchor:'end'}):'');
 b+=tx(x0-8,y0+4,'0',{size:11,anchor:'end'})+ln(x0,y0,x0,Y(22.5),{w:1.5})+ln(x0,y0,W-10,y0,{w:1.5})+`<path d="M${x0-5},${Y(10.3)} l10,-4 l-10,-4 l10,-4" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
 v.forEach((h,i)=>{const x=x0+i*bw+bw*0.2;b+=`<rect x="${x.toFixed(1)}" y="${Y(h).toFixed(1)}" width="${(bw*0.6).toFixed(1)}" height="${(y0-Y(h)).toFixed(1)}" fill="#7d8f96" fill-opacity="0.55" stroke="${INK}" stroke-width="1.2"/>`+tx(x+bw*0.3,y0+16,MO[i],{size:10});});
 b+=tx(W/2,y0+36,'Month',{size:12})+`<text x="14" y="${Y(16)}" font-size="12" text-anchor="middle" transform="rotate(-90 14 ${Y(16)})" fill="${INK}">Number Sold</text>`;
 t=n(`Based on the graph, (a) how many more sweatshirts were sold during the month with the most sales than during the month with the least sales, and (b) what is the mean number of sweatshirts sold monthly from ${FULL[m1-1]} through ${FULL[m2-1]}?`,[R(Math.max(...v)-Math.min(...v),1),R(ss,k)],`(a) ${Math.max(...v)} − ${Math.min(...v)} = ${Math.max(...v)-Math.min(...v)}; (b) ${ss} ÷ ${k} = ${U.dec(R(ss,k))}.`,{v,m1,m2},'decimal',svg(b,'Bar graph of sweatshirt sales by month, September to May; the vertical axis is broken between 0 and 11',W,y0+44));
 t.choices=wrongOnly(t,[{value:`${Math.max(...v)}; ${U.dec(R(ss,k))}`,mistake:'Gave the greatest month instead of the difference'},{value:`${Math.max(...v)-Math.min(...v)}; ${U.dec(R(ss,k-1))}`,mistake:'Counted one month too few when dividing'},{value:`${Math.max(...v)-Math.min(...v)}; ${U.dec(R(v.reduce((x,y)=>x+y),9))}`,mistake:'Averaged all nine months'}]);break;}
case 'ah-make-graphs':{const v=Array.from({length:5},()=>int(1,29)),MO=['Jan.','Feb.','Mar.','Apr.','May'];
 const key=S.barGraph(MO,v,'Overcast Days','Days',30,5)+S.lineGraph([1,2,3,4,5],v,{title:'Overcast Days',xLabel:'Month',yLabel:'Days',xmin:1,xmax:5,xstep:1,ymin:0,ymax:30,ystep:5,xfmt:x=>MO[x-1],label:`Overcast Days: broken-line graph of ${MO.map((m,i)=>m+' '+v[i]).join(', ')}`});
 t=teacher(`The numbers of overcast days for the months of January through May were: January, ${v[0]}; February, ${v[1]}; March, ${v[2]}; April, ${v[3]}; and May, ${v[4]}. Create a bar graph and a broken-line graph to present this information.`,`A bar graph and a broken-line graph showing ${MO.map((m,i)=>`${m} ${v[i]}`).join(', ')}.`,['Both graphs have a title and labelled axes (months; number of days) with an even scale starting at 0.','Each bar height matches the data.','The line graph plots each month at the correct value and joins the points in order.'],{v},'',key);break;}
case 'ah-circle-graph':{const fb=int(50,75),bb=fb+int(7,12),bk=bb+int(7,12),sc=fb+int(2,6),names=['mystery novels','biographies','romance novels','adventure books'],vals=[fb,bb,bk,sc],i=int(0,3);let j;do{j=int(0,3);}while(j===i);
 const hi=vals[i]>=vals[j]?i:j,lo=hi===i?j:i,z=vals[hi]-vals[lo],others=[0,1,2,3].filter(x=>x!==i&&x!==j),tot=vals.reduce((x,y)=>x+y),cx=180,cy=150,r=95;let b=tx(cx,22,'NUMBER OF STUDENTS READING BOOKS',{size:12}),ang=90;
 b+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;const lab=['Mystery','Biography','Romance','Adventure'];
 vals.forEach((v,k)=>{const sweep=360*v/tot,P=(a,rr)=>[cx+rr*Math.cos(a*Math.PI/180),cy-rr*Math.sin(a*Math.PI/180)],[x1,y1]=P(ang,r);b+=ln(cx,cy,x1,y1,{w:1.2});const mid=ang-sweep/2,[lx,ly]=P(mid,r*0.58);b+=tx(lx,ly-3,lab[k],{size:11})+tx(lx,ly+12,String(v),{size:11});ang-=sweep;});
 t=whole(`Based on the graph, how many more students read ${names[hi]} than ${names[lo]}?`,z,`${vals[hi]} − ${vals[lo]} = ${z}.`,{vals,hi,lo},svg(b,'Circle graph of the number of students reading mystery, biography, romance and adventure books, each sector labelled with its count',360,260));
 t.choices=wrongOnly(t,[{value:String(z+pick([-1,1])*int(1,4)),mistake:'Subtraction slip'},{value:String(vals[others[0]]+vals[others[1]]),mistake:'Added the other two sectors'},{value:String(vals[i]+vals[j]),mistake:'Added the two numbers instead of subtracting'}]);break;}
// Lesson 30
case 'ah-fraction-plus-unit':{let a,b;do{a=int(3,11);b=int(2,9);}while(a===b);const plus=int(1,2)===2;
 t=n(`Simplify: ${a-1}/${a} ${plus?'+':'−'} 1/${b}`,R(b*(a-1)+(plus?a:-a),a*b),`Use the common denominator ${a*b}: ${b*(a-1)}/${a*b} ${plus?'+':'−'} ${a}/${a*b} = ${U.f(R(b*(a-1)+(plus?a:-a),a*b))}.`,{a,b,plus},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.f(R(a-1+(plus?1:-1),a+b))+(a-1+(plus?1:-1)===0?'1':''),mistake:'Added or subtracted the numerators and the denominators'},{value:U.f(R(b*(a-1)+(plus?-a:a),a*b)),mistake:'Used the wrong operation'},{value:`${a-1+(plus?1:-1)}/${a*b}`,mistake:'Did not rename the numerators for the common denominator'}]);break;}
case 'ah-three-fractions-add':{const v=shuffle(int,[2,3,4,5,6,7,8]).slice(0,3),[a,b,cc]=v,pickNum=den=>{let x;do{x=int(1,den-1);}while(gcd(x,den)!==1);return x;},d=pickNum(a),e=pickNum(b),f=pickNum(cc);let g,hh,N;do{g=pick([-1,1]);hh=pick([-1,1]);N=d*b*cc+g*e*a*cc+hh*f*a*b;}while(N<=0);
 const sg=x=>x>0?'+':'−';t=n(`Simplify: ${d}/${a} ${sg(g)} ${e}/${b} ${sg(hh)} ${f}/${cc}`,R(N,a*b*cc),`Use a common denominator and combine: ${U.f(R(N,a*b*cc))}.`,{a,b,c:cc,d,e,f,g,h:hh},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.f(R(d*b*cc+e*a*cc+f*a*b,a*b*cc)),mistake:'Added all three fractions, ignoring the subtraction signs'},{value:U.f(R(Math.abs(d+g*e+hh*f)||1,a+b+cc)),mistake:'Combined the numerators and the denominators directly'},{value:`${N}/${a*b*cc}`,mistake:'Did not reduce the result'},{value:U.f(R(N+a*b*cc,a*b*cc)),mistake:'Arithmetic slip of one whole'},{value:U.f(R(d*b*cc+g*e*a*cc,a*b*cc)),mistake:'Left out the last fraction'}]);break;}
case 'ah-fractions-three-choice':{const T=[[7,3,2,11,7,4],[3,4,6,7,23,2],[2,8,3,9,19,1],[6,2,7,7,9,5],[5,2,3,7,5,4],[4,3,5,7,4,3],[7,2,4,11,7,5],[3,7,2,19,3,2],[2,4,3,7,11,1],[6,3,4,11,7,5],[5,2,7,9,5,4],[4,6,3,23,13,3]],[a,b,cc,n1,n2,n3]=pick(T),N=n1*cc+n2*a-n3*b*cc,D=a*b*cc;
 t=n(`Simplify: ${n1}/${a*b} + ${n2}/${b*cc} − ${n3}/${a}`,R(N,D),`Common denominator ${D}: ${n1*cc}/${D} + ${n2*a}/${D} − ${n3*b*cc}/${D} = ${U.f(R(N,D))}.`,{a,b,c:cc,n1,n2,n3},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.f(R(Math.abs(n1+n2-n3),a*b+b*cc+a)),mistake:'Combined the numerators and added the denominators'},{value:U.f(R(Math.abs(N+D*pick([-1,1])),D)),mistake:'Arithmetic slip of one whole'},{value:U.f(R(Math.abs(n1+n2-n3),D)),mistake:'Did not rename the numerators'}]);break;}
// Lesson 31
case 'ah-order-ops':{let a,b,cc,d,e;do{a=int(36,52);b=int(2,10);cc=b>6?int(2,3):int(2,6);d=int(3,7);e=int(3,7);}while(b===cc||d===e);const z=a-b*cc+d*e;
 t=whole(`Simplify: ${a} − ${b} · ${cc} + ${d} · ${e}`,z,`Multiply first: ${a} − ${b*cc} + ${d*e} = ${z}.`,{a,b,c:cc,d,e});
 t.choices=wrongOnly(t,[{value:String(((a-b)*cc+d)*e),mistake:'Worked from left to right without multiplying first'},{value:String(a-b*cc-d*e),mistake:'Subtracted the second product'},{value:String(a-(b*cc+d*e)),mistake:'Grouped the two products before subtracting'}]);break;}
case 'ah-order-ops-choice':{let a,b,cc,d,e,f,g;do{a=int(6,13);b=int(5,9);cc=int(5,9);d=int(2,7);e=int(2,4);f=int(2,6);g=int(2,9);}while(a===b||b===cc||d===e||e===f||f===g);const z=a+b*cc-d*e+f*g;
 t=whole(`Simplify: ${a} + ${b} · ${cc} − ${d} · ${e} + ${f} · ${g}`,z,`Multiply first: ${a} + ${b*cc} − ${d*e} + ${f*g} = ${z}.`,{a,b,c:cc,d,e,f,g});
 t.choices=wrongOnly(t,[{value:String((a+b)*cc-d*e+f*g),mistake:'Added before multiplying'},{value:String(a+b+cc-d-e+f+g),mistake:'Added and subtracted every number instead of multiplying'},{value:String(z-a+b),mistake:'Replaced the first term with the next factor'}]);break;}
// Lesson 32
case 'ah-evaluate-xy':{let b,cc;do{b=int(2,9);cc=int(2,9);}while(b===cc);const a=int(1,2),plus=int(1,2)===1,last=a===1?'y':'x',lv=a===1?cc:b,z=b*cc+(plus?lv:-lv);
 t=whole(`Evaluate: xy ${plus?'+':'−'} ${last} if x = ${b} and y = ${cc}`,z,`xy = ${b*cc}; ${b*cc} ${plus?'+':'−'} ${lv} = ${z}.`,{x:b,y:cc,last,plus});
 t.choices=wrongOnly(t,[{value:String(b+cc+(plus?lv:-lv)),mistake:'Added x and y instead of multiplying'},{value:String(b*cc+(plus?-lv:lv)),mistake:'Used the wrong operation'},{value:String(Number(`${b}${cc}`)+(plus?lv:-lv)),mistake:'Wrote xy as the digits side by side'}]);break;}
case 'ah-evaluate-fractions':{const L=letterRun2(int,2,'oile'),[X,Y]=L;let a,b,cc;do{a=int(4,7);b=int(2,9);}while(a===b||a*b>25);do{cc=int(2,9);}while(cc===a||cc===b||b*cc>25);let n1,n2;do{n1=int(Math.round(b*cc/2),b*cc-1);}while(gcd(n1,b*cc)!==1);do{n2=int(Math.round(a/2),a-1);}while(gcd(n2,a)!==1||n2===2);
 const n3=n2-1,plus=int(1,2)===1||n3*n2*b*cc-n1*n2<=0,val=plus?R(n1*n2+n3*n2*b*cc,a*b*cc):R(n3*n2*b*cc-n1*n2,a*b*cc);
 const expr=plus?`${X}${Y} + ${n3}${Y}`:`${n3}${Y} − ${X}${Y}`;
 t=n(`Evaluate: ${expr} if ${X} = ${n1}/${b*cc} and ${Y} = ${n2}/${a}`,val,`${X}${Y} = ${U.f(R(n1*n2,a*b*cc))} and ${n3}${Y} = ${U.f(R(n3*n2,a))}; ${plus?'add':'subtract'}: ${U.mixed(val)}.`,{n1,b,c:cc,n2,a,n3,plus},'mixed');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(plus?R(Math.abs(n1*n2-n3*n2*b*cc),a*b*cc):R(n3*n2*b*cc+n1*n2,a*b*cc)),mistake:'Used the wrong operation'},{value:U.mixed(R(n3*n2,a)),mistake:`Left out the product ${X}${Y}`},{value:U.mixed(R(n1*a+n2*b*cc+(plus?1:0)*n3*n2*b*cc,a*b*cc)),mistake:`Added ${X} and ${Y} instead of multiplying them`}]);break;}
case 'ah-evaluate-decimals':{const L=letterRun2(int,3,'oileh'),[A,B,C]=L;let e,f,g;do{f=int(1,499);g=int(1,499);e=int(30,499);}while(new Set([e,f,g]).size<3||e*100-g*100-f*g<=0);const p1=pick([1,-1]),p2=pick([1,-1]);const Z=e*100+p1*g*100+p2*f*g;
 const sgn=x=>x>0?'+':'−';t=dec(`Evaluate: ${A} ${sgn(p1)} ${C} ${sgn(p2)} ${B}${C} if ${A} = ${ds(e,2)}, ${B} = ${ds(f,2)}, and ${C} = ${ds(g,2)}`,Z,4,`${B}${C} = ${ds(f*g,4)}; ${ds(e,2)} ${sgn(p1)} ${ds(g,2)} ${sgn(p2)} ${ds(f*g,4)} = ${ds(Z,4)}.`,{e,f,g,p1,p2});
 t.choices=wrongOnly(t,[{value:ds(e*100+p1*g*100+p2*(f+g)*100,4),mistake:`Added ${B} and ${C} instead of multiplying`},{value:ds(e*100-p1*g*100+p2*f*g,4),mistake:'Used the wrong sign for the second term'},{value:ds(e*100+p1*g*100+p2*f*g*10,4),mistake:'Misplaced the decimal point in the product'}]);break;}
case 'ah-evaluate-quotient':{const L=letterRun2(int,2,'oileh'),[A,B]=L,plus=int(1,2)===1,nn=int(2,12),f=int(2,10),m=nn*f,z=plus?m*nn+f:m*nn-f;
 t=whole(`Evaluate: ${A}${B} ${plus?'+':'−'} ${A}/${B} if ${A} = ${m} and ${B} = ${nn}`,z,`${A}${B} = ${m*nn} and ${A}/${B} = ${f}; ${m*nn} ${plus?'+':'−'} ${f} = ${z}.`,{m,n:nn,plus});
 t.choices=wrongOnly(t,[{value:String(plus?m*nn-f:m*nn+f),mistake:'Used the wrong operation'},{value:String(m+nn+(plus?f:-f)),mistake:`Added ${A} and ${B} instead of multiplying`},{value:String(m*nn+(plus?nn/m:-nn/m)).slice(0,8),mistake:`Divided ${B} by ${A}`}]);break;}
case 'ah-evaluate-xyz':{let b,cc,d;do{b=int(2,6);cc=int(2,5);d=int(2,10);}while(new Set([b,cc,d]).size<3);const k=int(0,7),s1=k<4?'−':'+',useY=k%2===0,s2=[0,1,4,5].includes(k)?'+':'−';
 const mid=useY?cc*d:b*d,last=useY?cc:b,z=b*cc*d+(s1==='+'?mid:-mid)+(s2==='+'?last:-last);
 t=whole(`Evaluate: xyz ${s1} ${useY?'yz':'xz'} ${s2} ${useY?'y':'x'} if x = ${b}, y = ${cc}, and z = ${d}`,z,`xyz = ${b*cc*d}, ${useY?'yz':'xz'} = ${mid}; ${b*cc*d} ${s1} ${mid} ${s2} ${last} = ${z}.`,{x:b,y:cc,z:d,k});
 const mid2=useY?b*d:cc*d,last2=useY?b:cc;
 t.choices=wrongOnly(t,[{value:String(b*cc*d+(s1==='+'?mid2:-mid2)+(s2==='+'?last:-last)),mistake:'Substituted the wrong variable in the middle term'},{value:String(b*cc*d+(s1==='+'?mid:-mid)+(s2==='+'?last2:-last2)),mistake:'Substituted the wrong variable in the last term'},{value:String(b*cc*d+(s1==='+'?1:-1)*last*last),mistake:'Squared a variable instead of multiplying two different ones'}]);break;}
// Lesson 33
case 'ah-two-multipliers-yards':{const a=int(1,2),b=int(20,59);
 if(a===1){t=n(`Use two unit multipliers to convert ${b} inches to yards. Write the answer as a fraction or mixed number in simplest form.`,R(b,36),`${b} in. × (1 ft / 12 in.) × (1 yd / 3 ft) = ${b}/36 yd = ${U.mixed(R(b,36))} yd.`,{a,b},'mixed');t.eitherForm=true;
  t.choices=wrongOnly(t,[{value:String(b*36),mistake:'Multiplied instead of dividing'},{value:U.mixed(R(b,12)),mistake:'Converted only to feet'},{value:U.mixed(R(b,15)),mistake:'Added the conversion factors instead of multiplying'}]);}
 else{t=whole(`Use two unit multipliers to convert ${b} yards to inches.`,36*b,`${b} yd × (3 ft / 1 yd) × (12 in. / 1 ft) = ${36*b} in.`,{a,b});t.choices=wrongOnly(t,[{value:String(3*b),mistake:'Converted only to feet'},{value:String(15*b),mistake:'Added the conversion factors instead of multiplying'},{value:U.mixed(R(b,36)),mistake:'Divided instead of multiplying'}]);}break;}
case 'ah-two-multipliers-metric':{const a=int(5,6),b=int(20,59);
 if(a===5){t=dec(`Use two unit multipliers to convert ${b} centimeters to kilometers.`,b,5,`${b} cm × (1 m / 100 cm) × (1 km / 1000 m) = ${ds(b,5)} km.`,{a,b});t.choices=wrongOnly(t,[{value:ds(b,3),mistake:'Divided by 1000 only'},{value:ds(b,2),mistake:'Divided by 100 only'},{value:comma(b*100000),mistake:'Multiplied instead of dividing'}]);}
 else{t=whole(`Use two unit multipliers to convert ${b} kilometers to centimeters.`,b*100000,`${b} km × (1000 m / 1 km) × (100 cm / 1 m) = ${comma(b*100000)} cm.`,{a,b});t.choices=wrongOnly(t,[{value:comma(b*1000),mistake:'Converted only to meters'},{value:comma(b*10000),mistake:'Used one zero too few'},{value:ds(b,5),mistake:'Divided instead of multiplying'}]);}break;}
case 'ah-inches-miles':{const a=int(1,2),b=int(20,59),toMi=a===1;
 if(toMi){t=n(`How many miles are in ${b} inches? Write the answer as a fraction in lowest terms.`,R(b,63360),`${b} in. × (1 ft / 12 in.) × (1 mi / 5280 ft) = ${b}/63,360 = ${U.f(R(b,63360))} mi.`,{a,b},'fraction');
  t.choices=wrongOnly(t,[{value:comma(b*63360),mistake:'Multiplied instead of dividing'},{value:U.f(R(b*5280,12)),mistake:'Divided by 12 but multiplied by 5280'},{value:U.f(R(b*12,5280)),mistake:'Multiplied by 12 but divided by 5280'}]);}
 else{t=whole(`How many inches are in ${b} miles?`,b*63360,`${b} mi × (5280 ft / 1 mi) × (12 in. / 1 ft) = ${comma(b*63360)} in.`,{a,b});
  t.choices=wrongOnly(t,[{value:U.f(R(b,63360)),mistake:'Divided instead of multiplying'},{value:comma(b*440),mistake:'Divided by 12 instead of multiplying'},{value:comma(b*5280),mistake:'Converted only to feet'}]);}break;}
case 'ah-sq-ft-to-sq-in':{const a=int(2,9);t=whole(`Use two unit multipliers to convert ${a} square feet to square inches.`,144*a,`${a} ft² × (12 in. / 1 ft) × (12 in. / 1 ft) = ${144*a} in.²`,{a});
 t.choices=wrongOnly(t,[{value:String(12*a),mistake:'Used only one unit multiplier'},{value:String(24*a),mistake:'Added the multipliers instead of multiplying'},{value:U.mixed(R(a,144)),mistake:'Divided instead of multiplying'}]);break;}
case 'ah-sq-m-to-sq-cm':{const C=10*int(1,8)+int(1,9);t=whole(`Use two unit multipliers to convert ${ds(C,1)} square meters to square centimeters.`,C*1000,`${ds(C,1)} m² × (100 cm / 1 m) × (100 cm / 1 m) = ${comma(C*1000)} cm².`,{C});
 t.choices=wrongOnly(t,[{value:comma(C*10),mistake:'Used only one unit multiplier'},{value:comma(C*100),mistake:'Moved the decimal point too few places'},{value:ds(C,5),mistake:'Divided instead of multiplying'}]);break;}
case 'ah-sq-to-larger':{const a=int(1,2),b=int(20,59),f=a===1?12:100,sq=f*f;
 if(a===1){t=n(`How many square feet are in ${b} square inches? Write the answer as a fraction in lowest terms.`,R(b,sq),`${b} in.² × (1 ft / 12 in.) × (1 ft / 12 in.) = ${b}/144 = ${U.f(R(b,sq))} ft².`,{a,b},'fraction');}
 else{t=dec(`How many square meters are in ${b} square centimeters? Write the answer as a decimal.`,b,4,`${b} cm² × (1 m / 100 cm) × (1 m / 100 cm) = ${ds(b,4)} m².`,{a,b});}
 t.choices=wrongOnly(t,[{value:a===1?comma(b*sq):comma(b*sq),mistake:'Multiplied instead of dividing'},{value:a===1?U.f(R(b,12)):ds(b,2),mistake:'Used only one unit multiplier'},{value:a===1?String(b*12):String(b*100),mistake:'Multiplied by one factor instead of dividing'}]);break;}
// Lesson 34
case 'ah-add-three-mixed':{let a,b,cc,d1,d2,d3,e,f,g,m,N;do{a=int(1,6);b=int(2,6);cc=int(1,6);d1=int(2,4);d2=d1*int(2,3);d3=d1*int(2,3);e=int(1,d1-1);f=int(1,d2-1);g=int(1,d3-1);m=[d1,d2,d3].reduce((x,y)=>x*y/gcd(x,y));N=(a*d1+e)*m/d1+(b*d2+f)*m/d2+(cc*d3+g)*m/d3;}while(gcd(N,m)!==1);
 const fs=[[a*d1+e,d1],[b*d2+f,d2],[cc*d3+g,d3]];
 t=n(`Add: ${fs.map(x=>U.mixed(R(...x))).join(' + ')}`,R(N,m),`Use the common denominator ${m}: ${U.mixed(R(N,m))}.`,{fs},'mixed');
 t.choices=wrongOnly(t,[{value:U.mixed(R(N-m,m)),mistake:'Did not carry the whole number from the fraction sum'},{value:`${a+b+cc} ${e+f+g}/${d1+d2+d3}`,mistake:'Added the numerators and the denominators'},{value:U.mixed(R(N+m,m)),mistake:'Carried one too many wholes'}]);break;}
case 'ah-add-two-mixed':{let A,aa,cc,f,b,e;do{aa=int(143,578);A=int(1239,9374);cc=int(2,9);f=int(2,9);e=int(1,f-1);b=int(1,cc-1);}while(gcd(b,cc)!==1||gcd(e,f)!==1||b/cc+e/f<=1);
 const N=(cc*A+b)*f+(f*aa+e)*cc,D=cc*f;
 t=n(`Add: ${U.mixed(R(cc*A+b,cc))} + ${U.mixed(R(f*aa+e,f))}`,R(N,D),`Add the whole numbers and the fractions, then regroup: ${U.mixed(R(N,D))}.`,{A,b,c:cc,aa,e,f},'mixed');
 t.choices=wrongOnly(t,[{value:`${A+aa} ${U.f(R(b+e,cc+f))}`,mistake:'Added the numerators and the denominators'},{value:U.mixed(R(b*f+e*cc+D*(A+aa),D*1)).replace(/^\d+/,m=>String(Number(m)-1)),mistake:'Did not regroup the fraction sum into a whole'},{value:U.mixed(R(N+D,D)),mistake:'Regrouped one whole too many'}]);break;}
case 'ah-rate-km':{const a=int(6,11),b=int(11,29),k=int(0,5),nm=['Susan','Camille','Simone','Matthew','Jonathan','Curtis'][k],pn=k<3?'her':'his';
 t=n(`${nm} could travel ${a*b} kilometers in ${a} hours. (a) What was ${pn} rate in kilometers per hour? (b) What was ${pn} rate in hours per kilometer? Enter the two numbers without units, separated by a semicolon.`,[b,R(1,b)],`(a) ${a*b} km ÷ ${a} h = ${b} km/h; (b) ${a} h ÷ ${a*b} km = 1/${b} h/km.`,{a,b},['numbers','fraction']);t.answer.display=`${b}; 1/${b}`;
 t.choices=wrongOnly(t,[{value:`${a}; 1/${a}`,mistake:'Used the number of hours as the rate'},{value:`1/${b}; ${b}`,mistake:'Swapped the two rates'},{value:`${a*b}; 1/${a*b}`,mistake:'Did not divide by the time'}]);break;}
case 'ah-rate-hotel':{const perNight=int(1,2)===1,b=int(3,8),z=int(65,105),cc=z*b;
 if(perNight){t=whole(`Patricia paid ${cc} dollars for ${b} nights at a hotel. What was the rate in dollars per night?`,z,`${cc} ÷ ${b} = ${z} dollars per night.`,{b,c:cc,perNight});t.choices=wrongOnly(t,[{value:comma(cc*b),mistake:'Multiplied instead of dividing'},{value:String(2*z),mistake:'Divided by half the nights'},{value:String(Math.round(z/2)),mistake:'Divided by twice the nights'}]);}
 else{t=n(`Patricia paid ${cc} dollars for ${b} nights at a hotel. What was the rate in nights per dollar? Write the answer as a fraction.`,R(1,z),`${b} nights ÷ ${cc} dollars = 1/${z} night per dollar.`,{b,c:cc,perNight},'fraction');t.choices=wrongOnly(t,[{value:String(z),mistake:'Gave dollars per night instead'},{value:`1/${2*z}`,mistake:'Divided by twice the cost'},{value:`1/${cc*b}`,mistake:'Multiplied instead of dividing'}]);}break;}
// Lesson 35
case 'ah-subtract-mixed':{const r1=pick([[5,4],[6,5],[7,4],[7,5],[7,6],[8,5],[8,7],[9,4],[9,5],[9,7],[9,8]]),[a,d]=r1,[b,cc]=pick([[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[2,3],[2,5],[2,7],[2,9],[3,4],[3,5],[3,7],[3,8],[4,5],[4,7],[4,9],[5,6],[5,7],[5,8],[5,9],[6,7],[7,8],[7,9]]);let e,f;do{e=int(1,6);f=int(e+2,8);}while(cc===f||gcd(e,f)!==1);
 const N=(a*cc+b)*f-(d*f+e)*cc,D=cc*f;
 t=n(`Subtract: ${a} ${b}/${cc} − ${d} ${e}/${f}`,R(N,D),`Use the common denominator, regrouping if needed: ${U.mixed(R(N,D))}.`,{a,b,c:cc,d,e,f},'mixed');
 t.choices=wrongOnly(t,[{value:`${a-d} ${U.f(R(Math.abs(b*f-e*cc),D))}`,mistake:'Subtracted the smaller fraction from the larger instead of regrouping'},{value:U.mixed(R(N+D,D)),mistake:'Forgot to reduce the whole number after regrouping'},{value:`${a-d} ${Math.abs(b-e)}/${Math.abs(cc-f)||1}`,mistake:'Subtracted the numerators and the denominators'}]);break;}
case 'ah-subtract-mixed-choice':{let a,d,cc,f,b,e;do{a=int(2,5);d=int(1,a-1);cc=int(3,8);f=int(cc+1,10);b=int(1,cc-1);e=int(b+1,f-1);}while(!(b/cc<e/f)||f%cc===0||cc%f===0);
 const N=f*(a*cc+b)-cc*(d*f+e),D=cc*f;
 t=n(`Subtract: ${U.mixed(R(a*cc+b,cc))} − ${U.mixed(R(f*d+e,f))}`,R(N,D),`Regroup one whole and subtract: ${U.mixed(R(N,D))}.`,{a,b,c:cc,d,e,f},'mixed');
 t.choices=wrongOnly(t,[{value:U.mixed(R((a-d)*D+e*cc+b*f,D)),mistake:'Added the fractions instead of subtracting'},{value:U.mixed(R(Math.abs(f*(a*cc+b)-(cc+1)*(d*f+e)),D)),mistake:'Renamed one fraction incorrectly'},{value:U.mixed(R(Math.abs((a-d)*D+e*cc-b*f),D)),mistake:'Subtracted the fractions in the wrong order'}]);break;}
// Lesson 36
case 'ah-rate-tea':{const a=int(2,12),b=int(15,30),d=int(11,25),z=b+d;
 t=whole(`${numWordCap(b)} kilograms of tea cost ${a*b} dollars. How many kilograms of tea could you buy for ${z*a} dollars?`,z,`The rate is ${a*b} ÷ ${b} = ${a} dollars per kilogram; ${z*a} ÷ ${a} = ${z} kg.`,{a,b,d});
 t.choices=wrongOnly(t,[{value:String(z*a*b),mistake:'Multiplied instead of dividing'},{value:String(d),mistake:'Found only the extra kilograms'},{value:String(z+a),mistake:'Added the price per kilogram'}]);break;}
case 'ah-rate-points':{const b=pick([8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25]),d=pick([11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29]),k=int(0,3),nm=['Adrienne','Ashanti','David','Luis'][k],pn=k<2?'she':'he';
 t=n(`${nm} averaged ${b} points per game. Write the two rates implied by this statement, as points per game and games per point, then find how many points ${pn} would score in ${d} games at this average. Write the answers as numbers or fractions separated by semicolons, for example 7/1; 1/7; 70.`,[R(b,1),R(1,b),R(b*d,1)],`The rates are ${b} points/1 game and 1 game/${b} points; ${b} × ${d} = ${b*d} points.`,{b,d},['fraction','fraction','numbers']);t.answer.display=`${b}/1; 1/${b}; ${b*d}`;
 t.choices=wrongOnly(t,[{value:`1/${b}; ${b}/1; ${b*d}`,mistake:'Swapped the two rates'},{value:`${b}/1; 1/${b}; ${b+d}`,mistake:'Added instead of multiplying'},{value:`${b}/1; 1/${b}; ${U.f(R(d,b))}`,mistake:'Divided instead of multiplying'}]);break;}
case 'ah-rate-spice':{const a=int(4,20),b=int(8,25),d=int(10,25),e=b+d;
 t=whole(`${numWordCap(b)} pounds of spice cost ${a*b} dollars. What is the cost in dollars of ${e} pounds of spice?`,e*a,`${a*b} ÷ ${b} = ${a} dollars per pound; ${a} × ${e} = ${e*a} dollars.`,{a,b,e});
 t.choices=wrongOnly(t,[{value:String(e*a+2*pick([-1,1])),mistake:'Arithmetic slip'},{value:String(d*a),mistake:'Found only the cost of the extra pounds'},{value:String(a*(d+pick([-1,1]))),mistake:'Used the wrong number of pounds'}]);break;}
// Lesson 37
case 'ah-solve-x-plus':{const a=int(10,30),b=int(1,7);t=whole(`Solve: x + ${b} = ${a}`,a-b,`Subtract ${b} from both sides: x = ${a-b}.`,{a,b});
 t.choices=wrongOnly(t,[{value:String(a+b),mistake:'Added instead of subtracting'},{value:String(a),mistake:'Did not undo the addition'},{value:String(a-b+pick([-1,1])),mistake:'Subtraction slip'}]);break;}
case 'ah-solve-x-minus':{const a=int(11,30),b=int(1,7);t=whole(`Solve: x − ${b} = ${a}`,a+b,`Add ${b} to both sides: x = ${a+b}.`,{a,b});
 t.choices=wrongOnly(t,[{value:String(a-b),mistake:'Subtracted instead of adding'},{value:String(a*b),mistake:'Multiplied the numbers'},{value:String(a+b+pick([-2,-1,1,2])),mistake:'Addition slip'}]);break;}
// Lesson 38
case 'ah-read-points':{let a,b,cc,d,e,f;do{a=int(2,8);b=int(2,8);cc=-int(2,8);d=int(2,8);e=-int(2,8);f=-int(2,8);}while(new Set([`${a},${b}`,`${cc},${d}`,`${e},${f}`,`${d},${e}`]).size<4);
 const P=[[a,b],[cc,d],[e,f],[d,e]],key=P.map(([x,y])=>`(${minus(x)}, ${minus(y)})`).join('; ');
 t={prompt:'Four points are graphed on this coordinate plane. What are the x- and y-coordinates of points (a), (b), (c) and (d)? Write the four ordered pairs in order, separated by semicolons.',answer:{kind:'ah-points',points:P,value:key},solution:`Read across, then up or down: ${key}.`,parameters:{P},svg:grid(P.map((p,i)=>[...p,`(${'abcd'[i]})`]),10,'Coordinate plane with four labelled points')};
 t.choices=wrongOnly(t,[{value:P.map(([x,y])=>`(${minus(y)}, ${minus(x)})`).join('; '),mistake:'Wrote y before x'},{value:P.map(([x,y])=>`(${minus(Math.abs(x))}, ${minus(Math.abs(y))})`).join('; '),mistake:'Left out the negative signs'},{value:P.map(([x,y])=>`(${minus(-x)}, ${minus(y)})`).join('; '),mistake:'Counted x in the wrong direction'}]);break;}
case 'ah-graph-points':{const a=int(1,9),b=int(1,9),cc=-int(2,9),d=int(2,9),e=-int(2,9),f=-int(2,9),P=[[a,b],[cc,d],[e,f]];
 t=teacher(`Graph the following points on a coordinate plane: (a) (${a}, ${b}) (b) (${minus(cc)}, ${d}) (c) (${minus(e)}, ${minus(f)})`,`Points at ${P.map(([x,y])=>`(${minus(x)}, ${minus(y)})`).join(', ')}, labelled (a), (b), (c).`,['Each point is at the correct x-coordinate (left or right) and y-coordinate (up or down).','Each point is labelled with its letter.'],{P},grid([],10,'Blank coordinate plane'),grid(P.map((p,i)=>[...p,`(${'abc'[i]})`]),10,'Coordinate plane with the three points graphed'));break;}
case 'ah-rect-vertices':{let a,b,cc,d;do{a=int(1,9)*pick([-1,1]);b=int(1,9)*pick([-1,1]);cc=int(1,9)*pick([-1,1]);d=int(1,9)*pick([-1,1]);}while(Math.abs(d-a)<3||Math.abs(b-cc)<2);
 const V=[[a,b],[a,cc],[d,cc],[d,b]],o=int(0,3),shown=[...V.slice(o),...V.slice(0,o)],w=Math.abs(d-a),h=Math.abs(b-cc),rs=w===h?'square':'rectangle';
 t=n(`The vertices of a ${rs} are ${shown.map(([x,y])=>`(${minus(x)}, ${minus(y)})`).join(', ').replace(/, ([^,]*,[^,]*)$/,', and $1')}. Draw the ${rs} on a coordinate plane, and find its perimeter and area. Give the perimeter, then the area.`,[2*w+2*h,w*h],`The sides are ${w} and ${h} units long: perimeter ${2*w+2*h} units, area ${w*h} units².`,{V},'numbers');
 t.choices=wrongOnly(t,[{value:`${w*h}; ${2*w+2*h}`,mistake:'Swapped the perimeter and the area'},{value:`${w+h}; ${w*h}`,mistake:'Added only two sides for the perimeter'},{value:`${2*(Math.abs(d)+Math.abs(a))+2*(Math.abs(b)+Math.abs(cc))}; ${(Math.abs(d)+Math.abs(a))*(Math.abs(b)+Math.abs(cc))}`,mistake:'Added the coordinates without their signs to find the side lengths'},{value:`${2*w+2*h+4}; ${(w+1)*(h+1)}`,mistake:'Counted grid points instead of units along each side'},{value:`${2*w+2*h}; ${2*(w+h)}`,mistake:'Gave the perimeter for the area as well'}]);break;}
case 'ah-which-graph':{let a,b,cc,d;do{a=int(1,4)*pick([-1,1]);b=int(2,4)*pick([-1,1]);cc=int(1,3)*pick([-1,1]);d=int(1,3)*pick([-1,1]);}while(Math.abs(a)===Math.abs(b)||(Math.abs(a)===Math.abs(cc)&&Math.abs(b)===Math.abs(d))||(a===cc&&b===d));
 const P=[[a,b],[cc,d]],sets=[P,P.map(([x,y])=>[y,x]),P.map(([x,y])=>[-x,-y]),P.map(([x,y])=>[-y,-x])],ord=shuffle(int,[0,1,2,3]),letter2=['A','B','C','D'],keyL=letter2[ord.indexOf(0)];
 const W=200;let b2='';ord.forEach((si,i)=>{const g=grid(sets[si].map((p,j)=>[...p,`(${'ab'[j]})`]),5,'',null,15).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'').replace(/<title>.*?<\/title><defs>.*?<\/defs>/,'');b2+=`<g transform="translate(${(i%2)*(W+16)},${Math.floor(i/2)*(W+30)})">`+tx(10,12,'Graph '+letter2[i],{size:12,anchor:'start'})+`<g transform="translate(0,16)">${g}</g></g>`;});
 t=text(`Which graph shows the points (a) (${minus(a)}, ${minus(b)}) and (b) (${minus(cc)}, ${minus(d)})? Answer A, B, C, or D.`,keyL,`Point (a) is ${Math.abs(a)} ${a<0?'left':'right'} and ${Math.abs(b)} ${b<0?'down':'up'}; point (b) is ${Math.abs(cc)} ${cc<0?'left':'right'} and ${Math.abs(d)} ${d<0?'down':'up'}: Graph ${keyL}.`,{P,ord},svg(b2,'Four small coordinate planes, Graphs A to D, each with two labelled points',2*W+16,2*(W+30)),['graph '+keyL.toLowerCase()]);
 const why=['','Plotted each point with x and y swapped','Changed the sign of both coordinates','Swapped x and y and changed both signs'];t.choices=ord.map((si,i)=>si===0?null:{value:letter2[i],mistake:why[si]}).filter(Boolean);break;}
// Lesson 39
case 'ah-solve-fraction-add':{let a,b,cc,d;do{a=int(7,15);b=int(1,Math.floor(a/2));d=int(4,12);cc=int(2,d-1);}while(cc/d<=b/a||a/gcd(a,b)===d/gcd(cc,d)||gcd(a/gcd(a,b),d/gcd(cc,d))===1);const j=pick([...'abcdefghjkmnpqrstuvwxyz']);
 const f1=R(b,a),f2=R(cc,d);t=n(`Solve: ${j} + ${U.f(f1)} = ${U.f(f2)}`,R(cc*a-b*d,a*d),`Subtract ${U.f(f1)} from both sides: ${j} = ${U.f(f2)} − ${U.f(f1)} = ${U.f(R(cc*a-b*d,a*d))}.`,{a,b,c:cc,d},'fraction');
 t.choices=wrongOnly(t,[{value:U.f(R(cc*a+b*d,a*d)),mistake:'Added instead of subtracting'},{value:U.f(R(Math.abs(cc-b)||1,Math.abs(d-a)||1)),mistake:'Subtracted the numerators and the denominators'},{value:`${cc*a-b*d}/${a*d}`,mistake:'Did not reduce the answer'}]);break;}
case 'ah-solve-fraction-sub':{let a,cc,b,d;do{a=int(1,9);cc=int(1,9);}while(a+cc>12);b=int(a+cc,12);d=int(a+cc,12);
 t=n(`Solve: x − ${U.f(R(a,b))} = ${U.f(R(cc,d))}`,R(a*d+b*cc,b*d),`Add ${U.f(R(a,b))} to both sides: x = ${U.f(R(a*d+b*cc,b*d))}.`,{a,b,c:cc,d},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.f(R(a*d+b*cc,b)),mistake:'Kept only one denominator'},{value:U.f(R(a+cc,b*d)),mistake:'Added the numerators without renaming'},{value:U.f(R(Math.abs(b*cc-a*d)||1,b*d)),mistake:'Subtracted instead of adding'},{value:U.f(R(a*d+b*cc,d)),mistake:'Kept only the other denominator'}]);break;}
case 'ah-solve-decimal-choice':{const a=int(4,8),Cb=10*a+int(1,9),d=int(2,a-2),F=(10*d+int(1,9))*pick([-1,1]),G=Cb+F;
 t=dec(`Solve: x ${F<0?'−':'+'} ${ds(Math.abs(F),1)} = ${ds(G,1)}`,Cb,1,`${F<0?'Add':'Subtract'} ${ds(Math.abs(F),1)} ${F<0?'to':'from'} both sides: x = ${ds(Cb,1)}.`,{F,G});
 t.choices=wrongOnly(t,[{value:ds(Cb+10*pick([-1,1]),1),mistake:'Arithmetic slip in the ones'},{value:ds(Cb+pick([-1,1])*int(1,9),1),mistake:'Arithmetic slip in the tenths'},{value:ds(G+F,1),mistake:'Used the wrong operation to isolate x'}]);break;}
// Lesson 40
case 'ah-reciprocal':{let a,b;do{a=int(2,20);b=int(2,20);}while(gcd(a,b)!==1);t=n(`What is the reciprocal of ${a}/${b}?`,R(b,a),`Swap the numerator and the denominator: ${b}/${a}.`,{a,b},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:`${a}/${b}`,mistake:'Gave the same fraction'},{value:`−${a}/${b}`,mistake:'Gave the opposite instead of the reciprocal'},{value:`1/${a}`,mistake:'Inverted only the numerator'}]);break;}
case 'ah-solve-times':{const b=int(3,9),cc=int(2,9);t=whole(`Solve: ${b*cc} = ${b}y`,cc,`Divide both sides by ${b}: y = ${cc}.`,{a:b*cc,b});
 t.choices=wrongOnly(t,[{value:String(b*b*cc),mistake:'Multiplied instead of dividing'},{value:String(b*cc-b),mistake:'Subtracted instead of dividing'},{value:String(cc+1),mistake:'Division slip'}]);break;}
case 'ah-solve-divided':{const x=int(7,15),y=int(2,8);t=whole(`Solve: t/${y} = ${x}`,x*y,`Multiply both sides by ${y}: t = ${x*y}.`,{x,y});t.math=S.math(S.mfrac('<mi>t</mi>',y)+S.mo('=')+S.mn(x));
 t.choices=wrongOnly(t,[{value:String(x),mistake:'Did not undo the division'},{value:String(x+y*y),mistake:'Added instead of multiplying'},{value:String(y*x-y),mistake:'Multiplication slip'}]);break;}
case 'ah-solve-coef':{const b=int(3,12),cc=int(4,12);t=whole(`Solve: ${b}y = ${b*cc}`,cc,`Divide both sides by ${b}: y = ${cc}.`,{a:b*cc,b});
 t.choices=wrongOnly(t,[{value:String(b*b*cc),mistake:'Multiplied instead of dividing'},{value:String(b*cc-b),mistake:'Subtracted instead of dividing'},{value:String(cc+1),mistake:'Division slip'}]);break;}
case 'ah-solve-decimal-coef':{const a=int(2,13),cc=int(2,12),num1=a*cc,z=100*cc;
 t=whole(`Solve: ${ds(a,2)} × Y = ${num1}`,z,`Divide both sides by ${ds(a,2)}: Y = ${num1} ÷ ${ds(a,2)} = ${comma(z)}.`,{a,num1});
 t.choices=wrongOnly(t,[{value:String(10*cc),mistake:'Moved the decimal point one place too few'},{value:String(1000*cc),mistake:'Moved the decimal point one place too many'},{value:comma(z+100*pick([-1,1])),mistake:'Division slip'}]);break;}
// AH-3 end
// Batch AH-4
// Lesson 41
case 'ah-overall-average':{let a,b,n1;do{a=int(4,15);b=int(16,30);n1=int(2,5);}while(a===b||n1===5);const n2=10-n1,z=R(a*n1+b*n2,10);
 t=n(`The average of the first ${n1} numbers was ${a}. The average of the next ${n2} numbers was ${b}. What was the overall average of the 10 numbers?`,z,`Total = ${n1} × ${a} + ${n2} × ${b} = ${a*n1+b*n2}; ${a*n1+b*n2} ÷ 10 = ${U.dec(z)}.`,{a,b,n1,n2},'decimal');
 t.choices=wrongOnly(t,[{value:U.dec(R(a+b,2)),mistake:'Averaged the two averages without weighting them'},{value:String(a*n1+b*n2),mistake:'Gave the total instead of the average'},{value:U.dec(R(a*n2+b*n1,10)),mistake:'Weighted each average by the wrong count'}]);break;}
case 'ah-overall-average-salmon':{let n1,n2,p1,p2;do{n1=int(2,9);n2=int(3,9);p1=int(20,30);p2=int(20,30);if(p1===p2)p2++;}while(n1===n2||(100*(n1*p1+n2*p2))%(n1+n2)!==0);const z=R(n1*p1+n2*p2,n1+n2);
 t=n(`The average weight of ${words(n1)} salmon was ${p1} pounds. The average weight of the other ${words(n2)} salmon was ${p2} pounds. What was the overall average weight in pounds of the ${words(n1+n2)} salmon?`,z,`Total weight ${n1} × ${p1} + ${n2} × ${p2} = ${n1*p1+n2*p2} lb; ÷ ${n1+n2} = ${U.dec(z)} lb.`,{n1,n2,p1,p2},'decimal');
 t.choices=wrongOnly(t,[{value:U.dec(R(p1+p2,2)),mistake:'Averaged the two averages without weighting them'},{value:U.dec(R(Math.round(100*(n1*p2+n2*p1)/(n1+n2)),100)),mistake:'Weighted each average by the wrong count'},{value:String(n1*p1+n2*p2),mistake:'Gave the total weight instead of the average'}]);break;}
// Lesson 42
case 'ah-inclusion1':{const a=int(2,7),b=int(2,6),cc=int(3,5),d=int(2,4),e=int(2,5),f=int(12,20),g=int(6,11),z=a+b*cc*d+e*(f-g);
 t=whole(`Simplify: ${a} + (${b} · ${cc})${d} + ${e}(${f} − ${g})`,z,`Parentheses first: ${a} + ${b*cc} · ${d} + ${e} · ${f-g} = ${a} + ${b*cc*d} + ${e*(f-g)} = ${z}.`,{a,b,c:cc,d,e,f,g});
 t.choices=wrongOnly(t,[{value:String((a+b*cc)*d+e*(f-g)),mistake:'Added before multiplying'},{value:String(a+b*cc+d+e*(f-g)),mistake:'Added the number after the parentheses instead of multiplying'},{value:String(a+b*cc*d+e*f-g),mistake:'Multiplied only the first number in the parentheses'}]);break;}
case 'ah-inclusion2':{let a,b,cc,d,e,f,g,hh,z;do{a=int(2,25);b=int(2,10);cc=int(2,15);d=int(6,12);e=int(2,15);f=int(1,5);g=int(2,6);hh=int(2,20);z=a*b+(d+f)*g-hh;}while(z<1||z>500);
 t=whole(`Simplify: ${a}(${b+cc} − ${cc}) + (${d+e} − ${e} + ${f})${g} − ${hh}`,z,`${a} · ${b} + ${d+f} · ${g} − ${hh} = ${a*b} + ${(d+f)*g} − ${hh} = ${z}.`,{a,b,c:cc,d,e,f,g,h:hh});
 t.choices=wrongOnly(t,[{value:String(a*b+(d-f)*g-hh),mistake:'Subtracted instead of added inside the second parentheses'},{value:String(a*b+(d+f)*(g-hh)),mistake:'Subtracted before multiplying'},{value:String(a+b+(d+f)*g-hh),mistake:'Added instead of multiplying by the first factor'}]);break;}
case 'ah-inclusion3':{const a=int(6,18),a1=int(1,4),b=a-a1,cc=int(3,11),d=int(2,9),e=int(9,15),f=int(3,7),g=int(2,5),z=g*((e-f)*(a-b)+cc)-d;
 t=whole(`Simplify: ${g}[(${e} − ${f})(${a} − ${b}) + ${cc}] − ${d}`,z,`Innermost first: (${e-f})(${a-b}) = ${(e-f)*(a-b)}; ${g}[${(e-f)*(a-b)} + ${cc}] − ${d} = ${z}.`,{a,b,c:cc,d,e,f,g});
 t.choices=wrongOnly(t,[{value:String(g*(e-f)*(a-b)+cc-d),mistake:'Multiplied only the first term inside the brackets'},{value:String(g*((e-f)*(a-b)+cc-d)),mistake:'Subtracted inside the brackets'},{value:String(g*((e-f)+(a-b)+cc)-d),mistake:'Added the parentheses instead of multiplying them'},{value:String(z+2*d),mistake:'Added the last number instead of subtracting'},{value:String(g*(e-f)*(a-b)+g*cc+d),mistake:'Added the last number instead of subtracting'}]);break;}
case 'ah-inclusion-choice':{let a,b,cc,d,e,f,g,j;do{a=int(2,5);b=int(2,14);cc=int(3,7);d=int(2,3);e=int(3,5);f=int(1,6);g=int(2,8);j=int(8,20);}while(d===e||cc*d*e-f-g<=0);const k=a*(cc*d*e-f-g),hh=j+k,z=j+b;
 t=whole(`Simplify: ${hh} − ${a}[${cc}(${d} · ${e}) − (${f} + ${g})] + ${b}`,z,`${cc}(${d*e}) − ${f+g} = ${cc*d*e-f-g}; ${a} × ${cc*d*e-f-g} = ${k}; ${hh} − ${k} + ${b} = ${z}.`,{a,b,c:cc,d,e,f,g,h:hh});
 t.choices=wrongOnly(t,[{value:String(j),mistake:'Left off the last term'},{value:String(j+b-f),mistake:'Dropped the parentheses around the sum'},{value:String(z+pick([-1,1])),mistake:'Arithmetic slip'},{value:String(hh-k-b),mistake:'Subtracted the last term'}]);break;}
case 'ah-divide-order':{const a=int(2,12),b=int(2,12),d=int(2,5),e=pick([2,4,5]),f=int(2,5),x=int(2,5),g=int(7,12),hh=g-x,j=int(2,5),cc=d*f,dd=e*f,z=a*b+cc-dd/e+x*j;
 t=whole(`Simplify: ${a} · ${b} + ${cc} − ${dd} ÷ ${e} + ${j}(${g} − ${hh})`,z,`${a*b} + ${cc} − ${f} + ${j} · ${x} = ${z}.`,{a,b,c:cc,d:dd,e,j,g,h:hh});
 t.choices=wrongOnly(t,[{value:String(a*b+cc-dd/e+j*g-hh),mistake:'Multiplied only the first number in the parentheses'},{value:String(Math.round((a*b+cc-dd)/e)+x*j),mistake:'Subtracted before dividing'},{value:String(a*b+cc-dd*e+x*j),mistake:'Multiplied instead of dividing'}]);break;}
case 'ah-divide-order-choice':{let a,b,cc,d,zz;do{a=int(2,9);b=int(1,9);cc=int(2,9);d=int(2,9);zz=int(1,9);}while(a+b===d||Math.abs(a+b-d)===1||a+b-d<1);const hh=a*zz,i=zz*b,j=zz*d,k=a+b-d;
 t=whole(`Simplify: (${hh} + ${cc} · ${i} ÷ ${cc} − ${j}) ÷ ${k}`,zz,`${cc} · ${i} ÷ ${cc} = ${i}; (${hh} + ${i} − ${j}) ÷ ${k} = ${hh+i-j} ÷ ${k} = ${zz}.`,{h:hh,c:cc,i,j,k});
 t.choices=wrongOnly(t,[{value:String(Math.abs(zz+cc*pick([-1,1]))),mistake:'Arithmetic slip with the middle term'},{value:String((hh+cc)*i+cc-j+k),mistake:'Added before multiplying and dividing'},{value:String(Math.abs(Math.floor((i*(hh+cc)+cc*j)/(cc*k)))),mistake:'Worked left to right without the order of operations'}]);break;}
// Lesson 43
case 'ah-multiply-three-mixed':{const T=[[3,4,6,20,7,12],[3,4,9,16,7,29],[3,4,15,8,7,15],[3,4,15,16,7,32],[3,5,6,25,7,18],[3,5,9,20,7,35],[3,5,12,10,7,21],[4,3,8,9,10,11],[4,3,8,15,10,35],[4,3,16,9,10,29],[4,3,20,6,10,24],[4,5,8,15,10,18],[4,5,12,10,10,13],[4,5,16,10,10,37],[4,5,16,25,10,32],[5,2,25,6,10,26],[5,3,10,9,12,22],[5,3,20,6,12,25],[5,3,25,6,12,28],[5,3,25,12,12,31],[5,4,10,16,12,34],[5,4,15,16,12,38],[5,4,25,12,12,15],[6,4,18,8,15,23],[6,4,18,20,15,35],[6,5,12,15,15,22],[6,5,12,25,15,34],[6,5,18,20,15,21],[6,5,24,10,15,33],[7,2,21,8,15,20],[7,2,35,8,15,32],[7,3,14,12,17,27],[7,3,28,15,17,25],[7,3,35,12,17,23],[7,4,14,20,17,21],[7,4,21,16,17,19],[7,4,35,8,17,38],[7,5,14,15,17,36],[7,5,14,25,17,34],[7,5,21,25,17,32],[7,5,28,15,17,30],[8,3,16,12,20,35],[8,3,32,15,20,24],[8,3,40,12,20,32],[8,5,16,25,20,21],[8,5,24,25,20,29],[8,5,32,15,20,37]],[a,b,d,e,f,cc]=pick(T),v=R(d*e*cc,a*b*f);
 t=n(`Simplify: ${U.mixed(R(d,b))} × ${U.mixed(R(e,a))} × ${U.mixed(R(cc,f))}`,v,`Write each as an improper fraction, cancel and multiply: ${U.f(v)}${Number(v.d)!==1?' = '+U.mixed(v):''}.`,{d,b,e,a,c:cc,f},'mixed');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(Math.floor(d/b)*Math.floor(e/a)*Math.floor(cc/f),1)),mistake:'Multiplied only the whole numbers'},{value:U.mixed(R(d+e+cc,b+a+f)),mistake:'Added the numerators and the denominators'},{value:U.mixed(R(d*e*cc,a*b*f*2)),mistake:'Arithmetic slip when cancelling'}]);break;}
case 'ah-multiply-mixed-choice':case 'ah-mixed-complex-fraction':{const T=[[3,1,6,1,1,2],[1,3,4,3,1,2],[3,5,7,4,2,3],[4,4,9,1,2,5],[2,5,7,3,4,5],[4,5,6,2,3,5],[4,1,2,3,2,3],[2,1,3,4,1,6],[3,2,3,2,1,4],[1,1,2,2,7,9],[1,3,4,4,8,9],[3,1,2,1,1,5]],[a,b,cc,d,e,f]=pick(T),m=cc*a+b,nn=f*d+e,div=c.recipe==='ah-mixed-complex-fraction';
 const v=div?R(m*f,cc*nn):R(m*nn,cc*f);
 t=n(div?`Simplify the complex fraction: (${U.mixed(R(m,cc))}) / (${U.mixed(R(nn,f))})`:`Simplify: ${U.mixed(R(m,cc))} · ${U.mixed(R(nn,f))}`,v,div?`Divide: ${m}/${cc} ÷ ${nn}/${f} = ${m}/${cc} × ${f}/${nn} = ${U.mixed(v)}.`:`Multiply as improper fractions: ${m}/${cc} × ${nn}/${f} = ${U.mixed(v)}.`,{m,c:cc,n:nn,f},'mixed');t.eitherForm=true;
 if(div)t.math=S.math(`<mfrac><mrow>${S.mn(U.mixed(R(m,cc)))}</mrow><mrow>${S.mn(U.mixed(R(nn,f)))}</mrow></mfrac>`);
 t.choices=wrongOnly(t,div?[{value:U.mixed(R(m*nn,cc*f)),mistake:'Multiplied instead of dividing'},{value:U.mixed(R(cc*nn,m*f)),mistake:'Inverted the answer'},{value:U.mixed(R(Math.floor(m/cc)*f+1,Math.max(1,Math.floor(nn/f))*f)),mistake:'Divided only the whole numbers'}]:[{value:U.mixed(R(b*e*a*cc,cc*f)),mistake:'Multiplied the parts of the mixed numbers separately'},{value:U.mixed(R(m+nn,cc+f)),mistake:'Added the numerators and the denominators'},{value:U.mixed(R(nn*d,cc+f)),mistake:'Multiplied the wrong parts'}]);break;}
case 'ah-divide-mixed-chain':{const A=[[6,5],[7,2],[7,3],[7,4],[7,5],[7,6],[8,3],[8,5],[8,7],[9,2],[9,4],[9,5],[9,7],[9,8]],C=A.slice(0,13);let a,b,cc,d,e,f,g,hh,top,bot,gg;do{[a,b]=pick(A);[cc,d]=pick(C);e=int(6,9);g=int(6,9);f=int(2,e-1);hh=int(2,g-1);while(gcd(e,f)!==1)e++;while(gcd(g,hh)!==1)g++;top=a*d*e*hh;bot=b*cc*f*g;gg=gcd(top,bot);}while(bot/gg>128||top%bot===0);
 const v=R(top,bot);t=n(`Simplify: ${U.mixed(R(a,b))} ÷ ${U.mixed(R(cc,d))} · ${U.mixed(R(e,f))} ÷ ${U.mixed(R(g,hh))}`,v,`Work left to right with improper fractions, multiplying by reciprocals: ${U.f(v)}${top>bot?' = '+U.mixed(v):''}.`,{a,b,c:cc,d,e,f,g,h:hh},'mixed');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(a*cc*e*g,b*d*f*hh)),mistake:'Multiplied instead of dividing'},{value:U.mixed(R(bot,top)),mistake:'Inverted the answer'},{value:U.mixed(R(a*d*e*g,b*cc*f*hh)),mistake:'Multiplied by the last divisor instead of its reciprocal'}]);break;}
case 'ah-complex-half':{const a=int(2,9),b=pick([3,5,7]),v=R(b*(2*a+1),8);
 t=n(`Simplify the complex fraction: (${U.mixed(R(2*a+1,2))}) / (${U.f(R(4,b))})`,v,`${2*a+1}/2 ÷ 4/${b} = ${2*a+1}/2 × ${b}/4 = ${U.mixed(v)}.`,{a,b},'mixed');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(8,b*(2*a+1))),mistake:'Inverted the answer'},{value:U.mixed(R(2*(2*a+1),b)),mistake:'Multiplied instead of dividing'},{value:U.mixed(R(b,2*(2*a+1))),mistake:'Inverted the wrong fraction'}]);break;}
// Lesson 44
case 'ah-roots':{const T=[[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[4,2],[4,3],[4,4],[4,5],[4,6]],[s1,x1]=pick(T),x2=int(3,20),rt=k=>k===3?'∛':'∜';
 t=n(`Simplify: (a) ${rt(s1)}${comma(x1**s1)} (b) √${x2*x2}`,[x1,x2],`(a) ${x1}${S.sup(s1)} = ${comma(x1**s1)}, so the root is ${x1}; (b) ${x2}² = ${x2*x2}, so √${x2*x2} = ${x2}.`,{s1,x1,x2});
 t.choices=wrongOnly(t,[{value:`${Math.round(x1**s1/s1)}; ${x2*x2/2}`,mistake:'Divided by the index instead of taking the root'},{value:`${x1+1}; ${x2+1}`,mistake:'Estimated the root one too high'},{value:`${x1}; ${x2*2}`,mistake:'Doubled instead of taking the square root in (b)'}]);break;}
case 'ah-root-choice':{const T=[[3,2],[3,3],[3,4],[3,5],[4,2],[4,3],[4,4],[4,5]],[s2,x1]=pick(T),rad=x1**s2,rt=s2===3?'∛':'∜';
 t=whole(`Simplify: ${rt}${comma(rad)}`,x1,`${x1}${S.sup(s2)} = ${comma(rad)}, so ${rt}${comma(rad)} = ${x1}.`,{s:s2,x1});
 t.choices=wrongOnly(t,[{value:String(x1+pick([-1,1])),mistake:'Off by one when testing powers'},...(rad%s2===0?[{value:comma(rad/s2),mistake:'Divided by the index instead of taking the root'},{value:comma(rad/s2*x1),mistake:'Confused the root with division'}]:[{value:String(x1+2*pick([-1,1])),mistake:'Tested the wrong power'},{value:String(x1*x1),mistake:'Squared instead of taking the root'}])]);break;}
case 'ah-order-exp-root':{const cc=int(2,3),d=cc*cc,e=int(3,9),r=int(2,3),f=r===2?e*e:e*e*e,b=int(e+1,e+10),s1=pick([-1,1]),i=int(1,9),j=int(1,9),s2=pick([-1,1]),s3=pick([-1,1]);let k=int(1,9),bunch;const l=int(2,6);
 if(!(i+s2*j>0)||!(i+s2*j+s3*k>0))return build(c,h);bunch=i+s2*j+s3*k;while(Math.abs(bunch)%l){k++;bunch=i+s2*j+s3*k;}
 const z=b-e+d*cc**4+s1*bunch/l,sg=x=>x>0?'+':'−';
 t=whole(`Simplify: ${b} − ${r===2?'√':'∛'}${f} + ${d} × ${cc}⁴ ${sg(s1)} (${i} ${sg(s2)} ${j} ${sg(s3)} ${k}) ÷ ${l}`,z,`${r===2?'√':'∛'}${f} = ${e}; ${d} × ${cc**4} = ${d*cc**4}; (${bunch}) ÷ ${l} = ${bunch/l}; ${b} − ${e} + ${d*cc**4} ${sg(s1)} ${bunch/l} = ${z}.`,{b,e,d,c:cc,s1,bunch,l,f,r});
 t.choices=wrongOnly(t,[{value:String(b-e+(d*cc)**4+s1*bunch/l),mistake:'Multiplied before applying the exponent'},{value:String(b-f+d*cc**4+s1*bunch/l),mistake:'Did not take the root'},{value:String(b-e+d*cc**4+s1*bunch*l),mistake:'Multiplied instead of dividing'}]);break;}
case 'ah-order-exp-root-choice':{let i,j,k,s1,s2;do{i=int(1,9);j=int(1,9);k=int(1,9);s1=pick([-1,1]);s2=pick([-1,1]);}while(!(i+s1*j>0)||!(i+s1*j+s2*k>0));const a=int(2,9),b=int(2,6),e=int(3,9),r=int(2,3),f=r===2?e*e:e*e*e,g=int(2,5),fc=int(3,6),hh=g*fc,P=i+s1*j+s2*k,z=P*a+b**3-e+fc,sg=x=>x>0?'+':'−';
 t=whole(`Simplify: (${i} ${sg(s1)} ${j} ${sg(s2)} ${k})${a} + ${b}³ − ${r===2?'√':'∛'}${f} + ${hh} ÷ ${g}`,z,`(${P})(${a}) + ${b**3} − ${e} + ${fc} = ${z}.`,{P,a,b,e,fc,f,r,h:hh,g});
 t.choices=wrongOnly(t,[{value:String(P*a+b**3-(e+fc)),mistake:'Subtracted the last term too'},{value:String(z+2*pick([-1,1])),mistake:'Arithmetic slip'},{value:String(P*a+3*b-e+fc),mistake:'Multiplied by the exponent instead of cubing'}]);break;}
// Lesson 45
case 'ah-volume-l-base':{const k=int(0,5),u2=['inches','centimeters','millimeters','feet','meters','yards'][k];let a,b,cc,d;do{a=int(6,20);b=int(Math.floor(a/2),Math.floor(2*a/3));cc=int(Math.floor(a/2),Math.floor(2*a/3));d=int(Math.floor(0.6*a),Math.floor(1.5*a));}while(a-b<1||a-cc<1);
 const area=a*a-cc*(a-b),z=area*d,F=Fig();F.poly([[0,0],[a,0],[a,a],[cc,a],[cc,b],[0,b]]).txt([-0.6,b/2],String(b),{anchor:'end'}).txt([cc-0.6,(a+b)/2],String(a-b),{anchor:'end'}).txt([cc/2,b+0.7],String(cc)).txt([a/2,-1.4],String(a));
 t=whole(`The figure shows a base of a right solid whose height is ${d} ${u2}. Dimensions are in ${u2}. All angles that look like right angles are right angles. Find the volume of the solid.`,z,`Area of the base = ${a} × ${a} − ${cc} × ${a-b} = ${area}; volume = ${area} × ${d} = ${comma(z)}.`,{a,b,c:cc,d},F.render('An L-shaped base with four sides labelled',260,220));
 t.choices=wrongOnly(t,[{value:comma(area),mistake:'Found the area of the base only'},{value:comma(a*a*d),mistake:'Used the whole square without removing the corner'},{value:comma((a*b+cc*(a-b))*d),mistake:'Split the base incorrectly'}]);break;}
case 'ah-volume-trapezoid-base':{const k=int(0,5),u2=['inches','centimeters','millimeters','feet','meters','yards'][k];let a,cc,b,d;do{a=int(6,15);cc=int(Math.floor(a/2),Math.floor(2*a/3));b=2*int(Math.floor(a/3),Math.floor(a/2));d=int(Math.floor(0.6*a),Math.min(15,Math.floor(1.5*a)));}while(cc>=a);
 const z=(a+cc)*b*d/2,F=Fig();F.poly([[0,0],[a,0],[a,b],[a-cc,b]]).right([a,0],90,180).right([a,b],180,270).txt([a+0.6,b/2],String(b),{anchor:'start'}).txt([a-cc/2,b+0.7],String(cc)).txt([a/2,-1.2],String(a));
 t=whole(`The figure shows a base of a right solid that is ${d} ${u2} tall. Find the volume of the solid. Dimensions are in ${u2}. All angles that look like right angles are right angles.`,z,`Base area = ½(${a} + ${cc})(${b}) = ${(a+cc)*b/2}; volume = ${(a+cc)*b/2} × ${d} = ${comma(z)}.`,{a,b,c:cc,d},F.render('A trapezoid base with its parallel sides and height labelled',260,180));
 t.choices=wrongOnly(t,[{value:comma((a+cc)*b*d),mistake:'Forgot the ½ in the trapezoid area'},{value:comma((a+cc)*b/2),mistake:'Found the area of the base only'},{value:comma(a*b*d),mistake:'Used the longer side as a rectangle'}]);break;}
case 'ah-volume-box':{const k=int(0,5),u2=['inches','centimeters','millimeters','feet','meters','yards'][k],hh=int(3,10),w=int(2,6),l=int(w+3,10),z=l*w*hh;
 const F=Fig();F.poly([[0,0],[l,0],[l,w],[0,w]]).txt([-0.5,w/2],String(w),{anchor:'end'}).txt([l/2,w+0.6],String(l));
 t=whole(`The rectangle shown is a base of a right solid whose sides are ${hh} ${u2} tall. Dimensions are in ${u2}. Find the volume of the solid.`,z,`${l} × ${w} × ${hh} = ${z}.`,{l,w,h:hh},F.render(`A rectangle ${l} by ${w}`,240,140));
 t.choices=wrongOnly(t,[{value:String(2*l*w+2*l*hh+2*w*hh),mistake:'Found the surface area instead'},{value:String(z+2*pick([-1,1])),mistake:'Arithmetic slip'},{value:String(l*w+hh),mistake:'Added the height instead of multiplying'}]);break;}
// Lesson 46
case 'ah-fraction-div-add':{let b,d,f,a,cc,e;do{b=int(2,9);d=int(2,9);f=int(2,9);}while(new Set([b,d,f]).size<3);do{a=int(1,Math.max(1,Math.round(b/2)));}while(gcd(a,b)!==1);do{cc=int(Math.max(1,Math.round(d/2)),d-1);}while(gcd(cc,d)!==1);do{e=int(1,f-1);}while(gcd(e,f)!==1);
 if(a*d*f+e*b*cc>=b*cc*f)return build(c,h);const v=R(a*d*f+e*b*cc,b*cc*f);
 t=n(`Simplify: ${a}/${b} ÷ ${cc}/${d} + ${e}/${f}`,v,`Divide first: ${a}/${b} × ${d}/${cc} = ${U.f(R(a*d,b*cc))}; then add ${e}/${f}: ${U.mixed(v)}.`,{a,b,c:cc,d,e,f},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(a*cc*f+e*b*d,b*d*f)),mistake:'Multiplied instead of dividing'},{value:U.mixed(R(a*d*f+e,b*cc+f)),mistake:'Added the numerators and the denominators'},{value:U.mixed(R(a*cc*f+e,b*d+f)),mistake:'Multiplied and then added the numerators and the denominators'}]);break;}
case 'ah-fraction-times-paren':{let a,b,cc,d,e,f;do{b=int(3,10);a=int(1,b-1);d=int(2,10);cc=int(d+1,3*d-1);f=int(3,10);e=int(1,f-1);}while(gcd(a,b)!==1||gcd(cc,d)!==1||b===d||gcd(e,f)!==1||d===f);const plus=int(1,2)===1,v=R(a*(f*cc+(plus?1:-1)*d*e),b*d*f);
 t=n(`Simplify: ${a}/${b}(${U.mixed(R(cc,d))} ${plus?'+':'−'} ${e}/${f})`,v,`Parentheses first: ${U.mixed(R(cc,d))} ${plus?'+':'−'} ${e}/${f} = ${U.f(R(f*cc+(plus?1:-1)*d*e,d*f))}; times ${a}/${b} = ${U.f(v)}.`,{a,b,c:cc,d,e,f,plus},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.f(R(a*cc*f+(plus?1:-1)*e*b*d,b*d*f)),mistake:'Multiplied only the first term in the parentheses'},{value:U.f(R(a*(f*cc+(plus?-1:1)*d*e),b*d*f)),mistake:'Used the wrong operation inside the parentheses'},{value:U.f(R(a*(f*cc+(plus?1:-1)*d*e)*2,b*d*f)),mistake:'Arithmetic slip when multiplying'}]);break;}
case 'ah-fraction-four-ops':{let a,b,cc,d,e,f,g,hh,plus;do{b=int(3,6);a=int(b+1,5*b-1);d=int(2,6);cc=int(d+1,3*d-1);f=pick([b,d]);e=int(f+1,2*f-1);hh=int(2,6);g=int(hh+1,2*hh-1);plus=int(1,2)===1;}while(gcd(a,b)!==1||gcd(cc,d)!==1||b===d||gcd(e,f)!==1||d===f||gcd(g,hh)!==1||a*cc/(b*d)<e*hh/(f*g));
 const v=R(a*cc*f*g+(plus?1:-1)*e*hh*b*d,b*d*f*g);
 t=n(`Simplify: ${U.mixed(R(a,b))} × ${U.mixed(R(cc,d))} ${plus?'+':'−'} ${U.mixed(R(e,f))} ÷ ${U.mixed(R(g,hh))}`,v,`Multiply and divide first, then ${plus?'add':'subtract'}: ${U.mixed(v)}.`,{a,b,c:cc,d,e,f,g,h:hh,plus},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(Math.abs(a*cc*f*hh+(plus?1:-1)*e*g*b*d)||1,b*d*f*hh)),mistake:'Multiplied by the divisor instead of its reciprocal'},{value:U.mixed(R(a*cc*f*g+(plus?-1:1)*e*hh*b*d,b*d*f*g)),mistake:'Used the wrong operation in the middle'},{value:U.mixed(R(Math.abs((a*d+(plus?1:-1)*cc*b)*hh*f)||1,b*d*e*g)),mistake:'Worked from left to right without the order of operations'}]);break;}
case 'ah-fraction-sub-times':{let a,b,cc,d,e,f;do{b=int(2,9);d=int(2,9);f=int(2,9);a=int(1,b-1);cc=int(1,d-1);e=int(1,f-1);}while(new Set([b,d,f]).size<3||gcd(a,b)!==1||gcd(cc,d)!==1||gcd(e,f)!==1||a*d*f-cc*b*e<=0);const v=R(a*d*f-cc*b*e,b*d*f);
 t=n(`Simplify: ${a}/${b} − ${cc}/${d} × ${e}/${f}`,v,`Multiply first: ${cc}/${d} × ${e}/${f} = ${U.f(R(cc*e,d*f))}; ${a}/${b} − ${U.f(R(cc*e,d*f))} = ${U.f(v)}.`,{a,b,c:cc,d,e,f},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(Math.abs(a-cc)*e||1,(Math.abs(b-d)||1)*f)),mistake:'Subtracted first, numerators and denominators separately'},{value:U.mixed(R(Math.abs(a*d*e-cc*b*e)||1,b*d*f)),mistake:'Multiplied both fractions by the last numerator'},{value:U.mixed(R(Math.abs(a-cc)*e||1,b*d*f)),mistake:'Subtracted the numerators without a common denominator'},{value:U.mixed(R(Math.abs(a*d-cc*b)*e||1,b*d*f)),mistake:'Subtracted before multiplying'},{value:U.mixed(R(a*d*f+cc*b*e,b*d*f)),mistake:'Added the product instead of subtracting it'}]);break;}
// Lesson 47
case 'ah-eval-power':{const X=pick([...'abcdfgjkmnpqrstuvwxyz']);let cc,b;do{cc=int(2,4);b=int(2,9);}while(cc**b>81);t=whole(`Evaluate: ${X}${S.sup(b)} if ${X} = ${cc}`,cc**b,`${cc}${S.sup(b)} = ${cc**b}.`,{c:cc,b});
 t.choices=wrongOnly(t,[{value:String(cc*b),mistake:'Multiplied the base by the exponent'},{value:String(cc**(b-1)),mistake:'Multiplied one time too few'},{value:String(b**cc),mistake:'Swapped the base and the exponent'},{value:String(cc**(b+1)),mistake:'Multiplied one time too many'},{value:String(cc+b),mistake:'Added the base and the exponent'}]);break;}
case 'ah-eval-power-var':{const X=pick([...'abcdfgjkmnpqrstuvwxyz']);let cc,b;do{cc=int(4,15);b=int(2,4);}while(cc**b>225);t=whole(`Evaluate: ${cc}${X} if ${X} = ${b}`.replace(`${cc}${X}`,`${cc}^${X}`),cc**b,`${cc}${S.sup(b)} = ${cc**b}.`,{c:cc,b});t.math=S.math(`<msup><mn>${cc}</mn><mi>${X}</mi></msup>`);
 t.choices=wrongOnly(t,[{value:String(cc*b),mistake:'Multiplied the base by the exponent'},{value:String(cc**(b-1)),mistake:'Multiplied one time too few'},{value:String(cc+b),mistake:'Added the base and the exponent'}]);break;}
case 'ah-eval-root-index':{const X=pick([...'abcdfgjkmnpqrstuvwxyz']);let cc,b;do{cc=int(2,4);b=int(2,9);}while(cc**b>81);t=whole(`Evaluate the ${X}th root of ${cc**b} if ${X} = ${b}.`,cc,`${cc}${S.sup(b)} = ${cc**b}, so the ${b}th root of ${cc**b} is ${cc}.`,{c:cc,b});t.math=S.math(`<mroot><mn>${cc**b}</mn><mi>${X}</mi></mroot>`);
 t.choices=wrongOnly(t,[{value:String(cc**b/b).replace(/\.\d+$/,''),mistake:'Divided by the index instead of taking the root'},{value:String(cc+1),mistake:'Tested the wrong base'},{value:String(cc**(b-1)),mistake:'Took one power off instead of the root'},{value:String(cc*b),mistake:'Multiplied by the index instead of taking the root'},{value:String(cc**b-b),mistake:'Subtracted the index instead of taking the root'}]);break;}
case 'ah-eval-two-roots':{const a=int(1,6);let b,cc;if(a<3){b=2;cc=int(2,16);}else if(a<5){b=3;cc=int(2,7);}else if(a===5){b=4;cc=int(2,4);}else{[b,cc]=pick([[5,2],[5,3],[6,2]]);}const r1=cc**b;let d,e;do{if(a<3){d=int(2,5);e=int(3,5);}else{d=int(2,6);e=2;}}while(d**e>625||d**e===r1);
 const r2=d**e,z=cc+d+r1*e,ix=k=>k===2?'√':k===3?'∛':k===4?'∜':`(${k}th root)`;
 t=whole(`Evaluate: ${b===2?'√':b===3?'∛':b===4?'∜':`the ${b}th root of `}x + (the yth root of ${r2}) + xy if x = ${r1} and y = ${e}`,z,`${ix(b)}${r1} = ${cc}; the ${e}th root of ${r2} is ${d}; xy = ${r1*e}; ${cc} + ${d} + ${r1*e} = ${z}.`,{r1,b,c:cc,r2,d,e});
 t.math=S.math(`<mroot><mi>x</mi><mn>${b}</mn></mroot><mo>+</mo><mroot><mn>${r2}</mn><mi>y</mi></mroot><mo>+</mo><mi>x</mi><mi>y</mi>`);
 t.choices=wrongOnly(t,[{value:String(cc+d+r1+e),mistake:'Added x and y instead of multiplying'},{value:String(r1+d+r1*e),mistake:'Did not take the first root'},{value:String(cc+r2+r1*e),mistake:'Did not take the second root'}]);break;}
case 'ah-eval-root-choice':{const X=pick([...'abcdfgjkmnpqrstuvwxyz']);let cc,b;do{cc=int(4,15);b=int(2,4);}while(cc**b>225);const d=cc**b,rt=b===2?'√':b===3?'∛':'∜';
 t=whole(`Evaluate: ${rt}${X} if ${X} = ${d}`,cc,`${cc}${S.sup(b)} = ${d}, so ${rt}${d} = ${cc}.`,{c:cc,b,d});
 t.choices=wrongOnly(t,[{value:String(cc**(b-1)===cc?2*cc:cc**(b-1)),mistake:'Took one power off instead of the root'},{value:comma(cc**(b+1)),mistake:'Raised to a power instead of taking the root'},{value:comma(b>2?cc**(b-2)*3:3*cc**(b+2)),mistake:'Confused the index with the exponent'}]);break;}
case 'ah-eval-decimal-power':{const X=pick([...'abcdfgjkmnpqrstuvwxyz']);let C,b;do{C=int(1,15);b=C>8?2:int(2,3);}while(C===10);const N=C**b,k=b;
 t=dec(`Evaluate: ${ds(C,1)}^${X} if ${X} = ${b}`,N,k,`${ds(C,1)}${S.sup(b)} = ${ds(N,k)}.`,{C,b});t.math=S.math(`<msup><mn>${ds(C,1)}</mn><mi>${X}</mi></msup>`);
 t.choices=wrongOnly(t,[{value:ds(N,k-1),mistake:'Counted one decimal place too few'},{value:ds(C*b,1),mistake:'Multiplied the base by the exponent'},{value:ds(C*b,2),mistake:'Multiplied by the exponent and misplaced the decimal point'},{value:ds(N,k+1),mistake:'Counted one decimal place too many'},{value:ds(C**(b+1),k+1),mistake:'Multiplied one time too many'}]);break;}
case 'ah-eval-mixed-expr':{let b,e,a,d,cc,z;do{b=int(2,16);e=int(2,4);[a,d]=pick([[2,9],[2,16],[3,8],[3,27],[4,16]]);cc=int(2,10)*pick([-1,1]);z=d*d-Math.round(d**(1/a))+b**e+cc*d*e;}while(b**e>900||z<0);const rt=Math.round(d**(1/a));
 t=whole(`Evaluate: n² − ${a===2?'√':a===3?'∛':'∜'}n + ${b}^m ${cc<0?'−':'+'} ${Math.abs(cc)}mn if n = ${d} and m = ${e}`,z,`${d*d} − ${rt} + ${b**e} ${cc<0?'−':'+'} ${Math.abs(cc*d*e)} = ${comma(z)}.`,{a,b,c:cc,d,e});
 t.choices=wrongOnly(t,[{value:comma(Math.abs(d*2-rt+b**e+cc*d*e)),mistake:'Doubled n instead of squaring it'},{value:comma(Math.abs(Math.round(d*d-d/a+b**e+cc*d*e))),mistake:'Divided by the index instead of taking the root'},{value:comma(Math.abs(d*d-rt+(b**e+cc)*d*e)),mistake:'Multiplied the power by mn as well'}]);break;}
// Lesson 48
case 'ah-what-fraction-of':{let a,b,cc,num;do{a=pick([5,9]);b=int(2,a-1);cc=int(4,22);num=b*cc;}while(!(num>20&&num<100)||gcd(a,b)!==1||num%10===0);
 t=n(`What fraction of ${a*cc} is ${num}?`,R(b,a),`${num}/${a*cc} = ${b}/${a}.`,{a,b,c:cc},'fraction');
 t.choices=wrongOnly(t,[{value:`${a}/${b}`,mistake:'Inverted the fraction'},{value:`${num}/${a*cc}`,mistake:'Did not reduce'},{value:U.f(R(num,a*cc+num)),mistake:'Divided by the sum instead of the whole'}]);break;}
case 'ah-fraction-of-what':{const T=[[5,6,7,1],[7,3,4,1],[5,7,2,3],[1,3,5,2],[3,5,2,7],[7,5,6,1],[4,3,7,5],[1,4,3,7],[1,7,5,6],[8,7,3,5],[5,9,2,1],[1,9,4,7]],[a,b,cc,d]=pick(T),NM=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'],DN=['','','halves','thirds','fourths','fifths','sixths','sevenths','eighths','ninths'],DS=['','','half','third','fourth','fifth','sixth','seventh','eighth','ninth'],pw=`${NM[d]} ${d===1?DS[cc]:DN[cc]}`,v=R(a*cc,b*d);
 t=n(`${pw} of what number is ${a}/${b}?`,v,`${d}/${cc} × n = ${a}/${b}, so n = ${a}/${b} × ${cc}/${d} = ${U.mixed(v)}.`,{a,b,c:cc,d},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.f(R(a*d,b*cc)),mistake:'Multiplied instead of dividing'},{value:U.f(R(b*d,a*cc)),mistake:'Inverted the answer'},{value:U.f(R(a,b*d)),mistake:'Divided by the numerator only'}]);break;}
case 'ah-fraction-of-fraction':{let a,cc,b,d;do{a=int(1,9);cc=int(1,8);b=int(a+1,11);d=int(cc+1,11);}while(b===d||gcd(a,b)!==1||gcd(cc,d)!==1);const NM=['','One','Two','Three','Four','Five','Six','Seven','Eight'],DS=['','half','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh'],v=R(a*cc,b*d);
 t=n(`${NM[cc]} ${DS[d-1]}${cc>1?'s':''} of ${a}/${b} is what number?`,v,`${cc}/${d} × ${a}/${b} = ${U.f(v)}.`,{a,b,c:cc,d},'fraction');
 t.choices=wrongOnly(t,[{value:U.f(R(a*d,b*cc)),mistake:'Divided instead of multiplying'},{value:U.f(R(a+cc,b+d)),mistake:'Added the numerators and the denominators'},{value:`${a*cc}/${b*d}`===U.f(v)?U.f(R(a*cc,b+d)):`${a*cc}/${b*d}`,mistake:'Did not reduce the product'}]);break;}
case 'ah-fraction-of-number':{const a=int(1,10),cc=int(2,10),v=a+2,nn=int(1,v-1),N=int(101,299),z=v*N,g=gcd(nn,v);
 t=whole(`What number is ${nn/g}/${v/g} of ${z}?`,N*nn,`${z} ÷ ${v} = ${N}; × ${nn} = ${N*nn}.`,{nn,v,z},'');
 t.choices=wrongOnly(t,[{value:String(N*nn+pick([-1,1])),mistake:'Arithmetic slip'},{value:String(N*nn+pick([-1,1])*cc),mistake:'Multiplication slip'},{value:String(z+pick([-1,1])*cc),mistake:'Gave a number near the whole instead of the part'}]);break;}
// Lesson 49
case 'ah-prism-surface':{const T=[[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20],[15,20,25]],r=pick(T),flip=int(0,1),[a,cc,d]=flip?[r[1],r[0],r[2]]:r,b=int(a,Math.min(2*a,25)),k=int(0,5),u2=['inches','centimeters','millimeters','feet','meters','yards'][k],z=a*cc+b*d+a*b+cc*b;
 const sh=b*0.45,F=Fig();F.poly([[0,0],[a,0],[0,cc]]).seg([a,0],[a+sh,sh*0.6]).seg([0,cc],[sh,cc+sh*0.6]).seg([a+sh,sh*0.6],[sh,cc+sh*0.6]).seg([0,0],[sh,sh*0.6],{dash:'4,3'}).seg([sh,sh*0.6],[a+sh,sh*0.6],{dash:'4,3'}).seg([sh,sh*0.6],[sh,cc+sh*0.6],{dash:'4,3'}).right([0,0],0,90)
  .txt([a/2,-1.4],String(a)).txt([-0.6,cc/2],String(cc),{anchor:'end'}).txt([a/2+0.4,cc/2+0.4],String(d),{anchor:'start'}).txt([a+sh/2+0.6,sh*0.3],String(b),{anchor:'start'});
 t=whole(`Find the surface area of this right triangular prism. Dimensions are in ${u2}.`,z,`Two triangles: 2 × ½ × ${a} × ${cc} = ${a*cc}; three rectangles: ${a} × ${b} + ${cc} × ${b} + ${d} × ${b} = ${a*b+cc*b+d*b}; total ${z}.`,{a,b,c:cc,d},F.render('A right triangular prism with the legs, hypotenuse and length labelled',280,200));
 t.choices=wrongOnly(t,[{value:String(z+pick([-1,1])),mistake:'Arithmetic slip'},{value:String(a*b*cc/2),mistake:'Found the volume instead'},{value:String(a*cc*d/2),mistake:'Multiplied the three sides of the triangle'}]);break;}
// Lesson 50
case 'ah-sci-large':{const N=100*int(1000,9000)+int(1,99);t={prompt:`Write ${ds(N,2)} in scientific notation.`,answer:{kind:'parts',parts:[{kind:'sci',m:[N,100000],e:3}],value:S.sciText(N,100000,3)},solution:`Move the decimal point 3 places left: ${S.sciText(N,100000,3)}.`,parameters:{N}};
 t.choices=wrongOnly(t,[{value:S.sciText(N,10000,2),mistake:'Moved the decimal point one place too few'},{value:S.sciText(N,100000,-3),mistake:'Used a negative exponent for a large number'},{value:S.sciText(N,1000000,4),mistake:'Moved the decimal point one place too many'}]);break;}
case 'ah-sci-large-choice':{let a;do{a=int(11,99);}while(a%10===0);const b=int(3,7),val=a*10**b;
 t={prompt:`How do you express ${comma(val)} in scientific notation?`,answer:{kind:'parts',parts:[{kind:'sci',m:[a,10],e:b+1}],value:S.sciText(a,10,b+1)},solution:`${comma(val)} = ${S.sciText(a,10,b+1)}.`,parameters:{a,b}};
 t.choices=wrongOnly(t,[{value:S.sciText(a,10,-(b+1)),mistake:'Used a negative exponent'},{value:S.sciText(a,10,b+2),mistake:'Counted one place too many'},{value:S.sciText(a,10,b),mistake:'Counted one place too few'}]);break;}
case 'ah-sci-small':{const nn=int(1,2),a=int(1,9),b=int(0,9),cc=int(0,9),d=int(1,9);let M,den,e;if(nn===1){M=1000*a+100*b+10*cc+d;den=1000;e=-1;}else{M=100*a+10*cc+d;den=100;e=-2;}
 const p=ds(M,4);t={prompt:`Write ${p} in scientific notation.`,answer:{kind:'parts',parts:[{kind:'sci',m:[M,den],e}],value:S.sciText(M,den,e)},solution:`Move the decimal point ${-e} place${e===-1?'':'s'} right: ${S.sciText(M,den,e)}.`,parameters:{M,den,e}};
 t.choices=wrongOnly(t,[{value:S.sciText(M,den,-e),mistake:'Used a positive exponent for a small number'},{value:S.sciText(M,den,e-1),mistake:'Counted one place too many'},{value:S.sciText(M,den*10,e+1),mistake:'Did not move the decimal point after the first nonzero digit'}]);break;}
case 'ah-sci-to-standard':{const a1=int(1,9),b1=int(1,9),e1=int(3,5),a2=int(1,9),b2=int(1,9),e2=-int(3,5),M1=10*a1+b1,M2=10*a2+b2;
 t=n(`Write each number in standard notation: (a) ${S.sciText(M1,10,e1)} (b) ${S.sciText(M2,10,e2)}`,[R(M1*10**e1,10),R(M2,10**(1-e2))],`(a) Move the point ${e1} places right: ${comma(M1*10**(e1-1))}; (b) move it ${-e2} places left: ${ds(M2,1-e2)}.`,{M1,e1,M2,e2},'decimal');t.answer.display=`${comma(M1*10**(e1-1))}; ${ds(M2,1-e2)}`;
 t.choices=wrongOnly(t,[{value:`${comma(M1*10**(e1-2))}; ${ds(M2,2-e2)}`,mistake:'Moved the decimal point one place too few in (a) and too many in (b)'},{value:`${ds(M1,1+e1)}; ${comma(M2*10**(-e2-1))}`,mistake:'Moved the decimal point the wrong way'},{value:`${comma(M1*10**(e1-1))}; ${ds(M2,-e2)}`,mistake:'Moved the decimal point one place too few in (b)'}]);break;}
case 'ah-sci-small-choice':{let a;do{a=int(101,999);}while(a%10===0);const b=int(-8,-4),shown=ds(a,-b);
 t={prompt:`How do you express ${shown} in scientific notation?`,answer:{kind:'parts',parts:[{kind:'sci',m:[a,100],e:b+2}],value:S.sciText(a,100,b+2)},solution:`${shown} = ${S.sciText(a,100,b+2)}.`,parameters:{a,b}};
 t.choices=wrongOnly(t,[{value:`${a} × 10${S.sup(b)}`,mistake:'Left the first factor greater than 10'},{value:`${ds(a,3)} × 10${S.sup(b+3)}`,mistake:'Left the first factor less than 1'},{value:`${ds(a,3)} × 10${S.sup(b+1)}`,mistake:'Left the first factor less than 1 and miscounted the exponent'}]);break;}
// Lesson 51
case 'ah-tenths-of-what':{let a,b;do{a=int(2,9);b=int(10,50);}while(6*b===10*a||(60*b)%a);const cc=6*b,z=10*cc/a,NM=['','','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
 t=whole(`${NM[a]} tenths of what number is ${cc}?`,z,`${ds(a,1)} × n = ${cc}, so n = ${cc} ÷ ${ds(a,1)} = ${comma(z)}.`,{a,c:cc});
 t.choices=wrongOnly(t,[{value:ds(cc*a,1),mistake:'Multiplied instead of dividing'},{value:String(cc*10),mistake:'Divided by one tenth instead'},{value:comma(z/10),mistake:'Misplaced the decimal point'}]);break;}
case 'ah-tenths-of-number':{const a=int(2,20),b=int(2,9),z=a*10,NM=['','','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
 t=whole(`${NM[b]} tenths of ${z} is what number?`,a*b,`${ds(b,1)} × ${z} = ${a*b}.`,{a,b});
 t.choices=wrongOnly(t,[{value:ds(a*b*b,1),mistake:'Multiplied by the tenths twice'},{value:String(z+b),mistake:'Added instead of multiplying'},{value:String(a*b+2*pick([-1,1])),mistake:'Arithmetic slip'}]);break;}
// Lesson 52
case 'ah-fraction-inclusion':case 'ah-fraction-inclusion-mixed':{const mixed=c.recipe==='ah-fraction-inclusion-mixed';let a,b,cc,d,e,f,g,hh,top,bot;
 do{a=int(1,9);b=int(a+1,10);cc=int(1,9);d=int(cc+1,10);g=int(1,9);hh=int(g+1,10);if(mixed){f=int(2,9);do{e=int(2*f,2*f+10);}while(gcd(e,f)!==1);}else{e=int(1,9);f=int(e+1,10);}top=a*d*f*hh+cc*b*(e*hh+(mixed?-1:1)*g*f);bot=b*d*f*hh;}while(mixed&&Math.abs(top)/gcd(Math.abs(top),bot)>399);
 const v=R(top,bot),fr=(x,y)=>U.f(R(x,y));t=n(`Simplify: ${fr(a,b)} + ${fr(cc,d)}(${mixed?U.mixed(R(e,f)):fr(e,f)} ${mixed?'−':'+'} ${fr(g,hh)})`,v,`Parentheses first, then multiply, then add: ${U.mixed(v)}.`,{a,b,c:cc,d,e,f,g,h:hh,mixed},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(Math.abs((a*d+cc*b)*(e*hh+(mixed?-1:1)*g*f))||1,b*d*f*hh)),mistake:'Added before multiplying'},{value:U.mixed(R(Math.abs(a*d*f*hh+cc*b*e*hh+(mixed?-1:1)*g*b*d*f)||1,bot)),mistake:'Multiplied only the first term in the parentheses'},{value:U.mixed(R(Math.abs(top)+bot,bot)),mistake:'Arithmetic slip of one whole'}]);break;}
case 'ah-fraction-brackets':{let a,b,cc,d,e,f,g,hh,i,j,top,bot;const AB=[];for(let x=1;x<=9;x++)for(let y=x+1;y<=10;y++)AB.push([x,y]);
 do{hh=int(1,9);g=int(2*hh,2*hh+10);[a,b]=pick(AB);cc=int(1,9);d=int(cc+1,10);e=int(1,9);f=int(e+1,10);i=int(1,9);j=int(i+1,10);top=a*(hh*j*(cc*f+d*e)+d*f*(g*j-hh*i));bot=b*d*f*hh*j;}while(g%hh===0||Math.abs(top)/gcd(Math.abs(top),bot)>399);
 const v=R(top,bot),fr=(x,y)=>U.f(R(x,y));t=n(`Simplify: ${fr(a,b)}[(${fr(cc,d)} + ${fr(e,f)}) + (${U.mixed(R(g,hh))} − ${fr(i,j)})]`,v,`Work inside the brackets first, then multiply by ${fr(a,b)}: ${U.mixed(v)}.`,{a,b,c:cc,d,e,f,g,h:hh,i,j},'fraction');t.eitherForm=true;
 t.choices=wrongOnly(t,[{value:U.mixed(R(Math.abs(a*(hh*j*(cc*f+d*e)-d*f*(g*j-hh*i)))||1,bot)),mistake:'Subtracted the two groups instead of adding'},{value:U.mixed(R(Math.abs(top)+bot,bot)),mistake:'Arithmetic slip of one whole'},{value:U.mixed(R(Math.abs(hh*j*(cc*f+d*e)+d*f*(g*j-hh*i))*b||1,a*d*f*hh*j)),mistake:'Divided by the leading fraction instead of multiplying'}]);break;}
// Lesson 53
case 'ah-percent-one':{const a=int(2,99),b=int(10,100);t=n(`(a) What is 1% of ${b}? (b) What is ${a}% of ${b}?`,[R(b,100),R(a*b,100)],`(a) 1% of ${b} = ${U.dec(R(b,100))}; (b) ${a} × ${U.dec(R(b,100))} = ${U.dec(R(a*b,100))}.`,{a,b},'decimal');
 t.choices=wrongOnly(t,[{value:`${b}; ${a*b}`,mistake:'Did not divide by 100'},{value:`${U.dec(R(b,10))}; ${U.dec(R(a*b,10))}`,mistake:'Divided by 10 instead of 100'},{value:`${U.dec(R(b,100))}; ${U.dec(R(a+b,100))}`,mistake:'Added instead of multiplying in (b)'}]);break;}
case 'ah-percent-over-100':{const pct=10*int(11,19),of=int(60,130),z=R(pct*of,100);t=n(`What is ${pct}% of ${of}?`,z,`${ds(pct,2)} × ${of} = ${U.dec(z)}.`,{pct,of},'decimal');
 t.choices=wrongOnly(t,[{value:U.dec(R(pct*of+800,100)),mistake:'Arithmetic slip in the tens'},{value:U.dec(R(pct*of,1000)),mistake:'Misplaced the decimal point'},{value:U.dec(R(pct*of+1700,100)),mistake:'Arithmetic slip'},{value:U.dec(R((pct-100)*of,100)),mistake:'Found only the part over 100%'}]);break;}
// Lesson 54
case 'ah-proportion':{const T=[[3,2],[4,2],[4,3],[5,2],[5,3],[5,4],[6,2],[6,3],[6,4],[6,5],[7,2],[7,3],[7,4],[7,5],[7,6],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]],[b,a]=pick(T),f=int(2,5),e=int(1,2),cc=a*f,d=b*f,X=letterRun2(int,1,'oile')[0];
 t=whole(e===1?`Solve: ${a}/${X} = ${cc}/${d}`:`Solve: ${a}/${b} = ${cc}/${X}`,e===1?b:d,e===1?`Cross multiply: ${cc}${X} = ${a*d}, so ${X} = ${b}.`:`Cross multiply: ${a}${X} = ${b*cc}, so ${X} = ${d}.`,{a,b,c:cc,d,e});
 t.math=S.math(e===1?S.mfrac(`<mn>${a}</mn>`,`<mi>${X}</mi>`)+S.mo('=')+S.mfrac(cc,d):S.mfrac(a,b)+S.mo('=')+S.mfrac(`<mn>${cc}</mn>`,`<mi>${X}</mi>`));
 t.choices=wrongOnly(t,e===1?[{value:String(d),mistake:'Copied the other denominator'},{value:U.f(R(a*cc,d)),mistake:'Cross multiplied the wrong pair'},{value:String(b+f),mistake:'Added the scale factor instead of dividing'}]:[{value:String(b),mistake:'Copied the other denominator'},{value:U.f(R(a*cc,b)),mistake:'Cross multiplied the wrong pair'},{value:String(cc+b-a),mistake:'Added the difference instead of scaling'}]);break;}
case 'ah-proportion-choice':{let a,b,cc;do{a=int(2,9);b=int(2,9);cc=int(2,9);}while(gcd(a,b)!==1||a*a===b||2*a*a===b||a*a===cc||b===cc||b===2*cc);const X=upper(int,'oil');
 t=whole(`Solve: ${a}/${b} = ${X}/${b*cc}`,a*cc,`${X} = ${a} × ${cc} = ${a*cc}.`,{a,b,c:cc});t.math=S.math(S.mfrac(a,b)+S.mo('=')+S.mfrac(`<mi>${X}</mi>`,`<mn>${b*cc}</mn>`));
 t.choices=wrongOnly(t,[{value:String(a*cc+pick([-1,1])),mistake:'Arithmetic slip'},{value:String(a*(cc+pick([-1,1]))),mistake:'Used the wrong scale factor'},{value:String(cc*(a+pick([-1,1]))),mistake:'Scaled the wrong numerator'}]);break;}
case 'ah-power-eval':case 'ah-power-eval-choice':{const ch=c.recipe==='ah-power-eval-choice';let a,b;if(!ch){[a,b]=pick([[2,2],[2,3],[2,4],[3,2],[3,3],[3,4],[4,2],[4,3],[4,4],[5,2],[5,3],[5,4],[6,2],[6,3],[7,2],[7,3],[8,2],[8,3],[9,2]]);}else{const nn=int(1,3);a=nn===1?int(2,5):nn===2?int(6,9):int(11,15);b=a===2?int(3,7):a===3?int(3,5):a<=5?int(2,4):a<=9?int(2,3):2;}
 const [X,Y]=letterRun2(int,2,'oileh');t=whole(`Evaluate: ${X}^${Y} if ${X} = ${a} and ${Y} = ${b}`,a**b,`${a}${S.sup(b)} = ${comma(a**b)}.`,{a,b});t.math=S.math(`<msup><mi>${X}</mi><mi>${Y}</mi></msup>`);
 t.choices=wrongOnly(t,[{value:comma(a**(b-1)),mistake:'Multiplied one time too few'},{value:String(a*b),mistake:'Multiplied the base by the exponent'},{value:comma(a<6?b**a:(a+1)**b),mistake:a<6?'Swapped the base and the exponent':'Used the wrong base'},{value:comma(a**(b+1)),mistake:'Multiplied one time too many'},{value:String(a+b),mistake:'Added the base and the exponent'}]);break;}
case 'ah-root-eval':case 'ah-root-eval-choice':{const ch=c.recipe==='ah-root-eval-choice';let a,b;if(!ch){const nn=int(1,2);a=nn===1?int(2,8):int(9,15);b=a===2?int(3,6):a===3?int(2,5):a<=5?int(2,4):a<=8?int(2,3):2;}else{a=int(2,15);b=a<6?int(2,4):a<=8?int(2,3):2;}
 const z=a**b,[X,Y]=letterRun2(int,2,'oileh');t=whole(`Evaluate the ${X}th root of ${Y} if ${X} = ${b} and ${Y} = ${comma(z)}.`,a,`${a}${S.sup(b)} = ${comma(z)}, so the root is ${a}.`,{a,b});t.math=S.math(`<mroot><mi>${Y}</mi><mi>${X}</mi></mroot>`);
 t.choices=wrongOnly(t,[{value:String(a+pick([-1,1])),mistake:'Tested the wrong base'},{value:String(b-1===1?2*a:a**(b-1)),mistake:'Took one power off instead of the root'},{value:String(b*b),mistake:'Squared the index'}]);break;}
case 'ah-power-root-sum':{const [W,X,Y]=letterRun2(int,3,'oileh');let a,cc,b,d;do{a=int(2,4);cc=int(2,7);b=cc**a;d=int(2,4);}while(b**d>4900);const plus=int(1,2)===1,order=int(1,2),big=b**d,small=cc,sg=plus?'+':'−';
 const expr=order===1?`${X}^${Y} ${sg} (the ${W}th root of ${X})`:`(the ${W}th root of ${X}) + ${X}^${Y}`,z=order===1?big+(plus?small:-small):big+small;
 t=whole(`Evaluate: ${expr} if ${W} = ${a}, ${X} = ${b}, and ${Y} = ${d}`,z,`${b}${S.sup(d)} = ${comma(big)} and the ${a}th root of ${b} is ${cc}: ${comma(z)}.`,{a,b,c:cc,d,order,plus});
 t.choices=wrongOnly(t,[{value:comma(big+(order===1&&!plus?small:-small)),mistake:'Used the wrong sign'},{value:comma(b*d+(order===1&&!plus?-small:small)),mistake:'Multiplied instead of raising to the power'},{value:comma(big+(order===1&&!plus?-b:b)),mistake:'Did not take the root'}]);break;}
case 'ah-mixed-power-root-choice':{let a,j,k,s;do{const o=int(1,36),A=[2,2,3,3,4,5],J=[25,16,8,27,16,32];a=A[(o-1)%6];j=J[(o-1)%6];k=[2,3,4][Math.floor(((o-1)%18)/6)];s=o<=18?-1:1;}while(Math.round(j**(1/a))**a!==j||j**k+s*k*j*a>=1001);
 const rt=Math.round(j**(1/a)),z=j**k+s*k*j*a+rt;
 t=whole(`Evaluate: x^y ${s<0?'−':'+'} yxa + (the ath root of x) if x = ${j}, y = ${k}, and a = ${a}`,z,`${j}${S.sup(k)} = ${comma(j**k)}; yxa = ${k*j*a}; the ${a}th root of ${j} is ${rt}: ${comma(z)}.`,{j,k,a,s});
 t.choices=wrongOnly(t,[{value:String(j+k+a),mistake:'Added the values instead of evaluating'},{value:String(Math.round(j*k+k*j*a+j/a)),mistake:'Multiplied instead of raising to powers and taking the root'},{value:String(j*k*a),mistake:'Multiplied the three values'}]);break;}
// Lesson 55
case 'ah-fraction-decimal-percent':{const a=2*int(5,44)+1;t={prompt:`(a) Find the decimal equivalent of ${a}/100. (b) Find the percent equivalent of ${a}/100.`,answer:{kind:'parts',parts:[{kind:'number',v:[a,100]},{kind:'number',v:[a,1]}],value:`${ds(a,2)}; ${a}%`},solution:`${a}/100 = ${ds(a,2)} = ${a}%.`,parameters:{a}};
 t.choices=wrongOnly(t,[{value:`${ds(a,1)}; ${a}%`,mistake:'Placed the decimal point one place too far right'},{value:`${ds(a,2)}; ${ds(a,2)}%`,mistake:'Wrote the decimal with a percent sign'},{value:`${ds(a,3)}; ${a*10}%`,mistake:'Used thousandths'}]);break;}
case 'ah-percent-equivalent':{const a=int(11,90),g=gcd(a,100);t={prompt:`What is the percent equivalent of ${a/g}/${100/g}?`,answer:{kind:'parts',parts:[{kind:'number',v:[a,1]}],value:`${a}%`},solution:`${a/g}/${100/g} = ${a}/100 = ${a}%.`,parameters:{a}};
 t.choices=wrongOnly(t,[{value:`${a*10}%`,mistake:'Multiplied by 1000 instead of 100'},{value:`${ds(a,1)}%`,mistake:'Multiplied by 10 instead of 100'},{value:`${100+a}%`,mistake:'Added 100 instead of multiplying'}]);break;}
case 'ah-reference-table':{const D1=pick([4,10,25,40,50]);let n1;do{n1=int(1,D1-1);}while(gcd(n1,D1)!==1);const D2=pick([5,8,20]);let n2;do{n2=int(1,D2-1);}while(gcd(n2,D2)!==1||n2*D1===n1*D2);let n3;do{n3=int(11,98);}while(gcd(n3,100)===1||n3*D1===100*n1||n3*D2===100*n2);
 const pc=(x,y)=>U.dec(R(100*x,y)),dc=(x,y)=>U.dec(R(x,y));
 t={prompt:`Complete the table. Row 1: fraction (a), decimal ${dc(n1,D1)}, percent (b). Row 2: fraction ${n2}/${D2}, decimal (c), percent (d). Row 3: fraction (e), decimal (f), percent ${pc(n3,100)}%. Give (a) to (f) in order, separated by semicolons, with fractions in lowest terms.`,
  answer:{kind:'parts',parts:[{kind:'fraction',v:[n1,D1]},{kind:'number',v:[100*n1,D1]},{kind:'number',v:[n2,D2]},{kind:'number',v:[100*n2,D2]},{kind:'fraction',v:[n3,100]},{kind:'number',v:[n3,100]}],value:`${U.f(R(n1,D1))}; ${pc(n1,D1)}%; ${dc(n2,D2)}; ${pc(n2,D2)}%; ${U.f(R(n3,100))}; ${dc(n3,100)}`},
  solution:`Row 1: ${U.f(R(n1,D1))} = ${dc(n1,D1)} = ${pc(n1,D1)}%. Row 2: ${n2}/${D2} = ${dc(n2,D2)} = ${pc(n2,D2)}%. Row 3: ${U.f(R(n3,100))} = ${dc(n3,100)} = ${n3}%.`,parameters:{n1,D1,n2,D2,n3}};
 t.choices=wrongOnly(t,[{value:`${n1}/${D1}; ${dc(n1,D1)}%; ${dc(n2,D2)}; ${dc(n2,D2)}%; ${n3}/100; ${dc(n3,100)}`,mistake:'Wrote decimals with a percent sign instead of multiplying by 100'},{value:`${U.f(R(n1,D1))}; ${pc(n1,D1)}%; ${dc(n2*10,D2)}; ${pc(n2,D2)}%; ${U.f(R(n3,100))}; ${dc(n3,10)}`,mistake:'Placed the decimal point one place too far right'},{value:`${U.f(R(D1,n1))}; ${pc(n1,D1)}%; ${dc(n2,D2)}; ${pc(n2,D2)}%; ${U.f(R(100,n3))}; ${dc(n3,100)}`,mistake:'Inverted the fractions'}]);break;}
case 'ah-complete-row':{let p1;do{p1=int(2,98);}while(gcd(p1,100)===1);const s1=int(1,3),fr=U.f(R(p1,100)),dc=ds(p1,2);
 const given=s1===1?`fraction ${fr}`:s1===2?`decimal ${dc}`:`percent ${p1}%`;
 t={prompt:`Complete the row: ${given}. Write the fraction (lowest terms), the decimal and the percent, separated by semicolons.`,answer:{kind:'parts',parts:[{kind:'fraction',v:[p1,100]},{kind:'number',v:[p1,100]},{kind:'number',v:[p1,1]}],value:`${fr}; ${dc}; ${p1}%`},solution:`${fr} = ${dc} = ${p1}%.`,parameters:{p1,s1}};
 t.choices=wrongOnly(t,[{value:`${fr}; ${ds(p1*10,2)}; ${p1*10}%`,mistake:'Placed the decimal point one place too far right'},{value:`${U.f(R(p1,200))}; ${dc}; ${p1}%`,mistake:'Used 200 as the denominator'},{value:`${fr}; ${dc}; ${p1*10}%`,mistake:'Multiplied by 1000 for the percent'}]);break;}
// AH-4 end
default:throw Error('Unknown Algebra 1/2 port recipe '+c.recipe);}
// A rare draw can leave fewer than two distinct distractors; top them up with near misses that are checked as wrong.
if(t.choices&&t.choices.length<2)t.choices=topUp(t,wrongOnly,h);
return t;}
function topUp(t,wrongOnly,h){let key='';try{key=String(t.answer.value??answerText(t)??(t.answer.display||U.answerText(t)));}catch(e){key='';}const have=t.choices.slice(),out=[];const mx=r=>U.mixed(r).replace('-','−');
 const m=key.replace(/[−–]/g,'-').replace(/,(?=\d{3})/g,'').match(/^\$?(-?\d+(?:\.\d+)?)(%?)$/),f=key.replace(/[−–]/g,'-').match(/^(-?)(?:(\d+) )?(\d+)\/(\d+)$/);
 if(m){const v=Number(m[1]),dp=(m[1].split('.')[1]||'').length,fmt=x=>(key.startsWith('$')?'$':'')+minus(Number(x.toFixed(dp)))+m[2];for(const [d,why] of [[1,'Arithmetic slip'],[-1,'Arithmetic slip'],[10,'Slip in the tens'],[-10,'Slip in the tens'],[2,'Arithmetic slip']])out.push({value:fmt(v+d*10**-dp),mistake:why});}
 else if(f){const sg=f[1]?-1:1,w=Number(f[2]||0),nn=Number(f[3]),d=Number(f[4]),N=sg*(w*d+nn);out.push({value:mx(R(N+1,d)),mistake:'Arithmetic slip in the numerator'},{value:mx(R(N-1,d)),mistake:'Arithmetic slip in the numerator'},{value:mx(R(N,d+1)),mistake:'Arithmetic slip in the denominator'},{value:mx(R(-N,d)),mistake:'Lost the sign'});}
 else if(/,/.test(key)){const p=key.split(/,\s*/);for(let i=0;i+1<p.length&&out.length<3;i++){const q=[...p];[q[i],q[i+1]]=[q[i+1],q[i]];out.push({value:q.join(', '),mistake:'Put two numbers in the wrong order'});}}
 return wrongOnly(t,have.concat(out));}

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
