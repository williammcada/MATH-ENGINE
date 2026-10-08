"""Reproducible provisional task/renderer inventory. Never promotes source readiness."""
import argparse,collections,hashlib,json,pathlib,re,subprocess
p=argparse.ArgumentParser();p.add_argument('--content',type=pathlib.Path,required=True);p.add_argument('--indexes',type=pathlib.Path,required=True);p.add_argument('--out',type=pathlib.Path,required=True);a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
# Multiple labels preserve uncertainty in compound lessons rather than guessing one task.
patterns={
'place-value':r'place value|digit value|expanded (?:notation|form)',
'number-names':r'reading and writing|write.*(?:in words|word form)|use (?:words|digits) to write',
'rounding-estimation':r'round|estimat|significant (?:digit|figure)',
'ordering-comparison':r'order(?:ing)?|compar|greater than|less than|least to greatest',
'whole-number-arithmetic':r'whole numbers?|basic operations|^addition$|^subtraction$|^multiplication$|^division$|find the sum|find the product',
'decimal-arithmetic':r'decimal',
'fraction-arithmetic':r'fraction|mixed number|denominator|reciprocal',
'percent':r'percent|interest|discount|markup',
'ratio-proportion-rate':r'ratio\b|proportion|unit rate|unit price|speed|distance.*rate',
'factor-divisibility':r'factor|divisib|prime|composite|multiples|least common multiple',
'integer-signed-arithmetic':r'signed number|negative number|integer|absolute value',
'operation-properties':r'commutative|associative|distributive|properties|inverse operation',
'order-of-operations':r'order of operations|parenthes|symbols of inclusion',
'sequences-patterns':r'sequence|pattern|arithmetic series|geometric series',
'missing-number-equations':r'missing number|missing addend|unknown number',
'expression-evaluation':r'evaluat|substitut.*expression|variables and',
'algebraic-simplification':r'like terms|simplif.*(?:expression|notation)|algebraic addition',
'linear-equations':r'equation|change sides|isolat.*variable',
'inequalities':r'inequalit',
'systems-of-equations':r'simultaneous|systems? of|elimination|substitution',
'polynomials-factoring':r'polynomial|binomial|trinomial|completing the square',
'quadratics':r'quadratic|parabola',
'powers-roots-radicals':r'exponent|powers?|roots?|radical|scientific notation|logarithm',
'functions':r'function|domain|range of|inverse variation|direct variation',
'geometry-lines-angles':r'angle|segments?|transversal|parallel|perpendicular|lines? and|rays?',
'geometry-shapes':r'polygon|triangle|quadrilateral|circle|congruen|similar|symmetr|transform|reflection|rotation',
'perimeter-circumference':r'perimeter|circumference',
'area-surface-area':r'area|sectors?',
'volume-capacity':r'volume|capacity',
'coordinate-graphs':r'graph|coordinate|slope|intercept|ordered pair',
'pythagorean-distance':r'pythagor|distance formula',
'trigonometry':r'trigonom|sine|cosine|tangent',
'measurement-conversion':r'measur|ruler|protractor|metric|customary|unit multiplier|conversions?|convert.*(?:feet|inches|meters|liters)',
'time-calendar':r'elapsed|time\b|clock|calendar',
'money':r'money|dollar|cents|cost|change from',
'data-statistics':r'mean|median|mode|average|frequency|histogram|survey|statistics|stem.and.leaf|box.and.whisker',
'probability-counting':r'probability|chance|permutation|combination|counting principle',
'sets-logic':r'\bsets?\b|venn|logic|truth',
'word-problems':r'word problem|problems about|story problem'
}
patterns.update({
'arithmetic-operations':r'addition|subtraction|multiplication|division|adding|subtracting|multiplying|dividing|addends?|regrouping|sum|product|quotient|difference',
'number-systems':r'base 2|binary|roman numeral|natural|counting numbers?|ordinal|even|odd',
'number-line':r'number lines?|opposites|reference numbers',
'algebraic-structure':r'coefficients?|algebraic|variables?|terms?|cancellation|canceling|degree|equality|unequal quantities|zero equals zero',
'complex-polar-numbers':r'complex numbers?|polar form|rectangular form',
'reasoning-sufficiency':r'insufficient information|deductive|reasoning|relationships of numbers',
'geometry-constructions':r'compass|straightedge|locus|diagonals|chords|secants|geometry review',
'applied-problems':r'two.step (?:word )?problems?|mixture|motion|distance problem|value problems?|coin problems?',
'scales':r'scales?',
})
patterns['ratio-proportion-rate']+=r'|rates?|distance between|uniform motion'
patterns['measurement-conversion']+=r'|mass|weight'
patterns['money']+=r'|commission|sales tax|coin'
patterns['data-statistics']+=r'|data'
patterns['time-calendar']+=r'|months|year'
patterns['systems-of-equations']+=r'|nonlinear systems'
patterns['polynomials-factoring']+=r'|difference of two squares'
patterns['geometry-shapes']+=r'|spheres|geometric solids|tessellations|prisms|pyramids'
patterns['geometry-constructions']+=r'|geometric constructions|equidistant'
patterns['number-names']+=r'|writing numbers'
patterns['measurement-conversion']+=r'|temperature|millimeters'
patterns['decimal-arithmetic']+=r'|tenths|hundredths'
patterns['ratio-proportion-rate']+=r'|ratios|uniform mointon'
patterns['sets-logic']+=r'|subsets|proofs'
patterns['powers-roots-radicals']+=r'|antilogarithm'
patterns['reasoning-sufficiency']+=r'|finding information'
patterns['data-statistics']+=r'|tables|schedules'
patterns['rational-expressions']=r'rational expressions'
patterns['vectors']=r'vectors'

compiled={k:re.compile(r'\b(?:'+v+r')',re.I) for k,v in patterns.items()}
engine=pathlib.Path(__file__).resolve().parents[1]/'src/course-banks.js'
cat=json.loads(subprocess.check_output(['node','-e',f'console.log(JSON.stringify(require({json.dumps(str(engine))}).catalog))'],text=True));implemented={c['sourceId']:c for c in cat}
allrows=[];manifest={};scripts=collections.defaultdict(list);shapes=collections.defaultdict(list)
for name in ['course-87-en','algebra-half-en','algebra-1-en','algebra-2-en','course-1-en','intermediate-4-en']:
 raw=a.content/(name+'.json');d=json.loads(raw.read_text());manifest[name]=hashlib.sha256(raw.read_bytes()).hexdigest();idx=json.loads((a.indexes/(name+'.json')).read_text());lessons={l['id']:l.get('title',l.get('label','')) for l in idx['lessons']};lessons.update({l['id']:l.get('title',l.get('label','')) for l in d.get('new_lessons',[])})
 rows=[]
 for i in d['items']:
  legacy='blocks' in i;blocks=i.get('blocks',[]);question='\n'.join(blocks[n].get('text','') for n in i.get('question_block_indices',[])) if legacy else i.get('stem_text_with_controls','');title=i.get('title','');lesson=lessons.get(i['lesson_id'],'');context=title or lesson
  direct=[k for k,r in compiled.items() if r.search(question)];contexttags=[k for k,r in compiled.items() if r.search(context)];tags=sorted(set(direct+contexttags));evidence={k:('question-and-topic' if k in direct and k in contexttags else 'question' if k in direct else 'topic-only') for k in tags}
  # Generic words are weaker evidence than explicit task phrases. No guessed primary task.
  scripts_text='\n'.join(blocks[n].get('text','') for n in i.get('script_block_indices',[]));digest=hashlib.sha256(scripts_text.encode()).hexdigest() if scripts_text else None
  if i['id'] in ['algebra-half-en:node:896','algebra-half-en:node:897']:
   tags=['trigonometry'];evidence={'trigonometry':'reviewed-script-sin-cos-tan-and-drawing'}
  if digest:scripts[digest].append(i['id'])
  shape=re.sub(r'\d+(?:\.\d+)?','#',re.sub(r'\s+',' ',question.lower())).strip();shapehash=hashlib.sha256(shape.encode()).hexdigest() if len(shape)>20 else None
  if shapehash:shapes[shapehash].append(i['id'])
  opaque=(sum(b.get('text','').count('[]') for b in blocks if b['type'] in [1,4,6,7]) if legacy else i.get('object_placeholder_count',0))
  sem=question+' '+context
  graph=bool(re.search(r'graph|coordinate|histogram|scatter|stem.and.leaf|box.and.whisker',sem,re.I));diagram=bool(re.search(r'diagram|figure|shown|shaded|ruler|protractor|number line|triangle|polygon|circle|angle|rectangle|solid|prism|cylinder|cube',sem,re.I));table=bool(re.search(r'\btable\b|chart|frequency|schedule',sem,re.I));equation=bool(re.search(r'equation|expression|fraction|exponent|root|radical|polynomial|simplify|evaluate|inequalit',sem,re.I))
  drawing=bool(re.search(r'\b(?:slate|line|nline|circle|arc|plot|text)\s*\(',scripts_text,re.I))
  unresolved=[]
  if opaque:unresolved.append('embedded-objects-not-decoded')
  if legacy:unresolved.append('legacy-rich-layout-not-fully-decoded')
  if scripts_text:unresolved.append('legacy-generation-semantics-not-fully-ported')
  if not tags:unresolved.append('task-unclassified')
  elif evidence and all(e=='topic-only' for e in evidence.values()):unresolved.append('task-inferred-from-topic-only')
  if len(tags)>1:unresolved.append('multiple-task-candidates')
  if legacy and not i.get('answer_block_indices'):unresolved.append('choice-only-answer-semantics')
  row={'id':i['id'],'courseBank':name,'lessonId':i['lesson_id'],'taskCandidates':tags or ['unclassified'],'taskEvidence':evidence,'classificationStatus':'provisional-rule-based','renderingNeeds':{'text':True,'equationCandidate':equation,'diagramCandidate':diagram,'graphCandidate':graph,'tableCandidate':table,'legacyDrawingCode':drawing,'opaqueObjectCount':opaque,'unknownEmbeddedObjectType':bool(opaque)},'sourceFormat':'legacy-generator' if legacy else 'examview','sourceAnswerKind':('explicit-answer-block' if i.get('answer_block_indices') else 'choice-only') if legacy else i['answer']['kind'],'generationStatus':'implemented-adaptation' if i['id'] in implemented else 'not-integrated','implementedFamily':implemented.get(i['id'],{}).get('family'),'scriptGroup':digest,'stemShapeGroup':shapehash,'blockers':unresolved,'sourceRenderingVerified':False}
  rows.append(row)
 allrows+=rows;(a.out/(name+'.json')).write_text(json.dumps(rows,separators=(',',':'))+'\n')
counts=lambda key:dict(collections.Counter(key(r) for r in allrows))
summary={'schemaVersion':'0.1.0','records':len(allrows),'courses':counts(lambda r:r['courseBank']),'integration':counts(lambda r:r['generationStatus']),'taskCandidateCounts':dict(collections.Counter(t for r in allrows for t in r['taskCandidates'])),'classification':{'withQuestionEvidence':sum(any(e in ['question','question-and-topic'] for e in r['taskEvidence'].values()) for r in allrows),'reviewedScriptEvidence':sum(any(e.startswith('reviewed-script') for e in r['taskEvidence'].values()) for r in allrows),'topicOnly':sum(bool(r['taskEvidence']) and all(e=='topic-only' for e in r['taskEvidence'].values()) for r in allrows),'unclassified':sum(r['taskCandidates']==['unclassified'] for r in allrows),'multipleCandidates':sum(len(r['taskCandidates'])>1 for r in allrows)},'renderingCandidateCounts':{k:sum(bool(r['renderingNeeds'][k]) for r in allrows) for k in ['equationCandidate','diagramCandidate','graphCandidate','tableCandidate','legacyDrawingCode','unknownEmbeddedObjectType']},'blockerCounts':dict(collections.Counter(t for r in allrows for t in r['blockers'])),'sourceHashes':manifest,'engineSha256':hashlib.sha256(engine.read_bytes()).hexdigest(),'limits':'Task and rendering tags are provisional indicators, not complete semantic review or proof of readiness. Counts overlap. Identical scripts/stem shapes are reuse candidates, not equivalence certification.'}
groups={'exactScriptGroups':[{'sha256':k,'count':len(v),'sourceIds':v} for k,v in sorted(scripts.items())],'repeatedStemShapes':[{'sha256':k,'count':len(v),'sourceIds':v} for k,v in sorted(shapes.items()) if len(v)>1]};summary['reuse']={'scriptedRecords':sum(map(len,scripts.values())),'uniqueExactScripts':len(scripts),'sharedScriptGroups':sum(len(v)>1 for v in scripts.values()),'repeatedStemShapeGroups':len(groups['repeatedStemShapes'])}
(a.out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');(a.out/'reuse-groups.json').write_text(json.dumps(groups,separators=(',',':'))+'\n');(a.out/'taxonomy.json').write_text(json.dumps(patterns,indent=2)+'\n')
print(json.dumps(summary,indent=2))
