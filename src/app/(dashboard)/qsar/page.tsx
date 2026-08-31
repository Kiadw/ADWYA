'use client';
import { useState } from 'react';

type Res = { logS: number; incertitude: number; mg_par_L: number; classe: string; domaine_applicabilite: number; fiable: boolean; formule: string; error?: string };
const PRESETS = [
  { nom: 'Ibuprofène', smiles: 'CC(C)Cc1ccc(C(C)C(=O)O)cc1' },
  { nom: 'Métronidazole', smiles: 'Cc1ncc([N+](=O)[O-])n1CCO' },
  { nom: 'Atorvastatine', smiles: 'CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CC[C@@H](O)C[C@@H](O)CC(=O)O' },
  { nom: 'Paracétamol', smiles: 'CC(=O)Nc1ccc(O)cc1' },
];
const classeColor = (c: string) => c.startsWith('Très sol') ? '#16a085' : c === 'Soluble' ? '#62BD19' : c === 'Peu soluble' ? '#e67e22' : '#c0392b';

export default function QsarPage() {
  const [smiles, setSmiles] = useState('');
  const [res, setRes] = useState<Res | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (s: string) => {
    setLoading(true); setRes(null); setSmiles(s);
    try {
      const r = await fetch('/api/qsar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smiles: s }) });
      setRes(await r.json());
    } catch { setRes({ error: 'Erreur réseau' } as Res); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1040 }}>
      <h1 style={{ fontSize: 26, color: '#1A2B33', margin: 0 }}>Prédiction de solubilité (QSAR appris)</h1>
      <p style={{ color: '#5A6B73', marginTop: 6 }}>
        Modèle d'apprentissage (forêt aléatoire) entraîné sur <strong>1 128 molécules</strong> (jeu ESOL) à partir de descripteurs RDKit
        et d'empreintes de Morgan, pour prédire la <strong>solubilité aqueuse</strong> (logS) — propriété clé pour la formulation et la biodisponibilité.
      </p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', margin: '1rem 0 1.4rem' }}>
        {[['R² (test)', '0,69'], ['RMSE', '1,05 log'], ['Jeu', '1 128 mol.'], ['Validation', 'split par squelette']].map(([k, v], i) => (
          <div key={i} style={{ flex: 1, padding: '12px 14px', borderRadius: 10, background: '#E8F2F8', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#006BA6' }}>{v}</div>
            <div style={{ fontSize: 12, color: '#5A6B73' }}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {PRESETS.map(p => (
          <button key={p.nom} onClick={() => run(p.smiles)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #62BD19', background: '#EFF8E6', color: '#1A2B33', cursor: 'pointer', fontWeight: 600 }}>{p.nom}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input value={smiles} onChange={e => setSmiles(e.target.value)} placeholder="Coller un SMILES"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #E3E8EB', fontFamily: 'monospace' }} />
        <button onClick={() => smiles && run(smiles)} disabled={loading}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg,#006BA6,#62BD19)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Calcul…' : 'Prédire'}
        </button>
      </div>

      {res?.error && <p style={{ color: '#c0392b' }}>{res.error}</p>}
      {res && !res.error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ padding: '1.2rem 1.4rem', borderRadius: 12, border: '1px solid #E3E8EB' }}>
            <div style={{ fontSize: 13, color: '#5A6B73' }}>Solubilité prédite ({res.formule})</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: classeColor(res.classe), lineHeight: 1.1, marginTop: 4 }}>{res.classe}</div>
            <div style={{ fontSize: 15, color: '#1A2B33', marginTop: 6 }}>logS = <strong>{res.logS}</strong> ± {res.incertitude} &nbsp;·&nbsp; ≈ <strong>{res.mg_par_L} mg/L</strong></div>
          </div>
          <div style={{ padding: '1.2rem 1.4rem', borderRadius: 12, border: '1px solid #E3E8EB' }}>
            <div style={{ fontSize: 13, color: '#5A6B73', marginBottom: 6 }}>Domaine d'applicabilité</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 12, background: '#EEF2F4', borderRadius: 6 }}>
                <div style={{ width: `${Math.round(res.domaine_applicabilite * 100)}%`, height: 12, background: res.fiable ? '#62BD19' : '#e67e22', borderRadius: 6 }} />
              </div>
              <span style={{ fontWeight: 700 }}>{res.domaine_applicabilite}</span>
            </div>
            <div style={{ fontSize: 12.5, color: res.fiable ? '#3d7a12' : '#b45309', marginTop: 8 }}>
              {res.fiable ? 'Molécule proche du domaine d\'entraînement — prédiction fiable.' : 'Molécule éloignée du domaine d\'entraînement — prédiction à prendre avec prudence.'}
            </div>
            <p style={{ fontSize: 11.5, color: '#8a97a0', marginTop: 10 }}>Similarité de Tanimoto au plus proche voisin du jeu d'entraînement.</p>
          </div>
        </div>
      )}
    </div>
  );
}
