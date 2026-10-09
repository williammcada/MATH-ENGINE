"""Build explicit concept analysis and reviewed progressions; never rank by grade or title."""
import json,subprocess,hashlib,fnmatch
from pathlib import Path
R=Path(__file__).resolve().parents[1];out=R/'curriculum/cross-course/v0.4'
placement=json.loads((R/'curriculum/course-placement.json').read_text());coursePlacement={c['bankId']:c for c in placement['courses']}
cat=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./src/course-banks').catalog))"],cwd=R,text=True));ids={c['sourceId']:c for c in cat}
alias=dict(f='structured-foundational-courses',h='structured-algebra-half',a='structured-algebra-one',m='structured-algebra-two',z='structured-algebra-two-completion',q='structured-quadratic',d='structured-domain',p='structured-proportion',t='structured-measurement',s='structured-statistics',g='structured-geometry',b='structured-breadth',v='structured-advanced',r='structured-representations',n='structured-reasoning',l='structured-relations',o='structured-solids',w='structured-algebra-review',x='structured-cross-course',c='structured-curriculum87',e='structured-foundations87')
rules=[]
for line in (out/'topic-rules.txt').read_text().splitlines():
 if not line or line.startswith('#'):continue
 family,topic,patterns=line.split('|');rules.append((alias[family],topic,patterns.split()))
lesson={}
def lessons(topic,numbers):
 for n in numbers.split():lesson[n]=topic
lessons('geometry-properties','7 18 62 67.1 67.2 67.3 67.4 INV6.1 INV6.2')
lessons('fractions','8 9 10 23 25 26 30 76')
lessons('word-equations','11 12 13 14 28.1 101')
lessons('fraction-equivalence','15 24.1')
lessons('measurement','16 32 34 49 50 56 88 115 COURSE115.1 COURSE115.2')
lessons('angles','17 40 61.2 89 96.1 102.1 102.2')
lessons('perimeter','19')
lessons('powers-roots','20 57.1 100 103.2 105.3 105.4 COURSE109.1 COURSE109.2')
lessons('number-theory','21 24.2 27')
lessons('percent','22.2 46.3 46.4 60.2 77 81 92 COURSE110.1 COURSE110.3')
lessons('ratio-proportion','22.1 36 39 54 60.1 65 71 72 74')
lessons('statistics','28.2 55 INV4.3 INV4.4')
lessons('rounding-estimation','29 33.3 42.2')
lessons('number-representation','31 47.1 47.2')
lessons('number-order','33.1 33.2 34.2')
lessons('decimal-arithmetic','35 44 45 47.3 47.4')
lessons('area','20.5 20.6 20.7 20.11 37 61.1 75')
lessons('data-displays','38 INV4.1 INV4.2 INV4.5 INV4.6 INV5')
lessons('expressions','41 52 63 68 84 91 96.2')
lessons('fraction-decimal-percent','42.1 43 48 INV1')
lessons('rates','46.1 46.2 53')
lessons('scientific-notation','51 57.2 57.3 57.4 69 83 COURSE111.1')
lessons('transformations','58.1 80 INV6.3 INV6.4')
lessons('functions','58.2 58.3 85.2 INV9')
lessons('integers','59 64 73 85.1 103.1')
lessons('circle-measurement','66 82 104')
lessons('surface-area','67.5 105.1 105.2')
lessons('volume','70 95 COURSE113.1 COURSE113.2 COURSE113.3')
lessons('inequalities','78 93.2 COURSE114.1')
lessons('reasoning','79 COURSE108.2 COURSE119.1 COURSE119.2')
lessons('sets','86')
lessons('exponent-laws','20.9 20.10 87 103.3')
lessons('equations','9.5 90 93.1 102.3 INV7')
lessons('probability','36.3 94 COURSE210.1 COURSE210.2 COURSE210.3')
lessons('similarity-scale','18.4 18.5 18.6 97 98 COURSE211.1 COURSE211.2')
lessons('pythagorean','99 COURSE112.1 COURSE112.2')
lessons('proof','COURSE212.1')
lessons('constructions','INV2 INV8 COURSE118.1 COURSE118.2')
lessons('coordinate-geometry','INV3')
lessons('literal-equations','COURSE106.1 COURSE106.2')
lessons('lines-slope','COURSE107.1 COURSE107.2 COURSE117.1 COURSE117.2')
lessons('expressions','COURSE108.1')
lessons('exponential','COURSE110.2')
lessons('factoring','COURSE116.1 COURSE116.2')
lessons('function-graphs','COURSE120.1 COURSE120.2')
lessons('numeral-systems','COURSE213.1 COURSE213.2 COURSE213.3')
lessons('calendar-time','12.4')
lessons('measurement','8.5 8.6')
lessons('fraction-decimal-percent','8.1 8.4 8.7')
foundation={'1.1':'sets','1.2':'expressions','1.3':'expressions','1.4':'number-representation','1.5':'expressions','1.6':'decimal-arithmetic','1.7':'decimal-arithmetic','1.8':'whole-arithmetic','2':'expressions','2.3':'sequences','3':'equations','4':'integers','5':'number-representation','6':'number-theory'}
simple={'whole-division-remainder':'whole-arithmetic','mixed-number-addition':'fractions','three-place-values':'number-representation','segment-difference':'segments','three-whole-number-sum':'whole-arithmetic','missing-addend':'equations','whole-product':'whole-arithmetic','money-product':'decimal-arithmetic','sequence-small':'sequences','sequence-large':'sequences','sequence-short':'sequences','missing-subtraction':'equations','missing-large-addend':'equations','missing-factor':'equations','integer-compare':'integers','factor-check':'number-theory','structured-equation':'equations','structured-linear':'equations'}
def provider(c):
 seen=set()
 while c.get('reuseSourceId'):
  assert c['sourceId'] not in seen;seen.add(c['sourceId']);c=ids[c['reuseSourceId']]
 return c

def classify(c):
 f=c['family'];recipe=c.get('recipe','')
 if f in simple:return simple[f]
 if f=='structured-arithmetic':
  text=json.dumps(c['template']);return 'fractions' if 'fraction' in text or 'rational' in text else 'decimal-arithmetic' if c['template'].get('mode')in ['money','decimal'] or any(n.get('places',0)>0 for n in walk(c['template'])if isinstance(n,dict)) else 'whole-arithmetic'
 if f in ['structured-curriculum87','structured-foundations87']:
  mapping=lesson if f=='structured-curriculum87'else foundation
  return mapping.get(recipe,mapping.get(recipe.split('.')[0]))
 matches={topic for family,topic,patterns in rules if family==f and any(fnmatch.fnmatchcase(recipe,p)for p in patterns)}
 assert len(matches)<=1,(c['sourceId'],matches)
 return next(iter(matches),None)
def walk(v):
 yield v
 if isinstance(v,dict):
  for x in v.values():yield from walk(x)
 elif isinstance(v,list):
  for x in v:yield from walk(x)
missing={};profiles=[]
for c in cat:
 root=provider(c);topic=classify(root)
 if not topic:missing[(root['family'],root.get('recipe',''))]=root['title']
 profiles.append(dict(sourceId=c['sourceId'],providerSourceId=root['sourceId'],bankId=c['sourceId'].split(':')[0],topic=topic,action=root['title'],recipe=root.get('recipe',root['family']),family=root['family']))
if missing:
 print(json.dumps([[*k,v]for k,v in missing.items()],indent=2));raise SystemExit(1)
(out/'analysis-profiles.json').write_text(json.dumps(profiles,indent=2)+'\n')
(out/'family-aliases.json').write_text(json.dumps(alias,indent=2)+'\n')
print('classified',len(profiles),'topics',len(set(p['topic']for p in profiles)))
# Progressions are explicit judgments from the reviewed executable contracts.
tracks={};memberships={c['sourceId']:[]for c in cat}
for line in (out/'progressions.txt').read_text().splitlines():
 if not line or line.startswith('#'):continue
 track,topic,level,demand,prerequisites,selectors=line.split('|');stage=dict(level=int(level),demand=demand,prerequisites=prerequisites,selectors=selectors.split(),sourceIds=[])
 chosen=[];exact=[]
 for selector in stage['selectors']:
  f,recipe=selector.split('/',1);selected=[ids[recipe]] if f in ['@','='] else [c for c in cat if c['family']==alias[f]and c.get('recipe')==recipe];assert selected,selector;(exact if f=='=' else chosen).extend(selected)
 roots={provider(c)['sourceId'] for c in chosen+exact}
 # Match the same executable recipe in other lessons, but retain root identity for exact reuse.
 contracts={(provider(c)['family'],provider(c).get('recipe'))for c in chosen if provider(c).get('recipe')}
 for c in cat:
  root=provider(c)
  if root['sourceId']in roots or (root['family'],root.get('recipe'))in contracts:
   stage['sourceIds'].append(c['sourceId']);memberships[c['sourceId']].append(dict(trackId=track,level=int(level)))
 tracks.setdefault(track,dict(id=track,label=track.replace('-',' ').capitalize(),topic=topic,stages=[]))['stages'].append(stage)
# These chains add distinct constructs; show extensions/prerequisites, not a same-skill difficulty claim.
for t in tracks.values():
 t['stages'].sort(key=lambda s:s['level']);assert len({s['level']for s in t['stages']})==len(t['stages'])
 t['relationMode']='related' if t['id'] in ['geometry-vocabulary','geometric-proof','transformations','ordering-numbers','literal-formulas','statistical-displays'] else 'extension' if t['id']in ['circle-area','unit-conversion','function-evaluation','trigonometry','vectors','log-equations','variation','motion','line-slope','compass-constructions','coordinate-distance','counting-outcomes','statistical-displays','experimental-data','decimal-operations','exponential-models','geometry-vocabulary','locus-constructions','ordering-numbers','geometric-proof','information-sufficiency','set-relations','similar-figures','solid-surface','transformations','solid-volume','contextual-equations','quadratic-graphs','literal-formulas'] else 'difficulty'
for key,mode in json.loads((out/'relation-modes.json').read_text()).items():
 assert mode in ['difficulty','extension','related'];tracks[key]['relationMode']=mode
# Parse fixture prompts and representations from the executable module, never publisher source bodies.
samples=json.loads(subprocess.check_output(['node','-e',"const E=require('./src/course-banks');console.log(JSON.stringify(E.catalog.map(c=>{const qs=[0,1,2].map(index=>E.generate(c.sourceId,{seed:'cross-course-contract',index}));return {id:c.sourceId,prompt:qs[0].prompt,answerKinds:[...new Set(qs.map(q=>q.answer.kind))],representations:[...new Set(qs.map(q=>q.givens?.svg||q.diagram?'diagram and text':q.teacherSvg?'text with teacher diagram':'text or symbolic expression'))]}})))"],cwd=R,text=True));samples={s['id']:s for s in samples}
legacyLessons=json.loads((out/'legacy-lesson-links.json').read_text())
for p in profiles:
 c=ids[p['sourceId']];p.update(title=c['title'],course=c['course'],localGrade=coursePlacement[p['bankId']]['localGrade'],placement=coursePlacement[p['bankId']]['placement'],lessonId=c.get('lessonId') or legacyLessons[c['sourceId']],standard=c.get('standard'),alias=c.get('alias'),memberships=memberships[p['sourceId']],answerKinds=samples[p['sourceId']]['answerKinds'],representations=samples[p['sourceId']]['representations'])
 p['comparisonStatus']='reviewed progression' if p['memberships'] else 'topic reviewed; no validated harder/easier comparison'
chunkReviews={}
for chunk,size in [(1,303),(2,289)]:
 reviews=json.loads((out/f'chunk{chunk}-review.json').read_text());reviewById={r['sourceId']:r for r in reviews}
 assert len(reviewById)==size and set(reviewById)=={r['sourceId'] for r in json.loads((out/f'chunk{chunk}-scope.json').read_text())}
 for p in profiles:
  if p['sourceId'] in reviewById:
   r=reviewById[p['sourceId']];p['review']={'chunk':chunk,'status':'reviewed','reason':r['reason']}
   r['trackIds']=[m['trackId'] for m in p['memberships']]
   r['disposition']='reviewed path' if p['memberships'] else 'reviewed related-only; no ranked counterpart validated'
   if not p['memberships']:p['comparisonStatus']='reviewed related-only; no ranked counterpart validated'
 (out/f'chunk{chunk}-review.json').write_text(json.dumps(reviews,indent=2,ensure_ascii=False)+'\n')
 chunkReviews[chunk]=reviews
# Exact duplicate evidence is explicit reuse, not title equality or seeded prompt matching.
reuse={}
for p in profiles:reuse.setdefault(p['providerSourceId'],[]).append(p['sourceId'])
reuse=[dict(providerSourceId=k,sourceIds=v,relationship='shared canonical provider; original lesson identities retained')for k,v in reuse.items()if len(v)>1]
# Cross-track prerequisites are kept distinct from same-skill easier/harder navigation.
bridges=[
 ['fraction-equivalence',2,'fraction-add-subtract',2,'Equivalent fractions support finding a common denominator.'],
 ['whole-multiplication',2,'fraction-multiply',1,'Whole-number multiplication supports multiplying numerators and denominators.'],
 ['linear-equations',2,'systems-elimination',1,'Solving a linear equation is needed after one variable has been eliminated.'],
 ['powers',2,'exponent-laws',2,'Zero and negative numerical exponents support symbolic exponent laws.'],
 ['integer-arithmetic',2,'expression-evaluation',2,'Signed arithmetic supports substitution of negative values.'],
 ['fraction-add-subtract',2,'rational-sums',2,'Numerical common denominators provide a prerequisite model for algebraic denominators.'],
 ['linear-equations',3,'quadratic-formula',1,'Linear equation transformations support the extension to quadratic equations.'],

]
bridges=[dict(fromTrack=a,fromLevel=b,toTrack=c,toLevel=d,reason=e)for a,b,c,d,e in bridges]
for bridge in bridges:
 for side in ['from','to']:assert any(s['level']==bridge[side+'Level']for s in tracks[bridge[side+'Track']]['stages'])
labels={t:t.replace('-',' ').capitalize()for t in sorted({p['topic']for p in profiles})}
labels.update({'fraction-decimal-percent':'Fractions, decimals and percents','pythagorean':'Pythagorean theorem','whole-arithmetic':'Whole-number arithmetic','number-representation':'Place value and number notation','polar-vectors':'Polar coordinates and vectors','gas-laws':'Gas-law models','proof':'Geometric proof','function-graphs':'Graphs of functions'})
topics=[dict(id=t,label=label,entryCount=sum(p['topic']==t for p in profiles),trackIds=[tr['id']for tr in tracks.values()if tr['topic']==t])for t,label in labels.items()]
data=dict(version='4.0.0',coursePlacement=placement['courses'],scope='teacher-directed original curriculum connections; no mastery or placement inference',profiles=profiles,topics=topics,tracks=list(tracks.values()),bridges=bridges,reuseGroups=reuse)
(R/'src/cross-course-map.js').write_text('(function(root){const data='+json.dumps(data,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathCrossCourseMap=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
(out/'analysis-profiles.json').write_text(json.dumps([dict(**p,samplePrompt=samples[p['sourceId']]['prompt'])for p in profiles],indent=2)+'\n')
(out/'progressions.json').write_text(json.dumps(data['tracks'],indent=2)+'\n');(out/'reuse-review.json').write_text(json.dumps(reuse,indent=2)+'\n')
summary=dict(entries=len(profiles),topics=len(topics),tracks=len(tracks),reviewedProgressionEntries=sum(bool(p['memberships'])for p in profiles),topicOnlyEntries=sum(not p['memberships']for p in profiles),explicitReuseGroups=len(reuse),explicitReuseEntries=sum(len(g['sourceIds'])for g in reuse),banks={b:dict(total=sum(p['bankId']==b for p in profiles),progression=sum(p['bankId']==b and bool(p['memberships'])for p in profiles))for b in sorted({p['bankId']for p in profiles})},unrankedTopics=[t['id']for t in topics if not t['trackIds']])
summary.update(chunk1ReviewedEntries=len(chunkReviews[1]),chunk1PathEntries=sum(bool(r['trackIds']) for r in chunkReviews[1]),chunk2ReviewedEntries=len(chunkReviews[2]),chunk2PathEntries=sum(bool(r['trackIds']) for r in chunkReviews[2]),reviewedTopicOnlyEntries=sum(not p['memberships'] and bool(p.get('review')) for p in profiles),unreviewedTopicOnlyEntries=sum(not p['memberships'] and not p.get('review') for p in profiles))
(out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary))
