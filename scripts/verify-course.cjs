#!/usr/bin/env node
/* Verification for a parallel-course batch (docs/change-specs/coverage-parallel-courses-v0.1.md).

   Usage: node scripts/verify-course.cjs <course-key|all> [--base REF] [--files-only] [--keep]
     course-key   intermediate-4, algebra-half, algebra-1 or algebra-2 ('all' is for the integration pass)
     --base REF   where the course branch started (default: merge-base with claude/coverage-parallel-setup)
     --files-only only check which files the branch changes
     --keep       keep the temporary copy and print its path

   1. Ownership. Every file the branch changes since --base must belong to the course (OWNED below). A shared file in
      the diff fails the check: stop and ask the owner (§e of the spec). Skipped for 'all'.
   2. Integrated run. The working tree is copied to a temporary directory, the shared outputs are regenerated there
      (scripts/regenerate-shared.cjs) and every test in tests/ is run. The branch itself is not changed, so
      regenerated outputs never reach a course commit.
   3. Comparison with docs/verification/parallel-courses-baseline.json: every test that passed at the setup
      checkpoint must still pass, and every test added since must pass. Tests that already failed there are listed
      as pre-existing failures. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync, spawnSync } = require('child_process');
const root = path.join(__dirname, '..');
const COURSES = { 'intermediate-4': 'i4', 'algebra-half': 'ah', 'algebra-1': 'a1', 'algebra-2': 'a2' };
const args = process.argv.slice(2), key = args[0];
if (!(key in COURSES) && key !== 'all') { console.error('Usage: node scripts/verify-course.cjs <' + Object.keys(COURSES).join('|') + '|all> [--base REF] [--files-only] [--keep]'); process.exit(2); }
const opt = n => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const gitRaw = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const git = (...a) => gitRaw(...a).trim();
const SETUP = 'claude/coverage-parallel-setup';
// Where the course branch started: --base, else its merge-base with the setup branch. A single-branch or shallow clone
// may not have that history, so fetch it (bounded depth) once before giving up.
function findBase() {
  const tryRefs = () => { for (const ref of ['origin/' + SETUP, SETUP]) { try { return git('merge-base', 'HEAD', ref); } catch (e) { /* next */ } } return null; };
  let b = tryRefs(); if (b) return b;
  try {
    gitRaw('fetch', '-q', '--depth=1000', 'origin', `${SETUP}:refs/remotes/origin/${SETUP}`);
    const cur = git('rev-parse', '--abbrev-ref', 'HEAD');
    if (cur !== 'HEAD') { try { gitRaw('fetch', '-q', '--depth=1000', 'origin', cur); } catch (e) { /* not pushed yet */ } }
  } catch (e) { /* offline */ }
  return tryRefs();
}

// Files a course chat owns. Everything else is shared and changes only in the integration pass.
function OWNED(k) {
  const s = COURSES[k], esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [
    `src/port-${k}.js`, `src/port-${k}-map.js`, `scripts/port_${s}_tasks.py`, `tests/port-${k}.cjs`,
    `curriculum/source-mappings/port-${k}-v0.1.json`,
  ].map(f => new RegExp('^' + esc(f) + '$')).concat([
    new RegExp(`^curriculum/coverage-ledger/v0\\.1/decisions/\\d{4}-\\d{2}-\\d{2}-${s}-batch\\d+-[\\w.-]+\\.json$`),
    new RegExp(`^docs/change-specs/coverage-${s}-[\\w.-]+\\.md$`),
    new RegExp(`^docs/verification/coverage-${s}-[\\w.-]+\\.(md|json)$`),
  ]);
}

let failed = false;
if (key !== 'all') {
  const base = opt('--base') || findBase();
  if (!base) { console.error(`Could not find where this branch started. Run: git fetch --depth=1000 origin ${SETUP}  — or pass --base <commit>.`); process.exit(2); }
  // Committed changes since the base, plus uncommitted and untracked ones (porcelain -z: "XY path", renames add the old path).
  const status = gitRaw('status', '--porcelain', '-z', '--untracked-files=all').split('\0').filter(Boolean);
  const pending = [];
  for (let i = 0; i < status.length; i++) { pending.push(status[i].slice(3)); if (/^R|^C/.test(status[i])) i++; }
  const changed = [...new Set([...git('diff', '--name-only', base, 'HEAD').split('\n'), ...pending].filter(Boolean))].sort();
  const owned = OWNED(key), foreign = changed.filter(f => !owned.some(r => r.test(f)));
  console.log(`Ownership (${key}, since ${base.slice(0, 7)}): ${changed.length} changed file(s)`);
  if (foreign.length) { failed = true; console.log('FAIL  shared or other-course files changed — stop and ask the owner:\n  ' + foreign.join('\n  ')); }
  else console.log('PASS  only this course\'s files changed');
  if (args.includes('--files-only')) process.exit(failed ? 1 : 0);
}

// Integrated copy: tracked and untracked (not ignored) files.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-verify-'));
for (const f of git('ls-files', '-co', '--exclude-standard').split('\n').filter(Boolean)) {
  const src = path.join(root, f); if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.copyFileSync(src, path.join(tmp, f));
}
console.log('Regenerating shared outputs in a temporary copy');
execFileSync('node', [path.join(tmp, 'scripts/regenerate-shared.cjs'), tmp], { stdio: 'inherit' });

const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/verification/parallel-courses-baseline.json'), 'utf8'));
const results = {};
// Node tests first: some Python audits read samples their companion test writes (milestone2-4 → /tmp/mN-samples.json).
const order = f => (f.endsWith('.py') ? 1 : 0);
for (const f of fs.readdirSync(path.join(tmp, 'tests')).sort((a, b) => order(a) - order(b) || (a < b ? -1 : a > b ? 1 : 0))) {
  if (f === 'port-course-harness.cjs') continue;                       // a library, not a test
  const cmd = f.endsWith('.test.cjs') ? ['node', ['--test', 'tests/' + f]] : f.endsWith('.cjs') ? ['node', ['tests/' + f]] : f.endsWith('.py') ? ['python3', ['tests/' + f]] : null;
  if (!cmd) continue;
  const t0 = Date.now(), r = spawnSync(cmd[0], cmd[1], { cwd: tmp, encoding: 'utf8', maxBuffer: 1 << 28 });
  results[f] = { status: r.status === 0 ? 'Passed' : 'Failed', seconds: Math.round((Date.now() - t0) / 1000), tail: r.status === 0 ? undefined : (r.stdout + r.stderr).trim().split('\n').slice(-6).join('\n') };
  process.stdout.write(`${results[f].status === 'Passed' ? 'PASS' : 'FAIL'}  ${f} (${results[f].seconds}s)\n`);
}
const regress = Object.keys(results).filter(f => results[f].status === 'Failed' && baseline.tests[f] !== 'Failed');
const preexisting = Object.keys(results).filter(f => results[f].status === 'Failed' && baseline.tests[f] === 'Failed');
const missing = Object.keys(baseline.tests).filter(f => !(f in results));
fs.writeFileSync(path.join(tmp, 'verify-results.json'), JSON.stringify({ course: key, baseline: baseline.checkpoint, results }, null, 1) + '\n');
console.log(`\nCompared with ${baseline.checkpoint}: ${Object.keys(results).length} tests; ${preexisting.length} pre-existing failure(s) unchanged`);
if (missing.length) { failed = true; console.log('FAIL  baseline tests missing: ' + missing.join(', ')); }
if (regress.length) { failed = true; console.log('FAIL  newly failing (passed at the baseline, or new):'); for (const f of regress) console.log('  ' + f + '\n    ' + (results[f].tail || '').replace(/\n/g, '\n    ')); }
else console.log('PASS  every test that passed at the baseline still passes; every new test passes');
if (args.includes('--keep')) console.log('Temporary copy kept: ' + tmp); else fs.rmSync(tmp, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
