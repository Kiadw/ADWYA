#!/usr/bin/env python
import sys, json
from rdkit import Chem
from rdkit.Chem import Descriptors, Crippen, Lipinski, rdMolDescriptors
from rdkit import RDLogger
from rdkit.Chem import FilterCatalog
RDLogger.DisableLog('rdApp.*')

# Alertes structurales par SMARTS (motifs réactifs / toxicophores classiques)
ALERTS = [
    ("Groupe nitro", "[NX3;$([N+](=O)[O-]),$(N(=O)=O)]", "Potentiel mutagène (réduction en nitroso)"),
    ("Aldéhyde", "[CX3H1](=O)[#6]", "Réactivité électrophile, liaison covalente aux protéines"),
    ("Époxyde", "[OX2r3]1[#6r3][#6r3]1", "Agent alkylant, génotoxicité potentielle"),
    ("Accepteur de Michael", "[CX3]=[CX3][CX3]=[OX1]", "Addition nucléophile, réactivité thiol"),
    ("Halogénure d'acyle", "[CX3](=[OX1])[F,Cl,Br,I]", "Très électrophile, hydrolyse rapide"),
    ("Chlorure de sulfonyle", "[SX4](=[OX1])(=[OX1])[Cl]", "Agent acylant réactif"),
    ("Azoture", "[$(N=[N+]=[N-]),$([N-][N+]#N)]", "Instabilité, risque explosif"),
    ("Peroxyde", "[OX2][OX2]", "Instabilité oxydante"),
    ("Thiol libre", "[SX2H]", "Oxydation, odeur, réactivité"),
]

def analyze(smiles):
    m = Chem.MolFromSmiles(smiles)
    if m is None:
        return {"error": "SMILES invalide"}
    mw = round(Descriptors.MolWt(m), 2)
    logp = round(Crippen.MolLogP(m), 2)
    tpsa = round(rdMolDescriptors.CalcTPSA(m), 1)
    hbd = Lipinski.NumHDonors(m)
    hba = Lipinski.NumHAcceptors(m)
    rot = Lipinski.NumRotatableBonds(m)
    rings = rdMolDescriptors.CalcNumRings(m)
    # Règle de Lipinski (violations)
    viol = []
    if mw > 500: viol.append("MW > 500")
    if logp > 5: viol.append("LogP > 5")
    if hbd > 5: viol.append("Donneurs H > 5")
    if hba > 10: viol.append("Accepteurs H > 10")
    lipinski_ok = len(viol) <= 1
    # Alertes structurales
    alerts = []
    for name, smarts, note in ALERTS:
        patt = Chem.MolFromSmarts(smarts)
        if patt is None: continue
        matches = m.GetSubstructMatches(patt)
        if matches:
            atoms = sorted({a for tup in matches for a in tup})
            alerts.append({"nom": name, "note": note, "atomes": atoms, "occurrences": len(matches)})
    catalog_hits = []
    try:
        params = FilterCatalog.FilterCatalogParams()
        params.AddCatalog(FilterCatalog.FilterCatalogParams.FilterCatalogs.PAINS)
        params.AddCatalog(FilterCatalog.FilterCatalogParams.FilterCatalogs.BRENK)
        cat = FilterCatalog.FilterCatalog(params)
        for e in cat.GetMatches(m):
            catalog_hits.append(e.GetDescription())
    except Exception:
        pass
    return {
        "smiles": smiles,
        "catalogues": catalog_hits,
        "formule": rdMolDescriptors.CalcMolFormula(m),
        "descripteurs": {"MW": mw, "LogP": logp, "TPSA": tpsa, "HBD": hbd, "HBA": hba,
                          "liaisons_rotatives": rot, "cycles": rings},
        "lipinski": {"conforme": lipinski_ok, "violations": viol},
        "alertes": alerts,
        "source": "RDKit (calcul local, reproductible)"
    }

print(json.dumps(analyze(sys.argv[1]), ensure_ascii=False))
