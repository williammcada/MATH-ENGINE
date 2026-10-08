"""Independent geometry audit; planar areas from vertices, SVG transform consistency."""
import json,pathlib,subprocess,math,re,xml.etree.ElementTree as ET
from fractions import Fraction as F
root=pathlib.Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),G=require('./src/geometry-bank'),M=require('./src/structured-math');for(const c of G.catalog)for(let index=0;index<1000;index++){const q=E.generate(c.sourceId,{seed:'geometry-audit',index});if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'geometry-audit',index})))throw Error('Replay');if(!E.checkAnswer(q,E.answerText(q)).answerCorrect||E.checkAnswer(q,'nonsense').answerCorrect)throw Error('Checker');const bad={...q,answer:{...q.answer,values:q.answer.values.map((a,i)=>i?a:M.serialize(M.op('add',M.from(a),M.rat(1))))}};if(E.checkAnswer(q,E.answerText(bad)).answerCorrect)throw Error('Changed answer accepted');console.log(JSON.stringify({recipe:c.recipe,q,html:index<20?E.renderQuestion(q):null}));}"""
p=subprocess.Popen(['node','-e',js],cwd=root,stdout=subprocess.PIPE,text=True);count=svg_count=0;types=set()
def polygon_area(vs):return abs(sum(vs[i][0]*vs[(i+1)%len(vs)][1]-vs[i][1]*vs[(i+1)%len(vs)][0] for i in range(len(vs))))/2
def perimeter(vs):return sum(math.dist(vs[i],vs[(i+1)%len(vs)]) for i in range(len(vs)))
for line in p.stdout:
 x=json.loads(line);q=x['q'];r=x['recipe'];g=q['givens']['diagram'];d=g['parameters'];vs=g['vertices'];typ=g['type'];types.add(typ);a=[F(int(v['numerator']),int(v['denominator'])) for v in q['answer']['values']];expected=[]
 if typ=='sectors':
  assert len(d['shaded'])==len(set(d['shaded'])) and all(0<=i<d['count'] for i in d['shaded']);expected=[F(len(d['shaded']),d['count'])*(100 if r=='shaded-percent' else 1)]
 elif typ=='rectangle':expected=[perimeter(vs),polygon_area(vs)];assert len(vs)==4
 elif typ in ['right-triangle','oblique-triangle','square-triangle','l-shape','parallelogram','trapezoid']:
  expected=[perimeter(vs) if r=='compound-perimeter' else polygon_area(vs)]
  if r=='triangle-area-hypotenuse':expected.append(math.sqrt(d['base']**2+d['height']**2));assert d['hypotenuse']=='x'
  if typ=='right-triangle' and d['hypotenuse']!='x':assert d['hypotenuse']**2==d['base']**2+d['height']**2
  if typ=='parallelogram':assert math.isclose(math.dist(vs[0],vs[-1]),d['slant'])
  if typ=='square-triangle':assert math.isclose(math.dist(vs[1],vs[2]),d['slant'])
 elif typ=='circle':
  pi=q['givens']['parameters']['pi'];pi=F(int(pi['numerator']),int(pi['denominator']));rad=F(d['value'],2 if d['given']=='diameter' else 1);circ=2*pi*rad;area=pi*rad*rad
  expected=[circ] if r=='circle-circumference' else [area] if r=='circle-area' else [rad,circ,area] if d['given']=='diameter' else [circ,area]
  assert ('22/7' if pi==F(22,7) else '3.14') in q['prompt']
 elif typ=='prism':
  w,h,dep=d['width'],d['height'],d['depth'];expected=[w*h*dep] if r=='prism-volume' else [sum([w*dep,w*dep,w*h,w*h,dep*h,dep*h])]
 elif typ=='cylinder':expected=[F(314,100)*d['radius']**2*d['height']]
 elif typ=='regular-polygon':
  n=len(vs);assert n==d['sides'];edges=[math.dist(vs[i],vs[(i+1)%n]) for i in range(n)];assert max(edges)-min(edges)<1e-10
  expected=[n-2] if r=='polygon-triangles' else [sum([180 for _ in range(1,n-1)])] if r=='polygon-angle-sum' else [F(360,n)]
 elif typ=='coordinates':
  pts=d['points'];xs=[p[0] for p in pts];ys=[p[1] for p in pts];xx=next(v for v in xs if xs.count(v)==1);yy=next(v for v in ys if ys.count(v)==1);expected=[xx,yy,(max(xs)-min(xs))*(max(ys)-min(ys))];assert [xx,yy] not in pts
 else:raise AssertionError(typ)
 assert len(expected)==len(a) and all(math.isclose(float(v),float(e),rel_tol=1e-12,abs_tol=1e-9) for v,e in zip(a,expected)),(r,d,a,expected)
 if x['html']:
  svg=ET.fromstring(re.search(r'<svg\b.*?</svg>',x['html'],re.S).group());assert svg.attrib['viewBox']=='0 0 480 360' and svg.attrib['role']=='img';nodes=list(svg.iter());assert not any(n.tag.endswith('script') for n in nodes)
  outline=next((n for n in nodes if n.attrib.get('data-role')=='outline'),None)
  if outline is not None:
   pts=[[float(v) for v in s.split(',')] for s in outline.attrib['points'].split()];assert len(pts)==len(vs)
   j=next(j for j in range(1,len(vs)) if abs(vs[j][0]-vs[0][0])>1e-9);scale=(pts[j][0]-pts[0][0])/(vs[j][0]-vs[0][0]);ox=pts[0][0]-scale*vs[0][0];oy=pts[0][1]+scale*vs[0][1]
   assert scale>0 and all(abs(px-(ox+scale*vx))<.02 and abs(py-(oy-scale*vy))<.02 for (px,py),(vx,vy) in zip(pts,vs))
  if typ=='sectors':
   sectors=[n for n in nodes if n.attrib.get('data-role')=='sector'];assert len(sectors)==d['count'];assert sum(n.attrib['data-shaded']=='true' for n in sectors)==len(d['shaded'])
  if typ=='prism':assert sum(n.attrib.get('data-role')=='hidden-edge' for n in nodes)==3
  if typ=='coordinates':assert sum(n.tag.endswith('circle') for n in nodes)==3;assert 'Only the given vertices' in x['html']
  if r=='triangle-area-hypotenuse':
   labels=[n.text for n in nodes if n.attrib.get('data-role')=='dimension'];assert 'x' in labels and str(expected[1]).removesuffix('.0') not in labels
  svg_count+=1
 count+=1
assert p.wait()==0 and count==27000 and len(types)==13
print(f'PASS: {count:,} independent geometry cases, {len(types)} diagram types, {svg_count} parsed SVGs with uniform transforms, sector/edge counts and unknown-value checks')
