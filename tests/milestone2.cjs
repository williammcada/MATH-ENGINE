const E=require('../src/course-banks'),assert=require('node:assert/strict'),fs=require('node:fs');
const catalog=E.catalog.filter(c=>c.family==='structured-foundational-courses');assert.equal(catalog.length,400);assert.equal(new Set(E.catalog.map(c=>c.sourceId)).size,E.catalog.length);
const coverage=require('../curriculum/remaining-courses/milestone2-v0.1/coverage.json');assert.equal(coverage.length,269);assert.equal(coverage.filter(x=>!x.entries.length).length,1);for(const row of coverage)for(const id of row.entries)assert(catalog.some(c=>c.sourceId===id&&c.lessonId===row.lessonId));
let generated=0,teacher=0;const samples=[];for(const c of catalog)for(let index=0;index<48;index++){
 const q=E.generate(c.sourceId,{seed:'milestone2-independent',index});assert.deepEqual(q,E.generate(c.sourceId,{seed:'milestone2-independent',index}));assert(Object.isFrozen(q));assert(E.renderQuestion(q).includes('engine-question'));assert(!/NaN|undefined|Infinity/.test(JSON.stringify(q)));assert(q.provenance.exactLegacyReproduction===false);
 if(q.answer.kind==='teacher'){assert(q.answer.rubric.length>=2);assert.equal(E.checkAnswer(q,'anything').answerCorrect,null);teacher++;}else{assert(E.checkAnswer(q,E.answerText(q)).answerCorrect);assert(!E.checkAnswer(q,'this is not an answer').answerCorrect);}
 if(!c.reuseSourceId)samples.push({recipe:c.recipe,course:c.course,q});generated++;
}
fs.writeFileSync(process.env.M2_SAMPLES||'/tmp/m2-samples.json',JSON.stringify(samples));console.log(JSON.stringify({generated,teacher,numericOrText:generated-teacher,newRecipeSamples:samples.length,sourceIdentityAndCoverage:'passed'}));
