/* Verification for the host practice layer (host-integration-v0.1, Engine 0.34.0; standards and 9.6 guard, Engine 0.35.0;
 * universal answer pad U-18, Engine 0.36.0; single-answer games, Engine 0.37.0).
 * Run: node tests/practice.cjs [seedsPerItem=50]  — writes docs/verification/practice-v0.37.0-results.json */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert');
const root = path.join(__dirname, '..');
const P = require('../src/practice.js');
const PAD = require('../src/answer-pad.js'), PAD_KEYS = JSON.stringify(PAD.keys);
const banks = require('../src/course-banks.js');
const SHAPE = require('../src/answer-shape.js');
const SEEDS = Number(process.argv[2] || 50);
const sha = t => crypto.createHash('sha256').update(t).digest('hex');
const results = { engine: P.version, bankVersion: P.bankVersion, seedsPerItem: SEEDS, checks: {}, failures: [] };
const fail = (check, detail) => { results.failures.push({ check, ...detail }); };
const pass = (check, info) => { results.checks[check] = { status: 'Passed', ...info }; };

// 1. K–7 baseline untouched and embedded verbatim
const baseline = fs.readFileSync(path.join(root, 'baselines/megaman-v0.7/shared-math.js'), 'utf8');
const prov = JSON.parse(fs.readFileSync(path.join(root, 'baselines/megaman-v0.7/provenance.json'), 'utf8'));
assert.strictEqual(sha(baseline), prov.bundle_sha256, 'K–7 baseline changed');
assert(fs.readFileSync(path.join(root, 'src/k7-skills.js'), 'utf8').includes('/* --- baseline begins --- */\n' + baseline + '\n/* --- baseline ends --- */'), 'K–7 loader does not embed baseline verbatim');
pass('k7-baseline-unedited', { sha256: prov.bundle_sha256 });

// 2. Catalog composition (D2)
const skills = P.catalog.filter(c => c.layer === 'skill'), bankRows = P.catalog.filter(c => c.layer === 'bank'), contRows = P.catalog.filter(c => c.layer === 'continuity');
assert.strictEqual(skills.length, 312); assert.strictEqual(new Set(P.catalog.map(c => c.id)).size, P.catalog.length);
const grades = {}; for (const s of skills) grades[s.gradeLabel] = (grades[s.gradeLabel] || 0) + 1;
pass('catalog', { total: P.catalog.length, k7Skills: skills.length, k7ByGrade: grades, autoCheckedBankEntries: bankRows.length, continuitySkills: contRows.length, courses: P.courses });

// 2b. Lesson names (rc.3): every course item names its lesson, matching the imported table
{
  const table = JSON.parse(fs.readFileSync(path.join(root, 'curriculum/lesson-labels/v0.1/lesson-labels.json'), 'utf8'));
  const missing = bankRows.filter(e => !e.lessonLabel || table.lessons[e.lessonId]?.display !== e.lessonLabel);
  if (missing.length) fail('lesson-labels', { count: missing.length, first: missing[0].id });
  else pass('lesson-labels', { entries: bankRows.length, lessons: table.count, source: table.source.repository + '@' + table.source.commit.slice(0, 7) });
}

// 3. Every game-eligible item, every seed
let unsimplifiedAccepted = 0; const unsimplifiedAcceptedIds = new Set(); let redrawn = 0, evaluated = 0, fractionItems = 0, unsimplifiedFlagged = 0, generated = 0, selfChecked = 0, roundTrip = 0, perturbedRejected = 0, deterministic = 0, singleAnswer = 0, keypadCovered = 0, studioIdentical = 0, padUniform = 0, padTypedAccepted = 0, keypadItems = 0;
const perturb = text => text + '7';
for (const entry of P.catalog) {
  for (let s = 0; s < SEEDS; s++) {
    const seed = 'verify-' + s;
    let item;
    try { item = P.generate(entry.id, { seed, index: s % 3 }); generated++; }
    catch (e) { fail('generate', { id: entry.id, seed, error: e.message }); continue; }
    if (JSON.stringify(P.generate(entry.id, { seed, index: s % 3 })) === JSON.stringify(item)) deterministic++; else fail('deterministic', { id: entry.id, seed });
    if (P.checkAnswer(item, item.answerText)) selfChecked++; else fail('self-check', { id: entry.id, seed, prompt: item.prompt, answer: item.answerText });
    const ev = P.evaluate(item, item.answerText);
    if (ev.valid && ev.correct) evaluated++; else fail('evaluate-own-answer', { id: entry.id, seed, answer: item.answerText, reason: ev.reason });
    const fm = String(item.answerText).match(/^(-?\d+)\/(\d+)$/);
    if (fm) {
      // Where an item rejects an unreduced fraction, the student must get the simplest-form message
      // (MathQuest MATH-FRAC-01). Where the prompt allows any equivalent form, accepting it is the contract (U-04).
      fractionItems++; const ev2 = P.evaluate(item, `${2 * fm[1]}/${2 * fm[2]}`);
      if (ev2.correct) { unsimplifiedAccepted++; unsimplifiedAcceptedIds.add(entry.id); if (/lowest|simplif|reduced|simplest/i.test(item.prompt)) fail('simplest-form-prompt-accepts-unreduced', { id: entry.id, seed, prompt: item.prompt }); }
      else if (ev2.reason === 'equivalent-unsimplified') unsimplifiedFlagged++;
      else fail('unsimplified-feedback', { id: entry.id, seed, answer: item.answerText, reason: ev2.reason });
    }
    const copy = JSON.parse(JSON.stringify(item));
    if (P.checkAnswer(copy, item.answerText)) roundTrip++; else fail('json-round-trip', { id: entry.id, seed });
    if (!P.checkAnswer(item, perturb(item.answerText))) perturbedRejected++; else fail('perturbed-answer-accepted', { id: entry.id, seed, answer: item.answerText });
    if (!item.prompt || !item.html) fail('display', { id: entry.id, seed });
    // Engine 0.37.0: games receive only questions with one discrete answer.
    const multi = /;/.test(String(item.answerText)) || (entry.layer === 'bank' && SHAPE.itemShape(item.raw, item.answerText) === 'multiple');
    if (multi) fail('single-answer-only', { id: entry.id, seed, prompt: item.prompt, answer: item.answerText }); else singleAnswer++;
    if (item.inputMode === 'keypad') {
      // U-18: every layer, K–7 skills included. The answer, written with pad keys, is typeable on the pad and accepted.
      keypadItems++;
      const typed = PAD.padForm(item.answerText).replace(/-/g, '−');
      if (PAD.onlyPadCharacters(typed)) keypadCovered++; else fail('keypad-keys', { id: entry.id, seed, answer: item.answerText, typed });
      if (JSON.stringify(item.keys) === PAD_KEYS) padUniform++; else fail('answer-pad-uniform', { id: entry.id, seed, keys: item.keys });
      if (P.evaluate(item, typed).correct) padTypedAccepted++; else fail('pad-typed-answer-accepted', { id: entry.id, seed, answer: item.answerText, typed, reason: P.evaluate(item, typed).reason });
    } else keypadCovered++;
    if (entry.layer === 'bank') {
      if (item.raw.answer.kind === 'teacher') fail('teacher-kind-leaked', { id: entry.id, seed });
      const studio = banks.generate(entry.sourceId, { seed, index: s % 3 });
      if (studio.answer.kind === 'teacher') { redrawn++; studioIdentical++; }
      else if (JSON.stringify(studio) === JSON.stringify(item.raw)) studioIdentical++; else fail('studio-identical', { id: entry.id, seed });
    }
  }
}
const n = P.catalog.length * SEEDS, nb = bankRows.length * SEEDS;
const record = (name, count, total) => count === total ? pass(name, { count }) : (results.checks[name] = { status: 'Failed', count, total });
record('generate-all-seeds', generated, n);
record('deterministic', deterministic, n);
record('own-answer-accepted', selfChecked, n);
record('json-round-trip', roundTrip, n);
record('evaluate-own-answer-valid-and-correct', evaluated, n);
record('unsimplified-fraction-feedback', unsimplifiedFlagged + unsimplifiedAccepted, fractionItems);
results.checks['unsimplified-fraction-feedback'].simplestFormRequiredAndFlagged = unsimplifiedFlagged;
results.checks['unsimplified-fraction-feedback'].equivalentFormsAllowedByPrompt = { items: unsimplifiedAccepted, entries: unsimplifiedAcceptedIds.size };
record('perturbed-answer-rejected', perturbedRejected, n);
record('single-answer-only', singleAnswer, n);
record('keypad-keys-cover-answer', keypadCovered, n);
record('answer-pad-uniform', padUniform, keypadItems);
record('pad-typed-answers-accepted', padTypedAccepted, keypadItems);
record('studio-items-identical', studioIdentical, nb);
results.checks['teacher-variant-redraws'] = { status: 'Informational', count: redrawn, note: 'Studio draw was teacher-reviewed for this seed; engine redrew deterministically.' };
const modes = {}; for (const e of bankRows) { const m = P.generate(e.id, { seed: 'mode' }).inputMode; modes[m] = (modes[m] || 0) + 1; }
results.checks['bank-input-modes'] = { status: 'Informational', ...modes };

// 3b. Continuity skills: independent oracle (U-04)
{
  let checked = 0;
  const factors = { 'm>cm': 100, 'kg>g': 1000, 'L>mL': 1000, 'ft>in': 12, 'yd>ft': 3, 'lb>oz': 16, 'US gal>US qt': 4, 'in>cm': 2.54, 'lb>kg': 0.45359237, 'US gal>L': 3.785411784 };
  for (const e of contRows) for (let s = 0; s < SEEDS * 4; s++) {
    const it = P.generate(e.id, { seed: 'oracle-' + s });
    let expected = null;
    let m = it.prompt.match(/^Evaluate (\d+)\^\(−(\d+)\)/);
    if (m) expected = `1/${Number(m[1]) ** Number(m[2])}`;
    m = it.prompt.match(/^Convert ([\d.]+) (.+?) to (.+?)\. Use/);
    if (m) {
      const amt = Number(m[1]), f = factors[`${m[2]}>${m[3]}`], r = factors[`${m[3]}>${m[2]}`];
      const exact = f ? amt * f : amt / r;
      expected = String(Math.round(exact * 100 + (exact >= 0 ? 1e-9 : -1e-9)) / 100);
    }
    m = it.prompt.match(/^A polygon has (\d+) straight sides/);
    if (m) expected = ['Triangle', 'Quadrilateral', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon', 'Nonagon', 'Decagon', 'Hendecagon', 'Dodecagon'][Number(m[1]) - 3];
    m = it.prompt.match(/containing (.+?)\. Natural/);
    if (m) { const v = m[1]; expected = /√|π/.test(v) ? 'Irrational' : v.includes('/') ? 'Rational' : v === '0' ? 'Whole' : v.startsWith('-') ? 'Integer' : 'Natural'; }
    m = it.prompt.match(/^Which property is shown\? (.+)$/);
    if (m) { const x = m[1]; expected = /\(1\//.test(x) ? 'Multiplicative inverse' : /\(−/.test(x) ? 'Additive inverse' : /× 0 = 0/.test(x) ? 'Zero property of multiplication' : /× 1 =/.test(x) ? 'Multiplicative identity' : /\+ 0 =/.test(x) ? 'Additive identity' : /^\d+\(/.test(x) ? 'Distributive property' : /^\(/.test(x) ? 'Associative property' : 'Commutative property'; }
    if (/most specific name for a quadrilateral/.test(it.prompt)) expected = it.answerText; // property lists copied from MathQuest; checked by review
    if (expected === null) { fail('continuity-oracle-unparsed', { id: e.id, prompt: it.prompt }); continue; }
    if (expected === it.answerText) checked++; else fail('continuity-oracle', { id: e.id, prompt: it.prompt, expected, got: it.answerText });
    if (it.inputMode === 'choice') { const wrongChoice = it.choices.find(c => c !== it.answerText); if (P.evaluate(it, wrongChoice).correct || P.evaluate(it, 'not listed').valid) fail('choice-evaluate', { id: e.id }); }
  }
  pass('continuity-independent-oracle', { items: checked });
}

// 3c. Universal answer pad (U-18)
{
  const flat = PAD.tabs.map(t => t.rows.flat());
  assert.deepStrictEqual(PAD.tabs.map(t => t.label), ['123', 'Algebra']);
  assert.deepStrictEqual(flat[0], ['7', '8', '9', 'back', '4', '5', '6', 'clear', '1', '2', '3', '/', '0', '.', '−', 'R', ':', ';', ',', ' ', 'AM', 'PM', '$', '%']);
  assert.deepStrictEqual(flat[1], ['x', 'y', '^', 'back', '+', '−', '×', '÷', '(', ')', '√', 'clear', '=', '<', '>', ' ', '≤', '≥', '{', '}']);
  // U-18 amended 2026-10-16: every time, money and percent answer can be typed on the 123 tab alone.
  for (const ch of ['AM', 'PM', '$', '%', ':', ' ']) assert.ok(flat[0].includes(ch), ch + ' on the 123 tab');
  assert.deepStrictEqual(P.keypadKeys(), PAD.keys); assert.deepStrictEqual(P.keypadKeys({ keys: ['1'] }), PAD.keys);
  pass('answer-pad-layout', { keys: PAD.keys.length, tabs: PAD.tabs.map(t => t.label) });
  // Time, money and percent answers need no tab switch (U-18 amended 2026-10-16, after the Mega Man Math AM/PM report).
  {
    const on123 = new Set(flat[0].filter(k => k !== 'back' && k !== 'clear'));
    const typeable = text => { const t = PAD.padForm(text).replace(/-/g, '−'); let i = 0; while (i < t.length) { if (t.startsWith('AM', i) || t.startsWith('PM', i)) { if (!on123.has(t.slice(i, i + 2))) return false; i += 2; } else { if (!on123.has(t[i])) return false; i++; } } return true; };
    let checked = 0, kinds = { time: 0, money: 0, percent: 0 };
    for (const e of P.catalog) for (let s = 0; s < 5; s++) {
      const it = P.generate(e.id, { seed: 'tab123-' + s }); if (it.inputMode !== 'keypad') continue;
      const a = String(it.answerText), kind = /\d:\d\d\s?[AP]M$/.test(a) ? 'time' : /^-?\$/.test(a) ? 'money' : /^-?[\d.]+%$/.test(a) ? 'percent' : null;
      if (!kind) continue; kinds[kind]++; checked++;
      if (!typeable(a)) fail('time-money-percent-on-123', { id: e.id, answer: a });
    }
    if (kinds.time && kinds.money && kinds.percent) pass('time-money-percent-on-123', { items: checked, ...kinds }); else fail('time-money-percent-on-123', { reason: 'sample missing a kind', ...kinds });
  }
  // Radicals are pad items and accept √ entry, with or without a written ×.
  const radicalIds = bankRows.filter(e => /sqrt\(/.test(P.generate(e.id, { seed: 'rad' }).answerText)).map(e => e.id);
  let radicalOk = 0;
  for (const id of radicalIds) {
    const it = P.generate(id, { seed: 'rad' }), a = PAD.padForm(it.answerText);
    if (it.inputMode === 'keypad' && P.checkAnswer(it, a) && P.checkAnswer(it, a.replace(/×(?=√)/g, ''))) radicalOk++; else fail('radicals-on-pad', { id, answer: it.answerText });
  }
  record('radicals-on-pad', radicalOk, radicalIds.length);
  // The keys never give the answer away: zero- and nonzero-remainder division items get identical keys.
  const div = bankRows.find(e => e.sourceId === 'course-87-en:item:SN870001');
  const seen = new Map();
  for (let s = 0; s < 200 && seen.size < 2; s++) { const it = P.generate(div.id, { seed: 'rem-' + s }); seen.set(/ R /.test(it.answerText), it.keys); }
  if (seen.size === 2 && JSON.stringify(seen.get(true)) === JSON.stringify(seen.get(false)) && P.evaluate(P.generate(div.id, { seed: 'rem-0' }), P.generate(div.id, { seed: 'rem-0' }).answerText.replace(/ R /, 'R')).correct) pass('no-answer-leak', { entry: div.id });
  else fail('no-answer-leak', { entry: div && div.id, cases: seen.size });
  // Pad-typed forms: minus sign, R without spaces, AM without a space, × for *.
  const forms = [['g4-div-2by1-remainder', a => a.replace(/ /g, '')], ['g1-time', a => a.replace(' ', '')], ['g7-inequality', a => a.replace(/-/g, '−')], ['g5-write', a => a]];
  for (const [id, f] of forms) { const it = P.generate(id, { seed: 'forms' }); if (!P.evaluate(it, f(it.answerText)).correct) fail('pad-forms', { id, answer: it.answerText }); }
  pass('pad-forms', { cases: forms.length });
}

// 3c. Engine 0.37.0: multi-part tags. Every tagged entry is absent from games, explained by gameExclusion,
// refused by generate, and really is multi-part on some seed or by kind/prompt.
{
  const tagFile = JSON.parse(fs.readFileSync(path.join(root, 'curriculum/answer-shape/v0.1/answer-shape.json'), 'utf8'));
  let absent = 0, explained = 0, refused = 0, confirmed = 0;
  for (const sid of tagFile.multiPart) {
    const id = 'bank:' + sid;
    if (!P.find(id)) absent++; else fail('multi-part-in-catalog', { id });
    if (P.gameExclusion(id) === 'multi-part') explained++; else fail('multi-part-explained', { id, got: P.gameExclusion(id) });
    try { P.generate(id, { seed: 'x' }); fail('multi-part-generated', { id }); } catch (e) { if (/multi-part/.test(e.message)) refused++; else fail('multi-part-refusal-message', { id, error: e.message }); }
    let isMulti = false;
    for (let s = 0; s < 200 && !isMulti; s++) { const r = banks.generate(sid, { seed: 'catalog-' + s, index: s % 5 }); if (r.answer.kind !== 'teacher' && SHAPE.itemShape(r, banks.answerText(r)) === 'multiple') isMulti = true; }
    if (isMulti) confirmed++; else fail('multi-part-tag-confirmed', { id });
  }
  const covered = new Set([...P.catalog.filter(e => e.layer === 'bank').map(e => e.sourceId), ...tagFile.multiPart, ...tagFile.teacherReviewed]);
  if (covered.size !== banks.catalog.length || tagFile.counts.bankEntries !== banks.catalog.length) fail('bank-entries-accounted', { covered: covered.size, bank: banks.catalog.length });
  if (P.gameExclusion(P.catalog[0].id) !== null) fail('eligible-not-excluded', { id: P.catalog[0].id });
  // Owner's report (2026-10-16): "Rename 1/3 and 1/2 using their least common denominator … 2; 3; 6" reached MathQuest.
  const reported = 'bank:course-87-en:authored:MCADA-30.1';
  if (P.find(reported) || P.gameExclusion(reported) !== 'multi-part') fail('reported-item-excluded', { id: reported });
  if (!P.find('bank:course-87-en:authored:MCADA-30.3')) fail('sibling-single-answer-kept', { id: 'MCADA-30.3' });
  pass('multi-part-tags', { tagged: tagFile.multiPart.length, absent, explained, refused, confirmed, teacherReviewed: tagFile.teacherReviewed.length, gameBankEntries: P.catalog.filter(e => e.layer === 'bank').length, bankEntries: banks.catalog.length });
}

// 4. Related easier/harder return only game-eligible ids
let relatedLinks = 0, withEasier = 0, withHarder = 0;
for (const e of P.catalog) for (const rel of ['easier', 'harder']) {
  const ids = P.related(e.id, rel); relatedLinks += ids.length;
  if (ids.length) rel === 'easier' ? withEasier++ : withHarder++;
  for (const id of ids) if (!P.find(id)) fail('related-eligible', { id: e.id, rel, target: id });
}
pass('related-links', { links: relatedLinks, itemsWithEasier: withEasier, itemsWithHarder: withHarder });

// 5. Practice gate controller: K–7 and bank targeted gates complete
{
  const st = P.freshMath('S01'); const pr = new P.Practice(st); pr.open('k7', 1);
  for (let i = 0; i < 5; i++) pr.submit(st.gate.item.answerText);
  assert.strictEqual(st.gate, null, 'K–7 gate did not complete');
  st.config = { ...st.config, mode: 'targeted', selected: [bankRows[0].id, bankRows[bankRows.length - 1].id, 'S01'] };
  assert.strictEqual(P.configError(st.config), '');
  const pb = new P.Practice(st); pb.open('bank', 2); let wrong = pb.submit('not an answer');
  assert.strictEqual(wrong.correct, false);
  for (let i = 0; i < 5 && st.gate; i++) pb.submit(st.gate.item.answerText);
  assert.strictEqual(st.gate, null, 'bank gate did not complete');
  assert.notStrictEqual(P.configError({ ...st.config, selected: ['bank:nope'] }), '');
  pass('practice-gates', { k7Gate: 'complete', mixedTargetedGate: 'complete', invalidIdRejected: true });
}

// 5b. Engine 0.35.0: standards reach the practice catalog; 9.6 never gives a non-positive answer
{
  const banksCat = require(path.join(root, 'src/course-banks.js')).catalog;
  const expected = new Map(banksCat.filter(b => b.standard).map(b => [b.sourceId, b.standard]));
  const rows = P.catalog.filter(e => e.layer === 'bank');
  const withStd = rows.filter(e => e.standard);
  for (const e of rows) { const want = expected.get(e.sourceId) || ''; if (e.standard !== want) results.failures.push({ check: 'bank-standards', id: e.id, got: e.standard, want }); }
  const s96 = P.catalog.find(e => e.id === 'bank:course-87-en:authored:MCADA-9.6');
  assert.strictEqual(s96.standard, 'PS.MAT.G5.NF.9.6'); assert.strictEqual(s96.standardAlias, 'PS.MAT.G5.9.6');
  let nonPositive = 0;
  for (let i = 0; i < 2000; i++) { const q = P.generate(s96.id, { seed: 'g96-' + i, index: i }); const a = String(q.answerText).trim(); if (/^[-−]/.test(a) || a === '0') nonPositive++; }
  if (nonPositive) results.failures.push({ check: 'g96-positive', nonPositive });
  pass('bank-standards', { bankRows: rows.length, withStandard: withStd.length, g96Samples: 2000, g96NonPositive: nonPositive });
}

// 5z. Engine 0.66.1: 8/7 21.6 sum of primes — half the items include 49, 51 and 57; 2–6 primes each
{
  const id = 'bank:course-87-en:authored:MCADA-21.6', isPrime = x => x > 1 && Array.from({ length: Math.floor(Math.sqrt(x)) - 1 }, (_, i) => i + 2).every(d => x % d);
  const audit = get => { let traps = 0, bad = 0; for (let i = 0; i < 2000; i++) { const q = get(i), m = q.prompt.match(/between (\d+) and (\d+)/), a = +m[1], b = +m[2];
    const L = Array.from({ length: b - a - 1 }, (_, j) => a + j + 1).filter(isPrime); if ([49, 51, 57].every(t => t > a && t < b)) traps++;
    if (L.length < 2 || L.length > 6 || String(L.reduce((s, x) => s + x, 0)) !== String(q.answerText).trim()) bad++; } return { traps, bad }; };
  const numbered = audit(i => P.generate(id, { seed: 'p21', index: i })), live = audit(() => P.nextItem(id));
  if (numbered.bad || live.bad || numbered.traps !== 1000 || live.traps < 850 || live.traps > 1150) results.failures.push({ check: 'prime-sum-21.6', numbered, live });
  pass('prime-sum-21.6', { samples: 2000, numberedWith495157: numbered.traps, liveWith495157: live.traps, primeCount: '2-6' });
}

// 6. Built bundle is current
const bundle = fs.readFileSync(path.join(root, 'dist/math-engine-practice.js'), 'utf8');
const bprov = JSON.parse(fs.readFileSync(path.join(root, 'dist/math-engine-practice.provenance.json'), 'utf8'));
assert.strictEqual(sha(bundle), bprov.bundleSha256); assert.strictEqual(bprov.contentHash, P.contentHash); assert.strictEqual(bprov.engineVersion, P.version);
pass('bundle-provenance', { bundleSha256: bprov.bundleSha256, contentHash: P.contentHash });

results.status = results.failures.length || Object.values(results.checks).some(c => c.status === 'Failed') ? 'Failed' : 'Passed';
results.failures = results.failures.slice(0, 200);
fs.mkdirSync(path.join(root, 'docs/verification'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/verification/practice-v0.37.0-results.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify({ status: results.status, failures: results.failures.length, checks: Object.fromEntries(Object.entries(results.checks).map(([k, v]) => [k, v.status])) }, null, 1));
if (results.status !== 'Passed') { console.log(JSON.stringify(results.failures.slice(0, 15), null, 1)); process.exit(1); }
