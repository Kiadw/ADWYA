'use client';
import { useState } from 'react';

type Res = {
  logS: number; formule: string; n_atomes: number;
  r2_test: number; rmse_test: number; r2_randomforest_meme_split: number; error?: string;
};
const PRESETS = [
  { nom: 'Ibuprofène', smiles: 'CC(C)Cc1ccc(C(C)C(=O)O)cc1' },
  { nom: 'Métronidazole', smiles: 'Cc1ncc([N+](=O)[O-])n1CCO' },
  { nom: 'Atorvastatine', smiles: 'CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CC[C@@H](O)C[C@@H](O)CC(=O)O' },
  { nom: 'Paracétamol', smiles: 'CC(=O)Nc1ccc(O)cc1' },
];

export default function GnnSolubilitePage() {
  const [smiles, setSmiles] = useState('');
  const [res, setRes] = useState<Res | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (s: string) => {
    setLoading(true); setRes(null); setSmiles(s);
    try {
      const r = await fetch('/api/gnn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smiles: s }) });
      setRes(await r.json());
    } catch { setRes({ error: 'Erreur réseau' } as Res); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1040 }}>
      <h1 style={{ fontSize: 26, color: '#1A2B33', margin: 0 }}>Solubilité — réseau de neurones sur graphes</h1>
      <p style={{ color: '#5A6B73', marginTop: 6 }}>
        Second modèle de solubilité : au lieu de descripteurs pré-calculés (page « QSAR »), la molécule est représentée
        comme un <strong>graphe</strong> (atomes = nœuds, liaisons = arêtes) et l'apprentissage se fait par
        <strong> message passing</strong> — 3 couches de convolution de graphe entraînées de bout en bout par descente
        de gradient (PyTorch), sur le même jeu ESOL (1 128 molécules) et le <strong>même découpage par squelette</strong>
        que le modèle RandomForest, pour une comparaison strictement honnête.
      </p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', margin: '1rem 0 1.4rem' }}>
        {[['R² GNN (test)', '0,72'], ['R² RandomForest', '0,69'], ['RMSE GNN', '1,01 log'], ['Mêmes 53 molécules test', 'comparaison directe']].map(([k, v], i) => (
          <div key={i} style={{ flex: 1, padding: '12px 14px', borderRadius: 10, background: '#E8F2F8', textAlign: 'center' }}>
            <div style={{ fontSize: i < 3 ? 20 : 13, fontWeight: 800, color: '#006BA6' }}>{v}</div>
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
          {loading ? 'Message passing…' : 'Prédire'}
        </button>
      </div>

      {res?.error && <p style={{ color: '#c0392b' }}>{res.error}</p>}
      {res && !res.error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ padding: '1.2rem 1.4rem', borderRadius: 12, border: '1px solid #E3E8EB' }}>
            <div style={{ fontSize: 13, color: '#5A6B73' }}>Solubilité prédite par le GNN ({res.formule})</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: '#006BA6', lineHeight: 1.1, marginTop: 4 }}>logS = {res.logS}</div>
            <div style={{ fontSize: 13, color: '#8a97a0', marginTop: 6 }}>{res.n_atomes} atomes lourds dans le graphe</div>
          </div>
          <div style={{ padding: '1.2rem 1.4rem', borderRadius: 12, border: '1px solid #E3E8EB' }}>
            <div style={{ fontSize: 13, color: '#5A6B73', marginBottom: 6 }}>Performance mesurée du modèle (jeu de test)</div>
            <div style={{ fontSize: 13.5 }}>R² = <strong style={{ color: '#006BA6' }}>{res.r2_test}</strong> · RMSE = <strong>{res.rmse_test}</strong> log</div>
            <div style={{ fontSize: 12.5, color: '#5A6B73', marginTop: 8 }}>
              vs RandomForest sur les mêmes molécules de test : R² = {res.r2_randomforest_meme_split}
            </div>
            <p style={{ fontSize: 11.5, color: '#8a97a0', marginTop: 10 }}>Convolution de graphe (3 couches, résiduelles) + readout par moyenne masquée · implémentation directe PyTorch, sans bibliothèque de GNN externe.</p>
          </div>
        </div>
      )}
    </div>
  );
}
