# Coverage Batch AH-7: Algebra 1/2 Lessons 91–106, v0.1

Recorded 2026-10-15 (Asia/Shanghai). Batch protocol: `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as in `coverage-parallel-courses-v0.1.md`. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4` (U-04, U-06, U-07, U-08, U-14; S-02). Only this course's own files and its decisions file change.

## Result: every one of the 63 records in Lessons 91–106 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 59 |
| Existing adaptation confirmed after review | 4 |
| Consolidated | 0 |
| Retired | 0 |

**Confirmed adaptations:** node:580 (variables on both sides), 583, 584 (multiple-term equations), 607 (dividing a total in a ratio; the only entry for `p/ratio-total-large`).

## New tasks

59 tasks from 54 recipes.

| Lessons | Topics |
|---|---|
| 91 | Order of operations with signed numbers and brackets |
| 92 | Square, cube and fourth roots between two integers |
| 93 | Fraction bars as symbols of inclusion |
| 94, 102 | Adding like terms; deciding whether terms are like terms |
| 95–97 | Variables on both sides; multiple-term equations; solve, then evaluate |
| 98 | Naming angles; complements and supplements; classifying angles; reading a protractor |
| 99, 105 | Powers of signed numbers and negative bases |
| 100 | Ratio problems with a total |
| 101 | Products of powers with number and variable bases |
| 103 | Distributive property |
| 104 | Defining and classifying triangles; angles in triangles |
| 106 | Odd roots of negative numbers; negative and zero exponents |

**New answer forms** (checked in the course module):

| Kind | Accepted |
|---|---|
| `ah-power` | Powers of whole numbers as base^exponent (or superscripts), joined by ×, · or * |
| `ah-mono` | One product of variable powers, negative exponents allowed, with at most one fraction bar; a letter whose exponent is 0 must not appear |
| `ah-names` | Names of one angle, in any order, separated by commas or "and" |
| `ah-wordset` | Words in any order (side type and angle type of a triangle) |

Like-term and distributive answers use the shared `poly` form, which requires like terms to be collected.

**Teacher review:** node:627 (define two kinds of triangle), with a rubric.

**New drawings:** an angle with three points and a number label; a right angle split by a ray; a straight angle split by a ray; acute, right and obtuse angles; the source's protractor with nine rays; the seven source triangles with angle measures, tick marks and right-angle marks; triangles with two given angles, an isosceles triangle and a right triangle.

## Bugs and changes in the port

| Record | Source | In the port |
|---|---|---|
| node:614 | Bases from 2 to 5 and exponents from 2 to 7; the key is always "cannot be simplified" | 2 and 4 together, and equal exponents, are excluded: 2^c × 4^d and a^c × b^c can be written as one power |
| node:592, 593 | The angle's own label is a symbol-font letter | The label is a number inside the angle |
| node:593, 628 | Choose one of four lists | Free response, with the source's wrong lists as distractors |
| node:565 | (f + g)h printed with a space for the product | Printed with a times sign |

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each. AH-7 oracles use a separate expression evaluator on the printed prompt (signed expressions, fraction bars, powers, implicit products), compare collected polynomials with the printed sum at sample points, substitute solutions back into equations, find roots by checking powers, and classify the seven triangles from their angle measures.
- **Drawings** rendered in Chromium and inspected.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.
