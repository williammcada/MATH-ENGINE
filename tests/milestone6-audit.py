"""Independent arithmetic, equation and identity audit of emitted M6 samples.
Production-contract checks are explicitly separate from mathematical calculations.
No Engine mathematics imported. Run milestone6.cjs first.
"""
import json,math,re,ast,operator
from fractions import Fraction as F
from decimal import Decimal,ROUND_HALF_UP
samples=json.load(open('/tmp/m6-samples.json'))
counts=dict(numeric=0,symbolic_model=0,production_contract=0);seen=set()
def rounded(x,d=2):return F(math.floor(x*10**d+.50000000001),10**d)
def close(x,y):assert abs(x-y)<1e-7,(x,y)
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
def has(ref,value):assert str(value) in ref,(value,ref)
for sample in samples:
 recipe=sample['recipe'];tag,arg=recipe.split(':');q=sample['q'];p=q['givens']['parameters'];ref=q['answer'].get('reference','');seen.add(recipe)
 if q['answer']['kind']!='teacher':
  got=[F(v['numerator'])/F(v['denominator']) for v in q['answer']['values']];expected=None
  if tag=='review':
   if arg=='angles':expected=[180-p['x'],p['x'],180-p['x']]
   elif arg=='absolute':expected=[-abs(p['x']-p['y'])+p['a']]
   elif arg=='solid':expected=[F(p['base']*p['height'],3 if p['cone'] else 1)]
   elif arg=='surface':s=p['scale'];expected=[2*(3*s*4*s/2)+(3*s+4*s+5*s)*p['length']]
  elif tag=='geometry':
   if arg=='isosceles-area':expected=[p['base']*math.sqrt(p['equal']**2-(p['base']/2)**2)/2]
   elif arg=='exterior':expected=[p['x']+p['y']]
   elif arg=='polygon':expected=[p['sides']-2,(p['sides']-2)*180]
   elif arg=='cyclic':expected=[180-p['A'],180-p['B']]
   elif arg=='rhombus':expected=[180-p['A'],F(p['A'],2),90]
   elif arg=='chords':expected=[F(p['p']*p['q'],p['r'])]
   elif arg=='distance-line':expected=[p['a']]
   elif arg=='tangent-secant':expected=[rounded(math.sqrt(p['ext']*p['whole']))]
  elif tag=='algebra':expected=[p['a'],-p['b'],0,p['k']] if arg=='coefficients' else [2]
  elif tag=='chemical':expected=[F(p['mass']*16,18)] if arg=='mass' else [rounded(F(1600,18))]
  elif tag=='gas':
   value=F(p['pressure']*p['volume'])/(F('0.082057')*p['temp']) if arg=='moles' else F(p['moles'])*F('0.082057')*p['temp']/p['pressure'];expected=[rounded(value,3)]
  elif tag=='number':expected=[F(p['left'])+F(p['fraction'])*(F(p['right'])-F(p['left']))]
  elif tag=='polar':expected=[rounded(p['radius']*math.cos(math.radians(p['theta']))),rounded(p['radius']*math.sin(math.radians(p['theta'])))]
  elif tag=='vector':
   z=(-1 if p['negative'] else 1)*p['r1']*complex(math.cos(math.radians(p['t1'])),math.sin(math.radians(p['t1'])))+p['r2']*complex(math.cos(math.radians(p['t2'])),math.sin(math.radians(p['t2'])))
   expected=[rounded(z.real),rounded(z.imag)]
  assert expected is not None,recipe
  assert got==expected,(recipe,p,got,expected);counts['numeric']+=1;continue
 model=True
 if tag=='algebra' and arg=='binomial':
  for x in [-3,0,2]:close(ev(ref,x=x),(x+p['s']*p['a'])**3)
 elif tag=='fractional' and arg in ['binomial','conjugates']:
  for x,y in [(4,8),(9,27)]:
   u=x**(1/p['d']);v=y**(p['exp']/p['d']);close(ev(ref,x=x,y=y),(u+v)**2 if arg=='binomial' else (u+v)*(u-v))
 elif tag=='complex':
  if arg=='negative-root':close(ev(ref),complex(0,math.sqrt(p['a']**2*p['b']**2)))
  else:has(ref,'=−'+str(p['a']*p['b']));has(ref,'Root of the product = '+str(p['a']*p['b']))
 elif tag=='quadratic':
  h,d=map(int,re.search(r'x=([-−]?\d+) ± √(\d+)',ref).groups())
  for root in [h+math.sqrt(d),h-math.sqrt(d)]:close(p['co'][0]*root**2+p['co'][1]*root+p['co'][2],0)
 elif tag=='gas':
  val=F(p['P']*p['V'],p['V2']) if arg=='significant-pressure' else F(p['P']*p['V'],p['P2']) if arg=='significant-volume' else F(p['P']*p['V']*p['T2']*100000,p['T0']*p['V2']) if arg=='scientific-pressure' else F(p['T0']*p['P2']*p['V2'],p['P']*p['V'])
  v=Decimal(val.numerator)/Decimal(val.denominator);ex=v.adjusted();digits=3 if arg=='significant-volume' else 2;expected=v.quantize(Decimal(1).scaleb(ex-digits+1),rounding=ROUND_HALF_UP)
  m,e=re.search(r'; ([\d.]+) × 10\^(-?\d+)',ref).groups();assert Decimal(m)*Decimal(10)**int(e)==expected,(recipe,p,ref,expected)
 elif tag=='scientific':
  m,e=re.search(r'= ([\d.]+) × 10\^(-?\d+)',ref).groups();expected=F((p['m']+5)//10*((p['z']+5)//10))*F(10)**(p['p']-p['q']);assert F(m)*F(10)**int(e)==expected
 elif tag=='units':
  if arg=='rate':has(ref,format(float(F(p['mph']*5280,3600)),'.2f'))
  else:
   value=F(p['value'])*F(9144,10000)**p['power'];found=re.search(r'(?:= |Result )([\d./]+) m',ref);assert found and F(found[1])==value
 elif tag=='rational':
  numerator=int(re.match(r'(-?\d+)/',ref)[1]);assert numerator==p['p']-p['q']
  for x in [-2,0,1]:assert F(1,x-p['p'])+F(1,p['q']-x)==F(numerator,(x-p['p'])*(x-p['q']))
 elif tag=='system':
  if arg=='four':
   r,t,u,v=map(int,re.search(r'R₁=(\d+), T₁=(\d+), R₂=(\d+), T₂=(\d+)',ref).groups());assert r*t==p['c']*p['t'] and u*v==p['u']*p['v'] and r==p['a']*u and t+v==p['t']+p['v']
  elif arg=='cyclic-three':
   got=list(map(int,re.search(r'=\((-?\d+),(-?\d+),(-?\d+)\)',ref).groups()));assert [sum(a*b for a,b in zip(row,got)) for row in p['rows']]==p['rhs']
  elif arg in ['decimal','combined']:
   x,y,z=p['x'],p['y'],p.get('z',0);has(ref,'x='+str(x));has(ref,'y='+str(y))
   if arg=='combined':assert x+y+z==p['rhs'] and 2*x-y+z==p['rhs2']
  elif arg=='circle-parabola':
   r=p['r'];pairs=[(math.sqrt(2*r-1),r-1),(-math.sqrt(2*r-1),r-1),(0,-r)]
   for x,y in pairs:close(x*x+y*y,r*r);close(y,x*x-r)
   assert f'√{2*r-1}' in ref and f'(0,−{r})' in ref
  elif arg=='ellipse-circle':
   a,b,r=p['p'],p['q'],p['r'];xx=F(a*a*(b*b-r*r),b*b-a*a);yy=r*r-xx
   assert (xx<0 or yy<0)==('No real solution' in ref)
   if xx>=0 and yy>=0:assert xx/F(a*a)+yy/F(b*b)==1
  else:
   a,b=p['p'],p['q'];has(ref,f'({a},{b}), ({b},{a})');assert a!=b
 elif tag=='data':
  slope=(p['ys'][-1]-p['ys'][0])/(p['xs'][-1]-p['xs'][0]);has(ref,'y='+str(slope).removesuffix('.0')+'x+1');has(ref,'prediction '+str(5*slope+1).removesuffix('.0'))
 elif tag=='function' and arg in ['sum','product']:
  formula=ref.split(';')[0]
  for x in [1,2,3]:close(ev(formula,x=x),(p['a']*x*x+p['b'])+x-p['k'] if arg=='sum' else (p['a']*x*x+p['b'])*(x-p['k']))
  assert ('domain empty' in ref)==(p['split']==0);assert ('not defined' in ref)==(p['split']<2)
 elif tag=='number':
  t,u=p['tens'],p['ones'];assert t+u==p['sum'] and (10*u+t)-(10*t+u)==p['diff'];has(ref,'number '+str(10*t+u));assert 1<=t<=9 and 1<=u<=9
 elif tag=='motion':
  v,m,t=p['speed'],p['multiple'],p['t'];has(ref,str(v)+' km/h')
  if arg=='return':assert F(p['distance'],v)+F(p['distance'],m*v)==F(p['total'])
  else:assert F(p['d2'],v)-F(p['d1'],m*v)==p['delay']
 elif tag=='word':
  if arg=='three-angles':assert p['first']+p['second']+p['third']==180 and p['first']<p['second']<p['third'];assert p['second']==2*p['first']+p['b'];has(ref,str(p['third'])+'°')
  elif arg=='three-weights':assert p['reds']+p['yellows']+p['greens']==p['total'] and 2*p['reds']+3*p['yellows']+5*p['greens']==p['weight'];has(ref,'r='+str(p['reds']))
  elif arg=='three-coins':assert p['nickels']+p['dimes']+p['quarters']==p['total'] and 5*p['nickels']+10*p['dimes']+25*p['quarters']==p['cents'];has(ref,'q='+str(p['quarters']))
  elif arg=='quadratic':x=p['x'];assert x*(x+1)==p['delta']+x+2;has(ref,'n='+str(x))
  elif arg=='right-triangle':a=p['a'];assert (3*a)**2+(4*a)**2==(5*a)**2;has(ref,'sides '+str(3*a)+','+str(4*a)+','+str(5*a))
  elif arg=='age-past':assert F(p['younger']-p['years'],p['older']-p['years'])==F(p['ratio']);assert p['older']-p['past']==2*(p['younger']-p['past'])+p['offset'];has(ref,'A='+str(p['older']))
  elif arg=='age-ratio':assert p['older']==3*p['younger'];has(ref,str(F(p['older']+p['years'],p['younger']+p['years'])))
  else:has(ref,'B='+str(p['younger']));has(ref,'A='+str(2*p['younger']+p['b']))
 elif tag=='geometry' and arg in ['parallel-segments','overlap']:
  ac=F(p['side']*(p['small']+p['extra']),p['small']);has(ref,'AC='+str(ac));has(ref,'EC='+str(ac-p['side']))
 elif tag=='review' and arg=='area':has(ref,format(float(p['w']*p['h']-F(314,100)),'.2f'))
 else:model=False
 if model:counts['symbolic_model']+=1
 else:
  assert len(ref)>0 and len(q['answer']['rubric'])>=2
  if tag in ['proof','construct']:assert 'prove' in q['prompt'].lower() or tag=='construct' or arg in ['deduction','euclid']
  if recipe=='graph:nonlinear-system':assert ('endpoints included' in ref)==p['closed'];assert ('dashed' in ref)==(not p['closed'])
  if recipe=='absolute:negative':assert ('Empty set' in ref)==(p['kind']<2)
  counts['production_contract']+=1
assert len(seen)==115
print(json.dumps(dict(result='passed',recipes=len(seen),samples=len(samples),**counts)))
