"""Independent Python Fraction oracles and constraint checks for new numeric recipes.
Requires samples emitted by milestone2.cjs. Reused providers retain earlier audit evidence.
"""
import json,math,re,statistics,sys
from fractions import Fraction as F
from collections import Counter
rows=json.load(open(sys.argv[1] if len(sys.argv)>1 else '/tmp/m2-samples.json'));checked=Counter();teacher=0;texts=0
for row in rows:
 q=row['q'];p=q['givens']['parameters'];recipe=row['recipe'];tag,*args=recipe.split(':');kind=q['answer']['kind'];idx=q['index'];expected=None
 if kind=='teacher':
  assert q['answer']['rubric'] and q['answer']['reference'];teacher+=1;continue
 if kind=='text':
  if tag=='parity':assert q['answer']['value']==('odd' if p['a']%2 else 'even')
  elif tag=='prime-small':assert (q['answer']['value']=='prime')==all(p['a']%i for i in range(2,math.isqrt(p['a'])+1))
  elif tag=='months':assert q['answer']['value']==['January','February','March','April','May','June','July','August','September','October','November','December'][(p['m']+(1 if p['after'] else -1))%12]
  elif tag=='roman':
   val={'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000};s=q['answer']['value'];assert sum(-val[c] if i+1<len(s) and val[c]<val[s[i+1]] else val[c] for i,c in enumerate(s))==p['value']
  elif tag=='ordinal':
   k=p['k'];suffix='th' if 10<k%100<14 else {1:'st',2:'nd',3:'rd'}.get(k%10,'th');assert q['answer']['value']==str(k)+suffix
  elif tag=='shapes':assert q['answer']['value']==['triangle','rectangle','square','circle'][p['kind']]
  else:raise AssertionError(('No text oracle',tag))
  texts+=1;continue
 values=[F(int(v['numerator']),int(v['denominator'])) for v in q['answer']['values']]
 if tag in ['add','sub','mul','mul-ten']:expected=[p['a']+p['b'] if tag=='add' else p['a']-p['b'] if tag=='sub' else p['a']*p['b']]
 elif tag=='missing':expected=[p['a']-p['b']]
 elif tag in ['div','div-two','div-ten']:
  quotient,remainder=divmod(p['dividend'],p['d']);expected=[quotient,remainder] if remainder else [quotient];assert 0<=remainder<p['d']
  if tag=='div':assert len(str(quotient))==int(args[0]);assert args[1]!='endzero' or quotient%10==0;assert args[1]!='insidezero' or str(quotient)[1]=='0'
 elif tag in ['decimal','money']:
  x,y=F(p['x']),F(p['y']);expected=[{'add':lambda:x+y,'sub':lambda:x-y,'mul':lambda:x*y,'div':lambda:x/y,'divwhole':lambda:x/y}[p['operation']]()]
 elif tag=='place':expected=[p['value']//10**p['position']%10,(p['value']//10**p['position']%10)*10**p['position']]
 elif tag in ['words','roman']:expected=[p['value']]
 elif tag=='digit':expected=[int(str(p['value'])[p['position']])]
 elif tag=='round':expected=[(2*p['value']+p['place'])//(2*p['place'])*p['place']]
 elif tag=='estimate':
  x=(p['a']+5)//10*10;y=(p['b']+5)//10*10;expected=[{'add':lambda:x+y,'sub':lambda:x-y,'mul':lambda:x*y,'div':lambda:F(x,y)}[p['op']]()]
 elif tag=='facts':expected=[p['a']*p['b']]
 elif tag=='times-table':expected=[p['a']*v for v in [4,5,6]]
 elif tag=='missing-story':expected=[p['a']+p['b'] if p['sub'] and p['missing'] else p['a']-p['b']]
 elif tag=='equal-groups':expected=[p['b'] if p['divide'] else p['a']*p['b']]
 elif tag=='remainder-context':expected=[math.ceil(F(p['total'],p['size'])) if p['k']==0 else p['total']//p['size'] if p['k']==1 else p['total']%p['size']]
 elif tag=='power-small':expected=[p['a']**p['b']]
 elif tag=='ten-power':expected=[F(p['a'],100)*F(1,10**p['power']) if p['div'] else F(p['a'],100)*10**p['power']]
 elif tag=='fraction-name':expected=[F(p['a'],p['d'])]
 elif tag in ['fraction-same','mixed-same','fraction-unlike','mixed-unlike','fraction-simplify']:expected=[F(p['x'])-F(p['y']) if p['subtract'] else F(p['x'])+F(p['y'])];assert expected[0]>=0
 elif tag=='reduce':expected=[F(p['x'])]
 elif tag=='fraction-rename':expected=[F(p['x']).numerator*p['k']]
 elif tag in ['fraction-three','fraction-three-product']:expected=[F(p['x'])*F(p['y'])*F(p['z']) if p['multiply'] else F(p['x'])+F(p['y'])+F(p['z'])]
 elif tag=='fraction-unknown':expected=[F(p['rhs'])/F(p['coefficient'])]
 elif tag=='fraction-equal-groups':expected=[p['a'] if p.get('divide') else p['a']*F(p['x'])]
 elif tag=='remaining':expected=[1-F(p['a'],p['d'])]
 elif tag=='fraction-two-step':expected=[p['total']*(1-F(p['a'],p['d']))-p['given']];assert expected[0]>=0
 elif tag=='fraction-benchmarks':expected=[p['d']//2 if p['half'] else p['d']]
 elif tag=='dollar-fraction':expected=[F(p['b'],100)]
 elif tag=='mixed-money':expected=[p['a']+F(p['b'],100)]
 elif tag=='decimal-place':expected=[p['digits'][p['k']],F(p['digits'][p['k']],10**p['k'])]
 elif tag=='decimal-line':expected=[F(p['numerator'],p['denominator'])]
 elif tag in ['percent-model','temperature']:expected=[p['shaded'] if tag=='percent-model' else p['temp']]
 elif tag=='percent-fraction':expected=[F(p['percent'],100)]
 elif tag=='percent-of':expected=[F(p['percent']*p['whole'],100)]
 elif tag=='ratio-decimal':expected=[F(p['numerator'],p['denominator'])]
 elif tag in ['rate','rate-total']:expected=[F(p['total'],p['hours']) if tag=='rate' else F(p['total'],p['rate'])]
 elif tag=='evaluation':expected=[p['a']*p['d']+p['b']]
 elif tag=='formula':expected=[2*(p['a']+p['b'])]
 elif tag=='clock-elapsed':expected=[p['end']-p['start']]
 elif tag=='calendar':expected=[p['start']+p['elapsed']]
 elif tag=='schedule':expected=[p['travel']+15]
 elif tag in ['capacity','mass']:expected=[p['a']*p['factor']]
 elif tag=='turns':expected=[F(p['k'],4)*360]
 elif tag=='scales':expected=[p['step']*p['tick']]
 elif tag=='circle-measures':expected=[2*p['radius']]
 elif tag=='segment-length':expected=[p['b']]
 elif tag=='array-area':expected=[p['a']*p['b']]
 elif tag=='estimate-measure':
  a,b,d=[(p[k]+5)//10*10 for k in ['a','b','d']];expected=[[2*(a+b),a*b,a*b*d][p['k']]]
 elif tag in ['cylinder-volume','cylinder-area']:
  r,h=p['radius'],p['height'];expected=[F(314,100)*(r*r*h if tag=='cylinder-volume' else 2*r*r+2*r*h)]
 elif tag in ['mean-small','stats-small']:
  data=p['data'];expected=[F(sum(data),len(data))] if tag=='mean-small' else [F(sum(data),len(data)),statistics.median(data),statistics.mode(data),max(data)-min(data)]
 elif tag=='two-step-positive':expected=[F(p['rhs']-p['offset'],p['coefficient'])];assert expected[0]>0
 elif tag=='square-small':expected=[math.isqrt(p['a']**2) if p['root'] else p['a']**2]
 elif tag=='tax-total':expected=[F(p['cents']*p['percent'],10000),F(p['cents'],100)+F(p['cents']*p['percent'],10000)]
 elif tag=='conversions':expected=[F(p['numerator'],p['denominator']),100*F(p['numerator'],p['denominator'])]
 elif tag=='quadrilateral-angle':expected=[360-p['a']-p['b']-p['c']]
 else:raise AssertionError(('No numeric oracle',tag))
 assert values==expected,(recipe,p,values,expected);checked[recipe]+=1
print(json.dumps({'numericCases':sum(checked.values()),'numericRecipes':len(checked),'textCases':texts,'teacherContractCases':teacher,'result':'passed','limits':'Teacher drawing/production correctness requires human review; structural contract assertions are not a learner-work assessment.'},indent=2))
