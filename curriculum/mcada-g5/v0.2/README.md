# Grade 5 coverage and source alignment — v0.2

This checkpoint adds a first-pass task-level review of all 331 custom Grade 5 outcomes against the recovered Saxon 8/7 inventory. It retains the earlier engine audit as a separate layer. It does not implement generators or change the adopted Mega Man v0.7 bundle.

## Results

| Source finding | Outcomes | Meaning |
| --- | ---: | --- |
| Task evidence | 142 | A recovered prompt or inspected script establishes a relevant requested task type. Numeric bounds, breadth, missing objects and response details may still need work. |
| Adaptation required | 134 | A related source exists, but a concrete method, representation, numerical range, unknown position or task structure needs to change. |
| Unresolved source | 44 | Missing expressions, diagrams, prompts or conflicting metadata prevent a sufficiently specific task determination. |
| No match established | 11 | This review did not establish a usable task source. This is not proof that no such item exists anywhere in the original materials or other courses. |
| Total | 331 | Original outcome identifiers and wording are preserved. |

The map has 556 candidate references to 413 distinct recovered source IDs, with exact workbook rows. Source evidence is a many-to-many relationship: source item counts do not equal mathematical family counts or coverage percentages.

Current engine coverage remains the earlier design audit: 42 Direct, 121 Partial and 168 Missing. Those labels measure the adopted engine's task coverage, not source availability. Source task evidence does not upgrade an engine status. All 331 outcomes remain disabled for automatic assignment until implementation and verification support that decision.

## Read the map

- [ALIGNMENT.md](ALIGNMENT.md): readable outcome-by-outcome table, source IDs and concrete required work.
- [coverage-map.json](coverage-map.json): full machine-readable map, preserving original outcomes, aliases, recursion notes and prior engine evidence.
- [summary.json](summary.json): calculated counts and structural verification limits.
- [FIRST-GENERATOR-CONTRACTS.md](FIRST-GENERATOR-CONTRACTS.md): six initial design groups covering eight external outcomes. Source bounds and proposed extensions are identified separately.

The first contracts address square area from perimeter, mixed-operation fractions, exponent product/quotient rules, rational square roots, prism nets and the two LCM methods. They are a proposed implementation slice; they do not define full scope for the rest of the curriculum.

## Material findings

- Source place-value selectors reach trillions, while the custom objective reaches hundred trillions. Source word-form examples have lower ranges still. A broad lesson title must not be used as evidence of a 15-digit generator.
- The mixed-operation fraction objective requires combined precedence-sensitive expressions. Separate fraction addition, subtraction and multiplication templates are components, not complete alignment.
- LCM by listing and LCM by prime factorization need different prompts, work and scoring despite having the same numeric answer. Original outcome IDs and student evidence remain distinct.
- Source Lesson 105 supplies rectangular-prism surface-area calculations for custom Lesson 67. The required net and face-area method must be added without moving the custom outcome to Lesson 105.
- Drawing, construction, story-writing, equation-writing and explanation outcomes cannot all be scored as final numeric answers. Their response contracts need explicit work evidence or teacher rubrics.
- Preserve the wording of outcome 66.3 in metadata, but implement fractional/decimal approximations of pi. Pi has no exact fractional representation.
- Some recovered text contains incomplete control flow, unresolved rich objects or unrelated binary fragments. Legacy scripts are evidence to interpret, not runnable code to trust or an independent answer oracle.

## Source and review method

Engine/source state: MATH-ENGINE commit `27cf86995fdb7bb94386714be4d7f1d0187e4d53`.

Recovered workbook: `Saxon_87_Generator_Scope_Recovery.xlsx`, SHA-256 `b5970a66cb62e5ec6cd6ea224e48943f164791893a27756f2e9e3c19e28b95d9`. Its Item Evidence sheet contains 789 distinct source IDs. Row references are one-based worksheet rows. Earlier same-lesson links are only navigation aids; this review includes later-lesson and investigation references when relevant.

This pass compared each exact custom outcome with recovered prompts and inventory metadata, then inspected selected scripts for consequential numerical or structural claims. It did not audit every parameter of every candidate, execute the Windows generator, reconstruct every legacy figure, or perform mathematical verification of a new engine implementation. Each row explicitly records those limits. Unresolved evidence remains unresolved instead of being converted into a confident coverage claim.

Other course inventories remain available under `curriculum/source-inventory/v0.1`. This Grade 5 review does not invent approved standards for them or imply a completed cross-course semantic search. GradeCam-driven differentiated packets remain Grade 5 only. The 57 observed standards remain an expanding six-test Q1 snapshot, not a curriculum boundary or a fixed importer limit.

## Checks performed

- Passed: 331 rows, unique full codes, and exact original wording/identifiers retained from the pinned v0.1 map.
- Passed: local v0.1 input matches the pinned GitHub map as parsed JSON.
- Passed: every candidate ID resolves to the recorded Item Evidence worksheet row; no unknown IDs.
- Passed: source status counts sum to 331, previous engine counts are unchanged, and every automatic-assignment flag remains false.
- Passed: arithmetic examples in the six design groups checked independently with exact fractions/integer arithmetic.
- Not run: new runtime generator tests, legacy rendered-question parity, Word/PDF layout, Studio import-to-packet workflow. No runtime or export implementation changed here.

Handbook consulted: `AI-START-HERE.md`, `UNIVERSAL-RULES.md`, and `CONDITIONAL-STANDARDS.md` including selected S-02, at v0.1.3 / `c50115ba1fea9cb552f3ad1415e670a219118b56`. This is a design/data checkpoint, not a verified release.
