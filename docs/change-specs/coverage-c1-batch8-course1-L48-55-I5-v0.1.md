# Coverage Batch C1-8: Course 1 Lessons 48–55 and Investigation 5, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.54.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 83 records in Lessons 48–55 and Investigation 5 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 37 |
| Existing adaptation confirmed after review | 4 |
| Consolidated twin | 42 |
| Retired | 0 |

**Course 1 progress:** 54.9% complete, 55.5% including provisional records. **Lessons 1–55 and Investigations 1–5 are complete.**

**Confirmed adaptations.** C1_S05_00076, 00077, 00078 and 00105 divide a decimal by a decimal. They are structured-arithmetic adaptations that keep the source's shape.

**Consolidated.** 42 records, choice-only twins and repeated fixed items. The decisions file names every pair. Two notes:

- **Missing expressions.**
  - C1_S06_00067: the bank keeps only the choices (3/8, 3/4, 1 and 3). With the lesson topic, they point to dividing one fraction by another (C1_S06_00023).
  - C1_S06_00089: the fraction is missing. Its answer (6/7) points to reducing by grouping factors (C1_S06_00020).
- **Tax rounded to the cent.** C1_S06_00064 (8% tax on $9.29) points to the Lesson 41 task C1_S05_00084, the total with tax rounded to the cent.

## New tasks

There are 37 new tasks, from 10 new recipes:

| Lesson | Topics |
|---|---|
| 48 | Subtracting mixed numbers with regrouping, with and without reducing |
| 49 | Dividing by tenths and hundredths; a whole number over a decimal; dividing by a product in parentheses; dividing by a decimal while writing zeros; a square root divided by a decimal |
| 50 | Reading and finding points on a tenths number line; how many of a fraction are in a whole number; quarters in a dollar amount; marbles in a row |
| Investigation 5 | The difference read from a pictograph; the median of odd and even data sets; mean, median and mode; plus three teacher-review tasks: draw a pictograph, make a line plot and find the mean, and make a bar graph |
| 51 | Estimating a decimal sum by rounding; ordering a fraction, a decimal and a percent; dividing money and rounding to the cent; rounding decimals to a whole number, a tenth or a hundredth; rounding money to the cent |
| 52 | Dividing decimals by 10, 100 and 10² mentally |
| 53 | Adding fractions and writing reduced mixed numbers; adding fractions where one denominator is twice the other; the decimals chart (a difference, a product and a quotient) |
| 54 | Reducing by grouping factors equal to 1; how many of one fraction are in another |
| 55 | Adding and subtracting fractions where one denominator is two or four times the other |

**Answer forms.** No new forms. The decimals chart and the mean-median-mode task take several answers, separated by semicolons.

**New drawings:**

- a tenths number line with one lettered point;
- a tenths number line with points A to D;
- a pictograph of sandwich sales with whole and half symbols.

These reuse earlier drawings:

- long-division layouts for dividing by a decimal;
- the bar-graph drawing for the teacher's reference bar graph.

**Teacher review.** Three tasks ask the student to draw a display: C1_S05_00062, 00063 and 00064. Each shows a reference answer and review criteria. The bar-graph task also shows the teacher a reference graph. These tasks are not in the practice bundle.

**Connections.** 37 tasks are placed in 17 track levels:

- adding and subtracting fractions and mixed numbers;
- decimal division;
- the number line;
- dividing fractions;
- graph reading;
- data summaries;
- bar-graph production;
- means;
- rounding;
- ordering numbers;
- powers of ten;
- decimal operations;
- reducing fractions.

No existing selector lost its matches.

**Practice bundle:** 2,225 → 2,259 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 949 port tasks, 1,000 instances each. The Course 1 oracles work from what the student sees:
  - **Decimal division expressions.** These are parsed from the prompt, including parentheses, square roots and fraction bars, and evaluated exactly as fractions.
  - **Fraction sums and differences.** These are read from the fraction bars in the display.
  - **Data.** Medians, means and modes are recomputed from the data.
  - **Rounding.** Rounding is redone half up with integers.
  - **Number lines.** The lettered points are checked against their values.

  Before the full run, every new task passed 4,800 instances.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
