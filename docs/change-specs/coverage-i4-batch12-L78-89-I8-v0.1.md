# Coverage Batch I4-12: Intermediate 4 Lessons 78–80, Investigation 8, Lessons 81–89, v0.1

Recorded 2026-10-16 (Asia/Shanghai). Same protocol and rules as Batch I4-1 (`coverage-i4-batch1-L1-5-v0.1.md`), which holds the batch plan and the rule that no task on this branch replaces an earlier adaptation.

- **Branch:** `claude/coverage-intermediate-4`, on the I4-11 checkpoint.
- **Version:** unchanged (course branch).
- **Handbook** `9d9c80f` (v0.1.12): AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.

## Result: every one of the 98 records is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 54 |
| Consolidated twin | 44 |
| Retired | 0 |
| Left covered-provisional | 0 |

No record in this batch was covered-provisional.

**Pictures in the source.** The triangles, symmetry figures, angles, tessellation figures, coordinate grids, graphs and shaded circles are native ExamView drawings or bitmaps, read privately; the ports draw their own versions with fresh shapes and numbers. TX4_S09_00034 (where point A ends after a turn) refers to a picture that is not in the export; the port asks where the minute hand of a clock points after a turn of 90°, 180° or 270°.

## New tasks

54 tasks from 13 new recipes:

| Lesson | Tasks |
|---|---|
| 78 | Which triangle is scalene, equilateral or isosceles; classifying a triangle by sides and angles, and by angles; the word for a kind of triangle |
| 79 | Which letter has no line of symmetry; whether a letter has one; which figure has none; drawing a figure and its line of symmetry (teacher-scored) |
| 80 | Zeros in quotients: money, a zero in the middle, a zero at the end, with a remainder; dividing by a square |
| Inv. 8 | Continuing a pattern in a table; the letter at an ordered pair; which graph shows letters and positions; graphing pairs and describing a trend (teacher-scored); which student is missing from a chart |
| 81 | The angle between clock hands and the time after a turn; where the minute hand points after a turn; which angle is 90°; estimating an angle (within 15°) |
| 82 | Which figure tessellates; whether a figure tessellates |
| 83 | Sales tax from a rate; change after price and tax; the total for several items and tax; a cost from the change; change for several items; total and change |
| 84 | Thousandths as decimals, fractions and words |
| 85 | Money times 10 and 1000; cents times 100; whole numbers times 10; which division equals another |
| 86 | Tens times whole dollars; hundreds times hundreds; multiples of 10 and 100 |
| 87 | Two two-digit numbers (no regrouping), in a row and a column |
| 88 | Remainders in stories: full and short stacks, cars filled and needed, packages and leftovers, groups as even as possible, people left without a ride |
| 89 | Improper fractions and mixed numbers from shaded circles; what shaded circles show; drawing them (teacher-scored) |

**Generalised fixed items.** Fixed numbers and stories are varied within their kind. The museum-visitor graph becomes a table of four days with a constant increase, asking for a later day. The TV-and-test-results table becomes a teacher-scored task about any two related quantities.

**New answer forms (this course's checker):**

| Form | Accepted |
|---|---|
| Angle estimate | Degrees within 15° of the key |
| Angle and time | `150°; 6:15` |
| Number and words | A decimal, fraction or mixed number equal to the key; then its name in words |
| Improper fraction and mixed number | `19/8; 2 3/8`, each equal to the key |

Shared forms reused: numbers, decimal, parts, relation, text; this course's remainder, word-list, any-fraction and number-with-unit forms.

**New drawings:** triangles of each kind; symmetric and non-symmetric figures; a coordinate grid with lettered points; small dot graphs; a chart of students by event; angles; regular polygons and a circle for tessellation; circles divided into parts and shaded. This course's clock, division box and table are reused.

## Verification

**Passing run** on implementation checkpoint `6003bcc`, through Batch I4-12 (preceded by the private pre-check):

| Check | Result |
|---|---|
| Ownership: only Intermediate 4 files changed since `c7538877` | Passed |
| Shared outputs regenerated in a temporary copy | Passed |
| Full suite, 79 tests, compared with the parallel-courses baseline | Passed: every test that passed at the baseline still passes; the 31 baseline failures are unchanged |
| `tests/port-courses.cjs intermediate-4 -- 1000` | Passed; decision files validated |
| `tests/practice.cjs` and `tests/structured-bank-audit.py` | Passed |
| Drawings rendered in Chromium and inspected | Passed |
| Studio preview, PDF and Word print checks | Not run: the Studio re-pins after the integration pass |

**Ledger after this batch (regenerated in the temporary copy):** Intermediate 4 is 80.0% complete (604 covered, 506 consolidated), 82.5% including the 35 records still covered-provisional; 243 open.
