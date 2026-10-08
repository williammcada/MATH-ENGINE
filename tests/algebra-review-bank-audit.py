"""Independent complex-root, polar, inequality and symbolic-substitution audit."""
from pathlib import Path
from fractions import Fraction as F
import subprocess,json,math,ast,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),C=require('./src/algebra-review-bank-map');for(const c of C)for(let index=0;index<300;index++){const q=E.generate(c.sourceId,{seed:'independent-algebra-review',index});if(!E.checkAnswer(q,E.answerText(q)).answerCorrect)throw Error(c.recipe);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'independent-algebra-review',index})))throw Error('Replay');console.log(JSON.stringify({recipe:c.recipe,q,html:index<10?E.renderQuestion(q):null}));}"""
lines=subprocess.check_output(['node','-e',js],cwd=root,text=True).splitlines()
def rounded(v):return F(math.floor(v*100+.5),100)
def squarefree(n):return all(n%(k*k) for k in range(2,math.isqrt(n)+1))
def calculate(s,env):
 def run(n):
  if isinstance(n,ast.Expression):return run(n.body)
  if isinstance(n,ast.Name):return env[n.id]
  if isinstance(n,ast.Constant) and type(n.value)==int:return F(n.value)
  if isinstance(n,ast.UnaryOp) and isinstance(n.op,(ast.USub,ast.UAdd)):return -run(n.operand) if isinstance(n.op,ast.USub) else run(n.operand)
  if isinstance(n,ast.BinOp):
   a,b=run(n.left),run(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  raise AssertionError(type(n))
 return run(ast.parse(s,mode='eval'))
svgs=substitutions=0;branches=set()
for line in lines:
 d=json.loads(line);r=d['recipe'];q=d['q'];p=q['givens']['parameters'];a=q['answer'];got=[F(int(v['numerator']),int(v['denominator'])) for v in a['values']];want=None
 if r=='complex-quadratic':
  u,v,w=got;assert v>0 and w.denominator==1 and squarefree(int(w));assert 2*p['a']*u+p['b']==0;assert p['a']*(u*u-v*v*w)+p['b']*u+p['c']==0;assert p['b']**2-4*p['a']*p['c']<0
 elif r=='polar-rectangular':want=[rounded(p['radius']*math.cos(math.radians(p['angle']))),rounded(p['radius']*math.sin(math.radians(p['angle'])))]
 elif r=='rectangular-polar':want=[rounded(abs(complex(p['x'],p['y']))),rounded(math.degrees(math.atan2(p['y'],p['x']))%360)];branches.add((p['x']>0,p['y']>0))
 elif r=='force-resultant':
  z=p['a']*complex(math.cos(math.radians(p['left'])),math.sin(math.radians(p['left'])))+p['b']*complex(math.cos(math.radians(p['right'])),math.sin(math.radians(p['right'])));want=[rounded(abs(z)),rounded(math.degrees(math.atan2(z.imag,z.real))%360)]
 elif r=='complex-conjugates':want=[(complex(p['a'],p['b'])*complex(p['a'],-p['b'])).real]
 elif r in ['compound-and','compound-or']:
  valid=[]
  for i,o in enumerate(q['givens']['options']):
   m=o['parameters'];ok=True
   for x in [F(n,2) for n in range(-20,21)]:
    if r=='compound-and':expected=(x+p['shift']>=p['lo']+p['shift'] if p['leftClosed'] else x+p['shift']>p['lo']+p['shift']) and (x+p['shift']<=p['hi']+p['shift'] if p['rightClosed'] else x+p['shift']<p['hi']+p['shift'])
    else:expected=(-x>=-p['lo'] if p['leftClosed'] else -x>-p['lo']) or (-x<=-p['hi'] if p['rightClosed'] else -x<-p['hi'])
    represented=(x<m['lo'] or x>m['hi']) if m['outside'] else m['lo']<x<m['hi']
    if x==m['lo']:represented=m['leftClosed']
    if x==m['hi']:represented=m['rightClosed']
    if represented!=expected:ok=False
   if ok:valid.append(i)
  assert valid==['ABCD'.index(a['text'])]
 elif r=='absolute-impossible':assert a['text']=='no solution' and p['a']>0
 elif r=='rational-classify':assert a['text']==('rational' if math.isqrt(p['value'])**2==p['value'] else 'irrational')
 elif r=='set-builder-graph':
  m=q['givens']['options']['ABCD'.index(a['text'])]['parameters'];assert m['boundary']==p['boundary'] and m['closed']==p['closed'] and m['direction']==('right' if p['right'] else 'left')
 elif r=='point-distance':assert got[0]>0 and squarefree(int(got[1]));assert got[0]**2*got[1]==(p['x2']-p['x1'])**2+(p['y2']-p['y1'])**2
 elif r in ['complex-fraction','literal-denominator','literal-formula','nested-literal']:
  matches=[]
  for i,expr in enumerate(p['choices']):
   ok=True;count=0
   for j in range(1,9):
    env={n:F(j*k+2,k+1) for k,n in enumerate('abcxyzmpqrs',start=1)}
    try:
     value=calculate(expr,env);e=dict(env);e[p['target']]=value
     if r=='complex-fraction':res=[env['a']/env['c']/(1/(env['a']+env['b'])),(1/(env['a']+env['b']))/(1/env['c']),(env['a']+env['b'])/(1/env['c'])][p['k']]-value
     elif r=='literal-denominator':res=e['a']/e['b']-p['n']*e['x']/e['d']-1/e['c']-e['y']
     elif r=='literal-formula':res=e['a']*e['x']/e['b']+p['s']*e['m']/e['c']-e['y']
     else:res=p['a']*e['s']-F(p['b'],p['c'])/e['p']*(p['d']*e['z']/e['t']-p['e']*e['q']/e['r'])
     count+=1;substitutions+=1
     if res:ok=False
    except ZeroDivisionError:continue
   assert count>=5
   if ok:matches.append(i)
  assert matches==['ABCD'.index(a['text'])],(r,p,matches,a['text'])
 elif r=='protractor-read':want=[abs(p['angle']-p['baseline'])];branches.add('baseline'+str(p['baseline']))
 else:raise AssertionError(r)
 if want is not None:assert got==want,(r,p,got,want)
 if d['html']:
  for svg in re.findall(r'<svg.*?</svg>',d['html'],re.S):
   el=ET.fromstring(svg);assert el.attrib.get('role')=='img';assert 'NaN' not in svg;svgs+=1
   if r=='protractor-read':
    rays=[l for l in el.findall('.//{*}line') if l.attrib.get('stroke')=='#007569'];angles=[round(math.degrees(math.atan2(225-float(l.attrib['y2']),float(l.attrib['x2'])-200))) for l in rays];assert angles==[p['baseline'],p['angle']];assert str(abs(p['angle']-p['baseline'])) not in [t.text for t in el.findall('.//{*}text')]
assert {'baseline0','baseline180',(False,False),(False,True),(True,False),(True,True)}<=branches
print(f'PASS: {len(lines)} independent cases; {svgs} SVGs; {substitutions} rational symbolic substitutions; complex roots, polar quadrants, interval endpoints and protractor rays')
