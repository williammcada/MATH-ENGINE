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
