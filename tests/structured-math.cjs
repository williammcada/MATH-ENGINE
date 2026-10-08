const assert=require('node:assert/strict'),M=require('../src/structured-math.js');
const n=value=>({type:'number',value:String(value)}),bin=(type,left,right)=>({type,left,right});
const cases=[
[bin('add',n('0.1'),n('0.2')),'3/10'],[bin('div',n(2),n(6)),'1/3'],[bin('sub',n('-1.2'),n('2.3')),'-7/2'],[bin('mul',n('0.15'),n('4.2')),'63/100'],
[{type:'power',base:n(-2),exponent:n(3)},'-8'],[{type:'power',base:n(2),exponent:n(-3)},'1/8'],[{type:'sqrt',arg:bin('div',n(9),n(16))},'3/4'],
[bin('sub',n(24),bin('sub',n(12),n(6))),'18'],[bin('div',n(24),bin('div',n(12),n(4))),'8']];
for(const [tree,expected]of cases){assert.equal(M.format(M.evaluate(tree)),expected);assert.ok(M.render(tree).startsWith('<math'));}
for(const tree of [bin('div',n(1),n(0)),{type:'sqrt',arg:n(-1)},{type:'sqrt',arg:n(2)},{type:'power',base:n(0),exponent:n(0)},{type:'power',base:n(0),exponent:n(-1)},{type:'power',base:n(2),exponent:n('0.5')},{type:'evil'}])assert.throws(()=>M.evaluate(tree));
assert.throws(()=>M.render({type:'variable',name:'<script>'}));assert.throws(()=>M.render(n('1<img>')));assert.throws(()=>M.evaluate({type:'variable',name:'x'}));assert.equal(M.format(M.evaluate({type:'variable',name:'x'},{x:'1.25'})),'5/4');
for(const response of ['-1 1/2','-3/2','-1.5','-6/4'])assert.ok(M.check(M.rat(-3,2),response));
for(const response of ['1/0','1 3/2','1,23','1e3','Infinity','NaN','<script>','1+1',''])assert.ok(!M.check(M.rat(2),response));
assert.ok(M.check(M.rat(1234),'1,234'));assert.ok(M.check(M.rat(123,100),'$1.23','money'));assert.ok(!M.check(M.rat(123,100),'1.2301','money'));assert.equal(M.format(M.rat(1,2),'money'),'$0.50');assert.equal(M.format(M.rat(-1,2),'money'),'-$0.50');assert.equal(M.decimalText(M.rat(1,3)),null);assert.match(M.render({type:'power',base:n(-2),exponent:n(2)}),/<mo>\(<\/mo>/);
console.log('PASS exact rational arithmetic, powers/roots, invalid inputs, equivalent answers, MathML escaping and grouping');
