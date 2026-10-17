# Coverage Batch I4-2: Intermediate 4 Lessons 6–10 and Investigation 1, v0.1

Recorded 2026-10-16 (Asia/Shanghai). Same protocol and rules as Batch I4-1 (`coverage-i4-batch1-L1-5-v0.1.md`), which holds the batch plan for the whole course.

- **Branch:** `claude/coverage-intermediate-4`, on the I4-1 checkpoint.
- **Version:** unchanged (course branch).
- **Handbook** `9d9c80f` (v0.1.12): AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.

## Result: every one of the 73 records is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 50 |
| New port task replacing a less faithful adaptation | 0 |
| Consolidated twin | 23 |
| Retired | 0 |

**Provisional records.** Three records in these lessons were covered-provisional: TX4_S01_00145 (adding dollars), 00165 and 00166 (numbers in words). All three are consolidated into ports on open twins (00023 and 00163), and their earlier adaptations stay. A cross-course progression (track `number-words`) selects the adaptation of 00165 by its recipe (`r/words-small`), so replacing it would break the shared cross-course build.

## New tasks

50 tasks from 15 new recipes and two new variants:

| Lesson | Tasks |
|---|---|
| 6 | Subtraction facts ("when b is subtracted from a", in the teens and twenties, and in a column); writing a fact family; finishing a fact family; whether two facts are in the same family |
| 7 | The third number from least to greatest; a number shown by hundred flats and unit squares (no tens, as in the source); three-digit numbers from words and into words; a two-number addition story in words |
| 8 | Adding dollar amounts: stories with and without regrouping and with totals over $100; a one-digit amount in a column; amounts in a row |
| 9 | Adding 1 to make the next ten in a story; two-digit dollar amounts and numbers in columns and rows, with regrouping |
| 10 | Which number is even (and which arrangement of three digits); totals that do or do not fit two equal rows; sets of odd or even numbers; making an even number from given digits, above a bound or in a range; odd or even; is it even (yes or no); an odd or even number in a range; why a remainder is less than the divisor |
| Inv. 1 | Which arrow points to a number; reading number lines marked in tens, fives, twenty-fives and ones (negative numbers); writing comparisons with symbols from words; comparing three-digit numbers, numbers in words, two differences, a sum with a product, two sums and two negative numbers; naming a set graphed on a number line; the next three terms and the 10th term of a sequence; a comparison with negative numbers in words |

**Questions with one possible wrong answer.** Yes-or-no, odd-or-even and the remainder question are free response in the source and stay free response here, with no choice list: a choice list needs at least two distractors.

**Generalised fixed items.** The source's remainder item asks only about dividing by 2; the port asks about dividing by 2 to 9, the same idea with fresh values. The "even number from digits" items accept every arrangement that meets the conditions, not only the source's key.

**New answer forms (this course's checker):**

| Form | Accepted |
|---|---|
| One fact | One addition or subtraction fact that must be the missing one (`11 − 8 = 3`) |
| Number from digits | Uses each given digit once, has the asked parity, and lies in the bounds |
| Number in a range | Any number of the asked parity strictly between the bounds |
| Remainder rule | Any wording that says "less" (or "smaller") and does not say greater, bigger, more, larger or equal |
| Comparison sentence | `a > b` or `a < b`, true and with the stated numbers in the stated order; for "compare a and b" the reversed sentence is also accepted |

Existing shared forms reused: fact family, words, relation, number set, integer sequence.

**New drawings:** hundred flats and unit squares; number lines with tick marks at any step, labelled marks, and one or four labelled arrows. Shared drawings reused: the column layout and the dot number line.

**Pictures in the source.** The number-line bitmaps were viewed privately. The base-ten models (00005, 00024) are native ExamView drawings; their shape list (two 10 by 10 grids and unit squares) was read privately.

## Verification

**First integrated run failed** (on `8b2f32b`). `tests/practice.cjs` appends "7" to every key and expects the result to be rejected. The remainder question (TX4_S01_00072) accepted "The remainder will be less than 87." because its checker looked only for the word "less". The checker now also requires any number written to be the divisor. The fix is in this course's module only.

**Pre-check before every commit from here on.** A private script copies the tree, regenerates the shared outputs and runs every test except `tests/port87.cjs` (8/7 and Course 1 only, about 14 minutes), in about 7 minutes. The real verification follows each implementation checkpoint.

**Passing run** on implementation checkpoint `40aace9`, through Batch I4-2:

| Check | Result |
|---|---|
| Ownership: only Intermediate 4 files changed since `c7538877` | Passed (10 files) |
| Shared outputs regenerated in a temporary copy | Passed |
| Full suite, 79 tests, compared with the parallel-courses baseline | Passed: every test that passed at the baseline still passes; the 31 baseline failures are unchanged |
| `tests/port-courses.cjs intermediate-4 -- 1000` | Passed: 102 tasks, 102,000 instances; decision files validated |
| `tests/practice.cjs` (own answer accepted, answer + "7" rejected, keypad keys, determinism) | Passed |
| Drawings rendered in Chromium and inspected | Passed |
| Studio preview, PDF and Word print checks | Not run: the Studio re-pins after the integration pass |

**Ledger after this batch (regenerated in the temporary copy):** Intermediate 4 is 12.0% complete (102 covered, 65 consolidated), 17.9% including the 82 records still covered-provisional; 1139 open.
