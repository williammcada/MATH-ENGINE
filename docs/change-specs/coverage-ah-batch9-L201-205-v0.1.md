# Coverage Batch AH-9: Algebra 1/2 Lessons 201–205, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change. Lessons 201–210 are the course's supplementary topics.

## Result: every one of the 49 records in Lessons 201–205 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 43 |
| Existing adaptation confirmed after review | 6 |
| Consolidated | 0 |
| Retired | 0 |

**Confirmed adaptations:** node:766 (bisector construction) and the five binary adaptations node:791, 795, 799, 803, 806. Each binary one is the only entry for a shared selector (`b/binary-read`, `b/binary-write`, `o/binary-add`, `o/binary-fractions`, `o/binary-multiply`), so it is confirmed rather than replaced.

## New tasks

43 tasks from 39 recipes.

| Lesson | Topics |
|---|---|
| 201 | Constructions: copying an angle, bisecting an angle, perpendicular bisectors, perpendiculars from and at a point |
| 202 | Stem-and-leaf plots; mode, mean, median and range; box-and-whisker plots; histograms |
| 203 | Base 2: reading, writing, adding and multiplying, with fraction parts |
| 204 | Angles at parallel lines and a transversal; inscribed and central angles and arcs |
| 205 | Approximating square, cube, fourth and fifth roots |

Root approximations are keyed by exact integer rounding (no floating-point ties).

**Teacher review:** node:762, 765, 769, 772, 775 (constructions), 779 (stem-and-leaf plot), 782 (box plot), 786, 787 (histograms), each with a rubric and an answer-key drawing.

**New drawings:** compass-and-straightedge constructions drawn from arcs and lines, with four-choice sets in which each wrong drawing has one named error (wrong radius, missing arc, arcs too short, line not through the crossing, arcs from one point only); box-and-whisker plots and four-plot choice sets; histograms; parallel lines with a transversal; a trapezoid with parallel sides marked; circles with inscribed and central angles.

## Changes in the port

| Record | Source | In the port |
|---|---|---|
| node:763, 770, 773, 776, 784 | Choice among pictures | The four pictures are drawn as choices (a)–(d) |
| node:767 | The four steps are pictures | The steps are given in words |
| node:804 | Ten fixed sums | Generated binary numbers with up to three fraction digits |
| node:817 | Point labels not recovered | Labels reconstructed from the drawing so that the six source answers hold |

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. AH-9 oracles read binary numbers by place value, recompute statistics and quartiles from the data, check that the key names the correct construction, and recompute rounded roots exactly.
- **Drawings** rendered in Chromium and inspected; the box-plot choice set was respaced after inspection.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
