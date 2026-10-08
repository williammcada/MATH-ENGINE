"""Independent exact arithmetic/rounding checks of the authored measurement tasks."""
import json,pathlib,subprocess
from fractions import Fraction as F
root=pathlib.Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),T=require('./src/measurement-bank');for(const c of T.catalog)for(let index=0;index<1000;index++){const q=E.generate(c.sourceId,{seed:'measure-audit',index});if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'measure-audit',index})))throw Error('Replay');if(!E.checkAnswer(q,E.answerText(q)).answerCorrect||E.checkAnswer(q,'nonsense').answerCorrect||E.checkAnswer(q,'0').answerCorrect)throw Error('Answer contract');console.log(JSON.stringify({recipe:c.recipe,q}));}"""
p=subprocess.Popen(['node','-e',js],cwd=root,stdout=subprocess.PIPE,text=True);count=0;rounded=0;ties=0;seen=set()
for line in p.stdout:
 x=json.loads(line);r=x['recipe'];q=x['q'];v=q['givens']['parameters'];seen.add(r)
 def n(k):return v[k]
 if r=='lap-seconds':a=60+n('seconds')-n('faster')
 elif r=='purchase-change':a=F(n('paid')-n('pounds')*n('cents'),100)
 elif r=='price-per-pound':a=F(n('paid')-n('change'),100*n('pounds'))
 elif r=='compare-unit-price':a=(F(n('total'),n('ounces'))+n('extra'))*F(n('quantity'),100)
 elif r=='nightly-rate':a=F(n('total'),n('nights'))
 elif r=='sales-tax':a=F(n('price')*n('rateTenths'),1000)
 elif r in ['yards-feet','feet-yards','inches-feet','feet-inches','feet-miles','centimeters-meters','grams-kilograms','milliliters-liters']:
  factors={'yards-feet':F(3),'feet-yards':F(1,3),'inches-feet':F(1,12),'feet-inches':F(12),'feet-miles':F(1,5280),'centimeters-meters':F(1,100),'grams-kilograms':F(1,1000),'milliliters-liters':F(1,1000)};a=n('amount')*factors[r]
 elif r in ['seed-cost','grape-cost']:a=F(n('cents')*n('target'),100*n('amount'))
 elif r=='weighted-wage':a=F(n('hours1')*n('rate1')+n('hours2')*n('rate2'),100*(n('hours1')+n('hours2')))
 elif r=='whole-from-used':a=F(n('used'))/F(n('n'),n('d'))
 elif r=='whole-from-left':a=F(n('left'))/(1-F(n('d')-1,n('d')))
 elif r=='discount-price':a=n('price')*(1-F(n('percent'),100))
 elif r=='compound-interest':
  balance=F(n('principal'))
  for _ in range(n('years')):balance+=balance*F(n('rate'),100)
  a=balance-n('principal');assert 'interest is earned' in q['prompt'] and 'compounded annually' in q['prompt']
 elif r=='simple-interest':a=n('principal')*F(n('rate'),100)*F(n('months'),12);assert 'simple interest' in q['prompt']
 elif r=='cube-volume-ratio':a=F(n('large')**3,n('side')**3)
 elif r=='rate-difference':a=F(n('dist1'),n('time1'))-F(n('dist2'),n('time2'));assert a>0
 elif r=='distance-rate':a=F(n('distance'),n('time'))*n('target')
 else:raise AssertionError(r)
 a=F(a);raw=q['givens']['unrounded'];assert a==F(int(raw['numerator']),int(raw['denominator'])),(r,v)
 if q['givens']['rounding']!='none':
  rounded+=1;cents=a*100;whole=cents.numerator//cents.denominator;rem=cents-whole
  if rem==F(1,2):ties+=1
  a=F(whole+(rem>=F(1,2)),100);assert 'nearest cent' in q['prompt'] and 'intermediate' in q['prompt']
 ans=q['answer'];assert a==F(int(ans['numerator']),int(ans['denominator'])),(r,v,a,ans)
 assert a>0
 if ans['mode']=='money':assert (a*100).denominator==1
 count+=1
assert p.wait()==0 and count==26000 and ties>0
print(f'PASS: {count:,} independent cases; {len(seen)} recipes; {rounded:,} final-rounding cases including {ties} exact half-cent ties')
