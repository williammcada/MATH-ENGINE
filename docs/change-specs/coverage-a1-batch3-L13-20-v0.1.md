# Coverage programme — Algebra 1 Batch A1-3: Lessons 13–20, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Course branch:** `claude/coverage-algebra-1`, after Batch A1-2.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.
- **Governing specs:** `coverage-parallel-courses-v0.1.md` and `coverage-programme-phase0-v0.1.md` §0.6.
- **Source:** recovery v0.2 ZIP, read privately. No source text or script is stored here.

## Scope

Lessons 13–20: 58 records (56 open, 2 covered-provisional).

| Result | Records |
|---|---|
| Covered by a new port task | 53 |
| Consolidated into a twin's task | 3 (node:198 → 197, 230 → 229, 239 → 236) |
| Left as they were | 2 (node:242 and node:250, covered-provisional; request R1) |

**node:242 and node:250.** Their earlier adaptations do not keep the source's ranges, and port recipes that do (`a1-power`, `a1-cube-root`) are ready. Replacing them would remove adaptations that the shared cross-course builder selects by recipe (`b/positive-power`), so they stay provisional and request R1 in `coverage-a1-pending-requests-v0.1.md` covers them. node:253 (the choice record with the same cube-root range as node:250) is ported as its own task.

## What was built

20 recipes in `src/port-algebra-1.js`:

- **Lessons 13–14** — nested grouping symbols, order of operations with a quotient inside parentheses, signs of long products, and evaluation of expressions in two or three variables (letters chosen consecutively, as the source does).
- **Lesson 15 and Lesson 20** — surface area and volume: cylinders, rectangular boxes, isosceles and right triangular prisms, and right solids whose bases are composite (two half circles, an L shape, a trapezoid with a half circle, a triangle with a half circle, a rectangle with a half circle). Answers in terms of π use the `pi` part; one record also needs a simplified radical (`exact` part).
- **Lessons 16–18** — evaluation with brackets, the distributive property, identifying and counting like terms, and adding like terms (xy and yx are like terms).
- **Lesson 19** — powers, powers of negative numbers, strings of powers with absolute value, cube and fourth roots, and evaluation of expressions with powers.

**New answer parts in the course module** (no shared change):

| Part | Used for |
|---|---|
| `poly` | a polynomial with like terms combined, any term order or factor order (`3xy` = `3yx`) |
| `set` | letters of the chosen items, such as (a), (c) and (d), in any order |
| `compact` | a short statement compared without spaces, such as the distributive property |
| `exact` | an exact value with the needed symbols (π, √), radicals simplified |

**Drawings.** Cylinders and right triangular prisms use the shared drawings (`cylinderFigure`, `rightTriPrism`). Boxes, isosceles prisms and every composite base are original course drawings. For a right solid with a composite base, the port draws the labelled base and gives the height in the prompt; the source also shows the solid in perspective.

## Source corrections (U-04)

- **node:211, node:265** — the keys give the answer in terms of π. The prompts now ask for the exact answer in terms of π.
- **node:272** — the source's choices differ only in the unit. Free response asks for the number; the distractors are reviewed mistakes.

## Verification

- `node tests/port-algebra-1.cjs 1000`: all course tasks, 1,000 instances each.
- Drawings rasterized privately and inspected.
- `node scripts/verify-course.cjs algebra-1`: see the verified checkpoint commit.
