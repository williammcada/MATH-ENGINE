# Chunk 1 — number skills and proportional reasoning

Implementation checkpoint; release verification is pending. Engine 0.29.0-rc.1 / Studio target 0.31.0-rc.1.

The frozen scope contains 303 previously topic-only entries. Every entry now has an individual review record in `chunk1-review.json`, with provider contract, configuration, source evidence hashes, reasoning and disposition. The 238 source/recipe review groups include configuration variants; these are not 238 identical contracts. AST ranges were read with their actual generator semantics: fractional `min=max=0` ranges remain variable and `quotientRange` synthesizes dividends. Curriculum87 phase2 overrides take precedence over base recipes.

296 scoped entries join reviewed paths; 7 remain reviewed related-only. Total reviewed-path coverage is 1,593 of 2,184 entries across 245 paths. 591 entries are outside paths: 584 await the next two chunks and 7 have completed review with no validated ranked counterpart. Actual cross-course directional coverage is 1,099 entries, including 560 with easier/harder results. Path participation, reviewed status and directional recommendations are different counts.

The seven reviewed topic-only entries concern unit-power language (1), percent-change recognition (2), parity (1), ordinals (1) and logical negation (2). Their ledger explains why broader calculation tasks do not justify a whole-contract ranking. The area-estimation recipe retains its historical primary topic but receives an explicit related area-model path. No generator or lesson identity changes.

Relationships describe task demands, not empirical student difficulty or school grade. Branch-mixed recipes, sparse expanded notation, Roman ranges, chart methods and multiplication-fact names remain conservatively related when no common dimension establishes direction. Decimal addition length is ranked by the number of aligned addends; individual generated values may still make a particular instance easier. Added constructs use prerequisite/extension rather than a same-skill difficulty claim. Existing conflict protection and canonical-provider precedence remain.

## Continuation

1. Chunk 1: 303 number/proportional entries — reviewed; verification pending.
2. Chunk 2: 289 algebra/function topic-only entries — pending.
3. Chunk 3: 295 geometry/measurement/data/applied entries — pending.
4. Chunk 4: review remaining cross-course directional gaps after Chunks 2 and 3; original starting population was 375 already-path-linked entries without directional results. Recompute this queue; do not treat every same-scope or related task as requiring a forced rank.

The full `remaining-review.json` is a directional-gap queue (1,085 entries), not a list of unreviewed entries. It explicitly marks completed Chunk 1 decisions. `directional-coverage.json` counts actual API results across distinct banks; exact provider copies are excluded from directional claims. Historical v0.1 and v0.2 evidence is preserved.
