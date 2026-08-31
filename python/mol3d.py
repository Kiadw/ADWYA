#!/usr/bin/env python
import sys, json
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit import RDLogger
RDLogger.DisableLog('rdApp.*')
smiles = sys.argv[1]
m = Chem.MolFromSmiles(smiles)
if m is None:
    print(json.dumps({"error":"SMILES invalide"})); sys.exit(0)
m = Chem.AddHs(m)
ok = AllChem.EmbedMolecule(m, randomSeed=42)
if ok != 0:
    print(json.dumps({"error":"Échec de la génération 3D"})); sys.exit(0)
try: AllChem.MMFFOptimizeMolecule(m)
except Exception: pass
molblock = Chem.MolToMolBlock(m)
print(json.dumps({"molblock": molblock, "formula": Chem.rdMolDescriptors.CalcMolFormula(Chem.RemoveHs(m)),
                  "atoms": m.GetNumAtoms()}, ensure_ascii=False))
