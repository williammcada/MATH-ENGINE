# Coverage programme — Algebra 1 Batch A1-11: Lessons 106–120, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-10. This is the last batch of the course.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 106–120: 47 records (40 open, 7 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 40 |
| Covered by the reviewed earlier adaptation | 4 (nodes 962, 1021, 1026, 1027) |
| Left as they were | 3 (nodes 948, 955: request R3; node:960: request R5) |

**The seven provisional records** were each reviewed against the source script:

- **Covered as they are** — 962 (an isolated radical), 1021 (completing the square), 1026 and 1027 (the quadratic formula): the domain and quadratic adaptations use the source's forms and ranges.
- **Not faithful** — 948 and 955 (equations of lines) use fractional slopes and zero coordinates; the source uses integer slopes from ±1 to ±5. 960 (an equation in √x and x) includes one pair the source's table leaves out. Port recipes are ready (`a1-line2` 948 and 955, `a1-radeq` 960); replacing the adaptations would fail the breadth and domain audits (requests R3 and R5).

## What was built

18 recipes in `src/port-algebra-1.js`:

- **Lessons 106–107** — equations of lines through two points, through a point with a given slope, and parallel to a given line.
- **Lesson 108** — radical equations, including those with no solution.
- **Lesson 109** — factoring ax² + bx + c.
- **Lesson 110** — shifts and reflections of x², x³, |x| and √x.
- **Lesson 111** — conjunctions and disjunctions over the reals or the integers.
- **Lessons 112, 116** — products of binomials with square roots; dividing by a square root and rationalizing.
- **Lessons 113, 117** — direct and inverse variation, including squares and cubes.
- **Lesson 114** — powers with a calculator, compound interest, and graphs of y = aˣ and y = (1/a)ˣ.
- **Lesson 115** — graphing linear inequalities in two variables.
- **Lessons 118–119** — completing the square and the quadratic formula (choice).
- **Lesson 120** — box-and-whisker plots.

**Course answer part** (no shared change):

| Part | Used for |
|---|---|
| `solset` | a solution set of exact numbers in any order, or ∅ ("no solution", "the empty set") |

The `exact` part takes `rat` (no radical left in a denominator), and the `expr` part ignores a leading "A(n) =" label.

**Drawings.** Original: four graphs of a basic function and its shifts (node:973), number lines with two rays (disjunctions), box-and-whisker plots. Shared: coordinate-plane drawings with shaded half-planes, dot-line and inequality drawings. Sketching and graphing tasks (973, 977, 980, 1002, 1006, 1007, 1008, 1031) are teacher-reviewed with a rubric; choice tasks show four labelled drawings and take the letter.

## Source corrections (U-04)

- **node:999** — the source writes the growth factor as 1.0c, which gives 1.010 instead of 1.10 at 10%; the port writes 1 + r correctly.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each. Line oracles check that the key passes through the prompt's points and has the stated slope; the inequality oracle tests the prompt's compound inequality at every integer from −10 to 10; variation and growth oracles recompute from the parameters; the box-plot oracle compares the drawing's five-number summary with the chosen data set.
- The ready-but-unassigned recipes (requests R3 and R5) were built 200 times each and their keys checked.
- After this batch every Algebra 1 record is decided except the 42 named in the pending requests (R1–R5).
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
