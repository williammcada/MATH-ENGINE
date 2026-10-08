# Phase 2 verification — Introduction to PreAlgebra (8/7)

Completed 2026-10-09 (Asia/Shanghai). Engine **0.21.0-rc.2**, Studio **0.22.0-rc.2**.

## Source and acceptance

Baselines were Engine 09103c407081b73e7642606c1d685862869a3bae and Studio f4d60ded9c9acfd2d291c468de6c727502569c13. Consulted both project briefs, the approved 8/7-first and phase-1 specifications, and handbook fd4330863f4cc0812180fbf1de122970a42c7885: AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md S-02/S-04 and RELEASE-CHECKLIST.md. No handbook edits were made.

All 331 original coded outcomes and 39 uncoded course tasks were reviewed against the actual generator branches, prompts, references and response demands. The row-level review preserves original wording, lesson IDs, full standard codes and GradeCam aliases. Each is accepted at its **documented finite representative course scope**. This does not claim every conceivable variant or restoration of every publisher item. `curriculumCoverageAccepted` is a content review decision; runtime `fullOutcomeVerified` remains false because one answer is not evidence of mastery of an entire outcome.

Expanded 66 task families. Changes include equivalent-fraction distractors, reverse conversions, multiple polygon perimeters, two/three-number LCM, all proportion unknown positions, non-right triangle heights, graph interpretation, mixed measurements, operation precedence, missing function inputs, prism/pyramid classification, percent unknowns and change problems, transformations, right-solid volume/surface area, all quadrants/axes, odd/even statistics and multiple/no modes, and discrete/continuous graph domains. Angle-estimation tolerance is now stated to the student. Mixed-number entries in heterogeneous response tuples were corrected. Numeric statistics retain automatic checking; constructions, explanations and required methods remain teacher reviewed.

## Canonical assessment layer

The 370 authored task records map to 366 canonical facets, with 19 facets shared by multiple source records. Broad outcomes can have multiple facets: for example full fraction/decimal/percent equivalence reuses earlier directional conversions. Equal scope, partial overlap and related-but-distinct methods are separated. Prime factorization, factor-tree production and division-by-primes are not silently interchangeable. Every source task remains selectable; the Studio displays shared-coverage notices without deleting selections. The Engine owns lookup/overlap logic and the mathematical extensions.

All 502 working 8/7 entries, 891 English-bank entries, 133 course sections, 5,425 source records, earlier downloadable artifacts and the preserved Mega Man baseline remain. Other-course expansion stays paused. Automatic GradeCam assignment remains false pending phase 3.

## Exact tested implementation

- Engine implementation **de4a89a89c1355d8abf0b7b702c1921693ab753d**, tree 8734324a572a0a34e35c72544db8ae0907be4e9a.
- Studio implementation **e987ad1dab02854c5f12b89cf84d586206c003c5**, tree f39449f76313fc55121f5bd65c6a6006ab377b75.
- Both remote tree hashes match local Git tree hashes. Studio pins the Engine implementation and SHA-256 of every included module.
- `index.html` and the versioned download are byte-identical: 1,301,942 bytes, SHA-256 **36ec1dc1bf79c887250303a5628b68067f1ad0a1261ff5a9b32fcc5e4ad48090**.
- Final bookkeeping changes only reports, progress, README/brief, the review builder’s verified-input status check, and the test's expected existing title suffix. Runtime and HTML remain exactly those tested. This is a verified implementation checkpoint, not a deployed release.

## Checks actually run

| Check | Result | Evidence |
| --- | --- | --- |
| Row/source preservation, aliases, canonical overlap and method distinctions | Passed | `tests/phase2-review.cjs`: 331 coded + 39 manual rows; explicit reachability checks for 38 branching families; immutable map; unknown codes rejected |
| Independent mathematics and response contracts | Passed | `tests/phase2-audit.py`: 57,120 instances across 340 tasks; 30,576 numeric instances checked by independent Python Fraction/standard-library formulas; 7,140 text instances; 19,404 teacher-review boundary instances; 13,188 parseable SVGs |
| Retained foundations | Passed | 5,400 independently checked instances, 360 parsed number lines, all operation/property/divisibility branches and 15 place-value lengths |
| Existing Engine checks | Passed | `npm test`, `tests/curriculum87.cjs`: 8,000 independent Grade 5 cases, 18,000 independent original-source cases; 6,240 baseline self-consistency smoke checks are not independent math proof |
| Exact Studio browser workflow | Passed | `curriculum87-delivery.cjs` and `foundations87-delivery.cjs`: all 370 authored previews, six retained bank previews, answer checks, teacher-key isolation, standard/alias search, lesson selection, seed/index draft replay and delivery/version parity |
| Source import identity | Passed, bounded | Synthetic 789-record legacy import validation. External recovered source bodies were not reloaded in this turn; no new publisher extraction claim |
| New curriculum and overlap UI | Passed | `phase2-delivery.cjs`: shared/partial overlap, removal updates, unchanged selections, distinct methods, scope details, multi/no-mode checking, no page errors |
| Layout and visual QA | Passed | 4,080 curriculum layouts plus 900 foundations layouts; no page overflow or SVG label clipping/collision. Inspected narrow previews and `phase2-visual.png` |
| Studio core draft validation | Passed | `npm test` |
| Physical iPad/iPhone, printing, Word/PDF, hosted deployment | Not run | Outside phase 2; no claim of device/export/deployment readiness |

Browser: Chromium 153.0.8010.0, local files, desktop and 390-pixel viewport; Node 24.19.0. The first targeted UI test expected a title without the pre-existing “English banks” suffix; its assertion was corrected to the actual required title, then rerun successfully. Earlier candidate rc.1 was preserved. The browser initially needed a user-space package because the standard download was unavailable; the actual successful Chromium version is recorded above.

## Resume

Use Engine `curriculum/mcada-g5/phase2-progress.json`, `phase2-v0.1/coverage-review.json`, `src/curriculum87-assessment.js`, and Studio's pinned vendor manifest. **Do not restart phases 1 or 2.** Next is phase 3: complete teacher test/practice output, student packets/teacher keys, GradeCam targeting and printing/Word/PDF verification. Preserve the source lesson layer; balance canonical facets and retain required methods when selecting questions. A reported student percentage alone is not a mastery diagnosis. No new approval is needed for already-authorized ordinary implementation, but this phase-2 request does not authorize deployment.
