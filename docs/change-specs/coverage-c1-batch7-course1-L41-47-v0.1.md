# Coverage Batch C1-7: Course 1 Lessons 41–47, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.53.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 96 records in Lessons 41–47 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 43 |
| Consolidated twin | 53 |
| Retired | 0 |

None of these records had an earlier adaptation.

**Course 1 progress:** 48.8% complete, 49.7% including provisional records. **Lessons 1–47 and Investigations 1–4 are complete.**

**Consolidated.** 53 records, choice-only twins and repeated fixed items. The decisions file names every pair. Notable ones:

- **Circumference.** Eleven fixed circumference items point to the two circumference tasks, one from a diameter and one from a radius.
- **Percent to fraction.** Writing a multiple of 5 percent as a reduced fraction (C1_S05_00018) points to the Lesson 33 task C1_S04_00019.

## New tasks

There are 43 new tasks, from 7 new recipes:

| Lesson | Topics |
|---|---|
| 41 | Sales tax; the total with tax, exact and rounded to the cent; the sale price after a percent off; change after a meal with tax; a percent of a number of items; a percent as a decimal; a percent as a reduced fraction and a decimal; a percent as a fraction and a count |
| 42 | Completing equivalent fractions, including hundredths; renaming and subtracting; renaming to a common denominator and adding; the fraction equal to 1 that renames a fraction |
| 43 | Equivalent division problems (by a unit fraction, with decimals, choosing one); missing addends with mixed numbers and decimals; missing numbers in fraction and decimal subtraction |
| 44 | Subtracting decimals and simplifying; comparing decimals, including equal ones; comparing a sum and a product; simplifying decimals; ordering decimals |
| 45 | Dividing decimals by whole numbers, including writing zeros; dividing by a square root; a round trip; an average weight |
| 46 | Decimals in expanded notation with fractions, and back; multiplying by 10, 100 and 1000 mentally; dividing by a decimal after multiplying by 10 |
| 47 | Circumference from a diameter or a radius; diameter from a circumference, in terms of π or numerically; circumference in terms of π; how far a wheel travels in one turn |

**Answer forms:**

- **Several answers.** Some answers have two parts, separated by semicolons. Each part is checked in its own form, for example a reduced fraction and a decimal.
- **Expanded notation.** Decimals are written with fractional place values, for example 4 × 1 + 9 × 1/10 + 7 × 1/100.
- **Text.** Equivalent division problems, orderings of decimals and multiples of π use text answers with alternatives.

**New drawings:**

- long-division layouts for dividing a decimal by a whole number;
- circles with a labelled diameter or radius.

**Adaptations:**

- **The fraction equal to 1.** C1_S05_00113 asks for the fraction equal to 1, for example 4/4. A typed answer like 4/4 looks like a fraction that should be reduced, so the port asks for the number that goes on the top and the bottom (4).
- **Equivalent division problems.** C1_S05_00052 and 00053 accept many answers in the source. The ports name the factor to multiply by, so each has one answer.

**Connections.** 43 tasks are placed in 18 track levels:

- percent change and percent of an amount;
- fraction, decimal and percent conversions;
- equivalent fractions;
- adding fractions;
- one-step equations with fractions and decimals;
- decimal place language;
- comparing and ordering decimals;
- decimal division;
- powers of ten;
- circle parts and circumference.

No existing selector lost its matches.

**Practice bundle:** 2,182 → 2,225 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 912 port tasks, 1,000 instances each. The Course 1 oracles solve each problem independently:
  - **Money.** Tax, totals and change are recomputed in cents, rounding half up.
  - **Comparisons.** These are recomputed from the prompt, in exact ten-thousandths.
  - **Equations.** Equivalent division problems and missing numbers are checked against the original values.
  - **Decimals.** Expanded notation is rebuilt from its terms. Quotients and circumferences are recomputed with integers.

  Before the full run, every new task passed 4,800 instances.
- **Choices.** Comparison tasks offer the two other symbols.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
