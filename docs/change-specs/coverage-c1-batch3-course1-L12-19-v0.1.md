# Coverage Batch C1-3: Course 1 Lessons 12–19, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.49.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 92 records in Lessons 12–19 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 55 |
| New port task replacing a less faithful adaptation | 1 |
| Existing adaptation confirmed after review | 1 |
| Consolidated twin | 35 |
| Retired | 0 |

**Course 1 progress:** 19.9% complete, 21.9% including provisional records. **Lessons 1–19 and Investigation 1 are complete.**

**Replacement:** C1_S02_00067, listing the primes between two numbers. The earlier adaptation used ranges up to 67 and showed the answer in braces. The port keeps the source range, up to 30.

**Confirmed:** C1_S02_00097, rounding a five-digit number to the nearest thousand.

**Consolidated.** 35 records, choice-only twins and repeated fixed items. The decisions file names every pair. Two of them, C1_S02_00065 and C1_S02_00123 (list the factors of a number), point to the Lesson 4 task C1_S01_00163.

## New tasks

There are 56 new tasks, from 12 new recipes:

| Lesson | Topics |
|---|---|
| 12 | The digit in a place (with and without decimals); naming the period of a digit or the place of a zero; numerals from words through billions and numbers in words; word phrases for products, sums, differences and quotients |
| 13 | Differences of heights, years and temperatures; years some decades ago |
| 14 | Moving left and right on a number line; ordering integers; a rise from a negative temperature; comparing negative numbers |
| 15 | Equal-groups multiplication stories; rolls of pennies; a sheet of stamps; the cost of each item |
| 16 | Rounding to tens, hundreds and thousands; estimating sums and products; choosing the estimating division; estimating a total from a bar graph |
| 17 | Measuring to the sixteenth inch; the mark halfway between two marks; a mixed number on a number line; ordering integers, decimals and fractions |
| 18 | Averages (three, four and six numbers, pages, prices); where an average lies; a missing value from an average; the number halfway between two numbers; reading line and bar graphs |
| 19 | Factors and non-factors; prime and composite numbers; the primes between two numbers; the factors of two numbers; counting factors; prime factorization |

**New answer forms:**

| Form | Accepted |
|---|---|
| Integer sequence | Signed whole numbers in order, typed with either kind of minus sign |
| Number lists | Several lists separated by semicolons, each list in any order |

**New drawings:**

- line graphs: parts made over time, and mortgage rates by year;
- a number line in fifths with lettered points;
- bar graphs: night skiers, sales by year and correct answers by day;
- a tile rectangle;
- the −10 to 10 number line;
- an inch ruler in sixteenths.

**Pictures not recovered:**

| Record | Source | In the port |
|---|---|---|
| C1_S02_00106 | Jana's correct-answers graph is not in the bank | Draws a five-day bar graph |
| C1_S02_00051 | The mortgage-rate graph values are not in the bank | Draws a five-year line graph |

**Connections.** 56 tasks are placed in 24 track levels:

- place value;
- number words;
- whole-number multiplication;
- verbal relationships;
- one-step stories;
- integer arithmetic and ordering;
- division;
- money;
- decimal division;
- rounding;
- ruler reading;
- fraction models;
- ordering numbers;
- averages;
- graph reading;
- prime decomposition and classification.

No existing selector lost its matches.

**Practice bundle:** 1,996 → 2,051 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 731 port tasks, 1,000 instances each. The Course 1 oracles solve each problem independently:
  - place values are read back from the shown number;
  - number words are parsed back to digits;
  - rounding is recomputed;
  - averages, primes and factor lists are recomputed;
  - prime factorizations are found by trial division.
- **Choices.** Comparison of negative numbers offers two distractors.
- **First full run.** Two tasks could show only two choices in rare instances: the digit in a place (C1_S02_00083) and estimating a sum to thousands (C1_S02_00102). Both now have fallback distractors (commit `6ada921`). Every Course 1 task then passed 4,800 instances each.
- **Breadth audit.** C1_S02_00067 is now served by its port, so the breadth audit expects 15,600 generated cases instead of 15,800.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
