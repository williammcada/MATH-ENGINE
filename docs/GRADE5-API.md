# Grade 5 generator API — 0.2.0-rc.1

Load `src/grade5.js` as a browser script (`MathEngineG5`) or with `require('./src/grade5.js')`. No network dependency or student data is required.

```js
const engine = require('./src/grade5.js');
const question = engine.generate('PS.MAT.G5.MD.20.11', {
  seed: 'class-practice', index: 0
});
const feedback = engine.checkAnswer(question, '36 cm²');
```

The example answer is illustrative; the generated question determines the required value.

`catalog` lists eight family IDs, full outcome codes, exact GradeCam aliases, source references and limited scope descriptions. `generate` accepts any of those exact IDs, a nonempty text or safe-integer seed, and a nonnegative safe-integer index (default zero). Numeric seed 1 and text seed "1" intentionally produce the same sequence. Whitespace within a valid seed is significant. Reproducibility is guaranteed only within the same module version. Unsupported families, wrong domain codes, non-Grade-5 codes and unknown options throw descriptive errors.

The immutable, JSON-serializable question includes: family and outcome identities; version/seed/index; source provenance; prompt; expression tree where applicable; structured givens; exact answer; worked solution; visual face geometry where required; and teacher-work criteria. Retain this complete record rather than regenerating separately for the answer key. Do not expose its answer/solution fields in a student API response; `renderQuestion` emits only the student view.

`checkAnswer(question, response)` accepts a string, or `{value, unit}`. Fractions use `a/b`, mixed numbers use `w a/b`, powers use `b^e`, and area units accept forms such as `cm²`, `cm^2`, `cm2` or `square centimeters`. Parsing is deliberately limited and does not execute expressions. Decimal/scientific-notation expressions are not a general calculator input language. For a fraction target, a decimal or unreduced fraction can have the correct value while failing the requested form.

The result separates `valueCorrect`, `formatCorrect`, `unitCorrect`, and `answerCorrect`. `requiresTeacherReview` indicates required method/net work, even if the final answer is wrong. `fullOutcomeVerified` is always false in this slice. Source coverage is not automatically upgraded by a generated numerical answer.

`renderQuestion` returns escaped HTML with MathML expressions and a schematic SVG net. `renderSolution` returns the worked solution and work rubric. `answerText` is for teacher display/testing, not student delivery. The mathematical expression tree and exact givens are available for future equation-editor exports; this module does not produce DOCX/PDF files.

This API is an additive Grade 5 provider alongside the preserved compiled Mega Man baseline. It is not a replacement for `SharedMath` settings/session APIs, and existing games have not been migrated. The 331-outcome audit remains historical evidence; only these eight initial family contracts have an implementation here. GradeCam-driven differentiated packets remain Grade 5 only and are not implemented by this module.

Run `npm test` for the old baseline smoke checks plus independent tests for this provider. Open `review/grade5.html` for the browser workflow. The page is stateless; reloading clears answers. Close the teacher solution before printing a student copy. Browser review and print styling do not establish Word/PDF export readiness or physical-device verification.
