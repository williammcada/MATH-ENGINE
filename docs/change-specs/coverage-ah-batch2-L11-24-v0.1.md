# Coverage Batch AH-2: Algebra 1/2 Lessons 11–24, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change.

## Result: every one of the 66 records in Lessons 11–24 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 49 |
| Existing adaptation confirmed after review | 17 |
| Consolidated | 0 |
| Retired | 0 |

**Confirmed adaptations:** node:117, 118, 121 (primes and prime factorization), 126 (GCF), 148 (decimal to fraction), 180, 181 (LCM, common multiples), 185, 186, 187 (averages), 197–201 (customary unit conversions), 206, 207 (metric conversions). Each asks the same thing in the same response form, with similar ranges. Several of them (117, 118, 126, 180, 181, 186) are the only entries serving shared cross-course selectors chosen by family and recipe, so replacing them would need a shared change; confirming them needs none.

## New tasks

49 tasks from 47 recipes.

| Lessons | Topics |
|---|---|
| 11 | Equal-groups word problems, including rounding up for buses |
| 12 | Primes and composites, products of primes |
| 13 | Common factors and the GCF; "times as many" word problems |
| 14 | Equivalent fractions with a given denominator; reducing |
| 15 | Fractions to decimals, repeating decimals, rounding repeaters, decimals to fractions |
| 16 | Powers and prime factorization with exponents |
| 17 | Area by tiles; area of a composite figure |
| 18 | A fraction of a number |
| 19 | Multiplying, cancelling, raising and dividing fractions |
| 20 | Factors and multiples, LCM from prime factorizations |
| 21 | The mean of eight numbers; a missing cost from an average |
| 22 | Products and quotients of three fractions |
| 23–24 | Pounds and tons, miles and feet, metric conversions |

**New answer form:** `ah-den`, a fraction that must be written over a given denominator (node:135, 137). Repeating decimals use the existing `repeating` form (bar or parentheses). Prime factorizations use the existing `factorization` form, which accepts exponents.

## Bugs and changes in the port

| Record | Source | In the port |
|---|---|---|
| node:116 | One of its ten rows lists 1 among the primes in the key | The key is computed from the list, so 1 is never keyed as prime |
| node:188 | Rounds the mean to hundredths without saying so | The key is the exact mean (U-04) |
| node:119, 178 | Choice-only: the numbers appear only as choices | The four numbers are in the prompt; free response with the others as distractors |
| node:137 | Asks for the fraction with a given denominator | Asks for its numerator (a whole number). Found in verification: a fraction key with a fixed denominator fails the shared practice rule that a doubled fraction must be accepted or flagged as unreduced |
| node:143 | Some distractors are whole numbers with a bar | Each distractor is a repeating decimal with a named mistake |

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. Batch AH-2 oracles use trial-division primality, brute-force common factors and multiples, exact rational arithmetic, series values of repeating decimals, and a unit table for the metric conversions.
- **Drawings** (the tile rectangle and the composite figure) were rendered in Chromium and inspected.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
