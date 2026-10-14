# Coverage Batch 3: 8/7 Lessons 21–30, v0.1

Recorded 2026-10-14. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6, with the same patterns as Batches 1 and 2.

**Version:** Engine 0.37.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`, because tasks were only added or replaced under the same record IDs.

## Result: every one of the 71 records in Lessons 21–30 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 45 |
| New port task replacing a less faithful adaptation | 5 |
| Existing adaptation confirmed after review | 4 |
| Consolidated choice-only twin | 17 |
| Retired | 0 |

**The five replacements.** Each takes over its record's ID, and the earlier entry is dropped.

| Record | Earlier adaptation |
|---|---|
| SN870166 (is it prime?) | Used a general prime test. The original has its own lists: primes up to 31 and composites from 9 to 30. |
| SX870082 (prime factorization) | Factored small numbers such as 14. The original factors numbers of the form 2^b · 3^c · 5^d, such as 600. |
| SAX70082 (LCM of two numbers) | Used a general pair generator. The original needs two different numbers, from 2–10 and 3–10, that share a factor. |
| SAX70083 (LCM of three numbers) | Used other triples. The original draws from its own table of 45 triples. |
| SN870128 (rounding) | Rounded four-digit numbers. The original rounds a five-digit number with no zero digits to the nearest thousand or ten thousand. |

**Confirmed adaptations:** SN870116, SX870112, SX870149 and SX870152. These are two-step money, lap-time and average word problems that already ask the same thing in the same ranges.

**8/7 progress:** 27.1% complete, 38.7% including provisional records. **Lessons 1–30 are complete.**

## New tasks

There are 50 new tasks, from 39 new recipes in `src/port87.js`:

| Lessons | Topics |
|---|---|
| 21 | Primes, composites and prime factorization, including square roots by pairing factors |
| 22 | A fraction of a group: whole from part, percent paid, shortfall, "how many were not" |
| 23–24 | Subtracting mixed numbers with regrouping; reducing by cancelling |
| 25–26 | Dividing fractions; multiplying and dividing mixed numbers |
| 27 | Multiples, LCM and equivalent division problems |
| 28 | Two-step problems and averages |
| 29 | Rounding whole and mixed numbers; estimating |
| 30 | Common denominators: comparing and adding; mixed-number expressions |

**New drawing:** a goal diagram split into equal parts, with brackets for the raised and not-raised fractions (SX870092). The original asks students to draw it, so it is the teacher reference. Both questions are auto-checked.

**New answer forms:**

| Form | Accepted |
|---|---|
| A set of numbers | Any order |
| A sequence of numbers | In order |
| Prime factorization | Any order; ×, x, * or ·; exponents written as ^ or superscripts. Every factor must be prime and the product must be the number. |
| Factorization with a root | "factorization; root" |
| Comparison with a common denominator | Any common denominator, with the correct symbol |

**Bugs and conventions in the original, handled in the port:**

- **NUY40257** has a table of yes and no cases, but its index range only reaches the first rows, so it always keys "Yes". The port uses the whole table, so about a third of the cases are "No".
- **Ties in rounding** follow the original:
  - a mixed number ending in exactly 1/2 rounds up (AMPA0048, SN870362);
  - when rounding to the nearest half, exactly 1/4 and 3/4 round up (SN870185).
- **SN870194** can produce a fraction divided by itself, for example 16/7 ÷ 16/7. The port keeps this, as the original allows it.

**Distractors.** Every task with a choice-only twin carries three distractors, and so do most of the others. Each one is tied to a named mistake and is marked wrong by the checker.

When the key is 1, some instances of the mixed-number expression and mixed-product estimate tasks have only two natural distractors. The test allows exactly this case.

**Connections.** Twenty-two recipe placements join existing reviewed tracks:

- fraction add/subtract, levels 2 and 3;
- fraction product chain, level 2;
- fraction multiply, level 2;
- fraction division, levels 1 and 2;
- fraction equivalence, level 1;
- fraction whole/unknown, levels 1 and 2;
- fraction comparison, level 3;
- average, level 1;
- prime factorization and prime decomposition, level 2;
- prime classification, level 1;
- common factors/multiples, level 2;
- multiples to common, level 1;
- rounding, level 1;
- estimating operations, level 3.

The progression selector `b/prime-test` matched only SN870166, which is now replaced, so it was removed; the port task `k/prime-yes-no` takes its place. The other port tasks keep their topic strand.

**Practice bundle:** 1,518 → 1,563 bank entries.

## Verification

- **`tests/port87.cjs`** now covers all 142 port tasks, with 1,000 instances each. It checks:
  - an independent oracle for every recipe, using separate factorization, LCM and rounding code;
  - the source ranges;
  - that distractors are distinct, named and rejected;
  - that drawings are present;
  - determinism;
  - that each new answer form rejects wrong answers: reordered sequences, composite factors, wrong roots and reversed comparison symbols.
- **`tests/breadth-bank-audit.py`** now audits 15,800 cases from 65 recipes. The five replaced entries are audited by `port87.cjs` instead.
- **Full Engine suite.** Every test that passed at the baseline still passes, plus `port87.cjs`. `npm test` passes.
- **Fidelity.** Each port was checked line by line against its source script. This caught five departures, all now fixed:
  - SN870362 statement structure;
  - SN870122 (the quotient is a whole number of dimes);
  - SX870303's rejection rule;
  - the OTG50028 prime pool, which can include 1;
  - SN870109's divisor shown as an improper fraction.

  The goal diagram was rendered and inspected.
