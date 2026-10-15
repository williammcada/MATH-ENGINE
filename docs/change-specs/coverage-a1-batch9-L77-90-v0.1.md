# Coverage programme — Algebra 1 Batch A1-9: Lessons 77–90, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-8.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 77–90: 63 records (51 open, 12 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 46 |
| Covered by the reviewed earlier adaptation | 7 (nodes 836–842) |
| Consolidated into a twin's task | 5 (node:765 → 764, 807 → 805, 825 → 821, 829 → 828, 855 → 853) |
| Left as they were | 5 (nodes 768–771: request R2; node:820: request R3) |

**The twelve provisional records** were each reviewed against the source script:

- **Covered as they are** — 836 to 842 (quadratic equations solved by factoring): the quadratic-bank adaptations use the source's forms and ranges.
- **Not faithful** — 768 to 771 (equations with fractions): the source takes the coefficients from fixed tables, and the linear adaptations give combinations it never uses (for example x/7 in node:770). 820 (polynomial division): the source divides exactly and asks for the quotient; the breadth adaptation has a remainder and asks for four numbers. Port recipes that keep the source's tables are ready (`a1-rateq` 768–771, `a1-polydiv` 820), but replacing linear or breadth entries fails the shared audits (requests R2 and R3).

## What was built

18 recipes in `src/port-algebra-1.js`:

- **Lesson 77** — consecutive odd and even integers; fraction word problems (the part left, the total).
- **Lesson 78** — equations with fractions (choice; the other four records wait on request R2).
- **Lessons 79, 87** — rate-time systems with subscripted variables (R_A, T_A; R_m, R_n).
- **Lesson 80** — multiplying and dividing numbers in scientific notation.
- **Lesson 81** — solving systems by graphing; consistent, inconsistent and dependent equations.
- **Lesson 82** — functional notation with binomials; the domain of square-root functions; domain and range of a graph.
- **Lesson 83** — coin problems.
- **Lessons 84, 87** — multiplying radicals; is a relation a function (sets, mappings, a graph).
- **Lesson 85** — stem-and-leaf plots and histograms.
- **Lesson 86** — dividing polynomials by binomials.
- **Lesson 88** — solving a quadratic equation by factoring out x.
- **Lessons 89–90** — value problems (candy and trail mix, tickets); two numbers, weights, ages and bills from two equations.

**Course answer parts** (no shared change):

| Part | Used for |
|---|---|
| `divq` | a quotient polynomial plus the remainder over the divisor ("Q + r/(x + d)", or "Q R r") |
| `sci2` | a number written as an ordinary number or in scientific notation |
| `ineq` with `strip` | a domain written "x ≥ 2", "{x \| x ≥ 2}" or "D = {x ∈ ℝ \| x ≥ 2}" |
| `conj` with `v` | a conjunction in a variable other than x (a range in y) |

A numeric answer may now carry a subscripted label such as "T_A =".

**Drawings.** Shared coordinate-plane, stem-and-leaf and histogram drawings; an original curve with open or closed endpoints for domain and range (node:796); an original parabola for the vertical line test (node:831). Graphing and plotting tasks (783, 784, 813, 816) are teacher-reviewed with a rubric.

## Source corrections (U-04)

None in this batch.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each. System oracles read the equations back from the prompt and substitute the key; division oracles rebuild the dividend from the parameters and check quotient × divisor + remainder at sample values; scientific-notation oracles read the four numbers back from the prompt; function-test oracles read each relation from the prompt and apply the definition.
- The ready-but-unassigned recipes (requests R2 and R3) were built 200 times each and their keys checked.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
