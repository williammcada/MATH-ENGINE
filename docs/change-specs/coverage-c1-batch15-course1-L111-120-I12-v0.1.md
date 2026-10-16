# Coverage Batch C1-15: Course 1 Lessons 111–120 and Investigation 12, v0.1

Recorded 2026-10-15. This batch follows the batch protocol in `coverage-programme-phase0-v0.1.md` §0.6 and the Course 1 phase plan in `coverage-course1-phase-v0.1.md`. It is the last Course 1 batch.

**Version:** Engine 0.61.0-rc.1.
**Branch:** `claude/coverage-phase0`.
**Bank module version:** unchanged at `0.33.0-rc.1`.

## Result: every one of the 90 records in Lessons 111–120 and Investigation 12 is decided

| Decision | Records |
|---|---|
| New port task: an open record, under its own ID | 62 |
| Existing adaptation confirmed after review | 2 |
| Consolidated twin | 26 |
| Retired | 0 |

**Course 1 progress:** 100% complete. **All 1,353 Course 1 records (Lessons 1–120 and Investigations 1–12) are decided.**

**Eight records outside the lesson listing.** C1_S12_00051, 00074, 00076 and 00078–00082 belong to Investigation 12, but the reader's lesson filter does not list them. They were read by record ID and decided with the rest of the investigation.

**Confirmed adaptations.** Two records were covered provisionally by existing structured adaptations. Each was reviewed and kept, because it asks for the same quantity in the same units:

- C1_S12_00042, the volume of a cylinder from its radius and height in meters, using 3.14;
- C1_S12_00056, the surface area of a rectangular prism in square centimeters.

**Key error.** The bank's key for C1_S12_00062 marks the negative quotient for a negative integer divided by a negative integer. The port uses the correct positive quotient.

**Consolidated.** 26 records, mostly choice-only twins and repeated fixed items. The decisions file names every pair. Several refer to figures the bank does not keep or that cannot be read:

- C1_S12_00009 and 00067, estimating an area; they point to the drawn grid task;
- C1_S12_00072, a triangular prism drawn as half of a rectangular prism; it points to the triangular-prism volume task;
- C1_S12_00078 and 00079, estimating surface areas; they point to the drawn prism tasks;
- C1_S12_00053, a net of a rectangular prism; it points to the net task with given dimensions.

C1_S12_00082 asks for two surface areas (a cylinder in a box). It points to the cylinder task in terms of π; the box part matches the rectangular-prism task.

## New tasks

There are 62 new tasks, from 12 new recipes:

| Lesson | Topics |
|---|---|
| 111 | Division in context: cars needed (round up), books affordable (round down), equal shares of a payment, and students shared among rooms as equally as possible |
| 112 | Multiplying signed integers; dividing a negative integer by a positive or a negative integer; division written with a fraction bar |
| 113 | Adding feet and inches and hours and minutes; subtracting feet and inches; mixed and decimal numbers of millions; millions, billions and trillions; a decimal times a power of ten in standard notation |
| 114 | An equal metric length; unit multipliers for tons to pounds, ounces to pounds, yards to feet and quarts to gallons |
| 115 | Percents with mixed numbers (eighths, sixths, thirds and fourths) and a fractional percent, written as fractions |
| 116 | Compound interest compounded annually |
| 117 | The whole from a known fraction: a class, a town, and "a fraction of what number" |
| 118 | Area from shaded squares of 10 square inches; estimating an area from whole and half squares |
| 119 | The whole from a known percent: a population, "a number is a percent of what number" and "a percent of what number is a number" |
| 120 | Volume of a cylinder from its diameter; the volume of a soup can; estimating the volume of a sphere |
| Investigation 12 | Volume formulas and the solids they belong to; why V = s³ agrees with V = lwh; estimating the volumes of a cube and of a cylinder in a cube; cones that fill a cylinder and pyramids that fill a prism; volumes of a cone, a pyramid, a cube in milliliters, an attic, a prism with an isosceles triangle base and a roll of paper towels; surface areas of cylinders (with 3.14, with 3 and in terms of π), rectangular prisms (drawn, from a net, and a tank with no top), a right triangular prism and a square pyramid; paper left after covering a can; whether there is enough wrapping paper for a box |

**Answer forms.** No new forms.

- **Multiples of π.** The π answer part now accepts a decimal coefficient (217.5π) as well as a whole number.
- **Mixed measures** use the existing compound answer form (feet and inches, hours and minutes).

**New drawings:**

- whole and half squares shaded on a grid;
- cylinders with the diameter or radius and the height labelled with units;
- a cylinder standing in a cube, with a top view;
- a sphere inside a cube;
- a prism with an isosceles triangle base, with the base shown separately;
- a square pyramid with its slant height;
- a cone with its radius and height;
- a roll of paper towels with its cardboard tube.

**Connections.** 47 tasks are placed in 23 track levels:

- interpreting quotients and remainders;
- multiplying and dividing signed integers;
- adding and subtracting compound measures;
- multiplying decimals by powers of ten;
- unit conversion;
- fraction-decimal-percent conversions;
- compound interest;
- recovering a whole from a fraction or a percent;
- estimating area from grid squares;
- volumes of prisms, cylinders, cones and pyramids;
- surface areas of prisms, cylinders and pyramids.

No existing selector lost its matches.

**Practice bundle:** 2,495 → 2,557 bank entries.

## Verification

- **`tests/port87.cjs`** covers all 1,257 port tasks, 1,000 instances each. The Course 1 oracles recompute every key with separate code:
  - **Division in context.** Cars and books are found by counting up; room lists are checked for their total, their spread and their order.
  - **Compound interest.** The balance is compounded year by year with exact whole-number arithmetic and rounded once to the cent.
  - **Grids.** The area is counted from the shaded squares and triangles in the drawing.
  - **Volumes and surface areas.** These are recomputed from the parameters with integer arithmetic for the 3.14 roundings, and from the radii for answers in terms of π.
  - **Fractions, percents and powers of ten.** These are checked exactly as fractions.

  Before the full run, every new task passed 4,800 instances.
- **Practice check** passes.
- **Full Engine suite.** Every test that passed at the baseline still passes. `npm test` passes.
- **Fidelity.**
  - Every recipe was written from its record, using the ExamView reader.
  - The drawings were rendered and inspected.
