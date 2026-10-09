# Comparison Chunk 4 — verified closeout

Verified 2026-10-09. Engine 0.32.0-rc.2, map 6.0.1; Studio 0.34.0-rc.2. Technical closeout is complete. Saved on review branches; no main merge or deployment.

## Exact implementation

- Engine: `78ac654252c808f825c1ca60409f0be215420674`.
- Studio: `85fa017c61427b394887addac001ce60288e2ad4`.
- Download: `downloads/Test-and-Practice-Studio-v0.34.0-rc.2.html`, 4,462,312 bytes.
- SHA-256: `3e692de1c05ce06f68545258daa1590483dd937f2e2dad93e12a7237038725d9`.
- All 65 vendored modules match the canonical Engine checkpoint; the download equals index.html. Previous downloads are retained.

## Reviewed scope

All 749 frozen entries, representing 590 canonical providers, have reconciled evidence and actual cross-course candidate lists. This reconciles prior provider reviews; it is not a fresh exhaustive executable review of all 590 providers. Full executable inspection supports the eleven newly nominated prerequisite bridges. Twenty-two related-only endpoint groups preserve prior within-group differences.

| Measure | Before | Verified |
|---|---:|---:|
| Working entries | 2,184 | 2,184 |
| Topics | 66 | 66 |
| Reviewed paths | 392 | 414 |
| Entries with paths | 2,158 | 2,158 |
| Reviewed topic-only entries | 26 | 26 |
| Unreviewed topic-only entries | 0 | 0 |
| Cross-course directional entries | 1,435 | 1,474 |
| Explicit easier/harder entries | 657 | 657 |
| Entries without cross-course direction | 749 | 710 |

Thirty-nine frozen entries gained supported directions. The 710 reviewed residuals are 454 related-only, 71 similar-demand, 138 with directions confined to their own course, 21 with only repeated-provider cross-course evidence, and 26 reviewed topic-only. These are documented judgments, not an unreviewed backlog or a claim that future connections cannot exist.

## Verification evidence

Machine-readable evidence and the replay draft are in `docs/verification/comparison-chunk4/` in both repositories.

- All 749 records reconcile frozen IDs, evidence hashes, provider contracts and candidate neighborhoods.
- All 57 canonical endpoint pairs support forward extension and reverse prerequisite; all 7,079 prior directions remain.
- All 15,850 candidate pairs pass inverse symmetry, grade/order independence, provider precedence and conflict checks. Seven conservative conflicts remain unchanged.
- All 26,208 generation parity cases pass against the retained Chunk 3 baseline. Runtime changes are restricted to course-banks.js and cross-course-map.js; no mathematics generator or comparison algorithm changed.
- All 331 unique Grade 5 standard codes resolve to working entries. This does not claim every additional Grade 5 entry has a separate code.
- Exact-download browser/Node parity passes for all 2,184 entries (SVG decimal coordinates normalized to nine decimals only). All 256 sampled perimeter labels stay within bounds.
- Browser 153.0.8010.0 passes all eleven new bridges in both directions, reasons, retained perimeter/histogram flows, school labels, preview origin, mixed-bank selection/remove/undo, empty filters, repeated-provider warning, draft/session replay and 390px viewport.
- The mixed packet contains twelve tasks across all six banks. PDF exports: A4 student six pages, Letter key five pages, compact two-column Letter key four pages. Word exports render to four, four and three pages respectively.
- All fifteen PDF pages and eleven rendered Word pages were visually inspected. Diagrams, numbering, answer visibility and page boundaries are readable without clipping. DOCX structure checks confirm twelve questions, zero student answers/twelve key answers, four diagrams and the expected mathematical answers.
- Studio core, Phase 3 core and Phase 3 import regression checks pass. Engine regeneration leaves tracked implementation files unchanged.

The rc.1 candidate contained a same-course-only percent/probability bridge; rc.2 removes it, retaining all 39 cross-course gains. An initial import-test launch lacked the browser executable setting; the configured rerun passed. Visual verification uses Chromium and bundled LibreOffice, not Windows Word or a physical printer.

## Reproduction and continuation

Run Engine `tests/comparison-chunk4.cjs` with its retained Chunk 3 baseline. Studio verification uses `tests/comparison-chunk4-browser.cjs`, `tests/comparison-chunk4-delivery.cjs`, and `tests/comparison-chunk4-docx.py`; supply PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE_PATH for the browser environment. Delivery checks expect the sibling canonical Engine checkout at `../math-engine`.

The user does not need to inspect these artifacts to complete technical closeout. The next task is the whole-curriculum related-concepts finder described in RELATED-CONCEPTS-NEXT.md. It has not been implemented. Existing related suggestions are useful but not exhaustive across courses. Curriculum coverage is representative documented coverage, not every publisher item type or variant.
