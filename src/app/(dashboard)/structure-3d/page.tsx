'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

type Props = { formule: string; descripteurs: any; lipinski: any } | null;

const MEDS = [
  { nom: 'Atorvastatine', marque: 'ADWASTIN', smiles: 'CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CC[C@@H](O)C[C@@H](O)CC(=O)O' },
  { nom: 'Amoxicilline', marque: 'ADWAMOX', smiles: 'CC1(C)SC2C(NC(=O)C(N)c3ccc(O)cc3)C(=O)N2C1C(=O)O' },
  { nom: 'Losartan', marque: 'ZARTAN', smiles: 'CCCCc1nc(Cl)c(CO)n1Cc1ccc(-c2ccccc2-c2nnn[nH]2)cc1' },
  { nom: 'Oméprazole', marque: 'ADWAZOL', smiles: 'COc1ccc2[nH]c(S(=O)Cc3ncc(C)c(OC)c3C)nc2c1' },
  { nom: 'Ibuprofène', marque: 'ADWALGIC', smiles: 'CC(C)Cc1ccc(C(C)C(=O)O)cc1' },
];

export default function Structure3DPage() {
  const viewerHost = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const $3DmolRef = useRef<any>(null);
  const [sel, setSel] = useState(MEDS[0]);
  const [props, setProps] = useState<Props>(null);
  const [style, setStyle] = useState<'ball' | 'stick' | 'sphere'>('ball');
  const [loading, setLoading] = useState(false);

  // init 3Dmol once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod: any = await import('3dmol');
      const $3Dmol = mod.default ?? mod;
      if (cancelled || !viewerHost.current) return;
      $3DmolRef.current = $3Dmol;
      viewerRef.current = $3Dmol.createViewer(viewerHost.current, { backgroundColor: '#0f1720' });
      load(sel, style);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyStyle = (v: any, s: string) => {
    v.setStyle({}, {});
    if (s === 'ball') v.setStyle({}, { stick: { radius: 0.14 }, sphere: { scale: 0.28 } });
    else if (s === 'stick') v.setStyle({}, { stick: { radius: 0.2 } });
    else v.setStyle({}, { sphere: { scale: 0.4 } });
  };

  const load = useCallback(async (med: typeof MEDS[0], s: string) => {
    const v = viewerRef.current; if (!v) return;
    setLoading(true);
    try {
      const [r3d, rp] = await Promise.all([
        fetch('/api/mol3d', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smiles: med.smiles }) }).then(r => r.json()),
        fetch('/api/molprops', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smiles: med.smiles }) }).then(r => r.json()),
      ]);
      if (r3d.molblock) {
        v.removeAllModels();
        v.addModel(r3d.molblock, 'sdf');
        applyStyle(v, s);
        v.zoomTo();
        v.render();
        v.spin('y', 0.6);
      }
      if (!rp.error) setProps(rp);
    } catch { /* noop */ }
    setLoading(false);
  }, []);

  const onSelect = (m: typeof MEDS[0]) => { setSel(m); load(m, style); };
  const onStyle = (s: 'ball' | 'stick' | 'sphere') => { setStyle(s); const v = viewerRef.current; if (v) { applyStyle(v, s); v.render(); } };

  const D = props?.descripteurs;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: 26, color: '#1A2B33', margin: 0 }}>Structure moléculaire 3D</h1>
      <p style={{ color: '#5A6B73', marginTop: 6, maxWidth: 820 }}>
        Visualisation tridimensionnelle interactive de la molécule d'un médicament. Les coordonnées sont
        générées par <strong>RDKit</strong> (algorithme de plongement ETKDG puis optimisation du champ de forces MMFF94),
        rendues avec <strong>3Dmol.js</strong>. Faites tourner, zoomez, changez de représentation.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '1.2rem 0' }}>
        {MEDS.map(m => (
          <button key={m.nom} onClick={() => onSelect(m)}
            style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
              border: `1px solid ${sel.nom === m.nom ? '#006BA6' : '#62BD19'}`,
              background: sel.nom === m.nom ? '#006BA6' : '#EFF8E6', color: sel.nom === m.nom ? '#fff' : '#1A2B33' }}>
            {m.nom} <span style={{ opacity: .7, fontWeight: 400 }}>· {m.marque}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div style={{ position: 'relative' }}>
          <div ref={viewerHost} style={{ width: '100%', height: 480, borderRadius: 12, overflow: 'hidden', position: 'relative', border: '1px solid #E3E8EB' }} />
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
            {(['ball', 'stick', 'sphere'] as const).map(s => (
              <button key={s} onClick={() => onStyle(s)}
                style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: style === s ? '#62BD19' : 'rgba(255,255,255,.85)', color: style === s ? '#fff' : '#1A2B33' }}>
                {s === 'ball' ? 'Boules-bâtons' : s === 'stick' ? 'Bâtons' : 'Sphères (VdW)'}
              </button>
            ))}
          </div>
          {loading && <div style={{ position: 'absolute', bottom: 12, right: 14, color: '#fff', fontSize: 13 }}>Génération 3D…</div>}
        </div>

        <div>
          <h3 style={{ color: '#006BA6', marginTop: 0 }}>{sel.nom} <span style={{ fontSize: 13, color: '#5A6B73', fontWeight: 400 }}>({sel.marque})</span></h3>
          {D ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <tbody>
                {[
                  ['Formule brute', props?.formule],
                  ['Masse molaire', `${D.MW} g/mol`],
                  ['LogP (Crippen)', D.LogP],
                  ['TPSA', `${D.TPSA} Å²`],
                  ['Donneurs / Accepteurs H', `${D.HBD} / ${D.HBA}`],
                  ['Liaisons rotatives', D.liaisons_rotatives],
                  ['Cycles', D.cycles],
                ].map(([k, v], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E3E8EB' }}>
                    <td style={{ padding: '9px 6px', color: '#5A6B73' }}>{k}</td>
                    <td style={{ padding: '9px 6px', fontWeight: 700, textAlign: 'right' }}>{v as any}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ color: '#5A6B73' }}>Chargement des propriétés…</p>}
          {props?.lipinski && (
            <div style={{ marginTop: 12, padding: '9px 14px', borderRadius: 8, background: props.lipinski.conforme ? '#EFF8E6' : '#FDECEA', color: props.lipinski.conforme ? '#3d7a12' : '#c0392b', fontWeight: 700, fontSize: 14 }}>
              Règle de Lipinski : {props.lipinski.conforme ? 'conforme ✓' : 'non conforme'}
            </div>
          )}
          <p style={{ fontSize: 11.5, color: '#8a97a0', marginTop: 12 }}>Géométrie : RDKit ETKDG + MMFF94 · Rendu : 3Dmol.js</p>
        </div>
      </div>
    </div>
  );
}
