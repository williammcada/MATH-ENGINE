const assert=require('node:assert/strict'),L=require('../src/linear-equations.js'),M=require('../src/structured-math.js');
const n=v=>({type:'number',value:String(v)}),x={type:'variable',name:'x'},op=(type,left,right)=>({type,left,right}),eq=(a,b)=>op('equation',a,b);
assert.equal(L.solve(eq(x,x)).kind,'infinite');assert.equal(L.solve(eq(op('add',x,n(1)),x)).kind,'none');
assert.throws(()=>L.solve(eq(op('mul',x,x),n(4))),/Nonlinear/);assert.throws(()=>L.solve(eq(op('div',n(1),x),n(2))),/denominator/);assert.throws(()=>L.solve(eq(op('div',x,n(0)),n(2))),/Zero/);assert.throws(()=>L.solve(eq({type:'variable',name:'y'},n(2))),/Unexpected/);
const result=L.solve(eq(op('sub',op('mul',n(3),x),n(2)),op('add',x,n(1))));assert.equal(M.format(result.answer),'3/2');assert.equal(M.format(result.coefficient),'2');assert.equal(M.format(result.constant),'3');
assert.ok(M.check(result.answer,'1 1/2'));assert.ok(M.check(result.answer,'6/4'));assert.ok(M.check(result.answer,'1.5'));assert.ok(!M.check(result.answer,'1.4999'));
console.log('Linear boundaries, unique/no/infinite solutions, nonlinear/undefined rejection, equivalent answers passed');
