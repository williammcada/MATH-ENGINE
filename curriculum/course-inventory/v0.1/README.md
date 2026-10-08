# English course inventory v0.1

Step 1 accounts for every English source record. This is a **provisional planning classification**, not a semantic audit or new engine implementation. Task labels are candidates, often overlapping; question evidence and topic-only inference are explicitly separated. Two trigonometry items were classified by inspecting their scripts. Unknown embedded objects are never assumed to be equations or usable diagrams.

| Bank | Records | Implemented adaptations | Opaque objects in record |
| --- | ---: | ---: | ---: |
| course-1-en | 1353 | 1 | 1009 |
| algebra-half-en | 624 | 1 | 300 |
| algebra-2-en | 592 | 1 | 259 |
| intermediate-4-en | 1388 | 1 | 973 |
| algebra-1-en | 679 | 1 | 99 |
| course-87-en | 789 | 13 | 402 |

## Evidence and limitations

- withQuestionEvidence: 3107
- reviewedScriptEvidence: 2
- topicOnly: 2316
- unclassified: 0
- multipleCandidates: 3373

## Rendering work (overlapping indicators)

- equationCandidate: 1599
- diagramCandidate: 1030
- graphCandidate: 313
- tableCandidate: 112
- legacyDrawingCode: 630
- unknownEmbeddedObjectType: 3042

All records retain sourceRenderingVerified=false. A record without an object marker is not thereby text-complete or mathematically verified. Renderer candidates are minimum evidence, not exhaustive requirements. Generic lesson titles can label several distinct tasks. A question containing an equation does not necessarily ask students to solve an equation. Before implementation, narrow candidate labels using the full source and response demand.

## Implementation groups

- arithmetic-operations: 1541 candidate records
- fraction-arithmetic: 896 candidate records
- geometry-shapes: 545 candidate records
- decimal-arithmetic: 438 candidate records
- powers-roots-radicals: 437 candidate records
- geometry-lines-angles: 362 candidate records
- factor-divisibility: 358 candidate records
- measurement-conversion: 357 candidate records
- coordinate-graphs: 304 candidate records
- area-surface-area: 280 candidate records
- money: 275 candidate records
- ordering-comparison: 267 candidate records
- ratio-proportion-rate: 265 candidate records
- linear-equations: 260 candidate records
- word-problems: 252 candidate records
- rounding-estimation: 232 candidate records
- data-statistics: 229 candidate records
- algebraic-structure: 220 candidate records
- whole-number-arithmetic: 213 candidate records
- percent: 210 candidate records
- time-calendar: 163 candidate records
- volume-capacity: 153 candidate records
- order-of-operations: 142 candidate records
- perimeter-circumference: 139 candidate records
- missing-number-equations: 133 candidate records
- place-value: 130 candidate records
- number-line: 118 candidate records
- integer-signed-arithmetic: 113 candidate records
- number-systems: 110 candidate records
- functions: 98 candidate records
- operation-properties: 97 candidate records
- expression-evaluation: 93 candidate records
- probability-counting: 85 candidate records
- sequences-patterns: 82 candidate records
- sets-logic: 79 candidate records
- number-names: 72 candidate records
- applied-problems: 65 candidate records
- algebraic-simplification: 61 candidate records
- polynomials-factoring: 59 candidate records
- scales: 56 candidate records
- inequalities: 54 candidate records
- systems-of-equations: 48 candidate records
- rational-expressions: 40 candidate records
- geometry-constructions: 34 candidate records
- quadratics: 27 candidate records
- pythagorean-distance: 24 candidate records
- reasoning-sufficiency: 18 candidate records
- complex-polar-numbers: 13 candidate records
- trigonometry: 12 candidate records
- vectors: 7 candidate records

There are 2644 scripted legacy records with 2494 distinct exact scripts, including 138 shared-script groups. There are 490 repeated normalized stem groups. These identify inspection/reuse opportunities; they do not prove interchangeable mathematics.

## Next implementation order

1. Review candidate arithmetic, place value, rounding, sequences and missing-number groups. Reuse exact-script pairs after checking each prompt/answer contract.
2. Build structured equation support for fractions, powers, radicals, expressions and algebra. Validate precise task mappings before enabling questions.
3. Reconstruct SVG number lines, measurement tools and geometry, then graphs/tables. Decode opaque objects rather than substituting a generic visual.
4. Resolve legacy choice-only answer semantics, multi-part questions and open-response requirements. Preserve a per-record exception queue throughout.

Every per-bank JSON contains IDs, lesson links, task evidence, renderer indicators, source format/answer type, implementation status and blockers. `reuse-groups.json` identifies candidate shared work. `summary.json` pins recovered-source hashes; `taxonomy.json` exposes the rules. No publisher question bodies or student data are included.

Reproduce with `python scripts/classify-course-banks.py --content PATH_TO_PRIVATE_RECOVERY --indexes PATH_TO_STUDIO_INDEXES --out curriculum/course-inventory/v0.1`.

Current integration remains 18 source-informed adaptations; 5,407 records remain unintegrated. Spanish remains excluded. Standards-driven differentiation remains Grade 5 only. No HTML changed in this inventory step.
