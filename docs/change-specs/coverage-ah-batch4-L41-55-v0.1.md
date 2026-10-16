# Coverage Batch AH-4: Algebra 1/2 Lessons 41–55, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change.

## Result: every one of the 62 records in Lessons 41–55 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 60 |
| Existing adaptation confirmed after review | 2 |
| Consolidated | 0 |
| Retired | 0 |

**Confirmed adaptations:** node:354 (surface area of a rectangular solid) and node:365 (decimal part of a number; also the only entry for the shared selector `p/decimal-part-eighths`).

## New tasks

60 tasks from 60 recipes.

| Lessons | Topics |
|---|---|
| 41 | Overall (weighted) average |
| 42 | Symbols of inclusion; division in the order of operations |
| 43 | Multiplying and dividing mixed numbers; complex fractions |
| 44 | Roots; order of operations with exponents and roots |
| 45 | Volume of right solids from a labelled base and a height |
| 46 | Order of operations with fractions |
| 47 | Evaluating powers and roots with variables |
| 48 | Fractional equations ("what fraction of", "a fraction of what number") |
| 49 | Surface area of a right triangular prism |
| 50 | Scientific notation, large and small, and back to standard form |
| 51 | Decimal part of a number (tenths) |
| 52 | Fractions with parentheses and brackets |
| 53 | Percents, including percents over 100 |
| 54 | Proportions; P^Q and the Qth root of P |
| 55 | Fractions, decimals and percents; reference-number tables |

Scientific notation uses the existing `parts` form with a `sci` part (the first factor from 1 up to 10, exact). Fraction–decimal–percent rows use `parts` with fraction and number parts.

**New drawings:** an L-shaped base, a right trapezoid base, a rectangle base, and a right triangular prism with its legs, hypotenuse and length labelled.

## Changes in the port

| Record | Source | In the port |
|---|---|---|
| node:330–332 | The base is drawn twice, flat and in perspective | The base is drawn once with its sides labelled; the height is in the text |
| node:391 | The table is a matrix with blanks (a)–(f) | The table is given row by row in words; the six blanks are answered in order |
| node:392 | Choose one of four completed rows | Complete the row from the one entry given |
| node:359, 363 | Choice-only scientific notation | Free response, with the source's misplaced-exponent forms as distractors |

## Change to the course module

A scan of every task over the harness seeds found rare draws in earlier tasks (node:22, 38, 313, 351, 449) where the distractors collided and fewer than two remained. The module now tops up such a draw with near misses (a slip of one or ten, a numerator slip, two numbers swapped in a list), each checked as wrong and named. node:309 also gained two recipe-specific distractors.

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. AH-4 oracles evaluate each expression numerically from its parameters, find roots by checking the power, compute base areas with the shoelace formula, check scientific notation by value and range of the first factor, and recompute the fraction–decimal–percent equivalents.
- **Drawings** rendered in Chromium and inspected.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
