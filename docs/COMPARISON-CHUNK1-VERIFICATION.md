# Comparison Chunk 1 verification

Completed 2026-10-09. Engine **0.29.0-rc.3**, Studio **0.31.0-rc.3**. All **303** frozen number/proportional entries have an individual review decision. **296** gained reviewed path links; **7** remain reviewed topic-only with explicit reasons. Completion does not mean every entry receives an easier/harder recommendation.

## Saved sources and delivery

- Baseline Engine: `e8f084babe8b3f7194b363e6641a9a2f6b82c082`; baseline Studio: `4aa526bf4cf60f6b58d2d4d7c2ac0fc8dc7d7921`.
- Final Engine implementation and Studio vendor pin: `e9422030bdb9d84fdd88612828b96333f9b67f5f`.
- Final Studio implementation/download checkpoint: `58ad6584b651472da7f923a1e9e81b265c7406c3`. Subsequent commits add verification and continuation documentation only.
- Handbook consulted: `fd4330863f4cc0812180fbf1de122970a42c7885`; AI-START-HERE, universal rules, curriculum/distribution standards and release checklist.
- Download: `downloads/Test-and-Practice-Studio-v0.31.0-rc.3.html`, **4,051,445 bytes**.
- SHA-256: `cca65b21a3a6dc2906c510e784cd1be03bbba8f5e254784e1f624692f187c2bd`.
- `index.html` is byte-identical to that download. All 65 vendored modules match their manifest and canonical Engine source bytes. Previous released download v0.30.0-rc.1 remains byte-identical; intermediate rc.1/rc.2 checkpoints also remain available.

## Coverage

| Measure | Before | After |
|---|---:|---:|
| Working entries | 2,184 | 2,184 |
| Reviewed paths | 186 | 245 |
| Entries in reviewed paths | 1,297 | 1,593 |
| Entries outside reviewed paths | 887 | 591 |
| Unreviewed topic-only entries | 887 | 584 |
| Reviewed topic-only entries from this chunk | 0 | 7 |
| Entries with cross-course directional recommendations | 922 | 1,099 |
| Entries with explicit cross-course easier/harder results | 487 | 560 |

Directional recommendations include prerequisite/extension as well as easier/harder. They cover 163 of the 303 Chunk 1 entries; another 14 previously reviewed entries gained cross-course direction through the new links. The 133 newly linked scoped entries without direction still have reviewed paths for related or similar demands. The seven topic-only decisions concern unit-power vocabulary, percent-change recognition, parity, ordinals and logical negation. No ranking is inferred from school grade, title, or a single generated sample.

The frozen scope and per-entry evidence live in the Engine repository under `curriculum/cross-course/v0.3/`: `chunk1-scope.json`, `chunk1-review.json`, explicit `progressions.txt`, `relation-modes.json`, generated profiles and coverage reports. There are 238 source/recipe review groups, including configuration variants; each of the 303 entries retains its actual provider contract and evidence hashes. Required-method, response, range and branch differences were considered, including curriculum87 phase2 overrides and arithmetic AST quotient/range semantics.

## Passed checks

- 303/303 review records, source evidence hashes and path references verified. Exactly 296 scope entries gained paths; 7 have explicit reviewed related-only status. No entry outside the frozen scope was newly moved into a path.
- 10,936 candidate pairs checked for inverse symmetry, grade/order independence, canonical-provider precedence and conservative conflict handling. Seven existing all-course conflicts (three cross-course) remain related-only. No new conflict remains.
- 26,208 retained generation comparisons: all 2,184 entries, 12 indices each. Catalog identity and generated mathematics match the baseline after excluding only runtime version metadata. Changed Engine modules are `course-banks.js` (version only) and generated `cross-course-map.js`; all mathematics implementations and the comparison API implementation are byte-identical.
- Exact downloadable HTML: all 2,184 browser-generated questions match the canonical Node results; SVG decimal coordinates are normalized to nine decimal places solely for browser/Node floating-point rendering differences. 256 perimeter labels across 64 variants stay within SVG bounds.
- Browser flow: upward/downward perimeter recommendations; newly reviewed ordinal, mixed fractions, percent, monthly interest, number-line, root-operation, absolute-value and fractional-position tasks; all six course labels; preview origin; relation/course filters; empty results; add/remove/undo; shared-provider warnings; narrow viewport; a 12-task draft spanning six banks; session/packet replay.
- Retained Studio core and GradeCam tests: 331 coded Grade 5 outcomes, zero versus missing scores, scale checks, duplicates, caps, leading-zero IDs, formula rejection, escaped text and local-only import requests.
- Actual A4 student and Letter teacher-key exports: seven PDF pages and five rendered Word pages visually inspected. All final-version render images exactly match the inspected page hashes. Fractions, signs, diagrams, answers and teacher-review instructions are readable without clipping or missing content. Word and PDF pagination differs, as expected for separate rendering engines.

Machine-readable results and the replay draft are in `docs/verification/comparison-chunk1/` in both repositories. Reproduce Engine checks with `CONNECTIONS_BASELINE` pointing to the baseline Engine `src` directory and `node tests/comparison-chunk1.cjs`. Studio checks are `tests/comparison-chunk1-browser.cjs`, `tests/comparison-chunk1-delivery.cjs`, `tests/studio-core.cjs`, `tests/phase3-core.cjs` and `tests/phase3-import.cjs`; browser tests accept `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE_PATH`. Tested Chromium: 153.0.8010.0.

## Corrections made during review

A new grouping path initially put two-digit and three-digit subtraction anchors at the same level, conflicting with their established difficulty relationship. Restricting that anchor preserved the existing ranking; a regression assertion protects it. Fraction-between descriptions were also made precise: both generators calculate a supplied fractional position. The simpler generator uses positive multiples-of-ten endpoints and whole-number answers; the harder generator uses signed rational endpoints. No generated questions changed.

## Continuation and limits

Chunk 1 is complete. Chunk 2 contains **289 algebra/function entries**; Chunk 3 contains **295 geometry/measurement/data/applied entries**. Both exact source queues are now frozen as `chunk2-scope.json` and `chunk3-scope.json`. Chunk 4 will reassess cross-course directional gaps after those reviews. Its original already-path-linked population was 375; currently 494 path-linked entries lack a cross-course direction. Recompute that population later instead of requiring a rank for every related or shared-provider task.

Placements remain Intermediate 4 → Grade 3, Course 1 → Grade 4, 8/7 → Grade 5; Algebra 1/2, Algebra 1 and Algebra 2 remain tracked, not grade-locked. The app retains 5,425 legacy previews, original lesson identities, teacher review and Grade 5-only GradeCam targeting. These are reviewed instructional-demand relationships, not measured student difficulty or publisher-exact reconstruction. No hosted deployment or physical Windows/Word/printer certification is claimed.
