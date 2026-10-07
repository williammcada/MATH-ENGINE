# Recovered source inventory

The existing recovery workbook and Algebra package were read directly. The indices here contain source identifiers, locations and availability metadata, not publisher question banks or executable legacy scripts.

| Course | Scope nodes | Item records | Items with script text | Supplied tests | Stored test references |
| --- | ---: | ---: | ---: | ---: | ---: |
| Saxon 8/7 (local Grade 5) | 133 | 789 | 789 | 24 | 496 |
| Algebra 1 | 120 | 679 | 674 | 30 | 603 |
| Algebra 2 | 130 | 592 | 559 | 33 | 690 |
| Algebra 1/2 | 133 | 624 | 622 | 31 | 671 |

Counts were recalculated from the recovered workbook/JSON. Item records and stored test references are not counts of independently scored questions or verified generators. Algebra 2 scope 128 has no attached items.

The previously extracted ExamView sources additionally contain Course 1 and Intermediate 4 banks, each in English and Spanish. The prior extraction found 1,353 and 1,388 item IDs per language respectively. Translations must not be counted as additional mathematical families. Those sources remain partial text recovery with equation, diagram and answer-linkage work outstanding.

## Files and interpretation

- `saxon-87-source-index.json`: 789 distinct source IDs, exact workbook row locations and source-file digest.
- `algebra-source-index.json`: course-qualified item IDs, source node IDs, body offsets, script availability and package digest. IDs must be qualified by course; reuse across banks is possible.
- `g5-source-scope-links.json`: all 331 custom outcomes linked to the correspondingly named recovered scope. These are candidate navigation links, not semantic coverage classifications.

All 331 custom outcomes have a matching lesson/investigation label in the recovery. Source 8/7 also includes Lessons 106–120, Investigations 10–12 and Appendix Topic A; these do not automatically extend the approved Grade 5 outcome set.

## Coverage map integration

The existing `curriculum/mcada-g5/v0.1` audit measures current engine task coverage. Its Direct/Partial/Missing statuses are not legacy source availability. Any earlier suggestion that no usable 8/7 recovery was available is superseded by this inventory. Preserve the audit until objective-level comparisons justify individual revisions.

Next, inspect each candidate's full task, method, number relationships, rejection rules, answer form and required representation. A same-lesson link or keyword match does not establish full alignment. Recovered source scope informs original procedural families; custom outcomes control the required Grade 5 task.

The prior merged design highlights useful first review cases: G5 20.11 square area from perimeter (SXA10055); G5 9.6 mixed-operation fractions; G5 20.9/20.10 exponent laws; G5 20.12 rational square roots; G5 67.5 prism nets; and G5 27.3/27.4 distinct LCM methods. These are review targets, not newly verified generator contracts.

## Limits and checks

Script text is present, but legacy scripts have not been executed in this checkpoint. Equations and diagrams may remain embedded as legacy objects. Inspect complete source evidence before interpreting blank fragments as missing content. Do not infer parameter bounds from case selectors or ignore transformations of sampled values.

Structural checks: 789 unique 8/7 IDs; 331/331 same-scope links; Algebra counts recalculated from each course JSON; original source-file digests retained. No runtime engine changes, mathematical certification, release or deployment are claimed.
