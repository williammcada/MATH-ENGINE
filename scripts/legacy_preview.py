#!/usr/bin/env python3
"""Preview original records with sample values (coverage programme, Phase 0.4). Private review aid.

Writes an HTML page showing each record as the original program would print it for one seed: the question,
then the answer blocks (the first is the key unless the script names another with correct()), drawings as
SVG and equations as MathML. The page contains publisher content, so it is written only under private/
(ignored by git) or another path outside this repository.

Usage:
  SAXON_SOURCE_ZIP=... python3 scripts/legacy_preview.py [--seed N] [--out private/preview.html] ID|--lesson BANK:scope:N ...
IDs are full record IDs (course-87-en:item:SN870002) or bank:item:SOURCEID.
"""
import base64, hashlib, html, json, os, re, sys, zipfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import legacy_rich as LR
import legacy_script as LS

EXPECTED = 'f64a35dc9197da639ca28d354f299812cb9d7f6ebcb64134a73c33b2c52682b5'
ROLES = {1: 'instructions', 4: 'question', 5: 'work area', 6: 'answer', 8: 'choice'}  # 5 is not printed by default (export B2)
SUBST = re.compile(r'`([A-Za-z_][A-Za-z0-9_]*)(?:\[([^\]`]+)\])?`')

def lookup(env, name, index=None):
    name = name.lower()
    if env is None or name not in env.vars:
        return None
    v = env.vars[name]
    if index is not None:
        if not isinstance(v, dict):
            return None
        try:
            v = v.get(int(LS.num(LS.ev(env, LS.parse_expr(index)))))
        except (LS.Unsupported, LS.Restart):
            return None
    return v

def value_html(env, m):
    v = lookup(env, m.group(1), m.group(2))
    if v is None:
        return '<span class="unset">`' + html.escape(m.group(0).strip('`')) + '`</span>'
    return LS.rich(v).html

def value_mathml(env, name):
    m = re.fullmatch(r'([A-Za-z_][A-Za-z0-9_]*)(?:\[(.+)\])?', name)
    v = lookup(env, m.group(1), m.group(2)) if m else None
    if v is None:
        return None
    if isinstance(v, LS.Pic):
        return '<mtext>[drawing]</mtext>'
    return '<mrow>' + LS.rich(v).ml + '</mrow>'

def block_html(env, block):
    text = block.get('text', '')
    objs = LR.objects(base64.b64decode(block.get('raw_base64', '')), kinds=True)
    pieces = text.split('[]') if objs and text.count('[]') == len(objs) else [text]
    out = ''
    for k, piece in enumerate(pieces):
        out += SUBST.sub(lambda m: value_html(env, m), html.escape(piece, quote=False).replace('\n', '<br>'))
        if k < len(pieces) - 1:
            o = objs[k]
            if o['kind'] == 'MTEF':
                try:
                    out += LR.mathml(LR.parse(o['data'])[0], lambda n: value_mathml(env, n))
                except LR.Unsupported as e:
                    out += '<span class="unset">[equation: %s]</span>' % html.escape(str(e))
            else:
                out += '<span class="unset">[%s picture: not yet decoded]</span>' % html.escape(o['kind'])
    return out

def preview(record, seed):
    blocks = record.get('blocks', [])
    src = '\n'.join(b['text'] for b in blocks if b['type'] == 3)
    env, note = None, ''
    if src.strip():
        try:
            env = LS.run(src, seed)
        except LS.Unsupported as e:
            note = 'Script not previewed: ' + str(e)
    else:
        note = 'No script.'
    rows = []
    answers = 0
    for b in blocks:
        role = ROLES.get(b['type'])
        if not role or not b.get('text', '').strip():
            continue
        label = role
        if role in ('answer', 'choice'):
            answers += 1
            correct = getattr(env, 'correct', None) if env else None
            label = ('key' if answers == 1 and not correct else 'choice %d' % answers)
        rows.append('<tr><th>%s</th><td>%s</td></tr>' % (label, block_html(env, b)))
    head = '%s · %s · lesson %s · seed %s' % (record.get('source_id'), html.escape(record.get('title', '')), record.get('lesson_id', '').split(':')[-1], seed)
    if env is not None and getattr(env, 'correct', None):
        note += ' Script names the correct choice: %s.' % html.escape(env.correct)
    return '<section><h2>%s</h2>%s<table>%s</table></section>' % (head, '<p class="note">%s</p>' % note if note else '', ''.join(rows))

PAGE = '''<!doctype html><html><head><meta charset="utf-8"><title>Original records preview (private)</title><style>
body{font:16px "Times New Roman",serif;margin:24px;max-width:900px}h2{font:600 13px system-ui;color:#555;margin:28px 0 6px}
table{border-collapse:collapse}th{font:12px system-ui;color:#777;text-align:left;vertical-align:top;padding:6px 12px 6px 0;width:70px}
td{padding:6px 0}.unset{color:#b00;font:12px monospace}.note{font:12px system-ui;color:#b00}
.frac{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center}.frac>span+span{border-top:1px solid}
</style></head><body><p style="font:12px system-ui;color:#b00">Private: contains publisher content. Do not commit or share.</p>%s</body></html>'''

def main(argv):
    zpath = os.environ.get('SAXON_SOURCE_ZIP')
    if not zpath:
        sys.exit('Set SAXON_SOURCE_ZIP to the private recovery ZIP.')
    if hashlib.sha256(open(zpath, 'rb').read()).hexdigest() != EXPECTED:
        sys.exit('This is not the recovery v0.2 ZIP recorded for the programme.')
    seed, out, targets = 1, None, []
    it = iter(argv)
    for a in it:
        if a == '--seed': seed = int(next(it))
        elif a == '--out': out = next(it)
        elif a == '--lesson': targets.append(('lesson', next(it)))
        else: targets.append(('id', a))
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = os.path.abspath(out or os.path.join(root, 'private', 'preview.html'))
    if out.startswith(root + os.sep) and not out.startswith(os.path.join(root, 'private') + os.sep):
        sys.exit('Write previews under private/ or outside this repository: they contain publisher content.')
    z = zipfile.ZipFile(zpath)
    banks = {}
    def bank(b):
        if b not in banks:
            items = json.loads(z.read(b + '.json'))['items']
            banks[b] = items
        return banks[b]
    sections = []
    for kind, t in targets:
        b = t.split(':')[0]
        for r in bank(b):
            if kind == 'lesson' and r.get('lesson_id') == t or kind == 'id' and (r['id'] == t or b + ':item:' + str(r.get('source_id')) == t):
                sections.append(preview(r, seed))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w').write(PAGE % ''.join(sections))
    print('Wrote', len(sections), 'records to', out)

if __name__ == '__main__':
    main(sys.argv[1:])
