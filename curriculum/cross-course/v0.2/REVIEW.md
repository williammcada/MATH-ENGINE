# Cross-course comparison expansion v0.2

This review expands the M7 map from 74 paths / 464 participating entries to 186 paths / 1,297 entries. All 2,184 working entries retain topic discovery across 66 topics. The v0.1 evidence is preserved unchanged. No question generators or curriculum outcomes were added or removed in this expansion.

## What was reviewed

The explicit selectors in `progressions.txt` are judgments about executable family/recipe contracts, including their number ranges, required methods, response types and conditional branches. The review covered foundational arithmetic and representation through Grades 3–5, then tracked-course equations, expressions, functions, geometry, statistics and algebra. Read demands and prerequisites alongside `relation-modes.json`: a related-only path does not imply an order, and an extension introduces a construct rather than claiming a harder version of the same skill. Values and forms vary; these are instructional-demand comparisons, not measured student difficulty.

Source inspection corrected several misleading shorthand names. Algebra 1/2 fraction-product uses three factors; like-terms includes squared terms; transform-quad transforms a coordinate polygon, not a function. Algebra 1 identity:squares is a difference-of-squares proof, and word:percent recovers an original price. Root-approximation recipes request 2/4 decimal places for square roots, 2/3 for cube roots and 3 for fourth roots. These distinctions are retained in the selectors and demand descriptions.

## Count what teachers can actually use

Path participation is not the same as a cross-course difficulty recommendation. `directional-coverage.json`, produced from the public comparison API, reports both. At this checkpoint 487 entries have a cross-course easier/harder result; 922 have a directional result when prerequisite/extension is included. There are 887 entries with topic discovery but no reviewed path. Another 375 have reviewed path membership without a distinct cross-course directional result, making 1,262 without such a result. `remaining-review.json` records every one of those entries, its mathematical action, disposition, reason and next action. Those 887 contracts are not represented as completed pairwise reviews.

The 381 explicit provider-reuse groups (1,026 original entries) remain. Reuse is always reported as repeated provider, regardless of course or path. Counts describe lesson entries, not unique problem generators. Same-stage similarity never permits automatic deletion or merging of outcome evidence.

Multiple paths are now resolved together instead of accepting whichever appears first. Opposite directions, or a directional result alongside an explicit same-scope result, become related-only with an explanation and evidence. Three current cross-course pairs have such mixed evidence: monic versus nonmonic completion of the square also share a broader real-root stage; one-/two-digit remainder tasks also share a broader remainder-interpretation stage. The conservative result avoids a global ranking across those different dimensions. `conflict-review.json` preserves the pairs.

## School placement

`curriculum/course-placement.json` records Will's confirmation on 2026-10-09: Intermediate 4 = Grade 3, Course 1 = Grade 4, 8/7 = Grade 5. Algebra 1/2, Algebra 1 and Algebra 2 are tracked courses after 8/7 and are not grade-locked. The API and Studio labels use this metadata; comparisons do not read it. All 331 Grade 5 custom outcomes and Grade 5-only GradeCam targeting remain unchanged.

## Remaining review chunks

1. Inspect legacy arithmetic/equation templates by AST, operation count, number domain and demanded method; avoid assigning a whole template family from one sample.
2. Review remaining 8/7 lesson contracts and specialist geometry, measurement, data and reasoning providers against the existing 186 paths.
3. Review remaining tracked-algebra contracts and same-scope/related-only paths for defensible cross-course counterparts. Leave genuinely incomparable demands unranked.

Use `remaining-review.json` as the work queue; no missing comparison should be filled from grade order or a similar title alone.
