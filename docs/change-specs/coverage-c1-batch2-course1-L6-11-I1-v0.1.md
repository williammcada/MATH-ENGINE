# Coverage Batch C1-2: Course 1 Lessons 6–11 and Investigation 1, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.48.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 78 records in Lessons 6–11 and Investigation 1 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 48 |
| Existing adaptation confirmed after review | 2 |
| Consolidated twin | 28 |
| Retired | 0 |

**Course 1 progress:** 13.1% complete, 15.2% including provisional records. **Lessons 1–11 and Investigation 1 are complete.**

**Confirmed adaptations:**

- C1_S01_00021: choose the histogram for a frequency table.
- C1_S01_00083: choose the bar graph for a table.

Their twins C1_S01_00082 and C1_S01_00022 are consolidated into them.

**Consolidated.** 28 records point to a twin with the same demand:

- choice-only items, served by the port's distractors;
- fixed items that repeat an algorithmic item's demand.

The decisions file names every pair.

## New tasks

There are 48 new tasks, from 14 new recipes:

| Lesson | Topics |
|---|---|
| 6 | Fractions of shaded rectangles, strips and circles; a fraction of a group or a money amount; naming the denominator; fractions in stories |
| 7 | Choosing customary and metric units; lines, segments and rays (identify, name, notation, define); reading inch rulers to the eighth and quarter inch and a millimeter ruler |
| 8 | Perimeter of triangles, rectangles and squares; the side of a square from its perimeter |
| 9 | Ordering three-digit numbers; comparing numbers and expressions with <, > or = |
| 10 | Sequences (next term, next three terms, a later term); odd numbers; reading dial thermometers, a dial scale and a vertical thermometer |
| 11 | Combining, separating and change stories |
| Investigation 1 | Frequency tables, histograms and bar graphs (choose, read and count), plus three teacher-review tasks: make a tally chart and frequency table, make a histogram, draw a bar graph |

**New answer form: segments and rays.** The segments are accepted in any order and with either letter first. Each ray must be named from its endpoint. Answers that contain digits are rejected.

**Answer forms reused:**

- **Sequence:** next three terms, and ordering.
- **Keywords:** defining a ray, a line or a segment.
- **Number set:** a list of factors.

**New drawings:**

- shaded grids, strips and circles;
- a line, a segment and a ray labelled (a)–(c);
- figures through two labelled points;
- three points on a ray;
- inch rulers in eighths and sixteenths, with a bar or an arrow;
- a centimeter ruler with millimeters;
- right and isosceles triangles, rectangles and squares with labelled sides;
- dial thermometers and a dial scale with a needle;
- a vertical thermometer;
- two-column tables;
- four frequency tables labelled (a)–(d);
- histograms.

The sources draw their needles, arrows and markers over pictures of blank dials and rulers. The port draws the whole figure.

**Pictures not recovered:**

| Record | Source | In the port |
|---|---|---|
| C1_S01_00069 | The favorite-subject graph is not in the bank | Draws a four-subject bar graph totalling 50, as the variables give |
| C1_S01_00089 and C1_S01_00154 | Triangle pictures not in the bank | Consolidated into the drawn triangle task |
| C1_S01_00153 | Rectangle picture not in the bank | Consolidated into the drawn rectangle task |

**Teacher review.** Three tasks ask the student to make a tally chart, a histogram or a bar graph: C1_S01_00079, C1_S01_00080 and C1_S01_00084.

- The teacher sees the reference frequencies.
- For the histogram and the bar graph, the teacher also sees a reference graph.

**Connections.** 39 tasks are placed in 16 track levels:

- fraction models;
- fractions of a group;
- geometry vocabulary;
- ruler reading;
- metric rulers;
- perimeter;
- square inverse measures;
- integer ordering;
- sequences;
- temperature;
- one-step stories;
- graph reading;
- histogram and bar-graph production.

No existing selector lost its matches.

**Practice bundle:** 1,951 → 1,996 bank entries. The teacher-review tasks are not in the practice bundle.

## Verification

- **`tests/port87.cjs`** covers all 675 port tasks, 1,000 instances each. The Course 1 oracles read the problem back from what the student sees and solve it independently:
  - shaded parts are counted in the drawing;
  - side labels are read from the figure;
  - frequency tables are read from the drawn tables and recomputed from the data;
  - sequences are parsed from the prompt.
- **Two-choice tasks.** Comparison tasks and the three-figure choice offer two distractors. They are listed with the other two-choice recipes.
- **Practice bundle check.** The first run found that the segment-and-ray answer accepted an answer with a digit appended. The form now rejects digits, and the check passes. Commit `19cb557` holds the fix.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
