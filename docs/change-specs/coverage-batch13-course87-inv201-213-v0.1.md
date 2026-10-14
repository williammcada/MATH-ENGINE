# Coverage Batch 13: 8/7 investigations (scope 201–213), v0.1

Recorded 2026-10-14. This is the last 8/7 batch. It covers the thirteen investigations that follow Lesson 120, and it follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6.

**Version:** Engine 0.46.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 62 records in the investigations is decided — 8/7 is complete

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 34 |
| New port task replacing a less faithful adaptation | 10 |
| Existing adaptation confirmed after review | 5 |
| Consolidated choice-only twin | 13 |
| Retired | 0 |

**8/7 progress: 100% complete** — all 789 records are covered (625) or consolidated (164); none is open or provisional.

**Replacements:**

| Record | Earlier adaptation | Original |
|---|---|---|
| SN870730 (parts of a circle as a percent) | Its own fractions, such as 2/4 | The source's 22 sums of halves, fourths and tenths, named in words |
| SN870742 (read a stem-and-leaf plot) | 15 values on stems 2 to 5 | Three consecutive stems with three, three and two leaves |
| SN870812 (median, mode and range from a stem-and-leaf plot) | Nine listed values | A plot of three to five stems with a single mode |
| SN870838 (draw a box-and-whisker plot) | Choose a plot | Draw the plot for nine values (teacher review) |
| SN870744 (range and IQR from a box plot) | Nine values | A plot of 11 values on the source's scales |
| SN870806 (five-number summary from a box plot) | Nine values | A plot of 11 values on the source's scales |
| SN870774 (probability from raffle odds) | Odds outside the source's table | The source's 43 cases, for winning or not winning |
| SN870834 (probability from odds) | Odds not in lowest terms | Totals 3 to 12 with odds in lowest terms |
| SN870816 (marble probability) | Two colors could have the same count | Three different counts |
| SX870466 (volume ratio of two cubes) | Sides outside the source's table | The source's 15 pairs |

**Confirmed adaptations:**

- SX760042 (a fraction of a circle as a percent).
- SN870734 (one sector as a percent).
- SX870108 (the fourth vertex and area of a rectangle).
- SN870810 (make a stem-and-leaf plot).
- SX760144 (chance of no rain).

**Consolidated twins:** SX650140 → SN870730, SN870733 → SN870734, SN870829 → AXA10097, SN870811 → SN870812, SN870745 → SN870806, SN870814 → SN870748, SN870752 → SX870380, SN870769 → SN870771, SN870815 → SN870816, SN870817 → SN870818, SMAH0407 → SN870780, SNAH0645 → SMAH0451, SNAH0575 → SMAH0366.

AXG70449 and SN870807 are choice-only, but their free-response twins need teacher review. They are therefore ported as their own automatically checked tasks.

## New tasks

There are 44 new tasks, from 13 new recipes:

| Investigation | Topics |
|---|---|
| 201 | A fraction of a fraction; parts of a circle as a percent |
| 202 | Compass constructions in a circle; diameters and inscribed and central angles |
| 203 | Graphing points; quadrants and axes |
| 204 | Stem-and-leaf plots; box-and-whisker plots |
| 205 | Histograms, a double-line graph, and circle graphs |
| 206 | Naming quadrilaterals; lines of symmetry |
| 207 | Balanced equations with decimals |
| 208 | Segment and angle bisectors; an inscribed square and octagon |
| 209 | Function tables, rules and trends |
| 210 | Probability and odds |
| 211 | Comparing cube surface areas and volumes; a scale-model cabin |
| 212 | Proving the Pythagorean theorem; finding sides |
| 213 | Base 2 and Roman numerals |

**New answer form: chord and angle.** A diameter named by its two letters in either order, and an angle named with its vertex in the middle and its endpoints in either order.

Answers such as "Range = 20; Interquartile range = 10" are now accepted with their labels.

**New drawings:**

- stem-and-leaf plots;
- box-and-whisker plots on number-line scales;
- the Yuma–Miami double-line graph, redrawn from the source's data;
- a circle with a diameter and chords;
- an inscribed square and octagon;
- quadrilateral outlines;
- three Pythagorean-proof diagrams;
- right triangles labelled for finding a side;
- a segment and an angle to bisect;
- three circle graphs to choose from;
- labelled points on the coordinate grid.

**Teacher review.** Eleven tasks ask the student to construct, draw, graph or prove, so they need teacher review:

- constructions: SX870105, SN870753 and SN870841;
- graphing and drawing: SN870805, SN870838, AXG70450, SN870808, SN870763 and SN870772;
- naming and explaining a quadrilateral: SX870296;
- proving the Pythagorean theorem: SN870778.

**Bugs and changes in the port:**

| Record | Source | In the port |
|---|---|---|
| SN870778 | Pictures for two of the three proofs not recovered | Draws all three |
| SN870833 | Picture redrawn | Drawn from the source's own data points |
| SMAH0535 | Writes 7 as 0111 | Writes 111 |
| SMAH0367 | The second case builds a numeral piece by piece | Uses numbers of the same kind from 400 to 3,999 |
| SN870744, SN870806 | Quartiles are unclear when values repeat the median | Uses 11 different values |

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Every non-teacher task offers exactly three choices across the test seeds.

**Connections.** Forty track levels gain placements:

- coordinates and quadrants;
- stem-and-leaf and box plots;
- histograms, line graphs and circle graphs;
- quadrilaterals and symmetry;
- decimal equations;
- constructions;
- circle angles;
- function tables;
- odds and probability;
- similar solids;
- the Pythagorean theorem and its proofs;
- binary and Roman numerals;
- fraction operations.

Two selectors that pointed only at replaced adaptations now point to the port recipes.

**Practice bundle:** 1,868 → 1,891 bank entries. The eleven teacher-review tasks are not in the practice bundle.

## Verification

- **`tests/port87.cjs`** covers all 561 port tasks, with 1,000 instances each. The Batch 13 oracles:
  - recompute each value from the parameters;
  - read Roman numerals back with an independent converter;
  - recompute medians, modes, quartiles and the double-line comparisons from the data;
  - check simplest radical form, and both orders of chord and angle names.
- **Bank audits.** The statistics, measurement and proportional audits now skip the replaced entries, which `port87.cjs` audits instead. They check 34,000, 21,000 and 19,000 cases.
- **Practice bundle check.** The chord-and-angle answer form rejects any answer containing digits, so the practice bundle's perturbed-answer check passes.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - The new drawings were rendered and inspected.

## Correction in Engine 0.46.1-rc.1

The Studio's Word-packet check of Engine 0.46.0-rc.1 found that two of the three Pythagorean-proof drawings for SN870778 were not geometrically faithful:

- **Garfield's trapezoid** was drawn with the wrong shape: its lower triangle had legs b and b. It is now the standard figure: parallel sides a and b, height a + b, two right triangles with legs a and b, and an isosceles right triangle with legs c. All three right angles are marked.
- **The square proof** placed the inner square's corners at the midpoints, which only fits a = b. It is now drawn with a ≠ b, and its labels match the lengths drawn.

The altitude-to-the-hypotenuse drawing was already correct. The task text, steps and checks are unchanged.
