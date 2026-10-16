# Coverage Batch C1-4: Course 1 Lesson 20, Investigation 2 and Lessons 21–26, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.50.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 99 records in Lesson 20, Investigation 2 and Lessons 21–26 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 48 |
| New port task replacing a less faithful adaptation | 2 |
| Consolidated twin | 49 |
| Retired | 0 |

**Course 1 progress:** 27.2% complete, 29.0% including provisional records. **Lessons 1–26 and Investigations 1–2 are complete.**

**Replacements:**

- C1_S02_00077, the greatest common factor of two numbers.
- C1_S02_00055, the greatest common factor of three numbers.

The earlier breadth adaptation drew numbers up to 48, and their greatest common factor could be 1. The ports keep source-style numbers such as 24 and 18, or 50, 220 and 20, and the greatest common factor is always more than 1.

**Consolidated.** 49 records, choice-only twins and repeated fixed items. The decisions file names every pair. One of them, C1_S03_00068, points to the Investigation 2 task C1_S02_00080 (the percent of a circle that is shaded).

## New tasks

There are 50 new tasks, from 7 new recipes:

| Lesson | Topics |
|---|---|
| 20 | Greatest common factor of two or three numbers |
| Investigation 2 | The fraction that is not equivalent; the largest fraction in a table; the percent of a circle that is shaded; adding parts of a circle as percents; half of a unit fraction; subtracting a fraction from 1; a fraction of a circle as a percent; counting fraction pieces in whole circles; comparing two fractions |
| 21 | Divisibility tests for 2, 3, 5, 9 and 10; divisible by both of two numbers; a number that does not divide; listing the numbers divisible by a given number |
| 22 | A fraction of a group in a story, of a number, of some dozens, in words and of thousands |
| 23 | Ratios of two groups, of boys to girls, of wins to losses and of length to width; average speed; unit price to the cent; distance from rate and time; miles per gallon |
| 24 | Adding and subtracting fractions with a common denominator, with three terms, to make 1 and with grouping |
| 25 | Quotients and improper fractions as mixed numbers; equal pieces; adding fractions and converting; dividing by 25; multiples of a number; trips there and back in fourths and halves of a mile |
| 26 | Reducing fractions; adding and subtracting mixed numbers, with regrouping; a missing addend with a mixed number |

**Answer forms.** No new forms. Ratios use the existing ratio form, which accepts "a to b", "a:b" and "a/b" in exact lowest terms.

**New drawings:**

- circles in equal parts, shaded for percents and fraction pieces;
- a table of the fraction of shots each player made;
- a rectangle for the ratio of length to width.

**Fraction bars.** Adding and subtracting fractions shows the expression with fraction bars, as the source does.

**Connections.** 50 tasks are placed in 21 track levels:

- common factors and multiples;
- equivalence recognition;
- fraction comparison;
- fractions to percents;
- fractions of a group;
- fraction complements;
- fraction pieces;
- divisibility;
- ratio forms;
- rates and unit prices;
- adding and subtracting fractions and mixed numbers;
- division answer forms;
- improper fractions and mixed numbers;
- multiples;
- reducing fractions;
- one-step equations with fractions.

No existing selector lost its matches.

**Practice bundle:** 2,051 → 2,099 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 781 port tasks, 1,000 instances each. The Course 1 oracles solve each problem independently:
  - greatest common factors, divisibility and multiples are recomputed;
  - fractions of groups, ratios and rates are recomputed from the prompt values;
  - sums and differences of fractions are recomputed and checked in lowest terms;
  - shaded parts of circles are counted in the drawings.
  Before the full run, every new task also passed 4,800 instances.
- **Choices.** Comparison and divisible-by-three tasks offer two distractors.
- **Practice check.** The first run found two gaps:
  - **The fraction that is not equivalent** (C1_S02_00078). The answer is a listed fraction such as 4/6, and an equal form such as 8/12 was marked as a wrong value. That task now accepts the fraction in any equal form.
  - **Whole-number ratios.** A whole-number ratio written unreduced, such as 8/4 for 2/1, now gets the simplest-form message instead of "wrong value". The fix is in `src/practice.js`.
  
  Commit `921eee7` holds both fixes, and the check then passes.
- **Breadth audit.** The two GCF records are now served by their ports. The breadth audit expects 15,200 generated cases.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
