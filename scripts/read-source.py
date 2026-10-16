#!/usr/bin/env python3
"""Read original records for porting (coverage programme, Phase 0.2). Private material stays private.

The recovered content lives only in the private repository williammcada/saxon-source-private
(recovery/Course-Bank-Content-Recovery-v0.2.zip). Point SAXON_SOURCE_ZIP at that file. This script
prints records to the terminal for a porting session; it never writes publisher text into this
repository, and nothing it prints may be committed here. Commit only IDs, lesson links, block hashes
and the new, original Engine generators.

Usage:
  SAXON_SOURCE_ZIP=/path/Course-Bank-Content-Recovery-v0.2.zip python3 scripts/read-source.py course-87-en:item:SN870002 [...]
  SAXON_SOURCE_ZIP=... python3 scripts/read-source.py --lesson course-87-en:scope:1
"""
import base64, json, os, sys, zipfile, hashlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import legacy_rich
zpath = os.environ.get('SAXON_SOURCE_ZIP')
if not zpath: sys.exit('Set SAXON_SOURCE_ZIP to the private recovery ZIP.')
EXPECTED = 'f64a35dc9197da639ca28d354f299812cb9d7f6ebcb64134a73c33b2c52682b5'
if hashlib.sha256(open(zpath, 'rb').read()).hexdigest() != EXPECTED: sys.exit('This is not the recovery v0.2 ZIP recorded for the programme.')
z = zipfile.ZipFile(zpath)
cache = {}
def bank(b):
    if b not in cache:
        items = json.loads(z.read(b + '.json'))['items']
        cache[b] = {i['id']: i for i in items}
        cache[b].update({b + ':item:' + i['source_id']: i for i in items if i.get('source_id')})  # bank:item:SOURCEID also works
    return cache[b]
args = sys.argv[1:]
if not args: sys.exit(__doc__)
ids = []
if args[0] == '--lesson':
    lesson = args[1]; b = lesson.split(':')[0]
    items = bank(b)
    ids = [k for k, v in items.items() if v.get('lesson_id') == lesson]
else:
    ids = args
NAMES = {0: 'header', 3: 'script', 4: 'question', 8: 'answer/choice', 9: 'end'}
for rid in ids:
    r = bank(rid.split(':')[0]).get(rid)
    if not r: print('== not found:', rid); continue
    print('==', rid, '|', r.get('title', ''), '| lesson', r.get('lesson_id'))
    for b in r.get('blocks', []):
        t = b.get('text', '')
        if not t.strip(): continue
        # Embedded objects replace the [] placeholders in order: equations decoded to a readable form, pictures marked.
        objs = legacy_rich.objects(base64.b64decode(b.get('raw_base64', '')), kinds=True)
        if objs and t.count('[]') == len(objs):
            parts = t.split('[]')
            t = parts[0]
            for o, rest in zip(objs, parts[1:]):
                if o['kind'] == 'MTEF' and o['data']:
                    try: t += '⟦' + legacy_rich.linear(legacy_rich.parse(o['data'])[0]) + '⟧'
                    except legacy_rich.Unsupported as e: t += '⟦equation: ' + str(e) + '⟧'
                else: t += '⟦' + o['kind'] + ' picture⟧'
                t += rest
        print('  [' + NAMES.get(b['type'], 'type ' + str(b['type'])) + '] ' + t.replace('\n', '\n      '))
