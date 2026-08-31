#!/usr/bin/env python
# Cartographie de l'espace chimique du portefeuille ADWYA :
# ACP (PCA) des empreintes Morgan ECFP4 + clustering K-means (apprentissage non supervisé)
# → familles structurales, et indicateurs de diversité moléculaire (Tanimoto).
import sys, json, os
import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem, DataStructs
from rdkit import RDLogger
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
RDLogger.DisableLog('rdApp.*')

CAT = json.load(open(os.path.join(os.path.dirname(__file__), 'meds.json')))
fps=[]; meta=[]; X=[]; seen=set()
for r in CAT:
    m=Chem.MolFromSmiles(r['smiles'])
    if m is None: continue
    can=Chem.MolToSmiles(m)
    if can in seen: continue
    seen.add(can)
    fp=AllChem.GetMorganFingerprintAsBitVect(m,2,2048)
    fps.append(fp)
    arr=np.zeros((2048,),dtype=int); DataStructs.ConvertToNumpyArray(fp,arr)
    X.append(arr); meta.append({'dci':r['dci'],'categorie':r['categorie']})
X=np.array(X)
coords=PCA(n_components=2, random_state=0).fit(X)
xy=coords.transform(X); ev=(coords.explained_variance_ratio_*100).round(1).tolist()
k=5
km=KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
pts=[{**meta[i],'x':round(float(xy[i,0]),3),'y':round(float(xy[i,1]),3),'cluster':int(km.labels_[i])} for i in range(len(meta))]

# diversité : similarité de Tanimoto moyenne (plus c'est bas, plus le portefeuille est diversifié)
sims=[]
for i in range(len(fps)):
    for j in range(i+1,len(fps)):
        sims.append(DataStructs.TanimotoSimilarity(fps[i],fps[j]))
sims=np.array(sims)
# paires les plus proches
pair_idx=np.argsort(sims)[::-1][:3] if len(sims) else []
# reconstruire indices
pairs=[]
c=0; top=set(pair_idx.tolist()) if len(sims) else set()
for i in range(len(fps)):
    for j in range(i+1,len(fps)):
        if c in top: pairs.append({'a':meta[i]['dci'],'b':meta[j]['dci'],'t':round(float(sims[c]),2)})
        c+=1
print(json.dumps({'points':pts,'explained':ev,'n':len(pts),'k':k,
    'diversite':{'tanimoto_moyen':round(float(sims.mean()),3),'tanimoto_median':round(float(np.median(sims)),3)},
    'paires_proches':sorted(pairs,key=lambda p:-p['t'])}, ensure_ascii=False))
