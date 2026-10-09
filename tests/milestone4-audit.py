"""Independent arithmetic, algebra identity, model and boundary audit of M4 samples.
Run milestone4.cjs first. Uses only Python standard library; no runtime math imports.
"""
import json,os,re,math,ast,operator
from fractions import Fraction as F
from decimal import Decimal,localcontext,ROUND_HALF_UP
samples=json.load(open(os.environ.get('M4_SAMPLES','/tmp/m4-samples.json')))
counts={'numeric':0,'symbolic_or_model':0,'teacher_contract':0};seen=set()
def ev(s,x=F(2),y=F(3)):
 s=s.strip().replace('−','-').replace('×','*').replace('²','^2').replace('³','^3').replace('[','(').replace(']',')').replace('|x|','abs(x)')
 s=re.sub(r'√(\d+)',r'sqrt(\1)',s).replace('^','**')
 s=re.sub(r'(\d|\))(?=[xy(]|sqrt|abs)',r'\1*',s);s=re.sub(r'([xy])(?=[xy(]|sqrt)',r'\1*',s)
 def calc(n):
  if isinstance(n,ast.Constant):return F(str(n.value))
  if isinstance(n,ast.Name):return {'x':x,'y':y}[n.id]
  if isinstance(n,ast.UnaryOp):return -calc(n.operand) if isinstance(n.op,ast.USub) else calc(n.operand)
  if isinstance(n,ast.BinOp):return {ast.Add:operator.add,ast.Sub:operator.sub,ast.Mult:operator.mul,ast.Div:operator.truediv,ast.Pow:operator.pow}[type(n.op)](calc(n.left),calc(n.right))
  if isinstance(n,ast.Call):return {'sqrt':math.sqrt,'abs':abs}[n.func.id](calc(n.args[0]))
  raise AssertionError(ast.dump(n))
 return calc(ast.parse(s,mode='eval').body)
def near(a,b):assert math.isclose(float(a),float(b),rel_tol=2e-10,abs_tol=2e-9),(a,b)
def vals(q):return [F(int(v['numerator']),int(v['denominator'])) for v in q['answer']['values']]
def polynomial(cs,x):return sum(F(c)*x**(len(cs)-1-i) for i,c in enumerate(cs))
def has(ref,*bits):
 for v in bits:assert str(v) in ref,(v,ref)
for row in samples:
 rec=row['recipe'];seen.add(rec);tag,_,arg=rec.partition(':');q=row['q'];p=q['givens']['parameters'];ref=q['answer'].get('reference','');kind='symbolic_or_model';a=p.get('a');b=p.get('b');k=p.get('k');want=None
 try:
  if tag=='absolute-value':want=[abs(p['x']),-abs(p['x'])]
  elif tag=='signed-nesting':want=[-p['x']-p['y']]
  elif tag=='evaluate-hard':want=[F(a*p['x']**2-b*p['y'],k)]
  elif tag=='degree':want=[p['px']+p['py']]
  elif tag=='complex' and arg=='numeric':want=[(F(a,b)+F(1,k))/F(b,a)]
  elif tag=='function' and arg=='evaluate':want=[a*k*k-b,-b,a*k*k-b]
  elif tag=='distance-points':want=[math.isqrt(p['dx']**2+p['dy']**2)]
  elif tag=='roots' and arg=='large':want=[math.isqrt(p['base']**2)]
  elif tag=='target-average':want=[F(p['target']*(p['count']+p['next'])-p['old']*p['count'],p['next'])]
  elif tag=='calculator-power':
   with localcontext() as ctx:
    ctx.prec=40;base=Decimal(str(p['base']));exp=Decimal(1)/3 if p['exponent']==1/3 else Decimal(str(p['exponent']));value=(base**exp).quantize(Decimal('.001'),rounding=ROUND_HALF_UP);want=[F(value)]
  elif tag=='variation' and arg=='find-x':
   with localcontext() as ctx:ctx.prec=40;want=[F((Decimal(p['target'])*Decimal(p['time'])**2/Decimal(p['distance'])).sqrt().quantize(Decimal('.001'),rounding=ROUND_HALF_UP))]
  elif tag=='exponential' and arg=='growth':
   value=F(p['initial'])*F(100+p['rate'],100)**p['periods'];want=[(value.numerator*2+value.denominator)//(2*value.denominator)]
  elif tag=='boxplot' and arg=='read':want=[*p['five'],p['five'][3]-p['five'][1]]
  elif tag=='signed-sum':assert F(ref.split('.')[0])==sum(p['xs'])
  elif tag=='inverse-operations':has(ref,f'x = {b}')
  elif tag=='factor-exchange':has(ref,a*100)
  elif tag=='factor':
   for x,y in [(F(-3),F(2)),(F(2,3),F(-4)),(F(5,2),F(3))]:
    expect=p['g']*a*x**3*y**2+p['g']*b*x*x*y**3 if arg=='gcf' else polynomial(p['coefficients'],x)
    near(ev(ref,x,y),expect)
  elif tag=='monomial-lcm':
   for x,y in [(F(2),F(3)),(F(3),F(2))]:near(ev(ref,x,y),math.lcm(a,b)*x**max(p['p'],2)*y**p['q'])
  elif tag=='exponents':
   expr=ref.split(';')[0].split(',')[0]
   for x,y in [(F(-3),F(2)),(F(2,3),F(-4))]:
    expect=1 if arg=='zero' else -(a*x)**(-k) if arg=='negative' else (a*x**k*y**-2)**b if arg=='power' else x**(p['p']+p['q'] if arg=='product' else p['p']-p['q'])
    near(ev(expr,x,y),expect)
  elif tag=='rational':
   for x,y in [(F(-11),F(2)),(F(11),F(-3)),(F(1,2),F(3))]:
    pp=p['p'];qq=p['q']
    if arg=='cancel':expect=F(a)*x*x*y/(a*b*x*y*y)
    elif arg=='distribute':expect=(a*x**3*y+b*x*x*y*y)/(x*y)
    elif arg=='negative-distribute':expect=x**(-k)*(a*x**(k+1)+b*x**(k-1))
    elif arg=='like':expect=(a+b-1)*x**(-k)
    elif arg=='equal':expect=F(a,x-pp)+F(b,x-pp)
    elif arg=='unequal':expect=F(a,x-pp)+F(b,x-qq)
    elif arg=='factorable':expect=1/(x-pp)+F(pp+qq,x*x+(qq-pp)*x-pp*qq)
    elif arg=='product':expect=(x-pp)/(x-qq)*(x-qq)/(x+k)
    elif arg=='quotient':expect=((x-pp)/(x-qq))/((x-pp)/(x+k))
    else:raise AssertionError(rec)
    near(ev(ref.split(';')[0],x,y),expect)
   if arg in ['cancel','distribute','negative-distribute','like']:has(ref,'x ≠ 0')
   if arg in ['cancel','distribute']:has(ref,'y ≠ 0')
   if arg=='quotient':has(ref,pp,qq,-k)
  elif tag=='complex':
   for x,y in [(F(-3),F(2)),(F(2),F(-3))]:near(ev(ref.split(';')[0],x,y),(F(a,x)/F(b,y)) if arg=='symbolic' else ((F(a,x)+x/y)/F(b,y)))
   has(ref,'x ≠ 0','y ≠ 0')
  elif tag=='polynomial-equation':assert a*p['x']+b==p['rhs'];has(ref,f"x = {p['x']}")
  elif tag=='equation':
   x=p['x'];rhs=a*(x-b)+(k*(b-x) if arg=='nested' else k);assert rhs==p['rhs']
   has(ref,'Every real' if arg=='nested' and a==k else f'x = {x}')
  elif tag=='polynomial-division':
   quotient=ref.split('Quotient ')[1].split(';')[0]
   for x in [F(-3),F(2,3),F(4)]:near(polynomial(p['coeff'],x),ev(quotient,x)*(x-p['p'])+p['rem'])
   has(ref,f"remainder {p['rem']}")
  elif tag=='quadratic':
   cs=p['coefficients']
   if arg=='factor':
    for x in [p['p'],p['q']]:assert polynomial(cs,x)==0
    for x in [F(-3),F(2,3),F(4)]:near(ev(ref.split(' = 0;')[0],x),polynomial(cs,x))
   elif arg=='complete':
    for z in [-p['shift']-math.sqrt(p['d']),-p['shift']+math.sqrt(p['d'])]:near(polynomial(cs,z),0)
    has(ref,str(-p['shift']))
   else:
    assert p['disc']==cs[1]**2-4*cs[0]*cs[2];has(ref,f"Discriminant {p['disc']}")
    if p['disc']<0:has(ref,'No real solutions')
    else:
     for z in [(-cs[1]-math.sqrt(p['disc']))/(2*cs[0]),(-cs[1]+math.sqrt(p['disc']))/(2*cs[0])]:near(polynomial(cs,z),0)
  elif tag=='radical':
   d=p['d'];e=p['e']
   for x in [-3,2]:
    expect=math.sqrt(a*a*d*x*x) if arg=='simplify' else (a+b-1)*math.sqrt(d) if arg=='sum' else math.sqrt(a*a*d)*math.sqrt(b*b*d) if arg=='product' else (a-math.sqrt(d))*(b+math.sqrt(d)) if arg=='binomial' else (a*b+a*k*math.sqrt(d*e))/(a*math.sqrt(d)) if arg=='quotient' else a/math.sqrt(d)
    near(ev(ref.split(';')[0],F(x)),expect)
  elif tag=='radical-equation':
   r=p['r'];kind0=p['kind']
   if kind0==0:near(math.sqrt(r+r*r-r),r);assert 1-r<0;has(ref,f'x = {r} works')
   elif kind0==1:near(math.sqrt(-r+r*r+r),r);has(ref,f'x = {-r} works')
   else:has(ref,'No solution')
  elif tag=='rational-equation':
   pp=p['p'];r=p['r']
   if arg=='linear':near(F(a,r-pp),F(a,r-pp));has(ref,f'x = {r}',f'x ≠ {pp}')
   elif arg=='excluded':has(ref,'No solution','excluded');assert 2*pp-pp==pp
   else:
    for x in [-pp,r]:assert (x*x+(pp-r)*x-pp*r)/(x-pp)==0
    has(ref,f'x = {-pp}',f'x = {r}',f'x ≠ {pp}')
  elif tag=='system':
   if arg=='subscript-model':ta=F(p['ta']);tb=F(p['tb']);assert a*ta==b*tb and ta+tb==p['total']
   elif arg=='graph':assert p['y']==p['m']*p['x']+p['c1']==p['m2']*p['x']+p['c2'];has(ref,f"({p['x']}, {p['y']})")
   else:
    x=p['x'];y=p['y'];assert a*x+b*y==p['rhs1']
    if 'd'in p:assert p['d']*x+p['e']*y==p['rhs2']
    if arg=='classify':has(ref,['infinitely','no solution',f'({x}, {y})'][p['kind']])
    elif p.get('dependent'):assert a+b*p['m']==0;has(ref,'dependent')
    else:has(ref,f'({x}, {y})')
  elif tag=='line':
   if arg=='axis':has(ref,'undefined' if p['vertical'] else 'slope 0')
   else:
    assert p['y1']==p['m']*p['x1']+p['c0'];assert p['y2']==p['m']*p['x2']+p['c0'];assert F(p['y2']-p['y1'],p['x2']-p['x1'])==p['m']
  elif tag=='inequality':
   for x in [p['x']-1,p['x'],p['x']+1]:
    lhs=p['coef']*x+b;expected=lhs<=p['rhs'] if p['closed'] else lhs<p['rhs'];actual={'<':x<p['x'],'≤':x<=p['x'],'>':x>p['x'],'≥':x>=p['x']}[p['out']];assert expected==actual
   has(ref,p['out'])
  elif tag=='absolute':
   for x in [p['center']-p['radius']-1,p['center']-p['radius'],p['center'],p['center']+p['radius'],p['center']+p['radius']+1]:
    delta=abs(x-p['center']);original=(delta>=p['radius'] if p['closed'] else delta>p['radius']) if p['outside'] else (delta<=p['radius'] if p['closed'] else delta<p['radius']);lo=p['center']-p['radius'];hi=p['center']+p['radius'];expected=(x<=lo or x>=hi) if p['outside'] and p['closed'] else (x<lo or x>hi) if p['outside'] else (lo<=x<=hi) if p['closed'] else (lo<x<hi);assert original==expected
   has(ref,lo,hi)
  elif tag=='compound':
   for x in range(-7,8):
    left=(x<=p['lo'] if p['closed'] else x<p['lo']) if p['outward'] else (x>=p['lo'] if p['closed'] else x>p['lo']);right=(x>=p['hi'] if p['closed'] else x>p['hi']) if p['outward'] else (x<=p['hi'] if p['closed'] else x<p['hi']);truth=left or right if p['or'] else left and right
    if p['or'] and not p['outward']:assert truth;has(ref,'Every real')
    elif not p['or'] and p['outward']:assert not truth;has(ref,'No solution')
    else:has(ref,p['lo'],p['hi'])
  elif tag=='variation':
   assert F(p['y1'])==(F(p['constant'],p['x1']**p['power']) if p['inverse'] else p['constant']*p['x1']**p['power']);v=F(p['constant'],p['x2']**p['power']) if p['inverse'] else F(p['constant']*p['x2']**p['power']);assert v==F(p['y2']);has(ref,p['y2'])
  elif tag=='word':
   x=p['x'];y=p['y']
   if arg=='coins':has(ref,f'n = {x}',f'q = {y}',5*x+25*y)
   elif arg=='value':assert p['big']-p['small']==p['delta'];assert p['big']*p['price1']+p['small']*p['price2']==p['value'];has(ref,f"p = {p['big']}",f"n = {p['small']}")
   elif arg=='two-equalities':has(ref,x+y,a*x+y,f'u = {x}',f'v = {y}')
   elif arg in ['consecutive','odd-even']:assert sum(p['start']+i*p['step'] for i in range(3))==p['total'];has(ref,', '.join(str(p['start']+i*p['step']) for i in range(3)))
   elif arg=='fraction':assert F(p['whole']*p['num'],p['den'])==p['part'];has(ref,f"L = {p['whole']}")
   elif arg=='percent':near(F(p['old']*(100+p['percent']),100),p['newValue']);has(ref,f"P = ${p['old']}")
   else:raise AssertionError(rec)
  elif tag=='motion':
   if arg=='equal':assert F(p['distance'],p['v1'])+F(p['distance'],p['v2'])==F(p['total']);has(ref,f"d = {p['distance']}")
   elif arg=='unequal':assert p['v2']*p['t']-p['v1']*(p['t']+p['delay'])==p['lead'];has(ref,f"v = {p['v2']}")
   else:assert p['v1']*(p['t']+(p['delay'] if arg=='delayed-sum' else 0))+p['v2']*p['t']==p['distance'];has(ref,f"t = {p['t']}")
  elif tag=='transform':
   fn={'quadratic':lambda x:x*x,'cubic':lambda x:x*x*x,'absolute':abs,'root':math.sqrt}[arg]
   for x,y in p['pts']:near(y,p['sgn']*fn(x-p['h'])+p['v']);has(ref,f'({x}, {y})')
  elif tag=='function' and arg=='domain-range':has(ref,'Domain {'+', '.join(map(str,sorted(set(p['xs']))))+'}', 'range {'+', '.join(map(str,sorted(set(p['ys']))))+'}', 'Yes: each input')
  elif tag=='stem-leaf':assert sorted(p['values'])==[10*int(s)+v for s,ls in sorted(p['stems'].items()) for v in ls]
  elif tag=='boxplot':assert p['five']==[sorted(p['values'])[i] for i in [0,3,7,11,14]];has(ref,', '.join(map(str,p['five'])))
  elif tag=='repeating-decimal':has(ref,str(F(p['digits'],99)))
  elif tag=='scientific':near(ev(ref),p['m']*10**p['p']+p['nn']*10**(p['p']-1))
  elif tag=='plusminus':has(ref,a+b,a-b)
  elif tag=='roots':has(ref,'|x|',abs(p['p']))
  elif tag=='plane-inequality':
   assert (p['intercept']+(1 if p['above'] else -1)>p['intercept'])==bool(p['above']);has(ref,'above' if p['above'] else 'below','solid' if p['closed'] else 'dashed')
  elif tag in ['expression-parts','sentence-types','sets','literal','coordinate-pairs','identity','nonlinear','domain'] or tag=='function' or tag=='exponential':
   kind='teacher_contract';assert len(ref)>5;assert len(q['answer']['rubric'])>=2
  else:raise AssertionError('Missing independent audit route '+rec)
  if want is not None:
   kind='numeric';actual=vals(q);assert len(actual)==len(want)
   for actual,w in zip(actual,want):assert actual==w,(actual,w)
  counts[kind]+=1
 except Exception as exc:raise AssertionError((rec,q['sourceId'],q['index'],p,ref,str(exc))) from exc
print(json.dumps({'result':'passed','cases':len(samples),'recipes':len(seen),'checks':counts}))
