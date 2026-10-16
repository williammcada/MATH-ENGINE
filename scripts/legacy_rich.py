#!/usr/bin/env python3
"""Decoder for the equation objects embedded in the original generator banks (coverage programme, Phase 0.3).

Original code. It reads bytes only; it never executes anything from the source, and it holds no publisher
content. Its inputs come from the private recovery ZIP (see read-source.py) and its outputs are shown to a
porting session, never committed here.

The objects are MathType/Equation Editor equations in the MTEF version 2/3 layout (five-byte header; tag byte
with the record type in the low nibble and options in the high nibble; 8-bit characters in these banks).
Record types: 0 END, 1 LINE, 2 CHAR, 3 TMPL, 4 PILE, 5 MATRIX, 6 EMBELL, 7 RULER, 8 FONT, 9 SIZE, 10-14 sizes.
Template selectors follow the published MTEF v3 table (13 root, 14 fraction, 15 script, 17 overbar, 40 long
division, 41 slash fraction, 44 left script, 48 over-arc, ...). A character 0xC1 in the text, function or
variable typeface is the generator's substitution delimiter (shown as a backtick in its plain text).

Public functions:
  objects(raw)          -> list of equation byte strings in a block, in placeholder order (None if unreadable)
  parse(obj)            -> (tree, trailing bytes)
  linear(tree)          -> a readable LaTeX-like string with `var` substitutions, for porting sessions
  mathml(tree, sub=None)-> MathML; sub(name) may return a MathML fragment for a substitution
  features(tree)        -> set of feature names used (for coverage reports)
"""
import re

class Unsupported(Exception):
    pass

# ---------- locating objects in a block ----------
_REC = re.compile(rb'\x03([0-9A-F]{4})[0-9A-F]{16}')
_DATA = re.compile(rb'\x00([0-9A-F]+),')

def objects(raw, kinds=False):
    """Embedded objects in one source block, in the order of the [] placeholders in its text.

    Each object record names its kind: 'MTEF' (an equation, decoded here) or 'PICT' (a QuickDraw picture,
    handled by the drawing work). With kinds=False only the bytes are returned (None when unreadable)."""
    out = []
    for m in re.finditer(rb'\x030014[0-9A-F]{16}', raw):
        nxt = _REC.search(raw, m.end())
        end = nxt.start() if nxt else len(raw)
        kind = '?'
        for k in re.finditer(rb'\x02(?=((?:[0-9A-F]{2}){4})\x02)', raw[m.end():end]):
            name = bytes.fromhex(k.group(1).decode())
            if all(65 <= x <= 90 for x in name):
                kind = name.decode()
                break
        chunks, p = [], m.end()
        while True:
            n = _DATA.search(raw, p, end)
            if not n:
                break
            size = int(n.group(1), 16)
            chunks.append(raw[n.end():n.end() + size])
            p = n.end() + size
        if kind == 'MTEF':
            good = [c for c in chunks if len(c) > 6 and c[0] in (2, 3, 4) and any(c[5:])]
        else:
            good = [c for c in chunks if len(c) > 6 and any(c)]
        data = good[-1] if good else None
        out.append({'kind': kind, 'data': data} if kinds else (data if kind == 'MTEF' else None))
    return out

# ---------- parsing ----------
class _Reader:
    def __init__(self, b):
        self.b, self.i = b, 5
    def u8(self):
        if self.i >= len(self.b):
            raise Unsupported('object ends early')
        v = self.b[self.i]
        self.i += 1
        return v

def _nudge(r):
    dx, dy = r.u8(), r.u8()
    if dx == 128 and dy == 128:
        r.i += 4

def _ruler(r):
    for _ in range(r.u8()):
        r.i += 3

def _list(r, depth=0):
    if depth > 40:
        raise Unsupported('nesting too deep')
    out = []
    while True:
        tag = r.u8()
        typ, opt = tag & 15, tag >> 4
        if typ == 0:
            return out
        if typ in (1, 2, 3, 4, 5, 6) and opt & 8:
            _nudge(r)
        if typ == 1:
            if opt & 4: r.u8()
            if opt & 2: _ruler(r)
            out.append({'t': 'line', 'null': bool(opt & 1), 'c': [] if opt & 1 else _list(r, depth + 1)})
        elif typ == 2:
            tf, ch = r.u8(), r.u8()
            out.append({'t': 'char', 'tf': tf, 'ch': ch, 'emb': _list(r, depth + 1) if opt & 2 else []})
        elif typ == 3:
            sel, var, _ = r.u8(), r.u8(), r.u8()
            out.append({'t': 'tmpl', 'sel': sel, 'var': var, 'c': _list(r, depth + 1)})
        elif typ == 4:
            ha, va = r.u8(), r.u8()
            if opt & 2: _ruler(r)
            out.append({'t': 'pile', 'ha': ha, 'c': _list(r, depth + 1)})
        elif typ == 5:
            r.u8(); r.u8(); r.u8()
            rows, cols = r.u8(), r.u8()
            r.i += ((rows + 1) * 2 + 7) // 8 + ((cols + 1) * 2 + 7) // 8
            out.append({'t': 'matrix', 'rows': rows, 'cols': cols, 'c': _list(r, depth + 1)})
        elif typ == 6:
            out.append({'t': 'embell', 'e': r.u8()})
        elif typ == 7:
            _ruler(r)
        elif typ == 8:
            r.u8(); r.u8()
            while r.u8() != 0:
                pass
        elif typ == 9:
            ls = r.u8()
            if ls == 101: r.u8(); r.u8()            # explicit point size
            elif ls == 100: r.u8(); r.u8(); r.u8()  # size class plus a 16-bit delta
            else: r.u8()
        elif 10 <= typ <= 14:
            pass
        else:
            raise Unsupported('record type %d' % typ)

def parse(obj):
    if not obj or obj[0] not in (2, 3, 4):
        raise Unsupported('not an equation object')
    r = _Reader(obj)
    tree = _list(r)
    return tree, obj[r.i:]

# ---------- characters ----------
_SYMBOL = dict(zip(range(0x20, 0x7F),
    ' !∀#∃%&∋()∗+,−./0123456789:;<=>?≅ΑΒΧΔΕΦΓΗΙϑΚΛΜΝΟΠΘΡΣΤΥςΩΞΨΖ[∴]⊥_‾αβχδεφγηιϕκλμνοπθρστυϖωξψζ{|}∼'))
_SYMBOL.update(zip(range(0xA1, 0xE2),
    'ϒ′≤⁄∞ƒ♣♦♥♠↔←↑→↓°±″≥×∝∂•÷≠≡≈…|⎯↵ℵℑℜ℘⊗⊕∅∩∪⊃⊇⊄⊂⊆∈∉∠∇®©™∏√⋅¬∧∨⇔⇐⇑⇒⇓◊〈'))
_SYMBOL.update({0xE5: '∑', 0xF1: '〉', 0xF2: '∫'})
TEXT, FUNCTION, VARIABLE, LCGREEK, UCGREEK, SYMBOL, VECTOR, NUMBER = range(0x81, 0x89)
FENCE, MARKER, SPACE = 0x96, 0x97, 0x98
_EMBELL = {2: '˙', 3: '¨', 4: '⃛', 5: '′', 6: '″', 7: '‵', 8: '˜', 9: '^', 10: '̸', 11: '→', 12: '←', 13: '↔',
           14: '⇀', 15: '↼', 16: '̄', 17: '‾', 18: '‴', 19: '⌢', 20: '⌣'}

def is_delim(c):
    return c['t'] == 'char' and c['ch'] == 0xC1 and c['tf'] in (TEXT, FUNCTION, VARIABLE)

def char_text(c):
    tf, ch = c['tf'], c['ch']
    if tf in (LCGREEK, UCGREEK, SYMBOL):
        if ch not in _SYMBOL:
            raise Unsupported('symbol character 0x%02X' % ch)
        return _SYMBOL[ch]
    if tf == SPACE:
        return {1: '', 2: ' ', 4: ' ', 8: ' '}.get(ch, ' ')
    if tf == MARKER:
        return ' '
    if tf in (TEXT, FUNCTION) and ch == 0xB1:
        # Typed in the text styles of six subtraction items; the original program prints it as a minus
        # (owner export A2, item 3: "$6.35 – 51¢"). Every such script computes a difference.
        return '−'
    if 0x81 <= tf <= 0x96:
        return bytes([ch]).decode('cp1252', errors='replace')
    raise Unsupported('typeface %d' % tf)

# ---------- template handling ----------
_FENCES = {0: ('⟨', '⟩'), 1: ('(', ')'), 2: ('{', '}'), 3: ('[', ']'), 4: ('|', '|'), 5: ('‖', '‖'),
           6: ('⌊', '⌋'), 7: ('⌈', '⌉'), 8: ('[', '['), 9: (']', ']'), 10: (']', '['), 11: ('[', ')'), 12: ('(', ']')}
_KNOWN = set(_FENCES) | {13, 14, 15, 16, 17, 40, 41, 44, 48}

def slots(t):
    return [c for c in t['c'] if c['t'] in ('line', 'pile')]

def _tokens(items):
    """Group a line's items into tokens: substitutions become {'t':'sub','name':...}."""
    out, i = [], 0
    while i < len(items):
        c = items[i]
        if is_delim(c):
            j = i + 1
            while j < len(items) and not is_delim(items[j]):
                j += 1
            if j < len(items):
                name = ''.join(char_text(x) if x['t'] == 'char' else '?' for x in items[i + 1:j])
                out.append({'t': 'sub', 'name': name})
                i = j + 1
                continue
        out.append(c)
        i += 1
    return out

# ---------- linear form ----------
def _lin_items(items):
    s = ''
    for c in _tokens(items):
        s += _lin(c)
    return s

def _lin_slot(x):
    return _lin(x) if x else ''

def _lin(c):
    t = c['t']
    if t == 'sub':
        return '`' + c['name'] + '`'
    if t == 'char':
        s = char_text(c)
        for e in c['emb']:
            if e['t'] == 'embell':
                s += _EMBELL.get(e['e'], '')
        return s
    if t == 'line':
        return _lin_items(c['c'])
    if t == 'pile':
        return '\\pile{' + ' \\\\ '.join(_lin(x) for x in c['c'] if x['t'] == 'line') + '}'
    if t == 'matrix':
        cells = [x for x in c['c'] if x['t'] == 'line']
        rows = [cells[k * c['cols']:(k + 1) * c['cols']] for k in range(c['rows'])]
        return '\\matrix{' + ' \\\\ '.join(' & '.join(_lin(x) for x in row) for row in rows) + '}'
    if t == 'embell':
        return _EMBELL.get(c['e'], '')
    if t == 'tmpl':
        sel, var, sl = c['sel'], c['var'], slots(c)
        if sel not in _KNOWN:
            raise Unsupported('template %d' % sel)
        a = _lin_slot(sl[0]) if sl else ''
        b = _lin_slot(sl[1]) if len(sl) > 1 else ''
        if sel in _FENCES:
            l, r = _FENCES[sel]
            return (l if var in (0, 1) else '') + a + (r if var in (0, 2) else '')
        if sel == 13:
            return '\\sqrt{' + a + '}' if var == 0 else '\\sqrt[' + b + ']{' + a + '}'
        if sel == 14:
            return '\\frac{' + a + '}{' + b + '}'
        if sel == 41:
            return a + '/' + b
        if sel in (15, 44):
            sub, sup = (a, b)
            pre = '{}' if sel == 44 else ''
            return pre + ('_{' + sub + '}' if var in (1, 2) and sub else '') + ('^{' + sup + '}' if var in (0, 2) and sup else '')
        if sel == 16:
            return '\\underline{' + a + '}'
        if sel == 17:
            return '\\overline{' + a + '}'
        if sel == 40:
            return '\\longdiv{' + a + '}' + ('' if var == 1 or not b else '^{' + b + '}')
        if sel == 48:
            return '\\overarc{' + a + '}'
    return ''

def linear(tree):
    s = ''.join(_lin(c) for c in tree)
    return re.sub(r'[  ]{2,}', ' ', s).strip()

# ---------- MathML ----------
def _esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

_OPS = set('+−=<>≤≥≠≈≅×÷⋅±∠⊥→←↔∈∉∩∪⊂⊆⊃⊇∴∼≡∝,;:()[]{}|‖')

def _ml_char(c):
    if c['tf'] == SPACE:
        # Spacing characters: widths read off the original program's printed output (three 0x08 and one 0x01
        # either side of an operator print as about one ordinary space).
        return '<mspace width="%sem"/>' % {1: '0.04', 2: '0.17', 4: '1', 8: '0.08'}.get(c['ch'], '0.1')
    s = char_text(c)
    if s.strip() == '':
        return '<mspace width="0.25em"/>' if s else ''
    tf = c['tf']
    if s in _OPS or tf == SYMBOL and not s.isalpha():
        out = '<mo>' + _esc(s) + '</mo>'
    elif s.isdigit() or s == '.':
        out = '<mn>' + _esc(s) + '</mn>'
    elif tf == VARIABLE or tf in (LCGREEK, UCGREEK):
        out = '<mi>' + _esc(s) + '</mi>'
    else:
        out = '<mtext>' + _esc(s) + '</mtext>'
    marks = ''.join(_EMBELL.get(e['e'], '') for e in c['emb'] if e['t'] == 'embell')
    return '<msup>' + out + '<mo>' + _esc(marks) + '</mo></msup>' if marks else out

def _ml_items(items, sub):
    toks = _tokens(items)
    parts = []   # (is_number_char, text, fragment)
    for c in toks:
        if c['t'] == 'tmpl' and c['sel'] == 15 and parts:
            base = parts.pop()[2]
            parts.append((False, '', _ml_script(base, c, sub)))
            continue
        if c['t'] == 'char':
            s = char_text(c)
            if (s.isdigit() or s in '.,') and not c['emb'] and parts and parts[-1][0]:
                text = parts[-1][1] + s     # a run of digit characters is one number (5.72, 4,524)
                parts[-1] = (True, text, '<mn>' + _esc(text) + '</mn>')
                continue
            if s.isdigit() and not c['emb']:
                parts.append((True, s, '<mn>' + s + '</mn>'))
                continue
        parts.append((False, '', _ml(c, sub)))
    return '<mrow>' + ''.join(p[2] for p in parts) + '</mrow>'

def _ml_script(base, t, sub):
    sl = slots(t)
    lo = _ml(sl[0], sub) if sl and not sl[0].get('null') else ''
    hi = _ml(sl[1], sub) if len(sl) > 1 and not sl[1].get('null') else ''
    if t['var'] == 0 or not lo:
        return '<msup>' + base + hi + '</msup>'
    if t['var'] == 1 or not hi:
        return '<msub>' + base + lo + '</msub>'
    return '<msubsup>' + base + lo + hi + '</msubsup>'

def _ml(c, sub):
    t = c['t']
    if t == 'sub':
        frag = sub(c['name']) if sub else None
        return frag if frag is not None else '<mtext class="sub">`' + _esc(c['name']) + '`</mtext>'
    if t == 'char':
        return _ml_char(c)
    if t == 'line':
        return _ml_items(c['c'], sub)
    if t == 'pile':
        al = {1: 'left', 3: 'right'}.get(c['ha'], 'center')
        return '<mtable columnalign="' + al + '">' + ''.join('<mtr><mtd>' + _ml(x, sub) + '</mtd></mtr>' for x in c['c'] if x['t'] == 'line') + '</mtable>'
    if t == 'matrix':
        cells = [x for x in c['c'] if x['t'] == 'line']
        rows = [cells[k * c['cols']:(k + 1) * c['cols']] for k in range(c['rows'])]
        return '<mtable>' + ''.join('<mtr>' + ''.join('<mtd>' + _ml(x, sub) + '</mtd>' for x in row) + '</mtr>' for row in rows) + '</mtable>'
    if t == 'embell':
        return ''
    if t == 'tmpl':
        sel, var, sl = c['sel'], c['var'], slots(c)
        if sel not in _KNOWN:
            raise Unsupported('template %d' % sel)
        a = _ml(sl[0], sub) if sl else '<mrow/>'
        b = _ml(sl[1], sub) if len(sl) > 1 else '<mrow/>'
        if sel in _FENCES:
            l, r = _FENCES[sel]
            return '<mrow>' + ('<mo>' + l + '</mo>' if var in (0, 1) else '') + a + ('<mo>' + r + '</mo>' if var in (0, 2) else '') + '</mrow>'
        if sel == 13:
            return '<msqrt>' + a + '</msqrt>' if var == 0 else '<mroot>' + a + b + '</mroot>'
        if sel == 14:
            return '<mfrac>' + a + b + '</mfrac>'
        if sel == 41:
            return '<mrow>' + a + '<mo>/</mo>' + b + '</mrow>'
        if sel == 15:
            return _ml_script('<mrow/>', c, sub)
        if sel == 44:
            lo = a if not sl[0].get('null') else '<none/>'
            hi = b if len(sl) > 1 and not sl[1].get('null') else '<none/>'
            if lo == '<none/>' and hi == '<none/>':
                return ''
            return '<mmultiscripts><mrow/><mprescripts/>' + lo + hi + '</mmultiscripts>'
        if sel == 16:
            return '<munder>' + a + '<mo>_</mo></munder>'
        if sel == 17:
            return '<mover>' + a + '<mo>‾</mo></mover>'
        if sel == 40:
            # Long division: MathML's menclose longdiv is not drawn by every browser, so use a bracket and overbar.
            return '<mrow><mo stretchy="true">)</mo><mover>' + a + '<mo stretchy="true">‾</mo></mover></mrow>'
        if sel == 48:
            return '<mover>' + a + '<mo>⌒</mo></mover>'
    return ''

def mathml(tree, sub=None):
    return '<math xmlns="http://www.w3.org/1998/Math/MathML">' + _ml_items(tree, sub) + '</math>'

# ---------- coverage ----------
def features(tree):
    f = set()
    def walk(items):
        for c in items:
            if c['t'] == 'tmpl':
                f.add('template-%d.%d' % (c['sel'], c['var']))
            elif c['t'] in ('pile', 'matrix'):
                f.add(c['t'])
            elif c['t'] == 'char' and c['emb']:
                f.add('embellishment')
            if 'c' in c:
                walk(c['c'])
            if c.get('emb'):
                walk(c['emb'])
    walk(tree)
    return f
