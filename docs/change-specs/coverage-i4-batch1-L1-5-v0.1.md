# Coverage Batch I4-1: Intermediate 4 Lessons 1–5, v0.1

Recorded 2026-10-16 (Asia/Shanghai). This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, the parallel-course rules in `coverage-parallel-courses-v0.1.md`, and reads the records as ExamView items, as `coverage-course1-phase-v0.1.md` describes.

- **Branch:** `claude/coverage-intermediate-4`, from the parallel-course setup verified checkpoint `c7538877`.
- **Version:** unchanged. Course branches never bump the version (parallel-courses spec §c).
- **Handbook** `9d9c80f` (v0.1.12): AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.
- **Files changed:** only the Intermediate 4 files of parallel-courses spec §a, and this batch's decisions file.

**How shared-file needs are handled in this run.** The owner's instruction for this overnight run replaces §e's "stop and ask": a shared-file change or a proposed retirement is written to `coverage-i4-pending-requests-v0.1.md`, the affected records stay open, and the run continues.

## Batch plan for the whole course

Book order, about 70–110 records a batch. Investigations follow Lessons 10, 20, … as in the book; 4A and 4B follow Lesson 40; the two Roman-numeral appendices come last.

| Batch | Lessons | Records |
|---|---|---|
| I4-1 | Lessons 1–5 | 101 |
| I4-2 | Lessons 6–10, Investigation 1 | 73 |
| I4-3 | Lessons 11–16 | 84 |
| I4-4 | Lessons 17–20, Investigation 2, Lessons 21–22 | 96 |
| I4-5 | Lessons 23–30, Investigation 3 | 109 |
| I4-6 | Lessons 31–40, Investigations 4A and 4B | 98 |
| I4-7 | Lessons 41–45 | 84 |
| I4-8 | Lessons 46–50, Investigation 5, Lessons 51–52 | 107 |
| I4-9 | Lessons 53–59 | 93 |
| I4-10 | Lesson 60, Investigation 6, Lessons 61–65 | 84 |
| I4-11 | Lessons 66–70, Investigation 7, Lessons 71–77 | 109 |
| I4-12 | Lessons 78–80, Investigation 8, Lessons 81–89 | 98 |
| I4-13 | Lesson 90, Investigation 9, Lessons 91–100, Investigation 10 | 106 |
| I4-14 | Lessons 101–110, Investigation 11 | 81 |
| I4-15 | Lessons 111–120, Investigation 12, Appendices A and B | 65 |

## Result: every one of the 101 records in Lessons 1–5 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 52 |
| New port task replacing a less faithful adaptation | 8 |
| Consolidated twin | 41 |
| Retired | 0 |

**Replacements.** Eight covered-provisional records are ported under their own IDs (TX4_S01_00075, 00077, 00104, 00106, 00111, 00114, 00116, 00119). They were served by generic equation and arithmetic adaptations that showed no addends in the prompt text, had no choices, and used ranges unlike the source (for example a single-digit unknown where the source has a two-digit one). The ports keep the source structure, ranges and distractors.

**Provisional records kept as they are and consolidated.** Six other provisional records are consolidated into a port task: 00076, 00078, 00110 and 00113, and the two sequence records 00152 and 00155. The sequence ports sit on the open twins 00153 and 00156 instead of replacing 00152 and 00155, because a cross-course progression (track `sequences`) selects the earlier adaptations by their recipes (`b/sequence-next`, `b/sequence-missing`). Replacing them would drop the only entries with those recipes and break the shared cross-course build, which a course branch may not change. The earlier adaptations therefore stay as working entries.

**Consolidated.** 41 records: choice-only twins of a ported free-response record, and repeated fixed items whose values differ but whose demand, response form and number sizes match. The decisions file names the target of every one. Every lesson keeps at least as many distinct task types as the original.

## New tasks

60 tasks from 18 recipes, in `src/port-intermediate-4.js`:

| Lesson | Tasks |
|---|---|
| 1 | Missing addends (shown addend 2–4, 5–6 and 7–9; in a column; two-digit); addition stories (two small numbers; three two-digit numbers in words, with sums under and over 100; three hundreds; two three-digit numbers); a column of four digits; a column with a missing number; rows of six and seven digits; number sentences for groups of balls, four number cubes, two boxes of dots and a three-addend story; adding two groups of shapes; six ways to add three numbers |
| 2 | Missing addends among three, four, five, seven and nine addends; with two-digit addends summing to 100 or to a three-digit total; missing addends in columns of three and six |
| 3 | Hundreds and tens written as products; the next three numbers of counting sequences, up and down; one and three missing numbers in a counting sequence; the next circled number; counting nickels, dimes, pairs and a pattern of X's; how many digits, the first digit and the last digit |
| 4 | The place of a digit (three- and four-digit numbers, and one digit in three numbers); the digit in a place; a number from hundreds, tens and ones; money shown by bills; comparing two amounts of bills; drawing an amount with bills (teacher-scored, as in the source) |
| 5 | People between, in front of and behind places in line; the smallest of four close numbers; the month, and the month and year, in a written date; days in a month; how many months have 30 or 31 days |

**Choices.** Every choice record keeps the source's distractor formulas, each with a named mistake (for example "Added the numbers shown instead of finding the missing addend", "Counted the places from the left instead of from the right"). Free-response tasks carry reviewed distractors too, so a host can show either form.

**New answer forms (this course's checker):**

| Form | Accepted |
|---|---|
| Number sentence | `a + b + c = s`, or `s = a + b + c`, with the pictured or stated addends in any order and the right sum |
| Six ways to add | Six number sentences separated by semicolons, every order of the three addends once, each with the sum |
| Places of a digit | The place names in order, with or without (a), (b), (c) |
| Month and year | The month (name or three-letter abbreviation) and the four-digit year, in either order of labels |

**New drawings (original SVG):** groups of balls with plus signs; four number cubes; two boxes of dots; two groups of shapes with their counts; a row of dimes; columns of $100, $10 and $1 bills, every bill visible so it can be counted; two labelled sets of bills, I and II; a grid of X's; a row of counting numbers with some circled; column additions with a letter for the missing number.

**Pictures in the source.** The bitmaps (balls, number cubes, dimes, X's and bills) were viewed privately. Four records use ExamView's native drawing objects (shapes, dot boxes, the circled row); their shape lists were read privately to get the counts. Nothing from the source was copied.

**Stacked layouts.** The committed reader `scripts/read-examview.py` drops the carriage returns that separate the rows of a stacked (column) layout, so a column such as 8, 4, 2, + 5 printed as "8 + 5". The rows were read with a private patched copy of the reader that was not committed. A fix to the shared reader is listed in the pending-requests file.

## Verification

**First integrated run failed.** The first implementation checkpoint (`3ea666c`) replaced 00152 and 00155. `scripts/verify-course.cjs` stopped while regenerating the cross-course data: the progression selector `b/sequence-next` no longer matched any entry. The fix above is in this course's own files only (the task list and the decisions file). A private check of every progression selector against the catalog now reports none broken, and it is run before every later batch.

Results of the passing run are recorded in the verified checkpoint below.
