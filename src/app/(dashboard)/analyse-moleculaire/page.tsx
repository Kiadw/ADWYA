'use client';
import { useState } from 'react';

type Alert = { nom: string; note: string; atomes: number[]; occurrences: number };
type Res = {
  formule: string;
  descripteurs: { MW: number; LogP: number; TPSA: number; HBD: number; HBA: number; liaisons_rotatives: number; cycles: number };
  lipinski: { conforme: boolean; violations: string[] };
  alertes: Alert[];
  catalogues?: string[];
  source: string;
  error?: string;
};

const PRESETS = [
  { nom: 'Métronidazole', smiles: 'Cc1ncc([N+](=O)[O-])n1CCO' },
  { nom: 'Aspirine', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { nom: 'Atorvastatine', smiles: 'CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CC[C@@H](O)C[C@@H](O)CC(=O)O' },
  { nom: 'Acroléine', smiles: 'C=CC=O' },
];

export default function AnalyseMoleculairePage() {
  const [smiles, setSmiles] = useState('');
  const [res, setRes] = useState<Res | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (s: string) => {
    setLoading(true); setRes(null); setSmiles(s);
    try {
      const r = await fetch('/api/molprops', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smiles: s }) });
      setRes(await r.json());
    } catch { setRes({ error: 'Erreur réseau' } as Res); }
    setLoading(false);
  };

  const D = res?.descripteurs;
  const desc = D && [
    ['Masse molaire', `${D.MW} g/mol`], ['LogP (Crippen)', D.LogP], ['TPSA', `${D.TPSA} Å²`],
    ['Donneurs H', D.HBD], ['Accepteurs H', D.HBA], ['Liaisons rotatives', D.liaisons_rotatives], ['Cycles', D.cycles],
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: 1000 }}>
      <h1 style={{ fontSize: 26, color: '#1A2B33', margin: 0 }}>Analyse moléculaire</h1>
      <p style={{ color: '#5A6B73', marginTop: 6 }}>
        Descripteurs physico-chimiques et <strong>alertes structurales par motifs SMARTS</strong>,
        calculés localement par <strong>RDKit</strong> — valeurs reproductibles et auditables (aucune boîte noire).
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '1.2rem 0' }}>
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
          {loading ? 'Calcul…' : 'Analyser'}
        </button>
      </div>

      {res?.error && <p style={{ color: '#c0392b' }}>{res.error}</p>}

      {res && !res.error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <h3 style={{ color: '#006BA6', marginTop: 0 }}>Descripteurs — {res.formule}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <tbody>
                {desc!.map(([k, v], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E3E8EB' }}>
                    <td style={{ padding: '9px 6px', color: '#5A6B73' }}>{k}</td>
                    <td style={{ padding: '9px 6px', fontWeight: 700, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: res.lipinski.conforme ? '#EFF8E6' : '#FDECEA', border: `1px solid ${res.lipinski.conforme ? '#62BD19' : '#c0392b'}` }}>
              <strong style={{ color: res.lipinski.conforme ? '#3d7a12' : '#c0392b' }}>
                Règle de Lipinski : {res.lipinski.conforme ? 'conforme ✓' : 'non conforme'}
              </strong>
              {res.lipinski.violations.length > 0 && <div style={{ fontSize: 13, color: '#5A6B73' }}>Violations : {res.lipinski.violations.join(', ')}</div>}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#006BA6', marginTop: 0 }}>Alertes structurales (SMARTS)</h3>
            {res.alertes.length === 0 && (
              <div style={{ padding: '12px 16px', borderRadius: 8, background: '#EFF8E6', color: '#3d7a12' }}>Aucun motif réactif détecté ✓</div>
            )}
            {res.alertes.map((a, i) => (
              <div key={i} style={{ padding: '10px 14px', borderRadius: 8, background: '#FDECEA', borderLeft: '4px solid #c0392b', marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: '#c0392b' }}>{a.nom}</div>
                <div style={{ fontSize: 13, color: '#5A6B73' }}>{a.note}</div>
                <div style={{ fontSize: 12, color: '#8a97a0', marginTop: 4 }}>Atomes concernés : {a.atomes.join(', ')} · {a.occurrences} occurrence(s)</div>
              </div>
            ))}
            {res.catalogues && res.catalogues.length > 0 && (
              <div style={{ marginTop: 10, padding: '9px 12px', borderRadius: 8, background: '#FEF6E7', borderLeft: '4px solid #e0a800' }}>
                <div style={{ fontWeight: 700, color: '#8a6d00', fontSize: 13 }}>Catalogues de liabilité (PAINS / Brenk)</div>
                <div style={{ fontSize: 12.5, color: '#5A6B73', marginTop: 3 }}>{res.catalogues.join(' · ')}</div>
              </div>
            )}
            <p style={{ fontSize: 11.5, color: '#8a97a0', marginTop: 10 }}>{res.source} — alertes maison complétées par les filtres validés PAINS et Brenk de RDKit.</p>
          </div>
        </div>
      )}
    </div>
  );
}
