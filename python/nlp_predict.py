#!/usr/bin/env python
"""Inférence du classifieur thérapeutique par NLP (nom DCI + classe pharmacologique)."""
import sys, os, json
import joblib
from scipy.sparse import hstack

HERE = os.path.dirname(__file__)

def main():
    dci = sys.argv[1] if len(sys.argv) > 1 else ''
    classe = sys.argv[2] if len(sys.argv) > 2 else ''
    if not dci.strip():
        print(json.dumps({'error': 'Nom DCI requis'})); return

    bundle = joblib.load(os.path.join(HERE, 'nlp_model.pkl'))
    text = f"{dci} {classe}"
    Xc = bundle['vec_char'].transform([text])
    Xw = bundle['vec_word'].transform([text])
    X = hstack([Xc, Xw])
    clf = bundle['clf']
    proba = clf.predict_proba(X)[0]
    classes = clf.classes_
    order = proba.argsort()[::-1]
    top = [{'categorie': classes[i], 'proba': round(float(proba[i]), 3)} for i in order[:4]]

    result = json.load(open(os.path.join(HERE, 'nlp_result.json')))
    print(json.dumps({
        'categorie_predite': classes[order[0]],
        'confiance': round(float(proba[order[0]]), 3),
        'top': top,
        'accuracy_loo_modele': result['accuracy_loo'],
        'baseline_majoritaire': result['baseline_majoritaire'],
        'comparaison_structure_seule': result['comparaison_structure_seule_section_3_2_2'],
    }, ensure_ascii=False))

if __name__ == '__main__':
    main()
