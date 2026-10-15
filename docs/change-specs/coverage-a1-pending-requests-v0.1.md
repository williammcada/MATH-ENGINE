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

## Records proposed for retirement

None so far.
