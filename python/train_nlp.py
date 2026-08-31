#!/usr/bin/env python
"""Classification thérapeutique par traitement du langage naturel (TF-IDF + modèle linéaire).

Complète le second bloc annoncé en Figure 2 (architecture cible, non implémenté au moment
de la rédaction initiale). Contrairement à l'étage structural (section 3.2.2, RDKit), qui
prédit la catégorie thérapeutique à partir du GRAPHE MOLÉCULAIRE et échoue (12,5 %, sous la
classe majoritaire), on prédit ici la catégorie à partir du TEXTE : le nom DCI (n-grammes de
caractères — généralise la logique des suffixes de la section 3.1.2/2.1, mais apprise plutôt
que codée à la main) et la classe pharmacologique en une courte expression (n-grammes de mots).

Évaluation : validation croisée « leave-one-out », comme pour l'étage structural (même
rigueur, même risque de sur-apprentissage assumé sur un aussi petit catalogue) — les 45
médicaments ADWYA, chacun testé sur un modèle qui ne l'a jamais vu.
"""
import json, numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion
from sklearn.model_selection import LeaveOneOut
from sklearn.metrics import accuracy_score, f1_score
from sklearn.base import BaseEstimator, TransformerMixin
import collections

HERE = "/Users/skander/Documents/Moi/Études/BS - 4BIM/Stage/ADWYA/ADWYA-Bio/python"
meds = json.load(open(f"{HERE}/meds.json"))

dci = [m['dci'] for m in meds]
classe = [m.get('classe', '') for m in meds]
y = [m['categorie'] for m in meds]
texts = [f"{d} {c}" for d, c in zip(dci, classe)]  # nom + classe pharmacologique, en un seul texte

n = len(meds)
counts = collections.Counter(y)
majority = counts.most_common(1)[0]
baseline_acc = majority[1] / n

# --- validation croisée leave-one-out, vectorisation refaite à chaque pli (pas de fuite) ---
loo = LeaveOneOut()
y_arr = np.array(y)
preds = np.empty(n, dtype=object)

for train_idx, test_idx in loo.split(texts):
    vec_char = TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 4), min_df=1)
    vec_word = TfidfVectorizer(analyzer='word', ngram_range=(1, 2), min_df=1)
    Xtr_char = vec_char.fit_transform([texts[i] for i in train_idx])
    Xte_char = vec_char.transform([texts[i] for i in test_idx])
    Xtr_word = vec_word.fit_transform([texts[i] for i in train_idx])
    Xte_word = vec_word.transform([texts[i] for i in test_idx])
    from scipy.sparse import hstack
    Xtr = hstack([Xtr_char, Xtr_word]); Xte = hstack([Xte_char, Xte_word])
    clf = LogisticRegression(max_iter=2000, C=2.0, class_weight='balanced')
    clf.fit(Xtr, y_arr[train_idx])
    preds[test_idx] = clf.predict(Xte)

acc = accuracy_score(y_arr, preds)
f1 = f1_score(y_arr, preds, average='macro')

result = {
    'n': n,
    'n_classes': len(counts),
    'accuracy_loo': round(float(acc), 3),
    'f1_macro_loo': round(float(f1), 3),
    'baseline_majoritaire': round(float(baseline_acc), 3),
    'classe_majoritaire': majority[0],
    'comparaison_structure_seule_section_3_2_2': 0.125,
}
print(json.dumps(result, ensure_ascii=False, indent=2))
with open(f"{HERE}/nlp_result.json", 'w') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

# ré-entraîne sur tout le catalogue pour l'inférence (API/produit)
vec_char = TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 4), min_df=1).fit(texts)
vec_word = TfidfVectorizer(analyzer='word', ngram_range=(1, 2), min_df=1).fit(texts)
from scipy.sparse import hstack
Xfull = hstack([vec_char.transform(texts), vec_word.transform(texts)])
clf_final = LogisticRegression(max_iter=2000, C=2.0, class_weight='balanced').fit(Xfull, y_arr)
import joblib
joblib.dump({'vec_char': vec_char, 'vec_word': vec_word, 'clf': clf_final}, f"{HERE}/nlp_model.pkl")

# détail par médicament (pour audit / annexe)
detail = [{'dci': dci[i], 'reel': y[i], 'predit': preds[i], 'correct': bool(preds[i] == y[i])} for i in range(n)]
with open(f"{HERE}/nlp_detail.json", 'w') as f:
    json.dump(detail, f, ensure_ascii=False, indent=2)
print(f"\nerreurs ({sum(1 for d in detail if not d['correct'])}/{n}):")
for d in detail:
    if not d['correct']:
        print(f"  {d['dci']:25s} réel={d['reel']:20s} prédit={d['predit']}")
