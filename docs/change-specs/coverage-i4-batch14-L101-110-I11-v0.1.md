# Coverage Batch I4-14: Intermediate 4 Lessons 101–110, Investigation 11, v0.1

Recorded 2026-10-16 (Asia/Shanghai). Same protocol and rules as Batch I4-1 (`coverage-i4-batch1-L1-5-v0.1.md`), which holds the batch plan and the rule that no task on this branch replaces an earlier adaptation.

- **Branch:** `claude/coverage-intermediate-4`, on the I4-13 checkpoint.
- **Version:** unchanged (course branch).
- **Handbook** `9d9c80f` (v0.1.12): AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.

## Result: every one of the 81 records is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 57 |
| Consolidated twin | 24 |
| Retired | 0 |
| Left covered-provisional | 0 |

No record in this batch was covered-provisional.

**Consolidated into earlier batches.** TX4_S11_00009 and TX4_S11_00044 (the improper fraction and mixed number pictured) into the Lesson 89 port TX4_S09_00003; TX4_S11_00045 (write the fraction shown, then the mixed number) into the Lesson 89 port TX4_S09_00049.

**Pictures and tables in the source.** The schedules, data tables, number line, rulers, shaded shapes and cube solids are native ExamView drawings or bitmaps, read privately. The shipping-cost table and the solid in TX4_S11_00038 are not in the export; the ports draw their own tables and solids. Every table is generated afresh: the opening times, animal weights, calories and shipping costs are new numbers in the source's ranges, and the waterfall table uses published heights of real waterfalls rather than the source's list.

## New tasks

57 tasks from 11 new recipes:

| Lesson | Tasks |
|---|---|
| 101 | From a schedule: how long a place is open on a day, how many more minutes one place is open than another, how much longer on one day than another; differences of weights, calories and heights in tables; a shipping cost and the difference of two; which exhibit is judged at a given time |
| 102 | The decimal at an arrow on a number line in tenths; centimeters to meters; a segment in millimeters and centimeters; rounding to the nearest whole number and tenth |
| 103 | Which fraction does not equal 1/2, which number does not equal 1; a fraction equal to a unit fraction with a given denominator; the fraction name for 1 shown by a picture; which fraction equals 1; fractions equal to 1 and to 1/2 with a given denominator; rounding a mixed number; writing a fraction equal to 1/2 or to 1; comparing a fraction with 1/2 |
| 104 | Changing an improper fraction to a mixed number |
| 105 | Dividing by 10: a multiple of 10, a two-digit number as a decimal, with a remainder; dividing by a multiple of 10 with a remainder; a number that 10 divides |
| 106 | Evaluating √x, a difference, a product of two letters and x/y |
| 107 | Adding and subtracting fractions and mixed numbers with a common denominator; a sum described in words |
| 108 | The missing number in a distributive-property sentence; what a formula is for; the formula for an area or a perimeter; multiplying with the distributive property; rewriting and simplifying; a square's or triangle's formula, then using it |
| 109 | Four equivalent fractions from given multipliers; completing an equivalent fraction; naming the equivalent fractions two circles show; three equivalent fractions; drawing two equivalent fractions (teacher-scored) |
| 110 | Dividing by multiples of 10, with and without a remainder; a three-digit multiple of 10 divided by 10 |
| Inv. 11 | Volume from cubes of a given size, from centimeter cubes, of a cube and of a rectangular solid |

**Generalised fixed items.** Fixed numbers are varied within their kind (for example, 9/4 becomes any improper fraction up to five wholes; the square's side and the triangle's base and height vary). "Write a number that can be divided by 10" asks for one in a given hundred, so that the task varies. Questions that choose from a list of fractions are answered with the option's letter, and a fraction with a set denominator is asked for by its numerator (1/4 = ☐/36): a doubled fraction such as 18/72 is then neither wrongly accepted nor given the practice "simplest form" message.

**New answer forms (this course's checker):**

| Form | Accepted |
|---|---|
| Length of time | `7 h 15 min`, `7 hours 15 minutes`, `1 hour`, `75 minutes`; the total must match |
| A listed expression | One of the expressions in the question, written as listed (used from Batch I4-15) |
| Another name for a fraction | Any equal fraction except the one given |
| A multiple in a range | A whole number in the range that the divisor divides |
| Formula | Letters and numbers without spaces, case or multiplication signs; `1/2` for ½ and `^2` for ² |
| Formula and number | `P = 4s; 20 cm`, with an optional unit |
| Distributive products | `8 × 8; 8 × 6; 112` (or `8 × 8 + 8 × 6 = 112`), products in either order |
| Fractions in order | Each fraction exactly as it results from the given multiplier |
| Two equal fractions | `2/5 = 4/10`, the two shown, in either order |
| Equivalent fractions | The asked number of different fractions, each equal to the one given and none the same fraction |

Shared forms reused: numbers, decimal, parts, relation, text; this course's remainder, any-fraction, mixed-number and number-with-unit forms.

**New drawings:** tables of any number of columns (schedules, weights, calories, waterfalls, shipping costs, judging times); two shaded circles side by side. The shared number line in tenths, grid, strip, cube solids and labelled prism, and this course's millimeter ruler and division box, are reused.

## Verification

**Passing run** on implementation checkpoint `7789ef2`, through Batch I4-14 (preceded by the private pre-check):

| Check | Result |
|---|---|
| Ownership: only Intermediate 4 files changed since `c7538877` | Passed |
| Shared outputs regenerated in a temporary copy | Passed |
| Full suite, 79 tests, compared with the parallel-courses baseline | Passed: every test that passed at the baseline still passes; the 31 baseline failures are unchanged |
| `tests/port-courses.cjs intermediate-4 -- 1000` | Passed; decision files validated |
| `tests/practice.cjs` and `tests/structured-bank-audit.py` | Passed |
| Drawings rendered in Chromium and inspected | Passed |
| Studio preview, PDF and Word print checks | Not run: the Studio re-pins after the integration pass |

**Ledger after this batch (regenerated in the temporary copy):** Intermediate 4 is 93.4% complete (714 covered, 582 consolidated), 95.5% including the 29 records still covered-provisional; 63 open.
