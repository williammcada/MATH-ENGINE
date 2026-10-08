"""Independent Python Fraction audit of generated JS expression records."""
import fractions,json,pathlib,subprocess
F=fractions.Fraction
root=pathlib.Path(__file__).resolve().parents[1]
code="const E=require('./src/course-banks.js');for(const c of E.catalog.filter(x=>x.family.startsWith('structured-')))for(let i=0;i<1000;i++){const q=E.generate(c.sourceId,{seed:'independent-python',index:i});if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'independent-python',index:i})))throw Error('Replay');if(!E.checkAnswer(q,E.answerText(q)).answerCorrect||E.checkAnswer(q,'nonsense').answerCorrect)throw Error('Answer check');console.log(JSON.stringify(q));}"
p=subprocess.Popen(['node','-e',code],cwd=root,stdout=subprocess.PIPE,text=True)
def ev(n,x=None):
 t=n['type']
 if t=='number':return F(n['value'])
 if t=='variable':return x
 if t=='neg':return -ev(n['arg'],x)
 a,b=ev(n['left'],x),ev(n['right'],x)
 return {'add':lambda:a+b,'sub':lambda:a-b,'mul':lambda:a*b,'div':lambda:a/b}[t]()
count=0;ids=set()
for line in p.stdout:
 q=json.loads(line);tree=q['givens']['expression'];answer=F(int(q['answer']['numerator']),int(q['answer']['denominator']))
 if tree['type']=='equation':
  assert ev(tree['left'],answer)==ev(tree['right'],answer)
  assert ev(tree['left'],answer+1)!=ev(tree['right'],answer+1)
 else:assert ev(tree)==answer
 if q['answer']['mode']=='integer':assert answer.denominator==1
 if q['answer']['mode']=='money':assert (answer*100).denominator==1
 ids.add(q['sourceId']);count+=1
assert p.wait()==0;assert count==len(ids)*1000 and len(ids)==100
print(json.dumps({'passed':True,'sourceMappings':len(ids),'independentFractionChecks':count}))
