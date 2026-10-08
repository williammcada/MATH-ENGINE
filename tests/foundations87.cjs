const assert=require('node:assert/strict'),E=require('../src/course-banks'),F=require('../src/foundations87'),fs=require('node:fs');
const q=(r,index=0)=>E.generate('course-87-en:authored:MCADA-'+r,{seed:'boundaries',index}),ok=(q,s)=>E.checkAnswer(q,s).answerCorrect;
assert.equal(F.catalog.length,30);assert.equal(E.catalog.length,891);assert.equal(new Set(E.catalog.map(c=>c.sourceId)).size,891);
for(const c of F.catalog){const z=q(c.recipe);assert.ok(Object.isFrozen(z)&&Object.isFrozen(z.answer));for(const s of ['',null,'<script>','NaN','Infinity','1e9','0'.repeat(700)])assert.equal(ok(z,s),false,c.recipe+': '+s);}
for(let i=0;i<30;i++){
 const z=q('1.8',i);assert.ok(ok(z,E.answerText(z)));assert.equal(ok(z,String(z.answer.quotient)),false);if(z.answer.kind==='mixed-division'){const a=z.answer;assert.equal(ok(z,`${a.quotient} ${2*a.remainder}/${2*a.divisor}`),false);}
 const money=q('1.4',i),a=E.answerText(money);assert.ok(ok(money,a));assert.equal(ok(money,a.replace(/[$¢]/g,'')),false);
 const eq=q('2.2',i),[left,right]=eq.answer.value.split('=');assert.ok(ok(eq,right+'='+left));for(const s of eq.answer.alternatives)assert.ok(ok(eq,s));assert.equal(ok(eq,'1=1'),false);
 const div=q('6.3',i);assert.equal(ok(div,div.answer.divisible?'yes':'no'),false);
 const form=q('5.2',i);if(form.answer.values.length>1)assert.equal(ok(form,String(form.givens.parameters.n)),false);
}
assert.equal(F.words(0),'zero');assert.equal(F.words(100000000000000),'one hundred trillion');assert.equal(F.words(100000000000001),'one hundred trillion one');assert.equal(F.words(999999999999999),'nine hundred ninety-nine trillion nine hundred ninety-nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine');assert.throws(()=>F.words(1e15));assert.throws(()=>F.words(-1));
const defs=JSON.parse(fs.readFileSync(__dirname+'/../curriculum/mcada-g5/foundations87-v0.1.json')).tasks,old=JSON.parse(fs.readFileSync(__dirname+'/../curriculum/mcada-g5/v0.2/coverage-map.json')).outcomes;
for(const c of defs){const row=old.find(o=>o.source_code===c.standard);assert.equal(c.alias,row.gradecam_alias);assert.equal(c.objective,row.objective.trim());assert.equal(c.lessonId,'course-87-en:scope:'+c.recipe.split('.')[0]);}
console.log('PASS: 30 exact outcome contracts, immutable records, response boundaries, distinct authored IDs and 15-digit number-word boundaries.');

for(const r of ['5.1','5.2','5.3','5.4','5.5']){const z=q(r,30);assert.equal(z.givens.parameters.n,0);assert.ok(ok(z,E.answerText(z)));}
