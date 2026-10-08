'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const engine=require('../src/grade5.js');
// Independent BigInt rational oracle; production uses bounded integer Number arithmetic.
function G(a,b){a=a<0n?-a:a;b=b<0n?-b:b;return b?G(b,a%b):a;}
function Q(n,d=1n){n=BigInt(n);d=BigInt(d);assert.notEqual(d,0n);if(d<0n){n=-n;d=-d;}const g=G(n,d);return [n/g,d/g];}
function op(a,b,s){return s==='+'?Q(a[0]*b[1]+b[0]*a[1],a[1]*b[1]):s==='-'?Q(a[0]*b[1]-b[0]*a[1],a[1]*b[1]):s==='*'?Q(a[0]*b[0],a[1]*b[1]):Q(a[0]*b[1],a[1]*b[0]);}
function evaluate(x){
  if(x.type==='rational')return Q(x.numerator,x.denominator);
  if(x.type==='group')return evaluate(x.child);
  if(x.type==='power'){const b=evaluate(x.base),e=evaluate(x.exponent);assert.equal(e[1],1n);return Q(b[0]**e[0],b[1]**e[0]);}
  if(x.type==='binary')return op(evaluate(x.left),evaluate(x.right),{add:'+',subtract:'-',multiply:'*',divide:'/'}[x.op]);
  throw Error('Oracle does not evaluate radicals; those are checked by squaring.');
}
function storedAnswer(item){return Q(item.answer.numerator,item.answer.denominator);}
function independentLcm(ns){let n=Math.max(...ns);while(!ns.every(v=>n%v===0))n++;return n;}
const families=engine.catalog.map(f=>f.id);

test('catalog, exact aliases, input validation and no persistence',()=>{
  assert.equal(families.length,8);assert.equal(new Set(families).size,8);
  for(const f of engine.catalog){
    const a=engine.generate(f.id,{seed:'x',index:5});assert.deepEqual(a,engine.generate(f.standard,{seed:'x',index:5}));assert.deepEqual(a,engine.generate(f.alias,{seed:'x',index:5}));
    assert.equal(a.automaticAssignmentReady,false);assert.equal(a.fullOutcomeCoverageVerified,false);assert.ok(Object.isFrozen(a));
  }
  for(const k of ['','PS.MAT.G4.MD.20.11','PS.MAT.G5.NS.20.11','made-up'])assert.throws(()=>engine.generate(k,{seed:1}),/Unsupported/);
  for(const seed of ['', ' ',null,{},[],NaN,Infinity,1.2,'x'.repeat(257)])assert.throws(()=>engine.generate(families[0],{seed}),/Seed/);
  for(const index of [-1,0.5,Infinity,NaN,'1',Number.MAX_SAFE_INTEGER+1])assert.throws(()=>engine.generate(families[0],{seed:1,index}),/index/);
  assert.throws(()=>engine.generate(families[0],{}),/Seed/);
  assert.throws(()=>engine.generate(families[0],{seed:1,grade:4}),/Unsupported generation option/);
  assert.throws(()=>engine.generate(families[0]),/Provide a seed/);
  assert.doesNotMatch(fs.readFileSync(require.resolve('../src/grade5.js'),'utf8'),/localStorage|sessionStorage|Math\.random\(/);
});

test('8,000 seeded items agree with independent mathematics and constraints',()=>{
  const seen={side:new Set(),unit:new Set(),pattern:new Set(),rootTypes:new Set(),counts:new Set(),zeroExponent:false,rootMaxP:false,rootMaxQ:false};
  for(const family of families)for(let index=0;index<1000;index++){
    const item=engine.generate(family,{seed:'verification-v1',index}),g=item.givens;
    assert.deepEqual(item,engine.generate(family,{seed:'verification-v1',index}));
    assert.ok(engine.checkAnswer(item,engine.answerText(item)).answerCorrect);
    assert.equal(engine.checkAnswer(item,'-999999').answerCorrect,false);
    assert.equal(engine.checkAnswer(item,engine.answerText(item)).fullOutcomeVerified,false);
    if(family==='g5.square-area-from-perimeter'){
      const s=g.perimeter/4;assert.ok(Number.isInteger(s)&&s>=4&&s<=26);assert.equal(item.answer.numerator,s*s);seen.side.add(s);seen.unit.add(g.unit);
    }else if(family==='g5.fraction-expression-precedence'){
      assert.deepEqual(evaluate(item.expression),storedAnswer(item));assert.ok(item.answer.numerator>0);
      for(const f of g.fractions){assert.ok(f.n>0&&f.n<f.d&&f.d>=2&&f.d<=12);assert.equal(G(BigInt(f.n),BigInt(f.d)),1n);}
      assert.ok(new Set(g.fractions.map(f=>f.d)).size>=2);seen.pattern.add(g.pattern);
      const [a,b,c,d]=g.fractions.map(x=>Q(x.n,x.d));
      const wrong=g.pattern===0?op(op(op(a,b,'+'),c,'*'),d,'-'):g.pattern===1?op(op(op(a,b,'-'),c,'*'),d,'+'):op(op(a,op(b,c,'*'),'+'),d,'-');
      assert.notDeepEqual(wrong,storedAnswer(item));
      const json=JSON.stringify(item.expression);for(const name of ['add','subtract','multiply'])assert.ok(json.includes('"'+name+'"'));
    }else if(family.includes('same-base-exponent')){
      assert.deepEqual(evaluate(item.expression),Q(BigInt(item.answer.base)**BigInt(item.answer.exponent)));
      assert.ok(g.base>=2&&g.base<=10&&g.leftExponent>=1&&g.leftExponent<=6&&g.rightExponent>=1&&g.rightExponent<=6);
      assert.ok(item.answer.exponent>=0);if(item.answer.exponent===0)seen.zeroExponent=true;
    }else if(family==='g5.rational-perfect-square-root'){
      const a=storedAnswer(item);assert.deepEqual(op(a,a,'*'),Q(g.numerator,g.denominator));assert.ok(a[0]>0n&&a[1]>1n);
      assert.ok(a[0]<=12n&&a[1]<=12n);seen.rootTypes.add(a[0]<a[1]?'proper':'improper');if(a[0]===12n)seen.rootMaxP=true;if(a[1]===12n)seen.rootMaxQ=true;
    }else if(family==='g5.rectangular-prism-net-area'){
      assert.ok(1<=g.c&&g.c<g.b&&g.b<g.a&&g.a<=25);
      const faces=item.visual.faces;assert.equal(faces.length,6);assert.equal(new Set(faces.map(f=>f.id)).size,6);
      assert.equal(item.answer.numerator,2*(g.a*g.b+g.a*g.c+g.b*g.c));
      assert.equal(faces.reduce((sum,f)=>sum+f.width*f.height,0),item.answer.numerator);
      for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){
        const a=faces[i],b=faces[j];const overlap=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>0&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>0;assert.equal(overlap,false);
      }
      assert.equal(item.workRubric.length,3);
    }else{
      assert.equal(new Set(g.values).size,g.values.length);assert.ok(g.values.every(n=>n>=2&&n<=12));seen.counts.add(g.values.length);
      assert.equal(item.answer.numerator,independentLcm(g.values));
      if(g.method==='listing')assert.ok(g.values.every(n=>item.answer.numerator/n<=12));
      assert.ok(engine.checkAnswer(item,String(item.answer.numerator)).requiresTeacherReview);
    }
  }
  assert.equal(seen.side.size,23);assert.equal(seen.unit.size,4);assert.equal(seen.pattern.size,3);assert.equal(seen.rootTypes.size,2);assert.equal(seen.counts.size,2);
  assert.ok(seen.zeroExponent&&seen.rootMaxP&&seen.rootMaxQ);
});

test('six-face net topology folds to six distinct cube-face normals',()=>{
  // Orientation propagation uses topology and face adjacency, independently of the renderer.
  const neg=v=>v.map(n=>-n),same=(a,b)=>a.every((v,i)=>v===b[i]);
  for(let index=0;index<100;index++){
    const f=engine.generate('g5.rectangular-prism-net-area',{seed:'net',index}).visual.faces;
    const orientations=new Map([[1,[[1,0,0],[0,1,0],[0,0,1]]]]),queue=[f[0]];
    while(queue.length){const a=queue.shift(),[u,v,n]=orientations.get(a.id);
      for(const b of f){if(orientations.has(b.id))continue;let next;
        if(a.x+a.width===b.x&&a.y===b.y&&a.height===b.height)next=[neg(n),v,u];
        else if(b.x+b.width===a.x&&a.y===b.y&&a.height===b.height)next=[n,v,neg(u)];
        else if(a.y+a.height===b.y&&a.x===b.x&&a.width===b.width)next=[u,neg(n),v];
        else if(b.y+b.height===a.y&&a.x===b.x&&a.width===b.width)next=[u,n,neg(v)];
        if(next){orientations.set(b.id,next);queue.push(b);}
      }
    }
    assert.equal(orientations.size,6);const normals=[...orientations.values()].map(x=>x[2]);
    for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)assert.equal(same(normals[i],normals[j]),false);
  }
});

test('answer forms, equivalent values, units and required work remain distinct',()=>{
  let q=engine.generate('g5.rational-perfect-square-root',{seed:'answer'}),{numerator:n,denominator:d}=q.answer;
  assert.equal(engine.checkAnswer(q,`${n*2}/${d*2}`).valueCorrect,true);assert.equal(engine.checkAnswer(q,`${n*2}/${d*2}`).formatCorrect,false);
  assert.equal(engine.checkAnswer(q,`${-n}/${d}`).answerCorrect,false);assert.equal(engine.checkAnswer(q,'1/0').answerCorrect,false);
  assert.equal(engine.checkAnswer(q,'1 + 2').answerCorrect,false);assert.equal(engine.checkAnswer(q,'<script>alert(1)</script>').answerCorrect,false);
  for(let i=0;i<100;i++){q=engine.generate('g5.rational-perfect-square-root',{seed:'mixed',index:i});if(q.answer.numerator>q.answer.denominator)break;}
  ({numerator:n,denominator:d}=q.answer);assert.equal(engine.checkAnswer(q,`${Math.floor(n/d)} ${n%d}/${d}`).answerCorrect,true);
  q=engine.generate('g5.square-area-from-perimeter',{seed:'units'});n=q.answer.numerator;const unit=q.answer.unit;
  assert.equal(engine.checkAnswer(q,String(n)).valueCorrect,true);assert.equal(engine.checkAnswer(q,String(n)).unitCorrect,false);
  assert.equal(engine.checkAnswer(q,{value:String(n),unit}).answerCorrect,true);
  assert.equal(engine.checkAnswer(q,`${n}.0 ${unit}`).answerCorrect,true);
  assert.equal(engine.checkAnswer(q,`${n} ${unit.replace('^2','²')}`).answerCorrect,true);
  assert.equal(engine.checkAnswer(q,`${n} ${unit.replace('^2','')}`).answerCorrect,false);
  q=engine.generate('g5.same-base-exponent-product',{seed:'power'});
  assert.equal(engine.checkAnswer(q,String(q.answer.base**q.answer.exponent)).valueCorrect,true);
  assert.equal(engine.checkAnswer(q,String(q.answer.base**q.answer.exponent)).formatCorrect,false);
  assert.equal(engine.checkAnswer(q,`${q.answer.base}^${q.answer.exponent}`).answerCorrect,true);
  for(const f of ['g5.lcm-listing','g5.lcm-prime-factorization','g5.rectangular-prism-net-area']){q=engine.generate(f,{seed:'work'});assert.equal(engine.checkAnswer(q,engine.answerText(q)).requiresTeacherReview,true);}
});

test('browser global and CommonJS return identical questions; student output excludes answers',()=>{
  const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../src/grade5.js'),'utf8'),context);
  for(const id of families){
    const q=engine.generate(id,{seed:'cross-runtime',index:12});
    assert.equal(JSON.stringify(q),JSON.stringify(context.MathEngineG5.generate(id,{seed:'cross-runtime',index:12})));
    const html=engine.renderQuestion(q);assert.doesNotMatch(html,/Worked solution|Teacher work review|Answer:/);assert.match(engine.renderSolution(q),/Worked solution/);
  }
  const q=JSON.parse(JSON.stringify(engine.generate(families[0],{seed:'escape'})));q.prompt='<script>alert("x")</script>';assert.ok(engine.renderQuestion(q).includes('&lt;script&gt;'));assert.ok(!engine.renderQuestion(q).includes('<script>'));
});
