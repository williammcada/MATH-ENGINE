"""Independent oracles for advanced source-informed tasks."""
import subprocess,json,pathlib,math,re,xml.etree.ElementTree as ET
from fractions import Fraction as F
root=pathlib.Path(__file__).resolve().parents[1]
def rat(v):return F(int(v['numerator']),int(v['denominator']))
def rounding(x,d=2):return F(math.floor(x*10**d+F(1,2)),10**d)
def mul(a,b):
 out=[0]*(len(a)+len(b)-1)
 for i,x in enumerate(a):
  for j,y in enumerate(b):out[i+j]+=x*y
 return out
script="""const E=require('./src/course-banks'),C=require('./src/advanced-bank-map');for(const c of C)for(let i=0;i<300;i++){const q=E.generate(c.sourceId,{seed:'advanced-oracle',index:i}),a=E.answerText(q);if(!E.checkAnswer(q,a).answerCorrect||E.checkAnswer(q,'').answerCorrect||E.checkAnswer(q,'nonsense').answerCorrect)throw Error(c.recipe);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'advanced-oracle',index:i})))throw Error('Replay');console.log(JSON.stringify({recipe:c.recipe,q,html:i%60===0?E.renderQuestion(q):null}));}"""
proc=subprocess.Popen(['node','-e',script],cwd=root,text=True,stdout=subprocess.PIPE);count=0;svgcount=0;types=set();branches=set()
for line in proc.stdout:
 row=json.loads(line);r=row['recipe'];q=row['q'];p=q['givens']['parameters'];v=[rat(x) for x in q['answer']['values']];expected=None;types.add(r)
 if r=='sphere-volume':expected=[rounding(F(4,3)*F(157,50)*p['radius']**3)]
 elif r=='cylinder-surface':expected=[F(157,50)*(2*p['radius']**2+2*p['radius']*p['height'])]
 elif r in ['arc-length','sector-area']:expected=[rounding(F(p['angle'],360)*F(157,50)*(2*p['radius'] if r=='arc-length' else p['radius']**2))]
 elif r=='exponent-product':expected=[sum(xs) for xs in p['exps']]
 elif r=='exponent-quotient':
  diffs=[(a-b)*p['outer'] for a,b in zip(p['top'],p['bottom'])];expected=[max(0,n) for n in diffs]+[max(0,-n) for n in diffs]
  for i in range(3):assert min(v[i],v[i+3])==0
 elif r=='polynomial-product':expected=mul(p['first'],p['second'])
 elif r=='rationalize':expected=[F(p['a'],p['c']*p['b'])];assert abs(float(v[0])*math.sqrt(p['b'])-p['a']/(p['c']*math.sqrt(p['b'])))<1e-12
 elif r=='root-quotient':expected=[F(math.isqrt(p['numerator']),math.isqrt(p['denominator']))];assert v[0]**2==F(p['numerator'],p['denominator']) and v[0]>0
 elif r=='fractional-power':
  a=next(i for i in range(-6,0) if i**p['den']==p['base']);expected=[a**p['num']]
 elif r=='rational-product':
  for x in [-11,-10,1,2,3,10]:
   original=F(x*x,x+p['a'])*F(x*x+(p['a']+p['b'])*x+p['a']*p['b'],x*x+p['c']*x)
   assert original==(x*x+v[0]*x)/(x+v[1])
  assert v==[p['b'],p['c']]
 elif r=='rational-division':
  for x in [-11,-10,1,2,3,10]:
   den=(x+p['b'])*(x+p['c']);original=F((x+p['a'])*(x+p['d']),den)/F((x+p['a'])*(x+p['e']),den)
   assert original==(x+v[0])/(x+v[1])
  assert v==[p['d'],p['e']]
 elif r=='factor-cubes':assert mul(v[:2],v[2:])==[p['a']**3,0,0,p['b']**3]
 elif r=='fractional-exponent-expansion':expected=[p['a']**p['ex'],F(p['ex'],p['den1']),F(p['ex'],p['den2']),p['ex']]
 elif r=='inverse-trig':
  f={'sine':math.asin,'cosine':math.acos,'tangent':math.atan}[p['type']];expected=[rounding(f(p['value'])*180/math.pi,1)]
 elif r in ['vector-polar','negative-vector']:
  v1=complex(math.cos(math.radians(-p['t1'] if p['negative'] else p['t1'])),math.sin(math.radians(-p['t1'] if p['negative'] else p['t1'])))*p['r1']*(-1 if p['negative'] else 1)
  v2=complex(math.cos(math.radians(p['t2'])),math.sin(math.radians(p['t2'])))*p['r2'];z=v1+v2
  expected=[rounding(z.real),rounding(z.imag)] if p['negative'] else [rounding(abs(z)),rounding(math.degrees(math.atan2(z.imag,z.real))%360)]
 elif r=='circle-line-system':
  assert len(v)==4 and v[0]<v[2]
  for x,y in [v[:2],v[2:]]:assert x*x+y*y==p['radius2'] and x+p['c']*y==p['k']
  # A quadratic resulting from line substitution has degree two: two distinct roots exhaust the solutions.
  assert (1+p['c']**2)>0
 elif r=='parabola-choice':
  h,k=v;assert -2*h==p['linear'] and h*h+k==p['constant'];matches=[i for i,x in enumerate(q['givens']['options']) if x['parameters']=={'a':1,'h':h,'k':k}];assert len(matches)==1 and q['answer']['text']=='ABCD'[matches[0]]
 elif r in ['quadratic-positive','quadratic-negative','rational-inequality']:
  matches=[]
  for i,option in enumerate(q['givens']['options']):
   m=option['parameters'];ok=True
   for x in [F(j,4) for j in range(-48,49)]:
    lower=x>=m['lo'] if m['leftClosed'] else x>m['lo'];upper=x<=m['hi'] if m['rightClosed'] else x<m['hi'];represented=(x<=m['lo'] if m['leftClosed'] else x<m['lo']) or (x>=m['hi'] if m['rightClosed'] else x>m['hi']) if m['outside'] else lower and upper
    if r=='rational-inequality':actual=False if x+p['b']==0 else (F(1)<=p['a']/(x+p['b']) if p['inclusive'] else F(1)<p['a']/(x+p['b']))
    else:val=x*x+p['linear']*x+p['constant'];actual=val>0 if p['positive'] else val<0
    if represented!=actual:ok=False;break
   if ok:matches.append(i)
  assert len(matches)==1 and q['answer']['text']=='ABCD'[matches[0]]
  if r=='rational-inequality':branches.add((p['a']>0,p['inclusive']))
 elif r=='logarithm-quotient':expected=[F(p['a'],p['b'])];assert p['base']>1 and v[0]>0
 else:raise AssertionError(r)
 if expected is not None:assert v==expected,(r,p,v,expected)
 if row['html']:
  for svg in re.findall(r'<svg.*?</svg>',row['html']):ET.fromstring(svg);svgcount+=1
 count+=1
assert proc.wait()==0 and count==6900 and len(types)==23 and len(branches)==4
print(f'PASS: {count} independent advanced cases, {len(types)} recipes, {svgcount} parsed SVGs, all rational-inequality sign/inclusion branches, replay and answer checks')
