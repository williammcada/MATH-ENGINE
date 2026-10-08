"""Independent exact arithmetic oracle for every authored breadth recipe."""
import json,subprocess,pathlib,math,statistics,xml.etree.ElementTree as ET
from fractions import Fraction as F
root=pathlib.Path(__file__).resolve().parents[1]
script="""const E=require('./src/course-banks.js'),C=require('./src/breadth-bank-map.js');for(const c of C)for(let i=0;i<200;i++){const q=E.generate(c.sourceId,{seed:'independent-breadth',index:i});const a=E.answerText(q);if(!E.checkAnswer(q,a).answerCorrect||E.checkAnswer(q,'incorrect').answerCorrect)throw Error(c.sourceId);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'independent-breadth',index:i})))throw Error('Replay');console.log(JSON.stringify({recipe:c.recipe,q,formatted:a,html:i%40===0?E.renderQuestion(q):null}));}"""
def rat(x):return F(int(x['numerator']),int(x['denominator']))
def prime(n):return n>=2 and all(n%d for d in range(2,math.isqrt(n)+1))
def fac(n):
 out=[]
 while n>1:
  d=next(x for x in range(2,n+1) if n%x==0);out.append(d);n//=d
 return out
def readroman(s):
 d={'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000};return sum(-d[c] if i+1<len(s) and d[c]<d[s[i+1]] else d[c] for i,c in enumerate(s))
def solve(A,b):
 a=[[F(v) for v in row]+[F(rhs)] for row,rhs in zip(A,b)];n=len(a)
 for j in range(n):
  k=next(k for k in range(j,n) if a[k][j]);a[j],a[k]=a[k],a[j];p=a[j][j];a[j]=[v/p for v in a[j]]
  for k in range(n):
   if k!=j:
    factor=a[k][j];a[k]=[v-factor*w for v,w in zip(a[k],a[j])]
 return [row[-1] for row in a]
count=0;recipes=set();svgs=0;domains=set();classes=set();letters=set();signs=set()
proc=subprocess.Popen(['node','-e',script],cwd=root,stdout=subprocess.PIPE,text=True)
for line in proc.stdout:
 row=json.loads(line);r=row['recipe'];q=row['q'];p=q['givens']['parameters'];a=q['answer'];v=[rat(x) for x in a['values']] if a['kind'] in ['numbers','scientific','reduced-fraction'] else a['values'];expected=None;recipes.add(r)
 if r in ['gcf','lcm','common-multiples']:
  n=math.gcd(*p['nums']) if r=='gcf' else math.lcm(*p['nums']);expected=[n,2*n,3*n] if r=='common-multiples' else [n]
 elif r=='prime-test':assert a['text']==('yes' if prime(p['n']) else 'no')
 elif r in ['prime-list','prime-sum']:
  xs=[i for i in range(p['lo']+1,p['hi']) if prime(i)]
  if r=='prime-list':assert set(v)==set(map(str,xs))
  else:expected=[sum(xs)]
 elif r=='prime-factorization':assert list(map(int,a['text'].split(' × ')))==fac(p['n'])
 elif r=='round-whole':
  lo=p['n']//p['place']*p['place'];hi=lo+p['place'];expected=[lo if p['n']-lo<hi-p['n'] else hi]
 elif r=='round-money':expected=[p['cents']//100+int(p['cents']%100>=50)]
 elif r in ['roman-read','roman-write']:
  assert readroman(p['roman'])==p['n']
  if r=='roman-read':expected=[p['n']]
  else:assert readroman(a['text'])==p['n']
 elif r in ['binary-read','binary-write']:
  assert int(p['binary'],2)==p['n']
  if r=='binary-read':expected=[p['n']]
  else:assert int(a['text'],2)==p['n'] and a['text'][0]=='1'
 elif r in ['sequence-next','sequence-missing']:
  ix=[3,4,5] if r=='sequence-next' else [2,3,5];expected=[p['start']+j*p['step'] for j in ix]
 elif r=='clock-read':assert row['formatted']==str(p['hour'])+':'+str(p['minute']).zfill(2)
 elif r=='elapsed-overnight':
  delta=(p['end']-p['start'])%1440;expected=[delta//60,delta%60];assert 12*60<p['start']<1440 and p['end']<12*60
 elif r in ['square-perimeter','rectangle-perimeter']:expected=[p['w']+p['h']+p['w']+p['h']]
 elif r=='mean-three':expected=[F(sum(p['data']),len(p['data']))]
 elif r=='median-five':expected=[statistics.median(p['data'])]
 elif r=='function-table':expected=[x+p['k'] for x in p['xs']];assert q['givens']['table']['rows']==[[x,'?'] for x in p['xs']]
 elif r=='bar-graph-choice':
  opts=q['givens']['options'];matches=[i for i,x in enumerate(opts) if x['parameters']['values']==p['data']];assert len(matches)==1 and a['text']=='ABCD'[matches[0]];assert len(set(json.dumps(x,sort_keys=True) for x in opts))==4;letters.add(a['text'])
 elif r=='cylinder-volume':expected=[F(157,50)*p['radius']**2*p['height']]
 elif r=='prism-surface':expected=[sum([p['width']*p['depth']]*2+[p['width']*p['height']]*2+[p['depth']*p['height']]*2)]
 elif r=='square-root-difference':expected=[p['n']**2-math.isqrt(p['n'])];assert math.isqrt(p['n'])**2==p['n']
 elif r in ['positive-power','negative-power']:expected=[F(p['base'])**p['exponent']]
 elif r=='cube-root':
  expected=[next(i for i in range(-10,11) if i**3==p['cube'])]
 elif r=='evaluate-xy':expected=[p['s']*p['x']*p['y']-p['x']]
 elif r=='collect-xy':expected=[sum(p['coeffs']),sum(p['constants'])]
 elif r=='polynomial-class':assert a['text']=={1:'monomial',2:'binomial',3:'trinomial'}[sum(x!=0 for x in p['cs'])]
 elif r=='factor-trinomial':assert sum(v)==p['b'] and math.prod(v)==p['c'] and len(v)==2
 elif r=='scientific-normalize':assert 1<=v[0]<10 and v[1].denominator==1 and v[0]*F(10)**int(v[1])==rat(p['number'])
 elif r=='negative-reciprocals':expected=[-1/rat(x) for x in p['numbers']]
 elif r=='polynomial-division':
  A,B,C,remainder=v;e=p['e'];assert [A,B+A*e,C+B*e,C*e+remainder]==p['numerator'];assert remainder!=0
 elif r in ['complex-add','complex-multiply','complex-divide']:
  z=complex(p['a'],p['b']);w=complex(p['c'],p['d']);ans=z+w if r=='complex-add' else z*w if r=='complex-multiply' else z/w
  assert abs(complex(*map(float,v))-ans)<1e-12
  if r=='complex-divide':assert v[0]*p['c']-v[1]*p['d']==p['a'] and v[0]*p['d']+v[1]*p['c']==p['b']
 elif r in ['system-two','system-three','system-substitution']:expected=solve(p['matrix'],p['rhs'])
 elif r=='system-class':
  (A,B),(C,D)=p['matrix'];u,w=p['rhs'];expected_class='one' if A*D-B*C else 'infinitely many' if A*w==C*u and B*w==D*u else 'none';assert a['text']==expected_class;classes.add(expected_class)
 elif r in ['slope-points','line-points','line-point-slope','parallel-line','perpendicular-line']:
  slope=rat(p['slope']);x,y=p['point']
  if r=='slope-points':expected=[F(p['second'][1]-y,p['second'][0]-x)]
  else:expected=[slope,y-slope*x]
  if r=='perpendicular-line':assert slope*rat(p['referenceSlope'])==-1
  if r=='parallel-line':assert slope==rat(p['referenceSlope'])
 elif r=='line-graph-choice':
  opts=q['givens']['options'];matches=[i for i,x in enumerate(opts) if abs(x['parameters']['m']-float(rat(p['m'])))<1e-12 and x['parameters']['b']==p['b']];assert len(matches)==1 and a['text']=='ABCD'[matches[0]];assert len(set(json.dumps(x,sort_keys=True) for x in opts))==4
 elif r=='inequality-graph-choice':
  rel=p['relation'];truth=lambda x: p['a']*x+p['b']>p['rhs'] if rel=='>' else p['a']*x+p['b']>=p['rhs'] if rel=='≥' else p['a']*x+p['b']<p['rhs'] if rel=='<' else p['a']*x+p['b']<=p['rhs'];matches=[]
  for j,option in enumerate(q['givens']['options']):
   m=option['parameters'];represented=lambda x:x==m['boundary'] if False else (x>=m['boundary'] if m['closed'] else x>m['boundary']) if m['direction']=='right' else (x<=m['boundary'] if m['closed'] else x<m['boundary'])
   if all(truth(x/2)==represented(x/2) for x in range(-22,23)):matches.append(j)
  assert len(matches)==1 and a['text']=='ABCD'[matches[0]];signs.add((p['a']>0,rel))
 elif r=='trig-ratios':
  assert p['base']**2+p['height']**2==p['hypotenuse']**2;angle=math.atan2(p['height'],p['base']);assert all(abs(float(x)-y)<1e-12 for x,y in zip(v,[math.sin(angle),math.cos(angle),math.tan(angle)]))
 elif r=='relation-function':
  pairs=p['points'];is_function=all(x!=u or y==w for x,y in pairs for u,w in pairs);assert a['text']==('yes' if is_function else 'no')
 elif r=='function-evaluate':expected=[sum(c*p['x']**(2-i) for i,c in enumerate(p['coeffs']))]
 elif r in ['function-sum','function-product']:
  allowed=p['x']>0 if p['domain']=='positive integers' else p['x']<0;domains.add((r,allowed))
  if not allowed:assert a['text']=='undefined'
  else:
   x=p['x'];f=x+p['b'];g=p['a']*x*x+p['d'];expected=[f+g if r=='function-sum' else f*g]
 elif r=='direct-variation':expected=[F(p['y1'],p['x1'])*p['x2']]
 elif r=='inverse-variation':expected=[F(p['y1']*p['x1'],p['x2'])]
 elif r=='joint-variation':expected=[F(p['oil'],p['distance']*p['speed']**2)*p['newDistance']*p['newSpeed']**2]
 elif r=='fraction-between':expected=[p['lo']+F(p['num'],10)*(p['hi']-p['lo'])]
 elif r=='repeating-fraction':expected=[F(int(p['digits']),99)]
 elif r=='log-ten':assert F(10)**int(v[0])==rat(p['number']) and v[0].denominator==1
 elif r=='exponential-growth':expected=[2**(p['elapsed']//p['interval'])];assert p['elapsed']%p['interval']==0
 elif r=='permutations':expected=[math.factorial(p['n'])]
 elif r=='counting-power':expected=[p['choices']**p['questions']]
 elif r in ['set-intersection','set-union']:assert set(v)==(set(p['a'])&set(p['b']) if r=='set-intersection' else set(p['a'])|set(p['b']))
 else:raise AssertionError('No oracle for '+r)
 if expected is not None:assert v==expected,(r,p,v,expected)
 if row['html']:
  import re
  for svg in re.findall(r'<svg.*?</svg>',row['html']):ET.fromstring(svg);svgs+=1
 count+=1
assert proc.wait()==0
assert count==17000 and len(recipes)==66 and len(domains)==4 and len(classes)==3 and len(letters)==4 and len(signs)==8
print(f'PASS: {count} independent generated cases, {len(recipes)} task recipes, {svgs} parsed SVGs; domain and system branches, inequality signs, unique graph choices, replay and answer checks')
