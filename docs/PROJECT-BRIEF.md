> Future feature recorded 2026-10-09: after all curriculum banks are complete, Milestone 7 will analyze cross-grade connections and support teacher selection of harder/easier related tasks across banks. See [cross-grade feature note](change-specs/cross-grade-connections-v0.1.md). Planning only; not implemented.

> Current checkpoint (2026-10-09): Milestone 2 authorized by “Complete milestone 2” and completed. Intermediate 4: 260 working entries; Course 1: 277; 8/7: 502 retained. Engine 0.22.0-rc.2 / Studio 0.24.0-rc.2. See docs/MILESTONE2-VERIFICATION.md (or MILESTONE2-VERIFICATION.md from this docs folder). Next: Milestone 3, Algebra 1/2, not started. Earlier status sections below are historical.

# Remaining curricula — Milestone 1 audit complete

2026-10-09: audited all five remaining English banks: 4,636 source records, 652 indexed scope rows (650 populated), and 389 working entries. Saved demand/source ledgers, reuse candidates, source uncertainties, internal batches and completion criteria. [Audit and backlog](https://github.com/williammcada/MATH-ENGINE/blob/main/curriculum/remaining-courses/milestone1-v0.1/REVIEW.md). [Milestone specification](https://github.com/williammcada/MATH-ENGINE/blob/main/docs/change-specs/remaining-curricula-milestones-v0.1.md).

Next proposed milestone: finish Intermediate 4 and Course 1. Only Milestone 1 was authorized; implementation expansion remains paused. Engine 0.21.0-rc.2 and Studio 0.23.0-rc.6 are unchanged. Earlier checkpoints follow.

# Phase 3 complete — Studio v0.23.0-rc.6

Teacher packets, answer keys and study guides now support local GradeCam targeting, Word export, browser printing/Save as PDF and downloadable teacher sessions. The verified checkpoint passed 4,440 authored layout checks and review of 17 PDF pages plus 14 rendered Word pages. Engine runtime remains v0.21.0-rc.2 with all 52 vendored modules unchanged.

[Download Studio](https://github.com/williammcada/test-and-practice-studio/blob/main/downloads/Test-and-Practice-Studio-v0.23.0-rc.6.html) · [Quickstart](https://github.com/williammcada/test-and-practice-studio/blob/main/docs/PHASE3-QUICKSTART.md) · [Verification](https://github.com/williammcada/test-and-practice-studio/blob/main/docs/verification/phase3-87-v0.1.md).

Next: teacher acceptance on Windows, Microsoft Word and the intended printer. No deployment or physical-device certification is claimed. Other-course expansion remains paused. Earlier phase restrictions and next steps below are historical; resume from phase3-progress.json and the current quickstart.

Historical checkpoints follow.

# Phase 2 complete — v0.21.0-rc.2

All 331 custom 8/7 outcomes have passed the documented curriculum breadth/variation review; all 39 uncoded tasks were also reviewed. Expanded 66 task families and added canonical assessment facets with explicit duplicate/partial-overlap detection. Original codes, aliases and lesson history remain. Engine owns all mathematics and mapping; Studio flags shared coverage without changing selections.

502 working 8/7 entries, 891 across the six English banks, and all 133 8/7 sections remain. Acceptance is at the [documented representative scope](https://github.com/williammcada/MATH-ENGINE/blob/main/curriculum/mcada-g5/phase2-v0.1/COVERAGE-REVIEW.md), not exhaustive publisher reconstruction or learner mastery. [Verification](verification/phase2-87-v0.1.md) records independent math, exact Studio browser workflows and layout checks. Automatic assignment remains gated until phase 3. Other-course expansion remains paused.

Next: phase 3 teacher packets/keys, GradeCam targeting and printing/Word/PDF. No hosted deployment or physical-device certification is claimed. Resume from the saved phase-2 progress record; do not restart the content phase.

Historical checkpoints follow.

# Phase 1 complete — v0.20.0-rc.2

Introduction to PreAlgebra (8/7) now has 502 working entries: 132 source adaptations plus 370 authored curriculum tasks. All 331 coded outcomes have an explicit bounded task; 39 additional tasks cover the uncoded later lessons, investigations and appendix. All 133 course sections are represented. Math Engine owns the implementation; Studio provides selection and preview. Six English banks total 891 working entries.

[Phase 1 verification](verification/phase1-87-v0.1.md) records exact-math, response-contract, browser and layout checks. Phase 2 remains the comprehensive breadth/variation/deduplication review; phase 3 remains finished teacher output. Full-outcome and automatic-assignment flags are not promoted. Grade 5-only standards-driven differentiation and the pause on other-course expansion remain.

[Current coverage map](../curriculum/mcada-g5/focus-v0.3/COVERAGE-AUDIT.md).

Historical checkpoints follow.

# Current 8/7-first candidate — v0.19.0-rc.2

Added 30 authored curriculum tasks for the Lessons 1–6 outcomes. Introduction to PreAlgebra (8/7) now has 162 working bank entries: 132 imported-source adaptations plus 30 original tasks. All banks total 551 working entries; other-course expansion remains paused. [Specification](change-specs/foundations87-v0.1.md) · [Verification](verification/foundations87-v0.1.md). The 331-outcome inventory has 151 rows with working components/candidates and 180 without a linked task; these are not full coverage counts. Next: Lessons 7–10. No release/deployment or packet-output completion claim.

Historical checkpoints follow.

# Active priority — finish Introduction to PreAlgebra (8/7)

Owner approved 2026-10-08. Pause new content expansion of the other five courses; preserve their selectable banks. Complete the 331 Grade 5 outcomes and necessary lesson mappings before resuming broad expansion. [Approved scope and sequence](change-specs/grade5-first-v0.1.md). Runtime remains Engine v0.18.0-rc.1 / Studio v0.19.0-rc.1. Prior breadth checkpoints below are historical; none establishes full step-1 completion.

# Current candidate — v0.18.0-rc.1

16 more adaptations bring coverage to 521 / 5,425 English source records; 4,904 remain unintegrated. Added complex roots, polar coordinates, compound inequalities, symbolic formulas and protractor reading. [Specification](change-specs/v0.18.0-algebra-review.md) · [Verification](verification/v0.18.0-algebra-review.md). Independent math, source links, layout and all-entry UI checks passed. Broader step 1 remains open. Verified implementation only; no release/deployment. Grade 5-only differentiation retained. Historical states follow.

# Current candidate — v0.17.0-rc.1

16 more adaptations bring coverage to 505 / 5,425 English source records; 4,920 remain unintegrated. Added solid measurements, scales and number-representation arithmetic. [Specification](change-specs/v0.17.0-solids.md) · [Verification](verification/v0.17.0-solids.md). Independent math, source links, layout and all-entry UI checks passed. Broader step 1 remains open. Verified implementation only; no release/deployment. Grade 5-only differentiation retained. Historical states follow.

# Current candidate — v0.16.0-rc.2

17 more adaptations bring coverage to 489 / 5,425 English source records; 4,936 remain unintegrated. Added recovered equations, geometric reasoning and solution regions. [Specification](change-specs/v0.16.0-relations.md) · [Verification](verification/v0.16.0-relations.md). Independent math, source-link, layout and all-entry UI checks passed. Broader step 1 remains open. Verified implementation only; no release/deployment. Grade 5-only differentiation retained. Historical states follow.

# Current candidate — v0.15.0-rc.1

27 more adaptations bring coverage to 472 / 5,425 English source records; 4,953 remain unintegrated. Added radicals, logarithms, statistical displays and reasoning. [Specification](change-specs/v0.15.0-reasoning.md) · [Verification](verification/v0.15.0-reasoning.md). Independent math, source-link, layout and all-entry UI checks passed. Broader step 1 remains open. Verified implementation only; no release/deployment. Grade 5-only differentiation retained. Historical states follow.

# Current candidate — v0.14.0-rc.1

27 more adaptations bring coverage to 445 / 5,425 English source records; 4,980 remain unintegrated. Added charts, number representations, geometric classification and transformations. [Specification](change-specs/v0.14.0-representations.md) · [Verification](verification/v0.14.0-representations.md). Math, provenance, layout and all-entry UI checks passed. Broader step 1 remains open. Verified implementation only; no release/deployment. Grade 5-only differentiation retained. Historical states follow.

# Current candidate — v0.13.0-rc.2

23 additional Algebra 2 tasks bring coverage to 418 / 5,425 English source records; 5,007 remain unintegrated. Algebra 2 has 65 working entries. [Specification](change-specs/v0.13.0-advanced-breadth.md) · [Verification](verification/v0.13.0-advanced-breadth.md). Math, source-link and browser checks passed. Broader step 1 remains open. Verified implementation only; no release/deployment. Grade 5-only differentiation retained. Historical states follow.

# Current candidate — v0.12.0-rc.3

85 new entries across all six banks bring coverage to 395 / 5,425 English records; 5,030 remain unintegrated. Algebra 2 increases from 9 to 42 working entries. Shared generators add systems, complex numbers, functions with domains, number theory, graph choices, clocks and other reviewed tasks. [Specification](change-specs/v0.12.0-breadth.md) · [Verification](verification/v0.12.0-breadth.md). The recorded math/browser checks passed. The broader step-1 task-type expansion remains open; this checkpoint does not claim all distinct types are covered. Verified implementation only; no release/deployment. Grade 5-only differentiation retained. [Breadth and remaining gaps](BREADTH-COVERAGE-v0.12.0.md). Historical states follow.

# Current candidate — v0.11.0-rc.3

27 new geometry entries and shared SVG rendering bring coverage to 310 / 5,425 English records; 5,115 unintegrated. Introduction to PreAlgebra (8/7) now has 90 working entries. Diagrams include solids, polygons, circles, compound figures and coordinate point grids. [Specification](change-specs/v0.11.0-geometry.md) · [Verification](verification/v0.11.0-geometry.md). Recorded math, browser and label-layout checks passed. Verified implementation only; no release or deployment. Standards-driven differentiation remains Grade 5 only. Historical states follow.

# Current candidate — v0.10.0-rc.1

38 new statistics and probability entries bring coverage to 283 / 5,425 English records; 5,142 unintegrated. Introduction to PreAlgebra (8/7) now has 72 working entries. Exact arithmetic, explicit rounding, ordered multi-part answers and corrected card-event order. [Specification](change-specs/v0.10.0-statistics.md) · [Verification](verification/v0.10.0-statistics.md). Passed recorded checks; verified implementation only, no release/deployment. Grade 5 differentiation scope retained. Historical states follow.

# Current candidate — v0.9.0-rc.1

26 new measurement, rate and financial-arithmetic entries bring coverage to 245 / 5,425 English records; 5,180 unintegrated. Introduction to PreAlgebra (8/7) now has 60 working entries. Exact arithmetic and explicit final cent rounding. [Specification](change-specs/v0.9.0-measurement.md) · [Verification](verification/v0.9.0-measurement.md). Passed recorded checks; verified implementation only, no release/deployment. Grade 5 differentiation scope retained. Historical states follow.

# Current candidate — v0.8.0-rc.2

38 new fraction, ratio and percent entries bring coverage to 219 / 5,425 English records; 5,206 unintegrated. Introduction to PreAlgebra (8/7) now has 44 working entries. Required answer forms are enforced; recurring percentages use exact values. Passed recorded arithmetic and browser checks. [Specification](change-specs/v0.8.0-proportions.md) · [Verification](verification/v0.8.0-proportions.md). Verified implementation only; no release/deployment. Grade 5 differentiation scope retained. Historical states follow.

# Current candidate — v0.7.0-rc.1

18 new source-informed equation entries (12 affine, 6 domain-aware rational/radical) bring coverage to 181 / 5,425 English records; 5,244 unintegrated. Exact checks reject excluded denominators and extraneous roots; no-real-solution answer sets are explicit. [Specification](change-specs/v0.7.0-domain-equations.md). Passed the recorded domain-equation verification; no release/deployment. Existing course identity, IDs and Grade 5 differentiation scope retained. Historical states follow.

# Current candidate — v0.6.0-rc.1

16 additional quadratic tasks bring coverage to 163 implemented source-informed entries / 5,425 English records; 5,262 unintegrated. Exact real-root sets, repeated roots, radical equivalence, factoring/completing-square/formula steps and discriminant classification. [Specification](change-specs/v0.6.0-quadratics.md). Passed the recorded quadratic verification; no release or deployment. Course name, IDs and Grade 5-only differentiation remain unchanged. Historical states follow.

# Current candidate — v0.5.0-rc.1

Course 8/7 is now **Introduction to PreAlgebra (8/7)** with unchanged IDs and Grade 5 designation. Added 29 reviewed linear-equation adaptations: 15 Algebra 1 and 14 Algebra 1/2. 147 working entries; 5,278 remain unintegrated. Exact affine solving and MathML share the Engine implementation. Handbook fd4330863f4cc0812180fbf1de122970a42c7885. Passed the [recorded verification](verification/v0.5.0-linear-equations.md); no release or deployment. Historical entries follow.

# Current implementation candidate — 0.4.0-rc.1

Shared exact arithmetic/MathML templates add 100 source mappings; 118 total adaptations, 5,307 unintegrated. See [specification](change-specs/v0.4.0-structured-math.md). Historical inventory below remains a dated baseline.

# Full-bank inventory — v0.1

All 5,425 English source records have provisional task/rendering classifications. See [inventory](../curriculum/course-inventory/v0.1/README.md). This adds no usable questions; 18 adaptations remain implemented. Topic-only/multiple candidates require semantic review before implementation. Historical states follow.

# Current candidate — 0.3.1-rc.1

Eighteen mapped course-bank entries, including thirteen in 8/7; 5,407 source records remain unintegrated. See [scope](change-specs/v0.3.1-early-87-expansion.md). Earlier states below are historical.

# English bank integration — 0.3.0-rc.1

Spanish is removed from active scope. Six English banks contain 5,425 source records. src/course-banks.js implements the first six source-informed generator families, one per course; 5,419 records remain unsupported by this provider. See [specification](change-specs/v0.3-english-bank-generators.md). Existing eight Grade 5 families and Mega Man baseline remain unchanged. These are original adaptations with explicit scope limits, not reconstructed full banks. Studio consumes a pinned copy of this canonical module. Handbook revision 8fc5e3b6cd163278dd618081333f2264bf392db6 applies. This is an implementation checkpoint awaiting verification.

# Manual banks — confirmed requirement, 2026-10-08

All supplied courses must be available as selectable banks for teacher-built tests and practice by lesson and question. Missing standards must not gate this workflow. Only standards-driven differentiation remains Grade 5 restricted. See [manual bank specification](change-specs/manual-course-banks.md) for source readiness and acceptance criteria.

# Current implementation candidate — 0.2.0-rc.1

The first eight Grade 5 families are implemented as a seeded, stateless provider in src/grade5.js. See [API and scope](GRADE5-API.md) and [implementation specification](change-specs/v0.2.0-grade5-generators.md). The browser review page exercises generation, answer checks and teacher solutions; it is not the Studio packet application. Preserve the Mega Man v0.7 snapshot and existing hosts. The exact implementation checkpoint passed the [recorded engine and local-browser checks](GRADE5-VERIFICATION.md). Full curriculum coverage, physical-device verification and Word/PDF export remain pending. No automatic-assignment flag is promoted by this implementation.

# Current coverage checkpoint — 2026-10-08

[Source-alignment map v0.2](../curriculum/mcada-g5/v0.2/README.md) reviews all 331 Grade 5 outcomes and keeps source evidence separate from existing engine coverage. [Change specification](change-specs/v0.2-grade5-source-alignment.md) records this design/data checkpoint. Six initial generator design groups cover eight external outcomes, with recovered constraints distinguished from proposed extensions. Full numerical audits, new runtime implementation and end-to-end packet verification remain pending.

# Current curriculum scope

See [Confirmed curriculum and packet scope](CURRICULUM-SCOPE.md). GradeCam-driven differentiated packets are Grade 5 only; the 331 custom outcomes belong only to that curriculum. Engine expansion includes all supplied courses. The 57 observed standards are a growing Q1 snapshot, not a fixed scope.

# Current baseline decision — 2026-10-08

The owner approved adopting the current Mega Man v0.7 mathematics as the official baseline. The unchanged extracted bundle is preserved under baselines/megaman-v0.7; see its provenance manifest and docs/change-specs/v0.1.0-megaman-baseline.md. MATH-ENGINE is the canonical destination for future shared mathematics development. Existing host repositories are unchanged. This is an implementation checkpoint, not a verified release. It contains 312 skills, uses Math.random, and retains the existing shared settings/practice layer pending separation. The original design below is historical where it says no implementation is present or the baseline is undecided.

# Math Engine — project brief

## Identity and baseline
Owner: William McAda. Canonical repository: williammcada/MATH-ENGINE.
Initial source: README-only commit 5eed2b3da88299c6ea5fbb973755cda565c4768d. No implementation or approved change specification existed at intake on 2026-10-08.
Target: v0.1.0, design stage.

## Confirmed direction
Keep Math Engine separate from Test and Practice Studio. Reuse procedural generation for games and worksheets. The user's custom Saxon 8/7 outcomes define the relevant curriculum; do not substitute CCSS codes for those outcomes. Preserve lesson metadata and map recurring outcomes to canonical skills without deleting instructional history.

## Responsibilities and boundaries
Own skill identities, parameter constraints, seeded generation, mathematically structured prompts, answer contracts and solution information. Studio owns GradeCam import, student targeting, worksheet layout and exports. Engine should not need names, student IDs or GradeCam records.
Existing shared implementation identified by handbook: OLIVIA-MAGIC-BRACELET-QUEST/src/shared-math. Its exact current revision and the accepted Mega Man/Chrono variants must be inspected before selecting a migration baseline. No source has yet been copied, replaced or declared equivalent.

## Must retain
Selected skills must determine generated skills. Preserve valid mathematics, units, equivalent answers and explicit rounding. Preserve source provenance and original outcomes. Keep publisher bank content separate from original procedural implementation; extracted text is not a verified complete question bank.

## Devices and distribution
Proposed implementation: reusable browser-compatible JavaScript package and a versioned bundle for consumers. Exact packaging and supported environments remain design choices pending source inspection. No hosting method or deployment is established. No paid service is required by this design.

## Completion criteria
Before implementation: identify actual shared source commit and custom map revision; define a versioned consumer contract and first skill slice. Before release: verify seeded reproducibility, valid parameter boundaries, answer/solution consistency, unsupported-skill errors and a real consumer workflow. No current test results are claimed.

## Handbook baseline
Consulted mcada-project-handbook v0.1.3, commit c50115ba1fea9cb552f3ad1415e670a219118b56: AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md, PROJECT-TEMPLATE.md and RELEASE-CHECKLIST.md.
U-01–U-08 are seeded guidance, not globally ratified rules. Apply relevant mathematical clarity, validation, help, versioning, retention and verification principles here. U-09 is approved and applies when saved user work exists. U-10 is not applicable to this non-game scope. Select S-02 for curriculum/assessment and S-04 for eventual distribution. S-03-M identifies the existing shared game source for investigation; its game UI requirements are not imposed on Studio. S-01 external-AI roundtrips and unrelated game/assessment restrictions are not selected.

## Release workflow
DESIGN → CHANGE SPEC → IMPLEMENT → CHECKPOINT → VERIFY → VERIFIED CHECKPOINT → RELEASE → DEPLOY.
This commit documents design only. No executable implementation, verified release or deployment is claimed. Preserve the exact source before extended testing and the exact candidate that passes. Packaging failures must recover that candidate.
