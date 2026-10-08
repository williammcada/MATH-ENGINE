const assert=require('node:assert/strict'),E=require('../src/course-banks'),M=require('../src/structured-math'),T=require('../src/measurement-bank');
for(const [input,expected]of [['1.0049','1'],['1.005','1.01'],['1.0051','1.01'],['0.005','0.01'],['123.995','124'],['0','0']])assert.equal(M.format(T.roundCents(M.decimal(input)),'decimal'),expected);assert.throws(()=>T.roundCents(M.rat(-1)));
const money={answer:{mode:'money',numerator:'201',denominator:'200'}};assert.ok(T.check(money,'$1.005').answerCorrect);assert.ok(!T.check(money,'$1.01').answerCorrect);assert.ok(!T.check(money,'1+0.005').answerCorrect);
const tax=E.generate('course-87-en:item:SN870247');assert.ok(E.checkAnswer(tax,E.answerText(tax)).answerCorrect);assert.ok(!E.checkAnswer(tax,'4.3%').answerCorrect);
const count=E.generate('course-87-en:item:SX870149');assert.ok(!E.checkAnswer(count,E.answerText(count)+' seconds').answerCorrect);
assert.equal(new Set(E.catalog.map(c=>c.sourceId)).size,418);assert.equal(T.catalog.length,26);
for(const c of T.catalog){const q=E.generate(c.sourceId);assert.ok(Object.isFrozen(q));assert.equal(E.checkAnswer(q,E.answerText(q)).fullOutcomeVerified,false);assert.ok(!T.render({...q,prompt:'<script>x</script>'}).includes('<script>'));}
console.log('PASS: money rounding boundaries, malformed answers, numeric-only units, immutable entries and safe rendering');
