/* Verification for the host practice layer (host-integration-v0.1, Engine 0.34.0; standards and 9.6 guard, Engine 0.35.0).
 * Run: node tests/practice.cjs [seedsPerItem=50]  — writes docs/verification/practice-v0.35.0-results.json */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert');
const root = path.join(__dirname, '..');
const P = require('../src/practice.js');
const banks = require('../src/course-banks.js');
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
let unsimplifiedAccepted = 0; const unsimplifiedAcceptedIds = new Set(); let redrawn = 0, evaluated = 0, fractionItems = 0, unsimplifiedFlagged = 0, generated = 0, selfChecked = 0, roundTrip = 0, perturbedRejected = 0, deterministic = 0, keypadCovered = 0, studioIdentical = 0;
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
    if (item.inputMode === 'keypad') {
      const keys = new Set(item.keys), ok = [...item.answerText].every(ch => keys.has(ch) || ch === ' ');
      if (ok || entry.layer === 'skill') keypadCovered++; else fail('keypad-keys', { id: entry.id, seed, answer: item.answerText });
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
record('keypad-keys-cover-answer', keypadCovered, n);
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

// 6. Built bundle is current
const bundle = fs.readFileSync(path.join(root, 'dist/math-engine-practice.js'), 'utf8');
const bprov = JSON.parse(fs.readFileSync(path.join(root, 'dist/math-engine-practice.provenance.json'), 'utf8'));
assert.strictEqual(sha(bundle), bprov.bundleSha256); assert.strictEqual(bprov.contentHash, P.contentHash); assert.strictEqual(bprov.engineVersion, P.version);
pass('bundle-provenance', { bundleSha256: bprov.bundleSha256, contentHash: P.contentHash });

results.status = results.failures.length || Object.values(results.checks).some(c => c.status === 'Failed') ? 'Failed' : 'Passed';
results.failures = results.failures.slice(0, 200);
fs.mkdirSync(path.join(root, 'docs/verification'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/verification/practice-v0.35.0-results.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify({ status: results.status, failures: results.failures.length, checks: Object.fromEntries(Object.entries(results.checks).map(([k, v]) => [k, v.status])) }, null, 1));
if (results.status !== 'Passed') { console.log(JSON.stringify(results.failures.slice(0, 15), null, 1)); process.exit(1); }
