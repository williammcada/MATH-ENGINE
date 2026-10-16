# Coverage programme — Algebra 1 Batch A1-6: Lessons 43–53, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-5.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 43–53: 62 records (56 open, 6 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 54 |
| Covered by the reviewed earlier adaptation | 1 (node:496) |
| Consolidated into a twin's task | 2 (node:507 → 506, 565 → 563) |
| Left as they were | 5 (nodes 493, 494, 495, 551, 552; covered-provisional; request R4) |

**The six provisional records** have earlier statistics-bank adaptations, each reviewed against its source script:

- **node:496** (mean from a total) matches the source's question, ranges and response form, so it is recorded as covered.
- **Nodes 493–495** (range, mean, median and mode) and **551–552** (overall average of groups) do not: the source builds each data set so the mean is whole and there is one mode, and its groups total 15 or 20 values. Port recipes that keep the source's construction are ready (`a1-stats`, `a1-overall`), but replacing the adaptations fails the shared `tests/statistics-bank-audit.py`, which asserts a fixed instance count. They stay provisional; request R4 in `coverage-a1-pending-requests-v0.1.md`.

## What was built

20 recipes in `src/port-algebra-1.js`:

- **Lessons 43–44, 52** — least common multiples of numbers and monomials; adding and subtracting rational expressions with monomial and binomial denominators.
- **Lessons 45, 52** — a statistic of contributions (choice); the average needed on later quizzes; the ready statistics recipes above.
- **Lesson 46** — conjunctions: graphing, writing from a graph, choosing a graph.
- **Lesson 47** — percents less than and greater than 100.
- **Lessons 48–49** — degree; adding, subtracting and multiplying polynomials.
- **Lessons 50–51** — graphing points, lines y = ax + b, and vertical and horizontal lines; choosing graphs.
- **Lesson 53** — the power rule with negative and zero exponents; cubic unit conversions.

**Course answer parts** (no shared change):

| Part | Used for |
|---|---|
| `ratexp` | one fraction: the numerator a polynomial with like terms combined (checked term by term); the denominator equal to the least common denominator in any form, for example factored. A numerator or denominator with more than one term must be in parentheses. |
| `conj` | a conjunction, as one compound inequality or two joined by "and" |
| `poly` `order: 'desc'` | the terms in descending degree, where the source asks for it |
| `num` | also accepts a percent sign or a leading dollar sign where the answer is a percent or an amount of money, and a word label such as "range =" |

The course polynomial reader now takes a fraction coefficient in lowest terms (for example 16b⁴/(81a⁴)).

**Drawings.** A number line with a shaded segment and open or closed ends (conjunctions), drawn by the course; graphs use the shared coordinate-plane drawings. Drawing tasks (500, 532, 536, 537, 540) are teacher-reviewed with a rubric; choice tasks show labelled graphs and take the letter.

## Source corrections (U-04)

- **node:545** — when the second denominator is x and the binomial is x − y, the source key drops the sign of the y term; the port's key gives the correct numerator.
- **node:564** — the source converts kilometers with (100) where (1000) is needed; the port uses (1000)³.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each. Rational-expression oracles rebuild the numerator from the parameters and check the denominator as the product it should equal; the conversion oracle recomputes the volume factor from unit lengths.
- Integrated pre-check (regeneration, course-banks, coverage ledger, port courses, practice, connections, breadth bank and its audit, grade 5, milestone 7, linear audit): all pass except `related-concepts.cjs`, a baseline failure. With the five statistics records replaced, `statistics-bank-audit.py` failed (above), so they are not replaced.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
