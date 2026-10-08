# Six-course breadth coverage — v0.12.0-rc.3

This pass implements 85 additional source mappings through 66 authored task recipes, reaching 395 working entries. Every working entry supports seeded variants, answer checking and a worked solution through the canonical Math Engine API. Studio consumes the same pinned implementation. This is source-entry coverage, not a count of mastered standards or a guarantee of all task types in a course.

## Working entries by course

| Course | Before | Added | Working | Source records | Remaining |
|---|---:|---:|---:|---:|---:|
| Introduction to PreAlgebra (8/7) | 90 | 7 | 97 | 789 | 692 |
| Algebra 1 | 57 | 12 | 69 | 679 | 610 |
| Algebra 1/2 | 52 | 10 | 62 | 624 | 562 |
| Algebra 2 | 9 | 33 | 42 | 592 | 550 |
| Course 1 | 30 | 11 | 41 | 1353 | 1312 |
| Intermediate 4 | 72 | 12 | 84 | 1388 | 1304 |

## Meaning of this breadth milestone

All six curricula gained new working question types. Algebra 2 received the largest addition: systems of two and three equations, system classification, complex-number arithmetic, functions and restricted domains, variation, counting, sets, logarithms and graph recognition. Other banks gained number theory, scientific notation, polynomial division, line equations, inequality graphs, number systems, function tables, bar graph recognition, clocks and additional geometric tasks.

The step-1 request was to broaden missing task types across all curricula before filling recurring lesson entries. This checkpoint completes the listed 85-entry breadth pass; it does **not** establish that every distinct question type has been implemented. That broader step remains open. The provisional inventory has overlapping task candidates and topic-only evidence; its category names must not be treated as complete semantic coverage.

Remaining new-task work includes general exponent/radical manipulation, additional rational-expression and polynomial forms, nonlinear systems and inequalities, exponential/logarithmic equation forms, vectors/polar representations, additional statistical charts, transformations, geometric constructions and proof tasks. Some source records still contain undecoded rich objects or picture references; they need source recovery/review before a faithful task-specific mapping. Repeated lesson-entry expansion is also unfinished. No unimplemented record is promoted merely because its topic resembles an existing generator.

## Representation differences

- Algebraic expressions are sometimes answered through explicitly named coefficient fields (for example, u; v for u + vi) rather than an unrestricted symbolic-expression parser.
- Factoring asks for the two constants in (x + p)(x + q), accepting either order; signs matter.
- Polynomial division preserves a nonzero remainder and states the excluded denominator value.
- Graph tasks use four original, distinct diagrams with a common scale and a single correct choice. They assess recognition; freehand graph construction is not claimed.
- Clock tasks use five-minute increments in the morning. Overnight elapsed-time tasks explicitly name the next day.
- Function operations include both defined and undefined inputs, preserving domain checks.
- Publisher scripts, question bodies and pictures remain private. Generated prompts/diagrams are authored adaptations, not reproductions of the full legacy distributions or layouts.

## Added source mappings

| Course | Source ID | Working task |
|---|---|---|
| Algebra 2 | `algebra-2-en:node:57` | Evaluate negative powers |
| Algebra 2 | `algebra-2-en:node:74` | Evaluate an expression with signed values |
| Algebra 2 | `algebra-2-en:node:77` | Collect like terms |
| Algebra 2 | `algebra-2-en:node:115` | Classify a polynomial |
| Algebra 2 | `algebra-2-en:node:142` | Solve a two-variable system |
| Algebra 2 | `algebra-2-en:node:152` | Solve a system by elimination |
| Algebra 2 | `algebra-2-en:node:159` | Divide a cubic by a linear polynomial |
| Algebra 2 | `algebra-2-en:node:188` | Find a parallel line through a point |
| Algebra 2 | `algebra-2-en:node:228` | Factor a monic trinomial |
| Algebra 2 | `algebra-2-en:node:267` | Find three negative reciprocals |
| Algebra 2 | `algebra-2-en:node:270` | Find a perpendicular line through a point |
| Algebra 2 | `algebra-2-en:node:362` | Find sine, cosine and tangent |
| Algebra 2 | `algebra-2-en:node:422` | Add complex numbers |
| Algebra 2 | `algebra-2-en:node:487` | Use direct variation |
| Algebra 2 | `algebra-2-en:node:506` | Multiply complex numbers |
| Algebra 2 | `algebra-2-en:node:589` | Use inverse variation |
| Algebra 2 | `algebra-2-en:node:597` | Divide complex numbers |
| Algebra 2 | `algebra-2-en:node:614` | Classify the solutions of a system |
| Algebra 2 | `algebra-2-en:node:652` | Solve a three-variable system |
| Algebra 2 | `algebra-2-en:node:675` | Decide whether a relation is a function |
| Algebra 2 | `algebra-2-en:node:678` | Evaluate a quadratic function |
| Algebra 2 | `algebra-2-en:node:686` | Use joint variation |
| Algebra 2 | `algebra-2-en:node:695` | Find a fractional position between numbers |
| Algebra 2 | `algebra-2-en:node:718` | Evaluate a sum of functions with domains |
| Algebra 2 | `algebra-2-en:node:722` | Evaluate a product of functions with domains |
| Algebra 2 | `algebra-2-en:node:735` | Convert a repeating decimal to a fraction |
| Algebra 2 | `algebra-2-en:node:771` | Evaluate a base-ten logarithm |
| Algebra 2 | `algebra-2-en:node:790` | Calculate exponential doubling |
| Algebra 2 | `algebra-2-en:node:797` | Count arrangements without repetition |
| Algebra 2 | `algebra-2-en:node:803` | Apply the counting principle |
| Algebra 2 | `algebra-2-en:node:845` | Find the intersection of two sets |
| Algebra 2 | `algebra-2-en:node:849` | Find the union of two sets |
| Algebra 2 | `algebra-2-en:node:119` | Match a linear equation to its graph |
| Algebra 1 | `algebra-1-en:node:242` | Evaluate a whole-number power |
| Algebra 1 | `algebra-1-en:node:250` | Evaluate an integer cube root |
| Algebra 1 | `algebra-1-en:node:376` | Write a prime factorization |
| Algebra 1 | `algebra-1-en:node:570` | Solve a system by substitution |
| Algebra 1 | `algebra-1-en:node:690` | Factor a monic trinomial |
| Algebra 1 | `algebra-1-en:node:742` | Write a number in scientific notation |
| Algebra 1 | `algebra-1-en:node:752` | Match a slope and intercept to a graph |
| Algebra 1 | `algebra-1-en:node:820` | Find polynomial quotient and remainder |
| Algebra 1 | `algebra-1-en:node:859` | Match an inequality to its solution graph |
| Algebra 1 | `algebra-1-en:node:905` | Find slope from two points |
| Algebra 1 | `algebra-1-en:node:948` | Find a line through two points |
| Algebra 1 | `algebra-1-en:node:955` | Find a line from a point and slope |
| Algebra 1/2 | `algebra-half-en:node:117` | List primes in an interval |
| Algebra 1/2 | `algebra-half-en:node:118` | Add primes in an interval |
| Algebra 1/2 | `algebra-half-en:node:121` | Write a prime factorization |
| Algebra 1/2 | `algebra-half-en:node:126` | Find a greatest common factor |
| Algebra 1/2 | `algebra-half-en:node:180` | Find a least common multiple |
| Algebra 1/2 | `algebra-half-en:node:181` | Find the first three common multiples |
| Algebra 1/2 | `algebra-half-en:node:656` | Write a Roman numeral |
| Algebra 1/2 | `algebra-half-en:node:657` | Read a Roman numeral |
| Algebra 1/2 | `algebra-half-en:node:791` | Convert binary to base ten |
| Algebra 1/2 | `algebra-half-en:node:795` | Convert base ten to binary |
| Introduction to PreAlgebra (8/7) | `course-87-en:item:SN870025` | Find a greatest common factor |
| Introduction to PreAlgebra (8/7) | `course-87-en:item:SN870166` | Recognize prime numbers |
| Introduction to PreAlgebra (8/7) | `course-87-en:item:SX870082` | Write a prime factorization |
| Introduction to PreAlgebra (8/7) | `course-87-en:item:SAX70082` | Find a least common multiple |
| Introduction to PreAlgebra (8/7) | `course-87-en:item:SAX70083` | Find the LCM of three numbers |
| Introduction to PreAlgebra (8/7) | `course-87-en:item:SN870128` | Round a whole number |
| Introduction to PreAlgebra (8/7) | `course-87-en:item:SX870076` | Compare a square and a square root |
| Course 1 | `course-1-en:bank:C1_Section02:item:C1_S02_00077` | Find a greatest common factor |
| Course 1 | `course-1-en:bank:C1_Section02:item:C1_S02_00055` | Find the GCF of three numbers |
| Course 1 | `course-1-en:bank:C1_Section02:item:C1_S02_00067` | List primes in an interval |
| Course 1 | `course-1-en:bank:C1_Section02:item:C1_S02_00097` | Round to the nearest thousand |
| Course 1 | `course-1-en:bank:C1_Section03:item:C1_S03_00087` | Find a least common multiple |
| Course 1 | `course-1-en:bank:C1_Section03:item:C1_S03_00123` | Find the LCM of three numbers |
| Course 1 | `course-1-en:bank:C1_Section10:item:C1_S10_00047` | Complete a subtraction function table |
| Course 1 | `course-1-en:bank:C1_Section10:item:C1_S10_00048` | Complete an addition function table |
| Course 1 | `course-1-en:bank:C1_Section01:item:C1_S01_00083` | Match a table to a bar graph |
| Course 1 | `course-1-en:bank:C1_Section12:item:C1_S12_00042` | Find cylinder volume |
| Course 1 | `course-1-en:bank:C1_Section12:item:C1_S12_00056` | Find rectangular-prism surface area |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section01:item:TX4_S01_00152` | Continue an arithmetic sequence |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section01:item:TX4_S01_00155` | Fill gaps in an arithmetic sequence |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section02:item:TX4_S02_00005` | Read an analog clock |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section02:item:TX4_S02_00088` | Round to the nearest dollar |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section02:item:TX4_S02_00090` | Round to the nearest ten |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section02:item:TX4_S02_00094` | Find a square perimeter |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section02:item:TX4_S02_00099` | Find a rectangle perimeter |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section03:item:TX4_S03_00054` | Find elapsed time overnight |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section10:item:TX4_S10_00071` | Find the mean of three scores |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section10:item:TX4_S10_00072` | Find the median of five scores |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section12:item:TX4_S12_00068` | Read a Roman numeral |
| Intermediate 4 | `intermediate-4-en:bank:Int4_Section12:item:TX4_S12_00057` | Write a Roman numeral |
