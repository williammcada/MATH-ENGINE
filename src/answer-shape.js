/*
 * Answer shape (Engine 0.37.0, change spec v0.37.0-single-answer-games).
 *
 * Tags whether a course-bank question has one discrete answer or several separately entered
 * parts (a list of values, every solution of an equation, the members of a set, "a; n", …).
 * Owner, 2026-10-16: questions that necessarily do not have a single discrete answer are tagged
 * in the Math Engine and are not delivered to MathQuest or Math Arcade. Studio packets may still
 * use them; only the game index (practice layer) excludes them.
 *
 * The tag is per entry, not per seed: "List every positive factor of 1" is still a list question
 * even though that seed happens to have one factor.
 */
'use strict';

/** Answer kinds whose answer is always a collection of parts, whatever the seed. */
const MULTI_PART_KINDS = Object.freeze([
  'list', 'integer-list', 'set', 'quadratic-roots', 'domain-roots', 'leaves',
  'reason-pair', 'ordered-comparison', 'divisibility', 'scientific'
]);
const multiKinds = new Set(MULTI_PART_KINDS);

/**
 * Prompt wording that asks for a whole collection (every solution, every factor, each member).
 * Not used: the generic instruction "separate multiple answers with semicolons", which many
 * single-answer prompts carry as boilerplate.
 */
const LIST_PROMPT = /\b(?:give|find|list) every |\blist each /i;

/** One generated bank item → 'single' | 'multiple'. `answerText` is banks.answerText(raw). */
function itemShape(raw, answerText) {
  if (raw && raw.answer && multiKinds.has(raw.answer.kind)) return 'multiple';
  if (/;/.test(String(answerText))) return 'multiple';
  if (raw && LIST_PROMPT.test(String(raw.prompt || ''))) return 'multiple';
  return 'single';
}

/**
 * Classify a bank entry over many seeds. `draw(seed, index)` returns a raw bank item.
 * Returns { shape, teacherOnly, sampled }: shape is 'multiple' if any auto-checked variant is.
 */
function classifyEntry(draw, answerText, seeds = 200) {
  let shape = 'single', autoChecked = 0;
  for (let s = 0; s < seeds; s++) {
    const raw = draw('catalog-' + s, s % 5);
    if (raw.answer.kind === 'teacher') continue;
    autoChecked++;
    if (itemShape(raw, answerText(raw)) === 'multiple') { shape = 'multiple'; break; }
  }
  return { shape, autoChecked };
}

module.exports = { MULTI_PART_KINDS, LIST_PROMPT, itemShape, classifyEntry };
