"""Import lesson display names into the engine (host-integration-v0.1 follow-up, Engine 0.34.0-rc.3).

Source: Test and Practice Studio's course-bank index (data/course-banks/v0.1) and recovery overlays
(data/recovery/v0.2), which hold the publisher lesson labels. Display names and teaching order follow
Studio's scripts/build-studio.py exactly, so Studio, MathQuest and Math Arcade name lessons the same way.
Usage: python3 scripts/import-lesson-labels.py /path/to/test-and-practice-studio
"""
import hashlib, json, pathlib, re, subprocess, sys
studio = pathlib.Path(sys.argv[1]).resolve()
root = pathlib.Path(__file__).resolve().parents[1]
base = studio / 'data/course-banks/v0.1'
catalog = json.loads((base / 'catalog.json').read_text())
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
files, out = [], {}

def teaching_order(display):
    m = re.match(r'(Lesson|Lesson / topic) (\d+)\b', display)
    if m: return [int(m.group(2)), 0, '']
    m = re.match(r'Investigation (\d+)([A-Z]?)\b', display)
    if m: return [10 * int(m.group(1)), 1, m.group(2)]
    assert display.startswith('Appendix'), 'Unrecognised lesson label: ' + display
    return [10 ** 6, 0, re.sub(r'\d+', lambda n: n.group().zfill(6), display.lower())]

for entry in catalog['banks']:
    p = base / entry['path']; assert sha(p) == entry['sha256'], p
    files.append({'path': str(p.relative_to(studio)), 'sha256': sha(p)})
    d = json.loads(p.read_text())
    lessons = {l['id']: dict(l) for l in d['lessons']}
    overlay = studio / 'data/recovery/v0.2' / (d['id'] + '-links.json')
    if overlay.exists():
        files.append({'path': str(overlay.relative_to(studio)), 'sha256': sha(overlay)})
        for l in json.loads(overlay.read_text())['new_lessons']: lessons[l['id']] = l
    rows = []
    for l in lessons.values():
        label = l.get('label') or ('Lesson / topic ' + str(l.get('source_number', '')))
        title = l.get('title')
        rows.append({'id': l['id'], 'display': label + (': ' + title if title and title != label else '')})
    rows.sort(key=lambda r: (teaching_order(r['display']), r['id']))
    seen = {}
    for r in rows: seen.setdefault(r['display'], []).append(r)
    for same in seen.values():
        if len(same) > 1:
            for r in same:
                sec = re.search(r'Section0*(\d+)', r['id']); assert sec, 'Cannot tell apart ' + r['display']
                r['display'] += ' (source section ' + sec.group(1) + ')'
    for i, r in enumerate(rows): out[r['id']] = {'bankId': d['id'], 'display': r['display'], 'order': i}

commit = subprocess.check_output(['git', '-C', str(studio), 'rev-parse', 'HEAD']).decode().strip()
result = {'version': '0.1', 'source': {'repository': 'williammcada/test-and-practice-studio', 'commit': commit, 'rule': 'scripts/build-studio.py lesson display and teaching order', 'files': files},
          'count': len(out), 'lessons': out}
(root / 'curriculum/lesson-labels/v0.1/lesson-labels.json').write_text(json.dumps(result, indent=1, ensure_ascii=False) + '\n')
print(json.dumps({'lessons': len(out), 'studioCommit': commit}))
