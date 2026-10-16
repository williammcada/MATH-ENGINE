# Coverage Batch 4: 8/7 Lessons 31–40, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1–3.

**Version:** Engine 0.38.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 61 records in Lessons 31–40 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 40 |
| New port task replacing a less faithful adaptation | 9 |
| Existing adaptation confirmed after review | 2 |
| Consolidated choice-only twin | 10 |
| Retired | 0 |

**The nine replacements.** Each takes over its record's ID.

| Record | Earlier adaptation |
|---|---|
| SX870166 (decimal in words) | Used numbers up to 999.999. The original uses 100.112–333.999. |
| SN870199 (fans ratio) | Used other fractions and colon notation. |
| SX870195 (reverse a ratio) | Used small, possibly unreduced ratios. The original's terms go up to 19, in lowest terms. |
| SX870196 (fraction from a ratio) | Allowed equal or non-coprime terms. |
| SX870199 (square-and-triangle area) | Scaled other triangles. The original uses its own five figures. |
| SX870309 (right-triangle area) | Used scaled triangles in other units. The original uses its own table of Pythagorean triples, in meters. |
| SX870310 (stepped figure area) | Was an L-shape with a cut-out. |
| SN870341 (walk histogram) | Was a reading-time histogram with a fixed shape. |
| SN870345 (circle graph) | Used 3,000–3,500 voters. The original uses 10,000–50,000. |

**Confirmed adaptations:**

- SX650321, die events.
- SN870590, the third angle of a triangle. This adaptation also allows the two given angles to be equal, which the original excludes. That does not change what is asked.

**Own entries for two choice-only records.** SN870314 and SN870804 look like twins, but their ranges differ from their free-response partners (20–50 instead of 22–55, and 96°–114° instead of 94°–112°). Each is a variant with its own range.

**8/7 progress:** 34.9% complete, 45.0% including provisional records. **Lessons 1–40 are complete.**

## New tasks

There are 49 new tasks, from 39 new recipes:

| Lessons | Topics |
|---|---|
| 31 | Decimals in words; a number named in words written as a decimal and a mixed number |
| 32 | Metric conversions and comparisons |
| 33 | Comparing, ordering and rounding decimals |
| 34 | Decimal number lines; a missing segment length |
| 35 | Decimal addition, subtraction, multiplication and division |
| 36 | Ratios; probability with a spinner and a dart board |
| 37 | Triangle and compound-figure areas |
| 38 | Tally sheet, histogram and circle graph |
| 39 | Proportions, including decimal entries |
| 40 | Triangle angle sums and angle pairs |

**New drawings**, all original SVG:

- a decimal number line;
- points on a line;
- a spinner and a dart board;
- a right triangle;
- a rectangle cut by a diagonal;
- a stepped figure, an L-shape, and a square with a triangle;
- a tally sheet, a histogram and a circle graph;
- seven angle figures.

The angle figures are drawn to the actual angles, using a small figure builder that places each label on its angle's bisector.

**New answer forms:**

| Form | Accepted |
|---|---|
| Decimal in words | Case and hyphens are ignored; "and" must mark the decimal point only |
| Ratio | "a to b", "a:b" or "a/b", in lowest terms |
| Fraction with a ratio | Two-part answer: a fraction, then a ratio |
| Decimal with a mixed number | Two-part answer: a decimal, then a mixed number |

**Bugs and interpretations in the original:**

- **SN870149** adds 0.05 before rounding to tenths, so it keys 20.146 as 20.2. The port rounds correctly.
- **SN870346**, a choice-only twin consolidated into SN870202, has a square-with-diagonals case that keys 1/3 for a quarter of the board. SN870202 itself excludes that case, and so does the port.
- **SX870194** draws its base value in whole steps from 1.01 (1.01, 2.01, …, 20.01). The port follows the script as the evaluator reads it.
- **SN870345** can produce half a voter, for example 25% of 16,870. The port keeps voter totals as multiples of 10, as the source does, and skips the totals that would give half a voter.

**Distractors.** Each is tied to a named mistake and marked wrong by the checker. Every task gives three, with these exceptions:

- The two comparison tasks have only two wrong symbols.
- The fans-ratio task gives only two when the key is 1 to 1.

A numeric-aware filter now drops any distractor equal in value to the key, such as 0.53 when the key is 0.530. Multi-part tasks filter their distractors through the checker itself.

**Connections.** Twenty-two track placements are added: decimals in words, unit conversion, decimal comparison and order, decimal rounding, decimal operations and division, ratio forms, probability, triangle and compound area, circle-graph and histogram reading, proportions, and angle relationships.

Two selectors pointed only at replaced entries and are repointed to the ports:

- In `ratio-forms`, level 1, the three selectors `p/ratio-reverse`, `p/ratio-part` and `p/fraction-ratio`.
- In `decimal-number-words`, level 2, `r/words-decimal`.

**Practice bundle:** 1,563 → 1,603 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 191 port tasks, with 1,000 instances each. The independent oracles:
  - recompute areas by the shoelace formula;
  - parse the worded answers back into numbers;
  - solve proportions with exact fractions;
  - re-derive the angle chains;
  - recompute spinner counts from the layout.
- **Bank audits.** `tests/geometry-bank-audit.py` and `tests/proportional-bank-audit.py` now skip the replaced entries (now 24,000 and 34,000 cases).
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its source script.
  - The tables were checked programmatically against the scripts: SX870202, SX870306 and SX870309.
  - The figure-heavy lessons (34, 36, 37, 38 and 40) were compared with private previews of the originals.
  - All new drawings were rendered and inspected.
  - The private preview evaluator gained support for one three-argument line call (SX870214). This is a review aid only.
