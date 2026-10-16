# Coverage Batch I4-10: Intermediate 4 Lesson 60, Investigation 6, Lessons 61–65, v0.1

Recorded 2026-10-16 (Asia/Shanghai). Same protocol and rules as Batch I4-1 (`coverage-i4-batch1-L1-5-v0.1.md`), which holds the batch plan and the rule that no task on this branch replaces an earlier adaptation.

- **Branch:** `claude/coverage-intermediate-4`, on the I4-9 checkpoint.
- **Version:** unchanged (course branch).
- **Handbook** `9d9c80f` (v0.1.12): AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.

## Result: 82 of the 84 records are decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 50 |
| Consolidated twin | 32 |
| Retired | 0 |
| Left covered-provisional (request R3) | 2 |

**Provisional records.** TX4_S07_00085 (4r = 52) and 00086 (6s = 96) are covered-provisional with no open twin of the same demand, so they are left covered-provisional under request R3, with the Lesson 41 records of the same kind.

**Consolidated into earlier batches.** TX4_S07_00016 (fraction of a rectangle shaded) into the Lesson 22 port TX4_S03_00038, and TX4_S07_00017 (fraction of a circle shaded) into TX4_S03_00102.

**Records that depend on missing pictures or context.** Investigation 6's graphs are native ExamView drawings or are missing from the records (TX4_S06_00096–00099 and 00144 refer to a pets graph and a circle graph of Holly's day that are not in the export). The ports draw their own graphs with fresh data: a pictograph of trees (a circle for 10, a half circle for 5), bar graphs of favorite sports and pets, a circle graph of 100 children's favorite sports, four small circle graphs of election results, four line graphs of height against age, four bar graphs of three days' temperatures, a line graph of tides, and a circle graph of Holly's day in hours.

## New tasks

50 tasks from 9 new recipes:

| Lesson | Tasks |
|---|---|
| 60 | Rates from a total: miles per hour (in 10 hours and in other times), an average per day, an amount per hour, minutes for each mile, how many in some minutes at a rate per seconds, and a rate followed by a distance at that rate |
| Inv. 6 | Pictograph total and greatest kind; reading and adding bars; which circle graph, line graph or bar graph fits the data; how many did not choose one part of a circle graph; the hour of the greatest rise on a line graph; a fraction of a day, hours for two activities and an end time from a circle graph |
| 61 | Two-step equations (a missing addend equal to a product; a missing factor equal to a product or a sum); the fraction used, not of a kind, eaten, or remaining |
| 62 | Squares, cubes and square roots in expressions; writing a product with an exponent; comparing expressions with powers and roots; three factors; two factors times 10 or 100 |
| 63 | Which figure is (not) a polygon; naming polygons from the number of sides and from a picture; differences and totals of sides and vertices; drawing a polygon (teacher-scored); pairs of parallel sides in a regular polygon |
| 64 | Two-digit quotients (division sign and box, answers 11–19); which number divides with no remainder; true or false; why mental math wins for a division such as 8,888 ÷ 4 |
| 65 | Two-digit quotients from three-digit dividends; naming the divisor, dividend and quotient; finding one from the other two |

**Generalised fixed items.** Fixed word problems become stories of the same kind with fresh names and numbers. The regular-polygon question (even and odd numbers of sides) asks for the number of pairs of parallel sides of a regular polygon with a given number of sides.

**New answer forms (this course's checker):**

| Form | Accepted |
|---|---|
| Name and number | `fir; 80` |
| Hour period | `between 12 noon and 1 p.m.`, `12 to 1` and similar, with hours read in the graph's range |
| Power | `4²`, `4^2` |

Shared forms reused: numbers, parts, relation, text; this course's any-fraction, clock-time and number-with-unit forms.

**New drawings:** pictograph; small circle graphs, line graphs and bar graphs for choosing among four; a circle graph in hours; polygons and figures that are not polygons. Shared bar, circle and line graphs, and this course's division box and fraction bar, are reused.

## Verification

**Passing run** on implementation checkpoint `d60dadd`, through Batch I4-10 (preceded by the private pre-check):

| Check | Result |
|---|---|
| Ownership: only Intermediate 4 files changed since `c7538877` | Passed |
| Shared outputs regenerated in a temporary copy | Passed |
| Full suite, 79 tests, compared with the parallel-courses baseline | Passed: every test that passed at the baseline still passes; the 31 baseline failures are unchanged |
| `tests/port-courses.cjs intermediate-4 -- 1000` | Passed; decision files validated |
| `tests/practice.cjs` and `tests/structured-bank-audit.py` | Passed |
| Drawings rendered in Chromium and inspected | Passed |
| Studio preview, PDF and Word print checks | Not run: the Studio re-pins after the integration pass |

**Ledger after this batch (regenerated in the temporary copy):** Intermediate 4 is 65.1% complete (489 covered, 414 consolidated), 67.6% including the 35 records still covered-provisional; 450 open.
