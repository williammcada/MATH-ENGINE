/* Math Engine Grade 5 slice. Original procedural implementation; no legacy scripts. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MathEngineG5 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = '0.2.0-rc.1';
  const entries = [
    ['g5.square-area-from-perimeter','PS.MAT.G5.MD.20.11','Square area from perimeter','SXA10055',false,'Recovered side range 4–26; four length units.'],
    ['g5.fraction-expression-precedence','PS.MAT.G5.NF.9.6','Mixed-operation fractions','SN870037 SN870036 SN870035',false,'Proposed four proper fractions, denominators 2–12, three operation patterns.'],
    ['g5.same-base-exponent-product','PS.MAT.G5.EE.20.9','Exponent product rule','SN870415',false,'Proposed numeric bases 2–10 and exponents 1–6; symbolic bases are not included.'],
    ['g5.same-base-exponent-quotient','PS.MAT.G5.EE.20.10','Exponent quotient rule','SX870450',false,'Proposed numeric bases 2–10, exponents 1–6, nonnegative exponent difference.'],
    ['g5.rational-perfect-square-root','PS.MAT.G5.NS.20.12','Square root of a fraction','SX870126 SX870125',false,'Proposed coprime roots 1–12, denominator root greater than one.'],
    ['g5.rectangular-prism-net-area','PS.MAT.G5.MD.67.5','Surface area from a prism net','SN870672',true,'Recovered dimensions 1 ≤ c < b < a ≤ 25; new net representation.'],
    ['g5.lcm-listing','PS.MAT.G5.OA.27.3','LCM by listing multiples','SAX70083',true,'Proposed two/three distinct inputs 2–12, at most 12 listed multiples per input.'],
    ['g5.lcm-prime-factorization','PS.MAT.G5.OA.27.4','LCM by prime factorization','SAX70083',true,'Proposed two/three distinct inputs 2–12; independent of source lookup triples.']
  ];
  function freeze(x) { if (x && typeof x === 'object') { Object.values(x).forEach(freeze); Object.freeze(x); } return x; }
  const catalog = freeze(entries.map(([id, standard, title, refs, work, scope]) => ({
    id, standard, alias: standard.replace(/\.(MD|NF|EE|NS|OA)\./,'.'), title,
    sourceIds: refs.split(' '), teacherWorkReview: work, scope,
    automaticAssignmentReady: false, fullOutcomeCoverageVerified: false
  })));
  const gcd = (a,b) => { a=Math.abs(a); b=Math.abs(b); while(b) [a,b]=[b,a%b]; return a; };
  const lcm = (a,b) => a/gcd(a,b)*b;
  function rat(n,d=1) {
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d===0) throw new Error('Invalid rational value.');
    if(d<0){n=-n;d=-d;} const g=gcd(n,d); return {n:n/g,d:d/g};
  }
  const add=(a,b)=>rat(a.n*b.d+b.n*a.d,a.d*b.d);
  const sub=(a,b)=>rat(a.n*b.d-b.n*a.d,a.d*b.d);
  const mul=(a,b)=>rat(a.n*b.n,a.d*b.d);
  const eq=(a,b)=>a.n*b.d===b.n*a.d;
  const show=r=>r.d===1?String(r.n):`${r.n}/${r.d}`;
  const R=r=>({type:'rational',numerator:r.n,denominator:r.d});
  const N=n=>R(rat(n));
  const B=(op,left,right)=>({type:'binary',op,left,right});
  const P=(base,exponent)=>({type:'power',base:N(base),exponent:N(exponent)});
  const G=child=>({type:'group',child});
  function hash(s){ let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0; }
  function rng(seed){let a=hash(seed);return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
  const units=[{length:'cm',area:'cm^2'},{length:'m',area:'m^2'},{length:'in',area:'in^2'},{length:'ft',area:'ft^2'}];
  function primes(n){const f={};for(let p=2;p<=n;p++){while(n%p===0){f[p]=(f[p]||0)+1;n/=p;}}return f;}
  function primeText(f){return Object.entries(f).map(([p,e])=>e===1?p:`${p}^${e}`).join(' × ');}
  function chooseFamily(key){const f=catalog.find(x=>x.id===key||x.standard===key||x.alias===key);if(!f)throw new Error(`Unsupported Grade 5 family or outcome: ${String(key)}`);return f;}
  function generate(key, options) {
    const f=chooseFamily(key);
    if (!options || typeof options!=='object' || Array.isArray(options)) throw new Error('Provide a seed and an optional nonnegative item index.');
    if(Object.keys(options).some(k=>!['seed','index'].includes(k)))throw new Error('Unsupported generation option. Use seed and index only.');
    const {seed,index=0}=options;
    if(!((typeof seed==='string'&&seed.trim().length>0&&seed.length<=256)||(typeof seed==='number'&&Number.isSafeInteger(seed))))throw new Error('Seed must be nonempty text (up to 256 characters) or a safe integer.');
    if(!Number.isSafeInteger(index)||index<0)throw new Error('Item index must be a nonnegative safe integer.');
    const seedText=String(seed), random=rng(JSON.stringify([VERSION,f.id,seedText,index]));
    const int=(a,b)=>a+Math.floor(random()*(b-a+1)); const pick=a=>a[int(0,a.length-1)];
    const item={version:VERSION,familyId:f.id,standard:f.standard,alias:f.alias,seed:seedText,index,
      provenance:{sourceIds:f.sourceIds,scope:f.scope},prompt:'',expression:null,givens:{},visual:null,
      answer:{kind:'integer',numerator:0,denominator:1,unit:null},solution:[],workRubric:[],
      automaticAssignmentReady:false,fullOutcomeCoverageVerified:false};
    const answer=(r,kind='integer',unit=null)=>{item.answer={kind,numerator:r.n,denominator:r.d,unit};};
    if(f.id==='g5.square-area-from-perimeter'){
      const side=int(4,26),u=pick(units),perimeter=4*side;
      item.givens={perimeter,unit:u.length};item.prompt=`A square has a perimeter of ${perimeter} ${u.length}. Find its area. Include the square unit.`;
      answer(rat(side*side),'integer',u.area);
      item.solution=[`Side = ${perimeter} ÷ 4 = ${side} ${u.length}.`,`Area = ${side} × ${side} = ${side*side} ${u.length}².`];
    } else if(f.id==='g5.fraction-expression-precedence'){
      let selected;
      for(let attempt=0;attempt<2048;attempt++){
        const values=Array.from({length:4},()=>{const d=int(2,12);return rat(int(1,d-1),d);});
        if(new Set(values.map(x=>x.d)).size<2)continue;
        const [a,b,c,d]=values,pattern=int(0,2),product=mul(pattern===2?add(a,b):b,c);
        const correct=pattern===1?add(sub(a,product),d):sub(add(pattern===2?rat(0):a,product),d);
        const wrong=pattern===0?sub(mul(add(a,b),c),d):pattern===1?add(mul(sub(a,b),c),d):sub(add(a,mul(b,c)),d);
        if(correct.n<=0||product.n===0||eq(product,c)||eq(product,pattern===2?add(a,b):b)||eq(correct,wrong))continue;
        selected={values,pattern,correct,product};break;
      }
      if(!selected)throw new Error('Unable to generate a valid fraction expression for this seed.');
      const {values:[a,b,c,d],pattern,correct,product}=selected;
      const expr=pattern===0?B('subtract',B('add',R(a),B('multiply',R(b),R(c))),R(d)):
        pattern===1?B('add',B('subtract',R(a),B('multiply',R(b),R(c))),R(d)):
        B('subtract',B('multiply',G(B('add',R(a),R(b))),R(c)),R(d));
      item.givens={fractions:[a,b,c,d],pattern};item.expression=expr;
      item.prompt='Simplify. Follow the order of operations. Give a reduced fraction, reduced mixed number, or whole number.';
      answer(correct,'reduced-rational');
      if(pattern===2)item.solution.push(`First add inside the parentheses: ${show(a)} + ${show(b)} = ${show(add(a,b))}.`);
      item.solution.push(`Multiply: ${show(pattern===2?add(a,b):b)} × ${show(c)} = ${show(product)}.`);
      const terms=pattern===2?[product,d]:[a,product,d];const common=terms.reduce((v,r)=>lcm(v,r.d),1);
      const nums=terms.map(r=>r.n*(common/r.d));
      const numeric=pattern===2?`${nums[0]} − ${nums[1]}`:pattern===1?`${nums[0]} − ${nums[1]} + ${nums[2]}`:`${nums[0]} + ${nums[1]} − ${nums[2]}`;
      item.solution.push(`Use common denominator ${common}: (${numeric})/${common} = ${show(correct)} in lowest terms.`);
    } else if(f.id.includes('same-base-exponent')){
      const base=int(2,10),m=int(1,6),quotient=f.id.endsWith('quotient'),n=quotient?int(1,m):int(1,6),e=quotient?m-n:m+n;
      item.givens={base,leftExponent:m,rightExponent:n};item.expression=B(quotient?'divide':'multiply',P(base,m),P(base,n));
      item.prompt='Use the exponent rule. Write one power with the same base, or 1 if the exponent becomes zero.';
      item.answer={kind:'power',base,exponent:e,unit:null};
      item.solution=[`Keep base ${base}; ${quotient?'subtract':'add'} exponents: ${m} ${quotient?'−':'+'} ${n} = ${e}.`,e===0?`${base} is nonzero, so ${base}^0 = 1.`:`Answer: ${base}^${e}.`];
    } else if(f.id==='g5.rational-perfect-square-root'){
      const pairs=[];for(let p=1;p<=12;p++)for(let q=2;q<=12;q++)if(p!==q&&gcd(p,q)===1)pairs.push([p,q]);
      const [p,q]=pick(pairs);item.givens={numerator:p*p,denominator:q*q};
      item.expression={type:'sqrt',child:R(rat(p*p,q*q))};
      item.prompt='Find the principal (nonnegative) square root. Give a reduced fraction or reduced mixed number.';
      answer(rat(p,q),'reduced-rational');item.solution=[`The square roots of ${p*p} and ${q*q} are ${p} and ${q}.`,`The principal root is ${p}/${q}, already in lowest terms.`];
    } else if(f.id==='g5.rectangular-prism-net-area'){
      const a=int(3,25),b=int(2,a-1),c=int(1,b-1),faces=[
        {id:1,x:0,y:0,width:a,height:c},{id:2,x:a,y:0,width:b,height:c},
        {id:3,x:a+b,y:0,width:a,height:c},{id:4,x:2*a+b,y:0,width:b,height:c},
        {id:5,x:0,y:-b,width:a,height:b},{id:6,x:0,y:c,width:a,height:b}];
      item.givens={a,b,c,unit:'m'};item.visual={type:'rectangular-prism-net',faces};
      item.prompt='Find the surface area of the rectangular prism from its net. Record the area of each numbered face, then add all six areas. Include square units.';
      answer(rat(2*(a*b+a*c+b*c)),'integer','m^2');
      item.solution=faces.map(x=>`Face ${x.id}: ${x.width} × ${x.height} = ${x.width*x.height} m².`);
      item.solution.push(`Total = ${faces.map(x=>x.width*x.height).join(' + ')} = ${item.answer.numerator} m².`);
      item.workRubric=['Each numbered face has the correct area.','All six faces are included once.','The total is the sum of the six face areas, with square units.'];
    } else {
      const listing=f.id==='g5.lcm-listing',count=int(2,3);let values,least;
      for(let attempt=0;attempt<512;attempt++){
        const pool=Array.from({length:11},(_,i)=>i+2);values=[];
        for(let i=0;i<count;i++)values.push(pool.splice(int(0,pool.length-1),1)[0]);
        values.sort((a,b)=>a-b);least=values.reduce(lcm,1);
        if(!listing||values.every(v=>least/v<=12))break;
        values=null;
      }
      if(!values)throw new Error('Unable to generate an LCM listing task for this seed.');
      item.givens={values,method:listing?'listing':'prime-factorization'};
      item.prompt=`Find the LCM of ${values.join(', ')} by ${listing?'listing positive multiples':'prime factorization'}. Show your method.`;
      answer(rat(least));
      if(listing){
        item.solution=values.map(n=>`Multiples of ${n}: ${Array.from({length:least/n},(_,i)=>n*(i+1)).join(', ')}.`);
        item.solution.push(`The first positive multiple in every list is ${least}.`);
        item.workRubric=['List positive multiples in order for each input.','Identify the first value appearing in every list.'];
      }else{
        const factors=values.map(primes),highest={};factors.forEach(f=>Object.entries(f).forEach(([p,e])=>highest[p]=Math.max(highest[p]||0,e)));
        item.solution=values.map((n,i)=>`${n} = ${primeText(factors[i])}.`);
        item.solution.push(`Take each prime's greatest exponent: ${primeText(highest)} = ${least}.`);
        item.workRubric=['Correctly prime-factor every input.','Choose each prime with its greatest required exponent.','Multiply those prime powers to obtain the LCM.'];
      }
    }
    return freeze(item);
  }
  function bigGcd(a,b){a=a<0n?-a:a;while(b){[a,b]=[b,a%b];}return a;}
  function parseNumber(text){
    const s=text.trim();let m,n,d=1n,reduced=true,form='integer';
    if((m=s.match(/^([+-]?)(\d{1,9})\s+(\d{1,9})\s*\/\s*(\d{1,9})$/))){
      const w=BigInt(m[2]),p=BigInt(m[3]);d=BigInt(m[4]);if(d===0n||p>=d)return null;
      n=w*d+p;if(m[1]==='-')n=-n;reduced=bigGcd(p,d)===1n;form='mixed';
    }else if((m=s.match(/^([+-]?\d{1,9})\s*\/\s*(\d{1,9})$/))){n=BigInt(m[1]);d=BigInt(m[2]);if(d===0n)return null;reduced=bigGcd(n,d)===1n;form='fraction';}
    else if((m=s.match(/^([+-]?)(\d{1,15})(?:\.(\d{1,9}))?$/))){d=10n**BigInt((m[3]||'').length);n=BigInt(m[2])*d+BigInt(m[3]||'0');if(m[1]==='-')n=-n;form=m[3]?'decimal':'integer';}
    else return null;
    return {n,d,reduced,form};
  }
  function unitCanonical(unit){
    const t=String(unit||'').trim().toLowerCase().replace(/\.$/,'').replace(/²/g,'^2').replace(/\s+/g,' ');
    const match=t.match(/^(cm|m|in|ft)(?:\^?2)$/);if(match)return `${match[1]}^2`;
    const names={'square centimeters':'cm^2','square centimetres':'cm^2','square meters':'m^2','square metres':'m^2','square inches':'in^2','square feet':'ft^2'};
    return names[t]||null;
  }
  function checkAnswer(item, response){
    chooseFamily(item.familyId);
    let value,unit='';
    if(typeof response==='string'){
      value=response.trim();
      if(item.answer.unit){const m=value.match(/^([+-]?(?:\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d+(?:\.\d+)?))\s*(.*)$/);if(m){value=m[1];unit=m[2];}}
    }else if(response&&typeof response==='object'&&!Array.isArray(response)){value=String(response.value??'').trim();unit=response.unit??'';}
    else value='';
    if(value.length>200)value='';
    const a=item.answer;let valueCorrect=false,formatCorrect=false;
    if(a.kind==='power'){
      const m=value.match(/^(\d{1,2})\s*\^\s*(\d{1,2})$/);
      if(m){const b=BigInt(m[1]),e=BigInt(m[2]);valueCorrect=b**e===BigInt(a.base)**BigInt(a.exponent);formatCorrect=Number(b)===a.base&&Number(e)===a.exponent;}
      else {const n=parseNumber(value);valueCorrect=!!n&&n.n===BigInt(a.base)**BigInt(a.exponent)*n.d;formatCorrect=a.exponent===0&&valueCorrect&&value==='1';}
    }else{
      const n=parseNumber(value);valueCorrect=!!n&&n.n*BigInt(a.denominator)===BigInt(a.numerator)*n.d;
      formatCorrect=!!n&&(a.kind!=='reduced-rational'||(n.reduced&&n.form!=='decimal'));
    }
    const unitCorrect=a.unit?unitCanonical(unit)===a.unit:!String(unit).trim();
    const answerCorrect=valueCorrect&&formatCorrect&&unitCorrect;
    const requiresTeacherReview=item.workRubric.length>0;
    let feedback=!valueCorrect?'Check the mathematical value.':!formatCorrect?(a.kind==='power'?'Use one power with the original base, or 1 for exponent zero.':'Write the answer in reduced fraction or mixed-number form.'):
      !unitCorrect?(a.unit?'Include the correct square unit.':'This answer has no unit.'):
      requiresTeacherReview?'The final answer is correct. The required method or face-area work still needs teacher review.':'Correct answer.';
    return {valueCorrect,formatCorrect,unitCorrect,answerCorrect,requiresTeacherReview,fullOutcomeVerified:false,feedback};
  }
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mathNode(x){
    if(x.type==='rational')return x.denominator===1?`<mn>${esc(x.numerator)}</mn>`:`<mfrac><mn>${esc(x.numerator)}</mn><mn>${esc(x.denominator)}</mn></mfrac>`;
    if(x.type==='group')return `<mrow><mo>(</mo>${mathNode(x.child)}<mo>)</mo></mrow>`;
    if(x.type==='sqrt')return `<msqrt>${mathNode(x.child)}</msqrt>`;
    if(x.type==='power')return `<msup>${mathNode(x.base)}${mathNode(x.exponent)}</msup>`;
    if(x.type==='binary'){
      if(x.op==='divide')return `<mfrac>${mathNode(x.left)}${mathNode(x.right)}</mfrac>`;
      const op={add:'+',subtract:'−',multiply:'×'}[x.op];if(!op)throw new Error('Unknown expression operator.');
      return `<mrow>${mathNode(x.left)}<mo>${op}</mo>${mathNode(x.right)}</mrow>`;
    }
    throw new Error('Unknown mathematical representation.');
  }
  function expressionText(x){
    if(x.type==='rational')return x.denominator===1?String(x.numerator):`${x.numerator}/${x.denominator}`;
    if(x.type==='group')return `(${expressionText(x.child)})`;
    if(x.type==='sqrt')return `sqrt(${expressionText(x.child)})`;
    if(x.type==='power')return `${expressionText(x.base)}^${expressionText(x.exponent)}`;
    if(x.type==='binary')return `${expressionText(x.left)} ${{add:'+',subtract:'−',multiply:'×',divide:'÷'}[x.op]} ${expressionText(x.right)}`;
    throw new Error('Unknown mathematical representation.');
  }
  function mathHTML(expr){return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="${esc(expressionText(expr))}">${mathNode(expr)}</math>`;}
  function netHTML(item){
    const {a,b,c,unit}=item.givens;
    const faceRects=[[30,145,160,65],[190,145,100,65],[290,145,160,65],[450,145,100,65],[30,45,160,100],[30,210,160,100]];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" role="img" aria-label="Six-face rectangular prism net; lengths ${esc(a)}, ${esc(b)}, ${esc(c)} ${esc(unit)}; schematic, not to scale.">
      <title>Rectangular prism net — schematic, not to scale</title>
      ${faceRects.map(([x,y,w,h],i)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white" stroke="#172b4d" stroke-width="2"/><text x="${x+w/2}" y="${y+h/2+6}" text-anchor="middle" font-size="20" fill="#172b4d">${i+1}</text>`).join('')}
      <text x="110" y="30" text-anchor="middle" font-size="17">${esc(a)} ${esc(unit)}</text>
      <text x="18" y="100" transform="rotate(-90 18 100)" text-anchor="middle" font-size="17">${esc(b)} ${esc(unit)}</text>
      <text x="18" y="178" transform="rotate(-90 18 178)" text-anchor="middle" font-size="17">${esc(c)} ${esc(unit)}</text>
      <text x="300" y="340" text-anchor="middle" font-size="16">Schematic net — not to scale. Numbers inside faces identify them.</text></svg>`;
  }
  function answerText(item){const a=item.answer;return a.kind==='power'?(a.exponent===0?'1':`${a.base}^${a.exponent}`):`${show(rat(a.numerator,a.denominator))}${a.unit?' '+a.unit.replace('^2','²'):''}`;}
  function renderQuestion(item){
    chooseFamily(item.familyId);
    return `<article class="math-item"><p>${esc(item.prompt)}</p>${item.expression?mathHTML(item.expression):''}${item.visual?netHTML(item):''}</article>`;
  }
  function renderSolution(item){return `<section class="worked-solution"><h3>Worked solution</h3><ol>${item.solution.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p><strong>Answer: ${esc(answerText(item))}</strong></p>${item.workRubric.length?`<h4>Teacher work review</h4><ul>${item.workRubric.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}</section>`;}
  return freeze({version:VERSION,catalog,generate,checkAnswer,renderQuestion,renderSolution,answerText,expressionText});
});
