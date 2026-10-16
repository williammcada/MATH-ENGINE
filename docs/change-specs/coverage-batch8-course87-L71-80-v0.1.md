# Coverage Batch 8: 8/7 Lessons 71–80, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1–7.

**Version:** Engine 0.42.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 50 records in Lessons 71–80 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 28 |
| New port task replacing a less faithful adaptation | 9 |
| Existing adaptation confirmed after review | 3 |
| Consolidated choice-only twin | 10 |
| Retired | 0 |

**Replacements:**

| Record | Earlier adaptation | Original |
|---|---|---|
| SN870372 (whole spool from the part used) | Amounts outside 40–56 inches; unreduced fractions such as 2/6 | 1/d or 2/d of the spool (d from 3 to 7), in lowest terms |
| SN870460 (what fraction of) | Allowed the part and the whole to match | Keeps them different |
| SN870464 (what decimal part of) | Included eighths and tenths (0.375) | Quarters, fifths and 3/6 only |
| SN870486 (a percent of what number) | Its own values | A table of seven percents, each with its own range |
| SN870539 (what more do you need to know) | Multiple choice | Written answer, checked for the other person's name and "hours" |
| SN870554 (graph a translation) | Coordinates after translations of 2–3 units | A graph of a translation of 4–7 units (teacher review) |
| SN870555 (graph a reflection) | Vertices outside the original's ranges | The original's ranges (teacher review) |
| SN870556 (choose a rotation) | Small upright rectangles in the first quadrant | A tilted rectangle anywhere on the grid, four graphs to choose from |
| SX870351 (right trapezoid) | Bases 5–16, heights 6–18 | The source's construction, in inches |

**Confirmed adaptations:**

- SN870375 (whole spool from the part left) uses the same ranges.
- SN870393 (grape cost) uses the same ranges and states the rounding.
- SN870487 (what percent) uses the same values.

SN870373 and SN870577, the choice-only twins of SN870375 and SN870487, point to these adaptations; their distractors are pending the distractor programme.

**Consolidated twins:** SN870373 → SN870375, SN870388 → SN870389, SN870448 → SX870344, SN870465 → SN870466, SN870470 → SN870471, SN870474 → SN870476, SN870482 → SN870483, SN870577 → SN870487, SN870795 → SN870796, SN870523 → SN870535.

**8/7 progress:** 62.4% complete, 67.4% including provisional records. **Lessons 1–80 are complete.**

## New tasks

There are 37 new tasks, from 17 new recipes:

| Lessons | Topics |
|---|---|
| 71 | Finding the whole group when a fraction is known |
| 72 | Implied ratios; gallons at the same rate |
| 73 | Multiplying and dividing signed numbers |
| 74 | A number is a fraction or decimal of what number; what fraction or decimal part one number is of another |
| 75 | Areas of figures made of rectangles, triangles and trapezoids; trapezoid area |
| 76 | Complex fractions |
| 77 | What percent one amount of money is of another; a percent of what number |
| 78 | Graphing inequalities on a number line |
| 79 | Missing information; enough information; comparing quantities |
| 80 | Translations, reflections and rotations on the coordinate plane |

**New answer forms:**

| Form | Accepted |
|---|---|
| Needed fact | Words naming the right person and quantity; the other person's name, or any digits, make it wrong |
| Enough information | "No" or "not enough information"; or "yes" with the number of minutes, or just the number |
| Comparison | >, <, = or "insufficient information" (word forms such as "greater than" are also accepted) |

**New drawings:**

- composite figures with right-angle marks;
- three trapezoid layouts, two with a dashed height;
- number lines from −10 to 10, blank or with a graphed ray, including four lettered lines to choose from;
- coordinate planes, blank, with a figure and its dashed image, or four lettered planes to choose from.

**Teacher review.** Six tasks ask the student to draw a graph, so they need teacher review:

- three inequality graphs (SX870497, SN870500, SN870510);
- three coordinate transformations (SN870554, SN870555, SN870547).

Each gives the student a blank number line or grid, and gives the teacher a reference drawing with criteria. The two choose-the-graph records (SX870498, SN870556) are checked automatically.

**Bugs in the original, handled in the port:**

| Record | Problem | In the port |
|---|---|---|
| SN870485 | Rounds 7.5% and 12.5% to 8% and 13% | Keys the exact percent |
| SN870535 | Keys p/q = 2 as p > q, which fails when both are negative | Keys insufficient information |
| SN870537 | Can name the same person twice | Always uses two different people |
| SN870556 | Its distractor graphs are shifted mirror images | Uses named mistakes (the other rotation, 180°, a reflection), with a shifted image only when those coincide |

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Every non-teacher task offers exactly three choices across the test seeds.

**Connections.** Eighteen track levels gain placements:

- fractions of a group and the whole;
- ratios and signed products;
- composite and trapezoid areas;
- complex fractions;
- percents;
- inequality graphs;
- information sufficiency;
- coordinate transformations.

Four selectors that pointed only at replaced adaptations now point to the port recipes.

**Practice bundle:** 1,702 → 1,724 bank entries. The six teacher-review tasks are not in the practice bundle. Two of them replace the coordinate adaptations, which were in the bundle.

## Verification

- **`tests/port87.cjs`** covers all 346 port tasks, with 1,000 instances each. The Batch 8 oracles:
  - compute the composite and trapezoid areas with the shoelace formula on the figure's coordinates;
  - recompute each transformed figure from the prompt's own wording;
  - read the drawn inequality and rotation choices back from the SVG to confirm the keyed letter;
  - check the written-answer forms with right and wrong responses.
- **Bank audits.** The geometry, measurement and proportional audits now skip the replaced entries, which `port87.cjs` audits instead. They check 21,000, 22,000 and 22,000 cases.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - The new drawings were rendered and inspected.
