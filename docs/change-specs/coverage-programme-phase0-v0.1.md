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

## 0.3 Equation decoding: done (checkpoint 2)

`scripts/legacy_rich.py` decodes the equation objects embedded in question and answer blocks. `read-source.py` now shows each decoded equation in place of its `[]`, as a readable form, for example `⟦\frac{`a`}{`b`}⟧`.

**What the objects are.** MathType and Equation Editor equations in the MTEF version 2 and 3 layout:

- a five-byte header;
- a tag byte with the record type in the low nibble and options in the high nibble;
- 8-bit characters.

Template numbers follow the published MTEF v3 table. Each object record names its kind: MTEF for an equation, or PICT for a QuickDraw picture.

**Coverage, in the four generator banks:**

- 2,466 embedded objects, located one for one with the `[]` placeholders.
- **2,462 equations, all decoded** to the readable form and to MathML. They use fractions, scripts, roots, fences, overbars, arcs, long division, slash fractions, piles, matrices and embellishments.
- **4 pictures** (Algebra 1: 3; Algebra 2: 1). These belong to the drawing work.
- Course 1 and Intermediate 4 have no embedded objects.

**Substitutions.** The generator marks a substitution with character 0xC1 in the text, function or variable style, so `` `name` `` is the value the script computes. Values from `fraction()`, `polynom()`, `mathsym()` and similar functions are typeset by the script, not by the equation.

**Checked against the owner's printed exports:**

- **B1 items 1, 2 and 5:** "$5.72 ÷ 13", "4/5 × 3/7" and "6 2/3", rendered in Chromium with the printed values.
- **A4 item 3:** "225π cm²", and its choices with and without π.
- **A2 item 3:** the text-style character 0xB1 prints as a minus sign ("$6.35 – 51¢"). This is used in six items, and every one of their scripts computes a difference.

**Limits.** The MathML is a review rendering. Long division is drawn as a bracket and an overbar, because browsers do not draw `menclose`. Ported items use the Engine's own rendering.

**Tests.** `tests/legacy-rich.py`:

- 34 checks on hand-built objects, which run anywhere.
- With `SAXON_SOURCE_ZIP` set, also: every object in the four banks; and the export reference items, compared by hash so that no source text is stored here.

## 0.4 Script preview and drawings: checkpoint 3 (mostly done)

**What was built:**

- `scripts/legacy_script.py`: an original, sandboxed evaluator for the generator script language. It has:
  - its own parser;
  - no `eval`, no file, network or system access;
  - bounded loops and restarts.

  It computes sample values, including typeset values and drawings (written as SVG).
- `scripts/legacy_preview.py`: writes a **private** HTML page showing records as the original would print them for one seed. This covers:
  - question, answer, choices and work area;
  - drawings;
  - equations filled with the values.

  It refuses to write inside the repository except under the git-ignored `private/`.

**Coverage.** 2,567 of the 2,642 scripts in the four generator banks preview (97%).

**Semantics read from the scripts and checked against the exports:**

- **`slate`:** `slate(name, height in., width in., xmin, xmax, ymin, ymax, …)`.
- **`write`:** `write(pic, x, y, text, alignment, typeface, size)`, where typeface 3 is the italic variable style.
- **`line` caps:** `$arrow` or code 4.
- **`plotx`:** draws conics only inside the window it is given. This is how the original draws arcs and shading. It also draws `$line` "m,b", `$poly` with ascending coefficients, and `$parabola` "a,h,k".
- **`fraction`:** mode 0 (the default) does not reduce; 1 reduces; 2 reduces and writes improper fractions as mixed numbers.
- **`literal`:** gives consecutive letters, skipping the excluded ones, starting at the index it is given.
- **`mode(m, …)`:** gives 0 when no value repeats.
- **`correct("dN")`:** names a correct choice that is not the first answer block. It appears in 4 scripts, and the preview reports it.
- **Picture assignment copies.** After `q2=q`, later drawing on `q` does not change `q2`.
- **Block type 5 is a work area** that the original does not print by default (export B2, item 1).

**Fidelity:**

- **All of B2:** number line, angle figure, inch ruler, shaded circles and protractor angle.
- **B1:** the equation items.
- **A1:** the lines-and-angles and ruler items.
- **A4:** the circle item.

All of these match the printed exports in layout and content, with different random values.

**Still open, reviewed per record when its batch runs:**

- **75 scripts that do not preview:**
  - restarts that never succeed (25);
  - bank pictures from `loadpict` (20);
  - `$power`, `$ratio`, `$rootpoly` and `$gparabola` graphs;
  - a few one-off functions.
- **Rough edges:**
  - some `polynom` exponent layouts;
  - the 4 QuickDraw pictures and the bank pictures, which are not decoded yet.

**Tests.** `tests/legacy-script.py`:

- 13 checks on scripts written for the test.
- With `SAXON_SOURCE_ZIP` set, also: at least 2,567 of 2,642 scripts preview.

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

- Bank pictures and QuickDraw pictures (rest of 0.4).
- Batch 1.
- Studio changes.
- The Studio's Bank Audit view of the ledger. That comes with the first Studio re-pin.
