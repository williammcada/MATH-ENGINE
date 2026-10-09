#!/usr/bin/env python3
"""Reproducible source census and conservative curriculum backlog. Does not certify semantic equivalence."""
import argparse, collections, hashlib, json, re, subprocess
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--studio',type=Path,required=True);p.add_argument('--recovery',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();a.output.mkdir(parents=True,exist_ok=True)
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
cat=json.loads(subprocess.check_output(['node','-e',f'console.log(JSON.stringify(require({json.dumps(str((a.studio/"vendor/course-banks.js").resolve()))}).catalog))']))
providers={x['sourceId']:x for x in cat}
# Ordered work packages. Multiple matches are retained; they are routing, never coverage certification.
rules=[
('01','Number notation and place value',r'place value|expanded|writing numbers|writing whole|reading and writing|numerals|ordinal|digits|base 2|binary|roman','Representations, breadth, curriculum87','Preserve magnitude limits, zero positions, words/digits direction, bases and Roman numeral range.'),
('02','Whole arithmetic and missing numbers',r'adding|subtracting|multiplying|dividing|whole number|regroup|addend|subtraction|addition|multipli|divis|arithmetic|fact families|inverse operations|missing numbers|missing factors|unknown numbers','Structured math, breadth, curriculum87','Separate operation, digit lengths, carrying/borrowing, zero-in-quotient, exact/remainder and missing-position variants.'),
('03','Fractions and mixed numbers',r'fraction|mixed number|denominator|reciprocal','Structured math, proportional, reasoning, algebra-review, curriculum87','Separate numerical from symbolic fractions; preserve common/unlike denominators, regrouping, reduction, restrictions and specified methods.'),
('04','Decimals money and estimation',r'tenths|hundredths|placeholder|decimal|money|round|estimat|dollars|cents','Structured math, representations, curriculum87','Set precision and rounding stage; test decimal alignment, zero placeholders, repeaters and money conventions.'),
('05','Number theory and sequences',r'prime|composite|factor|multiple|divisib|sequence|patterns|even|odd','Breadth, quadratic, curriculum87','Separate numerical factors from polynomial factoring; preserve sequence rule, factor-tree and primality demands.'),
('06','Ratio percent and finance',r'ratio|proportion|percent|interest|markup|markdown|commission|profit|sales tax|scale factor','Proportional, measurement, curriculum87','Distinguish part/whole/rate unknowns, totals, percent change, fractional percents, repeated growth and context.'),
('07','Units time and applications',r'conversions of length|consectutive|unequal distances|inch|metric|millimeter|customary|scale|turns|comparing|separating|equal groups|multistep|coin problems|value problems|consecutive|unit|measure|capacity|mass|weight|temperature|time|calendar|month|rate|motion|distance problem|word problem|two.step problem|tables and schedules|finding information','Measurement, breadth, curriculum87','Preserve units and supplied relationships as appropriate; model equal/unequal distances, remainders in context, calendars and multi-step unknowns.'),
('08','Expressions powers and roots',r'parenthes|associative|notations|variable bases|reference numbers|p\^q|product rule with variables|exponent|power|root|radical|evaluat|order of operations|inclusion|scientific notation|signed|opposite|terms|expression|distributive|algebraic phrase','Domain, advanced, reasoning, algebra-review, curriculum87','Preserve exact form, signs and grouping; test domain restrictions, zero/negative/fractional powers and radical equivalence.'),
('09','Equations and symbolic reasoning',r'formulas|formula|completing the square|discriminant|lead coefficients|variables on both sides|subscripted|change sides|only zero|rules of algebra|equation|equalit|algebraic sentences|algebraic addition|properties of algebra|statements|substitution|elimination|symbols of negation','Linear, quadratic, breadth, algebra-review','Differentiate numerical/literal, linear/quadratic/rational/radical, required method, extraneous roots and exceptional solution sets.'),
('10','Polynomials and rational algebra',r'canceling|\bdegree\b|cancellation|polynomial|trinomial|factoring|factorable|difference of two|sum and difference|rational expression|complex fraction|algebraic simplification','Quadratic, breadth, advanced, reasoning, algebra-review','Check nonmonic/grouping/cubes, quotient and remainder, cancellation restrictions and abstract coefficients.'),
('11','Inequalities logic and sets',r'absolute value|greater than|less than|inequal|trichotomy|negat|conjunction|disjunction|sets|set.builder|membership|domain|range|unequal quantities','Domain, advanced, relations, algebra-review','Require complete real solution sets and graphs where demanded; bounded integer recognition is not full real-interval solving.'),
('12','Coordinates functions and graphs',r'number line|dependent and independent|nonlinear systems|graph|coordinate|function|slope|line through|line parallel|perpendicular line|equation of a line|intercept|shift|reflection|variation|parabola|non.linear','Breadth, relations, graph SVG, curriculum87','Separate plotting from recognition, domain/range, transformations and parameters; cover special slopes and nonlinear families.'),
('13','Plane geometry and angles',r'translation|rotation|pythagorean triples|distance between two points|geometry review|corresponding parts|vertical angels|chord|arc|circumscribed|inscribed|equidistant|distance defined|angle|triangle|polygon|quadrilateral|circle|semicircle|parallelogram|trapezoid|rhombus|lines|segments|rays|transversal|congru|similar|symmetr|transform|tessell','Geometry, representations, relations, curriculum87','Correct figure geometry, labels, orientation and markings; separate identify/measure/calculate/draw/justify.'),
('14','Area perimeter and solids',r'\bpi\b|geometric formulas|area|perimeter|circumference|volume|solid|prism|pyramid|cone|cylinder|sphere','Geometry, solids, curriculum87','Include composite/estimated/missing-dimension forms and nets; distinguish surface area, lateral area, height and slant height.'),
('15','Construction proof and investigations',r'construct|proof|deductive|theorem|locus|euclid|manipulative|survey|experiment|demonstrat|drawing|draw |forming|activity','Relations, curriculum87 investigations','Retain production and reasoning: student drawing/construction/proof with rubric, not only choosing a prewritten justification.'),
('16','Data statistics and probability',r'designated order|frequency tables|venn|data|average|mean|median|mode|range|probability|chance|permutation|counting|histogram|stem.and|box.and|normal curve|standard deviation','Statistics, breadth, relations, curriculum87','Separate create/read/interpret, weighted/overall means, sampling and normal/SD computations; preserve replacement and order.'),
('17','Trigonometry vectors and complex numbers',r'euler|complex conjugate|trigonom|sine|cosine|tangent|polar|vector|complex number|imaginary|nonreal|30.60.90|45.45.90','Advanced, breadth, algebra-review','State angle units and quadrants; preserve exact/specified rounded values, resultant direction and complex root behavior.'),
('18','Advanced applications and logarithms',r'pv = nrt|scientific calculator|logarith|exponential|gas law|chemical|mixture|force|boat|age word|joint|combined variation','Reasoning, relations, algebra-review, measurement','Check domain/extraneous roots and log laws; model mixtures, PV=nRT, relative motion and ages explicitly.'),
]
def classify(text):return [n for n,t,rx,m,g in rules if re.search(rx,text,re.I)] or ['19']
stop=set('a an the of and or to in on with by for from as more part numbers number find write solve using about review'.split())
def tokens(t):return set(re.findall('[a-z]{3,}',t.lower()))-stop
catalog_tokens=[(x,tokens(x['title'])) for x in cat]
def candidates(t):
 ts=tokens(t); ranked=[]
 for x,xt in catalog_tokens:
  common=ts&xt
  if len(common)>=2:ranked.append((len(common)/len(ts|xt),x))
 return [{'sourceId':x['sourceId'],'title':x['title'],'family':x['family'],'basis':'lexical candidate only; verify method, representation and range'} for _,x in sorted(ranked,key=lambda z:-z[0])[:4]]
summary=[];lessons=[];records=[];hashes={};duplicates=collections.defaultdict(list)
for course,milestone in [('intermediate-4',2),('course-1',2),('algebra-half',3),('algebra-1',4),('algebra-2',5)]:
 cid=course+'-en';bp=a.studio/'data/course-banks/v0.1'/f'{cid}.json';rp=a.recovery/f'{cid}.json';base=json.loads(bp.read_text());rec=json.loads(rp.read_text());hashes[str(bp)]=H(bp);hashes['recovery/'+rp.name]=H(rp)
 expected=json.loads((a.studio/'data/recovery/v0.2/content-hashes.json').read_text())[cid];assert H(rp)==expected,(cid,'recovery hash mismatch')
 assert {x['id'] for x in base['items']}=={x['id'] for x in rec['items']}
 scope={x['id']:dict(x) for x in base['lessons']};scope.update({x['id']:x for x in rec.get('new_lessons',[])})
 bylesson=collections.defaultdict(list)
 for x in rec['items']:bylesson[x['lesson_id']].append(x)
 assert set(bylesson)<=set(scope)
 for lid,ls in scope.items():
  title=ls.get('title',ls.get('label',''));items=bylesson[lid];existing=[providers[x['id']] for x in items if x['id'] in providers]
  facets=[x.strip() for x in re.split(';',re.sub(r'^(Lesson|Investigation|Appendix)\s+[^:]+:\s*','',title)) if x.strip()]
  
  for item in items:
   sub=item.get('title','').split(' - ',1)[-1].strip()
   if sub and sub.lower() not in {f.lower() for f in facets}: facets.append(sub)
  row={'id':lid,'course':cid,'title':title,'milestone':milestone,'sourceRecordCount':len(items),'workingEntryCount':len(existing),'existingProviders':[{'sourceId':x['sourceId'],'title':x['title'],'family':x['family']} for x in existing],'demands':[{'text':f,'packages':(['17'] if f=='Applications' and course=='algebra-half' else classify(f)),'reuseCandidates':candidates(f),'acceptance':'Demonstrate all mathematical actions, methods, representations and value ranges in this demand; an existing source link alone is not completion.'} for f in facets], 'status':'existing-entry-review-and-gap-fill' if existing else ('scope-only-no-source-items' if not items else 'no-current-course-entry')}
  lessons.append(row)
 for x in rec['items']:
  if 'blocks'in x:
   q='\n'.join(x['blocks'][i]['text'] for i in x['question_block_indices']);script='\n'.join(x['blocks'][i]['text'] for i in x['script_block_indices']);answer='explicit-answer-block' if x['answer_block_indices'] else 'choice-convention-unverified'; visual=bool(re.search(r'\b(slate|line|dot|circle|polygon|plot|draw|picture)\s*\(',script));title=x.get('title','')
  else:q=x.get('stem_text_with_controls','');answer=x['answer']['kind'];visual=x.get('object_placeholder_count',0)>0;title=''
  signature=hashlib.sha256(re.sub(r'\s+',' ',q).strip().encode()).hexdigest();duplicates[signature].append(x['id'])
  txt=title+' '+scope[x['lesson_id']].get('title',scope[x['lesson_id']].get('label',''))+' '+q
  records.append({'id':x['id'],'course':cid,'lessonId':x['lesson_id'],'sourceTitle':title,'workingProvider':providers.get(x['id'],{}).get('family'),'status':'working-source-adaptation' if x['id'] in providers else 'unported-source-record','packages':classify(txt),'promptSHA256':signature,'answerEvidence':answer,'visualDependencyDetected':visual,'visualAbsenceProven':False,'methodFlags':[k for k,rx in [('construct-or-draw',r'construct|draw|sketch'),('justify-or-explain',r'explain|justify|proof|prove|reason'),('specified-method',r'by substitution|by elimination|completing the square|quadratic formula|factor tree|regroup|manipulative'),('table-or-graph',r'graph|table|plot|histogram'),('context',r'word problem|rate|mixture|motion|money|percent')] if re.search(rx,txt,re.I)]})
 summary.append({'course':cid,'milestone':milestone,'indexedScopeRows':len(scope),'populatedScopeRows':sum(bool(v) for v in bylesson.values()),'sourceRecords':len(rec['items']),'workingEntries':sum(x['id'] in providers for x in rec['items']),'scopesWithWorkingEntries':sum(any(x['id'] in providers for x in v) for v in bylesson.values()),'unportedSourceRecords':sum(x['id'] not in providers for x in rec['items'])})
packages=[{'id':n,'title':t,'candidateModules':m,'acceptance':g,'scope':'Routing package; overlapping membership deliberately retained.'} for n,t,rx,m,g in rules]+[{'id':'19','title':'Source-specific residual demands','candidateModules':'Resolve from exact source item and lesson','acceptance':'Inspect source scripts/rich blocks; retain unfamiliar constructs explicitly, without guessed curriculum equivalence.'}]
result={'schema':'1.0','stage':'milestone-1-audit','engineBaseline':'6524895e099c3f088b6bdc894d22234163f32e60','studioBaseline':'f5402984035831863831003b63b920f9d5582d21','handbook':'fd4330863f4cc0812180fbf1de122970a42c7885','courses':summary,'sourceHashes':hashes,'limits':['Automated lexical reuse suggestions are candidates, not verified semantic coverage.','Equal prompt hashes identify review groups, not proven interchangeable questions; diagrams, scripts and keys may differ.','No source publisher text or scripts are executed or republished in this audit.','Lesson demand facets retain compound labels where splitting would invent an unsupported distinction.'],'packages':packages}
for name,data in [('summary',result),('lesson-backlog',lessons),('source-ledger',records),('repetition-review',[{'promptSHA256':h,'sourceIds':ids,'disposition':'review scripts, answer, visual and demand before any merge'} for h,ids in duplicates.items() if len(ids)>1])]:
 (a.output/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
for c in summary:
 rows=[x for x in lessons if x['course']==c['course']];out=['# '+c['course']+' — ordered lesson backlog','', 'Existing entries do not certify complete lesson coverage. Reuse candidates in lesson-backlog.json are deliberately provisional.','', '| Scope | Source records | Working entries | Packages | Next action |','|---|---:|---:|---|---|']
 for x in rows:out.append('| '+x['title'].replace('|','/')+' | '+str(x['sourceRecordCount'])+' | '+str(x['workingEntryCount'])+' | '+','.join(sorted(set(p for d in x['demands'] for p in d['packages'])))+' | '+x['status']+' |')
 (a.output/(c['course']+'.md')).write_text('\n'.join(out)+'\n')
print(json.dumps(summary,indent=2));print('Lessons',len(lessons),'source records',len(records),'demands',sum(len(x['demands']) for x in lessons));print('Residual demands',[(x['course'],d['text']) for x in lessons for d in x['demands'] if d['packages']==['19']])
