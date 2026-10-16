# Coverage programme — Algebra 1 Batch A1-10: Lessons 91–105, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-9.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 91–105: 52 records (47 open, 5 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 41 |
| Covered by the reviewed earlier adaptation | 1 (node:928) |
| Consolidated into a twin's task | 6 (node:866 → 865, 881 → 880, 890 → 889, 896 → 895, 899 → 898, 921 → 918) |
| Left as they were | 4 (nodes 859, 905: request R3; nodes 929, 930: request R5) |

**The five provisional records** were each reviewed against the source script:

- **Covered as it is** — 928 (a rational equation with a shared denominator): the domain adaptation uses the source's form and ranges.
- **Not faithful** — 859 (choose the graph of an inequality) offers only real-number solutions, but the source also uses integer domains graphed as dots; 905 (slope through two points) uses coordinates of 0, which the source never does; 929 and 930 (rational equations) use coefficients outside the source's tables. Port recipes that keep the source's ranges are ready (`a1-domain` 859, `a1-slope` 905, `a1-rateq2` 929 and 930). Replacing the adaptations would fail shared audits with fixed totals: requests R3 (breadth) and R5 (domain, new).

## What was built

13 new recipes and one extended recipe in `src/port-algebra-1.js`:

- **Lesson 91** — graphing an inequality ax + b < c with a domain (`a1-domain` variant 858: the coefficient may be negative); volume and surface area of a sphere.
- **Lessons 92, 94, 99** — uniform motion: equal distances there and back, travelers apart or approaching, two trains, a boat trip, a lead gained over time, catching up. The source's tables of speeds, distances and times are kept.
- **Lesson 93** — multiplying and dividing rational expressions.
- **Lesson 95** — recognizing the shapes of |x|, x², x, x³ and √x graphs and their negatives.
- **Lesson 96** — solving x² = k by the difference of two squares.
- **Lesson 97** — the Pythagorean theorem and Pythagorean triples.
- **Lesson 98** — distance and slope between two points.
- **Lesson 100** — rounding.
- **Lesson 101** — adding and subtracting fractions with factorable denominators.
- **Lesson 102** — absolute value inequalities.
- **Lesson 103** — rational equations (choice).
- **Lesson 104** — abstract rational equations solved for a letter.
- **Lesson 105** — factoring by grouping.

**Course answer part** (no shared change):

| Part | Used for |
|---|---|
| `ratfn` | one fraction in one variable equal to the key; with `reduced`, the denominator must have the key's degree, so every common factor has been cancelled. A polynomial is accepted where the key has no denominator. |

The `pm` part now ignores a leading "x =" label.

**Drawings.** Original: the ten basic shapes (five on one figure for node:885), absolute value graphs on a number line (two rays or a segment, open or closed). Shared: sphere, right-triangle (three side by side for node:898), dot-line, inequality and coordinate-plane drawings. Graphing tasks 858 and 924 are teacher-reviewed with a rubric.

**Names.** Brand-name cars in node:909 are replaced by generic vehicles, and the travellers in node:879 have neutral names.

## Source corrections (U-04)

None in this batch.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each. Rational-expression oracles read both fractions back from the prompt and compare the product, quotient or sum with the key at sample values; motion oracles rebuild the distance equation from the parameters; the absolute-value oracle evaluates the prompt's inequality on both sides of each boundary; the literal-equation oracle substitutes the key back into the prompt's equation; Pythagorean oracles check a² + b² = c².
- The ready-but-unassigned recipes (requests R3 and R5) were built 200 times each and their keys checked.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
