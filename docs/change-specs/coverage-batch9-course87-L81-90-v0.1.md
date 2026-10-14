# Coverage Batch 9: 8/7 Lessons 81–90, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1–8.

**Version:** Engine 0.43.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 64 records in Lessons 81–90 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 39 |
| New port task replacing a less faithful adaptation | 2 |
| Existing adaptation confirmed after review | 9 |
| Consolidated choice-only twin | 14 |
| Retired | 0 |

**Replacements:**

| Record | Earlier adaptation | Original |
|---|---|---|
| SN870434 (multiply in scientific notation) | Factors such as 2.6 and 1.6; the answer split into a number and an exponent | 1.2, 1.3, 2.2 or 2.3 times 3 or 4, exponents 4–9, answered in scientific notation |
| SN870526 (percent who did not take part) | Totals of 40, 60, 80 and 100 only | The source's table of 40 totals and percents, with the count written in words |

**Confirmed adaptations:**

- Polygon tasks with the same polygons as the source: SN870414 (triangles from one vertex), SN870417 (interior angle), SN870424 (angle sum), SN870428 and SN870451 (exterior angle), and SN870566 (diagonals).
- SN870528 (circle area with 22/7) uses the same radii.
- SX870391 (customers who did not order) uses the same percents and totals.
- SX870408 (square feet to square yards) uses the same values.

SN870565 and SN870450, the choice-only twins of SN870566 and SN870451, point to these adaptations; their distractors are pending the distractor programme.

**Consolidated twins:** SX870392 → SN870526, SN870530 → SN870533, SN870420 → SN870422, SN870425 → SN870429, SN870447 → SN870449, SN870458 → SN870459, SN870462 → SN870463, SX870407 → SN870396, SN870411 → SN870412, SX870412 → SN870405, SN870565 → SN870566, SN870444 → SN870445, SN870450 → SN870451, SX870417 → SN870494.

SN870490 is also choice-only, but its right-hand side (an improper mixed number) differs from SN870491's proper fraction. It is therefore ported as its own task rather than consolidated.

**8/7 progress:** 70.5% complete, 74.1% including provisional records. **Lessons 1–90 are complete.**

## New tasks

There are 41 new tasks, from 13 new recipes:

| Lessons | Topics |
|---|---|
| 81 | Percent problems with the part not in a group |
| 82 | Area of a circle with 3.14 and in terms of π |
| 83 | Multiplying powers of 10; multiplying in scientific notation |
| 84 | Monomials, binomials and trinomials; collecting like terms |
| 85 | Order of operations with signed numbers; completing function tables |
| 86 | Number families: describing and graphing sets of integers |
| 87 | Multiplying algebraic terms |
| 88 | Unit multipliers, including units of area |
| 89 | Diagonals, interior angles and exterior angles of polygons |
| 90 | Equations with mixed-number, fraction and negative coefficients |

**New answer forms:**

| Form | Accepted |
|---|---|
| Power of 10 | 10^n, 10 with a superscript exponent, or 1 × 10^n |
| Polynomial | Terms in any order and variables in any order; exponents with ^ or superscripts; terms must be collected (no repeated or zero terms) |
| Integer set | Any equivalent description ("integers greater than 3", "integers ≥ 4", or both joined by "or"); it must say integers |
| Unit-multiplier expression | A product or quotient of numbers in parentheses (such as 23(12)(2.54)(1/100)), or its exact value; checked by evaluating it exactly |

**New drawings:**

- function tables with a rule and blank cells;
- number lines with dots on integers, with an arrow showing the dots continue, including four lettered lines to choose from;
- circles with a radius or a diameter;
- a regular polygon inscribed in a circle.

**Teacher review.** Two tasks ask the student to graph points on a number line, so they need teacher review: SX870403 (negative integers greater than a number) and SX870402 (whole numbers less than a number). The choose-the-graph record SN870484 is checked automatically.

**Bugs and changes in the port:**

| Record | Source | In the port |
|---|---|---|
| SN870441 | Keys the constant term as b + c, but subtracting the second group gives b − c | Keys b − c |
| SN870410, SN870412 | Key only the unit-multiplier expression | Accept the expression or its exact value |
| SX870384 | Shows the mixed coefficient directly before the variable | Shows it in lowest terms and in parentheses, so 1 4/5v cannot be misread |

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Every non-teacher task offers exactly three choices across the test seeds.

**Connections.** Twenty-two track levels gain placements:

- percents;
- circle area;
- exponent laws and powers of ten;
- polynomial structure and like terms;
- signed order of operations;
- function tables;
- number-line placement;
- unit conversions;
- polygon diagonals and angles;
- fraction-coefficient and signed equations.

Three selectors that pointed only at replaced adaptations now point to the port recipes.

**Practice bundle:** 1,724 → 1,761 bank entries. The two teacher-review tasks are not in the practice bundle.

## Verification

- **`tests/port87.cjs`** covers all 387 port tasks, with 1,000 instances each. The Batch 9 oracles:
  - recompute each value from the parameters, or by reading the rule and expression back from the prompt;
  - renormalize scientific-notation products by shifting digit strings;
  - check the polynomial and integer-set forms with equivalent rewrites and wrong variants;
  - read the dot positions back from the drawn number lines.
- **Bank audits.** The solids and proportional audits now skip the replaced entries, which `port87.cjs` audits instead. They check 4,500 and 21,000 cases.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - The new drawings were rendered and inspected.
