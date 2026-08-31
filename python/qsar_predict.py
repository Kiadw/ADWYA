#!/usr/bin/env python
# Inférence QSAR : prédit logS pour un SMILES + domaine d'applicabilité (Tanimoto aux voisins d'entraînement).
import sys, os, json, numpy as np, joblib
from rdkit import Chem
from rdkit.Chem import Descriptors, Crippen, rdMolDescriptors, AllChem, DataStructs
from rdkit import RDLogger
RDLogger.DisableLog('rdApp.*')
HERE=os.path.dirname(__file__)
m=Chem.MolFromSmiles(sys.argv[1])
if m is None: print(json.dumps({"error":"SMILES invalide"})); sys.exit(0)
def feats(m):
    d=[Descriptors.MolWt(m),Crippen.MolLogP(m),rdMolDescriptors.CalcTPSA(m),
       rdMolDescriptors.CalcNumHBD(m),rdMolDescriptors.CalcNumHBA(m),
       rdMolDescriptors.CalcNumRotatableBonds(m),rdMolDescriptors.CalcNumAromaticRings(m),
       rdMolDescriptors.CalcFractionCSP3(m),m.GetNumHeavyAtoms()]
    fp=AllChem.GetMorganFingerprintAsBitVect(m,2,1024)
    a=np.zeros((1024,),dtype=int); DataStructs.ConvertToNumpyArray(fp,a)
    return np.concatenate([d,a]), fp
x, fp = feats(m)
model=joblib.load(os.path.join(HERE,'qsar_model.pkl'))
logS=float(model.predict([x])[0])
# incertitude = écart-type des arbres
per_tree=np.array([t.predict([x])[0] for t in model.estimators_])
std=float(per_tree.std())
# domaine d'applicabilité : Tanimoto au plus proche voisin du train
trainfp=np.load(os.path.join(HERE,'qsar_train_fp.npy'))
qbits=np.zeros((1024,),dtype=np.uint8); DataStructs.ConvertToNumpyArray(fp,qbits)
inter=(trainfp & qbits).sum(1); union=(trainfp | qbits).sum(1)
tani=np.where(union>0, inter/union, 0.0)
nn=float(tani.max())
# solubilité en mg/L (approx) : 10^logS * MW * 1000
import math
mgL=round((10**logS)*Descriptors.MolWt(m)*1000, 1)
classe = "Très soluble" if logS>-1 else "Soluble" if logS>-2 else "Peu soluble" if logS>-4 else "Très peu soluble"
print(json.dumps({"logS":round(logS,2),"incertitude":round(std,2),"mg_par_L":mgL,
    "classe":classe,"domaine_applicabilite":round(nn,2),
    "fiable": nn>=0.3, "formule":rdMolDescriptors.CalcMolFormula(m)}, ensure_ascii=False))
