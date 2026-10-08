"""Private-source link and evidence verification; never prints source bodies."""
import os,json,pathlib
root=pathlib.Path(__file__).resolve().parents[1];base=pathlib.Path(os.environ['RECOVERY_CONTENT']);rows=json.loads((root/'curriculum/source-mappings/breadth-v0.1.json').read_text());data={}
for r in rows:
 bank=r['sourceId'].split(':')[0]
 if bank not in data:data[bank]=json.loads((base/(bank+'.json')).read_text())
 i=next(i for i in data[bank]['items'] if i['id']==r['sourceId']);assert i['lesson_id']==r['lessonId']
 if 'blocks' in i:assert r['sourceBlockSha256']==[i['blocks'][j]['sha256'] for j in i['question_block_indices']+i['answer_block_indices']+i['script_block_indices']]
 else:assert r['sourceQuestionSha256']==i['question_rich_data_sha256'] and r['sourceDynamicSha256']==i['dynamic_data_sha256']
print('PASS:',len(rows),'source IDs, lessons and evidence hashes across',len(data),'banks')
