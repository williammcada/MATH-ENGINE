# Coverage Batch AH-10: Algebra 1/2 Lessons 206–210, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change. This is the last batch of the course.

## Result: every one of the 55 records in Lessons 206–210 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 55 |
| Existing adaptation confirmed after review | 0 |
| Consolidated | 0 |
| Retired | 0 |

## New tasks

55 tasks from 46 recipes.

| Lesson | Topics |
|---|---|
| 206 | Adding, subtracting, multiplying and dividing polynomials |
| 207 | Translations, reflections and rotations on the coordinate plane |
| 208 | Graphing parabolas y = ax² and y = ±x² + b |
| 209 | Slope from two points, from a graph and from an equation |
| 210 | Sine, cosine and tangent; trigonometric tables; applications |

Polynomial answers use the shared `poly` form (like terms collected, any order); image points use `ah-points` (in vertex order); trigonometric triples use `parts`.

**Teacher review:** node:868, 869, 870 (graph a parabola, with an answer-key graph) and node:871 (describe a change), each with a rubric.

**New drawings:** coordinate planes with the preimage figure; parabolas; four-graph choice sets; lines through lattice points, including a plane marked every 5 units; labelled right triangles; angle-of-elevation and ladder figures.

## Changes in the port

| Record | Source | In the port |
|---|---|---|
| node:854–866 | (a) graph the preimage, (b) find the image points, (c) graph the image; coordinates from fixed tables | The preimage is drawn from generated vertices in the same range and the image points are asked for; the graphing parts are not scored |
| node:866 | The correct choice depends on a separate rotation list | One rotation (90°, 180° or 270°) is stated and keyed |
| node:877–880 | Lines from fixed tables, "about" slopes on a wide grid | Lines through generated lattice points, so every slope is exact |
| node:872 | Choice-only graphs | Four parabolas drawn as choices a–d |

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. AH-10 oracles evaluate the printed polynomial expression at sample points against the key, apply each transformation rule to the vertices, recompute slopes from the plotted points, and recompute trigonometric values from four-place tables.
- **Drawings** rendered in Chromium and inspected.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
