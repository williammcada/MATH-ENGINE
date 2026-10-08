#!/usr/bin/env python3
"""Rebuild original task catalog from approved codes and uncoded course scopes."""
from pathlib import Path
import json,sys,subprocess
E=Path(__file__).resolve().parents[1];upto=105;rows=json.loads((E/'curriculum/mcada-g5/v0.2/coverage-map.json').read_text())['outcomes'];tasks=[]
for o in rows:
 short=o['gradecam_alias'].removeprefix('PS.MAT.G5.');lesson=short.split('.')[0]
 if lesson.isdigit() and not 7<=int(lesson)<=upto:continue
 if not lesson.isdigit() and not lesson.startswith('INV'):continue
 scope=str(200+int(lesson[3:])) if lesson.startswith('INV') else lesson
 tasks.append({'sourceId':'course-87-en:authored:MCADA-'+short,'sourceLabel':'MCADA-'+short,'lessonId':'course-87-en:scope:'+scope,'family':'structured-curriculum87','recipe':short,'title':o['objective'].strip(),'course':'Introduction to PreAlgebra (8/7)','standard':o['source_code'],'alias':o['gradecam_alias'],'objective':o['objective'].strip(),'origin':'original-curriculum-task','exactLegacyReproduction':False,'fullOutcomeVerified':False})
coded=len(tasks)
extras=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./src/curriculum87-extra').tasks))"],cwd=E))
for t in extras:
 tasks.append({'sourceId':'course-87-en:authored:'+t['recipe'],'sourceLabel':t['recipe'],'lessonId':'course-87-en:scope:'+str(t['scope']),'family':'structured-curriculum87','recipe':t['recipe'],'title':t['title'],'course':'Introduction to PreAlgebra (8/7)','standard':None,'alias':None,'objective':t['objective'],'origin':'original-curriculum-task','exactLegacyReproduction':False,'fullOutcomeVerified':False})
(E/'src/curriculum87-map.js').write_text('(function(root){const data='+json.dumps(tasks,ensure_ascii=False,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathCurriculum87Map=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
