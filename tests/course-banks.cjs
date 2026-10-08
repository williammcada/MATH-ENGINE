const assert=require('node:assert/strict'),E=require('../src/course-banks.js');
function gcd(a,b){while(b){[a,b]=[b,a%b];}return a;}
let count=0;
for(const c of E.catalog){for(let n=0;n<1000;n++){
 const q=E.generate(c.sourceId,{seed:'independent-audit',index:n}),g=q.givens,a=q.answer;assert.deepEqual(q,E.generate(c.sourceId,{seed:'independent-audit',index:n}));assert.ok(Object.isFrozen(q)&&Object.isFrozen(g));
 switch(c.family){
 case'whole-division-remainder':assert.equal(a.quotient,Math.floor(g.dividend/g.divisor));assert.equal(a.remainder,g.dividend%g.divisor);assert.ok(g.divisor>=53&&g.divisor<=97&&a.quotient>=226&&a.quotient<=365&&a.remainder<=35);break;
 case'mixed-number-addition':{const l=g.left,r=g.right;const den=l.denominator*r.denominator,num=(l.whole+r.whole)*den+l.numerator*r.denominator+r.numerator*l.denominator;assert.equal(a.numerator*den,num*a.denominator);assert.equal(gcd(a.numerator,a.denominator),1);assert.notEqual(l.denominator,r.denominator);assert.equal(gcd(l.numerator,l.denominator),1);assert.equal(gcd(r.numerator,r.denominator),1);break;}
 case'three-place-values':for(let j=0;j<3;j++){const p=g.positions[j];assert.equal(a.values[j],Number(String(g.number)[p])*10**(5-p));}assert.equal(new Set(g.digits).size,6);break;
 case'segment-difference':assert.equal(a.value+g.abCents,g.acCents);assert.ok(g.abCents<g.acCents&&g.abCents>=101&&g.acCents<=997);assert.ok(E.renderQuestion(q).includes('<svg'));break;
 case'three-whole-number-sum':assert.equal(a.value,g.terms[0]+g.terms[1]+g.terms[2]);break;
 case'missing-addend':assert.equal(a.value+g.first+g.last,g.total);break;
 }
 assert.equal(E.checkAnswer(q,E.answerText(q)).answerCorrect,true);assert.equal(E.checkAnswer(q,'nonsense').answerCorrect,false);assert.equal(E.checkAnswer(q,'-999999').answerCorrect,false);assert.equal(E.checkAnswer(q,E.answerText(q)).fullOutcomeVerified,false);assert.ok(!E.renderQuestion(q).includes(q.solution));count++;
}}
assert.throws(()=>E.generate('unknown'));assert.throws(()=>E.generate(E.catalog[0].sourceId,{seed:''}));assert.throws(()=>E.generate(E.catalog[0].sourceId,{index:-1}));assert.throws(()=>E.generate(E.catalog[0].sourceId,{extra:1}));const frac=E.generate(E.catalog[1].sourceId);assert.ok(E.renderQuestion(frac).includes('<mfrac>'));assert.equal(E.checkAnswer(frac,`${frac.answer.numerator*2}/${frac.answer.denominator*2}`).answerCorrect,false);
console.log(JSON.stringify({result:'passed',families:E.catalog.length,independentMathChecks:count}));
