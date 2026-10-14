#!/usr/bin/env python3
"""Read ExamView records (Course 1, Intermediate 4) for porting. Private material stays private.

The recovered content lives only in the private repository williammcada/saxon-source-private
(recovery/Course-Bank-Content-Recovery-v0.2.zip). Point SAXON_SOURCE_ZIP at that file. This script prints
records to the terminal for a porting session. It never writes publisher text or pictures into this repository,
and nothing it prints may be committed here.

For each record it shows:
- the lesson;
- the question, with each embedded object (▣) decoded underneath. An object is written as its text runs,
  its {variables} and its layout templates ⟨Ta,b⟩:
  - T2,1 is a fraction;
  - T1,131077 is a stacked (vertical) arithmetic layout;
  - T1,458753 is a long-division bracket;
  - T1,0 is a plain row;
- the source key;
- the algorithmic variables and constraints, as name := formula [sample value].

Embedded bitmaps are written as PNG files only when EXAMVIEW_PICS names a directory outside the repository.

Usage:
  SAXON_SOURCE_ZIP=... python3 scripts/read-examview.py course-1-en C1_S01_00005 [...]
  SAXON_SOURCE_ZIP=... python3 scripts/read-examview.py course-1-en --lesson 4        (Lesson 4)
  SAXON_SOURCE_ZIP=... python3 scripts/read-examview.py course-1-en --lesson I3       (Investigation 3)
"""
import hashlib, io, json, os, re, struct, sys, zipfile, zlib, pathlib

EXPECTED = 'f64a35dc9197da639ca28d354f299812cb9d7f6ebcb64134a73c33b2c52682b5'
ROOT = pathlib.Path(__file__).resolve().parents[1]
# Symbol-font characters used in the runs.
SYM = {0xb4: '×', 0xb8: '÷', 0xb1: '±', 0xa3: '≤', 0xb3: '≥', 0xb9: '≠', 0xd6: '√', 0xb0: '°', 0xbb: '≈', 0xd0: '∠', 0xd7: '·', 0xa5: '∞'}


def load(course):
    zpath = os.environ.get('SAXON_SOURCE_ZIP')
    if not zpath:
        sys.exit('Set SAXON_SOURCE_ZIP to the private recovery ZIP.')
    if hashlib.sha256(open(zpath, 'rb').read()).hexdigest() != EXPECTED:
        sys.exit('This is not the recovery v0.2 ZIP recorded for the programme.')
    z = zipfile.ZipFile(zpath)
    items = json.loads(z.read(course + '.json'))['items']
    return z, items


class Bank:
    def __init__(self, z, course, items):
        self.z, self.course, self.cache = z, course, {}
        self.items = {i['source_id']: i for i in items}
        self.next = {}
        by = {}
        for i in items:
            by.setdefault(i['source_bank_id'], []).append(i)
        for lst in by.values():
            lst.sort(key=lambda i: i['source_record_offset'])
            for a, b in zip(lst, lst[1:]):
                self.next[a['source_id']] = b['source_record_offset']

    def raw(self, i):
        n = i['source_bank_id'].split(':')[-1]
        if n not in self.cache:
            self.cache[n] = zlib.decompress(self.z.read('originals/%s/%s.bnk' % (self.course, n))[16:])
        return self.cache[n]


def runs(r, lo, hi):
    """Text runs, {variables} and ⟨templates⟩ in source order."""
    out, p = [], lo
    while p < hi:
        if r[p] == 0x09 and p + 13 <= hi and r[p + 9:p + 13] == b'\x00\x00\x00\x00' and r[p + 4] in (0, 0xff):
            p += 13
            s = ''
            while p < hi and r[p] >= 0x20:
                s += SYM.get(r[p], chr(r[p]))
                p += 1
            if s:
                out.append(s)
            continue
        if r[p] == 0x0a and p + 3 < hi and r[p + 1] >= 0x20 and r[p + 2] == 0:
            q, n = p + 1, ''
            while q + 1 < hi and not (r[q] == 0 and r[q + 1] == 0):
                n += chr(r[q] | r[q + 1] << 8)
                q += 2
            out.append('{' + n + '}')
            p = q + 2
            continue
        if r[p:p + 5] == b'\x01\xff\x7f\x00\x00':
            a, b = struct.unpack('<ii', r[p + 5:p + 13])
            out.append('⟨T%d,%d⟩' % (a, b))
            p += 13
            continue
        p += 1
    return out


def objects(r):
    return [m.start() for m in re.finditer(rb'(.)\x00\x00\x00\x05\x00\x00\x00\1\x00\x00\x00', r, re.S)]


def bitmaps(r):
    from PIL import Image
    out = []
    for m in re.finditer(rb'\x28\x00\x00\x00.{8}\x01\x00(\x01|\x04|\x08|\x18|\x20)\x00', r, re.S):
        p = m.start()
        _, w, h, _, bc, _, _ = struct.unpack('<IiiHHII', r[p:p + 24])
        ncol = struct.unpack('<I', r[p + 32:p + 36])[0]
        if bc <= 8 and ncol == 0:
            ncol = 1 << bc
        if bc > 8:
            ncol = 0
        if not (0 < w < 5000 and 0 < abs(h) < 5000):
            continue
        tot = 40 + ncol * 4 + ((w * bc + 31) // 32) * 4 * abs(h)
        bmp = b'BM' + struct.pack('<IHHI', 14 + tot, 0, 0, 14 + 40 + ncol * 4) + r[p:p + tot]
        try:
            out.append(Image.open(io.BytesIO(bmp)).convert('RGB'))
        except Exception:
            pass
    return out


def variables(d):
    groups, last = [], -10
    for m in re.finditer(rb'((?:[\x20-\x7e]\x00)+)\x00\x00', d):
        t = m.group(1).decode('utf-16le')
        if m.start() == last and groups:
            groups[-1].append(t)
        else:
            groups.append([t])
        last = m.end()
    return [g for g in groups if len(g) > 1 or len(g[0]) > 2]


def show(bank, sid, pics):
    i = bank.items[sid]
    b = bank.raw(i)
    print('=== %s | %s | %s' % (sid, i['source_metadata_fields'][0], i['answer']['kind']))
    print('Q:', i['question_text_with_controls'].replace('\x10', '\n   ').replace('\x11', ' ').replace('\x0f', '▣'))
    o, n = i['question_rich_data_offset'], i['question_rich_data_length']
    r = b[o:o + n]
    starts = objects(r)
    for k, s in enumerate(starts):
        t = runs(r, s, starts[k + 1] if k + 1 < len(starts) else len(r))
        if t:
            print('  ▣%d: %s' % (k, ' '.join(t)[:400]))
    a = i['answer']
    print('A: %s %s' % (a.get('label', ''), a.get('text_with_controls', '').replace('\x0f', '▣')))
    end = bank.next.get(sid, o + n + 200000)
    ar = b[o + n:end]
    if a['kind'] != 'choice':
        t = runs(ar, 0, len(ar))
        if t:
            print('  answer objects:', ' '.join(t)[:400])
    if pics:
        for tag, seg in (('q', r), ('a', ar if a['kind'] != 'choice' else b'')):
            for k, im in enumerate(bitmaps(seg)):
                f = pics / ('%s_%s%d.png' % (sid, tag, k))
                im.save(f)
                print('  picture:', f, im.size)
    d = b[i['dynamic_data_offset']:i['dynamic_data_offset'] + i['dynamic_data_length']]
    for g in variables(d):
        print('  var:', ' := '.join(g[:2]) + ('   [' + g[2] + ']' if len(g) > 2 else ''))


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        sys.exit(__doc__)
    course = a[0]
    z, items = load(course)
    bank = Bank(z, course, items)
    pics = os.environ.get('EXAMVIEW_PICS')
    if pics:
        pics = pathlib.Path(pics).resolve()
        if pics == ROOT or ROOT in pics.parents:
            sys.exit('EXAMVIEW_PICS must be outside the repository.')
        pics.mkdir(parents=True, exist_ok=True)
    if a[1] == '--lesson':
        want = a[2]
        name = ('Investigation ' + want[1:]) if want.upper().startswith('I') else ('Lesson ' + want)
        ids = [s for s, i in bank.items.items() if i['source_metadata_fields'][0].split(':')[0] == name]
        ids.sort(key=lambda s: (bank.items[s]['source_bank_id'], bank.items[s]['source_record_offset']))
    else:
        ids = a[1:]
    for s in ids:
        show(bank, s, pics)


if __name__ == '__main__':
    main()
