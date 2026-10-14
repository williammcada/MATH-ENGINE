# Coverage Batch C1-10: Course 1 Lessons 63–70 and Investigation 7, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.56.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 92 records in Lessons 63–70 and Investigation 7 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 40 |
| Existing adaptation confirmed after review | 0 |
| Consolidated twin | 52 |
| Retired | 0 |

**Course 1 progress:** 67.8% complete, 68.4% including provisional records. **Lessons 1–70 and Investigations 1–7 are complete.**

**Consolidated.** 52 records, mostly choice-only twins and repeated fixed items. The decisions file names every pair. Notes:

- **Earlier lessons.** Some records repeat a demand that an earlier lesson already ports:
  - C1_S07_00070 (same-denominator subtraction with regrouping) points to Lesson 48, C1_S05_00040.
  - C1_S07_00025 (reducing before multiplying two fractions) points to Lesson 29, C1_S03_00111.
  - Six Lesson 70 records whose product of two mixed numbers is a whole number point to Lesson 62, C1_S07_00030.
  - C1_S07_00043 and 00062 (a fraction times a mixed number) point to Lesson 62, C1_S07_00068.
- **Missing operator.** C1_S07_00057 has no operator in the bank. Its answer (4 9/10 from 3 2/5 and 1 1/2) points to adding mixed numbers with unlike denominators, C1_S06_00104.
- **Missing figures.** Four records refer to a figure the bank does not keep. Each points to the task with the same demand that states its data:
  - C1_S07_00012 (choose two complementary angles) points to C1_S07_00052.
  - C1_S07_00051 (the angle supplementary to a given angle) points to C1_S07_00023.
  - C1_S07_00082 and 00083 (the perimeter and area of a rectangle on the coordinate plane) point to C1_S07_00084 and 00055.

## New tasks

There are 40 new tasks, from 7 new recipes:

| Lesson | Topics |
|---|---|
| 63 | Subtracting mixed numbers with unlike denominators and regrouping, with small and larger denominators; yards of material left |
| 64 | Quadrilaterals: which statement is true, naming a drawn quadrilateral, naming one from its description, and choosing the drawn figure that is not a parallelogram or not a quadrilateral |
| 65 | Prime factorization of products of two, three and four primes and with a large prime; counting and listing composite numbers; the branches of a drawn factor tree; checking two drawn factor trees; simplifying with brackets and parentheses |
| 66 | Multiplying two mixed numbers; a whole number times a mixed number; the area of a drawn rectangle with mixed-number sides |
| 67 | Reducing large and medium fractions by prime factorization; factoring the numerator and denominator, then reducing |
| 68 | Dividing mixed numbers, including a smaller by a larger, a whole number by a mixed number and a mixed number by a whole number |
| 69 | Segment lengths on a drawn line by adding and subtracting; the supplement of an angle; naming a pair of complementary angles |
| 70 | A fraction divided by itself |
| Investigation 7 | The coordinate plane: the vertices of a drawn rectangle; naming and reading lettered points; the fourth vertex of a rectangle; the perimeter and area of a rectangle from its vertices; a possible fourth vertex of a parallelogram; the point halfway between two points |

**Answer forms.**

- **New: `point-set`.** It is used for:
  - the four vertices of a rectangle, which may be given in any order;
  - the fourth vertex of a parallelogram, which may be any one of the three possible points.
- **Reused:**
  - `prime-factors` for prime factorizations;
  - `set` for the list of composite numbers;
  - `point` for single points.

**New drawings:**

- factor trees with the primes circled, alone or side by side as I and II;
- single quadrilaterals, and rows of four lettered polygons;
- points A, B and C on a line, drawn to scale;
- a rectangle with mixed-number side labels;
- lettered points on the coordinate plane.

**Connections.** 25 tasks are placed in 10 track levels:

- subtracting mixed numbers;
- prime factorization;
- prime and composite classification;
- multiplying and dividing mixed numbers;
- reducing by prime factorization;
- reading and plotting coordinates;
- perimeter.

The quadrilateral, segment and angle-pair tasks are not placed, because no track covers them yet. No existing selector lost its matches.

**Practice bundle:** 2,291 → 2,331 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 1,024 port tasks, 1,000 instances each. The Course 1 oracles recompute every key with separate code:
  - **Mixed-number arithmetic.** It is recomputed from the parameters, and checked against the mixed numbers shown in the display or the prompt.
  - **Quadrilaterals.** The true statement and the odd figure are found from separate lists of definitions and side counts.
  - **Factor trees.** Each split is checked to multiply to its parent, and every leaf is checked to be prime. The branch count is checked from the number of prime factors.
  - **Prime factorizations and composites.** These are recomputed by trial division.
  - **Coordinates.** Vertices, midpoints and the three possible parallelogram vertices are recomputed, and each accepted answer is checked through the answer checker.

  Before the full run, every new task passed 4,800 instances.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
