# Coverage programme — Algebra 1 Batch A1-8: Lessons 66–76, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-7.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 66–76: 64 records (53 open, 11 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 50 |
| Covered by the reviewed earlier adaptation | 5 (nodes 696, 697, 698, 702, 736) |
| Consolidated into a twin's task | 3 (node:668 → 667, 713 → 712, 721 → 720) |
| Left as they were | 6 (nodes 690, 742, 752: request R3; nodes 699, 735, 737: request R4) |

**The eleven provisional records** were each reviewed against the source script:

- **Covered as they are** — 696 (two-dice sums), 697 and 698 (independent die rolls), 702 (coin sequences) and 736 (with and without replacement): same question, ranges and response form.
- **Not faithful** — 690 asks for p and q instead of the factored form; 742 uses one-digit numbers and a two-number answer; 752 includes negative and decimal slopes; 699, 735 and 737 use other marble counts. Port recipes that keep the source's ranges are ready (`a1-trinom` 690, `a1-sci` 742, `a1-graph3` 752, `a1-prob` 699/735/737), but replacing breadth or statistics entries fails the shared audits with fixed totals (requests R3 and R4).

## What was built

11 recipes in `src/port-algebra-1.js`:

- **Lesson 66** — simplifying sums of radicals, including square roots of large numbers.
- **Lessons 67, 71** — systems by elimination, including subscripted variables N_Q and N_D.
- **Lesson 68** — complex fractions with inner fractions and negative exponents.
- **Lessons 69, 71–73** — factoring trinomials (with and without a common factor), a common binomial factor, and differences of two squares.
- **Lessons 70, 73** — probability: single draws, sequences of spins, draws with and without replacement.
- **Lesson 72** — surface area and volume of pyramids and cones.
- **Lesson 74** — scientific notation.
- **Lesson 75** — equations of graphed lines; graphing by the slope-intercept method.
- **Lesson 76** — consecutive integers.

**Course answer parts** (no shared change):

| Part | Used for |
|---|---|
| `factors` | a product: an optional factor in front, then factors in parentheses; the product must equal the polynomial and no factor in parentheses may keep a common factor ("factor completely") |
| `simple` | one fraction with no negative exponents and no factor common to the numerator and denominator, equal to the key |
| `sci` | scientific notation m × 10ⁿ with 1 ≤ m < 10 |
| `nums` | several integers in any order |

**Drawings.** The shared square-pyramid, pyramid, cone and coordinate-plane drawings; an original four-section spinner; lines labelled (a) and (b) for the equation tasks. Graphing tasks 750 and 751 are teacher-reviewed with a rubric.

## Source corrections (U-04)

- **node:704** — the source key for two draws with replacement is (g·h·(t − 1)/t²)/t² instead of g·h/t²; the port uses the correct probability, and the source's other choices become named mistakes.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each. Factoring oracles evaluate the prompt's polynomial and the key's expanded factors at sample values; complex-fraction oracles evaluate the original fraction from the parameters; system oracles substitute the key into both equations read back from the prompt.
- The ready-but-unassigned recipes (requests R3 and R4) were built 200 times each and their keys checked.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
