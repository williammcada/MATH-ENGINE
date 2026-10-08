"""Independent mathematical/representation verification; no publisher bodies."""
from pathlib import Path
from fractions import Fraction as F
from statistics import median,multimode
import subprocess,json,math,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),C=require('./src/reasoning-bank-map');for(const c of C)for(let index=0;index<200;index++){const q=E.generate(c.sourceId,{seed:'independent-reasoning',index});if(!E.checkAnswer(q,E.answerText(q)).answerCorrect)throw Error(c.recipe);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'independent-reasoning',index})))throw Error('Replay');console.log(JSON.stringify({recipe:c.recipe,q,html:index<5?E.renderQuestion(q):null}));}"""
lines=subprocess.check_output(['node','-e',js],cwd=root,text=True).splitlines()
def rnd(x,k):return F(math.floor(x*10**k+.5),10**k)
def squarefree(n):return all(n%(d*d) for d in range(2,math.isqrt(n)+1))
svgs=0;branches=set()
for line in lines:
 d=json.loads(line);r=d['recipe'];q=d['q'];p=q['givens']['parameters'];a=q['answer'];got=[F(int(v['numerator']),int(v['denominator'])) for v in a['values']];want=None
 if r=='distribute-powers':
  A,P,Q,B,R,S=got
  for x,y in [(F(2),F(3)),(F(-2),F(4)),(F(3,2),F(-5,2))]:assert A*x**int(P)*y**int(Q)+B*x**int(R)*y**int(S)==p['a']*x**p['e']*y**p['f']*(p['b']*x**p['g']-p['c']*y**p['h'])
 elif r=='combine-radicals':want=[1+p['a']-p['c']*p['d']];assert math.isclose(float(got[0])*math.sqrt(p['b']),math.sqrt(p['b'])+math.sqrt(p['a']**2*p['b'])-p['d']*math.sqrt(p['c']**2*p['b']),abs_tol=1e-10)
 elif r=='distribute-radicals':
  assert math.isclose(float(got[0])*math.sqrt(p['b']*p['e'])+float(got[1])*math.sqrt(p['b']*p['f']),p['a']*math.sqrt(p['b'])*(p['c']*math.sqrt(p['e'])-p['d']*math.sqrt(p['f'])),abs_tol=1e-10);assert squarefree(p['b']*p['e']) and squarefree(p['b']*p['f'])
 elif r=='multiply-radicals':assert got[0]>0 and got[1]>=1;assert got[0]**2*got[1]==math.prod(p['coefficients'])**2*math.prod(p['radicands']);assert squarefree(int(got[1]))
 elif r=='rational-sum':
  for x in range(-5,6):
   if x in (0,-p['e']):continue
   assert (got[0]*x+got[1])/F(x*(x+p['e']))==F(p['a'],x)-F(p['b'],x+p['e'])+F(p['c'],x*(x+p['e']))
  assert str(-p['e']) in q['prompt']
 elif r=='real-imaginary':assert a['text']==('real' if p['n']>0 else 'imaginary');branches.add(a['text'])
 elif r=='conjugate-two-roots':assert math.isclose(float(got[0])*math.sqrt(2)+float(got[1])*math.sqrt(3),p['a']/(p['b']*math.sqrt(2)+p['c']*math.sqrt(3)),rel_tol=1e-12,abs_tol=1e-12)
 elif r=='conjugate-ratio':assert math.isclose(float(got[0])+float(got[1])*math.sqrt(p['b']),(p['a']-math.sqrt(p['b']))/(p['a']+math.sqrt(p['b'])),rel_tol=1e-12,abs_tol=1e-12)
 elif r=='common-log-power':want=[rnd(math.log10(p['n']),4)]
 elif r in ('natural-log-power','natural-log'):want=[rnd(math.log(p['n']),4)]
 elif r=='exponential-decay':
  rate=math.log(F(p['after'],p['start']))/p['minutes'];t=math.log(F(p['target'],p['start']))/rate;want=[rnd(t,2)];assert t>p['minutes'];assert math.isclose(p['start']*math.exp(rate*t),p['target'])
 elif r=='half-life':want=[rnd(math.log(F(100-p['percent'],100),.5)*p['half'],0)]
 elif r=='log-product':want=[p['a']];assert p['base']>1
 elif r=='log-power':want=[p['n']];assert p['base']>1
 elif r=='commutative':want=[p['nums'][1],p['nums'][0]]
 elif r=='associative':want=p['nums'][1:]
 elif r=='similar-truth':assert a['text']==str(p['k'] in [0,3,4]).lower();branches.add('similar'+str(p['k']))
 elif r=='missing-information':assert p['options']['ABCD'.index(a['text'])]=='the number of hours Lee worked'
 elif r.startswith('stem-'):
  data=sorted(p['data'])
  if r=='stem-build':assert [10*s+int(v) for s,row in zip(range(2,6),a['text'].split(';')) for v in row.split()]==data
  else:
   rows=q['givens']['table']['rows'];decoded=[10*int(stem)+int(v) for stem,row in rows for v in row.split()];assert decoded==data
   if r=='stem-read':want=data
   else:assert len(multimode(data))==1;want=[median(data),multimode(data)[0],max(data)-min(data)]
 elif r.startswith('box-'):
  data=sorted(p['data']);s=[data[0],median(data[:4]),median(data),median(data[5:]),data[-1]]
  if r=='box-choice':opts=q['givens']['options'];assert [i for i,o in enumerate(opts) if o['parameters']['summary']==s]==['ABCD'.index(a['text'])];assert len({tuple(o['parameters']['summary']) for o in opts})==4
  else:
   assert q['givens']['diagram']['parameters']['summary']==s
   want=[s[-1]-s[0],s[3]-s[1]] if r=='box-range' else [s[0],s[4],s[1],s[3],s[2]]
 elif r=='distribute-linear':
  for x in [-3,0,2]:assert got[0]*x+got[1]==p['a']+p['b']*(p['c']+x)+p['d']*x
 elif r=='calendar-month':assert a['text']=='January February March April May June July August September October November December'.split()[p['i']+1]
 else:raise AssertionError(r)
 if want is not None:assert got==want,(r,p,got,want)
 if d['html']:
  for svg in re.findall(r'<svg.*?</svg>',d['html'],re.S):el=ET.fromstring(svg);assert el.attrib.get('role')=='img';assert 'NaN' not in svg;svgs+=1
assert {'real','imaginary',*['similar'+str(i) for i in range(6)]}<=branches
print(f'PASS: {len(lines)} independent cases; {svgs} parsed SVGs; radical identities, domains, logarithms/rounding, statistical conventions, reasoning branches and replay')
