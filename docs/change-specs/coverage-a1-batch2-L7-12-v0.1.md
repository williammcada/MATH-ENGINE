# Coverage programme — Algebra 1 Batch A1-2: Lessons 7–12, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-1.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 7–12: 65 records, all open.

| Result | Records |
|---|---|
| Covered by a new port task | 60 |
| Consolidated into a twin's task | 5 (node:108 → 104, 144 → 143, 156 → 155, 165 → 161, 190 → 189) |
| Left open | 0 |

## What was built

24 recipes in `src/port-algebra-1.js`:

- **Lesson 7** — signs, absolute value and nested grouping symbols, the source's four forms per record.
- **Lesson 8** — areas: squares and rectangles, L-shapes, frames, triangles (including Pythagorean-triple sides), circles, trapezoids, and composite figures with semicircles, circles and triangles cut out. Exact answers in terms of π use the `pi` part; the one rounded record states which π to use.
- **Lessons 9–10** — products and quotients of signed numbers, inverse operations, sign rules, zero numerators and denominators (0, Undefined, Indeterminate), and area conversions with squared unit multipliers (a squared multiplier counts as two).
- **Lessons 11–12** — reciprocals, why 0 has none, order of operations, and grouping symbols including fractions of signed sums.

**Checker changes in the course module** (no shared change):

- `chain` accepts squared multipliers, such as `(1/12)²`, and thousands commas in the measurement.
- `pi` accepts exact decimal coefficients (4.5π). Keys write a fractional coefficient as `(9/2)π`, so they parse unambiguously.
- Every task's parameters now record the record's variant (`form`), so the oracles branch on it rather than on the prompt.

**Drawings.** Shaded regions are drawn by filling the outer shape and painting the cut-out in white, as the source does; arcs are drawn as polygons.

## Source corrections (U-04)

- **node:125, 126, 127** — the keys use 3.14 for π without saying so. The prompts now say so.
- **node:131** — the source asks for the nearest hundredth without saying which π. The key uses the calculator value, and the prompt says so.
- **node:168** — the source may ask about the same number in (a) and (b). The port asks about two different forms.

## Note on the shared test harness

The harness rejects any prompt or key containing the lower-case word "undefined", to catch JavaScript values leaking into text. The source writes "Undefined", which passes, so the keys use that form; responses are accepted in any case. No change is requested.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all 125 course tasks, 1,000 instances each.
- Drawings rasterized privately and inspected.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
