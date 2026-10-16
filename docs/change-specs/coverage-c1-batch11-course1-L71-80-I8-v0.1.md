# Coverage Batch C1-11: Course 1 Lessons 71–80 and Investigation 8, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.57.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 89 records in Lessons 71–80 and Investigation 8 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 38 |
| Existing adaptation confirmed after review | 0 |
| Consolidated twin | 51 |
| Retired | 0 |

**Course 1 progress:** 74.4% complete, 74.9% including provisional records. **Lessons 1–80 and Investigations 1–8 are complete.**

**Consolidated.** 51 records, mostly choice-only twins and repeated fixed items. The decisions file names every pair. Notes:

- **Earlier lessons.** Three records repeat a demand that an earlier lesson already ports:
  - C1_S08_00019 (a two-place decimal as a fraction) points to Lesson 35, C1_S04_00022.
  - C1_S08_00075 (the percent of a circle that is shaded) points to Investigation 2, C1_S02_00080.
  - C1_S08_00049 (comparing two fractions) points to Lesson 56, C1_S06_00045.
- **Missing figures or tables.** These records refer to a figure or table the bank does not keep. Each points to the task with the same demand that draws or states its data:
  - C1_S08_00064 and 00068 (perimeter) and 00065 and 00067 (area) of a parallelogram.
  - C1_S08_00002, the fractions-chart table.
  - C1_S08_00061 and 00082, the area of a right triangle.
- **Choices that are pictures.** C1_S08_00013 asks which picture shows a correct angle-bisector construction. It points to constructing the bisector, C1_S08_00054.

## New tasks

There are 38 new tasks, from 11 new recipes:

| Lesson | Topics |
|---|---|
| 71 | Parallelograms: opposite and neighbouring angles; perimeter and area from a drawing with base, slanted side and height |
| 72 | The fractions chart (a sum or difference, a product and a quotient); multiplying two mixed numbers and a fraction or a whole number; multiplying three fractions |
| 73 | Prime factorization using exponents; thousandths decimals as fractions; decimals greater than 1 as mixed numbers; simplifying and comparing powers |
| 74 | Mixed numbers and fractions as decimals, including larger denominators; a ratio and a probability as decimals; a number-cube probability as a repeating decimal; adding or subtracting a decimal and a fraction |
| 75 | The percent of students who earned A’s; decimals and fractions as percents |
| 76 | Comparing a fraction and a decimal |
| 77 | How many did not, from the fraction that did; the parts of a divided group; how many of each colour; cents left from a dollar |
| 78 | Cups filled by part of a gallon; one unit of capacity as a fraction of another; which container holds more |
| 79 | Triangle area: with the height drawn inside, a right triangle, half of a rectangle, half of a parallelogram, and from coordinates |
| 80 | The scale factor and the missing count from a ratio |
| Investigation 8 | Teacher-review tasks: construct an angle bisector, and construct the perpendicular bisector of a segment |

**Answer forms.** No new forms.

- **Prime factorization with exponents.** This reuses `factorization`, which accepts exponents.
- **Repeating decimal.** The number-cube probability reuses `repeating`.
- **Percents.** These are text answers with the plain number accepted as well, as in earlier Course 1 percent tasks.

**New drawings:**

- a parallelogram with base, slanted side and dashed height, or split by a diagonal with one triangle shaded;
- a triangle with a dashed height inside and integer slanted sides;
- a right triangle with room for decimal labels;
- rectangle ABCD with diagonal AC and triangle ABC shaded;
- for teacher review, an angle and a segment, with reference constructions showing the compass arcs.

**Teacher review.** C1_S08_00054 and 00055 ask the student to construct. Each shows a reference construction and review criteria. These tasks are not in the practice bundle.

**Connections.** 30 tasks are placed in 16 track levels:

- parallelogram and triangle area;
- perimeter;
- multiplying mixed numbers and three fractions;
- prime factorization;
- conversions among fractions, decimals and percents;
- powers;
- probability;
- decimal operations;
- percents from a part and a whole;
- ordering numbers;
- fraction complements;
- ratio;
- perpendicular-bisector constructions.

No existing selector lost its matches.

**Practice bundle:** 2,331 → 2,367 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 1,062 port tasks, 1,000 instances each. The Course 1 oracles recompute every key with separate code:
  - **Parallelogram angles.** The opposite and neighbouring angles are checked against the labels.
  - **Figure tasks.** Areas and perimeters are recomputed from the side lengths, which are checked against the drawing's description. Right-triangle sides are checked with the Pythagorean relation.
  - **Products.** Three-factor products are read from the fraction bars and mixed numbers in the display.
  - **Prime factorizations.** These are recomputed by trial division and checked in exponent form.
  - **Conversions.** Decimals and percents are recomputed exactly as fractions. The repeating decimal is checked through the answer checker.
  - **Counts.** Ratio and capacity counts are recomputed from the prompt's numbers.

  Before the full run, every new task passed 4,800 instances.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings, including the teacher reference constructions, were rendered and inspected.
