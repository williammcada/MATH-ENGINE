# Engine 0.61.1 — indexed connection lookups v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Baseline:** verified checkpoint `3a362b5` (0.61.0-rc.1).
- **Branch:** `claude/coverage-phase0`.
- **Version:** 0.61.1-rc.1. Bank module version unchanged at `0.33.0-rc.1`; no question, mapping or curriculum data changes.

## Why

The Test and Practice Studio froze ("Page Unresponsive") on Review allocations for a class that scored well. Extension work asks the Engine for the harder and extension tasks linked to each outcome a student met. Each `suggestions()` call compared the task with every one of the 3,365 working entries, so a 23-student class made thousands of full scans.

## Change

`src/cross-course.js` builds two indexes once when the module loads: working entries by track and by question provider. For the relations `harder`, `easier`, `prerequisite`, `extension`, `same-scope` and `shared-provider`, `suggestions()` compares only entries that share a track, a reviewed bridge or a provider with the task; no other entry can have those relations. The candidates keep the original order, and the same `compare()`, sorting and provider de-duplication are applied, so results are unchanged. Lookups for `related` and `all` still scan every entry.

## Verification

- **Exact equivalence.** Every working entry, all six indexed relations, cross-bank on and off, limits 24 and 100: identical to the 0.61.0-rc.1 function. A sampled form of this check is kept as `tests/connections-indexed.cjs` (`npm run test:connections`).
- **Speed.** Planning extension work for a synthetic 23-student class with most outcomes met: 1,757 ms → about 114 ms in Node.
- **Full Engine suite.** Every test that passed at the baseline still passes.
