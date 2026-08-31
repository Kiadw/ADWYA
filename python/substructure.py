#!/usr/bin/env python
import sys, json, os
from rdkit import Chem
from rdkit import RDLogger
RDLogger.DisableLog('rdApp.*')
CATALOG = json.load(open(os.path.join(os.path.dirname(__file__), 'meds.json')))
smarts = sys.argv[1]
patt = Chem.MolFromSmarts(smarts)
if patt is None:
    print(json.dumps({"error": "SMARTS invalide"})); sys.exit(0)
hits=[]; seen=set()
for r in CATALOG:
    m = Chem.MolFromSmiles(r['smiles'])
    if m is None: continue
    can = Chem.MolToSmiles(m)
    if can in seen: continue
    seen.add(can)
    matches = m.GetSubstructMatches(patt)
    if matches:
        hits.append({"dci": r['dci'], "categorie": r['categorie'],
                     "occurrences": len(matches), "atomes": sorted({a for t in matches for a in t})})
hits.sort(key=lambda x:-x['occurrences'])
print(json.dumps({"smarts": smarts, "n": len(hits), "hits": hits}, ensure_ascii=False))
