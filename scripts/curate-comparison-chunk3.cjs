/* Explicit source-reviewed decisions. Indices refer to the frozen provider/recipe
 * groups in chunk3-scope.json, in first-occurrence order, not generated examples. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),E=require('../src/course-banks');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'curriculum/cross-course/v0.5'),old=path.join(root,'curriculum/cross-course/v0.4');
const scope=JSON.parse(fs.readFileSync(path.join(dir,'chunk3-scope.json'))),ids=new Map(E.catalog.map(c=>[c.sourceId,c])),groups=new Map();
for(const p of scope){const c=ids.get(p.providerSourceId),key=c.recipe?c.family+'/'+c.recipe:c.sourceId;if(!groups.has(key))groups.set(key,{key,source:c,entries:[]});groups.get(key).entries.push(p.sourceId);}
const G=[...groups.values()];if(G.length!==217||scope.length!==295)throw Error('Frozen scope changed');
const notes=`
0|Convert a one-minute-plus-seconds lap to seconds, then subtract a faster-runner difference crossing the minute boundary. Keep calendar/elapsed-time interpretation, not a speed model.
1|Recover purchase cost from amount paid and change, then divide by weight to obtain price per pound. Two contextual operations precede the unit rate.
2|Find cents per ounce for A, add B's unit-price premium, scale to the requested ounces and convert cents to dollars. Preserve the full operation chain.
3|Divide total lodging cost by a positive whole number of nights; the generated nightly rate is integral.
4|Convert large whole-number yards to feet with factor 3. Number-size practice, not a distinct dimension or a course-based rank.
5|Scale a seed price proportionally and round only the final money amount to cents, halfway upward; do not round the intermediate unit rate.
6|Divide total earnings from two different hour/rate groups by total hours. Unequal weights prohibit taking the simple mean of the two rates.
7|Scale a grape price proportionally and round only the final cost to cents, halfway upward. Preserve exact intermediate ratios.
8|Cube an integer side-length ratio from 2 through 5 to obtain the ratio of cube volumes. No area ratio or inverse-root branch occurs here.
9|Convert feet to yards by division by 3; the generated whole-number amount is a multiple of 30.
10|Convert a whole-number multiple of 12 inches to an integral number of feet.
11|Convert whole-number feet to inches by multiplying by 12.
12|Convert multiples of 528 feet to tenths of a mile using 5280 feet per mile; the output need not be integral.
13|Convert 101 through 990 centimeters to meters, retaining hundredths where needed.
14|Convert grams to kilograms; generated amounts give exact whole kilograms.
15|Calculate two distance/time rates in the same units and subtract their exact rational values. There is no hours-to-minutes conversion.
16|Convert multiples of 100 milliliters to liters, retaining a tenths-place result.
17|Interpret bushels per acre as total yield divided by acreage. This is a unit rate, not an unweighted mean of field yields.
18|Average four money bills; generated cent totals are divisible by four. Preserve decimal money notation.
19|Use the supplied hits/at-bats formula and round the final batting average to the nearest thousandth. This is a contextual rate, not a list mean.
20|Combine two groups using their unequal counts and means, then round the final result to hundredths.
21|Recover the total required for an overall target mean, subtract the existing total, and divide by five future quizzes. Existing group size varies from three to seven.
22|Count fair-die outcomes for equality, less-than, greater-than or different-from events. Strict bounds and the different-from values above six allow certain or impossible events.
23|Find the probability of a specified run of two through five identical fair-coin faces; independence gives one divided by two to the run length.
24|Two-card sampling without replacement includes same-suit, neither-face, both-face, same-color and face-plus-specified-rank in either order. Only the last branch adds the reverse order; no uniform rank against ordered cards is claimed.
25|Find the rain complement by subtracting a stated percentage from 100 percent.
26|Convert favorable-to-unfavorable odds a:b to a/(a+b) for the same named event, which may itself be not-winning. Do not automatically complement the named event.
27|Given winning odds, answer either winning or not-winning according to the branch. The complement branch is optional, so do not assert a uniform extra-step difficulty over same-event odds.
28|Average four whole numbers of varying digit lengths by sum divided by four.
29|Recover an unknown shop price from the stated mean and five through seven shops; subtract all known prices from the target total.
30|Average three masses with three decimal places; the generated sum is divisible by three in thousandths.
31|Average two lengths with three decimal places; retain an exact decimal mean.
32|For one marble draw, add the counts of two distinct colors; the events are disjoint, so there is no intersection correction.
33|Previous independent die results are irrelevant to the next less-than or greater-than event. Count strict bounds, including impossible/certain cases.
34|For two same-color draws with replacement, multiply k/n by k/n. Both numerator and denominator reset.
35|Two-card sampling without replacement includes five event branches, with face-then-specified-rank ordered in the last branch. Other branches overlap the either-order recipe; retain related-only ordering between these two mixed recipes.
36|Find range, mean, median and mode of eight through eleven values. The unique mode occurs three times; even/odd counts change the median operation.
37|Find range, mean, median and mode of weight data with eight through eleven values, a unique triple mode, and both even/odd median branches.
38|Find range, mean, median and mode of score data with eight through eleven values, a unique triple mode, and both even/odd median branches.
39|Recover the mean of four values from their supplied total; two supplied individual values are irrelevant.
40|Combine two groups from their counts and means; compute the exact weighted total divided by combined count.
41|Combine three groups from their counts and means; retain all three weights and the exact combined mean.
42|Compute a weighted score from two given percentage weights totaling 100; do not substitute group counts or assume equal weights.
43|Count the ordered two-dice outcomes with a specified sum from one through twelve. Sum one is impossible; the sample space has 36 outcomes.
44|Ignore earlier repetitions and give the probability of a specified face on the next fair-die roll.
45|Earlier marbles were replaced; ignore those results when calculating the probability of the next specified color.
46|Calculate the probability of one exact ordered three- or four-toss coin sequence. All-heads is a possible branch; no permutation factor is needed.
47|For different colors without replacement, retain the second color count but reduce the total by one.
48|Calculate both with-replacement and without-replacement probabilities for two different colors, preserving the requested answer order.
49|Calculate both without-replacement and with-replacement probabilities for the same color. Without replacement decreases both its numerator and the total.
50|From labeled whole-number rectangle sides, calculate both perimeter and area; distinguish linear and square units.
51|Find right-triangle area from the two perpendicular legs. The labeled hypotenuse is a distractor, not an altitude requirement.
52|Combine a square and right triangle; infer the triangular base as total length minus square side, then sum component areas.
53|Find parallelogram area from base and perpendicular height; the slanted side is irrelevant.
54|Find circumference from radius using pi=22/7; radii are multiples of seven, so the result is exact.
55|Find rectangular prism volume from three labeled perpendicular dimensions.
56|Find a right-trapezoid area from two parallel bases and its perpendicular height; use half the base sum times height.
57|A convex n-gon triangulates from one vertex into n-2 triangles; n ranges from five through ten.
58|Calculate a convex polygon's interior-angle sum as (n-2) times 180 degrees.
59|Calculate a regular polygon's exterior angle as 360/n; the side count divides 360 exactly.
60|Find cylinder volume for radius two through five and height seven through thirteen, using pi=3.14 exactly and perpendicular height.
61|From a right triangle with Pythagorean-triple legs, find both its area and missing hypotenuse. This adds a second geometric construct to area calculation.
62|Calculate rectangular prism surface area by summing three pairs of equal rectangular faces.
63|Complete an axis-aligned rectangle from three consecutive signed-coordinate vertices, across four vertex-order variants, and calculate its area from coordinate differences.
64|Find oblique-triangle area from a supplied external perpendicular altitude and base; do not use a slanted side.
65|From radius, find both circumference and area with pi=3.14 exactly.
66|From diameter, first recover radius, then give radius, circumference and area with pi=3.14 exactly; half-integer radii can occur.
67|Select the graph matching y=mx+b among four sign variations; slope is nonzero rational and intercept is nonzero signed. Selection does not require authoring a graph.
68|Select the bar graph matching all six table frequencies assigned to grades; comparing one bar alone is insufficient.
69|Find cylinder volume for radius two through eight and height three through fifteen, using pi=3.14 exactly. Same formula, broader bounded arithmetic than the other cylinder recipe.
70|Find rectangular prism surface area from three positive integer dimensions. Sum all six faces, not volume or lateral area alone.
71|Average three scores, each a multiple of five.
72|Sort five values and report the middle value; duplicates are permitted.
73|Find sphere volume for radius two through fifteen with pi=3.14; round only the final result to hundredths, halfway upward.
74|Scale circle circumference by a central-angle fraction for radius three through nine and angles 6,12,18,24,30 or 60 degrees; final hundredths rounding is required and no diagram is supplied.
75|Recognize segment, ray, line, angle, parallel lines or intersecting lines from endpoint/arrow conventions in a supplied drawing.
76|Read one histogram-bin frequency from five intervals with frequencies two through ten; do not interpret a bar as one raw observation.
77|Convert a labeled circle-graph percentage into a voter count; the voter total is a multiple of 100.
78|Recover an off-axis point reflected across the y-axis while an on-axis point stays fixed; output the missing coordinate pair.
79|Classify a labeled triangle by the most specific side category: equilateral, exactly-two-equal isosceles, or scalene.
80|Select the image of a rectangle after 90-degree counterclockwise, 180-degree, or 90-degree clockwise rotation about the origin; no drawing is requested.
81|Reflect all three triangle vertices across the x-axis and supply six coordinate values.
82|Translate four rectangle vertices by a signed vector and supply eight coordinate values.
83|Calculate one interior angle of a regular polygon as 180-360/n.
84|Calculate one exterior angle of a regular polygon as 360/n.
85|Count diagonals from one vertex as n-3, not all n(n-3)/2 polygon diagonals.
86|Classify a displayed angle from 30 through 180 degrees as acute, right, obtuse or straight.
87|Recognize the right angle among four supplied diagrams; this is a single-class selection task.
88|Select the histogram matching all five interval frequencies in a table, rather than reading one frequency.
89|Classify the smaller clock-hand angle at a whole hour from one through eleven; use 30-degree steps and the smaller angle.
90|Identify the segment passing through the circle center with both endpoints on the circumference; rotation of the drawing does not change diameter.
91|Evaluate six similarity statements, including squares versus arbitrary rectangles, corresponding angles, possible unequal size and non-required equal area or side lengths. True/false recognition is not justification.
92|Select the missing information needed to recover Lee's April hours from the given comparison; do not invent a quantity.
93|Organize fifteen two-digit values into the supplied stems two through five with sorted leaves and duplicates; the stems and key are already provided.
94|Read and sort all fifteen observations from a stem-and-leaf display, retaining duplicate leaves and the supplied key.
95|From a stem-and-leaf display of nine values with one triple mode, calculate median, mode and range.
96|Select the correct box plot for nine strictly increasing observations; exclude the overall median when finding quartiles.
97|Read range and interquartile range from a supplied box plot by two differences.
98|Read minimum, maximum, first quartile, third quartile and median from a box plot in the explicitly requested order.
99|Name the month between two stated months in the same year; this recipe never crosses December.
100|Judge whether one of five conditions establishes a parallelogram. Both opposite pairs equal or diagonals bisecting are sufficient; a kite condition or one equal opposite pair is not.
101|Identify SAS then CPCTC for the supplied split-triangle diagram with equal halves and a common perpendicular side. Abbreviations alone are requested, not a complete proof.
102|Read the mean at the center and the standard deviation from label spacing on a normal curve; mean 63-69 and standard deviation 3 or 4.
103|Select the compass chord-transfer step for copying an angle after equal-radius arcs are already given; do not equate this with constructing the whole copy.
104|Select the final straightedge step for an angle bisector after equal-radius intersecting arcs are supplied.
105|The generator alternates pyramid, cone and sphere volume; sphere has no perpendicular-height input and cone/sphere require final hundredths rounding. Keep these mixed demands related rather than imposing one uniform rank.
106|Calculate sphere surface area as four pi r squared with pi=3.14 exactly.
107|Read AB and nonzero-start BC on an eighth-inch ruler and subtract their lengths. Preserve the distinction between a tick coordinate and a segment length.
108|Find square-pyramid volume from square side and perpendicular height, divided by three. Slant height is not given or needed.
109|Find cone volume from radius and perpendicular height in millimeters, pi=3.14, rounded only at the end to hundredths.
110|Find square-pyramid surface area from square base side and supplied slant height; sum base plus four triangular faces.
111|Find cone total surface area including the base from radius and supplied slant height, using pi=3.14 exactly.
112|Read a zero-origin inch ruler at sixteenth-inch ticks from 2 through 61 and give the reduced fractional length; no physical drawing is required.
113|Read a metric ruler at tenths of a centimeter from 1.5 through 4.7 centimeters; no physical drawing is required.
114|Find distance between distinct signed-coordinate points from -8 through 8, reporting an exact simplified radical or integer when the radicand is a square.
115|Read a protractor with baseline zero or 180 degrees; choose the scale aligned with the baseline and give the smaller angle.
116|Report the dimension count of a point, line, rectangle or rectangular prism, including zero dimensions for a point.
117|Classify supplied lines as parallel, perpendicular or oblique; the oblique branch intersects but not at right angles.
118|Classify angles with numerical degree labels among acute/right/obtuse/straight, including 90 and 180 degrees.
119|For an inch divided into 2,4,8 or 16 intervals, state the smallest graduation 1/n inch. Graduation is not an accuracy or error-bound claim.
120|Choose a plausible everyday length, capacity, mass or temperature estimate from three alternatives. These different attributes do not support one uniform numerical difficulty rank.
121|Using one of seven US unit equivalences, express one smaller unit as a percentage of a larger unit, including fractional percentages.
122|Classify a numerically labeled angle, including acute/right/obtuse/straight boundary values. Same executable body as lesson 7.4, original identity retained.
123|Convert a proper fraction of a circle into both numerical percent and central-angle degrees; denominators vary from 2 to 12 among specified choices.
124|Name a three-, four-, five-, six-, eight- or ten-sided polygon from its diagram and side count.
125|Name all vertices of a polygon consecutively, permitting cyclic shifts and reversal but not diagonal jumps; teacher-reviewed response.
126|Distinguish regular and irregular three-, five- or six-sided polygons from a to-scale drawing; regularity needs equal sides and angles.
127|Compare rectangles or triangles for similarity in the phase-2 override, including a deliberately altered corresponding side. Justify corresponding ratios and angles; a yes/no response alone is insufficient.
128|Compare rectangles or triangles for congruence in the phase-2 override, including equal and scaled cases. Justify equal corresponding parts, not just shape.
129|Evaluate six phase-2 statements distinguishing similarity and congruence; true/false recognition does not constitute a proof.
130|Divide a regular polygon's perimeter by its three, four, five, six or eight equal sides to recover one side length.
131|Distinguish linear centimeters from square centimeters as length versus area units. This is dimensional vocabulary, not formula calculation.
132|Recover a square side from a supplied perfect-square area; take the positive root.
133|Recover a square side from its perimeter, then square it to find area. This combines two measure formulas.
134|Explain why metric relationships use powers of ten and supply a correct factor-10,100 or1000 example with units; teacher-reviewed explanation.
135|Compare Celsius and Fahrenheit temperatures using the supplied affine conversion, including equal cases and negative Celsius values. The comparison, not just substitution, is required.
136|Physically draw/cut a triangle's corners and arrange them on a straight line to demonstrate the 180-degree sum; measurement demonstration is not a formal general proof.
137|Name complementary, supplementary, adjacent or vertical angles from definitions; adjacency alone does not specify a numerical sum.
138|Find an unknown numerical complementary, supplementary or vertical angle in the phase-2 branches. The vertical branch copies the value rather than subtracting.
139|Write both reciprocal unit multipliers for a stated equivalence and explain why each is one. No numerical conversion result is requested.
140|Express a constant travel rate in both distance/time and reciprocal time/distance with correct units; teacher review checks the reciprocal interpretation.
141|Draw every and only symmetry line of an equilateral/scalene triangle or square/nonsquare rectangle in the phase-2 override; zero, two, three and four lines can occur.
142|Find the other three angles of a parallelogram using equal opposite and supplementary adjacent angles.
143|Measure three real circular objects, tabulate circumference/diameter ratios and discuss measurement error when estimating pi. No fabricated observations; distinct experimental demand stays unranked.
144|Give decimal and fractional approximations to pi and explain neither is exactly pi. This is conceptual explanation, not a calculation hierarchy.
145|Name six solid diagrams in the phase-2 override: rectangular prism, cylinder, sphere, cone, square pyramid and triangular prism.
146|Count faces, edges and vertices of either an n-gonal prism or pyramid for n=3,4,5,6 in the phase-2 override; formulas differ by solid type.
147|Draw an n-gonal prism in perspective for n=3,4,5; label its two congruent parallel bases and show hidden edges with dashed lines.
148|Draw every diagonal of a convex four-, five-, six- or eight-sided polygon and report n(n-3)/2. Count each nonadjacent vertex pair once.
149|Estimate a displayed angle within ten degrees without a protractor and justify familiar benchmarks; do not treat an exact measurement answer as meeting this method.
150|Identify corresponding, alternate-interior, same-side-interior or vertical angle pairs by their positions on a transversal diagram.
151|Calculate both curved semicircle arc length, excluding diameter, and semicircle area with pi=3.14. The two-output demand differs from arc-only tasks.
152|Find sphere surface area from a labeled radius with pi=3.14 exactly.
153|Physically construct two concentric circles with different given radii, keep a fixed compass center and label that center.
154|Inscribe a regular hexagon by stepping a compass radius, then join alternate vertices for an equilateral triangle; retain construction arcs.
155|Construct four, six or eight equal circle sectors in the phase-2 override using compass and straightedge, retain arcs and explain equal angles.
156|Measure a central and corresponding inscribed angle on a supplied drawing within three degrees and compare the 2:1 relationship; measurement is not a general theorem proof.
157|Name radius, diameter, chord or arc from a verbal definition; a diameter is a special chord, not any center-to-circle segment.
158|Identify all four quadrants, the axes or the origin from signed coordinate pairs in seven phase-2 branches.
159|Draw a double-line graph for four days of scores for each of two teams; shared uniform axes, ordered segments and a distinguishing key are required.
160|Construct a circle graph from counts using a protractor in the phase-2 override, with totals eight or twelve, complete labels and angle tolerance three degrees.
161|Draw all symmetry lines of a square, nonsquare rectangle or nonsquare rhombus, including the no-diagonal symmetry of a nonsquare rectangle.
162|Locate the fixed parallelogram's diagonal midpoint and justify point symmetry by a 180-degree rotation; no variable family of centers is generated.
163|Write formulas for rectangle perimeter and area, evaluate both, and distinguish linear from square units; teacher-reviewed formula production adds to numerical calculation.
164|Check whether three lengths form a right triangle by comparing squares; branches are scaled 3-4-5 triples or a longest side increased by one.
165|Calculate sphere volume with pi=3.14 for radii that are multiples of three, yielding an exact finite decimal rather than requiring final rounding.
166|Convert cubic centimeters to both milliliters and liters using the stated capacity equivalences; dimensional interpretation is part of the context.
167|Use the explicitly assumed water density exactly 1 g/cm3 to convert milliliters to both grams and kilograms. Do not generalize this density to all substances or conditions.
168|Distinguish zero divided by a nonzero number from division by zero, including 0/0 being undefined due to no unique quotient.
169|Find the excluded x for 5/(x-a) from a signed integer shift; the denominator must not be zero.
170|From favorable odds a:b, give both the event and complement probabilities in that order.
171|Name the preceding or following month, including December/January wraparound; preserve both index branches.
172|Read a Celsius thermometer from zero through forty in five-degree graduations.
173|Name triangle, rectangle, square or circle using the most specific name; the nonsquare rectangle has unequal adjacent lengths.
174|From twelve raw observations, tally three explicit interval categories then draw separated bars with labeled axes and a uniform scale.
175|Calculate a date after a stated number of days; branches include within-month arithmetic and crossing a month/year boundary, with leap-year February. Do not rank this entire mixed recipe as always harder than same-month tasks.
176|Design a neutral preference survey, choose respondents, prepare a tally table and state a generalization limit; collect no invented results. No numerical mean or graph ranking is implied.
177|Determine whether price and count suffice for total cost; explain the missing count or calculate when present. Both sufficient/insufficient branches matter.
178|Convert one through four quarter-turns into clockwise degrees, including a full revolution.
179|Draw at least six congruent square or equilateral-triangle tiles and explain a 360-degree vertex sum with no gaps/overlaps; distinct construction/reasoning demand.
180|Estimate rectangle perimeter, rectangle area or rectangular prism volume after rounding each dimension to tens. The mixed-dimensional branches stay related, not uniformly ranked against an exact formula task.
181|Infer a uniform scale step of 2,5,10 or20 and calculate the value at a stated interval from zero; this is scale reading without a supplied diagram.
182|Draw a given angle using a protractor, then bisect it with compass and straightedge, retain arcs and state each half-angle. The full construction is teacher-reviewed.
183|Choose the closest benchmark 0,1/2 or1 for one of five twentieths values, including 21/20; compare distances without rounding to an unrestricted half-integer.
184|Convert whole cubic feet to cubic inches by cubing 12, not multiplying by 12 once.
185|Show three or six unit multipliers for cubic feet/yards/miles to cubic inches or the reverse. Accept exact products/fractions and reverse every factor; mixed lengths of chain preclude a uniform one-step-versus-six-step rank.
186|Convert a multiple of 1000 cm3 to both m3 and liters, distinguishing the cubed length factor from the capacity factor.
187|Name compass and unmarked straightedge as the permitted tools for classical construction; naming tools alone does not demonstrate their use.
188|Read two adjacent histogram frequencies from a four-bin display and add them, including possible zero counts.
189|Plot P(x,y), Q(y,x), R(0,x), identify quadrants/axis and explain swapped pairs coincide exactly when x=y. Retain signed nonzero x,y and the required explanation.
190|Alternate real-domain tasks: a principal square root needs a nonnegative radicand; a rational expression retains all original exclusions even after cancellation. Keep mixed branch demands related, not uniformly above one denominator exclusion.
191|Model simultaneous opposite-direction travel by adding both distances, write the equation and solve the common elapsed time; there is no delayed departure in this sum recipe.
192|Give parallel, intersecting and skew prism-edge examples and the intersection of two planes, explaining noncoplanarity for skew lines. Spatial reasoning is not ordered by course title.
193|Compute population standard deviation of five signed values using denominator N=5, not N-1, including constant data with zero deviation; round only final sigma to hundredths.
194|From a given normal mean and standard deviation, find endpoints within one,two or three standard deviations and the corresponding approximate 68/95/99.7 percentage.
195|Draw and label line, ray and segment with correct arrows, endpoint counts and finite/infinite length descriptions. This is production, not visual recognition.
196|Draw a rectangle with an interior circular hole and calculate remaining area using pi=3.14; subtract the hole exactly once.
197|Given base area and perpendicular height, find cone or cylinder volume, with the one-third factor only for the cone. Mixed solid types are related to dimensional-formula tasks, not universally easier.
198|For two intersecting lines, find the other three angles in cyclic order using both supplementary and vertical relationships.
199|Alternate inverse-solid tasks: recover sphere diameter from symbolic-pi surface area, or cylinder height from symbolic-pi volume. Different inverse operations prevent one uniform difficulty stage.
200|Find total surface area of a right triangular prism with a scaled 3-4-5 base: two triangles plus three rectangles.
201|Draw and label a circle's radius, diameter, non-diameter chord, minor/major arc and central/inscribed angles; preserve point and arc distinctions.
202|Compose two stated implications about rectangles and parallelograms, and provide a counterexample to the converse. Deduction/converse reasoning is distinct from numerical geometry.
203|State the Euclidean parallel postulate in point-off-line form and apply its uniqueness to rule out two distinct parallels; conceptual justification, not a construction.
204|Find a triangle exterior angle by adding its two remote interior angles; do not apply a regular-polygon 360/n formula.
205|Find two missing cyclic-quadrilateral angles using supplementary opposite angles, not the parallelogram equal-opposite rule.
206|Find an adjacent rhombus angle, a bisected vertex angle and a diagonal intersection angle; three properties are required.
207|Convert miles/hour to feet/second with two oppositely oriented unit factors and round the final result to hundredths.
208|Convert yards to meters with three exact length factors, preserving unit cancellation.
209|Convert square yards to square meters with four explicit factors using the derived exact feet-to-meters factor; square the complete length conversion.
210|At fixed gas temperature, compute pressure from P1 V1/V2 and report two significant figures in scientific notation, retaining trailing zeros and rounding only at the end.
211|At fixed gas temperature, compute volume from P1 V1/P2 and report three significant figures in scientific notation, retaining trailing zeros and rounding only at the end.
212|Model two unequal travel distances with a speed multiple and two-hour time difference; find both speeds and times, preserving which trip takes longer.
213|Model an equal-distance out-and-back trip with a return-speed multiple and total time; find both speeds rather than assuming average speed is the arithmetic mean.
214|Rearrange PV=nRT for moles with the supplied gas constant and compatible units; final three-decimal rounding only.
215|Rearrange PV=nRT for volume with the supplied gas constant and compatible units; final three-decimal rounding only.
216|Find perpendicular distance from a signed-coordinate point to a horizontal line; it is the absolute vertical-coordinate difference, not a general oblique-line distance formula.
`.trim().split('\n').map(l=>{const at=l.indexOf('|');return[Number(l.slice(0,at)),l.slice(at+1)];});
if(notes.length!==G.length||notes.some(([n],i)=>n!==i))throw Error('Each group needs one explicit contract');
// # numbers expand only to the exact canonical providers in that scoped group.
// Existing aliases below are also resolved to exact providers before writing.
const paths=`
lap-time-conversion|calendar-time|related|1|Convert a mixed minute-second lap and calculate a difference|#0
lap-time-conversion|calendar-time|related|2|Compute elapsed clock time with hour boundaries|c/12.4
purchase-unit-rate|rates|extension|1|Divide a total by its count or measure|#3 #17 f/rate
purchase-unit-rate|rates|extension|2|Recover net cost before calculating a unit price|#1
purchase-unit-rate|rates|extension|3|Compare a premium unit price and scale to a purchase|#2
proportional-money-rounding|rates|extension|1|Calculate a unit rate from corresponding totals|#3 #17 f/rate
proportional-money-rounding|rates|extension|2|Scale proportional cost and round only the final money amount|#5 #7
rate-interpretations|rates|related|1|Calculate a contextual quotient or reciprocal pair|#19 #140
rate-interpretations|rates|related|2|Compare two independently calculated exact rates|#15
single-unit-practice|measurement|extension|1|Apply one length mass or capacity equivalence|#4 #9 #10 #11 #12 #13 #14 #16 c/32.2 c/16.1
single-unit-practice|measurement|extension|2|Show a chain of unit cancellations|#208 c/88.1
unit-dimensions|measurement|extension|1|Convert an exact length through three factors|#208
unit-dimensions|measurement|extension|2|Convert square units dimension by dimension|#209
unit-dimensions|measurement|extension|3|Convert cubic units dimension by dimension|z/units:volume-chain
unit-concepts|measurement|related|1|Explain metric powers or reciprocal unit multipliers|#134 #139
unit-concepts|measurement|related|2|Interpret a unit as a percentage of a larger unit|#121
cubic-unit-models|measurement|related|1|Cube the feet-to-inches factor|#184
cubic-unit-models|measurement|related|2|Show forward or reverse cubic conversion chains|#185
cubic-unit-models|measurement|related|3|Connect cubic length and capacity units|#186 #166 #167
compound-rate-units|rates|extension|1|Calculate a distance per time with compatible units|t/distance-rate
compound-rate-units|rates|extension|2|Convert units in both numerator and denominator|#207
mean-list-recovery|statistics|extension|1|Compute a mean of a supplied list or total|#18 #28 #30 #31 #39 #71 f/mean-small
mean-list-recovery|statistics|extension|2|Recover a missing observation from the required total|#29 s/missing-value
mean-group-target|statistics|extension|1|Compute an arithmetic list mean|#18 #28 #30 #31 #39 #71 f/mean-small
mean-group-target|statistics|extension|2|Combine group means or rates with their weights|#6 #20 #40 #42 s/weighted-scores
mean-group-target|statistics|extension|3|Recover a required future-group mean|#21 a/target-average
weighted-group-count|statistics|difficulty|1|Combine two exact count-weighted means|#40
weighted-group-count|statistics|difficulty|2|Combine three exact count-weighted means|#41
data-summary-demands|statistics|extension|1|Sort five values and find their median|#72
data-summary-demands|statistics|extension|2|Calculate mean median mode and range|#36 #37 #38 f/stats-small
data-summary-demands|statistics|extension|3|Calculate population standard deviation with N denominator|#193
normal-model-reading|statistics|extension|1|Read mean and standard deviation from the curve scale|#102
normal-model-reading|statistics|extension|2|Calculate normal-model bands and empirical-rule percentages|#194
independent-history|probability|related|1|Count outcomes for one fair-die event|#22
independent-history|probability|related|2|Ignore independent past die or replaced-marble results|#33 #44 #45
repeated-coin-events|probability|related|1|Find probability of a specified run or exact sequence|#23 #46
repeated-coin-events|probability|related|2|Find probability of mixed independent events|c/94.2
marble-replacement-models|probability|extension|1|Calculate one disjoint-color event|#32 s/marble-single
marble-replacement-models|probability|extension|2|Calculate two ordered draws using the stated replacement rule|#34 #47
marble-replacement-models|probability|extension|3|Calculate and contrast both replacement models|#48 #49
card-event-order|probability|related|1|Calculate mixed ordered card events without replacement|#35
card-event-order|probability|related|2|Calculate mixed card events including an either-order branch|#24
probability-odds-output|probability|extension|1|Convert odds to the probability of the same named event|#26
probability-odds-output|probability|extension|2|Give both event and complement probabilities|#170
odds-event-interpretation|probability|related|1|Interpret the named event in given odds|#26 #27
probability-complement-work|probability|extension|1|Find a complementary percentage|#25
probability-complement-work|probability|extension|2|Convert odds and give the event plus its complement|#170
dice-enumeration|probability|extension|1|Count one-die outcomes for a stated condition|#22 #33
dice-enumeration|probability|extension|2|Enumerate ordered two-dice outcomes with a target sum|#43
rectangle-measure-production|area|extension|1|Calculate rectangle perimeter and area|#50
rectangle-measure-production|area|extension|2|Write both formulas and evaluate with correct units|#163
triangle-area-production|area|extension|1|Identify a base and perpendicular altitude|c/37.1
triangle-area-production|area|extension|2|Calculate area with interior or external height|#51 #64 c/37.2
triangle-area-production|area|extension|3|Calculate area and a missing right-triangle hypotenuse|#61
composite-area-shapes|area|related|1|Combine a square and triangle with an inferred base|#52 c/75.1
composite-area-shapes|area|related|2|Subtract a circular hole and draw the remaining region|#196
area-formula-practice|area|related|1|Use parallelogram base and perpendicular height|#53 c/61.1
area-formula-practice|area|related|2|Use two trapezoid bases and perpendicular height|#56 c/75.2
circle-output-demands|circle-measurement|extension|1|Find circumference from radius with stated pi|#54
circle-output-demands|circle-measurement|extension|2|Find circumference and area from radius|#65
circle-output-demands|circle-measurement|extension|3|Recover radius from diameter and find circumference and area|#66
circle-fraction-measures|circle-measurement|related|1|Calculate circumference and area|#65
circle-fraction-measures|circle-measurement|related|2|Calculate semicircle arc and area or an arbitrary arc|#151 #74 c/104.2
rectangular-volume-practice|volume|extension|1|Find rectangular prism volume from dimensions|#55 c/70.1
rectangular-volume-practice|volume|extension|2|Find triangular prism volume via base area|c/70.2
volume-shape-contracts|volume|related|1|Calculate cylinder volume with given radius and height|#60 #69 f/cylinder-volume
volume-shape-contracts|volume|related|2|Calculate cone pyramid or sphere volume with their rounding rules|#73 #105 #108 #109 #165 #197
volume-side-ratios|similarity-scale|extension|1|Cube a known side ratio for cube volumes|#8
volume-side-ratios|similarity-scale|extension|2|Connect forward and inverse length area and volume ratios|c/COURSE211.2
surface-shape-contracts|surface-area|related|1|Find rectangular or triangular prism total surface area|#62 #70 #200
surface-shape-contracts|surface-area|related|2|Find cone or square-pyramid surface area using slant height|#110 #111 h/cone-area h/pyramid-area
surface-shape-contracts|surface-area|related|3|Find sphere surface area from radius|#106 #152
polygon-triangulation|angles|extension|1|Count triangles from one vertex of a convex polygon|#57
polygon-triangulation|angles|extension|2|Calculate the interior-angle sum|#58
polygon-triangulation|angles|extension|3|Draw the triangulation and give both count and sum|z/geometry:polygon
regular-polygon-angles|angles|extension|1|Calculate a regular exterior angle|#59 #84
regular-polygon-angles|angles|extension|2|Calculate a regular interior angle|#83
polygon-diagonal-production|angles|extension|1|Count diagonals from one vertex|#85
polygon-diagonal-production|angles|extension|2|Draw and count every diagonal exactly once|#148
coordinate-rectangle-work|coordinate-geometry|extension|1|Read or plot signed coordinate pairs|c/INV3.2 c/INV3.3
coordinate-rectangle-work|coordinate-geometry|extension|2|Complete a rectangle and calculate coordinate-difference area|#63
coordinate-description|coordinate-geometry|extension|1|Identify quadrant axis or origin from signs|#158
coordinate-description|coordinate-geometry|extension|2|Plot swapped pairs and explain coincidence|#189
coordinate-distance-practice|coordinate-geometry|extension|1|Find distance to a horizontal line|#216
coordinate-distance-practice|coordinate-geometry|extension|2|Find exact distance between arbitrary signed-coordinate points|#114 a/distance-points
graph-selection-production|data-displays|extension|1|Select a line graph matching a signed rational slope and intercept|#67
graph-selection-production|data-displays|extension|2|Construct a line graph from its equation|a/line:graph
bar-graph-production|data-displays|extension|1|Match all given table frequencies to a bar graph|#68
bar-graph-production|data-displays|extension|2|Tally raw observations and construct a bar graph|#174
histogram-read-depth|data-displays|difficulty|1|Read one histogram interval frequency|#76
histogram-read-depth|data-displays|difficulty|2|Read and add two interval frequencies|#188
histogram-select-produce|data-displays|extension|1|Match all table frequencies to a histogram|#88
histogram-select-produce|data-displays|extension|2|Tally raw observations and construct a histogram|h/histogram10 f/histogram
circle-graph-production|data-displays|extension|1|Calculate a count from a labeled circle-graph percentage|#77
circle-graph-production|data-displays|extension|2|Construct and label a circle graph from counts|#160
line-series-production|data-displays|extension|1|Read a line graph and its changes|c/38.3
line-series-production|data-displays|extension|2|Construct two series on shared axes with a key|#159
stem-display-work|data-displays|extension|1|Read ordered observations retaining repeated leaves|#94
stem-display-work|data-displays|extension|2|Calculate median mode and range from the display|#95
stem-display-authoring|data-displays|extension|1|Fill supplied stems with sorted leaves|#93
stem-display-authoring|data-displays|extension|2|Construct the complete stem-and-leaf display with key|a/stem-leaf c/INV4.1
box-display-work|data-displays|extension|1|Read the five marked summary values|#98
box-display-work|data-displays|extension|2|Calculate range and interquartile range|#97
box-display-production|data-displays|extension|1|Calculate quartiles and select the matching box plot|#96
box-display-production|data-displays|extension|2|Construct a box plot from raw observations|a/boxplot:draw c/INV4.5
geometric-notation-production|geometry-properties|extension|1|Recognize primitive figures and arrow conventions|#75
geometric-notation-production|geometry-properties|extension|2|Draw name and describe geometric primitives|#195 c/7.2
shape-identification-practice|geometry-properties|related|1|Name planar shapes and polygon types|#173 #124
shape-identification-practice|geometry-properties|related|2|Identify regularity or consecutive vertex naming|#126 #125
shape-dimension-language|geometry-properties|related|1|Identify dimension counts and linear versus square units|#116 #131
shape-dimension-language|geometry-properties|related|2|Name six types of solid|#145
line-relationships-space|geometry-properties|extension|1|Classify parallel perpendicular or oblique planar lines|#117
line-relationships-space|geometry-properties|extension|2|Identify parallel intersecting and skew edges and plane intersections|#192
triangle-side-classification|geometry-properties|related|1|Classify sides by the most specific triangle category|#79 c/62.3
angle-classification-work|angles|extension|1|Recognize a right angle in a selection|#87
angle-classification-work|angles|extension|2|Classify acute right obtuse or straight angles|#86 #118 #122
clock-angle-interpretation|angles|extension|1|Convert quarter revolutions to degrees|#178
clock-angle-interpretation|angles|extension|2|Classify the smaller whole-hour clock-hand angle|#89
angle-relationship-application|angles|extension|1|Name complementary supplementary adjacent or vertical relationships|#137
angle-relationship-application|angles|extension|2|Use a complementary supplementary or vertical relationship numerically|#138
intersecting-angle-output|angles|extension|1|Find one complementary supplementary or vertical angle|#138
intersecting-angle-output|angles|extension|2|Find all three remaining angles of two intersecting lines|#198
transversal-identification|angles|extension|1|Identify angle-pair positions on a transversal|#150
transversal-identification|angles|extension|2|Find angles on parallel lines with a transversal|c/102.1
quadrilateral-angle-contracts|angles|related|1|Use parallelogram opposite and adjacent angle properties|#142
quadrilateral-angle-contracts|angles|related|2|Use cyclic-quadrilateral opposite supplements|#205
rhombus-angle-extension|angles|extension|1|Find parallelogram angles|#142
rhombus-angle-extension|angles|extension|2|Use rhombus angle bisection and perpendicular diagonals too|#206
triangle-angle-interpretations|angles|related|1|Find a third interior or exterior angle|#204 c/40.2
triangle-angle-interpretations|angles|related|2|Demonstrate the triangle sum with cut corners|#136
symmetry-line-practice|transformations|related|1|Draw every line of reflection symmetry|#141 #161
symmetry-line-practice|transformations|related|2|Explain point symmetry from diagonal midpoints|#162
reflection-coordinate-count|transformations|difficulty|1|Recover one point after a y-axis reflection|#78
reflection-coordinate-count|transformations|difficulty|2|Reflect all three triangle points across the x-axis|#81
transformation-response|transformations|related|1|Select a rotated rectangle|#80
transformation-response|transformations|related|2|Supply reflected or translated coordinates|#81 #82
transformation-response|transformations|related|3|Draw the transformed coordinate figure|c/80.1 c/80.2 c/80.3
similarity-judgment-production|similarity-scale|extension|1|Judge statements about similarity or congruence|#91 #129
similarity-judgment-production|similarity-scale|extension|2|Justify similarity or congruence from corresponding parts|#127 #128
circle-term-production|geometry-properties|extension|1|Identify diameter or name radius diameter chord and arc|#90 #157
circle-term-production|geometry-properties|extension|2|Draw and label circle parts including major arcs and inscribed angles|#201
construction-step-production|constructions|extension|1|Recognize an angle-copy or angle-bisector construction step|#103 #104
construction-step-production|constructions|extension|2|Carry out and justify the full corresponding construction|#182 c/COURSE118.1 m/construct:angle-copy
construction-tool-use|constructions|extension|1|Name the permitted classical construction tools|#187
construction-tool-use|constructions|extension|2|Construct concentric circles with measured radii|#153
construction-tool-use|constructions|extension|3|Construct a regular hexagon and its alternate-vertex triangle|#154
circle-sector-construction|constructions|related|1|Construct equal circle sectors by the required compass method|#155
circle-sector-construction|constructions|related|2|Construct an inscribed hexagon and triangle|#154
inscribed-angle-methods|angles|related|1|Measure and compare central and inscribed angles|#156
inscribed-angle-methods|angles|related|2|Calculate using the central-inscribed relationship|h/circle-angles
proof-response-production|proof|extension|1|Identify SAS and CPCTC in a supplied diagram|#101
proof-response-production|proof|extension|2|Write a statement-reason triangle-congruence proof|m/proof:congruence
parallelogram-evidence|geometry-properties|related|1|Judge sufficient and insufficient parallelogram conditions|#100
parallelogram-evidence|geometry-properties|related|2|Explain deduction and a failed converse|#202
solid-representation-demands|geometry-properties|related|1|Name solid types|#145
solid-representation-demands|geometry-properties|related|2|Count prism or pyramid faces edges and vertices|#146
solid-representation-demands|geometry-properties|related|3|Draw a prism with correct hidden edges and labeled bases|#147
square-inverse-measures|area|related|1|Recover side from perfect-square area or regular perimeter|#132 #130
square-inverse-measures|area|related|2|Recover area from square perimeter|#133
right-triangle-converse|pythagorean|related|1|Calculate a missing right-triangle side|c/99.1
right-triangle-converse|pythagorean|related|2|Test whether given lengths form a right triangle|#164
ruler-response-demands|measurement|extension|1|Read a sixteenth-inch ruler|#112
ruler-response-demands|measurement|extension|2|Read and physically draw the sixteenth-inch length|c/8.5
ruler-segment-difference|measurement|extension|1|Read a fractional inch coordinate from zero|#112
ruler-segment-difference|measurement|extension|2|Read and subtract two ruler segment lengths including a nonzero start|#107
metric-ruler-response|measurement|extension|1|Read a tenths-centimeter ruler|#113
metric-ruler-response|measurement|extension|2|Read and draw metric lengths|f/metric-ruler
scale-interpretations|measurement|related|1|Infer a scale interval or smallest graduation|#181 #119
scale-interpretations|measurement|related|2|Read a thermometer scale|#172
temperature-comparison|measurement|extension|1|Read a Celsius thermometer|#172
temperature-comparison|measurement|extension|2|Convert and compare Celsius and Fahrenheit values|#135
protractor-response-demands|angles|extension|1|Read the correctly aligned protractor scale|#115 c/17.1
protractor-response-demands|angles|extension|2|Read and physically construct the requested angle|c/17.3
angle-estimation-methods|angles|related|1|Read an exact supplied protractor|#115
angle-estimation-methods|angles|related|2|Estimate without an instrument and justify benchmarks|#149
calendar-month-relations|calendar-time|related|1|Name the intermediate month without wraparound|#99
calendar-month-relations|calendar-time|related|2|Name previous or next months including year wraparound|#171
calendar-date-models|calendar-time|related|1|Interpret cyclic month order|#171
calendar-date-models|calendar-time|related|2|Calculate within-month and across-boundary dates|#175
information-response|reasoning|extension|1|Select the missing quantity needed for an answer|#92
information-response|reasoning|extension|2|Explain sufficiency or insufficiency and calculate when possible|#177 c/79.1
dimensional-estimate-models|rounding-estimation|related|1|Choose a reasonable everyday quantity|#120
dimensional-estimate-models|rounding-estimation|related|2|Estimate perimeter area or volume after rounding dimensions|#180
fraction-benchmark-distance|number-order|related|1|Choose the nearest zero half or one benchmark|#183
fraction-benchmark-distance|number-order|related|2|Round a mixed number to its nearest whole|c/29.2
circle-fraction-output|circle-measurement|extension|1|Convert a fraction of a revolution to degrees|#178
circle-fraction-output|circle-measurement|extension|2|Give both circle percentage and angle from a proper fraction|#123
denominator-domain-concepts|rational-expressions|extension|1|Distinguish zero quotient and undefined division|#168
denominator-domain-concepts|rational-expressions|extension|2|Find the excluded input of a shifted linear denominator|#169
domain-branch-contracts|rational-expressions|related|1|Interpret a shifted linear denominator exclusion|#169
domain-branch-contracts|rational-expressions|related|2|Explain a canceled rational or principal-root domain|#190
motion-sum-extension|rates|extension|1|Model simultaneous opposite-direction travel|#191
motion-sum-extension|rates|extension|2|Model opposite-direction travel with delayed departure|a/motion:delayed-sum
motion-speed-relations|rates|related|1|Model speed multiples on an equal-distance round trip|#213 a/motion:equal
motion-speed-relations|rates|related|2|Model unequal distances and a departure-time relation|#212 a/motion:unequal
gas-reporting-precision|gas-laws|extension|1|Calculate a constant-temperature pressure or volume|m/gas:pressure m/gas:volume
gas-reporting-precision|gas-laws|extension|2|Report the result with specified significant figures in scientific notation|#210 #211
ideal-gas-unknowns|gas-laws|related|1|Isolate pressure in the ideal gas equation|m/gas:ideal
ideal-gas-unknowns|gas-laws|related|2|Isolate moles or volume with consistent units|#214 #215
`.trim().split('\n').map(l=>l.split('|'));
const aliases=JSON.parse(fs.readFileSync(path.join(old,'family-aliases.json'))),rootProvider=c=>c.reuseSourceId?rootProvider(ids.get(c.reuseSourceId)):c;
const resolve=s=>s[0]==='#'?G[Number(s.slice(1))].entries.map(id=>rootProvider(ids.get(id)).sourceId):(()=>{const at=s.indexOf('/'),f=s.slice(0,at),r=s.slice(at+1);const found=E.catalog.filter(c=>c.family===aliases[f]&&c.recipe===r);if(!found.length)throw Error('Missing '+s);return found.map(c=>rootProvider(c).sourceId);})();
const backgrounds={
 'lap-time-conversion':'Minutes contain 60 seconds; subtract times in consistent units',
 'purchase-unit-rate':'Identify total cost, quantity and the unit being priced',
 'proportional-money-rounding':'Use equivalent ratios and round money only at the end',
 'rate-interpretations':'Interpret the numerator and denominator of a rate with units',
 'single-unit-practice':'Use equal measures and orient conversion factors to cancel units',
 'unit-dimensions':'Apply one length factor for each dimension of the measure',
 'unit-concepts':'Equal measures have ratio one; metric prefixes use powers of ten',
 'cubic-unit-models':'Cube length factors and distinguish cubic length from capacity units',
 'compound-rate-units':'Convert both distance and time while canceling the starting units',
 'mean-list-recovery':'Total equals mean times count; retain decimal place values',
 'mean-group-target':'Weight each group by its count or stated percentage before combining',
 'weighted-group-count':'Multiply each mean by its group count and divide by the combined count',
 'data-summary-demands':'Sort observations, distinguish summary measures and use the specified population convention',
 'normal-model-reading':'Interpret mean and standard deviation on a symmetric normal model',
 'independent-history':'Count favorable outcomes; independent previous results do not change the next trial',
 'repeated-coin-events':'Multiply probabilities for independent trials and distinguish a sequence from any order',
 'marble-replacement-models':'Track color counts and whether a drawn marble is replaced',
 'card-event-order':'Count the remaining cards, preserve event order and avoid double counting',
 'probability-odds-output':'Odds compare favorable to unfavorable counts; probability uses the total',
 'odds-event-interpretation':'Identify the exact event named in the odds before choosing its probability',
 'probability-complement-work':'An event and its complement have probabilities summing to one',
 'dice-enumeration':'Two dice have 36 equally likely ordered outcomes',
 'rectangle-measure-production':'Perimeter adds boundary lengths; area counts square units',
 'triangle-area-production':'Use a perpendicular altitude, including one outside the triangle',
 'composite-area-shapes':'Partition or subtract nonoverlapping regions and infer only justified lengths',
 'area-formula-practice':'Distinguish bases, perpendicular heights and slanted sides',
 'circle-output-demands':'Diameter is twice radius; apply the stated pi convention',
 'circle-fraction-measures':'Scale the correct whole-circle measure by the angle fraction',
 'rectangular-volume-practice':'Volume equals base area times perpendicular height',
 'volume-shape-contracts':'Choose the formula for the actual solid and retain the stated rounding rule',
 'volume-side-ratios':'Similar volumes scale by the cube of the linear ratio',
 'surface-shape-contracts':'Sum all exposed faces and distinguish slant height from perpendicular height',
 'polygon-triangulation':'A convex n-gon splits from one vertex into n minus 2 triangles',
 'regular-polygon-angles':'Exterior angles total 360 degrees; interior and exterior angles supplement',
 'polygon-diagonal-production':'Diagonals join nonadjacent vertices; count each unordered pair once',
 'coordinate-rectangle-work':'Use signed coordinates, parallel sides and coordinate differences',
 'coordinate-description':'Order coordinates as horizontal then vertical; axes have a zero coordinate',
 'coordinate-distance-practice':'Use perpendicular coordinate differences and simplify square roots exactly',
 'graph-selection-production':'Interpret slope and intercept with signed coordinates',
 'bar-graph-production':'Count each observation once and use a consistent frequency scale',
 'histogram-read-depth':'Read interval frequencies from the vertical scale and add the requested bins',
 'histogram-select-produce':'Match interval boundaries and frequencies; histogram bars touch',
 'circle-graph-production':'Parts of a whole correspond to percentages and angles totaling 360 degrees',
 'line-series-production':'Use uniform axes, ordered time points and a key for multiple series',
 'stem-display-work':'Apply the stem-and-leaf key and retain repeated observations',
 'stem-display-authoring':'Split place values into stems and ordered leaves and supply a key',
 'box-display-work':'Distinguish extremes, quartiles and median; spread measures are differences',
 'box-display-production':'Sort data and use the stated convention when splitting the halves',
 'geometric-notation-production':'Arrowheads and endpoints distinguish a line, ray and segment',
 'shape-identification-practice':'Count sides and follow consecutive vertices; regularity needs equal sides and angles',
 'shape-dimension-language':'Distinguish point, length, area and solid dimensions',
 'line-relationships-space':'Parallel lines are coplanar; skew lines do not meet and are not coplanar',
 'triangle-side-classification':'Compare side lengths and choose the most specific category',
 'angle-classification-work':'Compare angles with the 90-degree and 180-degree benchmarks',
 'clock-angle-interpretation':'A full revolution is 360 degrees; choose the smaller clock-hand angle',
 'angle-relationship-application':'Distinguish angle position from complementary or supplementary sums',
 'intersecting-angle-output':'Vertical angles are equal and adjacent linear-pair angles sum to 180 degrees',
 'transversal-identification':'Use angle positions and the stated parallel-line assumptions',
 'quadrilateral-angle-contracts':'Use the properties of the specified quadrilateral, not a look-alike diagram',
 'rhombus-angle-extension':'Use supplementary adjacent angles, angle bisectors and perpendicular diagonals',
 'triangle-angle-interpretations':'Triangle interior angles sum to 180 degrees; distinguish demonstration from proof',
 'symmetry-line-practice':'A reflection fixes a symmetry line; point symmetry is a half-turn',
 'reflection-coordinate-count':'A coordinate-axis reflection changes the perpendicular coordinate sign',
 'transformation-response':'Apply the stated center, axis or vector to every vertex',
 'similarity-judgment-production':'Compare corresponding angles and side ratios; congruence additionally preserves size',
 'circle-term-production':'Distinguish center-to-circle radii, chords, diameters, arcs and angle vertices',
 'construction-step-production':'Equal compass radii transfer distances; keep the construction arcs',
 'construction-tool-use':'Use a compass for circles and distance transfer and an unmarked straightedge for lines',
 'circle-sector-construction':'Use equal-radius arcs and justify equal central angles',
 'inscribed-angle-methods':'Compare angles intercepting the same arc; measurements do not prove a general theorem',
 'proof-response-production':'Match triangle vertices and justify a congruence criterion before using corresponding parts',
 'parallelogram-evidence':'Separate sufficient conditions from examples and test the converse with a counterexample',
 'solid-representation-demands':'Distinguish bases, faces, edges, vertices and hidden edges',
 'square-inverse-measures':'Equal sides connect perimeter to side length; area is the square of the side',
 'right-triangle-converse':'Compare the largest-side square with the sum of the other two squares',
 'ruler-response-demands':'Read from zero, count subdivisions and reduce fractional lengths',
 'ruler-segment-difference':'A segment length is the difference of its endpoint readings',
 'metric-ruler-response':'Ten millimeters make one centimeter; preserve the ruler graduation',
 'scale-interpretations':'Equal intervals represent equal changes; distinguish graduation from accuracy',
 'temperature-comparison':'Use the given Celsius-Fahrenheit formula before comparing unlike scales',
 'protractor-response-demands':'Align the vertex and choose the scale whose zero is on the starting ray',
 'angle-estimation-methods':'Use familiar angle benchmarks and follow the requested measurement or estimation method',
 'calendar-month-relations':'Months follow a repeating twelve-month cycle',
 'calendar-date-models':'Use actual month lengths, leap-year February and the stated elapsed-day convention',
 'information-response':'Identify every quantity required and do not invent missing information',
 'dimensional-estimate-models':'Choose appropriate units and round dimensions before using the stated formula',
 'fraction-benchmark-distance':'Compare distances to the specified reference values',
 'circle-fraction-output':'One complete turn is 360 degrees and one whole is 100 percent',
 'denominator-domain-concepts':'A denominator cannot be zero, including after a factor is canceled',
 'domain-branch-contracts':'Retain original denominator exclusions and principal-root radicand restrictions',
 'motion-sum-extension':'Distance equals rate times the elapsed time for each traveler',
 'motion-speed-relations':'Express each travel time separately and preserve the given speed relationship',
 'gas-reporting-precision':'At fixed temperature pressure times volume is constant; round only the final result',
 'ideal-gas-unknowns':'Rearrange PV equals nRT and use units compatible with the supplied gas constant'
};
const modes=JSON.parse(fs.readFileSync(path.join(old,'relation-modes.json'))),used=new Map();
const lines=paths.map(([track,topic,mode,level,demand,selectors])=>{if(modes[track]&&modes[track]!==mode)throw Error('Mode conflict');if(!backgrounds[track])throw Error('Missing teacher guidance '+track);modes[track]=mode;const selected=[...new Set(selectors.split(' ').flatMap(resolve))];for(const id of selected){if(!used.has(id))used.set(id,[]);used.get(id).push({track,mode,level:Number(level)});}return[track,topic,level,demand,backgrounds[track],selected.map(id=>'=/'+id).join(' ')].join('|');});
const fileFor={'measurement':'measurement-bank','statistics':'statistics-bank','geometry':'geometry-bank','breadth':'breadth-bank','advanced':'advanced-bank','representations':'representations-bank','reasoning':'reasoning-bank','relations':'relations-bank','solids':'solids-bank','algebra-review':'algebra-review-bank','foundational-courses':'foundational-courses','algebra-half':'algebra-half','algebra-one':'algebra-one','algebra-two':'algebra-two','algebra-two-completion':'algebra-two-completion'};
const reviews=G.flatMap((g,i)=>{const name=g.source.family.replace('structured-',''),files=name==='curriculum87'?['src/curriculum87.js','src/curriculum87-phase2.js','src/curriculum87-early.js','src/curriculum87-middle.js','src/curriculum87-late.js','src/curriculum87-investigations.js','src/curriculum87-extra.js']:['src/'+fileFor[name]+'.js'];files.push('src/curriculum87-common.js');const hash=Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));return g.entries.map(id=>{const entry=ids.get(id),provider=rootProvider(entry),paths=used.get(provider.sourceId)||[];const reason=notes[i][1]+' '+(paths.length?'Reviewed paths distinguish task demand, response and method; only explicitly staged non-related paths assert direction.':'Reviewed topic-only: no sufficiently matching whole-contract counterpart was validated. Retain topic discovery without a direction; no course or grade rank is inferred.');return{sourceId:id,reviewGroup:g.key,reviewed:true,reason,evidenceFiles:files,entryContract:entry,providerContract:provider,scope:'complete executable range, branches, representations, required methods, units and rounding; no grade ranking',evidenceSha256:hash,trackIds:paths.map(p=>p.track),disposition:paths.length?'reviewed path':'reviewed related-only; no ranked counterpart validated'};});});
fs.writeFileSync(path.join(dir,'progressions.txt'),fs.readFileSync(path.join(old,'progressions.txt'),'utf8')+'\n# Chunk 3 full-contract review; exact canonical providers only.\n'+lines.join('\n')+'\n');
fs.writeFileSync(path.join(dir,'relation-modes.json'),JSON.stringify(modes,null,2)+'\n');
fs.writeFileSync(path.join(dir,'chunk3-review.json'),JSON.stringify(reviews,null,2)+'\n');
fs.writeFileSync(path.join(dir,'chunk3-contract-groups.json'),JSON.stringify(G.map((g,i)=>({index:i,key:g.key,entries:g.entries,contract:notes[i][1]})),null,2)+'\n');
console.log({groups:G.length,reviewed:reviews.length,pathEntries:reviews.filter(r=>r.trackIds.length).length,topicOnly:reviews.filter(r=>!r.trackIds.length).map(r=>r.reviewGroup)});
