/* Shared helpers for the port tasks (coverage programme): formatting, MathML, original SVG drawings, figure
   builders and answer parsers used by the 8/7, Course 1 and parallel-course port modules. Moved verbatim from
   src/port87.js (Engine 0.61.1-rc.1) by the parallel-course setup; behaviour is unchanged. This file is shared:
   only the integration pass changes it (docs/change-specs/coverage-parallel-courses-v0.1.md). */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const U=common?require('./curriculum87-common'):root.MathCurriculum87Common;
const {M,R,f,n,text,teacher,esc}=U;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),red=(a,b)=>{const g=gcd(a,b);return [a/g,b/g];};

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
 if(layout==='right'){const o=[60,140],Q=([x,y])=>[o[0]+x*sc*1.1,o[1]-y*sc*1.1];b+=ln(...Q([0,0]),...Q([12,0]),{end:1})+ln(...Q([0,0]),...Q([0,11]),{end:1})+ln(...Q([0,0]),...Q([10,5*Math.sqrt(3)]),{end:1});
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

// Batch 2 drawings.
// Protractor with labelled rays from O at the given angles (degrees from ray OA on the right).
function protractorFigure(rays){const cx=210,cy=170,R=130,P=(r,a)=>[cx+r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)];let b=`<path d="M${cx-R},${cy} A${R},${R} 0 0 1 ${cx+R},${cy}" fill="none" stroke="${INK}" stroke-width="1.5"/>`+ln(cx-R-12,cy,cx+R+12,cy,{w:1.2});
 for(let a=0;a<=180;a+=10){const [x1,y1]=P(R-7,a),[x2,y2]=P(R+7,a);b+=ln(x1,y1,x2,y2,{w:1});}
 for(let a=0;a<=180;a+=30){const [x,y]=P(R+20,a),[u,v]=P(R-22,a);b+=tx(x,y+4,String(a),{size:10})+tx(u,v+4,String(180-a),{size:10});}
 rays.forEach(([name,a])=>{const [x,y]=P(R+34,a);b+=ln(cx,cy,x,y,{w:1.4,end:a!==0&&a!==180})+dot(...P(R,a));const [lx,ly]=P(R+50,a);b+=tx(lx,ly+5,name,{italic:1,size:14});});
 b+=dot(cx,cy)+tx(cx,cy+20,'O',{italic:1});return `<div style="padding-top:8px">`+svg(b,'Protractor centred at O with rays '+rays.map(r=>'O'+r[0]).join(', '),420,200).replace('viewBox="0 0 420 200"','viewBox="0 -30 420 230"')+'</div>';}
// Reference drawing for a protractor task: an angle of the given measure with a horizontal base ray.
function angleDrawing(deg){const cx=60+(deg>90?120:0),cy=150,r=130,a=deg*Math.PI/180;return svg(ln(cx,cy,cx+r,cy,{w:2})+ln(cx,cy,cx+r*Math.cos(a),cy-r*Math.sin(a),{w:2})+`<path d="M${cx+30},${cy} A30,30 0 0 0 ${(cx+30*Math.cos(a)).toFixed(1)},${(cy-30*Math.sin(a)).toFixed(1)}" fill="none" stroke="${INK}"/>`+tx(cx+48*Math.cos(a/2),cy-48*Math.sin(a/2)+4,deg+'°',{size:12}),`Angle of ${deg} degrees`,deg>90?340:240,170);}
// Regular polygon, or an irregular one with the same number of sides.
function polyShape(nSides,regular,seedShift=0){const pts=[];for(let i=0;i<nSides;i++){const a=-Math.PI/2+(i+(regular?0:0.18*Math.sin(i*2.7+seedShift)))*2*Math.PI/nSides,r=regular?42:42*(0.62+0.38*Math.abs(Math.cos(i*1.9+seedShift)));pts.push([55+r*Math.cos(a),55+r*Math.sin(a)]);}
 return `<polygon points="${pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;}
function polygonChoices(figs){let b='';figs.forEach(([nSides,regular,shift],i)=>{b+=`<g transform="translate(${i*120},0)">${tx(10,16,'('+'abcd'[i]+')',{size:13,anchor:'start'})}<g transform="translate(5,10)">${polyShape(nSides,regular,shift)}</g></g>`;});return svg(b,'Four figures labelled (a) to (d)',480,125);}
// Rectilinear figure with one step: left side L, top T, step down D, then right to W, down to the base.
function stepFigure(L,T,D,W,hideStep=false){const s=Math.min(22,260/Math.max(L,W)),x0=50,y0=20,X=v=>x0+v*s,Y=v=>y0+(L-v)*s;const pts=[[0,0],[0,L],[T,L],[T,L-D],[W,L-D],[W,0]];
 let b=`<polygon points="${pts.map(([x,y])=>X(x).toFixed(1)+','+Y(y).toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 b+=tx(X(0)-14,Y(L/2)+4,String(L))+tx(X(T/2),Y(L)-6,String(T))+(hideStep?'':tx(X(T)+12,Y(L-D/2)+4,String(D),{anchor:'start'}))+tx(X(W)+12,Y((L-D)/2)+4,String(L-D),{anchor:'start'})+tx(X(W/2),Y(0)+18,String(W));
 return svg(b,hideStep?`Rectilinear figure with sides labelled ${L}, ${T}, ${L-D} and ${W}; all corners are right angles`:`Rectilinear figure with sides labelled ${L}, ${T}, ${D}, ${L-D} and ${W}`,X(Math.max(T,W))+50,Y(0)+30);}
// Quadrilateral with its four side lengths labelled.
function quadFigure(s){const P=[[40,150],[110,30],[300,55],[200,170]];let b=`<polygon points="${P.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;const mid=(i)=>{const a=P[i],c=P[(i+1)%4];return[(a[0]+c[0])/2,(a[1]+c[1])/2];};const off=[[-18,-4],[0,-10],[18,8],[-6,20]];
 s.forEach((v,i)=>{const [x,y]=mid(i);b+=tx(x+off[i][0],y+off[i][1],String(v));});return svg(b,'Quadrilateral with sides '+s.join(', '),340,195);}
// Rectangle ABCD drawn with A at bottom left, B top left, C top right, D bottom right (as in the source).
function rectangleABCD(w,h){const s=Math.min(16,260/Math.max(w,h)),W=w*s,H=h*s,x0=30,y0=20;return svg(`<rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+tx(x0-10,y0+H+14,'A',{italic:1})+tx(x0-10,y0-4,'B',{italic:1})+tx(x0+W+10,y0-4,'C',{italic:1})+tx(x0+W+10,y0+H+14,'D',{italic:1}),'Rectangle ABCD; A bottom left, B top left, C top right, D bottom right',W+60,H+40);}
// Two triangles sharing vertex C on a base line: A-C-E along the base, B and D above.
function bowtie(names,flip){const [A,B,Cn,D,E]=names,top2=flip?250:300;const P={A:[40,170],B:[100,40],C:[200,170],D:[top2,40],E:[360,170]};let b=ln(...P.A,...P.E)+ln(...P.A,...P.B)+ln(...P.B,...P.C)+ln(...P.C,...P.D)+ln(...P.D,...P.E);
 b+=tx(P.A[0]-6,P.A[1]+18,A,{italic:1})+tx(P.B[0],P.B[1]-8,B,{italic:1})+tx(P.C[0],P.C[1]+18,Cn,{italic:1})+tx(P.D[0],P.D[1]-8,D,{italic:1})+tx(P.E[0]+6,P.E[1]+18,E,{italic:1});return svg(b,`Triangles ${A}${B}${Cn} and ${Cn}${D}${E} sharing vertex ${Cn}`,400,195);}

// Batch 3 drawings and helpers.
const smallestFactor=x=>{for(let p=2;p*p<=x;p++)if(x%p===0)return p;return x;};
const isPrime=x=>Number.isInteger(x)&&x>1&&smallestFactor(x)===x;
// Goal diagram: a box split into den equal rows of $part each; a bracket marks the num rows raised.
function goalDiagram(num,den,part){const rh=Math.min(26,220/den),x0=120,w=150,y0=14,H=den*rh;let b=`<rect x="${x0}" y="${y0}" width="${w}" height="${H}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 for(let i=0;i<den;i++){if(i)b+=ln(x0,y0+i*rh,x0+w,y0+i*rh,{w:1});b+=tx(x0+w/2,y0+i*rh+rh/2+4,'$'+comma(part),{size:Math.min(13,rh-4)});}
 const br=(ya,yb,label)=>ln(x0-10,ya+2,x0-10,yb-2)+ln(x0-10,ya+2,x0-4,ya+2)+ln(x0-10,yb-2,x0-4,yb-2)+tx(x0-16,(ya+yb)/2+4,label,{anchor:'end',size:12});
 b+=br(y0,y0+num*rh,`${num}/${den} raised`)+br(y0+num*rh,y0+H,`${den-num}/${den} not raised`)+tx(x0+w+10,y0+H/2+4,'goal',{anchor:'start',size:12});
 return svg(b,`Diagram of the goal in ${den} equal parts of $${comma(part)}; ${num} parts raised, ${den-num} not raised`,320,H+28);}
// Batch 4 drawings and helpers.
// A small figure builder in mathematical coordinates (y up); the view box fits the points.
function Fig(){const items=[],pts=[];const api={
 seg(p,q,o={}){pts.push(p,q);items.push(['seg',p,q,o]);return api;},
 poly(ps,o={}){pts.push(...ps);items.push(['poly',ps,o]);return api;},
 txt(p,s,o={}){pts.push(p);items.push(['txt',p,s,o]);return api;},
 dir(v,deg,px,s,o={}){items.push(['dir',v,deg,px,s,o]);return api;},
 arc(v,a0,a1,px,o={}){items.push(['arc',v,a0,a1,px,o]);return api;},
 right(v,d1,d2,px=9){items.push(['right',v,d1,d2,px]);return api;},
 dot(p){pts.push(p);items.push(['dot',p]);return api;},
 tick(p,q,px=6){items.push(['tick',p,q,px]);return api;},
 angle(v,p1,p2,o={}){const d=p=>Math.atan2(p[1]-v[1],p[0]-v[0])*180/Math.PI,a1=d(p1),diff=((d(p2)-a1+540)%360)-180,lo=diff>0?a1:a1+diff,mid=a1+diff/2;if(o.arc)api.arc(v,lo,lo+Math.abs(diff),o.arc);if(o.right)api.right(v,a1,a1+diff,o.right);if(o.label!==undefined)api.dir(v,mid,o.px||(o.arc?o.arc+14:24),o.label,{size:o.size||12,italic:o.italic});return api;},
 render(label,maxW=340,maxH=200,pad=34){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),k=Math.min(maxW/Math.max(x1-x0,1e-9),maxH/Math.max(y1-y0,1e-9)),W=(x1-x0)*k+2*pad,H=(y1-y0)*k+2*pad;
  const P=([x,y])=>[pad+(x-x0)*k,pad+(y1-y)*k],rad=d=>d*Math.PI/180,off=(v,deg,px)=>{const [x,y]=P(v);return[x+px*Math.cos(rad(deg)),y-px*Math.sin(rad(deg))];};let b='';
  for(const it of items){const [kind]=it;
   if(kind==='seg'){const o=it[3];b+=ln(...P(it[1]),...P(it[2]),{w:o.w||1.6,dash:o.dash,end:o.end,start:o.start});}
   if(kind==='poly'){const o=it[2];b+=`<polygon points="${it[1].map(p=>P(p).map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="${o.fill||'none'}" stroke="${INK}" stroke-width="${o.w||1.6}"/>`;}
   if(kind==='txt'){const [x,y]=P(it[1]),o=it[3];b+=tx(x+(o.dx||0),y+(o.dy||0),it[2],o);}
   if(kind==='dir'){const [x,y]=off(it[1],it[2],it[3]);b+=tx(x,y+4,it[4],it[5]);}
   if(kind==='dot'){b+=dot(...P(it[1]));}
   if(kind==='arc'){const [v,a0,a1,px]=it.slice(1),[cx,cy]=P(v),pa=a=>[cx+px*Math.cos(rad(a)),cy-px*Math.sin(rad(a))],[sx,sy]=pa(a0),[ex,ey]=pa(a1);b+=`<path d="M${sx.toFixed(1)},${sy.toFixed(1)} A${px},${px} 0 ${Math.abs(a1-a0)>180?1:0} 0 ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`;}
   if(kind==='right'){const [v,d1,d2,px]=it.slice(1),[cx,cy]=P(v),u=a=>[Math.cos(rad(a)),-Math.sin(rad(a))],[ax,ay]=u(d1),[bx,by]=u(d2);b+=`<path d="M${(cx+px*ax).toFixed(1)},${(cy+px*ay).toFixed(1)} L${(cx+px*ax+px*bx).toFixed(1)},${(cy+px*ay+px*by).toFixed(1)} L${(cx+px*bx).toFixed(1)},${(cy+px*by).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`;}
   if(kind==='tick'){const [p,q,px]=it.slice(1),[ax,ay]=P(p),[bx,by]=P(q),mx=(ax+bx)/2,my=(ay+by)/2,L=Math.hypot(bx-ax,by-ay),nx=-(by-ay)/L,ny=(bx-ax)/L;b+=ln(mx-px*nx,my-px*ny,mx+px*nx,my+px*ny,{w:1.3});}
  }
  return svg(b,label,Math.round(W),Math.round(H));}};return api;}
const pt=(p,deg,len)=>[p[0]+len*Math.cos(deg*Math.PI/180),p[1]+len*Math.sin(deg*Math.PI/180)];
const decStr=x=>U.dec(x),fix=(n,d,pl)=>(n/d).toFixed(pl);
// Number line from c to c+3 with tenth marks; arrows point at the given values from above (or below).
function decimalLine(c,values,below=false){const W=460,x=v=>30+(v-c)*130,base=below?28:62;let b=ln(8,base,W-8,base,{start:1,end:1});
 for(let k=0;k<=30;k++){const v=c+k/10,len=k%10===0?9:k%5===0?6:4;b+=ln(x(v),base-len,x(v),base+len,{w:k%10===0?1.6:1});if(k%10===0)b+=tx(x(v),base+(below?-14:24),String(c+k/10));}
 values.forEach(v=>{b+=below?ln(x(v),base+44,x(v),base+8,{end:1}):ln(x(v),base-44,x(v),base-8,{end:1});});
 return svg(b,`Number line from ${c} to ${c+3} marked in tenths, with ${values.length===1?'an arrow':'arrows'} pointing to ${values.length===1?'a point':'two points'}`,W,below?82:94);}
// Points A, B, C and D on a line, in that order (not to scale).
function pointsLine(){const xs=[30,170,240,282],W=330;let b=ln(10,40,W-10,40,{start:1,end:1});'ABCD'.split('').forEach((nm,i)=>{b+=dot(xs[i],40)+tx(xs[i],26,nm,{italic:1});});return svg(b,'Points A, B, C and D in order on a line',W,60);}
// Spinner with 8 equal sectors labelled by colour letter, counter-clockwise from the right.
function spinner(letters){const r=80,cx=110,cy=100;let b=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;for(let k=0;k<8;k++){const a=k*Math.PI/4;b+=ln(cx,cy,cx+r*Math.cos(a),cy-r*Math.sin(a),{w:1.2});const m=a+Math.PI/8;b+=tx(cx+0.68*r*Math.cos(m),cy-0.68*r*Math.sin(m)+5,letters[k],{size:15});}
 b+=ln(cx-28,cy+20,cx+30,cy-22,{w:3,end:1});return svg(b,'Spinner divided into 8 equal sections labelled '+letters.join(', '),220,200);}
// Dart board: square (4 quadrants) or circle (8 radii); the first `shaded` of `parts` equal parts are shaded.
function dartBoard(circle,parts,shaded){const cx=100,cy=100,r=80,step=360/parts;let b='';const sector=(a0,a1)=>{const p=a=>`${(cx+r*Math.cos(a*Math.PI/180)).toFixed(1)},${(cy-r*Math.sin(a*Math.PI/180)).toFixed(1)}`;return `<path d="M${cx},${cy} L${p(a0)} A${r},${r} 0 0 0 ${p(a1)} Z" fill="#9aa5ab" stroke="none"/>`;};
 const order=parts===4?[0,1,2,3]:[0,1,2,3,4,5,6,7],start=parts===4?[0,90,180,270]:[0,45,90,135,180,225,270,315];
 if(circle){for(let i=0;i<shaded;i++)b+=sector(start[order[i]],start[order[i]]+step);b+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;for(let k=0;k<8;k++){const a=k*Math.PI/4;b+=ln(cx,cy,cx+r*Math.cos(a),cy-r*Math.sin(a),{w:k%2?1.2:2});}}
 else{const q=[[cx,cy-r],[cx-r,cy-r],[cx-r,cy],[cx,cy]];for(let i=0;i<shaded;i++){const x=i===0||i===3?cx:cx-r,y=i<2?cy-r:cy;b+=`<rect x="${x}" y="${y}" width="${r}" height="${r}" fill="#9aa5ab"/>`;}b+=`<rect x="${cx-r}" y="${cy-r}" width="${2*r}" height="${2*r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(cx-r,cy,cx+r,cy,{w:2})+ln(cx,cy-r,cx,cy+r,{w:2});}
 return svg(b,`${circle?'Circular':'Square'} dart board divided into ${parts} equal parts; ${shaded} shaded`,200,200);}
// Rectangle split by a diagonal into two triangles; height a on the left, width c along the bottom.
function rectangleDiagonal(a,c){const W=a>c?150*c/a:150,H=W*a/c,x0=40,y0=15;return svg(`<rect x="${x0}" y="${y0}" width="${W}" height="${H.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+ln(x0,y0,x0+W,y0+H)+`<path d="M${x0},${(y0+H-12).toFixed(1)} h12 v12" fill="none" stroke="${INK}"/>`+tx(x0-14,y0+H/2+4,String(a))+tx(x0+W/2,y0+H+18,String(c)),`Rectangle ${a} by ${c} divided by a diagonal into two triangles`,W+70,H+35);}
// L-shape: a square of side a on the upper left of a b-by-c rectangle.
function lShape(a,b,c){const s=Math.min(18,190/c),X=v=>40+v*s,Y=v=>20+(c-v)*s,P=[[0,c],[a+b,c],[a+b,0],[a,0],[a,c-a],[0,c-a]];let g=`<polygon points="${P.map(([x,y])=>X(x).toFixed(1)+','+Y(y).toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 g+=tx(X(0)-12,Y(c-a/2)+4,String(a))+tx(X(a/2),Y(c-a)+16,String(a))+tx(X(a+b/2),Y(0)+18,String(b))+tx(X(a+b)+14,Y(c/2)+4,String(c));return svg(g,`Figure made of a ${a}-by-${a} square and a ${b}-by-${c} rectangle`,X(a+b)+40,Y(0)+30);}
// A square of side a joined to a right triangle with legs a and b (hypotenuse h); dashed line at the join.
function squareTriangle(a,b,h){const s=260/(a+b),X=v=>30+v*s,Y=v=>15+(a-v)*s;let g=`<polygon points="${[[0,0],[0,a],[a,a],[a+b,0]].map(([x,y])=>X(x).toFixed(1)+','+Y(y).toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+ln(X(a),Y(a),X(a),Y(0),{dash:'3,3',w:1.2})+`<path d="M${X(a)+10},${Y(0)} v-10 h-10" fill="none" stroke="${INK}"/>`;
 g+=tx(X(0)-12,Y(a/2)+4,String(a))+tx(X(a/2),Y(a)-6,String(a))+tx(X(a+b/2)+14,Y(a/2)-4,String(h),{anchor:'start'})+tx(X((a+b)/2),Y(0)+18,String(a+b));return svg(g,`Figure made of a square and a right triangle; sides labelled ${a}, ${a}, ${h} and ${a+b}`,X(a+b)+30,Y(0)+30);}
// Right triangle with the right angle at the bottom left; side or angle labels as given.
function rightTriangle(h,base,lab){const s=Math.min(220/base,140/h),X=v=>40+v*s,Y=v=>15+(h-v)*s;let g=`<polygon points="${X(0)},${Y(0)} ${X(0)},${Y(h)} ${X(base)},${Y(0)}" fill="none" stroke="${INK}" stroke-width="1.8"/><path d="M${X(0)},${Y(0)-11} h11 v11" fill="none" stroke="${INK}"/>`;
 if(lab.left)g+=tx(X(0)-12,Y(h/2)+4,lab.left);if(lab.bottom)g+=tx(X(base/2),Y(0)+18,lab.bottom);if(lab.hyp)g+=tx(X(base/2)+10,Y(h/2)-6,lab.hyp,{anchor:'start'});
 if(lab.top)g+=tx(X(0)+12,Y(h)+30,lab.top,{italic:/^x$/.test(lab.top)});if(lab.right)g+=tx(X(base)-38,Y(0)-7,lab.right,{italic:/^x$/.test(lab.right)});return svg(g,'Right triangle'+(lab.desc?': '+lab.desc:''),X(base)+30,Y(0)+30);}
// Tally sheet: names down the left, tallies in groups of five.
function tallySheet(names,counts){const rowH=34,W=330,H=rowH*names.length+34;let b=`<rect x="10" y="4" width="${W-20}" height="${H-8}" fill="none" stroke="${INK}" stroke-width="1.5"/>`+ln(10,30,W-10,30,{w:1.2})+ln(90,30,90,H-4,{w:1.2})+tx(W/2,22,'Vote Totals',{size:13});
 names.forEach((nm,i)=>{const y=30+rowH*i+rowH/2;b+=tx(50,y+5,nm,{size:13});let x=100;for(let k=0;k<counts[i];k++){if(k%5===4){b+=ln(x-4*9-4,y+6,x-2,y-7,{w:1.3});x+=12;}else{b+=ln(x,y-9,x,y+9,{w:1.3});x+=9;}}if(i)b+=ln(10,30+rowH*i,W-10,30+rowH*i,{w:.6});});
 return svg(b,'Tally sheet of votes for '+names.join(', '),W,H);}
// Histogram of five touching bars on a 0–12 scale.
function histogram(vals,labels,title,xTitle,yTitle){const x0=70,y0=30,bw=56,u=14,H=12*u;let b=tx(x0+2.5*bw,18,title,{size:14});for(let k=0;k<=12;k++){b+=ln(x0,y0+H-k*u,x0+5*bw,y0+H-k*u,{w:k?0.5:1.4});if(k%2===0)b+=tx(x0-10,y0+H-k*u+4,String(k),{size:11,anchor:'end'});}
 vals.forEach((v,i)=>{b+=`<rect x="${x0+i*bw}" y="${y0+H-v*u}" width="${bw}" height="${v*u}" fill="#c9d1d5" stroke="${INK}" stroke-width="1.3"/>`+tx(x0+i*bw+bw/2,y0+H+16,labels[i],{size:11});});
 b+=ln(x0,y0,x0,y0+H,{w:1.4})+tx(x0+2.5*bw,y0+H+36,xTitle,{size:12})+`<text x="22" y="${y0+H/2}" font-size="12" text-anchor="middle" transform="rotate(-90 22 ${y0+H/2})" fill="${INK}">${esc(yTitle)}</text>`;return svg(b,`Histogram titled ${title}; bars of heights ${vals.join(', ')}`,x0+5*bw+20,y0+H+48);}
// Circle graph with labelled sectors (percent), drawn counter-clockwise from the right, centred on the first sector.
function circleGraph(title,names,pcts){const cx=210,cy=160,r=85;let b=tx(cx,20,title,{size:13}),a=-pcts[0]*1.8;const P=(t,rr)=>[cx+rr*Math.cos(t*Math.PI/180),cy-rr*Math.sin(t*Math.PI/180)];b+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
 pcts.forEach((p,i)=>{b+=ln(cx,cy,...P(a,r),{w:1.2});const mid=a+p*1.8,[lx,ly]=P(mid,r+36);b+=tx(lx,ly-2,names[i],{size:12})+tx(lx,ly+13,p+'%',{size:12});a+=p*3.6;});return svg(b,`Circle graph: ${title}; `+names.map((nm,i)=>`${nm} ${pcts[i]}%`).join(', '),420,310);}
// Batch 5 helpers.
// Repeating decimal of n/d (n, d > 0): whole part, non-repeating digits and the repetend.
function repDec(n,d){const g=gcd(n,d);n/=g;d/=g;const w=Math.floor(n/d);let r=n%d;const seen=new Map(),digits=[];while(r&&!seen.has(r)){seen.set(r,digits.length);r*=10;digits.push(Math.floor(r/d));r%=d;}
 if(!r)return{w,nonrep:digits.join(''),rep:''};const k=seen.get(r);return{w,nonrep:digits.slice(0,k).join(''),rep:digits.slice(k).join('')};}
const OVER='̅',barText=({w,nonrep,rep})=>`${w}.${nonrep}${[...rep].map(ch=>ch+OVER).join('')}`,barML=({w,nonrep,rep})=>`<mrow><mn>${w}.${nonrep}</mn><mover accent="true"><mn>${rep}</mn><mo>‾</mo></mover></mrow>`;
// Consecutive letters for variables, skipping the ones the source avoids.
function letterRun(int,count,skip){const L=[...'abcdefghijklmnopqrstuvwxyz'].filter(ch=>!skip.includes(ch)),s=int(0,L.length-count);return L.slice(s,s+count);}
// Fraction-decimal-percent table with blanks (empty strings) to complete.
function fdpTable(rows){const W=360,rh=34;let b=`<rect x="10" y="4" width="${W-20}" height="${rh*(rows.length+1)}" fill="none" stroke="${INK}" stroke-width="1.5"/>`;['Fraction','Decimal','Percent'].forEach((h,i)=>{b+=tx(10+(W-20)*(i+0.5)/3,4+rh/2+5,h,{size:14});});
 for(let r=0;r<=rows.length;r++)b+=ln(10,4+rh*r,W-10,4+rh*r,{w:r===1?1.5:.8});for(let i=1;i<3;i++)b+=ln(10+(W-20)*i/3,4,10+(W-20)*i/3,4+rh*(rows.length+1),{w:.8});
 rows.forEach((row,r)=>row.forEach((v,i)=>{if(v!=='')b+=tx(10+(W-20)*(i+0.5)/3,4+rh*(r+1)+rh/2+5,v,{size:14});}));return svg(b,'Fraction, decimal and percent table: '+rows.map((row,r)=>`row ${r+1}: `+row.map(v=>v===''?'blank':v).join(', ')).join('; '),W,rh*(rows.length+1)+10);}
// Column addition of mixed measures (units given as labels).
function measureSum(top,bottom,sign='+'){const W=300,cols=Math.max(top.length,bottom.length),cw=(W-60)/cols,cell=(row,y)=>row.map((v,i)=>v?tx(60+cw*(cols-row.length+i)+cw/2,y,v,{size:15}):'').join('');return svg(cell(top,28)+tx(30,62,sign,{size:16})+cell(bottom,62)+ln(40,76,W-10,76,{w:1.5}),(sign==='+'?'Addition':'Subtraction')+' of mixed measures: '+top.filter(Boolean).join(' ')+(sign==='+'?' plus ':' minus ')+bottom.filter(Boolean).join(' '),W,90);}
// Batch 6 helpers.
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'},sup=n=>[...String(n)].map(ch=>SUP[ch]).join('');
// Scientific notation text from a mantissa given in hundredths/tenths (mn/md) and an exponent.
const sciText=(mn,md,e)=>`${U.dec(R(mn,md))} × 10${sup(e)}`;
// Exact decimal text of n × 10^k for a whole number n (k may be negative), with commas in the whole part.
function powText(n,k){if(k>=0)return comma(String(n)+'0'.repeat(k));const s=String(n).padStart(-k+1,'0'),w=s.slice(0,s.length+k),f=s.slice(s.length+k).replace(/0+$/,'');return comma(w)+(f?'.'+f:'');}
// Function table: In → Out rows; a blank Out cell is shown as an empty box.
function functionTable(rows,rule){const rh=30,W=260,H=rh*(rows.length+1)+10;let b=`<rect x="20" y="4" width="${W-40}" height="${rh*(rows.length+1)}" fill="none" stroke="${INK}" stroke-width="1.5"/>`+ln(W/2,4,W/2,4+rh*(rows.length+1),{w:1.2})+tx(W/4+10,4+rh/2+5,'In',{size:14})+tx(3*W/4-10,4+rh/2+5,'Out',{size:14});
 rows.forEach(([i,o],r)=>{const y=4+rh*(r+1);b+=ln(20,y,W-20,y,{w:r?0.8:1.5})+tx(W/4+10,y+rh/2+5,String(i),{size:14})+(o===''?`<rect x="${3*W/4-26}" y="${y+6}" width="32" height="${rh-12}" fill="none" stroke="${INK}" stroke-dasharray="3,2"/>`:tx(3*W/4-10,y+rh/2+5,String(o),{size:14}));});
 return svg(b,`Function table (${rule}); `+rows.map(([i,o])=>`${i} → ${o===''?'blank':o}`).join(', '),W,H);}
// Number machines: each shows an input on top and an output (or ?) underneath.
function numberMachines(pairs){const w=110;let b='';pairs.forEach(([i,o],k)=>{const x=k*(w+10)+10;b+=`<g transform="translate(${x},0)">`+tx(w/2,16,String(i),{size:15})+ln(w/2,22,w/2,34,{end:1})+`<rect x="10" y="36" width="${w-20}" height="56" rx="6" fill="none" stroke="${INK}" stroke-width="1.6"/>`+tx(w/2,60,'number',{size:12})+tx(w/2,76,'machine',{size:12})+ln(w/2,92,w/2,106,{end:1})+tx(w/2,124,String(o),{size:15})+'</g>';});return svg(b,'Number machines: '+pairs.map(([i,o])=>`${i} in, ${o} out`).join('; '),pairs.length*(w+10)+10,134);}
// Regular polygon outline.
function regularPolygon(k){const pts=[];for(let i=0;i<k;i++){const a=Math.PI/2+i*2*Math.PI/k;pts.push([110+80*Math.cos(a),95-80*Math.sin(a)]);}return svg(`<polygon points="${pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`,`Regular polygon with ${k} sides`,220,190);}
// Integer number line −L..L; arrows: list of [from,to,level]; optional dot at a point.
function integerLineBody(L,arrows,dotAt,base){const W=440,x=v=>30+(v+L)*(W-60)/(2*L);let b=ln(10,base,W-10,base,{start:1,end:1});for(let v=-L;v<=L;v++)b+=ln(x(v),base-6,x(v),base+6,{w:1})+tx(x(v),base+21,minus(v),{size:11});
 arrows.forEach(([f,t,lv])=>{const y=base-22*lv;b+=ln(x(f),y,x(t),y,{w:2,end:1})+ln(x(f),base,x(f),y,{dash:'3,3',w:1})+ln(x(t),base,x(t),y,{dash:'3,3',w:1});});if(dotAt!==null)b+=`<circle cx="${x(dotAt).toFixed(1)}" cy="${base}" r="4.5" fill="${INK}"/>`;return b;}
function integerLine(L,arrows=[],dotAt=null,label=''){return svg(integerLineBody(L,arrows,dotAt,78),label||`Number line from ${-L} to ${L}`,440,108);}
// Four labelled number lines (a)–(d) in one drawing.
function integerLines(list){let b='';list.forEach(([arrows,dotAt],i)=>{b+=`<g transform="translate(0,${i*112})">`+tx(12,16,'('+'abcd'[i]+')',{size:13,anchor:'start'})+integerLineBody(6,arrows,dotAt,78)+'</g>';});return svg(b,'Four number lines (a) to (d), each with two arrows',440,112*list.length);}

// Batch 7 helpers.
const sg=x=>x<0?'−'+Math.abs(x):'+'+x;
// Parallelogram with a dashed height. kind: 'slant' (SN870297/SX870519 layout) or 'upright' (SN870327 layout).
function parallelogramFigure(kind,a,b,c,all=false){const F=Fig();
 if(kind==='upright'){F.poly([[0,0],[20,0],[30,30],[10,30]]).seg([20,0],[30,0],{dash:'4,3'}).seg([30,0],[30,30],{dash:'4,3'}).right([30,0],180,90,8).txt([31.5,15],String(b),{anchor:'start'}).txt([10,-5],String(a)).txt([3.5,15],String(c),{anchor:'end'});
  return F.render(`Parallelogram with base ${a}, slanted side ${c} and a dashed height of ${b} drawn outside the figure`,300,200);}
 F.poly([[-10,-9],[10,-9],[19,7],[-1,7]]).seg([-1,-9],[-1,7],{dash:'4,3'}).right([-1,-9],0,90,8).txt([0,-2],String(b),{anchor:'start'}).txt([-7,-1],String(c),{anchor:'end'}).txt([9,8.6],String(a));
 if(all)F.txt([16,-1],String(c),{anchor:'start'}).txt([0,-11.5],String(a));
 return F.render(`Parallelogram with base ${a}, slanted side ${c} and a dashed height of ${b}`,320,180);}
// Parallelogram ABCD with D at the lower left and an acute angle a at D.
function parallelogramABCD(a){const L=24,s=17,r=a*Math.PI/180,D=[0,0],C=[L,0],A=[s*Math.cos(r),s*Math.sin(r)],B=[A[0]+L,A[1]];const F=Fig().poly([D,C,B,A]);F.dir(D,225,14,'D',{italic:1}).dir(C,315,14,'C',{italic:1}).dir(B,45,14,'B',{italic:1}).dir(A,135,14,'A',{italic:1});return F.render('Parallelogram ABCD',280,150);}
// SN870355 layouts: type 1 rectangle, types 2 and 3 slanted with the given angle at the lower left.
function parallelogramMissing(type,b,c,h,[e,f,g]){const F=Fig();
 if(type===1){F.poly([[0,0],[c,0],[c,b],[0,b]]).right([0,0],0,90,9).right([0,b],0,270,9).right([c,b],180,270,9).txt([-0.5,b/2],String(b),{anchor:'end'}).txt([c/2,b+0.5],e,{italic:1}).dir([c,0],135,18,f,{italic:1}).txt([c/2,-1.1],String(c));
  return F.render(`Rectangle: left side ${b}, bottom side ${c}, top side ${e}, angle ${f} at the lower right; three corners are marked as right angles`,280,190);}
 const ang=type===2?h:180-h,r=ang*Math.PI/180,O=[0,0],P=[b*Math.cos(r),b*Math.sin(r)],Q=[P[0]+c,P[1]],C=[c,0];
 F.poly([O,C,Q,P]).angle(O,C,P,{arc:14,label:ang+'°',size:11}).angle(Q,P,C,{arc:12,label:f,italic:1}).txt([P[0]/2-0.5,P[1]/2],String(b),{anchor:'end'}).txt([P[0]+c/2,P[1]+0.5],e,{italic:1}).txt([c/2,-1.1],String(c)).txt([c+P[0]/2+0.5,P[1]/2],g,{anchor:'start',italic:1});
 return F.render(`Parallelogram: left side ${b}, bottom side ${c}, angle ${ang}° at the lower left; the top side ${e}, the angle ${f} at the upper right and the right side ${g} are unknown`,300,190);}
// SN870339 triangle shapes (from the source's scaled coordinates), with right-angle and equal-side marks.
const TRI_SHAPES=[[[0,0],[0.5,0.866],[1,0]],[[0,0],[0,1],[1,0]],[[0,0],[0.75,0.5],[1.5,0]],[[0,0],[0.25,0.75],[0.5,0]],[[0,0],[0,1],[1.5,0]],[[0,0],[0.45,0.5],[1.5,0]],[[0,0],[0.2,1],[1,0]]];
function triangleShape(k){const P=TRI_SHAPES[k],F=Fig().poly(P),d=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]),S=[[P[0],P[1]],[P[1],P[2]],[P[2],P[0]]],L=S.map(([p,q])=>d(p,q));
 S.forEach(([p,q],i)=>{const same=L.filter(x=>Math.abs(x-L[i])<1e-3).length;if(same>=2)F.tick(p,q,6);});if(k===1||k===4)F.right([0,0],0,90,10);
 return F.render('A triangle; equal sides are marked with matching ticks'+(k===1||k===4?' and a right angle is marked':''),240,170);}
// One or two circles, each with a radius or a diameter drawn and labelled.
function circlesFigure(list){const r=62,w=2*r+60;let b='';list.forEach(([mode,label,tag],i)=>{const cx=30+r+i*w,cy=r+26;b+=(tag?tx(cx-r-12,18,tag,{size:13,anchor:'start'}):'')+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+dot(cx,cy)+(mode==='diameter'?ln(cx-r,cy,cx+r,cy)+tx(cx+r/2,cy-6,label,{size:13}):ln(cx,cy,cx+r,cy)+tx(cx+r/2,cy-6,label,{size:13}));});
 return svg(b,list.map(([mode,label,tag])=>`${tag?tag+' ':''}circle with ${mode} ${label}`).join('; '),list.length*w+20,2*r+40);}
// Box in oblique view; hidden edges dashed when hidden=true.
function boxBody(x0,y0,L,H,D,hidden){const dx=D*0.6,dy=D*0.45,P={a:[x0,y0],b:[x0+L,y0],c:[x0+L,y0-H],d:[x0,y0-H]},Q=k=>[P[k][0]+dx,P[k][1]-dy];let s=ln(...P.a,...P.b)+ln(...P.b,...P.c)+ln(...P.c,...P.d)+ln(...P.d,...P.a)+ln(...P.d,...Q('d'))+ln(...P.c,...Q('c'))+ln(...P.b,...Q('b'))+ln(...Q('d'),...Q('c'))+ln(...Q('c'),...Q('b'));
 if(hidden)s+=ln(...P.a,...Q('a'),{dash:'4,3',w:1})+ln(...Q('a'),...Q('b'),{dash:'4,3',w:1})+ln(...Q('a'),...Q('d'),{dash:'4,3',w:1});return s;}
// Pictures of common solids for SN870610 (ten pictures: two each of cube, prism, pyramid and cylinder; a sphere; a cone).
function solidPicture(k){let b='';const E=(cx,cy,rx,ry,o={})=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="1.6"${o.dash?' stroke-dasharray="4,3"':''}/>`,arc=(cx,cy,rx,ry,top)=>`<path d="M${cx-rx},${cy} A${rx},${ry} 0 0 ${top?1:0} ${cx+rx},${cy}" fill="none" stroke="${INK}" stroke-width="1.6"${top?' stroke-dasharray="4,3"':''}/>`;
 const names=['cube','cube','rectangular prism','rectangular prism','pyramid','pyramid','cylinder','cylinder','sphere','cone'];
 if(k===0)b=boxBody(40,150,90,90,90,true);
 else if(k===1)b=boxBody(55,130,70,70,55,false);
 else if(k===2)b=boxBody(25,140,130,60,60,true);
 else if(k===3)b=boxBody(60,160,60,120,45,false);
 else if(k===4){const A=[30,150],B=[140,150],C=[180,115],D=[70,115],T=[105,25];b=ln(...A,...B)+ln(...B,...C)+ln(...A,...T)+ln(...B,...T)+ln(...C,...T)+ln(...A,...D,{dash:'4,3',w:1})+ln(...D,...C,{dash:'4,3',w:1})+ln(...D,...T,{dash:'4,3',w:1});}
 else if(k===5){const A=[30,150],B=[170,150],C=[120,115],T=[100,30];b=ln(...A,...B)+ln(...A,...T)+ln(...B,...T)+ln(...A,...C,{dash:'4,3',w:1})+ln(...C,...B,{dash:'4,3',w:1})+ln(...C,...T,{dash:'4,3',w:1});}
 else if(k===6)b=E(100,40,55,16)+ln(45,40,45,150)+ln(155,40,155,150)+arc(100,150,55,16,false)+arc(100,150,55,16,true);
 else if(k===7)b=E(100,60,75,14)+ln(25,60,25,130)+ln(175,60,175,130)+arc(100,130,75,14,false)+arc(100,130,75,14,true);
 else if(k===8)b=`<circle cx="100" cy="90" r="70" fill="none" stroke="${INK}" stroke-width="1.6"/>`+arc(100,90,70,18,false)+arc(100,90,70,18,true);
 else b=ln(100,20,40,145)+ln(100,20,160,145)+arc(100,145,60,16,false)+arc(100,145,60,16,true);
 return svg(b,'A geometric solid',200,180);}
// Rectangular prism built of unit cubes (w wide, h high, d deep), drawn in oblique view.
function cubeStack(w,h,d){const s=Math.min(24,230/(w+0.6*d),170/(h+0.45*d)),dx=0.6*s,dy=0.45*s,X0=20,Y0=20+d*dy+h*s;let b='';const L=(a,c,e,f)=>{b+=ln(a,c,e,f,{w:1.1});};
 for(let i=0;i<=w;i++)L(X0+i*s,Y0,X0+i*s,Y0-h*s);for(let j=0;j<=h;j++)L(X0,Y0-j*s,X0+w*s,Y0-j*s);
 for(let i=0;i<=w;i++)L(X0+i*s,Y0-h*s,X0+i*s+d*dx,Y0-h*s-d*dy);for(let k=0;k<=d;k++)L(X0+k*dx,Y0-h*s-k*dy,X0+w*s+k*dx,Y0-h*s-k*dy);
 for(let j=0;j<=h;j++)L(X0+w*s,Y0-j*s,X0+w*s+d*dx,Y0-j*s-d*dy);for(let k=0;k<=d;k++)L(X0+w*s+k*dx,Y0-k*dy,X0+w*s+k*dx,Y0-h*s-k*dy);
 return svg(b,`A rectangular prism built of cubes: ${w} cubes wide, ${h} cubes high and ${d} cubes deep`,Math.ceil(X0*2+w*s+d*dx),Math.ceil(Y0+20));}
// Rectangular prism with its three edges labelled: length along the front, height at the right, depth along the lower right.
function prismFigure(L,H,D,lab){const k=Math.min(200/(L+0.6*D),130/(H+0.45*D)),l=L*k,hh=H*k,dd=D*k,x0=30,y0=30+hh+dd*0.45;let b=boxBody(x0,y0,l,hh,dd,false);
 b+=tx(x0+l/2,y0+18,lab[0])+tx(x0+l+dd*0.6+8,y0-dd*0.45-hh/2+4,lab[1],{anchor:'start'})+tx(x0+l+dd*0.3+8,y0-dd*0.225+12,lab[2],{anchor:'start'});
 return svg(b,`Rectangular prism with edges labelled ${lab.join(', ')}`,Math.ceil(x0+l+dd*0.6+50),Math.ceil(y0+28));}
// Batch 8 helpers.
const cap=s=>s[0].toUpperCase()+s.slice(1);
// Outline from source coordinates with right-angle marks and labels.
function labelledOutline(P,rights,labels,desc,dashed=[]){const F=Fig().poly(P);dashed.forEach(([p,q])=>F.seg(p,q,{dash:'4,3'}));rights.forEach(([v,d1,d2])=>F.right(v,d1,d2,9));labels.forEach(([p,s,o])=>F.txt(p,s,o||{}));return F.render(desc,320,210);}
// Number line from −10 to 10 with an optional graphed ray: dir 'left' or 'right', closed or open endpoint at m.
function inequalityBody(m,dir,closed,y0){const W=440,x=v=>30+(v+10)*(W-60)/20;let b=ln(10,y0,W-10,y0,{start:1,end:1});
 for(let v=-10;v<=10;v++)b+=ln(x(v),y0-(v%2?4:7),x(v),y0+(v%2?4:7),{w:1})+(v%2===0?tx(x(v),y0+22,minus(v),{size:11}):'');
 if(dir){const end=dir==='right'?W-22:22,tip=dir==='right'?W-10:10;b+=`<line x1="${x(m).toFixed(1)}" y1="${y0}" x2="${end}" y2="${y0}" stroke="${INK}" stroke-width="4"/><polygon points="${tip},${y0} ${end},${y0-7} ${end},${y0+7}" fill="${INK}"/>`+`<circle cx="${x(m).toFixed(1)}" cy="${y0}" r="6" fill="${closed?INK:'#fff'}" stroke="${INK}" stroke-width="2"/>`;}
 return b;}
function inequalityLine(m=0,dir=null,closed=false){return svg(inequalityBody(m,dir,closed,24),dir?`Number line from −10 to 10 with ${closed?'a closed':'an open'} circle at ${m} and the ray shaded to the ${dir}`:'Number line from −10 to 10',440,56);}
function inequalityLines(list){let b='';list.forEach(([m,dir,closed],i)=>{b+=`<g transform="translate(0,${i*66})">`+tx(12,16,'('+'abcd'[i]+')',{size:13,anchor:'start'})+inequalityBody(m,dir,closed,34)+'</g>';});return svg(b,'Four number lines (a) to (d), each with a graphed ray',440,66*list.length);}
// Coordinate plane from −10 to 10; shapes: {pts,dash,names}.
function coordBody(shapes,s){const O=11*s+10,X=v=>O+v*s,Y=v=>O-v*s;let b='';for(let v=-10;v<=10;v++)b+=ln(X(v),Y(-10),X(v),Y(10),{w:0.4,color:'#c3cacf'})+ln(X(-10),Y(v),X(10),Y(v),{w:0.4,color:'#c3cacf'});
 b+=ln(X(-10.8),O,X(10.8),O,{w:1.2,start:1,end:1})+ln(O,Y(-10.8),O,Y(10.8),{w:1.2,start:1,end:1})+tx(X(10.9),O+15,'x',{italic:1,size:12})+tx(O-11,Y(10.6),'y',{italic:1,size:12});
 for(const v of [-10,-5,5,10])b+=tx(X(v),O+13,minus(v),{size:9})+tx(O-5,Y(v)+3,minus(v),{size:9,anchor:'end'});
 for(const {pts,dash,names} of shapes){b+=`<polygon points="${pts.map(([x,y])=>X(x).toFixed(1)+','+Y(y).toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"${dash?' stroke-dasharray="5,3"':''}/>`;
  if(names){const cx=pts.reduce((t,p)=>t+p[0],0)/pts.length,cy=pts.reduce((t,p)=>t+p[1],0)/pts.length;pts.forEach(([x,y],i)=>{const dx=x-cx,dy=y-cy,L=Math.hypot(dx,dy)||1;b+=tx(X(x)+11*dx/L,Y(y)-11*dy/L+4,names[i],{italic:1,size:12});});}}
 return b;}
const ptsText=(names,pts)=>pts.map(([x,y],i)=>`${names[i]}(${minus(x)}, ${minus(y)})`).join(', ');
function coordPlane(shapes,label){const s=14;return svg(coordBody(shapes,s),label,22*s+20,22*s+20);}
function coordPlanes(list,label){const s=8,w=22*s+20;let b='';list.forEach((shapes,i)=>{b+=`<g transform="translate(${(i%2)*(w+16)},${Math.floor(i/2)*(w+22)})">`+tx(10,12,'('+'abcd'[i]+')',{size:12,anchor:'start'})+`<g transform="translate(0,8)">${coordBody(shapes,s)}</g></g>`;});return svg(b,label,2*w+16,2*(w+22));}
// Batch 9 helpers.
const UNSUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
// Monomial text: coefficient and [[letter,exponent],...]; showOne keeps a coefficient of 1 (for a lone constant).
function monoText(coef,vars){const v=vars.filter(([,e])=>e).map(([l,e])=>l+(e>1?sup(e):'')).join('');if(!v)return minus(coef);return (coef===-1?'−':coef===1?'':minus(coef))+v;}
// Polynomial text from terms [[coef,vars],...], skipping zero terms.
function polyText(terms){const t=terms.filter(([c])=>c!==0);if(!t.length)return '0';return t.map(([c,v],i)=>{const m=monoText(Math.abs(c),v);return i===0?(c<0?'−'+m:m):(c<0?' − ':' + ')+m;}).join('');}
// x/y table with a rule; blank cells are ''.
function xyTable(rule,rows){const rh=30,W=240,H=rh*(rows.length+1)+40;let b=tx(W/2,22,rule,{size:15,italic:1})+`<rect x="30" y="34" width="${W-60}" height="${rh*(rows.length+1)}" fill="none" stroke="${INK}" stroke-width="1.5"/>`+ln(W/2,34,W/2,34+rh*(rows.length+1),{w:1.2})+tx(W/2-45,34+rh/2+5,'x',{italic:1,size:15})+tx(W/2+45,34+rh/2+5,'y',{italic:1,size:15});
 rows.forEach((r,i)=>{const y=34+rh*(i+1);b+=ln(30,y,W-30,y,{w:i?0.8:1.5});r.forEach((v,k)=>{const cx=k?W/2+45:W/2-45;b+=v===''?`<rect x="${cx-16}" y="${y+6}" width="32" height="${rh-12}" fill="none" stroke="${INK}" stroke-dasharray="3,2"/>`:tx(cx,y+rh/2+5,minus(v),{size:14});});});
 return svg(b,`Function table for ${rule}: `+rows.map(([x,y])=>`x ${x===''?'blank':x}, y ${y===''?'blank':y}`).join('; '),W,H);}
// Number line with dots on integers; arrow at one end ('left'/'right') shows the dots continue.
function dotLineBody(lo,hi,dots,cont,y0){const W=440,x=v=>30+(v-lo)*(W-60)/(hi-lo);let b=ln(10,y0,W-10,y0,{start:1,end:1});for(let v=lo;v<=hi;v++)b+=ln(x(v),y0-6,x(v),y0+6,{w:1})+((hi-lo>12?v%2===0:true)?tx(x(v),y0+21,minus(v),{size:11}):'');
 dots.forEach(v=>{b+=`<circle cx="${x(v).toFixed(1)}" cy="${y0}" r="5" fill="${INK}"/>`;});if(cont){const e=cont==='right'?x(hi)+18:x(lo)-18,s=x(cont==='right'?Math.max(...dots):Math.min(...dots));b+=`<line x1="${s.toFixed(1)}" y1="${y0}" x2="${e.toFixed(1)}" y2="${y0}" stroke="${INK}" stroke-width="4"/><polygon points="${(e+(cont==='right'?8:-8)).toFixed(1)},${y0} ${e.toFixed(1)},${y0-6} ${e.toFixed(1)},${y0+6}" fill="${INK}"/>`;}return b;}
function dotLine(lo,hi,dots=[],cont=null){return svg(dotLineBody(lo,hi,dots,cont,24),`Number line from ${lo} to ${hi}`+(dots.length?` with dots at ${dots.map(minus).join(', ')}${cont?` and an arrow showing the dots continue to the ${cont}`:''}`:''),440,56);}
function dotLines(lo,hi,list){let b='';list.forEach((dots,i)=>{b+=`<g transform="translate(0,${i*66})">`+tx(12,16,'('+'abcd'[i]+')',{size:13,anchor:'start'})+dotLineBody(lo,hi,dots,null,34)+'</g>';});return svg(b,'Four number lines (a) to (d) with dots on whole numbers',440,66*list.length);}
function inscribedPolygon(k){const pts=[];for(let i=0;i<k;i++){const a=Math.PI/2+i*2*Math.PI/k;pts.push([110+80*Math.cos(a),95-80*Math.sin(a)]);}return svg(`<circle cx="110" cy="95" r="80" fill="none" stroke="${INK}" stroke-width="1.4"/><polygon points="${pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`,`Regular polygon with ${k} sides inscribed in a circle`,220,190);}
// Exact rational evaluator for products and quotients of numbers, with parentheses and implied multiplication.
function evalProduct(str){const s=String(str).replace(/[×·*]/g,'*').replace(/\s+/g,'');let i=0;const mul=([a,b],[c,d])=>{const n=a*c,m=b*d,g=gcd(n,m)||1;return [n/g,m/g];};
 const atom=()=>{if(s[i]==='('){i++;const v=expr();if(v===null||s[i]!==')')return null;i++;return v;}const m=s.slice(i).match(/^(\d+)(?:\.(\d+))?/);if(!m)return null;i+=m[0].length;const f=m[2]||'';return [Number(m[1]+f),10**f.length];};
 const expr=()=>{let v=atom();if(v===null)return null;while(i<s.length&&s[i]!==')'){let op='*';if(s[i]==='*'||s[i]==='/'){op=s[i];i++;}else if(s[i]!=='(')return null;const w=atom();if(w===null||w[0]===0&&op==='/')return null;v=op==='*'?mul(v,w):mul(v,[w[1],w[0]]);}return v;};
 const v=expr();return v!==null&&i===s.length?v:null;}
// Batch 10 helpers.
const fx2=x=>(x<0?'−':'')+Math.abs(x).toFixed(2);
// Simplest radical form: n = l²·m.
function rootParts(n){let l=1,m=n;for(let k=Math.floor(Math.sqrt(n));k>1;k--)if(n%(k*k)===0){l=k;m=n/(k*k);break;}return [l,m];}
const rootText=n=>{const [l,m]=rootParts(n);return m===1?String(l):(l===1?'':l)+'√'+m;};
// Right circular cylinder with radius r (on the top face) and height h labelled.
function cylinderFigure(r,h,unit){const rx=60,ry=15,H=Math.max(90,Math.min(170,h*14)),cx=90,top=30,bot=top+H;return svg(`<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(cx-rx,top,cx-rx,bot)+ln(cx+rx,top,cx+rx,bot)+`<path d="M${cx-rx},${bot} A${rx},${ry} 0 0 0 ${cx+rx},${bot}" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${cx-rx},${bot} A${rx},${ry} 0 0 1 ${cx+rx},${bot}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4,3"/>`+dot(cx,top)+ln(cx,top,cx+rx,top)+tx(cx+rx/2,top-5,String(r),{size:13})+tx(cx+rx+8,(top+bot)/2+4,String(h),{size:13,anchor:'start'}),`Cylinder with radius ${r} ${unit} and height ${h} ${unit}`,200,bot+30);}
// Right triangular prism: triangle base a, height b (dashed, with right-angle mark), prism length c.
function triPrismFigure(a,b,c){const s=Math.min(150/a,90/b),dx=Math.min(110,c*9),dy=-dx*0.45,y0=20-dy,A=[30,y0+b*s],B=[30+a*s,y0+b*s],T=[30+a*s/3,y0],o=([x,y])=>[x+dx,y+dy];let g=`<polygon points="${[A,B,T].map(p=>p.join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(...B,...o(B))+ln(...T,...o(T))+ln(...o(B),...o(T))+ln(...A,...o(A),{dash:'4,3',w:1})+ln(...o(A),...o(B),{dash:'4,3',w:1})+ln(...o(A),...o(T),{dash:'4,3',w:1});
 g+=ln(T[0],T[1],T[0],A[1],{dash:'4,3',w:1})+`<path d="M${T[0]},${A[1]-8} h8 v8" fill="none" stroke="${INK}"/>`+tx((A[0]+B[0])/2,A[1]+18,String(a))+tx(T[0]+6,(T[1]+A[1])/2+4,String(b),{anchor:'start'})+tx(B[0]+dx/2+8,B[1]+dy/2+14,String(c),{anchor:'start'});return svg(g,`Triangular prism: triangle base ${a}, triangle height ${b}, length ${c}`,Math.ceil(B[0]+dx+40),Math.ceil(A[1]+28));}
// Spinner with six equal sections.
function spinner6(labels){const r=80,cx=110,cy=100;let b=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;for(let k=0;k<6;k++){const a=k*Math.PI/3;b+=ln(cx,cy,cx+r*Math.cos(a),cy-r*Math.sin(a),{w:1.2});const m=a+Math.PI/6;b+=tx(cx+0.66*r*Math.cos(m),cy-0.66*r*Math.sin(m)+5,String(labels[k]),{size:16});}
 b+=ln(cx-26,cy+18,cx+28,cy-20,{w:3,end:1});return svg(b,'Spinner divided into 6 equal sections labelled '+labels.join(', '),220,200);}
// Generic angle with vertex label and arc; deg may exceed 180.
function angleArcFigure(deg,label){const cx=150,cy=110,r=95,a=deg*Math.PI/180,ar=26,large=deg>180?1:0;return svg(ln(cx,cy,cx+r,cy,{w:2,end:1})+ln(cx,cy,cx+r*Math.cos(a),cy-r*Math.sin(a),{w:2,end:1})+`<path d="M${cx+ar},${cy} A${ar},${ar} 0 ${large} 0 ${(cx+ar*Math.cos(a)).toFixed(1)},${(cy-ar*Math.sin(a)).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`+(label?tx(cx+(ar+14)*Math.cos(a/2),cy-(ar+14)*Math.sin(a/2)+4,label,{italic:1,size:13}):''),label?`An angle labelled ${label}`:'An angle to measure',300,220);}
// Right angle on a line with a ray at c° from the right side; the angle between the ray and the vertical is labelled.
function complementFigure(c,label){const F=Fig(),O=[0,0];F.seg([-10,0],[10,0],{start:1,end:1}).seg(O,[0,10],{end:1}).seg(O,pt(O,c,10),{end:1}).right(O,90,180,10).arc(O,0,c,22).dir(O,c/2,36,c+'°',{size:11}).dir(O,(90+c)/2,26,label,{italic:1,size:12});return F.render(`A right angle on a line; a ray makes ${c}° with the line, and angle ${label} is between the ray and the vertical side`,300,170);}
// Two similar triangles: shape points, the second scaled; labels per side [[i,text],...].
function similarPair(P,k,lab1,lab2,names1,names2){const F=Fig(),Q=P.map(([x,y])=>[x*k+(Math.max(...P.map(p=>p[0]))+3-Math.min(...P.map(p=>p[0]))*k),y*k]),cen=pts=>[pts.reduce((s,p)=>s+p[0],0)/3,pts.reduce((s,p)=>s+p[1],0)/3];
 for(const [pts,lab,names] of [[P,lab1,names1],[Q,lab2,names2]]){F.poly(pts);const c=cen(pts);pts.forEach((p,i)=>{const d=Math.hypot(p[0]-c[0],p[1]-c[1])||1;F.txt([p[0]+(p[0]-c[0])/d*1.1,p[1]+(p[1]-c[1])/d*1.1],names[i],{italic:1});});lab.forEach(([i,s])=>{const p=pts[i],q=pts[(i+1)%3],m=[(p[0]+q[0])/2,(p[1]+q[1])/2],d=Math.hypot(m[0]-c[0],m[1]-c[1])||1;F.txt([m[0]+(m[0]-c[0])/d*1.1,m[1]+(m[1]-c[1])/d*1.1],s);});}
 return F.render('Two similar triangles with some side lengths labelled',380,200);}
// Large right triangle (legs a up, c across) with a smaller similar triangle of base b at the right end and height x.
function nestedTriangles(a,b,c){const F=Fig(),A=[0,a],O=[0,0],C=[c,0],D=[c-b,0],E=[c-b,a*b/c];F.poly([O,A,C]).seg(D,E).right(O,0,90,8).right(D,0,90,8).txt([-0.04*c,a/2],String(a),{anchor:'end'}).txt([c/2,-0.12*a],String(c)).txt([c-b/2,0.06*a],String(b)).txt([c-b-0.03*c,E[1]/2],'x',{anchor:'end',italic:1});return F.render('A right triangle with a smaller similar right triangle inside it at the right end; its height is x',340,190);}
// Two parallel ladders against a wall; labels given as text.
function laddersFigure(longLen,longH,shortLabel,shortIsLen){const F=Fig();F.seg([0,0],[0,12],{w:2.5}).seg([-1,0],[14,0]).seg([0,9],[7.5,0]).seg([0,4.2],[3.5,0]).right([0,0],0,90,8).txt([4.1,5.2],String(longLen),{anchor:'start'}).txt([-0.4,4.5],String(longH),{anchor:'end'});if(shortIsLen)F.txt([2.1,2.4],shortLabel,{anchor:'start'});else F.txt([-0.4,1.8],shortLabel,{anchor:'end'});return F.render('Two ladders leaning against a wall at the same angle, with lengths and heights labelled',300,190);}
// Person, tree and building in a line of sight.
function sightFigure(a,b,c){return svg(ln(20,170,440,170)+ln(40,170,40,150,{w:2})+`<circle cx="40" cy="145" r="5" fill="none" stroke="${INK}"/>`+ln(140,170,140,120,{w:4})+`<circle cx="140" cy="112" r="16" fill="none" stroke="${INK}"/>`+`<rect x="380" y="30" width="45" height="140" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(40,145,402,30,{dash:'4,3',w:1})+tx(90,188,`${b} ft`)+tx(240,205,`${a} ft`)+ln(40,196,402,196,{w:1,start:1,end:1})+tx(152,140,`${c} ft`,{anchor:'start'}),`A person ${a} ft from a building and ${b} ft from a tree ${c} ft tall; the line of sight passes over the tree to the top of the building`,460,215);}
// Batch 11–12 helpers.
// Graph on the −10..10 grid. items: {line:[m,b]} (y = mx + b), {vline:c}, {fn:x=>y, step}, {region:[[a,b,c],...]} (half-planes a·x + b·y ≥ c), {dash:true}.
function clipPoly(P,a,b,c){const out=[],f=p=>a*p[0]+b*p[1]-c;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],fp=f(p),fq=f(q);if(fp>=0)out.push(p);if((fp>=0)!==(fq>=0)){const t=fp/(fp-fq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out;}
function graphBody(items,s){const O=11*s+10,X=v=>O+v*s,Y=v=>O-v*s,W=10.4;let b=coordBody([],s);
 for(const it of items){const o={w:2,dash:it.dash?'6,4':''};
  if(it.region){let P=[[-W,-W],[W,-W],[W,W],[-W,W]];for(const [a,bb,c] of it.region)P=clipPoly(P,a,bb,c);if(P.length>2)b+=`<polygon points="${P.map(([x,y])=>X(x).toFixed(1)+','+Y(y).toFixed(1)).join(' ')}" fill="#7d8f96" fill-opacity="0.32" stroke="none"/>`;}
  if(it.line){const [m,k]=it.line,lo=it.from??-W,hi=it.to??W;let P=[];for(const x of [lo,hi]){P.push([x,m*x+k]);}
   // clip the segment to the window
   const pts=[];const [[x1,y1],[x2,y2]]=P;let t0=0,t1=1;const dx=x2-x1,dy=y2-y1;for(const [p,q] of [[-dx,x1+W],[dx,W-x1],[-dy,y1+W],[dy,W-y1]]){if(p===0){if(q<0)t0=2;}else{const r=q/p;if(p<0)t0=Math.max(t0,r);else t1=Math.min(t1,r);}}
   if(t0<t1)b+=ln(X(x1+t0*dx),Y(y1+t0*dy),X(x1+t1*dx),Y(y1+t1*dy),o);}
  if(it.vline!==undefined)b+=ln(X(it.vline),Y(-W),X(it.vline),Y(W),o);
  if(it.fn){let path='',pen=false;const st=it.step||0.05;for(let x=-W;x<=W+1e-9;x+=st){const y=it.fn(x);if(!isFinite(y)||Math.abs(y)>W||(it.skip&&it.skip(x))){pen=false;continue;}path+=(pen?'L':'M')+X(x).toFixed(1)+','+Y(y).toFixed(1);pen=true;}b+=`<path d="${path}" fill="none" stroke="${INK}" stroke-width="2"/>`;}
  if(it.pt)b+=dot(X(it.pt[0]),Y(it.pt[1]));
  if(it.label)b+=tx(X(it.label[0])+6,Y(it.label[1])-6,it.label[2],{italic:1,size:12,anchor:'start'});}
 return b;}
function graphPlane(items,label){const s=14;return svg(graphBody(items,s),label,22*s+20,22*s+20);}
function graphPlanes(list,label,captions){const s=8,w=22*s+20;let b='';list.forEach((items,i)=>{const cap=captions?captions[i]:'';b+=`<g transform="translate(${(i%2)*(w+16)},${Math.floor(i/2)*(w+40)})">`+tx(4,12,'('+'abcd'[i]+')'+(cap?' '+cap:''),{size:11,anchor:'start'})+`<g transform="translate(0,${captions?24:8})">${graphBody(items,s)}</g></g>`;});return svg(b,label,2*w+16,2*(w+40));}
// Two parallel lines l (upper) and m cut by transversal t; angle labels 1–8 at the source's positions; swap exchanges 1↔2, 3↔4, 5↔6, 7↔8.
function transversalFigure(swap){const F=Fig();F.seg([2,10],[38,10],{start:1,end:1}).seg([2,20],[38,20],{start:1,end:1}).seg([25,2],[15,29],{start:1,end:1}).txt([34,11.8],'m',{italic:1}).txt([35,21.8],'l',{italic:1}).txt([13,26],'t',{italic:1});
 const P=[[15,21],[21,21],[22,16],[16,16],[19,11],[25,11],[26,6],[20,6]];P.forEach((p,i)=>{const k=swap?(i%2?i-1:i+1):i;F.txt([p[0],p[1]+0.6],String(k+1),{size:12});});return F.render('Transversal t crossing parallel lines l and m, forming angles numbered 1 to 8',360,230);}
// Rectangle b long and 2a tall with a semicircle of radius a on one end (left or right).
function semicircleRect(a,b,left,unit){const F=Fig(),c=[left?0:b,0],dir=left?-1:1;F.seg([0,-a],[b,-a]).seg([0,a],[b,a]);const arcPts=[];for(let k=0;k<=36;k++){const th=(-90+5*k)*Math.PI/180;arcPts.push([c[0]+dir*a*Math.cos(th),a*Math.sin(th)]);}for(let k=0;k<36;k++)F.seg(arcPts[k],arcPts[k+1],{w:1.6});
 const flat=left?b:0;F.seg([flat,-a],[flat,a]).seg(c,[c[0],a],{dash:'4,3',w:1}).seg(c,[c[0],-a],{dash:'4,3',w:1}).dot(c).seg(c,pt(c,left?135:45,a),{w:1.2}).right([flat,-a],left?90:0,left?180:90,8).right([flat,a],left?180:270,left?270:360,8);
 F.txt([b/2,a+0.12*a+0.3],String(b)).txt([flat+(left?1:-1)*0.18*b,0],String(2*a),{anchor:left?'start':'end'}).txt([c[0]+dir*0.28*a,0.62*a],String(a));return F.render(`A rectangle ${b} ${unit} long and ${2*a} ${unit} wide with a semicircle of radius ${a} ${unit} on one end`,320,170);}
// Circle of radius r with a shaded sector of deg degrees.
function sectorFigure(deg,r){const R=80,cx=110,cy=100,a=deg*Math.PI/180,ex=cx+R*Math.cos(a),ey=cy-R*Math.sin(a);return svg(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${cx},${cy} L${cx+R},${cy} A${R},${R} 0 0 0 ${ex.toFixed(1)},${ey.toFixed(1)} Z" fill="#7d8f96" fill-opacity="0.3" stroke="${INK}" stroke-width="1.6"/>`+`<path d="M${cx+18},${cy} A18,18 0 0 0 ${(cx+18*Math.cos(a)).toFixed(1)},${(cy-18*Math.sin(a)).toFixed(1)}" fill="none" stroke="${INK}"/>`+tx(cx+32*Math.cos(a/2)+4,cy-32*Math.sin(a/2)+4,deg+'°',{size:12})+tx(cx+R/2,cy+16,String(r))+dot(cx,cy),`A circle with a ${deg}° sector; the radius is ${r}`,230,200);}
// Right triangular prism: right triangle legs a (base) and c (height), hypotenuse d, prism length b.
function rightTriPrism(a,c,d,b){const F=Fig(),L=Math.min(b,1.3*Math.max(a,c)),w=L*Math.cos(15*Math.PI/180),h=L*Math.sin(15*Math.PI/180),A=[0,0],B=[a,0],C=[0,c],o=p=>[p[0]+w,p[1]+h],nrm=Math.atan2(a,c)*180/Math.PI;F.poly([A,B,C]).seg(B,o(B)).seg(C,o(C)).seg(o(B),o(C)).seg(A,o(A),{dash:'4,3',w:1}).seg(o(A),o(B),{dash:'4,3',w:1}).seg(o(A),o(C),{dash:'4,3',w:1}).right(A,0,90,9)
  .dir([a/2,0],270,14,String(a),{size:12}).dir([0,c/2],180,14,String(c),{size:12}).dir([a/2,c/2],nrm,14,String(d),{size:12}).dir([a+w/2,h/2],300,16,String(b),{size:12});return F.render(`Right triangular prism: the triangle has legs ${a} and ${c} and hypotenuse ${d}; the prism is ${b} long`,330,200);}
// Sphere with a radius (or no label).
function sphereFigure(r){const R=70,cx=95,cy=85;return svg(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${cx-R},${cy} A${R},${R*0.32} 0 0 0 ${cx+R},${cy}" fill="none" stroke="${INK}" stroke-width="1.2"/><path d="M${cx-R},${cy} A${R},${R*0.32} 0 0 1 ${cx+R},${cy}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4,3"/>`+dot(cx,cy)+(r?ln(cx,cy,cx+R,cy,{w:1.4})+tx(cx+R/2,cy-6,String(r)):''),r?`A sphere with radius ${r}`:'A ball',190,170);}
// Cylinder labelled with its diameter across the top and its height.
function canFigure(dia,h){const rx=55,ry=14,H=Math.max(90,Math.min(160,h*10)),cx=85,top=40,bot=top+H;return svg(`<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(cx-rx,top,cx-rx,bot)+ln(cx+rx,top,cx+rx,bot)+`<path d="M${cx-rx},${bot} A${rx},${ry} 0 0 0 ${cx+rx},${bot}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+`<rect x="${cx-rx}" y="${top+H*0.25}" width="${2*rx}" height="${H*0.5}" fill="#7d8f96" fill-opacity="0.18" stroke="none"/>`+ln(cx-rx,top-26,cx+rx,top-26,{w:1,start:1,end:1})+tx(cx,top-31,String(dia))+ln(cx+rx+16,top,cx+rx+16,bot,{w:1,start:1,end:1})+tx(cx+rx+22,(top+bot)/2+4,String(h),{anchor:'start'}),`A can (cylinder) with diameter ${dia} and height ${h}; the label covers the curved side`,200,bot+24);}
// Map-style right triangle with named corners: right angle at P0, vertical leg up to P1, horizontal leg right to P2.
function namedRightTriangle(names,left,bottom,hyp,dashHyp){const F=Fig(),A=[0,0],B=[0,8],C=[11,0];F.poly([A,B,C]).right(A,0,90,9).dot(A).dot(B).dot(C);if(dashHyp)F.seg(B,C,{dash:'5,3',w:1.2});
 F.txt([0,-1.5],names[0],{size:11}).txt([0,9.2],names[1],{size:11}).txt([11,-1.5],names[2],{size:11});if(left)F.txt([-0.6,4],left,{anchor:'end',size:12});if(bottom)F.txt([5.5,-1.5],bottom,{size:12});if(hyp)F.txt([6.1,4.6],hyp,{anchor:'start',size:12});return F.render('A right triangle with labelled corners and sides',300,200);}
// Square pyramid (rectangular base a by b, height c), cone (radius a, height b), drawn as line art.
function pyramidFigure(a,b,c){const F=Fig(),A=[0,0],B=[10,0],C=[13,3],D=[3,3],T=[6.5,10],M=[6.5,1.5];F.seg(A,B).seg(B,C).seg(A,T).seg(B,T).seg(C,T).seg(A,D,{dash:'4,3',w:1}).seg(D,C,{dash:'4,3',w:1}).seg(D,T,{dash:'4,3',w:1}).seg(M,T,{dash:'4,3',w:1}).right(M,0,90,7).txt([5,-1.2],String(a)).txt([12.3,1.1],String(b),{anchor:'start'}).txt([6.9,5.5],String(c),{anchor:'start'});return F.render(`A pyramid with a rectangular base ${a} by ${b} and height ${c}`,280,200);}
function coneFigure(r,h){const rx=60,ry=15,cx=80,top=20,base=top+Math.max(110,Math.min(170,h*5));return svg(ln(cx,top,cx-rx,base)+ln(cx,top,cx+rx,base)+`<path d="M${cx-rx},${base} A${rx},${ry} 0 0 0 ${cx+rx},${base}" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${cx-rx},${base} A${rx},${ry} 0 0 1 ${cx+rx},${base}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4,3"/>`+ln(cx,top,cx,base,{w:1,dash:'4,3'})+ln(cx,base,cx+rx,base,{w:1.2})+`<path d="M${cx},${base-9} h9 v9" fill="none" stroke="${INK}"/>`+tx(cx+rx/2,base+16,String(r))+tx(cx+6,(top+base)/2,String(h),{anchor:'start'}),`A cone with radius ${r} and height ${h}`,170,base+30);}
// Cube with a cone (or pyramid) cut into it, and a cylinder holding a sphere.
function cubeWith(a,inner){const F=Fig(),s=8,d=[3.6,2.7],o=p=>[p[0]+d[0],p[1]+d[1]],A=[0,0],B=[s,0],C=[s,s],D=[0,s];F.poly([A,B,C,D]).seg(B,o(B)).seg(C,o(C)).seg(D,o(D)).seg(o(D),o(C)).seg(o(C),o(B));
 if(inner==='cone'){const cx=s/2+d[0]/2,cy=s+d[1]/2;for(let k=0;k<36;k++){const t0=k*10*Math.PI/180,t1=(k+1)*10*Math.PI/180;F.seg([cx+s/2*Math.cos(t0),cy+0.35*s/2*Math.sin(t0)],[cx+s/2*Math.cos(t1),cy+0.35*s/2*Math.sin(t1)],{w:1.2});}F.seg([cx-s/2,cy],[cx,cy-s],{dash:'4,3',w:1}).seg([cx+s/2,cy],[cx,cy-s],{dash:'4,3',w:1});}
 else{const T=[s/2+d[0]/2,s+d[1]/2];F.seg(A,o(A),{dash:'4,3',w:1}).seg(o(A),o(B),{dash:'4,3',w:1}).seg(o(A),o(D),{dash:'4,3',w:1});for(const p of [A,B])F.seg(p,T,{dash:'4,3',w:1.1});F.seg(o(A),T,{dash:'4,3',w:1}).seg(o(B),T,{dash:'4,3',w:1}).poly([A,B,o(B),o(A)],{fill:'rgba(125,143,150,0.25)',w:0.1});}
 F.txt([s/2,-1.2],String(a)).txt([s+d[0]/2+0.5,d[1]/2-0.5],String(a),{anchor:'start'}).txt([s+d[0]+0.5,s/2+d[1]],String(a),{anchor:'start'});return F.render(inner==='cone'?`A cube with edges ${a} with a cone-shaped hole drilled into the top face`:`A cube with edges ${a} containing a pyramid with the same base and height`,260,220);}
function cylinderSphere(a){const R=60,cx=80,top=26,H=2*R,bot=top+H;return svg(ln(cx-R,top,cx-R,bot)+ln(cx+R,top,cx+R,bot)+`<ellipse cx="${cx}" cy="${top}" rx="${R}" ry="13" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${cx-R},${bot} A${R},13 0 0 0 ${cx+R},${bot}" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="${cx}" cy="${top+R}" r="${R-1}" fill="#7d8f96" fill-opacity="0.25" stroke="${INK}" stroke-width="1.4"/>`+tx(cx,top-18,String(a))+tx(cx+R+10,top+R+4,String(a),{anchor:'start'}),`A ball of diameter ${a} inside a cylinder of diameter ${a} and height ${a}`,190,bot+24);}
// Angle split by rays: right=true for a right angle (two parts), otherwise a straight angle (two parts). Labels for the lower (right-hand) and upper parts.
function splitAngleFigure(right,lab1,lab2,deg1){const F=Fig(),O=[0,0];F.seg([-10,0],[10,0],{start:1,end:1});if(right){F.seg(O,[0,9],{end:1}).right(O,0,90,9);}F.seg(O,pt(O,deg1,9),{end:1}).dir(O,deg1/2,right?40:44,lab1,{italic:1,size:13}).dir(O,(deg1+(right?90:180))/2,40,lab2,{italic:1,size:13});return F.render(right?'A right angle divided into two angles by a ray':'A straight angle divided into two angles by a ray',300,170);}
// Construction of a triangle copy: base with arcs at both ends and rays at angles L (left) and R (right).
function constructionBody(L,Rr,rightArc,x0,y0,sc){const rad=d=>d*Math.PI/180,tA=8*Math.sin(rad(Rr))/Math.sin(rad(180-L-Rr)),apex=[1+tA*Math.cos(rad(L)),2+tA*Math.sin(rad(L))],k=Math.min(1,7.4/(apex[1]-2+0.9)),P=([x,y])=>[x0+x*sc,y0-(2+(y-2)*k)*sc],line=(p,q,o)=>ln(...P(p),...P(q),o||{w:1.4}),ext=(p,q,e)=>{const L2=Math.hypot(q[0]-p[0],q[1]-p[1]);return [q[0]+(q[0]-p[0])/L2*e,q[1]+(q[1]-p[1])/L2*e];},arc=(c,r,a0,a1)=>{const pts=[];for(let j=0;j<=12;j++){const a=rad(a0+(a1-a0)*j/12);pts.push(P([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)/k]));}return `<path d="M${pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' L')}" fill="none" stroke="${INK}" stroke-width="1"/>`;};
 let b=line([1,2],[9,2])+line([1,2],ext([1,2],apex,0.8))+line([9,2],ext([9,2],apex,0.8));b+=arc([1,2],1.6,-10,Math.min(L+20,175));if(rightArc)b+=arc([9,2],1.6,Math.max(180-Rr-20,5),190);return b;}
function constructionChoices(list){const sc=13,w=10*sc+20,h=10*sc;let b='';list.forEach(([L,Rr,arcR],i)=>{b+=`<g transform="translate(${(i%2)*(w+12)},${Math.floor(i/2)*(h+10)})">`+tx(8,14,'('+'abcd'[i]+')',{size:12,anchor:'start'})+constructionBody(L,Rr,arcR,4,h-4,sc)+'</g>';});return svg(b,'Four constructions (a) to (d), each with a base, compass arcs and two rays',2*w+12,2*(h+10));}
const moneyC=c=>'$'+comma((c/100).toFixed(2));
// Three fixed sample points for checking a formula answer by evaluation.
function fsamples(vars,fn){const pools=[[2.7,1.9,3.4,1.3],[4.1,2.3,1.7,5.2],[1.6,3.8,2.9,2.2]];return pools.map(p=>{const env={};vars.forEach((v,i)=>{env[v]=p[i];});return [env,fn(env)];});}
// Text for coef·vars over a denominator: exps positive go up, negative go down.
function ratioText(num,den,exps){const sgn=num<0?'−':'',top=Object.keys(exps).filter(k=>exps[k]>0).sort().map(k=>[k,exps[k]]),bot=Object.keys(exps).filter(k=>exps[k]<0).sort().map(k=>[k,-exps[k]]),T=monoText(Math.abs(num),top),B=monoText(den,bot);return sgn+(B==='1'?T:`${T}/${/^\d+[a-z]|[a-z][⁰¹²³⁴⁵⁶⁷⁸⁹]*[a-z]/.test(B)?'('+B+')':B}`);}
// Expression reader for formula and root answers: numbers, single-letter variables, π, √, + − × ÷ ^ and implicit multiplication.
function parseExpr(src,allowed){const s=String(src).replace(/[−–]/g,'-').replace(/[×·*]/g,'*').replace(/÷/g,'/').replace(/\bpi\b/gi,'π').replace(/sqrt/gi,'√').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,m=>'^'+[...m].map(ch=>UNSUP[ch]).join('')).replace(/\s+/g,'');if(!s||s.length>80)return null;let i=0;
 const peek=()=>s[i],starts=ch=>ch!==undefined&&(/[\d.a-zA-Zπ√(]/.test(ch));
 function atom(){const ch=s[i];if(ch==='('){i++;const v=expr();if(!v||s[i]!==')')return null;i++;return v;}
  if(ch==='√'){i++;const v=power();if(!v)return null;return e=>Math.sqrt(v(e));}
  if(ch==='π'){i++;return ()=>Math.PI;}
  const m=s.slice(i).match(/^\d+(?:\.\d+)?/);if(m){i+=m[0].length;const v=Number(m[0]);return ()=>v;}
  if(/[a-zA-Z]/.test(ch||'')){if(!allowed.includes(ch))return null;i++;return e=>e[ch];}return null;}
 function power(){const b=atom();if(!b)return null;if(s[i]==='^'){i++;const e2=unary();if(!e2)return null;return e=>Math.pow(b(e),e2(e));}return b;}
 function unary(){if(s[i]==='-'){i++;const v=unary();return v&&(e=>-v(e));}if(s[i]==='+'){i++;return unary();}return power();}
 function term(){let v=unary();if(!v)return null;for(;;){const ch=peek();if(ch==='*'||ch==='/'){i++;const r=unary();if(!r)return null;const l=v;v=ch==='*'?e=>l(e)*r(e):e=>l(e)/r(e);}else if(starts(ch)){const r=power();if(!r)return null;const l=v;v=e=>l(e)*r(e);}else return v;}}
 function expr(){let v=term();if(!v)return null;while(s[i]==='+'||s[i]==='-'){const op=s[i++];const r=term();if(!r)return null;const l=v;v=op==='+'?e=>l(e)+r(e):e=>l(e)-r(e);}return v;}
 const v=expr();return v&&i===s.length?v:null;}
const near=(x,y)=>Math.abs(x-y)<=1e-7*Math.max(1,Math.abs(y));
// Radicals in the response must be simplified: no √n with a square factor.
const rootsSimplified=s=>[...String(s).matchAll(/√\(?(\d+)/g)].every(m=>{const n=Number(m[1]);for(let k=2;k*k<=n;k++)if(n%(k*k)===0)return false;return n>1;});
// Monomial parser: coefficient digits then letters with optional exponents; returns [coef,{var:exp}] or null.
function parseMono(t){const m=String(t).match(/^(\d*)((?:[a-z](?:\^\d+)?)*)$/);if(!m||(!m[1]&&!m[2]))return null;const vars={};for(const v of m[2].matchAll(/([a-z])(?:\^(\d+))?/g)){if(v[1] in vars)return null;const e=v[2]===undefined?1:Number(v[2]);if(!e)return null;vars[v[1]]=e;}return [m[1]===''?1:Number(m[1]),vars];}
const monoKey=vars=>Object.keys(vars).filter(k=>vars[k]).sort().map(k=>k+vars[k]).join('');
function parsePolyTerms(r){if(!r||!/^[+-]?[^+-]/.test(r))return null;const got={};for(const tm of r.match(/[+-]?[^+-]+/g)){const sign=tm[0]==='-'?-1:1,mono=parseMono(tm.replace(/^[+-]/,''));if(!mono||!mono[0])return null;const k=monoKey(mono[1]);if(k in got)return null;got[k]=sign*mono[0];}return got;}
const supToCaret=s=>String(s).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,m=>'^'+[...m].map(ch=>UNSUP[ch]).join(''));
// Batch 13 helpers.
// Stem-and-leaf table: rows [[stem,[leaves]],...].
function stemLeafFigure(rows){const rh=26,W=260,H=rh*(rows.length+1)+12;let b=tx(40,20,'Stem',{size:13})+tx(70,20,'Leaf',{size:13,anchor:'start'})+ln(10,28,W-10,28,{w:1.4})+ln(58,8,58,H-4,{w:1.4});rows.forEach(([s,l],i)=>{b+=tx(40,28+rh*(i+1)-6,String(s),{size:14})+tx(70,28+rh*(i+1)-6,l.join('  '),{size:14,anchor:'start'});});return svg(b,'Stem-and-leaf plot: '+rows.map(([s,l])=>`${s} | ${l.join(' ')}`).join('; '),W,H);}
// Box-and-whisker plot over a number line from lo to hi labelled every `step`.
function boxPlotBody(lo,hi,step,five,y0){const [mn,q1,md,q3,mx]=five,W=440,X=v=>30+(v-lo)*(W-60)/(hi-lo);let b=ln(14,y0+30,W-14,y0+30,{start:1,end:1});for(let v=lo;v<=hi;v++)b+=ln(X(v),y0+26,X(v),y0+34,{w:v%step===0?1.2:0.6})+(v%step===0?tx(X(v),y0+48,String(v),{size:11}):'');
 if(five.length)b+=ln(X(mn),y0,X(q1),y0,{w:1.6})+ln(X(q3),y0,X(mx),y0,{w:1.6})+`<rect x="${X(q1).toFixed(1)}" y="${y0-12}" width="${(X(q3)-X(q1)).toFixed(1)}" height="24" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(X(md),y0-12,X(md),y0+12,{w:1.6})+[mn,q1,md,q3,mx].map(v=>dot(X(v),y0)).join('');return b;}
function boxPlotFigure(lo,hi,step,five,label){return svg(boxPlotBody(lo,hi,step,five,30),label,440,90);}
// Double-line graph of two series over dates 11–20.
function doubleLineGraph(dates,s1,s2,n1,n2,lo,hi){const W=420,H=260,X=d=>60+(d-dates[0])*32,Y=v=>200-(v-lo)*150/(hi-lo);let b='';for(let v=lo;v<=hi;v++)b+=ln(60,Y(v),X(dates[dates.length-1])+10,Y(v),{w:0.4,color:'#c3cacf'})+tx(52,Y(v)+4,String(v),{size:11,anchor:'end'});dates.forEach(d=>{b+=tx(X(d),220,String(d),{size:11});});
 b+=ln(60,Y(lo)+8,60,Y(hi)-8,{w:1.4})+ln(52,Y(lo),X(dates[dates.length-1])+14,Y(lo),{w:1.4})+tx(W/2,246,'April date',{size:12})+tx(18,110,'°F',{size:12});
 const path=(s,dash)=>`<polyline points="${s.map((v,i)=>X(dates[i]).toFixed(1)+','+Y(v).toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"${dash?' stroke-dasharray="6,4"':''}/>`;b+=path(s1,false)+path(s2,true)+s1.map((v,i)=>dot(X(dates[i]),Y(v))).join('')+s2.map((v,i)=>`<circle cx="${X(dates[i]).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.5" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`).join('');
 b+=`<rect x="300" y="18" width="110" height="46" fill="#fff" stroke="${INK}"/>`+ln(308,32,336,32,{w:1.8})+dot(322,32)+tx(344,36,n1,{size:12,anchor:'start'})+ln(308,52,336,52,{w:1.8,dash:'6,4'})+`<circle cx="322" cy="52" r="3.5" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`+tx(344,56,n2,{size:12,anchor:'start'});
 return svg(b,`Double-line graph of high temperatures in ${n1} (solid) and ${n2} (dashed) for April ${dates[0]} to ${dates[dates.length-1]}`,W,H);}
// Polygon outline from points (source 0–10 or −20..20 grids).
function outlineFigure(P,label){const F=Fig();F.poly(P);return F.render(label,220,180);}
// Circle with centre P and points Q, R, S on it; segments as in the source (PS, PR, PQ, QR, QS).
function circlePointsFigure(x,names){const F=Fig(),R=9,pnt=d=>[R*Math.cos(d*Math.PI/180),R*Math.sin(d*Math.PI/180)],[p,q,r,s]=names,S=pnt(x),Rr=pnt(x+180),Q=pnt(x+240),O=[0,0];for(let k=0;k<72;k++)F.seg(pnt(5*k),pnt(5*k+5),{w:1.5});F.seg(O,S).seg(O,Rr).seg(O,Q).seg(Q,Rr).seg(Q,S).dot(O).txt([-0.6,0.9],p,{italic:1}).txt(pnt(x+240).map(v=>v*1.2),q,{italic:1}).txt(pnt(x+180).map(v=>v*1.2),r,{italic:1}).txt(pnt(x).map(v=>v*1.2),s,{italic:1});return F.render(`A circle with centre ${p} and points ${q}, ${r} and ${s} on the circle`,240,220);}
// Circle with an inscribed square (both diagonals) or octagon (four diameters), labelled points.
function inscribedFigure(octagon){const F=Fig(),R=9,pnt=d=>[R*Math.cos(d*Math.PI/180),R*Math.sin(d*Math.PI/180)];for(let k=0;k<72;k++)F.seg(pnt(5*k),pnt(5*k+5),{w:1.4});
 if(!octagon){const P=[90,180,0,270].map(pnt);F.seg(P[0],P[3]).seg(P[1],P[2]).poly([P[0],P[1],P[3],P[2]]).dot([0,0]);[['A',90],['B',180],['C',0],['D',270]].forEach(([n,d])=>F.txt(pnt(d).map(v=>v*1.15),n,{italic:1}));F.txt([-1.1,-1.3],'O',{italic:1});return F.render('A square ABDC inscribed in a circle with centre O; diagonals AD and BC meet at O',240,220);}
 const L=[['A',90],['B',45],['C',0],['D',315],['E',270],['F',225],['G',180],['H',135]];for(let k=0;k<4;k++)F.seg(pnt(L[k][1]),pnt(L[k][1]+180),{w:1.1});L.forEach(([,d],k)=>F.seg(pnt(d),pnt(L[(k+1)%8][1])));L.forEach(([n,d])=>F.txt(pnt(d).map(v=>v*1.15),n,{italic:1}));F.dot([0,0]).txt([0.9,-1.3],'O',{italic:1});return F.render('A regular octagon ABCDEFGH inscribed in a circle with centre O and four diameters drawn',240,220);}
// Labelled right triangle for "find m": legs a (vertical) and b (horizontal), hypotenuse c, with one label replaced by m; orientation 1–3.
function findMFigure(a,b,c,k,orient){const F=Fig(),lab=i=>k===i?'m':String([a,b,c][i-1]);let A,B,C;if(orient===1){A=[b,0];B=[b,a];C=[0,0];}else if(orient===2){A=[0,0];B=[0,a];C=[b,0];}else{A=[0,a];B=[0,0];C=[b,a];}
 F.poly([A,B,C]).right(A,Math.atan2(B[1]-A[1],B[0]-A[0])*180/Math.PI,Math.atan2(C[1]-A[1],C[0]-A[0])*180/Math.PI,9);const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2],cen=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3],out=(p,q)=>{const m=mid(p,q),d=Math.atan2(m[1]-cen[1],m[0]-cen[0])*180/Math.PI;return [m,d];};
 for(const [p,q,i] of [[A,B,1],[A,C,2],[B,C,3]]){const [m,d]=out(p,q);F.dir(m,d,14,lab(i),{size:12,italic:k===i});}return F.render('A right triangle with two sides labelled and the third labelled m',300,190);}
// Right triangle with the right angle at the top, legs a and b, base c (altitude style picture from the source).
function apexRightTriangle(a,b){const F=Fig(),c=Math.hypot(a,b),x=a*a/c,h=a*b/c,L=[0,0],Rt=[c,0],T=[x,h];F.poly([L,Rt,T]).right(T,Math.atan2(-h,-x)*180/Math.PI,Math.atan2(-h,c-x)*180/Math.PI,9).dir([x/2,h/2],135,12,String(a),{size:12}).dir([(x+c)/2,h/2],45,12,String(b),{size:12}).dir([c/2,0],270,14,'c',{size:12,italic:1});return F.render(`A right triangle with legs ${a} and ${b} and hypotenuse c`,300,170);}
// Proof pictures: square of side a + b with an inner tilted square; Garfield trapezoid; altitude to the hypotenuse.
function proofFigure(kind){const F=Fig();if(kind===2){const a=3,b=5,s=a+b;F.poly([[0,0],[s,0],[s,s],[0,s]]).poly([[b,0],[s,b],[a,s],[0,a]]);[[a/2,s+0.6,'a'],[a+b/2,s+0.6,'b'],[b/2,-0.7,'b'],[b+a/2,-0.7,'a'],[-0.6,a+b/2,'b'],[-0.6,a/2,'a'],[s+0.6,b+a/2,'a'],[s+0.6,b/2,'b'],[(b+s)/2-0.7,b/2+0.3,'c'],[(s+a)/2-0.4,(b+s)/2-0.7,'c'],[a/2+0.7,(s+a)/2-0.3,'c'],[b/2+0.4,a/2+0.7,'c']].forEach(([x,y,t])=>F.txt([x,y],t,{italic:1}));return F.render('A square with sides a + b containing a tilted square with sides c',240,220);}
 if(kind===3){const a=3,b=5,P=[0,0],A=[0,a],M=[b,0],Q=[a+b,0],B=[a+b,b];F.poly([P,Q,B,A]).seg(A,M).seg(M,B).right(P,0,90,9).right(Q,90,180,9).right(M,Math.atan2(b,a)*180/Math.PI,Math.atan2(a,-b)*180/Math.PI,9);[[-0.5,a/2,'a'],[b/2,-0.6,'b'],[b+a/2,-0.6,'a'],[a+b+0.5,b/2,'b'],[b/2+0.3,a/2+0.5,'c'],[b+a/2-0.6,b/2+0.3,'c']].forEach(([x,y,s])=>F.txt([x,y],s,{italic:1}));return F.render('A trapezoid with parallel sides a and b and height a + b, made of two right triangles with legs a and b and an isosceles right triangle with legs c',260,200);}
 const A=[0,0],B=[10,0],C=[3.6,4.8],D=[3.6,0];F.poly([A,B,C]).seg(C,D,{dash:'4,3',w:1.1}).right(D,0,90,8).right(C,Math.atan2(-4.8,-3.6)*180/Math.PI,Math.atan2(-4.8,6.4)*180/Math.PI,8);[[A,'A',[-0.4,-0.4]],[B,'B',[0.4,-0.4]],[C,'C',[0,0.5]],[D,'D',[0,-0.6]]].forEach(([p,s,o])=>F.txt([p[0]+o[0],p[1]+o[1]],s,{italic:1}));[[1.5,2.8,'b'],[7.4,2.8,'a'],[1.8,-0.6,'f'],[6.8,-0.6,'e']].forEach(([x,y,s])=>F.txt([x,y],s,{italic:1}));return F.render('Right triangle ABC with altitude CD to the hypotenuse; the hypotenuse c is split into e and f',300,180);}
// Segment AB for bisecting, and an angle for bisecting.
function segmentFigure(vertical){const F=Fig();if(vertical)F.seg([5,0],[5,10]).dot([5,0]).dot([5,10]);else F.seg([0,5],[10,5]).dot([0,5]).dot([10,5]);return F.render('A line segment to bisect',220,200);}
function angleToBisect(deg){const F=Fig();F.seg([0,0],[20,0]).seg([0,0],pt([0,0],deg,20));return F.render(`An angle of about ${deg}° to bisect`,300,170);}
function toRoman(n){const T=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const [v,r] of T)while(n>=v){s+=r;n-=v;}return s;}
// ---------- Course 1 (ExamView) helpers ----------
// Column arithmetic: rows right-aligned in a fixed-width font, the operator before the last row and a rule
// beneath; an optional result row sits under the rule (used when the sum is given and an addend is missing).
function stackFigure(rows,op,result,label){const W=220,cw=11.5,x=W-30,lh=26;let b='',y=30;
 rows.forEach((r,i)=>{b+=`<text x="${x}" y="${y}" font-size="19" text-anchor="end" font-family="'Courier New',monospace" fill="${INK}">${esc(r)}</text>`;if(i===rows.length-1&&op)b+=`<text x="${(x-cw*Math.max(...rows.map(s=>s.length))-16).toFixed(1)}" y="${y}" font-size="19" text-anchor="middle" fill="${INK}">${esc(op)}</text>`;y+=lh;});
 const wid=cw*Math.max(...rows.map(s=>s.length),result?String(result).length:0)+30;b+=ln(x-wid,y-lh+8,x+4,y-lh+8,{w:1.6});
 if(result!==undefined){b+=`<text x="${x}" y="${y+4}" font-size="19" text-anchor="end" font-family="'Courier New',monospace" fill="${INK}">${esc(String(result))}</text>`;y+=lh;}
 return svg(b,label,W,y-6);}
// Long division: the divisor, a bracket and an overline over the dividend.
function longDivFigure(divisor,dividend,label){const ds=String(divisor),dv=String(dividend),cw=11.5,x0=20+cw*ds.length,W=x0+cw*dv.length+40;
 const b=`<text x="${(x0-6).toFixed(1)}" y="46" font-size="19" text-anchor="end" font-family="'Courier New',monospace" fill="${INK}">${esc(ds)}</text>`+
  `<path d="M${(x0-2).toFixed(1)},24 Q${(x0+6).toFixed(1)},38 ${(x0-2).toFixed(1)},52" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(x0-2,24,x0+cw*dv.length+10,24,{w:1.6})+
  `<text x="${(x0+6).toFixed(1)}" y="46" font-size="19" text-anchor="start" font-family="'Courier New',monospace" fill="${INK}">${esc(dv)}</text>`;
 return svg(b,label||`${dv} divided by ${ds}, written with a long-division bracket`,W,64);}
// The example of three ways to write a division: bracket, division sign and fraction (15 divided by 5).
function divFormsExample(){const M="'Courier New',monospace",T=(x,y,s,a='start')=>`<text x="${x}" y="${y}" font-size="19" text-anchor="${a}" font-family="${M}" fill="${INK}">${esc(s)}</text>`;
 const b=T(26,46,'5','end')+`<path d="M28,24 Q36,38 28,52" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(28,24,64,24,{w:1.6})+T(36,46,'15')+T(110,46,'15 ÷ 5')+T(232,34,'15','middle')+ln(216,40,248,40,{w:1.5})+T(232,62,'5','middle');
 return svg(b,'15 divided by 5 written three ways: with a long-division bracket, as 15 ÷ 5, and as the fraction 15 over 5',270,72);}
// Bar graph of one value per category (scores by day).
function barGraph(cats,vals,title,yLabel,top,step){const W=380,H=240,x0=50,y0=200,h=160,bw=(W-x0-20)/cats.length,Y=v=>y0-h*v/top;let b=tx(W/2,18,title,{size:14});
 for(let v=0;v<=top;v+=step)b+=ln(x0,Y(v),W-12,Y(v),{color:'#c9d3d6',w:1})+tx(x0-8,Y(v)+4,String(v),{size:11,anchor:'end'});
 cats.forEach((c,i)=>{const x=x0+i*bw+bw*0.18;b+=`<rect x="${x.toFixed(1)}" y="${Y(vals[i]).toFixed(1)}" width="${(bw*0.64).toFixed(1)}" height="${(y0-Y(vals[i])).toFixed(1)}" fill="#7d8f96" fill-opacity="0.55" stroke="${INK}" stroke-width="1.2"/>`+tx(x+bw*0.32,y0+16,c,{size:11});});
 b+=ln(x0,y0,W-12,y0,{w:1.5})+ln(x0,y0,x0,y0-h-8,{w:1.5})+`<text x="14" y="${y0-h/2}" font-size="12" text-anchor="middle" transform="rotate(-90 14 ${y0-h/2})" fill="${INK}">${esc(yLabel)}</text>`;
 return svg(b,`${title}: bar graph of ${cats.map((c,i)=>c+' '+vals[i]).join(', ')}`,W,H);}
const FACT_OPS={'+':'+','-':'−','−':'−','–':'−','x':'×','×':'×','*':'×','·':'×','÷':'÷','/':'÷'};
// Facts written as "a + b = c", separated by semicolons, commas, line breaks or "and"; null if any part is not a fact.
function parseFacts(s){const parts=String(s).split(/;|\n|,|\band\b/i).map(x=>x.trim()).filter(Boolean);if(!parts.length||parts.length>8)return null;const out=[];
 for(const p of parts){const m=p.replace(/\s+/g,'').match(/^(\d{1,6})([+\-−–x×*·÷\/])(\d{1,6})=(\d{1,7})$/i);if(!m)return null;out.push(`${Number(m[1])}${FACT_OPS[m[2].toLowerCase()]}${Number(m[3])}=${Number(m[4])}`);}return out;}
const factKey=(x,op,y,z)=>`${x}${op}${y}=${z}`;
function familyFacts(a,b,mult){const c=mult?a*b:a+b,o=mult?'×':'+',u=mult?'÷':'−';return [factKey(a,o,b,c),factKey(b,o,a,c),factKey(c,u,a,b),factKey(c,u,b,a)];}
const factShow=k=>k.replace(/([+−×÷=])/g,' $1 ');
// Two-digit-or-more digit columns subtracted without regrouping (the smaller digit from the larger in each column).
function noRegroup(a,b){const A=String(a),B=String(b).padStart(A.length,'0');return Number([...A].map((d,i)=>Math.abs(Number(d)-Number(B[i]))).join(''));}
// Divisor and quotient pairs whose product is a whole number of thousands (two-digit divisor, three-digit quotient).
const C1_THOUSANDS=(()=>{const out=[];for(let d=12;d<=48;d++)for(let q=101;q<=999;q++)if(d*q%1000===0&&d*q<10000&&q%100)out.push([d,q]);return out;})();
// ---------- Course 1, Batch C1-2 helpers ----------
const SHADE='#7d8f96';
// A rows × cols grid with whole columns shaded from the left.
function gridFigure(rows,cols,shadedCols,label){const s=34,x0=20,y0=14;let b='';for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)b+=`<rect x="${x0+c*s}" y="${y0+r*s}" width="${s}" height="${s}" fill="${c<shadedCols?SHADE:'none'}" fill-opacity="0.45" stroke="${INK}" stroke-width="1.5"/>`;return svg(b,label,x0*2+cols*s,y0*2+rows*s);}
// A strip of n equal parts; the listed parts are shaded.
function stripFigure(n,shaded,label){const s=44,x0=12;let b='';for(let i=0;i<n;i++)b+=`<rect x="${x0+i*s}" y="10" width="${s}" height="40" fill="${shaded.includes(i)?SHADE:'none'}" fill-opacity="0.45" stroke="${INK}" stroke-width="1.6"/>`;return svg(b,label,x0*2+n*s,60);}
// A circle cut into n equal sectors; the listed sectors are shaded.
function sectorsFigure(n,shaded,label){const R=70,cx=90,cy=85;let b='';for(let i=0;i<n;i++){const a0=2*Math.PI*i/n-Math.PI/2,a1=2*Math.PI*(i+1)/n-Math.PI/2,p=a=>[cx+R*Math.cos(a),cy+R*Math.sin(a)];const [x0,y0]=p(a0),[x1,y1]=p(a1);
 b+=`<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${shaded.includes(i)?SHADE:'none'}" fill-opacity="0.45" stroke="${INK}" stroke-width="1.6"/>`;}return svg(b,label,180,170);}
// A line, a segment or a ray between x1 and x2 at height y.
function linear(kind,x1,x2,y){return kind==='line'?ln(x1,y,x2,y,{w:2,start:1,end:1}):kind==='ray'?ln(x1,y,x2,y,{w:2,end:1})+`<circle cx="${x1}" cy="${y}" r="4" fill="${INK}"/>`:ln(x1,y,x2,y,{w:2})+`<circle cx="${x1}" cy="${y}" r="4" fill="${INK}"/><circle cx="${x2}" cy="${y}" r="4" fill="${INK}"/>`;}
function threeFigures(kinds){let b='';kinds.forEach((k,i)=>{b+=tx(16,34+i*40,`(${'abc'[i]})`,{size:13})+linear(k,44,300,30+i*40);});return svg(b,`Three figures: (a) a ${kinds[0]}, (b) a ${kinds[1]}, (c) a ${kinds[2]}`,320,140);}
// A figure through two labelled points; for a ray the endpoint is the first point.
function twoPointFigure(kind,P,Q,rev){let b=kind==='line'?ln(20,40,260,40,{w:2,start:1,end:1}):kind==='segment'?ln(60,40,220,40,{w:2}):rev?ln(220,40,20,40,{w:2,end:1}):ln(60,40,260,40,{w:2,end:1});
 b+=`<circle cx="60" cy="40" r="4" fill="${INK}"/><circle cx="220" cy="40" r="4" fill="${INK}"/>`+tx(60,64,P,{italic:1,size:15})+tx(220,64,Q,{italic:1,size:15});
 return svg(b,kind==='ray'?`A ray with endpoint ${rev?Q:P} passing through ${rev?P:Q}`:`A ${kind} through points ${P} and ${Q}`,290,76);}
// Three points on a ray that starts at the first point.
function pointsOnRay(L){const xs=[40,150,260];let b=ln(40,40,330,40,{w:2,end:1});xs.forEach((x,i)=>{b+=`<circle cx="${x}" cy="40" r="4" fill="${INK}"/>`+tx(x,64,L[i],{italic:1,size:15});});return svg(b,`A ray that starts at ${L[0]} and passes through ${L[1]} and ${L[2]}`,350,76);}
// An inch ruler (den marks per inch) or a centimetre ruler with millimetres; a bar from 0 or a marker.
function c1Ruler(o){const inches=o.unit==='in',len=o.len,den=inches?o.den:10,u=inches?84:84,x0=20,top=40,W=x0*2+len*u+14;let b='';
 if(o.bar!==undefined)b+=ln(x0,18,x0+u*o.bar,18,{w:4});
 b+=`<path d="M${x0},${top} H${x0+len*u} l4,12 l-4,12 l4,12 l-4,12 L${x0},${top+48} Z" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
 for(let k=1;k<len*den;k++){const tl=k%den===0?24:inches?(k%(den/2)===0?17:den>=8&&k%(den/4)===0?12:7):(k%5===0?15:8);b+=ln(x0+k*u/den,top,x0+k*u/den,top+tl,{w:1});}
 for(let i=0;i<=len;i++)b+=tx(x0+i*u+(i===0?6:i===len?-8:0),top+40,String(i),{size:13});b+=tx(x0+len*u-36,top+42,inches?'in.':'cm',{size:12});
 if(o.marker!==undefined){const x=x0+u*o.marker;b+=ln(x,6,x,top-2,{w:1.8,end:1});}
 return svg(b,o.label,W,top+56);}
// A round dial (thermometer or scale) with a needle.
function dialFigure(lo,hi,step,major,value,unit,label){const cx=130,cy=125,R=100,a0=-225,a1=45,ang=v=>(a0+(v-lo)/(hi-lo)*(a1-a0))*Math.PI/180,P=(v,r)=>[cx+r*Math.cos(ang(v)),cy+r*Math.sin(ang(v))];
 let b=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 for(let v=lo;v<=hi;v+=step){const big=(v-lo)%major===0,[x1,y1]=P(v,R),[x2,y2]=P(v,R-(big?14:7));b+=ln(x1,y1,x2,y2,{w:big?1.6:1});if(big){const [x,y]=P(v,R-28);b+=tx(x,y+4,minus(v),{size:12});}}
 const [nx,ny]=P(value,R-20);b+=ln(cx,cy,nx,ny,{w:2.4,end:1})+`<circle cx="${cx}" cy="${cy}" r="4" fill="${INK}"/>`+tx(cx,cy+R-24,unit,{size:13});
 return svg(b,label,260,250);}
// A vertical thermometer from lo to hi with marks every step and labels every 10; filled to value.
function thermoFigure(lo,hi,step,value,label){const x=70,top=34,H=300,Y=v=>top+H*(hi-v)/(hi-lo);let b=`<rect x="${x-9}" y="${top-8}" width="18" height="${H+16}" rx="9" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="${x}" cy="${top+H+24}" r="16" fill="${SHADE}" fill-opacity="0.8" stroke="${INK}" stroke-width="1.6"/>`;
 b+=`<rect x="${x-5}" y="${Y(value).toFixed(1)}" width="10" height="${(top+H+12-Y(value)).toFixed(1)}" fill="${SHADE}" fill-opacity="0.8"/>`;
 for(let v=lo;v<=hi;v+=step){const big=(v-lo)%10===0;b+=ln(x+12,Y(v),x+12+(big?18:10),Y(v),{w:big?1.6:1});if(big)b+=tx(x+40,Y(v)+4,minus(v),{size:13,anchor:'start'});}
 b+=tx(x,top-16,'°F',{size:13});return svg(b,label,170,top+H+50);}
// Polygons with side labels: a right triangle, an isosceles triangle, a rectangle, a square.
function sideLabelled(kind,s,unit){const lab=v=>`${v} ${unit}`;
 if(kind==='right'){const [a,b2,c2]=s,sc=150/Math.max(a,b2),A=[40,30+a*sc],B=[40+b2*sc,30+a*sc],C=[40,30];return svg(`<polygon points="${A} ${B} ${C}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+ln(A[0],A[1]-12,A[0]+12,A[1]-12,{w:1})+ln(A[0]+12,A[1]-12,A[0]+12,A[1],{w:1})+tx(A[0]-8,(A[1]+C[1])/2,lab(a),{size:13,anchor:'end'})+tx((A[0]+B[0])/2,A[1]+20,lab(b2),{size:13})+tx((B[0]+C[0])/2+12,(B[1]+C[1])/2-6,lab(c2),{size:13,anchor:'start'}),`Right triangle with sides ${lab(a)}, ${lab(b2)} and ${lab(c2)}`,40+b2*sc+120,30+a*sc+40);}
 if(kind==='iso'){const [leg,base]=s,h=Math.sqrt(leg*leg-base*base/4),sc=150/Math.max(base,h),A=[40,30+h*sc],B=[40+base*sc,30+h*sc],C=[40+base*sc/2,30];return svg(`<polygon points="${A} ${B} ${C}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+tx((A[0]+C[0])/2-10,(A[1]+C[1])/2,lab(leg),{size:13,anchor:'end'})+tx((B[0]+C[0])/2+10,(B[1]+C[1])/2,lab(leg),{size:13,anchor:'start'})+tx((A[0]+B[0])/2,A[1]+20,lab(base),{size:13}),`Isosceles triangle with sides ${lab(leg)}, ${lab(leg)} and ${lab(base)}`,40+base*sc+90,30+h*sc+40);}
 const [w,h]=kind==='square'?[s[0],s[0]]:s,sc=170/Math.max(w,h),W=w*sc,H=h*sc;return svg(`<rect x="30" y="20" width="${W.toFixed(1)}" height="${H.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+tx(30+W/2,20+H+20,lab(w),{size:13})+(kind==='square'?'':tx(30+W+8,20+H/2+4,lab(h),{size:13,anchor:'start'})),kind==='square'?`Square with side ${lab(w)}`:`Rectangle ${lab(w)} by ${lab(h)}`,30+W+90,20+H+36);}
// A two-column table drawn as SVG.
function tableFigure(head,rows,label,w=[110,110]){const rh=26,W=w[0]+w[1]+2;let b=`<rect x="1" y="1" width="${W-2}" height="${rh*(rows.length+1)}" fill="none" stroke="${INK}" stroke-width="1.5"/>`+ln(1+w[0],1,1+w[0],1+rh*(rows.length+1),{w:1.2});
 [head,...rows].forEach((r,i)=>{if(i)b+=ln(1,1+rh*i,W-1,1+rh*i,{w:i===1?1.6:1});b+=`<text x="${1+w[0]/2}" y="${1+rh*i+18}" font-size="13" text-anchor="middle" fill="${INK}"${i?'':' font-weight="bold"'}>${esc(r[0])}</text><text x="${1+w[0]+w[1]/2}" y="${1+rh*i+18}" font-size="13" text-anchor="middle" fill="${INK}"${i?'':' font-weight="bold"'}>${esc(r[1])}</text>`;});
 return svg(b,label,W+2,rh*(rows.length+1)+4);}
// Four small frequency tables labelled (a)-(d) side by side.
function fourTables(head,cats,sets,label){const cw=150,rh=22;let b='';sets.forEach((s,k)=>{const x=k*(cw+14)+4;b+=tx(x+cw/2,14,`(${'abcd'[k]})`,{size:13})+`<rect x="${x}" y="22" width="${cw}" height="${rh*(cats.length+1)}" fill="none" stroke="${INK}" stroke-width="1.3"/>`+ln(x+cw*0.6,22,x+cw*0.6,22+rh*(cats.length+1),{w:1});
  [[head[0],head[1]],...cats.map((c,i)=>[c,String(s[i])])].forEach((r,i)=>{if(i)b+=ln(x,22+rh*i,x+cw,22+rh*i,{w:1});b+=tx(x+cw*0.3,22+rh*i+15,r[0],{size:11})+tx(x+cw*0.8,22+rh*i+15,r[1],{size:11});});});
 return svg(b,label,4*(cw+14),30+rh*(cats.length+1));}
// A histogram: adjacent bars over interval labels.
function histogramFigure(cats,vals,title,yLabel,top,step){const W=380,H=250,x0=50,y0=200,h=160,bw=(W-x0-20)/cats.length,Y=v=>y0-h*v/top;let b=tx(W/2,18,title,{size:14});
 for(let v=0;v<=top;v+=step)b+=ln(x0,Y(v),W-12,Y(v),{color:'#c9d3d6',w:1})+tx(x0-8,Y(v)+4,String(v),{size:11,anchor:'end'});
 cats.forEach((c,i)=>{const x=x0+i*bw;b+=`<rect x="${x.toFixed(1)}" y="${Y(vals[i]).toFixed(1)}" width="${bw.toFixed(1)}" height="${(y0-Y(vals[i])).toFixed(1)}" fill="${SHADE}" fill-opacity="0.55" stroke="${INK}" stroke-width="1.2"/>`+tx(x+bw/2,y0+16,c,{size:11});});
 b+=ln(x0,y0,W-12,y0,{w:1.5})+ln(x0,y0,x0,y0-h-8,{w:1.5})+`<text x="14" y="${y0-h/2}" font-size="12" text-anchor="middle" transform="rotate(-90 14 ${y0-h/2})" fill="${INK}">${esc(yLabel)}</text>`;
 return svg(b,`${title}: histogram of ${cats.map((c,i)=>c+' '+vals[i]).join(', ')}`,W,H);}
const SEG_LETTERS=[['A','B','C'],['P','Q','R'],['X','Y','Z'],['D','E','F'],['L','M','N']];
const twoLetters=s=>String(s).toUpperCase().replace(/[^A-Z]/g,'');
// ---------- Course 1, Batch C1-3 helpers ----------
const PLACE_NAMES=['ones','tens','hundreds','thousands','ten thousands','hundred thousands','millions','ten millions','hundred millions','billions','ten billions','hundred billions','trillions'];
// A line graph through (x, y) points with labelled axes.
function lineGraph(xs,ys,o){const W=400,H=260,x0=56,y0=210,w=W-x0-24,h=170,X=v=>x0+w*(v-o.xmin)/(o.xmax-o.xmin),Y=v=>y0-h*(v-o.ymin)/(o.ymax-o.ymin);let b=tx(W/2,18,o.title,{size:14});
 for(let v=o.ymin;v<=o.ymax+1e-9;v+=o.ystep)b+=ln(x0,Y(v),x0+w,Y(v),{color:'#c9d3d6',w:1})+tx(x0-8,Y(v)+4,o.yfmt?o.yfmt(v):String(v),{size:11,anchor:'end'});
 for(let v=o.xmin;v<=o.xmax+1e-9;v+=o.xstep)b+=ln(X(v),y0,X(v),y0+5,{w:1})+tx(X(v),y0+18,o.xfmt?o.xfmt(v):String(v),{size:11});
 b+=ln(x0,y0,x0+w,y0,{w:1.5})+ln(x0,y0,x0,y0-h-6,{w:1.5})+tx(x0+w/2,y0+38,o.xLabel,{size:12})+`<text x="14" y="${y0-h/2}" font-size="12" text-anchor="middle" transform="rotate(-90 14 ${y0-h/2})" fill="${INK}">${esc(o.yLabel)}</text>`;
 b+=`<polyline points="${xs.map((x,i)=>X(x).toFixed(1)+','+Y(ys[i]).toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="2"/>`+(o.dots?xs.map((x,i)=>dot(X(x),Y(ys[i]))).join(''):'');
 return svg(b,o.label,W,H+12);}
// A number line from lo to hi (whole numbers labelled) with lettered points at given values.
function letteredLine(lo,hi,sub,points,label){const W=440,x0=30,base=50,X=v=>x0+(v-lo)*(W-60)/(hi-lo);let b=ln(12,base,W-12,base,{start:1,end:1});
 for(let k=0;k<=(hi-lo)*sub;k++){const v=lo+k/sub,whole=k%sub===0;b+=ln(X(v),base-(whole?7:4),X(v),base+(whole?7:4),{w:whole?1.4:1});if(whole)b+=tx(X(v),base+22,minus(v),{size:12});}
 points.forEach(([L,v])=>{b+=dot(X(v),base)+tx(X(v),base-12,L,{italic:1,size:14});});return svg(b,label,W,base+32);}
// ---------- Course 1, Batch C1-5 drawings ----------
// A circle with centre M, a diameter SR at angle th and a point Q on the circle; segments SQ, SR and MQ drawn.
function circleChordFigure(nm,th,phi){const cx=120,cy=105,r=80,P=a=>[cx+r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)],[S,R0,Q]=[P(th+180),P(th),P(th+phi)];
 const lab=(p,s,dx,dy)=>tx(p[0]+dx,p[1]+dy,s,{italic:1,size:14}),out=(a,s)=>{const [x,y]=P(a);return lab([x,y],s,14*Math.cos(a*Math.PI/180),5-14*Math.sin(a*Math.PI/180));};
 const b=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(S[0],S[1],R0[0],R0[1])+ln(S[0],S[1],Q[0],Q[1])+ln(cx,cy,Q[0],Q[1])+dot(cx,cy)+dot(Q[0],Q[1])+out(th+180,nm.S)+out(th,nm.R)+out(th+phi,nm.Q)+lab([cx,cy],nm.M,-10*Math.cos((th+90)*Math.PI/180),18);
 return svg(b,`A circle with centre ${nm.M}; segment ${nm.S}${nm.R} passes through ${nm.M}; segments ${nm.S}${nm.Q} and ${nm.M}${nm.Q} are also drawn`,240,215);}
// Line R–O–T with rays OP, OQ (perpendicular) and OS.
function supplementFigure(sDeg,pDeg){const F=Fig(),O=[0,0],at=d=>[10*Math.cos(d*Math.PI/180),10*Math.sin(d*Math.PI/180)],lab=d=>[12*Math.cos(d*Math.PI/180),12*Math.sin(d*Math.PI/180)];
 F.seg([-12,0],[12,0],{start:1,end:1}).seg(O,at(sDeg),{end:1}).seg(O,at(90),{end:1}).seg(O,at(pDeg),{end:1}).dot(O).dot([-9,0]).dot([9,0]).dot(at(sDeg).map(v=>v*0.8)).dot(at(90).map(v=>v*0.8)).dot(at(pDeg).map(v=>v*0.8))
  .txt([0,-1.6],'O',{italic:1}).txt([-9,-1.6],'R',{italic:1}).txt([9,-1.6],'T',{italic:1}).txt(lab(sDeg).map(v=>v*0.8+0.9),'S',{italic:1}).txt([1,9.2],'Q',{italic:1}).txt(lab(pDeg).map((v,i)=>v*0.8+(i?0.9:-0.9)),'P',{italic:1}).right(O,0,90,9);
 return F.render('Line RT through O with rays OS, OQ and OP above it; ray OQ is perpendicular to line RT',320,170);}
// Triangle with labelled vertices (math coordinates).
function triangleFigure(V,names){const F=Fig().poly(V),c=[(V[0][0]+V[1][0]+V[2][0])/3,(V[0][1]+V[1][1]+V[2][1])/3];
 V.forEach((p,i)=>{const dx=p[0]-c[0],dy=p[1]-c[1],L=Math.hypot(dx,dy);F.txt([p[0]+dx/L*0.9,p[1]+dy/L*0.9-0.25],names[i],{italic:1});});
 return F.render(`Triangle ${names.join('')}`,320,180);}
// Rectangle with corner names (top-left, top-right, bottom-right, bottom-left) and one diagonal (bottom-left to top-right).
function rectDiagFigure(nm,w,h){const x0=40,y0=25,W=w,H=h;return svg(`<rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+ln(x0,y0+H,x0+W,y0)+tx(x0-12,y0+4,nm[0],{italic:1,size:15})+tx(x0+W+12,y0+4,nm[1],{italic:1,size:15})+tx(x0+W+12,y0+H+14,nm[2],{italic:1,size:15})+tx(x0-12,y0+H+14,nm[3],{italic:1,size:15}),`Rectangle ${nm.join('')} with diagonal ${nm[3]}${nm[1]}`,W+80,H+55);}
// A row of equal balls with the first diameter marked.
function ballsFigure(k,label){const r=34,g=4;let b='';for(let i=0;i<k;i++){const cx=14+r+i*(2*r+g);b+=`<circle cx="${cx}" cy="${r+8}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+`<path d="M${cx-r*0.62},${r+8-r*0.25} A${r*0.7},${r*0.7} 0 0 0 ${cx-r*0.1},${r+8+r*0.62}" fill="none" stroke="${INK}" stroke-width="2.4"/>`;}
 const y=2*r+26,x0=14,x1=14+2*r;b+=ln(x0,y-8,x0,y+8,{w:1})+ln(x1,y-8,x1,y+8,{w:1})+ln(x0+2,y,x1-2,y,{start:1,end:1})+tx((x0+x1)/2,y+20,label,{size:13});
 return svg(b,`${k} equal balls side by side in a row; the first ball's diameter is marked ${label} inch`,14*2+k*(2*r+g),y+30);}
// Four separate angles labelled Angle 1 to Angle 4 (no measures shown).
function fourAnglesFigure(degs){let b='';degs.forEach((d,i)=>{const ox=20+i*135+(d>90?40:0),oy=95,r=70,a=d*Math.PI/180;b+=ln(ox,oy,ox+r,oy,{w:1.8})+ln(ox,oy,ox+r*Math.cos(a),oy-r*Math.sin(a),{w:1.8})+`<path d="M${ox+18},${oy} A18,18 0 0 0 ${(ox+18*Math.cos(a)).toFixed(1)},${(oy-18*Math.sin(a)).toFixed(1)}" fill="none" stroke="${INK}"/>`+tx(20+i*135+55,oy+26,`Angle ${i+1}`,{size:13});});
 return svg(b,'Four angles labelled Angle 1, Angle 2, Angle 3 and Angle 4',4*135+20,130);}
// Two rays with the reflex side marked by an arc; the smaller angle labelled with its measure.
function reflexFigure(small,rot){const cx=150,cy=100,r=80,P=(d,rr=r)=>[cx+rr*Math.cos(d*Math.PI/180),cy-rr*Math.sin(d*Math.PI/180)],a0=rot,a1=rot+small,[x0,y0]=P(a0),[x1,y1]=P(a1),[u0,v0]=P(a0,22),[u1,v1]=P(a1,22),[lx,ly]=P(a0+small/2,46);
 const b=ln(cx,cy,x0,y0,{w:2,end:1})+ln(cx,cy,x1,y1,{w:2,end:1})+`<path d="M${u1.toFixed(1)},${v1.toFixed(1)} A22,22 0 1 0 ${u0.toFixed(1)},${v0.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+tx(lx,ly+4,`${small}°`,{size:13});
 return svg(b,`Two rays forming a ${small}° angle; the arc marks the angle on the other side, the long way around`,300,200);}
// Line A–D–C with ray DB.
function lineRayFigure(phi){const F=Fig(),D=[0,0],B=[8*Math.cos(phi*Math.PI/180),8*Math.sin(phi*Math.PI/180)];
 F.seg([-11,0],[11,0],{start:1,end:1}).seg(D,[B[0]*1.45,B[1]*1.45],{end:1}).dot([-7,0]).dot([7,0]).dot(B).txt([-7,1],'A',{italic:1}).txt([0,-1.5],'D',{italic:1}).txt([7,-1.5],'C',{italic:1}).txt([B[0]+(B[0]>0?-1:1),B[1]+0.4],'B',{italic:1});
 return F.render('Line AC through D with ray DB',320,170);}
// ---------- Course 1, Batch C1-6 drawings ----------
// Bar graph with the value printed above each bar.
function labelledBars(cats,vals,title,yLabel,top,step,showVals=true,labelEvery=1){const W=60+cats.length*78,H=250,x0=52,y0=205,h=160,bw=(W-x0-16)/cats.length,Y=v=>y0-h*v/top;let b=tx(W/2,18,title,{size:13});
 for(let v=0;v<=top;v+=step)b+=ln(x0,Y(v),W-12,Y(v),{color:'#c9d3d6',w:1})+(Math.round(v/step)%labelEvery===0?tx(x0-8,Y(v)+4,String(v),{size:11,anchor:'end'}):'');
 cats.forEach((c,i)=>{const x=x0+i*bw+bw*0.18;b+=`<rect x="${x.toFixed(1)}" y="${Y(vals[i]).toFixed(1)}" width="${(bw*0.64).toFixed(1)}" height="${(y0-Y(vals[i])).toFixed(1)}" fill="#7d8f96" fill-opacity="0.55" stroke="${INK}" stroke-width="1.2"/>`+(showVals?tx(x+bw*0.32,Y(vals[i])-5,String(vals[i]),{size:11}):'')+tx(x+bw*0.32,y0+16,c,{size:11});});
 b+=ln(x0,y0,W-12,y0,{w:1.5})+ln(x0,y0,x0,y0-h-8,{w:1.5})+`<text x="14" y="${y0-h/2}" font-size="12" text-anchor="middle" transform="rotate(-90 14 ${y0-h/2})" fill="${INK}">${esc(yLabel)}</text>`;
 return svg(b,`Bar graph: ${title}; `+cats.map((c,i)=>`${c} ${vals[i]}`).join(', '),W,H);}
// Circle graph whose sectors are labelled with counts.
function countCircle(title,names,counts){const cx=200,cy=160,r=90,T=counts.reduce((a,b)=>a+b,0),P=(t,rr)=>[cx+rr*Math.cos(t*Math.PI/180),cy-rr*Math.sin(t*Math.PI/180)];let b=tx(cx,20,title,{size:13})+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`,a=90;
 counts.forEach((k,i)=>{b+=ln(cx,cy,...P(a,r),{w:1.2});const sweep=360*k/T,mid=a+sweep/2,[lx,ly]=P(mid,r*0.58);b+=tx(lx,ly-2,names[i],{size:12})+tx(lx,ly+13,String(k),{size:12});a+=sweep;});
 return svg(b,`Circle graph: ${title}; `+names.map((nm,i)=>`${nm} ${counts[i]}`).join(', '),400,270);}
// Tally sheet with a title.
function tallyFigure(title,names,counts){const rowH=34,W=Math.max(380,140+Math.ceil(Math.max(...counts)/5)*48),H=rowH*names.length+34;let b=`<rect x="10" y="4" width="${W-20}" height="${H-8}" fill="none" stroke="${INK}" stroke-width="1.5"/>`+ln(10,30,W-10,30,{w:1.2})+ln(110,30,110,H-4,{w:1.2})+tx(W/2,22,title,{size:13});
 names.forEach((nm,i)=>{const y=30+rowH*i+rowH/2;b+=tx(60,y+5,nm,{size:12});let x=120;for(let k=0;k<counts[i];k++){if(k%5===4){b+=ln(x-4*9-4,y+6,x-2,y-7,{w:1.3});x+=12;}else{b+=ln(x,y-9,x,y+9,{w:1.3});x+=9;}}if(i)b+=ln(10,30+rowH*i,W-10,30+rowH*i,{w:.6});});
 return svg(b,`Tally sheet: ${title}; `+names.join(', '),W,H);}
// House outline with the low edge of the roof and the peak marked with heights.
function roofFigure(low,peak){const g=170,s=26,x0=100,x1=290,yb=g+20,ye=yb-low*s,yp=yb-peak*s,xm=(x0+x1)/2;
 const b=`<polygon points="${x0},${yb} ${x0},${ye.toFixed(1)} ${xm},${yp.toFixed(1)} ${x1},${ye.toFixed(1)} ${x1},${yb}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+ln(20,yb,330,yb,{w:1.2})
  +ln(x0-22,yb,x0-22,ye,{start:1,end:1,w:1})+tx(x0-26,(yb+ye)/2+4,`${low} m`,{size:12,anchor:'end'})+ln(xm,yb,xm,yp,{start:1,end:1,w:1,dash:'4,3'})+tx(xm+6,(yb+yp)/2+20,`${peak} m`,{size:12,anchor:'start'});
 return svg(b,`A house; the lowest part of the roof is ${low} m high and the peak is ${peak} m high`,345,yb+14);}
// ---------- Course 1, Batch C1-10 drawings ----------
// A factor tree. Each node is {v, kids:[left,right]} or a leaf {v}; circled leaves are marked as primes.
function treeBody(tree,ox,oy){const leaves=t=>t.kids?leaves(t.kids[0])+leaves(t.kids[1]):1,depth=t=>t.kids?1+Math.max(depth(t.kids[0]),depth(t.kids[1])):0,W=Math.max(3,leaves(tree))*46,dy=50;let b='';
 const place=(t,x0,x1,y)=>{const x=(x0+x1)/2;if(t.kids){const L=leaves(t.kids[0]),T=leaves(t),xm=x0+(x1-x0)*L/T,c0=place(t.kids[0],x0,xm,y+dy),c1=place(t.kids[1],xm,x1,y+dy);b+=ln(x,y+7,c0[0],c0[1]-17,{w:1.3})+ln(x,y+7,c1[0],c1[1]-17,{w:1.3});}
  b+=tx(x,y,String(t.v),{size:14});if(t.circled)b+=`<circle cx="${x.toFixed(1)}" cy="${(y-5).toFixed(1)}" r="12" fill="none" stroke="${INK}" stroke-width="1.2"/>`;return [x,y];};
 place(tree,ox,ox+W,oy+24);return {b,W,H:24+depth(tree)*dy+16};}
function factorTreeFigure(tree,label){const {b,W,H}=treeBody(tree,10,0);return svg(b,label,W+20,H);}
function twoTrees(t1,t2,label){const A=treeBody(t1,30,22),B=treeBody(t2,A.W+90,22);return svg(A.b+B.b+tx(18,30,'I',{size:15})+tx(A.W+76,30,'II',{size:15}),label,A.W+B.W+110,Math.max(A.H,B.H)+24);}
// Pixel outlines of quadrilaterals and other polygons in a 100 by 80 cell.
const QUAD_PTS={rectangle:[[5,15],[95,15],[95,65],[5,65]],square:[[15,5],[85,5],[85,75],[15,75]],parallelogram:[[28,15],[96,15],[72,65],[4,65]],rhombus:[[50,2],[84,40],[50,78],[16,40]],trapezoid:[[30,15],[70,15],[96,65],[4,65]],kite:[[50,2],[80,28],[50,78],[20,28]],triangle:[[50,5],[95,72],[5,72]],pentagon:[0,1,2,3,4].map(k=>[50+36*Math.sin(2*Math.PI*k/5),42-36*Math.cos(2*Math.PI*k/5)]),hexagon:[0,1,2,3,4,5].map(k=>[50+37*Math.cos(Math.PI*k/3),40+37*Math.sin(Math.PI*k/3)])};
function shapeBody(kind,ox,oy,k=1){const P=QUAD_PTS[kind].map(([x,y])=>[ox+x*k,oy+y*k]);let b=`<polygon points="${P.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 if(kind==='rectangle'||kind==='square'){const [x,y]=P[3],m=8*k;b+=ln(x,y-m,x+m,y-m,{w:1})+ln(x+m,y-m,x+m,y,{w:1});}return b;}
function oneShape(kind,label){return svg(shapeBody(kind,10,10,1.8),label,200,165);}
function fourShapes(kinds,label){let b='';kinds.forEach((k,i)=>{b+=shapeBody(k,10+i*120,8)+tx(60+i*120,108,'ABCD'[i],{size:14});});return svg(b,label,480,118);}
// Points A, B, C in order on a line, spaced to scale.
function abcSegment(ab,bc,label){const T=ab+bc,sc=300/T,xa=20,xb=xa+ab*sc,xc=xa+T*sc,y=40;return svg(ln(xa-12,y,xc+12,y,{w:1.4})+dot(xa,y)+dot(xb,y)+dot(xc,y)+tx(xa,y-12,'A',{italic:1,size:14})+tx(xb,y-12,'B',{italic:1,size:14})+tx(xc,y-12,'C',{italic:1,size:14}),label,xc+40,62);}
// A rectangle with text side labels (such as mixed numbers), drawn to the given proportions.
function rectWithLabels(w,h,wl,hl,label){const sc=170/Math.max(w,h),W=w*sc,H=h*sc;return svg(`<rect x="30" y="28" width="${W.toFixed(1)}" height="${H.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+tx(30+W/2,20,wl,{size:14})+tx(30+W+8,28+H/2+5,hl,{size:14,anchor:'start'}),label,30+W+100,28+H+16);}
// A coordinate plane from -10 to 10 with shapes and lettered points.
function planeWithPoints(shapes,points,label){const s=14,O=11*s+10,X=v=>O+v*s,Y=v=>O-v*s;let b=coordBody(shapes,s);for(const [x,y,nm] of points)b+=dot(X(x),Y(y))+tx(X(x)+7,Y(y)-6,nm,{italic:1,size:12,anchor:'start'});return svg(b,label,22*s+20,22*s+20);}
// ---------- Course 1, Batch C1-11 drawings ----------
// A parallelogram with base b, slanted side s and height h (h < s). With half, the diagonal splits it and the lower triangle is shaded; the height is then drawn outside on the right.
function paraFig(b,s,h,unit,half=false){const dx=Math.sqrt(s*s-h*h),k=230/(b+dx),X0=40,Y0=24+h*k,A=[X0,Y0],B=[X0+b*k,Y0],C=[X0+(b+dx)*k,24],D=[X0+dx*k,24],pts=p=>p.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');
 let g='';if(half)g+=`<polygon points="${pts([A,B,C])}" fill="${SHADE}" stroke="none"/>`;g+=`<polygon points="${pts([A,B,C,D])}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 if(half){g+=ln(A[0],A[1],C[0],C[1],{w:1.6})+ln(B[0],Y0,C[0]+8,Y0,{w:1,dash:'4,3'})+ln(C[0]+14,24,C[0]+14,Y0,{w:1})+ln(C[0]+9,24,C[0]+19,24,{w:1})+ln(C[0]+9,Y0,C[0]+19,Y0,{w:1})+tx(C[0]+20,(24+Y0)/2+5,`${h} ${unit}`,{anchor:'start',size:14});}
 else g+=ln(D[0],24,D[0],Y0,{w:1.2,dash:'5,3'})+ln(D[0],Y0-9,D[0]+9,Y0-9,{w:1})+ln(D[0]+9,Y0-9,D[0]+9,Y0,{w:1})+tx(D[0]+6,(24+Y0)/2+5,`${h} ${unit}`,{anchor:'start',size:14});
 g+=tx((A[0]+B[0])/2,Y0+20,`${b} ${unit}`,{size:14})+tx((A[0]+D[0])/2-8,(24+Y0)/2,`${s} ${unit}`,{anchor:'end',size:14});
 return svg(g,half?`A parallelogram with base ${b} ${unit}, side ${s} ${unit} and height ${h} ${unit}; a diagonal divides it and one triangle is shaded`:`A parallelogram with base ${b} ${unit}, side ${s} ${unit} and height ${h} ${unit}`,C[0]+(half?90:30),Y0+34);}
// A triangle with its base split by the foot of a dashed height; o1 and o2 are the two parts of the base.
function triHeightFig(o1,o2,h,s1,s2,unit){const B=o1+o2,k=240/Math.max(B,h*1.4),X0=60,Y0=24+h*k,P=[X0+o1*k,24],A=[X0,Y0],C=[X0+B*k,Y0];
 const g=`<polygon points="${[A,C,P].map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+ln(P[0],24,P[0],Y0,{w:1.2,dash:'5,3'})+ln(P[0],Y0-9,P[0]+9,Y0-9,{w:1})+ln(P[0]+9,Y0-9,P[0]+9,Y0,{w:1})
  +tx(P[0]+6,(24+Y0)/2+12,`${h} ${unit}`,{anchor:'start',size:14})+tx((A[0]+C[0])/2,Y0+20,`${B} ${unit}`,{size:14})+tx((A[0]+P[0])/2-8,(24+Y0)/2,`${s1} ${unit}`,{anchor:'end',size:14})+tx((C[0]+P[0])/2+8,(24+Y0)/2,`${s2} ${unit}`,{anchor:'start',size:14});
 return svg(g,`A triangle with base ${B} ${unit}, height ${h} ${unit} and slanted sides ${s1} ${unit} and ${s2} ${unit}`,C[0]+80,Y0+34);}
// Rectangle ABCD (D top left, A top right, B bottom right, C bottom left) with diagonal AC; triangle ABC is shaded.
function rectDiagFig(ab,bc,label){const k=200/Math.max(ab,bc),W=bc*k,H=ab*k,X0=30,Y0=24,D=[X0,Y0],A=[X0+W,Y0],B=[X0+W,Y0+H],C=[X0,Y0+H],P=p=>p.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');
 return svg(`<polygon points="${P([A,B,C])}" fill="${SHADE}" stroke="none"/><polygon points="${P([D,A,B,C])}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+ln(A[0],A[1],C[0],C[1],{w:1.6})+tx(D[0]-6,D[1]-6,'D',{italic:1,size:14})+tx(A[0]+6,A[1]-6,'A',{italic:1,size:14})+tx(B[0]+6,B[1]+16,'B',{italic:1,size:14})+tx(C[0]-6,C[1]+16,'C',{italic:1,size:14}),label,X0+W+40,Y0+H+34);}
// An angle with vertex V; the reference adds the compass arcs and the bisecting ray.
function angleFig(deg,withBisector,label){const L=190,a=deg*Math.PI/180,V=[30+Math.max(0,-L*Math.cos(a)),200],p1=[V[0]+L,V[1]],p2=[V[0]+L*Math.cos(a),V[1]-L*Math.sin(a)],r=70;let g=ln(V[0],V[1],p1[0],p1[1],{w:1.6})+ln(V[0],V[1],p2[0],p2[1],{w:1.6})+dot(V[0],V[1]);
 if(withBisector){const q1=[V[0]+r,V[1]],q2=[V[0]+r*Math.cos(a),V[1]-r*Math.sin(a)],h=a/2,m=[V[0]+L*Math.cos(h),V[1]-L*Math.sin(h)],x=[V[0]+2*r*Math.cos(h)*Math.cos(a/2),V[1]-2*r*Math.cos(h)*Math.sin(a/2)];
  g+=`<path d="M${(V[0]+r).toFixed(1)},${V[1]} A${r},${r} 0 0 0 ${q2[0].toFixed(1)},${q2[1].toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3,2"/>`;for(const q of [q1,q2]){const dirTo=Math.atan2(x[1]-q[1],x[0]-q[0]);g+=`<path d="M${(q[0]+r*Math.cos(dirTo-0.25)).toFixed(1)},${(q[1]+r*Math.sin(dirTo-0.25)).toFixed(1)} A${r},${r} 0 0 1 ${(q[0]+r*Math.cos(dirTo+0.25)).toFixed(1)},${(q[1]+r*Math.sin(dirTo+0.25)).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3,2"/>`;}
  g+=ln(V[0],V[1],m[0],m[1],{w:1.6});}
 const xs=[V[0],p1[0],p2[0]],ys=[V[1],p1[1],p2[1]];return svg(g,label,Math.max(...xs)+40,V[1]+20);}
// A segment, horizontal or vertical; the reference adds the arcs and the perpendicular bisector.
function segBisectFig(vert,withBisector,label){const L=220,c=[150,150],e1=vert?[c[0],c[1]-L/2]:[c[0]-L/2,c[1]],e2=vert?[c[0],c[1]+L/2]:[c[0]+L/2,c[1]],r=0.7*L,d=Math.sqrt(r*r-(L/2)**2);let g=ln(e1[0],e1[1],e2[0],e2[1],{w:1.8})+dot(e1[0],e1[1])+dot(e2[0],e2[1]);
 if(withBisector){const u=vert?[1,0]:[0,1],X1=[c[0]+d*u[0],c[1]+d*u[1]],X2=[c[0]-d*u[0],c[1]-d*u[1]];for(const e of [e1,e2])for(const X of [X1,X2]){const ang=Math.atan2(X[1]-e[1],X[0]-e[0]);g+=`<path d="M${(e[0]+r*Math.cos(ang-0.2)).toFixed(1)},${(e[1]+r*Math.sin(ang-0.2)).toFixed(1)} A${r},${r} 0 0 1 ${(e[0]+r*Math.cos(ang+0.2)).toFixed(1)},${(e[1]+r*Math.sin(ang+0.2)).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3,2"/>`;}
  g+=ln(X1[0]+(X1[0]-c[0])*0.15,X1[1]+(X1[1]-c[1])*0.15,X2[0]+(X2[0]-c[0])*0.15,X2[1]+(X2[1]-c[1])*0.15,{w:1.6});}
 return svg(g,label,300,300);}
// A right triangle: vertical leg a, horizontal leg b, hypotenuse c, with room for long labels.
function rightFig(a,b,c,unit){const k=170/Math.max(a,b),X0=86,Y0=24+a*k,A=[X0,Y0],B=[X0+b*k,Y0],C=[X0,24];return svg(`<polygon points="${[A,B,C].map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+ln(X0,Y0-12,X0+12,Y0-12,{w:1})+ln(X0+12,Y0-12,X0+12,Y0,{w:1})+tx(X0-8,(Y0+24)/2+5,`${a} ${unit}`,{anchor:'end',size:14})+tx(X0+b*k/2,Y0+20,`${b} ${unit}`,{size:14})+tx(X0+b*k/2+12,(Y0+24)/2-6,`${c} ${unit}`,{anchor:'start',size:14}),`Right triangle with legs ${a} ${unit} and ${b} ${unit} and longest side ${c} ${unit}`,X0+b*k+90,Y0+34);}
// ---------- Course 1, Batch C1-12 drawings ----------
// A rectangular box drawn in oblique view with its length, width (depth) and height labelled.
function boxFig(l,w,h,unit,label){const m=Math.max(l,w,h),k=150/m,L=l*k,H=h*k,dx=w*k*0.5,dy=w*k*0.35,X0=20,Y0=20+dy;const P=p=>p.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');
 const F=[[X0,Y0],[X0+L,Y0],[X0+L,Y0+H],[X0,Y0+H]],T=[[X0,Y0],[X0+dx,Y0-dy],[X0+L+dx,Y0-dy],[X0+L,Y0]],S=[[X0+L,Y0],[X0+L+dx,Y0-dy],[X0+L+dx,Y0+H-dy],[X0+L,Y0+H]];
 const g=`<polygon points="${P(T)}" fill="#e8ecef" stroke="${INK}" stroke-width="1.6"/><polygon points="${P(S)}" fill="#cfd6db" stroke="${INK}" stroke-width="1.6"/><polygon points="${P(F)}" fill="#dde3e7" stroke="${INK}" stroke-width="1.6"/>`
  +tx(X0+L/2,Y0+H+18,`${l} ${unit}`,{size:14})+tx(X0+L+dx+6,Y0-dy+H/2+5,`${h} ${unit}`,{anchor:'start',size:14})+tx(X0+L+dx/2+8,Y0+H-dy/2+14,`${w} ${unit}`,{anchor:'start',size:14});
 return svg(g,label,X0+L+dx+80,Y0+H+30);}
// A closed path around a field: an n-sided polygon with the exterior turn at each corner marked by a dashed extension and an arc.
function turnsFig(n,label){const cx=150,cy=140,r=90,V=[...Array(n).keys()].map(i=>[cx+r*Math.cos(2*Math.PI*i/n-Math.PI/2),cy+r*Math.sin(2*Math.PI*i/n-Math.PI/2)]);let g=`<polygon points="${V.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 V.forEach((p,i)=>{const prev=V[(i-1+n)%n],next=V[(i+1)%n],d=[p[0]-prev[0],p[1]-prev[1]],L=Math.hypot(...d),u=[d[0]/L,d[1]/L],e=[p[0]+u[0]*45,p[1]+u[1]*45];g+=ln(p[0],p[1],e[0],e[1],{w:1,dash:'4,3'});
  const v=[next[0]-p[0],next[1]-p[1]],Lv=Math.hypot(...v),w=[v[0]/Lv,v[1]/Lv],a1=[p[0]+u[0]*24,p[1]+u[1]*24],a2=[p[0]+w[0]*24,p[1]+w[1]*24];g+=`<path d="M${a1[0].toFixed(1)},${a1[1].toFixed(1)} A24,24 0 0 1 ${a2[0].toFixed(1)},${a2[1].toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`;});
 g+=dot(...V[0])+tx(V[0][0]-10,V[0][1]-4,'A',{italic:1,size:13,anchor:'end'});return svg(g,label,300,290);}
// A table with three columns drawn as SVG.
function table3(head,rows,label,w=[110,100,140]){const rh=26,W=w[0]+w[1]+w[2]+2,H=rh*(rows.length+1);let b=`<rect x="1" y="1" width="${W-2}" height="${H}" fill="none" stroke="${INK}" stroke-width="1.5"/>`+ln(1+w[0],1,1+w[0],1+H,{w:1.2})+ln(1+w[0]+w[1],1,1+w[0]+w[1],1+H,{w:1.2});
 [head,...rows].forEach((r,i)=>{if(i)b+=ln(1,1+rh*i,W-1,1+rh*i,{w:i===1?1.6:1});let x=1;r.forEach((cell,j)=>{b+=`<text x="${x+w[j]/2}" y="${1+rh*i+18}" font-size="13" text-anchor="middle" fill="${INK}"${i?'':' font-weight="bold"'}>${esc(String(cell))}</text>`;x+=w[j];});});
 return svg(b,label,W+2,H+4);}
// ---------- Course 1, Batch C1-13 drawings ----------
// Triangle vertices from three side lengths: base a along the bottom, then sides b (left) and c (right).
function triFromSides(a,b,c){const x=(b*b-c*c+a*a)/(2*a),y=Math.sqrt(Math.max(0,b*b-x*x));return [[0,0],[a,0],[x,y]];}
// Draws a triangle given model coordinates (y up). opts: names (3 vertex letters), sides (labels for sides 01,12,20), angles (labels inside at each vertex), right (vertex index with a right-angle mark).
function triDraw(P,opts,label,size=200){const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),mx=Math.min(...xs),my=Math.max(...ys),k=size/Math.max(Math.max(...xs)-mx,my-Math.min(...ys)),X0=60,Y0=40,S=P.map(([x,y])=>[X0+(x-mx)*k,Y0+(my-y)*k]),cx=(S[0][0]+S[1][0]+S[2][0])/3,cy=(S[0][1]+S[1][1]+S[2][1])/3;
 let g=`<polygon points="${S.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 if(opts.right!==undefined){const i=opts.right,A=S[i],B=S[(i+1)%3],C=S[(i+2)%3],u=[(B[0]-A[0]),(B[1]-A[1])],v=[(C[0]-A[0]),(C[1]-A[1])],lu=Math.hypot(...u),lv=Math.hypot(...v),m=12,p1=[A[0]+u[0]/lu*m,A[1]+u[1]/lu*m],p2=[A[0]+v[0]/lv*m,A[1]+v[1]/lv*m],p3=[p1[0]+v[0]/lv*m,p1[1]+v[1]/lv*m];g+=ln(p1[0],p1[1],p3[0],p3[1],{w:1})+ln(p2[0],p2[1],p3[0],p3[1],{w:1});}
 (opts.names||[]).forEach((nm,i)=>{const d=[S[i][0]-cx,S[i][1]-cy],L=Math.hypot(...d);g+=tx(S[i][0]+14*d[0]/L,S[i][1]+14*d[1]/L+5,nm,{italic:1,size:14});});
 (opts.sides||[]).forEach((lab,i)=>{if(!lab)return;const A=S[i],B=S[(i+1)%3],M=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[M[0]-cx,M[1]-cy],L=Math.hypot(...d)||1;g+=tx(M[0]+22*d[0]/L,M[1]+22*d[1]/L+5,lab,{size:13});});
 (opts.angles||[]).forEach((lab,i)=>{if(!lab)return;const d=[cx-S[i][0],cy-S[i][1]],L=Math.hypot(...d);g+=tx(S[i][0]+30*d[0]/L,S[i][1]+30*d[1]/L+5,lab,{size:13,italic:/^[a-z]$/.test(lab)?1:0});});
 const W=Math.max(...S.map(q=>q[0]))+70,H=Math.max(...S.map(q=>q[1]))+40;return svg(g,label,W,H);}
// Four small triangles lettered A to D (each given by model coordinates).
function fourTris(list,label){let g='';list.forEach((P,i)=>{const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),k=90/Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)),ox=12+i*120,oy=10;const S=P.map(([x,y])=>[ox+(x-Math.min(...xs))*k,oy+(Math.max(...ys)-y)*k]);g+=`<polygon points="${S.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+tx(ox+45,120,'ABCD'[i],{size:14});});return svg(g,label,480,130);}
// Two parallel lines cut by a transversal; angles 1-4 at the upper intersection and 5-8 at the lower, numbered left to right, top to bottom.
function transFig(top,bottom,label){const y1=70,y2=170,x1=150,x2=110,g0=ln(20,y1,300,y1,{w:1.5,start:1,end:1})+ln(20,y2,300,y2,{w:1.5,start:1,end:1})+ln(x1+22,y1-55,x2-22,y2+55,{w:1.5,start:1,end:1})+tx(306,y1+4,top,{italic:1,size:14,anchor:'start'})+tx(306,y2+4,bottom,{italic:1,size:14,anchor:'start'});
 const num=(x,y,base)=>tx(x-14,y-6,String(base),{size:12})+tx(x+16,y-6,String(base+1),{size:12})+tx(x-18,y+16,String(base+2),{size:12})+tx(x+12,y+16,String(base+3),{size:12});return svg(g0+num(x1,y1,1)+num(x2,y2,5),label,330,250);}
// A quadrilateral with labels inside its corners.
function quadAngles(labels,label){const S=[[40,170],[250,190],[220,40],[70,60]];let g=`<polygon points="${S.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;const cx=145,cy=115;S.forEach((p,i)=>{const d=[cx-p[0],cy-p[1]],L=Math.hypot(...d);g+=tx(p[0]+34*d[0]/L,p[1]+34*d[1]/L+5,labels[i],{size:13});});return svg(g,label,290,220);}
// ---------- Course 1, Batch C1-14 drawings ----------
// A rectilinear (or any) polygon in model units, y up; labels[i] is written outside edge i (from point i to point i+1), or skipped when empty.
function rectiFig(P,labels,label,size=220,extra=[]){const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),k=size/Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)),X0=60,Y0=34,S=P.map(([x,y])=>[X0+(x-Math.min(...xs))*k,Y0+(Math.max(...ys)-y)*k]);
 let area=0;for(let i=0;i<S.length;i++){const [a,b]=S[i],[c,d]=S[(i+1)%S.length];area+=a*d-c*b;}const sgn=area>0?1:-1;
 let g=`<polygon points="${S.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 labels.forEach((lab,i)=>{if(!lab)return;const A=S[i],B=S[(i+1)%S.length],M=[(A[0]+B[0])/2,(A[1]+B[1])/2],e=[B[0]-A[0],B[1]-A[1]],L=Math.hypot(...e),nrm=[sgn*e[1]/L,-sgn*e[0]/L],horiz=Math.abs(e[1])<1e-6;g+=tx(M[0]+nrm[0]*(horiz?14:8),M[1]+nrm[1]*(horiz?14:8)+5,lab,{size:13,anchor:horiz?'middle':nrm[0]>0?'start':'end'});});
 for(const [x,y,lab] of extra)g+=tx(X0+(x-Math.min(...xs))*k,Y0+(Math.max(...ys)-y)*k-8,lab,{size:13});
 return svg(g,label,Math.max(...S.map(q=>q[0]))+80,Math.max(...S.map(q=>q[1]))+40);}
// A triangle body at an offset (model coordinates, y up) with optional vertex names, side labels (edge i: point i to i+1) and angle labels.
function triG(P,opts,X0,Y0,size){const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),k=size/Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)),S=P.map(([x,y])=>[X0+(x-Math.min(...xs))*k,Y0+(Math.max(...ys)-y)*k]),cx=(S[0][0]+S[1][0]+S[2][0])/3,cy=(S[0][1]+S[1][1]+S[2][1])/3;
 let g=`<polygon points="${S.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
 if(opts.right!==undefined){const i=opts.right,A=S[i],B=S[(i+1)%3],C=S[(i+2)%3],u=[B[0]-A[0],B[1]-A[1]],v=[C[0]-A[0],C[1]-A[1]],lu=Math.hypot(...u),lv=Math.hypot(...v),m=11,p1=[A[0]+u[0]/lu*m,A[1]+u[1]/lu*m],p2=[A[0]+v[0]/lv*m,A[1]+v[1]/lv*m],p3=[p1[0]+v[0]/lv*m,p1[1]+v[1]/lv*m];g+=ln(p1[0],p1[1],p3[0],p3[1],{w:1})+ln(p2[0],p2[1],p3[0],p3[1],{w:1});}
 (opts.names||[]).forEach((nm,i)=>{const d=[S[i][0]-cx,S[i][1]-cy],L=Math.hypot(...d);g+=tx(S[i][0]+14*d[0]/L,S[i][1]+14*d[1]/L+5,nm,{italic:1,size:14});});
 (opts.sides||[]).forEach((lab,i)=>{if(!lab)return;const A=S[i],B=S[(i+1)%3],M=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[M[0]-cx,M[1]-cy],L=Math.hypot(...d)||1;g+=tx(M[0]+20*d[0]/L,M[1]+20*d[1]/L+5,lab,{size:12});});
 (opts.angles||[]).forEach((lab,i)=>{if(!lab)return;const d=[cx-S[i][0],cy-S[i][1]],L=Math.hypot(...d);g+=tx(S[i][0]+28*d[0]/L,S[i][1]+28*d[1]/L+5,lab,{size:12,italic:/^[a-z]$/.test(lab)?1:0});});
 return {g,W:Math.max(...S.map(q=>q[0])),H:Math.max(...S.map(q=>q[1]))};}
function pairTri(P1,o1,P2,o2,label,s1=150,s2=150){const A=triG(P1,o1,50,34,s1),B=triG(P2,o2,A.W+90,34,s2);return svg(A.g+B.g,label,B.W+60,Math.max(A.H,B.H)+40);}
// A regular polygon with one side labelled.
function regPoly(n,lab,label){const cx=130,cy=120,r=90,V=[...Array(n).keys()].map(i=>[cx+r*Math.cos(2*Math.PI*i/n+Math.PI/2-Math.PI/n),cy+r*Math.sin(2*Math.PI*i/n+Math.PI/2-Math.PI/n)]);const M=[(V[0][0]+V[1][0])/2,(V[0][1]+V[1][1])/2];return svg(`<polygon points="${V.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8"/>`+tx(M[0],M[1]+22,lab,{size:13}),label,270,250);}
// ---------- Course 1, Batch C1-15 drawings and words ----------
const ONES15=['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS15=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
// A whole number from 1 to 99 in words ("twenty-three"); cap=true capitalizes the first letter.
function numWord(k,cap=false){const w=k<20?ONES15[k]:TENS15[Math.floor(k/10)]+(k%10?'-'+ONES15[k%10]:'');return cap?w[0].toUpperCase()+w.slice(1):w;}
const FRACWORD15={2:'half',3:'third',4:'fourth',5:'fifth',6:'sixth',8:'eighth'};
// A fraction in words, hyphenated as in "Three-fifths".
function fracWord(a,b,cap=true){const w=numWord(a)+'-'+FRACWORD15[b]+(a>1?'s':'');return cap?w[0].toUpperCase()+w.slice(1):w;}
// Shaded squares and half squares on a grid. cells: [col,row] full squares; halves: [col,row,corner] right triangles whose right angle is at corner 0-3 (0 top-left, 1 top-right, 2 bottom-right, 3 bottom-left). Rows count from the top.
function gridShapeFig(cols,rows,cells,halves,label){const s=30,x0=16,y0=12;let b='';
 for(const [c,r] of cells)b+=`<rect x="${x0+c*s}" y="${y0+r*s}" width="${s}" height="${s}" fill="${SHADE}" fill-opacity="0.55" stroke="none"/>`;
 for(const [c,r,k] of halves){const X=x0+c*s,Y=y0+r*s,C=[[X,Y],[X+s,Y],[X+s,Y+s],[X,Y+s]],P=[C[k],C[(k+1)%4],C[(k+3)%4]];b+=`<polygon points="${P.map(p=>p.join(',')).join(' ')}" fill="${SHADE}" fill-opacity="0.55" stroke="${INK}" stroke-width="1.6"/>`;}
 for(let c=0;c<=cols;c++)b+=ln(x0+c*s,y0,x0+c*s,y0+rows*s,{w:0.8});for(let r=0;r<=rows;r++)b+=ln(x0,y0+r*s,x0+cols*s,y0+r*s,{w:0.8});
 return svg(b,label,2*x0+cols*s,2*y0+rows*s);}
// A cylinder with its diameter (or radius) and height labelled with units.
function cylFig(lab,h,useDia,label){const rx=62,ry=15,H=150,cx=96,top=36,bot=top+H;let b=`<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(cx-rx,top,cx-rx,bot)+ln(cx+rx,top,cx+rx,bot)+`<path d="M${cx-rx},${bot} A${rx},${ry} 0 0 0 ${cx+rx},${bot}" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${cx-rx},${bot} A${rx},${ry} 0 0 1 ${cx+rx},${bot}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4,3"/>`;
 b+=useDia?ln(cx-rx,top,cx+rx,top,{w:1.2})+tx(cx,top-20,lab,{size:13}):dot(cx,top)+ln(cx,top,cx+rx,top,{w:1.2})+tx(cx+rx/2,top-ry-4,lab,{size:13});
 b+=ln(cx+rx+16,top,cx+rx+16,bot,{w:1,start:1,end:1})+tx(cx+rx+22,(top+bot)/2+4,h,{size:13,anchor:'start'});return svg(b,label,250,bot+30);}
// A cylinder standing in a cube of the same width and height, with a top view.
function cylInCube(d){const s=120,dx=40,dy=26,X=24,Y=20+dy;let b=`<rect x="${X}" y="${Y}" width="${s}" height="${s}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+`<polygon points="${X},${Y} ${X+dx},${Y-dy} ${X+s+dx},${Y-dy} ${X+s},${Y}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(X+s,Y+s,X+s+dx,Y+s-dy)+ln(X+s+dx,Y-dy,X+s+dx,Y+s-dy);
 const cx=X+(s+dx)/2,rx=s/2,ry=dy/2;b+=`<ellipse cx="${cx}" cy="${Y-dy/2}" rx="${rx}" ry="${ry}" fill="${SHADE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.4"/>`+ln(cx-rx,Y-dy/2,cx-rx,Y+s-dy/2,{w:1.2})+ln(cx+rx,Y-dy/2,cx+rx,Y+s-dy/2,{w:1.2})+`<path d="M${cx-rx},${Y+s-dy/2} A${rx},${ry} 0 0 0 ${cx+rx},${Y+s-dy/2}" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
 b+=tx(X-10,Y+s/2+4,String(d),{size:14,anchor:'end'})+tx(X+s/2,Y+s+20,String(d),{size:14});
 const tX=X+s+dx+50,tY=Y;b+=tx(tX+s/2,tY-8,'Top view',{size:13})+`<rect x="${tX}" y="${tY}" width="${s}" height="${s}" fill="none" stroke="${INK}" stroke-width="1.5"/><circle cx="${tX+s/2}" cy="${tY+s/2}" r="${s/2}" fill="${SHADE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.5"/>`+tx(tX-8,tY+s/2+4,String(d),{size:14,anchor:'end'})+tx(tX+s/2,tY+s+20,String(d),{size:14});
 return svg(b,`A cylinder ${d} in. across and ${d} in. tall standing inside a cube with edges of ${d} in., with a top view showing the circle inside the square`,tX+s+20,Y+s+30);}
// A sphere drawn inside a cube with edges equal to its diameter.
function sphereInCube(d,unit){const s=130,dx=36,dy=24,X=26,Y=20+dy,cx=X+s/2+dx/2,cy=Y+s/2-dy/2,r=s/2-4;let b=`<rect x="${X}" y="${Y}" width="${s}" height="${s}" fill="none" stroke="${INK}" stroke-width="1.4"/>`+`<polygon points="${X},${Y} ${X+dx},${Y-dy} ${X+s+dx},${Y-dy} ${X+s},${Y}" fill="none" stroke="${INK}" stroke-width="1.4"/>`+ln(X+s,Y+s,X+s+dx,Y+s-dy,{w:1.4})+ln(X+s+dx,Y-dy,X+s+dx,Y+s-dy,{w:1.4});
 b+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${SHADE}" fill-opacity="0.3" stroke="${INK}" stroke-width="1.6"/>`+ln(cx-r,cy,cx+r,cy,{w:1.2})+dot(cx,cy)+tx(cx,cy-8,`${d} ${unit}`,{size:13});
 return svg(b,`A sphere with a diameter of ${d} ${unit} inside a cube with edges of ${d} ${unit}`,X+s+dx+24,Y+s+20);}
// A right prism whose base is an isosceles triangle, with the triangle shown separately.
function isoPrism(b0,h0,L,unit,title='Base'){const s=Math.min(110/b0,120/h0),B=b0*s,H=h0*s,x0=30,y0=20+H,dx=70,dy=-40;const A=[x0,y0+40],C=[x0+B,y0+40],T=[x0+B/2,y0+40-H],o=([x,y])=>[x+dx,y+dy];
 let g=`<polygon points="${[A,C,T].map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(...C,...o(C))+ln(...T,...o(T))+ln(...o(C),...o(T))+ln(...A,...o(A),{dash:'4,3',w:1})+ln(...o(A),...o(C),{dash:'4,3',w:1})+ln(...o(A),...o(T),{dash:'4,3',w:1});
 g+=tx(C[0]+dx/2+10,C[1]+dy/2+12,`${L} ${unit}`,{anchor:'start'});
 const X2=C[0]+dx+70,bA=[X2,y0+40],bC=[X2+B,y0+40],bT=[X2+B/2,y0+40-H];g+=tx(X2+B/2,20,title,{size:13})+`<polygon points="${[bA,bC,bT].map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+ln(bT[0],bT[1],bT[0],bA[1],{dash:'4,3',w:1})+`<path d="M${bT[0]},${bA[1]-8} h8 v8" fill="none" stroke="${INK}"/>`+tx(X2+B/2,bA[1]+18,`${b0} ${unit}`)+ln(bC[0]+16,bT[1],bC[0]+16,bA[1],{w:1,start:1,end:1})+tx(bC[0]+22,(bT[1]+bA[1])/2+4,`${h0} ${unit}`,{anchor:'start'});
 return svg(g,`A right prism ${L} ${unit} long whose base is an isosceles triangle with base ${b0} ${unit} and height ${h0} ${unit}`,X2+B+90,y0+70);}
// A square pyramid with the base side and the slant height of a face labelled.
function sqPyramid(sd,sl,unit){const A=[30,170],B=[190,170],C=[250,120],D=[90,120],T=[140,20],M=[(A[0]+B[0])/2,170];let b=`<polygon points="${[A,B,C].map(p=>p.join(',')).join(' ')}" fill="none" stroke="none"/>`+ln(...A,...B)+ln(...B,...C)+ln(...A,...T)+ln(...B,...T)+ln(...C,...T)+ln(...A,...D,{dash:'4,3',w:1})+ln(...D,...C,{dash:'4,3',w:1})+ln(...D,...T,{dash:'4,3',w:1})+ln(...T,...M,{dash:'4,3',w:1.2});
 b+=tx(M[0],190,`${sd} ${unit}`)+tx(C[0]-2,B[1]-14,`${sd} ${unit}`,{anchor:'start'})+tx((T[0]+M[0])/2+6,(T[1]+M[1])/2+4,`${sl} ${unit}`,{anchor:'start'});
 return svg(b,`A pyramid with a square base ${sd} ${unit} on each side; the slant height of each triangular face is ${sl} ${unit}`,320,205);}
// A roll of paper towels: a cylinder with a hollow tube through its middle.
function towelFig(D,d,H){const rx=70,ry=16,cx=150,top=56,bot=top+170,irx=rx*d/D,iry=ry*d/D;let b=`<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${cx}" cy="${top}" rx="${irx.toFixed(1)}" ry="${iry.toFixed(1)}" fill="${SHADE}" fill-opacity="0.6" stroke="${INK}" stroke-width="1.2"/>`+ln(cx-rx,top,cx-rx,bot)+ln(cx+rx,top,cx+rx,bot)+`<path d="M${cx-rx},${bot} A${rx},${ry} 0 0 0 ${cx+rx},${bot}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
 b+=ln(cx-irx,top-30,cx+irx,top-30,{w:1,start:1,end:1})+tx(cx,top-36,`${decStr(R(Math.round(d*100),100))} in.`)+ln(cx-rx-18,top,cx-rx-18,bot,{w:1,start:1,end:1})+tx(cx-rx-24,(top+bot)/2+4,`${H} in.`,{anchor:'end'})+ln(cx-rx,bot+30,cx+rx,bot+30,{w:1,start:1,end:1})+tx(cx,bot+46,`${D} in.`);
 return svg(b,`A roll of paper towels ${H} in. tall and ${D} in. across, with a cardboard tube ${decStr(R(Math.round(d*100),100))} in. across through the middle`,300,bot+56);}
// A cone with its radius and height labelled; the radius label sits below the base.
function coneFig(r,h,unit){const rx=64,ry=15,cx=90,top=20,base=top+150;return svg(ln(cx,top,cx-rx,base)+ln(cx,top,cx+rx,base)+`<path d="M${cx-rx},${base} A${rx},${ry} 0 0 0 ${cx+rx},${base}" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M${cx-rx},${base} A${rx},${ry} 0 0 1 ${cx+rx},${base}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4,3"/>`+ln(cx,top,cx,base,{w:1,dash:'4,3'})+ln(cx,base,cx+rx,base,{w:1.2})+`<path d="M${cx},${base-9} h9 v9" fill="none" stroke="${INK}"/>`+dot(cx,base)+tx(cx+rx/2,base+ry+18,`${r} ${unit}`)+tx(cx+6,top+0.84*(base-top),`${h} ${unit}`,{anchor:'start'}),`A cone with a radius of ${r} ${unit} and a height of ${h} ${unit}`,200,base+ry+30);}
// ---------- tasks ----------
const LETTERS='ABCDEGHJKMNPQRSTUVWXYZ';
function letter(int,ban=''){const pool=[...LETTERS].filter(c=>!ban.includes(c));return pool[int(0,pool.length-1)];}
const stripUnits=v=>String(v).replace(/\s*%\s*$/,'').replace(/^\s*\$/,'').replace(/\s*(?:(?:[a-zA-Z]+\.?|°|¢)(?:²|³|\^?[23])?(?:\/[a-zA-Z]+)?|\/[a-zA-Z]+)\s*$/,'').replace(/(\d),(?=\d{3}\b)/g,'$1').trim();
function distinct(answer,list){const num=k=>/^-?\d+(\.\d+)?$/.test(k)?String(Number(k)):k,seen=new Set([num(stripUnits(answer))]);return list.filter(c=>{const k0=String(c.value),k=num(stripUnits(k0));if(seen.has(k)||/^(\$0\.00|0|−?0 in\.|-.*in\.)$/.test(k0)||/^(0|0\.00)$/.test(k))return false;seen.add(k);return true;}).slice(0,3);}
const PLACES=['ones','tens','hundreds','thousands','ten-thousands','hundred-thousands','millions','ten-millions','hundred-millions','billions','ten-billions','hundred-billions','trillions'];

const SMALL=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function words(x){if(x<20)return SMALL[x];if(x<100)return TENS[Math.floor(x/10)]+(x%10?'-'+SMALL[x%10]:'');for(const [v,nm] of [[1e9,'billion'],[1e6,'million'],[1e3,'thousand'],[100,'hundred']])if(x>=v)return words(Math.floor(x/v))+' '+nm+(x%v?' '+words(x%v):'');}
// Distractor filter: drops repeats and any value the given checker accepts as correct. port87.js passes its
// own check; course modules receive it as h.check in build(c,h).
const wrongOnlyBy=(check,t,list)=>{const seen=new Set();return list.filter(x=>{const v=String(x.value);if(seen.has(v)||check(t,v).answerCorrect)return false;seen.add(v);return true;}).slice(0,3);};

const api=Object.freeze({U,M,R,f,n,text,teacher,esc,gcd,red,comma,money,minus,mn,mfrac,mixedML,math,mo,mi,fracText,mixedText,fracML,INK,svg,ln,tx,dot,numberLine,angleFigure,percentSquare,hundredGrid,ruler,shadedCircles,linearFigure,protractorFigure,angleDrawing,polyShape,polygonChoices,stepFigure,quadFigure,rectangleABCD,bowtie,smallestFactor,isPrime,goalDiagram,Fig,pt,decStr,fix,decimalLine,pointsLine,spinner,dartBoard,rectangleDiagonal,lShape,squareTriangle,rightTriangle,tallySheet,histogram,circleGraph,repDec,OVER,barText,barML,letterRun,fdpTable,measureSum,SUP,sup,sciText,powText,functionTable,numberMachines,regularPolygon,integerLineBody,integerLine,integerLines,sg,parallelogramFigure,parallelogramABCD,parallelogramMissing,TRI_SHAPES,triangleShape,circlesFigure,boxBody,solidPicture,cubeStack,prismFigure,cap,labelledOutline,inequalityBody,inequalityLine,inequalityLines,coordBody,ptsText,coordPlane,coordPlanes,UNSUP,monoText,polyText,xyTable,dotLineBody,dotLine,dotLines,inscribedPolygon,evalProduct,fx2,rootParts,rootText,cylinderFigure,triPrismFigure,spinner6,angleArcFigure,complementFigure,similarPair,nestedTriangles,laddersFigure,sightFigure,clipPoly,graphBody,graphPlane,graphPlanes,transversalFigure,semicircleRect,sectorFigure,rightTriPrism,sphereFigure,canFigure,namedRightTriangle,pyramidFigure,coneFigure,cubeWith,cylinderSphere,splitAngleFigure,constructionBody,constructionChoices,moneyC,fsamples,ratioText,parseExpr,near,rootsSimplified,parseMono,monoKey,parsePolyTerms,supToCaret,stemLeafFigure,boxPlotBody,boxPlotFigure,doubleLineGraph,outlineFigure,circlePointsFigure,inscribedFigure,findMFigure,apexRightTriangle,proofFigure,segmentFigure,angleToBisect,toRoman,stackFigure,longDivFigure,divFormsExample,barGraph,FACT_OPS,parseFacts,factKey,familyFacts,factShow,noRegroup,C1_THOUSANDS,SHADE,gridFigure,stripFigure,sectorsFigure,linear,threeFigures,twoPointFigure,pointsOnRay,c1Ruler,dialFigure,thermoFigure,sideLabelled,tableFigure,fourTables,histogramFigure,SEG_LETTERS,twoLetters,PLACE_NAMES,lineGraph,letteredLine,circleChordFigure,supplementFigure,triangleFigure,rectDiagFigure,ballsFigure,fourAnglesFigure,reflexFigure,lineRayFigure,labelledBars,countCircle,tallyFigure,roofFigure,treeBody,factorTreeFigure,twoTrees,QUAD_PTS,shapeBody,oneShape,fourShapes,abcSegment,rectWithLabels,planeWithPoints,paraFig,triHeightFig,rectDiagFig,angleFig,segBisectFig,rightFig,boxFig,turnsFig,table3,triFromSides,triDraw,fourTris,transFig,quadAngles,rectiFig,triG,pairTri,regPoly,ONES15,TENS15,numWord,FRACWORD15,fracWord,gridShapeFig,cylFig,cylInCube,sphereInCube,isoPrism,sqPyramid,towelFig,coneFig,LETTERS,letter,stripUnits,distinct,PLACES,SMALL,TENS,words,wrongOnlyBy});
if(common)module.exports=api;root.MathPortShared=api;
})(typeof globalThis!=='undefined'?globalThis:this);
