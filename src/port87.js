/* Original Engine tasks ported from the 8/7 generator bank (coverage programme). Each recipe asks the same
   thing as its source record, in the same response form and difficulty range, with fresh values. The
   source scripts were read as data only; nothing here executes or reproduces them. Choice-only source
   records are served by the free-response task with reviewed distractors, each tied to a named mistake. */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const U=common?require('./curriculum87-common'):root.MathCurriculum87Common;
const catalog=common?require('./port87-map'):root.MathPort87Map;
const {M,R,f,n,text,teacher,esc}=U;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);

// ---------- formatting ----------
const comma=x=>String(x).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const money=c=>'$'+(c/100).toFixed(2);
const minus=x=>x<0?'−'+Math.abs(x):String(x);
const mn=x=>x<0?`<mrow><mo>−</mo><mn>${Math.abs(x)}</mn></mrow>`:`<mn>${x}</mn>`;
const mfrac=(a,b)=>`<mfrac>${typeof a==='string'?a:mn(a)}${typeof b==='string'?b:mn(b)}</mfrac>`;
const mixedML=(w,a,b)=>`<mrow><mn>${w}</mn>${mfrac(a,b)}</mrow>`;
const math=inner=>`<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">${inner}</math>`;
const mo=s=>`<mo>${s}</mo>`, mi=s=>`<mi>${s}</mi>`;
function fracText(nm,dn){return dn===1?String(nm):`${nm}/${dn}`;}
function mixedText(nm,dn){const g=gcd(nm,dn);nm/=g;dn/=g;const w=Math.floor(nm/dn),r=nm%dn;return r===0?String(w):w?`${w} ${r}/${dn}`:`${r}/${dn}`;}
function fracML(nm,dn,mixed=false){const g=gcd(nm,dn);nm/=g;dn/=g;if(dn===1)return mn(nm);if(mixed&&nm>dn)return mixedML(Math.floor(nm/dn),nm%dn,dn);return mfrac(nm,dn);}

// ---------- drawings (original SVG) ----------
const INK='#1f2a30';
function svg(body,label,w,h){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" style="display:block;width:100%;max-width:${Math.min(w*1.2,520)}px;height:auto;margin:10px 0;font-family:'Times New Roman',serif"><title>${esc(label)}</title><defs><marker id="p87a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10" fill="none" stroke="${INK}" stroke-width="1.5"/></marker></defs>${body}</svg>`;}
const ln=(x1,y1,x2,y2,o={})=>`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${o.color||INK}" stroke-width="${o.w||1.5}"${o.dash?` stroke-dasharray="${o.dash}"`:''}${o.start?' marker-start="url(#p87a)"':''}${o.end?' marker-end="url(#p87a)"':''}/>`;
const tx=(x,y,s,o={})=>`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${o.size||13}" text-anchor="${o.anchor||'middle'}"${o.italic?' font-style="italic"':''} fill="${INK}">${esc(s)}</text>`;
const dot=(x,y)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${INK}"/>`;

// A number line from lo to hi with every integer labelled; arrows: list of [from,to,height level].
function numberLine(lo,hi,arrows=[],label=''){const W=440,x=v=>30+(v-lo)*(W-60)/(hi-lo),base=arrows.length?95:40;let b=ln(12,base,W-12,base,{start:1,end:1});
 for(let v=lo;v<=hi;v++){b+=ln(x(v),base-6,x(v),base+6)+tx(x(v),base+21,minus(v),{size:12});}
 arrows.forEach(([from,to,level])=>{const y=base-26*level;b+=ln(x(from),y,x(to),y,{end:1})+ln(x(from),base,x(from),y,{dash:'4,3',w:1})+ln(x(to),base,x(to),y,{dash:'4,3',w:1});});
 return svg(b,label||`Number line from ${lo} to ${hi}`,W,base+32);}
// Angle figure: line TR through O (or ray OR for the right-angle case) with ray OS, as in the source layouts.
function angleFigure(layout){const W=300,H=170,O=[150,130],sc=9;const P=([x,y])=>[O[0]+x*sc,O[1]-y*sc];let b='',pts;
 if(layout==='right'){const o=[60,140],Q=([x,y])=>[o[0]+x*sc*1.1,o[1]-y*sc*1.1];b+=ln(...Q([0,0]),...Q([12,0]),{end:1})+ln(...Q([0,0]),...Q([0,11]),{end:1})+ln(...Q([0,0]),...Q([9,9*Math.sqrt(3)]),{end:1});
  pts=[['O',[0,0],[0,-1.8]],['R',[7,0],[0,-1.8]],['S',[7,7*Math.sqrt(3)/2],[1.3,-0.6]],['T',[0,7],[-1.2,0]]].map(([nm,p,d])=>{const [x,y]=Q(p),[lx,ly]=Q([p[0]+d[0],p[1]+d[1]]);return dot(x,y)+tx(lx,ly+4,nm,{italic:1,size:12});});return svg(b+pts.join(''),'Rays OR, OS and OT from point O; angle TOR is a right angle',W,H);}
 b+=ln(...P([-14,0]),...P([14,0]),{start:1,end:1});const S=layout==='up'?[0,8]:layout==='right-lean'?[7,7*Math.sqrt(3)/2]:[-7,7*Math.sqrt(3)/2],far=layout==='up'?[0,11.5]:[S[0]*11.5/8.1,S[1]*11.5/8.1];
 b+=ln(...P([0,0]),...P(far),{end:1});pts=[['O',[0,0]],['T',[-8,0]],['R',[8,0]]].map(([nm,p])=>{const [x,y]=P(p);return dot(x,y)+tx(x,y+18,nm,{italic:1,size:12});}).join('');
 const [sx,sy]=P(S);pts+=dot(sx,sy)+tx(sx+(S[0]>0?12:S[0]<0?-12:12),sy+4,'S',{italic:1,size:12});
 return svg(b+pts,'Line TR through O with ray OS',W,H);}
// Square with the left a% shaded in horizontal hatching and grid columns every 10% (or 25%).
function percentSquare(a){const s=200,x0=20,y0=10;let b='';const step=a%10===5?25:10;
 for(let i=5;i<100;i+=5)b+=ln(x0,y0+s-i*s/100,x0+a*s/100,y0+s-i*s/100,{w:1});
 for(let d=step;d<100;d+=step)b+=ln(x0+d*s/100,y0,x0+d*s/100,y0+s,{w:.8});
 b+=`<rect x="${x0}" y="${y0}" width="${s}" height="${s}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(x0+a*s/100,y0,x0+a*s/100,y0+s,{w:1.6});
 return svg(b,`Square divided into ${100/step} equal columns; the left ${a} percent is shaded`,240,220);}
// Ten-by-ten grid with the first v small squares shaded row by row from the bottom.
function hundredGrid(v){const c=20,x0=20,y0=10;let b='';for(let i=0;i<v;i++){const r=Math.floor(i/10),k=i%10;b+=`<rect x="${x0+k*c}" y="${y0+(9-r)*c}" width="${c}" height="${c}" fill="#9aa5ab"/>`;}
 for(let i=0;i<=10;i++)b+=ln(x0+i*c,y0,x0+i*c,y0+10*c,{w:1})+ln(x0,y0+i*c,x0+10*c,y0+i*c,{w:1});return svg(b,`Ten-by-ten grid of 100 equal squares with ${v} shaded`,240,220);}
// Inch ruler, 4 inches, marks to 1/den inch, with a segment from 0 of length num/den inch drawn above it.
function ruler(den,num){const u=90,x0=20,top=40,W=x0*2+4*u+12;let b=ln(x0,18,x0+u*num/den,18,{w:4});
 b+=`<path d="M${x0},${top} H${x0+4*u} l4,12 l-4,12 l4,12 l-4,12 L${x0},${top+48} Z" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
 for(let k=1;k<4*den;k++){const len=k%den===0?24:k%(den/2)===0?17:den>=8&&k%(den/4)===0?12:den>=16&&k%(den/8)===0?9:6;b+=ln(x0+k*u/den,top,x0+k*u/den,top+len,{w:1});}
 for(let i=1;i<=4;i++)b+=tx(x0+i*u,top+40,String(i));b+=tx(x0+18,top+42,'inch',{size:12});
 return svg(b,`Inch ruler marked to 1/${den} inch with a segment starting at 0 drawn above it`,W,top+56);}
// Circles split into den equal sectors; `shaded` sectors shaded in total, whole circles first.
function shadedCircles(den,shaded,count){const r=55,W=count*(2*r+20)+10;let b='';for(let c=0;c<count;c++){const cx=10+r+c*(2*r+20),cy=r+10;for(let k=0;k<den;k++){const i=c*den+k,a0=-Math.PI/2+k*2*Math.PI/den,a1=a0+2*Math.PI/den,p=(a)=>`${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;b+=`<path d="M${cx},${cy} L${p(a0)} A${r},${r} 0 0 1 ${p(a1)} Z" fill="${i<shaded?'#9aa5ab':'#fff'}" stroke="${INK}" stroke-width="1.4"/>`;}}
 return svg(b,`${count} circles, each divided into ${den} equal parts; ${shaded} parts shaded in all`,W,2*r+20);}
// Line, ray and segment figures with two labelled points.
function linearFigure(kind,p,q){const W=220,H=50,a=[45,22],b=[175,22];let s='';
 if(kind==='line')s=ln(10,22,210,22,{start:1,end:1});if(kind==='ray')s=ln(45,22,210,22,{end:1});if(kind==='ray-back')s=ln(10,22,175,22,{start:1});if(kind==='segment')s=ln(45,22,175,22);
 s+=dot(...a)+dot(...b)+tx(a[0],44,p,{italic:1})+tx(b[0],44,q,{italic:1});return svg(s,`${kind==='ray-back'?'ray':kind} through points ${p} and ${q}`,W,H);}

// ---------- tasks ----------
const LETTERS='ABCDEGHJKMNPQRSTUVWXYZ';
function letter(int,ban=''){const pool=[...LETTERS].filter(c=>!ban.includes(c));return pool[int(0,pool.length-1)];}
function distinct(answer,list){const seen=new Set([String(answer)]);return list.filter(c=>{const k=String(c.value);if(seen.has(k)||/^(\$0\.00|0|−?0 in\.|-.*in\.)$/.test(k)||/^\$-/.test(k))return false;seen.add(k);return true;}).slice(0,3);}
const PLACES=['ones','tens','hundreds','thousands','ten-thousands','hundred-thousands','millions','ten-millions','hundred-millions','billions','ten-billions','hundred-billions','trillions'];

function build(c,h){const {int,pick,index}=h;let t;
switch(c.recipe){
// Lesson 1
case 'money-divide':{// $ap ÷ bp, bp two-digit with nonzero ones, quotient $0.cd with nonzero digits
 const bp=10*int(1,9)+int(1,9),z=10*int(1,9)+int(1,9),ap=bp*z,rev=Number(String(z).split('').reverse().join(''));
 t=n(`Simplify: ${money(ap)} ÷ ${bp}. Give the answer in dollars.`,R(z,100),`${money(ap)} ÷ ${bp} = ${money(z)} because ${bp} × ${money(z)} = ${money(ap)}.`,{dividendCents:ap,divisor:bp},'decimal');
t.answer.display=money(z);
 t.choices=distinct(money(z),[{value:money(10*z),mistake:'Placed the decimal point one place too far right'},{value:money(z+(z<90?10:-10)),mistake:'Error in the first digit of the quotient'},{value:money(rev),mistake:'Wrote the quotient digits in reverse order'},{value:money(z+1),mistake:'Arithmetic slip in the last digit of the quotient'},{value:money(z-1),mistake:'Arithmetic slip in the last digit of the quotient'}]);break;}
case 'money-times':{// f($a): f in 20..90 by 10, a 1.01..9.99 not whole
 let a=int(101,999);if(a%100===0)a++;const k=int(2,9)*10;
 t=n(`Simplify: ${k}(${money(a)}). Give the answer in dollars.`,R(a*k,100),`${k} × ${money(a)} = ${money(a*k)}.`,{cents:a,factor:k},'decimal');
 t.answer.display=money(a*k);
 t.choices=distinct(money(a*k),[{value:money(a*k/10),mistake:'Multiplied by the tens digit only (forgot the zero)'},{value:money(a*k+100),mistake:'Carried incorrectly into the dollars'},{value:money(a*k*10),mistake:'Decimal point misplaced'}]);break;}
case 'evaluate-quotient':{// x ÷ a when x = a·b
 const a=int(3,5),b=int(5,14),x=a*b;
 t=n(`What is the value of x ÷ ${a} if x = ${x}?`,b,`${x} ÷ ${a} = ${b}.`,{a,x});
 t.choices=distinct(b,[{value:x*a,mistake:'Multiplied instead of divided'},{value:a,mistake:'Gave the divisor instead of the quotient'},{value:x-a,mistake:'Subtracted instead of divided'},{value:x+a,mistake:'Added instead of divided'},{value:b+1,mistake:'Division slip by one'}]);break;}
case 'evaluate-product-difference':{// x(y − w) with x signed integer, y and w tenths
 const x=int(2,7)*pick([-1,1]);let y,w;do{y=int(11,41);w=int(4,55);}while(y===w||(y%10===0&&w%10===0));
 const [p,q,r]=(()=>{const L=[...'abcdghkmnpqrstuvz'];const s=int(0,L.length-3);return [L[s],L[s+1],L[s+2]];})();
 const val=R(x*(y-w),10);
 t=n(`Evaluate ${p}(${q} − ${r}) if ${p} = ${minus(x)}, ${q} = ${(y/10).toFixed(1)}, and ${r} = ${(w/10).toFixed(1)}.`,val,`${q} − ${r} = ${minus((y-w)/10)}; ${minus(x)} × ${minus((y-w)/10)} = ${U.dec(val)}.`,{x,y:y/10,w:w/10},'decimal');
 t.choices=distinct(U.dec(val),[{value:U.dec(R(-x*(y-w),10)),mistake:'Sign error multiplying signed numbers'},{value:U.dec(R(x*y-w,10)),mistake:'Multiplied only the first term inside the parentheses'},{value:U.dec(R(x*(y+w),10)),mistake:'Added instead of subtracted inside the parentheses'},{value:U.dec(R(x*(y-w),100)),mistake:'Placed the decimal point one place too far left'}]);break;}
case 'evaluate-product-over-sum':{// jk/(j+k) from the source's table of value pairs
 const pairs=[[5,11],[5,12],[5,13],[5,14],[6,11],[6,13],[7,11],[7,12],[7,13],[7,15],[8,11],[8,13],[8,15],[9,11],[9,13],[9,14],[10,11],[10,13]],[a,b]=pick(pairs);
 const L=[...'abcdeghjkmnpqrstuvwxyz'],s=int(0,L.length-2),j=L[s],k=L[s+1];const val=R(a*b,a+b);
 t=n(`Evaluate (${j}${k})/(${j} + ${k}) when ${j} = ${a} and ${k} = ${b}.`,val,`${j}${k} = ${a*b} and ${j} + ${k} = ${a+b}, so the value is ${f(val)}.`,{j:a,k:b},'fraction');t.eitherForm=true;
 t.math=math(`<mfrac><mrow>${mi(j)}${mi(k)}</mrow><mrow>${mi(j)}${mo('+')}${mi(k)}</mrow></mfrac>`);
 t.choices=distinct(f(val),[{value:f(R(Number(`${a}${b}`),a+b)),mistake:'Wrote jk as the digits side by side instead of a product'},{value:'1',mistake:'Cancelled j and k across the fraction bar'},{value:f(R((a+1)*b,a+b)),mistake:'Arithmetic error in the numerator'}]);break;}
// Lesson 2
case 'property-statement':{// illustrate commutative (2 numbers) or associative (3 numbers) property of + or ×
 const assoc=c.variant==='associative',op=pick(['+','×']),name=op==='+'?'addition':'multiplication';const nums=[];while(nums.length<(assoc?3:2)){const v=int(2,9);if(!nums.includes(v))nums.push(v);}
 const [a,b,d]=nums,ref=assoc?`(${a} ${op} ${b}) ${op} ${d} = ${a} ${op} (${b} ${op} ${d})`:`${a} ${op} ${b} = ${b} ${op} ${a}`;
 t={prompt:`Use the numbers ${assoc?`${a}, ${b}, and ${d}`:`${a} and ${b}`} to illustrate the ${c.variant} property of ${name}. Write a number sentence.`,answer:{kind:'property',property:c.variant,op,numbers:nums,value:ref},solution:`For example, ${ref}.`,parameters:{numbers:nums,op}};
 if(assoc)t.choices=[{value:`(${a} ${op} ${d}) ${op} ${b} = ${d} ${op} (${a} ${op} ${b})`,mistake:'Grouping and order both change, so this shows the commutative and associative properties together'},{value:`(${a} ${op} ${b}) ${op} ${d} = ${d} ${op} (${a} ${op} ${b})`,mistake:'Shows the commutative property (order changes), not regrouping'},{value:`${a} ${op} ${b} ${op} ${d} = ${a} ${op} ${b} ${op} ${d}`,mistake:'No grouping shown, so nothing is illustrated'}];
 break;}
case 'property-test':{// is the operation associative / commutative? answer and example
 const op=pick(['addition','subtraction','multiplication','division']),prop=pick(['associative','commutative']),yes=op==='addition'||op==='multiplication';
 const ex={addition:{associative:'(1 + 2) + 3 = 1 + (2 + 3)',commutative:'1 + 2 = 2 + 1'},subtraction:{associative:'(3 − 2) − 1 ≠ 3 − (2 − 1)',commutative:'2 − 1 ≠ 1 − 2'},multiplication:{associative:'(2 × 3) × 4 = 2 × (3 × 4)',commutative:'2 × 3 = 3 × 2'},division:{associative:'(8 ÷ 4) ÷ 2 ≠ 8 ÷ (4 ÷ 2)',commutative:'1 ÷ 2 ≠ 2 ÷ 1'}}[op][prop];
 t=teacher(`Is the operation of ${op} ${prop}? Answer yes or no, and give an example.`,`${yes?'Yes':'No'}. Example: ${ex}`,[`Answers ${yes?'yes':'no'}.`,yes?`The example shows two equal results, by ${prop==='commutative'?'changing the order':'changing the grouping'}.`:'The example is a counterexample: two different results, with both sides evaluated correctly.'],{op,prop});break;}
// Lesson 3
case 'missing-dividend':{// M ÷ b = a with a = b·e
 const e=int(2,9),b=int(2,9),a=b*e,m=letter(int,'FOILE');
 t=n(`Find the missing number: ${m} ÷ ${b} = ${a}.`,a*b,`${m} = ${a} × ${b} = ${a*b}.`,{b,a,letter:m});
 t.choices=distinct(a*b,[{value:a+b,mistake:'Added the numbers instead of multiplying'},{value:e,mistake:'Divided instead of multiplied'},{value:a-b,mistake:'Subtracted the numbers'},{value:a*(b+1),mistake:'Multiplication slip (one group too many)'},{value:a*(b-1),mistake:'Multiplication slip (one group too few)'}]);break;}
// Lesson 4
case 'compare-number-line':{
 const a=int(-9,-1),b=int(-9,9),z=a<b?'<':a>b?'>':'=';
 t=text(`Use the number line to compare the numbers. Write <, >, or = in the box: ${minus(a)} ☐ ${minus(b)}`,z,`${minus(a)} is ${a<b?'to the left of':a>b?'to the right of':'at the same point as'} ${minus(b)}, so ${minus(a)} ${z} ${minus(b)}.`,{a,b},numberLine(-9,9));
 t.choices=[{value:'<',mistake:''},{value:'>',mistake:''},{value:'=',mistake:''}].filter(x=>x.value!==z).map(x=>({value:x.value,mistake:x.value==='='?'Compared distance from zero only':'Compared the numbers without their signs'}));break;}
case 'subtraction-number-line':{// show a − b on a number line (signed variant follows the source's ranges)
 let a,b,z;if(c.variant==='signed'){do{a=int(1,6)*pick([-1,1]);b=int(1,11)*Math.sign(a);z=a-b;}while(Math.abs(z)>=7||z===0);}else{do{a=int(1,9);b=int(1,8);z=a-b;}while(z<=0||z>=7);}
 const lo=c.variant==='signed'?-6:0,hi=c.variant==='signed'?6:10,bt=b<0?`(${minus(b)})`:String(b);
 t=teacher(`Show this subtraction problem on a number line: ${minus(a)} − ${bt}${c.variant==='signed'?` = ${minus(z)}`:''}.`,`Start at 0 and draw an arrow to ${minus(a)}; from ${minus(a)}, draw an arrow ${b>0?'left':'right'} ${Math.abs(b)} units to end at ${minus(z)}.`,['First arrow starts at 0 and ends at the first number.','Second arrow starts where the first ends and moves the right length in the right direction (subtracting a negative moves right).',`The drawing ends at ${minus(z)}.`],{a,b,z},numberLine(lo,hi),numberLine(lo,hi,[[0,a,2],[a,z,1]],`Number line showing ${minus(a)} − ${bt} = ${minus(z)}`));
 if(c.variant==='signed')t.choices=[{value:'Arrows 0 → a − b, then on to a',mistake:'Drew the arrows in the reverse order'},{value:'Arrows 0 → −(a − b), then on to −a',mistake:'Mirrored the drawing (sign error)'},{value:'Arrows −a → 0 and on to −(a − b)',mistake:'Started from the opposite of the first number'}];
 break;}
// Lesson 5
case 'place-of-digit':{// 13-digit number; name the place of a digit that occurs once
 const places=c.variant==='mid'?[5,6,8,11,12,13]:[2,3,4,5,6,7,8,9,10,11,12,13];let digits;
 const pos=pick(places);do{digits=Array.from({length:13},(_,i)=>i===0?int(1,9):int(0,9));}while(digits.filter(d=>d===digits[13-pos]).length!==1);
 const num=Number(digits.join('')),d=digits[13-pos],ans=PLACES[pos-1];
 t=text(`Find the place value of the digit ${d} in the number ${comma(num)}.`,`${ans} place`,`Counting periods from the right, ${d} is in the ${ans} place.`,{digits,position:pos},'',[ans,ans.replace('-',' '),ans.replace('-',' ')+' place']);
 t.choices=[[pos+1,'Counted the places off by one (started at 0)'],[pos-1,'Counted one place too few'],[pos+3,'Miscounted by a whole period'],[pos-3,'Miscounted by a whole period'],[pos+2,'Counted two places too many'],[pos-2,'Counted two places too few']].filter(([p])=>p>=1&&p<=13).slice(0,3).map(([p,m])=>({value:PLACES[p-1]+' place',mistake:m}));break;}
case 'underlined-digit-value':{// value of the hundred-millions digit in short word form
 const dg=[int(1,9),...Array.from({length:11},()=>int(0,9))];dg[3]=int(1,9);const num=comma(Number(dg.join(''))),d=dg[3];
 t=text(`Write the value of the underlined digit in short word form: ${num.slice(0,5)}\u0332${num.slice(5)}`,`${d}00 million`,`${d} is in the hundred-millions place, so its value is ${d}00,000,000, or ${d}00 million.`,{digits:dg},'',[`${d} hundred million`,`${d}00,000,000`]);
 t.math=`<span style="font-size:1.1em">${num.slice(0,4)}<u>${d}</u>${num.slice(5)}</span>`;break;}
case 'expanded-notation':{// n = p·100,000 or p·10,000, plus c·1000, written with multiplication
 const big=int(0,1),p=int(2,9),cc=int(2,9),value=(big?p*100000:p*10000)+cc*1000,ref=`(${p} × ${big?'100,000':'10,000'}) + (${cc} × 1000)`;
 t={prompt:`Write ${comma(value)} in expanded notation, using multiplication, for example (2 × 100) + (5 × 10).`,answer:{kind:'expanded',terms:[[p,big?100000:10000],[cc,1000]],value:ref},solution:ref+'.',parameters:{value}};break;}
case 'words-to-digits':{
 const tm=int(1,9)*10,th=int(200,900),u=int(2,999),num=tm*1e6+th*1e3+u;
 t=n(`Use digits to write ${words(tm*1e6)}, ${words(th*1000)}, ${words(u)}.`,num,`${words(tm)} million → ${tm},; ${words(th)} thousand → ${th},; ${words(u)} → ${String(u).padStart(3,'0')}. The number is ${comma(num)}.`,{num});
 t.answer.display=comma(num);t.choices=distinct(comma(num),[{value:comma(tm*1e5+th*1e3+u),mistake:'Wrote the millions in the wrong period (one place short)'},{value:comma(num+int(1,9)*10000),mistake:'Misplaced a digit in the thousands period'},{value:comma(tm*1e5+th*1e3+u+int(1,9)*10000),mistake:'Lost a place and misread the thousands'}]);break;}
// Lesson 6
case 'factor-lists':{
 const rows=[[2,5,3,4,1],[2,3,5,3,1],[2,3,7,3,1],[2,5,11,3,1],[3,2,7,1,2],[3,2,11,1,2],[5,3,2,7,3],[5,7,3,1,2],[5,3,7,3,2],[5,7,1,2,3],[7,5,2,1,3],[7,11,3,1,2],[7,3,5,3,2],[11,3,2,1,3],[11,5,2,3,1]];
 const [b,bb,a,cc,d]=pick(rows),F=a*b*cc,G=a*bb*d,fac=x=>Array.from({length:x},(_,i)=>i+1).filter(i=>x%i===0);
 const common=fac(F).filter(x=>G%x===0),g=gcd(F,G);
 t={prompt:`(a) List the factors of ${F}. (b) List the factors of ${G}. (c) What numbers are factors of both ${F} and ${G}? (d) What is the greatest common factor of ${F} and ${G}? Separate the four answers with semicolons and the numbers in a list with commas.`,answer:{kind:'lists',lists:[fac(F),fac(G),common,[g]],value:[fac(F).join(', '),fac(G).join(', '),common.join(', '),String(g)].join('; ')},solution:`Factors of ${F}: ${fac(F).join(', ')}. Factors of ${G}: ${fac(G).join(', ')}. Common factors: ${common.join(', ')}. GCF: ${g}.`,parameters:{F,G}};break;}
case 'gcf-two':{// f = a·b·c, g = a·b·d with a, b, c, d from 2..5
 let F,G,a,b,cc,d;do{a=int(2,5);b=int(2,5);cc=int(2,5);d=int(2,5);F=a*b*cc;G=a*b*d;}while(F===G);const z=gcd(F,G);
 t=n(`What is the greatest common factor of ${F} and ${G}?`,z,`The factors common to ${F} and ${G} include ${z}, and none is larger: GCF = ${z}.`,{F,G});
 t.choices=distinct(z,[{value:F*G/z,mistake:'Found the least common multiple instead'},{value:a,mistake:'Stopped at the first common factor found'},{value:Math.min(F,G),mistake:'Gave the smaller number, which is not a factor of the other'},{value:2*z,mistake:'Chose a common multiple of the GCF'},{value:Math.abs(F-G),mistake:'Subtracted the numbers'},{value:z/2,mistake:'Stopped at a smaller common factor'},{value:a*b*cc*d,mistake:'Multiplied all the prime factors'}].filter(x=>x.value!==z&&Number.isInteger(x.value)&&x.value>1&&!(x.value===Math.min(F,G)&&Math.max(F,G)%Math.min(F,G)===0)));break;}
case 'which-divisible':{// four numbers; exactly one is divisible by a
 const a=pick([3,4,6,8]),p=pick(c.variant==='large'?[13,17,19,23]:[11,13,17,19,23]),z=a*p;let opts;
 if(c.variant==='large')opts=[a*z+1,a*z-1,a*z+2];else{const s=int(2,5),tt=int(2,5);opts=[z+pick([-1,1])*int(1,a-1),tt*z-1,s*z+2];}
 opts=opts.filter(x=>x%a!==0);while(opts.length<3){const v=z+int(1,a-1)+a*int(1,5);if(v%a&&!opts.includes(v))opts.push(v);}
 const shown=[z,...opts];for(let i=shown.length-1;i>0;i--){const j=int(0,i);[shown[i],shown[j]]=[shown[j],shown[i]];}
 t=n(`Which number is divisible by ${a}? ${shown.map((v,i)=>`(${'abcd'[i]}) ${comma(v)}`).join('   ')}`,z,`${comma(z)} = ${a} × ${p}; each other number leaves a remainder when divided by ${a}.`,{a,shown});
 t.choices=opts.map(v=>({value:comma(v),mistake:`Not divisible by ${a}: remainder ${v%a}`}));break;}
case 'divisible-by-both':{
 const set=[2,3,5,9,10];let a,b;do{a=pick(set);b=pick(set);}while(a===b);const k=pick([7,11,13,17]);let q,yes=int(0,1)===1;
 const lcm=a*b/gcd(a,b);if(yes)q=lcm*k*int(1,3);else{do{q=int(100,999)+0;}while(q%a===0&&q%b===0||!(q%a===0||q%b===0));}
 yes=q%a===0&&q%b===0;
 t=text(`Is ${comma(q)} divisible by both ${a} and ${b}? Answer yes or no.`,yes?'Yes':'No',yes?`${comma(q)} ÷ ${a} and ${comma(q)} ÷ ${b} both leave no remainder.`:`${comma(q)} is ${q%a?'not divisible by '+a:'not divisible by '+b}, so the answer is no.`,{q,a,b});break;}
case 'which-has-property':{// which number is divisible by / not divisible by a set of numbers
 const props=[['divisible by 3',x=>x%3===0],['not divisible by 6',x=>x%6!==0],['divisible by 2, 3, and 5',x=>x%30===0],['divisible by both 2 and 5',x=>x%10===0],['divisible by 2 but not 4',x=>x%2===0&&x%4!==0],['not divisible by 2, 3, or 5',x=>x%2&&x%3&&x%5],['not divisible by 2 or 5',x=>x%2&&x%5]];
 const [name,test]=pick(props),size=pick([[100,999],[1000,9999],[10000,99999]]);let z;do{z=int(...size);}while(!test(z));const others=[];while(others.length<3){const v=int(...size);if(!test(v)&&!others.includes(v))others.push(v);}
 const shown=[z,...others];for(let i=3;i>0;i--){const j=int(0,i);[shown[i],shown[j]]=[shown[j],shown[i]];}
 t=n(`Which number is ${name}? ${shown.map((v,i)=>`(${'abcd'[i]}) ${comma(v)}`).join('   ')}`,z,`Only ${comma(z)} is ${name}.`,{name,shown});t.choices=others.map(v=>({value:comma(v),mistake:'Misapplied a divisibility rule'}));break;}
// Lesson 7
case 'name-linear-figures':{
 const kinds=pick([['line','ray','segment'],['ray','line','segment'],['ray-back','line','segment'],['segment','line','ray'],['segment','ray-back','line'],['ray-back','segment','line'],['line','ray-back','segment'],['segment','ray','line']]);
 const used=new Set(),pair=()=>{let p,q;do{p=letter(int,'FOIL');q=letter(int,'FOIL');}while(p===q||used.has(p)||used.has(q));used.add(p);used.add(q);return [p,q];};
 const figs=kinds.map(k=>[k,...pair()]),nm=([k,p,q])=>k==='line'?`line; ${p}${q} with a two-headed arrow over it (or ${q}${p})`:k==='segment'?`segment; ${p}${q} with a bar over it (or ${q}${p})`:k==='ray'?`ray; ${p}${q} with an arrow over it, pointing right (endpoint ${p} first)`:`ray; ${q}${p} with an arrow over it (endpoint ${q} first)`;
 t=teacher(`What term best describes each figure? Use a symbol and letters to name each figure. (a), (b) and (c) are shown in order.`,figs.map((x,i)=>`(${'abc'[i]}) ${nm(x)}`).join(' '),['Each term (line, ray, segment) matches its figure.','Each name uses the correct symbol over the letters.','A ray is named with its endpoint first.'],{figures:figs},figs.map(([k,p,q])=>linearFigure(k,p,q)).join(''));break;}
case 'angle-kind':{// ∠TOR straight (or right); given one angle's kind, name the other's
 const a=int(1,8),given=['obtuse','acute','acute','obtuse','right','right','acute','acute'][a-1],z=['acute','obtuse','obtuse','acute','right','right','acute','acute'][a-1];
 const layout=a<3?'right-lean':a<5?'left-lean':a<7?'up':'right',straight=a<7?'straight':'right',odd=a%2===1,d=odd?'∠TOS':'∠ROS',e=odd?'∠ROS':'∠TOS';
 t=text(`If ${d} is ${given} and ∠TOR is ${straight}, what kind of angle is ${e}?`,z,straight==='straight'?`∠TOS and ∠ROS together make the straight angle TOR (180°). ${given==='right'?'The other part is also 90°, a right angle.':given==='obtuse'?'If one is more than 90°, the other is less than 90°: acute.':'If one is less than 90°, the other is more than 90°: obtuse.'}`:`∠TOS and ∠ROS together make the right angle TOR (90°), so each part is less than 90°: acute.`,{a},angleFigure(layout));
 t.choices=['acute','obtuse','right','straight'].filter(x=>x!==z).map(x=>({value:x,mistake:x==='straight'?'Gave the kind of the whole angle TOR':x===given?'Repeated the kind of the given angle':'Did not use the fact that the angles fill TOR'}));break;}
// Lesson 8
case 'percent-shaded-square':{
 const a=pick([10,20,25,30,40,60,70,75,80,90]),about=c.variant==='about';
 t=n(`${about?'About what':'What'} percentage of the ${about?'diagram':'figure'} is shaded? Give the percent as a number.`,a,`${a%10===5?'Each column is 25%':'Each column is 10%'}; the shaded part covers ${a}%.`,{a},'numbers',percentSquare(a));
 t.choices=distinct(a,[{value:100-a,mistake:'Gave the unshaded part'},{value:a/10,mistake:'Counted columns instead of percent'},{value:50,mistake:'Guessed half'}]);break;}
case 'percent-grid':{let v;do{v=int(1,89);}while(v%10===0);
 t=n('What percentage of the square is shaded? Give the percent as a number.',v,`${v} of the 100 equal small squares are shaded: ${v}%.`,{v},'numbers',hundredGrid(v));
 t.choices=distinct(v,[{value:100-v,mistake:'Counted the unshaded squares'},{value:Math.floor(v/10)*10,mistake:'Counted only the full rows'},{value:Math.floor(v/10)+v%10,mistake:'Counted rows and squares as ones'},{value:v%10,mistake:'Counted only the squares in the partial row'},{value:v+10,mistake:'Counted one row too many'},{value:v*10,mistake:'Read each small square as 10%'}]);break;}
case 'ruler-length':{// to the nearest 1/16 (odd sixteenths) or 1/8 (not a quarter) inch
 const den=c.variant==='eighths'?8:16;let a;if(den===16)a=2*int(1,30)+1;else do{a=int(1,31);}while(a%2===0);
 t=n(`How long is this segment${den===16?' to the nearest sixteenth of an inch':''}? Give the length in inches.`,R(a,den),`The segment ends at ${a} of the ${den} equal marks per inch: ${U.mixed(R(a,den))} in.`,{a,den},'mixed',ruler(den,a));
 t.choices=distinct(U.mixed(R(a,den)),[{value:U.mixed(R(a+1,den)),mistake:'Counted one mark too many'},{value:U.mixed(R(a-1,den)),mistake:'Counted one mark too few'},{value:U.mixed(R(a,den/2)),mistake:'Read the marks as the next larger unit'},{value:U.mixed(R(a+2,den)),mistake:'Counted two marks too many'},{value:U.mixed(R(a+den,den)),mistake:'Started counting at 1 inch instead of 0'}].map(x=>({value:x.value+' in.',mistake:x.mistake})));break;}
// Lesson 9
case 'add-unit-fraction':{
 const a=pick([3,5,7,11]),b=int(1,a-2);
 t=n(`Simplify: ${b}/${a} + 1/${a}`,R(b+1,a),`Same denominators: add the numerators. ${b} + 1 = ${b+1}, so ${b+1}/${a}.`,{a,b},'fraction');t.math=math(`<mrow>${mfrac(b,a)}${mo('+')}${mfrac(1,a)}</mrow>`);
 t.choices=distinct(fracText(b+1,a),[{value:fracText(b+1,2*a),mistake:'Added the denominators too'},{value:fracText(b,a*a),mistake:'Multiplied instead of added'},{value:fracText(a,b+1),mistake:'Inverted the answer'}]);break;}
case 'multiply-fractions':{
 const a=pick([3,5,7,9]);let b;do{b=pick([3,5,7,9,11]);}while(b===a);let c1,d1;do{c1=int(2,a-1);}while(gcd(a,c1)!==1||gcd(b,c1)!==1);do{d1=int(2,b-1);}while(gcd(a,d1)!==1||gcd(b,d1)!==1);
 t=n(`Simplify: ${c1}/${a} × ${d1}/${b}`,R(c1*d1,a*b),`Multiply numerators and denominators: ${c1*d1}/${a*b}.`,{a,b,c:c1,d:d1},'fraction');t.math=math(`<mrow>${mfrac(c1,a)}${mo('×')}${mfrac(d1,b)}</mrow>`);
 t.choices=distinct(fracText(c1*d1,a*b),[{value:fracText(c1*d1,a+b),mistake:'Added the denominators instead of multiplying'},{value:fracText(c1+d1,a+b),mistake:'Added numerators and denominators'},{value:fracText(c1+d1,a*b),mistake:'Added the numerators instead of multiplying'},{value:f(R(c1*b,a*d1)),mistake:'Divided instead of multiplied'},{value:f(R(c1*b+d1*a,a*b)),mistake:'Added the fractions instead of multiplying'}]);break;}
case 'subtract-like-fractions':{
 const cc=pick([7,11,13,17,19]);let a,b;do{b=int(1,cc-2);a=int(b+1,cc-1);}while(a+b===cc||a-b+1===cc);
 t=n(`Simplify: ${a}/${cc} − ${b}/${cc}`,R(a-b,cc),`Same denominators: ${a} − ${b} = ${a-b}, so ${a-b}/${cc}.`,{a,b,c:cc},'fraction');t.math=math(`<mrow>${mfrac(a,cc)}${mo('−')}${mfrac(b,cc)}</mrow>`);
 t.choices=distinct(fracText(a-b,cc),[{value:mixedText(a+b,cc),mistake:'Added instead of subtracted'},{value:String(a-b),mistake:'Dropped the denominator'},{value:mixedText(a-b+1,cc),mistake:'Subtraction slip by one'}]);break;}
case 'reciprocal':{let a,b;
 if(c.variant==='prime-den'){a=int(2,10);b=pick([11,13,17,19,23,29]);}else if(c.variant==='how-many'){[a,b]=pick([[2,3],[3,4],[2,5],[3,5],[4,5],[5,6],[3,8],[5,8],[7,8],[2,9],[4,9],[5,9],[7,9],[8,9]]);}else{[a,b]=pick([[3,4],[3,5],[3,2],[4,9],[4,3],[4,5],[5,7],[5,9],[5,3],[6,5],[6,7],[6,11],[7,3],[7,9],[7,11],[8,3],[8,5],[8,9],[9,4],[9,10],[9,2]]);}
 const prompt=c.variant==='how-many'?`How many ${a}/${b}s are in 1?`:`What is the reciprocal of ${a}/${b}?`;
 t=n(prompt,R(b,a),`${a}/${b} × ${b}/${a} = 1, so the answer is ${f(R(b,a))}.`,{a,b},'fraction');t.eitherForm=true;
 t.choices=distinct(f(R(b,a)),[{value:`−${a}/${b}`,mistake:'Confused the reciprocal with the opposite'},{value:`−${f(R(b,a))}`,mistake:'Inverted and changed the sign'},{value:fracText(Math.abs(b-a)/gcd(Math.abs(b-a),Math.max(a,b)),Math.max(a,b)/gcd(Math.abs(b-a),Math.max(a,b))),mistake:'Found the difference from 1 instead'}]);break;}
// Lesson 10
case 'add-to-mixed':{// three or two-with-wholes like-denominator sums written as a mixed number
 if(c.variant==='mixed-numbers'){const rows=[[3,2,2],[5,2,4],[5,3,3],[5,3,4],[5,4,2],[5,4,3],[5,4,4],[7,2,6],[7,3,5],[7,3,6],[7,4,4],[7,4,5],[7,4,6],[7,5,3],[7,5,4],[7,5,5],[7,5,6],[7,6,2],[7,6,3],[7,6,4],[7,6,5],[7,6,6],[9,2,8],[9,4,7],[9,5,5],[9,5,8],[9,7,4],[9,7,7],[9,8,2],[9,8,5],[9,8,8]];
  const [a,b,cc]=pick(rows),w1=int(2,6),w2=int(2,9),val=R(b+cc+(w1+w2)*a,a);
  t=n(`Simplify. Express the answer as a mixed number: ${w1} ${b}/${a} + ${w2} ${cc}/${a}`,val,`Whole numbers: ${w1+w2}; fractions: ${b+cc}/${a} = ${U.mixed(R(b+cc,a))}; total ${U.mixed(val)}.`,{a,b,c:cc,w1,w2},'mixed');t.math=math(`<mrow>${mixedML(w1,b,a)}${mo('+')}${mixedML(w2,cc,a)}</mrow>`);
  t.choices=distinct(U.mixed(val),[{value:`${w1+w2} ${b+cc}/${a}`,mistake:'Left an improper fraction part'},{value:U.mixed(R(b+cc+(w1+w2)*a,2*a)),mistake:'Added the denominators'},{value:`${w1+w2} ${(b+cc)%a}/${a}`,mistake:'Did not carry the whole from the fractions'}]);}
 else{const [a,b]=pick([[3,1],[3,2],[4,1],[4,3],[5,1],[5,2],[5,3],[5,4],[6,1],[6,5],[8,1],[8,3],[8,5],[8,7],[9,1],[9,2],[9,4],[9,5],[9,7],[9,8]]);let c1,d1,s;do{do{c1=int(1,a-1);}while(gcd(a,c1)>1);do{d1=int(1,a-1);}while(gcd(a,d1)>1);s=b+c1+d1;}while(s<=a||s%a===0);
  t=n(`Simplify. Express the answer as a mixed number: ${b}/${a} + ${c1}/${a} + ${d1}/${a}`,R(s,a),`${b} + ${c1} + ${d1} = ${s}, so ${s}/${a} = ${U.mixed(R(s,a))}.`,{a,b,c:c1,d:d1},'mixed');t.math=math(`<mrow>${mfrac(b,a)}${mo('+')}${mfrac(c1,a)}${mo('+')}${mfrac(d1,a)}</mrow>`);
  t.choices=distinct(U.mixed(R(s,a)),[{value:`${s}/${a}`,mistake:'Did not write the answer as a mixed number'},{value:fracText(s,3*a),mistake:'Added the denominators'},{value:U.mixed(R(s+1,a)),mistake:'Addition slip in the numerators'},{value:U.mixed(R(s-1,a)),mistake:'Addition slip in the numerators'}]);}
 break;}
case 'improper-to-mixed':{const [a,b]=pick([[6,7],[6,11],[3,4],[3,5],[12,13],[12,17],[12,19],[12,23]]);
 t=n(`The improper fraction ${b}/${a} equals what mixed number?`,R(b,a),`${b} ÷ ${a} = 1 R ${b-a}, so ${U.mixed(R(b,a))}.`,{a,b},'mixed');break;}
case 'mixed-to-improper':{const [lo,hi,bl,bh]=c.variant==='wide'?[2,10,2,9]:[2,9,2,10];const a=int(lo,hi);let b;do{b=int(bl,bh);}while(c.variant!=='wide'&&a===b);let cc;do{cc=int(1,b-1);}while(gcd(b,cc)!==1);
 t=n(`Write ${a} ${cc}/${b} as an improper fraction.`,R(a*b+cc,b),`${a} × ${b} + ${cc} = ${a*b+cc}, so ${a*b+cc}/${b}.`,{a,b,c:cc},'fraction');t.math=math(mixedML(a,cc,b));t.requireImproper=true;
 t.choices=distinct(fracText(a*b+cc,b),[{value:fracText(a*b,b),mistake:'Forgot to add the numerator'},{value:fracText(a*b-cc,b),mistake:'Subtracted the numerator'},{value:fracText(10*a+cc,b),mistake:'Wrote the whole number and numerator side by side'},{value:fracText(a+cc,b),mistake:'Added the whole number to the numerator'},{value:fracText(a*(b+cc),b),mistake:'Multiplied the whole number by the denominator plus the numerator'}]);break;}
case 'circles-mixed':{// draw (teacher) or identify (free response) shaded circles for k/den with den 4, 8 or 3
 const den=pick([4,8,3]),extra=den===3?int(1,2):2*int(0,(den===4?1:3))+1,num=den+extra,mixed=`1 ${U.mixed(R(extra,den))}`;
 if(c.variant==='draw')t=teacher(`Draw shaded circles to show that ${mixed} = ${f(R(num,den))}.`,`Two circles, each divided into ${den} equal parts: one fully shaded and ${extra} of ${den} parts of the other shaded.`,['Each circle is divided into equal parts matching the denominator.','One whole circle and the correct number of parts of the second circle are shaded.','The drawing shows the same amount as both numbers.'],{den,extra},'',shadedCircles(den,num,2));
 else{t={prompt:'Which mixed number and improper fraction do the shaded circles show? Write them as an equation, for example 1 1/2 = 3/2.',answer:{kind:'equation-pair',left:[1,extra,den],right:[num,den],value:`${mixed} = ${num}/${den}`},solution:`One whole circle and ${extra}/${den} more: ${mixed} = ${num}/${den}.`,parameters:{den,extra},svg:shadedCircles(den,num,2)};
  t.choices=[{value:`${mixed} = ${den}/${num}`,mistake:'Inverted the improper fraction'},{value:`${mixed} = ${extra}/${num}`,mistake:'Compared shaded parts of one circle with the total shaded'},{value:`${mixed} = ${extra}/${den}`,mistake:'Ignored the whole circle'}];}
 break;}
default:throw Error('Unknown port recipe '+c.recipe);}
return t;}

const SMALL=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function words(x){if(x<20)return SMALL[x];if(x<100)return TENS[Math.floor(x/10)]+(x%10?'-'+SMALL[x%10]:'');for(const [v,nm] of [[1e9,'billion'],[1e6,'million'],[1e3,'thousand'],[100,'hundred']])if(x>=v)return words(Math.floor(x/v))+' '+nm+(x%v?' '+words(x%v):'');}

function generate(c,seed,index,int,version){const h={int,index,pick:a=>a[int(0,a.length-1)]},t=build(c,h);
 return{version,sourceId:c.sourceId,family:c.family,seed:String(seed),index,provenance:{relationship:'original source-informed port',sourceRecord:c.sourceRecord,exactLegacyReproduction:false},prompt:t.prompt,answer:t.answer,solution:t.solution,givens:{recipe:c.recipe,parameters:t.parameters||{},...(t.math?{math:t.math}:{}),...(t.svg?{svg:t.svg}:{})},...(t.teacherSvg?{teacherSvg:t.teacherSvg}:{}),...(t.choices?{choices:t.choices}:{}),...(t.requireImproper?{requireImproper:true}:{}),...(t.eitherForm?{eitherForm:true}:{})};}

// ---------- answers ----------
const clean=s=>String(s??'').trim().toLowerCase().replace(/[−–]/g,'-').replace(/[×x*·]/g,'×').replace(/\s+/g,'').replace(/,/g,'');
function answerText(q){const a=q.answer;if(a.display)return a.display;switch(a.kind){case'property':case'expanded':case'lists':case'equation-pair':return a.value;default:return U.answerText(q);}}
function nums(s){return s.split(',').map(x=>x.trim()).filter(Boolean);}
function check(q,response){const a=q.answer,s=String(response??'');if(s.length>600)return{answerCorrect:false,fullOutcomeVerified:false};
 if(a.kind==='property'){const r=clean(s).replace(/×/g,a.op==='+'?'?':'×'),op=a.op==='+'?'\\+':'×',num='(\\d)';let ok=false;const sides=r.split('=');
  if(sides.length===2){if(a.property==='commutative'){const m=sides.map(x=>x.match(new RegExp(`^${num}${op}${num}$`)));ok=!!(m[0]&&m[1])&&m[0][1]===m[1][2]&&m[0][2]===m[1][1]&&m[0][1]!==m[0][2]&&[m[0][1],m[0][2]].sort().join()===a.numbers.map(String).sort().join();}
   else{const L=new RegExp(`^\\(${num}${op}${num}\\)${op}${num}$`),Rr=new RegExp(`^${num}${op}\\(${num}${op}${num}\\)$`);let x=sides[0].match(L),y=sides[1].match(Rr);if(!x||!y){x=sides[1].match(L);y=sides[0].match(Rr);}ok=!!(x&&y)&&x.slice(1).join()===y.slice(1).join()&&[...x.slice(1)].sort().join()===a.numbers.map(String).sort().join();}}
  return{answerCorrect:ok,fullOutcomeVerified:false};}
 if(a.kind==='expanded'){const r=clean(s).replace(/[()]/g,'');const want=a.terms.map(([d,p])=>`${d}×${p}`).join('+');return{answerCorrect:r===want,fullOutcomeVerified:false};}
 if(a.kind==='lists'){const parts=s.split(';');if(parts.length!==4)return{answerCorrect:false,fullOutcomeVerified:false};const ok=parts.every((p,i)=>{const got=nums(p);if(got.some(x=>!/^\d+$/.test(x)))return false;const g=got.map(Number).sort((x,y)=>x-y),w=[...a.lists[i]].sort((x,y)=>x-y);return g.length===w.length&&g.every((x,j)=>x===w[j]);});return{answerCorrect:ok,fullOutcomeVerified:false};}
 if(a.kind==='equation-pair'){const m=clean(s).match(/^(\d+)(\d+)\/(\d+)=(\d+)\/(\d+)$/)||String(s).trim().match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)\s*=\s*(\d+)\s*\/\s*(\d+)$/);if(!m)return{answerCorrect:false,fullOutcomeVerified:false};const [w,x,y,p,qq]=m.slice(1).map(Number),[W,X,Y]=a.left,[P,Q]=a.right;return{answerCorrect:w===W&&x*Y===X*y&&gcd(x,y)===1&&p*Q===P*qq&&gcd(p,qq)===1,fullOutcomeVerified:false};}
 if(q.eitherForm){const r=U.check(q,s.replace(/\$/g,''));if(r.answerCorrect)return r;return U.check({...q,answer:{...a,kind:'mixed'}},s);}
 if(q.requireImproper&&/\s/.test(s.trim()))return{answerCorrect:false,fullOutcomeVerified:false};
 return U.check(q,a.kind==='numbers'?s.replace(/(\d),(?=\d{3}\b)/g,'$1').replace(/\$/g,'').replace(/\s*(in\.?|inches|%)\s*$/i,''):a.kind==='decimal'||a.kind==='mixed'||a.kind==='fraction'?s.replace(/\$/g,'').replace(/\s*(in\.?|inches)\s*$/i,''):s);}
function render(q){const g=q.givens;return`<div class="engine-question"><p>${esc(q.prompt)}</p>${g.math?'<div>'+g.math+'</div>':''}${g.svg||''}</div>`;}
const api={catalog,generate,answerText,check,render,words};if(common)module.exports=api;root.MathPort87=api;
})(typeof globalThis!=='undefined'?globalThis:this);
