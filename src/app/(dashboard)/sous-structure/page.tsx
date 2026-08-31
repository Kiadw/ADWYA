'use client';
import { useState } from 'react';

type Hit = { dci: string; categorie: string; occurrences: number; atomes: number[] };
const PRESETS = [
  { nom: 'Tétrazole (sartans)', smarts: 'c1nnn[nH]1' },
  { nom: 'β-lactame', smarts: 'O=C1CCN1' },
  { nom: 'Acide carboxylique', smarts: 'C(=O)[OH]' },
  { nom: 'Sulfonamide', smarts: 'S(=O)(=O)N' },
  { nom: 'Amine primaire', smarts: '[NX3;H2]' },
];
const COLORS: Record<string, string> = {
  Cardiologie: '#006BA6', Antalgiques: '#62BD19', 'Anti-infectieux': '#0069A7', Gastroenterologie: '#8e44ad',
  Neuropsychiatrie: '#e67e22', Diabetologie: '#16a085', Allergologie: '#c0392b', Dermatologie: '#d35400',
  Urologie: '#2980b9', Endocrinologie: '#27ae60', Pneumologie: '#7f8c8d', Rhumatologie: '#a04000',
};

export default function SousStructurePage() {
  const [smarts, setSmarts] = useState('');
  const [res, setRes] = useState<{ n: number; hits: Hit[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = async (s: string) => {
    setLoading(true); setErr(''); setRes(null); setSmarts(s);
    try {
      const r = await fetch('/api/substructure', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smarts: s }) });
      const d = await r.json();
      if (d.error) setErr(d.error); else setRes(d);
    } catch { setErr('Erreur réseau'); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 950 }}>
      <h1 style={{ fontSize: 26, color: '#1A2B33', margin: 0 }}>Recherche de sous-structure</h1>
      <p style={{ color: '#5A6B73', marginTop: 6 }}>
        Recherche par motif <strong>SMARTS</strong> dans le catalogue : identifie tous les composés contenant un
        squelette chimique donné, avec les atomes concernés. Appariement de graphe réel via <strong>RDKit</strong>.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '1.2rem 0' }}>
        {PRESETS.map(p => (
          <button key={p.nom} onClick={() => run(p.smarts)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #62BD19', background: '#EFF8E6', color: '#1A2B33', cursor: 'pointer', fontWeight: 600 }}>{p.nom}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input value={smarts} onChange={e => setSmarts(e.target.value)} placeholder="Motif SMARTS (ex : c1nnn[nH]1)"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #E3E8EB', fontFamily: 'monospace' }} />
        <button onClick={() => smarts && run(smarts)} disabled={loading}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg,#006BA6,#62BD19)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Recherche…' : 'Rechercher'}
        </button>
      </div>
      {err && <p style={{ color: '#c0392b' }}>{err}</p>}
      {res && (
        <>
          <p style={{ color: '#5A6B73' }}><strong style={{ color: '#006BA6' }}>{res.n}</strong> composé(s) du catalogue contiennent ce motif.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ background: '#F7F9FA', textAlign: 'left' }}>
              <th style={{ padding: 10 }}>Composé</th><th style={{ padding: 10 }}>Classe</th>
              <th style={{ padding: 10 }}>Occurrences</th><th style={{ padding: 10 }}>Atomes concernés</th>
            </tr></thead>
            <tbody>
              {res.hits.map((h, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E3E8EB' }}>
                  <td style={{ padding: 10, fontWeight: 600 }}>{h.dci}</td>
                  <td style={{ padding: 10 }}><span style={{ padding: '2px 10px', borderRadius: 12, background: (COLORS[h.categorie] || '#888') + '22', color: COLORS[h.categorie] || '#555', fontSize: 12.5, fontWeight: 600 }}>{h.categorie}</span></td>
                  <td style={{ padding: 10 }}>{h.occurrences}</td>
                  <td style={{ padding: 10, fontFamily: 'monospace', color: '#5A6B73' }}>{h.atomes.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
