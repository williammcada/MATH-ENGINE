# Custom Grade 5 curriculum coverage map v0.1

Design audit dated 2026-10-08. Source: PS.MAT.G5.LEARNING.OBJECTIVE.STANDARDS_MCADA_26-27_CCSS-DOMAIN-CODES.xlsx (source hash in summary.json). Engine: official Mega Man v0.7 baseline at MATH-ENGINE commit 0f6ab7ccc4a78900275ebcaf198372147dbc621b; runtime bundle preserved at b55c67b5f2f74ac1c16a597cea75dbe5f75e0ee6.

## Results

| Scope | Direct task form | Partial/related | Missing | Total |
|---|---:|---:|---:|---:|
| All outcomes | 42 | 121 | 168 | 331 |
| Present in GradeCam export | 15 | 22 | 20 | 57 |

**Direct** means the requested task form is represented in existing generators, subject to the row's scope/range notes. It does not mean the entire curriculum outcome or all values have passed independent verification. **Partial** includes narrower ranges, related component skills, different unknowns, a missing visual, or an unassessed method. **Missing** means no generator for the exact task was identified in the inspected catalog. Related generator IDs are evidence/reuse candidates, not automatic assignment routes. Every row is marked not ready for automatic assignment until its contract is validated.

## GradeCam matching decision

Owner instruction: ignore the domain segment for matching. PS.MAT.G5.OA.1.2 and PS.MAT.G5.1.2 normalize to PS.MAT.G5.1.2. Keep the original code and domain in metadata. Preserve INV identifiers. Strip only recognized domains in the expected position; reject malformed identifiers rather than fuzzy matching. All 57 observed GradeCam standards match uniquely; all 331 domain-free aliases are unique in this source. No GradeCam changes are required. Student records are not included.

## Source preservation and recursion

All 331 source outcomes and lesson titles remain. Four proposed duplicate links are recorded in canonical_outcome/recursion_note (GCF, decimal-to-fraction, fraction-known whole, and conversion equivalents). These are proposals, not deletions or a complete deduplication audit. Compound outcomes and method-specific tasks retain their own identities. More source outcomes do not imply more distinct generators.

## How the historical banks inform this map

The extraction available in this conversation contains Intermediate 4 and Course 1 banks, not an established complete 8/7 generator extraction. Twenty-two outcome rows link to exact recovered lesson labels, original bank hashes and decompressed offsets. These labels identify relevant reference material such as divisibility, reciprocals, mixed-number conversion, factorization, mean and protractor work. They do not establish verified number ranges, correct-answer relationships or complete diagrams. No publisher questions, original bank binaries or student records are committed here. Parameter/representation specifications must be checked against faithful exports or further decoded source before implementation claims.

## Important scope findings

- Operations performed correctly do not cover identifying their names or parts.
- A numerical result does not establish coverage of drawing, modeling, explaining or writing an equation.
- Current geometry coverage is concentrated on area/perimeter, not angle classification, constructions, transformations, coordinate graphs, solids or statistics.
- Scientific notation, powers-of-ten expanded notation, most statistics and many upper-course algebra topics need new content.
- Outcome 66.3 asks to represent pi as a fraction and decimal. Preserve the source wording, but clarify that finite decimals/fractions are approximations; do not generate a false exact equality.

## Recommended implementation order

1. Add targeted nonvisual content for the GradeCam gaps: reciprocals, mixed/improper conversions, divisibility rules, mean, powers-of-ten expanded notation, operation naming and large-number word/digit forms.
2. Adapt partial skills: explicit substitution templates, separate story structures, selected fraction operations/conversion directions, customary-unit coverage and accurate tax/tip targets.
3. Add required figures and response formats: angles/protractor, ruler measurements, similarity/congruence, polygon and triangle classification, and fraction-circle models. Retain original drawing tasks in printable output; numeric game variants must have separately stated narrower claims.
4. Validate direct mappings and implement a versioned assignment contract. Expand to remaining curriculum outcomes by canonical task family, not by copying every recursive lesson.

## Checks performed and limits

Read all source outcome rows and inspected runtime catalog/generator source. Validated code syntax, uniqueness after domain removal, all 57 GradeCam joins, referenced engine IDs and exact cited bank labels. Existing engine baseline smoke tests are not new independent correctness evidence for this map. No generators, student assignments, app behavior or deployed versions changed.

Handbook consulted and unchanged: v0.1.3, c50115ba1fea9cb552f3ad1415e670a219118b56, AI-START-HERE.md, UNIVERSAL-RULES.md and CONDITIONAL-STANDARDS.md (S-02). Existing project brief and baseline change specification govern source preservation. This map is a reviewable design artifact, not a verified release.

## GradeCam-priority outcome review

| Original code | Coverage | Existing skill candidates | Required work / limits |
|---|---|---|---|
| PS.MAT.G5.OA.1.2 | Missing | — | Add a generator and response contract for this exact task: Identify four fundamental operations of arithmetic. |
| PS.MAT.G5.OA.1.5 | Partial | g6-eval | Only positive ax+b substitution; add formula families, multiple variables and required order-of-operations variants. |
| PS.MAT.G5.OA.2.1 | Partial | g3-commute, g3-associate, g3-distribute | Existing arithmetic illustrates some properties; does not ask learners to identify/name properties or supply the requested examples/counterexamples. |
| PS.MAT.G5.OA.2.2 | Partial | g3-commute, g3-associate, g3-distribute | Existing arithmetic illustrates some properties; does not ask learners to identify/name properties or supply the requested examples/counterexamples. |
| PS.MAT.G5.OA.2.3 | Partial | g3-pattern, g4-pattern, g5-pattern | Arithmetic patterns exist; some give the rule explicitly. Add rule inference and broader sequence families. |
| PS.MAT.G5.OA.3.1 | Direct | g6-eq, g3-submissing, g3-divisor | One-step operation families and missing subtraction/divisor positions present; constrain ranges as needed. |
| PS.MAT.G5.NS.4.2 | Direct | g4-compare, g6-compare | Comparison-symbol response exists for whole and signed rational numbers. |
| PS.MAT.G5.NBT.5.1 | Partial | g4-place | Whole-number digit value stops at hundred-thousands; add place naming and extend through hundred trillions. |
| PS.MAT.G5.NBT.5.2 | Partial | g4-expand | Existing task converts expanded sums to a number; add reverse direction and required place-value range. |
| PS.MAT.G5.NBT.5.3 | Missing | — | Add a generator and response contract for this exact task: Read and write whole numbers through hundred trillions in word form. |
| PS.MAT.G5.NBT.5.4 | Missing | — | Add a generator and response contract for this exact task: Use digits to express numbers through hundred trillions. |
| PS.MAT.G5.OA.6.1 | Partial | g4-prime | Counts factors rather than listing all factors; add factor-set response. |
| PS.MAT.G5.OA.6.2 | Direct | g6-gcf | Direct GCF for two positive integers exists. |
| PS.MAT.G5.OA.6.3 | Missing | — | Add a generator and response contract for this exact task: Test for the divisibility of 2, 3, 4, 5, 6, 8, 9, and 10 without performing the division. |
| PS.MAT.G5.G.7.1 | Missing | — | Add a generator and response contract for this exact task: Identify figures with no dimensions and with one, two, and three dimensions. |
| PS.MAT.G5.G.7.4 | Missing | — | Add a generator and response contract for this exact task: Classify angles by their size: acute, obtuse, right, or straight. |
| PS.MAT.G5.NF.8.1 | Partial | g3-fraction, g6-represent | Verbal fraction-of-whole and percent conversion exist; add shared whole representation and requested naming variants. |
| PS.MAT.G5.MD.8.5 | Missing | — | Add a generator and response contract for this exact task: Use a ruler to measure and draw segments to the nearest sixteenth of an inch. |
| PS.MAT.G5.NF.9.1 | Partial | g4-fraction, g4-mixed | Like-denominator fractions and mixed arithmetic exist; mixed skill combines addition/subtraction, requiring operation-specific targeting. |
| PS.MAT.G5.NF.9.2 | Partial | g4-fsub, g4-mixed | Like-denominator fractions and mixed arithmetic exist; isolate subtraction in mixed skill. |
| PS.MAT.G5.NF.9.3 | Direct | g5-fmul | Direct fraction multiplication exists. |
| PS.MAT.G5.NF.9.4 | Missing | — | Add a generator and response contract for this exact task: Find the reciprocals of numbers. |
| PS.MAT.G5.NF.10.3 | Partial | g3-wholefraction | Whole-number result for improper fractions present; general improper-to-mixed conversion absent. |
| PS.MAT.G5.NF.10.4 | Missing | — | Add a generator and response contract for this exact task: Rewrite a mixed number as an improper fraction. |
| PS.MAT.G5.OA.11.1 | Partial | g1-stories, N05 | Related change/comparison stories exist at early-grade ranges; add separately selectable combining/separating/comparing structures and curriculum ranges. |
| PS.MAT.G5.OA.11.4 | Partial | g1-stories, N05 | Related change/comparison stories exist at early-grade ranges; add separately selectable combining/separating/comparing structures and curriculum ranges. |
| PS.MAT.G5.OA.11.5 | Missing | — | Add a generator and response contract for this exact task: Write equations for story problems about separating. |
| PS.MAT.G5.MD.12.4 | Direct | g3-elapsed, g3-timeend, g3-timestart, g3-time-addsubtract | Duration/start/end one-step time contexts present; worksheet units and ranges need confirmation. |
| PS.MAT.G5.OA.13.1 | Direct | g3-groups, g3-sharing, g3-groupcount, g4-word | Equal-groups total, group-size and group-count contexts present. |
| PS.MAT.G5.NF.14.1 | Partial | g5-fmulword | Fraction-of-known-total context present; broaden unknown positions and curriculum contexts. |
| PS.MAT.G5.NF.15.1 | Partial | g4-missingfraction | Equivalent-fraction missing numerator present; explicitly show/require multiplication by k/k when method is assessed. |
| PS.MAT.G5.MD.16.1 | Partial | g4-convert, g5-convert | Mixed conversion bank exists; add curriculum-specific unit filters and confirm complete customary/metric coverage. |
| PS.MAT.G5.MD.16.2 | Missing | — | Add a generator and response contract for this exact task: Make reasonable estimates of units of weight, length, liquid measure, and temperature in the U.S. Customary System. |
| PS.MAT.G5.G.17.1 | Missing | — | Add a generator and response contract for this exact task: Measure an angle in degrees. |
| PS.MAT.G5.G.17.3 | Missing | — | Add a generator and response contract for this exact task: Use a protractor to measure degrees and draw angles of specified degrees. |
| PS.MAT.G5.G.18.1 | Missing | — | Add a generator and response contract for this exact task: Name a polygon by the number of its sides. |
| PS.MAT.G5.G.18.4 | Missing | — | Add a generator and response contract for this exact task: Identify similar figures by comparing their corresponding parts. |
| PS.MAT.G5.G.18.5 | Missing | — | Add a generator and response contract for this exact task: Identify congruent figures by comparing their corresponding parts. |
| PS.MAT.G5.MD.19.1 | Partial | g3-geo-triangle-perimeter, g3-geo-quadrilateral-perimeter, g6-geo-trapezoid-perimeter | Several polygon types present; add general n-sided and irregular/compound polygon coverage. |
| PS.MAT.G5.EE.20.3 | Direct | g6-exponents | Direct positive integer exponent evaluation exists; broader exponents are separate outcomes. |
| PS.MAT.G5.NF.25.2 | Partial | g5-divfrac, g5-unitdiv, g6-fdiv | Unit-fraction quotient and general fraction division exist; add non-unit whole/fraction and explicit fractional-parts interpretation. |
| PS.MAT.G5.SP.28.1 | Direct | g3-two-step, g4-multistep, g7-rationalword | Multi-step story tasks exist; broaden contextual variety after curriculum review. |
| PS.MAT.G5.SP.28.2 | Missing | — | Add a generator and response contract for this exact task: Calculate the average, or mean, of a list of numbers. |
| PS.MAT.G5.NF.30.3 | Direct | g5-fadd, g5-fsub | Separate unlike-denominator addition and subtraction generators exist. |
| PS.MAT.G5.NBT.33.1 | Direct | g4-deccompare, g5-deccompare | Decimal comparisons through thousandths exist. |
| PS.MAT.G5.NBT.35.2 | Direct | g5-decmul | Decimal multiplication generator exists. |
| PS.MAT.G5.RP.36.1 | Partial | g6-ratio | Ratio computation exists; four notations and identification of ratio quantities not elicited. |
| PS.MAT.G5.MD.37.2 | Direct | g6-geo-triangle-area | Triangle area with base and perpendicular height present. |
| PS.MAT.G5.G.40.2 | Missing | — | Add a generator and response contract for this exact task: Find the missing angle measure of a triangle. |
| PS.MAT.G5.NF.43.1 | Direct | g4-dectofrac | Decimal-to-reduced-fraction task exists within hundredths range. |
| PS.MAT.G5.NF.43.2 | Partial | g4-decimal, g7-decimal | Terminating fraction-to-decimal conversion exists; mixed-number inputs and repeating cases incomplete. |
| PS.MAT.G5.NBT.47.2 | Missing | — | Add a generator and response contract for this exact task: Write numbers in expanded notation using powers of 10. |
| PS.MAT.G5.EE.52.1 | Direct | g5-order, g6-order | Parentheses-only and parentheses/exponents order-of-operations tasks exist. |
| PS.MAT.G5.G.62.3 | Missing | — | Add a generator and response contract for this exact task: Classify a triangle by its sides. |
| PS.MAT.G5.EE.63.2 | Partial | g5-order, g6-order | Parentheses expressions exist; add nested/multiple bracket and brace symbols. |
| PS.MAT.G5.NS.64.1 | Direct | g7-intadd | Signed addition without number line exists. |
| PS.MAT.G5.RP.INV1.2 | Partial | g3-fraction, g6-represent | Fraction/percent computation exists; required fraction-circle model absent. |
