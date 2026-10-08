"""Strict expression-to-template mapping with independent Fraction source-key checks."""
import argparse,ast,json,pathlib,re,hashlib,collections
from fractions import Fraction
p=argparse.ArgumentParser();p.add_argument('--content',type=pathlib.Path,required=True);p.add_argument('--out',type=pathlib.Path,required=True);a=p.parse_args()
def clean(s):
 s=s.replace('\xa0',' ').replace('−','-').replace('–','-').replace('×','*').replace('\uf0b4','*').replace('÷','/')
 s=re.sub(r'(?<=\d),(?=\d{3}(?:\D|$))','',s)
 s=re.sub(r'(\d+)¢',lambda m:str(Fraction(int(m[1]),100).numerator/Fraction(int(m[1]),100).denominator),s)
 return s.replace('$','').strip()
def node(n):
 if isinstance(n,ast.Constant) and type(n.value) in [int,float]:return {'type':'number','value':str(n.value)}
 if isinstance(n,ast.Name) and re.fullmatch('[A-Za-z]',n.id):return {'type':'variable','name':n.id}
 if isinstance(n,ast.UnaryOp) and isinstance(n.op,(ast.USub,ast.UAdd)):
  return {'type':'neg','arg':node(n.operand)} if isinstance(n.op,ast.USub) else node(n.operand)
 if isinstance(n,ast.BinOp) and type(n.op) in [ast.Add,ast.Sub,ast.Mult,ast.Div]:return {'type':{ast.Add:'add',ast.Sub:'sub',ast.Mult:'mul',ast.Div:'div'}[type(n.op)],'left':node(n.left),'right':node(n.right)}
 raise ValueError('unsupported syntax')
def parse(s):
 if not re.fullmatch(r'[\d.\s+*/()A-Za-z-]+',s):raise ValueError('nonexpression characters')
 s=re.sub(r'(\d)([A-Za-z])',r'\1*\2',s)
 return node(ast.parse(s,mode='eval').body)
def ev(n,v=None):
 t=n['type']
 if t=='number':return Fraction(n['value'])
 if t=='variable':
  if v is None:raise ValueError('variable')
  return v
 if t=='neg':return -ev(n['arg'],v)
 x,y=ev(n['left'],v),ev(n['right'],v)
 return {'add':lambda:x+y,'sub':lambda:x-y,'mul':lambda:x*y,'div':lambda:x/y}[t]()
def leaves(n):
 if n['type'] in ['number','variable']:return [n]
 return sum((leaves(v) for v in n.values() if isinstance(v,dict)),[])
def bounds(s):
 s=str(s).lstrip('+-');w,_,f=s.partition('.');places=min(len(f),4);digits=len(w.lstrip('0'));return {'min':0 if not digits else 10**(digits-1),'max':9 if not digits and not places else 10**digits-1,'places':places}
def shape(n):
 if n['type']=='number':return {'type':'number','range':bounds(n['value'])}
 return {k:shape(v) if isinstance(v,dict) else v for k,v in n.items()}
rows=[];reasons=collections.Counter();private=[]
for bank in ['course-1-en','intermediate-4-en']:
 d=json.load(open(a.content/(bank+'.json')))
 for i in d['items']:
  raw=i.get('stem_text_with_controls','');s=clean(raw)
  try:
   if i.get('object_placeholder_count') or any(c in raw for c in ['\x0f','\x10','\x11','[]']):raise ValueError('opaque object/table')
   answer=Fraction(clean(i['answer']['text_with_controls']))
   # Only explicitly recognized instruction wrappers; no deletion of arbitrary prose.
   s=re.sub(r'^(?:Simplify|Solve|Add|Subtract|Multiply|Divide|Find the missing addend|Find the missing factor):\s*','',s,flags=re.I)
   s=re.sub(r'^What is the (?:value of the )?missing (?:number|addend) in this number sentence\?\s*','',s,flags=re.I)
   m=re.fullmatch(r'If (.+), then [A-Za-z] (?:equals|=)',s,re.I)
   if m:s=m[1]
   m=re.fullmatch(r'In the equation (.+), the unknown is',s,re.I)
   if m:s=m[1]
   s=re.sub(r'\s+equals$','',s,flags=re.I).strip()
   money='$' in raw or '¢' in raw;mode='money' if money else ('decimal' if '.' in s else 'integer')
   equation='=' in s
   if equation:
    l,r=s.split('=');left,right=parse(l.strip()),parse(r.strip());vs=[x for x in leaves(left)+leaves(right) if x['type']=='variable']
    if len(vs)!=1:raise ValueError('not a one-occurrence variable equation')
    variable=vs[0]['name'];varleft=any(x['type']=='variable' for x in leaves(left));expr=left if varleft else right;constant=right if varleft else left
    if constant['type']!='number':raise ValueError('nonliteral opposite side')
    if ev(left,answer)!=ev(right,answer):raise ValueError('source key mismatch')
    if any(x['type']=='variable' for x in leaves(expr)) and ev(expr,Fraction(1))==ev(expr,Fraction(2)):raise ValueError('no unique answer')
    if '/' in s:raise ValueError('variable-division mapping deferred')
    template={'kind':'equation','expression':shape(expr),'variable':variable,'variableOnLeft':varleft,'answerRange':bounds(str(float(answer)) if answer.denominator!=1 else str(answer.numerator)),'constantNonnegative':ev(constant)>=0}
   else:
    expr=parse(s)
    if expr['type'] in ['number','variable'] or any(x['type']=='variable' for x in leaves(expr)):raise ValueError('not pure arithmetic')
    if ev(expr)!=answer:raise ValueError('source key mismatch')
    if '/' in s and not(expr['type']=='div' and expr['left']['type']=='number' and expr['right']['type']=='number'):raise ValueError('nested division mapping deferred')
    template={'kind':'arithmetic','expression':shape(expr)}
    if expr['type']=='div':template['quotientRange']=bounds(str(float(answer)) if answer.denominator!=1 else str(answer.numerator))
   if abs(answer)>10**12:raise ValueError('answer limit')
   template.update(mode=mode,nonnegative=answer>=0)
   row={'sourceId':i['id'],'family':'structured-'+template['kind'],'title':('Find a missing number' if equation else 'Calculate an exact '+('money amount' if money else 'expression')),'course':'Course 1' if bank=='course-1-en' else 'Intermediate 4','template':template,'lessonId':i['lesson_id'],'sourceRichSha256':i['question_rich_data_sha256'],'sourceKeyCheck':'independent-python-Fraction-equality','relationship':'original source-informed adaptation'}
   rows.append(row);private.append({'sourceId':i['id'],'stem':raw,'answer':str(answer),'template':template})
  except (ValueError,SyntaxError,ZeroDivisionError,TypeError) as e:reasons['nonnumeric-source-answer' if str(e).startswith('Invalid literal for Fraction') else 'syntax-outside-supported-expression' if isinstance(e,SyntaxError) else str(e).split('\n')[0][:60]]+=1
existing=json.loads(__import__('subprocess').check_output(['node','-e',"console.log(JSON.stringify(require('./engine-implementation/src/course-banks.js').catalog.filter(x=>!x.family.startsWith('structured-')).map(x=>x.sourceId)))"],text=True));rows=[r for r in rows if r['sourceId'] not in existing]
a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(rows,indent=2)+'\n');pathlib.Path('/tmp/examview-mapping-review.json').write_text(json.dumps(private,indent=2));print(json.dumps({'mapped':len(rows),'byCourse':dict(collections.Counter(r['course'] for r in rows)),'byKind':dict(collections.Counter(r['template']['kind']+'-'+r['template']['mode'] for r in rows)),'deferredReasons':dict(reasons)},indent=2))
