# Algebra 1 Batch A1-3 — verification record

- **Candidate:** commit `b27e7b9` ("Math Engine Algebra 1 Batch A1-3 implementation checkpoint") on `claude/coverage-algebra-1`.
- **Run:** `node scripts/verify-course.cjs algebra-1`, 2026-10-15 (Asia/Shanghai), Node v22.22.0, in a clean temporary copy of the candidate with the shared outputs regenerated there.
- **Ownership:** PASS — only this course's files changed since `c753887`.
- **Result:** PASS — every test that passed at the baseline (Engine 0.62.0-rc.1 parallel-course setup) still passes, and every new test passes; 31 pre-existing failures unchanged.
- **Course test:** `tests/port-algebra-1.cjs` 1,000 instances per task: 177 tasks, PASS (run before the commit).

| Tests | Count |
|---|---|
| Passed | 48 |
| Failed at the baseline and still failing (pre-existing, out of scope) | 31 |

Pre-existing failures: algebra-review-bank.cjs, comparison-chunk1.cjs, comparison-chunk2.cjs, comparison-chunk3.cjs, comparison-chunk4.cjs, cross-course-v2.cjs, curriculum87.cjs, foundations87.cjs, geometry-bank.cjs, measurement-bank.cjs, milestone5.cjs, milestone6.cjs, proportional-bank.cjs, reasoning-bank.cjs, related-concepts.cjs, relations-bank.cjs, representations-bank.cjs, solids-bank.cjs, statistics-bank.cjs, advanced-source-links.py, algebra-review-source-links.py, breadth-source-links.py, geometry-source-links.py, measurement-source-links.py, milestone5-audit.py, milestone6-audit.py, reasoning-source-links.py, relations-source-links.py, representations-source-links.py, solids-source-links.py, statistics-source-links.py.
