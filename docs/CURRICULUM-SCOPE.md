# Confirmed curriculum and packet scope

This decision supersedes broader or ambiguous scope statements in earlier design drafts.

- Math Engine supports expansion across all supplied courses. The adopted Mega Man v0.7 baseline remains the starting implementation.
- The 331 approved custom outcomes apply specifically to the local Grade 5 curriculum using Saxon 8/7. They are not a standards framework for other grades.
- GradeCam-driven differentiated packet creation is currently Grade 5 only. Additional grades require their curriculum leads to standardize outcome codes and approve mappings before enabling that workflow.
- Other courses can be developed from uploaded generator/ExamView evidence, organized by course, lesson, and question family. Any derived concise outcomes remain proposals, not approved standards.
- The observed 57 GradeCam standards are the six-test Q1 snapshot. Imports must discover recognized columns dynamically as the year progresses; 57 is not a hard-coded limit. The Grade 5 coverage target remains all 331 outcomes.
- Missing domain segments in GradeCam codes are acceptable when the remaining code resolves uniquely against the Grade 5 alias registry. Preserve the original imported code and canonical full code. Unknown or ambiguous codes require review.
- Keep an outcome absent from an export, a blank cell, a literal "-" value, and numeric zero distinguishable. Missing evidence must not become a zero score or an inferred weakness.
- Preserve every original lesson outcome. Shared generation or proposed deduplication must not silently combine student evidence across distinct outcomes.
- Product name: Test and Practice Studio. Publisher names remain source-provenance labels only.

## Responsibility split

Math Engine owns mathematical generation, source-informed parameter constraints, answer contracts, and solutions. Test and Practice Studio owns GradeCam import, teacher targeting, packet layout, and exports. Student identifiers do not belong in the engine or source repository.

## Acceptance conditions

Grade 5 imports accept additional recognized outcome columns without a fixed 57-column ceiling. Out-of-scope grades cannot enter the standards-driven differentiated packet workflow. Manual course/lesson practice remains a separate proposed capability. Source availability, outcome alignment, implementation, and mathematical verification are separate statuses.

This checkpoint records scope and source evidence; it does not claim that packet generation or new generator families are implemented.
