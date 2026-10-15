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

## Proposed retirements

None yet.
