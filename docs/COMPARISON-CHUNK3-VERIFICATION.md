# Comparison Chunk 3 verification

Completed 2026-10-09. Engine **0.31.0-rc.2**, Studio **0.33.0-rc.2**. All **295** frozen geometry, measurement, data and applied entries have source-backed decisions: **287** gained paths and **8** remain explicitly reviewed topic-only. This recovery completed verification and documentation of the existing implementation checkpoints without changing application code or generated questions.

## Exact source and delivery

- Canonical Engine implementation and Studio vendor pin: `4bcff91ead79967f08635fb86d62b637c7800dc1`.
- Studio implementation and tested download: `48a80bc85e306d827e6848e136f03f49763a69ca`.
- Chunk 2 baselines: Engine `31e22b2ecb0fdadaaeab6f62943066fdf01b86b3`; Studio `ad6024ca60ae8a3235f57c004d2f4b5dc919c66e`.
- Handbook revision `fd4330863f4cc0812180fbf1de122970a42c7885`: AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md (S-02/S-04), RELEASE-CHECKLIST.md. Current project briefs and comparison-chunk3-v0.5 change specifications were read. No conflict identified.
- Download `downloads/Test-and-Practice-Studio-v0.33.0-rc.2.html`: **4,358,687 bytes**, SHA-256 `034104c14dc2dbd3135f4dfadff5c5e98ffaefee855fc7cc026d59670679ff3b`.
- `index.html` is byte-identical to the versioned download. All **65** vendored modules match both the provenance hashes and canonical Engine source. The previous 0.32.0-rc.2 download is unchanged.
- Runtime, download and source remain the tested release candidates above. Completion commits add evidence and documentation only; no new feature, version relabeling or hosted deployment is implied.

## Coverage

| Measure | After Chunk 2 | After Chunk 3 |
|---|---:|---:|
| Working entries | 2,184 | 2,184 |
| Reviewed paths | 298 | 392 |
| Entries in paths | 1,871 | 2,158 |
| Reviewed topic-only entries | 18 | 26 |
| Unreviewed topic-only entries | 295 | 0 |
| Cross-course directional entries | 1,286 | 1,435 |
| Explicit cross-course easier/harder entries | 655 | 657 |
| Entries without a cross-course direction | 898 | 749 |

Directional includes easier/harder and prerequisite/extension. Related-only, same-scope and shared-provider links do not establish a direction. Counts retain original lesson entries, including reuse; these are not counts of unique providers or empirically measured student difficulty.

The eight new topic-only decisions concern physical pi measurements, two pi-approximation tasks, two survey-design tasks, tessellation, mixed inverse-solid formulas and the parallel-postulate explanation. Their complete executable contracts do not have a validated counterpart. Preserving an explicit unranked decision is completed review work.

## Checks actually run

- **Passed:** all 295 scoped review records, provider identities, evidence hashes and frozen scope match. Exactly 287 gain paths. No out-of-scope topic-only entry moves into a path. Every prior membership remains. All 331 coded Grade 5 outcomes remain.
- **Passed:** 15,699 candidate pairs checked for inverse symmetry, grade/order independence, provider precedence and conservative conflict handling. All **6,687** previous directional pairs preserve their direction. Seven existing all-course conflicts remain related (three are cross-course); none were added.
- **Passed:** domain anchors distinguish single versus combined histogram bins, normal-model parameters versus bands, box selection versus construction, external-height geometry, congruence proof, units, odds, motion and gas-law precision. Mixed card events and inverse-solid contracts are not forced into difficulty rankings.
- **Passed:** **26,208** generated questions (2,184 entries at 12 indices) match the Chunk 2 baseline after excluding runtime version metadata. Catalog identities and generator mathematics remain unchanged; source-module differences are limited to course-banks.js version metadata and cross-course-map.js. Comparison API code is unchanged.
- **Passed:** rebuilding and analyzing the cross-course map reproduces tracked outputs without a diff; the frozen Chunk 4 queue equals the recomputed remaining-review ledger.
- **Passed:** the exact Studio download matches Node generation for all **2,184** entries. Only SVG decimal coordinates are normalized to nine decimal places for browser/Node floating-point differences. All **256** perimeter labels across 64 variants fit within the SVG bounds.
- **Passed:** Chromium browser flows for new histogram comparisons in both directions, retained perimeter comparisons, course labels, preview origin, empty/unranked filters, shared-provider warnings, add/remove/undo, a 12-task draft across six banks, draft download and packet/session replay. The 390-pixel viewport fits without horizontal page overflow.
- **Passed:** Studio core and GradeCam regression checks cover 331 mappings, zero versus missing scores, scales, duplicate/invalid inputs, caps, source boundaries, actual XLSX import, leading-zero IDs, formula rejection, escaped content and local-only requests.
- **Passed:** actual A4 student export (12 items, one column), Letter key (12 items, one column), and compact Letter key (12 items, two columns). All **20 PDF pages and 15 rendered Word pages** were visually inspected. Each DOCX contains seven diagrams, all 12 questions and the correct answer visibility. Geometry labels, histogram intervals, box summaries, proof criteria, radical notation and normal-model values are readable. Word pagination differs from browser print pagination.
- **Not run:** physical Windows/Microsoft Word/printer and iPad checks; school-network and hosted deployment checks. Narrow-viewport emulation does not certify a physical mobile device. No deployment was performed.

Evidence JSON, exact export/render hashes and the replay draft are in `docs/verification/comparison-chunk3/` in both repositories. Temporary exports and page images are reproducible QA files, not new application deliverables. The first test-browser launch failed because the local executable was empty; a replacement Chromium 153.0.8010.0 allowed successful reruns. One truncated temporary PNG was re-rendered and inspected. Neither issue required application changes.

## Reproduction and continuation

Use the Engine baseline commit above in a separate checkout, then set `CONNECTIONS_BASELINE` to its `src` directory and run `node tests/comparison-chunk3.cjs`. Run `python3 scripts/build-cross-course.py` and `node scripts/analyze-cross-course.cjs` to reproduce the generated map and ledger.

In Studio, run `tests/comparison-chunk3-browser.cjs`, `tests/comparison-chunk3-delivery.cjs`, `tests/comparison-chunk3-docx.py`, `tests/studio-core.cjs`, `tests/phase3-core.cjs` and `tests/phase3-import.cjs`. Browser scripts accept `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE_PATH`. The delivery script expects a sibling `math-engine/src` path; this recovery used a symlink to the canonical MATH-ENGINE checkout. Render each Word export with the document skill's `render_docx.py`; render browser PDFs with Poppler and inspect every page.

**Next: Chunk 4**, frozen at `curriculum/cross-course/v0.5/chunk4-scope.json`: **749** entries, consisting of **723 path-linked** and **26 reviewed topic-only** entries without an actual cross-course direction. Reassess defensible counterparts and retain related-only/shared-provider cases where appropriate. Do not invent ranks to remove gaps. Chunk 4 has not started.

Preserve all 2,184 working entries, 5,425 legacy previews, original lesson identities, teacher review, manual selection and undo, prior downloads and Grade 5-only GradeCam targeting. Placements remain Intermediate 4 → Grade 3, Course 1 → Grade 4, 8/7 → Grade 5; Algebra 1/2, Algebra 1 and Algebra 2 are tracked, not grade-locked.
