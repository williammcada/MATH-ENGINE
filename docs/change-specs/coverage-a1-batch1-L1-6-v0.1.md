# Coverage programme — Algebra 1 Batch A1-1: Lessons 1–6, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, from the parallel-course setup verified checkpoint `c753887`.
- **Handbook** `6e1f5a4`: AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` (file ownership, batch steps) and `coverage-programme-phase0-v0.1.md` §0.6 (batch protocol).
- **Source:** recovery v0.2 ZIP (SHA-256 `f64a35dc…`), read privately with `scripts/read-source.py`. No source text or script is stored here.

## Scope

Lessons 1–6: 68 records (67 open, 1 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 65 |
| Consolidated into a twin's task | 3 (node:12 → node:10, node:76 → node:74, node:94 → node:93) |
| Left open | 0 |

The one provisional record (node:4, mixed-number addition) was reviewed and replaced by a port task that keeps the source's ranges (`replacesEarlierAdaptation`).

## What was built

All in `src/port-algebra-1.js`, 33 recipes (prefix `a1-`), and `scripts/port_a1_tasks.py`.

**Course answer kind `a1`.** Several records need answers the shared checker does not take. A course-local kind, checked by the module's own `check()`:

| Part | Used for |
|---|---|
| `num` | numbers with a required form (integer, exact decimal, simplified mixed number, lowest-terms fraction); unit words and ° ignored |
| `word` | names (acute, heptagon, quotient, natural numbers) |
| `kw` | definitions, checked by required key words, as the 8/7 definition tasks are |
| `pi` | exact answers of the form a + bπ |
| `chain` | a measurement times the stated number of unit multipliers, unsimplified, as in the source key |
| `roster` | a set written in braces with an ellipsis |

A task with several parts takes one response per part, separated by semicolons.

**Drawings.** Original SVG for segments on a line, triangles with marked angles and equal sides, quadrilaterals, rectilinear outlines with side labels, polygons, and rectangles with semicircles (added, on both ends, or cut out).

**Multiple choice.** Records that are multiple choice in the source are free response by default with reviewed distractors, each tied to a named mistake.

## Source corrections (U-04)

- **node:10/12** — the source question gives AC's length as the known part and the part's length as AC. The port states AC as the whole and names the known part.
- **node:42, node:43** — the key uses 3.14 for π without saying so. The prompt now says "Use 3.14 for π."
- **node:15** — the source may ask the same question in (a) and (b); the port asks two different ones.
- **node:60** — "none of these" is the key in some source versions. Free response asks for the product.

## Verification

- `node tests/port-courses.cjs algebra-1 -- 1000` / `node tests/port-algebra-1.cjs 1000`: 65 tasks, 1,000 instances each — independent oracles, distractors rejected and named, drawings titled, determinism.
- Drawings rasterized privately and inspected.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.

## Not in this batch

Nothing in Lessons 1–6 is left open. No shared-file change was needed.
