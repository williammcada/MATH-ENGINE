# Coverage Batch C1-13: Course 1 Lessons 91–100 and Investigation 10, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.59.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 96 records in Lessons 91–100 and Investigation 10 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 53 |
| Existing adaptation confirmed after review | 3 |
| Consolidated twin | 40 |
| Retired | 0 |

**Course 1 progress:** 87.5% complete, 87.8% including provisional records. **Lessons 1–100 and Investigations 1–10 are complete.**

**Confirmed adaptations.** Three records were covered provisionally by existing structured adaptations. Each was reviewed and kept, because it shows the source's table or expression:

- C1_S10_00047, a function table with a subtraction rule;
- C1_S10_00048, a function table with an addition rule;
- C1_S10_00068, the sum of three signed integers.

**Consolidated.** 40 records, mostly choice-only twins and repeated fixed items. The decisions file names every pair. Several refer to pictures, tables or figures the bank does not keep:

- C1_S10_00008, choices that are tables and graphs;
- C1_S10_00058, two example graphs;
- C1_S10_00009, a figure with two transversals;
- C1_S10_00011, table choices.

Each points to the task with the same demand.

C1_S10_00075's expression is incomplete in the bank. It points to order of operations with exponents.

## New tasks

There are 53 new tasks, from 11 new recipes:

| Lesson | Topics |
|---|---|
| 91 | The formulas for the area of a parallelogram, the perimeter of a triangle and the area of a square, each used to find a value |
| 92 | Multiplying powers of ten; c from a² + b² = c²; order of operations with squares, square roots and products; mixed numbers and fractions raised to powers; standard and expanded notation with exponents |
| 93 | Classifying drawn triangles by angles and by sides; choosing the equilateral triangle; perimeters of an obtuse and an equilateral triangle |
| 94 | Thirds, sixths, ninths, mixed numbers and decimals as percents |
| 95 | Multiplying by rates: kilometers, centimeters and inches |
| 96 | Evaluating a product of variables; a missing number in a function table; the property a proportional graph lacks; plus two teacher-review tasks: completing a table and plotting its points, and graphing a proportional relationship |
| 97 | Angle relationships, measures and corresponding angles at parallel lines cut by a drawn transversal |
| 98 | The other acute angle of a right triangle; missing angles of a quadrilateral and a triangle; the top angle of an isosceles triangle |
| 99 | Fraction-decimal-percent equivalents: the form that is not equivalent, missing table entries, and complete rows from a decimal, a percent, a fraction or hundredths; ordering a fraction, a negative integer and a decimal |
| 100 | Adding a positive and a negative integer, two negative integers, subtracting a negative integer, and a temperature rise from below zero |
| Investigation 10 | Two draws without replacement; a coin and a number cube; the same event on two rolls; both marbles the same colour; two cards without replacement |

**Answer forms.** No new forms.

- **Expanded notation.** The `expanded` checker now accepts powers of ten written with superscripts or a caret (10⁵ or 10^5), as well as the existing place-value form.
- **Powers of ten.** The product of powers of ten is a text answer that also accepts 10^n and the standard numeral.

**New drawings:**

- triangles drawn from their side lengths, with vertex names, side labels, angle labels and right-angle marks;
- four lettered triangles;
- two parallel lines and a transversal with angles 1–8;
- a quadrilateral with angle labels.

The teacher-review tasks show an empty coordinate grid. The teacher sees a reference graph.

**Teacher review.** C1_S10_00051 and 00057 ask the student to plot or graph. These tasks are not in the practice bundle.

**Connections.** 42 tasks are placed in 18 track levels:

- area and perimeter;
- exponent laws and powers;
- the Pythagorean relation;
- triangle classification;
- fraction-decimal-percent conversions;
- metric conversion;
- function tables and evaluation;
- angle measures and polygon angle sums;
- integer arithmetic;
- probability of independent events and events without replacement.

No existing selector lost its matches.

**Practice bundle:** 2,407 → 2,458 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 1,156 port tasks, 1,000 instances each. The Course 1 oracles recompute every key with separate code:
  - **Triangles.** The largest angle is computed from the drawn coordinates, and the type of triangle from the side lengths.
  - **Transversals.** Angles are classified by their position, and equal or supplementary groups are checked.
  - **Cards.** Card probabilities are found by enumerating all 2,652 ordered pairs of cards.
  - **Fractions, decimals and percents.** These are checked exactly as fractions.
  - **Expanded notation.** Answers are checked through the answer checker, with a caret form accepted and a shifted form rejected.

  Before the full run, every new task passed 4,800 instances.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings, including the teacher reference graphs, were rendered and inspected.
