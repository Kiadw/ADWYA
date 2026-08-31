#!/usr/bin/env python
"""Réseau de neurones sur graphes (GCN) pour la prédiction de solubilité aqueuse (logS).

Complète le backend d'apprentissage annoncé en Figure 2 (architecture cible) : cette fois,
la molécule est représentée comme un vrai graphe (atomes = nœuds, liaisons = arêtes),
pas comme un vecteur de descripteurs. Message passing appris de bout en bout par
descente de gradient (PyTorch), pas de bibliothèque de GNN externe (torch_geometric) —
implémentation directe sur matrices d'adjacence denses, dans le même esprit que la
distance de Levenshtein codée à la main pour le classifieur (section 3.1.2).

Même protocole que le QSAR RandomForest (train_qsar.py) pour une comparaison honnête :
- même jeu ESOL (1128 molécules)
- même découpage par squelette de Murcko (mêmes molécules de test, littéralement)
- même métriques (R², RMSE)
"""
import os, json, csv, numpy as np, torch, torch.nn as nn
from rdkit import Chem, RDLogger
from rdkit.Chem.Scaffolds import MurckoScaffold
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
RDLogger.DisableLog('rdApp.*')

HERE = os.path.dirname(__file__)
FIG_DIR = "/Users/skander/Documents/Moi/Études/BS - 4BIM/Stage/Rapport/figures"
torch.manual_seed(0)

MAX_ATOMS = 60
ATOMS = ['C', 'N', 'O', 'F', 'P', 'S', 'Cl', 'Br', 'I', 'B', 'Si']  # + "autre"

def one_hot(i, n):
    v = [0.0] * n
    if 0 <= i < n:
        v[i] = 1.0
    return v

def atom_features(atom):
    sym = atom.GetSymbol()
    idx = ATOMS.index(sym) if sym in ATOMS else len(ATOMS)
    f = one_hot(idx, len(ATOMS) + 1)                       # 12
    f += one_hot(min(atom.GetDegree(), 5), 6)               # 6
    f += one_hot(atom.GetFormalCharge() + 2, 5)              # 5  (-2..+2)
    f += [1.0 if atom.GetIsAromatic() else 0.0]              # 1
    f += [1.0 if atom.IsInRing() else 0.0]                   # 1
    f += one_hot(min(atom.GetTotalNumHs(), 4), 5)             # 5
    hyb = str(atom.GetHybridization())
    f += one_hot({'SP': 0, 'SP2': 1, 'SP3': 2}.get(hyb, 3), 4)  # 4
    return f  # 34 dims

FEAT_DIM = len(ATOMS) + 1 + 6 + 5 + 1 + 1 + 5 + 4  # = 34

def mol_to_graph(mol):
    n = mol.GetNumAtoms()
    X = np.zeros((MAX_ATOMS, FEAT_DIM), dtype=np.float32)
    A = np.zeros((MAX_ATOMS, MAX_ATOMS), dtype=np.float32)
    mask = np.zeros((MAX_ATOMS,), dtype=np.float32)
    for i, atom in enumerate(mol.GetAtoms()):
        if i >= MAX_ATOMS:
            break
        X[i] = atom_features(atom)
        mask[i] = 1.0
    for b in mol.GetBonds():
        i, j = b.GetBeginAtomIdx(), b.GetEndAtomIdx()
        if i < MAX_ATOMS and j < MAX_ATOMS:
            A[i, j] = 1.0
            A[j, i] = 1.0
    n_eff = min(n, MAX_ATOMS)
    A[:n_eff, :n_eff] += np.eye(n_eff, dtype=np.float32)  # self-loops
    deg = A.sum(axis=1)
    d_inv_sqrt = np.zeros_like(deg)
    nz = deg > 0
    d_inv_sqrt[nz] = deg[nz] ** -0.5
    A_norm = (A * d_inv_sqrt[:, None]) * d_inv_sqrt[None, :]  # D^-1/2 (A+I) D^-1/2
    return X, A_norm, mask


class GCNLayer(nn.Module):
    def __init__(self, d_in, d_out):
        super().__init__()
        self.lin = nn.Linear(d_in, d_out)

    def forward(self, X, A):
        return torch.relu(self.lin(torch.bmm(A, X)))


class MolGCN(nn.Module):
    def __init__(self, feat_dim, hidden=64, n_layers=3):
        super().__init__()
        self.proj = nn.Linear(feat_dim, hidden)
        self.layers = nn.ModuleList([GCNLayer(hidden, hidden) for _ in range(n_layers)])
        self.head = nn.Sequential(nn.Linear(hidden, 32), nn.ReLU(), nn.Dropout(0.1), nn.Linear(32, 1))

    def forward(self, X, A, mask):
        H = torch.relu(self.proj(X))
        for layer in self.layers:
            H = layer(H, A) + H  # résiduel
        m = mask.unsqueeze(-1)
        pooled = (H * m).sum(1) / m.sum(1).clamp(min=1.0)  # moyenne masquée (readout)
        return self.head(pooled).squeeze(-1)


def main():
    rows = list(csv.DictReader(open(os.path.join(HERE, 'esol.csv'))))
    Xs, As, Ms, ys, scaf = [], [], [], [], []
    for r in rows:
        mol = Chem.MolFromSmiles(r['smiles'])
        if mol is None or mol.GetNumAtoms() > MAX_ATOMS:
            continue
        X, A, mask = mol_to_graph(mol)
        try:
            s = MurckoScaffold.MurckoScaffoldSmiles(mol=mol)
        except Exception:
            s = ''
        Xs.append(X); As.append(A); Ms.append(mask)
        ys.append(float(r['measured log solubility in mols per litre'])); scaf.append(s)

    X = np.stack(Xs); A = np.stack(As); M = np.stack(Ms); y = np.array(ys, dtype=np.float32)
    scaf = np.array(scaf)

    # -- exactement le même split que train_qsar.py : mêmes molécules de test --
    uniq = list(dict.fromkeys(scaf))
    n_test = int(0.2 * len(uniq)); test_scaf = set(uniq[-n_test:])
    te = np.array([s in test_scaf for s in scaf]); tr = ~te

    # normalisation de la cible (stabilise l'entraînement, dénormalisée à l'évaluation)
    y_mean, y_std = y[tr].mean(), y[tr].std()

    Xtr = torch.tensor(X[tr]); Atr = torch.tensor(A[tr]); Mtr = torch.tensor(M[tr])
    ytr = torch.tensor((y[tr] - y_mean) / y_std)
    Xte = torch.tensor(X[te]); Ate = torch.tensor(A[te]); Mte = torch.tensor(M[te])
    yte = y[te]

    model = MolGCN(FEAT_DIM)
    opt = torch.optim.Adam(model.parameters(), lr=2e-3, weight_decay=1e-5)
    loss_fn = nn.MSELoss()

    n_epochs = 300
    for epoch in range(n_epochs):
        model.train()
        opt.zero_grad()
        pred = model(Xtr, Atr, Mtr)
        loss = loss_fn(pred, ytr)
        loss.backward()
        opt.step()
        if (epoch + 1) % 50 == 0:
            print(f'  epoch {epoch+1}/{n_epochs}  loss(train, standardisé)={loss.item():.4f}')

    model.eval()
    with torch.no_grad():
        pred_std = model(Xte, Ate, Mte).numpy()
    pred = pred_std * y_std + y_mean

    from sklearn.metrics import r2_score, mean_squared_error
    r2 = r2_score(yte, pred)
    rmse = float(np.sqrt(mean_squared_error(yte, pred)))

    plt.figure(figsize=(5.2, 5))
    plt.scatter(yte, pred, s=14, alpha=.55, color='#006BA6', edgecolor='none')
    lim = [min(yte.min(), pred.min()) - 0.5, max(yte.max(), pred.max()) + 0.5]
    plt.plot(lim, lim, '--', color='#62BD19', lw=1.5)
    plt.xlabel("logS mesuré (mol/L)"); plt.ylabel("logS prédit (mol/L)")
    plt.title(f"GNN solubilité — R²={r2:.2f}, RMSE={rmse:.2f}", color='#1A2B33')
    plt.text(0.05, 0.92, f"n_train={tr.sum()}  n_test={te.sum()}\nmême split par squelette que le RandomForest",
              transform=plt.gca().transAxes, fontsize=9, color='#5A6B73', va='top')
    plt.grid(alpha=.2); plt.tight_layout()
    plt.savefig(os.path.join(FIG_DIR, "gnn_parite.png"), dpi=170, facecolor='white')

    torch.save(model.state_dict(), os.path.join(HERE, 'gnn_model.pt'))
    result = {'n': len(y), 'n_train': int(tr.sum()), 'n_test': int(te.sum()),
              'r2': round(float(r2), 3), 'rmse': round(rmse, 3),
              'r2_randomforest_meme_split': 0.69}
    print(json.dumps(result, ensure_ascii=False))
    with open(os.path.join(HERE, 'gnn_result.json'), 'w') as f:
        json.dump(result, f)


if __name__ == '__main__':
    main()
