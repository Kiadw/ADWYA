'use client';
import { useEffect, useState } from 'react';

type Pt = { dci: string; categorie: string; x: number; y: number; cluster: number };
type Data = { points: Pt[]; explained: number[]; k: number; diversite: { tanimoto_moyen: number; tanimoto_median: number }; paires_proches: { a: string; b: string; t: number }[] };
const CLUSTER_COLORS = ['#006BA6', '#62BD19', '#e67e22', '#8e44ad', '#16a085', '#c0392b', '#2980b9'];

export default function EspaceChimiquePage() {
  const [data, setData] = useState<Data | null>(null);
  const [hover, setHover] = useState<Pt | null>(null);

  useEffect(() => {
    fetch('/api/chemspace').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <div style={{ padding: '2rem', color: '#5A6B73' }}>Calcul de l'espace chimique…</div>;

  const xs = data.points.map(p => p.x), ys = data.points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const W = 640, H = 460, pad = 40;
  const sx = (x: number) => pad + (x - minX) / (maxX - minX) * (W - 2 * pad);
  const sy = (y: number) => H - pad - (y - minY) / (maxY - minY) * (H - 2 * pad);

  return (
    <div style={{ padding: '2rem', maxWidth: 1060 }}>
      <h1 style={{ fontSize: 26, color: '#1A2B33', margin: 0 }}>Cartographie de l'espace chimique</h1>
      <p style={{ color: '#5A6B73', marginTop: 6, maxWidth: 820 }}>
        Projection (analyse en composantes principales) des empreintes moléculaires de Morgan du portefeuille ADWYA :
        les molécules proches sur la carte sont chimiquement similaires. Les couleurs sont des <strong>familles structurales</strong>
        détectées automatiquement par <strong>clustering K-means</strong> (apprentissage non supervisé). Un portefeuille étalé = diversité ; des amas = redondance.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, marginTop: 16 }}>
        <div style={{ border: '1px solid #E3E8EB', borderRadius: 12, background: '#fff', position: 'relative' }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%">
            <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#ccc" />
            <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#ccc" />
            <text x={W / 2} y={H - 8} fontSize="11" fill="#8a97a0" textAnchor="middle">Composante 1 ({data.explained[0]} % de variance)</text>
            <text x={14} y={H / 2} fontSize="11" fill="#8a97a0" textAnchor="middle" transform={`rotate(-90 14 ${H / 2})`}>Composante 2 ({data.explained[1]} %)</text>
            {data.points.map((p, i) => (
              <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={hover?.dci === p.dci ? 9 : 6}
                fill={CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length]} fillOpacity={0.8} stroke="#fff" strokeWidth={1.2}
                onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }} />
            ))}
            {hover && (
              <g>
                <rect x={sx(hover.x) + 10} y={sy(hover.y) - 28} width={hover.dci.length * 7 + 16} height={22} rx={4} fill="#1A2B33" />
                <text x={sx(hover.x) + 18} y={sy(hover.y) - 13} fontSize="12" fill="#fff">{hover.dci}</text>
              </g>
            )}
          </svg>
        </div>

        <div>
          <h3 style={{ color: '#006BA6', marginTop: 0 }}>Diversité moléculaire</h3>
          <p style={{ fontSize: 14, color: '#1A2B33' }}>
            Similarité de Tanimoto moyenne du catalogue : <strong>{data.diversite.tanimoto_moyen}</strong>.
            Une valeur basse (proche de 0) traduit un portefeuille <strong>très diversifié</strong> chimiquement — c'est le cas ici.
          </p>
          <h3 style={{ color: '#006BA6' }}>Familles ({data.k} clusters)</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {Array.from({ length: data.k }, (_, c) => (
              <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: CLUSTER_COLORS[c % CLUSTER_COLORS.length] }} /> Famille {c + 1}
              </span>
            ))}
          </div>
          <h3 style={{ color: '#006BA6' }}>Paires les plus proches</h3>
          <ul style={{ fontSize: 13.5, color: '#5A6B73', paddingLeft: 18 }}>
            {data.paires_proches.slice(0, 3).map((p, i) => (
              <li key={i}><strong>{p.a}</strong> ↔ <strong>{p.b}</strong> (Tanimoto {p.t})</li>
            ))}
          </ul>
          <p style={{ fontSize: 11.5, color: '#8a97a0' }}>Empreintes Morgan ECFP4 · PCA + K-means (scikit-learn) · calcul local.</p>
        </div>
      </div>
    </div>
  );
}
