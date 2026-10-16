# Coverage Batch AH-8: Algebra 1/2 Lessons 107–123, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change.

## Result: every one of the 71 records in Lessons 107–123 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 55 |
| Existing adaptation confirmed after review | 16 |
| Consolidated | 0 |
| Retired | 0 |

**Confirmed adaptations:** node:656, 657 (Roman numerals), 687 (marbles), 691, 694 (reading scales), 699–702 (independent events), 712 (parallelogram area), 718 (x² = a square), 730 (milliliters to liters), 737, 738, 741, 742 (pyramids and cones).

## New tasks

55 tasks from 55 recipes.

| Lessons | Topics |
|---|---|
| 107 | Roman numerals |
| 108 | Fractional percents; fraction–decimal–percent table |
| 109–111 | Simple and compound interest; markup and markdown; commission; profit |
| 112, 114 | Probability: spinners, two dice, cards, two spinners |
| 113 | Measuring segments in inches, centimeters and millimeters |
| 115 | Naming polygons; congruence and transformations |
| 116 | Areas of parallelograms and trapezoids |
| 117 | x² equations; the Pythagorean theorem |
| 118–119 | English and metric volume conversions |
| 120 | Volume of a sphere |
| 121 | Solids from nets; symmetry |
| 122 | Permutations |
| 123 | Subsets of the real numbers |

Radical answers use the shared `roots` form; transformations, number sets and triangle types use `ah-wordset` (any order).

**Teacher review:** node:696 (draw and measure), 706 (polygon names), 709 (transformations), 748 (lines of symmetry), each with a rubric.

**New drawings:** an eight-section spinner; two numbered spinners; inch and centimeter scales with a segment; fourteen polygons with parallel, equal-side and right-angle marks; congruent L-shapes and right-triangle pairs; parallelograms and trapezoids; right triangles; box and triangular-prism nets; regular polygons with their symmetry lines; nine symmetry figures; two symmetric area figures.

## Bugs and changes in the port

| Record | Source | In the port |
|---|---|---|
| node:706 | Lists a rhombus as a "regular quadrilateral" | Left out; the rectangle is drawn with right-angle marks |
| node:703, 709 | Bank pictures not recovered | Original drawings |
| node:665 | Percents and class sizes from fixed tables | Generated mixed-number percents that give a whole number of students |
| node:671, 672 | Amount shown to three decimal places of a dollar | Asked to the nearest cent |
| node:726, 727 | Key is an unevaluated unit-multiplier expression | The value is asked for (node:728 keeps the expression as a choice A–D) |

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. AH-8 oracles read Roman numerals with a separate scanner, count outcomes for dice and cards, recompute interest year by year, check Pythagorean answers by squaring, and classify number sets from the value.
- **Drawings** rendered in Chromium and inspected.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
