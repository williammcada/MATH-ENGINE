# Verification — Engine 0.37.0-rc.1, single-answer games

Candidate: branch `implement/v0.37.0-single-answer-games` (commit recorded in the PR). Spec: [v0.37.0-single-answer-games](../change-specs/v0.37.0-single-answer-games.md).

| Check | Result | Context |
| --- | --- | --- |
| `node tests/practice.cjs` (50 seeds/item) | Passed | 27 checks, 0 failures; [results](practice-v0.37.0-results.json) |
| single-answer-only | Passed | every game item (1,480) × 50 seeds |
| multi-part-tags | Passed | 283 tagged: absent, explained, refused, confirmed; 2,184 bank entries accounted for |
| Reported item MCADA-30.1 excluded; 30.3 kept | Passed | in practice.cjs |
| `npm test` | Passed | baseline, Grade 5, course banks |
| `npm run test:phase2` | Passed | 331 coded rows |
| ESM import of `dist/math-engine-practice.js` | Passed | `gameExclusion`, `gameExcludedCounts` exported |
| MathQuest / Math Arcade with this bundle | Not run | hosts not yet synced (host change specs) |
| Physical iPad | Not applicable | no UI change in the Engine |
