# Intermediate 4 coverage: pending requests for the owner, v0.1

Started 2026-10-16 (Asia/Shanghai) on branch `claude/coverage-intermediate-4`.

The owner's instruction for the overnight Intermediate 4 run: a shared-file change is not made, and a record that should be retired is not retired. Each is written here, the affected records stay open, and the run continues. This replaces the "stop and ask" of `coverage-parallel-courses-v0.1.md` §e for this run only.

## Shared-file change requests

### R1. `scripts/read-examview.py`: keep the row breaks of stacked layouts

- **File:** `scripts/read-examview.py` (shared; used by Course 1 and Intermediate 4).
- **Change wanted:** in `runs()`, treat byte 0x0D inside a text run as a row break instead of the end of the run. For example, collect characters while `r[p] >= 0x20 or r[p] == 0x0d`, and print 0x0D as ` / `. Apply the same in the text after a variable reference.
- **Why:** stacked (column) arithmetic stores its rows as one text run separated by carriage returns. The reader stops at the first 0x0D, so the column 8, 4, 2, + 5 prints as "8 + 5" and the source key 19 looks wrong. Intermediate 4 has many column additions and subtractions.
- **Meanwhile:** the porting session reads those records with a private patched copy kept outside the repository. No records are held open by this.
- **Records affected:** none held open.

### R2. `scripts/read-examview.py`: report ExamView native drawing objects

- **File:** `scripts/read-examview.py` (shared).
- **Change wanted:** when a question's rich data has no bitmap but holds ExamView's native drawing records (shape names such as `rhombus`, `square`, `rectangle` followed by coordinates, stored as UTF-16 strings), print their shape names, coordinates and labels under a `drawing:` line.
- **Why:** several Intermediate 4 pictures (groups of shapes, boxes of dots, a circled number row, and later graphs) are native drawings, not bitmaps, so the reader shows nothing for them.
- **Meanwhile:** the session lists the UTF-16 strings privately to read the counts and labels. No records are held open by this.
- **Records affected:** none held open.

### R3. Let Intermediate 4 ports replace earlier structured adaptations

- **Files:** `tests/structured-bank-audit.py` (shared). Possibly also `curriculum/cross-course/v0.6/progressions.txt` if a replaced adaptation is selected there by recipe; none of the R3 records is.
- **Change wanted:** the audit expects exactly 94 entries in the families `structured-arithmetic` and `structured-equation` (line 42: `len(ids)==94`). Each Intermediate 4 record below that gets its port replaces one such entry, so the expected count falls by one per record. For the records below that are structured adaptations, the count falls by one each (see the family column). Its comment would add that these entries were replaced by Intermediate 4 port tasks and are audited by `tests/port-intermediate-4.cjs`. Alternatively the audit could count every structured entry that is not replaced by a port, so that later replacements need no edit.
- **Why:** the earlier adaptations show no addends in the prompt, offer no choices and use ranges unlike the source. The ports are faithful (source ranges, structure and named distractors).
- **Meanwhile:** the records stay covered-provisional, served by their earlier adaptations. The port recipes are written and tested in this course's module; once the owner approves, each record gets its task line with the replacement flag set.
- **Records affected (left as they are):**

| Record | Lesson | Earlier adaptation's family | Ready port (recipe, variant) |
|---|---|---|---|
| TX4_S01_00104 | 1 | structured-arithmetic | `i4-add-row`, `six` |
| TX4_S01_00106 | 1 | structured-arithmetic | `i4-add-row`, `seven` |
| TX4_S01_00110 | 1 | structured-arithmetic | `i4-add-row`, `seven` (or consolidate into 00106 once ported) |
| TX4_S01_00114 | 2 | structured-equation | `i4-missing-row`, `to-100` |
| TX4_S01_00116 | 2 | structured-equation | `i4-missing-row`, `big` |
| TX4_S01_00119 | 2 | structured-equation | `i4-missing-row`, `nine` |
| TX4_S02_00072 | 13 | structured-arithmetic | `i4-add-3digit`, `plus-2digit` |
| TX4_S02_00074 | 14 | structured-arithmetic | `i4-sub`, `tens-money` |
| TX4_S02_00125 | 14 | structured-arithmetic | `i4-sub`, `tens-money` (or consolidate into 00074 once ported) |
| TX4_S02_00078 | 15 | structured-arithmetic | `i4-sub`, `from-hundreds` |
| TX4_S02_00147 | 16 | structured-representations | `i4-expanded-form`, `products` |
| TX4_S02_00082 | 16 | structured-representations | `i4-expanded-form`, `products` (or consolidate into 00147 once ported) |
| TX4_S03_00076 | 23 | structured-representations | `i4-angle-name`, `type` |
| TX4_S03_00054 | 27 | structured-breadth | `i4-clock2`, `overnight` |

TX4_S01_00111 was on this list after Batch I4-1; Batch I4-3 consolidated it into the open-record port TX4_S02_00011.

For the two `structured-representations` records, `tests/representations-bank-audit.py` and `tests/representations-source-links.py` should be checked for the same kind of count before the replacement is made (the second already fails at the parallel-courses baseline).

The oracle for `i4-add-row` (removed from the test while it has no task, because the harness rejects an oracle with no task) is: the addends shown in the prompt match the parameters, and the key is their sum.

## Proposed retirements

None yet.
