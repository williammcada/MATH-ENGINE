# First Grade 5 generator contracts — v0.2 design checkpoint

These contracts translate the source alignment review into a first implementation slice. They are designs, not implemented or mathematically verified generators. The custom outcome controls the task. Recovered parameters are distinguished from proposed bounds. Source IDs below are qualified by the Saxon 8/7 recovery workbook, whose row references and digest are in the alignment map.

Shared requirements: exact rational arithmetic where applicable; one generated mathematical record rendered into both student question and teacher solution; seeded reproducibility; explicit units and equivalence policy; no student identifiers in the engine. Preserve each external outcome ID even where computation is shared. Drawings and method-dependent work need a rubric; a final numeric answer alone cannot establish those outcomes.

## 1. Square area from perimeter

- Outcome: `PS.MAT.G5.MD.20.11`.
- Family: `g5.square-area-from-perimeter`.
- Evidence: `SXA10055`, Item Evidence row 137. Recovered script samples integer side n from 4 through 26, displays perimeter 4n, and calculates n². Unit choices are inches, feet, centimeters and meters.
- Generation: sample n, supply only perimeter and unit, ask for area. The hidden side is retained in the mathematical record for the solution.
- Response: exact area with square unit. Accept mathematically equivalent numeric notation; distinguish an omitted unit from an incorrect area according to Studio's scoring policy.
- Worked solution: side = perimeter / 4; area = side × side.
- Example: perimeter 24 cm gives side 6 cm and area 36 cm². This example is independently calculated, not a captured legacy rendering.
- Verification required: all 23 side values in each unit; confirm side is not disclosed accidentally; check linear versus square units in both student/teacher renderers.

## 2. Mixed-operation unlike-denominator fractions

- Outcome: `PS.MAT.G5.NF.9.6`.
- Family: `g5.fraction-expression-precedence`.
- Evidence: `SN870037`, `SN870036`, `SN870035` provide separate addition, subtraction and multiplication components. The inspected multiplication script builds proper fractions with odd denominators and coprimality constraints. It does not establish a full mixed-operation family.
- Proposed generation: four reduced positive proper fractions with denominators 2–12; at least two distinct denominators. Use trees equivalent to a + b×c − d, a − b×c + d, and (a+b)×c − d. Every target item includes addition, subtraction and multiplication. Parenthesized variants must actually alter grouping.
- Proposed rejection: positive result; nonzero intermediate products; multiplication result not equal to either factor; reject cases where the correct result equals the corresponding incorrect left-to-right evaluation. Derive the rejection from the expression tree, not a textual shortcut. Range 2–12 is a proposed extension, not a recovered universal limit.
- Response: exact reduced rational answer; accept an equivalent reduced mixed number if improper. A correct but unreduced fraction is distinguishable from a wrong value because the required final form is reduced.
- Worked solution: show multiplication/grouping first, then equivalent denominators and addition/subtraction. Do not silently replace the outcome with isolated fraction calculations.
- Example: 1/2 + (2/3)(3/4) − 1/5 = 4/5; left-to-right evaluation gives 27/40 and therefore does not accidentally pass.
- Verification required: exact-rational oracle; precedence variants; unlike-denominator condition; reduction; rejection termination; deterministic seeds; student/solution expression parity.

## 3. Exponent product and quotient rules

- Outcomes: `PS.MAT.G5.EE.20.9`, `PS.MAT.G5.EE.20.10`.
- Families: `g5.same-base-exponent-product`, `g5.same-base-exponent-quotient`.
- Evidence: later `SN870415` adds exponent values in power-of-ten multiplication. Later `SX870450` subtracts exponent totals in rational monomials. Neither source alone defines the desired early-lesson symbolic scope.
- Proposed first slice: positive integer base 2–10, exponent values 1–6. Product asks for a single power. Quotient starts with numerator exponent at least denominator exponent; equal exponents yield 1. State base nonzero. Negative-exponent quotient extensions are separate from this slice.
- Prompt/response: explicitly require exponent-law simplification to a single power, or 1 where exponent zero results. A fully evaluated integer can be mathematically correct but does not satisfy the requested representation; report those states separately.
- Worked solution: same-base product adds exponents; quotient subtracts them and explains cancellation. Do not treat multiplication of bases or exponent multiplication as equivalent.
- Examples: 3⁴×3² = 3⁶; 5⁶/5² = 5⁴. These numeric-base families cover only that sub-scope; full outcome coverage remains pending a decision on symbolic bases and exponent expressions.
- Verification required: independent integer-power comparison; equal-exponent quotient; nonzero-domain guard; answer-form validation; no mixing up (aᵐ)ⁿ with aᵐaⁿ.

## 4. Square root of a rational perfect square

- Outcome: `PS.MAT.G5.NS.20.12`.
- Family: `g5.rational-perfect-square-root`.
- Evidence: `SX870126` constructs whole-number perfect squares; `SX870125` evaluates powers of fractions. The rational-square-root task is a new combination, not a recovered exact legacy item.
- Proposed generation: integers p,q in 1–12, q>1, p≠q, gcd(p,q)=1. Display √(p²/q²). Include proper and improper results; no decimal approximation is needed. These bounds are proposed.
- Response: principal nonnegative root p/q in lowest terms; equivalent reduced mixed numbers accepted when improper. Do not accept ±p/q for a principal-radical question. The separate outcome asking for two square roots retains its own contract.
- Worked solution: √p² / √q² = p/q, with q nonzero.
- Example: √(49/81) = 7/9.
- Verification required: exact squaring returns the displayed radicand; denominator never zero; proper/improper cases; rational equivalence and sign rules; radical covers the complete fraction in output.

## 5. Rectangular-prism surface area from a net

- Outcome: `PS.MAT.G5.MD.67.5`.
- Family: `g5.rectangular-prism-net-area`.
- Evidence: `SN870672`, Item Evidence row 647, source Lesson 105. Its script samples 3≤a≤25, 2≤b<a and 1≤c<b, then computes 2ab+2bc+2ac. The recovered figure is a prism, not a net.
- Generation: retain the sampled dimension relationships but replace the representation with a valid connected six-face net. Give enough labels to determine all faces without revealing the total.
- Proposed net topology: side-face strip a×c, b×c, a×c, b×c; attach two a×b rectangles to the top and bottom length-a edges of one a×c strip face. Check all coordinates for non-overlap and shared edge lengths. Net generation must be verified geometrically before classroom output.
- Response/work: label or calculate the six face areas and sum them. Numeric surface area alone records the total but not net-based method evidence.
- Worked solution: two faces each of ab, bc and ac; total 2ab+2bc+2ac, in square units.
- Example: a=5, b=3, c=2 gives face areas 15,15,6,6,10,10 and total 62 square units.
- Verification required: six faces, three matched pairs, connected shared edges, non-overlap, foldable topology, dimensions and labels, independently computed area, print legibility.

## 6. LCM with separate method evidence

- Outcomes: `PS.MAT.G5.OA.27.3` (listing multiples), `PS.MAT.G5.OA.27.4` (prime factorization).
- Families: `g5.lcm-listing`, `g5.lcm-prime-factorization`; shared internal integer-LCM computation is permitted.
- Evidence: `SAX70083`, Item Evidence row 181, selects one of 45 coordinated triples with values between 2 and 12. Its 1–45 case selector is not an operand range. The source asks for LCM without requiring either custom method.
- Proposed generation: two or three distinct integers 2–12. This independently defined operand family is an extension, not a transcription of the legacy lookup table. For listing tasks, reject cases requiring more than 12 positive multiples of any operand to reach the LCM. Any narrower method-specific range must be visible in metadata.
- Listing response: list ordered positive multiples through the first shared value and identify the least one. Prime-factorization response: factor every input, select the highest required exponent of each prime, and multiply. Both return the same numeric LCM but distinct work evidence.
- Example: inputs 4,6,9 give LCM 36. Listing identifies the first common multiple; prime factors select 2²×3².
- Verification required: divisibility by every input, no smaller positive common multiple, equivalence to prime-exponent construction, two/three-input cases, method-specific prompts and worked solutions, no automatic evidence merge between outcomes.

## Implementation boundary

These six contracts are an initial slice, not coverage of all 331 outcomes. Graphs, physical constructions, author-written stories and explanation tasks need additional response contracts and often teacher scoring. The full alignment map records those needs instead of treating all outcomes as numeric-answer items.
