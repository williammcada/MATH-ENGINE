"""Independent arithmetic, English-number parsing and graph semantics."""
from pathlib import Path
from fractions import Fraction as F
import subprocess,json,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),C=require('./src/representations-bank-map');for(const c of C)for(let index=0;index<200;index++){const q=E.generate(c.sourceId,{seed:'independent-representations',index});if(!E.checkAnswer(q,E.answerText(q)).answerCorrect)throw Error(c.recipe);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'independent-representations',index})))throw Error('Replay');console.log(JSON.stringify({recipe:c.recipe,q,html:index<5?E.renderQuestion(q):null}));}"""
lines=subprocess.check_output(['node','-e',js],cwd=root,text=True).splitlines()
units=dict(zip('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(),range(20)));units.update(dict(zip('twenty thirty forty fifty sixty seventy eighty ninety'.split(),range(20,100,10))))
def parse_words(s):
 result=chunk=0
 for word in s.replace('-',' ').split():
  if word in units:chunk+=units[word]
  elif word=='hundred':chunk*=100
  elif word in ('thousand','million'):result+=chunk*({'thousand':1000,'million':1000000}[word]);chunk=0
  elif word!='and':raise AssertionError(word)
 return result+chunk
svgs=0;seen=set()
for line in lines:
 d=json.loads(line);r=d['recipe'];q=d['q'];p=q['givens']['parameters'];a=q['answer'];got=[F(int(v['numerator']),int(v['denominator'])) for v in a['values']];want=None
 if r.startswith('words-'):
  if r=='words-decimal':w,f=a['text'].split(' and ');assert f.endswith(' thousandths');assert parse_words(w)==p['whole'];assert parse_words(f.removesuffix(' thousandths'))==p['fraction']
  else:assert parse_words(a['text'])==p['n']
 elif r.startswith('expanded-'):
  assert sum(got)==p['n'];assert got==sorted(got,reverse=True);assert all(re.fullmatch('[1-9]0*',str(int(v))) for v in got);assert len({len(str(int(v))) for v in got})==len(got)
 elif r=='histogram-read':want=[p['freq'][p['bin']]];assert q['givens']['diagram']['parameters']['values']==p['freq']
 elif r=='pie-read':assert sum(p['freq'])==100;want=[F(p['total']*p['freq'][p['group']],100)];assert q['givens']['diagram']['parameters']['values']==p['freq']
 elif r=='triangle-angle':want=[180-p['a']-p['b']];assert 0<want[0]<180
 elif r=='y-symmetry':want=[-p['a'],p['b']];assert p['c']!=p['b']
 elif r=='triangle-kind':s=p['sides'];assert max(s)<sum(s)-max(s);assert a['text']=={1:'equilateral',2:'isosceles',3:'scalene'}[len(set(s))]
 elif r=='rotation':
  opts=q['givens']['options'];t=p['turns'];wantpts=[]
  for x,y in p['original']:
   z=complex(x,y)*(1j**t);wantpts.append([round(z.real),round(z.imag)])
  correct=[i for i,o in enumerate(opts) if o['parameters']['image']==wantpts];assert correct==['ABCD'.index(a['text'])];assert len({json.dumps(o['parameters']['image']) for o in opts})==4
 elif r=='reflection':want=[v for x,y in p['points'] for v in [x,-y]]
 elif r=='translation':want=[v for x,y in p['points'] for v in [x+p['dx'],y+p['dy']]]
 elif r=='polygon-interior':want=[F((p['n']-2)*180,p['n'])]
 elif r=='polygon-exterior':want=[F(360,p['n'])]
 elif r=='diagonals':want=[len([i for i in range(p['n']) if i not in [0,1,p['n']-1]])]
 elif r=='circle-fraction':want=[F(360,p['d'])]
 elif r in ('angle-kind','clock-angle'):
  v=p['degrees'];assert a['text']==('acute' if 0<v<90 else 'right' if v==90 else 'obtuse' if v<180 else 'straight');seen.add(a['text'])
  if r=='clock-angle':assert v==min(abs(p['hour']*30),360-abs(p['hour']*30))
 elif r=='right-angle':assert [i for i,o in enumerate(q['givens']['options']) if o['parameters']['degrees']==90]==['ABCD'.index(a['text'])]
 elif r=='histogram-choice':
  opts=q['givens']['options'];assert [i for i,o in enumerate(opts) if o['parameters']['values']==p['freq']]==['ABCD'.index(a['text'])];assert len({tuple(o['parameters']['values']) for o in opts})==4
 elif r=='rectangle-area':want=[p['width']*p['height']]
 elif r=='line-kind':assert a['text']==p['name'];seen.add(p['name'])
 elif r=='diameter':assert a['text']=='diameter'
 else:raise AssertionError(r)
 if want is not None:assert got==want,(r,p,got,want)
 if d['html']:
  for svg in re.findall(r'<svg.*?</svg>',d['html'],re.S):
   el=ET.fromstring(svg);assert el.attrib.get('role')=='img';assert el.attrib.get('aria-label');assert 'NaN' not in svg;svgs+=1
assert {'acute','right','obtuse','straight','line','ray','segment','angle','parallel lines','intersecting lines'}<=seen
print(f'PASS: {len(lines)} independent cases; {svgs} parsed SVGs; number semantics, graph choices, transformations, exact arithmetic, replay and answer acceptance')
