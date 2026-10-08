/* Exact real quadratic roots and a bounded, non-evaluating answer grammar. */
(function(root){'use strict';
const M=typeof module!=='undefined'&&module.exports?require('./structured-math.js'):root.MathStructured;
const z=()=>M.rat(0),r=n=>M.rat(n),neg=a=>M.rat(-a.n,a.d),eq=(a,b)=>a.n===b.n&&a.d===b.d;
function squareParts(n){if(!Number.isSafeInteger(n)||n<0||n>1000000)throw Error('Square-root limit');if(!n)return{outside:0,inside:1};let outside=1,inside=1;for(let p=2;p*p<=n;p++){let e=0;while(n%p===0){e++;n/=p;}outside*=p**Math.floor(e/2);if(e%2)inside*=p;}return{outside,inside:inside*n};}
function value(a,b=z(),d=1){if(!b.n)return{a,b:z(),d:1};const s=squareParts(d);b=M.op('mul',b,r(s.outside));if(s.inside===1)return{a:M.op('add',a,b),b:z(),d:1};return{a,b,d:s.inside};}
function operation(k,x,y){if(x.b.n&&y.b.n&&x.d!==y.d)throw Error('Different radicals');const d=x.b.n?x.d:y.d;
 if(k==='add'||k==='sub')return value(M.op(k,x.a,y.a),M.op(k,x.b,y.b),d);
 if(k==='mul')return value(M.op('add',M.op('mul',x.a,y.a),M.op('mul',M.op('mul',x.b,y.b),r(d))),M.op('add',M.op('mul',x.a,y.b),M.op('mul',x.b,y.a)),d);
 if(k==='div'){const den=M.op('sub',M.op('mul',y.a,y.a),M.op('mul',M.op('mul',y.b,y.b),r(d)));const top=operation('mul',x,value(y.a,neg(y.b),d));return value(M.op('div',top.a,den),M.op('div',top.b,den),d);}
 throw Error('Unknown operation');}
function serialize(v){return{rational:M.serialize(v.a),radicalCoefficient:M.serialize(v.b),radicand:v.d};}
function from(v){return value(M.from(v.rational),M.from(v.radicalCoefficient),v.radicand);}
function same(x,y){return eq(x.a,y.a)&&eq(x.b,y.b)&&x.d===y.d;}
function format(v){if(!v.b.n)return M.format(v.a);const term=(v.b.n<0n?'-':'')+(v.b.n===v.b.d||v.b.n===-v.b.d?'':M.format(M.rat(v.b.n<0n?-v.b.n:v.b.n,v.b.d))+'*')+'sqrt('+v.d+')';return v.a.n?M.format(v.a)+(v.b.n>0n?'+':'')+term:term;}
function parse(s){s=String(s).trim().replace(/−/g,'-');if(s.length>180)throw Error('Answer limit');
 // Whole mixed-number answers share the existing exact parser.
 if(/^[+-]?\d+\s+\d+\/\d+$/.test(s))return value(M.parseAnswer(s));
 const tokens=s.match(/sqrt|\d+(?:\.\d+)?|[()+*/-]|\S/g)||[];let p=0,depth=0;if(tokens.length>100)throw Error('Token limit');
 function atom(){if(++depth>20)throw Error('Nesting limit');let t=tokens[p++],v;if(t==='+'||t==='-'){v=atom();if(t==='-')v=value(neg(v.a),neg(v.b),v.d);}else if(t==='('){v=expression();if(tokens[p++]!==')')throw Error('Missing bracket');}else if(t==='sqrt'){if(tokens[p++]!=='(')throw Error('sqrt format');const n=tokens[p++];if(!/^\d{1,7}$/.test(n||'')||tokens[p++]!==')')throw Error('Integer square root only');v=value(z(),r(1),Number(n));}else{if(!/^\d{1,16}(?:\.\d{1,8})?$/.test(t||''))throw Error('Invalid token');v=value(M.decimal(t));}depth--;return v;}
 function product(){let v=atom();while(tokens[p]==='*'||tokens[p]==='/'){const k=tokens[p++];v=operation(k==='*'?'mul':'div',v,atom());}return v;}
 function expression(){let v=product();while(tokens[p]==='+'||tokens[p]==='-'){const k=tokens[p++];v=operation(k==='+'?'add':'sub',v,product());}return v;}
 const v=expression();if(p!==tokens.length)throw Error('Unexpected input');return v;
}
function solve(a,b,c){for(const n of[a,b,c])if(!Number.isSafeInteger(n)||Math.abs(n)>10000)throw Error('Coefficient limit');if(!a)throw Error('Not quadratic');const D=b*b-4*a*c;if(Math.abs(D)>1000000)throw Error('Discriminant limit');if(D<0)return{discriminant:D,classification:'two nonreal complex solutions',roots:[]};const center=M.rat(-b,2*a),offset=M.rat(1,2*a);const first=value(center,offset,D),second=value(center,neg(offset),D);return{discriminant:D,classification:D===0?'one real solution':'two real solutions',roots:same(first,second)?[first]:[first,second]};}
function checkRoots(expected,s){try{const parts=String(s).split(';');if(parts.length!==expected.length)return false;const got=parts.map(parse);return got.every((v,i)=>!got.slice(0,i).some(w=>same(v,w)))&&expected.every(v=>got.some(w=>same(from(v),w)));}catch{return false;}}
const api=Object.freeze({squareParts,value,operation,serialize,from,same,format,parse,solve,checkRoots});if(typeof module!=='undefined'&&module.exports)module.exports=api;root.MathQuadratic=api;
})(typeof globalThis!=='undefined'?globalThis:this);
