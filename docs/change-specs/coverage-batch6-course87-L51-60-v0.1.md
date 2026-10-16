# Coverage Batch 6: 8/7 Lessons 51–60, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1–5.

**Version:** Engine 0.40.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 56 records in Lessons 51–60 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 35 |
| New port task replacing a less faithful adaptation | 7 |
| Existing adaptation confirmed after review | 2 |
| Consolidated choice-only twin | 12 |
| Retired | 0 |

**Replacements:**

| Record | Earlier adaptation | Original |
|---|---|---|
| SN870274 (employees to computers) | Multipliers outside the original's range when the computers are given | Multipliers 5–11 or 3–6, with unreduced ratios, as in the source |
| SX870275 (seed cost) | Free values that needed rounding to the cent | The source's own table; every cost comes out in exact cents (checked programmatically) |
| SX870277 (cookie recipe) | Its own ratios and amounts | The source's table of ratios and cups, answered as a mixed number |
| SX870281 (lions, tigers and bears) | Other contexts; unreduced and 1-to-1 ratios | The source's table |
| SX870283 (combined test average) | Allowed equal averages and up to 7 tests in a group | 2–5 tests per group, different counts, averages 75–88 and 81–94 |
| SX870286 (average wage) | Rates that were not whole dimes | $5.20–$7.80 in dimes, skipping $6.00 and $7.00, with an exact-cents average |
| SXA10204 (ratio of two groups) | Other contexts, unreduced ratios, other multipliers | Reduced ratio, multipliers 11–26 |

**Confirmed adaptations:** SN870278 (average needed on the next five quizzes) uses the same table as the source. SX870293 (third vertex of a triangle symmetric about the y-axis) uses the same coordinate ranges. SX870285, the choice-only twin of SN870278, points to that adaptation; its distractors are pending the distractor programme.

**Consolidated twins:** SN870350 → SN870322, SN870332 → SN870266, SX870280 → SN870269, SN870599 → SN870274, SX870285 → SN870278, SN870281 → SN870282, BMPA0124 → BMPA0207, SX870499 → SN870286, SN870337 → SN870289, SN870290 → SN870351, SN870325 → SN870326, SN870294 → SX870372. Each twin runs the same script as its partner and differs only in asking for a choice.

**8/7 progress:** 50.2% complete, 57.8% including provisional records. **Lessons 1–60 are complete.**

## New tasks

There are 42 new tasks, from 23 new recipes:

| Lessons | Topics |
|---|---|
| 51 | Scientific notation for large numbers, both directions |
| 52 | Order of operations, including powers and evaluating with letters |
| 53 | Multiplying rates: seed cost, taffy, nut prices, bean stalk growth |
| 54 | Ratio word problems, a recipe ratio and a chain of two ratios |
| 55 | Combined averages, a missing race time, an average wage |
| 56 | Subtracting hours, minutes and seconds, and yards, feet and inches |
| 57 | Negative exponents; powers of ten as fractions and decimals; scientific notation for small numbers |
| 58 | Line symmetry of regular polygons and of a triangle about the y-axis; function tables and number machines |
| 59 | Adding integers with arrows on a number line |
| 60 | Fractional part of a group or a fraction; percent of a number and of an amount of money |

**New answer forms:**

| Form | Accepted |
|---|---|
| Several parts | Parts separated by semicolons, each checked by its own kind: scientific notation (×, x, * or ·; a caret or superscript exponent; the coefficient must be at least 1 and less than 10), a fraction (thousands commas allowed), or a number |
| Point | An ordered pair, with or without spaces and with either minus sign |

**New drawings:** a function table with a blank cell, a row of number machines, regular polygons, single number lines with arrows (teacher reference), four lettered number lines to choose from, and column subtraction of mixed measures.

**Bugs in the original, handled in the port:**

| Record | Problem | In the port |
|---|---|---|
| SN870322 | Two of the source's facts (a diameter of Jupiter and a circumference of Mars) are wrong | The contexts are rewritten as accurate original facts; the numbers are kept |
| SX870287 | Keys one minute too few when the two minute values are equal | Regroups correctly |
| SN870280 | Can key an answer such as "3 ft" that is not fully regrouped | Gives the fully regrouped answer |
| SXA10204 | Can draw two equal ratio terms (1 to 1), where every distractor equals the key | Skips that case |

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Review found several recipes whose listed mistakes could coincide with the key or with each other for some values (for example, 2⁻²: "base times exponent" equals the key), so each now carries extra candidates. Every non-teacher task offers exactly three choices across the test seeds. The yard-foot-inch subtraction with inches only has its own mistakes, split by whether regrouping is needed.

**Teacher review.** Three integer-addition tasks (SX870501, SN870353, SN870324) ask the student to draw arrows. They keep teacher review, with a blank number line for the student and a reference drawing for the teacher. The fourth (SN870323) asks which of four drawn number lines is right and is auto-checked.

**Connections.** Nineteen track levels gain placements: scientific notation (levels 1 and 2), powers (level 2), numerical grouping, expression evaluation, rate calculations, average (levels 2 and 3), mean and total, weighted average, compound measures (level 2), coordinate work, line symmetry, function evaluation, integer arithmetic, fraction of a group, fraction multiplication, and two percent-of-a-number tracks. Four selectors that pointed only at replaced adaptations (ratio levels 1 and 3, and the chemical-mass ratio level) now point to the port recipes.

**Practice bundle:** 1,644 → 1,676 bank entries. The three teacher-review tasks are not in the practice bundle.

## Verification

- **`tests/port87.cjs`** covers all 276 port tasks, with 1,000 instances each. The Batch 6 oracles:
  - convert to and from scientific notation by shifting digit strings, with no floating point;
  - recompute the rates, ratios and averages with exact arithmetic from the parameters;
  - re-total the measures in base units;
  - read the drawn number lines back from the SVG and confirm exactly one shows the sum, and that it is the keyed letter.
- **Bank audits.** The measurement, proportional and statistics audits now skip the replaced entries, which `port87.cjs` audits instead. They check 23,000, 29,000 and 37,000 cases.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - SX870275's table was checked programmatically against the script.
  - The new drawings were rendered and inspected.
