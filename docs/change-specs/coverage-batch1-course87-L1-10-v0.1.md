# Coverage Batch 1: 8/7 Lessons 1–10, v0.1

Recorded 2026-10-14. This is the calibration batch of the coverage programme. It follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6.

**Version:** Engine 0.35.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`, because no existing task changed. Tasks were only added, so question records in saved Studio sessions stay valid.

## Scope

Lessons 1–10 of the 8/7 bank hold 72 source records:

- **49 open records**, to port.
- **23 earlier adaptations**, to review against the definition of complete. These were `covered-provisional` in the ledger.

## Result: every one of the 72 records is decided

| Decision | Records |
|---|---|
| Covered by a new port task: an open record, under its own ID | 37 |
| Covered by a new port task that replaces a less faithful adaptation, under ID `course-87-en:port:…` | 5 |
| Covered by the existing adaptation, after review | 16 |
| Consolidated: choice-only twin of a covered record, with the same script and question | 14 |
| Retired | 0 |

**Lessons 1–10 are 100% complete in the ledger. The 8/7 bank as a whole goes from 0% to 9.1% complete,** or 22.9% including provisional records.

**The five replacements**, and why the earlier adaptation was not faithful enough:

| Record | Earlier adaptation |
|---|---|
| SX870018 | Turned the bare money multiplication into a word problem. |
| SX870024 and SX870025 | Gave fill-in templates instead of asking students to write the property statement. |
| SX870001 | Asked for a sum of place values; the original asks for expanded notation with multiplication. |
| SN870025 | Used numbers outside the original's range. |

The earlier entries stay in place, so data derived from them is unaffected.

## How the tasks were built

`src/port87.js` holds the original Engine code, organised into 31 recipes. `src/port87-map.js` is built by `scripts/build-port87-map.py`, which writes the ID-and-hash mapping to `curriculum/source-mappings/port87-v0.1.json`.

**Fidelity to the original:**

- Each task asks the same thing as its source record, with the same ranges and constraints read from the script.
- The response form is the same. Free response is the default.
- Drawings are original SVG and match the source layouts. These are:
  - number lines;
  - the lines-and-angles figure;
  - shaded squares and the hundred grid;
  - 1/16-inch and 1/8-inch rulers;
  - shaded circles;
  - line, ray and segment figures.
- Drawing tasks the original asks students to do on paper are teacher-review tasks, each with a reference drawing.

**Bugs in the original fixed in the port:**

- SX870122 could ask for the place of a digit that appears twice. The port picks a digit that appears once.
- SX760040 could key "No" for a number that is divisible by both. The port computes the key.

**Distractors (P10).** Every port task that has a multiple-choice twin, and most of the others, carries three distractors. Each one is tied to a named mistake, such as "Placed the decimal point one place too far right". The integer comparison task has only two possible wrong answers.

The original distractors are not reused.

Three consolidated twins point to earlier adaptations that carry no distractors yet: SN870010, SN870160 and SX760043. Their distractors are pending the distractor programme.

**Answer forms:**

- Mixed-to-improper tasks require an improper fraction.
- Improper-to-mixed tasks require a mixed number.
- Reciprocals and the jk/(j + k) evaluation accept either form, in lowest terms.
- Property statements accept any correct statement of the property for the given numbers. For the associative property, students may use any order of the three numbers.
- Factor lists can be given in any order.

## Connections and practice

- **Cross-course map.** The port tasks are classified by their recorded topic. Fifteen are placed in existing reviewed tracks:
  - fraction add/subtract, levels 1 and 3;
  - fraction product, level 1;
  - place values, level 2;
  - expression evaluation, levels 1 and 2;
  - linear equations, level 1;
  - integer arithmetic, level 1;
  - decimal operations, level 2.

  The rest keep their topic strand only. The related-concepts builder records this as strand-only, not as a progression claim.
- **Practice bundle.** It gains the 37 auto-checked port tasks (1,441 → 1,478 bank entries), which carries them to MathQuest and Math Arcade. Teacher-review tasks are not in practice.

## Verification

**`tests/port87.cjs`** generates 1,000 instances of each of the 42 tasks. It checks:

- **Keys:** an independent oracle recomputes every key from the task's parameters, using separate code.
- **Ranges:** the source's ranges and constraints hold.
- **Distractors:** all are distinct; each names its mistake; each is marked wrong by the checker.
- **Drawings:** present where the source draws.
- **Determinism and frozen records.**
- **Wrong answers on the custom forms are rejected.**

**Full Engine test suite.** Every test that passed at the baseline (`f76164c`) still passes, plus `port87.cjs`.

`milestone7.cjs` now counts the port tasks. The tests that already failed at the baseline are unchanged. These are older milestone tests with stale counts, and the source-link audits, which need the private sources.

**Fidelity.** The port tasks were compared with private previews of the originals, side by side.

**Pace.** The batch took one session, about half of it spent on the shared parts: the module, the drawing helpers, the map builder and the oracle test. Later batches reuse all of those.

## Not in this checkpoint

- The Studio re-pin, with a new Studio version and a regenerated Bank Audit. That is the next step.
- Distractors for the three consolidated twins that point to earlier adaptations.
