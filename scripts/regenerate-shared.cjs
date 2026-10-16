#!/usr/bin/env node
/* Regenerates every shared output from the committed inputs, in dependency order (coverage-parallel-courses-v0.1):
     1. scripts/build-port87-map.py        src/port87-map.js and each src/port-<course>-map.js, with their mappings
     2. scripts/build-cross-course.py      src/cross-course-map.js and curriculum/cross-course/v0.6/*
     3. scripts/build-related-concepts.cjs src/related-concepts-map.js and curriculum/related-concepts/v0.1/*
     4. scripts/build-coverage-ledger.py   curriculum/coverage-ledger/v0.1/ledger.json
     5. scripts/build-practice.cjs         src/k7-skills.js, src/practice-index.js and dist/*
   At 0.61.1-rc.1 this order reproduced every committed output byte for byte.

   Usage: node scripts/regenerate-shared.cjs [directory]   (default: this repository)
   The integration pass runs it in the repository and commits the result. A course chat never commits these outputs;
   scripts/verify-course.cjs runs it in a temporary copy instead. */
'use strict';
const path = require('path'), { execFileSync } = require('child_process');
const dir = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const STEPS = [
  ['python3', 'scripts/build-port87-map.py'],
  ['python3', 'scripts/build-cross-course.py'],
  ['node', 'scripts/build-related-concepts.cjs'],
  ['python3', 'scripts/build-coverage-ledger.py'],
  ['node', 'scripts/build-practice.cjs'],
];
for (const [cmd, script] of STEPS) {
  process.stdout.write(script + ' … ');
  execFileSync(cmd, [path.join(dir, script)], { cwd: dir, stdio: ['ignore', 'ignore', 'inherit'] });
  console.log('done');
}
