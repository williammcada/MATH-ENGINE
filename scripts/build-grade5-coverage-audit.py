from pathlib import Path
import json,hashlib,collections,subprocess
E=Path(__file__).resolve().parents[1];D=E/'curriculum/mcada-g5/focus-v0.1'
D.mkdir(parents=True,exist_ok=True)
assert json.loads((E/'package.json').read_text())['version']=='0.18.0-rc.1', 'Update the audited baseline before rebuilding against a different engine version.'
base=json.loads((E/'curriculum/mcada-g5/v0.2/coverage-map.json').read_text());cat=json.loads(subprocess.check_output(['node','-e',"const E=require('./src/course-banks');console.log(JSON.stringify(E.catalog.filter(c=>c.sourceId.startsWith('course-87-en:')).map(c=>({...c,prompt:E.generate(c.sourceId).prompt}))))"],cwd=E));by={c['sourceId'].split(':')[-1]:c for c in cat}
families=json.loads((E/'curriculum/mcada-g5/implementation-status.json').read_text())['families']
# Explicit task associations reviewed against current authored prompts. These are not automatic full-outcome certifications.
extra={
'1.6':['SN870004'],'2.3':['SX650024','SN870010'],'6.1':['NAV40385'],'8.4':['SX870224'],'8.5':['SX870048'],'9.2':['SX870068'],'14.1':['SX870064'],'19.1':['SX650319'],'20.8':['SX870076'],'27.3':['SAX70082'],'27.4':['SAX70082'],'28.1':['SN870116','SX870148'],'30.3':['SX870068'],'31.2':['SN870224'],'36.1':['SX870196'],'36.3':['SN870816','SN870774','SN870834','SX760144'],'43.1':['SN870224'],'43.3':['SN870230'],'43.4':['SN870224','SN870229','SN870230'],'46.1':['SN870116','SX870148'],'46.3':['SN870247'],'48.1':['SN870031','SN870190','SN870460','SN870464'],'48.2':['SN870224','SN870229'],'53.2':['SX870275','SN870393'],'60.2':['SN870486','SN870487','SN870526'],'66.2':['SN870528'],'70.1':['SX870466'],'71.1':['SN870375'],'74.1':['SN870372','SN870375'],'75.1':['SX870199'],'77.1':['SX870391','SN870526'],'80.3':['SN870556'],'84.1':['SN870560'],'89.5':['SN870451'],'92.1':['SX870430','SX870427'],'92.2':['SX870430','SX870427'],'95.1':['SN870721'],'99.1':['SN870430'],'101.2':['SN870681']}
# Remove supplemental links which do not actually ask the construct, even if nearby mathematics matches.
extra['66.2']=[]
notes={
'1.1':'New task required: include zero and distinguish natural/counting numbers from whole numbers.',
'1.2':'New task required: identify addition, subtraction, multiplication and division by symbol/example.',
'1.3':'New task required: name operands and results, including dividend/divisor and minuend/subtrahend.',
'1.4':'Money multiplication does not assess converting or expressing dollars and cents; add a notation task.',
'1.5':'No current 8/7 candidate is linked. Reuse exact expression machinery after defining variable/range contracts.',
'1.6':'Whole multiplication and decimal money amounts exist; review decimal-by-decimal scope separately.',
'1.7':'Add positive decimal-dividend/whole-divisor division with exact decimal response.',
'1.8':'Current whole-division task accepts remainder notation; add fractional-remainder/mixed-number alternatives.',
'2.1':'Completing given property statements does not test identifying their names. Add property identification.',
'2.2':'Current tasks scaffold two properties. Define the property roster and require an example for each.',
'2.3':'Existing tasks extend constant-step sequences but do not ask students to state the rule.',
'2.4':'Current scaffold supplies the equality; add generation of a complete example using the specified digits.',
'2.5':'Current scaffold supplies the grouping; add generation of a complete example using the specified digits.',
'2.6':'Add valid subtraction/division counterexamples for both noncommutativity and nonassociativity.',
'3.1':'Addition, subtraction and multiplication exist; add both division unknown positions.',
'3.5':'Add missing dividend and divisor variants; do not substitute missing-factor wording.',
'5.1':'Extend place-value tasks through hundred trillions, including zeros and repeated digits.',
'5.2':'Current expanded notation uses a constrained six-digit pattern; broaden numeric scope.',
'5.3':'Current words generator reaches millions, not hundred trillions; extend both reading/writing directions.',
'5.4':'Add word-to-digit conversion through hundred trillions.',
'6.1':'Yes/no factor checking is a component, not listing every factor.',
'6.3':'Add divisibility-rule evidence for all eight specified divisors; computing remainders alone is insufficient.',
'7.2':'Figure naming exists; symbol use, points and complete terminology need explicit tasks.',
'7.3':'Current naming includes parallel/intersecting, not the full oblique/perpendicular distinction.',
'8.5':'Ruler comparison exists; add nearest-sixteenth measurement and student segment drawing.',
'10.1':'Improper-fraction conversion exists, but division prompt currently requires remainder notation.',
'10.2':'Converting an improper fraction does not separately assess identifying improper fractions.',
'14.2':'Current prompt asks for a result; add equation construction.',
'14.3':'Current prompt does not ask the student to write a story; add a writing task with teacher rubric.',
'16.1':'Current conversion is yards to feet; weight and liquid measures are still required.',
'17.3':'Reading the protractor is implemented; drawing an angle is still required.',
'18.4':'True/false similarity facts do not replace identifying figures using corresponding parts.',
'20.4':'Displayed square units do not assess writing multiplied units in exponent form.',
'20.5':'Rectangle perimeter/area responses do not independently assess length versus area unit classification.',
'20.7':'Rectangle area/perimeter does not ask for square side from area.',
'20.8':'Square/root comparison contains a perfect-square-root component; add the direct task.',
'21.1':'Current task is primality yes/no; listing primes is still required.',
'21.6':'Current source adaptation tests primality, not summing primes in an interval.',
'22.2':'Circle-fraction-to-percent conversion is not percent-of-group solving after percent-to-fraction conversion.',
'27.2':'LCM alone does not list common multiples.',
'27.3':'Separate Grade 5 provider requires listing work; link it into the Studio outcome workflow.',
'27.4':'Separate Grade 5 provider requires prime-factorization work; link it into the Studio outcome workflow.',
'29.1':'Current mapped rounding configuration is ten-thousands; add the specified tens/hundreds and strategy evidence.',
'36.1':'Current ratio tasks do not ask for all four notation forms.',
'37.1':'Triangle area uses a labelled base/height; explicit base/height identification is still needed.',
'37.4':'Current square-plus-triangle task uses addition of areas, not subtraction of a removed region.',
'38.2':'The mapped source now generates a histogram. It must not be counted as categorical bar-graph interpretation.',
'40.1':'Solving for a third angle applies the angle sum; it does not provide student verification of the theorem.',
'44.1':'Remainder and rounded-decimal tasks exist separately; add multiple representations of the same quotient.',
'50.1':'Current yards-to-feet answer does not require writing a unit multiplier.',
'50.2':'Current answer does not require a displayed unit-multiplier method.',
'54.1':'Numeric ratio answers do not assess constructing a ratio box.',
'54.2':'Numeric answers alone do not establish use of proportions; add the proportion as required work.',
'55.1':'Current score-average tasks use sums internally but do not directly ask for the total.',
'55.2':'Current task asks for a future group average; add a single missing data value.',
'65.1':'Current ratio results do not require constructing ratio boxes.',
'65.2':'The old linked adaptation asks for a ratio, not solving a total-and-ratio problem by proportion.',
'66.1':'Circumference calculation supplies pi; add a measurement investigation with a rubric.',
'66.3':'Pi is irrational. Frame 22/7 and 3.14 as approximations, never exact equal representations.',
'67.5':'Net-area method exists in the separate Grade 5 provider; surface-area result alone is not equivalent method evidence.',
'77.1':'Current numerical percent prompts do not require translating to an equation.',
'80.1':'Image coordinates are implemented; student drawing is not.',
'80.2':'Image coordinates are implemented; student drawing is not.',
'80.3':'Rotation recognition is implemented; student drawing is not.',
'89.1':'Counting diagonals is implemented; drawing them is not.',
'89.4':'Finding one regular-polygon exterior angle does not directly ask for the full exterior-angle sum.',
'92.2':'Percent-change calculations exist, but the ratio-box method is not required.',
'94.1':'Probability calculation does not assess constructing a tree diagram.',
'101.2':'Formula-rearrangement recognition is a component; translation from geometry and equation solving need explicit tasks.',
'INV1.1':'Circle diagrams and numeric conversions exist; student model construction is still needed.',
'INV1.2':'Diagram reading is not the same as student modeling of equivalence.',
'INV3.2':'Deriving a missing rectangle vertex is not general coordinate reading from plotted points.',
'INV4.3':'Current statistics task uses a restricted data distribution; review even counts and no/multiple modes.',
'INV4.4':'Reading a supplied five-number summary plot differs from calculating quartiles and extremes from raw data.',
'INV4.5':'Selecting a correct box plot does not assess constructing one.'}
rows=[]
for o in base['outcomes']:
 short=o['gradecam_alias'].removeprefix('PS.MAT.G5.')
 old=[r['source_id'] for r in o['source_alignment']['references']]
 ids=list(dict.fromkeys([x for x in old if x in by]+extra.get(short,[])))
 fs=[f for f in families if f['alias']==o['gradecam_alias']]
 status='working-component-needs-scope-review' if ids or fs else 'no-linked-working-task'
 row={'standard':o['source_code'],'alias':o['gradecam_alias'],'lesson':o['lesson'],'objective':o['objective'].strip(),'canonical_outcome':o['canonical_outcome'],'status':status,'working_bank_candidates':[{'sourceId':by[x]['sourceId'],'title':by[x]['title'],'basis':'existing-source-alignment' if x in old else 'current-authored-task-review'} for x in ids],'separate_grade5_families':fs,'legacy_source_candidates':old,'baseline_reuse_candidates':o['engine_baseline']['skill_ids'],'required_work':notes.get(short,o['source_alignment']['finding_and_required_work']),'scope_review':'explicit-current-task-limitation-recorded' if short in notes else 'remaining-semantic-and-range-review','full_outcome_coverage_verified':False,'automatic_assignment_ready':False}
 rows.append(row)
used={c['sourceId'] for r in rows for c in r['working_bank_candidates']}
d={'schema_version':'0.1.0','date':'2026-10-08','scope':'Introduction to PreAlgebra (8/7), Grade 5 only','engine_commit':'ad249acd94c45071ce47109ca7bc03b23c6aeb1e','studio_commit':'f8002bc364595744405dc3680c9c483eff3fc03f','handbook_commit':'fd4330863f4cc0812180fbf1de122970a42c7885','outcome_source':'curriculum/mcada-g5/v0.2/coverage-map.json','outcome_source_sha256':hashlib.sha256((E/'curriculum/mcada-g5/v0.2/coverage-map.json').read_bytes()).hexdigest(),'summary':{'outcomes':len(rows),'working_87_bank_entries':len(cat),'separate_g5_families':len(families),'outcomes_with_working_candidates':sum(bool(r['working_bank_candidates'] or r['separate_grade5_families']) for r in rows),'outcomes_without_linked_working_task':sum(not(r['working_bank_candidates'] or r['separate_grade5_families']) for r in rows),'explicit_current_task_limitations':sum(r['scope_review']=='explicit-current-task-limitation-recorded' for r in rows),'bank_entries_with_outcome_candidates':len(used)},'interpretation':'Candidate associations are components or review leads, not certified full outcome coverage. No-linked-task does not mean no reusable engine primitive. Original legacy-source notes are retained where a new semantic review has not been completed. No automatic assignment is enabled by this report.','working_bank_entries':cat,'bank_entries_without_outcome_candidate':[c['sourceId'] for c in cat if c['sourceId'] not in used],'outcomes':rows}
(D/'coverage-audit.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
report='''# Introduction to PreAlgebra (8/7): outcome reconciliation v0.1

Owner-approved priority on 2026-10-08: finish this curriculum before broadening the other five. All six existing English manual banks remain available. This is an inventory and gap-review checkpoint, not a completed curriculum or a new application build.

'''+''.join(f'- {k}: {v}\n' for k,v in d['summary'].items())+'''
Working candidates include partial components. These counts are not a completion percentage. The eight separate Grade 5 families are not eight additional Studio bank entries. Outcomes with no linked task may reuse existing math primitives after an explicit task/range review. Unassigned bank entries are retained; no forced standard match is made.

## Completion gates

Every outcome needs an explicit task/response contract, required number ranges and representations, canonical reusable skill mapping, necessary lesson links, correct accepted answers and worked solutions, and a tested Studio selection/output path. Show-work, explanation, writing, graphing and construction outcomes retain their student action. Teacher-scored tasks may use a clear rubric; recognizing a multiple-choice diagram cannot silently replace drawing it. Full outcome completion and automatic assignment remain false until the relevant work is verified.

Preserve all 331 original codes and lesson history. Deduplicate recurring assessment skills through reviewed mappings, not text similarity alone. GradeCam domain-less aliases match the same remaining code; its 57 observed Q1 outcomes are not the curriculum boundary.

## Ordered implementation backlog

1. Foundations and arithmetic: Lessons 1–6 contracts first (number sets and vocabulary; money notation; substitution; decimal and fractional division; properties and counterexamples; missing dividend/divisor; signed number lines; place value through hundred trillions; factors and divisibility). Reuse existing exact arithmetic and existing valid entries.
2. Fractions, decimals, percents and contextual problems: finish conversions and operations, method evidence and equation translation; preserve student-written story tasks with rubrics.
3. Ratios, rates, units, exponents and equations: fill missing domains and required methods, scientific notation, signed arithmetic, and equation/inequality graphs.
4. Geometry and investigations: complete actual drawing/construction, correspondence, transformations, angle relations, coordinate work and solids; reuse verified diagrams where suitable.
5. Statistics, probability and remaining investigations: finish graph construction and interpretation, varied datasets and explicit conventions.
6. Integrate outcome targeting and verify manual/GradeCam-informed packets, student output and teacher keys. Print/export remains unfinished and requires its own concrete output checks.

These are work groups, not separate permission gates. Prioritize reuse; do not expand other-course mappings simply because a shared implementation can support them. Run focused checks for changed math and one suitable integration gate, rather than repeatedly re-auditing unchanged providers.

## Current task gaps worth protecting against

- The mapped bar-graph source currently generates a histogram; these are different constructs.
- Existing number-word output reaches millions; the objective requires hundred trillions.
- Current mapped rounding is to ten-thousands; Lesson 29 asks for tens/hundreds.
- Coordinates or multiple-choice diagrams do not complete drawing outcomes.
- Answers to ratio, factorization or conversion problems do not establish the explicitly required method.
- 3.14 and 22/7 approximate pi; neither equals pi exactly.

## All outcome rows

| Code | Required learning outcome | Working candidates | Remaining work / limitation |
|---|---|---|---|
'''
for r in rows:
 vals=[r['standard'],r['objective'],', '.join([c['sourceId'].split(':')[-1] for c in r['working_bank_candidates']]+[f['family_id'] for f in r['separate_grade5_families']]) or 'No linked working task',r['required_work']]
 report+='| '+' | '.join(v.replace('|','/').replace('\n',' ') for v in vals)+' |\n'
(D/'COVERAGE-AUDIT.md').write_text(report)
print(json.dumps(d['summary']))
