# Coverage Batch AH-6: Algebra 1/2 Lessons 73–90, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change.

## Result: every one of the 62 records in Lessons 73–90 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 55 |
| Existing adaptation confirmed after review | 6 |
| Consolidated | 1 |
| Retired | 0 |

**Confirmed adaptations:** node:475 (cylinder volume), 497 (new amount as a percent of the old; the only entry for `p/bill-percent`), 510 (amount after a percent increase; the only entry for `p/percent-increase`), 531, 532, 533 (equations with negative coefficients).

**Consolidated:** node:528 → node:275. Both ask for x in x + b = a with a from 10 to 30.

## New tasks

55 tasks from 54 recipes.

| Lessons | Topics |
|---|---|
| 73 | Volume and surface area of right circular cylinders |
| 74 | Adding signed numbers written without parentheses |
| 75 | Implied ratios |
| 76 | Multiplying in scientific notation |
| 77 | Percents greater than 100 |
| 78–79 | Opposites; simplifying runs of signs and brackets |
| 80 | Percent increase |
| 81 | Multiplying and dividing signed numbers; the sign of a product |
| 82 | Evaluating expressions with signed numbers |
| 83 | Rate problems as proportions |
| 84 | Two-step equations with a mixed number; negative coefficients; properties of equality |
| 85 | Graphing a line from a table; choosing the graph of a line |
| 86 | Algebraic phrases |
| 87 | Commutative and associative properties |
| 88 | Surface area of a triangular prism and of a half-ring solid |
| 89 | Symbols of negation on a number line |
| 90 | Equations from sentences |

**New answer form:** `ah-exprs`, one algebraic phrase per part, checked by value at sample points of N (node:543, 544).

**Teacher review:** node:536 (properties of equality), node:540 (graph a line), node:556 and node:557 (graph a negated inequality), each with a rubric; 540, 556 and 557 have an answer-key drawing.

**New drawings:** a cylinder with radius and height labelled; four coordinate planes with one line each (choices A–D); a triangular prism with an isosceles base split by its height; the region between two half circles; four inequality graphs (choices a–d).

## Bugs and changes in the port

| Record | Source | In the port |
|---|---|---|
| node:498 | — | The oracle caught a port bug before commit: the part was printed at one tenth of its value. The part now has the source's precision, so the percent matches the key |
| node:541, 558 | Choice-only graphs | The four graphs are drawn as labelled choices |
| node:543 | Four written phrases | Each phrase is checked by its value at three values of N, so any equivalent form is accepted |

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. AH-6 oracles evaluate every printed signed expression directly from the prompt text, substitute each solution back into its equation, check scientific notation by value and range of the first factor, check algebraic phrases at sample points, and recompute cylinder and prism measures with 3.14.
- **Drawings** rendered in Chromium and inspected.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
