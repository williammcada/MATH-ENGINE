# Foundations 8/7 verification — 2026-10-08

Tested runtime: Engine v0.19.0-rc.2, commit 219d13b547d5c40c8594565306ee102e38908408; Studio v0.20.0-rc.2, commit 11d61ec049df6bde304f117409149462ad860a22. These implementation checkpoints preceded extended checks. Earlier RC1 is preserved; RC2 adds explicit zero tasks and singular-cent wording.

Exact delivery: Test-and-Practice-Studio-v0.20.0-rc.2.html, 802,159 bytes, SHA256 93c6cdb4815bb766e27cd20323f6d472713df6db443eb9f78c9d0faf29b53309. Index/download parity passed. GitHub download fetched at the tested Studio commit equals the tested local bytes. All vendor files equal the canonical Engine files and the recorded per-file hashes.

## Passed

- foundations87-audit.py: 5,400 independent rational/integer cases; every operation and unknown position, all property and counterexample branches, all eight divisibility rules with both truth values, all 15 whole-number lengths and explicit zero cases. Independently parsed English words, evaluated property equalities and checked complete factor lists. Parsed 360 number-line SVGs and verified positions/direction.
- foundations87.cjs: all 30 exact custom outcome/alias/lesson contracts, immutable records, invalid/malformed responses, required money symbols, reduced mixed-number forms, equivalent allowed equalities, required divisibility-rule evidence, expanded-form enforcement and 15-digit word boundaries.
- foundations87-delivery.cjs: all 30 authored tasks previewed, answered and selected through the actual standalone UI; one retained source task from each of six banks; full/domain-less outcome search; lesson filtering; default-closed teacher keys; new-ID seed/index draft download/clear/reopen; original 789-record 8/7 recovery file loaded without losing the 30-task draft. Synthetic missing/duplicate source-record imports rejected.
- 900 renderer layouts at 320px content width and 390px viewport: no page overflow or SVG text-label collision/clipping. Screenshots inspected for point ordering, signed movement and a student-written property example. Chromium 153.0.8010.0, local headless Playwright; physical-device tests not performed.
- 1,653 all-provider dispatch/check/render smoke cases across all 551 entries. These are self-consistency checks, not independent math evidence.
- Existing response/model boundary suites passed for proportional, measurement, statistics, geometry, breadth, advanced, representations, reasoning, relations, solids and algebra-review providers after catalog-count assertions were updated to 551.
- Coverage artifacts regenerate identically. All 331 original outcomes/codes/aliases are preserved; 30 authored contracts are linked explicitly. 151 outcomes now have candidates/components, including these contracts; 180 still have no linked working task. This is not a full-outcome completion percentage.

- Core regression on RC2 passed: unchanged 312-skill baseline smoke checks, 8,000 independently checked Grade 5 cases, 18,000 original course-bank math cases, and Studio draft/input tests.

## Meaning and limits

The bank has 551 working entries: 521 imported-source adaptations plus 30 original curriculum tasks. Introduction to PreAlgebra has 162: 132 source adaptations plus 30 authored tasks. The 5,425 original source records remain unchanged; 4,904 are still unintegrated. The separate eight Grade 5 families are not included in these bank-entry counts.

The 30 authored tasks address Lessons 1–6 using the bounded contracts in curriculum/mcada-g5/foundations87-v0.1.json. They do not by themselves certify every interpretation of a broad learning outcome, automatic differentiation, student worksheet output or complete 8/7 coverage. Property equality checking uses a declared bounded grammar. Other-course expansion remains paused. No student records entered source control. No print, Word/PDF, hosted deployment or physical-device verification claimed.

The full 551-entry browser loop was updated to support authored IDs but not rerun in this pass. The actual browser gate covers all new tasks, every retained course bank, modified catalog/search/import paths and draft replay; unchanged providers retain their earlier independent math/browser records.

Handbook consulted through connected GitHub: AI-START-HERE.md, UNIVERSAL-RULES.md and CONDITIONAL-STANDARDS.md S-02/S-04 at fd4330863f4cc0812180fbf1de122970a42c7885; current project briefs and approved 8/7-first specification read. Exact intake commits Engine 9636482d63da7a92ca70e9f9d90014cb9151eae3 and Studio 1ef9413ee1a725ee48bcdf3574f24a6a33355210 matched all local tracked bytes before edits.
