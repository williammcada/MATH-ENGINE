"""Independent exhaustive candidate logic and exact original-equation evaluation."""
import json,math,pathlib,subprocess
from fractions import Fraction as F
root=pathlib.Path(__file__).resolve().parents[1];rows={r['sourceId']:r for r in json.load(open(root/'curriculum/source-mappings/domain-equations-v0.1.json'))}
code="const E=require('./src/course-banks.js');for(const c of E.catalog.filter(c=>c.family==='structured-domain'))for(let index=0;index<3000;index++){const q=E.generate(c.sourceId,{seed:'domain-independent',index});if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'domain-independent',index})))throw Error('Replay');const answer=E.answerText(q);if(!E.checkAnswer(q,answer).answerCorrect||E.checkAnswer(q,'invalid').answerCorrect)throw Error('Checker');if(q.answer.roots.length&&(!E.checkAnswer(q,answer.split('; ').reverse().join('; ')).answerCorrect||E.checkAnswer(q,answer+';'+answer).answerCorrect))throw Error('Set');console.log(JSON.stringify(q));}"
p=subprocess.Popen(['node','-e',code],cwd=root,stdout=subprocess.PIPE,text=True)
def frac(v):return F(int(v['numerator']),int(v['denominator']))
def sqrt(v):
 if v<0:raise ValueError('Nonreal')
 n,d=math.isqrt(v.numerator),math.isqrt(v.denominator)
 if n*n!=v.numerator or d*d!=v.denominator:raise ValueError('Not rational')
 return F(n,d)
def ev(n,x):
 t=n['type']
 if t=='number':return F(n['value'])
 if t=='variable':assert n['name']=='x';return x
 if t=='sqrt':return sqrt(ev(n['arg'],x))
 a,b=ev(n['left'],x),ev(n['right'],x)
 return {'add':lambda:a+b,'sub':lambda:a-b,'mul':lambda:a*b,'div':lambda:a/b}[t]()
def safe(fn):
 try:return fn()
 except (ValueError,ZeroDivisionError):return None
count=0;seen=set();empty=0;extra=0;two=0
for line in p.stdout:
 q=json.loads(line);g=q['givens'];v=g['parameters'];recipe=rows[q['sourceId']]['recipe'];expr=g['expression'];expected=set()
 if recipe=='shared-denominator':
  a,b=v['a'],v['b'];assert 1<=abs(a)<=5 and 1<=abs(b)<=5 and a+b!=0;expected={F(-a-b)};candidates=expected;left=lambda x:(x+a)/x+F(b)/x;right=lambda x:F(0)
 elif recipe=='three-fractions':
  a,b,c,d,e,f=[v[k] for k in 'abcdef'];assert 2<=abs(a)<=5 and 1<=b<=2 and c in [1,3,5] and 2<=d<=6 and 2<=e<=3 and f in [4,6] and e*f-c*d*e!=0
  z=F(b*d*f-a*e*f,e*f-c*d*e);candidates={z};expected={z} if z else set();left=lambda x:(x+a)/(d*x);right=lambda x:F(b)/(e*x)+F(c,f)
 elif recipe=='cross-products':
  a,b,c,d=[v[k] for k in 'abcd'];assert 1<=a<=8 and 2<=b<=9 and 2<=c<=4 and 3<=abs(d)<=8 and b*c!=a;z=F(a*d,b*c-a);candidates={z};expected={z} if z not in [0,-d] else set();left=lambda x:F(a)/(b*x);right=lambda x:F(c)/(x+d)
 elif recipe=='root-substitution':
  a,b=v['a'],v['b'];assert 1<=abs(a)<=3 and 1<=abs(b)<=3 and -1-a*b!=0
  candidates={F(1,a*a),F(b*b)};expected={t*t for t in [F(1,a),F(b)] if t>=0};sgn=1 if -1-a*b>0 else -1
  left=lambda x:abs(-1-a*b)*sqrt(x)+F(a,sgn)*x+F(b,sgn);right=lambda x:F(0)
 elif recipe=='isolate-root':
  a=v['a'];assert 1<=a<=5;expected={F(2*a+1)};candidates={F(0),F(2*a+1)};left=lambda x:sqrt(x+a*a)+a;right=lambda x:x
 elif recipe=='two-roots':
  a,c=v['a'],v['c'];assert 2<=abs(a)<=10 and 2<=abs(c)<=5 and a!=c and c*c!=abs(a);t=F(c*c-a,2*c);candidates={t*t};expected={t*t} if c>0 and t>=0 and c-t>=0 else set();left=lambda x:sqrt(x+a)+sqrt(x);right=lambda x:F(c)
 else:raise AssertionError(recipe)
 got={frac(r) for r in q['answer']['roots']};assert len(got)==len(q['answer']['roots']) and got==expected
 assert {frac(r) for r in g['candidates']}==candidates
 for x in candidates|{F(0),F(2,3),F(17,4)}:
  assert safe(lambda:ev(expr['left'],x))==safe(lambda:left(x));assert safe(lambda:ev(expr['right'],x))==safe(lambda:right(x))
 for x in got:assert left(x)==right(x)
 for check in g['checks']:
  x=frac(check['candidate']);assert check['accepted']==(x in expected)
  if check['accepted']:assert frac(check['left'])==left(x) and frac(check['right'])==right(x)
 assert {frac(r['candidate']) for r in g['checks']}==candidates
 empty+=not got;two+=len(got)==2;extra+=len(candidates-got);count+=1;seen.add(q['sourceId'])
assert p.wait()==0 and len(seen)==6 and count==18000 and empty>0 and two>0 and extra>0
print(json.dumps({'passed':True,'sourceMappings':6,'independentChecks':count,'noSolutionCases':empty,'twoSolutionCases':two,'rejectedCandidates':extra}))
