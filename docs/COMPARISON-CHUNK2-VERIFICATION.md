# Comparison Chunk 2 verification

Completed 2026-10-09. Engine **0.30.0-rc.1**, Studio **0.32.0-rc.2**. All **289** frozen algebra/function entries have individual review records. **278** gained reviewed paths; **11** retain explicit reviewed topic-only decisions. No comparison direction is inferred from a course title or school grade.

## Sources and exact delivery

- Engine baseline `98030bd76d6dfad6d7f514b4a4fd3edef6aa8314`; Studio baseline `750eaaa52990d8a1de0980bc5ee3767e6b00b8be`.
- Engine implementation and Studio vendor pin: `9ae5807cb32ecb7ce6d5a099b45645bde3cbd523`.
- Studio implementation/download checkpoint: `5bb5d7cc88c73b588f1c245f01574ef1573374f0`. Subsequent commits contain documentation, test evidence and the Word regression check; no delivered implementation changes.
- Handbook consulted at `fd4330863f4cc0812180fbf1de122970a42c7885`: AI-START-HERE, universal rules, curriculum/distribution standards and release checklist. Implementation checkpoints precede exact-candidate verification.
- Download: `downloads/Test-and-Practice-Studio-v0.32.0-rc.2.html`, **4,175,034 bytes**, SHA-256 `44ceaac46daf78a3f55c73b70cc623445de77afd5a0a876c3422dadff932d12f`.
- `index.html` is byte-identical to the versioned download. All 65 vendor modules match the manifest and canonical Engine bytes. Previous release 0.31.0-rc.3 remains unchanged; the intermediate 0.32.0-rc.1 checkpoint is retained.

## Coverage

| Measure | Before | After |
|---|---:|---:|
| Working entries | 2,184 | 2,184 |
| Reviewed paths | 245 | 298 |
| Entries participating in paths | 1,593 | 1,871 |
| Entries outside paths | 591 | 313 |
| Reviewed topic-only entries | 7 | 18 |
| Unreviewed topic-only entries | 584 | 295 |
| Cross-course directional entries | 1,099 | 1,286 |
| Explicit cross-course easier/harder entries | 560 | 655 |

Directional includes easier/harder and prerequisite/extension. 165 Chunk 2 entries and 22 previously reviewed entries gained a cross-course direction. A reviewed path can remain related-only, same-scope or within one course; path membership alone is not directional coverage.

The Engine's `curriculum/cross-course/v0.4/` contains the unchanged scope, all 289 entry/provider snapshots and evidence hashes, explicit progression selectors and relation modes, generated profiles, actual directional coverage and remaining-review reports. The 250 source/recipe groups were reviewed across their ranges and branches, including template ASTs, method requirements, domains, graphing and response formats. Same-recipe quadratic providers have different method configurations; the new exact-provider selector prevents those requirements from being merged.

The 11 topic-only entries concern symbolic complex fractions, literal-denominator rearrangements, a base-ten model, grouping-symbol vocabulary, sentence classification and mixed calculator-power branches. Their records give specific reasons to retain topic discovery without forcing a rank.

## Verification results

- **289/289** scope entries reviewed; exactly 278 newly path-linked. No out-of-scope topic-only entry was moved into a path. Chunk 3's 295-entry scope remains byte-identical to v0.3.
- **14,472 candidate pairs** checked for inverse symmetry, grade/order independence, canonical-provider precedence and conservative conflict handling. **All 5,031 previous directional pairs preserve their direction.** Seven existing all-course conflicts (three cross-course) remain related; none were added.
- **26,208 generation comparisons** across all 2,184 entries and 12 indices match the baseline after excluding runtime version metadata. Catalog identities are unchanged. Engine source differences are limited to the version string and generated comparison map; generator mathematics and comparison API implementation remain byte-identical.
- The exact final HTML passes **2,184 browser/Node question comparisons**. SVG coordinates alone are normalized to nine decimal places for floating-point rendering differences. All **256 perimeter labels** across 64 variants remain in bounds.
- Browser flows pass new affine-equation recommendations upward/downward, retained perimeter navigation, all course labels, preview origin, filters and empty results, manual add/remove/undo, shared-provider warnings, a 12-task draft across six banks, session/packet replay and a narrow viewport. Newly reviewed export examples include rational-domain equations, rational/linear inequality graphs, logs, complex quadratics and reciprocal-function graphs.
- Retained Studio/GradeCam checks pass: 331 coded Grade 5 mappings, zero versus missing scores, scales, duplicate/invalid input, caps, source boundaries, actual XLSX import, leading-zero IDs, formula rejection, escaped output and local-only requests. An initial import test used an unavailable default browser cache; rerunning with the available executable passed.
- Actual final exports: A4 student packet (12 items, one column), Letter teacher key (12 items, one column), and compact Letter key (9 items, two columns). **19 PDF pages and 12 rendered Word pages** were visually inspected. All final PDF page images match the reviewed images; final Word pages were inspected after the correction below. Fractions, signs, answers, graph choices, labels and teacher-review instructions are present and readable. Separate rendering engines produce different pagination.
- Word regression check confirms every graph-choice grid contains all four labels and four diagrams, one of each in a cell, with rows kept together. No graph-option label is orphaned in the reviewed renders.

Results, exact render/export hashes and the replay draft are saved under `docs/verification/comparison-chunk2/` in both repositories. Raw temporary render images are reproducible from the tests and recorded fixture; they are not repository deliverables.

## Correction during verification

The pre-existing Word exporter flattened graph choices into a vertical sequence. In a full graph packet, the last label could separate from its diagram across a page break. Studio 0.32.0-rc.2 preserves choice grids as Word tables and sizes diagrams to their cells. This fixes presentation without changing generated questions or comparisons. The browser print-layout guard correctly rejected an oversized graph question in a two-column packet; full graph packets were verified in one column and a separate compact packet in two columns. Use a suitable layout rather than bypassing that guard.

## Reproduction and continuation

Engine: set `CONNECTIONS_BASELINE` to the baseline Engine `src` directory and run `node tests/comparison-chunk2.cjs`. Regenerate data with `python scripts/build-cross-course.py` and `node scripts/analyze-cross-course.cjs`; the generated outputs reproduce without a diff.

Studio: run `tests/comparison-chunk2-browser.cjs`, `tests/comparison-chunk2-delivery.cjs`, `python tests/comparison-chunk2-docx.py`, plus `tests/studio-core.cjs`, `tests/phase3-core.cjs` and `tests/phase3-import.cjs`. Browser tests accept `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE_PATH`. Tested Chromium: 153.0.8010.0. Word renders used the document rendering workflow in LibreOffice; no physical Windows/Word/printer certification is claimed.

**Next is Chunk 3:** the exact 295 geometry/measurement/data/applied entries in `curriculum/cross-course/v0.4/chunk3-scope.json`. Then Chunk 4 reassesses remaining cross-course directional gaps. Currently 898 entries lack direction: 585 already path-linked, 18 reviewed topic-only and 295 awaiting review. Recompute after Chunk 3; do not treat every gap as a required difficulty rank.

Placements remain Intermediate 4 → Grade 3, Course 1 → Grade 4 and 8/7 → Grade 5. Algebra 1/2, Algebra 1 and Algebra 2 remain tracked, not grade-locked. Original lesson identities, 5,425 legacy previews, teacher review and Grade 5-only GradeCam targeting remain. No hosted deployment was performed.
