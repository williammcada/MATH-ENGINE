# Coverage Batch AH-5: Algebra 1/2 Lessons 56–72, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change.

## Result: every one of the 56 records in Lessons 56–72 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 46 |
| New port task replacing a less faithful adaptation | 1 |
| Existing adaptation confirmed after review | 8 |
| Consolidated | 1 |
| Retired | 0 |

**Replacement:** node:415 (two-step equation). The earlier adaptation's solutions reach 30; the source keeps x from 2 to 9. Its shared selector names the record, so the replacement needs no shared change.

**Confirmed adaptations:** node:402, 403 (rates), 409, 410 (circles), 413, 414 (two-step equations), 439 (ratio; the only entry for `p/ratio-missing`), 448 (percent whole; the only entry for `p/percent-whole-half`).

**Consolidated:** node:466 → node:168. It asks the same thing with the same nine fractions and exponent range.

## New tasks

47 tasks from 43 recipes.

| Lessons | Topics |
|---|---|
| 56–57 | Equations and word problems with mixed numbers |
| 58 | Distance, rate and time |
| 59, 65 | Proportions with fractions and mixed numbers |
| 60 | Area or circumference of a circle |
| 61 | Two-step equations with whole numbers, mixed numbers and decimals |
| 62–63 | Fractional-part problems; changing rates |
| 64 | Perimeter and area of rectangles and trapezoids with a half circle |
| 65 | Similar triangles |
| 66–67 | Ratio problems; unit prices |
| 68 | Percent problems and percent diagrams |
| 69–70 | Absolute value; adding signed numbers, with arrows on a number line |
| 71 | Powers and roots of fractions |
| 72 | Graphing inequalities |

**Teacher review:** node:459 (add with arrows) and node:472 (graph an inequality), each with a rubric and an answer-key drawing.

**New drawings:** rectangles and trapezoids with a half circle; pairs of similar triangles drawn in proportion; a before-and-after percent diagram; four number lines with arrows (choices A–D); four inequality graphs (choices a–d).

## Changes in the port

| Record | Source | In the port |
|---|---|---|
| node:416 | Draws its coefficients from long fixed tables | Generates mixed-number coefficients in the same ranges, keeping the right side positive |
| node:436, 437 | Angle marks drawn on the triangles | The triangles are drawn in proportion with every side labelled; the prompt says matching sides are in the same positions |
| node:443 | Two possible answers | The answer names the can; "the same unit price" is offered as a further distractor |
| node:460, 473 | Choice-only graphs | The four graphs are drawn as labelled choices |

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. AH-5 oracles substitute each solution back into its equation or proportion, recompute circle and composite measures with 3.14, check the hypotenuse label against √(4a² + d²), and recompute rates, percents and signed sums.
- **Drawings** rendered in Chromium and inspected; the similar-triangle drawings were redrawn after inspection so labels sit outside the sides.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
