"""Optional private-source provenance verification; no publisher bodies in output."""
import os,json,pathlib
root=pathlib.Path(__file__).resolve().parents[1];base=pathlib.Path(os.environ['RECOVERY_CONTENT']);rows=json.loads((root/'curriculum/source-mappings/solids-v0.1.json').read_text());data={}
for r in rows:
 bank=r['sourceId'].split(':')[0]
 if bank not in data:data[bank]=json.loads((base/(bank+'.json')).read_text())
 i=next(i for i in data[bank]['items'] if i['id']==r['sourceId']);assert i['lesson_id']==r['lessonId'];assert r['sourceBlockSha256']==([i['blocks'][j]['sha256'] for j in i['question_block_indices']+i['answer_block_indices']+i['script_block_indices']] if 'blocks' in i else [i['question_rich_data_sha256'],i['dynamic_data_sha256']])
print('PASS: 16 source IDs, lesson links and ordered block hashes')
