"""Independent logarithm domains and clipped graphical regions."""
from pathlib import Path
from fractions import Fraction as F
import subprocess,json,math,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),C=require('./src/relations-bank-map');for(const c of C)for(let index=0;index<300;index++){const q=E.generate(c.sourceId,{seed:'independent-relations',index});if(!E.checkAnswer(q,E.answerText(q)).answerCorrect)throw Error(c.recipe);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'independent-relations',index})))throw Error('Replay');console.log(JSON.stringify({recipe:c.recipe,q,html:index<15?E.renderQuestion(q):null}));}"""
lines=subprocess.check_output(['node','-e',js],cwd=root,text=True).splitlines()
def rnd(x,k):return F(math.floor(x*10**k+.5),10**k)
def inside(x,y,poly):
 ok=False
 for i,a in enumerate(poly):
  b=poly[(i+1)%len(poly)]
  if (a[1]>y)!=(b[1]>y) and x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:ok=not ok
 return ok
svgs=checks=0;branches=set()
for line in lines:
 d=json.loads(line);r=d['recipe'];q=d['q'];p=q['givens']['parameters'];a=q['answer'];got=[F(int(v['numerator']),int(v['denominator'])) for v in a['values']];want=None
 if r=='inverse-natural-log':want=[rnd(math.exp(p['n']/10000),3)]
 elif r=='two-logarithms':want=[rnd(math.log10(p['n']),2),rnd(math.log(p['n']),2)]
 elif r=='exponential-equation':want=[rnd(math.log10(p['a'])-p['b'],2)]
 elif r in ('log-quotient-equation','log-ratio-equation'):
  if r=='log-quotient-equation':x=F(p['a']-p['b']*p['multiplier'],p['multiplier']-1);args=[x+p[k] for k in ['a','b']]
  else:x=F(p['b']*p['c']-p['a']*p['d'],p['a']+p['d']-p['b']-p['c']);args=[x+p[k] for k in ['a','b','c','d']]
  valid=min(args)>0;branches.add(r+str(valid))
  if valid:want=[x];assert args[0]/args[1]==(p['multiplier'] if r=='log-quotient-equation' else args[2]/args[3])
  else:assert a['kind']=='text' and a['text']=='no solution'
 elif r=='log-coefficient-equation':assert got[0]>0 and got[0]**p['n']==p['value']
 elif r=='log-product-equation':want=[p['a']*p['b']-p['c']];assert want[0]+p['c']>0
 elif r=='parallelogram-reason':
  s=p['choices']['ABCD'.index(a['text'])];assert ('must be' in s)==(p['k']<3);assert ['diagonals bisect','opposite sides','opposite angles','need not','need not'][p['k']] in s;branches.add('parallelogram'+str(p['k']))
 elif r=='triangle-proof':assert a['text']=='SAS; CPCTC' and q['givens']['diagram']['type']=='proof-triangle'
 elif r=='equidistant-locus':assert p['choices']['ABCD'.index(a['text'])]=='the perpendicular bisector x = 0'
 elif r=='normal-parameters':want=[p['mean'],p['sd']];assert q['givens']['diagram']['parameters']==p
 elif r=='venn-region':
  opts=q['givens']['options'];assert [i for i,o in enumerate(opts) if o['parameters']==p]==['ABCD'.index(a['text'])];assert len({json.dumps(o,sort_keys=True) for o in opts})==4;branches.add(str((p['first'],p['second'],p['operation'])))
 elif r=='inequality-system':
  opts=q['givens']['options'];correct=[]
  for i,o in enumerate(opts):
   ls=o['parameters']['lines'];assert [l['m'] for l in ls]==[p['m'],-p['m']];assert [l['b'] for l in ls]==[p['b'],p['d']];assert [l['closed'] for l in ls]==[p['lowerClosed'],p['upperClosed']]
   if [l['sense'] for l in ls]==['above','below']:correct.append(i)
  assert correct==['ABCD'.index(a['text'])];branches.add('closed'+str((p['lowerClosed'],p['upperClosed'])))
 elif r=='absolute-integers':want=[x for x in range(-20,21) if abs(x)<=p['a'] and (p['closed'] or abs(x)!=p['a'])]
 elif r=='absolute-outside':
  valid=[]
  for i,o in enumerate(q['givens']['options']):
   m=o['parameters'];assert (m['lo'],m['hi'])==(-p['a'],p['a']);ok=True
   for x in [F(n,2) for n in range(-20,21)]:
    expected=abs(x)>=p['a'] if p['closed'] else abs(x)>p['a'];represented=(x<m['lo'] or x>m['hi']) if m['outside'] else (m['lo']<x<m['hi'])
    if x==m['lo']:represented=m['leftClosed']
    if x==m['hi']:represented=m['rightClosed']
    if expected!=represented:ok=False
   if ok:valid.append(i)
  assert valid==['ABCD'.index(a['text'])]
 elif r=='copy-construction':assert p['choices']['ABCD'.index(a['text'])].startswith('set the compass to distance PQ')
 elif r=='bisector-construction':assert p['choices']['ABCD'.index(a['text'])].startswith('draw the ray from the angle vertex')
 else:raise AssertionError(r)
 if want is not None:assert got==want,(r,p,got,want)
 if d['html']:
  for i,svg in enumerate(re.findall(r'<svg.*?</svg>',d['html'],re.S)):
   el=ET.fromstring(svg);assert el.attrib.get('role')=='img';assert 'NaN' not in svg;svgs+=1
   if r=='inequality-system':
    poly=[((float(x)-150)/13,(142-float(y))/13) for x,y in (pair.split(',') for pair in el.find('.//{*}polygon').attrib['points'].split())];ls=q['givens']['options'][i]['parameters']['lines'];assert len(poly)>=3
    for x,y in poly:assert -8.00001<=x<=8.00001 and -8.00001<=y<=8.00001;assert all((y-l['m']*x-l['b'])*(1 if l['sense']=='above' else -1)>=-1e-8 for l in ls)
    for x in [n+.37 for n in range(-7,8,2)]:
     for y in [n+.13 for n in range(-7,8,2)]:assert inside(x,y,poly)==all((y-l['m']*x-l['b'])*(1 if l['sense']=='above' else -1)>0 for l in ls);checks+=1
assert all(r+str(v) in branches for r in ['log-quotient-equation','log-ratio-equation'] for v in [True,False]);assert all('parallelogram'+str(k) in branches for k in range(5));assert all('closed'+str((a,b)) in branches for a in [True,False] for b in [True,False])
print(f'PASS: {len(lines)} independent cases; {svgs} SVGs; {checks} plotted-region samples; domains, integer/real endpoints, reasoning and replay')
