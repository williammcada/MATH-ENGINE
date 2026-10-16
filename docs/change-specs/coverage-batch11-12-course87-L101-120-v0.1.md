# Coverage Batches 11 and 12: 8/7 Lessons 101–120, v0.1

Recorded 2026-10-14. These two batches were done together, at the owner's request, in one checkpoint. They follow the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1–10. Each batch has its own decisions file.

**Version:** Engine 0.45.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 111 records in Lessons 101–120 is decided

| Decision | Batch 11 (Lessons 101–110) | Batch 12 (Lessons 111–120) | Total |
|---|---|---|---|
| New port task: an open record, under its own ID | 48 | 34 | 82 |
| New port task replacing a less faithful adaptation | 2 | 2 | 4 |
| Existing adaptation confirmed after review | 3 | 0 | 3 |
| Consolidated choice-only twin | 16 | 6 | 22 |
| Retired | 0 | 0 | 0 |
| **Records** | **69** | **42** | **111** |

**Replacements:**

| Record | Earlier adaptation | Original |
|---|---|---|
| SN870672 (surface area of a rectangular prism) | Millimeters and other units, with its own sizes | Meters, with edges a from 3 to 25, b < a and c < b |
| SN870681 (transforming formulas) | Choice-only | The student writes the formula solved for the variable (A = lw, A = s², A = bh, P = 2l + 2w, P = 4s) |
| SX870468 (dividing in scientific notation) | The answer split into a number and an exponent | The quotient in scientific notation, with the source's factors and exponents |
| SN870721 (volume of a pyramid, cone or sphere) | Its own sizes | A table of 44 pyramids, a table of 12 cones, and spheres of radius 2 to 9 m |

**Confirmed adaptations:**

- SN870664 (sphere surface area, radius 2 to 9 m).
- SN870703 (simple interest for a number of months, with the source's principals, rates and months).
- SX870463 (compound interest, with the source's principals, rates and years).

**Consolidated twins:**

- Batch 11: SN870623 → SN870624, SN870637 → SN870638, SN870628 → SN870629, SN870639 → SN870644, SX870450 → SN870650, SN870653 → SN870654, SN870667 → SN870671, SN870663 → SN870666, SN870658 → SN870660, SN870677 → MOOR0907, SN870680 → SN870683, SN870684 → SN870686, SN870689 → SN870690, SN870696 → SN870700, SN870825 → SN870826, SN870827 → SN870828.
- Batch 12: SN870708 → SN870710, SN870714 → SN870717, SN870720 → SN870724, SX870476 → SN870726, SX870482 → SN870765, SX870486 → SN870786.

**8/7 progress:** 92.1% complete, 94.0% including provisional records. **Lessons 1–120 are complete.** The remaining 62 records are in the investigations (scope 201–213).

## New tasks

There are 86 new tasks, from 27 new recipes:

| Lessons | Topics |
|---|---|
| 101 | Translating statements into equations; angles written as multiples of x |
| 102 | Angles formed by a transversal; simplifying and solving equations |
| 103 | Powers of negative numbers; multiplying and dividing algebraic terms |
| 104 | Perimeter and area of a rectangle with a semicircle; sectors and arcs |
| 105 | Surface area of prisms, cans and spheres; square and cube roots |
| 106 | Literal equations; transforming formulas |
| 107 | Slope of a graphed line, including horizontal and vertical lines |
| 108 | Formulas and substitution |
| 109 | Equations with squares |
| 110 | Compound and simple interest; successive discounts and coupons |
| 111 | Dividing in scientific notation |
| 112 | Applications of the Pythagorean theorem |
| 113 | Volume of pyramids, cones and spheres, and of combined solids |
| 114 | Graphing linear inequalities in the coordinate plane |
| 115 | Volume, capacity and mass in the metric system |
| 116 | Factoring: prime factors of a term, and greatest common factors |
| 117 | Slope-intercept form, and graphing lines |
| 118 | Copying angles and triangles |
| 119 | Division by zero and excluded values |
| 120 | Graphing y = a/x and parabolas |

**New answer forms:**

| Form | Accepted |
|---|---|
| Formula | Any equivalent formula for the requested variable, with or without "k =", checked by evaluating it at fixed sample values; it may use π, √, powers and implied multiplication |
| Slope-intercept equation | y = mx + b with the terms in either order |
| Roots | Every solution, separated by commas or "or", or written with ±; radicals must be in simplest form and decimals are not accepted |
| Quotient of terms | A single term, or a fraction in lowest terms with positive exponents, checked by its coefficient and exponents |
| Angle pairs | The required pairs in any order, with the angles of a pair in either order |
| Factored form | The greatest common factor times the remaining terms, in any order |
| Prime factors | The prime factors and single variables, in any order; repeated variables may use exponents |
| Number set | The excluded numbers in any order |

Part labels such as "(a)" are now ignored in multi-part numerical answers.

**New drawings:**

- a coordinate grid with lines, curves and shaded regions, including four lettered grids with captions;
- two parallel lines cut by a transversal, with the angles numbered 1 to 8;
- a rectangle with a semicircle on one end;
- a circle with a shaded sector;
- a right triangular prism, a can, a sphere, a pyramid and a cone;
- a cube with a cone-shaped hole or with a pyramid inside it, and a ball in a cylinder;
- right-angle and straight-angle splits labelled with multiples of x;
- map-style right triangles;
- four lettered triangle constructions with compass arcs.

**Teacher review.** Eleven tasks ask the student to draw, construct or explain, so they need teacher review:

- graphing inequalities: SN870739, SN870740 and SN870741;
- graphing lines and curves: SN870768, SN870783, SN870781 and SN870785;
- copying with compass and straightedge: SX870483, SN870802 and SX870484;
- explaining why 0 ÷ 0 is not a fact: SN870794.

The graphing tasks carry a blank grid, and the teacher sees a reference graph. The choose-the-graph and choose-the-construction records (SN870738, SN870761, SN870789 and SX870489) are checked automatically.

**Bugs and changes in the port:**

| Record | Source | In the port |
|---|---|---|
| SN870758 | Keys x·y·y·y for xy when the y exponent is 1 | Keys the correct factorization |
| SN870723, SN870724 | Label volumes in cm² and in.² | Use cm³ and in.³ |
| SN870722 | Picture not recovered | States that the cone's diameter and depth equal the side of the cube, and draws the cube |
| SX870489 | Fourth graph uses an unrecovered curve | Uses y = x² + a |
| SN870706 | Garbled quotation marks and apostrophes | Written correctly |
| SN870790 | Misspells "cannot" | Spelled correctly |
| SN870667 (twin) | Lists the label and total areas in the wrong order in its choices | Not ported separately; SN870671's distractors cover the choice form |
| Sectors, sector perimeter, cone and sphere volumes, interest, coupons | Round answers without saying so | The prompts say to round |

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Every non-teacher task offers exactly three choices across the test seeds.

**Connections.** Sixty-two track levels gain placements, across:

- translating equations;
- transversals;
- multi-step equations;
- signed powers;
- exponent laws;
- circle measurement and composite areas;
- surface area and volume;
- roots and square equations;
- literal formulas;
- slope and line graphs;
- interest and discounts;
- scientific notation;
- the Pythagorean theorem;
- plane regions;
- metric capacity;
- factoring;
- constructions;
- excluded values;
- parabolas and inverse variation.

Two selectors that pointed only at the replaced scientific-notation adaptation now point to the port recipe.

**Practice bundle:** 1,797 → 1,868 bank entries. The eleven teacher-review tasks are not in the practice bundle.

## Verification

- **`tests/port87.cjs`** covers all 517 port tasks, with 1,000 instances each. The Batch 11–12 oracles:
  - recompute each value from the parameters, using exact integer arithmetic for rounding;
  - check formula, root, factored and quotient answers with equivalent rewrites and wrong variants;
  - check the teacher references and reference graphs, and the lettered-choice keys.
- **Robustness.** The new answer forms were tried with malformed and very long input; none throws or accepts a wrong answer.
- **Bank audits.** The geometry and solids audits now skip the replaced entries, which `port87.cjs` audits instead. The geometry audit checks 18,000 cases (11 diagram types); the solids audit checks 3,600 cases and still requires pyramid and cone cases.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - The new drawings were rendered and inspected.
