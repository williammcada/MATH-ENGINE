# Coverage programme — Algebra 1: requests pending the owner, v0.1

Recorded 2026-10-15 (Asia/Shanghai), during the overnight Algebra 1 port on `claude/coverage-algebra-1`.

The owner asked that anything needing a decision be recorded here instead of stopping the run. The records named below keep their current ledger state (open, or covered-provisional where an earlier adaptation serves them) until the owner decides.

## Shared-file changes requested

### R1 — Let port tasks replace three earlier Algebra 1 adaptations (A1-1, A1-3)

**Records:** algebra-1-en:node:4 (mixed-number addition), node:242 (whole-number powers), node:250 (cube roots). All three are covered-provisional: their earlier adaptations do not keep the source's ranges (node:242 gives powers such as 5³ and 5⁴ that the source never asks; node:250 gives only positive cube roots, some outside the source's range). Port recipes that keep the source ranges are ready in `src/port-algebra-1.js`: `a1-mixed-add`, `a1-power` and `a1-cube-root`.

**Why the course chat cannot do it.** Marking a task `replacesEarlierAdaptation` removes the earlier entry from the catalog, which two shared files depend on:

| File | Dependency | Change wanted |
|---|---|---|
| `tests/course-banks.cjs` line 26 | Takes `E.catalog[1]` as its fraction example; that entry is node:4's earlier adaptation. | Select the fraction example by family or ID (for example the first catalog entry whose generated answer has a `numerator`), not by position. |
| `scripts/build-cross-course.py` | Its selector `b/positive-power` names node:242's earlier adaptation (family structured-breadth, recipe positive-power). | Point the selector at the port task (`@`/`=` with recipe `a1-power` for algebra-1-en:node:242), or drop it if the topic is otherwise covered. node:250's adaptation (cube-root) may be selected the same way; check when making the change. |

**Then, in `scripts/port_a1_tasks.py`** (course file), add the three entries with `replaces` True:
`(N + '4', 'a1-mixed-add', None, 'Add two mixed numbers with unlike denominators', 'fractions', True)`,
`(N + '242', 'a1-power', None, 'Evaluate a whole-number power', 'exponent-laws', True)`,
`(N + '250', 'a1-cube-root', None, 'Cube root of a perfect cube', 'powers-roots', True)`,
restore the `a1-mixed-add` oracle in `tests/port-algebra-1.cjs`, and add decisions covering the three records.

**Meanwhile:** the three records stay covered-provisional; nothing else depends on them.

### R2 — Let port tasks replace thirteen earlier linear adaptations (A1-4)

**Records (all covered-provisional):** algebra-1-en:node:293, 304, 305, 316, 317, 355, 358, 359, 360, 361, 362, 363 and 364.

**Why they need replacing.** Their earlier `structured-linear` adaptations do not keep the source's ranges or forms:

| Records | Difference from the source |
|---|---|
| 293, 304, 305 | The source uses mixed numbers with denominators up to 12; the adaptations use thirds and sixths only. |
| 316, 317, 359 | The source's answers are short decimals (such as 0.5 or 0.05); the adaptations give answers such as 0.753125. |
| 355, 358, 360–364 | The source keeps the solution a small integer (for example −2 to 0 in node:360, ±1 to ±3 in nodes 361–362); the adaptations give solutions such as 21, −26 or 20. |

Port recipes that keep the source ranges are ready in `src/port-algebra-1.js`: `a1-add-eq` (variant `frac`), `a1-frac-eq` (`mixed`, `plusx`), `a1-dec-eq` (`one`, `two`) and `a1-paren-eq` (`355`, `358`–`364`).

**Why the course chat cannot do it.** `tests/linear-bank-audit.py` reads every row of `curriculum/source-mappings/linear-equations-v0.2.json` and requires each one to be served by a `structured-linear` catalog entry (`seen==set(rows)`). Replacing an adaptation removes its entry, so the audit fails. Checked in an integrated copy on 2026-10-15: the cross-course regeneration and the other shared tests pass with the replacements; only this audit fails.

**Change wanted (either):**
- in `tests/linear-bank-audit.py`, compare against the rows whose source ID is still served by a `structured-linear` entry, for example `served={c.sourceId for c in E.catalog if c.family=='structured-linear'}` and `seen==set(rows)&served`; or
- drop the thirteen rows from `curriculum/source-mappings/linear-equations-v0.2.json` and the linear bank map in the integration pass.

**Then, in `scripts/port_a1_tasks.py`:** add the thirteen entries with `replaces` True (the comment under `# Batch A1-4` lists the recipe and variant for each), restore the `a1-frac-eq` oracle in `tests/port-algebra-1.cjs`, and add decisions covering the records.

**Reviewed and kept:** the earlier adaptations for nodes 297, 298, 302, 303, 309, 354, 356 and 357 match the source and are recorded as covered in the A1-4 decisions.

**Meanwhile:** the thirteen records stay covered-provisional.

### R3 — Let port tasks replace breadth-bank adaptations (A1-5, A1-7)

**Records (covered-provisional):** algebra-1-en:node:376, node:570.

| Record | Earlier adaptation | The source |
|---|---|---|
| node:376 | `prime-factorization`: factors 12, 40, 504 and similar | factors 2ᵃ·3ᵇ·5ᶜ times 7 or 11 (for example 1,320 or 12,600) |
| node:570 | `system-substitution`: x up to about 50 | keeps the solution's x between −20 and 20 |

Port recipes that keep the source's ranges are ready for node:376 (`a1-primes`), node:570 (`a1-system` variant `570`).

**Why the course chat cannot do it.** Replacing an adaptation removes its catalog entry, and `tests/breadth-bank-audit.py` line 121 asserts fixed totals (`count==14800 and len(recipes)==65`). Checked in an integrated copy on 2026-10-15: with node:376 replaced, that assertion fails; `breadth-bank.cjs`, `grade5.test.cjs` and the other shared tests pass. The later records in this table have the same dependency (each adaptation is a breadth entry).

**Change wanted:** in `tests/breadth-bank-audit.py`, derive the expected count and recipe total from the entries still served by the breadth family, instead of fixed numbers.

**Then, in `scripts/port_a1_tasks.py`:** add each record with `replaces` True (`(N + '376', 'a1-primes', None, 'Write a number as a product of primes', 'number-theory', True)`; `(N + '570', 'a1-system', '570', 'Solve a system by substitution', 'systems', True)`), oracles for any recipe without one in `tests/port-algebra-1.cjs`, and decisions covering the records.

**Meanwhile:** the records stay covered-provisional.

### R4 — Let port tasks replace statistics-bank adaptations (A1-6, A1-7)

**Records (covered-provisional):** algebra-1-en:node:493, node:494, node:495, node:551, node:552, node:661.

| Record | Earlier adaptation | The source |
|---|---|---|
| node:493 | range, mean, median and mode with fractional means | builds each data set so the mean is whole and there is one mode |
| node:494 | the same, bag weights | the same, bag weights 4 to 15 |
| node:495 | the same, golf scores | the same, golf scores 75 to 90 |
| node:551 | groups of any size (2 to 7 values) | two groups totalling 15 values, from its table of averages |
| node:552 | groups of any size | three groups totalling 20 values, from its table of averages |
| node:661 | weights 1 to 5 for every test | weights 1 to 4 for the first two tests and 2 to 5 for the last two |

Port recipes that keep the source's ranges are ready for node:493 (`a1-stats` variant `493`), node:494 (`a1-stats` variant `494`), node:495 (`a1-stats` variant `495`), node:551 (`a1-overall` variant `551`), node:552 (`a1-overall` variant `552`), node:661 (`a1-wavg` variant `661`).

**Why the course chat cannot do it.** Replacing an adaptation removes its catalog entry, and `tests/statistics-bank-audit.py` line 72 asserts a fixed number of checked instances (`count==34000`). Checked in an integrated copy on 2026-10-15: with nodes 493, 494, 495, 551 and 552 replaced, that assertion fails (the audit already skips replaced entries, so its count drops); the other shared tests pass. The later records in this table have the same dependency.

**Change wanted:** in `tests/statistics-bank-audit.py`, derive the expected count from the entries it checks (for example 1,000 instances per entry still served by the statistics family) instead of `34000`.

**Then, in `scripts/port_a1_tasks.py`:** add each record with `replaces` True (`(N + '493', 'a1-stats', '493', 'Range, mean, median and mode', 'statistics', True)`; `(N + '494', 'a1-stats', '494', 'Range, mean, median and mode of weights', 'statistics', True)`; `(N + '495', 'a1-stats', '495', 'Range, mean, median and mode of golf scores', 'statistics', True)`; `(N + '551', 'a1-overall', '551', 'Overall average of two groups', 'statistics', True)`; `(N + '552', 'a1-overall', '552', 'Overall average of three groups', 'statistics', True)`; `(N + '661', 'a1-wavg', '661', 'Weighted average of four tests', 'statistics', True)`), oracles for any recipe without one in `tests/port-algebra-1.cjs`, and decisions covering the records.

**Meanwhile:** the records stay covered-provisional.

## Records proposed for retirement

None so far.
