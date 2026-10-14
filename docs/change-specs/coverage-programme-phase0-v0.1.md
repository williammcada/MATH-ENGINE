# Coverage programme — Phase 0 foundations and the batch protocol v0.1

Recorded 2026-10-14 (Asia/Shanghai). This implements Phase 0 of the owner-approved roadmap, `test-and-practice-studio/docs/ROADMAP-FULL-COVERAGE-v0.1.md`:

- decisions D1–D8 are all made;
- the definition of complete in §2 is agreed (D1);
- Grade 5 (Introduction to PreAlgebra 8/7) comes first, from Lesson 1 (D8);
- faithful fixed items count as covered (D2).

**Baseline:** Engine `main` `5414be6` (0.34.0-rc.3, which includes the host practice layer). The Studio 1.0.0 pin is `4fb2db4`, which is an ancestor of this baseline.

**Branch:** `claude/coverage-phase0`.

**Handbook** `fd43308`: AI-START-HERE; UNIVERSAL-RULES U-04 (mathematics agrees with keys), U-06 and U-07; CONDITIONAL-STANDARDS S-02.

## 0.1 Coverage ledger: done in this checkpoint

`scripts/build-coverage-ledger.py` writes `curriculum/coverage-ledger/v0.1/ledger.json`. It is deterministic and tested by `tests/coverage-ledger.cjs`.

Every one of the 5,425 English legacy records has exactly one state:

| State | Meaning |
|---|---|
| `open` | Not yet done |
| `covered-provisional` | One of the 521 existing source-informed adaptations. **It still has to be reviewed against the definition of complete when its lesson's batch runs.** Those adaptations were made before the definition existed, and some may differ in response form, difficulty or diagram from the original. |
| `covered` | A working task asks the same thing in the same response form, with the same diagram or graph needs and difficulty range, checked mathematically and in print |
| `consolidated` | Same task demand as a covered record; points to it with `into` |
| `retired` | Requires `ownerApproval` and a `reason` |

Batches record their results in `curriculum/coverage-ledger/v0.1/decisions/*.json`: batch name, date, and one decision per record. The ledger reports per bank and per lesson:

- **percent complete:** covered + consolidated;
- **percent including provisional.**

**Today:** 4,904 open and 521 covered-provisional. That is 0% complete and 9.6% including provisional. For 8/7: 657 open and 132 provisional.

## 0.2 Private sources: done in this checkpoint

- **Where they live.** The recovered content (v0.2) and the owner's exports from the original program are in the private repository `williammcada/saxon-source-private`.
- **How they are read.** `scripts/read-source.py` prints records for a porting session from the private ZIP. It checks the ZIP's SHA-256, and it never writes publisher text into this repository. `private/` is ignored by git.
- **What may be committed here:** IDs, lesson links, block hashes, and original Engine code and tests.

## 0.3 and 0.4 Equation and diagram decoding: next

**The problem.** Question blocks keep equations and positioned objects as embedded payloads; `read-source.py` shows them as `[]`. Most generator records need them to port faithfully. For example, 8/7 Lesson 1 item 2 is "Simplify: [equation]".

**First step.** Reverse-engineer the generator's rich-object encoding from records whose rendered form is known: the owner's exports A1 and B1 (20 items with known output). Produce a decoder to MathML, with a test on those items.

**Legacy drawing code.** Generator scripts draw with commands such as `slate`, `line`, `dot` and `write`. A small interpreter for those commands, writing SVG, is the second step. It is checked against B2 and the A1 drawing items.

## 0.5 Choice-key convention: settled

The first answer block is the correct answer; the program shuffles positions. See `test-and-practice-studio/docs/D5-FINDINGS-2026-10-14.md`.

## 0.6 Batch protocol

Every batch follows DESIGN → CHANGE SPEC → IMPLEMENT → CHECKPOINT → VERIFY → VERIFIED CHECKPOINT.

**1. Scope.** One block of lessons in book order: its open records, plus a review of its covered-provisional records.

**2. Read.** For each record, read the script, question, answer blocks and the original's rendered form where available. Decide:
- a **generator** (same task demand, fresh values within the original's constraints);
- a **faithful fixed item** (D2);
- **consolidate** into another record;
- or **propose retirement**, which needs owner sign-off before it is recorded.

**3. Build** original Engine code, never executed legacy scripts. Each task records:
- its source record ID or IDs and the block hashes;
- its answer contract;
- its response form, with free response by default;
- its reviewed multiple-choice distractors (P10) where it is multiple choice in the original. Each distractor is tied to a named mistake, with room for a fourth, A–E later.

**4. Verify:**
- **Mathematics:** an independent oracle or brute-force check over many seeds; keys agree with answers (U-04).
- **Fidelity:** compare against the original's rendering (exports, decoded source).
- **Render and print:** in the Studio preview, PDF and Word.
- **Retained tests:** everything passes.

**5. Ledger.** Write a decisions file; rebuild the ledger; report lessons completed and the course percentage.

**6. Release.** Engine checkpoint; then the Studio re-pins and regenerates its inventory and Bank Audit.

**Batch 1 (calibration): 8/7 Lessons 1–10.** 49 open records, plus 23 provisional to review. Its measured pace sets the forecast.

## Not in this checkpoint

- Decoders (0.3 and 0.4).
- Batch 1.
- Studio changes.
- The Studio's Bank Audit view of the ledger. That comes with the first Studio re-pin.
