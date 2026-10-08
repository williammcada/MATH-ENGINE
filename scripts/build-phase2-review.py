#!/usr/bin/env python3
"""Reproducible curriculum review evidence and explicit canonical mappings.
Semantic scope and merges below are reviewed inputs, not inferred by text similarity.
"""
from pathlib import Path
import json,subprocess,hashlib
E=Path(__file__).resolve().parents[1];P=E/'curriculum/mcada-g5/phase2-v0.1'
scopes=dict(line.split('\t',1) for line in (P/'review-scopes.tsv').read_text().splitlines())
js="""const E=require('./src/course-banks');let rows=[];for(const c of E.catalog.filter(x=>x.origin)){const samples=Array.from({length:168},(_,index)=>E.generate(c.sourceId,{seed:'phase2-review',index}));const kinds=[...new Set(samples.map(q=>q.answer.kind))];rows.push({...c,variation:{sampleCount:168,promptForms:new Set(samples.map(q=>q.prompt)).size,questionForms:new Set(samples.map(q=>E.renderQuestion(q))).size,referenceForms:new Set(samples.map(q=>E.answerText(q))).size,observedBranches:[...new Set(samples.map(q=>q.givens.parameters.branch).filter(x=>x!==undefined))].sort((a,b)=>a-b),responseKinds:kinds,teacherReview:samples.some(q=>q.answer.kind==='teacher'),hasDiagram:samples.some(q=>q.givens.svg||q.givens.diagram),phase2Extended:samples.some(q=>q.givens.parameters.phase2)},sample:{seed:samples[0].seed,index:0,prompt:samples[0].prompt,reference:E.answerText(samples[0]),rubric:samples[0].answer.rubric||[]}})}console.log(JSON.stringify(rows));"""
tasks=json.loads(subprocess.check_output(['node','-e',js],cwd=E))
# A skill is an assessable construct+method, not a topic. Composite outcomes may link several skills.
facets={t['recipe']:['mcada87:'+t['recipe']] for t in tasks}
labels={f'mcada87:{t["recipe"]}':t['objective'] for t in tasks}
def assign(ids,skill,label):
 labels[skill]=label
 for r in ids.split(): facets[r]=[skill]
def composite(r,ids):facets[r]=list(dict.fromkeys(x for s in ids.split() for x in facets[s]))
assign('7.4 17.2','mcada87:angle-classification','Classify acute, right, obtuse and straight angles by measure')
assign('6.2 24.2','mcada87:gcf-two','Find the greatest common factor of two whole numbers')
assign('31.2 43.1','mcada87:decimal-to-fraction','Convert a decimal to a reduced fraction')
assign('43.4 48.2','mcada87:fdp-equivalence','Complete fraction–decimal–percent equivalence sets')
assign('71.1 74.1','mcada87:fraction-known-find-whole','Find the whole from a known fractional part')
assign('1.7 35.3','mcada87:decimal-divide-whole','Divide a decimal dividend by a whole-number divisor')
assign('20.8','mcada87:positive-perfect-square-root','Find the positive root of a perfect square')
assign('35.2','mcada87:decimal-product','Multiply decimal numbers')
labels['mcada87:whole-product']='Multiply whole numbers'
facets['1.6']=['mcada87:whole-product','mcada87:decimal-product']
# General equation outcome shares its four operation components with later focused rows.
composite('3.1','3.2 3.3 3.4 3.5')
# Property illustration includes the two dedicated illustration outcomes; identity/distributive
# examples remain distinct components, never replaced by recognition-only 2.1.
facets['2.2']=facets['2.4']+facets['2.5']+['mcada87:illustrate-distributive','mcada87:illustrate-identities']
labels.update({'mcada87:illustrate-distributive':'Illustrate the distributive property with an equality','mcada87:illustrate-identities':'Illustrate additive/multiplicative identity and zero multiplication with equalities'})
# Multi-representation outcomes reuse the earlier directional conversion facets.
assign('43.2','mcada87:fraction-to-decimal','Convert fractions and mixed numbers to decimals')
assign('43.3','mcada87:percent-to-decimal','Convert a percent to a decimal')
labels.update({'mcada87:percent-to-fraction':'Convert a percent to a reduced fraction','mcada87:decimal-to-percent':'Convert a decimal to a percent','mcada87:fraction-to-percent':'Convert a fraction to a percent'})
for r in ['43.4','48.2']:
 facets[r]=['mcada87:decimal-to-fraction','mcada87:fraction-to-decimal','mcada87:percent-to-decimal','mcada87:percent-to-fraction','mcada87:decimal-to-percent','mcada87:fraction-to-percent']
facets['95.1']=facets['70.1']+facets['70.2']+['mcada87:cylinder-volume']
labels['mcada87:cylinder-volume']='Find the volume of a right cylinder'
# Explicit related groups preserve differences in method, representation or complexity.
related=[
 ('fraction-equivalence','15.1 15.2 15.3 24.1 INV1.2','Creating, recognizing, reducing and prime-factor cancellation are different evidence demands.'),
 ('prime-factorization','21.3 21.4 21.5','Same factorization content, but factor-tree and division-by-primes methods must be retained.'),
 ('lcm','27.2 27.3 27.4','Common-multiple listing, LCM listing and prime-factor LCM are not interchangeable.'),
 ('fdp','8.1 8.7 31.1 31.2 43.1 43.2 43.3 43.4 48.1 48.2','Visual interpretation, individual conversions and full equivalence sets have different task demands.'),
 ('fraction-whole','71.1 71.2 74.1','Numerical whole-finding shares one canonical skill; diagram production retains its own facet.'),
 ('metric','32.2 34.3 50.2 88.1 88.2','Length is a subset of metric measures; unit-cancellation methods, two-stage and area conversions remain distinct.'),
 ('decimal-arithmetic','1.6 1.7 35.2 35.3 45.1','General products share decimal multiplication; decimal divisor adds a new requirement.'),
 ('integer-numberline','4.3 59.2 64.1 68.1 91.2','Reading supplied movement, drawing movement and symbolic simplification are distinct.'),
 ('formula','1.5 41.1 52.2 91.1 COURSE108.1','Formula context, powers and negative substitution extend earlier variable substitution.'),
 ('powers','20.9 20.10 47.3 47.4 57.1 69.1 83.1 83.2 87.1 103.2 103.3','Base type, signed exponents, normalization and monomial methods distinguish the facets.'),
 ('symmetry','58.1 INV6.3 INV6.4','General and quadrilateral reflection share content; central symmetry is rotational, not reflection.'),
 ('functions','58.2 58.3 85.2 INV9.1 INV9.2 INV9.3 COURSE117.1 COURSE117.2','Infer rule, substitute, construct table, read graph and draw graph are distinct.'),
 ('triangles','37.1 37.2 40.1 40.2 62.1 62.2 62.3 97.1 97.2 97.3 99.1','Height, area, angles, classification, correspondence, proportionality and Pythagoras are not merged.'),
 ('volume','70.1 70.2 95.1 COURSE113.1 COURSE113.2 COURSE113.3','Right-solid volume includes prism/cylinder breadth; pyramid/cone/sphere formulas are additional constructs.'),
 ('surface','67.5 105.1 105.2','Net-based method, broader right-solid surface area and sphere formula are distinct.'),
 ('roots','20.7 20.8 20.12 100.1 100.2 100.3 105.3 105.4 COURSE109.1 COURSE109.2','Area application, fractional roots, approximation, two square roots and cube roots retain distinct demands.'),
 ('percent','22.2 60.2 77.1 81.1 92.2','Fraction conversion, equation translation, proportion solving and change ratio boxes retain method/unknown differences.'),
 ('ratios','36.1 36.2 39.1 39.2 54.1 54.2 65.1 65.2 72.1','Notation, equality test, missing term, ratio-box and total/implicit contexts are different facets.'),
 ('graphs','38.2 38.3 38.4 INV5.1 INV5.2 INV5.3','Interpretation is not construction, and graph types measure different representation skills.'),
 ('statistics','28.2 55.1 55.2 55.3 INV4.1 INV4.2 INV4.3 INV4.4 INV4.5 INV4.6','Mean/reverse mean/combined mean, summaries, and graph creation/reading are kept separate.'),
 ('equations','3.1 3.2 3.3 3.4 3.5 9.5 90.1 90.2 93.1 102.3 INV7.1 INV7.2','Shared simple operations do not erase reciprocal methods, coefficient types, multistep equations or balance/check evidence.'),
 ('construction','7.2 8.5 17.3 INV2.1 INV2.2 INV2.3 INV2.4 INV8.1 COURSE118.1 COURSE118.2','Instrument construction, measurement and naming are reviewed with their original demands.'),
]
for name,ids,reason in related:
 for r in ids.split(): assert r in facets,r
rows=[]
for t in tasks:
 r=t['recipe'];section=r.split('.')[0];assert section in scopes,section
 relatedRows=[{'group':name,'reason':reason} for name,ids,reason in related if r in ids.split()]
 rows.append({'sourceId':t['sourceId'],'recipe':r,'standard':t['standard'],'alias':t['alias'],'lessonId':t['lessonId'],'originalObjective':t['objective'],'canonicalSkillIds':facets[r], 'relatedGroups':relatedRows,'reviewDecision':'accepted-at-documented-scope','curriculumCoverageAccepted':bool(t['standard']),'automaticAssignmentReady':False,'reviewedScope':scopes[section],'variationEvidence':t['variation'],'example':t['sample'],'reviewLimit':'Finite representative curriculum scope; not all possible numeric ranges, all publisher items, automatic grading of written work, or proof of learner mastery.'})
skills=[]
for skill in sorted(set(s for row in rows for s in row['canonicalSkillIds'])):
 members=[r for r in rows if skill in r['canonicalSkillIds']]
 skills.append({'id':skill,'label':labels[skill],'sourceIds':[r['sourceId'] for r in members],'standardCodes':[r['standard'] for r in members if r['standard']]})
source=E/'curriculum/mcada-g5/v0.2/coverage-map.json'
report={'schemaVersion':1,'date':'2026-10-09','phase':2,'status':'reviewed-candidate-awaiting-verification','handbookCommit':'fd4330863f4cc0812180fbf1de122970a42c7885','baselineEngineCommit':'09103c407081b73e7642606c1d685862869a3bae','baselineStudioCommit':'f4d60ded9c9acfd2d291c468de6c727502569c13','outcomeSourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'summary':{'codedOutcomes':sum(bool(r['standard']) for r in rows),'uncodedTasks':sum(not r['standard'] for r in rows),'reviewedTasks':len(rows),'extendedTasks':sum(r['variationEvidence']['phase2Extended'] for r in rows),'canonicalSkills':len(skills),'sharedSkills':sum(len(s['sourceIds'])>1 for s in skills),'automaticAssignmentReady':0},'policy':{'acceptance':'Representative coverage of the original construct at the documented finite course scope; independent verification gates are separate.','deduplication':'Shared skill IDs flag overlap for teacher review; never delete original outcomes, silently drop selected questions, or equate related methods.','phase3':'Packet assembly must balance these facets and variants; one randomly generated question cannot certify every facet of a broad outcome.'},'outcomes':rows,'canonicalSkills':skills}
verification=E/'docs/verification/phase2-results.json'
if verification.exists():
 record=json.loads(verification.read_text())
 if record.get('result')=='passed' and all((E/path).exists() and hashlib.sha256((E/path).read_bytes()).hexdigest()==digest for path,digest in record['verifiedInputs'].items()):
  report['status']='complete';report['verification']='docs/verification/phase2-results.json'
(P/'coverage-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
runtime={'schemaVersion':1,'version':'0.21.0-rc.2','outcomes':[{k:r[k] for k in ['sourceId','standard','alias','canonicalSkillIds','reviewDecision','curriculumCoverageAccepted','automaticAssignmentReady']} for r in rows],'skills':skills}
(E/'src/curriculum87-assessment-map.js').write_text('(function(root){const data='+json.dumps(runtime,ensure_ascii=False,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathCurriculum87AssessmentMap=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
md=['# Phase 2 outcome review','', ('Status: phase 2 complete; verification passed.' if report['status']=='complete' else 'Status: reviewed candidate, verification pending.')+' Every original code and lesson is retained. Acceptance is scoped curriculum content acceptance, not learner mastery or automatic assignment.','',f"Reviewed {len(rows)} authored tasks; {report['summary']['codedOutcomes']} coded outcomes. {report['summary']['extendedTasks']} task families expanded. Shared canonical skills flag repetition; distinct methods are kept separate.",'', '| Outcome / manual task | Decision | Canonical facets | Sampled forms / response |','| --- | --- | --- | --- |']
for r in rows:md.append(f"| {r['standard'] or r['recipe']} | Accepted at documented scope | {', '.join(r['canonicalSkillIds'])} | {r['variationEvidence']['questionForms']} / {', '.join(r['variationEvidence']['responseKinds'])} |")
md+=['','Read [the machine-readable review](coverage-review.json) for original wording, exact scope, sample prompts/references, variation counts and related-method distinctions. [Scope notes](review-scopes.tsv) are reviewed inputs. Neither broad outcome acceptance nor an overlap flag authorizes automatic assignment.','', 'Phase 3 remains packet/teacher-key output, GradeCam targeting and printing/export verification.']
(P/'COVERAGE-REVIEW.md').write_text('\n'.join(md)+'\n')
print(json.dumps(report['summary']))
