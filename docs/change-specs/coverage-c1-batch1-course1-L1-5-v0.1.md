# Coverage Batch C1-1: Course 1 Lessons 1–5, v0.1

Recorded 2026-10-14. This is the first Course 1 batch. It follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.47.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 99 records in Lessons 1–5 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 60 |
| New port task replacing a less faithful adaptation | 6 |
| Existing adaptation confirmed after review | 8 |
| Consolidated twin | 25 |
| Retired | 0 |

**Course 1 progress:** 7.3% complete, 9.6% including provisional records. **Lessons 1–5 are complete.**

**Replacements:**

| Record | Earlier adaptation | Port |
|---|---|---|
| C1_S01_00100 | Dropped the dollar signs | $W + $d.cc + $0.cc, with the signs |
| C1_S01_00112 | Dropped the dollar sign | Dollars and cents × one digit |
| C1_S01_00113 | Allowed a divisor of 1 | Four digits ÷ one digit, with a zero in the quotient |
| C1_S01_00114 | Used four-digit dividends | Three digits ÷ two digits |
| C1_S01_00133 | Subtracted from four-digit numbers | 1000 − n = k |
| C1_S01_00085 | Had no choices | The unknown in cw = P, with the source's kinds of distractor |

**Confirmed adaptations:** C1_S01_00093, C1_S01_00101, C1_S01_00118, C1_S01_00132, C1_S01_00134, C1_S01_00137, C1_S01_00138, C1_S01_00139.

**Consolidated.** 25 records, each pointing to a twin with the same demand:

- choice-only items, served by the port's distractors;
- fixed items that repeat an algorithmic item's demand.

The decisions file names every pair.

## New tasks

There are 66 new tasks, from 13 new recipes:

| Lesson | Topics |
|---|---|
| 1 | Adding and subtracting money and whole numbers, in rows and in columns; change from a bill; addition fact families |
| 2 | Multiplying and dividing whole numbers and money (columns, long division, fraction bar, parentheses and dot notation); multiplication fact families; three ways to write a division; coins in a roll; equal groups |
| 3 | Missing addends, subtrahends and minuends |
| 4 | Missing factors, divisors and dividends; listing factors; reading a bar graph |
| 5 | Order of operations with parentheses and fraction bars |

**Algorithmic items.** These use the item's own variable ranges and constraints. Their distractors come from the item's distractor formulas, for example:

- the extra 1 in the dimes and dollars;
- the remainder off by one;
- the product of the wrong pair.

**Fixed items.** These keep the structure of the original:

- digit counts;
- regrouping across zero;
- a zero in the quotient.

**New answer forms:**

| Form | Accepted |
|---|---|
| Fact family | The four facts in any order, separated by semicolons, commas or line breaks. ×, x, * and · are accepted; so are ÷ and /. |
| Fact sentence | One other sentence of the family. The given sentence is rejected. |
| Division forms | The long-division form typed as b)a, a ÷ b and a/b, in any order |
| Quotient and remainder | "144 R1", "144 r 1" or "144 remainder 1" |

**New drawings:**

- column arithmetic: rows aligned on the right, the operator on the last row and a rule; a sum row where an addend is missing;
- a long-division bracket;
- the example of three ways to write 15 ÷ 5;
- a five-day bar graph of quiz scores.

Fractions written with a bar use MathML.

**Picture not recovered.** C1_S01_00164 asks on which day Jana earned her highest score, but its graph is not in the bank. The port draws a five-day bar graph of scores.

**Connections.** 59 Course 1 tasks are placed in 23 track levels:

- money sums and differences;
- whole-number addition, subtraction, multiplication and division;
- fact families;
- division answer forms;
- one-step equations;
- missing addends;
- grouping and numerical expressions;
- graph reading;
- listing factors.

No existing selector lost its matches.

**Practice bundle:** 1,891 → 1,951 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 627 port tasks, 1,000 instances each. The Course 1 oracles:
  - recompute each value from the parameters;
  - or read the problem back from what the student sees (the column figure, the long-division bracket, the MathML fraction or the prompt) and solve it independently. Missing-number equations are solved by search.
- **New answer forms.** Facts are accepted in shuffled order and with typed operator variants. Incomplete or repeated families are rejected.
- **Layouts.** Every column, long-division and graph task carries its drawing. Every fraction-bar task carries MathML.
- **Choices.** Every task offers exactly three named distractors. The checker rejects each one, and none is negative.
- **Bank audit.** The ExamView arithmetic audit (`tests/structured-bank-audit.py`) now checks the 94 entries that remain; the six replaced entries are audited by `port87.cjs`.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the new ExamView reader.
  - The drawings were rendered and inspected.
