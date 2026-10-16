# Coverage Batch 7: 8/7 Lessons 61–70, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1–6.

**Version:** Engine 0.41.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 46 records in Lessons 61–70 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 27 |
| New port task replacing a less faithful adaptation | 6 |
| Existing adaptation confirmed after review | 2 |
| Consolidated choice-only twin | 11 |
| Retired | 0 |

**Replacements:**

| Record | Earlier adaptation | Original |
|---|---|---|
| SN870327 (parallelogram area, height outside) | Bases 10–25, heights 8–22 | Base 16–28 cm, height 1.3 × base (rounded), slanted side 2 longer |
| SX870324 (games lost) | Unreduced ratios such as 2:4, and ratios outside the original's table | The source's table of 34 won-to-played ratios, 6–12 games per part (checked programmatically) |
| SX870325 (club ratio) | Groups A and B; allowed equal groups (1:1) | Girls and boys in unequal numbers |
| SX870330 (ratio and total, small) | Ratios not reduced (for example 6:4) | Reduced ratio, 25–49 per part |
| SN870309 (ratio and total, large) | Ratios not reduced | Reduced ratio, 110–260 per part |
| SN870379 (prism volume) | Dimensions 8–18, 4–10 and 5–14 | 8–14, 4–8 and 9–12, in one of six units |

**Confirmed adaptations:** SN870299 (classify a triangle by its labelled sides) uses the same side patterns and range. SX870332 (circumference with 22/7) uses the same radii; it varies the unit where the source always uses inches.

**Consolidated twins:** SN870328 → SN870297, SN870354 → SN870355, SN870338 → SN870339, SN870329 → SN870303, SN870330 → SN870331, SXA10209 → SN870309, SN870311 → SX870334, SN870608 → SN870610, SN870368 → SN870363, SN870385 → SN870386, SN870378 → SN870379. Each asks the same thing as its partner in multiple-choice form. SN870368's last number (4–9) lies within SN870363's range (1–9).

**8/7 progress:** 56.0% complete, 62.6% including provisional records. **Lessons 1–70 are complete.**

## New tasks

There are 33 new tasks, from 19 new recipes:

| Lessons | Topics |
|---|---|
| 61 | Area of a parallelogram; angles of a parallelogram; missing sides and angles |
| 62 | Defining and classifying triangles by sides and by angles |
| 63 | Symbols of inclusion: parentheses, brackets and braces |
| 64 | Adding signed numbers |
| 65 | Ratio problems involving totals |
| 66 | Circumference with 3.14, with 22/7, and in terms of π |
| 67 | Faces, edges and vertices; naming solids from objects and pictures |
| 68 | Subtracting signed numbers |
| 69 | Rewriting a number in scientific notation |
| 70 | Volume: prisms built of cubes, sugar cubes, and rectangular prisms |

**New answer forms:**

| Form | Accepted |
|---|---|
| Assignments | letter = value pairs in any order, separated by commas, semicolons or "and"; an optional degree sign or unit after each value |
| Two names | The two classification names in either order, with or without "triangle" |
| Multiple of π | A whole number followed by π or "pi", with an optional unit (inside the several-parts form) |

Cubic units (³ or ^3) are now also accepted after a number.

**New drawings:** parallelograms with a dashed height (two layouts), parallelogram ABCD, a rectangle or parallelogram with lettered unknowns and a marked angle, triangles with equal-side ticks and right-angle marks, circles with a radius or diameter, ten pictures of solids, prisms built of unit cubes, and labelled rectangular prisms.

**Bugs and gaps in the original, handled in the port:**

| Record | Problem | In the port |
|---|---|---|
| SX870323 | The question prints the letter g in place of its value | Shows the number |
| SX870327 | Keys a triangular prism with a triangular pyramid's counts (4 faces, 6 edges, 4 vertices) | Uses the prism's counts: 5, 9, 6 |
| SN870610 | The ten pictures were not recovered | Draws original pictures of the same ten solids |
| SN870540 | Two of the five pictures were not recovered | Draws 8 × 5 × 7 and 6 × 4 × 5 cube stacks for the same volumes (280 and 120) |
| SN870339 | Equal sides must be judged by eye | Adds tick marks on equal sides |
| SN870309, SX870330 | Some contexts (political parties; "sheeps") | Neutral or corrected wording; numbers unchanged |

**Teacher review.** SMAH0349 asks for two written definitions, so it keeps teacher review, with the source's key as the reference. It is not in the practice bundle.

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Every non-teacher task offers exactly three choices across the test seeds.

**Connections.** Seventeen track levels gain placements:

- parallelogram area (two tracks) and parallelogram angles (two tracks);
- triangle properties (levels 1 and 2);
- nested grouping;
- integer arithmetic and signed values;
- circumference;
- naming solids (two tracks) and counting faces, edges and vertices;
- scientific-notation normalization (two tracks);
- rectangular-prism volume (two tracks).

Four selectors that pointed only at replaced adaptations now point to the port recipes.

**Practice bundle:** 1,676 → 1,702 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 309 port tasks, with 1,000 instances each. The Batch 7 oracles:
  - classify each triangle from its coordinates;
  - evaluate the grouped and signed expressions from the parameters or by reading the prompt back;
  - build circumference answers with whole-number arithmetic;
  - renormalize scientific notation by shifting digit strings;
  - confirm Euler's formula for the face, edge and vertex table.
- **Bank audits.** The geometry and proportional audits now skip the replaced entries, which `port87.cjs` audits instead. They check 22,000 and 25,000 cases.
- **Review catch.** The practice test's perturbation check found that the two-name form accepted a stray digit ("scalene, right7"). That form now rejects any character other than letters and separators.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - The SX870324 and SN870303 tables were checked programmatically against the scripts.
  - The new drawings were rendered and inspected.
