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
