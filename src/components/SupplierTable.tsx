'use client';
import React from 'react';

interface Supplier {
  name: string;
  country: string;
  availability: string;
  price_usd_per_kg?: number;
  lead_time_days?: number;
  source: string;
}

const statusStyle: Record<string, { bg: string; color: string }> = {
  'In Stock': { bg: 'rgba(16,185,129,.1)', color: '#10b981' },
  'Limited': { bg: 'rgba(245,158,11,.1)', color: '#f59e0b' },
  'Out of Stock': { bg: 'rgba(239,68,68,.1)', color: '#ef4444' },
  'Lead Time': { bg: 'rgba(99,102,241,.1)', color: '#6366f1' }
};

export default function SupplierTable({ suppliers, loading }: { suppliers: Supplier[]; loading: boolean }) {
  if (loading) {
    return <div style={{ padding: 'var(--space-lg)', color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Recherche des fournisseurs…</div>;
  }
  if (suppliers.length === 0) {
    return <div style={{ padding: 'var(--space-lg)', color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>Aucun fournisseur trouvé pour cette molécule.</div>;
  }

  return (
    <div style={{ overflow: 'auto', maxHeight: 300 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <th style={thStyle}>Fournisseur</th>
            <th style={thStyle}>Pays</th>
            <th style={thStyle}>Disponibilité</th>
            <th style={thStyle}>Source</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, i) => {
            const st = statusStyle[s.availability] || { bg: 'transparent', color: 'var(--text-secondary)' };
            return (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-secondary, rgba(0,0,0,.05))' }}>
                <td style={tdStyle}><strong>{s.name}</strong></td>
                <td style={tdStyle}>{s.country}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>
                    {s.availability}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: 'var(--text-tertiary)', fontSize: 11 }}>{s.source}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' };
const tdStyle: React.CSSProperties = { padding: '8px 10px', color: 'var(--text-primary)' };
