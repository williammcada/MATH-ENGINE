# Coverage programme — Course 1 phase: ExamView reading and batch plan, v0.1

Recorded 2026-10-14 (Asia/Shanghai). The owner's instruction is to finish the whole Saxon Course 1 set after 8/7 ("I don't care how long it takes"). This follows decision D3: Course 1 (Grade 4) comes after 8/7.

**Branch:** `claude/coverage-phase0`.
**Starting point:** Engine 0.46.1-rc.1.
**Protocol:** the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 applies unchanged. This document records what is different for Course 1.

## C1.0 What the Course 1 records are

**Size.** Course 1 has 1,353 English records in 132 lessons (120 lessons and 12 investigations):

- 1,308 are open;
- 45 are covered-provisional.

They are ExamView items, not generator scripts.

**Two kinds of record:**

| Kind | Count | What it is |
|---|---|---|
| Algorithmic | 589 (427 choice, 162 free response) | Algorithmic ExamView items. Each defines its variables and its answer and distractor formulas in a dynamic-data segment. |
| Fixed | 764 (181 choice, 583 free response) | Fixed questions |

**Embedded objects.** In 1,009 records, the question or the choices contain embedded objects, written ▣ in the reader. Most are ExamView's own math objects:

- text runs;
- variable references;
- layout templates: fractions, stacked arithmetic and long division.

97 records embed bitmaps, which are the diagrams.

## C1.1 Reading: `scripts/read-examview.py`

This is a new reader, original code, and it is committed. Like `read-source.py`:

- it reads the private ZIP after checking its SHA-256;
- it prints to the terminal only;
- it writes nothing into the repository.

**What it shows for each record:**

- the lesson;
- the question, with each object decoded underneath:
  - text runs;
  - `{variables}`;
  - `⟨Ta,b⟩` layout templates;
- the source key, and the answer objects for free response;
- every variable as `name := formula [sample value]`, together with the item's constraints.

Embedded bitmaps are written as PNG files only into a directory outside the repository, named by `EXAMVIEW_PICS`.

**What was learned about the format, from the supplied files:**

- **Rich question segment.** It has a header and a UTF-16 text in which 0x0F marks an object. The objects follow the text. Each object starts with a width, 5, width header.
- **Text run.** Tag 0x09, then three 32-bit words (offsets and flags), then characters up to the next control byte. Symbol-font characters are used for ×, ÷ and similar signs.
- **Variable reference.** Tag 0x0A, then a UTF-16 name.
- **Template.** `01 FF 7F 00 00`, then two 32-bit codes:

  | Code | Template |
  |---|---|
  | 2,1 | fraction |
  | 1,131077 | stacked arithmetic |
  | 1,458753 | long-division bracket |
  | 1,0 | row |

  The other codes are rare and are read per record.
- **Dynamic data.** Each variable is a record holding its name, its formula and a sample value, as UTF-16 strings. The functions used include:
  - `range(a, b, step)`, inclusive;
  - `rand(n)`;
  - `choose(i, …)`;
  - `if(c, a, b)`;
  - `str()`, `floor()`;
  - `isunique(…)`.

  Constraints are written as conditions. `scramble` shuffles the choice positions. The distractors `r1`–`r3` are written as formulas. Each one names a mistake implicitly, for example "correct + 0.1" for a regrouping slip.

## C1.2 How Course 1 records are ported

The approach is the same as for 8/7:

- **Original Engine generators**, informed by the source. No publisher text or values are committed.
- **Algorithmic items.** The generator uses the item's own variable ranges and constraints. Its distractors come from the item's distractor formulas, each with a named mistake.
- **Fixed items.** The generator keeps the item's structure:
  - its number sizes and regrouping needs;
  - its response form;
  - its diagram.

  The values are fresh, chosen within ranges inferred from the fixed values.
- **Diagrams** are redrawn with the Engine's own drawings, never copied from the bitmaps.

**Where the code lives.** Course 1 tasks are added to the same port module as 8/7: `src/port87.js` and `src/port87-map.js`, family `structured-port87`.

- **Why:** they reuse its drawings, its answer forms and its checking, and the Studio already vendors these files.
- **Names:**
  - recipe names start with `c1-`;
  - entries record `course: "Course 1"`;
  - source IDs keep their full Course 1 form, for example `course-1-en:bank:C1_Section01:item:C1_S01_00005`.
- **Build.** `scripts/build-port87-map.py` gains a Course 1 task list.
- **Block hashes.** Each mapping records the item's dynamic-data and rich-question hashes.

**Tests.** `tests/port87.cjs` covers every Course 1 port task, with an independent oracle per recipe.

## C1.3 Batch plan

Batches follow book order, about 70–110 records each. Early lessons are dense: Lessons 1–5 alone have 99 records. The planned batches:

| Batch | Lessons | Records |
|---|---|---|
| C1-1 | Lessons 1–5 | 99 |
| C1-2 | Lessons 6–10 and Investigation 1 | 82 |
| C1-3 | Lessons 11–19 | 102 |
| C1-4 | Lesson 20, Investigation 2, Lessons 21–26 | 99 |

Batch C1-5 onward: the same pattern, about 13–16 batches in all. The ledger reports the Course 1 percentage after every batch.

Each batch:

1. Engine checkpoint, with a decisions file and a change spec.
2. Verification: the full suite.
3. Push.

The Studio re-pins after a group of batches, and always at the end of Course 1.
