# Coverage Batch C1-12: Course 1 Lessons 81–90 and Investigation 9, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.58.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 82 records in Lessons 81–90 and Investigation 9 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 41 |
| Existing adaptation confirmed after review | 0 |
| Consolidated twin | 41 |
| Retired | 0 |

**Course 1 progress:** 80.4% complete, 80.9% including provisional records. **Lessons 1–90 and Investigations 1–9 are complete.**

**Consolidated.** 41 records, mostly choice-only twins and repeated fixed items. The decisions file names every pair. Notes:

- **A provisional record, now decided.** C1_S09_00077 (Solve: 3n = 0.45) was previously covered provisionally. It is now consolidated into C1_S09_00028, the port for a whole-number coefficient with a decimal answer.
- **Earlier lessons.**
  - C1_S09_00033 and 00080 (the square root of a perfect square) point to Lesson 38, C1_S04_00032.
  - C1_S09_00047 (theoretical and experimental probability of a number-cube roll) points to the Lesson 90 port, C1_S09_00010.
- **Missing figures.** C1_S09_00056 and 00074 refer to circles the bank does not keep. Their answers (78.5 and 314) are the areas for radii 5 and 10. Both point to C1_S09_00025.

## New tasks

There are 41 new tasks, from 11 new recipes:

| Lesson | Topics |
|---|---|
| 81 | Miles divided by gallons; centimeters times centimeters; feet minus inches; yards plus feet |
| 82 | Sugar cubes in a drawn prism; the volume of a drawn prism and cube; units for perimeter and volume; perimeter, area and volume together |
| 83 | How many pairs are proportions; the fraction that does not form a proportion; writing a proportion from words |
| 84 | Order of operations with four operations; dividing, adding and multiplying; the difference of two decimal quotients |
| 85 | "A is to B as C is to what number"; completing proportions with a missing denominator or numerator; cross products with a scale factor that is not a whole number |
| 86 | Circle area from a diameter (to the hundredth) or a drawn radius; the approximate area of a rug |
| 87 | Solving decimal equations by dividing; a mixed-number answer |
| 88 | Ratio word problems; distance from d = rt with hours and minutes; a side from the area formula; a drawn force table (f = ma); the constant of proportionality |
| 89 | The consecutive whole numbers around a square root; a square root to two decimal places |
| 90 | The direction after two turns; the total of the turns around a closed path; the average turn on a lap; a counterclockwise turn; theoretical and experimental probability |
| Investigation 9 | A teacher-review frequency table with relative frequencies; estimating enrollment from a relative frequency |

**Answer forms.** No new forms. The force table takes four answers, separated by semicolons.

**New drawings:**

- a labelled rectangular box in oblique view;
- a closed path with the exterior turn marked at each corner;
- three-column tables (the force table and the language enrollment table).

**Teacher review.** C1_S09_00046 asks for a frequency table. It shows a reference table and review criteria. This task is not in the practice bundle.

**Connections.** 18 tasks are placed in 6 track levels:

- volume;
- ratio and proportion;
- circle area;
- one-step equations;
- substituting into a formula;
- probability.

No existing selector lost its matches.

**Practice bundle:** 2,367 → 2,407 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 1,103 port tasks, 1,000 instances each. The Course 1 oracles recompute every key with separate code:
  - **Proportions.** These are read from the fraction bars in the display and solved with cross products.
  - **Proportion counts.** These are checked pair by pair with cross products.
  - **Rounding.** Circle areas, square roots and the force table are rounded half up with exact arithmetic.
  - **Turns.** The turn arcs in the drawing are counted.

  Before the full run, every new task passed 4,800 instances.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
