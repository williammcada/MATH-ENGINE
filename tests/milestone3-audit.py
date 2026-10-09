"""Independent exact arithmetic and semantic oracles for new Algebra 1/2 recipes."""
from fractions import Fraction as F
from decimal import Decimal, localcontext, ROUND_HALF_UP
import json, math, os
samples=json.load(open(os.environ.get('M3_SAMPLES','/tmp/m3-samples.json')))
counts={'numeric':0,'symbolic_or_teacher_math':0,'teacher_contract':0,'text':0}; seen=set()
def fmt(x):
 x=F(x);return str(x.numerator) if x.denominator==1 else f'{x.numerator}/{x.denominator}'
def poly(ts):
 groups={}
 for t in ts:
  key=tuple((v or 0) for v in (list(t[1:])+[0]*(4-len(t))));groups[key]=groups.get(key,0)+t[0]
 ts=[[v,*k] for k,v in groups.items() if v];out=''
 for a,x,y,z in ts:
  out+=(('− ' if a<0 else '+ ') if out else ('−' if a<0 else ''))+str(abs(a))
  out+=''.join(v+('^'+str(p) if p!=1 else '') for v,p in zip('xyz',[x,y,z]) if p)
  out+=' '
 return out.strip() or '0'
def peval(ts,x,y,z):return sum(F(t[0])*x**(t[1] if len(t)>1 else 0)*y**(t[2] if len(t)>2 else 0)*z**((t[3] or 0) if len(t)>3 else 0) for t in ts)
def binary(s):
 a,_,b=s.partition('.');return F(int(a,2))+sum((F(int(v),2**(i+1)) for i,v in enumerate(b)),F(0))
for row in samples:
 recipe=row['recipe'];q=row['q'];p=q['givens']['parameters'];a=q['answer'];tag=recipe.split(':')[0];arg=recipe.split(':')[1:] or [''];seen.add(recipe);want=None;checked=False
 if tag=='decimal-estimate':want=[((p['a']+5)//10)*((p['b']+5)//10)]
 elif tag=='fraction-power':want=[F(p['numerator'],p['denominator'])**p['power']]
 elif tag=='variable-power-root':want=[p['base'],2*p['base']**p['exponent']]
 elif tag=='mixed-part':want=[F(p['whole']) if p['findWhole'] else F(p['coefficient'])*F(p['whole'])]
 elif tag=='distance-multi':want=[F(p['distance'],p['time']),p['newtime'],p['rate']*(p['newtime']+1)]
 elif tag=='rate-change':want=[[p['rate']*p['factor']*p['newtime'],p['newtime'],p['rate']*(p['factor']-1)][p['mode']]]
 elif tag=='inclusion-division':want=[F(p['a']*p['b']*p['d'],p['a']*(p['b']+p['d']-p['d']))]
 elif tag=='root-operations':want=[p['a']+p['b']**2*p['d']]
 elif tag=='power-roots':want=[p['base']**p['power'],p['base']]
 elif tag in ('fraction-order','fraction-bar'):
  x,y,z=map(F,p['values']);want=[(x+y)/z if tag=='fraction-bar' else (x+y)*z]
 elif tag in ('fraction-equation','mixed-equation'):want=[F(p['rhs'])/F(p['coefficient'])]
 elif tag=='decimal-part':want=[F(p['hundredths']*p['whole'],100)]
 elif tag=='reference-number':want=[min([F(0),F(1,2),F(1)],key=lambda x:abs(F(p['value'])-x))]
 elif tag=='distance':want=[p['r1']*p['t1']]
 elif tag=='changing-rate':
  total=p['r1']*p['t1']+p['r2']*p['t2'];want=[total,F(total,p['t1']+p['t2'])]
 elif tag in ('fraction-proportion','mixed-proportion'):want=[F(p['a'])*F(p['d'])/F(p['b'])]
 elif tag in ('percent-over100','fraction-percent'):want=[F(p['percent'])*p['whole']/100]
 elif tag=='opposites':want=[-p['a'],p['a']]
 elif tag in ('both-sides','multi-term'):want=[F(p['rhs']-p['d'],p['a']-p['b'])]
 elif tag=='angle-measure':want=[p['angle']]
 elif tag=='signed-power':want=[(-p['a'])**p['b'],-(p['a']**p['b'])]
 elif tag=='ratio-transfer':want=[F(p['a']*p['unit']+p['move'],p['b']*p['unit']-p['move'])]
 elif tag=='negative-root':
  if p['odd']:want=[-p['a']]
  else:assert a['value']=='no';checked=True
 elif tag=='markup':want=[F(p['cost']*p['rate'],100),F(p['cost']*(100+p['rate']),100)]
 elif tag=='commission':want=[F(p['cost']*p['rate'],100)]
 elif tag=='profit':want=[p['revenue']-p['cost']]
 elif tag=='english-volume':want=[p['cubicFeet']*12**3]
 elif tag=='metric-cube':want=[F(p['cm3'],100**3),F(p['cm3'],1000)]
 elif tag=='pyramid-area':want=[p['radius']**2+4*F(p['radius']*p['slant'],2)]
 elif tag=='cone-area':want=[F(314,100)*(p['radius']**2+p['radius']*p['slant'])]
 elif tag=='permutation':want=[math.factorial(p['total'])//math.factorial(p['total']-p['places'])]
 elif tag=='histogram-read':want=[sum(60<=v<=79 for v in p['data'])]
 elif tag=='slope-graph':want=[F(p['end'][1]-p['start'][1],p['end'][0]-p['start'][0])]
 elif tag=='slope-equation':want=[F(-p['a'],p['b'])]
 elif tag=='trig-ratio':
  assert p['adjacent']**2+p['opposite']**2==p['hypotenuse']**2;want=[F(p['opposite'],p['hypotenuse']),F(p['adjacent'],p['hypotenuse']),F(p['opposite'],p['adjacent'])]
 elif tag=='trig-table':
  true=getattr(math,p['fn'])(math.radians(p['angle']));assert abs(float(p['tableValue'])-true)<=0.00005001
  want=[p['angle'] if p['inverse'] else F(p['tableValue'])]
 elif tag=='trig-application':
  values={fn:F(f'{getattr(math,fn)(math.radians(p["angle"])):.4f}') for fn in ['sin','cos','tan']}
  length=F(p['length']);raw=[length*values['tan']] if p['mode']=='height' else [length/values['cos']] if p['mode']=='ladder' else [length*values['sin'],length*values['cos']]
  places=0 if p['mode']=='height' else 2;scale=10**places
  want=[F((v*scale+F(1,2)).numerator//(v*scale+F(1,2)).denominator,scale) for v in raw]
 elif tag=='binary':
  if arg[0]=='read':want=[F(p['a'],2**p['bits'])]
  elif arg[0]=='write':assert binary(a['value'])==F(p['a'],2**p['bits']);checked=True
  else:
   value=F(p['a']*p['b'],2**(2*p['bits'])) if p['mul'] else F(p['a']+p['b']+p['d'],2**p['bits']);assert value==F(p['result'])==binary(p['binary']);assert a['reference'].startswith(p['binary']+' (base 2)');checked=True
 elif tag=='polynomial':
  # Polynomial identities at multiple nonzero signed rational points, independent of generation coefficients.
  for xx,yy,zz in [(F(2),F(-3),F(5)),(F(-2),F(3,2),F(-1)),(F(7,3),F(2),F(-4))]:
   l,r,v=(peval(p[k],xx,yy,zz) for k in ['left','right','result']);assert v==({'add':lambda:l+r,'mul':lambda:l*r,'divide':lambda:l/r}[p['operation']]())
  assert a['reference'].startswith(poly(p['result']));
  if p['operation']=='divide':assert 'x ≠ 0' in a['reference'] and ('y ≠ 0' in a['reference'])==p['multi']
  checked=True
 elif tag=='root-approx':
  with localcontext() as ctx:
   ctx.prec=50;v=Decimal(p['radicand'])**(Decimal(1)/p['degree']);rounded=v.quantize(Decimal(10)**(-p['places']),rounding=ROUND_HALF_UP)
   assert a['reference'].startswith(f'{rounded:.{p["places"]}f}.');assert Decimal(str(p['low']))**p['degree']<p['radicand']<Decimal(str(p['high']))**p['degree']
  checked=True
 elif tag=='parabola':
  coeff=F(p['coefficient']);assert all(F(y)==coeff*x*x+p['shift'] for x,y in p['pts']);assert ('down' if coeff<0 else 'up') in a['reference'];checked=True
 elif tag=='transform-quad':
  for (x,y),out in zip(p['points'],p['out']):assert out==[[x+p['dx'],y+p['dy']],[y,x],[-y,x],[-x,-y]][p['kind']]
  checked=True
 elif tag=='histogram10':assert p['counts']==[sum(lo<=v<lo+10 for v in p['data']) for lo in [50,60,70,80]];checked=True
 elif tag=='fraction-product':assert fmt(math.prod(map(F,p['values'])))==a['reference'];checked=True
 elif tag=='equality-method':assert p['a']*p['x']+p['b']==p['rhs'] and f'x = {p["x"]}.' in a['reference'];checked=True
 elif tag=='circle-angles':assert a['reference'].startswith(f'{p["central"]}°; {p["central"]//2}°.');checked=True
 elif tag=='like-terms':assert a['reference']==poly([[p['a']+p['d'],2],[p['b']+p['e'],1]]);checked=True
 elif tag=='volume-multipliers':assert p['factor']==[12**3,36**3,(5280*12)**3][p['mode']];checked=True
 elif tag=='trichotomy':assert a['value']==('<' if p['a']<p['b'] else '>' if p['a']>p['b'] else '=');checked=True
 elif tag=='negation':assert p['negated']=={'<':'≥','≤':'>','>':'≤','≥':'<','=':'≠','≠':'='}[p['symbol']];checked=True
 if want is not None:
  got=[F(int(x['numerator']),int(x['denominator'])) for x in a['values']];assert got==list(map(F,want)),(recipe,p,got,want);counts['numeric']+=1
 elif a['kind']=='teacher':
  assert len(a['rubric'])>=2 and a['reference'];counts['symbolic_or_teacher_math' if checked else 'teacher_contract']+=1
 else:assert checked or tag=='construction-tools';counts['text']+=1
print(json.dumps({'result':'passed','cases':len(samples),'recipes':len(seen),**counts}))
