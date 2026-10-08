from pathlib import Path
import json,subprocess,hashlib,collections
E=Path(__file__).resolve().parents[1];out=E/'curriculum/mcada-g5/focus-v0.2';out.mkdir(exist_ok=True)
assert json.loads((E/'package.json').read_text())['version']=='0.19.0-rc.2', 'Update the baseline before regenerating coverage for a new runtime.'
entries=json.loads(subprocess.check_output(['node','-e',"const E=require('./src/course-banks');console.log(JSON.stringify(E.catalog))"],cwd=E));tasks=[c for c in entries if c.get('origin')=='original-curriculum-task'];legacy=[c for c in entries if not c.get('origin')];g5=[c for c in legacy if c['sourceId'].startswith('course-87-en:')]
scopes={
'1.1':'Zero, positive integers, negative integers and positive half-integers. Counting starts at 1; classify membership in both sets.',
'1.2':'All four operations, one per variant; enter its name.',
'1.3':'All operand/result positions for all four operations, including repeated addend/factor roles.',
'1.4':'Whole-cent amounts from 1 to 99,999 cents, including single-digit cents; dollars require $ and exactly two decimal places, cents require ¢.',
'1.5':'Three expression forms over x=2–12, y=2–9, z=2–8; includes grouping, multiple variables and exact fractional results.',
'1.6':'Whole 12–999 times 12–99; exact hundredths amount 0.11–9.99 times tenths amount 1.1–9.9. Decimal-only response for decimal multiplication.',
'1.7':'Whole divisors 2–25; nonintegral decimal dividends constructed from exact thousandths quotients. Exact decimal answer.',
'1.8':'Divisors 3–19 and quotients 2–99, nonzero remainder below divisor; alternating quotient-R-remainder and reduced mixed-number response.',
'2.1':'Commutative and associative addition/multiplication, distributive multiplication over addition, additive/multiplicative identity and zero multiplication; identify the property.',
'2.2':'Same property roster; write a complete numeric equality with given digits/order. Both equality directions accepted; bounded grammar, not unrestricted symbolic equivalence.',
'2.3':'Increasing/decreasing constant-step sequences; report the signed step and next three terms.',
'2.4':'Commutative addition/multiplication with two distinct specified digits; write a complete equality.',
'2.5':'Associative addition/multiplication with three distinct specified digits, preserving their order; write a complete equality.',
'2.6':'Evaluate both sides of four counterexample forms: subtraction/division, commutative/associative; unequal results illustrate failure. Worked solution explains the conclusion.',
'3.1':'All four operations, either operand unknown; positive integer operands and results, nontrivial multiplication/division.',
'3.2':'Unknown addend in either position, exact integer answer.',
'3.3':'Unknown factor in either position, factors at least 2.',
'3.4':'Both missing minuend and missing subtrahend, positive integer differences.',
'3.5':'Both missing dividend and missing divisor, quotient at least 2.',
'4.1':'Read three marked integer points on a -10 to 10 number line; order all three and compare A with B.',
'4.2':'Integers from -100 to 100, including negatives, zero and explicit equality branches; enter <, > or =.',
'4.3':'Start -5 to 5; add/subtract positive or negative 1–5 with plotted start, directional arrow and ticks. Result stays within -10 to 10.',
'5.1':'All 15 place positions through hundred trillions, repeated/zero digits and explicit standalone zero; target digit identified by position from the left.',
'5.2':'Whole numbers through 999,999,999,999,999, including zero places and standalone zero; descending nonzero place-value sum, or 0.',
'5.3':'Whole numbers through 999,999,999,999,999 and zero; write English words, accepting hyphens and optional and.',
'5.4':'The same range in words; write digits with optional correctly grouped commas.',
'5.5':'Digit value = digit × positional multiplier across all 15 positions; zeros explicitly included.',
'6.1':'Every positive factor of integers 1–120; ordered list including 1, primes, composites and squares.',
'6.2':'GCF of two integers 2–120, including equal inputs and relatively prime pairs.',
'6.3':'Numbers 1,000–999,999 and all divisors 2,3,4,5,6,8,9,10; yes/no plus last digit, last two/three digits or digit sum; divisor 6 requires both last digit and digit sum.'}
contracts=json.loads((E/'curriculum/mcada-g5/foundations87-v0.1.json').read_text());contracts['status']='verified-bounded-task-contracts';contracts['tested_engine_commit']='219d13b547d5c40c8594565306ee102e38908408';contracts['tested_studio_commit']='11d61ec049df6bde304f117409149462ad860a22';contracts['automatic_assignment_ready']=False
for c in contracts['tasks']:
 c['scope']=scopes[c['recipe']];c['verification']='independent_sampled_math_and_local_browser_checks_passed';c['fullOutcomeVerified']=False
(E/'curriculum/mcada-g5/foundations87-v0.1.json').write_text(json.dumps(contracts,ensure_ascii=False,indent=2)+'\n')
audit=json.loads((E/'curriculum/mcada-g5/focus-v0.1/coverage-audit.json').read_text());audit['schema_version']='0.2.0';audit['engine_commit']=contracts['tested_engine_commit'];audit['studio_commit']=contracts['tested_studio_commit'];audit['prior_audit']='curriculum/mcada-g5/focus-v0.1/coverage-audit.json';audit['authored_tasks']=contracts['tasks'];bystandard={c['standard']:c for c in contracts['tasks']}
for row in audit['outcomes']:
 row['authored_tasks']=[]
 if row['standard'] in bystandard:
  c=bystandard[row['standard']];row['authored_tasks']=[c['sourceId']];row['status']='verified-bounded-task-available';row['prior_required_work']=row['required_work'];row['required_work']='Implemented contract: '+c['scope']+' Remaining curriculum-wide work: integrate outcome-targeted packet delivery and review cross-lesson deduplication; no full-outcome or automatic-assignment certification is implied.';row['scope_review']='bounded-contract-verified'
summ=audit['summary'];summ['explicit_current_task_limitations']=sum(r['scope_review']=='explicit-current-task-limitation-recorded' for r in audit['outcomes']);summ['working_87_bank_entries']=len(g5);summ['authored_87_tasks']=len(tasks);summ['total_working_87_entries']=len(g5)+len(tasks);summ['outcomes_with_verified_authored_contracts']=30;summ['outcomes_with_working_candidates']=sum(bool(r['working_bank_candidates'] or r['separate_grade5_families'] or r['authored_tasks']) for r in audit['outcomes']);summ['outcomes_without_linked_working_task']=331-summ['outcomes_with_working_candidates'];audit['interpretation']='Thirty Lessons 1–6 outcomes now have verified bounded authored task contracts. Other candidate links remain partial components/review leads. 132 imported-source adaptations plus 30 authored tasks equals 162 working 8/7 bank entries. The separate eight Grade 5 families remain a distinct provider. Neither counts nor this inventory enable automatic assignment or certify full curriculum delivery.'
(out/'coverage-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
report='# 8/7 coverage update — foundations v0.2\n\n'+audit['interpretation']+'\n\n'+''.join(f'- {k}: {v}\n' for k,v in summ.items())+'\n## Verified task contracts\n\n| Outcome | Authored ID | Verified bounded scope |\n|---|---|---|\n'
for c in contracts['tasks']:report+='| '+c['standard']+' | '+c['sourceLabel']+' | '+c['scope']+' |\n'
report+='\nThe JSON retains all 331 original outcomes, their previous source candidates and prior work notes. Next priority: Lessons 7–10 geometry vocabulary, fractions, fraction operations and mixed-number representations. Other-course expansion remains paused. Student printing, Word/PDF export and GradeCam-driven packet assignment remain unfinished.\n'
(out/'COVERAGE-AUDIT.md').write_text(report)
current={'version':'0.19.0-rc.2','sourceRecords':5425,'implemented':len(entries),'implementedSourceRecords':len(legacy),'authoredCurriculumTasks':len(tasks),'unintegrated':5425-len(legacy),'byCourse':dict(collections.Counter(c['course'] for c in entries)),'sourceAdaptationsByCourse':dict(collections.Counter(c['course'] for c in legacy)),'records':[{'sourceId':c['sourceId'],'family':c['family'],'status':'implemented-authored-curriculum-task' if c.get('origin') else 'implemented-source-informed-adaptation','exactLegacyReproduction':False} for c in entries]}
(E/'curriculum/course-inventory/current-coverage.json').write_text(json.dumps(current,indent=2)+'\n')
print(json.dumps(summ))
