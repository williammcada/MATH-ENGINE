"""Milestone 5 family anchors, not a complete Algebra 2 lesson map."""
import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
groups=[
('algebra',51,'complex:subtract complex:power complex:divide complex:euler'),
('algebra',62,'quadratic:complex-formula quadratic:complex-complete'),
('algebra',109,'fractional:negative fractional:variables'),
('algebra',77,'radical:two radical:extraneous'),
('algebra',105,'factor:quartic factor:cubes'),
('algebra',103,'division:quadratic'),
('algebra',70,'literal:exception'),
('systems',90,'three:unique three:dependent three:inconsistent'),
('systems',85,'nonlinear:line-parabola nonlinear:circle-line nonlinear:two-squares'),
('inequalities',110,'inequality:quadratic inequality:repeated'),
('inequalities',121,'inequality:rational inequality:hole'),
('inequalities',114,'plane:nonlinear'),
('inequalities',91,'plane:linear'),
('logs',113,'log:convert log:antilog'),
('logs',122,'log:expand log:condense'),
('logs',118,'log:sum log:difference log:extraneous'),
('logs',115,'exponential:solve exponential:interest exponential:graph'),
('trig',44,'trig:triangle trig:inverse'),
('trig',54,'polar:rectangular polar:polar'),
('trig',63,'vector:components vector:polar'),
('trig',76,'vector:negative'),
('trig',78,'vector:force'),
('models',52,'mixture:final'),
('models',61,'mixture:stock mixture:extract mixture:dilute mixture:replace'),
('models',57,'gas:pressure gas:volume gas:temperature'),
('models',69,'gas:combined-pressure gas:combined-temperature'),
('models',88,'gas:ideal'),
('models',92,'motion:river'),
('models',96,'variation:joint variation:combined'),
('geometry',30,'proof:vertical'),
('geometry',124,'proof:congruence proof:isosceles'),
('geometry',39,'proof:parallelogram'),
('geometry',125,'proof:chord proof:tangent'),
('geometry',123,'construct:bisector construct:perpendicular construct:angle-copy locus:two'),
('geometry',127,'space:lines-planes'),
('statistics',129,'statistics:population statistics:normal'),
('sets',122,'sets:venn'),
('sets',116,'counting:probability')]
contracts={
'algebra':('Simplify, factor, divide, solve or rearrange; show work.','Integer coefficients in bounded ranges; real domains explicit; i² = −1.','Teacher-reviewed equivalent exact symbolic forms with domain exclusions; required method retained.'),
'systems':('Solve and classify systems; give every solution and verify substitution.','Real unknowns; branches include zero/one/two/four solutions or dependent/inconsistent systems.','Teacher review of elimination/substitution and complete solution sets.'),
'inequalities':('Produce real solution sets or a shaded coordinate graph.','Finite integer critical points; open/closed boundaries, excluded poles and canceled holes.','Equivalent interval/set-builder notation; graphs and sign charts teacher-reviewed.'),
'logs':('Apply logarithm laws, solve or graph exponentials and calculate compound interest.','Bases positive and not 1; every logarithm argument positive; final rounding stated.','Exact symbolic work teacher-reviewed; explicitly rounded numeric tasks checked numerically.'),
 'trig':('Solve triangles; convert coordinates; combine vectors.','Degree angles; polar radius nonnegative, angle 0 ≤ θ < 360; zero vector direction undefined.','Rounded components/magnitudes/angles specified; drawn vectors use teacher review.'),
'models':('Form and solve concentration, gas, motion and variation models.','Positive physical quantities; units and Kelvin conversion specified; no intermediate rounding.','Model and isolated unknown checked by teacher; exact/rounded numerical tasks checked numerically.'),
'geometry':('Produce a justified proof, construction or locus diagram.','Nondegenerate stated geometric givens; diagrams are schematic unless coordinates supplied.','Teacher rubric requires construction marks or logical reasons; recognition alone does not satisfy.'),
'statistics':('Compute population SD from raw data; interpret a normal model.','Five-value population, including equal-data boundary; normal parameters have positive SD.','Round only final SD to hundredths; normal empirical rule is approximate.'),
'sets':('Produce Venn regions; calculate probabilities from finite counts.','Consistent nonnegative region sizes; explicit without-replacement/order conventions.','Exact rational probabilities; sets/Venn production teacher-reviewed.')}
rows=[]
for group,lesson,recipes in groups:
 for recipe in recipes.split():
  action,domain,scoring=contracts[group]; sid='algebra-2-en:authored:M5-'+recipe.replace(':','-')
  rows.append(dict(sourceId=sid,sourceLabel='M5 '+recipe.replace(':',' / '),lessonId=f'algebra-2-en:scope:{lesson}',bankId='algebra-2-en',family='structured-algebra-two',recipe=recipe,title=recipe.replace(':',' — ').replace('-',' ').capitalize(),course='Algebra 2',standard=None,alias=None,origin='original-curriculum-task',exactLegacyReproduction=False,fullOutcomeVerified=False,group=group,contract=dict(action=action,domain=domain,scoring=scoring,coverage='representative family anchor; complete lesson closure is Milestone 6')))
(root/'src/algebra-two-map.js').write_text('/* Original family anchors; no claim of full lesson coverage. */\n(function(root){const data='+json.dumps(rows,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathAlgebraTwoMap=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
out=root/'curriculum/remaining-courses/milestone5-v0.1';out.mkdir(exist_ok=True)
(out/'contracts.json').write_text(json.dumps(rows,indent=2)+'\n')
print(len(rows),'family anchors')
