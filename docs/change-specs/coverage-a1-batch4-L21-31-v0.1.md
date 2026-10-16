# Coverage programme — Algebra 1 Batch A1-4: Lessons 21–31, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-3.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 21–31: 65 records (44 open, 21 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 42 |
| Covered by the reviewed earlier adaptation | 8 (nodes 297, 298, 302, 303, 309, 354, 356, 357) |
| Consolidated into a twin's task | 2 (node:294 → 292, 324 → 322) |
| Left as they were | 13 (covered-provisional; request R2) |

**The 21 provisional records** all have earlier `structured-linear` adaptations. Each was reviewed against its source script:

- **Eight match** the source's equation shape, ranges and response form (only the variable letter differs), so they are recorded as covered by those adaptations.
- **Thirteen do not**: different fraction forms (293, 304, 305), long decimal answers the source never gives (316, 317, 359), or solutions far outside the source's small integer ranges (355, 358, 360–364). Port recipes that keep the source ranges are ready, but replacing these adaptations fails the shared `tests/linear-bank-audit.py`, which requires every row of the linear mapping to stay served. They stay provisional; request R2 in `coverage-a1-pending-requests-v0.1.md` describes the shared change.

## What was built

17 recipes in `src/port-algebra-1.js`:

- **Lesson 21** — the product rule, like terms with positive and negative exponents (factors in any order, and exponents split among repeated factors).
- **Lessons 22–27** — which number satisfies an equation; one- and two-step equations; equations with fractions, mixed numbers and decimals; collecting like terms on both sides; distributing monomials with exponents.
- **Lessons 28–30** — fractional and decimal parts of numbers; functional notation (linear, quadratic, product, square-root and reciprocal rules); negative and zero exponents; algebraic phrases.
- **Lesson 31** — equations with nested grouping symbols, absolute values, powers of negative numbers and zero exponents.

**Course answer parts** (no shared change):

- `poly` now uses the course's own parser, which takes negative exponents (`a⁻²`, `a^-2`) and quotient forms (`1/a⁵`, `3/x²`). Keys are compared term by term with like terms combined.
- `expr` — an expression in given variables, accepted in any equivalent form that uses them (checked at sample values). Used for algebraic phrases.
- `num` also ignores a leading `f(3) =` or `x =`.

**Solutions of equations** accept any exact form (integer, fraction or mixed number), as the Engine's linear tasks do; the prompt says so.

## Source corrections (U-04)

- **node:331** — the source asks to "find y(x) = 81"; its key gives y(81). The port asks for y(81).
- **node:341** — when the zero exponent is on (cx)⁰, the source key still multiplies by c. The port's key drops it, since (cx)⁰ = 1.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each. The Lesson 31 oracles substitute the key back into the equation with exact rationals.
- Integrated pre-check (regeneration, course-banks, coverage ledger, port courses, practice, the linear, breadth and milestone tests): all pass except `related-concepts.cjs`, a baseline failure.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
