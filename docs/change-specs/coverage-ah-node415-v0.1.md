# Coverage Algebra 1/2: node:415 replacement, v0.1

Recorded 2026-10-16 (Asia/Shanghai). Follows the pending request in `coverage-ah-pending-requests-v0.1.md` §1, approved by the owner on 2026-10-16. Branch `claude/coverage-algebra-half`; handbook `6e1f5a4`.

## Change

- **Shared (owner's own commit `ec02b99`):** `tests/linear-bank-audit.py` allows a row of `linear-equations-v0.2.json` to leave the linear family when, and only when, a course port task serves that record. Every row still in the linear family is audited as before (40 templates, 80,000 variants).
- **This course:** node:415 is served by the port task `ah-two-step-int` (x from 2 to 9, as in the source), replacing the earlier adaptation whose solutions reach 30. Task row, oracle and decision restored.

## Result

Every one of the 624 Algebra 1/2 records is decided: 622 covered and 2 consolidated; none open, provisional or retired.

## Verification

- **`node tests/port-courses.cjs algebra-half -- 1000`:** every Algebra 1/2 task, 1,000 instances each.
- **`node scripts/verify-course.cjs algebra-half`:** the ownership check reports the owner-approved shared file `tests/linear-bank-audit.py`; every test that passed at the baseline must still pass. See the verified checkpoint commit.
