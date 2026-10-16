/* Registry of the parallel-course port modules (coverage programme, docs/change-specs/coverage-parallel-courses-v0.1.md).
   Each course module owns the recipes whose names start with its prefix and serves them through src/port87.js,
   family structured-port87, so course-banks and every host see one port catalog. Adding tasks to a course never
   changes this file. This file is shared: only the integration pass changes it.
   Browser hosts load, in order: curriculum87-common.js, port-shared.js, port87-map.js, each port-<course>-map.js and
   port-<course>.js below, this file, then port87.js. */
(function(root){'use strict';
const common=typeof module!=='undefined'&&module.exports;
const courses=common?[
 require('./port-intermediate-4'),
 require('./port-algebra-half'),
 require('./port-algebra-1'),
 require('./port-algebra-2'),
]:[root.MathPortIntermediate4,root.MathPortAlgebraHalf,root.MathPortAlgebra1,root.MathPortAlgebra2];
// Structural guard: a course module that is missing or malformed stops loading here rather than mis-serving tasks.
const seen=new Set();
for(const m of courses){
 if(!m||typeof m.build!=='function'||!Array.isArray(m.catalog)||!m.key||!m.prefix||!m.course)throw Error('Port course module missing or malformed');
 for(const p of seen)if(m.prefix.startsWith(p)||p.startsWith(m.prefix))throw Error('Port course prefixes overlap: '+p+' / '+m.prefix);
 seen.add(m.prefix);
 for(const c of m.catalog)if(!String(c.recipe).startsWith(m.prefix)||c.course!==m.course||c.family!=='structured-port87')throw Error(m.key+': catalog entry '+c.sourceId+' does not belong to this module');
}
Object.freeze(courses);
if(common)module.exports=courses;root.MathPortCourses=courses;
})(typeof globalThis!=='undefined'?globalThis:this);
