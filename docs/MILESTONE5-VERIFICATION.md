# Milestone 5 verification

Completed 2026-10-09 under Will's “complete milestone 5” authorization. Engine **0.25.0-rc.2**; Studio **0.27.0-rc.2**. This is a verified implementation checkpoint; no hosted deployment occurred.

73 original Algebra 2 family anchors are integrated into the selectable bank. Algebra 2 has **184 working entries** (111 retained + 73 new). All six banks have **1,910 working entries**, including **1,389 authored tasks**; the 5,425 legacy preview records remain. Other bank counts are unchanged: 8/7 502, Intermediate 4 260, Course 1 277, Algebra 1/2 378, Algebra 1 309.

Families cover complex/radical/symbolic operations, polynomial factoring/division, exceptional literal equations, three-variable and nonlinear systems, real/plane inequalities, logarithms and exponentials, trigonometry/polar coordinates/vectors, mixtures/gas/relative motion/variation, proof and construction production, Venn probability and population SD. Existing provider routes and limits are recorded in curriculum/remaining-courses/milestone5-v0.1/REVIEW.md; contracts.json lists the 73 family anchors.

**Algebra 2 is not yet a completed course bank.** Milestone 6 still performs all 130 scope-row/source-demand bindings and residual method/representation variants, including original Lesson 128 coverage. Decimal gas families do not close significant-figure/scientific-notation demands in source 466–467 and 532–533. Geometry archetypes do not close every source-specific proof/construction. Milestone 7 retains the requested cross-grade harder/easier suggestions. Full-outcome flags remain false. This milestone is bounded original curriculum work, not exact publisher recreation.

## Exact tested checkpoints

- Initial Engine implementation: ff01dbaf9e1345b44e91b57df2fbe1062c774168; Studio: 90c0e19534a3bcad3c4f3048272542d4fd352bcd. Saved before extended verification.
- Corrected and tested Engine: **3a6f83c347961ed7ab52a9699147cc3d733e427c**.
- Corrected and tested Studio: **8e4a9ca58098edd4d0b6af32b0f05f216ca436ee**.
- Handbook: fd4330863f4cc0812180fbf1de122970a42c7885. Baselines and private recovered source hash are in the change specification.
- All **60 vendored Engine modules** match canonical files and provenance hashes. Earlier downloads are preserved. Final documentation commits do not change the tested runtime.

Independent testing exposed cancellation of polar vectors producing a floating-point numerical direction and a halfway gas result rounded down by binary floating-point formatting. rc.2 now declares zero-vector direction undefined and rounds gas ratios exactly before formatting. Population variance references avoid floating-point display noise. Test-harness corrections distinguished the legitimate word “undefined” from missing fields, parsed the final log solution rather than an intermediate equation, and respected the selector's 40-item pagination. None was hidden by weakening a mathematical acceptance condition.

## Results

| Check | Observed result |
|---|---|
| Generation/answer contracts | **7,008 cases**, 73 anchors × 96 variants; seeded replay, frozen output, rendering, provenance, numeric answer acceptance and invalid-response rejection passed; 4,803 teacher cases correctly return no automatic correctness |
| Independent Python audit | **2,205 numerical**, **3,459 symbolic/model**, **1,344 production-contract** cases passed; exact rationals, conservation equations, complex arithmetic, substitution, sign/endpoint membership and final rounding checked independently |
| Production task review | Proof/construction archetypes reviewed for valid givens, correspondence, noncircular reasons and actual construction/diagram requirements. Automated contract checks do not certify a student's constructed work. Some theorem archetypes are intentionally stable |
| Retained-bank parity | **5,511 cases**, all 1,837 prior entries × three variants; exact catalogs, normalized question records, answer text and rendered question match pre-M5 baseline |
| Studio core | Existing draft validation, 331 mappings, missing/scaled scores, duplicate/invalid input, caps, replay and source boundaries passed |
| Studio workflow | 12 new previews, manual selection, student/key separation, session replay, 390-pixel viewport and actual Word/PDF outputs passed; existing GradeCam CSV, two-student synthetic batch, clear/cancel/undo and exports passed |
| Layout matrix | **16,668 layouts**, 1,389 authored tasks × A4/Letter × one/two columns × student/key/study; zero failures at seed phase3-layout, variant 7 |
| Visual exports | All **7 browser PDF pages** and **6 rendered Word pages** inspected; mathematics, diagram shading, signs, labels, wrapping and pagination readable, without observed clipping/overlap |
| Exact download | Opened the versioned HTML itself; title/visible version correct, product credit present; Algebra 2 shows 184 matches with 40 per page; index.html is byte-identical |

Node 24.19.0 and Chromium 153.0.8010.0. Browser PDFs: A4 student 3 pages, Letter two-column key 4. LibreOffice Word renders: 3 pages each. Word and browser pagination differ. Also inspected linear-inequality shading and locus references. No claim of exhaustive seed coverage, physical iPad, native Windows Word, printer, classroom acceptance or hosted deployment. These device/deployment checks are **Not run**. Gameplay U-10/U-11 are not applicable to this non-game expansion; saved-work behavior was regression-tested.

## Reproduction and handoff

Run node tests/milestone5.cjs, then python tests/milestone5-audit.py in Engine. Run Studio's studio-core.cjs, phase3-core.cjs, milestone5-browser.cjs, phase3-browser.cjs and phase3-layout.cjs with the documented Playwright/Chromium environment. Build with python scripts/build-studio.py. Output artifact hashes are retained in milestone5-verification.json; transient QA exports and private source are excluded from git.

Resume from remaining-curricula-progress.json. M6 must reconcile all 592 source records/130 scope rows against the original M1 ledger and current families, preserve lesson source identities and method/representation distinctions, complete residual variants, then verify course-wide outputs. No new source file is required to begin. Do not infer closure merely from a lesson having one working entry.
