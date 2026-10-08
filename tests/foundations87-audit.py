"""Independent exact math and representation checks for the authored L1–6 contracts."""
from pathlib import Path
from fractions import Fraction as F
import subprocess,json,ast,re,math,xml.etree.ElementTree as ET
E=Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),C=require('./src/foundations87-map');for(const c of C)for(let index=0;index<180;index++){const q=E.generate(c.sourceId,{seed:'foundations-independent',index});if(!E.checkAnswer(q,E.answerText(q)).answerCorrect)throw Error(c.recipe);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'foundations-independent',index})))throw Error('Replay');console.log(JSON.stringify({q,answer:E.answerText(q),html:q.givens.diagram?E.renderQuestion(q):null}));}"""
lines=subprocess.check_output(['node','-e',js],cwd=E,text=True).splitlines()
def frac(a):return F(int(a['numerator']),int(a['denominator']))
def calc(s):
 def rec(n):
  if isinstance(n,ast.Expression):return rec(n.body)
  if isinstance(n,ast.Constant) and type(n.value)==int:return F(n.value)
  if isinstance(n,ast.BinOp):
   a,b=rec(n.left),rec(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  raise AssertionError(type(n))
 return rec(ast.parse(s,mode='eval'))
units=dict(zip('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(),range(20)))
units.update(dict(zip('twenty thirty forty fifty sixty seventy eighty ninety'.split(),range(20,100,10))))
def read_words(s):
 total=group=0;last_scale=10**15
 for w in s.replace('-',' ').split():
  if w in units:group+=units[w]
  elif w=='hundred':group*=100
  else:
   scale={'thousand':10**3,'million':10**6,'billion':10**9,'trillion':10**12}[w]
   assert scale<last_scale;last_scale=scale;total+=group*scale;group=0
 return total+group
seen={};svg_count=0
for line in lines:
 d=json.loads(line);q=d['q'];r=q['givens']['recipe'];p=q['givens']['parameters'];a=q['answer'];got=[frac(x) for x in a.get('values',[]) if isinstance(x,dict)];want=None;seen.setdefault(r,set())
 if r=='1.1':assert a['value']=='; '.join(['yes' if p['n']>0 and p['n']==int(p['n']) else 'no','yes' if p['n']>=0 and p['n']==int(p['n']) else 'no']);seen[r].add(q['index']%4)
 elif r in ['1.2','1.3']:
  k=p['operation'];assert [p['x']+p['y'],p['x']-p['y'],p['x']*p['y'],F(p['x'],p['y'])][k]==p['z']
  expected=['addition','subtraction','multiplication','division'][k] if r=='1.2' else [['addend','addend','sum'],['minuend','subtrahend','difference'],['factor','factor','product'],['dividend','divisor','quotient']][k][p['position']]
  assert a['value']==expected;seen[r].add((k,p['position']) if r=='1.3' else k)
 elif r=='1.4':assert (F(d['answer'][1:])*100 if p['toDollars'] else int(d['answer'][:-1]))==p['cents'];seen[r].add(p['toDollars'])
 elif r=='1.5':want=[[F(p['x']*p['y']+p['z'])],[F(p['x']+p['y'],p['z'])],[F(p['x']*(p['y']-p['z']))]][p['form']];seen[r].add(p['form'])
 elif r=='1.6':want=[frac(p['a'])*frac(p['b'])];seen[r].add(p['decimal'])
 elif r=='1.7':want=[frac(p['dividend'])/p['divisor']];assert frac(p['dividend']).denominator>1
 elif r=='1.8':
  quotient,remainder=divmod(p['dividend'],p['divisor']);assert (a['quotient'],a['remainder'])==(quotient,remainder)
  if a['kind']=='mixed-division':w,f=d['answer'].split();n,de=map(int,f.split('/'));assert math.gcd(n,de)==1 and int(w)+F(n,de)==F(p['dividend'],p['divisor'])
  seen[r].add(a['kind'])
 elif r in ['2.1','2.2','2.4','2.5']:
  assert len({p['a'],p['b'],p['c']})==3
  if r=='2.1':assert a['value']==['commutative','associative','distributive','additive identity','multiplicative identity','zero multiplication'][p['k']]
  else:
   for eq in [a['value']]+a['alternatives']:
    left,right=eq.split('=');assert calc(left)==calc(right)
  seen[r].add((p['k'],p['which']))
 elif r=='2.3':assert all(y-x==p['step'] for x,y in zip(p['terms'],p['terms'][1:]));want=[F(p['step'])]+[F(p['terms'][-1]+i*p['step']) for i in [1,2,3]]
 elif r=='2.6':
  x,y,z=map(F,[p['a'],p['b'],p['c']]);f=(lambda x,y:x/y) if p['division'] else (lambda x,y:x-y)
  want=[f(f(x,y),z),f(x,f(y,z))] if p['associative'] else [f(x,y),f(y,x)]
  assert want[0]!=want[1];seen[r].add((p['division'],p['associative']))
 elif r.startswith('3.'):
  k=p['operation'];x,y,z=p['x'],p['y'],p['z'];assert [x+y,x-y,x*y,F(x,y)][k]==z
  want=[F(x if p['left'] else y)];seen[r].add((k,p['left']))
 elif r=='4.1':assert a['values']==sorted(p['points']) and a['symbol']==('<' if p['points'][0]<p['points'][1] else '>')
 elif r=='4.2':assert a['value']==('<' if p['a']<p['b'] else '>' if p['a']>p['b'] else '=');seen[r].add(a['value'])
 elif r=='4.3':want=[F(p['start']+(-p['amount'] if p['subtract'] else p['amount']))];assert q['givens']['diagram']['end']==want[0];seen[r].add((p['subtract'],p['amount']>0))
 elif r.startswith('5.'):
  n=p['n'];assert 0<=n<=999999999999999 and ''.join(p['digits'])==str(n);power=len(str(n))-p['position']-1;assert p['power']==power;seen[r].add(len(str(n)))
  if r=='5.1':assert a['value']==['ones','tens','hundreds','thousands','ten thousands','hundred thousands','millions','ten millions','hundred millions','billions','ten billions','hundred billions','trillions','ten trillions','hundred trillions'][power]
  elif r=='5.2':assert sum(a['values'])==n;assert a['values']==sorted(a['values'],reverse=True);assert all(len(str(v).rstrip('0'))==1 or v==0 for v in a['values']);assert len(a['values'])==max(1,sum(x!='0' for x in str(n)))
  elif r=='5.3':assert read_words(a['value'])==n
  elif r=='5.4':assert read_words(q['prompt'].split(': ',1)[1].split('.')[0])==a['value']==n
  else:want=[F(int(str(n)[p['position']])*10**power)]
 elif r=='6.1':assert a['values']==[i for i in range(1,p['n']+1) if p['n']%i==0];seen[r].add('one' if p['n']==1 else 'prime' if len(a['values'])==2 else 'composite')
 elif r=='6.2':want=[F(math.gcd(p['a'],p['b']))]
 elif r=='6.3':
  n,v=p['n'],p['divisor'];digits=list(map(int,str(n)));expected=[digits[-1],sum(digits)] if v==6 else [sum(digits)] if v in [3,9] else [int(str(n)[-2:])] if v==4 else [int(str(n)[-3:])] if v==8 else [digits[-1]]
  assert a['tests']==expected and a['divisible']==(n%v==0);seen[r].add((v,a['divisible']))
 else:raise AssertionError(r)
 if want is not None:assert got==want,(r,got,want)
 if d['html']:
  root=ET.fromstring(d['html']);svg=root.find('svg');assert svg is not None;svg_count+=1;dia=q['givens']['diagram'];circles=svg.findall('circle');x=lambda n:30+(n+10)*16
  if dia['kind']=='points':assert [float(c.attrib['cx']) for c in circles]==[x(n) for n in p['points']]
  else:
   assert float(circles[0].attrib['cx'])==x(p['start']);arr=[l for l in svg.findall('line') if l.attrib.get('stroke-width')=='3'][0];assert float(arr.attrib['x1'])==x(p['start']) and float(arr.attrib['x2'])==x(int(want[0]))
assert len(seen)==30
for r,count in {'1.1':4,'1.2':4,'1.3':12,'1.4':2,'1.5':3,'1.6':2,'1.8':2,'2.1':12,'2.2':12,'2.4':2,'2.5':2,'2.6':4,'3.1':8,'3.2':2,'3.3':2,'3.4':2,'3.5':2,'4.2':3,'4.3':4,'5.1':15,'5.2':15,'5.3':15,'5.4':15,'5.5':15,'6.1':3,'6.3':16}.items():assert len(seen[r])==count,(r,seen[r])
print(f'PASS: {len(lines)} independent cases, {svg_count} parsed number-line SVGs, every operation/property/divisibility branch and all 15 whole-number lengths.')
