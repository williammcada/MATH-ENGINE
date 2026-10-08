"""Independent exact audit of all authored linear templates; no source script execution."""
import fractions,json,pathlib,subprocess,ast
F=fractions.Fraction;root=pathlib.Path(__file__).resolve().parents[1]
rows={r['sourceId']:r for r in json.load(open(root/'curriculum/source-mappings/linear-equations-v0.2.json'))}
code="const E=require('./src/course-banks.js');for(const c of E.catalog.filter(x=>x.family==='structured-linear'))for(let i=0;i<2000;i++){const q=E.generate(c.sourceId,{seed:'linear-audit',index:i});if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'linear-audit',index:i})))throw Error('Replay');const a=q.answer;if(!E.checkAnswer(q,E.answerText(q)).answerCorrect||!E.checkAnswer(q,(BigInt(a.numerator)*2n)+'/'+(BigInt(a.denominator)*2n)).answerCorrect||E.checkAnswer(q,'nonsense').answerCorrect)throw Error('Checker');console.log(JSON.stringify(q));}"
p=subprocess.Popen(['node','-e',code],cwd=root,stdout=subprocess.PIPE,text=True)
def ev(n,x):
 if n['type']=='number':return F(n['value'])
 if n['type']=='variable':assert n['name']=='x';return x
 if n['type']=='neg':return -ev(n['arg'],x)
 if n['type']=='abs':return abs(ev(n['arg'],x))
 if n['type']=='power':return ev(n['base'],x)**int(ev(n['exponent'],x))
 a,b=ev(n['left'],x),ev(n['right'],x)
 return {'add':lambda:a+b,'sub':lambda:a-b,'mul':lambda:a*b,'div':lambda:a/b}[n['type']]()
def formula(n,values,x):
 if isinstance(n,ast.Constant):return F(str(n.value))
 if isinstance(n,ast.Name):return x if n.id=='x' else values[n.id]
 if isinstance(n,ast.UnaryOp):return -formula(n.operand,values,x)
 if isinstance(n,ast.Call):assert n.func.id=='abs';return abs(formula(n.args[0],values,x))
 if isinstance(n,ast.BinOp) and isinstance(n.op,ast.Pow):return formula(n.left,values,x)**int(formula(n.right,values,x))
 a,b=formula(n.left,values,x),formula(n.right,values,x)
 return {ast.Add:lambda:a+b,ast.Sub:lambda:a-b,ast.Mult:lambda:a*b,ast.Div:lambda:a/b}[type(n.op)]()
count=0;seen=set()
for line in p.stdout:
 q=json.loads(line);r=rows[q['sourceId']];t=r['template'];tree=q['givens']['expression'];answer=F(int(q['answer']['numerator']),int(q['answer']['denominator']));values={k:F(int(v['numerator']),int(v['denominator'])) for k,v in q['givens']['parameters'].items()}
 assert abs(answer)<=t['maxAnswer']
 if t['positiveAnswer']:assert answer>0
 if t['mode']=='integer':assert answer.denominator==1
 if t['mode']=='decimal':assert (answer*10**6).denominator==1
 for k,v in values.items():
  spec=t['parameters'][k];scaled=v*spec[2];assert scaled.denominator==1
  if len(spec)>3 and spec[3]:scaled=abs(scaled)
  assert spec[0]<=scaled<=spec[1]
 l,rhs=[ast.parse(s.strip(),mode='eval').body for s in r['reviewedShape'].split('=')]
 for testx in [answer,answer+1,F(-7,3),F(0)]:
  assert ev(tree['left'],testx)==formula(l,values,testx)
  assert ev(tree['right'],testx)==formula(rhs,values,testx)
 assert ev(tree['left'],answer)==ev(tree['right'],answer)
 assert ev(tree['left'],answer+1)!=ev(tree['right'],answer+1)
 # A second, numerical-coefficient derivation is independent of JS symbolic normalization.
 b=ev(tree['left'],F(0))-ev(tree['right'],F(0));a=ev(tree['left'],F(1))-ev(tree['right'],F(1))-b
 assert a!=0 and -b/a==answer
 seen.add(q['sourceId']);count+=1
assert p.wait()==0 and seen==set(rows) and count==len(rows)*2000
print(json.dumps({'result':'passed','templates':len(seen),'independentVariants':count}))
