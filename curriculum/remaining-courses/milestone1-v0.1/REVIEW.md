# Milestone 1 — remaining curriculum audit

Completed 2026-10-09 as a planning/source audit, not a mathematics release. Implementation of milestones 2–7 is not authorized by the milestone-1 request. The previous pause is lifted for this audit only.

## Baseline and scope

Canonical Engine `6524895e099c3f088b6bdc894d22234163f32e60`, runtime 0.21.0-rc.2; Studio `f5402984035831863831003b63b920f9d5582d21`, runtime 0.23.0-rc.6. Local source trees match these saved baselines. Consulted AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md S-02/S-04 and RELEASE-CHECKLIST.md at handbook `fd4330863f4cc0812180fbf1de122970a42c7885`, both project briefs, manual-course-banks and 8/7-first scope. The English banks remain the active scope; Spanish banks are archived and not silently added. Missing standards do not block manual bank use. GradeCam targeting stays Grade 5 only.

Of 652 indexed rows, 650 contain source records. Course 1’s empty truncated Lesson 22 row is an extraction alias. Algebra 2 Lesson 128 is a genuine source-question gap: its scope specifies inscribed/circumscribed figures, circle geometry and a Pythagorean proof. Build original scope-aligned tasks and label them authored; do not invent publisher item IDs or claim a faithful recovered question.

All five recovered content files were obtained from Course-Bank-Content-Recovery-v0.2.zip and matched the six-bank recovery manifest's SHA-256 values. Raw publisher content stays outside both repositories. The audit joins all source records to recovered lesson identities and the actual Engine catalog. It accounts for every record; it does not claim a human mathematical validation of all legacy scripts or visual assets.

| Course | Source records | Working entries | Indexed scope rows | Rows with an entry | Rows without an entry |
|---|---:|---:|---:|---:|---:|
| Intermediate 4 | 1,388 | 92 | 136 | 33 | 103 |
| Course 1 | 1,353 | 45 | 133 | 22 | 111 |
| Algebra 1/2 | 624 | 72 | 133 | 39 | 94 |
| Algebra 1 | 679 | 69 | 120 | 29 | 91 |
| Algebra 2 | 592 | 111 | 130 | 68 | 62 |
| Total | 4,636 | 389 | 652 | 191 | 461 |

Scope rows are source identities, not a count of unique lessons or mastered skills. Intermediate 4 has repeated Lesson 35 metadata in different source sections. Course 1 retains both the truncated Lesson 22 identity and its recovered complete label. Preserve both source identities, alias their instructional identity when warranted, and do not double-count them as new curriculum. Investigation 4A/4B and the Roman-numeral appendices are retained.

There are 4,247 unported source records. This is not a requirement to write 4,247 new generators. The backlog retains 1,089 lesson/source-title demand facets, including compound labels, as traceable planning units rather than claiming 1,089 distinct skills. Every facet receives an implementation/review route. Repeated titles and text are evidence to review, not permission to merge different methods or representations.

## What the source inspection established

**Intermediate 4:** reuse exact arithmetic, place-value, fraction, time, geometry and statistics providers. Most work is course-level adaptation and explicit variation. Preserve two-/three-digit multiplication and division distinctions, borrowing across zero, internal/trailing zero quotients, remainder interpretation, calendar tasks, and number-line models. Draw fractions, construct prisms/pyramids, and conduct/interpret surveys remain production tasks with rubrics. Do not replace them with recognition questions. Include both Roman-numeral appendices.

**Course 1:** substantial overlap with finished 8/7 allows reuse, but a lesson-source match is not proof of equivalent demand. Explicitly retain common/unlike denominators, regrouping, factor trees, cancellation before multiplication, fraction manipulatives, unstated information and whole-from-part problems. Complete all investigations: frequency/histogram/survey work, protractor drawing, solids, coordinate plotting, bisector construction, experiments, scale models and surface/volume. Final course bank must distinguish graph creation from graph selection.

**Algebra 1/2:** do not overlook Topics A–J after Lesson 123. These add several constructions, statistical plots, binary arithmetic including fractions, circle-angle theorems, root approximations, polynomial division, transformations, advanced graphing, slope and table-based trigonometry. The existing angle-bisector provider asks for a final step; it does not alone satisfy a student construction task. Topic J items 891–894 require reading a trigonometric table; 896–899 include geometric applications. Calculator ratios alone do not cover these representations.

**Algebra 1:** greatest risks are symbolic breadth and required methods. Retain substitution, elimination and graphical system solving separately; rational expressions/equations need original domain exclusions; radical equations require checking extraneous roots. Complete nonmonic/grouping factorization, literal equations, absolute-value and compound real inequalities, nonlinear graph recognition/transformations and direct/inverse squared variation. Coin/value and equal/summed/unequal-distance applications need explicit models. Three quadratic methods remain separately selectable where the source requires them.

**Algebra 2:** existing advanced entries are useful seeds, not full lesson completion. Chemical-mixture Lessons 52 and 61 and gas-law Lessons 57 and 69 have no current course entries. Source inspection distinguishes mixture with fixed final volume, fixed stock, removal and dilution; gas problems distinguish constant pressure, constant temperature and combined laws with specified unknowns and rounding. Lesson 129 currently reads mean/SD from a supplied normal curve; source items 922–923 also require computing SD from data. Establish the intended population/sample convention before implementation. Geometry proofs must include production/rubrics, not only naming SAS/CPCTC. Nonlinear systems, three-equation systems, interval inequalities, vectors, polar forms and logarithms need their own exception/domain/representation checks.

## Exact reuse anchors and their limits

| Source/provider | Reuse | Remaining requirement |
|---|---|---|
| Algebra 1/2 node 766, relations-bank: bisector-construction | Compass/straightedge step reasoning | Draw and verify construction; perpendicular and perpendicular-bisector variants |
| Algebra 2 node 873, relations-bank: triangle-proof | SAS/CPCTC reasoning | Full proof production, other congruence cases and circle proofs |
| Algebra 2 node 921, relations-bank: normal-parameters | Read center and one-SD spacing | Compute SD from data (922–923), explicit convention |
| Algebra 2 node 701 | Bounded integer absolute-value solutions | General real solution intervals, boundary points and conjunction/disjunction |
| Algebra 2 nodes 483, 442, 573 | Rectangular/polar conversion and force resultant | Course-specific quadrant, direction and rounded/exact demands |
| Algebra 2 node 450 | Symbolic rational formula rearrangement | Exceptional parameter values and each requested isolated variable |
| Algebra 2 node 695 | Fractional position between integer endpoints | Fractional endpoint variants 696–697 |
| Algebra 2 nodes 427–428, 490–493, 465–467, 532–533 | Contexts can reuse equation solving | New mixture/gas models, meaningful units, restrictions and requested methods |

The JSON backlog also supplies lexical reuse suggestions. These deliberately remain candidates; a title similarity is never recorded as verified coverage. Package module names indicate where to inspect implementation, not a promise that every demand is already supported.

## Ordered execution batches inside each large milestone

Milestone 2 is one user authorization covering all these internal checkpoints: (1) source aliases and course-specific constraints; (2) whole arithmetic/notation and missing numbers; (3) fraction/decimal/percent and models; (4) measurement/time/rate/context; (5) geometry/solids/construction; (6) data/probability/investigations; (7) course-wide gap closure and export verification. Both courses progress through shared providers together, while preserving their separate course constraints. Prioritize scope rows with no working entry, then close method/representation gaps in partially populated rows.

Milestone 3: reuse and adapt numerical foundations; then equations/graphs/inequalities; then geometry/finance/probability; finally Topics A–J and whole-course verification.

Milestone 4: expressions/polynomials; rational/radical/literal equations; systems and contextual models; functions/graphs/inequalities; geometry/data; then complete lesson-by-lesson closure and exports.

Milestone 5: Algebra 2 generator contracts first; algebra/radical/complex operations; nonlinear and three-variable systems; inequalities; logarithms/exponentials; trig/polar/vectors; mixtures/gas/relative motion; proofs/constructions/statistics. Each family gets independent arithmetic/domain tests before integration.

Milestone 6: integrate those families into all Algebra 2 lesson/source identities, complete method and representation variants, review all residual demands and outputs. Milestone 7: cross-course regression, deduplication review and consolidated packaging. Physical-device acceptance and deployment remain separately reported stages.

No internal checkpoint requires another proceed instruction. Stop only for a genuinely blocking source ambiguity or execution/access limit; save completed work and the exact next source IDs first. No promise of indefinite background execution is implied.

## Acceptance contract

For each demand: record given/unknown, mathematical action, allowed values, representations, required method, accepted answer forms, domain/rounding rules and teacher rubric where needed. A lesson closes only when all its demands have verified providers or a clearly justified source-alias disposition. Blank/title-only source labels must be reconciled using linked item titles/content; never invent missing objectives. Generic labels such as Summary, Lesson A/B and Properties and definitions remain containers whose linked items define their scope. Contrived Problems has no separately titled linked item in the recovered Lesson 36; preserve the heading without fabricating an extra family.

Reuse is accepted only after comparing those contracts; source repetition is preserved as lesson metadata. A generator must produce varied valid cases, pass independently computed ordinary and boundary cases, and preserve question/key identity through Studio preview and export. Diagram validity and label layout are checked independently. Draw/construct/explain tasks retain teacher assessment. No finite test suite is described as exhaustive.

Verify the exact implementation checkpoint, then save the verified candidate. Keep implementation, verified checkpoint, release and deployment distinct. Each modified HTML gets a new version. Preserve the 502 working 8/7 entries, all 331 custom codes, canonical assessment mapping, existing 891 total entries, packet/session behavior and Engine ownership of mathematics.

## Source uncertainty and repetition

650 generator-bank records have only the unverified legacy choice convention. New original generators must derive keys independently; do not copy the presumed first choice. 2,395 records show detected visual dependencies; absence of that detector signal proves nothing about visual completeness. There are 417 identical extracted-prompt groups containing 2,036 records, including common template-only stems. They are review groups, not 417 proven interchangeable families. Never deduplicate by stripped text alone: inspect scripts, rich math, diagrams, answer and required method.

No additional user file is currently required to begin Milestone 2. Legacy-image/template ambiguities remain item-level tasks; recover their rich source or create an original task from a sufficiently clear curriculum demand. If the intended mathematical demand itself remains unclear, mark that specific item blocked rather than claiming a complete port. Exact reproduction of every publisher item is outside this curriculum-generator completion scope.

## Deliverables and reproducibility

- summary.json: counts, hashes, package acceptance criteria and source baselines.
- Five course Markdown backlogs: every indexed scope, entry counts and package routes.
- lesson-backlog.json.gz: every demand, linked existing providers and provisional reuse candidates.
- source-ledger.json.gz: all 4,636 record identities, lesson links, status and evidence flags.
- repetition-review.json.gz: exact extracted-prompt review groups.
- scripts/audit-remaining-courses.py: reproducible census against the private recovered archive and Studio source. Run with --studio, --recovery and --output paths; it emits uncompressed JSON for inspection.

Validation: all recovered hashes match; source IDs are unique and exactly reconcile to five base indexes; every source has a valid scope; all 389 working entries match the actual catalog; per-course totals reconcile; linked provider suggestions resolve; no application source/HTML changed. This is a completed audit and executable backlog, not a claim that the remaining courses are implemented or semantically verified.
