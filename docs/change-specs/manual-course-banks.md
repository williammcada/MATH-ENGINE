# Manual course banks — confirmed scope, 2026-10-08

Manual test/practice construction is required for every supplied course. Approved standards are optional for this workflow. This supersedes earlier descriptions of manual course practice as only proposed or deferred.

## Teacher workflow
1. Choose a course bank and available language/edition.
2. Browse lessons/investigations and preview individual questions.
3. Select lessons and/or specific questions; set quantities and available fixed/dynamic variants.
4. Arrange the selection and choose supported formatting, versions, and answer/key output.
5. Preview and export the test or practice sheet with matching answers.

A teacher can complete this workflow without GradeCam, students, approved standards or an outcome mapping. Standards-driven differentiated packets remain Grade 5 only until other curriculum leads approve codes and mappings. The 331-outcome registry must never become an import prerequisite for other courses.

## Import contract and readiness
Preserve course, edition, language, bank, lesson/section, original item ID, source hash and source location. Namespace IDs across courses and languages. Standards references may be empty. Keep fixed questions and dynamic generators distinct. Do not duplicate translated questions as new mathematical families.

Track metadata indexed, prompt decoded, math/diagram rendered, answer linked, generator implemented, and verified for use independently. Metadata-only entries can appear with an explicit unavailable-preview status, but cannot silently generate substitute questions. Missing standards do not block use; unresolved question/answer recovery does block use of that item. For ExamView, section-level co-occurrence is not proof of an individual item-to-lesson association.

## Supplied sources in scope
| Course bank | Recovered inventory | Current limitation |
| --- | --- | --- |
| 8/7, local Grade 5 | 789 items; 133 scope nodes | Legacy script/control and rich-object recovery incomplete; eight original engine families separately implemented |
| Algebra 1/2 | 624 items; 133 scope nodes | 622 script-bearing items; source recovery is not an executable port |
| Algebra 1 | 679 items; 120 scope nodes | 674 script-bearing items; source recovery is not an executable port |
| Algebra 2 | 592 items; 130 scope nodes | 559 script-bearing items; Lesson 128 has no recovered items |
| Course 1 | 12 English and 12 Spanish ExamView banks; 1,353 IDs per language | Partial text recovery; math, diagrams, answer and lesson associations need verification |
| Intermediate 4 | 12 English and 12 Spanish ExamView banks; 1,388 IDs per language | Partial text recovery; math, diagrams, answer and lesson associations need verification |

Course names identify source curricula; do not infer local grade assignments beyond the confirmed Grade 5 mapping. Publisher names belong in provenance, not product branding.

## Implementation order and acceptance
Import the course/lesson/item metadata first, then complete prompt/diagram/answer decoding and dynamic ports in tracked batches. Build the manual bank browser and selection/preview/export flow alongside that recovery; do not wait for other grades' standards. Connect standards-driven Grade 5 targeting as a separate entry path into the same composition workflow.

Verify selection boundaries, unavailable-item explanations, question/key consistency, language separation, deterministic dynamic variants, and exported math/layout. Acceptance includes creating a test from a non-Grade-5 bank with no standards mapping or GradeCam import.

This checkpoint updates requirements and source readiness. It does not claim a working bank browser, fully imported playable banks, or exports.
