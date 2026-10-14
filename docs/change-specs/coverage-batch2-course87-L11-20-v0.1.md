# Coverage Batch 2: 8/7 Lessons 11–20, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6. Its patterns are the same as Batch 1 (`coverage-batch1-course87-L1-10-v0.1.md`).

**Version:** Engine 0.36.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`, because tasks were only added.

## Result: every one of the 71 records in Lessons 11–20 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 48 |
| New port task replacing a less faithful adaptation | 2 |
| Existing adaptation confirmed after review | 7 |
| Consolidated choice-only twin | 14 |
| Retired | 0 |

**The two replacements:**

- **SX870068** (rename a fraction, then subtract). The earlier version showed only the subtraction and left out the renaming step.
- **SN870075** (read a protractor). The earlier version had a single angle. The original asks students to choose the right ray among nine, and the right scale.

**8/7 progress:** 18.1% complete, 30.8% including provisional records. **Lessons 1–20 are complete.**

## New tasks

There are 50 new tasks, built from 40 new recipes in `src/port87.js`:

| Lessons | Topics |
|---|---|
| 11–14 | Word problems: combining, separating, comparing, equal groups, elapsed time, parts of a whole |
| 15 | Equivalent fractions |
| 16 | Customary units |
| 17 | Protractors |
| 18 | Polygons and congruence |
| 19 | Perimeter |
| 20 | Exponents, square roots and rectangular area |

**Word problems.** These use original contexts and names. The demand, number ranges and constraints come from the scripts.

**New drawings**, all original SVG:

- a protractor with nine labelled rays and both scales;
- a protractor reference angle;
- regular and irregular polygons to choose from;
- a stepped rectilinear figure;
- a labelled quadrilateral;
- rectangle ABCD;
- two congruent triangles sharing a vertex.

**New answer forms:**

- durations ("2 hr 25 min", with words accepted);
- percents of units (exact as a mixed number, or rounded to two decimal places);
- corresponding congruent parts (angle or segment; segments in either letter order);
- a side name with an area.

Tasks that list their options (a)–(f) take the letter. The value is also accepted.

**Bugs and changes in the original, handled in the port:**

- **SN870056** could print "11 … p.m." for a late-morning return. The port uses 11 a.m. or 12 p.m.
- **SX870074** intends wider side ranges for some polygons. A variable-name slip in the script means it always uses 12–28 in steps of 4, and the port keeps the range the original actually produces.
- **Dates** in two word problems are moved into the 2000s.

**Teacher review.** Three tasks are teacher-review, each with a reference drawing or answer:

- drawing an angle with a protractor;
- listing six congruent parts;
- listing three congruent angle pairs.

**Connections.** Seven recipes join existing reviewed tracks:

- powers, level 1;
- fraction multiply, level 1;
- clock time, level 2;
- perimeter, levels 2 and 3;
- area, level 1;
- whole-number multiplication, level 3.

The rest keep their topic strand.

**Practice bundle:** 1,478 → 1,525 bank entries.

## Verification

- **`tests/port87.cjs`** now covers all 92 port tasks, with 1,000 instances each. It checks:
  - an independent oracle for every recipe;
  - the source ranges;
  - that distractors are distinct, named and rejected;
  - that drawings are present;
  - determinism.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`.
- **Practice test.** This exposed one issue: tasks whose answer looked like an unreduced fraction picked from a list. Those tasks now answer with a letter, as described above.
- **Visual review.** Every Batch 2 task was rendered and compared with the source previews.
