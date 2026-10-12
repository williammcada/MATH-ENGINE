# Engine 0.34.0-rc.1 host practice layer — verification

**Spec:** [host-integration-v0.1](../change-specs/host-integration-v0.1.md) · **Date:** 2026-10-12 (Asia/Shanghai) · **Branch:** `review/engine-0.34.0`
**Environment:** Linux, Node.js 22.22.0. No browser, Worker runtime or physical device was used.
**Raw results:** [practice-v0.34.0-results.json](practice-v0.34.0-results.json)

## What was built

- `src/practice.js` — the single host interface: `catalog`, `courses`, `find`, `generate` (seeded), `nextItem` (live), `checkAnswer`, `related`, `keypadKeys`, and a `Practice` gate controller with the same behavior as the K–7 baseline's.
- `src/k7-skills.js` — generated loader that embeds the megaman-v0.7 baseline verbatim and runs it with a seeded `Math`.
- `src/practice-index.js` — generated list of game-eligible course-bank entries with course, grade, lesson label and topic.
- `dist/math-engine-practice.js` — one self-contained ESM bundle (6.08 MB; 0.88 MB gzipped) plus provenance JSON. Built by `npm run build:practice`; no third-party bundler.

## Catalog (decision D2)

| Layer | Count |
| --- | --- |
| K–7 skills | 312 (K 20, G1 19, G2 21, G3 68, G4 64, G5 36, G6 51, G7 33); IDs unchanged |
| Course-bank entries, auto-checked | 1,441 (Intermediate 4 210, Course 1 198, 8/7 387, Algebra 1/2 291, Algebra 1 163, Algebra 2 192) |
| **Game-eligible total** | **1,753** |

Excluded from games: 737 teacher-reviewed tasks, plus 6 entries that switch to a teacher-reviewed variant for some seeds (found by scanning 200 seeds each at build time). A deterministic redraw guards any remaining case; it was needed 0 times in verification.

Bank answer entry: 1,280 entries fit the keypad (with the extra keys each answer needs); 161 need the device keyboard (words, text, set notation).

## Results

| Check | Result |
| --- | --- |
| K–7 baseline bytes unchanged (SHA-256 `78841274…`) and embedded verbatim | Passed |
| Every game-eligible item generates, 50 seeds each (87,650 items) | Passed |
| Same id + seed + index gives an identical item | Passed (87,650) |
| Item's own answer is accepted | Passed (87,650) |
| Accepted after a JSON round trip (as hosts store items) | Passed (87,650) |
| A perturbed answer (answer text + "7") is rejected | Passed (87,650) |
| Keypad offers every character the answer needs | Passed (87,650) |
| Course-bank items identical to what Studio generates for the same seed | Passed (72,050) |
| `related` easier/harder returns only game-eligible items | Passed — 2,605 links; 492 items have an easier link, 443 a harder link |
| Practice gates: K–7 gate, mixed K–7 + bank targeted gate, wrong answer rejected, unknown id rejected | Passed |
| Bundle hash and content hash match provenance | Passed |
| Existing suites `npm test`, `test:structured`, `test:phase2` | Passed |
| Existing suites `test:foundations87`, `test:curriculum87` | **Failed — pre-existing.** They fail identically on `main` (`4fb2db4`): a stale count assertion expects 891 bank entries; the banks now hold 2,184. Not caused by this change; not fixed here. |

## Defect found and handled

K–7 skill `g5-powers10` stores floating-point answers such as `7920.999999999999` for `79.21 × 10^2`. Students typing `7921` were already accepted (the baseline's numeric tolerance), but reports and answer keys showed the long decimal. The practice layer now reports `answerText` rounded to 12 significant digits (`7921`); checking still uses the baseline unchanged. The same defect exists in today's Math Arcade build.

## Not run

Cloudflare Worker / Durable Object runtime, browser rendering of `html` and diagrams, iPad/iPhone entry, and the MathQuest and Arcade host integrations. Those belong to the host verification stage.
