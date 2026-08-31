#!/usr/bin/env python
"""Inférence du GNN de solubilité pour une molécule donnée (SMILES)."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, torch
from rdkit import Chem, RDLogger
RDLogger.DisableLog('rdApp.*')
from train_gnn import MolGCN, mol_to_graph, FEAT_DIM

HERE = os.path.dirname(__file__)

def main():
    smiles = sys.argv[1] if len(sys.argv) > 1 else ''
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        print(json.dumps({'error': 'SMILES invalide'})); return
    if mol.GetNumAtoms() > 60:
        print(json.dumps({'error': 'Molécule trop grande pour ce modèle (>60 atomes lourds)'})); return

    model = MolGCN(FEAT_DIM)
    model.load_state_dict(torch.load(os.path.join(HERE, 'gnn_model.pt'), map_location='cpu'))
    model.eval()

    X, A, mask = mol_to_graph(mol)
    Xt = torch.tensor(X).unsqueeze(0)
    At = torch.tensor(A).unsqueeze(0)
    Mt = torch.tensor(mask).unsqueeze(0)

    with torch.no_grad():
        # le modèle a été entraîné sur la cible standardisée -> on charge mean/std sauvegardés
        result = json.load(open(os.path.join(HERE, 'gnn_result.json')))
        pred_std = model(Xt, At, Mt).item()

    # mean/std ne sont pas sérialisés dans gnn_result.json : on les recharge depuis esol pour cohérence
    import csv
    rows = list(csv.DictReader(open(os.path.join(HERE, 'esol.csv'))))
    ys = np.array([float(r['measured log solubility in mols per litre']) for r in rows])
    y_mean, y_std = ys.mean(), ys.std()
    logS = pred_std * y_std + y_mean

    from rdkit.Chem import rdMolDescriptors
    formule = rdMolDescriptors.CalcMolFormula(mol)
    print(json.dumps({
        'logS': round(float(logS), 2),
        'formule': formule,
        'n_atomes': mol.GetNumAtoms(),
        'r2_test': result['r2'],
        'rmse_test': result['rmse'],
        'r2_randomforest_meme_split': result['r2_randomforest_meme_split'],
    }, ensure_ascii=False))

if __name__ == '__main__':
    main()
