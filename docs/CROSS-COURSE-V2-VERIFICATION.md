# Cross-course expansion verification

Engine 0.28.0-rc.1 / Studio 0.30.0-rc.1 is the verified downloadable checkpoint. The implementation was saved before delivery testing. Exact tested commits and artifact hashes are recorded in `cross-course-v2-verification.json`.

## Changes and coverage

- Reviewed paths: **74 → 186**; participating entries: **464 → 1,297** (+833).
- Topic-only entries: **1,720 → 887**. All 2,184 working entries and 66 topics remain.
- Actual cross-course easier/harder results cover **487 entries**. Including prerequisites/extensions, directional results cover **922 entries**. Path participation must not be reported as a difficulty ranking.
- **1,262 entries** lack a cross-course directional result: 887 topic-only plus 375 with reviewed similarities, related-only paths, reuse, or no distinct cross-course directional counterpart. The Engine `curriculum/cross-course/v0.2/remaining-review.json` identifies every entry and next action.
- **381 provider reuse groups / 1,026 entries** remain distinct from easier/harder comparisons. Three cross-course pairs have conflicting demand-level evidence and are conservatively related-only. Across both same- and cross-course pairs there are seven such pairs.

## Confirmed school labels

| Course | School placement |
|---|---|
| Intermediate 4 | Grade 3 |
| Course 1 | Grade 4 |
| Introduction to PreAlgebra (8/7) | Grade 5 |
| Algebra 1/2 | Tracked after 8/7; not grade-locked |
| Algebra 1 | Tracked after 8/7; not grade-locked |
| Algebra 2 | Tracked after 8/7; not grade-locked |

Will confirmed these placements on 2026-10-09. Engine owns the metadata; Studio displays it in course selection and comparisons. Grades never determine a comparison. GradeCam remains limited to the 331 Grade 5 coded outcomes.

## Verification

- **26,208 retained generation cases:** all 2,184 entries, 12 variants each, agree with the pre-expansion source after removing runtime version. Only the runtime version and connection modules differ; generator mathematics is byte-identical.
- **7,820 unique candidate pairs:** inverse symmetry, provider-reuse priority, grade invariance, path-order invariance, and conservative conflict behavior passed. A synthetic pair with opposite reviewed directions exercises the conflict guard separately.
- Original M7 regression passed 16,702 track comparisons and 256 perimeter cases. Deterministic suggestions preserve distinct providers and manual selection.
- The exact downloadable HTML passed all 2,184 browser/Node generation comparisons, 256 diagram-label bounds checks and byte parity for all 65 vendored Engine modules. SVG decimal coordinates alone are normalized to nine decimal places for browser/Node floating-point differences.
- Chromium 153 exercised all six placement labels, the Grade 4 rectangle → Grade 5 irregular quadrilateral path and its reverse, previews, mixed-bank add/remove/undo, empty filters, repeated-provider warnings, draft download and teacher-session replay. Twelve selected tasks span all six banks, including newly linked division, line-equation, root-approximation, rational-expression and proof tasks.
- Studio core, GradeCam import/allocation boundaries and XLSX import regressions passed. Student outputs contain no teacher answers.
- Reviewed all **7 PDF pages and 5 rendered Word pages** from A4 one-column student output and Letter two-column teacher keys. No clipping, overlap or missing mathematical glyphs observed. Word and browser pagination differ as expected.
- Prior v0.29.0-rc.2 download retains SHA-256 `d7cd04e26872a904ac3266e69ef984bad983de3b71fe3c09b6fb78182b1f3f9c`.

The first new Engine test incorrectly counted the 39 uncoded outcomes as GradeCam mappings; its assertion was corrected to count coded outcomes, then the full test passed. The XLSX browser test initially lacked the configured Chromium path; it passed with that environment configured. Neither issue required a product change.

## Delivery

`downloads/Test-and-Practice-Studio-v0.30.0-rc.1.html` — 3,931,418 bytes.

SHA-256: `d4ef791335ce9535829ec608061aad318708725b197ecd8108b31c31e8064319`.

No hosted deployment, native Windows Word, physical iPad or printer certification is claimed. Remaining comparison work is documented in the v0.2 review ledger; topic similarity alone is never used to invent an easier/harder result.
