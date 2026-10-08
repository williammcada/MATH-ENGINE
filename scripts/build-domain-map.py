import pathlib,json
root=pathlib.Path(__file__).resolve().parents[1];rows=json.loads((root/'curriculum/source-mappings/domain-equations-v0.1.json').read_text());assert len(rows)==len({r['sourceId'] for r in rows})==6
(root/'src/domain-bank-map.js').write_text('(function(root){const data='+json.dumps(rows,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathDomainBankMap=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
