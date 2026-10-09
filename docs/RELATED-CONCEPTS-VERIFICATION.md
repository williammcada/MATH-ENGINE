# Related concepts v0.1 verification

Verified 2026-10-09. Engine 0.33.0-rc.1 and Studio 0.35.0-rc.1 implement whole-curriculum concept discovery at the existing working-entry scope. Saved on review branches; no main merge or deployment.

## Exact candidates

- Engine implementation: a1484d714bba3790a8c228fc69b9ae7174135068 (local equivalent c2998dc).
- Studio implementation: 9d13f0961dbb5248f4a7e35c0cf05af5b8204c4b (local equivalent d354103).
- Download: downloads/Test-and-Practice-Studio-v0.35.0-rc.1.html, 5,892,859 bytes.
- SHA-256: 7756be0f18011fe6ac4cc35cbd59c3b45fe7a436f90318b6f9944b27ec55527b.
- Baselines: Engine c886ff55975c4fa32d2fc08a811f006f517fe5e9 and Studio 8a2054285e2e74824489ad24ba0c77a17c291df1.
- Handbook fd4330863f4cc0812180fbf1de122970a42c7885; AI-START-HERE, UNIVERSAL-RULES, CONDITIONAL-STANDARDS S-02/S-04 and RELEASE-CHECKLIST.

## Scope and interpretation

All 2,184 entries and 1,539 canonical providers have concept assignments. The vocabulary contains 66 broad strands, 392 inherited reviewed path focuses and 17 explicit focuses for formerly topic-only contracts: 475 in total. The 164 curated concept links express supporting ideas, applications and representations with mathematical reasons and limits. Repeated providers inherit identical tags while every lesson occurrence remains selectable.

This is reconciliation of prior provider/track evidence with a new concept graph, not a fresh full executable audit of all generators. Broad strand connections are labeled separately from shared focus. Connections are symmetric and one-hop; they do not reverse or alter prerequisites, imply equal demand, infer student mastery, or rank by course. All previous progression modules and mathematics generator modules are unchanged. All 331 Grade 5 code mappings remain intact.

| Course | Working entries | Distinct providers within course |
|---|---:|---:|
| Intermediate 4 / Grade 3 | 260 | 256 |
| Course 1 / Grade 4 | 278 | 267 |
| 8/7 / Grade 5 | 503 | 503 |
| Algebra 1/2 | 378 | 363 |
| Algebra 1 | 309 | 290 |
| Algebra 2 | 456 | 417 |

Provider counts overlap across courses. Complete assignment does not claim exhaustive publisher variants or every possible mathematical relationship. No recorded connection is distinct from a missing assignment. No working task mapped to a concept does not establish that the curriculum lacks the concept.

## Passed checks

Evidence is in docs/verification/related-concepts/ in both repositories.

- Every entry has strand/focus assignments; no unknown or unused concept/edge endpoints. All 1,183,491 unordered distinct-provider pairs give symmetric discovery results; 121,380 have a recorded connection, including broad strands.
- All 2,184 starting entries pass complete pagination with no duplicate or silently omitted provider; the largest result contains 467 distinct providers. Course counts reconcile to all working entries.
- All 8,736 seeded generation cases match Chunk 4, excluding the intentional runtime version increment. Catalog, assessment map and all old source modules except the API entry point remain byte-for-byte unchanged.
- GCF/HCF, prime factorisation, Pythagoras and SOHCAHTOA searches work. Pythagorean-to-ordinal is a negative case. Invalid IDs and filters reject explicitly.
- The exact standalone download passes teacher entry from preview, earlier/later/specific-course filters, empty results, reverse discovery, preview-origin preservation, repeated-provider display, batch selection across filters/pages, clear selection, add/remove and undo.
- Browser pagination exercises 299 distinct generators over thirteen pages. Existing Difficulty / Progression remains separately available and the retained perimeter harder connection passes.
- Six-course selections survive draft download and packet replay. Representative A4 student and key exports each contain six questions and two PDF pages; Word renders to two pages each. All four PDF and four rendered Word pages were visually inspected. DOCX checks confirm six questions and zero student/six key answers.
- Exact-download parity passes for all 2,184 browser/Node questions (only SVG decimals normalized to nine places); all 67 vendored modules match the canonical checkpoint, all 256 sampled perimeter labels stay within bounds, and the prior download is unchanged.
- Desktop and 390px viewport checked; no horizontal overflow. Studio core, Phase 3 core and Phase 3 XLSX import checks pass.
- Deterministic concept-map rebuild leaves tracked files unchanged.

The Grade 5 Pythagorean entry MCADA-99.1 now discovers 5 Grade 3, 14 Grade 4, 24 other Grade 5, 24 Algebra 1/2, 21 Algebra 1 and 41 Algebra 2 lesson occurrences before repeated-generator grouping. These include supporting or broader connections; they are not all Pythagorean problem variants. Algebra 1 common-monomial factoring can discover Grade 5 prime-factor work.

## Limits and reproduction

Automated browser environment: Chromium 153.0.8010.0 on Linux. Word inspection uses bundled LibreOffice. Physical Windows Word, iPad and printer checks are not claimed. Export renderers were not modified, so this release verifies representative new selections rather than re-auditing every historical layout.

Run Engine tests/related-concepts.cjs with the preserved sibling chunk4-engine checkout at e05308c. Run Studio tests/related-concepts-browser.cjs and tests/related-concepts-delivery.cjs with PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE_PATH configured. The first parity attempt correctly exposed the intended version metadata difference; normalization now excludes only that field. The adapted delivery test must wait for the visible concept control rather than the now-hidden progression control.

The implementation is ready for teacher review from the preserved download. No additional feature work is required to complete this defined v0.1 scope. Future curriculum additions must receive concept assignments and evidence; new semantic links can be added without changing difficulty judgments. Do not rebuild from older main branches.
