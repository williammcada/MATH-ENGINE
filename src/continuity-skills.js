/*
 * Continuity skills (host-integration-v0.1, decision D3).
 * MathQuest modules with no equivalent elsewhere in the engine. Their accepted constructs are
 * reimplemented here so the mathematics lives in the engine, not in MathQuest:
 *   exponent.negative, measurement.conversions, number.properties, geometry.polygons,
 *   number.real-family.
 * Each generator receives a seeded random() and returns
 *   { prompt, promptHTML?, kind, answer, choices?, solution }.
 * kind: 'fraction' (simplest form required), 'number' (exact decimal), 'choice'.
 */
'use strict';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function helpers(random) {
  const int = (a, b) => a + Math.floor(random() * (b - a + 1));
  const pick = a => a[int(0, a.length - 1)];
  return { int, pick };
}
// Round half up on the decimal value (avoids 0.145 → 0.14 from binary floating point).
const round2 = x => Number(Math.round(Number(x.toPrecision(12) + 'e2')) + 'e-2');

function negativeExponent(maxBase, maxExp) {
  return random => {
    const { int } = helpers(random), base = int(2, maxBase), exp = int(1, maxExp), den = base ** exp;
    return {
      prompt: `Evaluate ${base}^(−${exp}). Give a simplified fraction.`,
      promptHTML: `Evaluate ${base}<sup>−${exp}</sup>. Give a simplified fraction.`,
      kind: 'fraction', answer: `1/${den}`,
      solution: `${base}^(−${exp}) = 1/${base}^${exp} = 1/${den}.`
    };
  };
}

const METRIC = [['m', 'cm', 100, '1 m = 100 cm'], ['kg', 'g', 1000, '1 kg = 1,000 g'], ['L', 'mL', 1000, '1 L = 1,000 mL']];
const CUSTOMARY = [['ft', 'in', 12, '1 ft = 12 in'], ['yd', 'ft', 3, '1 yd = 3 ft'], ['lb', 'oz', 16, '1 lb = 16 oz'], ['US gal', 'US qt', 4, '1 US gallon = 4 US quarts']];
const CROSS = [['in', 'cm', 2.54, '1 in = 2.54 cm'], ['lb', 'kg', 0.45359237, '1 lb = 0.45359237 kg'], ['US gal', 'L', 3.785411784, '1 US gallon = 3.785411784 L']];
function unitConversion(level) {
  const pool = level === 0 ? METRIC : level === 1 ? [...METRIC, ...CUSTOMARY] : [...METRIC, ...CUSTOMARY, ...CROSS];
  return random => {
    const { int, pick } = helpers(random);
    const [from, to, factor, rule] = pick(pool), reverse = random() < 0.5, amount = int(2, 30) * (level ? 0.5 : 1);
    const exact = reverse ? amount / factor : amount * factor, answer = round2(exact);
    const a = reverse ? to : from, b = reverse ? from : to;
    return {
      prompt: `Convert ${amount} ${a} to ${b}. Use ${rule}. Round to the nearest hundredth.`,
      kind: 'number', answer: String(answer),
      solution: `${amount} ${a} ${reverse ? '÷' : '×'} ${factor} = ${Number(exact.toPrecision(12))} ${b}, which rounds to ${answer} ${b}.`
    };
  };
}

const PROPERTY_NAMES = ['Commutative property', 'Associative property', 'Distributive property', 'Additive identity', 'Multiplicative identity', 'Additive inverse', 'Multiplicative inverse', 'Zero property of multiplication'];
function properties(count) {
  return random => {
    const { int, pick } = helpers(random), a = int(2, 9), b = int(2, 9), c = int(2, 9);
    const rows = [[`${a} + ${b} = ${b} + ${a}`], [`(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`], [`${a}(${b} + ${c}) = ${a}×${b} + ${a}×${c}`], [`${a} + 0 = ${a}`], [`${a} × 1 = ${a}`], [`${a} + (−${a}) = 0`], [`${a} × (1/${a}) = 1`], [`${a} × 0 = 0`]]
      .map((r, i) => [PROPERTY_NAMES[i], r[0]]);
    const [answer, example] = pick(rows.slice(0, count));
    return { prompt: `Which property is shown? ${example}`, kind: 'choice', answer, choices: PROPERTY_NAMES.slice(), solution: `${example} shows the ${answer.toLowerCase()}.` };
  };
}

const POLYGONS = ['Triangle', 'Quadrilateral', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon', 'Nonagon', 'Decagon', 'Hendecagon', 'Dodecagon'];
const QUADS = [['Square', 'four equal sides and four right angles'], ['Rectangle', 'four right angles and unequal adjacent sides'], ['Rhombus', 'four equal sides and no right angles'], ['Parallelogram', 'two pairs of parallel sides, unequal adjacent sides, and no right angles'], ['Trapezoid', 'exactly one pair of parallel sides'], ['Kite', 'two distinct pairs of equal adjacent sides, and no parallel sides']];
function polygonNames(extended) {
  return random => {
    const { int, pick } = helpers(random);
    if (!extended || random() < 0.4) {
      const sides = int(3, extended ? 12 : 8);
      return { prompt: `A polygon has ${sides} straight sides. What is its name?`, kind: 'choice', answer: POLYGONS[sides - 3], choices: POLYGONS.slice(), solution: `A ${sides}-sided polygon is a ${POLYGONS[sides - 3].toLowerCase()}.` };
    }
    const [answer, props] = pick(QUADS);
    return { prompt: `Choose the most specific name for a quadrilateral with ${props}. Here, a trapezoid has exactly one pair of parallel sides.`, kind: 'choice', answer, choices: QUADS.map(q => q[0]), solution: `${props[0].toUpperCase() + props.slice(1)}: ${answer.toLowerCase()}.` };
  };
}

function realFamily(random) {
  const { int, pick } = helpers(random), n = int(2, 12);
  const rows = [['Natural', String(n)], ['Whole', '0'], ['Integer', String(-n)], ['Rational', `${n}/${n + 1}`], ['Irrational', pick(['√2', '√3', '√5', 'π'])]];
  const [answer, v] = pick(rows);
  return { prompt: `Choose the smallest number family containing ${v}. Natural numbers begin at 1; whole numbers include 0.`, kind: 'choice', answer, choices: ['Natural', 'Whole', 'Integer', 'Rational', 'Irrational'], solution: `${v} is ${answer === 'Integer' || answer === 'Irrational' ? 'an' : 'a'} ${answer.toLowerCase()} number, and no smaller family contains it.` };
}

// id, name, grade (null = grade-agnostic, like course banks), easier id, generator
const SKILLS = [
  ['mq-negative-exponents-basic', 'Negative exponents (bases 2–5)', null, null, negativeExponent(5, 3)],
  ['mq-negative-exponents', 'Negative exponents (bases 2–8)', null, 'mq-negative-exponents-basic', negativeExponent(8, 4)],
  ['mq-unit-conversions-metric', 'Unit conversions: metric', null, null, unitConversion(0)],
  ['mq-unit-conversions-customary', 'Unit conversions: metric and customary', null, 'mq-unit-conversions-metric', unitConversion(1)],
  ['mq-unit-conversions-cross', 'Unit conversions: across systems', null, 'mq-unit-conversions-customary', unitConversion(2)],
  ['mq-properties-basic', 'Properties of operations: identify (core five)', null, null, properties(5)],
  ['mq-properties', 'Properties of operations: identify (all eight)', null, 'mq-properties-basic', properties(8)],
  ['mq-polygon-names-basic', 'Name polygons with 3–8 sides', null, null, polygonNames(false)],
  ['mq-polygon-names', 'Name polygons and classify quadrilaterals', null, 'mq-polygon-names-basic', polygonNames(true)],
  ['mq-real-number-family', 'Smallest number family', null, null, realFamily]
].map(([id, name, grade, easier, make]) => Object.freeze({ id, name, grade, easier, make }));

function reduced(n, d) { const g = (a, b) => b ? g(b, a % b) : Math.abs(a); const k = g(n, d); return [n / k, d / k]; }
function parseFraction(text) {
  const m = String(text).trim().replace(/−/g, '-').match(/^(-?\d+)\s*\/\s*(-?\d+)$/) || (/^-?\d+$/.test(String(text).trim()) ? [0, String(text).trim(), '1'] : null);
  if (!m || Number(m[2]) === 0) return null;
  let n = Number(m[1]), d = Number(m[2]); if (d < 0) { n = -n; d = -d; }
  return { n, d };
}
function parseDecimal(text) { const t = String(text).trim().replace(/−/g, '-'); return /^-?(?:\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : null; }

/** Returns { valid, correct, equivalentUnsimplified } for a continuity item. */
function check(item, response) {
  const text = String(response ?? '').trim();
  if (!text) return { valid: false, correct: false };
  if (item.kind === 'choice') return { valid: true, correct: text.toLowerCase() === String(item.answer).toLowerCase() };
  if (item.kind === 'fraction') {
    const got = parseFraction(text), want = parseFraction(item.answer);
    if (!got) return { valid: false, correct: false };
    const [rn, rd] = reduced(got.n, got.d), same = rn * want.d === want.n * rd;
    const isReduced = rn === got.n && rd === got.d;
    return { valid: true, correct: same && isReduced, equivalentUnsimplified: same && !isReduced };
  }
  const got = parseDecimal(text);
  if (got === null) return { valid: false, correct: false };
  return { valid: true, correct: Math.abs(got - Number(item.answer)) < 1e-9 };
}

module.exports = Object.freeze({ SKILLS, check, esc });
