# Verification — parallel-course setup v0.1 (Engine 0.62.0-rc.1)

Recorded 2026-10-15 (Asia/Shanghai). Change spec: `docs/change-specs/coverage-parallel-courses-v0.1.md`.

- **Baseline:** `48730a0` (0.61.1-rc.1, verified checkpoint) on `claude/coverage-phase0`. The branch was confirmed still at that commit before starting and again before pushing.
- **Candidate:** `5a6a32e`, implementation checkpoint, on `claude/coverage-parallel-setup`. Its parent `9a2f477` is the first implementation checkpoint; `5a6a32e` adds only the `scripts/verify-course.cjs` fixes found by the dry run.
- **Which tree each check ran on.** The equivalence, bundle, browser-loading and full-suite checks ran on the `9a2f477` tree. `5a6a32e` changes no file that any of them loads. The two dry-run integrated suites ran on `5a6a32e`, plus the dummy tasks.
- **Environment:** Node 22.22.0, Python 3.13.16, Linux. No private source ZIP was available in this session.

## Results

| Check | Result | Evidence |
|---|---|---|
| Existing 8/7 and Course 1 output unchanged | Passed | See the first table below. |
| Regenerated shared outputs | Passed | Byte-identical, apart from the dist bundle. See the second table below. |
| Dist bundle behaviour | Passed | Old and new `dist/math-engine-practice.js` fingerprinted over all 2,879 practice entries × 6 instances (generated item, answer check, related links): identical hash. The provenance changes only in `bundleSha256` and the new module list; `contentHash` and `engineVersion` are unchanged. |
| Browser-style loading | Passed | The port files were loaded as plain scripts, without `require`, in the order the spec documents. For 1,257 tasks × 5 instances, the questions, answer texts, renderings and checks match the Node-loaded module. All six new globals are present. |
| Full suite, compared with the baseline | Passed | All 74 test files at `48730a0`, then all 80 on the candidate (in a copy of the tree). Every test that passed at the baseline passes. The 6 new files pass. See the full-suite notes below. |
| `npm test` | Passed | On the candidate tree. |
| Course tests with empty catalogs | Passed | `node tests/port-courses.cjs`. The four course maps match their task lists (`build-port87-map.py --check`). |
| Two courses at once, with no shared edits | Passed | See the dry run below. |
| ZIP block hashes for the four new banks | Not run | No private ZIP in this session. The first batch of each course confirms them with `SAXON_SOURCE_ZIP` set. |
| Studio vendoring of the new files | Not run | Studio scope. This happens at the next re-pin. |

### Existing 8/7 and Course 1 output

| Fingerprint | Coverage |
|---|---|
| 3,365 working entries | Every course-banks entry, through `course-banks`, baseline against candidate. Each port task: 120 instances. Every other entry: 12 instances. |
| What each instance hashes | The frozen question record, the answer text, the rendered HTML, the check of the key, the check of every distractor, and the check of a wrong response. |
| Catalogs | The port catalog and the course-banks catalog. |
| Bank version | `0.33.0-rc.1`. |

The result: 3,368 fingerprints, **0 differences**.

### Regenerated shared outputs

`scripts/regenerate-shared.cjs` was first run on a clean copy of `48730a0`. It reproduced every committed output byte for byte (clean `git status`).

On the candidate, it leaves these byte-identical to `48730a0`:

- `src/port87-map.js` and `curriculum/source-mappings/port87-v0.1.json`;
- `src/cross-course-map.js` and `curriculum/cross-course/v0.6/*`;
- `src/related-concepts-map.js` and `curriculum/related-concepts/v0.1/*`;
- `curriculum/coverage-ledger/v0.1/ledger.json`;
- `src/practice-index.js` and `src/k7-skills.js`.

Only `dist/` changes. The bundle now packages the new modules.

### Full-suite notes

- **Pre-existing failures.** 31 tests fail identically at the baseline and on the candidate. They are listed in `docs/verification/parallel-courses-baseline.json`. They are out of this setup's scope:
  - 15 historical tests pinned to earlier catalog sizes: 891 (8 tests), 2,184 (5), 1,910 and 2,182, against today's 3,365;
  - 10 source-link audits needing the private `RECOVERY_CONTENT` input;
  - 3 older bank tests with stale expectations: `reasoning-bank.cjs` and `representations-bank.cjs` (`null !== false`), and `geometry-bank.cjs` (a diagram-label check);
  - `related-concepts.cjs`, which looks for a sibling checkout `../../chunk4-engine`;
  - `milestone5-audit.py` and `milestone6-audit.py`, whose companion tests fail first.
- **Ordering.** `milestone2-audit.py`, `milestone3-audit.py` and `milestone4-audit.py` read samples that `milestoneN.cjs` writes to `/tmp`. They failed in the first baseline run only because they ran first. Run in order on both trees, they pass with identical sample files. `scripts/verify-course.cjs` now runs the Node tests before the Python audits.
- **The long test.** `tests/port87.cjs` passes on both, with 1,257 tasks × 1,000 instances.

### Dry run: two courses at once

The dry run used throwaway local branches, never pushed. Each simulated batch added one dummy task to one open record, with its oracle, its decision file and a placeholder hash. These are not ports.

| Step | Result |
|---|---|
| Starting point | A fresh shallow clone with no copy of the setup branch, as a course chat's clone will be. `verify-course.cjs` found its base by fetching the setup branch. |
| I4 branch: ownership | PASS. Six course-owned files changed. |
| I4 branch: integrated run | PASS. All 79 tests against the baseline, with `port87.cjs` at 1,000 instances. |
| A1 branch | Built from the same checkpoint. Its ownership check passed. |
| Merging I4 and A1 | Merged into one branch **without conflicts**. |
| Merged branch: integration verification | `verify-course.cjs all` PASS. The ledger, cross-course and practice tests all pass after regeneration. |

**Negative checks, each caught with its message:**

- a shared file edited on a course branch;
- a decision file whose name and batch field disagree;
- a topic that is not an existing cross-course topic;
- a recipe without the course prefix.

**Defects the dry run found, fixed in `5a6a32e`.** Both were in `verify-course.cjs`'s ownership check:

- a mangled path from trimmed `git status` output;
- no base found in a single-branch clone.

The I4, A1 and merged runs above were made with `5a6a32e`.
