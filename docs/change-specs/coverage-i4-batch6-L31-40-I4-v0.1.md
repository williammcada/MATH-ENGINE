# Coverage Batch I4-6: Intermediate 4 Lessons 31–40, Investigations 4A and 4B, v0.1

Recorded 2026-10-16 (Asia/Shanghai). Same protocol and rules as Batch I4-1 (`coverage-i4-batch1-L1-5-v0.1.md`), which holds the batch plan and the rule that no task on this branch replaces an earlier adaptation.

- **Branch:** `claude/coverage-intermediate-4`, on the I4-5 checkpoint.
- **Version:** unchanged (course branch).
- **Handbook** `9d9c80f` (v0.1.12): AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.

## Result: every one of the 98 records is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 60 |
| Consolidated twin | 38 |
| Retired | 0 |
| Left covered-provisional | 0 |

No record in this batch was covered-provisional. Lesson 35 includes four records filed in source section 10 (TX4_S10_00001, 00017, 00018 and 00053). TX4_S10_00053 (draw corrected price signs) is consolidated into the Lesson 22 sign task TX4_S03_00126, and TX4_S04_00016 (0 × 0) into the Lesson 29 zero-facts task TX4_S03_00021.

## New tasks

60 tasks from 26 new recipes:

| Lesson | Tasks |
|---|---|
| 31 | Comparing word problems: two- and three-digit numbers, numbers in words (to thousands), dollar amounts in words, and a table of restaurants by state ("how many more or fewer") |
| 32 | The first digit of a product; completing a two-digit number from its digit sum; facts with 7, 8 or 9 |
| 33 | Six- and nine-digit numbers in words; the digit in a named place; comparing seven-digit numbers; which ten-thousands comparison explains why one number is greater; expanded form of a six-digit number |
| 34 | Six-digit numbers and numbers in the millions in digits; millions, hundred thousands and hundreds in digits; the greatest of amounts in millions and thousands; dollar amounts compared |
| 35 | Dollars and cents with a dollar sign, a cent sign and in words; values of mixed coins; odd or even coin values; dollars, dimes and pennies; subtracting cents from dollars; mixed numbers from shaded rectangles and circles and in words; drawing circles for a mixed number (teacher-scored); which price sign is wrong |
| 36 | Dimes as a fraction of a dollar and as money; the coin for a fraction of a dollar; the value of quarters; comparing unit fractions of a dollar |
| 37 | Which letter marks a mixed number (fifths); the mixed number or fraction at an arrow |
| 38 | Squares, facts with 5 or 6, three facts times four |
| 39 | Measuring to the nearest quarter inch; drawing two circles for two fractions (teacher-scored) |
| 40 | Comparing capacities in two units; liters to milliliters; quarts to gallons; capacity facts; true or false; comparing the ounces in two units |
| Inv. 4A | Money shown by bills and coins, and by coins; decimals in words (tenths and hundredths) |
| Inv. 4B | The cost of each item; hundredths and mixed tenths as decimals; a hundred square as a fraction and decimal, and its shaded and unshaded parts; ordering decimals |

**Generalised fixed items.** Fixed facts are varied over facts of the same kind: the capacity facts and true-or-false statements range over cups, pints, quarts and gallons; the ounce comparison over cups, pints and quarts. The table of restaurants keeps its five states with fresh counts. Fixed numbers to write or compare (816,921; 6 million; 0.01, 0.4, 0.42) become fresh numbers of the same shape.

**New answer forms (this course's checker):**

| Form | Accepted |
|---|---|
| Mixed number | `w p/q` equal to the key, with a proper fraction part (`2 2/4` for `2 1/2`); `in.` may follow on a ruler reading |
| Fraction and money | A fraction in lowest terms, then the amount (`3/10; $0.30`, `0.30` or `30¢`) |
| Ounce comparison | `16 ounces in 1 pint > 8 ounces in 1 cup`, or `16 > 8` |
| Fraction and decimal | Any equal fraction, then the decimal (`45/100; 0.45`) |
| Ordered decimals | The decimals in the order asked, separated by commas or spaces |

The number-with-unit form now also accepts thousands commas (`8,000 mL`). Shared forms reused: words, relation, parts, decimal (money with a dollar sign), numbers.

**New drawings:** bills and coins marked with their values; shaded rectangles and circles for a mixed number; a number line in fifths, fourths, sevenths or eighths with lettered points or an arrow; an inch ruler marked in eighths with a segment from 0; a hundred square with some squares shaded; three price signs. The shared table drawing is reused for the restaurants.

**Pictures in the source.** The coin, bill, ruler, number-line and shaded-shape bitmaps were viewed privately; the hundred squares are native ExamView drawings read from their shape lists.

## Verification

**Passing run** on implementation checkpoint `cae59da`, through Batch I4-6 (preceded by the private pre-check):

| Check | Result |
|---|---|
| Ownership: only Intermediate 4 files changed since `c7538877` | Passed |
| Shared outputs regenerated in a temporary copy | Passed |
| Full suite, 79 tests, compared with the parallel-courses baseline | Passed: every test that passed at the baseline still passes; the 31 baseline failures are unchanged |
| `tests/port-courses.cjs intermediate-4 -- 1000` | Passed; decision files validated |
| `tests/practice.cjs` and `tests/structured-bank-audit.py` | Passed |
| Drawings rendered in Chromium and inspected | Passed |
| Studio preview, PDF and Word print checks | Not run: the Studio re-pins after the integration pass |

**Ledger after this batch (regenerated in the temporary copy):** Intermediate 4 is 39.4% complete (315 covered, 232 consolidated), 43.7% including the 60 records still covered-provisional; 781 open.
