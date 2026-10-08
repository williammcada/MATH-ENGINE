"""Reproduce the portable authored equation map from its metadata ledger."""
import pathlib,json
root=pathlib.Path(__file__).resolve().parents[1];rows=json.loads((root/'curriculum/source-mappings/linear-equations-v0.2.json').read_text())
assert len({r['sourceId'] for r in rows})==len(rows)==41
(root/'src/linear-bank-map.js').write_text('(function(root){const data='+json.dumps(rows,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathLinearBankMap=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
