# Milestone 6 verification

Complete at the documented representative curriculum scope on 2026-10-09. Algebra 2 has explicit routes for all 130 lesson scopes, 260 distinct demand rows and 592 recovered source identities. Lesson 128 contains original scope-authored tasks because no questions were recovered. This is not a claim to reproduce all publisher questions or figures.

## Delivered implementation

Math Engine 0.26.0-rc.2, implementation `8ce9434493c69c76ce5e8609efebe4e6d53e5a46`. Studio 0.28.0-rc.2, implementation `cbfb0783208aafc611fc15223d8558cfe4109f7e`. Studio pins all 62 Engine modules byte-for-byte. The final documentation checkpoint adds evidence and progress records without changing tested runtime or HTML.

Added 272 lesson bindings: 143 explicit adaptations of canonical providers and 129 custom bindings across 115 custom recipes. Algebra 2 rises from 184 to 456 working entries. All six banks total 2,182 entries, including 1,661 authored tasks. All 1,910 prior entries, 5,425 legacy previews, 331 Grade 5 assessment mappings and previous versioned downloads are retained.

## Coverage and review

The Engine curriculum folder `curriculum/remaining-courses/milestone6-v0.1` contains the explicit lesson plan, every demand route, the complete 592-record source ledger and review decisions. Source title normalization is used only for same-lesson metadata joins, never generator selection. Lesson 128 covers inscribed/circumscribed figures, circumcircle and incircle construction, inscribed-angle and Pythagorean proofs. Missing exact proof diagrams/givens in later source lessons use original clearly stated givens; no exact reconstruction is claimed.

Reviewed four-unknown substitution, decimal and nonlinear systems, negative square roots, fractional exponents, gas-law unknowns and significant figures, experimental data, units, fractional endpoints, contextual systems, domains and geometric reasoning. Static theorem/construction references were read for correct assumptions, vertex correspondence and noncircular use of established results. They are teacher references, not machine proof grading. Source scopes and generator ranges remain bounded.

## Passing evidence

- 17,408 generated cases: all 272 new bindings × 64 variants, deterministic replay, immutable answers, renderability, provenance and answer contracts. Includes 13,632 teacher-review cases.
- Independent Python audit: 1,472 exact/rounded numeric cases and 3,072 symbolic, identity or model cases. Separately, 3,712 production/reference contract checks. The latter do not establish formal proof or diagram correctness by themselves.
- All 1,910 retained catalog records unchanged; 5,730 generated retained comparisons passed with only the expected runtime version normalized.
- All 130 scope rows, 260 demand routes and 592 unique recovered identities resolve to explicit working entries. Lesson 128 has zero fabricated legacy IDs.
- 19,932 authored layouts: 1,661 entries × A4/Letter × one/two columns × student/key/study, zero overflow failures.
- Studio core and GradeCam regression: 331 mappings, scale handling, invalid/duplicate input, caps, undo/clear, source boundaries and session replay passed.
- New Algebra 2 workflow: 12 previews, manual packet, mobile-width viewport, answer isolation, saved-session replay, actual Word and PDF exports, no browser errors. Exact downloadable HTML opens and displays 456 Algebra 2 matches.
- All 9 exported PDF pages and 7 rendered Word pages inspected: readable text/diagrams, no clipping, overlap or missing symbols. Chromium 153.0.8010.0; Word render via packaged LibreOffice workflow, not native Windows Word.

## Corrections and delivery integrity

A duplicate scatterplot in the reference made its combined question/key too tall in two-column packets. Removed the duplicate key graph while retaining the full-size question graph and written trend reference. Reran the full layout matrix and export workflow successfully. An apparent significant-figure failure was a decimal-quantization defect in the independent test, corrected without changing correct generator mathematics. A bank-count test was corrected to include legacy entries identified by source prefix.

The final HTML is 2,255,104 bytes, SHA-256 `bdcfd79112fafdfdd117626ffb8789db015c376290a0944aa99337177c925ef8`. It is identical to `index.html`. The prior 0.27.0-rc.2 download retains SHA-256 `9b36154f5a458a570499b87262862988dc190656fa4776b3c3e1e11f8b047ccb`. Runtime full-outcome/mastery and exact-reproduction flags remain false; GradeCam remains Grade 5 only.

## Next milestone

Milestone 7: cross-course verification and deduplication, systematic cross-grade connections and teacher-directed harder/easier suggestions, followed by consolidated delivery. This feature is recorded and has not been implemented by M6. No deployment or physical-device certification is claimed.

Reproduction: run Engine `tests/milestone6.cjs` then `tests/milestone6-audit.py`; Studio `tests/studio-core.cjs`, `tests/phase3-core.cjs`, `tests/milestone6-browser.cjs`, `tests/phase3-browser.cjs` and `tests/phase3-layout.cjs`. Browser tests require the configured Playwright module and Chromium executable. Render the exported DOCX files with the document skill renderer and inspect every page.
