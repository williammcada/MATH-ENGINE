# Coverage Batch I4-8: Intermediate 4 Lessons 46–50, Investigation 5, Lessons 51–52, v0.1

Recorded 2026-10-16 (Asia/Shanghai). Same protocol and rules as Batch I4-1 (`coverage-i4-batch1-L1-5-v0.1.md`), which holds the batch plan and the rule that no task on this branch replaces an earlier adaptation.

- **Branch:** `claude/coverage-intermediate-4`, on the I4-7 checkpoint.
- **Version:** unchanged (course branch).
- **Handbook** `9d9c80f` (v0.1.12): AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.

## Result: 104 of the 107 records are decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 42 |
| Consolidated twin | 62 |
| Retired | 0 |
| Left covered-provisional (request R3) | 3 |

**Provisional records.** Twenty records in this batch are covered-provisional. Seventeen are consolidated into ports on open records with the same demand: the Lesson 50 decimal sums (TX4_S05_00089, 00092, 00115, 00137, 00141, 00144, 00145, 00146, 00147, 00148) into 00002; the Lesson 50 decimal differences (00091, 00116, 00142) into 00018; TX4_S06_00102 (28,461 + 104,776) into TX4_S06_00022; TX4_S06_00072 (362,747 − 159,389) into TX4_S06_00018; TX4_S06_00074 and 00109 into TX4_S06_00020. Their earlier adaptations stay. Three have no open twin with the same demand and are left covered-provisional under request R3: TX4_S05_00088 and 00139 (a decimal minus a sum of decimals in parentheses) and 00143 ($27 − ($24.17 − 58¢)).

**Consolidated into earlier batches.** TX4_S05_00129 (45 ÷ (45 ÷ 9)) into the Lesson 45 port TX4_S05_00126; 00114 and 00130 (a two-digit number times 7, in a column) into the Lesson 44 port TX4_S05_00034; 00090 (the place of a digit in 6832) into the Lesson 1 port TX4_S01_00084; 00140 ($11 − 9¢) into the Lesson 35 port TX4_S10_00017.

## New tasks

42 tasks from 11 new recipes and new variants of two Batch I4-7 recipes:

| Lesson | Tasks |
|---|---|
| 46 | Dividing, written with a division box; a square root divided by a number (a new `i4-paren` variant); how many in each equal group; dividing written three ways |
| 47 | Dividing with a division sign and as a fraction; which form does not mean the same division; two multiplication and two division facts for three numbers |
| 48 | A two-digit number times a one-digit number (25–40 and 51–71) and dollars times a one-digit number (new `i4-mult21` variants) |
| 49 | Distance from hours and miles per hour; how many in all for equal groups; dozens, weeks, years or feet in smaller units |
| 50 | Adding three decimals with different numbers of places; subtracting decimals; the weight of blocks in tenths of a pound; the digit in a place of a decimal |
| Inv. 5 | Estimating the percent of a square a figure encloses (or leaves out); comparing a percent with a fraction, and a percent of a number with a product; a percent of an hour; pennies and coins as a percent of a dollar; the percent that is left; more boys or more girls; shading a percent of a rectangle (teacher-scored) |
| 51 | Adding four numbers of different sizes; a week's counts; adding four- and five-digit numbers in a column; the sum of two numbers in words; dividing and checking by multiplying |
| 52 | Subtracting six-, five- and three-digit numbers (rows and columns); subtracting money; how many groups of a given size (bouquets, laps, ants) |

**Generalised fixed items.** Fixed word problems become equal-group stories with fresh contexts and numbers (cards in stacks, books, stickers, marbles; gondolas, jars, salads, wall sections; laps, vans). "Four dozen eggs" and "days in nine weeks" range over dozens, weeks, years and feet. The source's percent figure (a native drawing) becomes a square on a 10-by-10 grid with its corners cut off, so the estimate can be checked by counting; answers within 3 percentage points are accepted.

**New answer forms (this course's checker):**

| Form | Accepted |
|---|---|
| Multiplication and division facts | The four facts in any order, separated by semicolons; `x`, `*` or `·` for ×, `/` for ÷ |
| Percent estimate | A percent within the tolerance of the key, with or without `%` or `percent` |

Shared forms reused: numbers, decimal, parts, relation; this course's number-with-unit form (for answers like `16 books` and `30 minutes`).

**New drawings:** a division box; division written as a fraction; three divisions side by side; four forms of a division labelled A to D; a grid square with an eight-sided figure. Shared column layouts are reused for addition, subtraction and money multiplication.

**Pictures in the source.** The percent figure is a native ExamView drawing read privately; the division symbols are native ExamView objects.

## Verification

**Passing run** on implementation checkpoint `7409528`, through Batch I4-8 (preceded by the private pre-check):

| Check | Result |
|---|---|
| Ownership: only Intermediate 4 files changed since `c7538877` | Passed |
| Shared outputs regenerated in a temporary copy | Passed |
| Full suite, 79 tests, compared with the parallel-courses baseline | Passed: every test that passed at the baseline still passes; the 31 baseline failures are unchanged |
| `tests/port-courses.cjs intermediate-4 -- 1000` | Passed; decision files validated |
| `tests/practice.cjs` and `tests/structured-bank-audit.py` | Passed |
| Drawings rendered in Chromium and inspected | Passed |
| Studio preview, PDF and Word print checks | Not run: the Studio re-pins after the integration pass |

**Ledger after this batch (regenerated in the temporary copy):** Intermediate 4 is 52.5% complete (399 covered, 330 consolidated), 55.0% including the 35 records still covered-provisional; 624 open.
