# Coverage Batch 5: 8/7 Lessons 41–50, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1–4.

**Version:** Engine 0.39.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 65 records in Lessons 41–50 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 41 |
| New port task replacing a less faithful adaptation | 2 |
| Existing adaptation confirmed after review | 8 |
| Consolidated choice-only twin or duplicate | 14 |
| Retired | 0 |

**Replacements:**

- **SX870264 (yards to feet).** The adaptation used any multiple of 10 yards. The original uses multiples of 30 that are not multiples of 100.
- **SN870224 (decimal to fraction).** The adaptation included 0.25 and 0.75. The original uses its own table and leaves those two out.

**Confirmed adaptations:** SX870148, SN870244, SN870247, SMAH0068, SN870229, SN870230, SX870224 and SX870226. Unit price, hotel rate, sales tax, the fiftieths, percents to decimals, and batting average all use the same ranges as the original. Three choice-only twins (SN870609, MOT70264 and SN870612) point to these adaptations, which have no distractors yet. Their distractors are pending the distractor programme.

**SNAH0101** is a free-response copy of SN870224's script with a different instruction line, so it is consolidated into SN870224.

**8/7 progress:** 43.1% complete, 51.8% including provisional records. **Lessons 1–50 are complete.**

## New tasks

There are 43 new tasks, from 29 new recipes:

| Lessons | Topics |
|---|---|
| 41 | Evaluating expressions with whole-number and decimal values; the distributive property |
| 42 | Repeating decimals: rounding them, dividing to get one, and writing fractions as one |
| 43 | Decimals to fractions and mixed numbers; fractions to decimals |
| 44 | Interpreting remainders; dividing and rounding |
| 45 | Dividing by a decimal; equations with a decimal coefficient |
| 46 | Unit price, rates, tip and tax |
| 47 | Powers of ten; millions, billions and trillions in standard form |
| 48 | Completing fraction-decimal-percent tables |
| 49 | Adding yards, feet and inches, and hours, minutes and seconds |
| 50 | Unit multipliers |

**New answer forms:**

| Form | Accepted |
|---|---|
| Linear expression | Any term order, with signed coefficients |
| Repeating decimal | A bar written as combining overlines, `(…)`, `[…]` or `\overline{…}`; any equivalent placement of the bar is accepted; a terminating decimal is rejected |
| Compound measure | Unit names and abbreviations; zero units may be left out; the answer must be fully regrouped |

Units written as km/hr, mph or $…/hr, and percent signs, are also accepted after a number.

**New drawings:** a fraction-decimal-percent table with blank cells, and column addition of mixed measures.

**Bugs in the original, handled in the port:**

| Record | Problem | In the port |
|---|---|---|
| SX870220 | The table includes 9.5 ÷ 9, which is greater than 1, but the key always starts "0." | Writes the true quotient, 1.05̅ |
| SX870246 | One table row gives 12/95, which does not terminate; every other row does | Uses 12/25 |
| SX870255, SN870259 | Can leave 60 seconds or 60 minutes unregrouped | Skips those cases |
| SN870346 (Batch 4) and SN870237 | Script quirks | Followed as before; SN870237 is locked to its whole-number-quotient case, as in the source |
| SX870228 | The table has 39 rows, but the script draws only from the first 38 | Draws from the first 38 |

**Answer leak caught in review.** The repeating-decimal tasks first displayed the barred quotient as MathML under the question, which gave the answer away. That display is removed; the question text carries the overline.

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Where a variant or equivalent form could collide with the key, the task filters its distractors through its own checker.

**Unused code removed.** Two recipes written for percent-to-decimal records were left unused, because those records kept their adaptations. They are removed.

Batch 1's `improper-to-mixed` recipe is also unused. It is left as it is and noted here.

**Connections.** Thirteen tracks gain placements:

- expression evaluation;
- fraction conversions, levels 1 and 2;
- the meaning of division remainders;
- decimal division, levels 1 and 2;
- linear equations;
- unit rates;
- motion;
- tax and tip;
- powers;
- compound measures;
- single-unit conversions.

**Practice bundle:** 1,603 → 1,644 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 234 port tasks, with 1,000 instances each. The independent oracles:
  - use exact fraction arithmetic on the decimal values;
  - build repeating decimals by their own long division;
  - re-total the measures in base units.
- **Bank audits.** `tests/measurement-bank-audit.py` now skips replaced entries (25,000 cases); `tests/proportional-bank-audit.py` now checks 33,000 cases.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - Seven tables were checked programmatically against the scripts: SN870250, SN870605, SX870228, SN870224, SX870246, SN870248 and SX870220.
  - The new drawings and math were rendered and inspected.
