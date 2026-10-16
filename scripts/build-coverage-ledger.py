#!/usr/bin/env python3
"""Coverage ledger for every original source record (coverage programme, Phase 0.1).

Every one of the 5,425 English legacy records gets exactly one state:
  open                 not yet done
  covered-provisional  an existing source-informed adaptation; still to be reviewed against the
                       completeness definition when its lesson's batch runs
  covered              a working task asks the same thing in the same response form, with the same
                       diagram/graph needs and difficulty range, checked mathematically and in print
  consolidated         same task demand as another covered record; points to it
  retired              defective, duplicate in the source, or not mathematics; owner sign-off required

Inputs (all in this repository): the course inventory, current coverage, every source-mapping file and
the batch decision files in curriculum/coverage-ledger/v0.1/decisions/. No publisher text is read or written.
Output: curriculum/coverage-ledger/v0.1/ledger.json (deterministic).
"""
import glob, hashlib, json, pathlib, sys
from collections import Counter, defaultdict

root = pathlib.Path(__file__).resolve().parents[1]
base = root / 'curriculum/coverage-ledger/v0.1'
STATES = ['open', 'covered-provisional', 'covered', 'consolidated', 'retired']
BANKS = ['course-87-en', 'algebra-half-en', 'algebra-1-en', 'algebra-2-en', 'course-1-en', 'intermediate-4-en']
inputs = {}
def load(p):
    inputs[str(p.relative_to(root))] = hashlib.sha256(p.read_bytes()).hexdigest()
    return json.loads(p.read_text())

records = {}
for bank in BANKS:
    d = load(root / 'curriculum/course-inventory/v0.1' / (bank + '.json'))
    for r in (d['records'] if isinstance(d, dict) else d):
        records[r['id']] = {'id': r['id'], 'bank': bank, 'lessonId': r['lessonId'], 'state': 'open'}
assert len(records) == 5425, len(records)

# Existing adaptations: implemented in current coverage, with their mapping evidence where recorded.
coverage = load(root / 'curriculum/course-inventory/current-coverage.json')
implemented = {r['sourceId']: r for r in coverage['records'] if r['status'] == 'implemented-source-informed-adaptation'}
mapped = {}
for f in sorted(glob.glob(str(root / 'curriculum/source-mappings/*.json'))):
    for m in load(pathlib.Path(f)):
        mapped.setdefault(m['sourceId'], pathlib.Path(f).name)
for sid, r in implemented.items():
    assert sid in records, sid
    records[sid].update(state='covered-provisional', by=[sid], basis=mapped.get(sid, 'course-banks catalog (initial adaptations)'), family=r.get('family'))

# Batch decisions override, in file order. Each decision names its batch, reviewer and date.
decisions = sorted(glob.glob(str(base / 'decisions/*.json')))
for f in decisions:
    batch = load(pathlib.Path(f))
    for d in batch['decisions']:
        rid = d['id']
        assert rid in records, f + ': unknown record ' + rid
        st = d['state']
        assert st in ('covered', 'consolidated', 'retired'), f + ': ' + rid + ' bad state ' + st
        entry = {'state': st, 'batch': batch['batch'], 'reviewed': batch['date'], 'note': d.get('note', '')}
        if st == 'covered':
            assert d.get('by'), rid + ': covered needs the working task(s) in "by"'
            entry['by'] = d['by']
        if st == 'consolidated':
            assert d.get('into'), rid + ': consolidated needs "into" (a covered record)'
            entry['into'] = d['into']
        if st == 'retired':
            assert d.get('ownerApproval'), rid + ': retirement needs ownerApproval (who and when)'
            assert d.get('reason'), rid + ': retirement needs a reason'
            entry.update(ownerApproval=d['ownerApproval'], reason=d['reason'])
        records[rid] = {**{k: records[rid][k] for k in ('id', 'bank', 'lessonId')}, **entry}
for r in records.values():
    if r['state'] == 'consolidated':
        assert records[r['into']]['state'] in ('covered', 'covered-provisional'), r['id'] + ' consolidates into an uncovered record'

lessons = defaultdict(Counter)
banks = defaultdict(Counter)
for r in records.values():
    lessons[(r['bank'], r['lessonId'])][r['state']] += 1
    banks[r['bank']][r['state']] += 1
def summary(c):
    n = sum(c.values())
    done = c['covered'] + c['consolidated']
    return {**{s: c[s] for s in STATES}, 'records': n, 'percentComplete': round(100 * done / n, 1) if n else 0.0,
            'percentIncludingProvisional': round(100 * (done + c['covered-provisional']) / n, 1) if n else 0.0}
out = {
    'format': 'coverage-ledger', 'version': '0.1',
    'definition': 'Roadmap §2 (owner decision D1, 2026-10-14): a course is complete when no record is open, at least 95% are covered or consolidated, retirements carry owner sign-off, and every lesson offers at least as many distinct task types as the original.',
    'inputs': dict(sorted(inputs.items())),
    'totals': summary(Counter(r['state'] for r in records.values())),
    'banks': {b: summary(banks[b]) for b in BANKS},
    'lessons': [{'bank': b, 'lessonId': l, **summary(c)} for (b, l), c in sorted(lessons.items())],
    'records': [records[k] for k in sorted(records)],
}
base.mkdir(parents=True, exist_ok=True)
(base / 'ledger.json').write_text(json.dumps(out, ensure_ascii=False, indent=0, sort_keys=False) + '\n')
print('Ledger:', json.dumps(out['totals']))
