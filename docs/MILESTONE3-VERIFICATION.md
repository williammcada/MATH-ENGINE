# Milestone 3 verification — Algebra 1/2

Completed 2026-10-09 under Will's “proceed to milestone 3” authorization. Engine **0.23.0-rc.4**, Studio **0.25.0-rc.4**. This is a verified implementation checkpoint; no hosted deployment occurred.

## Scope and result

Algebra 1/2 now has **378 working entries**: 72 retained plus 306 original authored entries. All **123 lessons and Topics A–J** have explicit task bindings. The coverage ledger traces all 624 recovered source records to 133 sections. The 306 additions comprise 222 reviewed reuse bindings and 84 custom task bindings spanning 80 distinct new recipes. All banks total **1,597 working entries**, including 1,076 authored entries; 5,425 legacy source previews remain.

The canonical coverage map is `MATH-ENGINE/curriculum/remaining-courses/milestone3-v0.1/coverage.json`; `COVERAGE.md` lists each lesson/topic's tasks, `lesson-plan.txt` records explicit bindings, and `task-contracts.json` records four deterministic examples for every new entry, including prompt, parameters, reference answer and teacher criteria. Reuse was reviewed by mathematical action and representation, with mismatched initial candidates corrected. Topics retain construction, histogram production, binary fractional arithmetic, circle-angle reasoning, root approximation by multiplication and bounds, polynomial arithmetic with denominator exclusions, transformation plotting, quadratic graphing, slope and supplied trig-table applications. Runtime math and diagrams belong to Engine; Studio consumes 56 exact pinned modules.

Completion is for the documented bounded representative task scope. It does not claim exhaustive publisher reconstruction, every possible parameter variation or learner mastery. Original tasks retain `exactLegacyReproduction: false` and `fullOutcomeVerified: false`. Construction, graphing, explanation and method-production tasks use teacher review, with reference answers and rubrics rather than automatic correctness.

## Exact candidate and provenance

- Tested Engine implementation: `fdd8e42468406f9fc071a97f86fe70dc8c5b5245`.
- Tested Studio implementation: `6604d975889727f685cdee8a21647586ea876306`.
- Baseline Engine: `e6942f5d1afce043be4a228ad3fc72837b70d24a`; Studio: `5bfa4d54ee2e225cb0ec11176b668ac9518c830f`.
- Handbook: `fd4330863f4cc0812180fbf1de122970a42c7885`, including AI-START-HERE, UNIVERSAL-RULES and S-02/S-04.
- Final HTML: `1,865,087` bytes; SHA-256 `928d9441faf3c91b7e49e0bdd934d802cb4358ba19e7daa3f8c5d3e8d3b25a8c`. `index.html` and the versioned download are identical.
- `vendor/math-engine-provenance.json` pins all 56 modules to the tested Engine commit; every recorded hash matches both repositories.

Implementation checkpoints were saved before extended verification. Corrections advanced the runtime/download versions through rc.1–rc.4, preserving previous downloads. Layout review corrected oversized trig tables and repeated parabola grids; math review simplified polynomial quotients and expanded trig-ratio variation; visual review clarified the circle center. Final rc.4 was retested after those changes. This verification/documentation checkpoint does not alter the tested runtime bytes.

## Verification performed on final rc.4

| Check | Result |
|---|---|
| New-entry generation | 306 entries × 64 variants = **19,584 cases**, including 5,536 teacher cases; replay, rendering, freezing, provenance and answer contracts passed |
| Seed boundaries | Every new entry accepted numeric seeds and 200-character root seeds, including nested reuse |
| Independent custom-task audit | **5,376 cases**: 3,104 numeric, 1,472 symbolic/teacher math, 576 teacher-contract-only, 224 text |
| Retained-bank parity | All 1,291 previous entries × 3 variants = **3,873 cases**; catalog, normalized question content, reference answer and rendered HTML matched baseline |
| Studio regression | `studio-core.cjs`, `phase3-core.cjs`, `phase3-browser.cjs` passed; 331 existing standard mappings and local teacher workflows retained |
| Layout matrix | **12,912 layouts**, zero failures; 1,076 authored entries × 12 paper/column/mode combinations at variant 7 |
| Algebra 1/2 browser workflow | 12 new task previews including Topics A–J, selection, packet building, student/key isolation, session replay, 390px viewport and actual Word/PDF downloads passed |
| Export visual review | All **11 browser PDF pages** and **9 LibreOffice-rendered Word pages** inspected on final rc.4; no clipping or missing task content found |

The Python audit uses independent exact fractions and decimal root bounds, polynomial identities at signed rational values, graph coordinates, unit conversions, probability/permutation and trig checks. Trig applications use the supplied rounded table values. Teacher-contract-only cases check the requested method and review contract, not student-produced drawing correctness. The layout matrix is finite and does not claim all possible seeds.

Browser: Chromium 153.0.8010.0; Node 24.19.0. Browser PDF exports: A4 student 6 pages; Letter key 5 pages. Word renders: A4 student 5 pages; Letter key 4 pages. Word pagination differs from browser PDF and includes generous workspace. Native Windows Word, iPad and physical printers were not certified. Export hashes and count details are in `milestone3-verification.json`; large transient review artifacts and private publisher source are excluded from the repositories.

## Reproduce and resume

Engine checks: `node tests/milestone3.cjs`, then `python tests/milestone3-audit.py` (the first writes `/tmp/m3-samples.json`). Studio checks: `node tests/studio-core.cjs`, `node tests/phase3-core.cjs`, `node tests/phase3-layout.cjs`, `node tests/phase3-browser.cjs`, `node tests/milestone3-browser.cjs`. Browser scripts accept the same Chromium/Playwright environment settings as phase 3. Coverage-ledger verification status is evidence metadata; the map builder regenerates its initial pending state if deliberately rerun.

Milestone 4, **Algebra 1**, is next and has not started. Preserve this completed bank, Intermediate 4 (260), Course 1 (277), 8/7 (502), and other retained entries. GradeCam remains Grade 5 only. The requested systematic cross-grade analysis and easier/harder content suggestions remain scheduled in Milestone 7; that feature has not been implemented here.
