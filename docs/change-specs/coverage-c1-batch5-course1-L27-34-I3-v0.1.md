# Coverage Batch C1-5: Course 1 Lessons 27–34 and Investigation 3, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`.

**Version:** Engine 0.51.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 103 records in Lessons 27–34 and Investigation 3 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 48 |
| New port task replacing a less faithful adaptation | 2 |
| Existing adaptation confirmed after review | 3 |
| Consolidated twin | 50 |
| Retired | 0 |

**Course 1 progress:** 34.8% complete, 36.3% including provisional records. **Lessons 1–34 and Investigations 1–3 are complete.**

**Replacements:**

- C1_S03_00087, the least common multiple of two numbers.
- C1_S03_00123, the least common multiple of three numbers.

The earlier breadth adaptation drew numbers up to 44, so its least common multiples could reach 1,000 or more. The ports keep the source numbers: pairs such as 6 and 9, and triples such as 2, 3 and 4.

**Confirmed adaptations:**

- C1_S03_00061: classify a drawn angle.
- C1_S03_00063: classify the clock-hand angle at a whole hour.
- C1_S03_00079: name the segment across a circle through its center.

**Consolidated.** 50 records, choice-only twins and repeated fixed items. The decisions file names every pair. Some point to tasks from earlier lessons, all with the same demand:

- Three ratio items (C1_S03_00012, 00042 and 00118) point to the Lesson 23 ratio task C1_S03_00019.
- Adding and subtracting fractions with reducing point to the Lesson 24 tasks.
- Changing 10/6 to a mixed number points to the Lesson 25 task.

## New tasks

There are 50 new tasks, from 11 new recipes:

| Lesson | Topics |
|---|---|
| 27 | Radius from diameter and diameter from radius; the ratio of radius to diameter; identifying the diameter in a drawn circle |
| 28 | The kind of angle that completes a straight angle; classifying and naming the angles of a drawn triangle; parallel sides of a rectangle |
| 29 | Multiplying fractions, with and without cancelling; whole numbers times fractions, as mixed numbers or improper fractions; one-half of a fraction; the fraction of a pizza left; the fraction of shots made; reducing to lowest terms; the expression for a table-cloth overhang; the length of a row of balls |
| 30 | Least common multiples of two and three numbers; reciprocals of fractions and whole numbers; how many of a fraction are in 1; the factor that makes a product of 1 |
| Investigation 3 | Reading angles on a drawn protractor; choosing the angle with a given measure; an angle the long way around; which angle could have a given measure |
| 31 | Area of a rectangle; perimeter and area of a square; tiles to cover a floor or a square; area of a square from one side or from its perimeter |
| 32 | When a movie ends; elapsed time, with and without regrouping; the time some hours later; expanded notation and standard notation, including missing places |
| 33 | Percents as fractions: in a story, as fiftieths, as hundredths and reduced |
| 34 | The digit in a decimal place; the digit with the same place value as a digit in another number; naming the place of a digit |

**Answer forms.** No new forms. These tasks reuse existing forms:

- **Duration** for elapsed times, for example 2 hr 15 min.
- **Expanded notation** with multiplication.
- **Text**, with alternatives:
  - segment and angle names, either way round (for example SR or RS, ∠C or ∠ACB);
  - clock times with or without "p.m.";
  - place names with or without "place".

**New drawings:**

- a circle with its center, a diameter, a chord and a radius;
- a straight line with three rays and a right-angle mark;
- triangles with labelled vertices;
- a rectangle with a diagonal;
- a row of equal balls with one diameter marked;
- a protractor with nine lettered rays;
- four angles labelled Angle 1 to Angle 4, with no measures shown;
- two rays with the angle the long way around marked.

These drawings reuse earlier drawings:

- a pizza in eighths, from the shaded-circle drawing;
- labelled rectangles and squares.

**Adaptation.** C1_S03_00049 asks the student to measure an angle of 202° with a protractor. On screen the port marks the angle the long way around and gives the smaller angle (for example 158°). The student finds 360° − 158°.

**Connections.** 50 tasks are placed in 18 track levels:

- circle parts;
- circle terms;
- angle classification;
- line relationships;
- multiplying fractions;
- fraction products;
- adding and subtracting fractions;
- reducing fractions;
- algebra language;
- common multiples;
- reciprocals;
- reading a protractor;
- rectangle area;
- square inverse measures;
- clock time;
- expanded notation;
- fraction, decimal and percent conversions;
- decimal place language.

No existing selector lost its matches.

**Practice bundle:** 2,099 → 2,147 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 831 port tasks, 1,000 instances each. The Course 1 oracles solve each problem independently:
  - **Angles from the drawings.** Triangle angles are computed from the drawn vertices. Supplementary angles come from the ray directions. Parallel sides come from the rectangle's corners.
  - **Circles.** The diameter is checked against its endpoints and center.
  - **Fractions and numbers.** Products, reciprocals, least common multiples, areas and percents are recomputed.
  - **Times.** End times and elapsed times are recomputed in minutes.
  - **Notation.** Expanded and standard notation are rebuilt from the terms shown.
  - **Decimal places.** They are read from each digit's power of ten.
  
  Before the full run, every new task passed 4,800 instances.
- **First full run.** The C1-5 drawing check named the variants `square-side` and `pizza`, which earlier Course 1 recipes also use for tasks with no drawing, so the first run failed on C1_S01_00150. The rule now names the recipe as well as the variant (commit `754ee53`).
- **Choices.** Naming the obtuse angle and choosing the angle that could have a given measure offer two distractors.
- **Practice check** passes.
- **Breadth audit.** The two LCM records are now served by their ports. The audit expects 14,800 generated cases.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
