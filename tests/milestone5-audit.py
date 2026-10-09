"""Independent Python arithmetic/model/identity audit; no Engine mathematics imported.
Run milestone5.cjs first. Constructed work also needs the stated teacher rubric.
"""
import json,math,re,ast,operator,os
from fractions import Fraction as F
samples=json.load(open(os.environ.get('M5_SAMPLES','/tmp/m5-samples.json')))
counts=dict(numeric=0,symbolic_model=0,production_contract=0);seen=set()
def rounded(x,d=2):return F(math.floor(x*10**d+0.50000000001),10**d)
def ev(s,**vs):
 s=s.replace('−','-').replace('²','^2').replace('³','^3').replace('^','**')
 s=re.sub(r'(\d|\))(?=[xyi(])',r'\1*',s);s=re.sub(r'([xyi])(?=[xyi(])',r'\1*',s)
 def calc(n):
  if isinstance(n,ast.Constant):return F(n.value)
  if isinstance(n,ast.Name):return dict(i=1j,**vs)[n.id]
  if isinstance(n,ast.UnaryOp):return -calc(n.operand) if isinstance(n.op,ast.USub) else calc(n.operand)
  if isinstance(n,ast.BinOp):return {ast.Add:operator.add,ast.Sub:operator.sub,ast.Mult:operator.mul,ast.Div:operator.truediv,ast.Pow:operator.pow}[type(n.op)](calc(n.left),calc(n.right))
  raise AssertionError(ast.dump(n))
 return calc(ast.parse(s,mode='eval').body)
def nums(s):return [F(x) for x in re.findall(r'(?<![A-Za-z])[-−]?\d+(?:\.\d+)?(?:/\d+)?',s.replace('−','-'))]
def close(x,y):assert abs(x-y)<1e-8,(x,y)
def interval_member(s,x):
 s=s.split(';')[0].replace('−','-')
 for l,a,b,r in re.findall(r'([\[(])(-?∞|-?\d+),(-?∞|-?\d+)([\])])',s):
  lo=-math.inf if a=='-∞' else float(a);hi=math.inf if b=='∞' else float(b)
  if (x>lo or x==lo and l=='[') and (x<hi or x==hi and r==']'):return True
 return False
for sample in samples:
 recipe=sample['recipe'];tag,arg=recipe.split(':');q=sample['q'];p=q['givens']['parameters'];ref=q['answer'].get('reference','');seen.add(recipe)
 if q['answer']['kind']!='teacher':
  got=[F(v['numerator'])/F(v['denominator']) for v in q['answer']['values']];expected=None
  if tag=='fractional':expected=[F(-round(abs(p['base'])**(1/3)))**p['power']]
  elif tag=='log':expected=[F(p['base'])**p['exp']]
  elif tag=='exponential':
   if arg=='solve':expected=[rounded(math.log(p['target'],p['base']),3)]
   else:expected=[rounded(F(p['principal'])*(1+F(p['rate'],100*p['periods']))**(p['periods']*p['years']))]
  elif tag=='trig':
   if arg=='triangle':expected=[rounded(p['hyp']*math.sin(math.radians(p['theta']))),rounded(p['hyp']*math.cos(math.radians(p['theta'])))]
   else:expected=[rounded(math.degrees(math.atan2(p['opposite'],p['adjacent'])),1)]
  elif tag=='polar':
   if arg=='rectangular':expected=[rounded(p['radius']*math.cos(math.radians(p['theta']))),rounded(p['radius']*math.sin(math.radians(p['theta'])))]
   else:expected=[rounded(math.sqrt(p['x']**2+p['y']**2)),rounded(math.degrees(math.atan2(p['y'],p['x']))%360)]
  elif tag=='vector':
   z=complex(p['r1']*math.cos(math.radians(p['t1'])),p['r1']*math.sin(math.radians(p['t1'])))+(-1 if p['negative'] else 1)*complex(p['r2']*math.cos(math.radians(p['t2'])),p['r2']*math.sin(math.radians(p['t2'])))
   expected=[rounded(abs(z)),rounded(math.degrees(math.atan2(z.imag,z.real))%360)]
  elif tag=='mixture':
   V,H,L,T=map(F,[p['volume'],p['high'],p['low'],p['target']]);x=got[0];assert x>0
   # Independent conservation equations, checked against the delivered answer.
   if arg=='final':assert x<V and L*(V-x)+H*x==T*V
   if arg=='stock':assert x>V and H*V+L*(x-V)==T*x
   if arg=='extract':assert x<V and H*V-100*x==T*(V-x)
   if arg=='dilute':assert H*V==T*(V+x)
   if arg=='replace':assert x<V and H*(V-x)==T*V
   expected=got
  elif tag=='gas':
   if arg=='pressure':expected=[rounded(F(p['P1']*p['V1'],p['V2']),3)]
   elif arg=='volume':expected=[rounded(F(p['P1']*p['V1'],p['P2']),3)]
   elif arg=='temperature':expected=[rounded(F(p['V1'])*(F(p['C2'])+F('273.15'))/(F(p['C1'])+F('273.15')),0)]
   elif arg=='ideal':expected=[rounded(F(p['moles'])*F('0.082057')*p['temp']/p['volume'],3)]
  elif tag=='statistics':
   if arg=='population':
    v=list(map(F,p['values']));N=len(v);variance=sum(x*x for x in v)/N-(sum(v)/N)**2;expected=[rounded(math.sqrt(variance))]
   else:expected=[F(p['mean']-p['sd']*p['width']),F(p['mean']+p['sd']*p['width']),[F(68),F(95),F('99.7')][p['width']-1]]
  elif tag=='counting':
   population=['r']*p['red']+['b']*p['blue'];pairs=[(x,y) for i,x in enumerate(population) for j,y in enumerate(population) if i!=j];expected=[F(sum(x!=y for x,y in pairs),len(pairs))]
  assert expected is not None,recipe
  assert got==expected,(recipe,p,got,expected);counts['numeric']+=1;continue
 production=False
 if tag=='complex':
  if arg=='power':close(ev(ref),1j**p['power'])
  elif arg=='euler':close(ev(ref.split(';')[0]),p['a']*complex(math.cos(math.radians(p['theta'])),math.sin(math.radians(p['theta']))))
  else:
   z=complex(p['x'],p['y']);w=complex(p['u'],p['v']);close(ev(ref),z-w if arg=='subtract' else z/w)
 elif tag=='quadratic':
  h,d=map(int,re.search(r'x = ([-−]?\d+) ± i√(\d+)',ref).groups());co=p['coeff']
  for z in [h+1j*math.sqrt(d),h-1j*math.sqrt(d)]:close(co[0]*z*z+co[1]*z+co[2],0)
  assert ('Discriminant' in ref)==(arg=='complex-formula')
 elif tag=='fractional':
  for x,y in [(4,27),(9,8)]:close(ev(ref,x=x,y=y),(x**(p['p']/2)*y**(-1/3))**p['q'])
 elif tag=='radical':
  if arg=='two':
   x=nums(ref)[0];close(math.sqrt(x+p['b'])+math.sqrt(x+p['b']+p['offset']),p['p']);assert x>=max(-p['b'],-p['b']-p['offset'])
  else:
   x=p['a']+1;close(math.sqrt(x+p['a']**2+p['a']),x);assert f'only x = {x}' in ref and '−'+str(p['a']) in ref
 elif tag=='factor':
  for x in [-8,-1,0,2,9]:
   original=x**4-(p['p']**2+p['q']**2)*x*x+p['p']**2*p['q']**2 if arg=='quartic' else x**3+p['s']*p['a']**3
   assert ev(ref,x=F(x))==original
 elif tag=='division':
  quotient=ref.split('Quotient ')[1].split(';')[0];rem=ref.split('remainder ')[1].split('.')[0]
  for x in [-4,-2,0,3,5]:assert sum(F(c)*x**(4-i) for i,c in enumerate(p['cs']))==(x*x-1)*ev(quotient,x=F(x))+ev(rem,x=F(x))
 elif tag=='literal':
  for a,c in [(-3,7),(p['k'],p['b']),(p['k'],p['b']+1)]:
   if a!=p['k']:
    x=F(c-p['b'],a-p['k']);assert a*x+p['b']==p['k']*x+c
  assert all(w in ref for w in ['every real x','no solution','a ≠'])
 elif tag=='three':
  rows,rhs=p['rows'],p['rhs']
  if arg=='unique':
   xyz=nums(ref.split('=')[1]);assert all(sum(a*b for a,b in zip(row,xyz))==v for row,v in zip(rows,rhs))
   a,b,c=rows;det=a[0]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[1]-b[1]*c[0]);assert det!=0
  elif arg=='dependent':
   for t in [-4,0,7]:
    xyz=[F(rhs[0]+rhs[2]-t,2),F(rhs[0]-rhs[2]-t,2),F(t)];assert all(sum(a*b for a,b in zip(row,xyz))==v for row,v in zip(rows,rhs))
   assert 'Infinitely many' in ref
  else:assert rhs[1]!=2*rhs[0] and rows[1]==[2*x for x in rows[0]] and 'No solution' in ref
 elif tag=='nonlinear':
  pairs=[tuple(map(F,t)) for t in re.findall(r'\(([-−]?\d+),([-−]?\d+)\)',ref.replace('−','-'))]
  if arg=='two-squares':assert len(set(pairs))==4 and all(x*x+y*y==p['x']**2+p['y']**2 and x*x-y*y==p['x']**2-p['y']**2 for x,y in pairs)
  elif arg=='circle-line':assert len(pairs)==[2,1,0][p['branch']] and all(x*x+y*y==p['radius']**2 and y==p['line'] for x,y in pairs)
  else:assert len(pairs)==[2,1,0][p['branch']] and all(y==(x-p['h'])**2 and y==p['rhs'] for x,y in pairs)
 elif tag=='inequality':
  lo,hi=p['lo'],p['hi']
  for x in [lo-2,lo,lo+.5,0,hi-.5,hi,hi+2]:
   if arg=='repeated':
    expected=(x-hi)**2;accepted=expected>=0 if p['greater'] and p['closed'] else expected>0 if p['greater'] else expected<=0 if p['closed'] else expected<0
    got=True if ref=='All real numbers.' else x!=hi if ref.startswith('All real numbers except') else x==hi if ref.startswith('{') else False
   else:
    val=(x-lo)*(x-hi) if arg=='quadratic' else (x-lo)/(x-hi) if arg=='rational' and x!=hi else x-lo
    accepted=val>=0 if p['greater'] and p['closed'] else val>0 if p['greater'] else val<=0 if p['closed'] else val<0
    if arg=='hole':accepted=x>=lo
    if arg in ['hole','rational'] and x==hi:accepted=False
    got=interval_member(ref,x)
   assert got==accepted,(recipe,ref,x,accepted)
 elif tag=='log':
  if arg=='convert':assert F(p['base'])**p['exp']>0 and str(p['exp']) in ref
  elif arg=='expand':
   for x,y in [(2,3),(5,7)]:close(math.log(x**p['a']*math.sqrt(y)/p['base'],p['base']),p['a']*math.log(x,p['base'])+.5*math.log(y,p['base'])-1)
   assert f"{p['a']} log_" in ref and '(1/2)' in ref and '− 1' in ref
  elif arg=='condense':assert f"x^{p['a']}/y^{p['b']}" in ref
  elif arg=='sum':
   x=nums(ref.split('only x =')[1])[0];assert x>p['h'];close(2*math.log(x-p['h'],p['base']),2*p['b'])
  elif arg=='difference':
   x=nums(ref.rsplit('x =',1)[1])[0];assert x>0;close(math.log(x+p['h'],p['base'])-math.log(x,p['base']),1)
  else:assert 'reject 0' in ref and 'x = 1' in ref
 elif tag=='gas':
  result=F(re.findall(r'[-−]?\d+\.\d+',ref)[-1]);P2=p['P1']*p['V1']*p['T2']/p['T1']/p['V2'];T2=p['T1']*p['P2']*p['V2']/p['P1']/p['V1'];assert result==rounded(P2 if arg.endswith('pressure') else T2,3),(recipe,p,ref,rounded(P2 if arg.endswith('pressure') else T2,3))
 elif tag=='motion':
  got=nums(ref.split(';')[1]);v,c=got;assert F(p['distance'])/(v+c)==p['down'] and F(p['distance'])/(v-c)==p['up']
 elif tag=='variation':
  y=nums(ref.split('final y =')[1])[0];assert y==F(p['constant']*p['x2']*p['z2']) if arg=='joint' else y==F(p['constant']*p['x2'],p['z2']**2)
 elif tag=='vector' and p.get('zero'):
  assert p['r1']==p['r2'];assert (p['t1']-p['t2'])%360==(0 if p['negative'] else 180);assert ref=='Zero vector; magnitude 0, direction undefined.'
 elif tag=='vector':
  match=re.search(r'Resultant ⟨([-−]?\d+),([-−]?\d+)⟩; magnitude √(\d+)',ref);x,y,r=map(int,match.groups());assert (x,y)==(p['x']+p['u'],p['y']+p['v']) and r==x*x+y*y
  if x==y==0:assert 'undefined' in ref
 elif tag=='sets':assert nums(ref)==list(map(F,[p['onlyA'],p['onlyB'],p['both'],p['neither'],p['total']-p['neither']]))
 elif tag in ['plane','exponential','proof','construct','locus','space']:
  production=True;assert len(q['answer']['rubric'])>=2 and 'teacher review' in q['prompt'];assert ref
  if tag=='plane':assert q['teacherSvg'].count('stroke-dasharray')==(1 if p['strict'] else 0)
  if tag=='locus':assert f'(0,{p["b"]})' in ref and f'(0,−{p["b"]})' in ref
 else:raise AssertionError(recipe)
 counts['production_contract' if production else 'symbolic_model']+=1
assert len(seen)==73
print(json.dumps(dict(result='passed',cases=len(samples),recipes=len(seen),**counts)))
