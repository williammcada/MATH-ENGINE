const assert=require('node:assert/strict'),P=require('../src/proportional-bank'),E=require('../src/course-banks');
function q(form,n,d=1){return {answer:{form,numerator:String(n),denominator:String(d)}}}function check(form,n,d,good,bad){for(const s of good)assert.ok(P.check(q(form,n,d),s).answerCorrect,s);for(const s of bad)assert.ok(!P.check(q(form,n,d),s).answerCorrect,s);}
check('fraction',1,2,['1/2'],['2/4','0.5','1/0','1/2%']);
check('mixed',5,3,['1 2/3'],['5/3','1 4/6','0 5/3','1.66666667']);
check('decimal',1,2,['0.5','0.50'],['1/2','50%','0.50000001']);
check('ratio',2,3,['2:3','2 to 3'],['4:6','3:2','2/3','2:0']);
check('integer',1200,1,['1200','1,200'],['12,00','1200.0','2400/2']);
check('percent',100,3,['100/3%','33 1/3','33 1/3%'],['33.33%','0.3333','100/0']);
check('number',3,2,['3/2','1 1/2','1.5'],['1.4','3/0','1+0.5']);
const ids=new Set(E.catalog.map(c=>c.sourceId));assert.equal(ids.size,310);assert.equal(P.catalog.length,38);
for(const c of P.catalog){const x=E.generate(c.sourceId);assert.ok(Object.isFrozen(x));assert.equal(E.checkAnswer(x,E.answerText(x)).fullOutcomeVerified,false);assert.ok(!P.render({...x,prompt:'<script>alert(1)</script>'}).includes('<script>'));}
console.log('PASS: answer-form boundaries, exact recurring percentages, unique IDs, immutability and escaping');
