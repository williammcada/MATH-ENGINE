# Coverage programme — parallel courses: file ownership and the integration pass, v0.1

Recorded 2026-10-15 (Asia/Shanghai).

- **Baseline:** verified checkpoint `48730a0` (0.61.1-rc.1) on `claude/coverage-phase0`.
- **Branch:** `claude/coverage-parallel-setup`.
- **Version:** 0.62.0-rc.1. Bank module version unchanged at `0.33.0-rc.1`. No question, mapping or curriculum data changes.
- **Handbook** `789e0ff`: AI-START-HERE; UNIVERSAL-RULES U-04, U-06, U-07, U-08 and U-14; CONDITIONAL-STANDARDS S-02.
- **Governing specs:** `coverage-programme-phase0-v0.1.md` (the batch protocol, §0.6, applies unchanged) and `coverage-course1-phase-v0.1.md` (how ExamView records are read and ported).

## Why

The owner wants four chats to port Intermediate 4, Algebra 1/2, Algebra 1 and Algebra 2 at the same time.

Until now every port task lived in one module, `src/port87.js`, and one task list. Every batch also rebuilt the same derived files:

- the port map;
- the cross-course and related-concepts data;
- the coverage ledger;
- the dist bundle;
- the package version.

Four branches doing that would collide on every merge.

## What this setup does

### Each course has its own module, task list, map and test

`src/port87.js` still serves every port task, family `structured-port87`. Course-banks and the Studio therefore see one port catalog, as before.

**How a course recipe is found.** A recipe whose name starts with a course's prefix is built by that course's module.

**What each course module provides:**

| Function | What it does |
|---|---|
| `build(c, h)` | Builds the course's recipes. `h` carries `int`, `pick`, `index` and the full port checker, as `h.check`. |
| `check(q, response)` | Checks answer kinds that exist only in this course. |
| `answerText(q)` | Writes the key for those answer kinds. |

When `check` or `answerText` returns `undefined`, the shared port code handles the question.

**Registered once.** Each of these files lists the four courses, so adding tasks never edits them:

| Shared file | Its job |
|---|---|
| `src/port-courses.js` | The loader. It also rejects a module whose prefix overlaps another, or whose catalog contains another course's entries. |
| `scripts/build-port87-map.py` | The map builder: the `PARALLEL` list. |
| `tests/port-courses.cjs` | The test runner. It runs every course test, or the ones named. It checks each course map against its task list, and that no source record has two port tasks. |
| `tests/port-course-harness.cjs` | The generic checks used by every course test, the same as `tests/port87.cjs` applies to 8/7 and Course 1. It also validates the course's decision files. |

### Shared helpers moved out of `port87.js`

Lines 10–747 of `src/port87.js` moved **verbatim** to `src/port-shared.js`. That is 252 names:

- formatting and MathML;
- every drawing;
- the figure builder `Fig`;
- the expression and monomial parsers;
- the Course 1 helpers;
- `words`.

One helper was generalised. `wrongOnly` calls the full checker, so it became `wrongOnlyBy(check, t, list)`. `port87.js` keeps `wrongOnly` as a one-line wrapper with the same behaviour.

`port87.js` keeps:

- `build()`, which holds the 8/7 and Course 1 recipes;
- `generate()`;
- the answer checker.

### Two scripts for the integrated view

| Script | What it does |
|---|---|
| `scripts/regenerate-shared.cjs` | Rebuilds every shared output from its inputs, in dependency order: port maps → cross-course → related concepts → ledger → practice and dist. At `48730a0` this order reproduced every committed output byte for byte. |
| `scripts/verify-course.cjs <course>` | 1. Checks that the branch changed only that course's files. 2. Copies the working tree to a temporary directory and regenerates the shared outputs there. 3. Runs every test in `tests/` and compares the results with `docs/verification/parallel-courses-baseline.json`. The branch itself is never changed. |

**Why the second script exists.** A course branch must not commit the ledger or the cross-course files. So `tests/coverage-ledger.cjs` on the branch as committed would report a stale ledger as soon as a decision file is added. The temporary copy is how a course chat proves its batch passes the whole suite in the integrated state.

## (a) The files each course chat owns

| | Intermediate 4 | Algebra 1/2 | Algebra 1 | Algebra 2 |
|---|---|---|---|---|
| Course key | `intermediate-4` | `algebra-half` | `algebra-1` | `algebra-2` |
| Recipe prefix | `i4-` | `ah-` | `a1-` | `a2-` |
| Source module | `src/port-intermediate-4.js` | `src/port-algebra-half.js` | `src/port-algebra-1.js` | `src/port-algebra-2.js` |
| Task list (the port-map input) | `scripts/port_i4_tasks.py` | `scripts/port_ah_tasks.py` | `scripts/port_a1_tasks.py` | `scripts/port_a2_tasks.py` |
| Generated course map | `src/port-intermediate-4-map.js` | `src/port-algebra-half-map.js` | `src/port-algebra-1-map.js` | `src/port-algebra-2-map.js` |
| Source mapping (IDs and hashes) | `curriculum/source-mappings/port-intermediate-4-v0.1.json` | `…/port-algebra-half-v0.1.json` | `…/port-algebra-1-v0.1.json` | `…/port-algebra-2-v0.1.json` |
| Test | `tests/port-intermediate-4.cjs` | `tests/port-algebra-half.cjs` | `tests/port-algebra-1.cjs` | `tests/port-algebra-2.cjs` |
| Decision files | `…/decisions/YYYY-MM-DD-i4-batchN-*.json` | `…-ah-batchN-*.json` | `…-a1-batchN-*.json` | `…-a2-batchN-*.json` |
| Batch change specs | `docs/change-specs/coverage-i4-*.md` | `coverage-ah-*.md` | `coverage-a1-*.md` | `coverage-a2-*.md` |
| Verification notes (optional) | `docs/verification/coverage-i4-*.md` or `.json` | `coverage-ah-*` | `coverage-a1-*` | `coverage-a2-*` |

Notes on the table:

- The decision files are in `curriculum/coverage-ledger/v0.1/decisions/`.
- **The course map and source mapping are generated**, by `python3 scripts/build-port87-map.py --course <key>`. Only that course's builder run writes them, so they cannot conflict. The course commits them, because its catalog and tests depend on them. A course has no source-mapping file until its first task exists. The ledger reads every mapping file, so creating one now would have changed the ledger.
- **The records.**
  - Intermediate 4 records are ExamView items, read with `scripts/read-examview.py` as for Course 1.
  - The three Algebra courses are generator-script records, read with `scripts/read-source.py` and `scripts/legacy_preview.py` as for 8/7.
- **Record IDs** in a task list are the full source IDs from `curriculum/course-inventory/v0.1/<bank>.json`. Examples:
  - `intermediate-4-en:bank:Int4_Section01:item:TX4_S01_00073`;
  - `algebra-half-en:node:4`.
- **Topics** must be among the 66 existing cross-course topics. The test checks this.

## (b) Shared files: only the integration pass changes them

**Release and derived output:**

- **The `package.json` version.** Course chats also leave its scripts alone.
- **`dist/`**, together with `src/practice-index.js` and `src/k7-skills.js`.
- **The regenerated cross-course and related-concepts files:**
  - `src/cross-course-map.js` and everything in `curriculum/cross-course/v0.6/`;
  - `src/related-concepts-map.js` and everything in `curriculum/related-concepts/v0.1/`.
- **The rebuilt ledger:** `curriculum/coverage-ledger/v0.1/ledger.json`.

**Shared helpers and loader:**

- `src/port-shared.js`;
- `src/port-courses.js`;
- `src/port87.js`, `src/port87-map.js` and `curriculum/source-mappings/port87-v0.1.json`;
- `scripts/build-port87-map.py`, `scripts/port_c1_tasks.py` and `scripts/regenerate-shared.cjs`;
- `tests/port-courses.cjs`, `tests/port-course-harness.cjs` and `scripts/verify-course.cjs`.

**Everything else not listed in (a).** This includes:

- `src/course-banks.js`, `src/curriculum87-common.js` and every other module;
- every other test;
- the course inventories, lesson labels and placement;
- `docs/PROJECT-BRIEF.md`, the README and this spec.

`scripts/verify-course.cjs` fails if a course branch changes any of these.

## (c) What a course branch commits

**A course branch commits only:**

- its own files from (a);
- its `decisions/*.json` files.

**It never commits:**

- regenerated shared outputs;
- version bumps;
- edits to shared files.

**What the course chat does with the shared outputs.** It runs `scripts/regenerate-shared.cjs` only through `scripts/verify-course.cjs`, which works in a temporary copy. If it ever regenerates in its own tree, it restores those files before committing (`git checkout -- <files>`).

**Commit messages** name the batch and the checkpoint stage, with no version number. For example:

- "Math Engine Intermediate 4 Batch I4-1 implementation checkpoint";
- "Math Engine Intermediate 4 Batch I4-1 verified checkpoint".

## (d) Batch naming

Batches are named **I4-n**, **AH-n**, **A1-n** and **A2-n**, numbered from 1 in book order within each course. The batch name appears in four places:

| Place | Form |
|---|---|
| Decision file's `batch` field | Starts with the batch name, for example `"I4-1 intermediate-4 lessons 1-5"`. |
| Decision file's name | `YYYY-MM-DD-i4-batch1-<lessons>.json` |
| Change spec | `docs/change-specs/coverage-i4-batch1-<lessons>-v0.1.md` |
| Recipe groups | `// Batch I4-1` in the source module, and `# Batch I4-1: …` in the task list |

The course test rejects a decision file whose name and batch field disagree.

## (e) When a course needs a shared change

The course chat **stops and asks the owner.** It does not edit the shared file, and it does not work around it with a local copy. This covers, for example:

- a new helper in `port-shared.js`;
- a fix to the shared checker;
- a new cross-course topic or progression;
- a change to course-banks;
- a test that fails outside the course's own files.

The request names:

- the file;
- the change wanted, with exact wording or code where possible;
- why the course needs it;
- what the course can do meanwhile.

A helper that only this course needs goes in the course's own module instead. The owner makes the change, or schedules it for the next integration pass. Course branches then merge or rebase onto that pass.

## The course chat's batch, step by step

This is the batch protocol of `coverage-programme-phase0-v0.1.md` §0.6, applied to one course.

1. Read the records for the batch with the private reader for the course.
2. Write the recipes in `src/port-<course>.js`, the tasks in the task list, and the oracles in `tests/port-<course>.cjs`.
3. Build the map: `SAXON_SOURCE_ZIP=… python3 scripts/build-port87-map.py --course <key>`.
4. Write the batch's decisions file and change spec.
5. Run the course test: `node tests/port-courses.cjs <key> -- 1000`. This is 1,000 instances per task.
6. Commit the course's own files: implementation checkpoint.
7. Verify the integrated state: `node scripts/verify-course.cjs <key>`.
8. Commit the verified checkpoint, and push the course branch.

## The integration pass

The owner, or a chat the owner names, runs it:

1. **Check each course branch before merging it.** On the course branch, run `node scripts/verify-course.cjs <key> --files-only --base <integration base>`. It must report only that course's files. A merged branch contains several courses' files, so this check is run on each course branch, not on the merge.
2. **Merge.** Merge the course branches into the integration branch the owner names. Course branches touch disjoint files, so the merges are conflict-free.
3. **Regenerate.** Run `node scripts/regenerate-shared.cjs` in the repository, then bump the `package.json` version.
4. **Verify.** Run the full suite, and `node scripts/verify-course.cjs all`.
5. **Record.** Commit the implementation and verified checkpoints. Refresh `docs/verification/parallel-courses-baseline.json` if the set of tests or their baseline results changed.
6. **Re-pin.** The Studio re-pins after the pass.

**The Studio, at its next re-pin, vendors the new files:**

- `src/port-shared.js`;
- `src/port-courses.js`;
- the four course modules and their maps.

A browser host loads them as plain scripts, in this order:

1. `curriculum87-common.js`
2. `port-shared.js`
3. `port87-map.js`
4. each `port-<course>-map.js` and `port-<course>.js`
5. `port-courses.js`
6. `port87.js`

The dist bundle already includes them.

## Shared tests adjusted so that adding course tasks needs no shared edit

- **`tests/port87.cjs`** tests the 8/7 and Course 1 entries of `port87-map.js`. Course tasks are tested by their own tests.
- **`tests/milestone7.cjs`** counts port tasks from the full port catalog, `port87.js`, rather than from `port87-map.js`. The count is unchanged today.

## Verification

Results are in `docs/verification/parallel-courses-setup-v0.1.md`.

## Not in this checkpoint

- No records were ported. The four course task lists and catalogs are empty.
- The Studio re-pin and its script list.
- **The ZIP hash code for the four new banks has not been run against the real ZIP.** The private ZIP is not available in this session. It follows the same rule as the 8/7 and Course 1 code: ExamView hashes when an item has dynamic data, block hashes otherwise. The first batch of each course confirms it when it builds its map with `SAXON_SOURCE_ZIP` set.
