"""Independent exact statistics, rounding and enumerated sample-space audit."""
import json,pathlib,subprocess,itertools,collections,functools
from fractions import Fraction as F
root=pathlib.Path(__file__).resolve().parents[1]
js="""const E=require('./src/course-banks'),U=require('./src/statistics-bank'),M=require('./src/structured-math');for(const c of U.catalog)for(let index=0;index<1000;index++){const q=E.generate(c.sourceId,{seed:'statistics-audit',index});if(JSON.stringify(q)!==JSON.stringify(E.generate(c.sourceId,{seed:'statistics-audit',index})))throw Error('Replay');if(!E.checkAnswer(q,E.answerText(q)).answerCorrect||E.checkAnswer(q,'nonsense').answerCorrect)throw Error('Checker');const bad={...q,answer:{...q.answer,values:q.answer.values.map((v,i)=>i?v:M.serialize(M.op('add',M.from(v),M.rat(1))))}};if(E.checkAnswer(q,E.answerText(bad)).answerCorrect)throw Error('Wrong value accepted');console.log(JSON.stringify({recipe:c.recipe,q}));}"""
@functools.lru_cache(None)
def cards(event,suit,color,rank,unordered):
 deck=list(itertools.product(['hearts','diamonds','spades','clubs'],range(1,14)));target={'ace':1,'five':5,'seven':7,'ten':10}[rank]
 def match(a,b):
  if event==0:return a[0]==b[0]==suit
  if event==1:return a[1]<11 and b[1]<11
  if event==2:return a[1]>=11 and b[1]>=11
  if event==3:return all((c[0] in ['hearts','diamonds'])==(color=='red') for c in [a,b])
  return (a[1]>=11 and b[1]==target) or (unordered and b[1]>=11 and a[1]==target)
 sample=list(itertools.permutations(deck,2));return F(sum(match(a,b) for a,b in sample),len(sample))
def marble(a,b,first,second,replace):
 colors=[0]*a+[1]*b;sample=itertools.product(range(a+b),repeat=2) if replace else itertools.permutations(range(a+b),2);favorable=total=0
 for i,j in sample:total+=1;favorable+=colors[i]==first and colors[j]==second
 return F(favorable,total)
p=subprocess.Popen(['node','-e',js],cwd=root,stdout=subprocess.PIPE,text=True);count=0;seen=set();ties=0;zeros=ones=0;odd=even=0;card_events=set()
for line in p.stdout:
 x=json.loads(line);r=x['recipe'];q=x['q'];v=q['givens']['parameters'];seen.add(r)
 def n(k):return v[k]
 if r=='yield-mean':a=[F(n('total'),n('acres'))]
 elif r=='grocery-mean':a=[F(sum(n('cents')),len(n('cents'))*100)]
 elif r=='batting-average':a=[F(n('hits'),n('atBats'))]
 elif r in ['test-group-mean','two-group-mean','three-group-mean']:a=[F(sum(i*j for i,j in zip(n('counts'),n('means'))),sum(n('counts')))]
 elif r=='target-mean':a=[F(n('target')*(n('count')+n('next'))-n('count')*n('oldMean'),n('next'))];assert 0<=a[0]<=100
 elif r=='four-mean':a=[F(sum(n('data')),4)]
 elif r in ['missing-value','missing-price']:a=[F(n('count')*n('mean')-sum(n('known')),n('scale'))];assert a[0]>0
 elif r in ['mass-mean','length-mean']:a=[F(sum(n('data')),n('scale')*len(n('data')))]
 elif r=='mean-from-total':a=[F(n('total'),4*n('scale'))]
 elif r=='weighted-scores':a=[F(sum(i*j for i,j in zip(n('scores'),n('weights'))),sum(n('weights')))]
 elif r=='weighted-percent':a=[n('first')*F(n('weight'),100)+n('second')*(1-F(n('weight'),100))]
 elif r.endswith('statistics'):
  data=sorted(n('data'));length=len(data);counter=collections.Counter(data);mode=[k for k,v in counter.items() if v==max(counter.values())];assert len(mode)==1
  middle=data[length//2] if length%2 else F(data[length//2-1]+data[length//2],2)
  a=[F(max(data)-min(data)),F(sum(data),length),F(middle),F(mode[0])]
  odd+=length%2;even+=not length%2
 elif r in ['die-event','die-history','die-next-value']:
  t=n('target');rel=n('relation');a=[F(sum({'equal to':k==t,'less than':k<t,'greater than':k>t,'different from':k!=t}[rel] for k in range(1,7)),6)];assert 'independent' in q['prompt']
 elif r=='dice-sum':a=[F(sum(i+j==n('target') for i,j in itertools.product(range(1,7),repeat=2)),36)]
 elif r in ['coin-run','coin-sequence']:
  sequence=tuple(n('sequence'));space=list(itertools.product(['heads','tails'],repeat=len(sequence)));a=[F(space.count(sequence),len(space))]
 elif r=='rain-complement':a=[F(100-n('percent'))]
 elif r in ['odds-same-event','odds-complement']:a=[F(n('b') if n('complement') else n('a'),n('a')+n('b'))]
 elif r in ['marble-single','marble-union']:
  colors=[i for i,c in enumerate(n('counts')) for _ in range(c)];a=[F(sum(i in n('chosen') for i in colors),len(colors))]
 elif r in ['marble-repeat','marble-next','marble-without','compare-different','compare-same']:
  first=n('chosen');aa=n('a');bb=n('b')
  if r=='marble-repeat':a=[marble(aa,bb,first,first,True)]
  elif r=='marble-next':a=[F(bb if first else aa,aa+bb)]
  elif r=='marble-without':a=[marble(aa,bb,first,1-first,False)]
  elif r=='compare-different':a=[marble(aa,bb,first,1-first,True),marble(aa,bb,first,1-first,False)]
  else:a=[marble(aa,bb,first,first,False),marble(aa,bb,first,first,True)]
 elif r.startswith('cards-'):
  a=[cards(n('event'),n('suit'),n('color'),n('rank'),n('unordered'))];card_events.add((r,n('event')))
  if n('event')==4:assert a[0]==F(8 if n('unordered') else 4,221)
 else:raise AssertionError(r)
 raw=[F(int(v['numerator']),int(v['denominator'])) for v in q['givens']['unrounded']];assert raw==a,(r,v,raw,a)
 places=q['givens']['roundPlaces']
 if places is not None:
  rounded=[]
  for value in a:
   scaled=value*10**places;whole=scaled.numerator//scaled.denominator;remainder=scaled-whole;ties+=remainder==F(1,2);rounded.append(F(whole+(remainder>=F(1,2)),10**places))
  a=rounded;assert 'halfway values round up' in q['prompt']
 actual=[F(int(v['numerator']),int(v['denominator'])) for v in q['answer']['values']];assert actual==a,(r,v,actual,a)
 if q['answer']['form']=='probability':
  assert all(0<=v<=1 for v in a);zeros+=sum(v==0 for v in a);ones+=sum(v==1 for v in a)
 assert q['solution'] and q['prompt'];count+=1
assert p.wait()==0 and count==38000 and odd and even and zeros and ones and ties and len(card_events)==10
print(f'PASS: {count:,} independent cases; {len(seen)} recipes; {ties} rounding ties; {zeros} impossible and {ones} certain outcomes; {odd} odd/{even} even data sets; all 10 card event/order classes enumerated')
