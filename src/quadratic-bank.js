(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports,M=common?require('./structured-math.js'):root.MathStructured,Q=common?require('./quadratic-math.js'):root.MathQuadratic,catalog=common?require('./quadratic-bank-map.js'):root.MathQuadraticBankMap;
const N=v=>({type:'number',value:String(v)}),x={type:'variable',name:'x'},O=(type,left,right)=>({type,left,right}),sq={type:'power',base:x,exponent:N(2)};
function poly(a,b,c){const terms=[];if(a)terms.push(a===1?sq:O('mul',N(a),sq));if(b)terms.push(b===1?x:O('mul',N(b),x));if(c||!terms.length)terms.push(N(c));return terms.reduce((l,r)=>O('add',l,r));}
function generate(c,seed,index,int,version){const signed=(a,b)=>int(a,b)*(int(0,1)?1:-1);let a,b,d,parameters,coefficients,left,right,extra;
 for(let attempt=0;attempt<1000;attempt++){
  extra='';
  switch(c.recipe){
   case'opposite-roots':a=int(2,9);b=int(3,9);if(a===b)continue;parameters={a,b};coefficients=[1,a-b,-a*b];left=poly(1,a-b,0);right=N(a*b);break;
   case'square-integer':case'square-integer-wide':a=c.recipe==='square-integer'?[2,3,5,6,7,10,11,13][int(0,7)]:int(2,14);parameters={a};coefficients=[1,0,-a*a];left=sq;right=N(a*a);break;
   case'square-fraction':a=int(2,10);b=int(2,9);if(gcd(a,b)!==1)continue;parameters={a,b};coefficients=[a*a,0,-b*b];left=N(b*b);right=poly(a*a,0,0);break;
   case'signed-rearranged':case'signed-reversed':a=signed(1,9);b=signed(2,9);if(Math.abs(a)===Math.abs(b))continue;parameters={a,b};coefficients=[1,a+b,a*b];if(c.recipe==='signed-rearranged'){const sign=Math.sign(a+b);left=poly(0,(a+b)/sign,a*b/sign);right=poly(-sign,0,0);coefficients=[sign,(a+b)/sign,a*b/sign];}else{left=poly(0,a+b,0);right=poly(-1,0,-a*b);}break;
   case'negative-roots':a=int(1,9);b=int(1,8);if(a===b)continue;parameters={a,b};coefficients=[1,a+b,a*b];left=poly(1,a+b,0);right=N(-a*b);break;
   case'scaled-roots':{a=int(2,4);const repeated=!!int(0,1),r=repeated?signed(1,4):-int(1,6),s=repeated?r:int(1,6);parameters={a,r,s,repeated};coefficients=[a,-a*(r+s),a*r*s];left=poly(...coefficients);right=N(0);break;}
   case'formula-standard':a=int(2,8);b=signed(3,12);d=signed(1,5);if(gcd(a,Math.abs(b))!==1)continue;coefficients=[a,b,d];if(b*b-4*a*d<=0||Q.squareParts(b*b-4*a*d).outside!==1||Q.squareParts(b*b-4*a*d).inside===1)continue;parameters={a,b,c:d};left=poly(a,b,0);right=N(-d);break;
   case'formula-rearranged':a=int(2,3);b=int(5,7);d=signed(1,1);coefficients=[a,-b,-d];if(Q.squareParts(b*b+4*a*d).inside===1)continue;parameters={a,b,c:d};left=poly(a,0,-d);right=poly(0,b,0);break;
   case'complete-irrational':b=signed(1,4);d=signed(1,6);if(b*b-d<=0||Q.squareParts(b*b-d).inside===1)continue;parameters={b,c:d};coefficients=[1,2*b,d];left=poly(1,0,d);right=poly(0,-2*b,0);break;
   case'factored-rational':{a=int(2,5);b=signed(2,5);const e=signed(2,6),f=int(2,5),g=-Math.sign(b)*int(2,5);if(gcd(a,Math.abs(b))!==1||gcd(f,Math.abs(g))!==1||a*g+b*f===0)continue;parameters={a,b,c:f,d:g,e};coefficients=[a*f*e,e*(a*g+b*f),b*g*e];left=poly(0,coefficients[1],coefficients[2]);right=poly(-coefficients[0],0,0);extra=`Move all terms to the left, then factor: (${e}) × (${a}x + (${b})) × (${f}x + (${g})) = 0. Set each linear factor equal to zero. `;break;}
   case'classify':a=signed(1,4);b=int(-8,8);d=int(-6,6);parameters={a,b,c:d};coefficients=[a,b,d];left=poly(a,0,0);right=poly(0,-b,-d);break;
   default:throw Error('Unknown quadratic recipe');
  }
  const solved=Q.solve(...coefficients),expression=O('equation',left,right),[A,B,C]=coefficients,D=solved.discriminant,fmt=(n,d=1)=>M.format(M.rat(n,d));
  let prompt,answer,solution;
  if(c.method==='classify'){prompt='Classify the solutions using the discriminant. Enter: two real solutions; one real solution; or two nonreal complex solutions. Do not solve the equation.';answer={kind:'quadratic-classification',value:solved.classification};solution=`Write the equation as ${A}x² + (${B})x + (${C}) = 0. The discriminant is (${B})² − 4 × (${A}) × (${C}) = ${D}. It is ${D<0?'negative':D===0?'zero':'positive'}, so there ${D===0?'is one real solution':'are '+solved.classification}.`;}
  else{
   if(!solved.roots.length)continue;
   const roots=solved.roots.map(Q.serialize),result=solved.roots.map(Q.format).join('; ');
   prompt=({factor:'Solve by factoring.', 'complete-square':'Solve by completing the square.','quadratic-formula':'Solve using the quadratic formula.',solve:'Solve the equation.'}[c.method])+' Give every distinct real solution, separated by semicolons, in either order. Write a repeated root once. Give exact answers; use sqrt(5) for √5 and * for multiplication, for example (1+sqrt(5))/2. Do not round.';
   answer={kind:'quadratic-roots',roots};
   const standard=`Move all terms to the left: ${A}x² + (${B})x + (${C}) = 0. `;
   if(c.method==='complete-square')solution=standard+`Divide by ${A}, move the constant and add (${fmt(B,2*A)})² to both sides: (x + (${fmt(B,2*A)}))² = ${fmt(D,4*A*A)}. Take both square roots and subtract ${fmt(B,2*A)}. Solutions: ${result}.`;
   else if(c.method==='factor')solution=extra+`Solutions: ${result}.`;
   else solution=standard+`The discriminant is (${B})² − 4 × (${A}) × (${C}) = ${D}. Using x = (−b ± √(b² − 4ac))/(2a), x = (${ -B} ± sqrt(${D}))/(${2*A}). ${D===0?'Both signs give the same root. ':''}Solutions: ${result}.`;
  }
  return{version,sourceId:c.sourceId,family:c.family,seed:String(seed),index,provenance:{relationship:c.relationship,exactLegacyReproduction:false},givens:{expression,parameters,coefficients,discriminant:D},prompt,answer,solution};
 }
 throw Error('No valid quadratic variant');
}
function gcd(a,b){while(b)[a,b]=[b,a%b];return a;}
function answerText(q){return q.answer.kind==='quadratic-roots'?q.answer.roots.map(v=>Q.format(Q.from(v))).join('; '):q.answer.value;}
function check(q,s){return{answerCorrect:q.answer.kind==='quadratic-roots'?Q.checkRoots(q.answer.roots,s):String(s).trim().toLowerCase().replace(/\s+/g,' ')===q.answer.value,fullOutcomeVerified:false};}
const api=Object.freeze({catalog,generate,answerText,check});if(common)module.exports=api;root.MathQuadraticBank=api;
})(typeof globalThis!=='undefined'?globalThis:this);
