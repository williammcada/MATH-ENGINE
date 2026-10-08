# Current candidate v0.5.0-rc.1

Course display: **Introduction to PreAlgebra (8/7)**. 29 additional linear-equation adaptations bring working source entries to 147 of 5,425. Fractional coefficients, decimals, brackets and variables on both sides use exact rational solutions. See docs/change-specs/v0.5.0-linear-equations.md. Prior states below are historical.

# Math Engine

## Current implementation candidate — 0.2.0-rc.1

Eight seeded Grade 5 task families now implement the first saved contracts, with exact answers, worked solutions, representation/unit checks and teacher work criteria. [API and scope](docs/GRADE5-API.md) · [Browser review page source](review/grade5.html) · [Implementation specification](docs/change-specs/v0.2.0-grade5-generators.md).

Download the repository and open `review/grade5.html` to try it locally. This is an additive provider; the preserved game bundle and existing game hosts are unchanged. No GradeCam packet workflow, Word/PDF export, automatic assignment, release or deployment is claimed. [Verification results](docs/GRADE5-VERIFICATION.md) record 8,000 independently checked generated questions and the local Chromium review workflow against the exact tested checkpoint. Physical-device checks and consumer integration remain pending.

A WILLIAM MCADA PRODUCT

## Official current baseline
Owner-approved on 2026-10-08: the mathematics bundle extracted unchanged from **Mega-Man-2-Math-Mode-v0.7.html** is the official starting baseline. MATH-ENGINE is the canonical repository for future shared mathematics development.

Preserved baseline checkpoint: 0.1.0-baseline.1. This is a preserved compiled baseline, not a fully verified release or a completed reusable-package refactor.

- [Preserved bundle](baselines/megaman-v0.7/shared-math.js)
- [Provenance and SHA-256](baselines/megaman-v0.7/provenance.json)
- [Baseline decision and comparison](docs/change-specs/v0.1.0-megaman-baseline.md)
- [Project brief](docs/PROJECT-BRIEF.md)

312 selectable skills; the compared GitHub Mega Man bundle has 240. All 240 older IDs remain. Browser global: SharedMath. Existing generation uses Math.random; a seeded generation API is not yet implemented. Run npm test for the limited baseline smoke checks and the additive Grade 5 provider tests.

The snapshot preserves the existing settings and generic practice/session code together with the catalog and answer checking. It excludes the emulator, ROM, Mega Man host controls and stage/death/boss trigger hooks. Source-module recovery and separating reusable core from optional practice UI are future work. Existing games have not been migrated or redeployed.

## Custom Grade 5 coverage map

[Coverage audit v0.1](curriculum/mcada-g5/v0.1/README.md) covers all 331 supplied outcomes, including all 57 GradeCam codes. Domain segments remain metadata and are ignored for matching. Includes CSV, JSON and generator evidence. This is a design audit, not independent mathematical verification.

## Current source-alignment checkpoint

[Grade 5 map v0.2](curriculum/mcada-g5/v0.2/README.md) adds a first-pass source-task review of all 331 outcomes: 142 with task evidence, 134 requiring adaptation, 44 unresolved source cases and 11 with no usable match established in this review. It preserves engine coverage as a separate layer. [First generator contracts](curriculum/mcada-g5/v0.2/FIRST-GENERATOR-CONTRACTS.md) define the next implementation slice; no new generators are implemented by this data checkpoint.

GradeCam-driven differentiated packets remain Grade 5 only. The 57 observed standards represent the six-test Q1 snapshot and are not a fixed importer or curriculum limit. Other courses remain organized by recovered course/lesson/question evidence pending approved standards.
