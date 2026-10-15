# Coverage programme — Algebra 1 Batch A1-5: Lessons 32–42, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-4.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 32–42: 73 records (72 open, 1 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 64 |
| Consolidated into a twin's task | 8 (node:383 → 381, 399 → 396, 415 → 414, 422 → 421, 430 → 429, 451 → 447, 457 → 456, 467 → 465) |
| Left as it was | 1 (node:376, covered-provisional; request R3) |

**node:376 (prime factorization)** is covered-provisional by a breadth-bank adaptation that uses numbers the source never asks (12, 40, 504). The port recipe `a1-primes` keeps the source's numbers (powers of 2, 3 and 5 times 7 or 11), but replacing the adaptation fails the shared `tests/breadth-bank-audit.py`, which expects a fixed number of breadth entries and recipes. node:376 stays provisional; request R3 in `coverage-a1-pending-requests-v0.1.md`.

**Twins.** Six records are choice-only versions of a free-response record with the same ranges, and two (457, 467) repeat another record's script; each is served by its twin's task.

## What was built

17 recipes in `src/port-algebra-1.js`:

- **Lessons 32–33** — word problems leading to equations; statements about unequal quantities; prime factorization.
- **Lessons 34–35** — greatest common factors; factoring out the GCF; dividing a polynomial by a monomial.
- **Lessons 36, 40, 41** — distributing rational factors with positive, negative and zero exponents; the quotient rule; negative bases with negative exponents; adding like terms written as rational expressions.
- **Lessons 37–39** — inequalities from sentences, true-or-false comparisons, comparing integers, graphing on a number line, reading graphs, negated inequalities; ratio problems.
- **Lesson 41** — two-step evaluation (solve an equation, or take a cube root, then evaluate).
- **Lesson 42** — solving equations in two variables for one of them.

**Course answer parts** (no shared change):

| Part | Used for |
|---|---|
| `poly` with `form` | the source's required form: all exponents positive, all letters in the numerator, all exponents negative, or all letters in the denominator |
| `factor` | GCF(polynomial): the greatest common factor in front, the rest in parentheses (terms in any order) |
| `primes` | a product of primes, with or without exponents |
| `ineq` | a linear inequality: by solution set, or side by side for translations; a negated inequality must use ≯, ≮, ≰ or ≱ (typed `!>` or `not >` accepted) |
| `solve` | "u = expression" in the other variable, any equivalent form, checked at sample values |

The course polynomial reader now reads a denominator in parentheses with negative exponents, such as `1/(a⁻¹b⁻²)`.

**Drawings.** Number lines use the shared inequality drawings already used by the 8/7 ports: node:417 (draw the graph) is teacher-reviewed with a rubric, node:418 shows four labelled number lines and asks for the letter, and nodes 426–427 show the graph to be described.

## Source corrections (U-04)

- **node:441** — the source's retry loop tests different expressions from the ones it displays, so like terms could appear uncombined. The port makes sure the first two terms are never like terms.
- **node:415** — the choice "Not Given" is never the key; the twin task asks for <, > or =.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each. The oracles rebuild each polynomial from the task's parameters: factoring finds the GCF independently and divides; expansions multiply term by term; inequality-graph tasks read the drawing's description.
- Integrated pre-check (regeneration, course-banks, coverage ledger, port courses, practice, connections, breadth bank and its audit, grade 5, linear audit): all pass except `related-concepts.cjs`, a baseline failure. With node:376 replaced, `breadth-bank-audit.py` failed (above), so it is not replaced.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
