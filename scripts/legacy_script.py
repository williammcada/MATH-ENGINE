#!/usr/bin/env python3
"""Preview evaluator for the original generator scripts (coverage programme, Phase 0.4). Review aid only.

Original code. It reads a script as text and evaluates it with its own small, sandboxed interpreter: no
file, network or system access, no use of Python's eval, bounded loops and restarts. Nothing from the
source is run in its original program. It exists so a porting session can see what an original item looks
like with sample values, including its drawing, and compare that with the owner's printed exports.
Ported Engine tasks never call it.

  run(script, seed)    -> Env with the computed variables (numbers, text, typeset values, pictures)
  show(value)          -> (plain text, HTML) for a value
  Pic.svg()            -> SVG for a picture

Semantics were read from the scripts and checked against the exports; where they are a best guess the
code says so. Anything not understood raises Unsupported, so coverage can be counted honestly.
"""
import math, random as _random, re
from fractions import Fraction

try:
    from legacy_rich import _SYMBOL
except ImportError:  # pragma: no cover
    from .legacy_rich import _SYMBOL

class Unsupported(Exception):
    pass

class Restart(Exception):
    pass

MAX_STEPS = 200000
MAX_RESTARTS = 400

# ---------------------------------------------------------------- values
def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def numtext(x):
    if isinstance(x, bool):
        x = 1 if x else 0
    if abs(x - round(x)) < 1e-9:
        return str(int(round(x)))
    s = ('%.10f' % x).rstrip('0').rstrip('.')
    return s

def text_ml(t):
    """MathML for plain text: numbers as <mn>, operators as <mo>, the rest as upright text."""
    out = ''
    for tok in re.findall(r'[0-9][0-9,]*(?:\.[0-9]+)?|[+−=<>≤≥×÷⋅±∠≅°()]|[^0-9+−=<>≤≥×÷⋅±∠≅°()]+', t):
        if tok[0].isdigit(): out += '<mn>' + esc(tok) + '</mn>'
        elif len(tok) == 1 and tok in '+−=<>≤≥×÷⋅±∠≅°()': out += '<mo>' + esc(tok) + '</mo>'
        else: out += '<mtext>' + esc(tok).replace(' ', '\u00a0') + '</mtext>'
    return out

class Rich:
    """Typeset text: a plain form, an HTML form and a MathML form (for use inside equations)."""
    def __init__(self, text='', html=None, ml=None):
        self.text, self.html = text, esc(text) if html is None else html
        self.ml = text_ml(text) if ml is None else ml
    def __add__(self, o):
        o = rich(o)
        return Rich(self.text + o.text, self.html + o.html, self.ml + o.ml)
    def __eq__(self, o):
        return isinstance(o, Rich) and o.text == self.text or isinstance(o, str) and o == self.text
    def __hash__(self):
        return hash(self.text)
    def __repr__(self):
        return 'Rich(%r)' % self.text

def math_html(inner, text):
    return Rich(text, '<math xmlns="http://www.w3.org/1998/Math/MathML">' + inner + '</math>', inner)

def rich(v):
    if isinstance(v, Rich):
        return v
    if isinstance(v, Pic):
        return Rich('[picture]', v.svg())
    if isinstance(v, (int, float)):
        t = numtext(v)
        return Rich(t.replace('-', '−') if t.startswith('-') else t)
    if v is None:
        return Rich('')
    return Rich(str(v))

def show(v):
    r = rich(v)
    return r.text, r.html

def num(v):
    if isinstance(v, bool):
        return 1.0 if v else 0.0
    if isinstance(v, (int, float)):
        return float(v)
    t = v.text if isinstance(v, Rich) else str(v)
    t = t.replace(',', '').replace('−', '-').replace('$', '').strip()
    try:
        return float(t)
    except ValueError:
        raise Unsupported('not a number: %r' % t[:20])

# ---------------------------------------------------------------- pictures
class Pic:
    """A drawing area: slate(name, height in., width in., xmin, xmax, ymin, ymax [, margins])."""
    def __init__(self, h, w, x0, x1, y0, y1, margins=(0, 0, 0, 0)):
        self.h, self.w, self.x0, self.x1, self.y0, self.y1 = h, w, x0, x1, y0, y1
        self.items = []
    def copy(self):
        p = Pic(self.h, self.w, self.x0, self.x1, self.y0, self.y1)
        p.items = list(self.items)
        return p
    def px(self, x, y):
        W, H = self.w * 96, self.h * 96
        sx = W / ((self.x1 - self.x0) or 1)
        sy = H / ((self.y1 - self.y0) or 1)
        return (x - self.x0) * sx, H - (y - self.y0) * sy
    def scale(self):
        return self.w * 96 / ((self.x1 - self.x0) or 1), self.h * 96 / ((self.y1 - self.y0) or 1)
    def svg(self):
        W, H = self.w * 96, self.h * 96
        body = []
        for it in self.items:
            body.append(it(self))
        return ('<svg xmlns="http://www.w3.org/2000/svg" width="%.0f" height="%.0f" viewBox="-6 -6 %.0f %.0f" '
                'font-family="Times New Roman,serif" style="overflow:visible">'
                '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                '<path d="M0,0 L10,5 L0,10" fill="none" stroke="#000" stroke-width="1.4"/></marker></defs>%s</svg>'
                % (W + 12, H + 12, W + 12, H + 12, ''.join(body)))

WIDTH = {None: 0.8, 0: 0.8, 1: 1.6, 2: 3.0, 3: 4.0}
DASH = {3: '4,3', 2: '2,2', 1: '', 0: ''}

def _line(x1, y1, x2, y2, thick=None, style=None, cap1=None, cap2=None, color=None):
    def draw(p):
        a, b = p.px(x1, y1)
        c, d = p.px(x2, y2)
        w = WIDTH.get(None if thick is None else int(thick), 1.6)
        dash = DASH.get(int(style), '') if style is not None else ''
        col = '#fff' if color == '$white' else '#000'
        extra = (' stroke-dasharray="%s"' % dash if dash else '') + (' marker-start="url(#ah)"' if cap1 == '$arrow' else '') + (' marker-end="url(#ah)"' if cap2 == '$arrow' else '')
        return '<line x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f" stroke="%s" stroke-width="%.2f"%s/>' % (a, b, c, d, col, w, extra)
    return draw

# ---------------------------------------------------------------- parsing
TOKEN = re.compile(r'\s*(?:(\d+\.\d*|\.\d+|\d+)|("[^"]*")|(\$[A-Za-z_][A-Za-z0-9_]*)|([A-Za-z_][A-Za-z0-9_]*)|(<>|<=|>=|!=|[-+*/\\^(),=<>&|!\[\]]))')

def tokenize(s):
    out, i = [], 0
    while i < len(s):
        if s[i].isspace():
            i += 1
            continue
        m = TOKEN.match(s, i)
        if not m or m.end() == i:
            raise Unsupported('cannot read %r' % s[i:i + 12])
        n, st, const, name, op = m.groups()
        if n is not None: out.append(('num', float(n)))
        elif st is not None: out.append(('str', st[1:-1]))
        elif const is not None: out.append(('const', const.lower()))
        elif name is not None: out.append(('name', name.lower()))
        else: out.append(('op', op))
        i = m.end()
    return out

class Parser:
    """Expressions: | & ; comparisons = <> < > <= >= ; + - ; * / ; ^ ; unary - ! ; calls, indexing."""
    def __init__(self, toks):
        self.t, self.i = toks, 0
    def peek(self, k=0):
        return self.t[self.i + k] if self.i + k < len(self.t) else (None, None)
    def take(self, op=None):
        tok = self.peek()
        if op is not None and tok != ('op', op):
            raise Unsupported('expected %s' % op)
        self.i += 1
        return tok
    def expr(self):
        a = self.and_()
        while self.peek() == ('op', '|'):
            self.take(); a = ('or', a, self.and_())
        return a
    def and_(self):
        a = self.cmp()
        while self.peek() == ('op', '&'):
            self.take(); a = ('and', a, self.cmp())
        return a
    def cmp(self):
        a = self.add()
        while self.peek()[0] == 'op' and self.peek()[1] in ('=', '<>', '!=', '<', '>', '<=', '>='):
            op = self.take()[1]; a = ('cmp', op, a, self.add())
        return a
    def add(self):
        a = self.mul()
        while self.peek()[0] == 'op' and self.peek()[1] in '+-':
            op = self.take()[1]; a = ('bin', op, a, self.mul())
        return a
    def mul(self):
        a = self.unary()
        while self.peek()[0] == 'op' and self.peek()[1] in ('*', '/', '\\'):
            op = self.take()[1]; a = ('bin', op, a, self.unary())
        return a
    def unary(self):
        if self.peek() == ('op', '-'):
            self.take(); return ('neg', self.unary())
        if self.peek() == ('op', '+'):
            self.take(); return self.unary()
        if self.peek() == ('op', '!'):
            self.take(); return ('not', self.unary())
        return self.power()
    def power(self):
        a = self.atom()
        if self.peek() == ('op', '^'):
            self.take(); return ('bin', '^', a, self.unary())
        return a
    def atom(self):
        kind, v = self.take()
        if kind == 'num': return ('num', v)
        if kind == 'str': return ('str', v)
        if kind == 'const': return ('const', v)
        if kind == 'op' and v == '(':
            e = self.expr(); self.take(')'); return e
        if kind == 'name':
            if self.peek() == ('op', '('):
                self.take()
                args = []
                if self.peek() != ('op', ')'):
                    while True:
                        if self.peek() in (('op', ','), ('op', ')')):
                            args.append(None)
                        else:
                            args.append(self.expr())
                        if self.peek() == ('op', ','):
                            self.take(); continue
                        break
                self.take(')')
                return ('call', v, args)
            if self.peek() == ('op', '['):
                self.take(); k = self.expr(); self.take(']')
                return ('index', v, k)
            return ('var', v)
        raise Unsupported('unexpected %r' % (v,))

def parse_expr(s):
    p = Parser(tokenize(s))
    e = p.expr()
    if p.i != len(p.t):
        raise Unsupported('extra text after expression')
    return e

def strip_comment(raw):
    out, quoted = '', False
    for c in raw:
        if c == '"':
            quoted = not quoted
        if c == '#' and not quoted:
            break
        out += c
    return out.strip()

ASSIGN = re.compile(r'([A-Za-z_][A-Za-z0-9_]*)\s*(?:\[(.*?)\])?\s*=(.*)$')

def parse_script(src):
    """Statements: assignment, call, array declaration, if/else/endif, while/endwhile. # starts a comment."""
    lines = [t for t in (strip_comment(r) for r in src.replace('\r', '\n').split('\n')) if t]
    pos = 0
    def word(s):
        m = re.match(r'([A-Za-z]+)(.?)', s)
        return (m.group(1).lower(), m.group(2)) if m else ('', '')
    def block(ends):
        nonlocal pos
        body = []
        while pos < len(lines):
            s = lines[pos]
            w, nxt = word(s)
            if w in ends and nxt in ('', ' ', '\t'):
                return body, w
            pos += 1
            if w in ('if', 'while') and nxt in (' ', '\t', '(', '!'):
                cond = parse_expr(s[len(w):])
                if w == 'if':
                    yes, end = block(('else', 'endif'))
                    no = []
                    if end == 'else':
                        pos += 1
                        no, end = block(('endif',))
                    if end != 'endif':
                        raise Unsupported('if without endif')
                    pos += 1
                    body.append(('if', cond, yes, no))
                else:
                    loop, end = block(('endwhile',))
                    if end != 'endwhile':
                        raise Unsupported('while without endwhile')
                    pos += 1
                    body.append(('while', cond, loop))
                continue
            m = ASSIGN.match(s)
            if m:
                idx = parse_expr(m.group(2)) if m.group(2) is not None else None
                body.append(('set', m.group(1).lower(), idx, parse_expr(m.group(3))))
            elif re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*\s*\[[^\]]*\]', s):
                body.append(('dim',))
            else:
                e = parse_expr(s)
                if e[0] != 'call':
                    raise Unsupported('statement %r' % s[:30])
                body.append(('do', e))
        return body, None
    body, end = block(())
    if end is not None:
        raise Unsupported('unexpected ' + end)
    return body

# ---------------------------------------------------------------- evaluation
class Env:
    def __init__(self, seed):
        self.rng = _random.Random(seed)
        self.vars = {}
        self.specs = {}
        self.steps = 0
        self.drawn = set()

    def get(self, name):
        if name not in self.vars:
            return 0.0          # unset variables read as zero in the original language (best guess)
        return self.vars[name]

def run(src, seed=1, program=None):
    program = program or parse_script(src)
    rng = _random.Random(seed)
    for attempt in range(MAX_RESTARTS):
        env = Env(rng.random())
        try:
            exec_block(env, program)
            env.attempts = attempt + 1
            return env
        except Restart:
            continue
    raise Unsupported('no values satisfied the script after %d tries' % MAX_RESTARTS)

def exec_block(env, body):
    for st in body:
        env.steps += 1
        if env.steps > MAX_STEPS:
            raise Unsupported('script runs too long')
        k = st[0]
        if k == 'set':
            v = ev(env, st[3])
            if isinstance(v, Pic):
                v = v.copy()          # picture assignment copies (q2=q keeps the earlier drawing)
            if st[2] is None:
                env.vars[st[1]] = v
            else:
                arr = env.vars.get(st[1])
                if not isinstance(arr, dict):
                    arr = {}
                    env.vars[st[1]] = arr
                arr[int(num(ev(env, st[2])))] = v
        elif k == 'do':
            ev(env, st[1], statement=True)
        elif k == 'if':
            exec_block(env, st[2] if truth(ev(env, st[1])) else st[3])
        elif k == 'while':
            n = 0
            while truth(ev(env, st[1])):
                n += 1
                if n > 5000:
                    raise Restart()   # a redraw loop that never ends: treat as a rejected draw
                exec_block(env, st[2])
        elif k == 'dim':
            pass

def truth(v):
    if isinstance(v, (Rich, str)):
        return bool(rich(v).text)
    return abs(num(v)) > 1e-12

def equal(a, b):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) < 1e-9
    try:
        return abs(num(a) - num(b)) < 1e-9
    except Unsupported:
        return rich(a).text == rich(b).text

CONSTS = {'$dtr': math.pi / 180, '$rtd': 180 / math.pi, '$pi': math.pi}

def ev(env, e, statement=False):
    k = e[0]
    if k == 'num': return e[1]
    if k == 'str': return e[1]
    if k == 'const':
        return CONSTS.get(e[1], e[1])
    if k == 'var': return env.get(e[1])
    if k == 'index':
        arr = env.vars.get(e[1])
        i = int(num(ev(env, e[2])))
        return arr.get(i, 0.0) if isinstance(arr, dict) else 0.0
    if k == 'neg': return -num(ev(env, e[1]))
    if k == 'not': return 0.0 if truth(ev(env, e[1])) else 1.0
    if k == 'or': return 1.0 if truth(ev(env, e[1])) or truth(ev(env, e[2])) else 0.0
    if k == 'and': return 1.0 if truth(ev(env, e[1])) and truth(ev(env, e[2])) else 0.0
    if k == 'cmp':
        a, b = ev(env, e[2]), ev(env, e[3])
        op = e[1]
        if op == '=': return 1.0 if equal(a, b) else 0.0
        if op in ('<>', '!='): return 0.0 if equal(a, b) else 1.0
        a, b = num(a), num(b)
        return 1.0 if {'<': a < b - 1e-12, '>': a > b + 1e-12, '<=': a <= b + 1e-12, '>=': a >= b - 1e-12}[op] else 0.0
    if k == 'bin':
        a, b = num(ev(env, e[2])), num(ev(env, e[3]))
        op = e[1]
        if op == '+': return a + b
        if op == '-': return a - b
        if op == '*': return a * b
        if op == '/':
            if b == 0: raise Restart()
            return a / b
        if op == '\\':
            if b == 0: raise Restart()
            return float(math.floor(a / b + 1e-12))
        if op == '^':
            try:
                return float(a ** b)
            except (OverflowError, ZeroDivisionError, TypeError):
                raise Restart()
    if k == 'call':
        f = FUNCS.get(e[1])
        if f is None:
            raise Unsupported('function ' + e[1])
        return f(env, e[2])
    raise Unsupported('expression ' + k)

def args(env, a):
    return [None if x is None else ev(env, x) for x in a]

def name_of(x):
    if x is None or x[0] not in ('var', 'index'):
        raise Unsupported('expected a variable name')
    return x[1]

# ---------------------------------------------------------------- functions: numbers
def f_random(env, a):
    """random(key, mode, low, high [, step]); the key or the mode may be left out; random(key, $sign) is +1 or -1;
    random(key) draws again from the range first given for that key."""
    a = list(a)
    key = name_of(a[0]) if a and a[0] and a[0][0] == 'var' else None
    if key is None and a and a[0] and a[0][0] == 'const':
        a = [None] + a
    rest = a[1:]
    if len(a) == 1:
        spec = env.specs.get(key)
        if not spec:
            raise Unsupported('random() without a range')
        lo, hi, step = spec
    else:
        mode = rest[0][1] if rest[0] and rest[0][0] == 'const' else None
        if mode == '$sign':
            return float(env.rng.choice((-1, 1)))
        if mode == '$tf':
            return float(env.rng.choice((0, 1)))
        vals = args(env, rest[1:] if mode or rest[0] is None else rest)
        if len(vals) < 2:
            if key not in env.specs:
                raise Unsupported('random() without a range')
            vals = list(env.specs[key])
        lo, hi = num(vals[0]), num(vals[1])
        step = num(vals[2]) if len(vals) > 2 and vals[2] is not None else 1.0
        env.specs[key] = (lo, hi, step)
    if step <= 0 or hi < lo - 1e-9:
        raise Restart()
    n = int(math.floor((hi - lo) / step + 1e-9))
    return round(lo + step * env.rng.randint(0, n), 10)

def f_select(env, a):
    i = int(round(num(ev(env, a[0]))))
    if i < 1 or i >= len(a):
        raise Restart()
    return ev(env, a[i]) if a[i] is not None else ''

def f_reject(env, a):
    if truth(ev(env, a[0])):
        raise Restart()
    return 0.0

def f_require(env, a):
    if not truth(ev(env, a[0])):
        raise Restart()
    return 0.0

def f_duplicat(env, a):
    vals = [rich(v).text if not isinstance(v, (int, float)) else numtext(v) for v in args(env, a)]
    return 1.0 if len(set(vals)) < len(vals) else 0.0

def gcd(a, b):
    a, b = abs(int(round(a))), abs(int(round(b)))
    while b: a, b = b, a % b
    return a

def simple(fn):
    def f(env, a):
        try:
            return float(fn(*[num(x) for x in args(env, a)]))
        except (ValueError, ZeroDivisionError, OverflowError):
            raise Restart()
    return f

def f_format(env, a):
    fmt = ev(env, a[0])
    for x in a[1:]:
        n = name_of(x)
        v = env.get(n)
        try:
            env.vars[n] = cformat(str(fmt), num(v))
        except Unsupported:
            pass
    return 0.0

def cformat(fmt, x):
    m = re.fullmatch(r'%(\+?)0?(\d*)\.?0?(\d*)([fdg])', fmt.strip())
    if not m:
        raise Unsupported('format %r' % fmt)
    places = int(m.group(3) or 0) if m.group(4) == 'f' else 0
    return ('%' + m.group(1) + '.*f') % (places, x)

def f_comma(env, a):
    x = num(ev(env, a[0]))
    t = numtext(abs(x))
    whole, _, frac = t.partition('.')
    whole = '{:,}'.format(int(whole))
    return ('−' if x < 0 else '') + whole + ('.' + frac if frac else '')

def f_cat(env, a):
    out = Rich('')
    for v in args(env, a):
        out = out + rich(v)
    return out

def f_mathsym(env, a):
    c = int(num(ev(env, a[0])))
    return Rich(_SYMBOL.get(c, '?'))

def frac_rich(n, d, mode=0):
    if d == 0:
        raise Restart()
    n, d = int(round(n)), int(round(d))
    sign = '−' if (n < 0) != (d < 0) and n != 0 else ''
    n, d = abs(n), abs(d)
    if mode in (1, 2):
        g = gcd(n, d) or 1
        n, d = n // g, d // g
    if d == 1:
        return Rich(sign + str(n))
    def mf(p, q):
        return '<mfrac><mn>%d</mn><mn>%d</mn></mfrac>' % (p, q)
    w, r = divmod(n, d)
    if mode == 2 and w:
        if r == 0:
            return Rich(sign + str(w))
        return math_html(('<mo>−</mo>' if sign else '') + '<mn>%d</mn>' % w + mf(r, d), '%s%d %d/%d' % (sign, w, r, d))
    return math_html(('<mo>−</mo>' if sign else '') + mf(n, d), '%s%d/%d' % (sign, n, d))

def f_fraction(env, a):
    v = args(env, a)
    try:
        num(v[0]); num(v[1])
    except Unsupported:
        n, d = rich(v[0]), rich(v[1])      # a fraction of typeset parts, e.g. x over a number
        return Rich('(' + n.text + ')/(' + d.text + ')', '<span class="frac"><span>' + n.html + '</span><span>' + d.html + '</span></span>')
    # Modes, read from the scripts: 0 (the default) writes the fraction as given, unreduced (scripts that need
    # it reduced either guarantee coprime parts or ask for mode 1, and distractors use mode 0 for equivalent
    # unreduced forms); 1 reduces; 2 reduces and writes improper values as mixed numbers.
    return frac_rich(num(v[0]), num(v[1]), int(num(v[2])) if len(v) > 2 and v[2] is not None else 0)

def f_polynom(env, a):
    """polynom(text): typeset an algebraic expression; letters in italics, ^ as a superscript, tidy signs
    (+- to minus, a coefficient of 1 dropped, a leading + dropped, ^+2 to ^2)."""
    s = rich(ev(env, a[0])).text
    s = s.replace(' ', '')
    s = re.sub(r'\^\+', '^', s)
    s = s.replace('+-', '-').replace('--', '+').replace('-+', '-')
    s = re.sub(r'(?<![0-9.])1(?=[A-Za-z(])', '', s)
    s = re.sub(r'\^1(?![0-9])', '', s)
    s = s.lstrip('+').replace('-', '−')
    html = ''
    for tok in re.findall(r'\^\(?[^+−*/()]+\)?|[A-Za-z]|[^A-Za-z^]+', s):
        if tok.startswith('^'):
            html += '<sup>' + esc(tok[1:].strip('()')) + '</sup>'
        elif tok.isalpha():
            html += '<i>' + esc(tok) + '</i>'
        else:
            html += esc(tok).replace('+', ' + ').replace('−', ' − ').replace('=', ' = ').replace('(  − ', '(−') if len(tok) > 0 else ''
    if html.startswith(' − '):
        html = '−' + html[3:]
    parts = []
    for tok in re.findall(r'\^\(?[^+−*/()]+\)?|[A-Za-z]|[0-9.]+|.', s):
        if tok.startswith('^'):
            base = parts.pop() if parts else '<mrow/>'
            parts.append('<msup>' + base + text_ml(tok[1:].strip('()')).replace('<mtext>', '<mi>').replace('</mtext>', '</mi>') + '</msup>')
        elif tok.isalpha(): parts.append('<mi>' + esc(tok) + '</mi>')
        elif tok[0].isdigit(): parts.append('<mn>' + esc(tok) + '</mn>')
        else: parts.append('<mo>' + esc(tok) + '</mo>')
    ml = ''.join(parts)
    return Rich(s, html, ml)

def f_upper(env, a):
    return rich(ev(env, a[0])).text.upper()

def f_literal(env, a):
    """literal(excluded letters, start, v1, v2, ...): consecutive letters of the alphabet without the excluded
    ones, starting at position start (best guess: scripts pass a random start in the matching range)."""
    banned = set(rich(ev(env, a[0])).text.lower())
    pool = [c for c in 'abcdefghijklmnopqrstuvwxyz' if c not in banned]
    start = int(num(ev(env, a[1]))) - 1 if len(a) > 1 and a[1] is not None else 0
    for k, x in enumerate(a[2:]):
        env.vars[name_of(x)] = pool[(start + k) % len(pool)]
    return 0.0

def f_flood(env, a):
    n = name_of(a[0])
    env.vars[n] = {}
    return 0.0

def f_supersub(env, a):
    v = [rich(x) for x in args(env, a)]
    base, sup = v[0], v[1] if len(v) > 1 else Rich('')
    sub = v[2] if len(v) > 2 else Rich('')
    return Rich(base.text + ('^' + sup.text if sup.text else '') + ('_' + sub.text if sub.text else ''),
                base.html + ('<sup>' + sup.html + '</sup>' if sup.text else '') + ('<sub>' + sub.html + '</sub>' if sub.text else ''))

def f_fences(env, a):
    v = args(env, a)
    inner = rich(v[0])
    l, r = (str(v[1]) if len(v) > 1 and v[1] else '('), (str(v[2]) if len(v) > 2 and v[2] else ')')
    return Rich(l + inner.text + r, esc(l) + inner.html + esc(r))

def f_radical(env, a):
    inner = rich(ev(env, a[0]))
    return Rich('√(' + inner.text + ')', '√<span style="text-decoration:overline">' + inner.html + '</span>')

def f_overbar(env, a):
    inner = rich(ev(env, a[0]))
    return Rich('‾' + inner.text, '<span style="text-decoration:overline">' + inner.html + '</span>')

ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'twenty thirty forty fifty sixty seventy eighty ninety'.split()
def words(n):
    n = int(round(n))
    if n < 0: return 'negative ' + words(-n)
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10 - 2] + ('-' + ONES[n % 10] if n % 10 else '')
    for size, name in ((10 ** 12, 'trillion'), (10 ** 9, 'billion'), (10 ** 6, 'million'), (1000, 'thousand'), (100, 'hundred')):
        if n >= size:
            return words(n // size) + ' ' + name + (' ' + words(n % size) if n % size else '')

def f_word(env, a):
    v = ev(env, a[0])
    try:
        return words(num(v))
    except Unsupported:
        return rich(v).text

def f_root(env, a):
    """root(index, radicand, outside, inside [, ...]): simplify; sets outside * index-th root of inside."""
    n, x = int(num(ev(env, a[0]))), int(round(num(ev(env, a[1]))))
    out = 1
    k = 2
    while k ** n <= abs(x):
        while x % (k ** n) == 0:
            x //= k ** n; out *= k
        k += 1
    if len(a) > 3:
        env.vars[name_of(a[2])] = float(out)
        env.vars[name_of(a[3])] = float(x)
    return float(out)

def f_sci(env, a):
    v = args(env, a)
    x = num(v[0])
    digits = int(num(v[1])) if len(v) > 1 and v[1] is not None else None
    if x == 0: return Rich('0')
    e = int(math.floor(math.log10(abs(x))))
    m = x / 10 ** e
    mt = ('%.*f' % (digits - 1, m)) if digits else numtext(round(m, 10))
    return Rich('%s × 10^%d' % (mt, e), '%s × 10<sup>%s</sup>' % (esc(mt), numtext(e).replace('-', '−')))

def f_symbol(env, a):
    """symbol(code): a character; codes below 128 are plain characters (13 is a line break), others the symbol font."""
    c = int(num(ev(env, a[0])))
    if c == 13: return Rich('\n', '<br>')
    if c < 128: return Rich(chr(c))
    return Rich(_SYMBOL.get(c, '?'))

def f_mean(env, a):
    v = [num(x) for x in args(env, a)]
    return sum(v) / len(v)

def f_median(env, a):
    v = sorted(num(x) for x in args(env, a))
    n = len(v)
    return v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2

def f_mode(env, a):
    """mode(out mode, out list, values...): the mode, or 0 when no value repeats (scripts reject m<>0 to
    get distinct choices)."""
    v = [numtext(num(x)) for x in args(env, a[2:])]
    best = max(sorted(set(v)), key=v.count) if v else ''
    env.vars[name_of(a[0])] = float(best) if best and v.count(best) > 1 else 0.0
    env.vars[name_of(a[1])] = {1: float(best)} if best and v.count(best) > 1 else {}
    return 0.0

GREEK = dict(zip('abgdezhqiklmnxoprstufcyw', 'αβγδεζηθικλμνξοπρστυφχψω'))
def f_arc(env, a):
    t = rich(ev(env, a[0])).text
    if len(a) > 2 and a[2] and a[2][1] == '$greek':
        t = ''.join(GREEK.get(c, c) for c in t)
    return Rich(t)

def f_embell(env, a):
    v = args(env, a)
    t = rich(v[0])
    if '$not' in [x for x in v[1:] if isinstance(x, str)]:
        return Rich(t.text + '\u0338', t.html + '&#x338;')
    return t

def f_correct(env, a):
    env.correct = rich(ev(env, a[0])).text   # names the correct choice when it is not the first answer block
    return 0.0

FUNCS = {
    'random': f_random, 'select': f_select, 'reject': f_reject, 'require': f_require,
    'duplicat': f_duplicat, 'duplicate': f_duplicat, 'format': f_format, 'comma': f_comma, 'cat': f_cat,
    'mathsym': f_mathsym, 'fraction': f_fraction, 'polynom': f_polynom, 'upper': f_upper, 'literal': f_literal,
    'flood': f_flood, 'supersub': f_supersub, 'fences': f_fences, 'radical': f_radical, 'overbar': f_overbar,
    'abs': simple(abs), 'int': simple(lambda x: math.floor(x + 1e-9) if x >= 0 else math.ceil(x - 1e-9)),
    'nint': simple(lambda x: math.floor(x + 0.5)), 'sgn': simple(lambda x: (x > 0) - (x < 0)),
    'sqr': simple(math.sqrt), 'sin': simple(math.sin), 'cos': simple(math.cos), 'tan': simple(math.tan),
    'atn': simple(math.atan), 'acos': simple(math.acos), 'log': simple(math.log10), 'exp': simple(math.exp),
    'mod': simple(lambda a, b: math.fmod(a, b)), 'min': simple(min), 'max': simple(max),
    'gcf': simple(lambda *x: __import__('functools').reduce(gcd, x)),
    'lcm': simple(lambda *x: __import__('functools').reduce(lambda p, q: abs(int(p * q)) // gcd(p, q), x)),
    'rel_prim': simple(lambda a, b: 1.0 if gcd(a, b) == 1 else 0.0),
    'rel_prime': simple(lambda a, b: 1.0 if gcd(a, b) == 1 else 0.0),
    'perf_sqr': simple(lambda x: 1.0 if x >= 0 and abs(math.isqrt(int(round(x))) ** 2 - x) < 1e-9 else 0.0),
    'fact': simple(lambda n: math.factorial(int(n))),
    'perm': simple(lambda n, r: math.perm(int(n), int(r))),
    'word': f_word, 'root': f_root, 'sci': f_sci, 'symbol': f_symbol, 'mean': f_mean, 'median': f_median,
    'mode': f_mode, 'arc': f_arc, 'embell': f_embell, 'correct': f_correct,
    'frac': simple(lambda x: x - math.floor(x)), 'atn2': simple(lambda y, x: math.atan2(y, x)),
    'lock': lambda env, a: 0.0,
}

# ---------------------------------------------------------------- functions: drawing
def pic(env, x):
    p = env.vars.get(name_of(x))
    if not isinstance(p, Pic):
        raise Unsupported('drawing on something that is not a picture')
    return p

def d_slate(env, a):
    v = args(env, a[1:])
    h, w, x0, x1, y0, y1 = [num(t) for t in v[:6]]
    env.vars[name_of(a[0])] = Pic(h, w, x0, x1, y0, y1)
    return 0.0

def d_line(env, a):
    p = pic(env, a[0])
    v = args(env, a[1:])
    if len(v) == 3:   # line(q, x1, y1, x2): a horizontal segment (seen in SX870214)
        v = v + [v[1]]
    x1, y1, x2, y2 = [num(t) for t in v[:4]]
    extra = v[4:] + [None] * 6
    thick = None if extra[0] is None else num(extra[0])
    style = None if extra[1] is None else num(extra[1])
    arrow = lambda c: '$arrow' if c == '$arrow' or c == 4.0 else None   # cap code 4 is an arrowhead too
    cap1, cap2 = arrow(extra[2]), arrow(extra[3])
    color = next((x for x in extra[4:] if isinstance(x, str)), None)
    p.items.append(_line(x1, y1, x2, y2, thick, style, cap1, cap2, color))
    return 0.0

def d_dot(env, a):
    p = pic(env, a[0])
    v = args(env, a[1:])
    x, y = num(v[0]), num(v[1])
    def draw(q):
        cx, cy = q.px(x, y)
        return '<circle cx="%.2f" cy="%.2f" r="2.2"/>' % (cx, cy)
    p.items.append(draw)
    return 0.0

SIZES = {'$tiny': 9, '$small': 11, '$normal': 13, '$large': 16}

TYPEFACE = {1: 'text', 2: 'function', 3: 'variable', '$text': 'text', '$function': 'function', '$variable': 'variable', '$symbol': 'symbol'}
SIZES = {'$tiny': 8, '$small': 10, '$sub': 10, '$full': 12, '$normal': 12, '$large': 15, 0: 12, 1: 12, 2: 10, 3: 8}

def text_svg(q, x, y, t, ha=0, face='text', size=12):
    cx, cy = q.px(x, y)
    anchor = {0: 'start', 1: 'middle', 2: 'end'}.get(ha, 'start')
    return '<text x="%.2f" y="%.2f" font-size="%d" text-anchor="%s" dominant-baseline="middle"%s>%s</text>' % (
        cx, cy, size, anchor, ' font-style="italic"' if face == 'variable' else '', esc(t))

def d_write(env, a):
    """write(pic, x, y, text [, alignment 0 left 1 centre 2 right, typeface, size, ...])."""
    p = pic(env, a[0])
    v = args(env, a[1:])
    x, y, t = num(v[0]), num(v[1]), rich(v[2]).text
    rest = v[3:] + [None] * 4
    ha = int(num(rest[0])) if isinstance(rest[0], float) else 0
    face = TYPEFACE.get(int(rest[1]) if isinstance(rest[1], float) else rest[1], 'text')
    size = SIZES.get(int(rest[2]) if isinstance(rest[2], float) else rest[2], 12)
    p.items.append(lambda q: text_svg(q, x, y, t, ha, face, size))
    return 0.0

def d_circle(env, a):
    p = pic(env, a[0])
    v = [num(x) if x is not None and not isinstance(x, str) else None for x in args(env, a[1:])] + [None] * 4
    r, cx, cy = v[0], v[1] or 0.0, v[2] or 0.0
    def draw(q):
        x, y = q.px(cx, cy)
        sx, sy = q.scale()
        return '<ellipse cx="%.2f" cy="%.2f" rx="%.2f" ry="%.2f" fill="none" stroke="#000" stroke-width="0.9"/>' % (x, y, r * sx, r * sy)
    p.items.append(draw)
    return 0.0

def d_oval(env, a):
    p = pic(env, a[0])
    v = [num(x) if x is not None else 0.0 for x in args(env, a[1:])] + [0.0] * 4
    rx, ry, cx, cy = v[0], v[1], v[2], v[3]
    def draw(q):
        x, y = q.px(cx, cy)
        sx, sy = q.scale()
        return '<ellipse cx="%.2f" cy="%.2f" rx="%.2f" ry="%.2f" fill="none" stroke="#000" stroke-width="0.9"/>' % (x, y, rx * sx, ry * sy)
    p.items.append(draw)
    return 0.0

def d_plotx(env, a):
    """plotx(pic, kind, spec [, xmin, xmax, ymin, ymax, ...]): a conic drawn only inside the window.
    kinds: $circle "r"; $gcircle "r,cx,cy"; $ellipse "rx,ry"; $gellipse "rx,ry,cx,cy" (all centred at the origin
    unless a centre is given). The window clipping is how the original draws arcs and shading."""
    p = pic(env, a[0])
    kind = ev(env, a[1])
    v = args(env, a[2:])
    try:
        spec = [float(t) for t in rich(v[0]).text.replace('−', '-').split(',') if t.strip()]
    except ValueError:
        raise Unsupported('plot spec')
    if kind == '$circle': rx = ry = spec[0]; cx = cy = 0.0
    elif kind == '$gcircle': rx = ry = spec[0]; cx, cy = (spec[1:3] + [0, 0])[:2]
    elif kind == '$ellipse': rx, ry = spec[0], spec[1]; cx = cy = 0.0
    elif kind == '$gellipse': rx, ry = spec[0], spec[1]; cx, cy = (spec[2:4] + [0, 0])[:2]
    elif kind in ('$line', '$poly', '$parabola'):
        # $line "m,b": y = mx + b; $poly "c0,c1,c2,...": y = c0 + c1 x + c2 x^2 ...; $parabola "a,h,k": y = a(x-h)^2 + k
        if kind == '$line': f = lambda x: spec[0] * x + spec[1]
        elif kind == '$poly': f = lambda x: sum(c * x ** i for i, c in enumerate(spec))
        else: f = lambda x: spec[0] * (x - spec[1]) ** 2 + spec[2]
        return graph(p, f, v)
    else: raise Unsupported('plot ' + str(kind))
    win = [num(t) if isinstance(t, float) else None for t in (v[1:5] + [None] * 4)[:4]]
    x0, x1, y0, y1 = [w if w is not None else d for w, d in zip(win, (-1e9, 1e9, -1e9, 1e9))]
    pts = []
    for k in range(721):
        t = math.radians(k / 2)
        x, y = cx + rx * math.cos(t), cy + ry * math.sin(t)
        pts.append((x, y) if x0 - 1e-9 <= x <= x1 + 1e-9 and y0 - 1e-9 <= y <= y1 + 1e-9 else None)
    def draw(q):
        out, run_ = [], []
        for pt in pts + [None]:
            if pt is None:
                if len(run_) > 1:
                    out.append('<polyline fill="none" stroke="#000" stroke-width="0.9" points="%s"/>' % ' '.join('%.2f,%.2f' % q.px(*u) for u in run_))
                run_ = []
            else:
                run_.append(pt)
        return ''.join(out)
    p.items.append(draw)
    return 0.0

def graph(p, f, v):
    win = [num(t) if isinstance(t, float) else None for t in (v[1:5] + [None] * 4)[:4]]
    x0, x1 = win[0] if win[0] is not None else p.x0, win[1] if win[1] is not None else p.x1
    y0, y1 = win[2] if win[2] is not None else p.y0, win[3] if win[3] is not None else p.y1
    pts = []
    for k in range(401):
        x = x0 + (x1 - x0) * k / 400
        y = f(x)
        pts.append((x, y) if y0 <= y <= y1 else None)
    def draw(q):
        out, run_ = [], []
        for pt in pts + [None]:
            if pt is None:
                if len(run_) > 1:
                    out.append('<polyline fill="none" stroke="#000" stroke-width="1.6" points="%s"/>' % ' '.join('%.2f,%.2f' % q.px(*u) for u in run_))
                run_ = []
            else:
                run_.append(pt)
        return ''.join(out)
    p.items.append(draw)
    return 0.0

def d_box(env, a):
    """box(pic, width, height, left, top, ..., fill, colour): a rectangle; white boxes mask parts of a drawing."""
    p = pic(env, a[0])
    v = args(env, a[1:]) + [None] * 10
    w, h, x, y = [num(t) if isinstance(t, float) else 0.0 for t in v[:4]]
    white = '$white' in [t for t in v[4:] if isinstance(t, str)]
    def draw(q):
        ax, ay = q.px(x, y)
        bx, by = q.px(x + w, y - h)
        return '<rect x="%.2f" y="%.2f" width="%.2f" height="%.2f" fill="%s" stroke="%s"/>' % (
            min(ax, bx), min(ay, by), abs(bx - ax), abs(by - ay), '#fff' if white else 'none', 'none' if white else '#000')
    p.items.append(draw)
    return 0.0

def d_ticmarks(env, a):
    """ticmarks(pic, x from, x to, x step [, y from, y to, y step, ...]): tick marks on the axes."""
    p = pic(env, a[0])
    v = [num(t) if isinstance(t, float) else None for t in args(env, a[1:])] + [None] * 8
    tx = (p.y1 - p.y0) * 0.04
    ty = (p.x1 - p.x0) * 0.04
    if v[2]:
        k = v[0]
        while k <= v[1] + 1e-9:
            p.items.append(_line(k, -tx, k, tx, 1)); k += v[2]
    if v[5]:
        k = v[3]
        while k <= v[4] + 1e-9:
            p.items.append(_line(-ty, k, ty, k, 1)); k += v[5]
    return 0.0

def d_labels(env, a):
    """labels(pic, x from, x to, x step, x offset, y from, y to, y step, y offset, ...): numbers on the axes."""
    p = pic(env, a[0])
    v = [num(t) if isinstance(t, float) else None for t in args(env, a[1:])] + [None] * 10
    sx = (p.y1 - p.y0) * 0.09
    sy = (p.x1 - p.x0) * 0.04
    if v[2]:
        k = v[0]
        while k <= v[1] + 1e-9:
            if abs(k) > 1e-9 or not v[6]:
                p.items.append(lambda q, k=k: text_svg(q, k, -sx, numtext(k).replace('-', '−'), 1, 'text', 10))
            k += v[2]
    if v[6]:
        k = v[4]
        while k <= v[5] + 1e-9:
            if abs(k) > 1e-9:
                p.items.append(lambda q, k=k: text_svg(q, -sy, k, numtext(k).replace('-', '−'), 2, 'text', 10))
            k += v[6]
    return 0.0

def d_axes(env, a):
    """axes(pic, x name, y name, ..., arrow, ..., arrow, ...): both axes across the drawing, with arrows and names."""
    p = pic(env, a[0])
    v = args(env, a[1:]) + [None] * 6
    xn, yn = rich(v[0]).text, rich(v[1]).text
    p.items.append(_line(p.x0, 0, p.x1, 0, 1, None, '$arrow', '$arrow'))
    p.items.append(_line(0, p.y0, 0, p.y1, 1, None, '$arrow', '$arrow'))
    p.items.append(lambda q: text_svg(q, p.x1, (p.y1 - p.y0) * 0.06, xn, 2, 'variable', 12))
    p.items.append(lambda q: text_svg(q, (p.x1 - p.x0) * 0.03, p.y1, yn, 0, 'variable', 12))
    return 0.0

def d_angle(env, a):
    """ANGLE(pic, measure, x, y, ray length, ?, ?, mark, mark size, rotation): two rays from (x, y)."""
    p = pic(env, a[0])
    v = args(env, a[1:]) + [None] * 10
    m, x, y, r = num(v[0]), num(v[1] or 0), num(v[2] or 0), num(v[3] or 0)
    rot = num(v[8]) if v[8] is not None and not isinstance(v[8], str) else 0.0
    for t in (rot, rot + m):
        p.items.append(_line(x, y, x + r * math.cos(math.radians(t)), y + r * math.sin(math.radians(t)), 1))
    mark = v[6]
    if mark == '$right':
        s = 1.2
        c1 = (x + s * math.cos(math.radians(rot)), y + s * math.sin(math.radians(rot)))
        c2 = (x + s * math.cos(math.radians(rot + m)), y + s * math.sin(math.radians(rot + m)))
        c3 = (c1[0] + c2[0] - x, c1[1] + c2[1] - y)
        p.items.append(_line(*c1, *c3)); p.items.append(_line(*c2, *c3))
    return 0.0

def d_nline(env, a):
    """nline(pic, from, to, tick step, label from, label to, label step, ..., arrows): a number line on y = 0."""
    p = pic(env, a[0])
    v = args(env, a[1:]) + [None] * 12
    lo, hi, step = num(v[0]), num(v[1]), num(v[2])
    l0 = num(v[3]) if v[3] is not None else lo
    l1 = num(v[4]) if v[4] is not None else hi
    ls = num(v[5]) if v[5] is not None else step
    span = p.x1 - p.x0
    ext = span * 0.06
    p.items.append(_line(lo - ext, 0, hi + ext, 0, 1, None, '$arrow', '$arrow'))
    t = (p.y1 - p.y0) * 0.08
    k = lo
    while k <= hi + 1e-9:
        p.items.append(_line(k, -t, k, t, 1))
        k += step
    k = l0
    while k <= l1 + 1e-9 and ls > 0:
        lab = numtext(k)
        def draw(q, k=k, lab=lab):
            cx, cy = q.px(k, 0)
            return '<text x="%.2f" y="%.2f" font-size="10" text-anchor="middle" dominant-baseline="hanging">%s</text>' % (cx, cy + 6, esc(lab))
        p.items.append(draw)
        k += ls
    return 0.0

def d_drawpict(env, a):
    """drawpict(pic, value, x, y [, scale]): place a picture, or typeset text, at (x, y)."""
    p = pic(env, a[0])
    v = args(env, a[1:])
    inner = v[0]
    x, y = num(v[1]), num(v[2])
    s = num(v[3]) if len(v) > 3 and v[3] is not None else 1.0
    if isinstance(inner, Pic):
        def draw(q):
            cx, cy = q.px(x, y)
            return '<g transform="translate(%.2f,%.2f) scale(%.3f)">%s</g>' % (cx, cy, s, inner.svg())
    else:
        t = rich(inner).text
        draw = lambda q: text_svg(q, x, y, t, 1, 'variable' if re.fullmatch(r'[A-Za-z]{1,3}', t) else 'text', int(13 * s))
    p.items.append(draw)
    return 0.0

def d_poly(env, a):
    """poly(pic, "x1,y1,x2,y2,..." [, ...]): a closed polygon through the listed points."""
    p = pic(env, a[0])
    pts = rich(ev(env, a[1])).text.replace('−', '-')
    try:
        nums = [float(t) for t in pts.split(',') if t.strip()]
    except ValueError:
        raise Unsupported('poly with a named shape')
    xy = list(zip(nums[0::2], nums[1::2]))
    def draw(q):
        return '<polygon fill="none" stroke="#000" stroke-width="1" points="%s"/>' % ' '.join('%.2f,%.2f' % q.px(*u) for u in xy)
    p.items.append(draw)
    return 0.0

def d_points(env, a):
    """points(pic, "x1,y1,x2,y2,..." ...): an open polyline."""
    p = pic(env, a[0])
    nums = [float(t) for t in rich(ev(env, a[1])).text.replace('−', '-').split(',') if t.strip()]
    xy = list(zip(nums[0::2], nums[1::2]))
    def draw(q):
        return '<polyline fill="none" stroke="#000" stroke-width="1" points="%s"/>' % ' '.join('%.2f,%.2f' % q.px(*u) for u in xy)
    p.items.append(draw)
    return 0.0

FUNCS.update({'slate': d_slate, 'line': d_line, 'dot': d_dot, 'write': d_write, 'circle': d_circle,
              'oval': d_oval, 'plotx': d_plotx, 'ploty': d_plotx, 'box': d_box, 'ticmarks': d_ticmarks,
              'labels': d_labels, 'axes': d_axes, 'angle': d_angle, 'nline': d_nline, 'drawpict': d_drawpict,
              'poly': d_poly, 'points': d_points})
