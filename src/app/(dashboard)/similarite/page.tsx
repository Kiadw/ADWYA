'use client';
import { useState } from 'react';

type Hit = { dci: string; categorie: string; classe: string; tanimoto: number };

const PRESETS: { nom: string; smiles: string }[] = [
  { nom: 'Aspirine', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { nom: 'Candésartan', smiles: 'CCOc1nc2cccc(C(=O)O)c2n1Cc1ccc(-c2ccccc2-c2nnn[nH]2)cc1' },
  { nom: 'Rosuvastatine', smiles: 'CC(C)c1nc(N(C)S(C)(=O)=O)nc(-c2ccc(F)cc2)c1/C=C/[C@@H](O)C[C@@H](O)CC(=O)O' },
  { nom: 'Oméprazole', smiles: 'COc1ccc2[nH]c(S(=O)Cc3ncc(C)c(OC)c3C)nc2c1' },
  { nom: 'Ibuprofène', smiles: 'CC(C)Cc1ccc(C(C)C(=O)O)cc1' },
];

const COLORS: Record<string, string> = {
  Cardiologie: '#006BA6', Antalgiques: '#62BD19', 'Anti-infectieux': '#0069A7',
  Gastroenterologie: '#8e44ad', Neuropsychiatrie: '#e67e22', Diabetologie: '#16a085',
  Allergologie: '#c0392b', Dermatologie: '#d35400', Urologie: '#2980b9',
  Endocrinologie: '#27ae60', Pneumologie: '#7f8c8d', Rhumatologie: '#a04000',
};

export default function SimilaritePage() {
  const [smiles, setSmiles] = useState('');
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = async (s: string) => {
    setLoading(true); setErr(''); setHits(null); setSmiles(s);
    try {
      const r = await fetch('/api/similarity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smiles: s }) });
      const d = await r.json();
      if (d.error) setErr(d.error); else setHits(d.top);
    } catch { setErr('Erreur réseau'); }
    setLoading(false);
  };

  const inferred = hits && hits.length ? hits[0].categorie : null;

  return (
    <div style={{ padding: '2rem', maxWidth: 1000 }}>
      <h1 style={{ fontSize: 26, color: '#1A2B33', margin: 0 }}>Similarité structurale</h1>
      <p style={{ color: '#5A6B73', marginTop: 6 }}>
        Classification fondée sur la <strong>molécule</strong> : empreintes de Morgan (ECFP4, 2048 bits) et indice de Tanimoto,
        calculés avec RDKit contre le catalogue ADWYA. Chaque décision est justifiée par le voisin le plus proche.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '1.2rem 0' }}>
        {PRESETS.map(p => (
          <button key={p.nom} onClick={() => run(p.smiles)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #62BD19', background: '#EFF8E6', color: '#1A2B33', cursor: 'pointer', fontWeight: 600 }}>
            {p.nom}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input value={smiles} onChange={e => setSmiles(e.target.value)} placeholder="Coller un SMILES (ex : CC(=O)OC1=CC=CC=C1C(=O)O)"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #E3E8EB', fontFamily: 'monospace' }} />
        <button onClick={() => smiles && run(smiles)} disabled={loading}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg,#006BA6,#62BD19)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Calcul…' : 'Rechercher'}
        </button>
      </div>

      {err && <p style={{ color: '#c0392b' }}>{err}</p>}

      {inferred && (
        <div style={{ padding: '10px 16px', borderRadius: 8, background: '#E8F2F8', marginBottom: 16, fontSize: 15 }}>
          Classe thérapeutique inférée (plus proche voisin) : <strong style={{ color: COLORS[inferred] || '#006BA6' }}>{inferred}</strong>
          {hits && <span style={{ color: '#5A6B73' }}> — via {hits[0].dci}, Tanimoto {hits[0].tanimoto}</span>}
        </div>
      )}

      {hits && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#F7F9FA', textAlign: 'left' }}>
              <th style={{ padding: 10 }}>Rang</th><th style={{ padding: 10 }}>Voisin structural (catalogue)</th>
              <th style={{ padding: 10 }}>Classe</th><th style={{ padding: 10, width: 320 }}>Indice de Tanimoto</th>
            </tr>
          </thead>
          <tbody>
            {hits.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #E3E8EB' }}>
                <td style={{ padding: 10, color: '#5A6B73' }}>{i + 1}</td>
                <td style={{ padding: 10, fontWeight: 600 }}>{h.dci}</td>
                <td style={{ padding: 10 }}>
                  <span style={{ padding: '2px 10px', borderRadius: 12, background: (COLORS[h.categorie] || '#888') + '22', color: COLORS[h.categorie] || '#555', fontSize: 12.5, fontWeight: 600 }}>{h.categorie}</span>
                </td>
                <td style={{ padding: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 10, background: '#EEF2F4', borderRadius: 6 }}>
                      <div style={{ width: `${Math.round(h.tanimoto * 100)}%`, height: 10, background: 'linear-gradient(90deg,#006BA6,#62BD19)', borderRadius: 6 }} />
                    </div>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{h.tanimoto.toFixed(3)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
