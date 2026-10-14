# Coverage Batch C1-9: Course 1 Lessons 56–62 and Investigation 6, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.55.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 82 records in Lessons 56–62 and Investigation 6 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 35 |
| Existing adaptation confirmed after review | 0 |
| Consolidated twin | 47 |
| Retired | 0 |

**Course 1 progress:** 61.0% complete, 61.6% including provisional records. **Lessons 1–62 and Investigations 1–6 are complete.**

**Consolidated.** 47 records, choice-only twins and repeated fixed items. The decisions file names every pair. One note:

- **Incomplete expression.** C1_S06_00076: the bank keeps only part of the expression. The lesson (adding mixed numbers) points to C1_S06_00048, adding mixed numbers with related denominators.

## New tasks

There are 35 new tasks, from 8 new recipes:

| Lesson | Topics |
|---|---|
| 56 | Adding and subtracting fractions with unlike denominators, including sums over 1; comparing two fractions; ordering three fractions |
| 57 | Renaming, adding or subtracting, and reducing in three steps; adding with a product denominator and reducing |
| 58 | Probability: a marble colour, an event and its complement, a number cube, a drawn spinner, a rank or a colour from a deck, and the chance of no rain |
| 59 | Adding mixed numbers with related or unlike denominators, and two mixed numbers with a whole number |
| 60 | Polygons: true-or-false statements, the perimeter and side of a regular polygon, the number of sides and the name |
| Investigation 6 | Solids: cubes in a drawn rectangular solid; faces, edges and vertices of a drawn solid; faces and edges of prisms and pyramids; curved surfaces; the shapes of bases; plus three teacher-review tasks: sketch the views of a block solid, sketch a solid from its views, and construct a net |
| 61 | Adding three fractions with different denominators; a cup, a pint and a quart as a fraction of a gallon |
| 62 | Mixed numbers as improper fractions; multiplying mixed numbers; a mixed number times a fraction |

**Answer forms.** No new forms. The spinner and the complement tasks take two answers, separated by semicolons.

**New drawings:**

- a spinner with six numbered sectors;
- a rectangular solid built from cubes;
- line drawings of a cube, a rectangular prism, a pyramid, a cylinder and a cone, with hidden edges dashed;
- front, side and top views.

**Teacher review.** Three tasks ask the student to sketch: C1_S06_00055, 00057 and 00059. Each shows a reference answer and review criteria. These tasks are not in the practice bundle.

**Connections.** 26 tasks are placed in 12 track levels:

- adding and subtracting fractions and mixed numbers;
- adding two and three fractions;
- ordering numbers;
- probability and percent complements;
- perimeter;
- the volume of a rectangular prism;
- nets;
- converting mixed numbers;
- multiplying mixed numbers.

The polygon-naming and solid-feature tasks are not placed: no track covers them yet. No existing selector lost its matches.

**Practice bundle:** 2,259 → 2,291 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 984 port tasks, 1,000 instances each. The Course 1 oracles recompute every key with separate code:
  - **Fraction sums and differences, and comparisons.** These are read from the fraction bars in the display and computed exactly. Mixed-number sums and products are recomputed from the task's parameters.
  - **Probability.** Counts are recomputed from the spinner labels, the marble counts and a 52-card deck enumerated card by card.
  - **Polygons and solids.** Sides and perimeters come from the polygon named; faces, edges and vertices from a fixed table, with Euler's formula checked for prisms; cube counts from the solid's dimensions.

  Before the full run, every new task passed 4,800 instances.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
