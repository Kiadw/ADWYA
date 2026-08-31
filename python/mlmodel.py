#!/usr/bin/env python
# Modèle QSAR appris : forêt aléatoire sur descripteurs RDKit → catégorie thérapeutique.
# Validation croisée leave-one-out (robuste sur petit échantillon), matrice de confusion, importance des variables.
import sys, json, os
import numpy as np
from rdkit import Chem
from rdkit.Chem import Descriptors, Crippen, Lipinski, rdMolDescriptors
from rdkit import RDLogger
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import LeaveOneOut
RDLogger.DisableLog('rdApp.*')

CAT = json.load(open(os.path.join(os.path.dirname(__file__), 'meds.json')))
FEAT = ['MW','LogP','TPSA','HBD','HBA','RotB','Rings','AromRings','FracCsp3','HeavyAtoms']
def desc(m):
    return [Descriptors.MolWt(m), Crippen.MolLogP(m), rdMolDescriptors.CalcTPSA(m),
            Lipinski.NumHDonors(m), Lipinski.NumHAcceptors(m), Lipinski.NumRotatableBonds(m),
            rdMolDescriptors.CalcNumRings(m), rdMolDescriptors.CalcNumAromaticRings(m),
            rdMolDescriptors.CalcFractionCSP3(m), m.GetNumHeavyAtoms()]
X=[]; y=[]; seen=set()
for r in CAT:
    m=Chem.MolFromSmiles(r['smiles'])
    if m is None: continue
    can=Chem.MolToSmiles(m)
    if can in seen: continue
    seen.add(can)
    X.append(desc(m)); y.append(r['categorie'])
X=np.array(X); y=np.array(y)

# regrouper les catégories à 1 seul membre dans "Autres" pour un apprentissage sensé
from collections import Counter
cnt=Counter(y)
y=np.array([c if cnt[c]>=3 else 'Autres' for c in y])

loo=LeaveOneOut(); correct=0; preds=[]; trues=[]
for tr,te in loo.split(X):
    clf=RandomForestClassifier(n_estimators=300, random_state=0)
    clf.fit(X[tr], y[tr])
    p=clf.predict(X[te])[0]
    preds.append(p); trues.append(y[te][0]); correct+= (p==y[te][0])
acc=correct/len(y)
maj=max(Counter(y).values())/len(y)
# importance (modèle entraîné sur tout)
clf=RandomForestClassifier(n_estimators=300, random_state=0).fit(X,y)
imp=sorted(zip(FEAT, clf.feature_importances_.round(3).tolist()), key=lambda t:-t[1])
# matrice de confusion
classes=sorted(set(y))
idx={c:i for i,c in enumerate(classes)}
M=[[0]*len(classes) for _ in classes]
for t,p in zip(trues,preds): M[idx[t]][idx[p]]+=1
print(json.dumps({'accuracy':round(acc,3),'baseline':round(maj,3),'n':len(y),'n_classes':len(classes),
    'classes':classes,'confusion':M,'importances':imp}, ensure_ascii=False))
