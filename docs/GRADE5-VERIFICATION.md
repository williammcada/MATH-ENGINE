# Grade 5 implementation verification — 0.2.0-rc.1

Tested implementation checkpoint: `8ab901b2c864623ecddc4356aa5549961d04e43c`.
Initial implementation checkpoint preserved before extended testing: `1769f4cfcd75a92d8824eaa6f827ea89385a3040`.
Verification date: 2026-10-08 (Asia/Shanghai).
Environment: Node.js v24.19.0; headless Chromium 153.0.8010.0 on Linux, desktop 1280×900 and narrow viewport 390×844.

## Results

| Check | Result | Evidence and limits |
| --- | --- | --- |
| Eight Grade 5 families | Passed | 1,000 seeded samples per family; 8,000 total. Independent BigInt rational evaluation, brute-force LCM search, integer-power checks and geometry calculations agree with generated answers. |
| Parameter/structure constraints | Passed | Checked positive fraction results, unlike denominators, precedence sensitivity, all three expression patterns, source/proposed bounds, proper/improper roots, all 23 square-side values, four length units, two/three LCM operands and the listing-length limit. This is sampled verification, not enumeration of every seed. |
| Prism net | Passed | Six non-overlapping faces; area sum equals surface area; 100 independently propagated fold-orientation checks yield six distinct face normals. Visually inspected desktop student and teacher renders. |
| Answers and evidence | Passed | Reduced versus unreduced fractions, mixed-number equivalents, powers versus evaluated integers, square units, malformed inputs, wrong answers and teacher-review flags checked. LCM/net work is not automatically graded. |
| Reproducibility | Passed | Repeated family/seed/index values return identical records; CommonJS and browser-global modes agree. Reproducibility is version-specific. |
| Outcome lookup | Passed | Family ID, full code and exact domain-free alias agree. Unknown, incorrect-domain and non-Grade-5 codes reject; no fallback skill is silently selected. |
| Browser workflow | Passed | All eight families generated, accepted correct final answers, showed/reset teacher solutions, replayed seeds and advanced item numbers. Invalid-index work preservation, MathML, six SVG faces and print hiding checked; no page errors. |
| Visual review | Passed | Inspected net student/teacher screens and fraction layout at a narrow viewport. No horizontal overflow in the tested narrow case. |
| Original baseline retained | Passed | Bundle SHA-256 unchanged; existing checks cover 312 unique skills, 6,240 own-answer smoke checks and 312 targeted-selection checks. These old checks establish self-consistency, not independent mathematical proof of every legacy skill. |
| Tested artifact equals checkpoint | Passed | Seven runtime/package/test/baseline file Git blob hashes match the committed tree exactly. |
| Physical iPad/iPhone | Not run | Desktop viewport emulation does not verify physical devices or their browsers. |
| Full Studio packets and DOCX/PDF | Not run | The separate Studio import/targeting/export workflow is not implemented by this provider. Print CSS checks are not Word/PDF layout verification. |
| Full 331-outcome readiness | Not run | Eight initial family contracts implemented. Numeric-base-only exponent scope, method review and remaining curriculum work stay explicit. No automatic-assignment flags promoted. |
| Hosted deployment | Not run | Local review only; no hosting configuration or live application changed. |

## Reproduction

- `npm test`
- With Playwright and a Chromium installation available: `node tests/browser-review.cjs`
- Optional environment variables: `PLAYWRIGHT_MODULE` for a nonstandard Playwright module path; `CHROMIUM_EXECUTABLE_PATH` for an installed Chromium; `REVIEW_ARTIFACTS` for screenshots.

The default Playwright browser download was unavailable in this environment. The completed browser run used the existing Chromium executable; its version is recorded above. No browser failure is presented as a passed check.

## Artifact hashes

- `src/grade5.js`: SHA-256 `e3c41dc8af4cf44f036c55e77e3d44fb6848a65bc0ce6ab8c7cb23f1959481b2`
- `review/grade5.html`: SHA-256 `82fd3e6d5e6185b06f7ccd20df82c9ce15c0cbb122b78038913cf8c05a124715`
- `package.json`: SHA-256 `c0fda9306beb31226e003e3b10d4168c2f013e7114fa1446b097792497e84936`
- `tests/grade5.test.cjs`: SHA-256 `61ad33aac2b36afb76c5a704e44721488e9f150f9dbaa8083d6042f39a41e382`
- `tests/browser-review.cjs`: SHA-256 `2fcde95edbc4e2321254941d42784da42d5995c07ac62a5395daeaef1383131f`
- `tests/baseline.cjs`: SHA-256 `614f9dc4d1d030476711fa3d44189f52feb32f3ac8910238b485a684e05b85cb`
- `baselines/megaman-v0.7/shared-math.js`: SHA-256 `78841274e50b07c6640913bb84fdd821247ed47030b575feb27760d35fcff1a0`

## Checkpoint status

The source above passed the listed engine and local-browser checks. This verification record preserves the exact tested candidate; it is not a fully verified classroom release. The evidence-record commit changes documentation and implementation-status metadata only. It does not alter the tested runtime, review page, package or tests. Release packaging, broader device support, consumer integration and deployment remain separate stages.
