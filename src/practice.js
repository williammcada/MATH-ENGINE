/*
 * Math Engine host interface (host-integration-v0.1, Engine 0.34.0).
 *
 * One front door for every code-generated question in MathQuest and Math Arcade:
 *   - K–7 skills: the unedited megaman-v0.7 baseline (312 skills, IDs unchanged), run with a
 *     seeded Math object so a seed always gives the same question.
 *   - Course banks: Intermediate 4 → Algebra 2 entries whose answers are auto-checked
 *     (spec decision D2). Teacher-reviewed tasks are not game-eligible.
 *   - Single-answer entries only (Engine 0.37.0): entries tagged multi-part by src/answer-shape.js
 *     (lists, every solution, set members, "a; n") are not game-eligible. gameExclusion(id) says why.
 * Hosts must not generate or check mathematics themselves.
 * Every keypad item uses the one universal answer pad (src/answer-pad.js, handbook U-18, Engine 0.36.0).
 */
'use strict';
const banks = require('./course-banks.js');
const { loadK7Skills, baselineSha256 } = require('./k7-skills.js');
const INDEX = require('./practice-index.js');
const CONT = require('./continuity-skills.js');
const PAD = require('./answer-pad.js');
const SHAPE = require('./answer-shape.js');

const version = '0.65.1';
const freeze = Object.freeze;

// ---------- deterministic randomness ----------
function hashText(text) {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) { h = Math.imul(h ^ text.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0; };
}
function rngFrom(seedText) {
  let a = hashText(String(seedText))();
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
let currentRandom = () => Math.random();
const SeededMath = Object.create(Math);
SeededMath.random = () => currentRandom();
function withSeed(seedText, fn) {
  const previous = currentRandom;
  currentRandom = seedText == null ? () => Math.random() : rngFrom(seedText);
  try { return fn(); } finally { currentRandom = previous; }
}
const K7 = loadK7Skills(SeededMath);

// ---------- unified catalog ----------
const gradeLabel = g => g === 0 ? 'K' : g == null ? '' : String(g);
const skillEntries = K7.catalog.map(s => {
  const e = { id: s.id, layer: 'skill', name: s.name, grade: s.grade, gradeLabel: gradeLabel(s.grade), standard: s.standard || '', prereq: s.prereq || null, course: null, bankId: null, lessonId: null, topic: null };
  for (const [k, v] of Object.entries(s)) if (typeof v !== 'function' && !(k in e)) e[k] = v;
  return freeze(e);
});
// Standards come from the bank catalog; only entries with a recorded outcome have one (Engine 0.35.0).
const bankStandards = new Map(banks.catalog.map(b => [b.sourceId, b]));
const bankEntries = INDEX.entries.map(x => { const src = bankStandards.get(x.sourceId) || {}; return freeze({
  id: 'bank:' + x.sourceId, layer: 'bank', sourceId: x.sourceId, name: x.title, grade: x.localGrade, gradeLabel: gradeLabel(x.localGrade),
  standard: src.standard || '', standardAlias: src.alias || '', prereq: null, course: x.course, bankId: x.bankId, lessonId: x.lessonId, lessonLabel: x.lessonLabel, lessonOrder: x.lessonOrder, topic: x.topic
}); });
const continuityEntries = CONT.SKILLS.map(c => freeze({ id: c.id, layer: 'continuity', name: c.name, grade: c.grade, gradeLabel: gradeLabel(c.grade), standard: '', prereq: c.easier, course: null, bankId: null, lessonId: null, topic: null }));
const continuityById = new Map(CONT.SKILLS.map(c => [c.id, c]));
const catalog = freeze([...skillEntries, ...bankEntries, ...continuityEntries]);
const byId = new Map(catalog.map(e => [e.id, e]));
const skillById = new Map(K7.catalog.map(s => [s.id, s]));
const courses = freeze(INDEX.courses.map(c => freeze({ ...c, count: bankEntries.filter(e => e.bankId === c.bankId).length })));
const find = id => byId.get(id) || null;
// Engine 0.37.0: why a known Math Engine id is not offered to games ('multi-part' | 'teacher-reviewed'),
// or null. Hosts use it to drop saved selections that are no longer game-eligible and to explain why.
const GAME_EXCLUDED = INDEX.gameExcluded || {};
const gameExclusion = id => byId.has(id) ? null : (GAME_EXCLUDED[id] || null);
const gameExcludedCounts = freeze(Object.values(GAME_EXCLUDED).reduce((o, r) => (o[r] = (o[r] || 0) + 1, o), {}));

// ---------- answer entry ----------
// One pad for every question (U-18). The keys never depend on the correct answer.
const padItem = () => ({ inputMode: 'keypad', keys: PAD.keys.slice() });
function bankEntryMode(answerText) {
  // Pad when the answer can be typed with pad keys (sqrt(...) and * written as √ and ×); otherwise
  // the answer is words, letters or Roman numerals and uses a text box (U-18 boundary).
  return PAD.onlyPadCharacters(PAD.padForm(answerText)) ? padItem() : { inputMode: 'keyboard', keys: [] };
}

// ---------- items ----------
function fromSkill(skill, raw, meta) {
  const item = { ...raw, engine: version, id: skill.id, layer: 'skill', ...meta };
  item.html = K7.formatItem(raw);
  Object.assign(item, padItem());
  // Display/report text only; checking still uses the baseline's own answer and tolerance.
  item.answerText = typeof raw.answer === 'number' ? String(Number(raw.answer.toPrecision(12))) : String(raw.answer).replace(/^(-?\d+)\/1$/, '$1');
  // Show expression answers with the keypad's × (the baseline stores *, and accepts ×, * or juxtaposition).
  if (['expression', 'expanded', 'linear', 'factored'].includes(raw.type)) item.answerText = item.answerText.replace(/\*/g, '×');
  item.solution = '';
  return item;
}
function fromBank(entry, raw, meta) {
  const answerText = banks.answerText(raw);
  return { engine: version, id: entry.id, layer: 'bank', ...meta, prompt: raw.prompt, type: 'bank', html: banks.renderQuestion(raw), ...bankEntryMode(answerText), answerText, solution: raw.solution || '', raw };
}
function fromContinuity(entry, raw, meta) {
  const keys = raw.kind === 'choice' ? [] : PAD.keys.slice();
  return { engine: version, id: entry.id, layer: 'continuity', ...meta, prompt: raw.prompt, type: raw.kind, kind: raw.kind,
    html: `<div class="engine-question"><p>${raw.promptHTML || CONT.esc(raw.prompt)}</p></div>`,
    inputMode: raw.kind === 'choice' ? 'choice' : 'keypad', keys, choices: raw.choices || null,
    answer: raw.answer, answerText: raw.answer, solution: raw.solution || '' };
}
function requireEntry(id) {
  const entry = find(id);
  if (!entry) {
    const why = GAME_EXCLUDED[id];
    throw Error(why ? `Not a game item (${why}): ${id}` : 'Unknown or non-game Math Engine item: ' + id);
  }
  return entry;
}
function cleanSeed(seed) {
  if (!((typeof seed === 'string' && seed.trim() && seed.length <= 200) || (typeof seed === 'number' && Number.isSafeInteger(seed)))) throw Error('Use a nonempty seed (≤ 200 characters) or a safe integer.');
  return seed;
}
/** Deterministic: the same id, seed and index always give the same item. */
function generate(id, options = {}) {
  const entry = requireEntry(id);
  const seed = cleanSeed(options.seed ?? 'practice'), index = options.index ?? 0;
  if (!Number.isSafeInteger(index) || index < 0) throw Error('Use a nonnegative integer index.');
  const meta = { seed, index };
  if (entry.layer === 'skill') {
    const skill = skillById.get(id);
    return fromSkill(skill, withSeed(`${id}|${seed}|${index}`, () => K7.nextMathItem(skill, {})), meta);
  }
  if (entry.layer === 'continuity') return fromContinuity(entry, continuityById.get(id).make(rngFrom(`${id}|${seed}|${index}`)), meta);
  return fromBank(entry, bankDraw(entry, seed, index), meta);
}
// A few entries switch to a teacher-reviewed variant for some seeds. Those are excluded from the
// index when seen at build time; this deterministic redraw is the runtime safety net. The same net
// skips any multi-part variant (Engine 0.37.0), although the build already excludes such entries.
function bankDraw(entry, seed, index) {
  for (let k = 0; k < 12; k++) {
    const raw = banks.generate(entry.sourceId, { seed, index: index + k * 100000 });
    if (raw.answer.kind !== 'teacher' && SHAPE.itemShape(raw, banks.answerText(raw)) === 'single') return raw;
  }
  throw Error('No auto-checked variant for ' + entry.id);
}
/** Live play: K–7 fluency facts keep their no-repeat decks in `state` (baseline behavior). */
function nextItem(id, state = {}) {
  const entry = requireEntry(id);
  if (entry.layer === 'skill') {
    const skill = skillById.get(id);
    return fromSkill(skill, withSeed(null, () => K7.nextMathItem(skill, state)), { seed: null, index: null });
  }
  if (entry.layer === 'continuity') return generate(id, { seed: 'live-' + Math.floor(Math.random() * 2 ** 48).toString(36), index: 0 });
  const seed = 'live-' + Math.floor(Math.random() * 2 ** 48).toString(36);
  return fromBank(entry, bankDraw(entry, seed, 0), { seed, index: 0 });
}
/** The only answer validator hosts use. Accepts items after a JSON round trip. */
function checkAnswer(item, response) {
  if (!item || typeof item !== 'object') return false;
  const typed = typeof response === 'string' ? response : response == null ? '' : String(response);
  const text = PAD.normalizeTyped(typed);
  if (!text.trim()) return false;
  if (item.layer === 'bank') {
    // Bank checkers see the pad-normalized answer first; an answer whose form matters (for example a
    // division written with ÷, which normalization turns into /) is also checked as typed.
    try { if (banks.checkAnswer(item.raw, text).answerCorrect === true) return true; } catch { /* try as typed */ }
    if (typed === text) return false;
    try { return banks.checkAnswer(item.raw, typed.replace(/−/g, '-')).answerCorrect === true; } catch { return false; }
  }
  if (item.layer === 'continuity') return CONT.check(item, text).correct === true;
  try { return !!K7.checkAnswer(item, text); } catch { return false; }
}
const MESSAGES = Object.freeze({
  empty: 'Enter an answer.',
  tooLong: 'That answer is too long.',
  keys: 'Use the answer keys on the pad.',
  choice: 'Choose one of the answers shown.',
  unsimplified: 'Your value is correct, but the fraction is not in simplest form. Simplify it and try again.',
  wrong: 'Not yet. Check your work, then try again.'
});
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
function simplifiedForm(text) {
  const t = text.trim().replace(/−/g, '-');
  let m = t.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (m && +m[4]) { const g = gcd(+m[3], +m[4]); return g > 1 ? `${m[1]}${m[2]} ${+m[3] / g}/${+m[4] / g}` : null; }
  m = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (m && +m[2]) { let n = +m[1], d = +m[2]; if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); if (g <= 1 && +m[2] > 0) return null; return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; }
  return null;
}
/**
 * Full answer evaluation for hosts: { valid, correct, reason, message, normalized }.
 * valid:false means a malformed entry (hosts need not count it as an attempt).
 * reason 'equivalent-unsimplified' implements MathQuest v0.9.2 §27 (MATH-FRAC-01) for every item.
 */
function evaluate(item, response) {
  const text = typeof response === 'string' ? response : response == null ? '' : String(response);
  const normalized = text.trim();
  if (!normalized) return { valid: false, correct: false, reason: 'empty', message: MESSAGES.empty, normalized };
  if (normalized.length > 200) return { valid: false, correct: false, reason: 'too-long', message: MESSAGES.tooLong, normalized };
  if (item && item.inputMode === 'choice') {
    const ok = (item.choices || []).some(c => String(c).toLowerCase() === normalized.toLowerCase());
    if (!ok) return { valid: false, correct: false, reason: 'not-a-choice', message: MESSAGES.choice, normalized };
  } else if (item && item.inputMode === 'keypad') {
    if (!PAD.onlyPadCharacters(PAD.padForm(normalized))) return { valid: false, correct: false, reason: 'invalid-characters', message: MESSAGES.keys, normalized };
  }
  if (item && item.layer === 'continuity') {
    const r = CONT.check(item, PAD.normalizeTyped(normalized));
    if (!r.valid) return { valid: false, correct: false, reason: 'invalid-format', message: MESSAGES.wrong, normalized };
    if (r.equivalentUnsimplified) return { valid: true, correct: false, reason: 'equivalent-unsimplified', message: MESSAGES.unsimplified, normalized };
    return r.correct ? { valid: true, correct: true, reason: null, message: '', normalized } : { valid: true, correct: false, reason: 'wrong-value', message: MESSAGES.wrong, normalized };
  }
  if (checkAnswer(item, normalized)) return { valid: true, correct: true, reason: null, message: '', normalized };
  const simpler = simplifiedForm(normalized);
  // A whole-number ratio such as 4/2 simplifies to 4/1 as well as to 2.
  if (simpler && (checkAnswer(item, simpler) || (/^-?\d+$/.test(simpler) && checkAnswer(item, simpler + '/1')))) return { valid: true, correct: false, reason: 'equivalent-unsimplified', message: MESSAGES.unsimplified, normalized };
  return { valid: true, correct: false, reason: 'wrong-value', message: MESSAGES.wrong, normalized };
}
/** The universal pad's keys (U-18). The item argument is accepted for compatibility and does not change the keys. */
function keypadKeys() { return PAD.keys.slice(); }

// ---------- easier / harder ----------
/** Reviewed links only. Returns game-eligible ids, nearest first; empty when none. */
function related(id, relation) {
  if (!['easier', 'harder'].includes(relation)) throw Error('Use relation "easier" or "harder".');
  const entry = requireEntry(id);
  if (entry.layer === 'skill' || entry.layer === 'continuity') {
    const peers = entry.layer === 'skill' ? skillEntries : continuityEntries;
    if (relation === 'easier') return entry.prereq && byId.has(entry.prereq) ? [entry.prereq] : [];
    return peers.filter(s => s.prereq === id).map(s => s.id);
  }
  let found = [];
  try { found = banks.connections.suggestions(entry.sourceId, { relation, limit: 24 }); } catch { found = []; }
  return [...new Set(found.map(s => 'bank:' + s.sourceId).filter(x => byId.has(x)))];
}

// ---------- Practice (Math Arcade gate controller) ----------
// Same behavior as the baseline Practice class. Targeted mode also accepts bank ids, which
// are not limited by the K–7 grade range. General and progression modes stay K–7 only.
const inRange = (s, c) => s.grade >= c.lo && s.grade <= c.hi;
function pool(c) {
  if (c.mode === 'targeted') return catalog.filter(s => c.selected.includes(s.id) && (s.layer !== 'skill' || (inRange(s, c) && (!s.optional24 || c.include24))));
  return skillEntries.filter(s => (c.mode !== 'progression' || !s.reviewOnly) && inRange(s, c) && (!s.optional24 || c.include24));
}
function configError(c) {
  if (!c || !['general', 'targeted', 'progression'].includes(c.mode) || !Number.isInteger(c.lo) || !Number.isInteger(c.hi) || c.lo < 0 || c.hi > 7 || c.lo > c.hi) return 'Choose a valid grade range from K to 7.';
  if (!Number.isInteger(c.count) || c.count < 1 || c.count > 10) return 'Choose 1–10 questions per gate.';
  if (typeof c.include24 !== 'boolean' || !Array.isArray(c.selected) || !c.selected.every(id => byId.has(id))) return 'Choose valid skills.';
  return pool(c).length ? '' : 'Select at least one skill in the chosen grade range.';
}
const freshMath = (...args) => K7.freshMath(...args);
class Practice {
  constructor(state, persist = () => {}) { this.state = state; this.persist = persist; }
  log(type, extra = {}) { this.state.events.push({ time: Date.now(), type, ...extra }); if (this.state.events.length > 5e3) this.state.events.shift(); }
  saveConfig(config) {
    const err = configError(config); if (err) throw Error(err);
    const s = this.state, changed = ['mode', 'lo', 'hi', 'include24'].some(k => s.config[k] !== config[k]);
    s.config = structuredClone(config); s.resetSequence = s.resetSequence || changed; this.log('settings-changed'); this.persist();
  }
  open(context, runId) {
    const s = this.state;
    if (s.gate && s.gate.context === context && s.gate.runId === runId) return s.gate;
    if (s.resetSequence) { s.position = null; s.returnTo = []; s.resetSequence = false; }
    s.gate = { context, runId, config: structuredClone(s.config), completed: 0, attempts: 0, bag: [], item: { prompt: '', answer: 0, type: 'number', skillId: '' } };
    this.log('gate-open', { context }); this.next(); return s.gate;
  }
  next() {
    const s = this.state, g = s.gate, eligible = pool(g.config);
    let id;
    if (g.config.mode === 'progression') {
      if (!s.position || !byId.has(s.position) || (!s.returnTo.length && !eligible.some(x => x.id === s.position))) s.position = eligible[0].id;
      id = s.position;
    } else {
      if (!g.bag.length) { g.bag = eligible.map(x => x.id); for (let i = g.bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [g.bag[i], g.bag[j]] = [g.bag[j], g.bag[i]]; } }
      id = g.bag.shift();
    }
    g.item = { ...nextItem(id, s), skillId: id }; g.attempts = 0; this.persist();
  }
  first(correct) {
    const s = this.state, g = s.gate, id = g.item.skillId, h = s.history[id] || (s.history[id] = []);
    h.push(correct); if (h.length > 10) h.shift(); this.log('first-attempt', { skill: id, correct });
    if (g.config.mode !== 'progression' || h.length < 10) return;
    const accuracy = h.filter(Boolean).length / 10, eligible = pool(g.config);
    if (accuracy >= 0.8) { s.position = s.returnTo.length ? s.returnTo.pop() : eligible[Math.min(eligible.findIndex(x => x.id === id) + 1, eligible.length - 1)].id; this.log('advance', { from: id, to: s.position }); s.history[id] = []; }
    else if (accuracy < 0.5) { const p = find(id)?.prereq; if (p) { s.returnTo.push(id); s.position = p; s.history[id] = []; s.history[p] = []; this.log('step-back', { from: id, to: p }); } }
  }
  submit(response) {
    const g = this.state.gate;
    if (!g || !String(response ?? '').trim()) return { correct: false, complete: false };
    const correct = checkAnswer(g.item, response);
    if (g.attempts === 0) this.first(correct);
    g.attempts++;
    this.log('answer', { skill: g.item.skillId, correct, attempt: g.attempts, response, prompt: g.item.prompt, answer: g.item.answerText, context: g.context });
    if (correct) {
      g.completed++;
      if (g.completed >= g.config.count) { this.log('gate-complete', { context: g.context }); this.state.gate = null; this.persist(); return { correct: true, complete: true }; }
      this.next();
    }
    this.persist(); return { correct, complete: false };
  }
  override() { if (!this.state.gate) return; this.log('adult-override', { context: this.state.gate.context }); this.state.gate = null; this.persist(); }
  resetSkill(id) {
    delete this.state.history[id]; if (this.state.factPractice) delete this.state.factPractice[id];
    this.state.events = this.state.events.filter(e => e.skill !== id && e.from !== id && e.to !== id);
    this.state.position = null; this.state.returnTo = []; this.persist();
  }
}

// ---------- identity ----------
function contentHash() {
  const h = hashText([version, banks.version, baselineSha256, ...catalog.map(e => e.id)].join('|'));
  return [h(), h(), h(), h()].map(x => x.toString(16).padStart(8, '0')).join('');
}
const api = freeze({
  version, bankVersion: banks.version, k7Version: 'megaman-v0.7', k7BaselineSha256: baselineSha256,
  catalog, courses, find, gameExclusion, gameExcludedCounts, generate, nextItem, checkAnswer, evaluate, related, keypadKeys, answerPad: PAD,
  Practice, freshMath, configError, formatMath: K7.formatMath, contentHash: contentHash()
});
module.exports = api;
