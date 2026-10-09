"""Explicit lesson/demand routes. Source title matching only joins retained metadata."""
import json,gzip,subprocess,re
from pathlib import Path
root=Path(__file__).resolve().parents[1];out=root/'curriculum/remaining-courses/milestone6-v0.1'
lessons=[l for l in json.load(gzip.open(root/'curriculum/remaining-courses/milestone1-v0.1/lesson-backlog.json.gz','rt')) if l['course']=='algebra-2-en']
cat=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./src/course-banks').catalog))"],cwd=root,text=True));ids={c['sourceId']:c for c in cat};families={p:{c['recipe']:c['sourceId'] for c in cat if c['family']==f and not c.get('reuseSourceId')} for p,f in [('a','structured-algebra-one'),('h','structured-algebra-half'),('m','structured-algebra-two')]}
plan={int(a):[g.strip().split() for g in b.split(';')] for a,b in [line.split('|') for line in (out/'lesson-plan.txt').read_text().splitlines()]}
entries=[];coverage=[]
for l in lessons:
 key=int(l['id'].split(':')[-1]);groups=plan[key];assert len(groups)==len(l['demands']),(key,len(groups),len(l['demands']))
 tokens=list(dict.fromkeys(t for g in groups for t in g));lookup={}
 for k,token in enumerate(tokens,1):
  reuse=None
  if token.startswith('#'):reuse='algebra-2-en:node:'+token[1:]
  elif '/' in token:
   prefix,recipe=token.split('/',1)
   reuse=('course-87-en:authored:'+('' if recipe.startswith('COURSE') else 'MCADA-')+recipe) if prefix=='r' else families[prefix][recipe]
  if reuse:assert reuse in ids,reuse
  sid=f'algebra-2-en:authored:M6-{key}-{k}'
  if reuse and (ids[reuse].get('lessonId')==l['id'] or reuse in [e['sourceId'] for e in l['existingProviders']]):sid=reuse
  else:
   row=dict(sourceId=sid,sourceLabel=f'M6 Lesson {key}-{k}',lessonId=l['id'],bankId='algebra-2-en',family='structured-algebra-two-completion',recipe=token,title=ids[reuse]['title'] if reuse else token.replace(':',' — ').replace('-',' ').capitalize(),course='Algebra 2',standard=None,alias=None,origin='original-curriculum-task',exactLegacyReproduction=False,fullOutcomeVerified=False)
   if reuse:row['reuseSourceId']=reuse
   entries.append(row)
  lookup[token]=sid
 coverage.append(dict(lessonId=l['id'],title=l['title'],sourceRecordCount=l['sourceRecordCount'],entries=list(lookup.values()),demandRoutes=[dict(text=d['text'],entries=[lookup[t] for t in g],scope='bounded original curriculum coverage; not exact publisher reproduction') for d,g in zip(l['demands'],groups)],disposition='implementation-pending-verification'))
(root/'src/algebra-two-completion-map.js').write_text('(function(root){const data='+json.dumps(entries,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathAlgebraTwoCompletionMap=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
(out/'coverage.json').write_text(json.dumps(coverage,indent=2)+'\n')
print('new bindings',len(entries),'reuse',sum('reuseSourceId'in x for x in entries),'custom recipes',len(set(x['recipe']for x in entries if 'reuseSourceId'not in x)))
print(' '.join(sorted(set(x['recipe']for x in entries if 'reuseSourceId'not in x))))
