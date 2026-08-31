'use client';
import { useState } from 'react';

type Top = { categorie: string; proba: number };
type Res = {
  categorie_predite: string; confiance: number; top: Top[];
  accuracy_loo_modele: number; baseline_majoritaire: number; comparaison_structure_seule: number; error?: string;
};
const PRESETS = [
  { dci: 'Amoxicilline', classe: 'Pénicilline à large spectre' },
  { dci: 'Sertraline', classe: 'Inhibiteur sélectif recapture sérotonine' },
  { dci: 'Montelukast', classe: 'Antagoniste des récepteurs aux leucotriènes' },
  { dci: 'Finasteride', classe: 'Inhibiteur de la 5-alpha réductase' },
];

export default function ClassificationTextePage() {
  const [dci, setDci] = useState('');
  const [classe, setClasse] = useState('');
  const [res, setRes] = useState<Res | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (d: string, c: string) => {
    setLoading(true); setRes(null); setDci(d); setClasse(c);
    try {
      const r = await fetch('/api/nlp-classify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dci: d, classe: c }) });
      setRes(await r.json());
    } catch { setRes({ error: 'Erreur réseau' } as Res); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1040 }}>
      <h1 style={{ fontSize: 26, color: '#1A2B33', margin: 0 }}>Classification thérapeutique par le texte (NLP)</h1>
      <p style={{ color: '#5A6B73', marginTop: 6, maxWidth: 820 }}>
        La page « Analyse moléculaire » (section 3.2.2) a montré qu'à partir de la <strong>structure seule</strong>,
        la catégorie thérapeutique est mal prédite (12,5 %, sous la classe majoritaire). Ici, un modèle de
        <strong> traitement du langage naturel</strong> (n-grammes de caractères et de mots, régression logistique)
        apprend à partir du <strong>nom DCI et de la classe pharmacologique en texte libre</strong> — sans jamais voir la molécule.
      </p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', margin: '1rem 0 1.4rem' }}>
        {[['Texte (NLP)', '82,2 %'], ['Structure seule (§3.2.2)', '12,5 %'], ['Classe majoritaire', '24,4 %'], ['Validation', 'leave-one-out, 45 méd.']].map(([k, v], i) => (
          <div key={i} style={{ flex: 1, padding: '12px 14px', borderRadius: 10, background: i === 0 ? '#EFF8E6' : '#E8F2F8', textAlign: 'center' }}>
            <div style={{ fontSize: i < 3 ? 20 : 13, fontWeight: 800, color: i === 0 ? '#3d7a12' : '#006BA6' }}>{v}</div>
            <div style={{ fontSize: 12, color: '#5A6B73' }}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {PRESETS.map(p => (
          <button key={p.dci} onClick={() => run(p.dci, p.classe)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #62BD19', background: '#EFF8E6', color: '#1A2B33', cursor: 'pointer', fontWeight: 600 }}>{p.dci}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input value={dci} onChange={e => setDci(e.target.value)} placeholder="Nom DCI (ex: Losartan)"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #E3E8EB' }} />
        <input value={classe} onChange={e => setClasse(e.target.value)} placeholder="Classe pharmacologique (ex: Antagoniste AT1)"
          style={{ flex: 1.4, padding: '10px 12px', borderRadius: 8, border: '1px solid #E3E8EB' }} />
        <button onClick={() => dci && run(dci, classe)} disabled={loading}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg,#006BA6,#62BD19)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Analyse…' : 'Classifier'}
        </button>
      </div>

      {res?.error && <p style={{ color: '#c0392b' }}>{res.error}</p>}
      {res && !res.error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ padding: '1.2rem 1.4rem', borderRadius: 12, border: '1px solid #E3E8EB' }}>
            <div style={{ fontSize: 13, color: '#5A6B73' }}>Catégorie prédite</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#006BA6', lineHeight: 1.1, marginTop: 4 }}>{res.categorie_predite}</div>
            <div style={{ fontSize: 14, color: '#1A2B33', marginTop: 6 }}>confiance {Math.round(res.confiance * 100)} %</div>
            <div style={{ marginTop: 12 }}>
              {res.top.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ fontSize: 12.5, width: 130, color: '#5A6B73' }}>{t.categorie}</div>
                  <div style={{ flex: 1, height: 8, background: '#EEF2F4', borderRadius: 4 }}>
                    <div style={{ width: `${Math.round(t.proba * 100)}%`, height: 8, background: i === 0 ? '#62BD19' : '#8fb8d6', borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11.5, color: '#8a97a0', width: 36, textAlign: 'right' }}>{Math.round(t.proba * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '1.2rem 1.4rem', borderRadius: 12, border: '1px solid #E3E8EB' }}>
            <div style={{ fontSize: 13, color: '#5A6B73', marginBottom: 6 }}>Performance mesurée (leave-one-out, 45 médicaments)</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.9 }}>
              Modèle NLP : <strong style={{ color: '#3d7a12' }}>{Math.round(res.accuracy_loo_modele * 100)} %</strong><br />
              Classe majoritaire : <strong>{Math.round(res.baseline_majoritaire * 100)} %</strong><br />
              Structure seule (§3.2.2) : <strong style={{ color: '#c0392b' }}>{Math.round(res.comparaison_structure_seule * 100)} %</strong>
            </div>
            <p style={{ fontSize: 11.5, color: '#8a97a0', marginTop: 10 }}>TF-IDF (n-grammes caractères 2–4 + mots 1–2) + régression logistique · scikit-learn · aucune fuite (vectorisation refaite à chaque pli).</p>
          </div>
        </div>
      )}
    </div>
  );
}
