/* Original exact affine solver. Only a single linear variable is accepted. */
(function(root){'use strict';
const M=typeof module!=='undefined'&&module.exports?require('./structured-math.js'):root.MathStructured;
const catalog=typeof module!=='undefined'&&module.exports?require('./linear-bank-map.js'):root.MathLinearBankMap;
const zero=()=>M.rat(0),one=()=>M.rat(1),nonzero=a=>a.n!==0n;
function affine(n,variable='x',depth=0){if(depth>32||!n||typeof n!=='object')throw Error('Invalid linear expression');const f=x=>affine(x,variable,depth+1),constant=b=>({a:zero(),b});
 if(n.type==='power'||n.type==='abs'){function hasVariable(v){return v&&typeof v==='object'&&(v.type==='variable'||Object.values(v).some(hasVariable));}if(hasVariable(n))throw Error('Variable in constant operation');return constant(M.evaluate(n));}
 if(n.type==='number')return constant(M.evaluate(n));
 if(n.type==='variable'){if(n.name!==variable||!/^[a-z]$/i.test(variable))throw Error('Unexpected variable');return{a:one(),b:zero()};}
 if(n.type==='neg'){const v=f(n.arg);return{a:M.op('sub',zero(),v.a),b:M.op('sub',zero(),v.b)};}
 if(!['add','sub','mul','div'].includes(n.type))throw Error('Unsupported linear operation');
 const l=f(n.left),r=f(n.right);
 if(n.type==='add'||n.type==='sub')return{a:M.op(n.type,l.a,r.a),b:M.op(n.type,l.b,r.b)};
 if(n.type==='mul'){if(nonzero(l.a)&&nonzero(r.a))throw Error('Nonlinear product');return{a:M.op('add',M.op('mul',l.a,r.b),M.op('mul',r.a,l.b)),b:M.op('mul',l.b,r.b)};}
 if(nonzero(r.a))throw Error('Variable denominator');return{a:M.op('div',l.a,r.b),b:M.op('div',l.b,r.b)};
}
function solve(e,variable='x'){if(e.type!=='equation')throw Error('Expected equation');const l=affine(e.left,variable),r=affine(e.right,variable),coefficient=M.op('sub',l.a,r.a),constant=M.op('sub',r.b,l.b);if(!nonzero(coefficient))return{kind:nonzero(constant)?'none':'infinite',left:l,right:r};return{kind:'unique',answer:M.op('div',constant,coefficient),coefficient,constant,left:l,right:r};}
function generate(c,seed,index,int,version){const t=c.template,N=v=>({type:'number',value:String(v)}),asNode=v=>t.mode==='decimal'&&M.decimalText(v)!==null?N(M.decimalText(v)):v.d===1n?N(v.n):{type:'div',left:N(v.n),right:N(v.d)};
 for(let attempt=0;attempt<4000;attempt++){
  const values={};for(const [name,p]of Object.entries(t.parameters))values[name]=M.rat(int(p[0],p[1])*(p[3]&&int(0,1)?-1:1),p[2]);
  function fill(n){if(n.type==='parameter'){if(!Object.hasOwn(values,n.name))throw Error('Unknown template parameter');return asNode(values[n.name]);}const out={};for(const[k,v]of Object.entries(n))out[k]=v&&typeof v==='object'?fill(v):v;return out;}
  const expression=fill(t.expression),s=solve(expression,t.variable);if(s.kind!=='unique')continue;const a=s.answer;
  if(t.positiveAnswer&&a.n<=0n||a.n>BigInt(t.maxAnswer)*a.d||a.n< -BigInt(t.maxAnswer)*a.d)continue;
  if(t.mode==='integer'&&a.d!==1n||t.mode==='decimal'&&M.decimalText(a,6)===null)continue;
  const fmt=v=>M.format(v,t.mode),solution=`Collect like terms on each side: (${fmt(s.left.a)}) × ${t.variable} + (${fmt(s.left.b)}) = (${fmt(s.right.a)}) × ${t.variable} + (${fmt(s.right.b)}). Subtract (${fmt(s.right.a)}) × ${t.variable} and (${fmt(s.left.b)}) from both sides: (${fmt(s.coefficient)}) × ${t.variable} = ${fmt(s.constant)}. Divide both sides by ${fmt(s.coefficient)}: ${t.variable} = ${fmt(a)}.`;
  return{version,sourceId:c.sourceId,family:c.family,seed:String(seed),index,provenance:{relationship:c.relationship,exactLegacyReproduction:false},givens:{expression,parameters:Object.fromEntries(Object.entries(values).map(([k,v])=>[k,M.serialize(v)]))},prompt:`Solve for ${t.variable}. Give an exact ${t.mode==='integer'?'integer':t.mode==='decimal'?'decimal':'fraction, mixed number, or terminating decimal'} answer.`,answer:{kind:'structured',...M.serialize(a),mode:t.mode},solution};
 }
 throw Error('No unique equation within the template constraints');
}
const api=Object.freeze({catalog,affine,solve,generate});if(typeof module!=='undefined'&&module.exports)module.exports=api;root.MathLinearEquations=api;
})(typeof globalThis!=='undefined'?globalThis:this);
