# Coverage Batch 10: 8/7 Lessons 91–100, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1–9.

**Version:** Engine 0.44.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 60 records in Lessons 91–100 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 40 |
| New port task replacing a less faithful adaptation | 4 |
| Existing adaptation confirmed after review | 3 |
| Consolidated choice-only twin | 13 |
| Retired | 0 |

**Replacements:**

| Record | Earlier adaptation | Original |
|---|---|---|
| SX870430 (cost before a percent increase) | Percents of 25 to 50 and old costs of 40, 60 or 80 cents | The source's table of 42 rows |
| SN870542 (volume of a cylinder) | Radius 2 to 8 and height 3 to 15, in millimeters or centimeters | Radius 2 to 5 cm and height 7 to 13 cm, with 3.14 for π |
| SN870560 (distribute and collect) | Two separate numbers | The simplified expression a − b(c + x) ± dx, checked as a polynomial |
| SN870430 (area and hypotenuse) | Four triples scaled by 1 to 3 | The source's table of 18 Pythagorean triples |

**Confirmed adaptations:**

- SN870522 (two cards drawn without replacement) asks the same thing as the source. The source keys "one card is a face card and the other is an ace" as 4/221; the correct value is 8/221, which the adaptation gives.
- SX760141 (a coin landing the same way several times in a row).
- SX870427 (a price reduced by a percent).

SX870437, the choice-only twin of SN870522, points to this adaptation; its distractors are pending the distractor programme.

**Consolidated twins:** SN870502 → SN870499, SN870505 → SN870509, SX870511 → SN870513, SX870437 → SN870522, SN870545 → SN870546, SN870800 → SN870564, SN870561 → SN870560, SN870568 → SN870567, SN870572 → SN870371, SN870397 → SN870398, SN760588 → SN870402, SN870440 → SN870430, SN870453 → SN870454.

**8/7 progress:** 78.1% complete, 80.9% including provisional records. **Lessons 1–100 are complete.**

## New tasks

There are 44 new tasks, from 15 new recipes:

| Lessons | Topics |
|---|---|
| 91 | Evaluating expressions with signed numbers; signed numbers without parentheses |
| 92 | Percent of change: sale prices and the cost before an increase |
| 93 | Two-step equations with decimal and mixed-number coefficients; two-step inequalities and their graphs |
| 94 | Compound probability with a six-section spinner spun twice |
| 95 | Volume of rectangular prisms, cylinders and triangular prisms |
| 96 | Distributing and collecting like terms; estimating and measuring angles |
| 97 | Similar triangles; indirect measurement with ladders, shadows and lines of sight |
| 98 | Scale drawings and maps; scale factors for lengths, areas and volumes |
| 99 | The Pythagorean theorem: missing sides, perimeter, and area with the hypotenuse |
| 100 | Square roots between whole numbers; placing irrational numbers on a number line |

**New answer forms:**

| Form | Accepted |
|---|---|
| Approximate angle | A number within 2° of the key, with or without a degree sign or "about" |
| Number pair | Two whole numbers in either order, joined by "and" or a comma |

Amounts in cents are accepted with or without the ¢ sign.

**New drawings:**

- a cylinder with its radius and height;
- a triangular prism with the triangle's base and height and the prism's length;
- a spinner with six equal labelled sections;
- angles, including reflex angles, with an arc;
- a right angle on a line split by a ray;
- pairs of similar triangles, drawn in proportion to their labelled sides;
- a right triangle with a smaller similar triangle inside it;
- two ladders against a wall;
- a person, a tree and a building on one line of sight.

**Teacher review.** Four tasks ask the student to draw on a number line, so they need teacher review: SN870516 (solve and graph an inequality), SN870548 (place a number), SN870583 (place a fraction and a square root) and SN870552 (place a square root and a fraction). The choose-the-graph records SN870519 and SN870588 are checked automatically.

**Bugs and changes in the port:**

| Record | Source | In the port |
|---|---|---|
| SN870517 | Shows the right-hand side rounded to one decimal place, which can drop its second decimal | Shows the exact value, so the key always solves the equation shown |
| SN870567 | Keys x rounded to the nearest hundredth without saying so | Asks for rounding to the nearest hundredth |
| SN870576 | Spells Bismarck as "Bismark" | Uses the correct spelling |
| SX870438, SN870571 | Pictures not recovered | The port draws them; the spinner labels vary and the key is computed from them |

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Every non-teacher task offers exactly three choices across the test seeds, except the true-or-false task SN870563, which offers the one other answer.

**Connections.** Twenty-three track levels gain placements:

- signed evaluation and signed arithmetic;
- percent change;
- two-step equations and inequalities;
- independent events;
- prism and cylinder volume;
- angle measurement;
- distributing and collecting terms;
- similar triangles and indirect measurement;
- scale and scale factors;
- the Pythagorean theorem;
- locating and approximating square roots.

One selector that pointed only at a replaced adaptation now points to the port recipe.

**Practice bundle:** 1,761 → 1,797 bank entries. The four teacher-review tasks are not in the practice bundle.

## Verification

- **`tests/port87.cjs`** covers all 431 port tasks, with 1,000 instances each. The Batch 10 oracles:
  - recompute each value from the parameters, or by reading the equation, expression or scale back from the prompt;
  - evaluate the distributive expressions independently at two values of the variable;
  - read the labelled sides back from the similar-triangle, ladder and prism drawings;
  - check the reflex-angle tolerance, and the dot positions on the lettered number lines.
- **Bank audits.** The geometry and proportional audits now skip the replaced entries, which `port87.cjs` audits instead. They check 19,000 cases (11 diagram types) and 20,000 cases.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - The new drawings were rendered and inspected.
