# Coverage programme — Algebra 1 requests R1–R5: integration, v0.1

Recorded 2026-10-16 (Asia/Shanghai).

- **Branch:** `claude/a1-shared-requests`, from `claude/coverage-algebra-1` at `8bee0b5` (Batch A1-11 verified checkpoint). This branch changes shared files, so it is an integration change, not a course batch.
- **Decision:** the owner approved all five requests in `coverage-a1-pending-requests-v0.1.md` on 2026-10-16, after reviewing old-versus-new example problems for each.
- **Handbook** `6e1f5a4`: UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14.

## What changes

42 Algebra 1 records move from earlier adaptations to the port tasks that keep the source's ranges. Afterwards every Algebra 1 record is covered or consolidated.

| Request | Records | Shared change |
|---|---|---|
| R1 | node:4, 242, 250 | `tests/course-banks.cjs` takes its fraction example by ID (`course-87-en:item:SN870040`) instead of `E.catalog[1]`. In `curriculum/cross-course/v0.6/progressions.txt`, the selectors `b/positive-power` and `b/cube-root` now name the port tasks for nodes 242 and 250. |
| R2 | node:293, 304, 305, 316, 317, 355, 358–364, 768–771 | `tests/linear-bank-audit.py` expects every linear mapping row except these 17, now served by port tasks. |
| R3 | node:376, 570, 690, 742, 752, 820, 859, 905, 948, 955 | `tests/breadth-bank-audit.py`: totals 12,400 cases and 57 recipes. The eight-inequality-sign check is dropped, because node:859's adaptation was the only entry that exercised it (the port task has its own oracle). In the cross-course progressions, `b/scientific-normalize` now names node:742's port task. `tests/breadth-bank.cjs` runs its contract and boundary checks on the entries still served by the breadth family (its scientific-normalize boundary check is dropped: that recipe's only entry is node:742). |
| R4 | node:493–495, 551, 552, 661, 699, 735, 737 | `tests/statistics-bank-audit.py`: total 25,000. The odd-and-even data-set check is dropped (nodes 493–495 exercised it). In the cross-course progressions, `s/weighted-scores` now names node:661's port task. |
| R5 | node:929, 930, 960 | `tests/domain-bank-audit.py`: 3 entries, 9,000 cases. The two-solution check is dropped (node:960 exercised it). |

Each audit carries a comment naming the records it no longer checks and where they are audited now (`tests/port-algebra-1.cjs`), as earlier integration passes did.

**Course files:** 42 task rows with `replaces` True in `scripts/port_a1_tasks.py`; oracles for `a1-mixed-add`, `a1-frac-eq`, `a1-stats`, `a1-overall` and for the new variants of `a1-rateq`, `a1-prob`, `a1-sci`, `a1-graph3` and `a1-domain`; decisions `2026-10-16-a1-batch12-requests-R1-R5.json`.

## Verification

- `node tests/port-algebra-1.cjs 1000`: 606 tasks, 1,000 instances each.
- `node scripts/verify-course.cjs all` (integration mode: no ownership check; integrated regeneration and comparison with the baseline): see the verified checkpoint commit.
