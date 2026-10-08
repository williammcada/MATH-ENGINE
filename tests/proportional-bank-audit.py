"""Independent Fraction audit of authored task mathematics and source IDs."""
import subprocess,json,pathlib
from fractions import Fraction as F
root=pathlib.Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),P=require('./src/proportional-bank');for(const c of P.catalog)for(let index=0;index<1000;index++){const q=E.generate(c.sourceId,{seed:'proportion-audit',index});if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'proportion-audit',index})))throw Error('Replay');if(!E.checkAnswer(q,E.answerText(q)).answerCorrect||E.checkAnswer(q,'nonsense').answerCorrect||E.checkAnswer(q,'0').answerCorrect)throw Error('Checker'); console.log(JSON.stringify({recipe:c.recipe,q}));}"""
p=subprocess.Popen(['node','-e',js],cwd=root,stdout=subprocess.PIPE,text=True)
count=0; seen=set()
for line in p.stdout:
 x=json.loads(line);r=x['recipe'];q=x['q'];v=q['givens']['parameters'];seen.add(r)
 def n(k):return v[k]
 if r=='improper-mixed':expected=F(n('n'),n('d'));assert 1<expected<2
 elif r=='percent-complement':expected=100-n('p')
 elif r=='fraction-complement':expected=1-F(n('n'),n('d'))
 elif r=='fraction-subtract':expected=F(n('a'),n('b'))-F(n('n'),n('b')*n('k'));assert expected>0
 elif r=='ratio-reverse':expected=F(n('b'),n('a'))
 elif r=='ratio-part':expected=F(n('b') if n('reverse') else n('a'),n('a')+n('b'))
 elif r=='fraction-ratio':
  first=F(n('a'),n('a')+n('b'));second=1-first;expected=second/first if n('reverse') else first/second
 elif r.startswith('decimal-fraction') or r in ['fraction-part','decimal-part','decimal-part-eighths']:expected=F(n('n'),n('d'))
 elif r.startswith('percent-decimal'):expected=F(n('n'),n('d'))/100
 elif r in ['ratio-missing','employee-proportion']:expected=n('a')*n('k') if n('reverse') else n('b')*n('k')
 elif r=='recipe-proportion':expected=n('cups')*F(n('b'),n('a'))
 elif r=='ratio-chain':expected=n('a')*n('m')*F(n('b'),n('a'))*F(n('d'),n('m'))
 elif r=='wins-losses':expected=n('b')*n('k')*(1-F(n('a'),n('b')))
 elif r=='club-ratio':expected=F((n('a')+n('b'))*n('k')-n('a')*n('k'),n('a')*n('k'))
 elif r.startswith('ratio-total'):expected=(n('a')+n('b'))*n('k')*F(n('b') if n('reverse') else n('a'),n('a')+n('b'))
 elif r.startswith('percent-whole'):expected=F(n('part'))/F(n('p'),100);assert n('part')==int(n('part'))
 elif r=='percent-part':expected=100*F(n('part'),n('whole'))
 elif r=='percent-count-complement':expected=n('total')*(1-F(n('p'),100))
 elif r=='percent-count-rest':expected=100*(1-F(n('part'),n('total')))
 elif r=='reverse-increase':expected=F(n('now'))/(1+F(n('p'),100))
 elif r=='circle-percent':expected=100*F(n('n'),n('d'))
 elif r=='circle-sum-percent':expected=100*(F(n('a'),n('d'))+F(n('b'),n('d')));assert expected<=100
 elif r=='sector-percent':expected=F(100,n('d'))
 elif r=='bill-percent':expected=100*F(n('now'),n('old'))
 elif r=='percent-increase':expected=n('initial')*(1+F(n('p'),100))
 else:raise AssertionError(r)
 a=q['answer'];assert F(int(a['numerator']),int(a['denominator']))==expected,(r,v,a,expected)
 if a['form']=='integer':assert F(expected).denominator==1
 if a['form']=='decimal':
  d=F(expected).denominator
  for prime in [2,5]:
   while d%prime==0:d//=prime
  assert d==1
 assert q['solution'] and q['prompt'] and q['provenance']['exactLegacyReproduction'] is False
 count+=1
assert p.wait()==0 and count==38000
print(f'PASS: {count:,} independent exact checks across {len(seen)} recipes; replay and checker checks passed')
