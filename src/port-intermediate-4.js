/* Intermediate 4 port tasks (coverage programme, parallel courses). Original Engine code informed by the source
   records; no source script is executed or reproduced. Owned by the Intermediate 4 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).

   Rules for this module:
   - Every recipe name starts with 'i4-'. src/port87.js sends those recipes here, family structured-port87.
   - Helpers come from src/port-shared.js (S below). Do not edit port-shared.js; ask the owner for a shared change.
     A helper only this course needs is defined in this file.
   - build(c,h) returns the same task object as the recipes in port87.js: {prompt, answer, solution, parameters,
     math?, svg?, teacherSvg?, choices?, requireImproper?, eitherForm?}. h.int(a,b), h.pick(list), h.index and
     h.check (the full port checker, for S.wrongOnlyBy(h.check,t,list)) are provided.
   - check(q,response) and answerText(q) handle answer kinds that exist only in this course. Return undefined for
     anything else, and the shared port checker handles it. render(q) likewise, if a course ever needs it. */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const S=common?require('./port-shared'):root.MathPortShared;
const catalog=common?require('./port-intermediate-4-map'):root.MathPortIntermediate4Map;

// ---------- course helpers ----------
const NAMES=['Ana','Ben','Carla','Dev','Eli','Fay','Gus','Hana','Ivan','Jade','Kofi','Lena','Milo','Nia','Omar','Pia','Ravi','Sofia','Tomas','Uma','Wes','Yara','Zane'];
const LETTERS='abcdmnpqrstwxyz';
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const W=x=>S.words(x);
const sum=a=>a.reduce((x,y)=>x+y,0);
const ORD=['zeroth','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth','thirteenth','fourteenth','fifteenth'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=[31,28,31,30,31,30,31,31,30,31,30,31];
const PLACE=['ones','tens','hundreds','thousands','ten-thousands','hundred-thousands'];
function names(h,k){const out=[];while(out.length<k){const x=h.pick(NAMES);if(!out.includes(x))out.push(x);}return out;}
// Choices: the source's distractors (each with its named mistake) that the checker rejects, topped up from the
// fallback list when a source distractor coincides with the key or another choice. Non-positive numbers are dropped.
// Answer kinds of this course are checked here, because the task has no givens yet while its choices are built.
// Zero is kept only when zeroOk (digits); negative numbers are always dropped.
function mc(h,t,list,fallback=[],zeroOk=false){const chk=(q,v)=>{const r=check(q,v);return r!==undefined?r:h.check(q,v);},ok=x=>!(typeof x.value==='number'&&!(zeroOk?x.value>=0:x.value>0));let ch=S.wrongOnlyBy(chk,t,list.filter(ok));
 for(const x of fallback.filter(ok)){if(ch.length>=3)break;const v=String(x.value);if(ch.some(c=>String(c.value)===v)||chk(t,v).answerCorrect)continue;ch.push(x);}
 if(ch.length<2)throw Error('Intermediate 4: too few distractors for '+t.prompt);t.choices=ch;return t;}
const near=(z,step=1)=>[{value:z+step,mistake:'Counting slip: one step too many'},{value:z-step,mistake:'Counting slip: one step too few'},{value:z+2*step,mistake:'Counting slip: two steps too many'}];
function num(prompt,value,solution,p,svg,display){const t=S.n(prompt,value,solution,p,'numbers',svg||'');if(display)t.answer.display=display;return t;}
const sentence=(adds,tot)=>adds.join(' + ')+' = '+tot;
// The sum written column by column, keeping only the ones digit of each column sum (no carrying).
const noCarry=(a,b)=>{let r=0,p=1;while(a||b){r+=p*((a%10+b%10)%10);a=Math.floor(a/10);b=Math.floor(b/10);p*=10;}return r;};

// ---------- drawings (original SVG) ----------
const {svg,ln,tx,INK}=S;
function ball(cx,cy,r){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${cx-r*0.8},${cy+r*0.45} Q${cx},${cy-r*0.2} ${cx+r*0.6},${cy-r*0.8}" fill="none" stroke="${INK}" stroke-width="1.4"/><path d="M${cx-r*0.6},${cy+r*0.8} Q${cx+r*0.2},${cy+r*0.2} ${cx+r*0.8},${cy-r*0.45}" fill="none" stroke="${INK}" stroke-width="1.4"/>`;}
// Groups of balls with plus signs between the groups.
function ballGroups(groups){const r=18;let x=10,b='';groups.forEach((k,i)=>{for(let j=0;j<k;j++){b+=ball(x+r,40,r);x+=2*r+4;}if(i<groups.length-1){b+=tx(x+12,47,'+',{size:26});x+=32;}});
 return svg(b,'Groups of balls: '+groups.join(' plus '),x+6,80);}
function pipFace(x,y,s,k){const P={1:[[.5,.5]],2:[[.25,.25],[.75,.75]],3:[[.25,.25],[.5,.5],[.75,.75]],4:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]],5:[[.25,.25],[.75,.25],[.5,.5],[.25,.75],[.75,.75]],6:[[.25,.22],[.75,.22],[.25,.5],[.75,.5],[.25,.78],[.75,.78]]};
 return `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="none" stroke="${INK}" stroke-width="2"/>`+P[k].map(([u,v])=>`<circle cx="${(x+u*s).toFixed(1)}" cy="${(y+v*s).toFixed(1)}" r="${(s*0.08).toFixed(1)}" fill="${INK}"/>`).join('');}
function diceFigure(faces){const s=60;return svg(faces.map((k,i)=>pipFace(10+i*(s+24),10,s,k)).join(''),'Number cubes showing '+faces.join(', ')+' dots',10+faces.length*(s+24),80);}
// Two boxes of dots (rows of two or three).
function dotBoxes(counts){let b='';const bw=110;counts.forEach((k,i)=>{const x0=10+i*(bw+20);b+=`<rect x="${x0}" y="10" width="${bw}" height="100" fill="none" stroke="${INK}" stroke-width="2"/>`;const cols=k>6?3:2,rows=Math.ceil(k/cols);for(let j=0;j<k;j++){const c=j%cols,r=Math.floor(j/cols);b+=`<circle cx="${(x0+bw*(c+1)/(cols+1)).toFixed(1)}" cy="${(10+100*(r+1)/(rows+1)).toFixed(1)}" r="6" fill="${INK}"/>`;}});
 return svg(b,'Two boxes of dots: '+counts.join(' and '),20+counts.length*(bw+20),120);}
function rhombusGroups(groups){let x=10,b='';groups.forEach((k,i)=>{const x0=x;for(let j=0;j<k;j++){b+=`<path d="M${x+14},10 L${x+28},30 L${x+14},50 L${x},30 Z" fill="none" stroke="${INK}" stroke-width="1.6"/>`;x+=34;}b+=tx((x0+x-6)/2,74,String(k),{size:16});if(i<groups.length-1){b+=tx(x+10,37,'+',{size:24});x+=30;}});
 return svg(b,'Groups of shapes: '+groups.join(' plus '),x+6,84);}
function coinRow(k,label){let b='';for(let i=0;i<k;i++){const cx=34+i*62;b+=`<circle cx="${cx}" cy="34" r="27" fill="none" stroke="${INK}" stroke-width="1.8"/><circle cx="${cx}" cy="34" r="23" fill="none" stroke="${INK}" stroke-width="0.8"/>`+tx(cx,39,label,{size:14});}return svg(b,k+' coins, each marked '+label,10+k*62,72);}
// Bills drawn as labelled rectangles, one column per kind of bill, every bill fully visible so it can be counted.
function billColumns(piles,x0=10){let b='',x=x0,top=0;for(const [val,k] of piles){if(!k)continue;for(let j=0;j<k;j++){const y=10+j*34;b+=`<rect x="${x}" y="${y}" width="78" height="30" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.4"/><rect x="${x+3}" y="${y+3}" width="72" height="24" rx="2" fill="none" stroke="${INK}" stroke-width="0.6"/>`+tx(x+39,y+20,'$'+val,{size:14});}top=Math.max(top,10+k*34);x+=96;}return {b,x,h:top+8};}
function billPiles(piles,label){const r=billColumns(piles);return svg(r.b,label,r.x,r.h);}
// Two labelled sets of $10 and $1 bills, I and II.
function comparePiles(I,II){let b='',x=10,h=0;for(const [lab,p] of [['I',I],['II',II]]){b+=tx(x+10,30,lab,{size:18});const r=billColumns([[10,p[0]],[1,p[1]]],x+30);b+=r.b;x=r.x+30;h=Math.max(h,r.h);if(lab==='I')b+=ln(x-18,6,x-18,h,{w:1,dash:'4 4'});}
 return svg(b,`I: ${I[0]} $10 bills and ${I[1]} $1 bills. II: ${II[0]} $10 bills and ${II[1]} $1 bills`,x,h);}
function xGrid(rows,cols){let b='';for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=14+c*40,y=14+r*40;b+=ln(x,y,x+26,y+26,{w:3})+ln(x+26,y,x,y+26,{w:3});}return svg(b,`X's in ${rows} rows of ${cols}`,cols*40+14,rows*40+14);}
function circledRow(list,circled){let b='';list.forEach((v,i)=>{const x=24+i*44;b+=tx(x,38,String(v),{size:18});if(circled.includes(v))b+=`<circle cx="${x}" cy="32" r="16" fill="none" stroke="${INK}" stroke-width="1.6"/>`;if(i<list.length-1)b+=tx(x+(circled.includes(v)?19:11),40,',',{size:18});});b+=tx(24+list.length*44-6,38,'…',{size:18});
 return svg(b,'Counting numbers '+list.join(', ')+' with '+circled.join(', ')+' circled',list.length*44+40,56);}
function column(rows,result,label){return S.stackFigure(rows.map(String),'+',result===undefined?undefined:String(result),label);}

// ---------- recipes ----------
const R={};
// Batch I4-1
R['i4-add-story']=(v,{int,pick},h)=>{
 if(v==='two-small'){let a,b;do{a=int(2,8);b=int(2,8);}while(a===b);const [A,B]=names(h,2),z=a+b;
  const prompt=pick([`${A} was at the petting zoo. ${A} saw ${a} rabbits in one pen and ${b} more in another pen. How many rabbits did ${A} see in all?`,`${A} caught ${a} grasshoppers. ${B} caught ${b} grasshoppers. How many grasshoppers did they catch in all?`,`${A} solved ${a} problems before lunch and ${b} problems after lunch. Altogether how many problems did ${A} solve?`]);
  return mc(h,num(prompt,z,`${a} + ${b} = ${z}.`,{a,b}),[{value:Math.abs(a-b),mistake:'Subtracted the two numbers instead of adding'},{value:z+1,mistake:'Counted on one too many'},{value:z-1,mistake:'Counted on one too few'}]);}
 if(v==='three-2digit'||v==='three-2digit-over'){const over=v.endsWith('over');let a,b,c,z;
  do{a=int(11,49);b=int(11,49);c=over?int(50,90):int(11,49);z=a+b+c;}while(new Set([a,b,c]).size<3||(over?z<101||z>199:z>99));
  const [thing,p1,p2,p3,q]=pick([['books','were on the top bookshelf','were on the second shelf','were on the third shelf','Altogether how many books were on those three shelves?'],['students','sat in the first row','sat in the second row','sat in the third row','Altogether how many students sat in the first three rows?'],['students','were in room 5','were in room 7','were in room 9','How many students were in all three rooms?']]);
  const prompt=`${cap(W(a))} ${thing} ${p1}. ${cap(W(b))} ${thing} ${p2}. ${cap(W(c))} ${thing} ${p3}. ${q}`;
  const carry=a%10+b%10+c%10>=10;
  return mc(h,num(prompt,z,`${a} + ${b} + ${c} = ${z}.`,{a,b,c}),[carry?{value:z-10,mistake:'Forgot to carry from the ones to the tens'}:{value:z+10,mistake:'Carried a ten when the ones did not reach ten'},over?{value:z-100,mistake:'Left out the hundred made by the tens'}:{value:a+b,mistake:'Left out the third number'},{value:a+c,mistake:'Left out one of the three numbers'}],near(z));}
 if(v==='three-hundreds'){let d;do{d=[int(1,7),int(1,7),int(1,7)];}while(new Set(d).size<3||sum(d)>9);const [x,y,w]=d.map(k=>100*k),z=x+y+w,thing=pick(['boats sailed','trucks crossed the bridge','people visited the museum']),days=pick([['Tuesday','Wednesday','Thursday'],['Monday','Tuesday','Wednesday'],['Friday','Saturday','Sunday']]);
  const prompt=`${cap(W(x))} ${thing} on ${days[0]}. ${cap(W(y))} ${thing} on ${days[1]}. ${cap(W(w))} ${thing} on ${days[2]}. How many in all during the three days?`;
  return mc(h,num(prompt,z,`${x} + ${y} + ${w} = ${z}.`,{a:x,b:y,c:w}),[{value:sum(d),mistake:'Added the hundreds digits and dropped the hundreds'},{value:z-100,mistake:'Slip adding the hundreds'},{value:x+y,mistake:'Left out the third day'}],[{value:z+100,mistake:'Slip adding the hundreds'}]);}
 // two-3digit: two three-digit numbers in words, regrouping in the ones and the tens, sum over 1000.
 let a,b;do{a=int(501,899);b=int(501,899);}while(a%10+b%10<10||Math.floor(a/10)%10+Math.floor(b/10)%10+1<10);const z=a+b,[A]=names(h,1);
 const prompt=pick([`${cap(W(a))} students sat on one side of the gym, and another ${W(b)} students sat on the other side. How many students were there altogether?`,`${cap(W(a))} tickets were sold on Friday, and another ${W(b)} tickets were sold on Saturday. How many tickets were sold altogether?`]);
 return mc(h,num(prompt,z,`${a} + ${b} = ${z}.`,{a,b}),[{value:noCarry(a,b),mistake:'Wrote each column sum without carrying'},{value:z-10,mistake:'Forgot to carry from the ones to the tens'},{value:z-100,mistake:'Forgot to carry from the tens to the hundreds'}],near(z,10));};

R['i4-missing-addend']=(v,{int,pick},h)=>{
 if(v==='two-digit'){let a,s,w;do{a=int(11,39);s=int(50,99);w=s-a;}while(w<11);const L=pick([...LETTERS]);
  return mc(h,num(`${a} + ${L} = ${s}. Find ${L}.`,w,`${L} = ${s} − ${a} = ${w}.`,{a,s,letter:L}),[{value:s+a,mistake:'Added the two numbers instead of subtracting'},{value:w+10,mistake:'Subtraction slip in the tens'},{value:w-1,mistake:'Subtraction slip in the ones'}]);}
 const [lo,hi]=v==='small'?[2,4]:v==='mid'?[5,6]:v==='large'?[7,9]:[1,9];let a,b;do{a=int(lo,hi);b=int(2,9);}while(a===b);const s=a+b,L=pick(['B','G','H','M','N','P']);
 const fig=v==='stacked'?column([L,a],s,`${L} plus ${a} equals ${s}, written in a column`):'';
 const t=num(v==='stacked'?'Find the missing addend.':`Find the missing addend: ${a} + ${L} = ${s}.`,b,`${s} − ${a} = ${b}, so ${L} = ${b}.`,{a,s,letter:L},fig);
 return mc(h,t,[{value:b>5?b-1:b+1,mistake:'Counted on one too many or one too few'},{value:a,mistake:'Gave the addend that is shown'},{value:a>5?a-1:a+1,mistake:'Gave a number next to the addend that is shown'}],[{value:s,mistake:'Gave the sum instead of the missing addend'},{value:s+a,mistake:'Added the two numbers shown'}]);};

R['i4-missing-row']=(v,{int,pick},h)=>{const L=pick([...LETTERS]);let known,x;
 const spec={three:[2,1,9,1,9],four:[3,1,9,1,9],five:[4,1,9,1,9],seven:[6,1,9,1,9],nine:[8,1,9,10,19]};
 if(spec[v]){const [k,lo,hi,xl,xh]=spec[v];do{known=Array.from({length:k},()=>int(lo,hi));x=int(xl,xh);}while(v==='four'&&new Set([...known,x]).size<4||v==='seven'&&new Set(known.slice(0,4)).size<4);}
 else if(v==='to-100'){do{known=Array.from({length:4},()=>int(11,39));x=100-sum(known);}while(x<10||x>40);}
 else{known=Array.from({length:4},()=>int(21,89));x=int(11,89);}
 const pos=v==='to-100'||v==='big'||v==='nine'?(v==='nine'?int(3,6):4):int(1,known.length),terms=[...known.slice(0,pos).map(String),L,...known.slice(pos).map(String)],tot=sum(known)+x;
 const eq=`${terms.join(' + ')} = ${tot}`,t=num(pick([`Find the missing addend: ${eq}.`,`If ${eq}, then what number is ${L}?`]),x,`The numbers shown add to ${sum(known)}, and ${tot} − ${sum(known)} = ${x}.`,{known,total:tot,letter:L});
 return mc(h,t,[{value:tot-x,mistake:'Added the numbers shown instead of finding the missing addend'},{value:x>5?x-1:x+1,mistake:'Slip finding the difference'},{value:tot-x+pick([-1,1]),mistake:'Added the numbers shown, with a slip'}],near(x));};

R['i4-column-missing']=(v,{int,pick},h)=>{const L=pick(['n','b','C','m','p']);let known,x;
 if(v==='three'){do{known=[int(2,9),int(2,9)];x=int(2,9);}while(new Set([...known,x]).size<3);}
 else if(v==='six'){do{known=[int(1,9),int(1,9),int(1,9),int(11,29),int(1,9)];x=int(10,19);}while(new Set(known).size<4);}
 else{do{known=[int(11,39),int(1,9),int(21,49),int(11,29),int(51,89)];x=int(21,59);}while(new Set(known).size<5);}
 const pos=int(0,known.length),rows=[...known.slice(0,pos),L,...known.slice(pos)],tot=sum(known)+x;
 const t=num(`Find the missing number ${L}.`,x,`The numbers shown add to ${sum(known)}, and ${tot} − ${sum(known)} = ${x}.`,{known,total:tot,letter:L},column(rows,tot,`A column addition: ${rows.join(' plus ')} equals ${tot}`));
 return mc(h,t,v==='three'?[{value:x-1,mistake:'Counted up one too few'},{value:x+1,mistake:'Counted up one too many'},{value:x<5?x+2:x-2,mistake:'Counted up by the wrong amount'}]:[{value:tot-x,mistake:'Added the numbers shown instead of finding the missing addend'},{value:x+10,mistake:'Subtraction slip in the tens'},{value:x-1,mistake:'Subtraction slip in the ones'}],near(x));};

R['i4-column-add']=(v,{int},h)=>{const d=[int(1,9),int(1,9),int(1,9),int(1,9)],z=sum(d);
 return mc(h,num('Add.',z,`${d.join(' + ')} = ${z}.`,{addends:d},column(d,undefined,`${d.join(' plus ')}, written in a column`)),[{value:z-10,mistake:'Dropped the ten when adding the column'},{value:sum(d.slice(0,3)),mistake:'Left out the last addend'},{value:z+1,mistake:'Counting slip adding the column'}],near(z));};

R['i4-add-row']=(v,{int},h)=>{const d=Array.from({length:v==='six'?6:7},()=>int(1,9)),z=sum(d);
 return mc(h,num(`Add: ${d.join(' + ')}.`,z,`Add in any order: ${d.join(' + ')} = ${z}.`,{addends:d}),[{value:z-d[d.length-1],mistake:'Left out the last addend'},{value:z+1,mistake:'Counting slip: one too many'},{value:z-1,mistake:'Counting slip: one too few'}],[{value:z+10,mistake:'Added an extra ten'}]);};

R['i4-pic-sentence']=(v,{int,pick},h)=>{
 if(v==='story'){let g;do{g=[int(2,8),int(2,8),int(2,8)];}while(new Set(g).size<3);const [A,B,C]=names(h,3),thing=pick(['crayons','pens','stickers','marbles']),z=sum(g);
  const t={prompt:`${A} had ${g[0]} ${thing}. ${B} had ${g[1]} ${thing}. ${C} had ${g[2]} ${thing}. How many ${thing} did they have in all? Write a number sentence, for example 1 + 1 + 9 = 11.`,answer:{kind:'i4-sentence',addends:g,total:z,value:sentence(g,z)},solution:`${sentence(g,z)}.`,parameters:{groups:g}};
  return mc(h,t,[{value:sentence(g,z-1),mistake:'Wrote the right addends but added one too few'},{value:sentence(g,z+1),mistake:'Wrote the right addends but added one too many'},{value:sentence([g[0],g[2]],g[0]+g[2]),mistake:'Left out the middle number'}]);}
 if(v==='shapes'){const g=[int(1,5),int(1,5)],z=sum(g);return mc(h,num('Add the two groups of shapes.',z,`${g[0]} + ${g[1]} = ${z}.`,{groups:g},rhombusGroups(g)),[{value:Math.abs(g[0]-g[1])||z+2,mistake:'Subtracted instead of adding'},{value:z+1,mistake:'Counted one shape twice'},{value:z-1,mistake:'Missed one shape'}]);}
 let g,fig,ask;
 if(v==='balls'){g=[int(1,4),int(1,4),int(1,4)];fig=ballGroups(g);ask=pick(['Which number sentence represents the number of balls?','Write a number sentence to find the number of balls.']);}
 else if(v==='dice'){g=[int(1,6),int(1,6),int(1,6),int(1,6)];fig=diceFigure(g);ask='Write a number sentence for this picture.';}
 else{g=[int(4,9),int(4,9)];fig=dotBoxes(g);ask='Write a number sentence to find the number of dots.';}
 const z=sum(g),t={prompt:ask+' Use + and =, for example 2 + 5 = 7.',answer:{kind:'i4-sentence',addends:g,total:z,value:sentence(g,z)},solution:`Count each group: ${sentence(g,z)}.`,parameters:{groups:g},svg:fig};
 const k=int(0,g.length-1),off=g.map((x,i)=>i===k?x+1:x);
 return mc(h,t,[{value:sentence(g,z-2),mistake:'Wrote the right addends but added them wrongly'},{value:sentence(off,z+1),mistake:'Miscounted one group'},...(g.length>2?[{value:sentence(g.filter((x,i)=>i!==k),z-g[k]),mistake:'Left out one group'}]:[])],[{value:sentence(g,z+1),mistake:'Wrote the right addends but added one too many'}]);};

R['i4-six-ways']=(v,{int})=>{let a,b,c;do{a=int(1,9);b=int(1,9);c=int(1,9);}while(new Set([a,b,c]).size<3||a+b+c>=20);const z=a+b+c,orders=[[a,b,c],[a,c,b],[b,a,c],[b,c,a],[c,a,b],[c,b,a]];
 return {prompt:`Write six ways to add ${a}, ${b}, and ${c}. Write each one as a number sentence, for example 4 + 4 + 4 = 12, and separate them with semicolons.`,answer:{kind:'i4-six-ways',addends:[a,b,c],total:z,value:orders.map(o=>sentence(o,z)).join('; ')},solution:`Every order gives the same sum, ${z}: ${orders.map(o=>sentence(o,z)).join('; ')}.`,parameters:{a,b,c}};};

R['i4-expanded']=(v,{int},h)=>{const a=int(1,9),b=int(1,9),z=100*a+10*b;
 return mc(h,num(`What number does (${a} × 100) + (${b} × 10) equal?`,z,`${a} × 100 = ${100*a} and ${b} × 10 = ${10*b}; ${100*a} + ${10*b} = ${z}.`,{a,b},'',String(z)),[{value:S.comma(Number(`${100*a}${10*b}`)),mistake:'Wrote the two products side by side instead of adding them'},{value:S.comma(1000*a+10*b),mistake:'Put the hundreds digit in the thousands place'},{value:S.comma(10000*a+100*b),mistake:'Wrote an extra zero after each product'}]);};

R['i4-sequence']=(v,{int,pick},h)=>{
 const run=(s,d,k)=>Array.from({length:k},(_,i)=>s+i*d),seqT=(prompt,vals,sol,p)=>({prompt,answer:{kind:'sequence',values:vals,value:vals.join(', ')},solution:sol,parameters:p}),lst=a=>a.join(', ');
 if(v==='next3-down'||v==='next3-up'){const down=v==='next3-down',d=down?pick([2,3,4,7]):int(2,9),k=down?pick([3,4,5]):3;let s;
  if(down){s=d===7?7*int(k+3,12):int((k+3)*d+1,90);}else s=d*int(1,5)+pick([0,0,int(1,d-1)]);
  const step=down?-d:d,shown=run(s,step,k),next=run(s+k*step,step,3),wrongDir=run(s-step,-step,3);
  const t=seqT(`Write the next three numbers in this counting sequence: ${lst(shown)}, ____, ____, ____, …`,next,`The numbers ${down?'go down':'go up'} by ${d} each time: ${lst(next)}.`,{start:s,step,shown:k});
  return mc(h,t,[{value:lst(wrongDir),mistake:`Counted ${down?'up':'down'} from the first number instead of continuing the sequence`},{value:lst([next[0],next[1],next[2]+pick([-1,1])]),mistake:'Slip in the third number'},{value:lst(run(s+(k+1)*step,step,3)),mistake:'Skipped the first missing number'}]);}
 if(v==='blank'){const d=int(3,9),down=int(0,1)===1,step=down?-d:d,s=down?d*int(5,10):d*int(1,6),shown=run(s,step,4),b=int(1,2),z=shown[b];
  const disp=shown.map((x,i)=>i===b?'____':x);
  const t=num(`Find the missing number in this counting sequence: ${lst(disp)}, …`,z,`The numbers ${down?'go down':'go up'} by ${d}, so the missing number is ${z}.`,{start:s,step,blank:b});
  return mc(h,t,[{value:shown[b-1]+(down?-1:1)*(d+1),mistake:'Counted by one more than the step'},{value:shown[b-1]+(down?-1:1)*(d-1),mistake:'Counted by one less than the step'},{value:z+2*step,mistake:'Wrote the number that comes after the blank'}],near(z,d));}
 // fill3: six terms, three blanks
 const d=int(3,9),down=int(0,1)===1,step=down?-d:d,s=down?d*int(6,11):d*int(1,6),all=run(s,step,6),blanks=pick([[2,3,5],[1,2,5]]),vals=blanks.map(i=>all[i]);
 const disp=all.map((x,i)=>blanks.includes(i)?'____':x);
 const t=seqT(`Find the missing numbers in this counting sequence: ${lst(disp)}, … Write them in order.`,vals,`The numbers ${down?'go down':'go up'} by ${d}: ${lst(all)}.`,{start:s,step,blanks});
 return mc(h,t,[{value:lst(vals.map(x=>x+(down?-1:1))),mistake:'Counted by one more than the step'},{value:lst([vals[0],vals[1],vals[2]+step]),mistake:'Skipped a number before the last blank'},{value:lst(vals.map(x=>x-step)),mistake:'Wrote the number before each blank'}]);};

R['i4-count-by']=(v,{int,pick},h)=>{
 if(v==='nickels'){const k=int(2,9),z=5*k;return mc(h,num(`How many cents are in ${k} nickels?`,z,`Count by fives ${k} times: ${z} cents.`,{k},'',`${z} cents`),[{value:`${k} cents`,mistake:'Counted the coins instead of the cents'},{value:`${10*k} cents`,mistake:'Counted by tens instead of fives'},{value:`5${k} cents`,mistake:'Wrote the 5 and the number of nickels side by side'}]);}
 if(v==='dimes'){const k=int(2,7),z=10*k;return mc(h,num(`How many cents are in ${k} dimes? Count by tens.`,z,`${Array.from({length:k},(_,i)=>10*(i+1)).join(', ')}: ${z} cents.`,{k},coinRow(k,'10¢'),`${z} cents`),[{value:`${k} cents`,mistake:'Counted the coins instead of the cents'},{value:`${5*k} cents`,mistake:'Counted by fives instead of tens'},{value:`${z+10} cents`,mistake:'Counted one dime too many'}]);}
 if(v==='wheels'){const k=int(3,9),[thing,part]=pick([['bicycles','wheels'],['pairs of shoes','shoes'],['pairs of mittens','mittens']]),z=2*k;
  return mc(h,num(`${cap(W(k))} ${thing} have how many ${part}? Count by twos.`,z,`${Array.from({length:k},(_,i)=>2*(i+1)).join(', ')}: ${z} ${part}.`,{k}),[{value:k,mistake:'Counted the items instead of counting by twos'},{value:k+2,mistake:'Added 2 instead of counting by twos'},{value:z+2,mistake:'Counted one group too many'}]);}
 const cols=int(3,8),z=3*cols;return mc(h,num(`How many X’s are in this pattern? Count by threes.`,z,`There are ${cols} columns of 3: ${Array.from({length:cols},(_,i)=>3*(i+1)).join(', ')}.`,{rows:3,cols},xGrid(3,cols)),[{value:cols,mistake:'Counted the columns only'},{value:cols+3,mistake:'Added the rows and columns'},{value:z-3,mistake:'Counted one column too few'}],near(z,3));};

R['i4-digits']=(v,{int,pick},h)=>{
 if(v==='count'){const k=int(4,6);let N=int(1,9);for(let i=1;i<k;i++)N=10*N+int(0,9);const shown=N<10000?String(N):S.comma(N);
  return mc(h,num(pick([`How many digits does the number ${shown} have?`,`How many digits are in ${shown}?`]),k,`${shown} has ${k} digits.`,{n:N}),[{value:k-1,mistake:'Missed one digit'},{value:k+1,mistake:'Counted one digit too many'},{value:k>5?k-2:k+2,mistake:'Counted the comma or a group as a digit'}]);}
 let d;do{d=[int(1,9),int(0,9),int(0,9),int(0,9),int(0,9),int(0,9)];}while(new Set(d).size<5);const N=Number(d.join('')),shown=S.comma(N);
 if(v==='last')return mc(h,num(`Write the last digit in ${shown}.`,d[5],`The last digit is the ones digit, ${d[5]}.`,{n:N}),[{value:d[4],mistake:'Gave the tens digit'},{value:d[0],mistake:'Gave the first digit instead of the last'},{value:d[2],mistake:'Gave a digit from the middle'}],[{value:d[3],mistake:'Gave a digit from the middle'}]);
 return mc(h,num(`Write the first digit in ${shown}.`,d[0],`The first digit is the one on the left, ${d[0]}.`,{n:N}),[{value:d[5],mistake:'Gave the last digit instead of the first'},{value:d[1],mistake:'Gave the second digit'},{value:d[3],mistake:'Gave a digit from the middle'}],[{value:d[2],mistake:'Gave a digit from the middle'}]);};

R['i4-circled']=(v,{int},h)=>{const m=int(2,3),k=m===2?int(7,9):int(8,10),list=Array.from({length:k},(_,i)=>i+1),circ=list.filter(x=>x%m===0),z=(Math.floor(k/m)+1)*m;
 return mc(h,num('If the pattern is continued, what will be the next circled number?',z,`Every ${m===2?'second':'third'} number is circled, so the next circled number is ${z}.`,{every:m,shown:k},circledRow(list,circ)),[{value:k+1,mistake:'Gave the next counting number'},{value:z+m,mistake:'Skipped a circled number'},{value:z-1,mistake:'Counted one too few'}],near(z,m));};

R['i4-place']=(v,{int,pick},h)=>{const words=k=>PLACE[k];
 if(v==='which-4'||v==='which-3'){const n=v==='which-4'?4:3;let d;do{d=Array.from({length:n},(_,i)=>i===0?int(1,9):int(0,9));}while(new Set(d).size<n);const N=Number(d.join('')),k=int(0,n-1),dig=d[n-1-k];
  const t=S.text(v==='which-4'?`The digit ${dig} in ${N} is in which place?`:`The digit ${dig} is in what place in ${N}?`,words(k),`Counting from the right: ones, tens, hundreds${n>3?', thousands':''}. The ${dig} is in the ${words(k)} place.`,{n:N,digit:dig},'',[words(k)+' place','the '+words(k)+' place']);
  return mc(h,t,[{value:words(n-1-k)===words(k)?words((k+1)%n):words(n-1-k),mistake:'Counted the places from the left instead of from the right'},{value:words((k+1)%n),mistake:'Named the next place'},{value:words((k+n-1)%n),mistake:'Named the place before'}],PLACE.slice(0,n).map(w=>({value:w,mistake:'Named the wrong place'})));}
 if(v==='place-of'){const dig=int(1,9),perm=[[0,1,2],[1,2,0],[2,0,1],[0,2,1],[1,0,2],[2,1,0]][int(0,5)],nums=perm.map(k=>{let d;do{d=[int(1,9),int(0,9),int(0,9)];d[2-k]=dig;}while(d.filter(x=>x===dig).length!==1);return Number(d.join(''));});
  const ans=perm.map(words);
  return {prompt:`The digit ${dig} is in what place in each number? (a) ${nums[0]} (b) ${nums[1]} (c) ${nums[2]}. Separate the answers with semicolons.`,answer:{kind:'i4-places',places:ans,value:ans.join('; ')},solution:`(a) ${ans[0]} (b) ${ans[1]} (c) ${ans[2]}.`,parameters:{digit:dig,nums}};}
 if(v==='digit-in'){let d;do{d=[int(1,9),int(0,9),int(0,9)];}while(new Set(d).size<3);const N=Number(d.join('')),k=int(0,2);
  return mc(h,num(`Which digit is in the ${words(k)} place in ${N}?`,d[2-k],`${N} has ${d[0]} hundreds, ${d[1]} tens and ${d[2]} ones.`,{n:N,place:k}),[{value:d[k],mistake:'Counted the places from the left'},{value:d[(3-k)%3],mistake:'Gave the digit in a different place'},{value:d[(4-k)%3],mistake:'Gave the digit in a different place'}],[{value:(d[2-k]+1)%10,mistake:'Gave the next digit up instead of reading the number'}],true);}
 let a,b,c;do{a=int(1,9);b=int(0,9);c=int(1,9);}while(new Set([a,b,c]).size<3);const z=100*a+10*b+c;
 return mc(h,num(`Use three digits to write a number equal to ${a} hundreds, ${b} tens, and ${c} ones.`,z,`${a} hundreds, ${b} tens and ${c} ones make ${z}.`,{a,b,c}),[{value:100*c+10*b+a,mistake:'Wrote the digits in reverse order'},{value:a+b+c,mistake:'Added the digits'},{value:100*b+10*a+c,mistake:'Swapped the hundreds and tens'}]);};

R['i4-bills']=(v,{int,pick},h)=>{
 if(v==='three'||v==='two'){const H=v==='three'?int(1,4):0,T=int(1,5),O=int(1,6),z=100*H+10*T+O;
  return mc(h,num(pick(['How much money is shown?','How much money is shown by this diagram?']),z,`${H?H+' hundred-dollar bills, ':''}${T} ten-dollar bills and ${O} one-dollar bills: $${z}.`,{hundreds:H,tens:T,ones:O},billPiles([[100,H],[10,T],[1,O]],`${H?H+' $100 bills, ':''}${T} $10 bills and ${O} $1 bills`),'$'+z),
   [{value:'$'+(H+T+O),mistake:'Counted the bills instead of their values'},{value:'$'+(100*O+10*T+H),mistake:'Read the piles in the wrong order'},{value:'$'+(z+10),mistake:'Counted one ten-dollar bill too many'}]);}
 if(v==='draw'){const H=int(1,9),T=int(1,9),O=int(1,9),z=100*H+10*T+O;
  return S.teacher(`Draw a picture to show $${z} using $100 bills, $10 bills, and $1 bills.`,`${H} $100 bills, ${T} $10 bills and ${O} $1 bills.`,[`The picture shows ${H} hundred-dollar bills.`,`It shows ${T} ten-dollar bills and ${O} one-dollar bills, for $${z} in all.`],{hundreds:H,tens:T,ones:O},'',billPiles([[100,H],[10,T],[1,O]],`${H} $100 bills, ${T} $10 bills and ${O} $1 bills`));}
 // compare: the lesser amount uses more bills.
 let a,b;do{a=[int(1,4),int(0,3)];b=[int(0,2),int(4,9)];}while(!(10*a[0]+a[1]>10*b[0]+b[1]&&a[0]+a[1]<b[0]+b[1]));let I=a,II=b;if(int(0,1)){I=b;II=a;}const vi=10*I[0]+I[1],vii=10*II[0]+II[1];
 const S1='I shows a greater amount of money than II',S2='II shows a greater amount of money than I',S3='both show the same amount of money',ans=vi>vii?S1:S2;
 const t=S.text(`Which is the greater amount of money, I or II? Answer with one of the statements: "${S1}", "${S2}" or "${S3}".`,ans,`I shows $${vi} and II shows $${vii}.`,{I,II},comparePiles(I,II),[vi>vii?'I':'II',vi>vii?'I is greater':'II is greater']);
 return mc(h,t,[{value:ans===S1?S2:S1,mistake:'Compared the number of bills instead of their values'},{value:S3,mistake:'Thought the two amounts were equal'}]);};

R['i4-line']=(v,{int,pick},h)=>{const [A,B]=names(h,2);
 if(v==='between'){let p,q;do{p=int(2,8);q=int(p+3,13);}while(q-p>9);const z=q-p-1;
  return mc(h,num(pick([`${A} is ${ORD[p]} in line. ${B} is ${ORD[q]} in the same line. How many people are between them?`,`${A} is standing ${ORD[p]} in line. ${B} is ${ORD[q]} in the same line. How many people are between ${A} and ${B}?`]),z,`The people between them are in places ${p+1} through ${q-1}: ${q-1} − ${p} = ${z}.`,{p,q}),[{value:q-p,mistake:'Subtracted the places, which counts one of the two people'},{value:q-p+1,mistake:'Counted both people as well'},{value:z-1,mistake:'Counted one person too few'}]);}
 if(v==='front'){const k=int(3,9);return mc(h,num(`If ${A} is ${ORD[k]} in line, how many people are in front of ${A}?`,k-1,`Places 1 through ${k-1} are in front of ${A}: ${k-1} people.`,{k}),[{value:k,mistake:'Counted the person too'},{value:k+1,mistake:'Counted one too many and the person too'},{value:k-2,mistake:'Counted one person too few'}]);}
 const k=int(3,8);return mc(h,num(`There are ten people in the line. If ${A} is ${ORD[k]}, how many people are behind ${A}?`,10-k,`10 − ${k} = ${10-k} people are behind.`,{k}),[{value:9-k,mistake:'Counted one person too few'},{value:12-k,mistake:'Counted two people too many'},{value:11-k,mistake:'Counted the person too'}]);};

R['i4-dates']=(v,{int,pick},h)=>{const [A]=names(h,1);
 if(v==='month'){const m=int(1,12),d=int(13,27),y=int(85,99);const t=S.text(`${A} wrote a birthday as ${m}/${d}/${y}. In what month was ${A} born?`,MONTHS[m-1],`The first number, ${m}, names the month: ${MONTHS[m-1]}.`,{m,d,y});
  return mc(h,t,[{value:MONTHS[m%12],mistake:'Counted one month past the month number'},{value:MONTHS[(m+1)%12],mistake:'Counted two months past the month number'},{value:MONTHS[(m+10)%12],mistake:'Counted one month short of the month number'}]);}
 if(v==='month-year'){const m=int(1,12),d=int(13,28),y=int(80,99);
  return {prompt:`${A} wrote a birthday as ${m}/${d}/${y}. (a) In what month was ${A} born? (b) In what year was ${A} born? Separate the answers with a semicolon.`,answer:{kind:'i4-month-year',month:m,year:1900+y,value:`${MONTHS[m-1]}; ${1900+y}`},solution:`(a) ${MONTHS[m-1]} (b) ${1900+y}.`,parameters:{m,d,y}};}
 if(v==='days'){const m=pick([1,3,4,5,6,7,8,9,10,11,12]),z=DAYS[m-1];return mc(h,num(`How many days are there in ${MONTHS[m-1]}?`,z,`${MONTHS[m-1]} has ${z} days.`,{m}),[{value:z===31?30:31,mistake:'Mixed up the 30-day and 31-day months'},{value:28,mistake:'Gave the number of days in February'},{value:z===31?29:32,mistake:'Guessed instead of using the calendar'}]);}
 const k=pick([31,30]),z=DAYS.filter(x=>x===k).length;return mc(h,num(`How many months have ${k} days?`,z,`The months with ${k} days are ${MONTHS.filter((_,i)=>DAYS[i]===k).join(', ')}.`,{days:k}),[{value:k===31?4:7,mistake:'Counted the months with the other number of days'},{value:12,mistake:'Counted every month'},{value:k===31?6:5,mistake:'Missed or added one month'}]);};

R['i4-order-least']=(v,{int},h)=>{let a;do{const base=100*int(1,7)+int(15,59);a=[base,base+int(-10,10),base+int(-10,10),base+int(-10,10)];}while(new Set(a).size<4);const s=[...a].sort((x,y)=>x-y),onesLow=[...a].sort((x,y)=>x%10-y%10)[0];
 return mc(h,num(`If you put the numbers ${a.join(', ')} in order from smallest to largest, which number would be first?`,s[0],`In order: ${s.join(', ')}. The first is ${s[0]}.`,{nums:a}),[{value:s[3],mistake:'Chose the largest number instead of the smallest'},{value:s[1],mistake:'Chose the second number in order'},{value:onesLow,mistake:'Compared only the ones digits'}],[{value:s[2],mistake:'Chose the third number in order'}]);};

function build(c,h){const {int,pick,index}=h;const f=R[c.recipe];if(!f)throw Error('Unknown Intermediate 4 port recipe '+c.recipe);return f(c.variant,{int,pick,index},h);}

// ---------- answer kinds that exist only in this course ----------
const fail={answerCorrect:false,fullOutcomeVerified:false},okv=v=>({answerCorrect:!!v,fullOutcomeVerified:false});
// "a + b + c = s": the addends (in any order) and the sum must match.
function parseSentence(s){const r=String(s).replace(/[−–]/g,'-').replace(/\s+/g,'');let m=r.match(/^(\d+(?:\+\d+)+)=(\d+)$/);if(m)return{adds:m[1].split('+').map(Number),total:Number(m[2])};m=r.match(/^(\d+)=(\d+(?:\+\d+)+)$/);if(m)return{adds:m[2].split('+').map(Number),total:Number(m[1])};return null;}
const sameMultiset=(x,y)=>x.length===y.length&&[...x].sort((p,q)=>p-q).join()===[...y].sort((p,q)=>p-q).join();
function check(q,response){const a=q&&q.answer;if(!a)return undefined;const s=String(response??'');if(s.length>600)return fail;
 if(a.kind==='i4-sentence'){const p=parseSentence(s);return okv(!!p&&p.total===a.total&&sameMultiset(p.adds,a.addends));}
 if(a.kind==='i4-six-ways'){const parts=s.split(/;|\n/).map(x=>x.trim()).filter(Boolean);if(parts.length!==6)return fail;const seen=new Set();
  for(const x of parts){const p=parseSentence(x);if(!p||p.total!==a.total||p.adds.length!==3||!sameMultiset(p.adds,a.addends))return fail;seen.add(p.adds.join());}return okv(seen.size===6);}
 if(a.kind==='i4-places'){const got=(s.toLowerCase().replace(/ten-thousands|hundred-thousands/g,'x').match(/\b(ones|tens|hundreds|thousands)\b/g)||[]);if(/\d/.test(s.replace(/\([abc]\)/gi,'')))return fail;return okv(got.length===a.places.length&&got.every((w,i)=>w===a.places[i]));}
 if(a.kind==='i4-month-year'){const r=s.toLowerCase(),years=r.match(/\b\d{4}\b/g)||[],mons=MONTHS.filter(m=>r.includes(m.toLowerCase())||new RegExp('\\b'+m.slice(0,3).toLowerCase()+'\\b').test(r));const digits=r.replace(/\(\w\)/g,'').match(/\d+/g)||[];return okv(digits.length===1&&years.length===1&&Number(years[0])===a.year&&mons.length===1&&mons[0]===MONTHS[a.month-1]);}
 return undefined;}
function answerText(q){const a=q&&q.answer;if(a&&['i4-sentence','i4-six-ways','i4-places','i4-month-year'].includes(a.kind))return a.value;return undefined;}

const api=Object.freeze({key:'intermediate-4',course:'Intermediate 4',prefix:'i4-',batchPrefix:'I4',catalog,build,check,answerText});
if(common)module.exports=api;root.MathPortIntermediate4=api;
})(typeof globalThis!=='undefined'?globalThis:this);
