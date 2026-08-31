#!/usr/bin/env python
"""Calibration STATISTIQUE de la confiance de l'étage 2 (appariement flou) du
moteur de classification (classifier.ts).

Jusqu'ici, la confiance de ce stade était une formule choisie à la main :
    confiance = max(0.5, 0.9 - 0.15 * distance_de_levenshtein)

Ici, on la remplace par une confiance APPRISE : on simule des fautes de frappe
réalistes sur les 40 noms canoniques des règles du classifieur, on mesure
empiriquement, pour chaque distance de Levenshtein observée, la fréquence
réelle à laquelle le plus proche voisin trouvé est le bon (bonne catégorie),
puis on ajuste une régression logistique confiance = P(correct | distance)
sur ces données. C'est un apprentissage statistique au sens propre : les
paramètres du modèle de confiance sont estimés à partir de données, pas fixés
par intuition.
"""
import random, json
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss

random.seed(0)

# --- les 40 noms canoniques + catégorie, extraits des règles réelles de classifier.ts ---
ENTRIES = [
    ("paracetamol", "Analgesique"), ("ibuprofene", "AINS"), ("aspirine", "AINS"),
    ("diclofenac", "AINS"), ("tramadol", "Opioide"), ("morphine", "Opioide"),
    ("codeine", "Opioide"), ("amoxicilline", "Antibiotique"), ("azithromycine", "Antibiotique"),
    ("ciprofloxacine", "Antibiotique"), ("metronidazole", "Antibiotique"), ("doxycycline", "Antibiotique"),
    ("amlodipine", "Cardiovasculaire"), ("atorvastatine", "Cardiovasculaire"), ("losartan", "Cardiovasculaire"),
    ("metformine", "Antidiabetique"), ("omeprazole", "Gastro"), ("loperamide", "Gastro"),
    ("sertraline", "Neuropsychiatrie"), ("diazepam", "Neuropsychiatrie"), ("cetirizine", "Antihistaminique"),
    ("loratadine", "Antihistaminique"), ("vitaminec", "Vitamine"), ("vitamined", "Vitamine"),
    ("vitaminebdouze", "Vitamine"), ("lactose", "Excipient"), ("cellulosemicrocristalline", "Excipient"),
    ("stearatedemagnesium", "Excipient"), ("amidon", "Excipient"), ("povidone", "Excipient"),
    ("talc", "Excipient"), ("dioxydedetitane", "Excipient"), ("gelatine", "Excipient"),
    ("hypromellose", "Excipient"), ("eaupurifiee", "Solvant"), ("ethanol", "Solvant"),
    ("glycerine", "Excipient"), ("propyleneglycol", "Solvant"), ("prednisolone", "Corticosteroide"),
    ("betamethasone", "Corticosteroide"),
]


def levenshtein(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = dp[i - 1][j - 1] if a[i - 1] == b[j - 1] else 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]


ALPHABET = "abcdefghijklmnopqrstuvwxyz"


def make_typo(word, n_edits):
    w = list(word)
    for _ in range(n_edits):
        op = random.choice(["sub", "del", "ins", "swap"])
        if not w:
            op = "ins"
        if op == "sub" and w:
            i = random.randrange(len(w))
            w[i] = random.choice(ALPHABET)
        elif op == "del" and len(w) > 1:
            i = random.randrange(len(w))
            del w[i]
        elif op == "ins":
            i = random.randrange(len(w) + 1)
            w.insert(i, random.choice(ALPHABET))
        elif op == "swap" and len(w) > 1:
            i = random.randrange(len(w) - 1)
            w[i], w[i + 1] = w[i + 1], w[i]
    return "".join(w)


def nearest(query, canon_list):
    best = None
    best_d = 10 ** 9
    for name, cat in canon_list:
        d = levenshtein(query, name)
        if d < best_d:
            best_d = d
            best = (name, cat)
    return best, best_d


def main():
    rows = []  # (distance, correct)
    N_VARIANTS_PER_LEVEL = 25
    for true_name, true_cat in ENTRIES:
        for target_edits in (1, 2, 3, 4):
            for _ in range(N_VARIANTS_PER_LEVEL):
                variant = make_typo(true_name, target_edits)
                if variant == true_name:
                    continue
                (match_name, match_cat), measured_d = nearest(variant, ENTRIES)
                if measured_d > 3:
                    continue  # hors du seuil de tolérance du classifieur (inchangé)
                correct = (match_cat == true_cat)
                rows.append((measured_d, int(correct)))

    X = np.array([[d] for d, c in rows], dtype=float)
    y = np.array([c for d, c in rows])
    n = len(y)

    # accuracy empirique par distance (table de preuve, indépendante du modèle)
    empirical = {}
    for d in (1, 2, 3):
        mask = X[:, 0] == d
        if mask.sum() > 0:
            empirical[d] = {"n": int(mask.sum()), "accuracy": round(float(y[mask].mean()), 3)}

    # régression logistique : confiance apprise = P(correct | distance)
    clf = LogisticRegression()
    clf.fit(X, y)
    proba = clf.predict_proba(X)[:, 1]
    ll = log_loss(y, proba)

    # comparaison avec l'ancienne formule à la main
    old_formula_conf = np.clip(0.9 - 0.15 * X[:, 0], 0.5, None)
    ll_old = log_loss(y, np.clip(old_formula_conf, 1e-6, 1 - 1e-6))

    learned_curve = {d: round(float(clf.predict_proba([[d]])[0, 1]), 3) for d in (1, 2, 3)}

    result = {
        "n_total": n,
        "empirical_accuracy_par_distance": empirical,
        "confiance_apprise_par_distance": learned_curve,
        "coef_logistique": {"a": round(float(clf.intercept_[0]), 3), "b": round(float(clf.coef_[0][0]), 3)},
        "log_loss_modele_appris": round(float(ll), 4),
        "log_loss_ancienne_formule_manuelle": round(float(ll_old), 4),
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    with open("/Users/skander/Documents/Moi/Études/BS - 4BIM/Stage/ADWYA/ADWYA-Bio/python/fuzzy_calibration_result.json", "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
