# Coverage Batch C1-6: Course 1 Lessons 35–40 and Investigation 4, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.52.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 93 records in Lessons 35–40 and Investigation 4 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 38 |
| Existing adaptation confirmed after review | 8 |
| Consolidated twin | 47 |
| Retired | 0 |

**Course 1 progress:** 41.7% complete, 42.6% including provisional records. **Lessons 1–40 and Investigations 1–4 are complete.**

**Confirmed adaptations.** Eight structured-arithmetic adaptations keep the shape of their source expressions with fresh decimals:

- Lesson 38: C1_S04_00072 and 00074, sums of decimals and whole numbers.
- Lesson 39: C1_S04_00076, 00077 and 00078, decimal products.
- Lesson 40: C1_S04_00080, 00081 and 00123, decimal subtraction.

**Consolidated.** 47 records, choice-only twins and repeated fixed items. The decisions file names every pair. Notable ones:

- **Decimal products.** Eight fixed products (C1_S04_00114 to 00121, 00131 and 00115) point to the confirmed product adaptation C1_S04_00077.
- **Whole number minus a decimal.** Two fixed items (C1_S04_00122 and 00126) point to C1_S04_00080.
- **Thousandths in words.** "Fourteen thousandths" and "seventeen thousandths" (Lesson 40) point to the Lesson 35 task that writes decimals from words.
- **Graphs not in the bank.** Two "formulate a question" items whose graphs are not in the bank (C1_S04_00062 and 00065) point to the table version, C1_S04_00063.

## New tasks

There are 38 new tasks, from 9 new recipes:

| Lesson | Topics |
|---|---|
| 35 | Tenths and hundredths fractions as decimals; decimals as fractions; decimal numerals from words, with zero placeholders; decimals in words |
| 36 | Subtracting fractions and mixed numbers from whole numbers, in stories (a pencil, pies) and as exercises |
| 37 | Adding three decimals; adding tenths; subtracting hundredths |
| 38 | Square units in a larger square unit; an inequality with a square root and a square; adding and subtracting decimals and whole numbers; differences of square roots; sums of squares; square roots; a square plus a root; a mixed number plus a root |
| 39 | Multiplying hundredths by hundredths; squaring a decimal; a whole number times tenths; three decimal factors |
| 40 | A height difference in meters (drawn roof); thousandths times tenths with zero placeholders; whole numbers minus tenths; decimal expressions with parentheses; the difference of two bars on a graph; a fraction from a circle graph |
| Investigation 4 | Biased or unbiased survey questions; qualitative or quantitative data; completing a table from a bar graph; plus three teacher-review tasks: questions about a tally sheet, a question answered by a table and a question inferred from a line graph |

**Answer forms.** No new forms. Decimals in words use the existing words form.

**New drawings:**

- a house with the low edge of the roof and the peak marked;
- bar graphs with values printed on the bars (sports, books);
- a sign-up bar graph with a 5-athlete scale;
- a circle graph of pets with counts;
- a tally sheet of vehicles;
- a table of club members;
- a line graph of heating costs.

**Adaptations:**

- **The sign-up graph** (C1_S04_00059). The source values include 8 and 37, which cannot be read from a 5-unit scale. The port's values are multiples of 5.
- **The tally sheet** (C1_S04_00060). Part (c) of the source compares SUVs with "other vehicles". The port compares SUVs with compact cars, a comparison the drawing always supports.
- **Missing graphs.** The bar graphs for the sports and books questions are not in the bank. The port draws them with the source value ranges and prints the values on the bars.

**Teacher review.** Three tasks ask the student to write questions or explanations: C1_S04_00060, 00063 and 00064. Each shows a reference answer and review criteria. They are not in the practice bundle.

**Connections.** 36 tasks are placed in 17 track levels:

- decimal and fraction conversions;
- decimal number words;
- adding and subtracting with mixed numbers;
- decimal sums;
- decimal subtraction with grouping;
- decimal multiplication;
- square units;
- powers and roots;
- graph reading;
- bar-graph production.

The two survey tasks have no matching track and are not placed. No existing selector lost its matches.

**Practice bundle:** 2,147 → 2,182 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 869 port tasks, 1,000 instances each. The Course 1 oracles work from what the student sees:
  - **Decimal expressions** are parsed from the prompt and evaluated exactly in ten-thousandths, including parentheses.
  - **Number words.** Decimal words are parsed back to numbers.
  - **Products.** Decimal products are rebuilt from the digits and decimal places of the factors.
  - **Squares and roots** are evaluated from the prompt.
  - **Drawings.** Graph values are checked against the labels in the drawing.

  Before the full run, every new task passed 4,800 instances.
- **Choices.** The two survey tasks have one distractor each: their only possible answers are biased or unbiased, and qualitative or quantitative.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
