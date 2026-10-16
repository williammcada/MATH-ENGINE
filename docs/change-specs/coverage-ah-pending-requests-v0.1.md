# Algebra 1/2 coverage: requests waiting for the owner, v0.1

Recorded during the overnight Algebra 1/2 port (owner instruction, 2026-10-15): when a record needs a shared-file change or should be retired, the course chat does not make the change. It records the request here, leaves the record open, and continues.

## Shared-file changes requested

### 1. Let node:415 move out of the linear audit (Batch AH-5) — approved and done 2026-10-16

**Status:** the owner approved this on 2026-10-16 and changed `tests/linear-bank-audit.py` on the branch (commit `ec02b99`): a row may leave the linear family only when a course port task serves that record. The node:415 port task is restored (see `coverage-ah-node415-v0.1.md`). The original request follows.

- **File:** `curriculum/source-mappings/linear-equations-v0.2.json` (and through it `tests/linear-bank-audit.py`).
- **Change wanted:** remove the `algebra-half-en:node:415` row (or let the audit skip rows whose record is served by a port task), so that the Algebra 1/2 port task can replace the adaptation.
- **Why:** the current adaptation's solutions reach 30; the source keeps x from 2 to 9. The faithful port is ready (recipe `ah-two-step-int` in `src/port-algebra-half.js`). Replacing the adaptation made `linear-bank-audit.py` fail, because the audit requires every row of the shared mapping to stay in the linear family.
- **Record left open:** node:415 stays covered-provisional by the existing adaptation. To finish it after the change, add the task row `('algebra-half-en:node:415', 'ah-two-step-int', None, 'Two-step equation with whole numbers', 'equations', True)` to `scripts/port_ah_tasks.py`, the oracle `'ah-two-step-int':(q,p)=>p.a*num(q,0)+p.e===p.f` to `tests/port-algebra-half.cjs`, and its decision to the AH-5 decisions file.

## Records proposed for retirement

None so far.
