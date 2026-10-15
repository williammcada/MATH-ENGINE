/* Algebra 2 port tasks (coverage programme, parallel courses). Original Engine code informed by the source
   records; no source script is executed or reproduced. Owned by the Algebra 2 course chat (docs/change-specs/coverage-parallel-courses-v0.1.md).

   Rules for this module:
   - Every recipe name starts with 'a2-'. src/port87.js sends those recipes here, family structured-port87.
   - Helpers come from src/port-shared.js (S below). Do not edit port-shared.js; ask the owner for a shared change.
     A helper only this course needs is defined in this file.
   - build(c,h) returns the same task object as the recipes in port87.js: {prompt, answer, solution, parameters,
     math?, svg?, teacherSvg?, choices?, requireImproper?, eitherForm?}. h.int(a,b), h.pick(list), h.index and
     h.check (the full port checker, for S.wrongOnlyBy(h.check,t,list)) are provided.
   - check(q,response) and answerText(q) handle answer kinds that exist only in this course. Return undefined for
     anything else, and the shared port checker handles it. render(q) likewise, if a course ever needs it. */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const S=common?require('./port-shared'):root.MathPortShared;
const catalog=common?require('./port-algebra-2-map'):root.MathPortAlgebra2Map;

function build(c,h){const {int,pick,index}=h;let t;
switch(c.recipe){
// Batch A2-1 recipes go here, in book order, each headed by a comment naming its batch.
default:throw Error('Unknown Algebra 2 port recipe '+c.recipe);}
return t;}

// Answer kinds that exist only in this course. Return undefined to use the shared port checker.
function check(q,response){return undefined;}
function answerText(q){return undefined;}

const api=Object.freeze({key:'algebra-2',course:'Algebra 2',prefix:'a2-',batchPrefix:'A2',catalog,build,check,answerText});
if(common)module.exports=api;root.MathPortAlgebra2=api;
})(typeof globalThis!=='undefined'?globalThis:this);
