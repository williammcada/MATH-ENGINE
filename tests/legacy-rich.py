#!/usr/bin/env python3
"""Tests for the legacy equation decoder (scripts/legacy_rich.py), coverage programme Phase 0.3.

Part 1 always runs: equation objects built by hand in this file (original test data, no publisher content)
exercise every record type and template the banks use.
Part 2 runs only when SAXON_SOURCE_ZIP points at the private recovery ZIP: every embedded object in the four
generator banks must be located and every equation must decode; the export reference items must decode to
the forms checked against the owner's printed exports (compared by hash, so no source text is stored here).
"""
import base64, hashlib, json, os, sys, zipfile
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'scripts'))
import legacy_rich as L

HDR = bytes([4, 1, 0, 3, 5])
def ch(tf, c, opt=0): return bytes([0x02 | opt << 4, tf, c])
def word(s, tf=0x83): return b''.join(ch(tf, ord(x)) for x in s)
def sub(name): return ch(0x82, 0xC1) + word(name) + ch(0x82, 0xC1)
def line(*parts): return b'\x01' + b''.join(parts) + b'\x00'
NULL = b'\x11'
def tmpl(sel, var, *slots): return bytes([3, sel, var, 0]) + b''.join(slots) + b'\x00'
def eq(*parts): return HDR + b'\x0a' + line(*parts) + b'\x00' + b'\x00' * 8 + b'\x55\x8b\xec'  # trailing garbage is ignored
def lin(b): return L.linear(L.parse(b)[0])
SP = ch(0x98, 8)

checks = 0
def same(got, want):
    global checks
    assert got == want, (got, want)
    checks += 1

# Characters, spacing, substitutions, symbols.
same(lin(eq(ch(0x82, ord('$')), sub('m'), SP, SP, ch(0x86, 0xB8), SP, sub('n'))), '$`m` ÷ `n`')
same(lin(eq(sub('x'), ch(0x86, 0x3D), ch(0x88, ord('1')), ch(0x88, ord('2')))), '`x`=12')
same(lin(eq(ch(0x86, 0xD0), word('ABC'), ch(0x86, 0x40), ch(0x86, 0xB4), ch(0x84, 0x70), ch(0x85, 0x44))), '∠ABC≅×πΔ')
same(lin(eq(ch(0x81, 0xB1))), '−')                             # text-style 0xB1 prints as a minus in the original
same(lin(eq(ch(0x81, 0xC1) + word('a', 0x81) + ch(0x81, 0xC1))), '`a`')   # delimiter in the text style too
# Templates.
same(lin(eq(tmpl(14, 0, line(sub('a')), line(word('b'))))), '\\frac{`a`}{b}')
same(lin(eq(word('6'), tmpl(14, 0, line(word('2')), line(word('3'))))), '6\\frac{2}{3}')
same(lin(eq(word('x'), tmpl(15, 0, NULL, line(word('2'))))), 'x^{2}')
same(lin(eq(word('x'), tmpl(15, 1, line(word('1')), NULL))), 'x_{1}')
same(lin(eq(word('x'), tmpl(15, 2, line(word('1')), line(word('3'))))), 'x_{1}^{3}')
same(lin(eq(tmpl(13, 0, line(sub('b')), NULL))), '\\sqrt{`b`}')
same(lin(eq(tmpl(13, 1, line(word('8')), line(word('3'))))), '\\sqrt[3]{8}')
same(lin(eq(tmpl(1, 0, line(word('ab')), ch(0x96, 0x28), ch(0x96, 0x29)))), '(ab)')
same(lin(eq(tmpl(2, 1, line(word('a'))))), '{a')
same(lin(eq(tmpl(4, 0, line(word('a'))))), '|a|')
same(lin(eq(tmpl(17, 0, line(word('AB'))))), '\\overline{AB}')
same(lin(eq(tmpl(16, 0, line(word('AB'))))), '\\underline{AB}')
same(lin(eq(tmpl(48, 0, line(word('DE'))))), '\\overarc{DE}')
same(lin(eq(word('13'), tmpl(40, 1, line(word('4524')), NULL))), '13\\longdiv{4524}')
same(lin(eq(tmpl(41, 1, line(word('1')), line(word('2'))))), '1/2')
same(lin(eq(word('P'), ch(0x83, ord('Q'), 2) + b'\x06\x05\x00')), 'PQ′')   # embellishment list
# Piles, matrices, nudges, size records, font records.
same(lin(eq(b'\x04\x02\x01' + line(word('a')) + line(word('b')) + b'\x00')), '\\pile{a \\\\ b}')
same(lin(eq(b'\x05\x01\x01\x01\x02\x02\x00\x00' + line(word('a')) + line(word('b')) + line(word('c')) + line(word('d')) + b'\x00')), '\\matrix{a & b \\\\ c & d}')
same(lin(eq(bytes([0x82, 130, 126, 0x83, ord('a')]), b'\x09\x64\x01\x60\xff', b'\x08\x83\x00Times\x00', word('b'))), 'ab')
# MathML: digit runs become one number; substitutions can be filled; scripts attach to their base.
m = L.mathml(L.parse(eq(word('5', 0x88), ch(0x88, ord('.')), word('72', 0x88), SP, ch(0x86, 0xB8), sub('n')))[0], lambda n: '<mn>13</mn>' if n == 'n' else None)
assert '<mn>5.72</mn>' in m and '<mo>÷</mo>' in m and '<mn>13</mn>' in m, m; checks += 1
m = L.mathml(L.parse(eq(sub('a'), sub('b')))[0], lambda n: '<mfrac><mn>4</mn><mn>5</mn></mfrac>' if n == 'a' else None)
assert '<mfrac><mn>4</mn><mn>5</mn></mfrac>' in m and '`b`' in m, m; checks += 1
m = L.mathml(L.parse(eq(word('x'), tmpl(15, 0, NULL, line(word('2')))))[0])
assert '<msup><mtext>x</mtext>' in m or '<msup><mi>x</mi>' in m, m; checks += 1
# Features and refusals.
assert L.features(L.parse(eq(tmpl(14, 0, line(word('a')), line(word('b')))))[0]) == {'template-14.0'}; checks += 1
for bad in (b'', b'\x09\x00\x00\x00\x00\x00', HDR + b'\x0a\x01\x0f'):
    try: L.parse(bad); raise SystemExit('accepted a bad object')
    except L.Unsupported: checks += 1
try: L.linear(L.parse(eq(tmpl(29, 0, line(word('a')))))[0]); raise SystemExit('accepted an unused template')
except L.Unsupported: checks += 1
# Locating objects inside a block (layout as in the banks: an object record naming its kind, then its data).
def block(kind, data):
    return (b'\x04\x01\x05\x00\x03\x00' + b'\x030014' + b'0' * 16 + b'\x02' + kind.encode().hex().upper().encode() + b'\x02' +
            b'\x00' + ('%X' % len(data)).encode() + b',' + data + b'\x03FFFE' + b'0' * 16)
o = L.objects(block('MTEF', eq(word('a'))), kinds=True)
assert len(o) == 1 and o[0]['kind'] == 'MTEF' and lin(o[0]['data']) == 'a', o; checks += 1
o = L.objects(block('PICT', b'\x00\xa7\x00\xed\x01\x18\x01'), kinds=True)
assert o[0]['kind'] == 'PICT' and L.objects(block('PICT', b'\x00\xa7\x00\xed\x01\x18\x01')) == [None]; checks += 1
print('PASS legacy-rich synthetic:', checks, 'checks')

# ---------- Part 2: private sources ----------
zpath = os.environ.get('SAXON_SOURCE_ZIP')
if not zpath:
    print('SKIP legacy-rich private sources: SAXON_SOURCE_ZIP not set'); sys.exit(0)
assert hashlib.sha256(open(zpath, 'rb').read()).hexdigest() == 'f64a35dc9197da639ca28d354f299812cb9d7f6ebcb64134a73c33b2c52682b5'
z = zipfile.ZipFile(zpath)
counts, forms = {}, {}
for bank in ('course-87-en', 'algebra-half-en', 'algebra-1-en', 'algebra-2-en'):
    for it in json.loads(z.read(bank + '.json'))['items']:
        for bl in it.get('blocks', []):
            objs = L.objects(base64.b64decode(bl['raw_base64']), kinds=True)
            for k, o in enumerate(objs):
                counts[o['kind']] = counts.get(o['kind'], 0) + 1
                assert o['data'], (it['source_id'], 'object without data')
                if o['kind'] == 'MTEF':
                    t = L.parse(o['data'])[0]
                    forms[(it['source_id'], bl['type'], k)] = L.linear(t)
                    L.mathml(t)
assert counts == {'MTEF': 2462, 'PICT': 4}, counts
# Export reference items (owner exports B1 and A4), checked by eye against the printed pages on 2026-10-14.
EXPECT = {
    ('SN870002', 4, 0): '31e5d265', ('SN870035', 4, 0): '0f3761b3', ('SN870067', 4, 0): '4dda3abf',
    ('AXG80153', 4, 0): '54055d8a', ('BMGM0571', 4, 0): 'e2c2f6e0', ('SMAH0013', 4, 0): '27ded233',
}
digest = {k: hashlib.sha256(forms[k].encode()).hexdigest()[:8] for k in EXPECT}
if os.environ.get('LEGACY_RICH_PRINT_DIGESTS'):
    print(json.dumps({'%s/%s/%s' % k: v for k, v in digest.items()}))
assert digest == EXPECT, digest
print('PASS legacy-rich private sources: 2,462 equations decode to text and MathML; 4 QuickDraw pictures located; export reference items match')
