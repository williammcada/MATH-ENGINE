# Coverage Batch AH-1: Algebra 1/2 Lessons 1–10, v0.1

Recorded 2026-10-15 (Asia/Shanghai). This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, applied to one course as set out in `coverage-parallel-courses-v0.1.md`.

- **Branch:** `claude/coverage-algebra-half`, from the parallel-course setup verified checkpoint `c7538877`.
- **Handbook** `6e1f5a4`: AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.
- **Files:** only this course's own files and its decisions file. No shared file, version or regenerated output is changed.

## Result: every one of the 76 records in Lessons 1–10 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 74 |
| New port task replacing a less faithful adaptation | 1 |
| Existing adaptation confirmed after review | 1 |
| Consolidated | 0 |
| Retired | 0 |

**Replacement:** node:4 (values of three digits; the earlier adaptation asks the same thing but is replaced by the source's six-digit rotation of three asked digits).

**Confirmed adaptation:** node:104 (perimeter of a rectangle with a corner cut out, every side labelled). It asks the same thing in the same response form, with ranges close to the source. It is also the only entry serving the shared cross-course selector `g/compound-perimeter`, so replacing it would need a shared change; confirming it needs none.

## New tasks

75 tasks from 69 recipes, `ah-` prefix, in `src/port-algebra-half.js`.

| Lessons | Topics |
|---|---|
| 1 | Place value, expanded notation, numbers in words and digits, column addition, money addition |
| 2 | Ordering signed numbers (with a number line), rounding whole numbers |
| 3 | Subtraction with regrouping, money subtraction, missing addends, subtrahends and minuends |
| 4 | Multiplication, money multiplication and division, division with remainders, missing factors, divisors and dividends |
| 5 | Addition and subtraction word problems |
| 6 | Decimals in words and digits, decimal addition and subtraction, rounding decimals |
| 7 | Decimal multiplication and division, missing decimal factors, estimate-then-multiply |
| 8 | Multiplying and dividing by powers of ten, ordering and graphing decimals |
| 9 | Segment lengths, angle definitions and classes, perimeter of a notched rectangle |
| 10 | Divisibility by 2, 3, 5 and 10 |

**Answer forms only this course uses** (checked in the course module):

| Kind | Accepted |
|---|---|
| `ah-seq` | An ordered list of decimals or signed numbers, separated by commas |
| `ah-lists` | One list of whole numbers per part, parts separated by semicolons; thousands commas allowed |

For every Algebra 1/2 task the module also accepts a true minus sign, thousands commas in numeric and decimal answers, and a leading ≈ on an estimate.

**Teacher review:** node:93 (graph decimals on a number line, with an answer-key line) and node:100 (define a type of angle). Each has a rubric.

## Bugs and changes in the port

| Record | Source | In the port |
|---|---|---|
| node:4, node:6 | An asked digit may appear twice in the number | Each asked digit appears once, so its value is unambiguous (U-04) |
| node:69 | Shows four decimal places, so rounding to the ten-thousandth or hundred-thousandth is degenerate | Shows six decimal places for all four cases |
| node:70 | Drops a trailing zero, so some numbers already have two places | The thousandths digit is never zero |
| node:83, node:84 | Estimation rule unstated; node:84 can estimate from a value that differs from the factor shown | The prompt states the rule (one nonzero digit per factor); the estimate comes from the factor shown, with no ties |
| node:102 | Angles from 40° to 130°, including ones too close to 90° to classify by eye | Angles from 80° to 100° are not drawn, except an exact, marked right angle |
| node:105 | Labels the notch side round(f/2) but draws it f − round(f/2) long when f is odd | The side is drawn at its labelled length; the key 2a + 2f + 2p matches the figure |
| node:59 | Asks for two long numbers in words in one item, so the key can exceed the 200-character limit of the shared practice bundle | Each instance asks for one of the two forms (three decimal places, or seven digits with hundred-thousandths); both forms occur across instances |
| node:101 | A fixed item | The same two facts, asked in either order |
| node:108, node:109 | Choice-only: the numbers appear only as choices | The four numbers are listed in the prompt; free response with the other three as distractors |

**Distractors.** Every task that is multiple choice in the source keeps three distractors, each tied to a named mistake and marked wrong by the checker. Free-response records also carry reviewed distractors.

## A lesson for later batches

The shared cross-course data selects some tasks by family and recipe (for example `g/compound-perimeter`). Where the only entry with that recipe is an Algebra 1/2 adaptation, replacing the adaptation empties the selector and the shared rebuild fails. Selectors by record ID (`=` and `@`) still resolve, because a port task keeps its record ID. Later batches therefore review those adaptations and confirm them where they are faithful; where one is not, the change goes to the pending-requests file.

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** 75 tasks, 1,000 instances each. The oracles recompute each key from the parameters with separate code: an independent number-to-words reader, rational arithmetic, rounding by floor(x + ½), one-nonzero-digit estimation, polygon perimeters summed from the vertices, and divisibility filters.
- **Drawings** (notched figures, angles, segments, the decimal number line and its key) were rendered in Chromium and inspected.
- **`node scripts/verify-course.cjs algebra-half`:** see the verified checkpoint commit.

## Not in this batch

Lessons 11 onward. Studio re-pin and the integration pass belong to the owner.
