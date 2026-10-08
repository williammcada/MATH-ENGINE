"""Independent Fraction/Decimal oracles for every auto-scored numeric phase-1 task.
Teacher-reviewed tasks are separately checked for explicit non-automatic grading,
criteria, deterministic replay and valid diagrams; they are not auto-certified.
"""
from pathlib import Path
from fractions import Fraction as F
from decimal import Decimal, ROUND_HALF_UP, localcontext
from types import SimpleNamespace as NS
import subprocess,json,math,xml.etree.ElementTree as ET
from phase2_oracles import numeric as phase2_numeric, textual as phase2_textual
E=Path(__file__).resolve().parents[1]
js=r"""const E=require('./src/course-banks'),C=require('./src/curriculum87-map');for(const c of C)for(let index=0;index<Number(process.env.MATH_AUDIT_VARIANTS||80);index++){const options={seed:process.env.MATH_AUDIT_SEED||'independent-phase1',index},q=E.generate(c.sourceId,options),answer=E.answerText(q),checked=E.checkAnswer(q,answer);if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,options)))throw Error('Replay '+c.recipe);if(q.answer.kind==='teacher'){if(checked.answerCorrect!==null||!checked.requiresTeacherReview||E.checkAnswer(q,'anything').answerCorrect!==null)throw Error('False auto grading');}else if(!checked.answerCorrect||E.checkAnswer(q,'not an answer').answerCorrect)throw Error('Checker '+c.recipe);console.log(JSON.stringify(q));}"""
lines=subprocess.check_output(['node','-e',js],cwd=E,text=True).splitlines()
def rounded(value,places):
 with localcontext() as c:
  c.prec=50
  return F((Decimal(value.numerator)/Decimal(value.denominator)).quantize(Decimal(10)**-places,rounding=ROUND_HALF_UP))
def prime(n):return n>=2 and all(n%d for d in range(2,math.isqrt(n)+1))
def roman_value(s):
 v={'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000};return sum(-v[c] if i+1<len(s) and v[c]<v[s[i+1]] else v[c] for i,c in enumerate(s))
# Formulas are independent mathematical definitions, not calls into engine arithmetic.
calc={
'7.1':lambda p:p.k,'8.1':lambda p:[F(p.a,p.d),F(100*p.a,p.d)],'8.4':lambda p:F(p.base*p.percent,100),'8.6':lambda p:F(1,p.divisions),'8.7':lambda p:F(p.shaded,100),
'9.1':lambda p:F(p.left)+F(p.right),'9.2':lambda p:F(p.left)-F(p.right),'9.3':lambda p:F(p.x)*F(p.y),'9.4':lambda p:1/F(p.x),'9.6':lambda p:(F(p.x)+F(p.y))*F(p.z) if p.grouped else F(p.x)+F(p.y)*F(p.z),
'10.1':lambda p:F(p.numerator,p.denominator),'10.3':lambda p:F(p.numerator,p.denominator),'10.4':lambda p:p.w+F(p.x),
'11.1':lambda p:p.a+p.b,'11.4':lambda p:p.a-p.b,'12.1':lambda p:p.b,'12.4':lambda p:p.end-p.start,'13.1':lambda p:p.a*p.b,'14.1':lambda p:p.b,'14.4':lambda p:100*p.a+10*(p.b-p.d)+p.c+2,
'16.1':lambda p:p.a*p.factor,'16.3':lambda p:F(100,p.factor),'17.1':lambda p:abs(p.angle-p.baseline),'17.4':lambda p:[F(100*p.a,p.d),F(360*p.a,p.d)],'19.1':lambda p:2*(p.a+p.b),'19.2':lambda p:p.side,
'20.1':lambda p:[p.a,p.b],'20.3':lambda p:p.a**p.b,'20.6':lambda p:p.a*p.b,'20.7':lambda p:p.a,'20.8':lambda p:p.a,'20.9':lambda p:p.b+p.c,'20.10':lambda p:p.b-p.c,'20.11':lambda p:p.a**2,'20.12':lambda p:F(p.x),
'21.3':lambda p:[next(k for k in range(20) if p.value%d**(k+1)) for d in [2,3,5]],'21.6':lambda p:sum(n for n in range(p.start+1,p.end) if prime(n)),
'23.1':lambda p:F(p.x)-F(p.y),'23.2':lambda p:F(p.x)-F(p.y),'24.2':lambda p:math.gcd(p.a,p.b),'25.1':lambda p:[p.d,p.d*p.w],'25.2':lambda p:F(p.x)/F(p.y),'25.3':lambda p:F(p.x)/F(p.y),
'27.1':lambda p:[p.a*k for k in range(1,6)],'27.2':lambda p:[math.lcm(p.a,p.b)*k for k in range(1,4)],'28.1':lambda p:p.a*p.b-p.c,'28.2':lambda p:F(sum(p.data),len(p.data)),
'29.2':lambda p:rounded(F(p.x),0),'29.3':lambda p:10*(rounded(F(p.a,10),0)+(-1 if p.subtract else 1)*rounded(F(p.b,10),0)),
'30.1':lambda p:[F(p.x).numerator*math.lcm(F(p.x).denominator,F(p.y).denominator)//F(p.x).denominator,F(p.y).numerator*math.lcm(F(p.x).denominator,F(p.y).denominator)//F(p.y).denominator,math.lcm(F(p.x).denominator,F(p.y).denominator)],'30.3':lambda p:F(p.x)+(1 if p.add else -1)*F(p.y),
'31.1':lambda p:F(p.shaded,100),'31.2':lambda p:F(p.a,p.d),'31.4':lambda p:p.a+F(p.b,1000),'32.2':lambda p:F(p.amount,p.factor) if p.reverse else p.amount*p.factor,'32.3':lambda p:F(p.factor),
'33.2':lambda p:sorted(F(x,100) for x in p.input),'33.3':lambda p:rounded(F(p.a,1000),p.power),'34.1':lambda p:F(p.tick,10),'34.3':lambda p:F(p.amount,p.factor) if p.reverse else p.amount*p.factor,
'35.1':lambda p:F(p.a+(1 if p.add else -1)*p.b,100),'35.2':lambda p:F(p.a*p.b,1000),'35.3':lambda p:F(p.b,100),'36.2':lambda p:[p.a,p.b,p.a+p.b],'36.3':lambda p:F(p.a,p.a+p.b),'37.2':lambda p:F(p.a*p.b,2),
'38.1':lambda p:(p.a-p.b)*p.key,'38.2':lambda p:p.values[p.which],'38.3':lambda p:p.values[p.which],'38.4':lambda p:F(p.total*p.a,p.d),'39.2':lambda p:p.a*p.c,'40.2':lambda p:180-p.a-p.b,'40.4':lambda p:[90-p.a,180-p.a,p.a][p.k],'41.1':lambda p:p.a*p.b*p.c,
'42.2':lambda p:rounded(F(p.numerator,p.divisor),p.places),'43.1':lambda p:F(p.a,p.d),'43.2':lambda p:F(p.numerator,p.denominator),'43.3':lambda p:F(p.p,1000),'43.4':lambda p:[F(p.numerator,p.denominator),F(p.numerator,p.denominator),F(p.numerator*100,p.denominator)],
'45.1':lambda p:F(p.a,10),'46.1':lambda p:F(p.cents,100),'46.2':lambda p:p.speed,'46.3':lambda p:rounded(F(p.cents*p.percent,10000),2),'46.4':lambda p:rounded(F(p.cents*p.percent,10000),2),
'47.1':lambda p:p.power,'47.3':lambda p:F(p.a,10)*10**p.b,'47.4':lambda p:F(p.a,10**(p.b+1)),'48.1':lambda p:[F(p.a,20),F(p.a,20),5*p.a],'48.2':lambda p:[F(p.numerator,p.denominator),F(p.numerator,p.denominator),F(p.numerator*100,p.denominator)],
'49.1':lambda p:list(divmod((p.a+p.c)*60+p.b+p.d,60)),'51.1':lambda p:[F(p.coefficient),p.exponent],'51.2':lambda p:F(p.coefficient)*F(10)**p.exponent,'52.1':lambda p:p.a+p.b*p.c**2,'52.2':lambda p:p.a+p.b*p.c**2,
'55.1':lambda p:p.count*p.mean,'55.2':lambda p:5*F(p.mean)-sum(p.data),'55.3':lambda p:F(p.a*p.c+p.b*p.d,p.a+p.b),'56.1':lambda p:list(divmod((p.a-p.c)*60+p.b-p.d,60)),
'57.1':lambda p:F(p.a)**-p.b,'57.2':lambda p:[F(p.coefficient),p.exponent],'57.3':lambda p:F(p.coefficient)*F(10)**p.exponent,'58.2':lambda p:[p.a,p.b],'58.3':lambda p:p.a*p.x+p.b,'59.1':lambda p:abs(p.a),
'61.1':lambda p:p.a*p.b,'61.2':lambda p:[180-p.a,p.a,180-p.a],'63.2':lambda p:p.a*(p.a+p.b+p.c-1),'64.1':lambda p:p.a+p.b+p.c,'66.2':lambda p:F(314,100)*p.a*(2 if p.radius else 1),
'67.2':lambda p:[p.sides+2,p.sides*3,p.sides*2],'68.1':lambda p:p.a-p.b-p.c,'69.1':lambda p:[p.a,p.b+p.c],'70.1':lambda p:p.a*p.b*p.c,'70.2':lambda p:F(p.a*p.b*p.c,2),'71.1':lambda p:F(p.part*p.d,p.a),'74.1':lambda p:F(p.part*p.d,p.a),'72.1':lambda p:p.b*p.c,'73.1':lambda p:p.a*p.b,'73.2':lambda p:p.a,
'75.1':lambda p:p.square**2+F(p.square*p.extension,2),'75.2':lambda p:F((p.a+p.b)*p.c,2),'76.1':lambda p:F(p.a,p.b)/F(p.c,p.d),'82.1':lambda p:F(314*p.a*p.a,100),'83.1':lambda p:p.a+p.b,'83.2':lambda p:[F(p.a*p.b,10 if p.a*p.b>=10 else 1),p.c+p.d+(p.a*p.b>=10)],
'84.1':lambda p:[p.a+p.c,p.b+p.d],'85.1':lambda p:p.a-p.b*p.c,'85.2':lambda p:[p.a*x+p.b for x in [-2,0,3]],'87.1':lambda p:[p.a*p.b,p.c+p.d,p.e+p.g],'88.2':lambda p:p.a*p.factor,
'89.2':lambda p:(p.sides-2)*180,'89.3':lambda p:F((p.sides-2)*180,p.sides),'89.4':lambda p:360,'89.5':lambda p:F(360,p.sides),'90.1':lambda p:F(p.rhs)/F(p.coefficient),'90.2':lambda p:F(p.rhs,p.a),'91.1':lambda p:p.a**2+p.c*p.b,'91.2':lambda p:p.a-p.b-p.c,'93.1':lambda p:F(p.rhs-p.b,p.a),
'94.2':lambda p:F(1,2**p.tosses),'94.3':lambda p:F(p.a,p.a+p.b)*F(p.a-1,p.a+p.b-1),'95.1':lambda p:F(314*p.a*p.a*p.b,100),'96.2':lambda p:[p.a+p.c,p.a*p.b],'97.2':lambda p:p.b*p.c,'98.2':lambda p:p.b,'98.3':lambda p:p.a*p.b,
'99.1':lambda p:math.isqrt(p.leg1**2+p.leg2**2) if p.missing else math.isqrt(p.hyp**2-p.leg1**2),'100.1':lambda p:[math.isqrt(p.b),math.isqrt(p.b)+1],'100.2':lambda p:F(Decimal(p.b).sqrt().quantize(Decimal('.1'),rounding=ROUND_HALF_UP)),
'102.1':lambda p:[180-p.angle,p.angle,180-p.angle,p.angle,180-p.angle,p.angle,180-p.angle],'103.2':lambda p:p.a**p.b,'104.1':lambda p:[F(314*p.a,100),F(314*p.a*p.a,200)],'104.2':lambda p:F(p.angle,360)*F(628*p.a,100),'104.3':lambda p:F(p.angle,360)*F(314*p.a*p.a,100),'105.1':lambda p:2*(p.a*p.b+p.a*p.c+p.b*p.c),'105.2':lambda p:F(1256*p.a*p.a,100),'105.3':lambda p:[-p.a,p.a],'105.4':lambda p:p.a,
'INV3.2':lambda p:[p.a,p.b],'INV4.2':lambda p:[len(p.v),min(p.v),max(p.v)],'INV4.3':lambda p:[max(set(p.v),key=p.v.count),max(p.v)-min(p.v),F(p.v[3]+p.v[4],2)],'INV4.4':lambda p:[min(p.v),F(p.v[1]+p.v[2],2),F(p.v[3]+p.v[4],2),F(p.v[5]+p.v[6],2),max(p.v)],'INV4.6':lambda p:[F(p.v[3]+p.v[4],2),F(p.v[5]+p.v[6]-p.v[1]-p.v[2],2),max(p.v)-min(p.v)],'INV9.2':lambda p:p.a*p.x+p.b,
'COURSE107.1':lambda p:F(p.dy,p.dx),'COURSE108.1':lambda p:2*p.a**2-3*p.b,'COURSE109.1':lambda p:[-p.a,p.a],'COURSE109.2':lambda p:p.a,
'COURSE110.1':lambda p:[F(p.principal*p.rate*p.years,100),p.principal+F(p.principal*p.rate*p.years,100)],'COURSE110.2':lambda p:p.principal*(1+F(p.rate,100))**p.years,'COURSE110.3':lambda p:p.price*(1-F(p.first,100))*(1-F(p.second,100)),
'COURSE111.1':lambda p:[F(p.coefficient,p.divisor),p.p-p.q],'COURSE112.1':lambda p:4*p.k,'COURSE113.1':lambda p:F(p.a*p.b*p.c,3),'COURSE113.2':lambda p:F(314*p.a*p.a*p.b,300),'COURSE113.3':lambda p:F(1256*p.a**3,300),
'COURSE115.1':lambda p:[p.a,F(p.a,1000)],'COURSE115.2':lambda p:[p.a,F(p.a,1000)],'COURSE117.1':lambda p:[p.a,p.b],'COURSE119.2':lambda p:p.a,'COURSE210.1':lambda p:[F(p.successes,60),F(1,6)],'COURSE210.2':lambda p:[F(p.a,p.a+p.b),F(p.b,p.a+p.b)],'COURSE211.1':lambda p:[p.a**2,p.a**3],'COURSE211.2':lambda p:p.a,'COURSE213.1':lambda p:int(p.binary,2),'COURSE213.3':lambda p:p.a,
}
seen=set();numeric=texts=teachers=svgs=0;missing=set()
for line in lines:
 q=json.loads(line);r=q['givens']['recipe'];p=NS(**q['givens']['parameters']);a=q['answer'];seen.add(r)
 if 'values' in a:
  if r not in calc:missing.add(r);continue
  want=phase2_numeric(r,p) if getattr(p,"phase2",False) else calc[r](p);want=want if isinstance(want,list) else [want];got=[F(int(x['numerator']),int(x['denominator'])) for x in a['values']]
  assert got==want,(r,p,got,want);numeric+=1
 elif a['kind']=='teacher':
  assert len(a['rubric'])>=2 and len(a['reference'])>2 and 'teacher review' in q['prompt'] and 'Review:' in q['solution'],r
  assert q['provenance']['exactLegacyReproduction'] is False
  teachers+=1
 elif a['kind']=='text':
  # Independent checks for data-dependent comparisons, classification and conversions.
  want=None
  if getattr(p,'phase2',False):want=phase2_textual(r,p)
  elif r in ['21.1','21.2']:want='; '.join(str(x) for x in range(p.start+1,p.end) if prime(x) if r=='21.1') if r=='21.1' else '; '.join(str(x) for x in range(p.start+1,p.end) if x>1 and not prime(x))
  elif r=='30.2':want='<' if F(p.x)<F(p.y) else '>' if F(p.x)>F(p.y) else '='
  elif r=='33.1':want='<' if p.a<p.b else '>' if p.a>p.b else '='
  elif r=='57.4':
   x,y=F(p.a)*F(10)**p.c,F(p.b)*F(10)**p.d;want='<' if x<y else '>' if x>y else '='
  elif r in ['7.4','17.2']:want='acute' if p.angle<90 else 'right' if p.angle==90 else 'obtuse' if p.angle<180 else 'straight'
  elif r=='10.2':want='yes' if p.a>=p.d else 'no'
  elif r=='15.3':want='ABC'[next(i for i,x in enumerate(p.options) if F(x)!=F(p.x))]
  elif r=='32.4':want='A' if p.offset<0 else 'B' if p.offset>0 else 'equal'
  elif r=='62.1':want='acute' if max(p.angles)<90 else 'right' if max(p.angles)==90 else 'obtuse'
  elif r=='62.3':want={1:'equilateral',2:'isosceles',3:'scalene'}[len(set(p.sides))]
  elif r=='103.1':want='negative' if math.prod(p.values)<0 else 'positive'
  elif r=='COURSE112.2':want='yes' if p.sides[0]**2+p.sides[1]**2==p.sides[2]**2 else 'no'
  elif r=='COURSE213.2':assert int(a['value'],2)==p.a
  elif r=='COURSE213.3':assert roman_value(a['value'])==p.a
  if want is not None:assert a['value']==want,(r,want,a)
  texts+=1
 else:raise AssertionError((r,a))
 for field in [q['givens'].get('svg'),q.get('teacherSvg')]:
  if not field:continue
  node=ET.fromstring(field);svg=next((e for e in node.iter() if e.tag.split('}')[-1]=='svg'),None);assert svg is not None and svg.attrib.get('role')=='img' and svg.attrib.get('viewBox') and (svg.attrib.get('aria-label') or svg.attrib.get('aria-labelledby')),r
  assert not any(t in field for t in ['NaN','Infinity','<script','onload=']),r
  svgs+=1
assert not missing,sorted(missing)
assert len(seen)==340
print(json.dumps(dict(result='passed',contracts=len(seen),instances=len(lines),numericOracles=numeric,textResponseInstances=texts,teacherReviewInstances=teachers,svgModels=svgs)))
