# Phase 1 verification — Introduction to PreAlgebra (8/7)

Date: 2026-10-08. Engine v0.20.0-rc.2; Studio v0.21.0-rc.2. Handbook fd4330863f4cc0812180fbf1de122970a42c7885; S-02 and S-04 apply. Owner authorized completing phase 1 autonomously.

## Result and scope

Phase 1 content implementation is complete: 340 added tasks plus 30 retained foundations tasks. All 331 approved Grade 5 codes have an explicit authored task, preserving domain-less GradeCam aliases. Another 39 tasks cover uncoded Lessons 106–120, Investigations 10–12 and Appendix A. Every one of the 133 course sections has authored content. No approved code was invented for the later scopes.

The 8/7 bank has 502 working entries (132 source adaptations + 370 authored tasks); all six English banks total 891. The separate eight Grade 5 provider families are not included in these totals. The legacy inventory remains 5,425 records, of which 521 have source adaptations and 4,904 remain unadapted. Authored curriculum coverage is not a claim to recreate every publisher question.

Canonical generation, exact answers, worked references, rubrics and SVGs live in Math Engine. Studio consumes hash-pinned copies at Engine commit 8d06877b1d0ece263b7bc075b30fe8560c8bcf14. Studio implementation checkpoint 4bdba31c453c9495947c64dbd7355b5b896c1d9c contains the exact delivered runtime.

## Recorded checks

- `tests/curriculum87.cjs`: all 331 codes, aliases, 133 scopes, 39 uncoded entries, immutable unique IDs, strict fraction/decimal tuple formats, teacher-review boundaries and diagram invariants passed.
- `tests/curriculum87-audit.py`: 27,200 seeded instances across 340 new tasks. All 14,800 numeric instances matched independent Python Fraction/Decimal formulas. The other instances comprised 3,320 text responses (including independent data-dependent comparison/conversion checks) and 9,080 explicit teacher-review instances. Deterministic replay, rejection of malformed answers, reference/rubric presence and 6,454 parseable SVG models passed. This does not automatically grade drawings or certify a teacher's judgment.
- New references and method-specific rubrics were reviewed during implementation. Construction, explanation, graph drawing and required-method tasks require teacher review. Their checker returns null correctness plus `requiresTeacherReview`, even when submitted text matches the reference. Studio presents the review instructions and keeps worked-key diagrams within closed teacher details.
- Final Studio `tests/curriculum87-delivery.cjs`: all 340 new entries selectable and previewable, correct numeric checks, teacher-review guidance, hidden/open teacher diagrams, full code and alias search, lesson selection, seed/variant draft replay, original 789-record 8/7 source import and six retained bank previews passed. Browser: Chromium 153.0.8010.0, local file delivery, desktop and 390px viewport samples.
- `tests/curriculum87-layout.cjs`: 4,080 layouts at 320px content width passed page-overflow, SVG label-clipping and label-overlap checks, including teacher diagrams. Visual inspection of sampled cube nets, parallel-line diagrams, box plots and other task previews accompanied the geometric checks.
- Retained foundations: 5,400 independent mathematical cases and 360 parsed number-line diagrams passed. The final Studio also passed all 30 foundations previews, draft/source-import replay and 900 additional narrow layouts. Ten existing bank/representation contract suites passed after updating only their total-inventory assertions.
- Engine `npm test`: preserved Mega Man bundle hash/312 skills, 6,240 self-consistency smoke cases; eight Grade 5 families/8,000 independent mathematical cases; 18 original source contracts/18,000 independent checks passed. Studio `npm test` passed draft and source-content validation.
- All tracked files at both implementation checkpoints were compared with local Git blob hashes. No runtime differences or missing files. Earlier downloads remain unchanged.

Corrections made during verification: compound-interest cents scaling; explicit mixed response formats for fraction/decimal/percent tasks; repeating-decimal examples restricted to appropriate fractions; number-line and coordinate-label collision fixes. Earlier rc.1 remains an implementation checkpoint; rc.2 is the verified delivery.

## Delivery identity

`downloads/Test-and-Practice-Studio-v0.21.0-rc.2.html` matches `index.html` byte-for-byte. Size: 1,105,526 bytes. SHA-256: `e6769ad7f247c7f5ae8b39875ee099275a5d201ddff56240bd6307a06785eeeb`.

## Remaining phases

Phase 2: comprehensive objective breadth and variation review, cross-lesson deduplication and final curriculum acceptance. All 331 full-outcome acceptance and automatic-assignment flags remain false; bounded task availability does not establish exhaustive coverage. Phase 3: teacher test/practice output, GradeCam targeting, student packets and teacher keys, printing, Word/PDF and final delivery verification. Standards-driven differentiation stays Grade 5 only; all other English courses remain available for manual selection. No hosted deployment, physical-device certification or print/export completion is claimed.

Resume from `curriculum/mcada-g5/phase1-progress.json`, `phase1-contracts.json` and `focus-v0.3/coverage-audit.json`. Do not restart phase 1 or ask the owner to approve individual content batches again. The next agreed phase is curriculum review, not additional other-course expansion.
