"""Exact geometry, scale and representation checks independent of production formulas."""
from pathlib import Path
from fractions import Fraction as F
import subprocess,json,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),C=require('./src/solids-bank-map');for(const c of C)for(let index=0;index<300;index++){const q=E.generate(c.sourceId,{seed:'independent-solids',index});if(!E.checkAnswer(q,E.answerText(q)).answerCorrect)throw Error(c.recipe);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'independent-solids',index})))throw Error('Replay');console.log(JSON.stringify({recipe:c.recipe,q,html:index<10?E.renderQuestion(q):null}));}"""
lines=subprocess.check_output(['node','-e',js],cwd=root,text=True).splitlines()
def rounded(v):return F((v*100+F(1,2)).numerator//(v*100+F(1,2)).denominator,100)
def binary(s):
 a,_,b=s.partition('.');return sum(int(v)*2**i for i,v in enumerate(a[::-1]))+sum(F(int(v),2**(i+1)) for i,v in enumerate(b))
svgs=0;seen=set()
for line in lines:
 d=json.loads(line);r=d['recipe'];q=d['q'];p=q['givens']['parameters'];a=q['answer'];got=[F(int(v['numerator']),int(v['denominator'])) for v in a['values']];want=None
 if r in ['solid-volume','pyramid-volume','cone-volume']:
  shape=p['shape'];seen.add(shape)
  if shape=='pyramid':want=[F(p['width']*p['length']*p['height'],3)]
  elif shape=='cone':want=[rounded(F(314,100)*p['radius']**2*p['height']/3)]
  else:want=[rounded(F(4,3)*F(314,100)*p['radius']**3)]
  if shape!='sphere':assert q['givens']['diagram']['parameters']['mode']=='height' and q['givens']['diagram']['parameters']['measure']==p['height']
 elif r=='sphere-surface':want=[4*F(314,100)*p['radius']**2]
 elif r=='pyramid-surface':want=[p['side']**2+4*F(p['side']*p['slant'],2)];assert q['givens']['diagram']['parameters']['mode']=='slant'
 elif r=='cone-surface':want=[F(314,100)*p['radius']**2+F(314,100)*p['radius']*p['slant']];assert q['givens']['diagram']['parameters']['mode']=='slant';assert p['slant']>p['radius']
 elif r in ['inch-read','metric-read']:want=[F(p['tick'],16 if p['inch'] else 10)];assert q['givens']['diagram']['parameters']['arrows']==[p['tick']]
 elif r=='ruler-difference':
  arrows=q['givens']['diagram']['parameters']['arrows'];assert arrows==[0,2*p['a'],2*(p['a']+p['b'])];want=[F(arrows[1]-arrows[0],16)-F(arrows[2]-arrows[1],16)];assert want[0]>0 and max(arrows)<=64
 elif r=='area-units':want=[F(p['feet'],9)]
 elif r in ['scientific-product','scientific-quotient']:
  first=F(p['a'],10)*10**p['e'];second=F(p['b'])*10**p['f'];expected=first*second if r=='scientific-product' else first/second
  assert 1<=got[0]<10 and got[1].denominator==1;assert got[0]*F(10)**int(got[1])==expected
 elif r=='formula-transform':
  correct=['l = A/w','w = P/2 − l','s = √A','s = P/4','h = A/b','b = A/h'];assert p['choices']['ABCD'.index(a['text'])]==correct[p['k']];seen.add('formula'+str(p['k']))
 elif r in ['binary-add','binary-fractions','binary-multiply']:
  result=p['nums'][0]*p['nums'][1] if r=='binary-multiply' else sum(p['nums']);assert binary(a['text'])==F(result,8 if r=='binary-fractions' else 1);assert re.fullmatch(r'[01]+(?:\.[01]+)?',a['text'])
 else:raise AssertionError(r)
 if want is not None:assert got==want,(r,p,got,want)
 if d['html']:
  for svg in re.findall(r'<svg.*?</svg>',d['html'],re.S):el=ET.fromstring(svg);assert el.attrib.get('role')=='img';assert 'NaN' not in svg;svgs+=1
assert {'cone','pyramid','sphere',*['formula'+str(i) for i in range(6)]}<=seen
print(f'PASS: {len(lines)} independent cases; {svgs} SVGs; exact volumes/surfaces, height semantics, ruler positions, normalized scientific and binary arithmetic, replay')
