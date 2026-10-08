"""Independent quadratic audit using Python Fraction and integer square roots."""
import json,pathlib,subprocess,math
from fractions import Fraction as F
root=pathlib.Path(__file__).resolve().parents[1]
rows={r['sourceId']:r for r in json.load(open(root/'curriculum/source-mappings/quadratic-equations-v0.1.json'))}
code="const E=require('./src/course-banks.js');for(const c of E.catalog.filter(c=>c.family==='structured-quadratic'))for(let index=0;index<2000;index++){const q=E.generate(c.sourceId,{seed:'quadratic-independent',index});if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'quadratic-independent',index})))throw Error('Replay');const text=E.answerText(q);if(!E.checkAnswer(q,text).answerCorrect||E.checkAnswer(q,'invalid').answerCorrect)throw Error('Checker');if(q.answer.roots&&(!E.checkAnswer(q,text.split('; ').reverse().join('; ')).answerCorrect||E.checkAnswer(q,text+'; '+text.split('; ')[0]).answerCorrect))throw Error('Set checker');console.log(JSON.stringify(q));}"
p=subprocess.Popen(['node','-e',code],cwd=root,stdout=subprocess.PIPE,text=True)
def pair(a,b=0):return(F(a),F(b))
def op(k,x,y,d):
 a,b=x;c,e=y
 if k=='add':return a+c,b+e
 if k=='sub':return a-c,b-e
 if k=='mul':return a*c+b*e*d,a*e+b*c
 if k=='div':assert e==0;return a/c,b/c
 raise ValueError(k)
def ev(n,x,d):
 t=n['type']
 if t=='number':return pair(n['value'])
 if t=='variable':assert n['name']=='x';return x
 if t=='power':assert n['exponent']=={'type':'number','value':'2'};return op('mul',ev(n['base'],x,d),ev(n['base'],x,d),d)
 if t=='neg':a,b=ev(n['arg'],x,d);return -a,-b
 return op(t,ev(n['left'],x,d),ev(n['right'],x,d),d)
def frac(v):return F(int(v['numerator']),int(v['denominator']))
count=0;ids=set();classes=set();repeated=0
for line in p.stdout:
 q=json.loads(line);r=rows[q['sourceId']];g=q['givens'];a,b,c=g['coefficients'];v=g['parameters'];recipe=r['recipe'];D=b*b-4*a*c;assert g['discriminant']==D and a!=0
 # Independent source-shape/parameter identities.
 if recipe=='opposite-roots':assert 2<=v['a']<=9 and 3<=v['b']<=9 and v['a']!=v['b'];expect=[1,v['a']-v['b'],-v['a']*v['b']]
 elif recipe in ['square-integer','square-integer-wide']:
  assert v['a'] in ([2,3,5,6,7,10,11,13] if recipe=='square-integer' else range(2,15));expect=[1,0,-v['a']**2]
 elif recipe=='square-fraction':assert 2<=v['a']<=10 and 2<=v['b']<=9 and math.gcd(v['a'],v['b'])==1;expect=[v['a']**2,0,-v['b']**2]
 elif recipe in ['signed-rearranged','signed-reversed']:
  x,y=v['a'],v['b'];assert 1<=abs(x)<=9 and 2<=abs(y)<=9 and abs(x)!=abs(y);sgn=1 if x+y>0 else -1;expect=[sgn,abs(x+y),x*y*sgn] if recipe=='signed-rearranged' else [1,x+y,x*y]
 elif recipe=='negative-roots':assert 1<=v['a']<=9 and 1<=v['b']<=8 and v['a']!=v['b'];expect=[1,v['a']+v['b'],v['a']*v['b']]
 elif recipe=='scaled-roots':
  assert 2<=v['a']<=4
  if v['repeated']:assert v['r']==v['s'] and 1<=abs(v['r'])<=4
  else:assert -6<=v['r']<=-1 and 1<=v['s']<=6
  expect=[v['a'],-v['a']*(v['r']+v['s']),v['a']*v['r']*v['s']]
 elif recipe=='formula-standard':assert 2<=v['a']<=8 and 3<=abs(v['b'])<=12 and 1<=abs(v['c'])<=5 and math.gcd(v['a'],abs(v['b']))==1 and D>0 and math.isqrt(D)**2!=D;expect=[v['a'],v['b'],v['c']]
 elif recipe=='formula-rearranged':assert 2<=v['a']<=3 and 5<=v['b']<=7 and abs(v['c'])==1 and D>0 and math.isqrt(D)**2!=D;expect=[v['a'],-v['b'],-v['c']]
 elif recipe=='complete-irrational':assert 1<=abs(v['b'])<=4 and 1<=abs(v['c'])<=6 and D>0 and math.isqrt(D)**2!=D;expect=[1,2*v['b'],v['c']]
 elif recipe=='factored-rational':
  A,B,C,T,E=[v[k] for k in ['a','b','c','d','e']];assert 2<=A<=5 and 2<=C<=5 and 2<=abs(B)<=5 and 2<=abs(T)<=5 and 2<=abs(E)<=6 and B*T<0 and math.gcd(A,abs(B))==math.gcd(C,abs(T))==1
  expect=[A*C*E,E*(A*T+B*C),B*T*E]
 elif recipe=='classify':assert 1<=abs(v['a'])<=4 and -8<=v['b']<=8 and -6<=v['c']<=6;expect=[v['a'],v['b'],v['c']]
 else:raise AssertionError(recipe)
 assert [a,b,c]==expect
 e=g['expression']
 for x in [F(0),F(1),F(-1),F(7,3)]:
  diff=op('sub',ev(e['left'],pair(x),1),ev(e['right'],pair(x),1),1)
  assert diff==pair((a*x*x+b*x+c)*(-1 if recipe=='square-fraction' else 1))
 if q['answer']['kind']=='quadratic-classification':
  expected='two nonreal complex solutions' if D<0 else 'one real solution' if D==0 else 'two real solutions';assert q['answer']['value']==expected;classes.add(expected)
 else:
  roots=q['answer']['roots'];assert D>=0 and len(roots)==(1 if D==0 else 2);vals=[]
  if D==0:repeated+=1
  for rr in roots:
   x=(frac(rr['rational']),frac(rr['radicalCoefficient']));d=rr['radicand'];assert isinstance(d,int) and 1<=d<=1000000
   assert all(d%(k*k) for k in range(2,math.isqrt(d)+1))
   assert ev(e['left'],x,d)==ev(e['right'],x,d)
   assert op('add',op('add',op('mul',pair(a),op('mul',x,x,d),d),op('mul',pair(b),x,d),d),pair(c),d)==pair(0)
   vals.append(x)
  if len(vals)==2:
   assert roots[0]['radicand']==roots[1]['radicand'] and vals[0]!=vals[1]
   assert op('add',vals[0],vals[1],d)==pair(F(-b,a));assert op('mul',vals[0],vals[1],d)==pair(F(c,a))
  else:assert vals[0]==pair(F(-b,2*a))
 count+=1;ids.add(q['sourceId'])
assert p.wait()==0 and len(ids)==16 and count==32000 and len(classes)==3 and repeated>0
print(json.dumps({'passed':True,'sourceMappings':len(ids),'independentExactChecks':count,'repeatedRootCases':repeated,'classificationCategories':len(classes)}))
