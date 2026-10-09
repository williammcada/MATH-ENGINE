# Milestone 7 verification

Completed 2026-10-09. Engine 0.27.0-rc.2 and Studio 0.29.0-rc.2 provide teacher-directed cross-course discovery and mixed-bank selection. All seven curriculum milestones are complete at their documented representative scope. This checkpoint is a downloadable release candidate; it is not a hosted deployment or certification of every publisher item.

## Scope and coverage

All 2,184 working entries across six banks are classified into 66 topics with preserved course, lesson, source, outcome, response, representation and provider metadata. The Engine audit is in `curriculum/cross-course/v0.1`: explicit recipe rules, original generated samples, progression contracts and provider reuse review.

74 reviewed paths contain 464 entries. Some paths compare easier/harder demands, some express prerequisites/extensions, and others deliberately remain related-only. The other 1,720 entries have topic links without a validated pairwise difficulty ordering. No difficulty is inferred from course order, grade labels, title similarity or standard codes. Variant ranges can overlap; the relationships are instructional judgments, not psychometric calibration.

| Bank | Working entries | Entries in reviewed paths |
| --- | ---: | ---: |
| Intermediate 4 | 260 | 41 |
| Course 1 | 278 | 58 |
| Introduction to PreAlgebra 8/7 | 503 | 85 |
| Algebra 1/2 | 378 | 76 |
| Algebra 1 | 309 | 79 |
| Algebra 2 | 456 | 125 |
| Total | 2,184 | 464 |

381 groups explicitly share a canonical provider, covering 1,026 entries. Reuse is distinguished from same-scope and thematic relationships; no source or outcome is deleted and no learner evidence is merged. Draft warnings are advisory. There are 1,663 authored entries and 5,425 retained legacy previews.

Only 8/7 is confirmed as local Grade 5. Other courses show their textbook names with school grade unassigned. The Grade 4 label from the requested example cannot be applied to a course without owner metadata. The underlying example works in both directions: a Course 1 rectangle perimeter task connects to a new Grade 5 irregular quadrilateral with four labeled sides. The Course 1 entry reuses the existing rectangle provider. Both new entries are manually selectable with no added standards codes.

## Teacher workflow

The topic explorer and Find related tasks action offer easier, harder, same-scope, prerequisite, extension, related and shared-provider filters. Each suggestion retains source course, confirmed grade, lesson and a reason. Teachers preview and add tasks explicitly; existing selections remain, with remove and undo. Empty or unranked comparisons are explained. Mixed-bank draft/session replay and worksheet/key exports remain available. GradeCam targeting still uses only the 331 Grade 5 custom outcomes.

## Verification

Engine tests passed 3,406 relationship comparisons, 256 independently checked new perimeter cases, and 6,546 retained-generation comparisons across all 2,182 previous entries. Reference integrity, reversibility, provider exclusions, unranked behavior and deterministic ordering passed.

The exact downloaded HTML passed the perimeter upward/downward workflow, mixed-bank preview/add/remove/undo, empty filters, shared-provider warnings, draft download and packet/session replay. A 12-task packet spans all six banks. The A4 one-column student PDF has five pages; the Letter two-column key has four. Both Word files render to three pages each. All nine PDF pages and six rendered Word pages were visually reviewed. A clipped new diagram label found in rc.1 was corrected before final delivery; 256 SVG label bounds now pass. No student answers leak into student output.

The final authored layout matrix passed 19,956 cases across A4/Letter, one/two columns and student/key/study modes. Core and GradeCam browser regression passed, including zero/missing evidence, unknown-code review, scaling, recovery and exports. Narrow-viewport overflow checks passed.

All 65 vendored modules match their pinned canonical Engine files byte for byte. All 2,184 generated browser questions match Node output; SVG coordinate decimals alone are normalized to nine places to allow browser/Node trigonometric rounding. Answers and other fields are exact. The prior 0.28.0-rc.2 download remains unchanged. Detailed hashes, tested implementation commits and export evidence are in `milestone7-verification.json`.

## Practical limits and follow-up

The banks provide representative original curriculum tasks, not exhaustive publisher reconstruction. Full-outcome and exact-legacy verification flags remain false. Method, proof, construction and graph tasks retain teacher review. Finite seeds do not prove every possible variant. Native Windows Word, physical iPad and printer acceptance remain separate, as does hosted deployment.

No milestone remains queued. Optional future improvements are assigning the remaining local school grades from owner confirmation and extending reviewed task comparisons from the explicitly unranked ledger. The current feature does not claim a total difficulty ordering.
