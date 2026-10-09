# Milestone 4 verification — Algebra 1

Completed 2026-10-09 under Will's “Complete milestone 4” authorization. Engine **0.24.0-rc.3**, Studio **0.26.0-rc.3**. This is a verified implementation checkpoint; no hosted deployment occurred.

## Result and scope

Algebra 1 has **309 working entries**: 69 retained plus **240 new original authored entries** across **Lessons 1–120**. The explicit ledger traces 679 recovered source records to their lesson identities. Additions comprise 104 reviewed reuse bindings and 136 custom task bindings spanning 121 new recipes. All six banks total **1,837 working entries**, including 1,316 authored entries, with 5,425 legacy source previews retained.

The canonical map is `MATH-ENGINE/curriculum/remaining-courses/milestone4-v0.1/coverage.json`. `COVERAGE.md` lists tasks for every lesson; `lesson-plan.txt` records explicit bindings; `task-contracts.json` contains four examples per new binding with prompts, parameters, answers, review criteria and representation flags. The private recovered Algebra 1 JSON matched recovery SHA-256 `42256920869ed8dcf6eb0b85dae92b55ac7edf645313151e197851aec2e4fdc0`; publisher source remains excluded from both repositories.

Content preserves arithmetic/geometry foundations, signed evaluation, exponent forms, rational expressions and complex fractions with original exclusions, literal equations including exceptional parameter cases, distinct substitution/elimination/graphical system methods, dependent/inconsistent systems, contextual coin/value/motion models, factoring including grouping/nonmonic forms, polynomial division, three quadratic methods, radical equations with extraneous checks, real absolute/compound inequalities, plane graph production, nonlinear recognition and transformations, direct/inverse squared variation, calculator powers/exponential graphing and statistical plot production/interpretation. Boxplot tasks explicitly use median-of-halves with the overall median excluded.

Completion means the documented representative task scope, not every legacy repetition or every possible value/representation. `exactLegacyReproduction` and `fullOutcomeVerified` stay false. Symbolic work, explanations, proofs, constructions, graphing and required methods have teacher-review references/criteria rather than unsupported automatic correctness. Some abstract symbolic tasks intentionally have fixed symbolic forms. Global deduplication and cross-grade recommendation analysis remain Milestone 7.

## Exact candidate

- Baseline Engine `1b127905daf63548b8f288e483b1617785619179`; Studio `76491f872b7e3b6515fa1d065e518fd21c2d2b99`.
- Tested Engine implementation `3689414a2a25f965bd1660641d6934ab6658b77b`.
- Tested Studio implementation `df1b60a938d954c3938f4b03a864afc067996aae`.
- Handbook `fd4330863f4cc0812180fbf1de122970a42c7885`: AI-START-HERE, UNIVERSAL-RULES, selected S-02/S-04 and applicable release-checklist rows; both project briefs and the milestone plan were read.
- Final HTML `2,006,012` bytes; SHA-256 `4c5bf2d42bfe877791686d8963f7dc9aa21198d1613b454927483990182dd99d`. `index.html` equals the versioned download byte for byte.
- All **58 vendored Engine modules** match source and provenance hashes. Studio pins the tested Engine implementation commit.

Implementation checkpoints preceded extended tests. Initial reuse review corrected mismatched geometry/arithmetic bindings. rc.2 corrected incomplete factor/radical simplifications and replaced an over-wide inherited equation binding with compact authored method tasks; rc.3 widened transformed-graph answer windows to contain the listed points. Previous versioned downloads remain. The verified documentation checkpoint does not modify the tested runtime bytes.

## Tests performed on final rc.3

| Check | Result and boundary |
|---|---|
| Engine generation | **15,360** cases: 240 new bindings × 64 variants; includes 9,344 teacher-review cases; deterministic replay, frozen results, valid rendering/provenance and answer contracts passed |
| Seed boundaries | Each new entry accepts numeric seeds and 200-character root seeds, including nested reuse |
| Independent custom-task audit | **8,704** cases across 121 recipes: 896 exact/rounded numeric, 6,656 symbolic identities or models, 1,152 teacher-contract checks |
| Retained-bank parity | **4,791** cases: all 1,597 prior entries × 3 variants; catalog, normalized question content, answer text and rendered question matched baseline |
| Studio core/regressions | `studio-core.cjs`, `phase3-core.cjs`, `phase3-browser.cjs` passed; 331 standard mappings, CSV targeting, input review, student/key separation, clear/cancel/undo, session replay and exports preserved |
| Layout matrix | **15,792** layouts, zero failures; 1,316 authored entries × 12 A4/Letter, one/two-column and student/key/study combinations at variant 7 |
| Algebra 1 workflow | `milestone4-browser.cjs` passed: 12 new previews, selection, packet generation, 390px viewport, session replay, actual Word/PDF downloads |
| Visual output review | All **10 PDF pages** and **7 LibreOffice-rendered Word pages** inspected; reviewed tasks and diagrams remained readable and no question content was clipped |

Independent tests use Python standard-library fractions/decimal arithmetic and a restricted AST evaluator for displayed algebraic identities; no Engine math implementation is imported by that audit. They check polynomial expansion/division identities, rational cancellations at signed rational values, numeric models, radical identities, candidate solutions, inequality boundaries and rounding. Abstract symbolic conditions and production rubrics were also reviewed directly. Teacher-contract-only checks are explicitly not automated mathematical validation of a student's drawing or written method.

Environment: Chromium 153.0.8010.0, Node 24.19.0. Browser PDFs: A4 student 5 pages, Letter key 5 pages. Word renders: A4 student 4 pages, Letter key 3 pages. Word and PDF pagination differ. Native Windows Word, physical iPad and printer acceptance are **Not run**; this checkpoint makes no certification for those environments. The finite matrix does not establish all seeds. Large temporary export/visual artifacts are excluded from repositories; output hashes are retained in `milestone4-verification.json`.

## Reproduction and next work

Engine: `node tests/milestone4.cjs` writes `/tmp/m4-samples.json`; run `python tests/milestone4-audit.py` afterward. Studio: `node tests/studio-core.cjs`, `node tests/phase3-core.cjs`, `node tests/phase3-layout.cjs`, `node tests/phase3-browser.cjs`, `node tests/milestone4-browser.cjs`. Browser scripts use `CHROMIUM_EXECUTABLE_PATH` and `PLAYWRIGHT_MODULE` where needed. The map builder intentionally emits pending verification status when rerun; only the recorded verification promotes the coverage ledger.

Next is **Milestone 5: remaining Algebra 2 generator families**; it has not started. Milestone 6 closes Algebra 2 lesson coverage. Preserve completed 8/7 (502), Intermediate 4 (260), Course 1 (277), Algebra 1/2 (378), and Algebra 1 (309), plus Algebra 2's retained 111 entries. GradeCam remains Grade 5 only. Milestone 7 retains the requested systematic cross-grade connections and teacher-directed easier/harder suggestions.
