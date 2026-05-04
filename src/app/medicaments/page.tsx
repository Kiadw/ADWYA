'use client';

import React, { useState, useRef } from 'react';
import { Download, Upload, Search, Filter, Pill, ChevronDown, ChevronUp } from 'lucide-react';
import { ADWYA_MEDICATIONS, getCategories, exportCSV, importCSV, type Medication } from '@/lib/medications';

export default function MedicamentsPage() {
  const [medications, setMedications] = useState<Medication[]>(ADWYA_MEDICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Medication>('nom_commercial');
  const [sortAsc, setSortAsc] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = getCategories();

  // Filter
  const filtered = medications.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || m.nom_commercial.toLowerCase().includes(q) || m.dci.toLowerCase().includes(q) || m.classe_therapeutique.toLowerCase().includes(q);
    const matchesCat = !selectedCategory || m.categorie === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const va = (a[sortField] || '').toString().toLowerCase();
    const vb = (b[sortField] || '').toString().toLowerCase();
    return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const handleSort = (field: keyof Medication) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const handleExport = () => {
    const csv = exportCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adwya_medicaments_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const csv = ev.target?.result as string;
      const imported = importCSV(csv);
      if (imported.length > 0) {
        setMedications(prev => [...prev, ...imported]);
        alert(`${imported.length} medicaments importes avec succes.`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const SortIcon = ({ field }: { field: keyof Medication }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div style={{ padding: 'var(--space-lg)', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-xl)', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>
            Medicaments ADWYA
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 'var(--font-sm)' }}>
            {filtered.length} produits sur {medications.length} . {categories.length} categories therapeutiques
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Exporter CSV
          </button>
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Upload size={14} /> Importer CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImport} style={{ display: 'none' }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Rechercher par nom, DCI, ou classe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px', border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', background: 'var(--bg-primary)',
              color: 'var(--text-primary)', outline: 'none'
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Filter size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 12px 10px 36px', border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', background: 'var(--bg-primary)',
              color: 'var(--text-primary)', outline: 'none', minWidth: 200
            }}
          >
            <option value="">Toutes les categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Category badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--space-lg)' }}>
        {categories.map(cat => {
          const count = medications.filter(m => m.categorie === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isActive ? '' : cat)}
              style={{
                padding: '4px 12px', borderRadius: 20, border: `1px solid ${isActive ? 'var(--accent-primary, #6366f1)' : 'var(--border-primary)'}`,
                background: isActive ? 'rgba(99,102,241,.1)' : 'transparent', color: isActive ? 'var(--accent-primary, #6366f1)' : 'var(--text-secondary)',
                fontSize: 12, cursor: 'pointer', fontWeight: isActive ? 600 : 400, transition: 'all .2s'
              }}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', overscrollBehavior: 'contain' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {[
                  { key: 'nom_commercial', label: 'Nom Commercial' },
                  { key: 'dci', label: 'DCI' },
                  { key: 'dosage', label: 'Dosage' },
                  { key: 'forme', label: 'Forme' },
                  { key: 'categorie', label: 'Categorie' },
                  { key: 'statut', label: 'Statut' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key as keyof Medication)}
                    style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {col.label} <SortIcon field={col.key as keyof Medication} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(med => (
                <React.Fragment key={med.id}>
                  <tr
                    onClick={() => setExpandedRow(expandedRow === med.id ? null : med.id)}
                    style={{ borderBottom: '1px solid var(--border-secondary, rgba(0,0,0,.04))', cursor: 'pointer', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={tdStyle}><strong style={{ color: 'var(--text-primary)' }}>{med.nom_commercial}</strong></td>
                    <td style={tdStyle}>{med.dci}</td>
                    <td style={tdStyle}>{med.dosage}</td>
                    <td style={{ ...tdStyle, fontSize: 12 }}>{med.forme}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: 'rgba(99,102,241,.08)', color: '#6366f1' }}>
                        {med.categorie}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                        background: med.statut === 'Commercialise' ? 'rgba(16,185,129,.1)' : 'rgba(245,158,11,.1)',
                        color: med.statut === 'Commercialise' ? '#10b981' : '#f59e0b'
                      }}>
                        {med.statut}
                      </span>
                    </td>
                  </tr>
                  {expandedRow === med.id && (
                    <tr>
                      <td colSpan={6} style={{ padding: '12px 14px', background: 'rgba(0,0,0,.01)', borderBottom: '1px solid var(--border-primary)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', fontSize: 'var(--font-xs)' }}>
                          <div><span style={{ color: 'var(--text-tertiary)' }}>Classe: </span><strong>{med.classe_therapeutique}</strong></div>
                          <div><span style={{ color: 'var(--text-tertiary)' }}>Conditionnement: </span><strong>{med.conditionnement}</strong></div>
                          <div><span style={{ color: 'var(--text-tertiary)' }}>AMM: </span><strong>{med.amm}</strong></div>
                          {med.smiles && <div style={{ gridColumn: 'span 3' }}><span style={{ color: 'var(--text-tertiary)' }}>SMILES: </span><code style={{ fontSize: 10, fontFamily: 'monospace', color: '#6366f1' }}>{med.smiles}</code></div>}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const tdStyle: React.CSSProperties = { padding: '10px 14px', color: 'var(--text-primary)' };
