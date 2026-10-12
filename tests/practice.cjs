/* Verification for the host practice layer (host-integration-v0.1, Engine 0.34.0).
 * Run: node tests/practice.cjs [seedsPerItem=50]  — writes docs/verification/practice-v0.34.0-results.json */
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
const skills = P.catalog.filter(c => c.layer === 'skill'), bankRows = P.catalog.filter(c => c.layer === 'bank');
assert.strictEqual(skills.length, 312); assert.strictEqual(new Set(P.catalog.map(c => c.id)).size, P.catalog.length);
const grades = {}; for (const s of skills) grades[s.gradeLabel] = (grades[s.gradeLabel] || 0) + 1;
pass('catalog', { total: P.catalog.length, k7Skills: skills.length, k7ByGrade: grades, autoCheckedBankEntries: bankRows.length, courses: P.courses });

// 3. Every game-eligible item, every seed
let redrawn = 0, generated = 0, selfChecked = 0, roundTrip = 0, perturbedRejected = 0, deterministic = 0, keypadCovered = 0, studioIdentical = 0;
const perturb = text => text + '7';
for (const entry of P.catalog) {
  for (let s = 0; s < SEEDS; s++) {
    const seed = 'verify-' + s;
    let item;
    try { item = P.generate(entry.id, { seed, index: s % 3 }); generated++; }
    catch (e) { fail('generate', { id: entry.id, seed, error: e.message }); continue; }
    if (JSON.stringify(P.generate(entry.id, { seed, index: s % 3 })) === JSON.stringify(item)) deterministic++; else fail('deterministic', { id: entry.id, seed });
    if (P.checkAnswer(item, item.answerText)) selfChecked++; else fail('self-check', { id: entry.id, seed, prompt: item.prompt, answer: item.answerText });
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
record('perturbed-answer-rejected', perturbedRejected, n);
record('keypad-keys-cover-answer', keypadCovered, n);
record('studio-items-identical', studioIdentical, nb);
results.checks['teacher-variant-redraws'] = { status: 'Informational', count: redrawn, note: 'Studio draw was teacher-reviewed for this seed; engine redrew deterministically.' };
const modes = {}; for (const e of bankRows) { const m = P.generate(e.id, { seed: 'mode' }).inputMode; modes[m] = (modes[m] || 0) + 1; }
results.checks['bank-input-modes'] = { status: 'Informational', ...modes };

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

// 6. Built bundle is current
const bundle = fs.readFileSync(path.join(root, 'dist/math-engine-practice.js'), 'utf8');
const bprov = JSON.parse(fs.readFileSync(path.join(root, 'dist/math-engine-practice.provenance.json'), 'utf8'));
assert.strictEqual(sha(bundle), bprov.bundleSha256); assert.strictEqual(bprov.contentHash, P.contentHash); assert.strictEqual(bprov.engineVersion, P.version);
pass('bundle-provenance', { bundleSha256: bprov.bundleSha256, contentHash: P.contentHash });

results.status = results.failures.length || Object.values(results.checks).some(c => c.status === 'Failed') ? 'Failed' : 'Passed';
results.failures = results.failures.slice(0, 200);
fs.mkdirSync(path.join(root, 'docs/verification'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/verification/practice-v0.34.0-results.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify({ status: results.status, failures: results.failures.length, checks: Object.fromEntries(Object.entries(results.checks).map(([k, v]) => [k, v.status])) }, null, 1));
if (results.status !== 'Passed') { console.log(JSON.stringify(results.failures.slice(0, 15), null, 1)); process.exit(1); }
