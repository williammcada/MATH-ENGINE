"""Build explicit reviewed Algebra 1 bindings; no automatic lexical assignments."""
import json,gzip,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1];target=root/'curriculum/remaining-courses/milestone4-v0.1';target.mkdir(parents=True,exist_ok=True)
plan=(target/'lesson-plan.txt').read_text()
lessons=[x for x in json.load(gzip.open(root/'curriculum/remaining-courses/milestone1-v0.1/lesson-backlog.json.gz','rt')) if x['course']=='algebra-1-en']
cat=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./src/course-banks').catalog))"],cwd=root,text=True));ids={c['sourceId']:c for c in cat};hmap={c['recipe']:c for c in cat if c['family']=='structured-algebra-half'}
mapping={a:b.split() for a,b in (l.split('|') for l in plan.splitlines())};entries=[];coverage=[]
for l in lessons:
 key=l['id'].split(':')[-1];items=[]
 for k,recipe in enumerate(mapping[key],1):
  reuse=None
  if recipe.startswith('@'):reuse=recipe[1:]
  elif recipe.startswith('r') and (recipe[1:2].isdigit() or recipe.startswith('rCOURSE') or recipe.startswith('rINV')):reuse='course-87-en:authored:'+('' if recipe.startswith('rCOURSE') else 'MCADA-')+recipe[1:]
  elif recipe.startswith('h'):reuse=hmap[recipe[1:]]['sourceId']
  if reuse:assert reuse in ids,reuse
  sid=f'algebra-1-en:authored:M4-{key}-{k}'
  row=dict(sourceId=sid,sourceLabel=f'M4 Lesson {key}-{k}',lessonId=l['id'],bankId='algebra-1-en',family='structured-algebra-one',recipe=recipe,title=ids[reuse]['title'] if reuse else recipe.replace(':',' — ').replace('-',' ').capitalize(),course='Algebra 1',standard=None,alias=None,origin='original-curriculum-task',exactLegacyReproduction=False,fullOutcomeVerified=False)
  if reuse:row['reuseSourceId']=reuse
  entries.append(row);items.append(sid)
 coverage.append(dict(lessonId=l['id'],title=l['title'],sourceRecordCount=l['sourceRecordCount'],demands=l['demands'],entries=items,disposition='implementation-pending-verification'))
(root/'src/algebra-one-map.js').write_text('(function(root){const data='+json.dumps(entries,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathAlgebraOneMap=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
(target/'coverage.json').write_text(json.dumps(coverage,indent=2)+'\n')
print('Entries',len(entries),'reuse',sum('reuseSourceId'in x for x in entries),'new recipes',sorted(set(x['recipe']for x in entries if 'reuseSourceId'not in x)))
