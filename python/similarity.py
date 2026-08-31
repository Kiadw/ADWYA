#!/usr/bin/env python
import sys, json
from rdkit import Chem
from rdkit.Chem import AllChem, DataStructs
from rdkit import RDLogger
RDLogger.DisableLog('rdApp.*')

CATALOG = json.load(open(sys.argv[1]))   # meds.json
query = sys.argv[2]                        # SMILES
qm = Chem.MolFromSmiles(query)
if qm is None:
    print(json.dumps({"error":"SMILES invalide"})); sys.exit(0)
qfp = AllChem.GetMorganFingerprintAsBitVect(qm,2,2048)
res=[]
seen=set()
for r in CATALOG:
    m=Chem.MolFromSmiles(r['smiles'])
    if m is None: continue
    can=Chem.MolToSmiles(m)
    if can in seen: continue
    seen.add(can)
    fp=AllChem.GetMorganFingerprintAsBitVect(m,2,2048)
    res.append({"dci":r['dci'],"categorie":r['categorie'],"classe":r.get('classe'),
                "tanimoto":round(DataStructs.TanimotoSimilarity(qfp,fp),3)})
res.sort(key=lambda x:-x['tanimoto'])
print(json.dumps({"query":query,"top":res[:5]}, ensure_ascii=False))
