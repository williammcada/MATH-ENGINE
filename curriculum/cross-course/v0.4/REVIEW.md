# Comparison review v0.4 — Chunk 2

All 289 frozen algebra/function entries were reviewed in 250 source/recipe groups, retaining each provider's configuration and required method. 278 entries gained reviewed paths; 11 have explicit reviewed related-only decisions without a path. The previous 303-entry Chunk 1 review is preserved, including its seven reviewed topic-only decisions. Completion means a supported decision for every scoped entry, not a compulsory difficulty rank.

## Current coverage

| Measure | After Chunk 1 | After Chunk 2 |
|---|---:|---:|
| Working entries | 2,184 | 2,184 |
| Topics | 66 | 66 |
| Reviewed paths | 245 | 298 |
| Entries in reviewed paths | 1,593 | 1,871 |
| Entries outside paths | 591 | 313 |
| Reviewed topic-only entries | 7 | 18 |
| Unreviewed topic-only entries | 584 | 295 |
| Cross-course directional entries | 1,099 | 1,286 |
| Explicit cross-course easier/harder entries | 560 | 655 |

165 Chunk 2 entries gained an actual cross-course direction; 22 previously reviewed entries also gained one. 113 newly linked Chunk 2 entries have related, same-scope or same-course paths without a cross-course direction. Direction includes prerequisite/extension as well as easier/harder and is measured from actual comparison API results. Counts refer to original lesson entries, not unique providers. Difficulty describes reviewed instructional demand, not measured student performance.

## Decisions and evidence

`chunk2-scope.json` is byte-identical to the frozen v0.3 queue. `chunk2-review.json` records all 289 decisions, actual entry/provider contracts, evidence files and SHA-256 hashes. Complete generator ranges, expression trees, required methods, domains, graph/response demands and branches were considered. Generated examples supplement source review; they do not establish the comparisons.

Coverage includes linear and literal equations, expression structure, polynomial operations, quadratic methods, rational/radical domains, inequalities, systems, function/domain operations, logarithms/exponentials, variation, complex numbers, vectors, trigonometry and contextual models. The 11 topic-only entries concern mixed symbolic complex-fraction branches, three literal-denominator selectors, a base-ten model, grouping-symbol vocabulary (three lesson entries), sentence classification and calculator-power branches (two entries). Their individual records explain why a uniform staged rank is not warranted.

Specific safeguards:

- Quadratic `opposite-roots` providers have different method requirements. The new `=/sourceId` selector matches that exact canonical provider and its reuse descendants only. It never propagates to another provider merely because its family/recipe matches. Existing `@/sourceId` and family/recipe selector semantics remain unchanged.
- Powers or absolute values of constants inside a linear equation do not turn it into a nonlinear equation. Numeric denominators and variable denominators have separate contracts.
- Rational and radical equations preserve original exclusions, principal-root conditions and extraneous-candidate checks. Integer-set inequality lists are not treated as real intervals.
- Calculation, selecting an answer, producing a formula/graph, justifying a method and authoring a story are distinguished. Related-only modes cover mixed demands without asserting direction.
- Unknown-sum lengths and numerical-denominator forms remain related-only because their number ranges and algebraic demands overlap.
- Existing grade labels and all original task identities remain. No grade or course ordering drives the relation.

`progressions.txt` and `relation-modes.json` are the explicit editable source. `scripts/build-cross-course.py` generates profiles and map version 4.0.0; `scripts/analyze-cross-course.cjs` produces actual directional coverage, remaining-review and conflict reports. Old review evidence hashes remain historical, while the new review records hash their current source files. The generated map keeps canonical-provider priority and conservative conflict handling.

## Verification and delivery

See `docs/COMPARISON-CHUNK2-VERIFICATION.md` at repository root for exact checkpoints, hashes, test results and export inspection. Engine runtime 0.30.0-rc.1; Studio 0.32.0-rc.2. Mathematics generators and the comparison API implementation are unchanged; only runtime version metadata and the generated comparison map changed in Engine `src`.

All 5,031 previously directional pairs retain their direction. Seven pre-existing all-course conflicts, including three cross-course pairs, remain conservatively related; none were added. No out-of-scope topic-only entry acquired a path. The 295-entry Chunk 3 queue is unchanged.

## Continuation

1. **Chunk 3:** complete the exact 295 geometry/measurement/data/applied entries in `chunk3-scope.json`; use the same full-contract review and exact-provider discipline.
2. **Chunk 4:** recompute remaining directional gaps after Chunk 3. Currently 898 entries lack cross-course direction: 585 already have paths, 18 are reviewed topic-only and 295 await review. These categories are not a mandate to invent ranks. The original Chunk 4 already-path-linked population was 375.

Intermediate 4 is Grade 3; Course 1 is Grade 4; 8/7 is Grade 5. Algebra 1/2, Algebra 1 and Algebra 2 are tracked, not grade-locked. Keep 331 coded Grade 5 outcomes, 5,425 legacy previews, teacher review, shared-provider warnings, manual selection and undo. No hosted deployment is part of this release.
