# Milestone 2 verification — Intermediate 4 and Course 1

Completed 2026-10-09 as a verified GitHub checkpoint. No deployment or release publication was performed.

Intermediate 4 now has 260 working entries (92 retained + 168 new). Course 1 has 277 (45 retained + 232 new). All 891 previous working entries remain; total 1,291. The 502-entry 8/7 bank is retained unchanged. Algebra 1/2, Algebra 1 and Algebra 2 remain at their prior counts.

## Scope and limits

400 original authored task entries cover all 268 populated indexed lesson/investigation scope rows. All 269 source identities are accounted for: one truncated, empty Course 1 Lesson 22 alias points to the recovered populated lesson. Intermediate 4 duplicate Lesson 35 source identities remain distinct. Explicit final mapping and task titles are in `coverage.json`, `lesson-plan-source.json` and the per-course coverage reports in MATH-ENGINE's milestone2-v0.1 folder.

Completion means the documented representative curriculum tasks are implemented and checked. It does not mean all legacy publisher questions were ported, all possible variants exhaustively tested, or every outcome certified. Runtime `fullOutcomeVerified` remains false deliberately. Source previews remain separate from working generators. Methods involving construction, diagrams, models, surveys and explanations retain teacher review rather than being reduced to numerical substitutes. Standards codes are not required for these course banks. GradeCam remains within its existing Grade 5 scope.

## Verification performed

- 19,200 cases: all 400 new entries at 48 deterministic variants each; replay, frozen data, rendering, provenance, answer contracts, invalid-answer rejection and teacher-review behavior.
- Independent Python arithmetic/geometry/unit oracles: 7,024 numeric cases across 107 recipes; 336 text cases. Another 3,440 cases check teacher contracts, not the correctness of arbitrary student drawings.
- Retained-bank parity: all 891 original entries, three variants each (2,673), preserved catalog, question content, answers and rendered output apart from version metadata. Existing mathematical providers were not rewritten.
- 9,240 packet layouts on the final rc.2 candidate; no layout failures.
- Studio core, Phase 3 core, Phase 2 delivery, Phase 3 browser and Milestone 2 browser tests passed. Includes both course selectors, task preview/search, mixed-course selection, student/key isolation, save/load replay, narrow viewport, CSV targeting, scale preservation and clear/cancel/undo.
- Actual mixed-course exports: A4 student and Letter key. All nine Chromium PDF pages and seven LibreOffice-rendered Word pages were visually inspected; readable diagrams and aligned answers, no clipping found. Different Word/PDF pagination is expected.

Windows Microsoft Word, iPad Safari and physical printer checks were not performed. Construction tasks may need additional workspace or separate paper; on-screen rulers are not physical measurement scales.

## Corrections made during implementation

Bank-scoped IDs prevent duplicate Lesson 35 collisions. Intermediate 4 equation/root ranges were tightened to the course level. Fraction-chart arithmetic, tax plus total, fraction/decimal/percent conversion, circle parts, quadrilateral angles, calendar boundaries, quotient zeros and shaded-area estimation have explicit tasks. Studio's former assumption that every authored entry belonged to the 8/7 assessment map was removed for the new banks.

## Reproduce and resume

Run `node tests/milestone2.cjs` in MATH-ENGINE, then `python tests/milestone2-audit.py` using its generated sample file. Studio browser tests use Playwright with a Chromium executable. Detailed counts, exact implementation commits, HTML SHA-256 and runtime file hashes are in `milestone2-verification.json`. The final checkpoint adds only evidence and documentation to those tested implementation trees.

Milestone 3 is Algebra 1/2 and is not started by this checkpoint.
