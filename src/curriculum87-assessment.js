/* Canonical assessment lookup, independent of scoring and learner records. */
(function(root){'use strict';const data=typeof module!=='undefined'&&module.exports?require('./curriculum87-assessment-map'):root.MathCurriculum87AssessmentMap;
const byId=new Map(),deepFreeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(deepFreeze);Object.freeze(x);}return x;};deepFreeze(data);
for(const row of data.outcomes)for(const key of [row.sourceId,row.standard,row.alias].filter(Boolean)){if(byId.has(key))throw Error('Duplicate curriculum lookup key');byId.set(key,row);}
function lookup(key){if(typeof key!=='string'||!byId.has(key.trim()))throw Error('Unknown curriculum task or standard: '+String(key));return byId.get(key.trim());}
function compare(first,second){const a=lookup(first),b=lookup(second),shared=a.canonicalSkillIds.filter(x=>b.canonicalSkillIds.includes(x));return {relationship:a.sourceId===b.sourceId?'same-source':!shared.length?'distinct':shared.length===a.canonicalSkillIds.length&&shared.length===b.canonicalSkillIds.length?'same-assessment-scope':'partial-overlap',sharedSkillIds:shared,automaticRemovalAllowed:false};}
function overlaps(keys){if(!Array.isArray(keys))throw Error('Provide task or standard keys');keys.forEach(lookup);const result=[];for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++){const relation=compare(keys[i],keys[j]);if(relation.sharedSkillIds.length)result.push({first:keys[i],second:keys[j],...relation});}return result;}
const api=Object.freeze({version:data.version,lookup,compare,overlaps,skills:data.skills,outcomes:data.outcomes});if(typeof module!=='undefined'&&module.exports)module.exports=api;root.MathCurriculum87Assessment=api;
})(typeof globalThis!=='undefined'?globalThis:this);
