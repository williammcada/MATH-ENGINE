"""Rebuild the original quadratic adapter metadata without source question bodies."""
import pathlib,json
root=pathlib.Path(__file__).resolve().parents[1];rows=json.loads((root/'curriculum/source-mappings/quadratic-equations-v0.1.json').read_text());assert len({r['sourceId'] for r in rows})==len(rows)==16
(root/'src/quadratic-bank-map.js').write_text('(function(root){const data='+json.dumps(rows,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathQuadraticBankMap=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
