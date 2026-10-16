# Coverage Batch C1-14: Course 1 Lessons 101–110 and Investigation 11, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.60.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 79 records in Lessons 101–110 and Investigation 11 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 39 |
| Existing adaptation confirmed after review | 0 |
| Consolidated twin | 40 |
| Retired | 0 |

**Course 1 progress:** 93.3% complete, 93.5% including provisional records. **Lessons 1–110 and Investigations 1–11 are complete.**

**Provisional records replaced.** C1_S11_00060 and C1_S11_00074 were covered provisionally by structured adaptations. Each is now consolidated into a two-step equation port that keeps the source's form.

**Key error.** The bank's key for C1_S11_00062 gives Z, but X is the letter with both a line of symmetry and rotational symmetry. The record is consolidated into the rotational-symmetry task, which uses a correct key.

**Consolidated.** 40 records, mostly choice-only twins and repeated fixed items. The decisions file names every pair. Several refer to figures the bank does not keep:

- C1_S11_00059, 00065, 00066 and 00068, perimeters of figures that are missing; they point to the drawn L-shape perimeter task;
- C1_S11_00067 and 00069, areas of a hexagon that is missing; they point to the drawn area task;
- C1_S11_00046, a transformation figure that is missing;
- C1_S11_00013, pictures for lines of symmetry;
- C1_S11_00041, a relationship that is missing; it points to the constant-of-proportionality table task.

## New tasks

There are 39 new tasks, from 11 new recipes:

| Lesson | Topics |
|---|---|
| 101 | Students from a survey ratio; a part, a total or a ratio from a ratio and one other quantity |
| 102 | Pounds to ounces, kilograms to grams and tons to pounds; adding and subtracting pounds and ounces |
| 103 | Perimeters of an L-shaped figure and of a figure with a notch |
| 104 | Simplifying three and four signed terms |
| 105 | The total from a part and a percent; how many played, from a percent; the constant of proportionality from an equation and from a table; a proportion with a decimal; a price from a payment and the remaining percent |
| 106 | Solving ax + b = c and ax − b = c |
| 107 | Areas of a rectangle with an added square, a stepped figure and a rectangle with a notch |
| 108 | Naming a translation, reflection or rotation on a drawn coordinate grid |
| 109 | Congruent and similar triangles: an area, a perimeter, a missing side, a missing angle, corresponding angles, and choosing the similar triangle |
| 110 | A letter with a line of symmetry; the lines of symmetry of a figure; a letter with rotational symmetry; plus one teacher-review task: drawing the line of symmetry of an isosceles triangle |
| Investigation 11 | Actual perimeter from a scale drawing; a distance from a map scale; an actual height from a drawing scale; plus one teacher-review task: creating a scale drawing |

**Answer forms.** No new forms. Pound-and-ounce sums and differences are two-part answers.

**New drawings:**

- rectilinear figures with labelled sides, including notches and steps;
- triangle pairs with vertex names, side labels, angle labels and right-angle marks;
- regular polygons with one labelled side;
- transformations of a shape on a coordinate grid.

**Teacher review.** C1_S11_00078 and 00052 ask the student to draw. The teacher sees a reference drawing. These tasks are not in the practice bundle.

**Connections.** 21 tasks are placed in 12 track levels:

- ratio totals;
- unit conversion;
- perimeter;
- integer arithmetic;
- unknowns from percents;
- linear equations;
- similar figures and correspondence;
- coordinate transformations;
- scale lengths.

No existing selector lost its matches.

**Practice bundle:** 2,458 → 2,495 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 1,195 port tasks, 1,000 instances each. The Course 1 oracles recompute every key with separate code:
  - **Rectilinear figures.** Perimeters and areas are computed from the vertex coordinates (shoelace formula for areas).
  - **Transformations.** The image is compared with the translated, reflected and rotated copies of the shape to name the transformation.
  - **Signed terms.** The expression in the prompt is parsed and evaluated.
  - **Symmetry.** Letters are checked against fixed sets of letters with line and rotational symmetry.
  - **Ratios, percents and scales.** These are checked exactly as fractions.

  Before the full run, every new task passed 4,800 instances.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings, including the teacher reference drawings, were rendered and inspected.
