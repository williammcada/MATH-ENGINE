# Coverage Batch I4-5: Intermediate 4 Lessons 23–30 and Investigation 3, v0.1

Recorded 2026-10-16 (Asia/Shanghai). Same protocol and rules as Batch I4-1 (`coverage-i4-batch1-L1-5-v0.1.md`), which holds the batch plan and the rule that no task on this branch replaces an earlier adaptation.

- **Branch:** `claude/coverage-intermediate-4`, on the I4-4 checkpoint.
- **Version:** unchanged (course branch).
- **Handbook** `9d9c80f` (v0.1.12): AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.

## Result: 107 of the 109 records decided; 2 stay as they are, pending the owner

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 70 |
| Consolidated twin | 37 |
| Retired | 0 |
| Left covered-provisional (pending request R3) | 2 |

**Provisional records.**

- **Consolidated into ports on open twins:** TX4_S03_00078 (into 00079, which right angle), 00080 (into 00108, a missing addend), 00093 (into 00002, area on a grid) and 00122 (into 00019, subtracting dollars and cents). Their earlier adaptations stay.
- **Left as they are (request R3):** 00076 (naming an angle type) and 00054 (elapsed time from p.m. to a.m.). Neither has an open twin. Their ports are written (`i4-angle-name` variant `type`, `i4-clock2` variant `overnight`).

## New tasks

70 tasks from 40 new recipes:

| Lesson | Tasks |
|---|---|
| 23 | Counting right, acute and obtuse angles of a figure; which figure has perpendicular or parallel sides; naming a quadrilateral from its properties; which angle is a right angle; which letter has no parallel segments or has a right angle; line, ray or segment; drawing a right angle and perpendicular lines (teacher-scored); judging a claim about angles (teacher-scored); the flaw in calling two cube-edge lines parallel (teacher-scored); perpendicular and parallel streets; which sides of a quadrilateral are parallel |
| 24 | Writing the rest of a fact family that has a letter; missing addends and missing numbers subtracted from, two- to four-digit, in sentences and columns, including three addends |
| 25 | Subtraction stories: how many are left, how many were lost, how many there were at first |
| 26 | Which circle has a fraction (or all but a fraction) shaded; the fraction not shaded; drawing a square, rectangle or circle with a fraction shaded (teacher-scored) |
| 27 | The time some hours and minutes earlier or later, from a clock or from words; when to leave to arrive just after noon; repeated addition as multiplication, with and without solving; groups of nines |
| 28 | A missing number in the multiplication table; the product of two numbers; a start time from an end time |
| 29 | Multiplying by 0, 1, 2 and 5; the property an expression shows; writing a sentence about 0 and 1 with symbols; which product does not equal a number; estimating a sum by rounding to thousands; the greatest product; whether a statement about even numbers is always true (teacher-scored) |
| 30 | Three-digit subtraction regrouping twice, in rows and columns; subtracting dollars and cents; change after a sale price |
| Inv. 3 | The side of a square from its area; square roots and a sum of square roots; squares of numbers; the next square numbers; area on a grid, of labelled rectangles and of a square; perimeter and area together; rows, columns and the fact for an array; whether an array can be drawn; drawing an array (teacher-scored) |

**Figures with known answers.** Angle-count figures come from a small set of grid polygons with no reflex angles, turned and reflected; the test classifies each angle independently from the coordinates. The letters are drawn with straight strokes so that "parallel segments" and "right angle" have one reading (curved letters such as G are not used).

**Generalised fixed items.** Where the source fixes one value (the soccer-practice clock, the cube's edges A and B, the claim about doubling), the port keeps the demand and varies the values or the example: the claim task draws from three statements of the same kind, each needing (a) a judgement, (b) an example and (c) a general reason.

**New answer forms (this course's checker):**

| Form | Accepted |
|---|---|
| Words in order | Each word in its place, with "line segment" accepted for "segment" |
| Two sides | Two segments named by their endpoints, in any order and either letter first |
| A set of facts with a letter | Each fact one of the expected ones, in any order |
| A product, or a product sentence | `a × b` (or `a × b = p`) with the factors in either order |
| An equation in symbols | The stated equation, with spaces and `x`/`*` for × ignored |
| Rows; columns; fact | The rows, the columns and a matching multiplication fact |

**New drawings:** grid polygons; four labelled figures to choose from; four labelled angles; a single angle; capital letters in straight strokes; a line, a ray and a segment; a street map with a compass; a lettered trapezoid; four circles in equal parts; a 1–7 multiplication table with one cell circled; a centimeter grid rectangle; dot arrays. Clocks, columns, strips and labelled rectangles reuse earlier drawings.

## Verification

**Passing run** on implementation checkpoint `46c026e`, through Batch I4-5 (preceded by the private pre-check):

| Check | Result |
|---|---|
| Ownership: only Intermediate 4 files changed since `c7538877` | Passed |
| Shared outputs regenerated in a temporary copy | Passed |
| Full suite, 79 tests, compared with the parallel-courses baseline | Passed: every test that passed at the baseline still passes; the 31 baseline failures are unchanged |
| `tests/port-courses.cjs intermediate-4 -- 1000` | Passed; decision files validated |
| `tests/practice.cjs` and `tests/structured-bank-audit.py` | Passed |
| Drawings rendered in Chromium and inspected | Passed |
| Studio preview, PDF and Word print checks | Not run: the Studio re-pins after the integration pass |

**Ledger after this batch (regenerated in the temporary copy):** Intermediate 4 is 32.3% complete (255 covered, 194 consolidated), 36.7% including the 60 records still covered-provisional; 879 open.
