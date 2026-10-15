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

## Result: 94 of the 101 records in Lessons 1–5 are decided; 7 stay as they are, pending the owner

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 52 |
| New port task replacing a less faithful adaptation | 0 |
| Consolidated twin | 42 |
| Retired | 0 |
| Left covered-provisional (pending request R3) | 7 |

**No replacements on this branch.** A port that replaces an earlier adaptation removes that adaptation's catalog entry. Shared files depend on those entries:

- `tests/structured-bank-audit.py` counts the structured arithmetic and equation adaptations (it expects 94);
- the cross-course progressions select some adaptations by their recipe (for example `b/sequence-next`).

Changing either is a shared-file change, which this course branch may not make. So no task here replaces an earlier adaptation:

- **Consolidated where an open twin exists.** The provisional records 00075, 00076, 00077, 00078 and 00113 (a missing addend among three to five addends) are consolidated into the port of the open record 00042 (four addends). The sequence records 00152 and 00155 are consolidated into ports on their open twins 00153 and 00156. Their earlier adaptations stay as working entries.
- **Left as they are where no open twin exists:** 00104, 00106 and 00110 (adding rows of six or seven digits), 00111 (a two-digit missing addend), 00114, 00116 and 00119 (missing addends with two-digit addends or a two-digit unknown). Their ports are written (recipes `i4-add-row`, `i4-missing-addend` variant `two-digit`, `i4-missing-row` variants `to-100`, `big` and `nine`) but have no task yet. Request R3 in `coverage-i4-pending-requests-v0.1.md` asks the owner for the audit change that lets them replace the earlier adaptations. 00111 may instead be consolidated into the Lesson 14 two-digit missing-addend port when Batch I4-3 runs.

**Consolidated.** 42 records: choice-only twins of a ported free-response record, and repeated fixed items whose values differ but whose demand, response form and number sizes match. The decisions file names the target of every one. Every lesson keeps at least as many distinct task types as the original.

## New tasks

52 tasks from 17 recipes, in `src/port-intermediate-4.js`:

| Lesson | Tasks |
|---|---|
| 1 | Missing addends (shown addend 2–4, 5–6 and 7–9; in a column); addition stories (two small numbers; three two-digit numbers in words, with sums under and over 100; three hundreds; two three-digit numbers); a column of four digits; a column with a missing number; number sentences for groups of balls, four number cubes, two boxes of dots and a three-addend story; adding two groups of shapes; six ways to add three numbers |
| 2 | Missing addends among four and seven addends; missing addends in columns of three and six |
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

**Two integrated runs failed before this one; both fixes are in this course's files only.**

1. `3ea666c` replaced the adaptations of 00152 and 00155. Regenerating the cross-course data stopped: the progression selector `b/sequence-next` matched nothing.
2. `480529b` moved those two ports to open twins, but still replaced eight structured adaptations. Every test but one passed; `tests/structured-bank-audit.py` found 86 structured adaptations instead of 94.

This checkpoint replaces nothing (see above). Before each later batch, a private check confirms that every progression selector still matches, and the task list sets no replacement flag.

Results of the passing run are recorded in the verified checkpoint below.
