# Coverage programme — Algebra 1 Batch A1-7: Lessons 54–65, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-6.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 54–65: 62 records (59 open, 3 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 50 |
| Covered by the reviewed earlier adaptation | 1 (node:662) |
| Consolidated into a twin's task | 9 (node:575 → 574, 578 → 577, 584 → 583, 593 → 591, 621 → 620, 626 → 625, 643 → 642, 652 → 650, 659 → 658) |
| Left as they were | 2 (node:570, request R3; node:661, request R4) |

**The three provisional records:**

- **node:662** (weighted percentage) — its statistics adaptation matches the source's ranges and response form; recorded as covered.
- **node:570** (system by substitution) — its breadth adaptation gives solutions outside the source's range (x between −20 and 20). The port recipe `a1-system` variant `570` is ready; replacing a breadth entry fails `tests/breadth-bank-audit.py` (request R3).
- **node:661** (weighted average) — its statistics adaptation uses weights 1–5 for every test; the source uses 1–4 for the first two and 2–5 for the last two. `a1-wavg` variant `661` is ready; replacing a statistics entry fails `tests/statistics-bank-audit.py` (request R4).

## What was built

18 recipes in `src/port-algebra-1.js`:

- **Lessons 54, 59** — systems by substitution (rearranging first), answered as an ordered pair.
- **Lesson 55** — complex fractions.
- **Lessons 56, 61** — sets: listing members, membership and subsets (true or false), subsets of the real numbers, classifying numbers.
- **Lessons 56** — rearranging an equation before graphing.
- **Lesson 57** — adding terms with negative exponents into one fraction.
- **Lesson 58** — percent word problems.
- **Lesson 60** — prisms: surface area, volume and lateral area.
- **Lessons 62–63, 65** — square roots, plus-or-minus evaluation and the quadratic formula; simplifying and adding radicals; rational and irrational numbers.
- **Lesson 64** — inequalities and conjunctions with a stated domain (integers, positive or negative integers, real numbers).
- **Lesson 65** — weighted averages.

**Course answer parts** (no shared change):

| Part | Used for |
|---|---|
| `pair` | an ordered pair (x, y) |
| `pm` | two exact values, as "a ± b" or two values separated by a comma; radicals simplified; i for the square root of a negative number (read by the course's small complex-number reader) |
| `numset` | a set of integers in braces, any order, each member once |
| `sets` | names of number sets (rational, irrational, integers, whole, natural), any order; "real" may be added |
| `ineq`, `conj` with `intdom` | over the integers, equivalent inequalities (x ≥ 3 and x > 2) are both accepted |

**Drawings.** Original right-trapezoid and notched-rectangle bases; the shared triangular-prism, pentagon, dot-line, inequality and coordinate-plane drawings. Graph-drawing tasks (586, 587, 654) are teacher-reviewed with a rubric; choice tasks show labelled graphs and take the letter.

## Source corrections (U-04)

- **node:624** — for positive integers the source lists "rational, integers, natural" and omits whole numbers; the port requires every set the number belongs to.
- **node:625** — the source labels 3a − k·e as "rational, integers" even when its value is positive or zero; the port classifies the actual value.
- **node:645** — the source writes the repeating decimal with a comma; the port uses a decimal point and says which digits repeat.
- **node:655** — the source's choice graphs are drawn inconsistently with its own answer; the port draws its own correct graph and three named distractors.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each. System oracles read both equations back from the prompt and substitute the key; classification oracles evaluate each number independently.
- Integrated pre-check (regeneration, course-banks, coverage ledger, port courses, practice, connections, breadth bank and its audit, grade 5, milestone 7, statistics and linear audits): all pass except `related-concepts.cjs`, a baseline failure.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
