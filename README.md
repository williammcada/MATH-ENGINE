# Math Engine

A WILLIAM MCADA PRODUCT

## Official current baseline
Owner-approved on 2026-10-08: the mathematics bundle extracted unchanged from **Mega-Man-2-Math-Mode-v0.7.html** is the official starting baseline. MATH-ENGINE is the canonical repository for future shared mathematics development.

Status: **implementation checkpoint**, package 0.1.0-baseline.1. This is a preserved compiled baseline, not a fully verified release or a completed reusable-package refactor.

- [Preserved bundle](baselines/megaman-v0.7/shared-math.js)
- [Provenance and SHA-256](baselines/megaman-v0.7/provenance.json)
- [Baseline decision and comparison](docs/change-specs/v0.1.0-megaman-baseline.md)
- [Project brief](docs/PROJECT-BRIEF.md)

312 selectable skills; the compared GitHub Mega Man bundle has 240. All 240 older IDs remain. Browser global: SharedMath. Existing generation uses Math.random; a seeded generation API is not yet implemented. Run npm test for limited baseline smoke checks.

The snapshot preserves the existing settings and generic practice/session code together with the catalog and answer checking. It excludes the emulator, ROM, Mega Man host controls and stage/death/boss trigger hooks. Source-module recovery and separating reusable core from optional practice UI are future work. Existing games have not been migrated or redeployed.

## Custom Grade 5 coverage map

[Coverage audit v0.1](curriculum/mcada-g5/v0.1/README.md) covers all 331 supplied outcomes, including all 57 GradeCam codes. Domain segments remain metadata and are ignored for matching. Includes CSV, JSON and generator evidence. This is a design audit, not independent mathematical verification.

## Current source-alignment checkpoint

[Grade 5 map v0.2](curriculum/mcada-g5/v0.2/README.md) adds a first-pass source-task review of all 331 outcomes: 142 with task evidence, 134 requiring adaptation, 44 unresolved source cases and 11 with no usable match established in this review. It preserves engine coverage as a separate layer. [First generator contracts](curriculum/mcada-g5/v0.2/FIRST-GENERATOR-CONTRACTS.md) define the next implementation slice; no new generators are implemented by this data checkpoint.

GradeCam-driven differentiated packets remain Grade 5 only. The 57 observed standards represent the six-test Q1 snapshot and are not a fixed importer or curriculum limit. Other courses remain organized by recovered course/lesson/question evidence pending approved standards.
