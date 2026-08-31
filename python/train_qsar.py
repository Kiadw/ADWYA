#!/usr/bin/env python
# QSAR appris de solubilité aqueuse (logS) — RandomForest sur descripteurs RDKit + Morgan ECFP4.
# Split par squelette de Murcko (évaluation honnête, pas aléatoire). Sauvegarde modèle + graphe de parité.
import os, json, numpy as np, joblib
from rdkit import Chem
from rdkit.Chem import Descriptors, Crippen, rdMolDescriptors, AllChem, DataStructs
from rdkit.Chem.Scaffolds import MurckoScaffold
from rdkit import RDLogger
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
RDLogger.DisableLog('rdApp.*')
HERE=os.path.dirname(__file__)
import csv
rows=list(csv.DictReader(open(os.path.join(HERE,'esol.csv'))))

def feats(m):
    d=[Descriptors.MolWt(m),Crippen.MolLogP(m),rdMolDescriptors.CalcTPSA(m),
       rdMolDescriptors.CalcNumHBD(m),rdMolDescriptors.CalcNumHBA(m),
       rdMolDescriptors.CalcNumRotatableBonds(m),rdMolDescriptors.CalcNumAromaticRings(m),
       rdMolDescriptors.CalcFractionCSP3(m),m.GetNumHeavyAtoms()]
    fp=AllChem.GetMorganFingerprintAsBitVect(m,2,1024)
    a=np.zeros((1024,),dtype=int); DataStructs.ConvertToNumpyArray(fp,a)
    return np.concatenate([d,a])

X=[];y=[];scaf=[]
for r in rows:
    smi=r['smiles']; m=Chem.MolFromSmiles(smi)
    if m is None: continue
    try: s=MurckoScaffold.MurckoScaffoldSmiles(mol=m)
    except Exception: s=''
    X.append(feats(m)); y.append(float(r['measured log solubility in mols per litre'])); scaf.append(s)
X=np.array(X); y=np.array(y); scaf=np.array(scaf)

# split par scaffold : les squelettes du test ne sont pas dans le train
uniq=list(dict.fromkeys(scaf))
n_test=int(0.2*len(uniq)); test_scaf=set(uniq[-n_test:])
te=np.array([s in test_scaf for s in scaf]); tr=~te
model=RandomForestRegressor(n_estimators=400, random_state=0, n_jobs=-1)
model.fit(X[tr],y[tr])
pred=model.predict(X[te])
r2=r2_score(y[te],pred); rmse=float(np.sqrt(mean_squared_error(y[te],pred)))

# graphe de parité
plt.figure(figsize=(5.2,5))
plt.scatter(y[te],pred,s=14,alpha=.55,color='#006BA6',edgecolor='none')
lim=[min(y.min(),pred.min())-0.5,max(y.max(),pred.max())+0.5]
plt.plot(lim,lim,'--',color='#62BD19',lw=1.5)
plt.xlabel("logS mesuré (mol/L)"); plt.ylabel("logS prédit (mol/L)")
plt.title(f"QSAR solubilité — R²={r2:.2f}, RMSE={rmse:.2f}", color='#1A2B33')
plt.text(0.05,0.92,f"n_train={tr.sum()}  n_test={te.sum()}\nsplit par squelette de Murcko",
         transform=plt.gca().transAxes, fontsize=9, color='#5A6B73', va='top')
plt.grid(alpha=.2); plt.tight_layout()
plt.savefig("/Users/skander/Documents/Moi/Études/BS - 4BIM/Stage/Rapport/figures/qsar_parite.png", dpi=170, facecolor='white')

# ré-entraîner sur tout et sauver pour l'inférence
final=RandomForestRegressor(n_estimators=400, random_state=0, n_jobs=-1).fit(X,y)
joblib.dump(final, os.path.join(HERE,'qsar_model.pkl'))
# stocker aussi quelques empreintes du train pour le domaine d'applicabilité
np.save(os.path.join(HERE,'qsar_train_fp.npy'), X[:, 9:].astype(np.uint8))
print(json.dumps({'n':len(y),'n_train':int(tr.sum()),'n_test':int(te.sum()),
    'r2':round(float(r2),3),'rmse':round(rmse,3)}, ensure_ascii=False))
