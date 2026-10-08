'use strict';
const assert=require('node:assert/strict'),E=require('../src/course-banks.js'),B=require('../src/breadth-bank.js'),H=require('../src/graph-svg.js');
const get=(recipe,index=0)=>E.generate(B.catalog.find(x=>x.recipe===recipe).sourceId,{seed:'boundaries',index}),yes=(q,a)=>assert.equal(E.checkAnswer(q,a).answerCorrect,true,a),no=(q,a)=>assert.equal(E.checkAnswer(q,a).answerCorrect,false,a);
for(const c of B.catalog){for(let i=0;i<20;i++){const q=E.generate(c.sourceId,{seed:'contracts',index:i});yes(q,E.answerText(q));no(q,'');no(q,'<script>alert(1)</script>');no(q,'1;2;3;4;5;6;7;8;9');assert.ok(Object.isFrozen(q.givens.parameters));assert.equal(E.checkAnswer(q,E.answerText(q)).fullOutcomeVerified,false);}}
let q=get('scientific-normalize'),[a,n]=E.answerText(q).split(';').map(Number);no(q,`${a*10};${n-1}`);no(q,`${a};${n}.0`);no(q,`${a};${n};0`);
q=get('prime-factorization');no(q,q.givens.parameters.n);yes(q,E.answerText(q).replace(/ × /g,'*'));no(q,'1*'+E.answerText(q));no(q,'2^0*'+E.answerText(q));
q=get('repeating-fraction');const r=q.answer.values[0];no(q,`${2*Number(r.numerator)}/${2*Number(r.denominator)}`);no(q,Number(r.numerator)/Number(r.denominator));
q=get('factor-trinomial');yes(q,E.answerText(q).split(';').reverse().join(';'));const cs=q.answer.values.map(v=>Number(v.numerator)/Number(v.denominator));if(cs[0]+cs[1]!==0)no(q,cs.map(x=>-x).join(';'));
q=get('set-union');yes(q,'{'+[...q.answer.values].reverse().join(',')+'}');no(q,'{'+[...q.answer.values,q.answer.values[0]].join(',')+'}');no(q,'{'+q.answer.values.join(',')+',999}');
q=get('clock-read');yes(q,E.answerText(q)+' AM');no(q,E.answerText(q)+' PM');no(q,'13:00');no(q,'9:60');
q=get('binary-write');no(q,'0'+E.answerText(q));no(q,parseInt(E.answerText(q),2));
q=get('complex-divide');no(q,E.answerText(q)+'i');no(q,E.answerText(q).split(';').slice(0,1).join(';'));
for(const recipe of ['function-sum','function-product']){let found=false;for(let i=0;i<100;i++){q=get(recipe,i);if(q.answer.text==='undefined'){yes(q,'UNDEFINED');no(q,'0');found=true;break;}}assert.ok(found);}
for(const args of [['line',{m:0,b:1}],['line',{m:Infinity,b:0}],['line',{m:1,b:100}],['number-line',{boundary:1.5,direction:'left',closed:true}],['number-line',{boundary:1,direction:'up',closed:true}],['number-line',{boundary:1,direction:'left',closed:'false'}],['bars',{values:[1,2,3]}],['bars',{values:[1,2,3,4,5,-1]}],['clock',{hour:0,minute:15}],['clock',{hour:5,minute:60}]])assert.throws(()=>H.model(...args));
for(const m of [-5,-2,-.5,.5,2,5])for(const b of [-6,-1,0,1,6]){const ps=H.lineSegment(m,b);assert.equal(ps.length,2);for(const [x,y]of ps){assert.ok(Math.abs(m*x+b-y)<1e-10);assert.ok(Math.abs(x)<=8&&Math.abs(y)<=8);}}
q=structuredClone(get('function-table'));q.prompt='<img src=x>';q.givens.table.headers[0]='<script>';const html=B.render(q);assert.ok(!html.includes('<img')&&!html.includes('<script>'));assert.match(html,/&lt;script&gt;/);
assert.equal(E.catalog.length,new Set(E.catalog.map(x=>x.sourceId)).size);
console.log('PASS: breadth answer forms, domains, invalid inputs, graph model bounds, clipping, escaping and immutability');
