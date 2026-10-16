# Algebra 1 requests R1–R5 — verification record

- **Candidate:** commit `cf06e4f` ("Math Engine Algebra 1 requests R1-R5 implementation checkpoint (breadth-bank fix)") on `claude/a1-shared-requests`.
- **Run:** `node scripts/verify-course.cjs all` (integration mode: no ownership check, because this change touches shared files by the owner's decision), 2026-10-16 (Asia/Shanghai), Node v22.22.0, in a clean temporary copy with the shared outputs regenerated there.
- **Result:** PASS — every test that passed at the baseline (Engine 0.62.0-rc.1 parallel-course setup) still passes, and every new test passes; 31 pre-existing failures unchanged.
- **Earlier run:** the first candidate, `18db3ce`, failed one test (`breadth-bank.cjs`); fixed in `cf06e4f`.
- **Course test:** `tests/port-algebra-1.cjs` 1,000 instances per task: 606 tasks, PASS.
- **Ledger:** Algebra 1 679 records — 633 covered, 46 consolidated, 0 provisional, 0 open (100%).

| Tests | Count |
|---|---|
| Passed | 48 |
| Failed at the baseline and still failing (pre-existing, out of scope) | 31 |

Pre-existing failures: algebra-review-bank.cjs, comparison-chunk1.cjs, comparison-chunk2.cjs, comparison-chunk3.cjs, comparison-chunk4.cjs, cross-course-v2.cjs, curriculum87.cjs, foundations87.cjs, geometry-bank.cjs, measurement-bank.cjs, milestone5.cjs, milestone6.cjs, proportional-bank.cjs, reasoning-bank.cjs, related-concepts.cjs, relations-bank.cjs, representations-bank.cjs, solids-bank.cjs, statistics-bank.cjs, advanced-source-links.py, algebra-review-source-links.py, breadth-source-links.py, geometry-source-links.py, measurement-source-links.py, milestone5-audit.py, milestone6-audit.py, reasoning-source-links.py, relations-source-links.py, representations-source-links.py, solids-source-links.py, statistics-source-links.py.
