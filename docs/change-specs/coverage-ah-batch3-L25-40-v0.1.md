# Coverage Batch AH-3: Algebra 1/2 Lessons 25–40, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change.

## Result: every one of the 64 records in Lessons 25–40 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 54 |
| Existing adaptation confirmed after review | 10 |
| Consolidated | 0 |
| Retired | 0 |

**Confirmed adaptations:** node:210 (compound area; also the only entry for the shared selector `g/compound-area`), 217, 218 (means of measurements), 221, 222 (triangle with an outside height, right trapezoid), 276, 277, 287, 288, 297 (one-step equations).

## New tasks

54 tasks from 54 recipes.

| Lessons | Topics |
|---|---|
| 25 | Area as a difference (a rectangle with two notches) |
| 26 | Range, mode, median and mean; choosing a statistic; the score needed for an average |
| 27 | Areas of triangles, including a right triangle drawn on its hypotenuse |
| 28 | Improper fractions, mixed numbers and decimals |
| 29 | Reading a bar graph and a circle graph; making a bar graph and a broken-line graph |
| 30 | Adding and subtracting unlike fractions |
| 31–32 | Order of operations; evaluating expressions with whole, fraction and decimal values |
| 33 | Two unit multipliers, including units of area |
| 34–35 | Adding and subtracting mixed numbers; rates |
| 36 | Rate word problems |
| 37–40 | One-step equations, reciprocals |
| 38 | Reading, graphing and choosing points on a coordinate plane; perimeter and area from vertices |

**New answer form:** `ah-points`, ordered pairs in a given order (node:280).

**Teacher review:** node:234 (draw a bar graph and a broken-line graph) and node:281 (graph three points), each with a rubric and an answer-key drawing.

**New drawings:** a notched rectangle; triangles with base and height or with the right angle on the apex; a broken-axis bar graph; a circle graph with sectors in proportion; coordinate grids with labelled points; four small graphs as choices A–D.

## Bugs and changes in the port

| Record | Source | In the port |
|---|---|---|
| node:233 | Bank picture not recovered; a nine-month span gives a repeating mean | The port draws the graph; the month span is never 9 months (the source already avoided 3, 6 and 7) |
| node:235 | Sectors of fixed size whatever the counts | Sectors in proportion to the counts |
| node:247 | With a = 3 the only candidate for one value is rejected by the source itself | a runs from 4 to 7, which is the source's effective range |
| node:253 | Inches to yards keyed to hundredths without saying so | The exact value, as a fraction or mixed number |
| node:255, 259 | The key is an unevaluated unit-multiplier expression | The value is asked for |
| node:283 | Choice-only (four graphs) | The four graphs are drawn as labelled choices A–D |

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. AH-3 oracles recompute statistics by counting and sorting, areas from base and height or the Pythagorean legs, sums of fractions numerically, conversions from unit factors, and coordinate side lengths from the vertices.
- **Drawings** rendered in Chromium and inspected.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
