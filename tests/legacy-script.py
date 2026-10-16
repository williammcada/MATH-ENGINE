#!/usr/bin/env python3
"""Tests for the preview evaluator (scripts/legacy_script.py), coverage programme Phase 0.4.
Part 1 uses scripts written for this test (no publisher content). Part 2, only with SAXON_SOURCE_ZIP set,
runs every original script and checks the share that previews stays at or above the recorded level."""
import json, os, sys, zipfile, hashlib
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'scripts'))
import legacy_script as S
n = 0
def ok(c, m=''):
    global n
    assert c, m
    n += 1
e = S.run('a=random(a,$once,2,9)\nb=random(b,$each,2,9)\nreject(a=b)\nz=a*b\nif z>20\n w="big"\nelse\n w="small"\nendif', 4)
ok(e.vars['a'] != e.vars['b'] and e.vars['z'] == e.vars['a'] * e.vars['b'])
ok(e.vars['w'] == ('big' if e.vars['z'] > 20 else 'small'))
e = S.run('x=1\nt=0\nwhile x<5\n t=t+x\n x=x+1\nendwhile\nq=17\\5', 1)
ok(e.vars['t'] == 10 and e.vars['q'] == 3)
e = S.run('f=fraction(4,6)\ng=fraction(4,6,1)\nh=fraction(14,4,2)', 1)
ok(S.show(e.vars['f'])[0] == '4/6' and S.show(e.vars['g'])[0] == '2/3' and S.show(e.vars['h'])[0] == '3 1/2')
e = S.run('a=3.5\nformat("%0.2f",a)\nc=comma(1234567)\nd=cat(mathsym(208),polynom("ABC"))\np=polynom("1x^+2+-3")', 1)
ok(e.vars['a'] == '3.50' and e.vars['c'] == '1,234,567' and S.show(e.vars['d'])[0] == '∠ABC' and S.show(e.vars['p'])[0] == 'x^2−3')
e = S.run('literal("abc",1,u,v)\nr=word(42)\nroot(2,72,o,i)', 1)
ok(e.vars['u'] == 'd' and e.vars['v'] == 'e' and e.vars['r'] == 'forty-two' and e.vars['o'] == 6 and e.vars['i'] == 2)
e = S.run('mode(m,arr,1,2,3)\narr2[4]\nk[2]=5\ns=k[2]', 1)
ok(e.vars['m'] == 0 and e.vars['s'] == 5)
e = S.run('slate(q,1,2,-10,10,-1,1)\nline(q,-10,0,10,0,1,0,$arrow,$arrow)\ndot(q,0,0)\nwrite(q,0,-.5,"O",1,3,$tiny)\nr=q\nplotx(q,$circle,"5",0,10,0,10)', 1)
svg = e.vars['q'].svg()
ok(svg.count('<line') == 1 and 'marker-start' in svg and '<circle' in svg and 'font-style="italic"' in svg and '<polyline' in svg)
ok('<polyline' not in e.vars['r'].svg(), 'assignment copies a picture')
for bad in ('x=frobnicate(1)', 'if x>1\ny=2', 'x=(1'):
    try: S.run(bad, 1); raise SystemExit('accepted ' + bad)
    except S.Unsupported: n += 1
try: S.run('a=random(a,$each,1,3)\nreject(a>0)', 1); raise SystemExit('endless rejection accepted')
except S.Unsupported: n += 1
print('PASS legacy-script synthetic:', n, 'checks')
zpath = os.environ.get('SAXON_SOURCE_ZIP')
if not zpath:
    print('SKIP legacy-script private sources: SAXON_SOURCE_ZIP not set'); sys.exit(0)
assert hashlib.sha256(open(zpath, 'rb').read()).hexdigest() == 'f64a35dc9197da639ca28d354f299812cb9d7f6ebcb64134a73c33b2c52682b5'
z = zipfile.ZipFile(zpath); ran = total = 0
for bank in ('course-87-en', 'algebra-half-en', 'algebra-1-en', 'algebra-2-en'):
    for it in json.loads(z.read(bank + '.json'))['items']:
        src = '\n'.join(b['text'] for b in it.get('blocks', []) if b['type'] == 3)
        if not src.strip(): continue
        total += 1
        try: S.run(src, 7); ran += 1
        except (S.Unsupported, Exception): pass
assert total == 2642 and ran >= 2567, (ran, total)
print('PASS legacy-script private sources: %d of %d original scripts preview' % (ran, total))
